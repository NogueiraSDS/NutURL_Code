'use client';

import { useState, useEffect } from 'react';
import { useI18n } from '@/context/I18nContext';
import Link from 'next/link';

export default function CookieConsent() {
  const { t } = useI18n();
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if consent has already been given (runs only on client mount)
    const consent = localStorage.getItem('nuturl-cookie-consent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('nuturl-cookie-consent', 'accepted');
    setShowBanner(false);
  };

  const handleDecline = () => {
    localStorage.setItem('nuturl-cookie-consent', 'declined');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '1.5rem',
      right: '1.5rem',
      left: '1.5rem',
      maxWidth: '600px',
      margin: '0 auto',
      zIndex: 99999,
      background: 'rgba(30, 41, 59, 0.95)',
      backdropFilter: 'blur(16px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '16px',
      padding: '1.5rem',
      boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      animation: 'slideUp 0.4s ease-out'
    }}>
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .cookie-btn-accept {
          background: linear-gradient(135deg, var(--primary), var(--accent));
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          font-size: 0.9rem;
          transition: transform 0.2s ease;
        }
        .cookie-btn-accept:hover {
          transform: translateY(-1px);
        }
        .cookie-btn-decline {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #cbd5e1;
          padding: 10px 20px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          font-size: 0.9rem;
          transition: background 0.2s ease;
        }
        .cookie-btn-decline:hover {
          background: rgba(255, 255, 255, 0.05);
        }
      `}</style>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
        <div style={{ fontSize: '1.5rem', marginTop: '-2px' }}>🍪</div>
        <p style={{ fontSize: '0.875rem', color: '#cbd5e1', lineHeight: '1.5', margin: 0 }}>
          {t('cookie.text')}{' '}
          <Link href="/privacy" style={{ color: 'var(--primary)', textDecoration: 'underline', fontWeight: '600' }}>
            {t('cookie.learnMore')}
          </Link>
          .
        </p>
      </div>
      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
        <button onClick={handleDecline} className="cookie-btn-decline">
          {t('cookie.decline')}
        </button>
        <button onClick={handleAccept} className="cookie-btn-accept">
          {t('cookie.accept')}
        </button>
      </div>
    </div>
  );
}
