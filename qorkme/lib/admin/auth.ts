import { NextResponse } from 'next/server';
import { createServerClientInstance } from '@/lib/supabase/server';
import { isAdminUser } from './identity';

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

  if (!isAdminUser(user)) {
    return {
      authorized: false,
      response: NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 }),
    };
  }

  return { authorized: true, userId: user.id };
}
