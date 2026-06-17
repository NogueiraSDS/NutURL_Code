'use client';

import { useI18n } from '@/context/I18nContext';

export default function ExpiredClient() {
  const { t } = useI18n();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '2rem', textAlign: 'center' }}>
      <div className="glass" style={{ padding: '4rem', maxWidth: '500px', width: '100%', borderRadius: '16px' }}>
        <h1 style={{ fontSize: '5rem', marginBottom: '1rem', color: 'var(--error)', lineHeight: 1 }}>:(</h1>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem', fontWeight: 800 }}>{t('redirect.expiredTitle')}</h2>
        <p style={{ color: '#94a3b8', marginBottom: '2rem', fontSize: '1.1rem' }}>
          {t('redirect.expiredDesc')}
        </p>
        <a href="/" className="btn" style={{ textDecoration: 'none', display: 'inline-block' }}>
          {t('redirect.createOwn')}
        </a>
      </div>
    </div>
  );
}
