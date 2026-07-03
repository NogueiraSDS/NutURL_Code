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
  const { t } = useI18n();

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

  if (loading || (!user && !fetching)) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1, height: '100%' }}>Carregando...</div>;

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Meu Plano</h1>
          <p style={{ color: '#94a3b8' }}>Gerencie sua assinatura e limites da conta.</p>
        </div>
      </div>
      
      {fetching ? (
        <div className="glass" style={{ padding: '2rem' }}>Carregando informações do plano...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          
          {/* Plano Atual */}
          <div className="glass" style={{ padding: '2rem', border: '1px solid var(--primary)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, right: 0, padding: '0.5rem 1rem', background: 'var(--primary)', color: 'white', fontWeight: 'bold', borderBottomLeftRadius: '16px' }}>
              PLANO ATUAL
            </div>
            
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {tier === 'premium' ? <Star className="text-yellow-400" /> : tier === 'pro' ? <Zap className="text-blue-400" /> : <Check className="text-gray-400" />}
              {tier}
            </h2>
            
            <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>
              {tier === 'free' 
                ? 'Você está utilizando o plano gratuito com limites básicos.' 
                : 'Obrigado por apoiar nosso projeto! Aproveite seus recursos.'}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
                <span style={{ color: '#94a3b8' }}>Links Curtos</span>
                <span style={{ fontWeight: 'bold' }}>{tier === 'free' ? 'Ilimitados' : 'Ilimitados'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
                <span style={{ color: '#94a3b8' }}>Página de Link-in-Bio</span>
                <span style={{ fontWeight: 'bold' }}>1 Ativa</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
                <span style={{ color: '#94a3b8' }}>Análise de Cliques</span>
                <span style={{ fontWeight: 'bold' }}>{tier === 'free' ? 'Básico (7 dias)' : 'Avançado'}</span>
              </div>
            </div>
          </div>

          {/* Upgrade Banner */}
          {tier !== 'premium' && (
            <div className="glass" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Quer mais limites?</h3>
              <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>
                Faça upgrade para remover anúncios, criar páginas ilimitadas e ter relatórios completos!
              </p>
              <button 
                onClick={() => router.push('/pricing')}
                className="btn" 
                style={{ width: '100%', maxWidth: '250px' }}
              >
                Ver Planos Disponíveis
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
