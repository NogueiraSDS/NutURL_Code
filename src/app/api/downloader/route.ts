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

    // 1.5 Interceptar TheFap.net para galerias e pegar as fotos originais
    if (!isExtracted && url.includes('thefap.net')) {
        try {
            const response = await fetch(url);
            const html = await response.text();
            
            let postLinks: string[] = [];
            
            // Regex simples para pegar os hrefs, já que o Cheerio às vezes falha na Vercel se não tiver o pacote instalado nativamente na rota
            const matches = [...html.matchAll(/<a[^>]*href="([^"]+)"[^>]*>/g)];
            for (const m of matches) {
                const href = m[1];
                // Identifica se o link termina com /i1, /v1, etc (padrão de post do thefap)
                if (href && (href.match(/\/i\d+$/) || href.match(/\/v\d+$/))) {
                    const fullLink = href.startsWith('http') ? href : `https://oneprotests.thefap.net${href}`;
                    if (!postLinks.includes(fullLink)) {
                        postLinks.push(fullLink);
                    }
                }
            }
            
            // Se não encontrou links na página, mas a URL atual for de um post único
            if (postLinks.length === 0 && (url.match(/\/i\d+$/) || url.match(/\/v\d+$/))) {
                postLinks.push(url);
            }

            if (postLinks.length > 0) {
                // Função para buscar a mídia original de cada post (em paralelo)
                const fetchPost = async (postUrl: string, idx: number) => {
                    try {
                        const postRes = await fetch(postUrl);
                        const postHtml = await postRes.text();
                        
                        let mediaUrl = '';
                        let type = 'image';
                        let ext = 'jpg';
                        
                        // Verificar se tem vídeo no thefap
                        const videoMatch = postHtml.match(/<video[^>]*>\s*<source[^>]*src="([^"]+)"/i);
                        const fileMatch = postHtml.match(/file=([A-Za-z0-9+/=]+)/);
                        
                        if (videoMatch && videoMatch[1]) {
                            mediaUrl = videoMatch[1];
                            type = 'video';
                            ext = 'mp4';
                        } else if (fileMatch && fileMatch[1]) {
                            // thefap embute vídeos em iframes com o link em base64 no parâmetro file=
                            try {
                                mediaUrl = Buffer.from(fileMatch[1], 'base64').toString('utf8');
                                type = 'video';
                                ext = 'mp4';
                            } catch(e) {}
                        }
                        
                        if (!mediaUrl) {
                            // Buscar a imagem do twitter (geralmente contém pbs.twimg.com/media)
                            const imgMatch = postHtml.match(/src="([^"]+pbs\.twimg\.com\/media[^"]+)"/i);
                            if (imgMatch && imgMatch[1]) {
                                // Trocar :small ou :medium por :orig para pegar a qualidade original máxima
                                mediaUrl = imgMatch[1].replace(/:small$/, ':orig').replace(/:medium$/, ':orig');
                            }
                        }
                        
                        if (mediaUrl) {
                            return {
                                type,
                                url: mediaUrl,
                                title: `TheFap Media ${idx + 1}`,
                                ext,
                                size: 0
                            };
                        }
                    } catch(e) {}
                    return null;
                };

                // Limitar processamento a 50 itens para evitar timeout na Vercel (10 segundos limite)
                const promises = postLinks.slice(0, 50).map((link, i) => fetchPost(link, i));
                const results = await Promise.all(promises);
                
                results.forEach((res: any) => {
                    if (res) medias.push(res);
                });
                
                if (medias.length > 0) {
                    isExtracted = true;
                }
            }
        } catch(err) {
            console.warn("Falha ao usar interceptador thefap", err);
        }
    }

    // 1.6 Interceptar TikTok para usar API tikwm (evita erro de python3/yt-dlp no Vercel e baixa sem marca d'água)
    if (!isExtracted && url.includes('tiktok.com')) {
        try {
            const tkUrl = `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}&hd=1`;
            const tkRes = await fetch(tkUrl);
            const tkJson = await tkRes.json();
            
            if (tkJson?.data) {
                const data = tkJson.data;
                // Vídeo Sem Marca d'Água (HD)
                if (data.hdplay) {
                    medias.push({
                        type: 'video',
                        url: data.hdplay,
                        thumbnail: data.cover,
                        title: data.title || 'TikTok Video',
                        ext: 'mp4',
                        quality: 'Sem Marca d\'Água (HD)',
                        size: data.hd_size || 0
                    });
                }
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
        } catch(err) {
            console.warn("Falha ao usar tikwm, caindo para youtube-dl-exec...");
        }
    }

    // 1.7 Interceptar Reddit via feed RSS (bypassa o Cloudflare/Auth block da Vercel)
    if (!isExtracted && url.includes('reddit.com')) {
        try {
            // Converter a URL para a versão .rss (ex: /user/nome/submitted -> /user/nome/submitted.rss)
            let rssUrl = url.split('?')[0];
            if (rssUrl.endsWith('/')) rssUrl = rssUrl.slice(0, -1);
            if (!rssUrl.endsWith('.rss')) rssUrl += '.rss';
            
            const response = await fetch(rssUrl);
            const xml = await response.text();
            
            // Buscar imagens (preview.redd.it ou i.redd.it) e gifs no XML
            const regex = /(https:\/\/(?:preview|i)\.redd\.it\/[a-zA-Z0-9.\-_]+(jpg|png|gif|jpeg|mp4))/ig;
            const matches = [...xml.matchAll(regex)].map(m => m[1]);
            
            const uniqueUrls = [...new Set(matches)];
            
            uniqueUrls.forEach((mediaUrl, idx) => {
                // Converter preview.redd.it para i.redd.it para pegar a resolução original máxima e sem compressão
                let originalUrl = mediaUrl.replace('preview.redd.it', 'i.redd.it');
                let type = 'image';
                let ext = 'jpg';
                
                if (originalUrl.includes('.gif')) {
                    ext = 'gif';
                } else if (originalUrl.includes('.png')) {
                    ext = 'png';
                } else if (originalUrl.includes('.mp4')) {
                    ext = 'mp4';
                    type = 'video';
                }
                
                medias.push({
                    type: type as any,
                    url: originalUrl,
                    title: `Reddit Media ${idx + 1}`,
                    ext,
                    size: 0
                });
            });
            
            if (medias.length > 0) {
                isExtracted = true;
            }
        } catch(err) {
            console.warn("Falha ao usar interceptador Reddit RSS", err);
        }
    }

    // 2. Tentar usar o btch-downloader (Zero binários, nativo do Node.js)
    if (!isExtracted) {
        try {
            // Se for YouTube
            if (url.includes('youtube.com') || url.includes('youtu.be')) {
                const { youtube } = require('btch-downloader');
                const ytData = await youtube(url);
                
                if (ytData && ytData.status) {
                    if (ytData.mp4) {
                        medias.push({
                            type: 'video',
                            url: ytData.mp4,
                            thumbnail: ytData.thumbnail,
                            title: ytData.title || 'Video',
                            ext: 'mp4',
                            quality: 'Vídeo (Qualidade Padrão)',
                            size: 0
                        });
                    }
                    if (ytData.mp3) {
                        medias.push({
                            type: 'audio',
                            url: ytData.mp3,
                            thumbnail: ytData.thumbnail,
                            title: ytData.title || 'Audio',
                            ext: 'mp3',
                            quality: 'Somente Áudio',
                            size: 0
                        });
                    }
                    if (ytData.mp4 || ytData.mp3) {
                        isExtracted = true;
                    }
                }
            } else if (url.includes('instagram.com')) {
                // Limpar parâmetros de rastreamento (utm_source, igsh, etc) pois quebram a extração de carrossel
                let cleanIgUrl = url.split('?')[0];
                if (!cleanIgUrl.endsWith('/')) {
                    cleanIgUrl += '/';
                }
                
                // Tentar usar o instagram do btch
                const { igdl } = require('btch-downloader');
                const igData = await igdl(cleanIgUrl);
                if (igData && igData.length > 0) {
                    igData.forEach((item: any, idx: number) => {
                        const isVideo = (item.filename && item.filename.includes('.mp4')) || item.url.includes('.mp4');
                        medias.push({
                            type: isVideo ? 'video' : 'image',
                            url: item.url,
                            thumbnail: item.thumbnail || undefined,
                            title: `Instagram Mídia ${idx + 1}`,
                            ext: isVideo ? 'mp4' : 'jpg',
                            size: 0
                        });
                    });
                    isExtracted = true;
                }
            }
        } catch (error: any) {
            console.error("Downloader secundário falhou. Detalhes:", error.message || error);
            // Se for youtube e falhou aqui, não devemos deixar o Cheerio pegar o iframe
            if (url.includes('youtube.com') || url.includes('youtu.be')) {
                return NextResponse.json({ error: `YouTube extraction failed: ${error.message}` }, { status: 500 });
            }
        }
    }

    if (isExtracted && medias.length > 0) {
        return NextResponse.json({ medias });
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
