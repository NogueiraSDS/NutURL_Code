import { prisma } from '@/lib/prisma';
import { notFound, redirect } from 'next/navigation';
import { headers } from 'next/headers';
import RedirectClient from './RedirectClient';
import ExpiredClient from './ExpiredClient';
import ProfileClient from './ProfileClient';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  if (slug.startsWith('%40') || slug.startsWith('@')) {
    const username = slug.replace(/^%40|^@/, '');
    const profile = await prisma.profile.findUnique({
      where: { username },
      select: {
        title: true,
        bio: true,
        avatarUrl: true,
        username: true
      }
    });

    if (profile) {
      const title = profile.title || `@${profile.username}`;
      const description = profile.bio || `Confira a página de links de ${title} no NutURL.`;
      const images = profile.avatarUrl ? [profile.avatarUrl] : [];

      return {
        title: `${title} | NutURL`,
        description,
        alternates: {
          canonical: `/@${profile.username}`,
        },
        openGraph: {
          title,
          description,
          type: 'profile',
          username: profile.username,
          images,
        },
        twitter: {
          card: 'summary',
          title,
          description,
          images,
        }
      };
    }
  }

  return {
    title: 'NutURL - Premium Link-in-Bio & URL Shortener',
    description: 'Crie páginas de links personalizadas e encurte URLs com métricas em tempo real.',
  };
}

export default async function SlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  const headersList = await headers();
  const userAgent = headersList.get('user-agent') || 'Unknown';
  const referer = headersList.get('referer') || 'Direct';

  // Intercept profile routing
  if (slug.startsWith('%40') || slug.startsWith('@')) {
    const username = slug.replace(/^%40|^@/, '');
    const profile = await prisma.profile.findUnique({
      where: { username },
      include: {
        user: true,
        links: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (profile) {
      // Record profile visit
      await prisma.profileVisit.create({
        data: {
          profileId: profile.id,
          userAgent,
          referer,
        },
      }).catch(err => console.error("Error recording profile visit:", err));

      const jsonLd = {
        "@context": "https://schema.org",
        "@type": "ProfilePage",
        "dateCreated": profile.createdAt.toISOString(),
        "dateModified": profile.updatedAt.toISOString(),
        "mainEntity": {
          "@type": "Person",
          "name": profile.title || `@${profile.username}`,
          "alternateName": profile.username,
          "description": profile.bio || "",
          "image": profile.avatarUrl || "",
          "url": `${process.env.NEXT_PUBLIC_APP_URL || 'https://nuturl.com'}/@${profile.username}`
        }
      };

      return (
        <>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
          <ProfileClient profile={profile} />
        </>
      );
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
