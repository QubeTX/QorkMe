-- admin_analytics — consolidated dashboard visualizations in one RPC
-- (14-day click/creation series, top links, device breakdown, window totals).
-- Read-only; service-role only (aggregate stats are not for anonymous callers).

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
    'totals', json_build_object(
      'clicks_14d', (SELECT count(*) FROM clicks WHERE clicked_at >= current_date - interval '13 days'),
      'links_14d',  (SELECT count(*) FROM urls   WHERE created_at >= current_date - interval '13 days')
    )
  );
$$;

REVOKE ALL ON FUNCTION admin_analytics() FROM anon, authenticated;
GRANT EXECUTE ON FUNCTION admin_analytics() TO service_role;
