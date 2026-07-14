import { Metadata } from 'next';
import { blogArticles } from '@/data/blogArticles';
import ArticleClient from './ArticleClient';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const article = blogArticles.find((a) => a.slug === slug);

  if (!article) {
    return {
      title: 'Artigo não encontrado | NutURL Blog',
      description: 'O artigo que você está procurando não existe ou foi removido.',
    };
  }

  // We are generating SEO in Portuguese as the primary language for indexing
  const keywords = article.subtitle.pt
    .toLowerCase()
    .replace(/[.,:;!?()]/g, '')
    .split(' ')
    .filter((word) => word.length > 2); // Palavras com mais de 2 letras

  return {
    title: `${article.title.pt} | NutURL Blog`,
    description: article.subtitle.pt,
    keywords,
    openGraph: {
      title: article.title.pt,
      description: article.subtitle.pt,
      type: 'article',
      publishedTime: article.date,
      authors: ['NutURL'],
      url: `https://nuturl.com/blog/${slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title.pt,
      description: article.subtitle.pt,
    },
  };
}

export default async function Page() {
  return <ArticleClient />;
}
