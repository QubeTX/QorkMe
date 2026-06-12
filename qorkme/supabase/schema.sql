-- QorkMe URL Shortener Database Schema
-- Optimized for 200,000+ URLs with fast lookups

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For fuzzy text search

-- Main URLs table
CREATE TABLE IF NOT EXISTS urls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  short_code VARCHAR(50) NOT NULL,
  short_code_lower VARCHAR(50) GENERATED ALWAYS AS (LOWER(short_code)) STORED,
  long_url TEXT NOT NULL,
  custom_alias BOOLEAN DEFAULT false,

  -- Metadata
  title TEXT,
  description TEXT,
  favicon_url TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  last_accessed_at TIMESTAMPTZ,

  -- Status
  is_active BOOLEAN DEFAULT true,
  click_count INTEGER DEFAULT 0,

  -- User tracking (optional; SET NULL so auth-user deletion degrades to anonymous)
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,

  -- Constraints
  CONSTRAINT unique_short_code_lower UNIQUE (short_code_lower),
  CONSTRAINT check_short_code_length CHECK (LENGTH(short_code) >= 3 AND LENGTH(short_code) <= 50)
);

-- Indexes for performance at scale
CREATE INDEX IF NOT EXISTS idx_short_code_lower ON urls(short_code_lower);
CREATE INDEX IF NOT EXISTS idx_user_id ON urls(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_created_at ON urls(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_click_count ON urls(click_count DESC);
CREATE INDEX IF NOT EXISTS idx_active_urls ON urls(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_long_url_hash ON urls(MD5(long_url)); -- For duplicate detection

-- Analytics table with partitioning support
CREATE TABLE IF NOT EXISTS clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url_id UUID REFERENCES urls(id) ON DELETE CASCADE,
  clicked_at TIMESTAMPTZ DEFAULT NOW(),

  -- Analytics data (privacy-conscious)
  ip_hash VARCHAR(64), -- Hashed for privacy
  country VARCHAR(2),
  city VARCHAR(100),
  region VARCHAR(100),

  -- Device info
  device_type VARCHAR(20),
  browser VARCHAR(50),
  os VARCHAR(50),

  -- Traffic source
  referrer TEXT,
  utm_source VARCHAR(100),
  utm_medium VARCHAR(100),
  utm_campaign VARCHAR(100)
);

-- Indexes for analytics
CREATE INDEX IF NOT EXISTS idx_clicks_url_id ON clicks(url_id);
CREATE INDEX IF NOT EXISTS idx_clicks_clicked_at ON clicks(clicked_at DESC);
CREATE INDEX IF NOT EXISTS idx_clicks_url_date ON clicks(url_id, clicked_at DESC);

-- Reserved words table
CREATE TABLE IF NOT EXISTS reserved_words (
  word VARCHAR(50) PRIMARY KEY
);

-- Insert reserved words (canonical list lives in lib/shortcode/reserved.ts —
-- keep both in lockstep)
INSERT INTO reserved_words (word) VALUES
  ('api'), ('app'), ('admin'), ('auth'), ('callback'), ('dashboard'),
  ('login'), ('logout'), ('register'), ('signup'), ('signin'),
  ('about'), ('contact'), ('help'), ('support'), ('terms'), ('privacy'),
  ('policy'), ('settings'), ('profile'), ('account'), ('home'),
  ('result'), ('results'), ('analytics'), ('stats'), ('statistics'),
  ('qr'), ('qrcode'), ('export'), ('import'), ('bulk'), ('batch'),
  ('404'), ('500'), ('403'), ('401'),
  ('css'), ('js'), ('json'), ('xml'), ('html'), ('txt'), ('pdf'),
  ('test'), ('demo'), ('example'), ('sample'), ('docs'), ('documentation'), ('guide'),
  ('qork'), ('qorkme'), ('geeksquad'), ('geek'),
  ('hack'), ('hacked'), ('security'), ('exploit'),
  ('undefined'), ('null'), ('void'), ('new'), ('delete'), ('edit'),
  ('update'), ('create'), ('list'), ('view'), ('show')
ON CONFLICT DO NOTHING;

-- Tags for organization (optional feature)
CREATE TABLE IF NOT EXISTS tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) UNIQUE NOT NULL,
  color VARCHAR(7),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS url_tags (
  url_id UUID REFERENCES urls(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (url_id, tag_id)
);

-- Function for case-insensitive short code availability check
CREATE OR REPLACE FUNCTION check_short_code_available(code TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  RETURN NOT EXISTS (
    SELECT 1 FROM urls WHERE short_code_lower = LOWER(code)
  ) AND NOT EXISTS (
    SELECT 1 FROM reserved_words WHERE word = LOWER(code)
  );
END;
$$;

-- Function to increment click count (atomic operation)
-- SECURITY DEFINER so anonymous visitors can trigger redirects on user-owned URLs
CREATE OR REPLACE FUNCTION increment_click_count(p_short_code TEXT)
RETURNS TABLE (
  id UUID,
  long_url TEXT,
  title TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  UPDATE urls
  SET
    click_count = click_count + 1,
    last_accessed_at = NOW()
  WHERE short_code_lower = LOWER(p_short_code)
    AND is_active = true
    AND (expires_at IS NULL OR expires_at > NOW())
  RETURNING urls.id, urls.long_url, urls.title;
END;
$$;

-- get_or_create_short_url v2 — the whole shorten path in ONE round trip:
-- duplicate detection (an already-shortened URL returns its existing code,
-- never a duplicate row), reserved-word filtering, first-available-candidate
-- selection, and the insert. Unique-violation races advance to the next
-- candidate inside the function. Candidates arrive shortest-first from
-- ShortCodeGenerator.generateCandidates(), so codes stay short while the
-- namespace has room and grow one character at a time as it fills.
CREATE OR REPLACE FUNCTION get_or_create_short_url(
  p_long_url TEXT,
  p_candidates TEXT[],
  p_custom_alias BOOLEAN DEFAULT false,
  p_user_id UUID DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  short_code VARCHAR(50),
  long_url TEXT,
  created_at TIMESTAMPTZ,
  is_new BOOLEAN
)
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  v_existing RECORD;
  v_candidate TEXT;
  v_row RECORD;
BEGIN
  -- Duplicate detection (auto-generated codes only). The MD5 predicate hits
  -- idx_long_url_hash; the equality predicate guards hash collisions.
  IF p_custom_alias = false THEN
    SELECT u.id, u.short_code, u.long_url, u.created_at
      INTO v_existing
      FROM urls u
     WHERE MD5(u.long_url) = MD5(p_long_url)
       AND u.long_url = p_long_url
       AND u.custom_alias = false
       AND u.is_active = true
       AND (u.expires_at IS NULL OR u.expires_at > NOW())
     LIMIT 1;

    IF v_existing.id IS NOT NULL THEN
      RETURN QUERY SELECT v_existing.id, v_existing.short_code,
                          v_existing.long_url, v_existing.created_at, false;
      RETURN;
    END IF;
  END IF;

  -- Try candidates in order; skip reserved/taken; absorb insert races.
  FOREACH v_candidate IN ARRAY p_candidates LOOP
    CONTINUE WHEN v_candidate IS NULL OR LENGTH(v_candidate) < 3 OR LENGTH(v_candidate) > 50;
    CONTINUE WHEN EXISTS (SELECT 1 FROM reserved_words rw WHERE rw.word = LOWER(v_candidate));
    CONTINUE WHEN EXISTS (SELECT 1 FROM urls u WHERE u.short_code_lower = LOWER(v_candidate));

    BEGIN
      INSERT INTO urls (short_code, long_url, custom_alias, user_id)
      VALUES (v_candidate, p_long_url, p_custom_alias, p_user_id)
      RETURNING urls.id, urls.short_code, urls.long_url, urls.created_at
        INTO v_row;

      RETURN QUERY SELECT v_row.id, v_row.short_code, v_row.long_url, v_row.created_at, true;
      RETURN;
    EXCEPTION WHEN unique_violation THEN
      CONTINUE;
    END;
  END LOOP;

  -- No candidate available — empty result; the app retries with a fresh batch.
  RETURN;
END;
$$;

-- admin_health_stats — consolidated admin health check (one RPC instead of 8
-- parallel queries). Service-role only.
CREATE OR REPLACE FUNCTION admin_health_stats()
RETURNS JSONB
LANGUAGE sql
STABLE
SET search_path = public
AS $$
  SELECT jsonb_build_object(
    'url_count',           (SELECT COUNT(*) FROM urls),
    'active_url_count',    (SELECT COUNT(*) FROM urls WHERE is_active),
    'inactive_url_count',  (SELECT COUNT(*) FROM urls WHERE NOT is_active),
    'click_count',         (SELECT COUNT(*) FROM clicks),
    'reserved_word_count', (SELECT COUNT(*) FROM reserved_words),
    'newest_url_at',       (SELECT MAX(created_at) FROM urls),
    'newest_click_at',     (SELECT MAX(clicked_at) FROM clicks),
    'latest_access_at',    (SELECT MAX(last_accessed_at) FROM urls)
  );
$$;

REVOKE EXECUTE ON FUNCTION admin_health_stats() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION admin_health_stats() FROM anon;
REVOKE EXECUTE ON FUNCTION admin_health_stats() FROM authenticated;

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_urls_updated_at BEFORE UPDATE ON urls
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security Policies
ALTER TABLE urls ENABLE ROW LEVEL SECURITY;
ALTER TABLE clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE reserved_words ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE url_tags ENABLE ROW LEVEL SECURITY;

-- urls policies
CREATE POLICY "Public URLs are viewable by everyone" ON urls
  FOR SELECT USING (true);

-- auth.uid() is wrapped in scalar subselects so Postgres evaluates it once
-- per statement (InitPlan) instead of per row
CREATE POLICY "Users can insert their own URLs" ON urls
  FOR INSERT WITH CHECK ((SELECT auth.uid()) = user_id OR user_id IS NULL);

CREATE POLICY "Authenticated users can update their own URLs" ON urls
  FOR UPDATE TO authenticated USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Authenticated users can delete their own URLs" ON urls
  FOR DELETE TO authenticated USING ((SELECT auth.uid()) = user_id);

-- clicks policies
CREATE POLICY "Users can view analytics for their URLs" ON clicks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM urls
      WHERE urls.id = clicks.url_id
      AND (urls.user_id = (SELECT auth.uid()) OR urls.user_id IS NULL)
    )
  );

CREATE POLICY "Anyone can insert click analytics" ON clicks
  FOR INSERT WITH CHECK (true);

-- reserved_words policies
CREATE POLICY "Anyone can read reserved words" ON reserved_words
  FOR SELECT USING (true);

-- Grant necessary permissions (no TRUNCATE for anon/authenticated)
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE, REFERENCES, TRIGGER ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;