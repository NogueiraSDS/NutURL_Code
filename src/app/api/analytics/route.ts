import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const visits = await prisma.visit.findMany({
      where: { link: { userId } },
      select: { createdAt: true },
      orderBy: { createdAt: 'asc' }
    });

    const clicksPerDay: Record<string, number> = {};
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
      clicksPerDay[dateStr] = 0;
    }

    visits.forEach(v => {
      const dateStr = v.createdAt.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
      if (clicksPerDay[dateStr] !== undefined) {
        clicksPerDay[dateStr]++;
      }
    });

    const chartData = Object.keys(clicksPerDay).map(date => ({
      date,
      cliques: clicksPerDay[date]
    }));

    return NextResponse.json({ chartData });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
