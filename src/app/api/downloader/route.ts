import { NextResponse } from 'next/server';
import { load } from 'cheerio';


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

    // 1.5 Interceptar TikTok para usar API tikwm (evita erro de python3/yt-dlp no Vercel e baixa sem marca d'água)
    if (!isExtracted && url.includes('tiktok.com')) {
        try {
            const tkUrl = `https://www.tikwm.com/api/?url=${url}`;
            const tkRes = await fetch(tkUrl);
            const tkJson = await tkRes.json();
            
            if (tkJson?.data) {
                const data = tkJson.data;
                // Vídeo Sem Marca d'Água
                if (data.play) {
                    medias.push({
                        type: 'video',
                        url: data.play,
                        thumbnail: data.cover,
                        title: data.title || 'TikTok Video',
                        ext: 'mp4',
                        quality: 'Sem Marca d\'Água',
                        size: data.size || 0
                    });
                }
                // Vídeo Com Marca d'Água
                if (data.wmplay) {
                    medias.push({
                        type: 'video',
                        url: data.wmplay,
                        thumbnail: data.cover,
                        title: data.title || 'TikTok Video',
                        ext: 'mp4',
                        quality: 'Com Marca d\'Água',
                        size: data.wm_size || 0
                    });
                }
                // Áudio
                if (data.music) {
                    medias.push({
                        type: 'audio',
                        url: data.music,
                        thumbnail: data.cover,
                        title: data.music_info?.title || 'TikTok Audio',
                        ext: 'mp3',
                        quality: 'Áudio Original',
                        size: 0
                    });
                }
                // Se for um carrossel de imagens
                if (data.images && data.images.length > 0) {
                    data.images.forEach((imgUrl: string, idx: number) => {
                        medias.push({
                            type: 'image',
                            url: imgUrl,
                            title: `${data.title || 'TikTok Imagem'} - Parte ${idx + 1}`,
                            ext: 'jpg',
                            size: 0
                        });
                    });
                }

                if (medias.length > 0) {
                    isExtracted = true;
                }
            }
        } catch (err) {
            console.warn("Falha ao usar tikwm, caindo para youtube-dl-exec...");
        }
    }

    // 2. Tentar usar o btch-downloader (Zero binários, nativo do Node.js)
    if (!isExtracted) {
        try {
            // Se for YouTube
            if (url.includes('youtube.com') || url.includes('youtu.be')) {
                const ytdl = require('@distube/ytdl-core');
                
                // Obter info completa do vídeo
                const info = await ytdl.getInfo(url);
                
                if (info && info.formats && info.formats.length > 0) {
                    const title = info.videoDetails?.title || 'YouTube Video';
                    const thumbnail = info.videoDetails?.thumbnails?.[0]?.url;
                    
                    // Separar formatos que possuem vídeo e áudio juntos (para evitar vídeos mudos)
                    const playableFormats = ytdl.filterFormats(info.formats, 'videoandaudio');
                    
                    playableFormats.forEach((f: any) => {
                        if (f.url) {
                            medias.push({
                                type: 'video',
                                url: f.url,
                                thumbnail: thumbnail,
                                title: title,
                                ext: f.container || 'mp4',
                                quality: f.qualityLabel || 'Auto',
                                size: f.contentLength ? parseInt(f.contentLength) : 0
                            });
                        }
                    });

                    // Adicionar uma opção focada 100% em áudio de alta qualidade
                    const audioFormats = ytdl.filterFormats(info.formats, 'audioonly');
                    if (audioFormats.length > 0) {
                        const bestAudio = ytdl.chooseFormat(audioFormats, { quality: 'highestaudio' });
                        if (bestAudio && bestAudio.url) {
                            medias.push({
                                type: 'audio',
                                url: bestAudio.url,
                                thumbnail: thumbnail,
                                title: title,
                                ext: bestAudio.container || 'm4a',
                                quality: 'Áudio (Alta Qualidade)',
                                size: bestAudio.contentLength ? parseInt(bestAudio.contentLength) : 0
                            });
                        }
                    }

                    if (medias.length > 0) {
                        isExtracted = true;
                    }
                }
            } else if (url.includes('instagram.com')) {
                // Tentar usar o instagram do btch
                const { igdl } = require('btch-downloader');
                const igData = await igdl(url);
                if (igData && igData.length > 0) {
                    igData.forEach((item: any, idx: number) => {
                        medias.push({
                            type: item.url.includes('.mp4') ? 'video' : 'image',
                            url: item.url,
                            title: `Instagram Mídia ${idx + 1}`,
                            ext: item.url.includes('.mp4') ? 'mp4' : 'jpg',
                            size: 0
                        });
                    });
                    isExtracted = true;
                }
            }
        } catch (error: any) {
            console.error("btch-downloader falhou. Detalhes:", error.message || error);
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
