'use client';

import { useParams, useRouter } from 'next/navigation';
import { useI18n } from '@/context/I18nContext';
import { blogArticles } from '@/data/blogArticles';
import styles from './article.module.css';

export default function ArticleClient() {
  const params = useParams();
  const router = useRouter();
  const { locale, setLocale, t } = useI18n();

  const slug = params?.slug as string;
  const article = blogArticles.find((a) => a.slug === slug);

  const handleBack = () => {
    router.push('/blog');
  };

  if (!article) {
    return (
      <div className={styles.container}>
        <div className={`glass ${styles.card}`} style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <h1 style={{ fontSize: '2rem', color: '#ef4444', marginBottom: '1rem' }}>
            {locale === 'pt' ? 'Artigo Não Encontrado' : 'Article Not Found'}
          </h1>
          <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>
            {locale === 'pt'
              ? 'Desculpe, o artigo que você está procurando não existe ou foi removido.'
              : 'Sorry, the article you are looking for does not exist or has been removed.'}
          </p>
          <button onClick={handleBack} className="btn">
            {locale === 'pt' ? 'Voltar para o Blog' : 'Back to Blog'}
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(locale === 'pt' ? 'pt-BR' : 'en-US', options);
  };

  return (
    <div className={styles.container}>
      {/* Top Navigation */}
      <div className={styles.topNav}>
        <button onClick={() => setLocale(locale === 'pt' ? 'en' : 'pt')} className={styles.navBtn}>
          {locale === 'pt' ? '🇺🇸 English' : '🇧🇷 Português'}
        </button>
        <button onClick={handleBack} className={styles.navBtn}>
          {t('blog.back') || '← Voltar para o Blog'}
        </button>
      </div>

      <article className={`glass ${styles.card}`}>
        {/* Category & Info */}
        <div className={styles.metaHeader}>
          <span className={styles.categoryBadge}>{article.category[locale]}</span>
          <div className={styles.metaStats}>
            <span>{formatDate(article.date)}</span>
            <span className={styles.bullet}>•</span>
            <span>{t('blog.readTime').replace('{time}', String(article.readTime)) || `${article.readTime} min read`}</span>
          </div>
        </div>

        {/* Title & Subtitle */}
        <h1 className={styles.title}>{article.title[locale]}</h1>
        <p className={styles.subtitle}>{article.subtitle[locale]}</p>

        {/* Divider */}
        <div className={styles.divider}></div>

        {/* Article Body */}
        <div
          className={styles.articleBody}
          dangerouslySetInnerHTML={{ __html: article.content[locale] }}
        />

        {/* Article Footer */}
        <div className={styles.articleFooter}>
          <button onClick={handleBack} className={styles.backBtn}>
            {t('blog.back') || '← Voltar para o Blog'}
          </button>
        </div>
      </article>
    </div>
  );
}
