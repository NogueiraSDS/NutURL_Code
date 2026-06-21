import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const [totalUsers, totalLinks, totalProfileViews, linksData] = await Promise.all([
      prisma.user.count(),
      prisma.link.count(),
      prisma.profileVisit.count(),
      prisma.link.findMany({
        select: { clicks: true }
      })
    ]);

    // Calculate total shortened link clicks
    const totalClicks = linksData.reduce((acc, curr) => acc + curr.clicks, 0);

    // Get 5 most popular links in system
    const topLinks = await prisma.link.findMany({
      take: 5,
      orderBy: { clicks: 'desc' },
      select: {
        id: true,
        url: true,
        slug: true,
        clicks: true,
        createdAt: true
      }
    });

    // Calculate daily user growth in the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentUsers = await prisma.user.findMany({
      where: {
        createdAt: {
          gte: thirtyDaysAgo
        }
      },
      select: {
        createdAt: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    // Group users by day
    const dailyRegistrations: Record<string, number> = {};
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateString = d.toISOString().split('T')[0];
      dailyRegistrations[dateString] = 0;
    }

    recentUsers.forEach((usr) => {
      const dateString = usr.createdAt.toISOString().split('T')[0];
      if (dailyRegistrations[dateString] !== undefined) {
        dailyRegistrations[dateString]++;
      }
    });

    const growthChartData = Object.entries(dailyRegistrations).map(([date, count]) => ({
      date,
      count
    }));

    return NextResponse.json({
      metrics: {
        totalUsers,
        totalLinks,
        totalClicks,
        totalProfileViews
      },
      topLinks,
      growthChartData
    });
  } catch (error: any) {
    console.error('Error fetching admin metrics:', error);
    return NextResponse.json({ error: 'Failed to fetch admin metrics', details: error.message }, { status: 500 });
  }
}
