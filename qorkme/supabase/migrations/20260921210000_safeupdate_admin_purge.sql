-- PostgREST loads pg-safeupdate, which rejects DELETE without a WHERE clause.
-- Keep the guard enabled; these explicit predicates intentionally select all
-- rows by their non-null primary keys inside the service-role-only operation.
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
  DELETE FROM public.clicks WHERE id IS NOT NULL;
  GET DIAGNOSTICS deleted_clicks = ROW_COUNT;
  DELETE FROM public.urls WHERE id IS NOT NULL;
  GET DIAGNOSTICS deleted_urls = ROW_COUNT;
  RETURN jsonb_build_object('urls', deleted_urls, 'clicks', deleted_clicks);
END;
$$;
REVOKE ALL ON FUNCTION public.admin_purge_links() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.admin_purge_links() TO service_role;
