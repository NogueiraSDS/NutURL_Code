'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/context/I18nContext';

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();
  const { t, locale, setLocale } = useI18n();
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [shortUrl, setShortUrl] = useState('');
  const [error, setError] = useState('');
  const [hasAd, setHasAd] = useState(true); // Default to true (Ad) for free users
  const [customAlias, setCustomAlias] = useState('');
  const [tier, setTier] = useState('free');

  useEffect(() => {
    if (user) {
      fetch(`/api/me?userId=${user.uid}`)
        .then(res => res.json())
        .then(data => {
          setTier(data.tier);
          if (data.tier !== 'free') {
            setHasAd(false); // Default to direct for pro/premium
          }
        })
        .catch(console.error);
    } else {
      setTier('free');
      setHasAd(true);
    }
  }, [user]);

  const handleShorten = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    try {
      setIsLoading(true);
      setError('');
      setShortUrl('');

      const res = await fetch('/api/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, userId: user?.uid, hasAd, customAlias }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erro ao encurtar a URL');
      }

      setShortUrl(`https://wnut.me/${data.slug}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortUrl);
    alert('Link copiado!');
  };

  return (
    <div className={styles.container} style={{ position: 'relative', width: '100%' }}>
      <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', zIndex: 10, display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <button onClick={() => setLocale(locale === 'pt' ? 'en' : 'pt')} className="btn" style={{ padding: '6px 12px', background: 'transparent', border: '1px solid #94a3b8', color: '#94a3b8', fontSize: '0.8rem' }}>
          {locale === 'pt' ? '🇺🇸 EN' : '🇧🇷 PT'}
        </button>
        <button onClick={() => router.push('/pricing')} className="btn" style={{ padding: '8px 16px', background: 'transparent', border: '1px solid #f59e0b', color: '#f59e0b' }}>{t('home.plans')}</button>
        {user ? (
          <button onClick={() => router.push('/dashboard')} className="btn" style={{ padding: '8px 16px', background: 'transparent', border: '1px solid var(--primary)' }}>{t('home.myDashboard')}</button>
        ) : (
          <button onClick={() => router.push('/login')} className="btn" style={{ padding: '8px 16px', background: 'transparent', border: '1px solid var(--primary)' }}>{t('home.login')}</button>
        )}
      </div>

      <div className={`${styles.hero} animate-fade-in`}>
        <h1 className={styles.title}>
          {t('home.shortenShare').split('.')[0]}. <span className="text-gradient">{t('home.shortenShare').split('.')[1]}.</span>
        </h1>
        <p className={styles.subtitle}>
          {t('home.subtitle')}
        </p>
      </div>

      <div className={`glass ${styles.shortenerBox} animate-fade-in`} style={{ animationDelay: '0.2s' }}>
        <form onSubmit={handleShorten} className={styles.inputGroup}>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder={t('home.placeholder')}
            className="input"
            required
          />
          <button type="submit" className="btn" disabled={isLoading}>
            {isLoading ? t('home.btnShortening') : t('home.btnShorten')}
          </button>
        </form>

        {tier === 'premium' && (
          <div style={{ marginTop: '1.25rem', width: '100%' }}>
            <input 
              type="text" 
              value={customAlias} 
              onChange={(e) => setCustomAlias(e.target.value)} 
              placeholder={t('home.aliasPlaceholder')}
              className="input" 
              style={{ width: '100%' }} 
            />
          </div>
        )}

        <div style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'flex-start' }}>
          <label className="switch-container" style={{ opacity: tier === 'free' ? 0.5 : 1, cursor: tier === 'free' ? 'not-allowed' : 'pointer' }}>
            <span className="switch">
              <input 
                type="checkbox" 
                checked={hasAd} 
                onChange={(e) => setHasAd(e.target.checked)} 
                disabled={tier === 'free'}
              />
              <span className="slider"></span>
            </span>
            <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
              {hasAd ? t('home.adWaitPage') : t('home.directRedirect')}
              {tier === 'free' && <span style={{ marginLeft: '10px', fontSize: '0.75rem', background: 'var(--primary)', color: 'white', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>{t('home.requiresPro')}</span>}
            </span>
          </label>
        </div>

        {error && <p style={{ color: 'var(--error)', marginTop: '1rem' }}>{error}</p>}

        {shortUrl && (
          <div className={styles.resultBox}>
            <p>{t('home.ready')}</p>
            <a href={shortUrl} target="_blank" rel="noopener noreferrer" className={styles.shortLink}>
              {shortUrl}
            </a>
            <button onClick={copyToClipboard} className="btn" style={{ background: '#475569' }}>
              {t('home.copyLink')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
