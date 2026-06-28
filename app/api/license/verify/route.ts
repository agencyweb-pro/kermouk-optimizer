import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const { key } = await req.json();
  if (!key) return NextResponse.json({ valid: false, reason: 'No key' }, { status: 400 });

  const { data, error } = await supabase
    .from('licenses')
    .select('*')
    .eq('key', key)
    .single();

  if (error || !data) return NextResponse.json({ valid: false, reason: 'Not found' });

  if (!data.active) return NextResponse.json({ valid: false, reason: 'Revoked' });

  if (data.plan === 'monthly' && data.expires_at) {
    const expired = new Date(data.expires_at) < new Date();
    if (expired) {
      await supabase.from('licenses').update({ active: false }).eq('key', key);
      return NextResponse.json({ valid: false, reason: 'Expired' });
    }
  }

  return NextResponse.json({
    valid: true,
    plan: data.plan,
    email: data.email,
    expires_at: data.expires_at,
  });
        }
