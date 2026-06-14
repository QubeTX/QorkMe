-- Creation-source attribution: tell website shortens (web) apart from CLI (cli)
-- and direct API (api) usage in the admin analytics console.
-- Applied to the live project via the Supabase MCP (name: add_url_source_attribution);
-- this file is the committed record. Mirrored in schema.sql.

-- 1. Add the source column. NOT NULL DEFAULT 'web' backfills every existing
--    row to 'web' in one shot (all current links were created via the website).
ALTER TABLE urls ADD COLUMN IF NOT EXISTS source VARCHAR(16) NOT NULL DEFAULT 'web';

-- 2. Recreate get_or_create_short_url with a p_source parameter. You can't add
--    a parameter via CREATE OR REPLACE, so drop the 4-arg signature first. The
--    new 5th param defaults to 'web', so a caller passing only 4 args still works.
DROP FUNCTION IF EXISTS get_or_create_short_url(text, text[], boolean, uuid);

CREATE OR REPLACE FUNCTION get_or_create_short_url(
  p_long_url TEXT,
  p_candidates TEXT[],
  p_custom_alias BOOLEAN DEFAULT false,
  p_user_id UUID DEFAULT NULL,
  p_source TEXT DEFAULT 'web'
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
  v_source TEXT := COALESCE(NULLIF(lower(p_source), ''), 'web');
BEGIN
  -- Duplicate detection (auto-generated codes only).
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
      INSERT INTO urls (short_code, long_url, custom_alias, user_id, source)
      VALUES (v_candidate, p_long_url, p_custom_alias, p_user_id, v_source)
      RETURNING urls.id, urls.short_code, urls.long_url, urls.created_at
        INTO v_row;

      RETURN QUERY SELECT v_row.id, v_row.short_code, v_row.long_url, v_row.created_at, true;
      RETURN;
    EXCEPTION WHEN unique_violation THEN
      CONTINUE;
    END;
  END LOOP;

  RETURN;
END;
$$;

-- 3. Extend admin_analytics() with an all-time source_breakdown (mirrors the
--    existing device_breakdown shape). Body otherwise unchanged.
CREATE OR REPLACE FUNCTION admin_analytics()
RETURNS json
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT json_build_object(
    'clicks_by_day', (
      SELECT COALESCE(json_agg(json_build_object('d', t.d, 'c', t.c) ORDER BY t.d), '[]'::json)
      FROM (
        SELECT to_char(g.d::date, 'YYYY-MM-DD') AS d, COALESCE(c.cnt, 0) AS c
        FROM generate_series(current_date - interval '13 days', current_date, interval '1 day') AS g(d)
        LEFT JOIN (
          SELECT clicked_at::date AS dd, count(*) AS cnt
          FROM clicks
          WHERE clicked_at >= current_date - interval '13 days'
          GROUP BY 1
        ) c ON c.dd = g.d::date
      ) t
    ),
    'created_by_day', (
      SELECT COALESCE(json_agg(json_build_object('d', t.d, 'c', t.c) ORDER BY t.d), '[]'::json)
      FROM (
        SELECT to_char(g.d::date, 'YYYY-MM-DD') AS d, COALESCE(u.cnt, 0) AS c
        FROM generate_series(current_date - interval '13 days', current_date, interval '1 day') AS g(d)
        LEFT JOIN (
          SELECT created_at::date AS dd, count(*) AS cnt
          FROM urls
          WHERE created_at >= current_date - interval '13 days'
          GROUP BY 1
        ) u ON u.dd = g.d::date
      ) t
    ),
    'top_links', (
      SELECT COALESCE(json_agg(json_build_object('short_code', t.short_code, 'click_count', t.click_count)), '[]'::json)
      FROM (
        SELECT short_code, click_count
        FROM urls
        ORDER BY click_count DESC NULLS LAST, created_at DESC
        LIMIT 8
      ) t
    ),
    'device_breakdown', (
      SELECT COALESCE(json_agg(json_build_object('device', t.device, 'c', t.c)), '[]'::json)
      FROM (
        SELECT COALESCE(NULLIF(device_type, ''), 'unknown') AS device, count(*) AS c
        FROM clicks
        GROUP BY 1
        ORDER BY c DESC
        LIMIT 5
      ) t
    ),
    'source_breakdown', (
      SELECT COALESCE(json_agg(json_build_object('source', t.source, 'c', t.c) ORDER BY t.c DESC), '[]'::json)
      FROM (
        SELECT COALESCE(NULLIF(source, ''), 'web') AS source, count(*) AS c
        FROM urls
        GROUP BY 1
      ) t
    ),
    'totals', json_build_object(
      'clicks_14d', (SELECT count(*) FROM clicks WHERE clicked_at >= current_date - interval '13 days'),
      'links_14d',  (SELECT count(*) FROM urls   WHERE created_at >= current_date - interval '13 days')
    )
  );
$$;

REVOKE ALL ON FUNCTION admin_analytics() FROM anon, authenticated;
GRANT EXECUTE ON FUNCTION admin_analytics() TO service_role;

-- 4. Reserve the new route/asset-shadowing short codes (keep in lockstep with
--    lib/shortcode/reserved.ts).
INSERT INTO reserved_words (word) VALUES
  ('install'), ('cli'), ('download'), ('llms')
ON CONFLICT (word) DO NOTHING;
