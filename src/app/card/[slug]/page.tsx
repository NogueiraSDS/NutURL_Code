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
    <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 sm:p-6 py-12 relative overflow-x-hidden">
      {/* Decorative ambient gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 translate-y-1/2 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full">
        <BusinessCardView card={card} />
      </div>
    </main>
  );
}
