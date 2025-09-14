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

  -- User tracking (optional)
  user_id UUID REFERENCES auth.users(id),

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

-- Insert common reserved words
INSERT INTO reserved_words (word) VALUES
  ('api'), ('admin'), ('dashboard'), ('login'), ('logout'),
  ('register'), ('about'), ('contact'), ('help'), ('terms'),
  ('privacy'), ('settings'), ('profile'), ('404'), ('500'),
  ('app'), ('auth'), ('callback'), ('result'), ('analytics'),
  ('stats'), ('qr'), ('export'), ('import'), ('bulk')
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
RETURNS BOOLEAN AS $$
BEGIN
  RETURN NOT EXISTS (
    SELECT 1 FROM urls WHERE short_code_lower = LOWER(code)
  ) AND NOT EXISTS (
    SELECT 1 FROM reserved_words WHERE word = LOWER(code)
  );
END;
$$ LANGUAGE plpgsql;

-- Function to increment click count (atomic operation)
CREATE OR REPLACE FUNCTION increment_click_count(p_short_code TEXT)
RETURNS TABLE (
  id UUID,
  long_url TEXT,
  title TEXT
) AS $$
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
$$ LANGUAGE plpgsql;

-- Function to get or create URL (for duplicate detection)
CREATE OR REPLACE FUNCTION get_or_create_short_url(
  p_long_url TEXT,
  p_short_code TEXT DEFAULT NULL,
  p_custom_alias BOOLEAN DEFAULT false,
  p_user_id UUID DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  short_code VARCHAR(50),
  is_new BOOLEAN
) AS $$
DECLARE
  v_existing_id UUID;
  v_existing_code VARCHAR(50);
  v_new_id UUID;
  v_final_code VARCHAR(50);
BEGIN
  -- Check if URL already exists (only for auto-generated codes)
  IF p_custom_alias = false THEN
    SELECT u.id, u.short_code INTO v_existing_id, v_existing_code
    FROM urls u
    WHERE MD5(u.long_url) = MD5(p_long_url)
      AND u.custom_alias = false
      AND u.is_active = true
      AND (u.expires_at IS NULL OR u.expires_at > NOW())
    LIMIT 1;

    IF v_existing_id IS NOT NULL THEN
      RETURN QUERY SELECT v_existing_id, v_existing_code, false;
      RETURN;
    END IF;
  END IF;

  -- Use provided code or it will be generated in application
  v_final_code := p_short_code;

  -- Insert new URL
  INSERT INTO urls (short_code, long_url, custom_alias, user_id)
  VALUES (v_final_code, p_long_url, p_custom_alias, p_user_id)
  RETURNING urls.id INTO v_new_id;

  RETURN QUERY SELECT v_new_id, v_final_code, true;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_urls_updated_at BEFORE UPDATE ON urls
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security Policies (optional, for multi-user support)
ALTER TABLE urls ENABLE ROW LEVEL SECURITY;
ALTER TABLE clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE url_tags ENABLE ROW LEVEL SECURITY;

-- Public URLs are viewable by everyone
CREATE POLICY "Public URLs are viewable by everyone" ON urls
  FOR SELECT USING (true);

-- Users can insert their own URLs
CREATE POLICY "Users can insert their own URLs" ON urls
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Users can update their own URLs
CREATE POLICY "Users can update their own URLs" ON urls
  FOR UPDATE USING (auth.uid() = user_id OR user_id IS NULL);

-- Users can delete their own URLs
CREATE POLICY "Users can delete their own URLs" ON urls
  FOR DELETE USING (auth.uid() = user_id OR user_id IS NULL);

-- Analytics are viewable by URL owner
CREATE POLICY "Users can view analytics for their URLs" ON clicks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM urls
      WHERE urls.id = clicks.url_id
      AND (urls.user_id = auth.uid() OR urls.user_id IS NULL)
    )
  );

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;