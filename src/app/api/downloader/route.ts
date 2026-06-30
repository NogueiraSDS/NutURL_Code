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
    let isExtracted = false;

    // 1. Interceptar Twitter / X para usar a API pública do fxtwitter (ignora blobs)
    if (url.includes('twitter.com') || url.includes('x.com')) {
      try {
        const urlObj = new URL(url);
        const pathParts = urlObj.pathname.split('/');
        const statusIndex = pathParts.indexOf('status');
        if (statusIndex !== -1 && pathParts.length > statusIndex + 1) {
            const tweetId = pathParts[statusIndex + 1];
            const fxUrl = `https://api.fxtwitter.com/i/status/${tweetId}`;
            
            const fxRes = await fetch(fxUrl);
            const fxJson = await fxRes.json();
            
            if (fxJson?.tweet?.media?.all) {
                fxJson.tweet.media.all.forEach((media: any) => {
                    let bestUrl = media.url;
                    
                    // Se for vídeo, pegar o mp4 de maior bitrate
                    if (media.type === 'video' && media.variants) {
                        const mp4Variants = media.variants.filter((v: any) => v.content_type === 'video/mp4');
                        if (mp4Variants.length > 0) {
                            mp4Variants.sort((a: any, b: any) => (b.bitrate || 0) - (a.bitrate || 0));
                            bestUrl = mp4Variants[0].url;
                        }
                    }

                    medias.push({
                        type: media.type === 'video' ? 'video' : 'image',
                        url: bestUrl,
                        thumbnail: media.thumbnail_url,
                        title: fxJson.tweet.text || 'Twitter Media',
                        ext: media.type === 'video' ? 'mp4' : 'jpg',
                        size: 0
                    });
                });
                if (medias.length > 0) {
                    isExtracted = true;
                }
            }
        }
      } catch (err) {
        console.warn("Falha ao usar fxtwitter, caindo para youtube-dl-exec...");
      }
    }

    // 2. Tentar usar o youtube-dl-exec (perfeito para YouTube, Vimeo, TikTok, etc)
    if (!isExtracted) {
        try {
          const ytdlInfo = await youtubedl(url, {
            dumpSingleJson: true,
            noCheckCertificates: true,
            noWarnings: true,
            preferFreeFormats: true
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
                 isExtracted = true;
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
               isExtracted = true;
            }
          }
        } catch (ytError: any) {
          console.warn("youtube-dl-exec falhou. Detalhes:", ytError.message || ytError);
        }
    }

    // 3. Fallback / Complemento: Fazer fetch simples e usar Cheerio
    try {
      const response = await fetch(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
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

      // Função para extrair imagens com segurança
      const addImage = (src?: string, alt?: string) => {
          const resolvedUrl = resolveUrl(src);
          if (!resolvedUrl) return;
          
          // ignorar svgs e avatares muito pequenos (opcional)
          if (resolvedUrl.endsWith('.svg')) return;

          if (!medias.some(m => m.url === resolvedUrl)) {
            let ext = resolvedUrl.split('.').pop()?.split('?')[0] || 'jpg';
            if (ext.length > 5) ext = 'jpg'; // se não tem extensão óbvia

            medias.push({
                type: 'image',
                url: resolvedUrl,
                title: alt || 'Imagem Extraída',
                ext,
                size: 0
            });
          }
      };

      // 1. Pegar imagens (considerando lazy loading comum)
      $('img').each((_, el) => {
        const src = $(el).attr('data-src') || $(el).attr('data-lazy-src') || $(el).attr('data-original') || $(el).attr('src');
        addImage(src, $(el).attr('alt'));
      });

      // 2. Pegar de <picture> <source>
      $('picture source').each((_, el) => {
        const srcset = $(el).attr('srcset');
        if (srcset) {
            // srcset pode ter multiplas urls "url 1x, url 2x" - vamos pegar a primeira
            const src = srcset.split(',')[0].trim().split(' ')[0];
            addImage(src);
        }
      });

      // 3. Pegar OpenGraph e Twitter cards (geralmente fotos em boa qualidade)
      $('meta[property="og:image"], meta[name="twitter:image"], meta[itemprop="image"]').each((_, el) => {
        addImage($(el).attr('content'));
      });

      // 4. Pegar Vídeos escondidos em metadados (Comum no Twitter/X e outras redes)
      $('meta[property="og:video"], meta[property="og:video:secure_url"], meta[name="twitter:player:stream"]').each((_, el) => {
        const src = resolveUrl($(el).attr('content'));
        if (src) {
           if (!medias.some(m => m.url === src)) {
              medias.push({
                  type: 'video',
                  url: src,
                  title: 'Social Media Video',
                  ext: src.split('.').pop()?.split('?')[0] || 'mp4',
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
