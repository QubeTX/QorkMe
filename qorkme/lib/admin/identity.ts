import type { User } from '@supabase/supabase-js';
import { ADMIN_GITHUB_USERNAME } from '@/lib/config/admin';

/** Only use the provider identity from a server-verified getUser() response.
 * user_metadata and display names can be edited by the account holder. */
export function isAdminUser(user: User | null): boolean {
  return !!user?.identities?.some((identity) => {
    if (identity.provider !== 'github') return false;
    const name = identity.identity_data?.user_name ?? identity.identity_data?.preferred_username;
    return typeof name === 'string' && name.toLowerCase() === ADMIN_GITHUB_USERNAME;
  });
}
