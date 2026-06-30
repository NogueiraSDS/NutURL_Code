import { NextResponse } from 'next/server';
import { load } from 'cheerio';
import youtubedl from 'youtube-dl-exec';

interface MediaInfo {
  type: 'image' | 'video' | 'audio';
  url: string;
  thumbnail?: string;
  title?: string;
  ext?: string;
  quality?: string;
  size?: number;
}

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const medias: MediaInfo[] = [];

    // 1. Tentar com youtube-dl-exec (funciona para plataformas grandes como YouTube, Twitter, Instagram e HLS/m3u8 videos)
    try {
      const ytdlInfo = await youtubedl(url, {
        dumpSingleJson: true,
        noCheckCertificates: true,
        noWarnings: true,
        preferFreeFormats: true,
        addHeader: [
            'referer:youtube.com',
            'user-agent:Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        ]
      });

      // Se for playlist, teremos entries, senão é um objeto direto
      const infoList = (ytdlInfo as any).entries || [ytdlInfo];

      for (const info of infoList) {
        if (!info) continue;
        
        // Pega os formatos (se existirem)
        if (info.formats && info.formats.length > 0) {
           // O youtube-dl-exec retorna info de formatos do pior pro melhor na maioria dos casos, vamos pegar um dos melhores.
           // Tentamos fugir de manifestos m3u8 nativos quando há URL direta se possível, mas dependendo da plataforma, m3u8 é necessário.
           const bestFormat = info.formats.reverse().find((f: any) => f.url && f.protocol !== 'm3u8_native') || info.formats[0];
           
           if (bestFormat || info.url) {
             medias.push({
               type: 'video',
               url: (bestFormat?.url || info.url) as string,
               thumbnail: info.thumbnail,
               title: info.title || 'Video',
               ext: bestFormat?.ext || info.ext,
               quality: bestFormat?.format_note || 'Auto',
               size: bestFormat?.filesize || bestFormat?.filesize_approx || info.filesize || info.filesize_approx || 0
             });
           }
        } else if (info.url) {
           medias.push({
               type: info.ext === 'mp3' || info.ext === 'm4a' ? 'audio' : 'video',
               url: info.url,
               thumbnail: info.thumbnail,
               title: info.title || 'Media',
               ext: info.ext,
               size: info.filesize || info.filesize_approx || 0
           });
        }
      }
    } catch (ytError) {
      console.warn("youtube-dl-exec não conseguiu extrair a mídia (pode não ser suportado, tentando cheerio fallback).");
    }

    // 2. Fallback / Complemento: Fazer fetch simples e usar Cheerio
    try {
      const response = await fetch(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });
      const html = await response.text();
      const $ = load(html);
      
      const baseUrl = new URL(url);

      const resolveUrl = (src?: string) => {
        if (!src) return null;
        if (src.startsWith('data:')) return null; // Ignorar base64 pequeno
        try {
          return new URL(src, baseUrl.origin).href;
        } catch {
          return null;
        }
      };

      // Pegar imagens
      $('img').each((_, el) => {
        const src = resolveUrl($(el).attr('src'));
        if (src && (src.includes('.jpg') || src.includes('.png') || src.includes('.webp') || src.includes('.jpeg'))) {
          if (!medias.some(m => m.url === src)) {
            medias.push({
                type: 'image',
                url: src,
                title: $(el).attr('alt') || 'Imagem Extraída',
                ext: src.split('.').pop()?.split('?')[0] || 'jpg',
                size: 0
            });
          }
        }
      });

      // Pegar tags de vídeo HTML5 (source)
      $('video source').each((_, el) => {
          const src = resolveUrl($(el).attr('src'));
          if (src) {
              if (!medias.some(m => m.url === src)) {
                  medias.push({
                      type: 'video',
                      url: src,
                      title: 'HTML5 Video',
                      ext: src.split('.').pop()?.split('?')[0] || 'mp4',
                      size: 0
                  });
              }
          }
      });

      // Fallback para video direto na tag video
      $('video').each((_, el) => {
        const src = resolveUrl($(el).attr('src'));
        if (src) {
            if (!medias.some(m => m.url === src)) {
                medias.push({
                    type: 'video',
                    url: src,
                    title: 'HTML5 Video',
                    ext: src.split('.').pop()?.split('?')[0] || 'mp4',
                    size: 0
                });
            }
        }
      });

    } catch (cheerioError) {
       console.error("Cheerio fetch falhou:", cheerioError);
    }

    return NextResponse.json({ success: true, medias });

  } catch (error: any) {
    console.error("Downloader API Error:", error);
    return NextResponse.json({ error: error.message || 'Erro interno no servidor' }, { status: 500 });
  }
}
