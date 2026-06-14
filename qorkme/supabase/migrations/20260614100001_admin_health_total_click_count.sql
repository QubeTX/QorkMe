-- Add total_click_count (sum of the per-link lifetime counters) so the admin
-- headline "TOTAL CLICKS" matches the per-link numbers and Top Links.
-- click_count stays the clicks-table row count (detailed events) used by the
-- health "table rows" view. (Historical clicks predate the after()-based
-- detail logging shipped 2026-06-12, so the two legitimately differ.)
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
    'total_click_count',   (SELECT COALESCE(SUM(click_count), 0) FROM urls),
    'reserved_word_count', (SELECT COUNT(*) FROM reserved_words),
    'newest_url_at',       (SELECT MAX(created_at) FROM urls),
    'newest_click_at',     (SELECT MAX(clicked_at) FROM clicks),
    'latest_access_at',    (SELECT MAX(last_accessed_at) FROM urls)
  );
$$;

REVOKE EXECUTE ON FUNCTION admin_health_stats() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION admin_health_stats() FROM anon;
REVOKE EXECUTE ON FUNCTION admin_health_stats() FROM authenticated;
