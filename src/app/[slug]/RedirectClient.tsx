'use client';

import { useEffect, useState } from 'react';
import { useI18n } from '@/context/I18nContext';

export default function RedirectClient({ url }: { url: string }) {
  const [countdown, setCountdown] = useState(5);
  const { t } = useI18n();

  useEffect(() => {
    if (countdown === 0) {
      window.location.href = url;
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown, url]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, padding: '2rem', textAlign: 'center' }}>
      <div className="glass" style={{ padding: '3rem', maxWidth: '500px', width: '100%' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem', fontWeight: 700 }}>
          {t('redirect.waitNotice')}
        </h1>
        <p style={{ fontSize: '1.25rem', color: '#94a3b8', marginBottom: '2rem' }}>
          {t('redirect.redirectingIn')} <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{countdown}</span> {t('redirect.seconds')}
        </p>
        
        <div style={{ padding: '2rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', marginBottom: '2rem', border: '1px dashed #475569' }}>
          <p style={{ color: '#64748b' }}>[ Espaço para Anúncio AdSense ]</p>
        </div>

        <button 
          onClick={() => window.location.href = url}
          className="btn"
          style={{ width: '100%', background: countdown === 0 ? 'var(--primary)' : '#475569' }}
        >
          {t('redirect.continue')}
        </button>
      </div>
    </div>
  );
}
