const tabMediaRequests = new Map();
let recording = false;

// Helper para identificar o tipo e filtrar lixo
function classifyUrl(url) {
  if (url.includes('.m3u8')) return 'HLS (m3u8)';
  if (url.includes('.mpd')) return 'DASH (mpd)';
  if (url.includes('.mp4')) return 'Video (mp4)';
  return 'Desconhecido';
}

chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    const { tabId, url, type, method } = details;
    if (tabId < 0 || method !== "GET") return;

    if (!tabMediaRequests.has(tabId)) {
      tabMediaRequests.set(tabId, new Map());
    }

    const mediaList = tabMediaRequests.get(tabId);
    
    const typeName = classifyUrl(url);
    if (typeName !== 'Desconhecido') {
      mediaList.set(url, {
        url,
        type: typeName,
        timestamp: Date.now()
      });
    }
  },
  { 
    urls: [
      "*://*/*.m3u8*", 
      "*://*/*.mp4*", 
      "*://*/*.mpd*"
    ], 
    types: ["xmlhttprequest", "media"] 
  }
);

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status === 'loading') tabMediaRequests.delete(tabId);
});

chrome.tabs.onRemoved.addListener((tabId) => {
  tabMediaRequests.delete(tabId);
});

async function setupOffscreenDocument(path) {
  const offscreenUrl = chrome.runtime.getURL(path);
  const existingContexts = await chrome.runtime.getContexts({
    contextTypes: ['OFFSCREEN_DOCUMENT'],
    documentUrls: [offscreenUrl]
  });

  if (existingContexts.length > 0) return;

  await chrome.offscreen.createDocument({
    url: path,
    reasons: ['USER_MEDIA'],
    justification: 'Gravar a aba atual do usuário'
  });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getMediaUrls") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length === 0) {
        sendResponse({ media: [] });
        return;
      }
      const activeTabId = tabs[0].id;
      const mediaMap = tabMediaRequests.get(activeTabId);
      const mediaList = mediaMap ? Array.from(mediaMap.values()) : [];
      sendResponse({ media: mediaList.reverse(), recording: recording });
    });
    return true; 
  }

  if (request.action === "startTabRecording") {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      if (!tabs || tabs.length === 0) return;
      try {
        const streamId = await chrome.tabCapture.getMediaStreamId({ targetTabId: tabs[0].id });
        await setupOffscreenDocument('offscreen.html');
        
        chrome.runtime.sendMessage({
          type: 'start-recording',
          target: 'offscreen',
          data: streamId
        });
        
        recording = true;
        sendResponse({ status: "started" });
      } catch (err) {
        console.error("[NutURL] Erro tabCapture:", err);
        sendResponse({ status: "error", message: err.message });
      }
    });
    return true;
  }
  
  if (request.action === "stopTabRecording") {
    if (recording) {
      chrome.runtime.sendMessage({
        type: 'stop-recording',
        target: 'offscreen'
      });
      recording = false;
    }
    sendResponse({ status: "stopped" });
    return true;
  }
  
  if (request.type === 'recording-stopped' && request.target === 'background') {
    recording = false;
    chrome.offscreen.closeDocument();
  }
});
