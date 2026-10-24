'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import imageCompression from 'browser-image-compression';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import BusinessCardView from '@/components/BusinessCardView';
import {
  Contact,
  Save,
  ExternalLink,
  Copy,
  Check,
  Upload,
  Sparkles,
  Phone,
  MessageCircle,
  Mail,
  Globe,
  MapPin,
  Building2,
  Briefcase,
  User,
  Eye,
  RefreshCw,
  Palette,
} from 'lucide-react';

const THEMES = [
  { id: 'dark', label: 'Dark Modern', desc: 'Preto slate sofisticado com toques de azul néon' },
  { id: 'elegant', label: 'Black & Gold', desc: 'Preto nobre com detalhes dourados elegantes' },
  { id: 'modern', label: 'Clean Glass', desc: 'Vidro translúcido aero com bordas suaves' },
  { id: 'gradient', label: 'Vibrant Mesh', desc: 'Gradiente dinâmico índigo e violeta' },
];

export default function BusinessCardDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [fetching, setFetching] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [copied, setCopied] = useState(false);

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('');
  const [company, setCompany] = useState('');
  const [slug, setSlug] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [notes, setNotes] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [theme, setTheme] = useState('dark');

  // Preview tab state on mobile
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      setFetching(true);
      fetch(`/api/card?userId=${user.uid}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.card) {
            const c = data.card;
            setFullName(c.fullName || '');
            setRole(c.role || '');
            setCompany(c.company || '');
            setSlug(c.slug || '');
            setPhone(c.phone || '');
            setWhatsapp(c.whatsapp || '');
            setEmail(c.email || '');
            setWebsite(c.website || '');
            setAddress(c.address || '');
            setCity(c.city || '');
            setState(c.state || '');
            setNotes(c.notes || '');
            setAvatarUrl(c.avatarUrl || '');
            setTheme(c.theme || 'dark');
          } else {
            if (user.displayName) setFullName(user.displayName);
            if (user.email) setEmail(user.email);
            if (user.photoURL) setAvatarUrl(user.photoURL);
            if (user.displayName) {
              const autoSlug = user.displayName
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[^a-z0-9]/g, '-')
                .replace(/-+/g, '-')
                .replace(/^-|-$/g, '');
              setSlug(autoSlug);
            }
          }
        })
        .catch((err) => {
          console.error('Error fetching card:', err);
        })
        .finally(() => {
          setFetching(false);
        });
    }
  }, [user]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    try {
      setIsUploading(true);
      setErrorMessage('');

      const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 600,
        useWebWorker: true,
      };

      const compressedFile = await imageCompression(file, options);
      const storageRef = ref(storage, `cards/${user.uid}/avatar_${Date.now()}`);
      await uploadBytes(storageRef, compressedFile);
      const downloadUrl = await getDownloadURL(storageRef);

      setAvatarUrl(downloadUrl);
    } catch (err: any) {
      console.error('Erro ao fazer upload da foto:', err);
      setErrorMessage('Falha ao processar e enviar foto. Tente novamente.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!fullName.trim()) {
      setErrorMessage('O Nome Completo é obrigatório.');
      return;
    }

    setIsSaving(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const res = await fetch('/api/card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.uid,
          slug,
          fullName,
          role,
          company,
          phone,
          whatsapp,
          email,
          website,
          address,
          city,
          state,
          notes,
          avatarUrl,
          theme,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erro ao salvar o cartão.');
      }

      if (data.card?.slug) {
        setSlug(data.card.slug);
      }

      setSuccessMessage('Cartão de visita digital atualizado com sucesso!');
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Erro inesperado ao salvar.');
    } finally {
      setIsSaving(false);
    }
  };

  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://nuturl.com';
  const publicCardUrl = slug ? `${currentOrigin}/card/${slug}` : '';

  const handleCopyLink = async () => {
    if (!publicCardUrl) return;
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(publicCardUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const previewCardData = {
    fullName: fullName || 'Seu Nome Aqui',
    role: role || 'Seu Cargo ou Especialidade',
    company: company || 'Sua Empresa',
    phone: phone || '+55 (11) 99999-9999',
    whatsapp: whatsapp || phone || '+55 11 99999-9999',
    email: email || (user?.email ?? 'contato@seusite.com'),
    website: website || 'seusite.com.br',
    address: address || 'Av. Paulista, 1000',
    city: city || 'São Paulo',
    state: state || 'SP',
    notes: notes || 'Conecte-se comigo ou salve meu contato diretamente na sua agenda telefônica.',
    avatarUrl,
    slug: slug || 'demo',
    theme,
  };

  if (loading || fetching) {
    return (
      <div style={{ display: 'flex', minHeight: '60vh', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
          <RefreshCw className="animate-spin" size={32} color="#3b82f6" />
          <p style={{ color: '#94a3b8' }}>Carregando dados do seu Cartão de Visita...</p>
        </div>
      </div>
    );
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '0.75rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: '#94a3b8',
    marginBottom: '0.375rem',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    borderRadius: '10px',
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    padding: '0.65rem 0.85rem',
    fontSize: '0.875rem',
    color: '#f8fafc',
    outline: 'none',
    transition: 'border-color 0.2s',
  };

  return (
    <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', color: '#f8fafc' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'rgba(59, 130, 246, 0.15)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              color: '#60a5fa'
            }}>
              <Contact size={20} />
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0 }}>
              Cartão de Visita Digital
            </h1>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', margin: 0 }}>
            Crie seu vCard interativo profissional. Compartilhe via link ou QR Code e permita que clientes salvem seu contato direto na agenda.
          </p>
        </div>

        {slug && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '0.5rem',
            borderRadius: '12px'
          }}>
            <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#94a3b8', paddingLeft: '0.5rem' }}>
              /card/{slug}
            </span>
            <button
              onClick={handleCopyLink}
              type="button"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.375rem',
                padding: '0.35rem 0.75rem',
                borderRadius: '8px',
                fontSize: '0.75rem',
                fontWeight: 600,
                background: 'rgba(255, 255, 255, 0.08)',
                border: 'none',
                color: '#e2e8f0',
                cursor: 'pointer'
              }}
            >
              {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
              {copied ? 'Copiado!' : 'Copiar'}
            </button>
            <a
              href={publicCardUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.375rem',
                padding: '0.35rem 0.75rem',
                borderRadius: '8px',
                fontSize: '0.75rem',
                fontWeight: 600,
                background: 'var(--primary)',
                color: 'white',
                textDecoration: 'none'
              }}
            >
              <ExternalLink size={14} />
              Visualizar
            </a>
          </div>
        )}
      </div>

      {/* Alert Messages */}
      {successMessage && (
        <div style={{
          marginBottom: '1.5rem',
          padding: '0.85rem 1rem',
          borderRadius: '10px',
          background: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          color: '#34d399',
          fontSize: '0.875rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <Check size={18} />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div style={{
          marginBottom: '1.5rem',
          padding: '0.85rem 1rem',
          borderRadius: '10px',
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          color: '#f87171',
          fontSize: '0.875rem'
        }}>
          {errorMessage}
        </div>
      )}

      {/* Main Grid: Form + Preview */}
      <div className="card-editor-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(360px, 1fr)', gap: '2rem', alignItems: 'start' }}>
        
        {/* FORM */}
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Foto e Slug */}
          <div className="glass" style={{ padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <User size={18} color="#60a5fa" />
              Identidade & Foto
            </h2>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.25rem' }}>
              <div style={{
                position: 'relative',
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                overflow: 'hidden',
                background: '#1e293b',
                border: '2px solid rgba(255, 255, 255, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <User size={32} color="#64748b" />
                )}
                {isUploading && (
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(0,0,0,0.6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <RefreshCw className="animate-spin" size={20} color="#60a5fa" />
                  </div>
                )}
              </div>

              <div>
                <label style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: '#f8fafc',
                  cursor: isUploading ? 'not-allowed' : 'pointer'
                }}>
                  <Upload size={16} />
                  <span>{isUploading ? 'Enviando...' : 'Carregar Foto'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    disabled={isUploading}
                    style={{ display: 'none' }}
                  />
                </label>
                <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.35rem', margin: 0 }}>
                  Formatos JPG, PNG ou WebP com compressão automática.
                </p>
              </div>
            </div>

            <div>
              <label style={labelStyle}>Link Personalizado (Slug do Cartão)</label>
              <div style={{
                display: 'flex',
                borderRadius: '10px',
                background: 'rgba(15, 23, 42, 0.7)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                overflow: 'hidden'
              }}>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '0 0.85rem',
                  fontSize: '0.8rem',
                  color: '#94a3b8',
                  background: 'rgba(255, 255, 255, 0.04)',
                  borderRight: '1px solid rgba(255, 255, 255, 0.08)'
                }}>
                  nuturl.com/card/
                </span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                  placeholder="seu-nome"
                  style={{
                    flex: 1,
                    background: 'transparent',
                    border: 'none',
                    padding: '0.65rem 0.85rem',
                    fontSize: '0.875rem',
                    color: '#f8fafc',
                    outline: 'none'
                  }}
                />
              </div>
              <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.35rem' }}>
                Endereço público do seu cartão online.
              </p>
            </div>
          </div>

          {/* Dados Profissionais */}
          <div className="glass" style={{ padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Briefcase size={18} color="#60a5fa" />
              Dados Profissionais
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>Nome Completo *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ex: Dra. Juliana Silva"
                  style={inputStyle}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Cargo / Especialidade</label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="Ex: Arquiteta e Urbanista"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Empresa / Marca</label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Ex: Studio Arquitetura"
                    style={inputStyle}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Canais de Contato */}
          <div className="glass" style={{ padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Phone size={18} color="#60a5fa" />
              Canais de Contato
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>WhatsApp (DDI + DDD + Número)</label>
                <input
                  type="text"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="Ex: 5511999998888"
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Telefone para Chamadas</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Ex: (11) 99999-8888"
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>E-mail Profissional</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contato@empresa.com"
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Website / Portfolio</label>
                <input
                  type="text"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="www.minhaempresa.com"
                  style={inputStyle}
                />
              </div>
            </div>
          </div>

          {/* Endereço & Mini-Bio */}
          <div className="glass" style={{ padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin size={18} color="#60a5fa" />
              Localização & Mensagem
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>Endereço Comercial / Sala</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Ex: Av. Paulista, 1000 - Sala 42"
                  style={inputStyle}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Cidade</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Ex: São Paulo"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>UF</label>
                  <input
                    type="text"
                    value={state}
                    maxLength={2}
                    onChange={(e) => setState(e.target.value.toUpperCase().slice(0, 2))}
                    placeholder="SP"
                    style={inputStyle}
                  />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Apresentação / Mini-bio (vCard Note)</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ex: Especialista em soluções corporativas. Entre em contato para orçamentos e consultorias."
                  style={{ ...inputStyle, resize: 'vertical' }}
                />
              </div>
            </div>
          </div>

          {/* Estilo e Tema */}
          <div className="glass" style={{ padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Palette size={18} color="#60a5fa" />
              Estilo & Tema Visual
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
              {THEMES.map((t) => {
                const isSelected = theme === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTheme(t.id)}
                    style={{
                      padding: '0.85rem 1rem',
                      borderRadius: '10px',
                      textAlign: 'left',
                      background: isSelected ? 'rgba(59, 130, 246, 0.15)' : 'rgba(15, 23, 42, 0.6)',
                      border: isSelected ? '1px solid #3b82f6' : '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#f8fafc',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{t.label}</span>
                      {isSelected && <Check size={16} color="#3b82f6" />}
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{t.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSaving}
            className="btn"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '0.85rem 1.5rem',
              fontSize: '1rem',
              width: '100%',
              cursor: isSaving ? 'not-allowed' : 'pointer'
            }}
          >
            {isSaving ? (
              <>
                <RefreshCw className="animate-spin" size={18} />
                <span>Salvando...</span>
              </>
            ) : (
              <>
                <Save size={18} />
                <span>Salvar Cartão de Visita</span>
              </>
            )}
          </button>
        </form>

        {/* PREVIEW */}
        <div style={{ position: 'sticky', top: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Sparkles size={14} color="#f59e0b" />
              Pré-visualização
            </span>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Tempo real</span>
          </div>

          <div className="glass" style={{ padding: '1rem', borderRadius: '24px' }}>
            <BusinessCardView card={previewCardData} cardUrl={publicCardUrl} isPreview={true} />
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          .card-editor-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
