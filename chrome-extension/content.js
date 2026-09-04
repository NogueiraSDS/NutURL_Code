// Utils
function getAbsoluteUrl(base, relative) {
  try { return new URL(relative, base).href; } catch(e) { return relative; }
}

function captureThumbnail(video) {
  try {
    if (!video.videoWidth || !video.videoHeight) return null;
    const canvas = document.createElement('canvas');
    // Limita tamanho para não estourar memória com 4k e para carregar rápido
    canvas.width = 320;
    canvas.height = (video.videoHeight / video.videoWidth) * 320;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', 0.6);
  } catch (e) {
    // Cross-origin taint inviabiliza toDataURL às vezes
    return null;
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "scanDOM") {
    const videos = Array.from(document.querySelectorAll('video'));
    const results = [];
    
    videos.forEach((v, index) => {
      if (!v.dataset.nuturlId) {
        v.dataset.nuturlId = `vid_${Date.now()}_${index}`;
      }
      
      let urls = [];
      if (v.src) urls.push(v.src);
      v.querySelectorAll('source').forEach(s => { if(s.src) urls.push(s.src); });
      
      const isBlob = urls.some(u => u.startsWith('blob:'));
      const thumb = captureThumbnail(v);
      
      results.push({
        id: v.dataset.nuturlId,
        urls: urls,
        isBlob: isBlob,
        duration: v.duration && !isNaN(v.duration) ? v.duration : 0,
        thumbnail: thumb
      });
    });
    
    sendResponse({ status: "ok", videos: results });
    return true;
  }
  
  if (request.action === "startRecording") {
    startScreenRecording(request.videoId);
    sendResponse({status: "ok"});
  }

  if (request.action === "downloadHLS") {
    downloadHLS(request.url);
    sendResponse({status: "ok"});
  }
});

// Download HLS function
async function downloadHLS(m3u8Url) {
  try {
    console.log("[NutURL] Iniciando download HLS:", m3u8Url);
    alert("Iniciando download HLS localmente. Por favor, aguarde... (Olhe o console para progresso)");
    
    let response = await fetch(m3u8Url);
    let text = await response.text();
    let playlistUrl = m3u8Url;

    if (text.includes('#EXT-X-STREAM-INF')) {
      const lines = text.split('\n');
      let bestResUrl = null;
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith('#EXT-X-STREAM-INF')) {
          bestResUrl = lines[i+1].trim(); 
        }
      }
      if (bestResUrl) {
        playlistUrl = getAbsoluteUrl(m3u8Url, bestResUrl);
        response = await fetch(playlistUrl);
        text = await response.text();
      }
    }

    const lines = text.split('\n');
    const segmentUrls = [];
    for (let line of lines) {
      line = line.trim();
      if (line && !line.startsWith('#')) {
        segmentUrls.push(getAbsoluteUrl(playlistUrl, line));
      }
    }

    if (segmentUrls.length === 0) {
      alert("Nenhum segmento encontrado neste arquivo m3u8.");
      return;
    }

    console.log(`[NutURL] Encontrados ${segmentUrls.length} segmentos. Iniciando download...`);

    const buffers = [];
    for (let i = 0; i < segmentUrls.length; i++) {
      console.log(`[NutURL] Baixando chunk ${i + 1}/${segmentUrls.length}`);
      const chunkResp = await fetch(segmentUrls[i]);
      const chunkData = await chunkResp.arrayBuffer();
      buffers.push(chunkData);
    }

    console.log("[NutURL] Criando arquivo local...");
    const blob = new Blob(buffers, { type: 'video/mp2t' });
    const localUrl = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = localUrl;
    a.download = `video_nuturl_${Date.now()}.ts`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(localUrl);

    alert("Download HLS concluído!");
  } catch (error) {
    console.error("[NutURL] Erro ao baixar HLS:", error);
    alert("Falha ao baixar HLS. Veja o console para detalhes.");
  }
}

// MediaRecorder function
function startScreenRecording(videoId) {
  const video = document.querySelector(`video[data-nuturl-id="${videoId}"]`);
  if (!video) {
    alert("Vídeo não encontrado na página.");
    return;
  }
  
  try {
    let stream;
    if (video.captureStream) {
      stream = video.captureStream();
    } else if (video.mozCaptureStream) {
      stream = video.mozCaptureStream();
    } else {
      throw new Error("Navegador não suporta captureStream");
    }

    // A inicialização pode falhar aqui por SecurityError (CORS) em sites como Telegram Web
    const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
    const chunks = [];

    mediaRecorder.ondataavailable = function(e) {
      if (e.data.size > 0) chunks.push(e.data);
    };

    mediaRecorder.onstop = function() {
      const blob = new Blob(chunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `gravacao_nuturl_${Date.now()}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      alert("Gravação salva com sucesso!");
    };

    mediaRecorder.start();
    alert("Gravação silenciosa iniciada! Dê play no vídeo se não estiver tocando. Para parar, pause o vídeo.");

    video.addEventListener('pause', () => {
      if(mediaRecorder.state === 'recording') mediaRecorder.stop();
    }, { once: true });
    
    video.addEventListener('ended', () => {
      if(mediaRecorder.state === 'recording') mediaRecorder.stop();
    }, { once: true });

  } catch (err) {
    console.error("[NutURL] Falha no captureStream (CORS/DRM).", err);
    alert("Esse vídeo não suporta gravação silenciosa. Use o 'Gravação Nativa de Aba' no popup da extensão.");
  }
}

