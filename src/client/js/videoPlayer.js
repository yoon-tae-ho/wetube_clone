const video = document.querySelector("video");
const playBtn = document.querySelector("#play");
const muteBtn = document.querySelector("#mute");
const volumeRange = document.querySelector("#volume");
const currentTime = document.querySelector("#currentTime");
const totalTime = document.querySelector("#totalTime");
const timeline = document.querySelector("#timeline");
const fullscreenBtn = document.querySelector("#fullscreen");
const videoContainer = document.querySelector("#videoContainer");
const videoControls = document.querySelector("#videoControls");

const SHOWING_CN = "showing";
let timeoutId = null;

// initial settings
volumeRange.value = video.volume;

const handlePlayClick = () => {
  if (video.paused) {
    video.play();
    playBtn.innerText = "Pause";
  } else {
    video.pause();
    playBtn.innerText = "Play";
  }
};

const handleMuteClick = () => {
  if (video.muted) {
    video.muted = false;
    muteBtn.innerText = "Mute";
    video.volume === 0
      ? (volumeRange.value = video.volume = 1)
      : (volumeRange.value = video.volume);
  } else {
    video.muted = true;
    muteBtn.innerText = "Unmute";
    volumeRange.value = 0;
  }
};

const handleVolumeChange = () => {
  if (volumeRange.value == 0) {
    video.muted = true;
    muteBtn.innerText = "Unmute";
  }
  if ((video.volume === 0 || video.muted) && volumeRange.value != 0) {
    video.muted = false;
    muteBtn.innerText = "Mute";
  }
  video.volume = volumeRange.value;
};

const formatTime = (time) => {
  let hours = null;
  let minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  if (minutes >= 60) {
    hours = Math.floor(time / 3600);
    minutes = Math.floor((time % 3600) / 60);
  }
  const hoursText = hours ? `${hours}:` : "";
  const minutesText = hours
    ? `${minutes < 10 ? `0${minutes}` : minutes}`
    : minutes;
  const secondsText = seconds >= 10 ? seconds : `0${seconds}`;
  return `${hoursText}${minutesText}:${secondsText}`;
};

const handleTotalTime = (event) => {
  const duration = event.target.duration;
  totalTime.innerText = formatTime(duration);
  timeline.max = Math.floor(duration);
};

const handleCurrentTime = (event) => {
  const time = event.target.currentTime;
  currentTime.innerText = formatTime(time);
  timeline.value = Math.floor(time);
};

const handleTimelineChange = (event) => {
  video.currentTime = event.target.value;
};

const handleFullscreenClick = () => {
  const fullscreen = document.fullscreenElement;
  if (fullscreen === videoContainer) {
    document.exitFullscreen();
    fullscreenBtn.innerText = "Enter fullscreen";
  } else {
    videoContainer.requestFullscreen();
    fullscreenBtn.innerText = "Exit fullscreen";
  }
};

const hideControls = () => videoControls.classList.remove(SHOWING_CN);

const handleMouseMove = () => {
  if (timeoutId) {
    clearTimeout(timeoutId);
    timeoutId = null;
  }
  videoControls.classList.add(SHOWING_CN);
  timeoutId = setTimeout(hideControls, 3000);
};

const handleMouseLeave = () => {
  hideControls();
};

playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMuteClick);
volumeRange.addEventListener("input", handleVolumeChange);
video.addEventListener("loadedmetadata", handleTotalTime);
video.addEventListener("timeupdate", handleCurrentTime);
timeline.addEventListener("input", handleTimelineChange);
fullscreenBtn.addEventListener("click", handleFullscreenClick);
video.addEventListener("mousemove", handleMouseMove);
video.addEventListener("mouseleave", handleMouseLeave);
