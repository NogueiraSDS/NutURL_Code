'use client';

import { useEffect, useState } from 'react';

export default function RedirectClient({ url }: { url: string }) {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (countdown === 0) {
      window.location.href = url;
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown, url]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, padding: '2rem', textAlign: 'center' }}>
      <div className="glass" style={{ padding: '3rem', maxWidth: '500px', width: '100%' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem', fontWeight: 700 }}>
          Você está sendo redirecionado...
        </h1>
        <p style={{ fontSize: '1.25rem', color: '#94a3b8', marginBottom: '2rem' }}>
          Aguarde <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{countdown}</span> segundos.
        </p>
        
        <div style={{ padding: '2rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', marginBottom: '2rem', border: '1px dashed #475569' }}>
          <p style={{ color: '#64748b' }}>[ Espaço para Anúncio AdSense ]</p>
        </div>

        <button 
          onClick={() => window.location.href = url}
          className="btn"
          style={{ width: '100%', background: countdown === 0 ? 'var(--primary)' : '#475569' }}
        >
          {countdown === 0 ? 'Prosseguir agora' : 'Pular Ad'}
        </button>
      </div>
    </div>
  );
}
