import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: {
        profile: {
          select: {
            id: true,
            username: true,
            title: true,
            theme: true,
            _count: {
              select: {
                links: true // ProfileLink count
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Count shortened links by grouping by userId (firebaseUid)
    const linkCounts = await prisma.link.groupBy({
      by: ['userId'],
      _count: {
        id: true
      },
      where: {
        userId: { not: null }
      }
    });

    const linkCountsMap = linkCounts.reduce((acc, curr) => {
      if (curr.userId) {
        acc[curr.userId] = curr._count.id;
      }
      return acc;
    }, {} as Record<string, number>);

    const usersWithStats = users.map((usr) => {
      const shortenedCount = linkCountsMap[usr.firebaseUid] || 0;
      const bioCount = usr.profile?._count?.links || 0;
      return {
        ...usr,
        shortenedLinksCount: shortenedCount,
        bioLinksCount: bioCount,
        totalLinksCount: shortenedCount + bioCount
      };
    });

    return NextResponse.json({ users: usersWithStats });
  } catch (error: any) {
    console.error('Error fetching admin users:', error);
    return NextResponse.json({ error: 'Failed to fetch admin users', details: error.message }, { status: 500 });
  }
}
