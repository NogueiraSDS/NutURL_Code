let mediaRecorder = null;
let recordedChunks = [];

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.target === 'offscreen') {
    switch (message.type) {
      case 'start-recording':
        startRecording(message.data);
        break;
      case 'stop-recording':
        stopRecording();
        break;
    }
  }
});

async function startRecording(streamId) {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        mandatory: {
          chromeMediaSource: 'tab',
          chromeMediaSourceId: streamId
        }
      },
      video: {
        mandatory: {
          chromeMediaSource: 'tab',
          chromeMediaSourceId: streamId
        }
      }
    });

    mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
    
    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        recordedChunks.push(e.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `nuturl_tab_record_${Date.now()}.webm`;
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      recordedChunks = [];
      stream.getTracks().forEach(t => t.stop());

      // Avisar background que terminou para fechar o offscreen
      chrome.runtime.sendMessage({ type: 'recording-stopped', target: 'background' });
    };

    mediaRecorder.start();
  } catch (error) {
    console.error('Falha ao iniciar gravação no offscreen:', error);
  }
}

function stopRecording() {
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop();
  }
}
