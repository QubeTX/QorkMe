-- Run with an administrative SQL connection after applying migrations.
-- The intentional exception always rolls back the nested deletion, including
-- when an assertion fails. No fixture or existing records are committed away.
-- PostgREST's safeupdate preload is separate from this SQL connection; preserve
-- the explicit WHERE predicates in the migration when testing via the API.
DO $probe$
DECLARE
  before_urls BIGINT;
  before_clicks BIGINT;
  before_reserved BIGINT;
  result JSONB;
BEGIN
  -- Prevent real traffic from changing the expected counts during the probe.
  LOCK TABLE public.urls, public.clicks IN SHARE ROW EXCLUSIVE MODE;
  SELECT count(*) INTO before_urls FROM public.urls;
  SELECT count(*) INTO before_clicks FROM public.clicks;
  SELECT count(*) INTO before_reserved FROM public.reserved_words;
  BEGIN
    SET LOCAL ROLE service_role;
    result := public.admin_purge_links();
    IF result <> jsonb_build_object('urls', before_urls, 'clicks', before_clicks) THEN
      RAISE EXCEPTION 'Incorrect deletion counts: %', result;
    END IF;
    IF EXISTS (SELECT 1 FROM public.urls) OR EXISTS (SELECT 1 FROM public.clicks) THEN
      RAISE EXCEPTION 'Rows remained after purge';
    END IF;
    IF (SELECT count(*) FROM public.reserved_words) <> before_reserved THEN
      RAISE EXCEPTION 'Reserved words changed';
    END IF;
    IF public.admin_purge_links() <> '{"urls":0,"clicks":0}'::JSONB THEN
      RAISE EXCEPTION 'Empty purge counts wrong';
    END IF;
    RAISE EXCEPTION USING ERRCODE = 'ZX001', MESSAGE = 'Assertions passed; revert deletion';
  EXCEPTION WHEN SQLSTATE 'ZX001' THEN
    NULL;
  END;
  IF (SELECT count(*) FROM public.urls) <> before_urls
     OR (SELECT count(*) FROM public.clicks) <> before_clicks THEN
    RAISE EXCEPTION 'Rollback verification failed';
  END IF;
  IF has_function_privilege('anon', 'public.admin_purge_links()', 'EXECUTE')
     OR has_function_privilege('authenticated', 'public.admin_purge_links()', 'EXECUTE')
     OR NOT has_function_privilege('service_role', 'public.admin_purge_links()', 'EXECUTE') THEN
    RAISE EXCEPTION 'Purge permissions are incorrect';
  END IF;
END;
$probe$;
