import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import BusinessCardView from '@/components/BusinessCardView';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const card = await prisma.businessCard.findUnique({
    where: { slug: slug.toLowerCase() },
  });

  if (!card) {
    return {
      title: 'Cartão de Visita não encontrado | NutURL',
    };
  }

  const title = `${card.fullName} - Cartão de Visita Digital | NutURL`;
  const description = [card.role, card.company, card.city, card.notes]
    .filter(Boolean)
    .join(' • ') || `Cartão de visita digital de ${card.fullName}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: card.avatarUrl ? [{ url: card.avatarUrl }] : [],
    },
    twitter: {
      card: 'summary',
      title,
      description,
      images: card.avatarUrl ? [card.avatarUrl] : [],
    },
  };
}

export default async function PublicBusinessCardPage({ params }: PageProps) {
  const { slug } = await params;

  const card = await prisma.businessCard.findUnique({
    where: { slug: slug.toLowerCase() },
  });

  if (!card) {
    notFound();
  }

  return (
    <main style={{
      minHeight: '100vh',
      backgroundColor: '#090d16',
      color: '#f8fafc',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem',
      position: 'relative',
      overflowX: 'hidden'
    }}>
      {/* Decorative ambient gradients */}
      <div style={{
        position: 'absolute',
        top: '25%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '380px',
        height: '380px',
        borderRadius: '50%',
        background: 'rgba(59, 130, 246, 0.15)',
        filter: 'blur(80px)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '25%',
        left: '50%',
        transform: 'translate(-50%, 50%)',
        width: '380px',
        height: '380px',
        borderRadius: '50%',
        background: 'rgba(168, 85, 247, 0.15)',
        filter: 'blur(80px)',
        pointerEvents: 'none'
      }} />

      <div style={{ position: 'relative', zIndex: 1, width: '100%' }}>
        <BusinessCardView card={card} />
      </div>
    </main>
  );
}
