'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useI18n } from '@/context/I18nContext';
import imageCompression from 'browser-image-compression';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import { HexColorPicker } from 'react-colorful';

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
  const [avatarUrl, setAvatarUrl] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [backgroundColor, setBackgroundColor] = useState('#0f172a');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState<boolean | null>(null);
  const [checkingUsername, setCheckingUsername] = useState(false);

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
            setAvatarUrl(data.profile.avatarUrl || '');
            setCoverUrl(data.profile.coverUrl || '');
            setBackgroundColor(data.profile.backgroundColor || '#0f172a');
            setLinks(data.profile.links || []);
          }
          setFetching(false);
        })
        .catch(console.error);
    }
  }, [user]);

  // Auto-detect link icon
  useEffect(() => {
    if (!newLinkUrl) return;
    const urlLower = newLinkUrl.toLowerCase();
    if (urlLower.includes('instagram.com')) setNewLinkIcon('instagram');
    else if (urlLower.includes('facebook.com')) setNewLinkIcon('facebook');
    else if (urlLower.includes('youtube.com') || urlLower.includes('youtu.be')) setNewLinkIcon('youtube');
    else if (urlLower.includes('tiktok.com')) setNewLinkIcon('tiktok');
    else if (urlLower.includes('twitter.com') || urlLower.includes('x.com')) setNewLinkIcon('twitter');
    else if (urlLower.includes('linkedin.com')) setNewLinkIcon('linkedin');
    else if (urlLower.includes('onlyfans.com')) { setNewLinkIcon('onlyfans'); setNewLinkAge(true); }
    else if (urlLower.includes('privacy.com.br')) { setNewLinkIcon('privacy'); setNewLinkAge(true); }
    else if (urlLower.includes('fansly.com')) { setNewLinkIcon('fansly'); setNewLinkAge(true); }
    else if (urlLower.includes('t.me') || urlLower.includes('telegram.org')) setNewLinkIcon('telegram');
    else if (urlLower.includes('whatsapp.com') || urlLower.includes('wa.me')) setNewLinkIcon('whatsapp');
    else if (urlLower.includes('github.com')) setNewLinkIcon('github');
  }, [newLinkUrl]);

  // Dynamic username check
  useEffect(() => {
    if (!username) {
      setIsUsernameAvailable(null);
      return;
    }
    const cleanUsername = username.replace('@', '').toLowerCase().trim();
    if (profile && cleanUsername === profile.username) {
      setIsUsernameAvailable(true);
      return;
    }
    
    setCheckingUsername(true);
    const timeoutId = setTimeout(() => {
      fetch(`/api/profile/check-username?username=${cleanUsername}&userId=${user?.uid}`)
        .then(res => res.json())
        .then(data => setIsUsernameAvailable(data.available))
        .catch(() => setIsUsernameAvailable(null))
        .finally(() => setCheckingUsername(false));
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [username, user, profile]);

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
        body: JSON.stringify({ userId: user.uid, username: cleanUsername, title, bio, avatarUrl, coverUrl, backgroundColor })
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'cover') => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setIsUploading(true);
    try {
      const options = {
        maxSizeMB: type === 'avatar' ? 0.2 : 0.5,
        maxWidthOrHeight: type === 'avatar' ? 400 : 1200,
        useWebWorker: true,
      };
      
      const compressedFile = await imageCompression(file, options);
      const storageRef = ref(storage, `profiles/${user.uid}/${type}-${Date.now()}.jpg`);
      
      await uploadBytes(storageRef, compressedFile);
      const downloadUrl = await getDownloadURL(storageRef);

      if (type === 'avatar') {
        setAvatarUrl(downloadUrl);
      } else {
        setCoverUrl(downloadUrl);
      }
    } catch (error) {
      console.error(error);
      alert('Erro ao fazer upload da imagem.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) {
      alert('Por favor, salve as configurações do seu perfil (username) primeiro.');
      return;
    }
    
    let finalTitle = newLinkTitle.trim();
    if (!finalTitle) {
      if (newLinkIcon === 'web') {
        alert('Por favor, insira um Título para o botão.');
        return;
      }
      // Pega apenas o nome da rede (sem o emoji)
      const selectedIcon = iconsList.find(i => i.value === newLinkIcon);
      if (selectedIcon) {
        finalTitle = selectedIcon.label.split(' ')[1] || 'Link';
      } else {
        finalTitle = 'Link';
      }
    }

    let finalAgeRestricted = newLinkAge;
    const selectedIcon = iconsList.find(i => i.value === newLinkIcon);
    if (selectedIcon?.age) {
      finalAgeRestricted = true;
    }

    setIsSavingLink(true);
    try {
      const res = await fetch('/api/profile/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          profileId: profile.id, 
          title: finalTitle, 
          url: newLinkUrl, 
          icon: newLinkIcon, 
          isAgeRestricted: finalAgeRestricted 
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
    { value: 'telegram', label: '✈️ Telegram' },
    { value: 'whatsapp', label: '💬 WhatsApp' },
    { value: 'github', label: '🐙 GitHub' },
    { value: 'onlyfans', label: '🔒 OnlyFans (+18)', age: true },
    { value: 'privacy', label: '🔒 Privacy (+18)', age: true },
    { value: 'fansly', label: '🔒 Fansly (+18)', age: true }
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
          <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Imagens */}
            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8' }}>Avatar / Foto de Perfil</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: avatarUrl ? `url(${avatarUrl}) center/cover` : 'var(--card-bg)', border: '2px solid var(--primary)' }} />
                  <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'avatar')} disabled={isUploading} style={{ color: '#cbd5e1' }} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8' }}>Banner de Capa (Opcional)</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '120px', height: '40px', borderRadius: '4px', background: coverUrl ? `url(${coverUrl}) center/cover` : 'var(--card-bg)', border: '1px solid #334155' }} />
                  <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'cover')} disabled={isUploading} style={{ color: '#cbd5e1' }} />
                </div>
              </div>
            </div>

            {isUploading && <p style={{ color: 'var(--primary)', fontSize: '0.9rem' }}>Comprimindo e fazendo upload... Aguarde.</p>}

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8' }}>Cor de Fundo da Página</label>
              <div style={{ position: 'relative' }}>
                <div 
                  onClick={() => setShowColorPicker(!showColorPicker)}
                  style={{ 
                    width: '100%', height: '48px', borderRadius: '8px', 
                    background: backgroundColor, border: '1px solid var(--card-border)',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '0 1rem',
                    color: '#fff', textShadow: '0 1px 3px rgba(0,0,0,0.8)'
                  }}
                >
                  Clique para alterar: {backgroundColor}
                </div>
                {showColorPicker && (
                  <div style={{ position: 'absolute', top: '100%', left: 0, zIndex: 50, marginTop: '0.5rem', background: 'var(--card-bg)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--card-border)', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                      <span style={{ fontWeight: 'bold' }}>Selecione a Cor</span>
                      <button type="button" onClick={() => setShowColorPicker(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>✕</button>
                    </div>
                    <HexColorPicker color={backgroundColor} onChange={setBackgroundColor} />
                  </div>
                )}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8' }}>Seu Username único</label>
              <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', border: '1px solid var(--card-border)', padding: '0 1rem' }}>
                <span style={{ color: '#64748b' }}>wnut.me/@</span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="seunome"
                  style={{ background: 'transparent', border: 'none', color: 'white', padding: '0.8rem 0', width: '100%', outline: 'none' }}
                  required
                />
              </div>
              {username && (
                <p style={{ fontSize: '0.85rem', marginTop: '0.5rem', color: checkingUsername ? '#94a3b8' : isUsernameAvailable ? 'var(--success)' : 'var(--error)' }}>
                  {checkingUsername ? 'Verificando disponibilidade...' : isUsernameAvailable ? '✅ Nome de usuário disponível!' : '❌ Nome de usuário já em uso.'}
                </p>
              )}
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
             <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--success)', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
               <div>
                 <p style={{ color: 'var(--success)', marginBottom: '0.5rem', fontWeight: 'bold' }}>Sua página está no ar!</p>
                 <a href={`https://wnut.me/@${profile.username}`} target="_blank" rel="noreferrer" style={{ color: 'white', wordBreak: 'break-all', fontSize: '1.1rem' }}>
                    wnut.me/@{profile.username}
                 </a>
               </div>
               <button 
                 onClick={() => {
                   const url = `https://wnut.me/@${profile.username}`;
                   navigator.clipboard.writeText(url);
                   alert('Link da página copiado!');
                 }}
                 className="btn"
                 style={{ background: 'var(--success)', width: 'fit-content', fontSize: '0.9rem', padding: '8px 16px' }}
               >
                 Copiar Link da Página
               </button>
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
              placeholder="Título do Botão (Opcional para redes conhecidas)"
              className="input"
            />
            
            <input
              type="url"
              value={newLinkUrl}
              onChange={(e) => setNewLinkUrl(e.target.value)}
              placeholder="https://"
              className="input"
              required
            />

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8', fontSize: '0.9rem', cursor: iconsList.find(i => i.value === newLinkIcon)?.age ? 'not-allowed' : 'pointer' }}>
              <input 
                type="checkbox" 
                checked={iconsList.find(i => i.value === newLinkIcon)?.age || newLinkAge} 
                onChange={(e) => setNewLinkAge(e.target.checked)} 
                disabled={iconsList.find(i => i.value === newLinkIcon)?.age}
              />
              Exigir confirmação de +18 anos ao clicar
              {iconsList.find(i => i.value === newLinkIcon)?.age && (
                <span style={{ fontSize: '0.75rem', color: '#ef4444', marginLeft: '0.5rem' }}>(Obrigatório para esta rede)</span>
              )}
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
