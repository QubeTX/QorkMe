-- Additive launch audit: no link data or RLS policies are removed.
SET lock_timeout = '5s';
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX IF NOT EXISTS idx_urls_created_id ON urls(created_at DESC, id DESC);
CREATE INDEX IF NOT EXISTS idx_urls_code_search ON urls USING gin(short_code gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_urls_destination_search ON urls USING gin(long_url gin_trgm_ops);

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
  -- Duplicate detection (auto-generated codes only). The MD5 predicate hits
  -- idx_long_url_hash; the equality predicate guards hash collisions.
  IF p_custom_alias = false THEN
    -- Serialize identical destinations only; unrelated links remain concurrent.
    PERFORM pg_advisory_xact_lock(hashtextextended(p_long_url, 0));
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

  -- No candidate available — empty result; the app retries with a fresh batch.
  RETURN;
END;
$$;

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
    click_count = COALESCE(click_count, 0) + 1,
    last_accessed_at = NOW()
  WHERE short_code_lower = LOWER(p_short_code)
    AND is_active = true
    AND (expires_at IS NULL OR expires_at > NOW())
  RETURNING urls.id, urls.long_url, urls.title;
END;
$$;

CREATE OR REPLACE FUNCTION admin_health_stats()
RETURNS JSONB
LANGUAGE sql
STABLE
SET search_path = public
AS $$
  SELECT jsonb_build_object(
    'url_count', u.total, 'active_url_count', u.active, 'inactive_url_count', u.inactive,
    'click_count', c.total, 'total_click_count', u.clicks,
    'reserved_word_count', (SELECT count(*) FROM reserved_words),
    'newest_url_at', u.newest, 'newest_click_at', c.newest, 'latest_access_at', u.latest
  ) FROM (
    SELECT count(*) AS total, count(*) FILTER (WHERE is_active) AS active,
      count(*) FILTER (WHERE NOT is_active) AS inactive, coalesce(sum(click_count), 0) AS clicks,
      max(created_at) AS newest, max(last_accessed_at) AS latest FROM urls
  ) u CROSS JOIN (SELECT count(*) AS total, max(clicked_at) AS newest FROM clicks) c;
$$;

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
        WHERE clicked_at >= current_date - interval '13 days'
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
        WHERE created_at >= current_date - interval '13 days'
        GROUP BY 1
      ) t
    ),
    'totals', json_build_object(
      'clicks_14d', (SELECT count(*) FROM clicks WHERE clicked_at >= current_date - interval '13 days'),
      'links_14d',  (SELECT count(*) FROM urls   WHERE created_at >= current_date - interval '13 days')
    )
  );
$$;

-- Keep these revocations AFTER the broad public grants for fresh installations.
REVOKE ALL ON FUNCTION admin_analytics() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION admin_health_stats() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION admin_analytics(), admin_health_stats() TO service_role;
INSERT INTO reserved_words(word) VALUES ('link-not-found'), ('install'), ('cli'), ('download'), ('llms') ON CONFLICT DO NOTHING;
