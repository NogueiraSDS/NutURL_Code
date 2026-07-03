'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useI18n } from '@/context/I18nContext';

export default function Dashboard() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [chartData, setChartData] = useState<any[]>([]);
  const [profileChartData, setProfileChartData] = useState<any[]>([]);
  const [popularBioLinks, setPopularBioLinks] = useState<any[]>([]);
  const [visitsByHour, setVisitsByHour] = useState<any[]>([]);
  const [visitsByDayOfWeek, setVisitsByDayOfWeek] = useState<any[]>([]);
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
        fetch(`/api/analytics?userId=${user.uid}`).then(res => res.json()),
        fetch(`/api/me?userId=${user.uid}&email=${encodeURIComponent(user.email || '')}`).then(res => res.json())
      ])
        .then(([analyticsData, userData]) => {
          setChartData(analyticsData.chartData || []);
          setProfileChartData(analyticsData.profileChartData || []);
          setPopularBioLinks(analyticsData.popularBioLinks || []);
          setVisitsByHour(analyticsData.visitsByHour || []);
          setVisitsByDayOfWeek(analyticsData.visitsByDayOfWeek || []);
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

  if (loading || !user) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>Carregando...</div>;

  return (
    <div style={{ width: '100%', flex: 1 }}>

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

      {activeTab === 'profile' && !fetching && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
          {/* Horários */}
          <div className="glass" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              ⏰ {t('dashboard.hourlyVisits') || 'Distribuição por Horário'}
            </h3>
            <div style={{ height: '200px', width: '100%' }}>
              {visitsByHour.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={visitsByHour}>
                    <XAxis dataKey="hour" stroke="#94a3b8" fontSize={10} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid var(--card-border)', borderRadius: '8px' }}
                      itemStyle={{ color: 'var(--accent)', fontWeight: 'bold' }}
                    />
                    <Bar dataKey="visitas" fill="var(--accent)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>{t('dashboard.noData')}</p>
              )}
            </div>
          </div>

          {/* Dias da Semana */}
          <div className="glass" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              📅 {t('dashboard.weeklyVisits') || 'Visitas por Dia da Semana'}
            </h3>
            <div style={{ height: '200px', width: '100%' }}>
              {visitsByDayOfWeek.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={visitsByDayOfWeek}>
                    <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid var(--card-border)', borderRadius: '8px' }}
                      itemStyle={{ color: 'var(--success)', fontWeight: 'bold' }}
                    />
                    <Bar dataKey="visitas" fill="var(--success)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>{t('dashboard.noData')}</p>
              )}
            </div>
          </div>

          {/* Links Mais Clicados */}
          <div className="glass" style={{ padding: '2rem', gridColumn: '1 / -1' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              ⭐ {t('dashboard.popularBioLinks') || 'Links Mais Clicados no Perfil'}
            </h3>
            {popularBioLinks.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {popularBioLinks.map((link, idx) => (
                  <div 
                    key={link.id} 
                    style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      padding: '1rem', 
                      background: 'rgba(255,255,255,0.03)', 
                      borderRadius: '8px', 
                      border: '1px solid rgba(255,255,255,0.05)' 
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span style={{ fontSize: '1.2rem', fontWeight: 'black', color: 'rgba(255,255,255,0.15)', minWidth: '24px' }}>
                        {idx + 1}
                      </span>
                      <div>
                        <p style={{ fontWeight: 'bold', color: '#f1f5f9' }}>{link.title}</p>
                        <a 
                          href={link.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          style={{ fontSize: '0.75rem', color: '#60a5fa', textDecoration: 'none', wordBreak: 'break-all' }}
                        >
                          {link.url}
                        </a>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                      <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--accent)' }}>
                        {link.clicks}
                      </span>
                      <span style={{ fontSize: '0.65rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {t('dashboard.clicks') || 'Cliques'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>{t('dashboard.noClicksRegistered') || 'Nenhum clique registrado nos links do perfil ainda.'}</p>
            )}
          </div>
        </div>
      )}


    </div>
  );
}
