'use client';

import { useState } from 'react';

interface MediaInfo {
  type: 'image' | 'video' | 'audio';
  url: string;
  thumbnail?: string;
  title?: string;
  ext?: string;
  quality?: string;
  size?: number;
}

const formatSize = (bytes?: number) => {
    if (!bytes) return '';
    const mb = bytes / 1024 / 1024;
    return mb > 1 ? `${mb.toFixed(2)} MB` : `${(bytes / 1024).toFixed(0)} KB`;
};

export default function DownloaderPage() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [medias, setMedias] = useState<MediaInfo[]>([]);

  const handleFetch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    setError('');
    setMedias([]);

    try {
      const response = await fetch('/api/downloader', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch media');
      }

      const sortedMedias = (data.medias || []).sort((a: MediaInfo, b: MediaInfo) => (b.size || 0) - (a.size || 0));
      setMedias(sortedMedias);
      
      if (data.medias?.length === 0) {
          setError('Nenhuma mídia encontrada nessa URL.');
      }
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (mediaUrl: string, title: string, ext: string) => {
      try {
          const res = await fetch(mediaUrl);
          const blob = await res.blob();
          const downloadUrl = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = downloadUrl;
          a.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.${ext}`;
          document.body.appendChild(a);
          a.click();
          a.remove();
          window.URL.revokeObjectURL(downloadUrl);
      } catch (e) {
          window.open(mediaUrl, '_blank');
      }
  };

  return (
    <div style={{ minHeight: '100vh', padding: '3rem 1rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
        
        {/* Header Section */}
        <div style={{ textAlign: 'center' }} className="animate-fade-in">
          <h1 className="text-gradient" style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem' }}>
            Downloader de Mídia
          </h1>
          <p style={{ fontSize: '1.25rem', color: 'rgba(255, 255, 255, 0.7)' }}>
            Cole a URL de qualquer site para extrair vídeos e imagens.
          </p>
        </div>

        {/* Search Box */}
        <div className="glass animate-fade-in" style={{ padding: '2rem', maxWidth: '48rem', margin: '0 auto', width: '100%' }}>
          <form onSubmit={handleFetch} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <input
              type="url"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://exemplo.com/video"
              className="input"
              style={{ flex: '1 1 250px' }}
            />
            <button
              type="submit"
              disabled={loading}
              className="btn"
              style={{ flex: '0 1 auto', whiteSpace: 'nowrap' }}
            >
              {loading ? 'Buscando...' : 'Extrair Mídia'}
            </button>
          </form>

          {error && (
            <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
              {error}
            </div>
          )}
        </div>

        {/* Gallery */}
        {medias.length > 0 && (
          <div className="animate-fade-in" style={{ marginTop: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#fff' }}>
              Mídias Encontradas ({medias.length})
            </h2>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', 
              gap: '1.5rem' 
            }}>
              {medias.map((media, idx) => (
                <div key={idx} className="glass" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}>
                  
                  {/* Thumbnail Area */}
                  <div style={{ position: 'relative', height: '180px', backgroundColor: 'rgba(0,0,0,0.3)' }}>
                    {media.type === 'image' ? (
                      <img src={media.url} alt={media.title} style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
                    ) : media.thumbnail ? (
                      <img src={media.thumbnail} alt={media.title} style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', color: 'rgba(255,255,255,0.5)', fontSize: '2rem' }}>
                        {media.type === 'audio' ? '🎵' : '🎥'}
                      </div>
                    )}
                  </div>

                  {/* Info Area */}
                  <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                    <div style={{ marginBottom: '1rem' }}>
                      <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={media.title}>
                        {media.title || 'Mídia'}
                      </h3>
                      <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)', textTransform: 'capitalize' }}>
                        {media.type} • {media.ext?.toUpperCase() || 'Arquivo'} 
                        {media.quality && ` • ${media.quality}`} 
                        {media.size ? ` • ${formatSize(media.size)}` : ''}
                      </p>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <button
                          onClick={() => handleDownload(media.url, media.title || 'media', media.ext || 'bin')}
                          className="btn"
                          style={{ width: '100%', padding: '0.5rem', fontSize: '0.875rem' }}
                        >
                          Baixar
                        </button>
                        <a 
                          href={media.url} 
                          target="_blank" 
                          rel="noreferrer"
                          style={{ 
                            width: '100%', 
                            textAlign: 'center',
                            padding: '0.5rem', 
                            fontSize: '0.875rem',
                            border: '1px solid rgba(255,255,255,0.2)',
                            borderRadius: '8px',
                            color: '#fff',
                            transition: 'background 0.2s'
                          }}
                          onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          Link Direto
                        </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
