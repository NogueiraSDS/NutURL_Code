'use client';

import { useState } from 'react';
import { useI18n } from '@/context/I18nContext';

export default function ProfileClient({ profile }: { profile: any }) {
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

  const getIconUrl = (icon: string) => {
    switch(icon) {
      case 'instagram': return '📸';
      case 'facebook': return '📘';
      case 'youtube': return '▶️';
      case 'tiktok': return '🎵';
      case 'twitter': return '✖️';
      case 'linkedin': return '💼';
      case 'telegram': return '✈️';
      case 'whatsapp': return '💬';
      case 'github': return '🐙';
      case 'onlyfans': return '🔒';
      case 'privacy': return '🔒';
      case 'fansly': return '🔒';
      default: return '🌐';
    }
  };

  const bgStyle = (() => {
    if (profile.theme === 'gradient_1') return { background: 'linear-gradient(135deg, #1e3a8a 0%, #4c1d95 100%)' };
    if (profile.theme === 'gradient_2') return { background: 'linear-gradient(135deg, #be185d 0%, #ea580c 100%)' };
    if (profile.theme === 'matrix') return { background: '#000', backgroundImage: 'radial-gradient(#0f0 1px, transparent 1px)', backgroundSize: '20px 20px' };
    return { background: profile.backgroundColor || 'var(--bg)' };
  })();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', padding: '0 0 4rem 0', ...bgStyle }}>
      {/* CSS Animado */}
      <style>{`
        @keyframes pulse-anim {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        @keyframes bounce-anim {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes wiggle-anim {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-3deg); }
          75% { transform: rotate(3deg); }
        }
        .anim-pulse { animation: pulse-anim 2s infinite; }
        .anim-bounce { animation: bounce-anim 2s infinite; }
        .anim-wiggle { animation: wiggle-anim 2s infinite; }
      `}</style>

      {/* Cover Banner */}
      {profile.coverUrl ? (
        <div style={{ width: '100%', height: '200px', background: `url(${profile.coverUrl}) center/cover`, borderBottom: '1px solid rgba(255,255,255,0.1)' }} />
      ) : (
        <div style={{ width: '100%', height: '100px' }} />
      )}

      {/* Profile Header */}
      <div style={{ textAlign: 'center', marginBottom: '2rem', maxWidth: '600px', width: '100%', marginTop: profile.coverUrl ? '-48px' : '0', padding: '0 1rem' }}>
        <div style={{ 
          width: '96px', height: '96px', borderRadius: '50%', 
          background: profile.avatarUrl ? `url(${profile.avatarUrl}) center/cover` : 'linear-gradient(135deg, var(--primary), #8b5cf6)', 
          margin: '0 auto 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', 
          fontSize: '2.5rem', fontWeight: 'bold', color: 'white', 
          border: '4px solid var(--bg)', boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
          position: 'relative', zIndex: 10
        }}>
          {!profile.avatarUrl && (profile.title ? profile.title.charAt(0).toUpperCase() : '@')}
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>{profile.title || `@${profile.username}`}</h1>
        {profile.bio && <p style={{ color: '#94a3b8', fontSize: '1.1rem', whiteSpace: 'pre-wrap' }}>{profile.bio}</p>}
      </div>

      {/* Links List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: '600px', padding: '0 1rem' }}>
        {profile.links?.filter((l: any) => l.isActive).map((link: any) => (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => handleLinkClick(e, link)}
            className={link.animation !== 'none' ? `anim-${link.animation}` : ''}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              position: 'relative', 
              padding: '1.2rem', 
              background: 'rgba(255,255,255,0.05)', 
              border: '1px solid rgba(255,255,255,0.1)', 
              borderRadius: '12px',
              transition: 'all 0.2s',
              color: 'white',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '1.1rem'
            }}
          >
            <span style={{ position: 'absolute', left: '1.5rem', fontSize: '1.5rem' }}>
              {getIconUrl(link.icon)}
            </span>
            {link.title}
          </a>
        ))}
      </div>

      {/* Branding Footer */}
      {!profile.hideWatermark && (
        <div style={{ marginTop: 'auto', paddingTop: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8' }}>
          <Zap size={16} />
          <a href="/" style={{ color: 'inherit', textDecoration: 'none', fontWeight: 'bold' }}>
            Powered by nuturl
          </a>
        </div>
      )}

      {/* Age Restriction Modal */}
      {showAgeModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem' }}>
          <div className="glass" style={{ padding: '3rem', maxWidth: '400px', width: '100%', textAlign: 'center', borderRadius: '16px', border: '1px solid var(--error)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔞</div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 'bold' }}>{t('profile.ageTitle')}</h2>
            <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>
              {t('profile.ageDesc')}
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button onClick={cancelAge} className="btn" style={{ background: 'transparent', border: '1px solid #64748b', color: '#cbd5e1' }}>
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
