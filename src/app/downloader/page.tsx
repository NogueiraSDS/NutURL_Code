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
      // Cria uma tag invisível para forçar download caso o browser tente reproduzir a mídia no lugar
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
          // Fallback se CORS bloquear o fetch
          window.open(mediaUrl, '_blank');
      }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl">
            Downloader de Mídia
          </h1>
          <p className="mt-3 text-xl text-gray-500 dark:text-gray-400">
            Cole a URL de qualquer site para extrair vídeos e imagens.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow rounded-xl p-8 max-w-2xl mx-auto border border-gray-100 dark:border-gray-700">
          <form onSubmit={handleFetch} className="flex flex-col sm:flex-row gap-4">
            <input
              type="url"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://exemplo.com/video"
              className="flex-1 min-w-0 block w-full px-4 py-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 sm:text-lg"
            />
            <button
              type="submit"
              disabled={loading}
              className={`inline-flex items-center px-6 py-3 border border-transparent text-lg font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Buscando...' : 'Extrair'}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/50 text-red-700 dark:text-red-200 rounded-md">
              {error}
            </div>
          )}
        </div>

        {medias.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Mídias Encontradas ({medias.length})</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {medias.map((media, idx) => (
                <div key={idx} className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden flex flex-col">
                  <div className="relative">
                    {media.type === 'image' ? (
                      <img src={media.url} alt={media.title} className="object-cover w-full h-48" />
                    ) : media.thumbnail ? (
                      <img src={media.thumbnail} alt={media.title} className="object-cover w-full h-48" />
                    ) : (
                      <div className="flex items-center justify-center w-full h-48 bg-gray-800 text-white">
                        {media.type === 'audio' ? '🎵 Áudio' : '🎥 Vídeo'}
                      </div>
                    )}
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate" title={media.title}>
                        {media.title}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 capitalize">
                        {media.type} • {media.ext?.toUpperCase() || 'Arquivo'} {media.quality && `• ${media.quality}`} {media.size ? `• ${formatSize(media.size)}` : ''}
                      </p>
                    </div>
                    <div className="mt-4 flex flex-col gap-2">
                        <button
                          onClick={() => handleDownload(media.url, media.title || 'media', media.ext || 'bin')}
                          className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          Baixar
                        </button>
                        <a 
                          href={media.url} 
                          target="_blank" 
                          rel="noreferrer"
                          className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Abrir Link Direto
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
