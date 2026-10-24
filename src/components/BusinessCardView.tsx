'use client';

import React, { useState } from 'react';
import QRCode from 'qrcode';
import {
  Phone,
  MessageCircle,
  Mail,
  Globe,
  MapPin,
  Download,
  Share2,
  QrCode,
  Building2,
  Briefcase,
  Check,
  Copy,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { VCardContactData, downloadVCard } from '@/lib/vcard';

interface BusinessCardProps {
  card: {
    fullName: string;
    role?: string | null;
    company?: string | null;
    phone?: string | null;
    whatsapp?: string | null;
    email?: string | null;
    website?: string | null;
    address?: string | null;
    city?: string | null;
    state?: string | null;
    notes?: string | null;
    avatarUrl?: string | null;
    slug?: string | null;
    theme?: string | null;
  };
  cardUrl?: string;
  isPreview?: boolean;
}

export default function BusinessCardView({ card, cardUrl, isPreview = false }: BusinessCardProps) {
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  // Fallback URL if not provided
  const targetUrl =
    cardUrl ||
    (typeof window !== 'undefined'
      ? `${window.location.origin}/card/${card.slug || ''}`
      : `https://nuturl.com/card/${card.slug || ''}`);

  // Format clean WhatsApp link
  const cleanWhatsapp = (card.whatsapp || '').replace(/\D/g, '');
  const whatsappUrl = cleanWhatsapp ? `https://wa.me/${cleanWhatsapp}` : '';

  // Format clean phone link
  const cleanPhone = (card.phone || '').replace(/[^\d+]/g, '');
  const phoneUrl = cleanPhone ? `tel:${cleanPhone}` : '';

  // Format website link
  const websiteUrl = card.website
    ? card.website.startsWith('http://') || card.website.startsWith('https://')
      ? card.website
      : `https://${card.website}`
    : '';

  // Google Maps link
  const fullAddress = [card.address, card.city, card.state].filter(Boolean).join(', ');
  const mapsUrl = fullAddress
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`
    : '';

  // Handle QR code modal open
  const handleOpenQrModal = async () => {
    try {
      const url = await QRCode.toDataURL(targetUrl, {
        width: 400,
        margin: 2,
        color: {
          dark: '#0f172a',
          light: '#ffffff',
        },
      });
      setQrDataUrl(url);
      setShowQrModal(true);
    } catch (err) {
      console.error('Failed to generate QR code', err);
    }
  };

  // Download QR Code PNG
  const handleDownloadQrPng = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `qrcode_${card.slug || 'cartao'}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Handle Share / Copy Link
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Cartão de Visita - ${card.fullName}`,
          text: `Acesse o cartão de visita digital de ${card.fullName}`,
          url: targetUrl,
        });
        return;
      } catch (err) {
        // user cancelled or share failed, fallback to copy
      }
    }

    if (navigator.clipboard) {
      await navigator.clipboard.writeText(targetUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Handle Save vCard contact
  const handleSaveContact = () => {
    downloadVCard({
      fullName: card.fullName,
      role: card.role,
      company: card.company,
      phone: card.phone,
      whatsapp: card.whatsapp,
      email: card.email,
      website: card.website,
      address: card.address,
      city: card.city,
      state: card.state,
      notes: card.notes,
      avatarUrl: card.avatarUrl,
    });
  };

  const getInitials = (name: string) => {
    if (!name) return 'CV';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // Themes configuration
  const themeStyles = {
    dark: {
      cardBg: 'bg-slate-900/95 border-slate-700/60',
      banner: 'bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800',
      glow: 'from-blue-600 via-indigo-600 to-emerald-500',
      primaryBtn: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-600/30',
      textAccent: 'text-indigo-400',
      badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      badgeDot: 'bg-emerald-400',
    },
    elegant: {
      cardBg: 'bg-zinc-950/95 border-amber-500/30',
      banner: 'bg-gradient-to-r from-zinc-900 via-neutral-900 to-amber-950',
      glow: 'from-amber-600 via-yellow-600 to-zinc-800',
      primaryBtn: 'bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-zinc-950 font-bold shadow-amber-500/20',
      textAccent: 'text-amber-400',
      badge: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
      badgeDot: 'bg-amber-400',
    },
    modern: {
      cardBg: 'bg-slate-900/80 border-cyan-500/30 backdrop-blur-2xl',
      banner: 'bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-700',
      glow: 'from-cyan-500 via-teal-500 to-blue-600',
      primaryBtn: 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-cyan-500/25',
      textAccent: 'text-cyan-400',
      badge: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20',
      badgeDot: 'bg-cyan-400',
    },
    gradient: {
      cardBg: 'bg-slate-900/90 border-fuchsia-500/30',
      banner: 'bg-gradient-to-r from-fuchsia-600 via-pink-600 to-indigo-700',
      glow: 'from-pink-600 via-purple-600 to-indigo-600',
      primaryBtn: 'bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white shadow-pink-600/30',
      textAccent: 'text-fuchsia-400',
      badge: 'bg-fuchsia-500/10 text-fuchsia-300 border-fuchsia-500/20',
      badgeDot: 'bg-fuchsia-400',
    },
  };

  const selectedTheme = themeStyles[(card.theme as keyof typeof themeStyles) || 'dark'] || themeStyles.dark;

  return (
    <div className="w-full max-w-md mx-auto relative select-none">
      {/* Background Ambient Glow */}
      <div className={`absolute -inset-1 bg-gradient-to-r ${selectedTheme.glow} rounded-3xl blur-xl opacity-30 pointer-events-none transition-all duration-500`} />

      {/* Main Card Container */}
      <div className={`relative rounded-3xl ${selectedTheme.cardBg} backdrop-blur-xl border shadow-2xl overflow-hidden transition-all duration-300`}>
        
        {/* Top Header Banner */}
        <div className={`h-32 ${selectedTheme.banner} relative flex items-center justify-end px-4 transition-all duration-500`}>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/15 to-transparent pointer-events-none" />
          
          <div className="flex items-center gap-2 relative z-10">
            <button
              onClick={handleOpenQrModal}
              title="Ver QR Code"
              className="p-2.5 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition-transform active:scale-95 border border-white/10"
            >
              <QrCode className="w-4 h-4" />
            </button>
            <button
              onClick={handleShare}
              title="Compartilhar Cartão"
              className="p-2.5 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition-transform active:scale-95 border border-white/10 flex items-center gap-1.5 text-xs font-medium"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              {copied && <span className="text-emerald-300 pr-1">Copiado</span>}
            </button>
          </div>
        </div>

        {/* Avatar Section */}
        <div className="relative px-6 pt-0 pb-4">
          <div className="-mt-16 mb-4 flex justify-between items-end">
            <div className="relative w-28 h-28 rounded-2xl overflow-hidden ring-4 ring-slate-900 bg-slate-800 shadow-xl flex items-center justify-center">
              {card.avatarUrl ? (
                <img
                  src={card.avatarUrl}
                  alt={card.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-3xl">
                  {getInitials(card.fullName)}
                </div>
              )}
            </div>

            <div className="flex flex-col items-end pb-1">
              <span className={`inline-flex items-center gap-1 text-[11px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full ${selectedTheme.badge}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${selectedTheme.badgeDot} animate-pulse`} />
                Cartão Verificado
              </span>
            </div>
          </div>

          {/* Name & Headline */}
          <div className="space-y-1 mb-5">
            <h1 className="text-2xl font-bold text-white tracking-tight leading-snug">
              {card.fullName || 'Seu Nome'}
            </h1>
            
            {(card.role || card.company) && (
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-300">
                {card.role && (
                  <span className={`flex items-center gap-1.5 ${selectedTheme.textAccent} font-medium`}>
                    <Briefcase className="w-3.5 h-3.5" />
                    {card.role}
                  </span>
                )}
                {card.role && card.company && <span className="text-slate-600">•</span>}
                {card.company && (
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    {card.company}
                  </span>
                )}
              </div>
            )}

            {card.notes && (
              <p className="text-xs text-slate-400 pt-2 leading-relaxed whitespace-pre-line border-t border-slate-800/80 mt-2">
                {card.notes}
              </p>
            )}
          </div>

          {/* Primary Action Button: Salvar nos Contatos (vCard) */}
          <button
            onClick={handleSaveContact}
            className={`w-full py-3.5 px-4 rounded-xl ${selectedTheme.primaryBtn} font-semibold text-sm shadow-lg flex items-center justify-center gap-2 active:scale-[0.98] transition-all cursor-pointer mb-5`}
          >
            <Download className="w-4 h-4" />
            Salvar nos Contatos (.vcf)
          </button>

          {/* Quick Contact Action Badges */}
          <div className="grid grid-cols-2 gap-2.5 mb-5">
            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/40 hover:bg-emerald-900/50 text-emerald-300 transition-colors"
              >
                <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div className="min-w-0 text-left">
                  <div className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold">WhatsApp</div>
                  <div className="text-xs font-semibold truncate text-white">Chamar no zap</div>
                </div>
              </a>
            )}

            {phoneUrl && (
              <a
                href={phoneUrl}
                className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 hover:bg-slate-800 text-slate-200 transition-colors"
              >
                <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="min-w-0 text-left">
                  <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Ligar</div>
                  <div className="text-xs font-semibold truncate text-white">{card.phone}</div>
                </div>
              </a>
            )}

            {card.email && (
              <a
                href={`mailto:${card.email}`}
                className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 hover:bg-slate-800 text-slate-200 transition-colors"
              >
                <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="min-w-0 text-left">
                  <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">E-mail</div>
                  <div className="text-xs font-semibold truncate text-white">{card.email}</div>
                </div>
              </a>
            )}

            {websiteUrl && (
              <a
                href={websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 hover:bg-slate-800 text-slate-200 transition-colors"
              >
                <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400">
                  <Globe className="w-4 h-4" />
                </div>
                <div className="min-w-0 text-left">
                  <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Website</div>
                  <div className="text-xs font-semibold truncate text-white">Acessar site</div>
                </div>
              </a>
            )}
          </div>

          {/* Address Item */}
          {fullAddress && (
            <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/40 mb-4 flex items-start gap-3">
              <MapPin className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0 text-left">
                <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block mb-0.5">
                  Endereço / Localização
                </span>
                <p className="text-xs text-slate-200 leading-snug">{fullAddress}</p>
                {mapsUrl && (
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-400 hover:text-blue-300 mt-1.5"
                  >
                    Ver no Google Maps <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Footer Branding */}
          <div className="pt-3 pb-2 text-center border-t border-slate-800/60">
            <a
              href="https://nuturl.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[11px] text-slate-500 hover:text-slate-400 transition-colors"
            >
              <Sparkles className="w-3 h-3 text-indigo-400" />
              Criado com <strong>NutURL</strong> • Cartão Digital
            </a>
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-700 p-6 text-center shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-1">QR Code do Cartão</h3>
            <p className="text-xs text-slate-400 mb-4">
              Aponte a câmera do celular para abrir o cartão de visita digital ou salvar os contatos.
            </p>

            {qrDataUrl && (
              <div className="p-4 bg-white rounded-xl inline-block shadow-inner mb-4">
                <img src={qrDataUrl} alt="QR Code Cartão de Visita" className="w-48 h-48 mx-auto" />
              </div>
            )}

            <div className="flex flex-col gap-2">
              <button
                onClick={handleDownloadQrPng}
                className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Download className="w-4 h-4" />
                Baixar Imagem (PNG)
              </button>

              <button
                onClick={() => setShowQrModal(false)}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs cursor-pointer transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
