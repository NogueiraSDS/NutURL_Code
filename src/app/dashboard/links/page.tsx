'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useI18n } from '@/context/I18nContext';

export default function LinksPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [links, setLinks] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);
  const [tier, setTier] = useState('free');
  const { t } = useI18n();

  useEffect(() => {
    if (user) {
      Promise.all([
        fetch(`/api/links?userId=${user.uid}`).then(res => res.json()),
        fetch(`/api/me?userId=${user.uid}&email=${encodeURIComponent(user.email || '')}`).then(res => res.json())
      ])
        .then(([linksData, userData]) => {
          setLinks(linksData.links || []);
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

  if (loading || (!user && !fetching)) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1, height: '100%' }}>Carregando...</div>;

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{t('dashboard.myLinks') || 'Meus Links'}</h1>
          <p style={{ color: '#94a3b8' }}>Gerencie todos os links que você já encurtou ou criou páginas.</p>
        </div>
        <button onClick={() => router.push('/')} className="btn" style={{ padding: '8px 16px' }}>{t('dashboard.shortenNew') || 'Encurtar Novo Link'}</button>
      </div>
      
      <div className="glass" style={{ padding: '2rem' }}>
        {fetching ? (
          <p>{t('dashboard.loadingLinks') || 'Carregando seus links...'}</p>
        ) : links.length === 0 ? (
          <p style={{ color: '#94a3b8' }}>{t('dashboard.noLinks') || 'Você ainda não tem links.'}</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--card-border)' }}>
                  <th style={{ padding: '1rem', color: '#94a3b8' }}>{t('dashboard.colOriginal') || 'URL original'}</th>
                  <th style={{ padding: '1rem', color: '#94a3b8' }}>{t('dashboard.colShort') || 'Short link'}</th>
                  <th style={{ padding: '1rem', color: '#94a3b8' }}>{t('dashboard.colClicks') || 'Cliques'}</th>
                  <th style={{ padding: '1rem', color: '#94a3b8' }}>{t('dashboard.colRedirect') || 'Tipo de Redireção'}</th>
                  <th style={{ padding: '1rem', color: '#94a3b8' }}>{t('dashboard.colDate') || 'Data'}</th>
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
                          {link.hasAd ? (t('dashboard.wait') || 'Com Anúncio') : (t('dashboard.direct') || 'Direto')}
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
