-- get_or_create_short_url v2 — single-round-trip shorten path.
-- Replaces the v1 function (single p_short_code, no search_path, MD5-only
-- duplicate match) with a candidates-array version that performs duplicate
-- detection, reserved-word filtering, availability selection, and the insert
-- in one call. Unique-violation races are resolved inside the function by
-- advancing to the next candidate.

DROP FUNCTION IF EXISTS get_or_create_short_url(TEXT, TEXT, BOOLEAN, UUID);

CREATE OR REPLACE FUNCTION get_or_create_short_url(
  p_long_url TEXT,
  p_candidates TEXT[],
  p_custom_alias BOOLEAN DEFAULT false,
  p_user_id UUID DEFAULT NULL
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
BEGIN
  -- Duplicate detection (auto-generated codes only): an already-shortened URL
  -- returns its existing code instead of creating a new row. The MD5 predicate
  -- hits idx_long_url_hash; the equality predicate guards hash collisions.
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
      INSERT INTO urls (short_code, long_url, custom_alias, user_id)
      VALUES (v_candidate, p_long_url, p_custom_alias, p_user_id)
      RETURNING urls.id, urls.short_code, urls.long_url, urls.created_at
        INTO v_row;

      RETURN QUERY SELECT v_row.id, v_row.short_code, v_row.long_url, v_row.created_at, true;
      RETURN;
    EXCEPTION WHEN unique_violation THEN
      -- Concurrent insert claimed this code between the check and the insert;
      -- fall through to the next candidate.
      CONTINUE;
    END;
  END LOOP;

  -- No candidate available — empty result; the app retries with a fresh batch.
  RETURN;
END;
$$;
