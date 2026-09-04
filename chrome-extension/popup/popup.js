let isRecording = false;

document.addEventListener('DOMContentLoaded', () => {
  loadNetworkMedia();
  scanDOM();

  document.getElementById('btn-scan-dom').onclick = scanDOM;
});

function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return '';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

async function fetchSizeText(url) {
  try {
    const res = await fetch(url, { method: 'HEAD' });
    const size = res.headers.get('content-length');
    if (size) {
      return (parseInt(size) / (1024 * 1024)).toFixed(2) + ' MB';
    }
  } catch (e) {}
  return '';
}

function scanDOM() {
  const list = document.getElementById('dom-list');
  list.innerHTML = '<li class="empty-state">Buscando vídeos na página...</li>';
  
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    if(!tabs || !tabs[0]) return;
    chrome.tabs.sendMessage(tabs[0].id, { action: "scanDOM" }, (response) => {
      if (chrome.runtime.lastError) {
        list.innerHTML = '<li class="empty-state">Erro: Recarregue a página da web para a extensão injetar o script.</li>';
        return;
      }
      
      if (response && response.videos && response.videos.length > 0) {
        list.innerHTML = '';
        response.videos.forEach(v => {
          const li = document.createElement('li');
          li.className = 'dom-item';
          
          const thumbDiv = document.createElement('div');
          thumbDiv.className = 'thumb-container';
          if (v.thumbnail) {
            const img = document.createElement('img');
            img.src = v.thumbnail;
            img.className = 'thumb-img';
            thumbDiv.appendChild(img);
          } else {
            thumbDiv.innerHTML = '<span class="thumb-placeholder">Sem Capa</span>';
          }
          
          if (v.duration > 0) {
            const timeBadge = document.createElement('div');
            timeBadge.className = 'duration-badge';
            timeBadge.textContent = formatTime(v.duration);
            thumbDiv.appendChild(timeBadge);
          }
          
          const infoDiv = document.createElement('div');
          infoDiv.className = 'info-container';
          
          const header = document.createElement('div');
          header.className = 'media-info';
          header.innerHTML = `<span class="media-type">${v.isBlob ? 'BLOB / PROTEGIDO' : 'Vídeo (DOM)'}</span>`;
          
          const urlStr = (v.urls && v.urls[0]) ? v.urls[0] : 'URL Oculta / Dinâmica';
          const urlDiv = document.createElement('div');
          urlDiv.className = 'media-url';
          urlDiv.textContent = urlStr;
          
          const btn = document.createElement('button');
          if (v.isBlob || urlStr === 'URL Oculta / Dinâmica') {
            if (isRecording) {
              btn.className = 'btn warning';
              btn.textContent = 'Parar Gravação (Aba)';
              btn.onclick = stopTabRecording;
            } else {
              btn.className = 'btn warning';
              btn.textContent = 'Gravação Nativa de Aba';
              btn.onclick = () => startTabRecording();
            }
          } else {
            btn.className = 'btn primary';
            btn.textContent = 'Baixar Arquivo';
            btn.onclick = () => chrome.downloads.download({ url: v.urls[0] });
          }
          
          infoDiv.appendChild(header);
          infoDiv.appendChild(urlDiv);
          infoDiv.appendChild(btn);
          
          li.appendChild(thumbDiv);
          li.appendChild(infoDiv);
          list.appendChild(li);
        });
      } else {
        list.innerHTML = '<li class="empty-state">Nenhum vídeo visível na tela no momento.</li>';
      }
    });
  });
}

function startTabRecording() {
  chrome.runtime.sendMessage({ action: "startTabRecording" }, (res) => {
    if (res && res.status === "started") {
      isRecording = true;
      scanDOM(); // Re-render for stop button
      alert("A aba começou a ser gravada nos bastidores! Dê play no vídeo.");
    } else {
      alert("Erro ao iniciar gravação: " + (res.message || "Desconhecido"));
    }
  });
}

function stopTabRecording() {
  chrome.runtime.sendMessage({ action: "stopTabRecording" }, (res) => {
    isRecording = false;
    scanDOM();
  });
}

function loadNetworkMedia() {
  chrome.runtime.sendMessage({ action: "getMediaUrls" }, (response) => {
    if (response) {
      isRecording = !!response.recording;
      // Atualizar o botão no DOM caso já tenha sido renderizado
      scanDOM();
    }
    const list = document.getElementById('media-list');
    if (response && response.media && response.media.length > 0) {
      list.innerHTML = '';
      response.media.forEach(async (m) => {
        const li = document.createElement('li');
        
        const top = document.createElement('div');
        top.className = 'media-info';
        
        const type = document.createElement('span');
        type.className = 'media-type';
        type.textContent = m.type;
        top.appendChild(type);

        const sizeSpan = document.createElement('span');
        sizeSpan.className = 'media-size';
        top.appendChild(sizeSpan);
        
        const urlEl = document.createElement('div');
        urlEl.className = 'media-url';
        urlEl.textContent = m.url;
        
        const btn = document.createElement('button');
        btn.className = 'btn primary';
        btn.textContent = 'Baixar Localmente';
        btn.onclick = () => {
          if (m.type.includes('mp4')) {
            chrome.downloads.download({ url: m.url });
          } else {
            startHLSDownload(m.url);
          }
        };
        
        li.appendChild(top);
        li.appendChild(urlEl);
        li.appendChild(btn);
        list.appendChild(li);

        // Fetch file size if MP4
        if (m.type.includes('mp4')) {
          sizeSpan.textContent = 'Calculando...';
          const sz = await fetchSizeText(m.url);
          sizeSpan.textContent = sz;
        } else {
          sizeSpan.textContent = 'Stream';
        }
      });
    } else {
      list.innerHTML = '<li class="empty-state">Nenhuma requisição M3U8 ou MP4 pega. Rode o vídeo para interceptar.</li>';
    }
  });
}

function startHLSDownload(url) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { action: "downloadHLS", url: url }, (response) => {
      if(chrome.runtime.lastError) {
        alert("Erro: Recarregue a página para injetar o script.");
      }
    });
  });
}
