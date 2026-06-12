-- RLS initplan optimization — wrap auth.uid() in scalar subselects so Postgres
-- evaluates it once per statement (InitPlan) instead of once per row.
-- Policy names/definitions verified against live pg_policies before applying.

-- urls: INSERT (anonymous creation allowed, owned rows must match the caller)
DROP POLICY IF EXISTS "Users can insert their own URLs" ON urls;
CREATE POLICY "Users can insert their own URLs" ON urls
  FOR INSERT WITH CHECK ((SELECT auth.uid()) = user_id OR user_id IS NULL);

-- urls: UPDATE/DELETE (authenticated owners only — hardened 2026-04)
DROP POLICY IF EXISTS "Authenticated users can update their own URLs" ON urls;
CREATE POLICY "Authenticated users can update their own URLs" ON urls
  FOR UPDATE TO authenticated USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Authenticated users can delete their own URLs" ON urls;
CREATE POLICY "Authenticated users can delete their own URLs" ON urls
  FOR DELETE TO authenticated USING ((SELECT auth.uid()) = user_id);

-- clicks: SELECT (owner of the parent URL, or anonymous URL)
DROP POLICY IF EXISTS "Users can view analytics for their URLs" ON clicks;
CREATE POLICY "Users can view analytics for their URLs" ON clicks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM urls
      WHERE urls.id = clicks.url_id
        AND (urls.user_id = (SELECT auth.uid()) OR urls.user_id IS NULL)
    )
  );
