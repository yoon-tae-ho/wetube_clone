const startBtn = document.querySelector("#startBtn");
const video = document.querySelector("#preview");

let stream = null;
let recorder = null;
let videoUrl = null;

const handleDownload = () => {
  const a = document.createElement("a");
  a.href = videoUrl;
  a.download = "MyRecord.webm";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

const handleStop = () => {
  startBtn.innerText = "Download Recording";
  startBtn.removeEventListener("click", handleStop);
  startBtn.addEventListener("click", handleDownload);
  recorder.stop();
};

const handleStart = () => {
  startBtn.innerText = "Stop Recording";
  startBtn.removeEventListener("click", handleStart);
  startBtn.addEventListener("click", handleStop);

  recorder = new MediaRecorder(stream);
  recorder.ondataavailable = (event) => {
    videoUrl = URL.createObjectURL(event.data);
    video.srcObject = null;
    video.src = videoUrl;
    video.loop = true;

    // stop stream
    stream.getTracks().forEach((track) => track.stop());
    stream = null;
  };
  recorder.start();
};

const init = async () => {
  stream = await navigator.mediaDevices.getUserMedia({
    video: { width: "400", height: "400" },
    audio: true,
  });

  video.srcObject = stream;
  video.muted = true;
};

init();

startBtn.addEventListener("click", handleStart);
