-- admin_health_stats — consolidates the admin health check (previously 8
-- parallel PostgREST queries) into one RPC. Service-role only: aggregate
-- stats are not for anonymous callers.

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
