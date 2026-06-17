import { prisma } from '@/lib/prisma';
import { notFound, redirect } from 'next/navigation';
import { headers } from 'next/headers';
import RedirectClient from './RedirectClient';
import ExpiredClient from './ExpiredClient';
import ProfileClient from './ProfileClient';

export default async function SlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  // Intercept profile routing
  if (slug.startsWith('%40') || slug.startsWith('@')) {
    const username = slug.replace(/^%40|^@/, '');
    const profile = await prisma.profile.findUnique({
      where: { username },
      include: {
        links: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (profile) {
      return <ProfileClient profile={profile} />;
    } else {
      notFound();
    }
  }

  const link = await prisma.link.findUnique({
    where: { slug },
  });

  if (!link) {
    notFound();
  }

  if (link.expiresAt && link.expiresAt < new Date()) {
    return <ExpiredClient />;
  }

  const headersList = await headers();
  const userAgent = headersList.get('user-agent') || 'Unknown';
  const referer = headersList.get('referer') || 'Direct';

  await Promise.all([
    prisma.link.update({
      where: { slug },
      data: { clicks: { increment: 1 } },
    }),
    prisma.visit.create({
      data: {
        linkId: link.id,
        userAgent,
        referer,
      },
    })
  ]);

  if (!link.hasAd) {
    redirect(link.url);
  }

  return <RedirectClient url={link.url} />;
}
