import { Metadata } from 'next';
import { seoPagesData } from '@/data/seoProgrammatic';
import SeoToolView from '@/components/SeoToolView';

const data = seoPagesData['encurtador-link-whatsapp'];

export const metadata: Metadata = {
  title: data.title,
  description: data.description,
  alternates: {
    canonical: `https://nuturl.com/${data.slug}`,
  },
  openGraph: {
    title: data.title,
    description: data.description,
    url: `https://nuturl.com/${data.slug}`,
    siteName: 'NutURL',
    type: 'website',
    locale: 'pt_BR',
  },
  twitter: {
    card: 'summary_large_image',
    title: data.title,
    description: data.description,
  },
};

export default function EncurtadorWhatsappPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        name: `NutURL - ${data.h1}`,
        url: `https://nuturl.com/${data.slug}`,
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web',
        description: data.description,
        offers: {
          '@type': 'Offer',
          price: '0.00',
          priceCurrency: 'BRL',
        },
      },
      {
        '@type': 'FAQPage',
        mainEntity: data.faq.map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.a,
          },
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SeoToolView data={data} />
    </>
  );
}
