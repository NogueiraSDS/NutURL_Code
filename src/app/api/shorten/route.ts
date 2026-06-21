import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { url, userId, userEmail, hasAd, customAlias } = await request.json();
    
    if (!url) {
      return NextResponse.json({ error: 'URL é obrigatória' }, { status: 400 });
    }

    try {
      new URL(url);
    } catch (e) {
      return NextResponse.json({ error: 'URL inválida' }, { status: 400 });
    }

    let userTier = 'free';
    if (userId) {
      const userRecord = await prisma.user.findUnique({ where: { firebaseUid: userId } });
      if (userRecord) {
        userTier = userRecord.tier;
        if (userEmail && userRecord.email !== userEmail) {
          await prisma.user.update({
            where: { firebaseUid: userId },
            data: { email: userEmail }
          });
        }
      } else {
        await prisma.user.create({ data: { firebaseUid: userId, tier: 'free', email: userEmail } });
      }
    }
    
    // Secret override for testing
    if (userEmail === 'erivandons@gmail.com') {
      userTier = 'premium';
    }

    let finalHasAd = !!hasAd;
    let expiresAt: Date | null = null;
    let finalSlug: string | null = null;

    if (userTier === 'free') {
      finalHasAd = true; 
      expiresAt = new Date(Date.now() + 180 * 24 * 60 * 60 * 1000); 
    } else if (userTier === 'pro') {
      expiresAt = null;
    } else if (userTier === 'premium') {
      expiresAt = null;
      if (customAlias) {
        const aliasClean = customAlias.trim().replace(/[^a-zA-Z0-9_-]/g, '');
        if (aliasClean.length < 3) {
          return NextResponse.json({ error: 'Alias customizado deve ter pelo menos 3 caracteres permitidos (letras, números, hífens e underlines).' }, { status: 400 });
        }
        const existing = await prisma.link.findUnique({ where: { slug: aliasClean } });
        if (existing) {
          return NextResponse.json({ error: 'Este link customizado já está em uso.' }, { status: 400 });
        }
        finalSlug = aliasClean;
      }
    }

    if (!finalSlug) {
      let isUnique = false;
      while (!isUnique) {
        finalSlug = Math.random().toString(36).substring(2, 8);
        const existing = await prisma.link.findUnique({ where: { slug: finalSlug } });
        if (!existing) {
          isUnique = true;
        }
      }
    }

    const link = await prisma.link.create({
      data: {
        url,
        slug: finalSlug as string,
        userId: userId || null,
        hasAd: finalHasAd,
        expiresAt,
      },
    });

    return NextResponse.json({ slug: link.slug });
  } catch (error) {
    console.error('Error shortening url:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
