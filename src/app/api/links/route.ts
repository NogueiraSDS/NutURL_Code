import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const links = await prisma.link.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ links });
  } catch (error) {
    console.error('Error fetching links:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { linkId, hasAd } = await request.json();

    if (!linkId) {
      return NextResponse.json({ error: 'ID do link é obrigatório' }, { status: 400 });
    }

    const updatedLink = await prisma.link.update({
      where: { id: linkId },
      data: { hasAd: !!hasAd }
    });

    return NextResponse.json({ link: updatedLink });
  } catch (error) {
    console.error('Error updating link:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const linkId = searchParams.get('linkId');

    if (!linkId) {
      return NextResponse.json({ error: 'ID do link é obrigatório' }, { status: 400 });
    }

    // Deletar as visitas associadas primeiro para evitar erro de Foreign Key
    await prisma.visit.deleteMany({
      where: { linkId }
    });

    await prisma.link.delete({
      where: { id: linkId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting link:', error);
    return NextResponse.json({ error: 'Erro interno do servidor ao deletar' }, { status: 500 });
  }
}
