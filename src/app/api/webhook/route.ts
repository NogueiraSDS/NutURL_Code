import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import { headers } from 'next/headers';

const stripeKey = process.env.STRIPE_SECRET_KEY || 'sk_test_dummy_key_for_build';
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_dummy_key_for_build';
const stripe = new Stripe(stripeKey, { apiVersion: '2026-05-27.dahlia' });

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const headersList = await headers();
    const sig = headersList.get('stripe-signature') as string;

    if (!stripeKey || !endpointSecret) {
      return NextResponse.json({ error: 'Stripe não configurado no servidor' }, { status: 500 });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
    } catch (err: any) {
      console.error('Webhook signature verification failed.', err.message);
      return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    // Lidar com o evento de pagamento concluído
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      
      const firebaseUid = session.client_reference_id;
      const stripeCustomerId = session.customer as string;

      if (firebaseUid) {
        // Descobrir qual plano foi assinado baseado no price_id
        const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
        const priceId = lineItems.data[0]?.price?.id;
        
        let newTier = 'pro';
        if (priceId === process.env.STRIPE_PRICE_ID_PREMIUM) {
          newTier = 'premium';
        }

        await prisma.user.update({
          where: { firebaseUid },
          data: {
            stripeCustomerId,
            tier: newTier,
          },
        });
        console.log(`Usuário ${firebaseUid} atualizado para ${newTier} no banco de dados!`);
      }
    }

    // Lidar com assinatura cancelada ou pagamento falho futuramente...
    if (event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object as Stripe.Subscription;
      const stripeCustomerId = subscription.customer as string;
      
      await prisma.user.update({
        where: { stripeCustomerId },
        data: { tier: 'free' },
      });
      console.log(`Assinatura do cliente ${stripeCustomerId} cancelada. Tier voltou para free.`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Erro interno no webhook' }, { status: 500 });
  }
}
