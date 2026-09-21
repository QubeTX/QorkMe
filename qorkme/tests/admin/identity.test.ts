import { describe, it, expect } from 'vitest';
import type { User } from '@supabase/supabase-js';
import { isAdminUser } from '@/lib/admin/identity';
import { ADMIN_GITHUB_USERNAME } from '@/lib/config/admin';
const user = (value: object) => value as User;
describe('admin provider identity', () => {
  it('accepts the designated GitHub identity', () => {
    expect(
      isAdminUser(
        user({
          identities: [
            {
              provider: 'github',
              identity_data: { user_name: ADMIN_GITHUB_USERNAME.toUpperCase() },
            },
          ],
        })
      )
    ).toBe(true);
  });
  it('rejects editable user metadata impersonating the admin', () => {
    expect(
      isAdminUser(
        user({
          user_metadata: { user_name: ADMIN_GITHUB_USERNAME },
          identities: [{ provider: 'github', identity_data: { user_name: 'someone-else' } }],
        })
      )
    ).toBe(false);
  });
  it('rejects a display name or another provider that matches the admin', () => {
    expect(
      isAdminUser(
        user({
          identities: [
            { provider: 'github', identity_data: { name: ADMIN_GITHUB_USERNAME } },
            { provider: 'email', identity_data: { user_name: ADMIN_GITHUB_USERNAME } },
          ],
        })
      )
    ).toBe(false);
    expect(isAdminUser(null)).toBe(false);
  });
});
