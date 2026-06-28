import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-05-28.basil' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

export async function POST(req: NextRequest) {
    const body = await req.text();
    const sig = req.headers.get('stripe-signature')!;

    let event: Stripe.Event;
    try {
          event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
        } catch (err) {
          return NextResponse.json({ error: 'Webhook signature invalid' }, { status: 400 });
        }

    if (event.type === 'checkout.session.completed') {
          const session = event.data.object as Stripe.Checkout.Session;
          const plan = session.metadata?.plan ?? 'monthly';
          const email = session.customer_email ?? session.customer_details?.email ?? null;

          const expiresAt = plan === 'lifetime'
            ? null
            : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

          await supabase.from('licenses').insert({
                  plan,
                  email,
                  stripe_session_id: session.id,
                  active: true,
                  expires_at: expiresAt,
                });
        }

    return NextResponse.json({ received: true });
  }
