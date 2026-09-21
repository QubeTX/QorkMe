-- Keep URL and click deletion atomic; only the authenticated admin server can call it.
CREATE OR REPLACE FUNCTION public.admin_purge_links()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  deleted_urls BIGINT;
  deleted_clicks BIGINT;
BEGIN
  LOCK TABLE public.urls, public.clicks IN SHARE ROW EXCLUSIVE MODE;
  DELETE FROM public.clicks;
  GET DIAGNOSTICS deleted_clicks = ROW_COUNT;
  DELETE FROM public.urls;
  GET DIAGNOSTICS deleted_urls = ROW_COUNT;
  RETURN jsonb_build_object('urls', deleted_urls, 'clicks', deleted_clicks);
END;
$$;
REVOKE ALL ON FUNCTION public.admin_purge_links() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.admin_purge_links() TO service_role;
