import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { verifyAdminAuth } from '@/lib/admin/auth';
import { revalidatePath } from 'next/cache';

export async function POST() {
  const auth = await verifyAdminAuth();
  if (!auth.authorized) return auth.response;

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
