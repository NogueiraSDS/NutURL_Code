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

  const cleanWhatsapp = (card.whatsapp || '').replace(/\D/g, '');
  const whatsappUrl = cleanWhatsapp ? `https://wa.me/${cleanWhatsapp}` : '';

  const cleanPhone = (card.phone || '').replace(/[^\d+]/g, '');
  const phoneUrl = cleanPhone ? `tel:${cleanPhone}` : '';

  const websiteUrl = card.website
    ? card.website.startsWith('http://') || card.website.startsWith('https://')
      ? card.website
      : `https://${card.website}`
    : '';

  const fullAddress = [card.address, card.city, card.state].filter(Boolean).join(', ');
  const mapsUrl = fullAddress
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`
    : '';

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

  const handleDownloadQrPng = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `qrcode_${card.slug || 'cartao'}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Cartão de Visita - ${card.fullName}`,
          text: `Acesse o cartão de visita digital de ${card.fullName}`,
          url: targetUrl,
        });
        return;
      } catch (err) {}
    }

    if (navigator.clipboard) {
      await navigator.clipboard.writeText(targetUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

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

  // Theme styles configured with inline CSS guarantees
  const themeStyles = {
    dark: {
      cardBg: 'rgba(15, 23, 42, 0.95)',
      cardBorder: '1px solid rgba(255, 255, 255, 0.1)',
      banner: 'linear-gradient(135deg, #1d4ed8 0%, #4338ca 50%, #6b21a8 100%)',
      glow: 'rgba(59, 130, 246, 0.25)',
      primaryBtn: 'linear-gradient(135deg, #2563eb, #4f46e5)',
      btnTextColor: '#ffffff',
      textAccent: '#818cf8',
      badgeBg: 'rgba(16, 185, 129, 0.15)',
      badgeBorder: '1px solid rgba(16, 185, 129, 0.3)',
      badgeText: '#34d399',
      badgeDot: '#34d399',
    },
    elegant: {
      cardBg: 'rgba(10, 10, 10, 0.95)',
      cardBorder: '1px solid rgba(217, 119, 6, 0.3)',
      banner: 'linear-gradient(135deg, #1c1917 0%, #292524 50%, #451a03 100%)',
      glow: 'rgba(217, 119, 6, 0.25)',
      primaryBtn: 'linear-gradient(135deg, #d97706, #b45309)',
      btnTextColor: '#ffffff',
      textAccent: '#fbbf24',
      badgeBg: 'rgba(245, 158, 11, 0.15)',
      badgeBorder: '1px solid rgba(245, 158, 11, 0.3)',
      badgeText: '#fcd34d',
      badgeDot: '#fbbf24',
    },
    modern: {
      cardBg: 'rgba(15, 23, 42, 0.85)',
      cardBorder: '1px solid rgba(6, 182, 212, 0.3)',
      banner: 'linear-gradient(135deg, #0891b2 0%, #0d9488 50%, #1d4ed8 100%)',
      glow: 'rgba(6, 182, 212, 0.25)',
      primaryBtn: 'linear-gradient(135deg, #06b6d4, #2563eb)',
      btnTextColor: '#ffffff',
      textAccent: '#22d3ee',
      badgeBg: 'rgba(6, 182, 212, 0.15)',
      badgeBorder: '1px solid rgba(6, 182, 212, 0.3)',
      badgeText: '#67e8f9',
      badgeDot: '#22d3ee',
    },
    gradient: {
      cardBg: 'rgba(15, 23, 42, 0.92)',
      cardBorder: '1px solid rgba(217, 70, 239, 0.3)',
      banner: 'linear-gradient(135deg, #c026d3 0%, #db2777 50%, #4338ca 100%)',
      glow: 'rgba(217, 70, 239, 0.25)',
      primaryBtn: 'linear-gradient(135deg, #db2777, #9333ea)',
      btnTextColor: '#ffffff',
      textAccent: '#f472b6',
      badgeBg: 'rgba(236, 72, 153, 0.15)',
      badgeBorder: '1px solid rgba(236, 72, 153, 0.3)',
      badgeText: '#f472b6',
      badgeDot: '#ec4899',
    },
  };

  const selectedTheme = themeStyles[(card.theme as keyof typeof themeStyles) || 'dark'] || themeStyles.dark;

  return (
    <div style={{ width: '100%', maxWidth: '420px', margin: '0 auto', position: 'relative', userSelect: 'none' }}>
      
      {/* Outer ambient glow */}
      <div style={{
        position: 'absolute',
        inset: '-4px',
        borderRadius: '28px',
        background: selectedTheme.glow,
        filter: 'blur(20px)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      {/* Main Card Container */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        borderRadius: '24px',
        background: selectedTheme.cardBg,
        border: selectedTheme.cardBorder,
        boxShadow: '0 20px 40px -15px rgba(0,0,0,0.7)',
        overflow: 'hidden',
        backdropFilter: 'blur(16px)',
      }}>
        
        {/* Top Header Banner */}
        <div style={{
          height: '110px',
          background: selectedTheme.banner,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          padding: '0 1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', position: 'relative', zIndex: 2 }}>
            <button
              onClick={handleOpenQrModal}
              title="Ver QR Code"
              type="button"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'rgba(0,0,0,0.4)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              <QrCode size={16} />
            </button>
            <button
              onClick={handleShare}
              title="Compartilhar Cartão"
              type="button"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0 0.75rem',
                height: '36px',
                borderRadius: '20px',
                background: 'rgba(0,0,0,0.4)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: 'white',
                cursor: 'pointer',
                fontSize: '0.75rem',
                fontWeight: 600
              }}
            >
              {copied ? <Check size={14} color="#34d399" /> : <Share2 size={14} />}
              <span>{copied ? 'Copiado!' : 'Compartilhar'}</span>
            </button>
          </div>
        </div>

        {/* Content Section */}
        <div style={{ padding: '0 1.5rem 1.5rem', position: 'relative', zIndex: 5 }}>
          
          {/* Avatar and Verification Badge */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '-45px', marginBottom: '1rem', position: 'relative', zIndex: 10 }}>
            <div style={{
              width: '90px',
              height: '90px',
              borderRadius: '20px',
              overflow: 'hidden',
              background: '#1e293b',
              border: '3px solid #0f172a',
              boxShadow: '0 10px 25px rgba(0,0,0,0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              zIndex: 20
            }}>
              {card.avatarUrl ? (
                <img src={card.avatarUrl} alt={card.fullName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '1.75rem'
                }}>
                  {getInitials(card.fullName)}
                </div>
              )}
            </div>

            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.7rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              padding: '0.3rem 0.65rem',
              borderRadius: '20px',
              background: selectedTheme.badgeBg,
              border: selectedTheme.badgeBorder,
              color: selectedTheme.badgeText,
              marginBottom: '0.25rem'
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: selectedTheme.badgeDot }} />
              Verificado
            </div>
          </div>

          {/* Name & Titles */}
          <div style={{ marginBottom: '1.25rem' }}>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', margin: '0 0 0.35rem 0', lineHeight: 1.2 }}>
              {card.fullName || 'Seu Nome'}
            </h1>

            {(card.role || card.company) && (
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem' }}>
                {card.role && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: selectedTheme.textAccent, fontWeight: 600 }}>
                    <Briefcase size={14} />
                    {card.role}
                  </span>
                )}
                {card.role && card.company && <span style={{ color: '#475569' }}>•</span>}
                {card.company && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: '#cbd5e1' }}>
                    <Building2 size={14} color="#94a3b8" />
                    {card.company}
                  </span>
                )}
              </div>
            )}

            {card.notes && (
              <p style={{
                fontSize: '0.8rem',
                color: '#94a3b8',
                margin: '0.75rem 0 0 0',
                paddingTop: '0.65rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                lineHeight: 1.45,
                whiteSpace: 'pre-line'
              }}>
                {card.notes}
              </p>
            )}
          </div>

          {/* Primary Action Button: Salvar vCard */}
          <button
            onClick={handleSaveContact}
            type="button"
            style={{
              width: '100%',
              padding: '0.85rem 1rem',
              borderRadius: '12px',
              background: selectedTheme.primaryBtn,
              color: selectedTheme.btnTextColor,
              border: 'none',
              fontWeight: 700,
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              cursor: 'pointer',
              marginBottom: '1rem',
              boxShadow: '0 6px 20px -5px rgba(0,0,0,0.4)',
              transition: 'transform 0.15s ease'
            }}
          >
            <Download size={18} />
            Salvar nos Contatos (.vcf)
          </button>

          {/* Contact Badges Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1rem' }}>
            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.65rem',
                  borderRadius: '10px',
                  background: 'rgba(6, 78, 59, 0.4)',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                  color: '#6ee7b7',
                  textDecoration: 'none'
                }}
              >
                <div style={{ padding: '0.4rem', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.2)', display: 'flex' }}>
                  <MessageCircle size={16} color="#34d399" />
                </div>
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 800, color: '#34d399' }}>WhatsApp</div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Conversar</div>
                </div>
              </a>
            )}

            {phoneUrl && (
              <a
                href={phoneUrl}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.65rem',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#e2e8f0',
                  textDecoration: 'none'
                }}
              >
                <div style={{ padding: '0.4rem', borderRadius: '8px', background: 'rgba(59, 130, 246, 0.2)', display: 'flex' }}>
                  <Phone size={16} color="#60a5fa" />
                </div>
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 800, color: '#94a3b8' }}>Ligar</div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{card.phone}</div>
                </div>
              </a>
            )}

            {card.email && (
              <a
                href={`mailto:${card.email}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.65rem',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#e2e8f0',
                  textDecoration: 'none'
                }}
              >
                <div style={{ padding: '0.4rem', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.2)', display: 'flex' }}>
                  <Mail size={16} color="#fbbf24" />
                </div>
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 800, color: '#94a3b8' }}>E-mail</div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{card.email}</div>
                </div>
              </a>
            )}

            {websiteUrl && (
              <a
                href={websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.65rem',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#e2e8f0',
                  textDecoration: 'none'
                }}
              >
                <div style={{ padding: '0.4rem', borderRadius: '8px', background: 'rgba(168, 85, 247, 0.2)', display: 'flex' }}>
                  <Globe size={16} color="#c084fc" />
                </div>
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 800, color: '#94a3b8' }}>Site</div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Acessar</div>
                </div>
              </a>
            )}
          </div>

          {/* Endereço */}
          {fullAddress && (
            <div style={{
              padding: '0.75rem',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.5rem'
            }}>
              <MapPin size={16} color="#f43f5e" style={{ marginTop: '2px', flexShrink: 0 }} />
              <div>
                <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 800, color: '#94a3b8', display: 'block' }}>
                  Localização
                </span>
                <p style={{ fontSize: '0.75rem', color: '#e2e8f0', margin: '2px 0 0 0', lineHeight: 1.3 }}>{fullAddress}</p>
                {mapsUrl && (
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      fontSize: '0.75rem',
                      color: '#60a5fa',
                      textDecoration: 'none',
                      marginTop: '0.35rem'
                    }}
                  >
                    Ver no Google Maps <ExternalLink size={12} />
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Footer Branding */}
          <div style={{ textAlign: 'center', paddingTop: '0.75rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <a
              href="https://nuturl.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.75rem',
                color: '#64748b',
                textDecoration: 'none'
              }}
            >
              <Sparkles size={12} color="#818cf8" />
              Criado com <strong>NutURL</strong>
            </a>
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      {showQrModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(6px)'
        }}>
          <div style={{
            position: 'relative',
            width: '100%',
            maxWidth: '340px',
            borderRadius: '20px',
            background: '#0f172a',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            padding: '1.5rem',
            textAlign: 'center',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
          }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white', margin: '0 0 0.25rem 0' }}>QR Code do Cartão</h3>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: '0 0 1rem 0' }}>
              Aponte a câmera do celular para abrir ou salvar este contato direto na agenda.
            </p>

            {qrDataUrl && (
              <div style={{
                padding: '0.75rem',
                background: 'white',
                borderRadius: '12px',
                display: 'inline-block',
                marginBottom: '1.25rem'
              }}>
                <img src={qrDataUrl} alt="QR Code Cartão" style={{ width: '180px', height: '180px', display: 'block' }} />
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <button
                onClick={handleDownloadQrPng}
                type="button"
                className="btn"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.35rem',
                  padding: '0.65rem 1rem',
                  fontSize: '0.8rem',
                  cursor: 'pointer'
                }}
              >
                <Download size={16} />
                Baixar Imagem (PNG)
              </button>

              <button
                onClick={() => setShowQrModal(false)}
                type="button"
                style={{
                  padding: '0.65rem 1rem',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: 'none',
                  color: '#94a3b8',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
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
