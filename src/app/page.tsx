'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/context/I18nContext';
import Link from 'next/link';
import { blogArticles } from '@/data/blogArticles';

// Simple Vector SVG Icons for Features
const FeatureIcons = {
  bio: (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
  ),
  analytics: (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"></line>
      <line x1="12" y1="20" x2="12" y2="4"></line>
      <line x1="6" y1="20" x2="6" y2="14"></line>
    </svg>
  ),
  shortener: (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
    </svg>
  )
};

// Social Icons Mock helper for Phone Frame
const MockSocialIcon = ({ name }: { name: string }) => {
  const size = 14;
  const icons: Record<string, React.ReactNode> = {
    instagram: (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
      </svg>
    ),
    youtube: (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
        <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
      </svg>
    ),
    twitter: (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 4l11.733 16h4.267l-11.733 -16z M4 20l6.768 -6.768 M20 4l-6.768 6.768"></path>
      </svg>
    ),
    github: (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
      </svg>
    )
  };
  return icons[name] || null;
};

// Detailed styling configurations for mockup themes
const mockThemes: Record<string, {
  container: React.CSSProperties;
  button: React.CSSProperties;
  title: React.CSSProperties;
  bio: React.CSSProperties;
  avatar: React.CSSProperties;
  social: React.CSSProperties;
  fontFamily: string;
  fontUrl?: string;
}> = {
  glassmorphism: {
    container: {
      background: '#0c0f1d',
      backgroundImage: 'radial-gradient(at 0% 0%, hsla(253,16%,7%,1) 0, transparent 50%), radial-gradient(at 50% 0%, hsla(263,80%,20%,0.4) 0, transparent 50%)',
      color: '#ffffff',
    },
    button: {
      background: 'rgba(255, 255, 255, 0.08)',
      border: '1px solid rgba(255, 255, 255, 0.15)',
      borderRadius: '12px',
      backdropFilter: 'blur(8px)',
      color: '#ffffff',
    },
    title: { color: '#ffffff', fontWeight: 700 },
    bio: { color: '#cbd5e1' },
    avatar: { border: '3px solid rgba(255, 255, 255, 0.2)' },
    social: { background: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '50%' },
    fontFamily: "'Inter', sans-serif",
    fontUrl: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap'
  },
  aurora: {
    container: {
      background: 'linear-gradient(135deg, #09090b 0%, #1e1b4b 50%, #3b0764 100%)',
      color: '#ffffff',
    },
    button: {
      background: 'linear-gradient(90deg, #6366f1, #a855f7)',
      border: 'none',
      borderRadius: '24px',
      color: '#ffffff',
    },
    title: { color: '#ffffff', fontWeight: 700 },
    bio: { color: '#cbd5e1' },
    avatar: { border: '3px solid #6366f1' },
    social: { background: 'rgba(255, 255, 255, 0.08)', border: 'none', borderRadius: '50%' },
    fontFamily: "'Outfit', sans-serif",
    fontUrl: 'https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700&display=swap'
  },
  cyberpunk: {
    container: {
      background: '#050505',
      backgroundImage: 'linear-gradient(rgba(0, 240, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 240, 255, 0.03) 1px, transparent 1px)',
      backgroundSize: '15px 15px',
      color: '#00f0ff',
    },
    button: {
      background: '#0a0a0c',
      border: '2px solid #00f0ff',
      borderRadius: '0px',
      boxShadow: '3px 3px 0px #ff007f',
      color: '#00f0ff',
    },
    title: { color: '#00f0ff', fontWeight: 700 },
    bio: { color: '#ff007f' },
    avatar: { border: '2px solid #00f0ff', borderRadius: '0px' },
    social: { background: '#0a0a0c', border: '1px solid #00f0ff', borderRadius: '0px', boxShadow: '2px 2px 0px #ff007f' },
    fontFamily: "'Space Grotesk', sans-serif",
    fontUrl: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700&display=swap'
  },
  minimal: {
    container: {
      background: '#faf9f6',
      color: '#111111',
    },
    button: {
      background: 'transparent',
      border: '1px solid #111111',
      borderRadius: '4px',
      color: '#111111',
    },
    title: { color: '#111111', fontWeight: 700 },
    bio: { color: '#555555' },
    avatar: { border: '2px solid #111111' },
    social: { background: 'transparent', border: '1px solid #111111', borderRadius: '50%' },
    fontFamily: "'Playfair Display', serif",
    fontUrl: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;600&display=swap'
  },
  claymorphism: {
    container: {
      background: 'linear-gradient(135deg, #e0f2fe 0%, #f3e8ff 100%)',
      color: '#1e293b',
    },
    button: {
      background: '#ffffff',
      border: 'none',
      borderRadius: '20px',
      boxShadow: 'inset 2px 2px 5px rgba(255,255,255,0.7), 3px 3px 8px rgba(165, 180, 252, 0.2)',
      color: '#334155',
    },
    title: { color: '#1e293b', fontWeight: 700 },
    bio: { color: '#64748b' },
    avatar: { border: '3px solid #ffffff', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' },
    social: { background: '#ffffff', border: 'none', boxShadow: '3px 3px 8px rgba(165, 180, 252, 0.2)', borderRadius: '50%' },
    fontFamily: "'Quicksand', sans-serif",
    fontUrl: 'https://fonts.googleapis.com/css2?family=Quicksand:wght@600;700&display=swap'
  }
};

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();
  const { t, locale, setLocale } = useI18n();
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [shortUrl, setShortUrl] = useState('');
  const [error, setError] = useState('');
  const [hasAd, setHasAd] = useState(true);
  const [customAlias, setCustomAlias] = useState('');
  const [tier, setTier] = useState('free');

  // Interactive Carousel State
  const [activeTheme, setActiveTheme] = useState('glassmorphism');

  // FAQ Accordion State
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  useEffect(() => {
    if (user) {
      fetch(`/api/me?userId=${user.uid}&email=${encodeURIComponent(user.email || '')}`)
        .then(res => res.json())
        .then(data => {
          let currentTier = data.tier || 'free';
          if (user.email === 'erivandons@gmail.com') currentTier = 'premium';
          setTier(currentTier);
          if (currentTier !== 'free') {
            setHasAd(false);
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
        body: JSON.stringify({ 
          url, 
          userId: user?.uid, 
          userEmail: user?.email,
          hasAd, 
          customAlias 
        }),
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
    alert(t('home.copied') || 'Link copiado!');
  };

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const currentMock = mockThemes[activeTheme];

  return (
    <div className={styles.container}>
      {/* Top Navbar Buttons */}
      <div className={styles.topNav}>
        <button onClick={() => setLocale(locale === 'pt' ? 'en' : 'pt')} className="btn" style={{ padding: '6px 12px', background: 'transparent', border: '1px solid #94a3b8', color: '#94a3b8', fontSize: '0.8rem' }}>
          {locale === 'pt' ? '🇺🇸 EN' : '🇧🇷 PT'}
        </button>
        <button onClick={() => router.push('/blog')} className="btn" style={{ padding: '8px 16px', background: 'transparent', border: '1px solid #94a3b8', color: '#94a3b8' }}>{t('footer.blog') || 'Blog'}</button>
        <button onClick={() => router.push('/pricing')} className="btn" style={{ padding: '8px 16px', background: 'transparent', border: '1px solid #f59e0b', color: '#f59e0b' }}>{t('home.plans')}</button>
        {user ? (
          <button onClick={() => router.push('/dashboard')} className="btn" style={{ padding: '8px 16px', background: 'transparent', border: '1px solid var(--primary)' }}>{t('home.myDashboard')}</button>
        ) : (
          <button onClick={() => router.push('/login')} className="btn" style={{ padding: '8px 16px', background: 'transparent', border: '1px solid var(--primary)' }}>{t('home.login')}</button>
        )}
      </div>

      {/* Hero Section */}
      <header className={`${styles.section} ${styles.heroSection}`}>
        <div className={`${styles.hero} animate-fade-in`}>
          <h1 className={styles.title}>
            {(() => {
              const parts = t('home.shortenShare').split('.').map(x => x.trim()).filter(Boolean);
              return (
                <>
                  {parts.slice(0, -1).map((part, idx) => (
                    <span key={idx}>{part}.{' '}</span>
                  ))}
                  <span className="text-gradient">
                    {parts[parts.length - 1]}.
                  </span>
                </>
              );
            })()}
          </h1>
          <p className={styles.subtitle}>
            {t('home.subtitle')}
          </p>
        </div>

        {/* URL Shortener Widget */}
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
            <div style={{ marginTop: '0.5rem', width: '100%' }}>
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

          <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'flex-start' }}>
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

          {error && <p style={{ color: 'var(--error)', marginTop: '0.5rem', fontSize: '0.9rem' }}>{error}</p>}

          {shortUrl && (
            <div className={styles.resultBox}>
              <p style={{ fontWeight: '600' }}>{t('home.ready')}</p>
              <a href={shortUrl} target="_blank" rel="noopener noreferrer" className={styles.shortLink}>
                {shortUrl}
              </a>
              <button onClick={copyToClipboard} className="btn" style={{ background: '#475569', fontSize: '0.9rem', padding: '8px 16px' }}>
                {t('home.copyLink')}
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Features Grid Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{t('home.featSection') || 'Recursos Incríveis'}</h2>
        <p className={styles.sectionSubtitle}>
          {locale === 'pt' ? 'Tudo o que você precisa para alavancar a presença digital do seu negócio.' : 'Everything you need to power your digital presence.'}
        </p>

        <div className={styles.featuresGrid}>
          {/* Card 1: Link in Bio */}
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              {FeatureIcons.bio}
            </div>
            <h3>{t('home.featTitle1') || 'Páginas de Link na Bio'}</h3>
            <p>{t('home.featDesc1') || 'Crie links na bio altamente customizáveis com temas modernos, fontes elegantes e ícones sociais vetorizados.'}</p>
          </div>

          {/* Card 2: Analytics */}
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              {FeatureIcons.analytics}
            </div>
            <h3>{t('home.featTitle2') || 'Estatísticas em Tempo Real'}</h3>
            <p>{t('home.featDesc2') || 'Acompanhe visualizações de páginas, cliques e referenciadores de forma clara pelo seu dashboard.'}</p>
          </div>

          {/* Card 3: Shortener */}
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              {FeatureIcons.shortener}
            </div>
            <h3>{t('home.featTitle3') || 'Encurtador Inteligente'}</h3>
            <p>{t('home.featDesc3') || 'Personalize aliases de link e decida entre redirecionamentos imediatos ou com monetização de anúncios.'}</p>
          </div>
        </div>
      </section>

      {/* Interactive Theme Preview Carousel */}
      <section className={styles.section}>
        {currentMock.fontUrl && (
          <link rel="stylesheet" href={currentMock.fontUrl} />
        )}
        
        <h2 className={styles.sectionTitle}>{t('home.themeSection') || 'Escolha o seu visual'}</h2>
        <p className={styles.sectionSubtitle}>{t('home.themeSub') || 'Nossos temas premium se adaptam à identidade da sua marca instantaneamente.'}</p>

        <div className={styles.carouselContainer}>
          {/* Theme Buttons List */}
          <div className={styles.themeSelectorList}>
            {(Object.keys(mockThemes) as Array<keyof typeof mockThemes>).map((key) => {
              const isActive = activeTheme === key;
              const titleMap: Record<string, string> = {
                glassmorphism: locale === 'pt' ? 'Glassmorphism' : 'Glassmorphism',
                aurora: locale === 'pt' ? 'Aurora Glow' : 'Aurora Glow',
                cyberpunk: locale === 'pt' ? 'Cyberpunk' : 'Cyberpunk',
                minimal: locale === 'pt' ? 'Minimalista' : 'Minimalist',
                claymorphism: locale === 'pt' ? 'Claymorphism' : 'Claymorphism',
              };
              const descMap: Record<string, string> = {
                glassmorphism: locale === 'pt' ? 'Vidro fosco moderno com fundo dinâmico' : 'Frosted glass with dynamic lighting background',
                aurora: locale === 'pt' ? 'Gradiente vibrante e sombras flutuantes' : 'Vibrant meshes and floating glowing colors',
                cyberpunk: locale === 'pt' ? 'Estilo retro-futurista neon com bordas cruas' : 'Neon cyberpunk grid design with hard borders',
                minimal: locale === 'pt' ? 'Elegância minimalista limpa e tipografia serif' : 'Clean layout, elegant fonts, and high contrast',
                claymorphism: locale === 'pt' ? 'Visual suave com sombras internas macias' : 'Soft Clay design with internal pastel highlights',
              };

              return (
                <button
                  key={key}
                  onClick={() => setActiveTheme(key)}
                  className={`${styles.themeBtn} ${isActive ? styles.themeBtnActive : ''}`}
                >
                  <span className={styles.themeBtnName}>{titleMap[key]}</span>
                  <span className={styles.themeBtnDesc}>{descMap[key]}</span>
                </button>
              );
            })}
          </div>

          {/* Live Phone Emulator */}
          <div className={styles.phoneFrameWrapper}>
            <div className={styles.phoneFrame}>
              <div className={styles.phoneNotch}></div>
              <div className={styles.phoneInner} style={{ ...currentMock.container, fontFamily: currentMock.fontFamily, padding: '2rem 1rem 1rem 1rem', transition: 'all 0.3s ease' }}>
                
                {/* Mock User Details */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '1.5rem', marginBottom: '1.25rem' }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    color: '#fff',
                    fontWeight: 'bold',
                    marginBottom: '0.75rem',
                    transition: 'all 0.3s ease',
                    ...currentMock.avatar
                  }}>
                    N
                  </div>
                  <h4 style={{ fontSize: '1.1rem', margin: '0 0 0.25rem 0', transition: 'all 0.3s ease', ...currentMock.title }}>@nuturl_app</h4>
                  <p style={{ fontSize: '0.75rem', margin: 0, opacity: 0.8, textAlign: 'center', transition: 'all 0.3s ease', ...currentMock.bio }}>
                    {locale === 'pt' ? 'Sua marca em um só lugar' : 'Your brand in one clean spot'}
                  </p>

                  {/* Mock Social row */}
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                    {['instagram', 'youtube', 'github', 'twitter'].map((srv) => (
                      <div key={srv} style={{
                        width: '28px',
                        height: '28px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.3s ease',
                        ...currentMock.social
                      }}>
                        <MockSocialIcon name={srv} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mock Links list */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%' }}>
                  <div style={{
                    padding: '0.75rem',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    textAlign: 'center',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    ...currentMock.button
                  }}>
                    {locale === 'pt' ? '🌐 Visite Nosso Site' : '🌐 Visit Our Website'}
                  </div>
                  <div style={{
                    padding: '0.75rem',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    textAlign: 'center',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    ...currentMock.button
                  }}>
                    {locale === 'pt' ? '⚡ Planos & Preços' : '⚡ Plans & Pricing'}
                  </div>
                  <div style={{
                    padding: '0.75rem',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    textAlign: 'center',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    ...currentMock.button
                  }}>
                    {locale === 'pt' ? '💬 Fale Conosco' : '💬 Get in Touch'}
                  </div>
                </div>

                {/* Powered watermark */}
                <div style={{ marginTop: 'auto', paddingTop: '1.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.25rem', fontSize: '0.65rem', opacity: 0.6 }}>
                  <span>⚡ Powered by nuturl</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Comparison Grid */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{t('pricing.title') || 'Escolha o plano ideal para seus Links'}</h2>
        <p className={styles.sectionSubtitle}>{t('pricing.subtitle') || 'Planos acessíveis para quem quer compartilhar com estilo e inteligência.'}</p>

        <div className={styles.pricingGrid}>
          {/* FREE PLAN */}
          <div className={styles.pricingCard}>
            <span className={styles.planName}>{t('pricing.basicPlan') || 'Plano Básico'}</span>
            <div className={styles.planPrice}>
              $0<span className={styles.planPeriod}>{t('pricing.month')}</span>
            </div>
            <p className={styles.planDesc}>
              {locale === 'pt' ? 'Ideal para testar a plataforma e encurtar links rápidos.' : 'Great to test out the platform and shorten quick links.'}
            </p>
            <ul className={styles.planFeatures}>
              <li>
                <span className={styles.featureCheck}>✓</span> {t('pricing.freeFeatures.dashboard')}
              </li>
              <li>
                <span className={styles.featureCheck}>✓</span> {t('pricing.freeFeatures.multipleLinks')}
              </li>
              <li>
                <span className={styles.featureCheck}>✓</span> {t('pricing.freeFeatures.ads')}
              </li>
              <li>
                <span className={styles.featureCheck}>✓</span> {t('pricing.freeFeatures.expires')}
              </li>
              <li>
                <span className={styles.featureCross}>✗</span> {t('pricing.freeFeatures.custom')}
              </li>
              <li>
                <span className={styles.featureCross}>✗</span> {locale === 'pt' ? 'Autoridade SEO (Dofollow)' : 'SEO Authority (Dofollow)'}
              </li>
            </ul>
            <button onClick={() => router.push('/login')} className="btn" style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', width: '100%' }}>
              {locale === 'pt' ? 'Começar Grátis' : 'Start for Free'}
            </button>
          </div>

          {/* PRO PLAN */}
          <div className={`${styles.pricingCard} ${styles.pricingCardPopular}`}>
            <span className={styles.popularBadge}>{t('pricing.mostPopular') || 'MAIS POPULAR'}</span>
            <span className={styles.planName}>PRO</span>
            <div className={styles.planPrice}>
              $1<span className={styles.planPeriod}>{t('pricing.month')}</span>
            </div>
            <p className={styles.planDesc}>
              {locale === 'pt' ? 'Ideal para profissionais que querem estatísticas completas e links diretos.' : 'Best for professionals wanting full analytics and direct redirects.'}
            </p>
            <ul className={styles.planFeatures}>
              <li>
                <span className={styles.featureCheck}>✓</span> {t('pricing.proFeatures.allFree')}
              </li>
              <li>
                <span className={styles.featureCheck}>✓</span> {t('pricing.proFeatures.direct')}
              </li>
              <li>
                <span className={styles.featureCheck}>✓</span> {t('pricing.proFeatures.neverExpires')}
              </li>
              <li>
                <span className={styles.featureCheck}>✓</span> {locale === 'pt' ? 'Temas e Customização Básica' : 'Basic custom themes styling'}
              </li>
              <li>
                <span className={styles.featureCross}>✗</span> {locale === 'pt' ? 'Alias Customizado' : 'Custom Alias'}
              </li>
              <li>
                <span className={styles.featureCheck}>✓</span> {locale === 'pt' ? 'Links SEO Dofollow (Booster)' : 'SEO Dofollow Links (Booster)'}
              </li>
            </ul>
            <button onClick={() => router.push('/pricing')} className="btn" style={{ width: '100%' }}>
              {t('pricing.subscribePro') || 'Assinar PRO'}
            </button>
          </div>

          {/* PREMIUM PLAN */}
          <div className={styles.pricingCard}>
            <span className={styles.planName}>PREMIUM</span>
            <div className={styles.planPrice}>
              $5<span className={styles.planPeriod}>{t('pricing.month')}</span>
            </div>
            <p className={styles.planDesc}>
              {locale === 'pt' ? 'Acesso ilimitado e completo para branding da sua marca pessoal ou negócio.' : 'Unrestricted access for full personal branding or business pages.'}
            </p>
            <ul className={styles.planFeatures}>
              <li>
                <span className={styles.featureCheck}>✓</span> {t('pricing.premiumFeatures.allPro')}
              </li>
              <li>
                <span className={styles.featureCheck}>✓</span> {t('pricing.premiumFeatures.customAlias')}
              </li>
              <li>
                <span className={styles.featureCheck}>✓</span> {locale === 'pt' ? 'Ex: wnut.me/sua-marca' : 'Ex: wnut.me/your-brand'}
              </li>
              <li>
                <span className={styles.featureCheck}>✓</span> {locale === 'pt' ? 'Remover marca d\'água' : 'Remove nuturl branding'}
              </li>
              <li>
                <span className={styles.featureCheck}>✓</span> {locale === 'pt' ? 'Redes Sociais como ícones abaixo da foto' : 'Social networks horizontal icons row'}
              </li>
              <li>
                <span className={styles.featureCheck}>✓</span> {locale === 'pt' ? 'Links SEO Dofollow (Booster)' : 'SEO Dofollow Links (Booster)'}
              </li>
            </ul>
            <button onClick={() => router.push('/pricing')} className="btn" style={{ background: 'transparent', border: '1px solid var(--accent)', color: 'white', width: '100%' }}>
              {t('pricing.subscribePremium') || 'Assinar PREMIUM'}
            </button>
          </div>
        </div>
      </section>

      {/* Blog Carousel Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{t('home.blogSection') || 'Nosso Blog'}</h2>
        <p className={styles.sectionSubtitle}>
          {locale === 'pt' ? 'Dicas e novidades para decolar sua presença online.' : 'Tips and news to boost your online presence.'}
        </p>

        <div className={styles.blogCarousel}>
          {blogArticles.slice(0, 8).map((article) => (
            <Link href={`/blog/${article.slug}`} key={article.slug} className={styles.blogCard}>
              <div className={styles.blogCardCategory}>{article.category[locale as 'pt'|'en'] || article.category.pt}</div>
              <h3 className={styles.blogCardTitle}>{article.title[locale as 'pt'|'en'] || article.title.pt}</h3>
              <p className={styles.blogCardDesc}>{article.subtitle[locale as 'pt'|'en'] || article.subtitle.pt}</p>
              <div className={styles.blogCardMeta}>
                <span>{article.readTime} min</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{t('home.faqSection') || 'Perguntas Frequentes'}</h2>
        <p className={styles.sectionSubtitle}>
          {locale === 'pt' ? 'Tire suas dúvidas sobre o funcionamento dos links, monetização e planos.' : 'Get answers to common questions about link behavior, plans, and monetization.'}
        </p>

        <div className={styles.faqContainer}>
          {[1, 2, 3, 4].map((index) => {
            const isOpen = expandedFaq === index;
            const qKey = `home.faqQ${index}`;
            const aKey = `home.faqA${index}`;
            return (
              <div key={index} className={`${styles.faqItem} ${isOpen ? styles.faqItemOpen : ''}`}>
                <button onClick={() => toggleFaq(index)} className={styles.faqQuestion}>
                  <span>{t(qKey)}</span>
                  <span className={styles.faqChevron}>
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </span>
                </button>
                <div className={styles.faqAnswer}>
                  <div className={styles.faqAnswerInner}>
                    {t(aKey)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerBrand}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--primary)' }}>
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            <span>nuturl</span>
          </div>

          <div className={styles.footerLinks}>
            <Link href="/pricing">{t('home.plans')}</Link>
            <Link href="/about">{t('footer.about') || 'Quem Somos'}</Link>
            <Link href="/contact">{t('footer.contact') || 'Contato'}</Link>
            <Link href="/blog">{t('footer.blog') || 'Blog'}</Link>
            <Link href="/privacy">{t('footer.privacy') || 'Política de Privacidade'}</Link>
            <Link href="/terms">{t('footer.terms') || 'Termos de Uso'}</Link>
          </div>
        </div>

        <div className={styles.footerCopyright}>
          &copy; {new Date().getFullYear()} nuturl. All rights reserved.
        </div>
      </footer>

      {/* JSON-LD Structured Data Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "NutURL",
            "operatingSystem": "All",
            "applicationCategory": "BusinessApplication",
            "offers": {
              "@type": "AggregateOffer",
              "lowPrice": "0",
              "highPrice": "5",
              "priceCurrency": "USD"
            }
          })
        }}
      />
    </div>
  );
}
