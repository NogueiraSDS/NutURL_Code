import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { url, userId, hasAd } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL é obrigatória' }, { status: 400 });
    }

    try {
      new URL(url);
    } catch (e) {
      return NextResponse.json({ error: 'URL inválida' }, { status: 400 });
    }

    let slug;
    let isUnique = false;
    
    while (!isUnique) {
      slug = Math.random().toString(36).substring(2, 8);
      const existing = await prisma.link.findUnique({ where: { slug } });
      if (!existing) {
        isUnique = true;
      }
    }

    const link = await prisma.link.create({
      data: {
        url,
        slug: slug!,
        userId: userId || null,
        hasAd: !!hasAd,
      },
    });

    return NextResponse.json({ slug: link.slug });
  } catch (error) {
    console.error('Error shortening url:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
