import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';

// Inicialize o Stripe (precisará da chave secreta no .env.local)
const stripeKey = process.env.STRIPE_SECRET_KEY || 'sk_test_dummy_key_for_build';
const stripe = new Stripe(stripeKey, { apiVersion: '2026-05-27.dahlia' });

export async function POST(request: Request) {
  try {
    const { userId, tier, currency } = await request.json();

    if (!stripeKey) {
      return NextResponse.json({ error: 'Stripe não configurado no servidor (.env.local)' }, { status: 500 });
    }

    if (!userId) {
      return NextResponse.json({ error: 'Usuário não autenticado' }, { status: 401 });
    }

    // Busca o usuário no Prisma para pegar o stripeCustomerId se já existir
    let user = await prisma.user.findUnique({ where: { firebaseUid: userId } });
    if (!user) {
      user = await prisma.user.create({ data: { firebaseUid: userId, tier: 'free' } });
    }

    // Identifica se a moeda solicitada é BRL ou USD (padrão BRL se currency === 'brl' ou 'pt')
    const isBrl = currency === 'brl' || currency === 'pt';

    // Definir o Price ID com base no plano escolhido e na moeda
    let priceId = '';
    if (tier === 'pro') {
      priceId = isBrl 
        ? (process.env.STRIPE_PRICE_ID_BRL_PRO || process.env.STRIPE_PRICE_ID_PRO || 'price_123_PRO')
        : (process.env.STRIPE_PRICE_ID_USD_PRO || process.env.STRIPE_PRICE_ID_PRO || 'price_123_PRO');
    } else if (tier === 'premium') {
      priceId = isBrl
        ? (process.env.STRIPE_PRICE_ID_BRL_PREMIUM || process.env.STRIPE_PRICE_ID_PREMIUM || 'price_123_PREMIUM')
        : (process.env.STRIPE_PRICE_ID_USD_PREMIUM || process.env.STRIPE_PRICE_ID_PREMIUM || 'price_123_PREMIUM');
    } else {
      return NextResponse.json({ error: 'Plano inválido' }, { status: 400 });
    }

    // Criar a Sessão de Checkout
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/plan?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/pricing`,
      client_reference_id: userId,
    };

    if (user.stripeCustomerId) {
      sessionParams.customer = user.stripeCustomerId;
    } else if (user.email) {
      sessionParams.customer_email = user.email;
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json({ error: error.message || 'Erro interno do servidor' }, { status: 500 });
  }
}
