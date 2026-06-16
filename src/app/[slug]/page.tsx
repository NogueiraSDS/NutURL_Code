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

  if (link.expiresAt && link.expiresAt < new Date()) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '2rem', textAlign: 'center' }}>
        <div className="glass" style={{ padding: '4rem', maxWidth: '500px', width: '100%', borderRadius: '16px' }}>
          <h1 style={{ fontSize: '5rem', marginBottom: '1rem', color: 'var(--error)', lineHeight: 1 }}>:(</h1>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem', fontWeight: 800 }}>Ops! Este link expirou.</h2>
          <p style={{ color: '#94a3b8', marginBottom: '2rem', fontSize: '1.1rem' }}>
            O prazo de validade deste link se esgotou. Links criados no plano gratuito expiram após 6 meses.
          </p>
          <a href="/" className="btn" style={{ textDecoration: 'none', display: 'inline-block' }}>
            Crie seu próprio link no NutURL
          </a>
        </div>
      </div>
    );
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
