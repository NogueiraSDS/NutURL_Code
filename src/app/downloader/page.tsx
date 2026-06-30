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
  const [isDragging, setIsDragging] = useState(false);
  
  // Controls
  const [sortType, setSortType] = useState<'size' | 'default'>('size');
  const [typeFilter, setTypeFilter] = useState<'all' | 'image' | 'video' | 'audio'>('all');

  const executeFetch = async (targetUrl: string) => {
    if (!targetUrl) return;

    setLoading(true);
    setError('');
    setMedias([]);

    try {
      const response = await fetch('/api/downloader', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: targetUrl }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch media');
      }

      setMedias(data.medias || []);
      
      if (data.medias?.length === 0) {
          setError('Nenhuma mídia encontrada nessa URL.');
      }
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro.');
    } finally {
      setLoading(false);
    }
  };

  const handleFetch = async (e: React.FormEvent) => {
    e.preventDefault();
    executeFetch(url);
  };

  const handleDownload = (mediaUrl: string, title: string, ext: string) => {
      // Regex para substituir caracteres inválidos no Windows, Mac e Linux, mantendo acentos e espaços
      const safeTitle = title.replace(/[\/\\?%*:|"<>]/g, '-').trim() || 'media';
      const filename = `${safeTitle}.${ext}`;
      const proxyUrl = `/api/proxy?url=${encodeURIComponent(mediaUrl)}&filename=${encodeURIComponent(filename)}`;
      window.location.href = proxyUrl;
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedText = e.dataTransfer.getData('text');
    if (droppedText && droppedText.startsWith('http')) {
        setUrl(droppedText);
        executeFetch(droppedText);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pastedText = e.clipboardData.getData('text');
    if (pastedText && pastedText.startsWith('http')) {
        // Usa um timeout curto para permitir que o input atualize o value, e já dispara a busca
        setTimeout(() => executeFetch(pastedText), 50);
    }
  };

  const displayedMedias = [...medias]
    .filter(m => typeFilter === 'all' ? true : m.type === typeFilter)
    .sort((a, b) => {
        if (sortType === 'size') {
            return (b.size || 0) - (a.size || 0);
        }
        return 0; // Mantém ordem original (Padrão/Data)
    });

  return (
    <div 
      style={{ minHeight: '100vh', padding: '3rem 1rem' }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '3rem', position: 'relative' }}>
        
        {isDragging && (
          <div style={{ 
            position: 'absolute', 
            top: -20, left: -20, right: -20, bottom: -20, 
            backgroundColor: 'rgba(59, 130, 246, 0.2)', 
            border: '4px dashed #3b82f6', 
            borderRadius: '24px', 
            zIndex: 50, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            pointerEvents: 'none'
          }}>
            <h2 className="text-4xl font-bold text-white drop-shadow-lg">Solte o link aqui!</h2>
          </div>
        )}

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
        <div className="glass animate-fade-in" style={{ padding: '2rem', maxWidth: '48rem', margin: '0 auto', width: '100%', position: 'relative', zIndex: 10 }}>
          <form onSubmit={handleFetch} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <input
              type="url"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onPaste={handlePaste}
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
            <button
              type="button"
              onClick={() => {
                setUrl('');
                setMedias([]);
                setError('');
              }}
              className="btn"
              style={{ 
                flex: '0 1 auto', 
                whiteSpace: 'nowrap', 
                background: 'rgba(255,255,255,0.1)', 
                backgroundImage: 'none',
                boxShadow: 'none'
              }}
            >
              Limpar
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
          <div className="animate-fade-in" style={{ marginTop: '2rem', position: 'relative', zIndex: 10 }}>
            
            {/* Controls */}
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', gap: '1rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#fff', margin: 0 }}>
                Mídias Encontradas ({displayedMedias.length})
              </h2>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <select 
                  className="input"
                  style={{ width: 'auto', padding: '0.5rem 1rem' }}
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value as any)}
                >
                  <option value="all">Filtro: Todos</option>
                  <option value="image">Somente Imagens</option>
                  <option value="video">Somente Vídeos</option>
                  <option value="audio">Somente Áudios</option>
                </select>

                <select 
                  className="input"
                  style={{ width: 'auto', padding: '0.5rem 1rem' }}
                  value={sortType}
                  onChange={(e) => setSortType(e.target.value as any)}
                >
                  <option value="size">Ordem: Maior Tamanho</option>
                  <option value="default">Ordem: Padrão / Data</option>
                </select>
              </div>
            </div>
            
            {displayedMedias.length === 0 && (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(255,255,255,0.5)' }}>
                    Nenhuma mídia corresponde a esse filtro.
                </div>
            )}

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', 
              gap: '1.5rem' 
            }}>
              {displayedMedias.map((media, idx) => (
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
                      </p>
                      <p style={{ marginTop: '0.25rem', fontSize: '0.875rem', color: 'rgba(167, 139, 250, 0.9)', fontWeight: 'bold' }}>
                        Tamanho: {media.size ? formatSize(media.size) : 'Desconhecido'}
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
