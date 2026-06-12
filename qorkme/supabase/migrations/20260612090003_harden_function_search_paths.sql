-- Pin search_path on remaining functions (Supabase security advisor:
-- function_search_path_mutable). increment_click_count and
-- get_or_create_short_url already set it.

ALTER FUNCTION check_short_code_available(TEXT) SET search_path = public;
ALTER FUNCTION update_updated_at_column() SET search_path = public;
