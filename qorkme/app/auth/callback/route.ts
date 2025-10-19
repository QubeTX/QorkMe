import { createServerClientInstance } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const origin = requestUrl.origin;

  if (code) {
    const supabase = await createServerClientInstance();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      // Redirect to admin with error
      return NextResponse.redirect(`${origin}/admin?error=auth_failed`);
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(`${origin}/admin`);
}
