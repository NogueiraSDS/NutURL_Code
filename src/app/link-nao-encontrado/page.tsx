import Link from 'next/link';
import NutUrlLogo from '@/components/NutUrlLogo';

export default function LinkNaoEncontradoPage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      backgroundColor: '#0f172a',
      color: '#f8fafc',
      textAlign: 'center'
    }}>
      <div className="glass" style={{
        maxWidth: '520px',
        width: '100%',
        padding: '3rem 2rem',
        borderRadius: '20px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.25rem',
        boxShadow: '0 20px 50px rgba(0,0,0,0.4)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <NutUrlLogo size={36} />
          <span style={{ fontWeight: 800, fontSize: '1.4rem' }}>
            Nut<span style={{ color: 'var(--primary)' }}>URL</span>
          </span>
        </div>

        <div style={{ fontSize: '3rem', margin: '0.5rem 0' }}>🔍</div>

        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0 }}>
          Link Não Encontrado
        </h1>

        <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.6, margin: 0 }}>
          O link encurtado que você tentou acessar não existe, foi digitado incorretamente ou expirou após o período de validade.
        </p>

        <div style={{
          width: '100%',
          marginTop: '1rem',
          padding: '1.25rem',
          background: 'rgba(59, 130, 246, 0.08)',
          borderRadius: '14px',
          border: '1px solid rgba(59, 130, 246, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          alignItems: 'center'
        }}>
          <p style={{ fontSize: '0.875rem', color: '#cbd5e1', margin: 0 }}>
            Procurando uma forma rápida de encurtar links com <strong>wnet.me</strong>, criar sua Bio ou baixar vídeos?
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link
              href="/"
              className="btn"
              style={{
                padding: '10px 18px',
                background: '#3b82f6',
                color: '#fff',
                fontSize: '0.9rem',
                fontWeight: 600,
                borderRadius: '8px',
                textDecoration: 'none'
              }}
            >
              Ir para a Página Inicial
            </Link>
            <Link
              href="/login"
              className="btn"
              style={{
                padding: '10px 18px',
                background: 'rgba(255,255,255,0.08)',
                color: '#fff',
                fontSize: '0.9rem',
                fontWeight: 600,
                borderRadius: '8px',
                textDecoration: 'none',
                border: '1px solid rgba(255,255,255,0.15)'
              }}
            >
              Criar Conta Grátis
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
