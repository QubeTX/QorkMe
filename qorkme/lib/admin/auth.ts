import { NextResponse } from 'next/server';
import { createServerClientInstance } from '@/lib/supabase/server';
import { ADMIN_GITHUB_USERNAME } from '@/lib/config/admin';

type AuthSuccess = { authorized: true; userId: string };
type AuthFailure = { authorized: false; response: NextResponse };
type AuthResult = AuthSuccess | AuthFailure;

export async function verifyAdminAuth(): Promise<AuthResult> {
  const supabase = await createServerClientInstance();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return {
      authorized: false,
      response: NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 }),
    };
  }

  const githubUsername = (
    user.user_metadata?.user_name ||
    user.user_metadata?.preferred_username ||
    ''
  ).toLowerCase();

  if (githubUsername !== ADMIN_GITHUB_USERNAME.toLowerCase()) {
    return {
      authorized: false,
      response: NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 }),
    };
  }

  return { authorized: true, userId: user.id };
}
