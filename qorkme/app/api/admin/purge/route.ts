import { NextResponse } from 'next/server';
import { createAdminClient, createServerClientInstance } from '@/lib/supabase/server';
import { ADMIN_GITHUB_USERNAME } from '@/lib/config/admin';
import { revalidatePath } from 'next/cache';

export async function POST() {
  const supabase = await createServerClientInstance();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  const githubUsername = (
    user.user_metadata?.user_name ||
    user.user_metadata?.preferred_username ||
    ''
  ).toLowerCase();

  if (githubUsername !== ADMIN_GITHUB_USERNAME.toLowerCase()) {
    return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
  }

  try {
    const adminClient = await createAdminClient();

    const placeholderId = '00000000-0000-0000-0000-000000000000';

    const [{ error: clicksError }, { error: urlError }] = await Promise.all([
      adminClient.from('clicks').delete().neq('id', placeholderId),
      adminClient.from('urls').delete().neq('id', placeholderId),
    ]);

    if (clicksError || urlError) {
      const message = clicksError?.message || urlError?.message || 'Failed to purge data';
      return NextResponse.json({ success: false, message }, { status: 500 });
    }

    revalidatePath('/admin');

    return NextResponse.json({ success: true });
  } catch (purgeError) {
    const message = purgeError instanceof Error ? purgeError.message : 'Unexpected purge failure';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
