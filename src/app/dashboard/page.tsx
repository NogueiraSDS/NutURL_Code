'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [links, setLinks] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      Promise.all([
        fetch(`/api/links?userId=${user.uid}`).then(res => res.json()),
        fetch(`/api/analytics?userId=${user.uid}`).then(res => res.json())
      ])
        .then(([linksData, analyticsData]) => {
          setLinks(linksData.links || []);
          setChartData(analyticsData.chartData || []);
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
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Seu <span className="text-gradient">Dashboard</span></h1>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <p style={{ color: '#94a3b8' }}>Olá, {user.displayName}</p>
          <button onClick={logout} className="btn" style={{ background: '#ef4444', padding: '8px 16px' }}>Sair</button>
        </div>
      </div>

      <div className="glass" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Visão Geral (Últimos 7 dias)</h2>
        <div style={{ height: '300px', width: '100%' }}>
          {fetching ? (
             <p>Carregando gráfico...</p>
          ) : chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorCliques" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid var(--card-border)', borderRadius: '8px' }}
                  itemStyle={{ color: 'var(--primary)', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="cliques" stroke="var(--primary)" fillOpacity={1} fill="url(#colorCliques)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <p style={{ color: '#94a3b8' }}>Sem dados suficientes para o gráfico.</p>
          )}
        </div>
      </div>

      <div className="glass" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.5rem' }}>Meus Links</h2>
            <button onClick={() => router.push('/')} className="btn" style={{ padding: '8px 16px' }}>Encurtar Novo Link</button>
        </div>
        
        {fetching ? (
          <p>Carregando links...</p>
        ) : links.length === 0 ? (
          <p style={{ color: '#94a3b8' }}>Você ainda não encurtou nenhum link.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--card-border)' }}>
                  <th style={{ padding: '1rem', color: '#94a3b8' }}>URL Original</th>
                  <th style={{ padding: '1rem', color: '#94a3b8' }}>Link Curto</th>
                  <th style={{ padding: '1rem', color: '#94a3b8' }}>Cliques</th>
                  <th style={{ padding: '1rem', color: '#94a3b8' }}>Redirecionamento</th>
                  <th style={{ padding: '1rem', color: '#94a3b8' }}>Data</th>
                </tr>
              </thead>
              <tbody>
                {links.map((link) => (
                  <tr key={link.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '1rem', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      <a href={link.url} target="_blank" rel="noopener noreferrer" style={{ color: '#60a5fa' }}>{link.url}</a>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <a href={`/${link.slug}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--success)', fontWeight: 'bold' }}>/{link.slug}</a>
                    </td>
                    <td style={{ padding: '1rem', fontWeight: 600 }}>{link.clicks}</td>
                    <td style={{ padding: '1rem' }}>
                      <label className="switch-container">
                        <span className="switch" style={{ transform: 'scale(0.85)', transformOrigin: 'left center' }}>
                          <input 
                            type="checkbox" 
                            checked={link.hasAd} 
                            onChange={(e) => handleToggleAd(link.id, e.target.checked)} 
                          />
                          <span className="slider"></span>
                        </span>
                        <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                          {link.hasAd ? 'Espera ⏳' : 'Direto ⚡'}
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
