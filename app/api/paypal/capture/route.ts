import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function verifyPayPalOrder(orderId: string) {
  const base = process.env.PAYPAL_SANDBOX === 'true'
    ? 'https://api-m.sandbox.paypal.com'
    : 'https://api-m.paypal.com';
  const auth = Buffer.from(
    `${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
  ).toString('base64');
  const tokenRes = await fetch(`${base}/v1/oauth2/token`, {
    method: 'POST',
    headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'grant_type=client_credentials',
  });
  const { access_token } = await tokenRes.json();
  const orderRes = await fetch(`${base}/v2/checkout/orders/${orderId}`, {
    headers: { Authorization: `Bearer ${access_token}` },
  });
  return orderRes.json();
}

export async function POST(req: NextRequest) {
  const { orderId, plan } = await req.json();
  if (!orderId || !['monthly', 'lifetime'].includes(plan))
    return NextResponse.json({ error: 'Invalid' }, { status: 400 });

  const order = await verifyPayPalOrder(orderId);
  if (order.status !== 'COMPLETED')
    return NextResponse.json({ error: 'Not completed' }, { status: 402 });

  const expiresAt = plan === 'lifetime'
    ? null
    : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

  const { data, error } = await supabase
    .from('licenses')
    .insert({ plan, email: order.payer?.email_address ?? null, active: true, expires_at: expiresAt })
    .select('key')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ key: data.key });
}
