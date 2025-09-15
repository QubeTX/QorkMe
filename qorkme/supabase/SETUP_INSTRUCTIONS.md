# Supabase Database Setup Instructions

## Quick Setup

1. Log into your Supabase project at https://supabase.com
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy the ENTIRE contents of `schema.sql` below
5. Paste into the SQL Editor
6. Click **Run** (or press F5 / Cmd+Enter)
7. You should see "Success. No rows returned"

## Complete SQL Schema

**Option 1: Use the Schema File (Recommended)**

1. Open the file `supabase/schema.sql` in your code editor
2. Copy its entire contents
3. Paste into Supabase SQL Editor and run

**Option 2: Copy from here**
Copy and paste this ENTIRE SQL script into Supabase SQL Editor:

```sql
-- QorkMe URL Shortener Database Schema
-- Optimized for 200,000+ URLs with fast lookups

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For fuzzy text search

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS url_tags CASCADE;
DROP TABLE IF EXISTS tags CASCADE;
DROP TABLE IF EXISTS clicks CASCADE;
DROP TABLE IF EXISTS urls CASCADE;
DROP TABLE IF EXISTS reserved_words CASCADE;

-- ============================================
-- MAIN TABLES
-- ============================================

-- Main URLs table (optimized for 200,000+ entries)
CREATE TABLE urls (
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

-- Analytics/clicks table
CREATE TABLE clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url_id UUID REFERENCES urls(id) ON DELETE CASCADE,
  clicked_at TIMESTAMPTZ DEFAULT NOW(),

  -- Analytics data (privacy-conscious)
  ip_hash VARCHAR(64),
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

-- Reserved words table
CREATE TABLE reserved_words (
  word VARCHAR(50) PRIMARY KEY
);

-- Tags for organization (optional feature)
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) UNIQUE NOT NULL,
  color VARCHAR(7),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Many-to-many relationship for URL tags
CREATE TABLE url_tags (
  url_id UUID REFERENCES urls(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (url_id, tag_id)
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- URLs table indexes
CREATE INDEX idx_short_code_lower ON urls(short_code_lower);
CREATE INDEX idx_user_id ON urls(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX idx_created_at ON urls(created_at DESC);
CREATE INDEX idx_click_count ON urls(click_count DESC);
CREATE INDEX idx_active_urls ON urls(is_active) WHERE is_active = true;
CREATE INDEX idx_long_url_hash ON urls(MD5(long_url));

-- Clicks table indexes
CREATE INDEX idx_clicks_url_id ON clicks(url_id);
CREATE INDEX idx_clicks_clicked_at ON clicks(clicked_at DESC);
CREATE INDEX idx_clicks_url_date ON clicks(url_id, clicked_at DESC);

-- ============================================
-- INSERT RESERVED WORDS
-- ============================================

INSERT INTO reserved_words (word) VALUES
  ('api'), ('admin'), ('dashboard'), ('login'), ('logout'),
  ('register'), ('about'), ('contact'), ('help'), ('terms'),
  ('privacy'), ('settings'), ('profile'), ('404'), ('500'),
  ('app'), ('auth'), ('callback'), ('result'), ('analytics'),
  ('stats'), ('qr'), ('export'), ('import'), ('bulk'),
  ('home'), ('docs'), ('documentation'), ('support'), ('faq'),
  ('blog'), ('news'), ('press'), ('careers'), ('jobs'),
  ('legal'), ('cookies'), ('gdpr'), ('tos'), ('policy')
ON CONFLICT DO NOTHING;

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to check if a short code is available
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

-- Function to increment click count atomically
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

  -- Use provided code
  v_final_code := p_short_code;

  -- Insert new URL
  INSERT INTO urls (short_code, long_url, custom_alias, user_id)
  VALUES (v_final_code, p_long_url, p_custom_alias, p_user_id)
  RETURNING urls.id INTO v_new_id;

  RETURN QUERY SELECT v_new_id, v_final_code, true;
END;
$$ LANGUAGE plpgsql;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TRIGGERS
-- ============================================

CREATE TRIGGER update_urls_updated_at
  BEFORE UPDATE ON urls
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE urls ENABLE ROW LEVEL SECURITY;
ALTER TABLE clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE url_tags ENABLE ROW LEVEL SECURITY;

-- URLs policies
CREATE POLICY "Public URLs are viewable by everyone"
  ON urls FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own URLs"
  ON urls FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update their own URLs"
  ON urls FOR UPDATE
  USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can delete their own URLs"
  ON urls FOR DELETE
  USING (auth.uid() = user_id OR user_id IS NULL);

-- Clicks policies
CREATE POLICY "Users can view analytics for their URLs"
  ON clicks FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM urls
      WHERE urls.id = clicks.url_id
      AND (urls.user_id = auth.uid() OR urls.user_id IS NULL)
    )
  );

-- Tags policies (if using authentication)
CREATE POLICY "Tags are viewable by everyone"
  ON tags FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can manage tags"
  ON tags FOR ALL
  USING (auth.uid() IS NOT NULL);

-- URL Tags policies
CREATE POLICY "URL tags are viewable by everyone"
  ON url_tags FOR SELECT
  USING (true);

CREATE POLICY "Users can manage tags for their URLs"
  ON url_tags FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM urls
      WHERE urls.id = url_tags.url_id
      AND (urls.user_id = auth.uid() OR urls.user_id IS NULL)
    )
  );

-- ============================================
-- PERMISSIONS
-- ============================================

-- Grant necessary permissions to authenticated and anonymous users
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- ============================================
-- VERIFICATION QUERIES (Run these separately to verify setup)
-- ============================================

-- Check if tables were created successfully
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- Check if functions were created
-- SELECT routine_name FROM information_schema.routines WHERE routine_schema = 'public';

-- Check if indexes were created
-- SELECT indexname FROM pg_indexes WHERE schemaname = 'public';

-- Check row count of reserved words
-- SELECT COUNT(*) FROM reserved_words;

-- Test the check_short_code_available function
-- SELECT check_short_code_available('test123');
-- SELECT check_short_code_available('api'); -- Should return false
```

## Post-Setup Verification

After running the SQL above, verify the setup by running these queries separately:

1. **Check Tables Created**:

```sql
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

Expected: urls, clicks, tags, url_tags, reserved_words

2. **Check Reserved Words**:

```sql
SELECT COUNT(*) as total_reserved FROM reserved_words;
```

Expected: 25+ reserved words

3. **Test Short Code Availability**:

```sql
SELECT check_short_code_available('test123') as available;
SELECT check_short_code_available('api') as should_be_false;
```

4. **Check RLS is Enabled**:

```sql
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public' AND tablename IN ('urls', 'clicks', 'tags', 'url_tags');
```

All should show rowsecurity = true

## Important Notes

1. **First Time Setup**: This script drops and recreates tables. Only run on a new project or if you want to reset everything.

2. **Authentication**: The schema assumes you might use Supabase Auth. If not using auth, the user_id fields will remain NULL.

3. **Performance**: Indexes are optimized for 200,000+ URLs. Monitor query performance as you scale.

4. **Reserved Words**: Add more reserved words as needed for your domain structure.

5. **Time Zone**: All timestamps use TIMESTAMPTZ (timezone-aware). Configure your Supabase project timezone in Settings.

## Troubleshooting

If you get errors:

1. **"Extension already exists"**: Safe to ignore
2. **"Table does not exist"**: Safe to ignore on first run
3. **"Permission denied"**: Make sure you're using the Supabase SQL Editor, not a client
4. **"Function already exists"**: Drop the function first or use CREATE OR REPLACE

## Next Steps

After database setup:

1. Copy your Supabase URL and anon key from Settings → API
2. Add them to your `.env.local` file
3. Test the connection with `npm run dev`
