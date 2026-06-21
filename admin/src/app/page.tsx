'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

interface MetricData {
  totalUsers: number;
  totalLinks: number;
  totalClicks: number;
  totalProfileViews: number;
}

interface TopLink {
  id: string;
  url: string;
  slug: string;
  clicks: number;
  createdAt: string;
}

interface GrowthDay {
  date: string;
  count: number;
}

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [metrics, setMetrics] = useState<MetricData | null>(null);
  const [topLinks, setTopLinks] = useState<TopLink[]>([]);
  const [growthData, setGrowthData] = useState<GrowthDay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/metrics')
      .then((res) => res.json())
      .then((data) => {
        if (data.metrics) setMetrics(data.metrics);
        if (data.topLinks) setTopLinks(data.topLinks);
        if (data.growthChartData) setGrowthData(data.growthChartData);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    logout().then(() => router.push('/login'));
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950 text-slate-100">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-sm text-slate-400">Carregando estatísticas...</p>
        </div>
      </div>
    );
  }

  // Find max value in growth data for scaling chart bars
  const maxGrowthCount = growthData.reduce((max, d) => (d.count > max ? d.count : max), 1);

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-xl font-black text-blue-500">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="3">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
              <span>nuturl</span>
              <span className="rounded bg-blue-500/10 px-2 py-0.5 text-xs font-bold text-blue-400">Admin</span>
            </div>
            <nav className="hidden md:flex items-center gap-1 text-sm font-semibold">
              <button 
                onClick={() => router.push('/')} 
                className="rounded-lg bg-slate-900 px-3 py-1.5 text-slate-200"
              >
                Dashboard
              </button>
              <button 
                onClick={() => router.push('/users')} 
                className="rounded-lg px-3 py-1.5 text-slate-400 hover:text-slate-200 transition"
              >
                Usuários
              </button>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden sm:inline text-xs text-slate-500">Logado como: <strong className="text-slate-300 font-semibold">{user?.email}</strong></span>
            <button
              onClick={handleLogout}
              className="rounded-lg border border-slate-800 bg-slate-900 px-4 py-2 text-xs font-bold text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-6 py-8">
        {/* Mobile Navigation links */}
        <div className="flex md:hidden gap-2 mb-6">
          <button onClick={() => router.push('/')} className="flex-1 rounded-lg bg-slate-900 py-2 text-center text-xs font-bold text-slate-200">Dashboard</button>
          <button onClick={() => router.push('/users')} className="flex-1 rounded-lg border border-slate-800 py-2 text-center text-xs font-bold text-slate-400">Usuários</button>
        </div>

        {/* Header message */}
        <div className="mb-8">
          <h1 className="text-3xl font-black tracking-tight text-slate-100">Visão Geral da Rede</h1>
          <p className="text-sm text-slate-400 mt-1">Acompanhe métricas gerais, conversões e o crescimento da base em tempo real.</p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Card 1: Total Users */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-5 backdrop-blur-sm">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Usuários Registrados</span>
            <h2 className="text-3xl font-bold text-slate-100 mt-2">{metrics?.totalUsers}</h2>
            <p className="text-xs text-blue-400 mt-1">Total de cadastros</p>
          </div>
          {/* Card 2: Shortened Links */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-5 backdrop-blur-sm">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Links Encurtados</span>
            <h2 className="text-3xl font-bold text-slate-100 mt-2">{metrics?.totalLinks}</h2>
            <p className="text-xs text-indigo-400 mt-1">URLs e profiles gerados</p>
          </div>
          {/* Card 3: Total Redirect Clicks */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-5 backdrop-blur-sm">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Cliques de Redirecionamento</span>
            <h2 className="text-3xl font-bold text-slate-100 mt-2">{metrics?.totalClicks}</h2>
            <p className="text-xs text-emerald-400 mt-1">Acessos a links curtos</p>
          </div>
          {/* Card 4: Profile Page Views */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-5 backdrop-blur-sm">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Visitas de Perfil na Bio</span>
            <h2 className="text-3xl font-bold text-slate-100 mt-2">{metrics?.totalProfileViews}</h2>
            <p className="text-xs text-purple-400 mt-1">Visualizações de perfis</p>
          </div>
        </div>

        {/* Growth & Popular Links */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Growth Chart */}
          <div className="lg:col-span-2 rounded-xl border border-slate-800 bg-slate-900/30 p-6 backdrop-blur-sm flex flex-col">
            <h3 className="text-lg font-bold text-slate-100 mb-2">Crescimento de Cadastros (Últimos 30 dias)</h3>
            <p className="text-xs text-slate-400 mb-6">Registros diários na plataforma.</p>

            {/* Custom SVG Flex-based Bar Chart */}
            <div className="flex-1 flex items-end justify-between h-64 gap-1 pt-6 px-2 border-b border-slate-800">
              {growthData.map((d, index) => {
                const heightPercent = `${(d.count / maxGrowthCount) * 100}%`;
                // Show label only for specific intervals to avoid clutter
                const showLabel = index % 5 === 0 || index === growthData.length - 1;

                return (
                  <div key={d.date} className="flex-1 flex flex-col items-center group relative">
                    {/* Tooltip */}
                    <div className="absolute bottom-full mb-2 bg-slate-950 border border-slate-800 rounded px-2 py-1 text-[10px] text-slate-200 font-bold opacity-0 group-hover:opacity-100 pointer-events-none transition z-10 whitespace-nowrap shadow-lg">
                      {d.date}: {d.count} {d.count === 1 ? 'cadastro' : 'cadastros'}
                    </div>

                    {/* Bar */}
                    <div 
                      className={`w-full rounded-t-sm transition-all duration-300 ${d.count > 0 ? 'bg-gradient-to-t from-blue-600 to-indigo-500 group-hover:brightness-110' : 'bg-slate-900'}`}
                      style={{ height: d.count > 0 ? heightPercent : '2px', width: '100%', minHeight: '2px' }}
                    ></div>

                    {/* Date label */}
                    <span className="text-[9px] text-slate-600 mt-2 h-4 overflow-hidden whitespace-nowrap">
                      {showLabel ? d.date.split('-')[2] : ''}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 mt-2 px-1">
              <span>Há 30 dias</span>
              <span>Hoje</span>
            </div>
          </div>

          {/* Popular Links */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-6 backdrop-blur-sm flex flex-col">
            <h3 className="text-lg font-bold text-slate-100 mb-2">Top 5 Links Populares</h3>
            <p className="text-xs text-slate-400 mb-6">Links mais clicados na rede do NutURL.</p>

            <div className="flex-1 space-y-4">
              {topLinks.length > 0 ? (
                topLinks.map((link, idx) => (
                  <div key={link.id} className="flex items-center justify-between border-b border-slate-800/50 pb-3 last:border-0 last:pb-0">
                    <div className="flex flex-col min-w-0 max-w-[70%]">
                      <span className="text-sm font-semibold text-slate-200 truncate">
                        {link.url}
                      </span>
                      <a 
                        href={`https://wnut.me/${link.slug}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-blue-400 hover:underline truncate mt-0.5"
                      >
                        wnut.me/{link.slug}
                      </a>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-black text-slate-100">{link.clicks}</span>
                      <span className="block text-[10px] text-slate-500">cliques</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-600 text-sm">
                  Sem dados de links populares.
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
