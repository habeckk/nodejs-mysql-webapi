let mediaRecorder;
let recordedChunks = [];

async function startRecording() {
  try {
    const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = handleDataAvailable;
    mediaRecorder.start();

    const startButton = document.getElementById('startButton');
    const stopButton = document.getElementById('stopButton');
    startButton.disabled = true;
    stopButton.disabled = false;
  } catch (error) {
    console.error('Erro ao acessar a tela:', error);
  }
}

function stopRecording() {
  mediaRecorder.stop();
  const startButton = document.getElementById('startButton');
  const stopButton = document.getElementById('stopButton');
  const downloadButton = document.getElementById('downloadButton');
  startButton.disabled = false;
  stopButton.disabled = true;
  downloadButton.disabled = false;
}

function handleDataAvailable(event) {
  if (event.data.size > 0) {
    recordedChunks.push(event.data);
  }
}

function downloadVideo() {
  const blob = new Blob(recordedChunks, { type: 'video/webm' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = 'video_gravado.webm';
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
}
