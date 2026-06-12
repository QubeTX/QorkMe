/**
 * Supabase Server Client
 * Used for server-side operations with cookies
 */

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from './types';

export async function createServerClientInstance() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Handle cookie errors in Server Components
          }
        },
      },
    }
  );
}

/**
 * Create a cookie-free anon client.
 * For work that runs outside the request context (e.g. inside after()
 * callbacks, where cookies()/headers() throw) and doesn't need a user
 * session — like click analytics inserts, which RLS allows anonymously.
 */
export async function createAnonClient() {
  const { createClient } = await import('@supabase/supabase-js');

  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

/**
 * Create admin client with service role key (for admin operations)
 */
export async function createAdminClient() {
  const { createClient } = await import('@supabase/supabase-js');

  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
