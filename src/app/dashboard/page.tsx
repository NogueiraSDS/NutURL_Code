'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useI18n } from '@/context/I18nContext';

export default function Dashboard() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [links, setLinks] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [profileChartData, setProfileChartData] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'links' | 'profile'>('links');
  const [fetching, setFetching] = useState(true);
  const [tier, setTier] = useState('free');
  const { t } = useI18n();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      Promise.all([
        fetch(`/api/links?userId=${user.uid}`).then(res => res.json()),
        fetch(`/api/analytics?userId=${user.uid}`).then(res => res.json()),
        fetch(`/api/me?userId=${user.uid}&email=${encodeURIComponent(user.email || '')}`).then(res => res.json())
      ])
        .then(([linksData, analyticsData, userData]) => {
          setLinks(linksData.links || []);
          setChartData(analyticsData.chartData || []);
          setProfileChartData(analyticsData.profileChartData || []);
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

  const handleToggleAd = async (linkId: string, hasAd: boolean) => {
    try {
      setLinks(prev => prev.map(link => link.id === linkId ? { ...link, hasAd } : link));

      const res = await fetch('/api/links', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ linkId, hasAd }),
      });

      if (!res.ok) {
        throw new Error('Erro ao atualizar configuração de redirecionamento');
      }
    } catch (err: any) {
      alert(err.message);
      setLinks(prev => prev.map(link => link.id === linkId ? { ...link, hasAd: !hasAd } : link));
    }
  };

  if (loading || !user) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>Carregando...</div>;

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto', width: '100%', flex: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>{t('dashboard.title').split(' ')[0]} <span className="text-gradient">{t('dashboard.title').split(' ')[1]}</span></h1>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button onClick={() => router.push('/dashboard/profile')} className="btn" style={{ padding: '8px 16px', background: 'transparent', border: '1px solid var(--success)', color: 'var(--success)' }}>
            Editar Minha Página (@)
          </button>
          <span style={{ padding: '4px 8px', borderRadius: '4px', background: tier === 'premium' ? '#f59e0b' : tier === 'pro' ? 'var(--primary)' : '#334155', color: 'white', fontSize: '0.8rem', fontWeight: 'bold' }}>
            {tier.toUpperCase()}
          </span>
          {tier !== 'premium' && (
            <button onClick={() => router.push('/pricing')} className="btn" style={{ padding: '8px 16px', background: 'transparent', border: '1px solid #f59e0b', color: '#f59e0b' }}>
              {t('dashboard.seePlans')}
            </button>
          )}
          <p style={{ color: '#94a3b8' }}>{t('dashboard.hello', { name: user.displayName || user.email || '' })}</p>
          <button onClick={logout} className="btn" style={{ background: '#ef4444', padding: '8px 16px' }}>{t('dashboard.logout')}</button>
        </div>
      </div>

      <div className="glass" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{t('dashboard.overview')}</h2>
          
          <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(0,0,0,0.2)', padding: '4px', borderRadius: '8px', border: '1px solid var(--card-border)' }}>
            <button 
              onClick={() => setActiveTab('links')}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: 'none',
                background: activeTab === 'links' ? 'var(--primary)' : 'transparent',
                color: activeTab === 'links' ? 'white' : '#94a3b8',
                fontWeight: 600,
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              🔗 {t('dashboard.tabLinks') || 'Cliques em Links'}
            </button>
            <button 
              onClick={() => setActiveTab('profile')}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: 'none',
                background: activeTab === 'profile' ? 'var(--accent)' : 'transparent',
                color: activeTab === 'profile' ? 'white' : '#94a3b8',
                fontWeight: 600,
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              👤 {t('dashboard.tabProfile') || 'Visitas da Página (@)'}
            </button>
          </div>
        </div>

        <div style={{ height: '300px', width: '100%' }}>
          {fetching ? (
             <p>{t('dashboard.loadingChart')}</p>
          ) : (activeTab === 'links' ? chartData : profileChartData).length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activeTab === 'links' ? chartData : profileChartData}>
                <defs>
                  <linearGradient id="colorCliques" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={activeTab === 'links' ? 'var(--primary)' : 'var(--accent)'} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={activeTab === 'links' ? 'var(--primary)' : 'var(--accent)'} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid var(--card-border)', borderRadius: '8px' }}
                  itemStyle={{ color: activeTab === 'links' ? 'var(--primary)' : 'var(--accent)', fontWeight: 'bold' }}
                />
                <Area 
                  type="monotone" 
                  dataKey={activeTab === 'links' ? 'cliques' : 'visitas'} 
                  stroke={activeTab === 'links' ? 'var(--primary)' : 'var(--accent)'} 
                  fillOpacity={1} 
                  fill="url(#colorCliques)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <p style={{ color: '#94a3b8' }}>{t('dashboard.noData')}</p>
          )}
        </div>
      </div>

      <div className="glass" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.5rem' }}>{t('dashboard.myLinks')}</h2>
            <button onClick={() => router.push('/')} className="btn" style={{ padding: '8px 16px' }}>{t('dashboard.shortenNew')}</button>
        </div>
        
        {fetching ? (
          <p>{t('dashboard.loadingLinks')}</p>
        ) : links.length === 0 ? (
          <p style={{ color: '#94a3b8' }}>{t('dashboard.noLinks')}</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--card-border)' }}>
                  <th style={{ padding: '1rem', color: '#94a3b8' }}>{t('dashboard.colOriginal')}</th>
                  <th style={{ padding: '1rem', color: '#94a3b8' }}>{t('dashboard.colShort')}</th>
                  <th style={{ padding: '1rem', color: '#94a3b8' }}>{t('dashboard.colClicks')}</th>
                  <th style={{ padding: '1rem', color: '#94a3b8' }}>{t('dashboard.colRedirect')}</th>
                  <th style={{ padding: '1rem', color: '#94a3b8' }}>{t('dashboard.colDate')}</th>
                </tr>
              </thead>
              <tbody>
                {links.map((link) => (
                  <tr key={link.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '1rem', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      <a href={link.url} target="_blank" rel="noopener noreferrer" style={{ color: '#60a5fa' }}>{link.url}</a>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <a href={`https://wnut.me/${link.slug}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--success)', fontWeight: 'bold' }}>
                        wnut.me/{link.slug}
                      </a>
                    </td>
                    <td style={{ padding: '1rem', fontWeight: 600 }}>{link.clicks}</td>
                    <td style={{ padding: '1rem' }}>
                      <label className="switch-container" style={{ opacity: tier === 'free' ? 0.5 : 1 }}>
                        <span className="switch" style={{ transform: 'scale(0.85)', transformOrigin: 'left center' }}>
                          <input 
                            type="checkbox" 
                            checked={link.hasAd} 
                            onChange={(e) => handleToggleAd(link.id, e.target.checked)} 
                            disabled={tier === 'free'}
                          />
                          <span className="slider"></span>
                        </span>
                        <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                          {link.hasAd ? t('dashboard.wait') : t('dashboard.direct')}
                        </span>
                      </label>
                    </td>
                    <td style={{ padding: '1rem', color: '#94a3b8' }}>{new Date(link.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
