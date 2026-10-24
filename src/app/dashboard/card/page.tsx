'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
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
  const [isPending, startTransition] = useTransition();

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
            // Pre-fill with user info if available
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

  // Handle avatar upload
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
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
          <p className="text-slate-400">Carregando dados do seu Cartão de Visita...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Top Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Contact className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Cartão de Visita Digital
            </h1>
          </div>
          <p className="mt-1 text-sm text-slate-400">
            Crie seu vCard interativo profissional. Compartilhe com um toque via link, WhatsApp ou QR Code e permita que clientes salvem seu contato direto na agenda!
          </p>
        </div>

        {/* Public link action bar */}
        {slug && (
          <div className="flex flex-wrap items-center gap-2 bg-slate-900/80 border border-slate-800 p-2 rounded-xl">
            <span className="text-xs font-mono text-slate-400 truncate max-w-[200px] sm:max-w-[260px] pl-2">
              /card/{slug}
            </span>
            <button
              onClick={handleCopyLink}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
            >
              {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              {copied ? 'Copiado!' : 'Copiar'}
            </button>
            <a
              href={publicCardUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white transition-colors"
            >
              <ExternalLink size={14} />
              Visualizar
            </a>
          </div>
        )}
      </div>

      {/* Alert Messages */}
      {successMessage && (
        <div className="mb-6 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-400 flex items-center gap-2 animate-fadeIn">
          <Check className="h-5 w-5 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="mb-6 rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-400 animate-fadeIn">
          {errorMessage}
        </div>
      )}

      {/* Tabs on mobile */}
      <div className="mb-6 flex border-b border-slate-800 lg:hidden">
        <button
          onClick={() => setActiveTab('edit')}
          className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'edit'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Editar Cartão
        </button>
        <button
          onClick={() => setActiveTab('preview')}
          className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors flex items-center justify-center gap-2 ${
            activeTab === 'preview'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Eye size={16} />
          Prévia em Tempo Real
        </button>
      </div>

      {/* Main Grid: Form + Live Preview */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
        {/* FORM COLUMN */}
        <div className={`lg:col-span-7 ${activeTab === 'preview' ? 'hidden lg:block' : 'block'}`}>
          <form onSubmit={handleSave} className="space-y-6">
            {/* Foto e Slug */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-xl">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <User size={18} className="text-blue-400" />
                Identidade & Foto
              </h2>

              <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-slate-700 bg-slate-800 flex items-center justify-center shadow-lg">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <User size={36} className="text-slate-500" />
                    )}
                  </div>
                  {isUploading && (
                    <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center">
                      <RefreshCw className="h-6 w-6 animate-spin text-blue-400" />
                    </div>
                  )}
                </div>

                <div className="flex-1 text-center sm:text-left">
                  <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer border border-slate-700 transition-all">
                    <Upload size={16} />
                    <span>{isUploading ? 'Enviando...' : 'Carregar Foto'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      disabled={isUploading}
                      className="hidden"
                    />
                  </label>
                  <p className="text-xs text-slate-400 mt-2">
                    Formatos JPG, PNG ou WebP. Compressão otimizada automática.
                  </p>
                </div>
              </div>

              {/* Slug / Link Amigável */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Link Personalizado (Slug do Cartão)
                </label>
                <div className="flex rounded-xl bg-slate-950 border border-slate-800 overflow-hidden focus-within:border-blue-500 transition-colors">
                  <span className="inline-flex items-center px-3.5 text-xs text-slate-400 bg-slate-900 border-r border-slate-800">
                    nuturl.com/card/
                  </span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) =>
                      setSlug(
                        e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9_-]/g, '')
                      )
                    }
                    placeholder="seu-nome"
                    className="flex-1 bg-transparent px-3 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none"
                  />
                </div>
                <p className="text-[11px] text-slate-400">
                  Este será o endereço público para o seu cartão interativo.
                </p>
              </div>
            </div>

            {/* Dados Profissionais */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-xl space-y-4">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Briefcase size={18} className="text-blue-400" />
                Dados Profissionais
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ex: Dra. Juliana Silva"
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:border-blue-500 focus:outline-none transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Cargo / Especialidade
                  </label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="Ex: Arquiteta e Urbanista"
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:border-blue-500 focus:outline-none transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Empresa / Marca
                  </label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Ex: Studio Arquitetura"
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:border-blue-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Contato Direto & Redes */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-xl space-y-4">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Phone size={18} className="text-blue-400" />
                Canais de Contato
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <MessageCircle size={14} className="text-emerald-400" />
                    WhatsApp
                  </label>
                  <input
                    type="text"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="Ex: 5511999998888"
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:border-blue-500 focus:outline-none transition-colors"
                  />
                  <p className="text-[11px] text-slate-400">Inclua DDI + DDD (Ex: 5511999998888)</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Phone size={14} className="text-blue-400" />
                    Telefone para Chamadas
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Ex: (11) 99999-8888"
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:border-blue-500 focus:outline-none transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Mail size={14} className="text-sky-400" />
                    E-mail Profissional
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="contato@empresa.com"
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:border-blue-500 focus:outline-none transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Globe size={14} className="text-purple-400" />
                    Site / Portfolio
                  </label>
                  <input
                    type="text"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="www.minhaempresa.com"
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:border-blue-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Localização & Apresentação */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-xl space-y-4">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <MapPin size={18} className="text-blue-400" />
                Localização & Mensagem
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-3 space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Endereço / Sala
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Ex: Av. Brigadeiro Faria Lima, 1500 - Sala 42"
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:border-blue-500 focus:outline-none transition-colors"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Cidade
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Ex: São Paulo"
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:border-blue-500 focus:outline-none transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Estado (UF)
                  </label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value.toUpperCase().slice(0, 2))}
                    placeholder="Ex: SP"
                    maxLength={2}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:border-blue-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Apresentação / Mini-bio (vCard Note)
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ex: Especialista em arquitetura corporativa e design sustentável. Entre em contato para orçamentos e consultorias."
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Tema Visual */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-xl space-y-4">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Palette size={18} className="text-blue-400" />
                Estilo & Tema
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {THEMES.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTheme(t.id)}
                    className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                      theme === t.id
                        ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/10'
                        : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="font-semibold text-sm text-white">{t.label}</span>
                      {theme === t.id && <Check size={16} className="text-blue-400" />}
                    </div>
                    <span className="text-xs text-slate-400">{t.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Action Bar */}
            <div className="sticky bottom-4 z-20">
              <button
                type="submit"
                disabled={isSaving}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-xl shadow-blue-600/25 active:scale-[0.99] transition-all disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <RefreshCw className="h-5 w-5 animate-spin" />
                    <span>Salvando Alterações...</span>
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    <span>Salvar Cartão de Visita</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* LIVE PREVIEW COLUMN */}
        <div className={`lg:col-span-5 ${activeTab === 'edit' ? 'hidden lg:block' : 'block'}`}>
          <div className="sticky top-6">
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Sparkles size={14} className="text-amber-400" />
                Pré-visualização Interativa
              </span>
              <span className="text-xs text-slate-400">Tempo real</span>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-3 sm:p-4 shadow-2xl backdrop-blur-xl">
              <BusinessCardView card={previewCardData} cardUrl={publicCardUrl} isPreview={true} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
