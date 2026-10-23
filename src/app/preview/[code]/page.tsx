import Link from 'next/link';
import NutUrlLogo from '@/components/NutUrlLogo';

export default async function PreviewPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;

  // Busca dados do link
  let linkUrl = '';
  try {
    const { prisma } = await import('@/lib/prisma');
    const link = await prisma.link.findUnique({
      where: { slug: code },
      select: { url: true }
    });
    if (link) {
      linkUrl = link.url;
    }
  } catch (err) {
    console.error('Erro ao buscar link para preview:', err);
  }

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
        maxWidth: '560px',
        width: '100%',
        padding: '2.5rem',
        borderRadius: '20px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.5rem',
        boxShadow: '0 20px 50px rgba(0,0,0,0.4)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <NutUrlLogo size={36} />
          <span style={{ fontWeight: 800, fontSize: '1.4rem' }}>
            Nut<span style={{ color: 'var(--primary)' }}>URL</span> <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 500 }}>(wnet.me)</span>
          </span>
        </div>

        <div style={{
          background: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.25)',
          borderRadius: '9999px',
          padding: '6px 14px',
          color: '#34d399',
          fontSize: '0.85rem',
          fontWeight: 600
        }}>
          🛡️ Verificação de Link Seguro
        </div>

        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>
          Destino do Link <span style={{ color: '#60a5fa' }}>wnet.me/{code}</span>
        </h1>

        {linkUrl ? (
          <>
            <div style={{
              width: '100%',
              padding: '1rem',
              background: 'rgba(0,0,0,0.3)',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.08)',
              wordBreak: 'break-all',
              fontSize: '0.95rem',
              color: '#38bdf8',
              textAlign: 'left'
            }}>
              <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginBottom: '0.25rem' }}>URL DE DESTINO ORIGINAL:</span>
              {linkUrl}
            </div>

            <a
              href={linkUrl}
              rel="noopener noreferrer"
              className="btn"
              style={{
                width: '100%',
                padding: '12px',
                background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                color: '#fff',
                fontWeight: 700,
                fontSize: '1rem',
                textDecoration: 'none',
                borderRadius: '10px'
              }}
            >
              Prosseguir para o site ➔
            </a>
          </>
        ) : (
          <p style={{ color: '#94a3b8' }}>
            Este link não foi encontrado ou expirou.
          </p>
        )}

        {/* Card de Conversão PLG */}
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
          <p style={{ fontSize: '0.875rem', color: '#cbd5e1', margin: 0, lineHeight: 1.5 }}>
            Este link foi encurtado com o <strong>NutURL (wnet.me)</strong>. Crie links ultra-curtos, páginas de bio completas e baixe vídeos gratuitamente!
          </p>
          <Link
            href="/login"
            className="btn"
            style={{
              padding: '8px 20px',
              background: '#3b82f6',
              color: '#fff',
              fontSize: '0.85rem',
              fontWeight: 600,
              borderRadius: '8px',
              textDecoration: 'none'
            }}
          >
            Criar Minha Conta Grátis
          </Link>
        </div>
      </div>
    </div>
  );
}
