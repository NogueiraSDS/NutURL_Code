'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useI18n } from '@/context/I18nContext';
import { MoreVertical, Edit2, Trash2, PowerOff, X } from 'lucide-react';

export default function LinksPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [links, setLinks] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);
  const [tier, setTier] = useState('free');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null);
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

  const handleDeleteLink = async (linkId: string) => {
    if (!confirm('Tem certeza que deseja excluir este link? Todas as estatísticas serão perdidas.')) return;
    try {
      const res = await fetch(`/api/links?linkId=${linkId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Erro ao deletar link');
      setLinks(prev => prev.filter(link => link.id !== linkId));
    } catch (err: any) {
      alert(err.message);
    }
    setActionMenuOpen(null);
  };

  const handleCreateLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLinkUrl) return;
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: newLinkUrl, userId: user?.uid })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao encurtar');
      
      // Add the new link to the state
      setLinks(prev => [data.link, ...prev]);
      setIsModalOpen(false);
      setNewLinkUrl('');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
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
        <button onClick={() => setIsModalOpen(true)} className="btn" style={{ padding: '8px 16px' }}>{t('dashboard.shortenNew') || 'Encurtar Novo Link'}</button>
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
                  <th style={{ padding: '1rem', color: '#94a3b8', textAlign: 'right' }}>Ações</th>
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
                    <td style={{ padding: '1rem', textAlign: 'right', position: 'relative' }}>
                      <button 
                        onClick={() => setActionMenuOpen(actionMenuOpen === link.id ? null : link.id)}
                        style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
                      >
                        <MoreVertical size={20} />
                      </button>
                      
                      {actionMenuOpen === link.id && (
                        <div style={{
                          position: 'absolute',
                          right: '2rem',
                          top: '100%',
                          background: '#1e293b',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '8px',
                          padding: '0.5rem',
                          zIndex: 10,
                          minWidth: '150px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                        }}>
                          <button 
                            onClick={() => { alert('Em breve! O sistema receberá atualização para edição de destino.'); setActionMenuOpen(null); }}
                            style={{ display: 'flex', width: '100%', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', background: 'none', border: 'none', color: '#e2e8f0', cursor: 'pointer', textAlign: 'left', borderRadius: '4px' }}
                          >
                            <Edit2 size={16} /> Editar
                          </button>
                          <button 
                            onClick={() => { alert('Em breve! Atualização para pausa de links.'); setActionMenuOpen(null); }}
                            style={{ display: 'flex', width: '100%', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', background: 'none', border: 'none', color: '#fbbf24', cursor: 'pointer', textAlign: 'left', borderRadius: '4px' }}
                          >
                            <PowerOff size={16} /> Inativar
                          </button>
                          <button 
                            onClick={() => handleDeleteLink(link.id)}
                            style={{ display: 'flex', width: '100%', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', textAlign: 'left', borderRadius: '4px' }}
                          >
                            <Trash2 size={16} /> Excluir
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Novo Link */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="glass" style={{ width: '100%', maxWidth: '500px', padding: '2rem', position: 'relative' }}>
            <button 
              onClick={() => setIsModalOpen(false)}
              style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
            >
              <X size={24} />
            </button>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Encurtar Novo Link</h2>
            <form onSubmit={handleCreateLink}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#e2e8f0' }}>URL Original de Destino</label>
                <input 
                  type="url" 
                  value={newLinkUrl}
                  onChange={(e) => setNewLinkUrl(e.target.value)}
                  placeholder="https://exemplo.com/sua-url-longa"
                  required
                  style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--card-border)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
                />
              </div>
              <button 
                type="submit" 
                className="btn" 
                style={{ width: '100%', opacity: isSubmitting ? 0.7 : 1 }}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Encurtando...' : 'Encurtar Agora'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
