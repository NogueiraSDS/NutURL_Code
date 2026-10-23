'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import NutUrlLogo from '@/components/NutUrlLogo';
import { SeoProgrammaticPage } from '@/data/seoProgrammatic';

export default function SeoToolView({ data }: { data: SeoProgrammaticPage }) {
  const router = useRouter();

  // Inputs
  const [url, setUrl] = useState('');
  const [bioUsername, setBioUsername] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  // FAQ Accordion
  const [openFaq, setOpenFaq] = useState<number | null>(null);

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
        body: JSON.stringify({ url }),
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.error || 'Erro ao encurtar o link');
      }

      setShortUrl(`https://wnet.me/${resData.slug}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (shortUrl) {
      navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloader = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      router.push(`/downloader?url=${encodeURIComponent(url.trim())}`);
    } else {
      router.push('/downloader');
    }
  };

  const handleBio = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = bioUsername.trim().replace(/^@/, '');
    if (clean) {
      router.push(`/login?username=${encodeURIComponent(clean)}`);
    } else {
      router.push('/login');
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#f8fafc', padding: '0 1rem 4rem' }}>
      {/* Top Navbar */}
      <nav style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '1.5rem 0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid rgba(255,255,255,0.06)'
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none', color: '#fff' }}>
          <NutUrlLogo size={32} />
          <span style={{ fontWeight: 800, fontSize: '1.4rem' }}>
            Nut<span style={{ color: 'var(--primary)' }}>URL</span>
          </span>
        </Link>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Link href="/downloader" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem' }}>
            Downloader
          </Link>
          <Link href="/pricing" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem' }}>
            Planos
          </Link>
          <Link
            href="/login"
            className="btn"
            style={{
              padding: '8px 18px',
              background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
              color: '#fff',
              fontSize: '0.85rem',
              fontWeight: 700,
              borderRadius: '8px',
              textDecoration: 'none'
            }}
          >
            Cadastrar Grátis
          </Link>
        </div>
      </nav>

      {/* Hero Container */}
      <header style={{
        maxWidth: '900px',
        margin: '3.5rem auto 3rem',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.25rem'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '6px 14px',
          borderRadius: '9999px',
          background: 'rgba(99, 102, 241, 0.15)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          color: '#c7d2fe',
          fontSize: '0.85rem',
          fontWeight: 600
        }}>
          ⚡ Ferramenta 100% Gratuita • NutURL Oficial
        </div>

        <h1 style={{
          fontSize: 'clamp(1.8rem, 4vw, 2.75rem)',
          fontWeight: 800,
          lineHeight: 1.2,
          letterSpacing: '-0.02em',
          margin: 0
        }}>
          {data.h1}
        </h1>

        <p style={{
          fontSize: '1.15rem',
          color: '#94a3b8',
          maxWidth: '700px',
          lineHeight: 1.6,
          margin: 0
        }}>
          {data.description}
        </p>

        {/* Interactive Tool Widget */}
        <div className="glass" style={{
          width: '100%',
          maxWidth: '680px',
          marginTop: '1.5rem',
          padding: '2.25rem',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          textAlign: 'left'
        }}>
          {/* Caso 1: Encurtador */}
          {data.toolType === 'shortener' && (
            <>
              <form onSubmit={handleShorten} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Cole seu link longo aqui (ex: https://seusite.com/promocao)..."
                  className="input"
                  style={{ flex: 1, minWidth: '240px' }}
                  required
                />
                <button
                  type="submit"
                  className="btn"
                  disabled={isLoading}
                  style={{
                    background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                    color: '#fff',
                    fontWeight: 700,
                    padding: '12px 24px'
                  }}
                >
                  {isLoading ? 'Encurtando...' : 'Encurtar Link (wnet.me)'}
                </button>
              </form>

              {error && <p style={{ color: 'var(--error)', margin: 0, fontSize: '0.9rem' }}>{error}</p>}

              {shortUrl && (
                <div style={{
                  padding: '1.25rem',
                  background: 'rgba(16, 185, 129, 0.08)',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  flexWrap: 'wrap'
                }}>
                  <a href={shortUrl} target="_blank" rel="noreferrer" style={{ color: '#10b981', fontWeight: 700, fontSize: '1.1rem', textDecoration: 'none' }}>
                    {shortUrl}
                  </a>
                  <button
                    onClick={handleCopy}
                    className="btn"
                    style={{ background: '#475569', padding: '6px 14px', fontSize: '0.85rem' }}
                  >
                    {copied ? 'Copiado! ✓' : 'Copiar'}
                  </button>
                </div>
              )}
            </>
          )}

          {/* Caso 2: Downloader */}
          {data.toolType === 'downloader' && (
            <form onSubmit={handleDownloader} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Cole o link do TikTok, Reels, Shorts ou YouTube..."
                className="input"
                style={{ flex: 1, minWidth: '240px' }}
                required
              />
              <button
                type="submit"
                className="btn"
                style={{
                  background: '#3b82f6',
                  color: '#fff',
                  fontWeight: 700,
                  padding: '12px 24px'
                }}
              >
                Buscar Vídeo ➔
              </button>
            </form>
          )}

          {/* Caso 3: Bio */}
          {data.toolType === 'bio' && (
            <form onSubmit={handleBio} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '10px',
                padding: '0 0.75rem',
                flex: 1,
                minWidth: '240px'
              }}>
                <span style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 600 }}>nuturl.com/@</span>
                <input
                  type="text"
                  value={bioUsername}
                  onChange={(e) => setBioUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                  placeholder="seunome"
                  style={{ background: 'transparent', border: 'none', color: '#fff', padding: '0.75rem 0.5rem', outline: 'none', width: '100%', fontSize: '1rem' }}
                  required
                />
              </div>
              <button
                type="submit"
                className="btn"
                style={{
                  background: '#10b981',
                  color: '#fff',
                  fontWeight: 700,
                  padding: '12px 24px'
                }}
              >
                Reivindicar Link
              </button>
            </form>
          )}
        </div>
      </header>

      {/* Como Funciona em 3 Passos */}
      <section style={{ maxWidth: '950px', margin: '4rem auto', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '2.5rem' }}>
          Como funciona em 3 passos simples
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.5rem',
          textAlign: 'left'
        }}>
          {data.steps.map((step, idx) => (
            <div key={idx} className="glass" style={{
              padding: '1.75rem',
              borderRadius: '16px',
              border: '1px solid rgba(255,255,255,0.06)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#60a5fa', margin: 0 }}>
                {step.title}
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.5, margin: 0 }}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Foco da Copy & Card de Conversão Pós-Uso */}
      <section style={{ maxWidth: '950px', margin: '4rem auto' }}>
        <div className="glass" style={{
          padding: '2.5rem',
          borderRadius: '20px',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(99, 102, 241, 0.08) 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '1.25rem'
        }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', margin: 0 }}>
            {data.focusText}
          </h3>
          <p style={{ color: '#cbd5e1', maxWidth: '650px', fontSize: '1rem', lineHeight: 1.6, margin: 0 }}>
            No NutURL você não precisa assinar múltiplos serviços: agregue todos os seus links na bio, tenha links encurtados com domínio dedicado (wnet.me) e baixe mídias em uma única plataforma unificada.
          </p>
          <Link
            href={data.ctaLink}
            className="btn"
            style={{
              padding: '12px 28px',
              background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
              color: '#fff',
              fontSize: '1rem',
              fontWeight: 700,
              borderRadius: '12px',
              textDecoration: 'none',
              boxShadow: '0 10px 25px rgba(59, 130, 246, 0.35)'
            }}
          >
            {data.ctaText} ➔
          </Link>
        </div>
      </section>

      {/* FAQ Específico da Ferramenta */}
      <section style={{ maxWidth: '850px', margin: '4rem auto' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, textAlign: 'center', marginBottom: '2rem' }}>
          Perguntas Frequentes
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {data.faq.map((item, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="glass"
                style={{
                  borderRadius: '14px',
                  border: '1px solid rgba(255,255,255,0.08)',
                  overflow: 'hidden'
                }}
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  style={{
                    width: '100%',
                    padding: '1.25rem 1.5rem',
                    background: 'transparent',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    color: '#f8fafc',
                    fontSize: '1.05rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <span>{item.q}</span>
                  <span style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>
                    ▼
                  </span>
                </button>
                {isOpen && (
                  <div style={{ padding: '0 1.5rem 1.25rem', color: '#94a3b8', lineHeight: 1.6, fontSize: '0.95rem' }}>
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Rodapé Simples */}
      <footer style={{
        maxWidth: '1200px',
        margin: '4rem auto 0',
        paddingTop: '2rem',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        color: '#64748b',
        fontSize: '0.85rem'
      }}>
        <span>&copy; {new Date().getFullYear()} NutURL.com • Encurtador oficial wnet.me</span>
        <div style={{ display: 'flex', gap: '1.25rem' }}>
          <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link>
          <Link href="/pricing" style={{ color: 'inherit', textDecoration: 'none' }}>Preços</Link>
          <Link href="/privacy" style={{ color: 'inherit', textDecoration: 'none' }}>Privacidade</Link>
          <Link href="/terms" style={{ color: 'inherit', textDecoration: 'none' }}>Termos</Link>
        </div>
      </footer>
    </div>
  );
}
