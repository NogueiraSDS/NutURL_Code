import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';

const stripeKey = process.env.STRIPE_SECRET_KEY || 'sk_test_dummy_key_for_build';
const stripe = new Stripe(stripeKey, { apiVersion: '2026-05-27.dahlia' });

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'Usuário não autenticado' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { firebaseUid: userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    if (user.tier === 'free') {
      return NextResponse.json({ error: 'Você já está no plano gratuito' }, { status: 400 });
    }

    let stripeCancelled = false;

    // Se houver stripeCustomerId vinculado, cancela as assinaturas ativas diretamente no Stripe
    if (user.stripeCustomerId && stripeKey && !stripeKey.includes('dummy')) {
      try {
        const subscriptions = await stripe.subscriptions.list({
          customer: user.stripeCustomerId,
          status: 'active',
        });

        for (const sub of subscriptions.data) {
          await stripe.subscriptions.cancel(sub.id);
          stripeCancelled = true;
        }

        // Também cancela assinaturas em período de teste se houver
        const trialingSubs = await stripe.subscriptions.list({
          customer: user.stripeCustomerId,
          status: 'trialing',
        });
        for (const sub of trialingSubs.data) {
          await stripe.subscriptions.cancel(sub.id);
          stripeCancelled = true;
        }
      } catch (stripeErr: any) {
        console.error('Erro ao cancelar assinatura no Stripe:', stripeErr);
      }
    }

    // Atualiza o usuário imediatamente no banco de dados para 'free'
    await prisma.user.update({
      where: { firebaseUid: userId },
      data: { tier: 'free' },
    });

    return NextResponse.json({
      success: true,
      message: 'Plano cancelado com sucesso. Sua conta retornou ao plano gratuito.',
      stripeCancelled,
    });
  } catch (error: any) {
    console.error('Erro ao processar cancelamento de plano:', error);
    return NextResponse.json({ error: error.message || 'Erro interno ao cancelar plano' }, { status: 500 });
  }
}
