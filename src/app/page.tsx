'use client';

import { useState } from 'react';
import styles from './page.module.css';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [shortUrl, setShortUrl] = useState('');
  const [error, setError] = useState('');
  const [hasAd, setHasAd] = useState(false);

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
        body: JSON.stringify({ url, userId: user?.uid, hasAd }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erro ao encurtar a URL');
      }

      setShortUrl(`${window.location.origin}/${data.slug}`);
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
      <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', zIndex: 10 }}>
        {user ? (
          <button onClick={() => router.push('/dashboard')} className="btn" style={{ padding: '8px 16px', background: 'transparent', border: '1px solid var(--primary)' }}>Meu Dashboard</button>
        ) : (
          <button onClick={() => router.push('/login')} className="btn" style={{ padding: '8px 16px', background: 'transparent', border: '1px solid var(--primary)' }}>Fazer Login</button>
        )}
      </div>

      <div className={`${styles.hero} animate-fade-in`}>
        <h1 className={styles.title}>
          Encurte. <span className="text-gradient">Compartilhe.</span>
        </h1>
        <p className={styles.subtitle}>
          A plataforma premium para gestão de links do seu projeto.
        </p>
      </div>

      <div className={`glass ${styles.shortenerBox} animate-fade-in`} style={{ animationDelay: '0.2s' }}>
        <form onSubmit={handleShorten} className={styles.inputGroup}>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Cole seu link longo aqui..."
            className="input"
            required
          />
          <button type="submit" className="btn" disabled={isLoading}>
            {isLoading ? 'Encurtando...' : 'Encurtar'}
          </button>
        </form>

        <div style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'flex-start' }}>
          <label className="switch-container">
            <span className="switch">
              <input 
                type="checkbox" 
                checked={hasAd} 
                onChange={(e) => setHasAd(e.target.checked)} 
              />
              <span className="slider"></span>
            </span>
            <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
              {hasAd ? 'Exibir Página de Espera (Ad ⏳)' : 'Redirecionamento Direto (⚡)'}
            </span>
          </label>
        </div>

        {error && <p style={{ color: 'var(--error)', marginTop: '1rem' }}>{error}</p>}

        {shortUrl && (
          <div className={styles.resultBox}>
            <p>Seu link curto está pronto:</p>
            <a href={shortUrl} target="_blank" rel="noopener noreferrer" className={styles.shortLink}>
              {shortUrl}
            </a>
            <button onClick={copyToClipboard} className="btn" style={{ background: '#475569' }}>
              Copiar Link
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
