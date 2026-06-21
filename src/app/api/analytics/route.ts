import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    // 1. Fetch link clicks
    const visits = await prisma.visit.findMany({
      where: { link: { userId } },
      select: { createdAt: true },
      orderBy: { createdAt: 'asc' }
    });

    // 2. Fetch profile visits
    const dbUser = await prisma.user.findUnique({
      where: { firebaseUid: userId },
      include: { profile: true }
    });

    const profileVisits = dbUser?.profile ? await prisma.profileVisit.findMany({
      where: { profileId: dbUser.profile.id },
      select: { createdAt: true },
      orderBy: { createdAt: 'asc' }
    }) : [];

    // 3. Initialize date maps for last 7 days
    const clicksPerDay: Record<string, number> = {};
    const profileVisitsPerDay: Record<string, number> = {};
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
      clicksPerDay[dateStr] = 0;
      profileVisitsPerDay[dateStr] = 0;
    }

    // 4. Fill link clicks
    visits.forEach((v: { createdAt: Date }) => {
      const dateStr = v.createdAt.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
      if (clicksPerDay[dateStr] !== undefined) {
        clicksPerDay[dateStr]++;
      }
    });

    // 5. Fill profile visits
    profileVisits.forEach((v: { createdAt: Date }) => {
      const dateStr = v.createdAt.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
      if (profileVisitsPerDay[dateStr] !== undefined) {
        profileVisitsPerDay[dateStr]++;
      }
    });

    // 6. Popular Bio Links
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

    // 7. Distribution by Hour (0-23)
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

    // 8. Distribution by Day of Week (0-6)
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

    // 9. Map to Recharts structure
    const chartData = Object.keys(clicksPerDay).map(date => ({
      date,
      cliques: clicksPerDay[date]
    }));

    const profileChartData = Object.keys(profileVisitsPerDay).map(date => ({
      date,
      visitas: profileVisitsPerDay[date]
    }));

    return NextResponse.json({ 
      chartData, 
      profileChartData,
      popularBioLinks,
      visitsByHour,
      visitsByDayOfWeek
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
