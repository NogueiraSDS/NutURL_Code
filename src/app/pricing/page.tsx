'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useI18n } from '@/context/I18nContext';

export default function PricingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [tier, setTier] = useState('free');
  const [loading, setLoading] = useState(false);
  const { t } = useI18n();

  useEffect(() => {
    if (user) {
      fetch(`/api/me?userId=${user.uid}`)
        .then(res => res.json())
        .then(data => setTier(data.tier))
        .catch(console.error);
    }
  }, [user]);

  const handleCheckout = async (planTier: string) => {
    if (!user) {
      router.push('/login');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.uid, tier: planTier })
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Erro ao iniciar pagamento: ' + (data.error || 'Erro desconhecido'));
      }
    } catch (err) {
      console.error(err);
      alert('Erro ao conectar com o serviço de pagamento.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
      <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem' }}>
        {t('pricing.title').split(' ').slice(0, -1).join(' ')} <span className="text-gradient">{t('pricing.title').split(' ').slice(-1)}</span>
      </h1>
      <p style={{ color: '#94a3b8', fontSize: '1.2rem', marginBottom: '4rem' }}>
        {t('pricing.subtitle')}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        {/* Plano FREE */}
        <div className="glass" style={{ padding: '2rem', borderRadius: '16px', textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#94a3b8' }}>Free</h2>
          <div style={{ fontSize: '3rem', fontWeight: 800, margin: '1rem 0' }}>$0<span style={{ fontSize: '1rem', color: '#94a3b8' }}>{t('pricing.month')}</span></div>
          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', flex: 1 }}>
            <li style={{ marginBottom: '1rem' }}>✅ {t('pricing.freeFeatures.dashboard')}</li>
            <li style={{ marginBottom: '1rem' }}>✅ {t('pricing.freeFeatures.multipleLinks')}</li>
            <li style={{ marginBottom: '1rem', color: '#ef4444' }}>❌ {t('pricing.freeFeatures.ads')}</li>
            <li style={{ marginBottom: '1rem', color: '#ef4444' }}>❌ {t('pricing.freeFeatures.expires')}</li>
            <li style={{ marginBottom: '1rem', color: '#ef4444' }}>❌ {t('pricing.freeFeatures.custom')}</li>
          </ul>
          <button className="btn" disabled style={{ background: '#334155', opacity: 0.7 }}>
            {tier === 'free' && user ? t('pricing.currentPlan') : t('pricing.basicPlan')}
          </button>
        </div>

        {/* Plano PRO */}
        <div className="glass" style={{ padding: '2rem', borderRadius: '16px', textAlign: 'left', display: 'flex', flexDirection: 'column', border: '2px solid var(--primary)', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '-15px', left: '50%', transform: 'translateX(-50%)', background: 'var(--primary)', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }}>
            {t('pricing.mostPopular')}
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--primary)' }}>Pro</h2>
          <div style={{ fontSize: '3rem', fontWeight: 800, margin: '1rem 0' }}>$1<span style={{ fontSize: '1rem', color: '#94a3b8' }}>{t('pricing.month')}</span></div>
          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', flex: 1 }}>
            <li style={{ marginBottom: '1rem' }}>✅ {t('pricing.proFeatures.allFree')}</li>
            <li style={{ marginBottom: '1rem' }}>⚡ {t('pricing.proFeatures.direct')}</li>
            <li style={{ marginBottom: '1rem' }}>⏳ {t('pricing.proFeatures.neverExpires')}</li>
            <li style={{ marginBottom: '1rem', color: '#ef4444' }}>❌ {t('pricing.proFeatures.custom')}</li>
          </ul>
          <button 
            className="btn" 
            onClick={() => handleCheckout('pro')}
            disabled={loading || tier === 'pro' || tier === 'premium'}
          >
            {tier === 'pro' ? t('pricing.currentPlan') : (loading ? t('pricing.pleaseWait') : t('pricing.subscribePro'))}
          </button>
        </div>

        {/* Plano PREMIUM */}
        <div className="glass" style={{ padding: '2rem', borderRadius: '16px', textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#f59e0b' }}>Premium</h2>
          <div style={{ fontSize: '3rem', fontWeight: 800, margin: '1rem 0' }}>$5<span style={{ fontSize: '1rem', color: '#94a3b8' }}>{t('pricing.month')}</span></div>
          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', flex: 1 }}>
            <li style={{ marginBottom: '1rem' }}>✅ {t('pricing.premiumFeatures.allPro')}</li>
            <li style={{ marginBottom: '1rem' }}>🚀 {t('pricing.premiumFeatures.customAlias')}</li>
            <li style={{ marginBottom: '1rem' }}>{t('pricing.premiumFeatures.customEx')}</li>
          </ul>
          <button 
            className="btn" 
            onClick={() => handleCheckout('premium')}
            disabled={loading || tier === 'premium'}
            style={{ background: tier === 'premium' ? '#334155' : '#f59e0b', color: 'white' }}
          >
            {tier === 'premium' ? t('pricing.currentPlan') : (loading ? t('pricing.pleaseWait') : t('pricing.subscribePremium'))}
          </button>
        </div>
      </div>
    </div>
  );
}
