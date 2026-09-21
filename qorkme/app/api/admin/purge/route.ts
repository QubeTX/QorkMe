import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { verifyAdminAuth } from '@/lib/admin/auth';
import { revalidatePath } from 'next/cache';

export async function POST() {
  const auth = await verifyAdminAuth();
  if (!auth.authorized) return auth.response;

  try {
    const adminClient = await createAdminClient();

    const { data, error } = await adminClient.rpc('admin_purge_links');
    if (error) {
      const message = 'Could not clear the links. Please retry.';
      return NextResponse.json({ success: false, message }, { status: 500 });
    }

    revalidatePath('/admin');

    return NextResponse.json({ success: true, deleted: data });
  } catch (purgeError) {
    const message = purgeError instanceof Error ? purgeError.message : 'Unexpected purge failure';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
