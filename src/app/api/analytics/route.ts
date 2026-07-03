import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const period = searchParams.get('period') || '7d';

    if (!userId) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    // 1. Calcular a data de início baseada no período
    let startDate = new Date();
    let daysToGenerate = 7;
    let isHourly = false;

    if (period === '24h') {
      startDate.setHours(startDate.getHours() - 24);
      isHourly = true;
    } else if (period === '7d') {
      startDate.setDate(startDate.getDate() - 7);
      daysToGenerate = 7;
    } else if (period === '15d') {
      startDate.setDate(startDate.getDate() - 15);
      daysToGenerate = 15;
    } else if (period === '30d') {
      startDate.setDate(startDate.getDate() - 30);
      daysToGenerate = 30;
    } else if (period === '6m') {
      startDate.setMonth(startDate.getMonth() - 6);
      daysToGenerate = 180;
    }

    // 2. Fetch link clicks no período
    const visits = await prisma.visit.findMany({
      where: { 
        link: { userId },
        createdAt: { gte: startDate }
      },
      include: {
        link: { select: { id: true, url: true, slug: true, createdAt: true } }
      },
      orderBy: { createdAt: 'asc' }
    });

    // 3. Fetch profile visits no período
    const dbUser = await prisma.user.findUnique({
      where: { firebaseUid: userId },
      include: { profile: true }
    });

    const profileVisits = dbUser?.profile ? await prisma.profileVisit.findMany({
      where: { 
        profileId: dbUser.profile.id,
        createdAt: { gte: startDate }
      },
      select: { createdAt: true },
      orderBy: { createdAt: 'asc' }
    }) : [];

    // 4. Inicializar mapas do gráfico
    const clicksPerDate: Record<string, number> = {};
    const profileVisitsPerDate: Record<string, number> = {};
    
    if (isHourly) {
      for (let i = 23; i >= 0; i--) {
        const d = new Date();
        d.setHours(d.getHours() - i);
        const dateStr = `${d.getHours().toString().padStart(2, '0')}:00`;
        clicksPerDate[dateStr] = 0;
        profileVisitsPerDate[dateStr] = 0;
      }
    } else {
      for (let i = daysToGenerate - 1; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
        clicksPerDate[dateStr] = 0;
        profileVisitsPerDate[dateStr] = 0;
      }
    }

    // 5. Preencher dados de cliques no mapa
    visits.forEach((v: { createdAt: Date }) => {
      let dateStr = '';
      if (isHourly) {
        dateStr = `${v.createdAt.getHours().toString().padStart(2, '0')}:00`;
      } else {
        dateStr = v.createdAt.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
      }
      if (clicksPerDate[dateStr] !== undefined) {
        clicksPerDate[dateStr]++;
      }
    });

    // 6. Preencher dados de visitas do perfil no mapa
    profileVisits.forEach((v: { createdAt: Date }) => {
      let dateStr = '';
      if (isHourly) {
        dateStr = `${v.createdAt.getHours().toString().padStart(2, '0')}:00`;
      } else {
        dateStr = v.createdAt.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
      }
      if (profileVisitsPerDate[dateStr] !== undefined) {
        profileVisitsPerDate[dateStr]++;
      }
    });

    // 7. Mapear para o formato do Recharts
    const chartData = Object.keys(clicksPerDate).map(date => ({
      date,
      cliques: clicksPerDate[date]
    }));

    const profileChartData = Object.keys(profileVisitsPerDate).map(date => ({
      date,
      visitas: profileVisitsPerDate[date]
    }));

    // 8. Calcular Top 20 Links baseado nas visitas deste período
    const linkCounts: Record<string, { count: number, url: string, slug: string, id: string, createdAt: Date }> = {};
    visits.forEach((v: any) => {
      if (!linkCounts[v.link.id]) {
        linkCounts[v.link.id] = { count: 0, url: v.link.url, slug: v.link.slug, id: v.link.id, createdAt: v.link.createdAt };
      }
      linkCounts[v.link.id].count++;
    });
    const top20Links = Object.values(linkCounts).sort((a, b) => b.count - a.count).slice(0, 20);

    // 9. Popular Bio Links (isso é para o card lateral e usa cliques globais do profile_links)
    const popularBioLinks = dbUser?.profile ? await prisma.profileLink.findMany({
      where: { profileId: dbUser.profile.id },
      orderBy: { clicks: 'desc' },
      select: {
        id: true,
        title: true,
        url: true,
        clicks: true,
        icon: true
      },
      take: 5
    }) : [];

    // 10. Distribuição por Hora Global (0-23)
    const hoursMap: Record<number, number> = {};
    for (let i = 0; i < 24; i++) {
      hoursMap[i] = 0;
    }
    profileVisits.forEach((v: { createdAt: Date }) => {
      const hour = new Date(v.createdAt).getHours();
      hoursMap[hour]++;
    });
    const visitsByHour = Object.keys(hoursMap).map((h) => {
      const hourNum = parseInt(h);
      return {
        hour: `${hourNum.toString().padStart(2, '0')}:00`,
        visitas: hoursMap[hourNum]
      };
    });

    // 11. Distribuição por Dia da Semana Global (0-6)
    const daysMap: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
    profileVisits.forEach((v: { createdAt: Date }) => {
      const day = new Date(v.createdAt).getDay();
      daysMap[day]++;
    });
    const weekdaysPt = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const visitsByDayOfWeek = Object.keys(daysMap).map((d) => {
      const dayNum = parseInt(d);
      return {
        day: weekdaysPt[dayNum],
        visitas: daysMap[dayNum]
      };
    });

    return NextResponse.json({ 
      chartData, 
      profileChartData,
      popularBioLinks,
      top20Links,
      visitsByHour,
      visitsByDayOfWeek
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
