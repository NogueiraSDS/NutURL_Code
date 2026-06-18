'use client';

import { useState } from 'react';
import { useI18n } from '@/context/I18nContext';
import { useRouter } from 'next/navigation';
import { blogArticles } from '@/data/blogArticles';
import styles from './blog.module.css';

export default function BlogHome() {
  const { locale, setLocale, t } = useI18n();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleBack = () => {
    router.push('/');
  };

  const handleArticleClick = (slug: string) => {
    router.push(`/blog/${slug}`);
  };

  // Filter articles based on query
  const filteredArticles = blogArticles.filter((article) => {
    const titleText = article.title[locale].toLowerCase();
    const subtitleText = article.subtitle[locale].toLowerCase();
    const query = searchQuery.toLowerCase();
    return titleText.includes(query) || subtitleText.includes(query);
  });

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
          {locale === 'pt' ? '← Voltar para Home' : '← Back to Home'}
        </button>
      </div>

      {/* Hero Header */}
      <header className={styles.header}>
        <h1 className={styles.title}>{t('blog.title') || 'Blog NutURL'}</h1>
        <p className={styles.subtitle}>
          {t('blog.subtitle') || 'Artigos sobre marketing digital, branding, links na bio e otimização de tráfego.'}
        </p>

        {/* Search Bar */}
        <div className={styles.searchWrapper}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('blog.searchPlaceholder') || 'Buscar artigos...'}
            className="input"
            style={{ width: '100%', maxWidth: '500px' }}
          />
        </div>
      </header>

      {/* Articles Grid */}
      <main className={styles.articlesGrid}>
        {filteredArticles.length > 0 ? (
          filteredArticles.map((article) => (
            <article
              key={article.slug}
              onClick={() => handleArticleClick(article.slug)}
              className={`glass ${styles.articleCard}`}
            >
              <div className={styles.cardHeader}>
                <span className={styles.categoryBadge}>{article.category[locale]}</span>
                <span className={styles.readTime}>
                  {t('blog.readTime').replace('{time}', String(article.readTime)) || `${article.readTime} min read`}
                </span>
              </div>
              <h2 className={styles.cardTitle}>{article.title[locale]}</h2>
              <p className={styles.cardSubtitle}>{article.subtitle[locale]}</p>
              <div className={styles.cardFooter}>
                <span className={styles.date}>{formatDate(article.date)}</span>
                <span className={styles.readMore}>
                  {locale === 'pt' ? 'Ler mais →' : 'Read more →'}
                </span>
              </div>
            </article>
          ))
        ) : (
          <div className={styles.noResults}>
            <p>
              {locale === 'pt'
                ? 'Nenhum artigo encontrado para a busca realizada.'
                : 'No articles found matching your query.'}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
