-- urls.user_id → auth.users currently has no ON DELETE action, so deleting an
-- auth user would fail on the FK. Anonymous-ownership semantics already treat
-- NULL as "no owner", so SET NULL is the correct degradation.
-- Constraint name verified against live information_schema before applying.

ALTER TABLE urls DROP CONSTRAINT IF EXISTS urls_user_id_fkey;
ALTER TABLE urls
  ADD CONSTRAINT urls_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL;
