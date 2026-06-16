import { prisma } from '@/lib/prisma';
import { notFound, redirect } from 'next/navigation';
import { headers } from 'next/headers';
import RedirectClient from './RedirectClient';

export default async function SlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  const link = await prisma.link.findUnique({
    where: { slug },
  });

  if (!link) {
    notFound();
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
