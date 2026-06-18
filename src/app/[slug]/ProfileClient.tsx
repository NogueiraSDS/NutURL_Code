'use client';

import { useState } from 'react';
import { useI18n } from '@/context/I18nContext';

// Vector SVG Social Icon Component
const SocialIcon = ({ name, size = 18 }: { name: string; size?: number }) => {
  const icons: Record<string, React.ReactNode> = {
    instagram: (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
      </svg>
    ),
    facebook: (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
      </svg>
    ),
    youtube: (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
        <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
      </svg>
    ),
    tiktok: (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path>
      </svg>
    ),
    twitter: (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4l11.733 16h4.267l-11.733 -16z M4 20l6.768 -6.768 M20 4l-6.768 6.768"></path>
      </svg>
    ),
    linkedin: (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
        <rect x="2" y="9" width="4" height="12"></rect>
        <circle cx="4" cy="4" r="2"></circle>
      </svg>
    ),
    telegram: (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="22" y1="2" x2="11" y2="13"></line>
        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
      </svg>
    ),
    whatsapp: (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
      </svg>
    ),
    github: (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
      </svg>
    ),
    onlyfans: (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"></path>
        <line x1="12" y1="8" x2="12" y2="16"></line>
      </svg>
    ),
    privacy: (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
      </svg>
    ),
    fansly: (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a10 10 0 1 0 10 10H12V2z"></path>
        <path d="M12 12L2.5 12A10 10 0 0 0 12 22V12z"></path>
      </svg>
    ),
    web: (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="2" y1="12" x2="22" y2="12"></line>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
      </svg>
    )
  };
  return icons[name] || icons.web;
};

const Zap = ({ size = 16 }: { size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

// Google Fonts imports mapped by theme name
const themeFonts: Record<string, string> = {
  glassmorphism: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap',
  aurora: 'https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&display=swap',
  cyberpunk: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700&display=swap',
  minimal: 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Inter:wght@400;600&display=swap',
  claymorphism: 'https://fonts.googleapis.com/css2?family=Quicksand:wght@400;600;700&display=swap',
};

// Detailed styling configurations for each theme
const themeStyles: Record<string, {
  container: React.CSSProperties;
  button: React.CSSProperties;
  buttonClass?: string;
  title: React.CSSProperties;
  bio: React.CSSProperties;
}> = {
  glassmorphism: {
    container: {
      background: '#0c0f1d',
      backgroundImage: 'radial-gradient(at 0% 0%, hsla(253,16%,7%,1) 0, transparent 50%), radial-gradient(at 50% 0%, hsla(263,80%,20%,0.4) 0, transparent 50%), radial-gradient(at 100% 0%, hsla(320,80%,30%,0.3) 0, transparent 50%)',
      fontFamily: "'Inter', sans-serif",
      color: '#ffffff'
    },
    button: {
      background: 'rgba(255, 255, 255, 0.08)',
      border: '1px solid rgba(255, 255, 255, 0.15)',
      borderRadius: '16px',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
      color: '#ffffff',
      transition: 'all 0.2s ease-in-out'
    },
    title: { color: '#ffffff', fontWeight: 800 },
    bio: { color: '#cbd5e1' }
  },
  aurora: {
    container: {
      background: 'linear-gradient(135deg, #09090b 0%, #1e1b4b 50%, #3b0764 100%)',
      fontFamily: "'Outfit', sans-serif",
      color: '#ffffff'
    },
    button: {
      background: 'linear-gradient(90deg, #6366f1, #a855f7)',
      border: 'none',
      borderRadius: '30px',
      boxShadow: '0 4px 20px rgba(99, 102, 241, 0.3)',
      color: '#ffffff',
      transition: 'all 0.2s ease'
    },
    title: { color: '#ffffff', fontWeight: 800 },
    bio: { color: '#cbd5e1' }
  },
  cyberpunk: {
    container: {
      background: '#050505',
      backgroundImage: 'linear-gradient(rgba(0, 240, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 240, 255, 0.03) 1px, transparent 1px)',
      backgroundSize: '20px 20px',
      fontFamily: "'Space Grotesk', sans-serif",
      color: '#00f0ff'
    },
    button: {
      background: '#0a0a0c',
      border: '2px solid #00f0ff',
      borderRadius: '0px',
      boxShadow: '4px 4px 0px #ff007f',
      color: '#00f0ff',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      transition: 'all 0.15s ease'
    },
    title: { color: '#00f0ff', textShadow: '0 0 10px rgba(0, 240, 255, 0.5)', fontWeight: 700 },
    bio: { color: '#ff007f', textShadow: '0 0 5px rgba(255, 0, 127, 0.5)' }
  },
  minimal: {
    container: {
      background: '#faf9f6',
      fontFamily: "'Playfair Display', serif",
      color: '#111111'
    },
    button: {
      background: 'transparent',
      border: '1px solid #111111',
      borderRadius: '4px',
      color: '#111111',
      fontFamily: "'Inter', sans-serif",
      transition: 'all 0.3s ease'
    },
    title: { color: '#111111', fontFamily: "'Playfair Display', serif", fontWeight: 700 },
    bio: { color: '#555555', fontFamily: "'Inter', sans-serif" }
  },
  claymorphism: {
    container: {
      background: 'linear-gradient(135deg, #e0f2fe 0%, #f3e8ff 100%)',
      fontFamily: "'Quicksand', sans-serif",
      color: '#1e293b'
    },
    button: {
      background: '#ffffff',
      border: 'none',
      borderRadius: '24px',
      boxShadow: 'inset 2px 2px 5px rgba(255,255,255,0.7), 4px 4px 10px rgba(165, 180, 252, 0.25)',
      color: '#334155',
      transition: 'all 0.2s ease'
    },
    title: { color: '#1e293b', fontWeight: 700 },
    bio: { color: '#64748b' }
  }
};

const getThemeConfiguration = (themeName: string, customBg: string) => {
  const preset = themeStyles[themeName];
  if (preset) return preset;

  // Defaults for legacy/custom solid backgrounds
  const isDark = !customBg || ['#000', '#0f172a', '#1e293b'].some(c => customBg.toLowerCase().includes(c));
  
  let containerBg: React.CSSProperties = { background: customBg || '#0f172a' };
  if (themeName === 'gradient_1') {
    containerBg = { background: 'linear-gradient(135deg, #1e3a8a 0%, #4c1d95 100%)' };
  } else if (themeName === 'gradient_2') {
    containerBg = { background: 'linear-gradient(135deg, #be185d 0%, #ea580c 100%)' };
  } else if (themeName === 'matrix') {
    containerBg = { background: '#000', backgroundImage: 'radial-gradient(#0f0 1px, transparent 1px)', backgroundSize: '20px 20px' };
  }

  return {
    container: {
      ...containerBg,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      color: themeName === 'matrix' ? '#0f0' : (isDark ? '#ffffff' : '#0f172a'),
    },
    button: {
      background: themeName === 'matrix' ? '#000' : 'rgba(255, 255, 255, 0.05)',
      border: themeName === 'matrix' ? '1px solid #0f0' : '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '12px',
      color: themeName === 'matrix' ? '#0f0' : '#ffffff',
      transition: 'all 0.2s'
    },
    title: { color: themeName === 'matrix' ? '#0f0' : '#ffffff', fontWeight: 800 },
    bio: { color: themeName === 'matrix' ? '#0f0' : '#94a3b8' }
  };
};

const getButtonHoverClass = (themeName: string) => {
  if (themeName === 'cyberpunk') return 'cyberpunk-btn';
  if (themeName === 'minimal') return 'minimal-btn';
  if (themeName === 'claymorphism') return 'claymorphism-btn';
  return 'profile-btn';
};

export default function ProfileClient({ profile, isPreview = false }: { profile: any; isPreview?: boolean }) {
  const { t } = useI18n();
  const [showAgeModal, setShowAgeModal] = useState(false);
  const [pendingUrl, setPendingUrl] = useState('');

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, link: any) => {
    if (link.isAgeRestricted) {
      e.preventDefault();
      setPendingUrl(link.url);
      setShowAgeModal(true);
    }
  };

  const confirmAge = () => {
    setShowAgeModal(false);
    if (pendingUrl) {
      window.open(pendingUrl, '_blank');
      setPendingUrl('');
    }
  };

  const cancelAge = () => {
    setShowAgeModal(false);
    setPendingUrl('');
  };

  const themeConfig = getThemeConfiguration(profile.theme || 'solid', profile.backgroundColor);
  const hoverClass = getButtonHoverClass(profile.theme || 'solid');

  // Ad checking logic: if tier is premium, hasAds is false. (Otherwise true)
  const hasAds = profile.user ? profile.user.tier !== 'premium' : (profile.tier ? profile.tier !== 'premium' : true);
  const isPremium = profile.user ? profile.user.tier === 'premium' : (profile.tier ? profile.tier === 'premium' : false);

  const socialIcons = isPremium
    ? (profile.links || []).filter((link: any) => link.isActive && link.isSocialIcon)
    : [];

  const standardLinks = (profile.links || []).filter(
    (link: any) => link.isActive && (!isPremium || !link.isSocialIcon)
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: isPreview ? '100%' : '100vh', padding: hasAds ? '0 0 7rem 0' : '0 0 4rem 0', position: 'relative', width: '100%', minWidth: '100%', boxSizing: 'border-box', overflowX: 'hidden', ...themeConfig.container }}>
      
      {/* Dynamic Theme Font */}
      {themeFonts[profile.theme] && (
        <link rel="stylesheet" href={themeFonts[profile.theme]} />
      )}

      {/* CSS Animado */}
      <style>{`
        @keyframes pulse-anim {
          0% { transform: scale(1); }
          50% { transform: scale(1.03); }
          100% { transform: scale(1); }
        }
        @keyframes bounce-anim {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes wiggle-anim {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-2deg); }
          75% { transform: rotate(2deg); }
        }
        .anim-pulse { animation: pulse-anim 2s infinite ease-in-out; }
        .anim-bounce { animation: bounce-anim 2s infinite ease-in-out; }
        .anim-wiggle { animation: wiggle-anim 2.5s infinite ease-in-out; }
        
        .profile-btn {
          cursor: pointer;
        }
        .profile-btn:hover {
          transform: translateY(-2px);
          background: rgba(255, 255, 255, 0.1) !important;
        }
        .cyberpunk-btn:hover {
          box-shadow: -4px -4px 0px #00f0ff !important;
          border-color: #ff007f !important;
          color: #ff007f !important;
          transform: translate(2px, 2px);
        }
        .minimal-btn:hover {
          background: #111111 !important;
          color: #faf9f6 !important;
        }
        .claymorphism-btn:hover {
          transform: translateY(-2px) scale(1.01) !important;
          box-shadow: inset 1px 1px 3px rgba(255,255,255,0.7), 6px 6px 16px rgba(165, 180, 252, 0.35) !important;
        }
      `}</style>

      {/* Aurora visual lighting details */}
      {profile.theme === 'aurora' && (
        <>
          <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '70%', height: '50%', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.15)', filter: 'blur(120px)', zIndex: 0, pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: '10%', right: '-10%', width: '60%', height: '50%', borderRadius: '50%', background: 'rgba(236, 72, 153, 0.12)', filter: 'blur(120px)', zIndex: 0, pointerEvents: 'none' }} />
        </>
      )}

      {/* Cover Banner */}
      {profile.coverUrl ? (
        <div style={{ width: '100%', height: '200px', background: `url(${profile.coverUrl}) center/cover`, borderBottom: '1px solid rgba(255,255,255,0.1)', position: 'relative', zIndex: 1 }} />
      ) : (
        <div style={{ width: '100%', height: '100px', position: 'relative', zIndex: 1 }} />
      )}

      {/* Profile Header */}
      <div style={{ textAlign: 'center', marginBottom: '2rem', maxWidth: '600px', width: '100%', marginTop: profile.coverUrl ? '-48px' : '0', padding: '0 1rem', position: 'relative', zIndex: 2 }}>
        <div style={{ 
          width: '96px', height: '96px', borderRadius: '50%', 
          background: profile.avatarUrl ? `url(${profile.avatarUrl}) center/cover` : 'linear-gradient(135deg, var(--primary), #8b5cf6)', 
          margin: '0 auto 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', 
          fontSize: '2.5rem', fontWeight: 'bold', color: 'white', 
          border: profile.theme === 'minimal' ? '4px solid #faf9f6' : '4px solid var(--bg)', 
          boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
          position: 'relative', zIndex: 10
        }}>
          {!profile.avatarUrl && (profile.title ? profile.title.charAt(0).toUpperCase() : '@')}
        </div>
        <h1 style={{ fontSize: '2.2rem', marginBottom: '0.5rem', ...themeConfig.title }}>{profile.title || `@${profile.username}`}</h1>
        {profile.bio && <p style={{ fontSize: '1.1rem', whiteSpace: 'pre-wrap', ...themeConfig.bio }}>{profile.bio}</p>}
        
        {/* Social Icons Row (Premium Only) */}
        {socialIcons.length > 0 && (
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '1rem',
            marginTop: '1.5rem'
          }}>
            {socialIcons.map((link: any) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => handleLinkClick(e, link)}
                title={link.title}
                className={hoverClass}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  color: 'inherit',
                  textDecoration: 'none',
                  border: profile.theme === 'minimal' ? '1px solid #111111' : '1px solid rgba(255,255,255,0.15)',
                  background: profile.theme === 'minimal' ? 'transparent' : 'rgba(255, 255, 255, 0.08)',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                  transition: 'all 0.2s ease-in-out'
                }}
              >
                <SocialIcon name={link.icon} size={20} />
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Links List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', width: '100%', maxWidth: '600px', padding: '0 1rem', position: 'relative', zIndex: 2 }}>
        {standardLinks.map((link: any) => (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => handleLinkClick(e, link)}
            className={`${hoverClass} ${link.animation !== 'none' ? `anim-${link.animation}` : ''}`}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              position: 'relative', 
              padding: '1.2rem', 
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '1.1rem',
              ...themeConfig.button
            }}
          >
            <span style={{ position: 'absolute', left: '1.5rem', display: 'flex', alignItems: 'center' }}>
              <SocialIcon name={link.icon} size={20} />
            </span>
            {link.title}
          </a>
        ))}
      </div>

      {/* Branding Footer */}
      {!profile.hideWatermark && (
        <div style={{ marginTop: 'auto', paddingTop: '2.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: profile.theme === 'minimal' ? '#555555' : '#94a3b8', position: 'relative', zIndex: 2 }}>
          <Zap size={16} />
          <a href="/" style={{ color: 'inherit', textDecoration: 'none', fontWeight: 'bold' }}>
            Powered by nuturl
          </a>
        </div>
      )}

      {/* Sticky Bottom Ad Bar */}
      {hasAds && (
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: profile.theme === 'minimal' ? '#ffffff' : 'rgba(15, 23, 42, 0.95)',
          backdropFilter: 'blur(8px)',
          borderTop: profile.theme === 'minimal' ? '1px solid #e1e1e1' : '1px solid rgba(255, 255, 255, 0.1)',
          padding: '0.75rem 1.5rem',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
          color: profile.theme === 'minimal' ? '#333333' : '#cbd5e1',
          fontSize: '0.85rem',
          boxShadow: '0 -4px 20px rgba(0,0,0,0.25)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center', textAlign: 'center' }}>
            <span style={{ 
              background: '#f59e0b', 
              color: '#000', 
              padding: '2px 6px', 
              borderRadius: '4px', 
              fontWeight: 'bold', 
              fontSize: '0.75rem',
              textTransform: 'uppercase' 
            }}>
              Ads
            </span>
            <span>{t('profile.adText') || 'Quer divulgar sua marca com estilo? Encurte links e crie sua própria página totalmente personalizável!'}</span>
            <a 
              href="/" 
              style={{ 
                color: 'var(--primary)', 
                fontWeight: 'bold', 
                textDecoration: 'underline', 
                marginLeft: '0.5rem' 
              }}
            >
              {t('profile.createFree') || 'Começar Grátis'}
            </a>
          </div>
        </div>
      )}

      {/* Age Restriction Modal */}
      {showAgeModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999, padding: '1rem' }}>
          <div className="glass" style={{ padding: '3rem', maxWidth: '400px', width: '100%', textAlign: 'center', borderRadius: '16px', border: '1px solid var(--error)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔞</div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 'bold', color: profile.theme === 'minimal' ? '#111111' : '#ffffff' }}>{t('profile.ageTitle')}</h2>
            <p style={{ color: profile.theme === 'minimal' ? '#555555' : '#94a3b8', marginBottom: '2rem' }}>
              {t('profile.ageDesc')}
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button onClick={cancelAge} className="btn" style={{ background: 'transparent', border: '1px solid #64748b', color: profile.theme === 'minimal' ? '#333333' : '#cbd5e1' }}>
                {t('profile.ageNo')}
              </button>
              <button onClick={confirmAge} className="btn" style={{ background: 'var(--error)' }}>
                {t('profile.ageYes')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
