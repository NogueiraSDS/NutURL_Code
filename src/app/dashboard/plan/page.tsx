'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useI18n } from '@/context/I18nContext';
import { Check, Star, Zap } from 'lucide-react';

export default function PlanPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [tier, setTier] = useState('free');
  const [fetching, setFetching] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const { t, locale } = useI18n();
  const isBrl = locale === 'pt';

  const handleCancelPlan = async () => {
    if (!user) return;
    const confirmMsg = t('pricing.myPlan.cancelConfirm') || 'Tem certeza que deseja cancelar sua assinatura?';
    if (!window.confirm(confirmMsg)) return;

    setCancelling(true);
    try {
      const res = await fetch('/api/cancel-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.uid }),
      });
      const data = await res.json();
      if (res.ok) {
        alert(t('pricing.myPlan.cancelSuccess') || 'Assinatura cancelada com sucesso!');
        setTier('free');
      } else {
        alert(data.error || 'Erro ao cancelar plano');
      }
    } catch (err: any) {
      console.error(err);
      alert('Erro de conexão ao cancelar plano.');
    } finally {
      setCancelling(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetch(`/api/me?userId=${user.uid}&email=${encodeURIComponent(user.email || '')}`)
        .then(res => res.json())
        .then(userData => {
          let currentTier = userData.tier || 'free';
          if (user.email === 'erivandons@gmail.com') currentTier = 'premium';
          setTier(currentTier);
          setFetching(false);
        })
        .catch(err => {
          console.error(err);
          setFetching(false);
        });
    }
  }, [user]);

  if (loading || (!user && !fetching)) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1, height: '100%' }}>{t('pricing.pleaseWait') || 'Carregando...'}</div>;

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{t('pricing.myPlan.title')}</h1>
          <p style={{ color: '#94a3b8' }}>{t('pricing.myPlan.subtitle')}</p>
        </div>
      </div>
      
      {fetching ? (
        <div className="glass" style={{ padding: '2rem' }}>{t('pricing.myPlan.loading')}</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          
          {/* Plano Atual */}
          <div className="glass" style={{ padding: '2rem', border: '1px solid var(--primary)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, right: 0, padding: '0.5rem 1rem', background: 'var(--primary)', color: 'white', fontWeight: 'bold', borderBottomLeftRadius: '16px' }}>
              {t('pricing.myPlan.currentBadge')}
            </div>
            
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {tier === 'premium' ? <Star className="text-yellow-400" /> : tier === 'pro' ? <Zap className="text-blue-400" /> : <Check className="text-gray-400" />}
              {tier}
            </h2>
            
            <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>
              {tier === 'free' 
                ? t('pricing.myPlan.freeDesc') 
                : t('pricing.myPlan.paidDesc')}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
                <span style={{ color: '#94a3b8' }}>{t('pricing.myPlan.shortLinks')}</span>
                <span style={{ fontWeight: 'bold' }}>{t('pricing.myPlan.unlimited')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
                <span style={{ color: '#94a3b8' }}>{t('pricing.myPlan.bioPage')}</span>
                <span style={{ fontWeight: 'bold' }}>{t('pricing.myPlan.bioPageActive')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
                <span style={{ color: '#94a3b8' }}>{t('pricing.myPlan.clickAnalytics')}</span>
                <span style={{ fontWeight: 'bold' }}>{tier === 'free' ? t('pricing.myPlan.analyticsBasic') : t('pricing.myPlan.analyticsAdvanced')}</span>
              </div>
            </div>

            {/* Botão de Cancelamento de Assinatura */}
            {tier !== 'free' && (
              <div style={{ marginTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.25rem' }}>
                <button
                  type="button"
                  onClick={handleCancelPlan}
                  disabled={cancelling}
                  style={{
                    background: 'transparent',
                    border: '1px solid rgba(239, 68, 68, 0.4)',
                    color: '#f87171',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    width: '100%',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                    e.currentTarget.style.borderColor = '#ef4444';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.4)';
                  }}
                >
                  {cancelling ? (t('pricing.myPlan.cancelling') || 'Cancelando...') : (t('pricing.myPlan.cancelPlanBtn') || 'Cancelar Assinatura')}
                </button>
              </div>
            )}
          </div>

          {/* Upgrade Options */}
          {tier !== 'premium' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', gridColumn: '1 / -1', marginTop: '1rem' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{t('pricing.myPlan.upgradeTitle')}</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                
                {/* Pro Plan */}
                {tier === 'free' && (
                  <div className="glass hover-scale" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                      <Zap className="text-blue-400" />
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>PRO</h3>
                    </div>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{isBrl ? 'R$ 4,90' : '$1'}<span style={{ fontSize: '1rem', color: '#94a3b8', fontWeight: 'normal' }}>{t('pricing.month')}</span></p>
                    <p style={{ color: '#94a3b8', marginBottom: '2rem', flex: 1 }}>{t('pricing.myPlan.proDesc')}</p>
                    <button onClick={() => router.push('/pricing')} className="btn" style={{ width: '100%', background: 'transparent', border: '1px solid var(--primary)' }}>{t('pricing.myPlan.selectPro')}</button>
                  </div>
                )}

                {/* Premium Plan */}
                <div className="glass hover-scale" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', border: '1px solid #f59e0b', background: 'linear-gradient(180deg, rgba(245, 158, 11, 0.05) 0%, transparent 100%)', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: '#f59e0b', color: 'black', padding: '4px 12px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                    {t('pricing.mostPopular')}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                    <Star className="text-yellow-400" />
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>PREMIUM</h3>
                  </div>
                  <p style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{isBrl ? 'R$ 27,90' : '$5'}<span style={{ fontSize: '1rem', color: '#94a3b8', fontWeight: 'normal' }}>{t('pricing.month')}</span></p>
                  <p style={{ color: '#94a3b8', marginBottom: '2rem', flex: 1 }}>{t('pricing.myPlan.premiumDesc')}</p>
                  <button onClick={() => router.push('/pricing')} className="btn" style={{ width: '100%', background: '#f59e0b', color: 'black' }}>{t('pricing.myPlan.selectPremium')}</button>
                </div>

              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
