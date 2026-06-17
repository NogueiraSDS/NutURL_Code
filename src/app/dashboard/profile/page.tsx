'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useI18n } from '@/context/I18nContext';

export default function ProfileDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { t } = useI18n();

  const [profile, setProfile] = useState<any>(null);
  const [fetching, setFetching] = useState(true);
  
  // Profile Form State
  const [username, setUsername] = useState('');
  const [title, setTitle] = useState('');
  const [bio, setBio] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Link Form State
  const [links, setLinks] = useState<any[]>([]);
  const [newLinkTitle, setNewLinkTitle] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [newLinkIcon, setNewLinkIcon] = useState('web');
  const [newLinkAge, setNewLinkAge] = useState(false);
  const [isSavingLink, setIsSavingLink] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetch(`/api/profile?userId=${user.uid}`)
        .then(res => res.json())
        .then(data => {
          if (data.profile) {
            setProfile(data.profile);
            setUsername(data.profile.username || '');
            setTitle(data.profile.title || '');
            setBio(data.profile.bio || '');
            setLinks(data.profile.links || []);
          }
          setFetching(false);
        })
        .catch(console.error);
    }
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSavingProfile(true);
    
    // Automatically remove @ if user typed it
    const cleanUsername = username.replace('@', '').toLowerCase().trim();

    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.uid, username: cleanUsername, title, bio })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao salvar perfil');
      alert('Perfil salvo com sucesso!');
      setProfile(data.profile);
      setUsername(data.profile.username);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) {
      alert('Por favor, salve as configurações do seu perfil (username) primeiro.');
      return;
    }
    setIsSavingLink(true);
    try {
      const res = await fetch('/api/profile/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          profileId: profile.id, 
          title: newLinkTitle, 
          url: newLinkUrl, 
          icon: newLinkIcon, 
          isAgeRestricted: newLinkAge 
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao adicionar link');
      
      setLinks([...links, data.link]);
      setNewLinkTitle('');
      setNewLinkUrl('');
      setNewLinkIcon('web');
      setNewLinkAge(false);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSavingLink(false);
    }
  };

  const handleDeleteLink = async (id: string) => {
    if (!confirm('Tem certeza que deseja remover este link?')) return;
    try {
      const res = await fetch(`/api/profile/links?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Erro ao deletar');
      setLinks(links.filter(l => l.id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  const iconsList = [
    { value: 'web', label: '🌐 Web (Padrão)' },
    { value: 'instagram', label: '📸 Instagram' },
    { value: 'facebook', label: '📘 Facebook' },
    { value: 'youtube', label: '▶️ YouTube' },
    { value: 'tiktok', label: '🎵 TikTok' },
    { value: 'twitter', label: '✖️ X (Twitter)' },
    { value: 'linkedin', label: '💼 LinkedIn' },
    { value: 'onlyfans', label: '🔒 OnlyFans (+18)', age: true },
    { value: 'privacy', label: '🔒 Privacy (+18)', age: true }
  ];

  const handleIconSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setNewLinkIcon(val);
    const selected = iconsList.find(i => i.value === val);
    if (selected && selected.age) {
      setNewLinkAge(true);
    }
  };

  if (loading || fetching) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>Carregando...</div>;

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto', width: '100%', flex: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Sua <span className="text-gradient">Página</span></h1>
        <button onClick={() => router.push('/dashboard')} className="btn" style={{ background: 'transparent', border: '1px solid #94a3b8' }}>
          Voltar ao Dashboard
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
        
        {/* Profile Settings */}
        <div className="glass" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Configurações do Perfil</h2>
          <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8' }}>Seu Username único</label>
              <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', border: '1px solid var(--card-border)', padding: '0 1rem' }}>
                <span style={{ color: '#64748b' }}>nuturl.com/@</span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="seunome"
                  style={{ background: 'transparent', border: 'none', color: 'white', padding: '0.8rem 0', width: '100%', outline: 'none' }}
                  required
                />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8' }}>Título da Página</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Erivando Nogueira"
                className="input"
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8' }}>Bio / Descrição</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Uma breve descrição sobre você..."
                className="input"
                style={{ resize: 'vertical', minHeight: '80px' }}
              />
            </div>
            <button type="submit" className="btn" disabled={isSavingProfile}>
              {isSavingProfile ? 'Salvando...' : 'Salvar Perfil'}
            </button>
          </form>

          {profile?.username && (
             <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--success)', borderRadius: '8px' }}>
               <p style={{ color: 'var(--success)', marginBottom: '0.5rem', fontWeight: 'bold' }}>Sua página está no ar!</p>
               <a href={`/@${profile.username}`} target="_blank" rel="noreferrer" style={{ color: 'white', wordBreak: 'break-all' }}>
                  {typeof window !== 'undefined' ? window.location.host : 'nuturl.com'}/@{profile.username}
               </a>
             </div>
          )}
        </div>

        {/* Links Management */}
        <div className="glass" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Adicionar Link</h2>
          
          <form onSubmit={handleAddLink} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
            <select value={newLinkIcon} onChange={handleIconSelect} className="input" style={{ appearance: 'auto' }}>
              {iconsList.map(icon => (
                <option key={icon.value} value={icon.value}>{icon.label}</option>
              ))}
            </select>
            
            <input
              type="text"
              value={newLinkTitle}
              onChange={(e) => setNewLinkTitle(e.target.value)}
              placeholder="Título do Botão (Ex: Meu Instagram)"
              className="input"
              required
            />
            
            <input
              type="url"
              value={newLinkUrl}
              onChange={(e) => setNewLinkUrl(e.target.value)}
              placeholder="https://"
              className="input"
              required
            />

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8', fontSize: '0.9rem' }}>
              <input type="checkbox" checked={newLinkAge} onChange={(e) => setNewLinkAge(e.target.checked)} />
              Exigir confirmação de +18 anos ao clicar
            </label>

            <button type="submit" className="btn" disabled={isSavingLink || !profile}>
              {isSavingLink ? 'Adicionando...' : 'Adicionar Link'}
            </button>
            {!profile && <p style={{ color: '#ef4444', fontSize: '0.8rem' }}>Você precisa salvar seu perfil primeiro.</p>}
          </form>

          <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#94a3b8' }}>Links Atuais</h3>
          {links.length === 0 ? (
            <p style={{ color: '#64748b' }}>Nenhum link adicionado ainda.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {links.map(link => (
                <div key={link.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px', border: '1px solid #334155' }}>
                  <div style={{ overflow: 'hidden' }}>
                    <p style={{ fontWeight: 'bold', marginBottom: '0.2rem' }}>
                      {iconsList.find(i => i.value === link.icon)?.label.split(' ')[0]} {link.title}
                      {link.isAgeRestricted && <span style={{ marginLeft: '8px', background: '#ef4444', color: 'white', padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem' }}>+18</span>}
                    </p>
                    <p style={{ color: '#94a3b8', fontSize: '0.8rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{link.url}</p>
                  </div>
                  <button onClick={() => handleDeleteLink(link.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.5rem' }}>
                    Remover
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
