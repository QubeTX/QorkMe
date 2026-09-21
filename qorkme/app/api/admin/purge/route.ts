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
      console.error('Admin purge failed:', error.code);
      const message = 'Could not clear the links. Please retry.';
      return NextResponse.json({ success: false, message }, { status: 500 });
    }

    revalidatePath('/admin');

    return NextResponse.json({ success: true, deleted: data });
  } catch {
    console.error('Admin purge failed unexpectedly');
    const message = 'Could not clear the links. Please retry.';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
