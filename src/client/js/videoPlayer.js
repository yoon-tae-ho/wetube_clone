const video = document.querySelector("video");
const playBtn = document.querySelector("#play");
const playIcon = playBtn.querySelector(".playIcon");
const pauseIcon = playBtn.querySelector(".pauseIcon");
const muteBtn = document.querySelector("#mute");
const muteIcon = muteBtn.querySelector(".muteIcon");
const unMuteIcon = muteBtn.querySelector(".unMuteIcon");
const volumeRange = document.querySelector("#volume");
const currentTime = document.querySelector("#currentTime");
const totalTime = document.querySelector("#totalTime");
const timeline = document.querySelector("#timeline");
const fullscreenBtn = document.querySelector("#fullscreen");
const expandIcon = fullscreenBtn.querySelector(".expandIcon");
const compressIcon = fullscreenBtn.querySelector(".compressIcon");
const videoContainer = document.querySelector("#videoContainer");
const videoBottom = document.querySelector(".videoBottom");

const SHOWING_CN = "showing";
const HIDDEN_CN = "hidden";
let leaveTimeoutId = null;
let unmoveTimeoutId = null;

// initial settings
volumeRange.value = video.volume;
pauseIcon.classList.add(HIDDEN_CN);
muteIcon.classList.add(HIDDEN_CN);
compressIcon.classList.add(HIDDEN_CN);

const handlePlayClick = () => {
  if (video.paused) {
    video.play();
    playIcon.classList.add(HIDDEN_CN);
    pauseIcon.classList.remove(HIDDEN_CN);
  } else {
    video.pause();
    pauseIcon.classList.add(HIDDEN_CN);
    playIcon.classList.remove(HIDDEN_CN);
  }
};

const handleVideoClick = (event) => {
  const target = event.target;
  if (target === videoContainer || target === video) {
    handlePlayClick();
  }
};

const handleMuteClick = () => {
  if (video.muted) {
    video.muted = false;
    muteIcon.classList.add(HIDDEN_CN);
    unMuteIcon.classList.remove(HIDDEN_CN);
    video.volume === 0
      ? (volumeRange.value = video.volume = 1)
      : (volumeRange.value = video.volume);
  } else {
    video.muted = true;
    unMuteIcon.classList.add(HIDDEN_CN);
    muteIcon.classList.remove(HIDDEN_CN);
    volumeRange.value = 0;
  }
};

const handleVolumeChange = () => {
  if (volumeRange.value == 0) {
    video.muted = true;
    unMuteIcon.classList.add(HIDDEN_CN);
    muteIcon.classList.remove(HIDDEN_CN);
  }
  if ((video.volume === 0 || video.muted) && volumeRange.value != 0) {
    video.muted = false;
    muteIcon.classList.add(HIDDEN_CN);
    unMuteIcon.classList.remove(HIDDEN_CN);
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
    compressIcon.classList.add(HIDDEN_CN);
    expandIcon.classList.remove(HIDDEN_CN);
  } else {
    videoContainer.requestFullscreen();
    expandIcon.classList.add(HIDDEN_CN);
    compressIcon.classList.remove(HIDDEN_CN);
  }
};

const hideControls = () => videoBottom.classList.remove(SHOWING_CN);

const handleMouseMove = () => {
  if (leaveTimeoutId) {
    clearTimeout(leaveTimeoutId);
    leaveTimeoutId = null;
  }
  if (unmoveTimeoutId) {
    clearTimeout(unmoveTimeoutId);
    unmoveTimeoutId = null;
  }
  videoBottom.classList.add(SHOWING_CN);
  unmoveTimeoutId = setTimeout(hideControls, 3000);
};

const handleMouseLeave = () => {
  leaveTimeoutId = setTimeout(hideControls, 100);
};

const handleEnded = () => {
  const { videoId } = videoContainer.dataset;
  console.log(videoId);
  fetch(`/api/videos/${videoId}/view`, {
    method: "POST",
  });
};

const handleSpaceDown = (event) => {
  if (event.code === "Space") {
    handlePlayClick();
  }
};

playBtn.addEventListener("click", handlePlayClick);
videoContainer.addEventListener("click", handleVideoClick);
muteBtn.addEventListener("click", handleMuteClick);
volumeRange.addEventListener("input", handleVolumeChange);
video.addEventListener("loadedmetadata", handleTotalTime);
video.addEventListener("timeupdate", handleCurrentTime);
timeline.addEventListener("input", handleTimelineChange);
fullscreenBtn.addEventListener("click", handleFullscreenClick);
videoContainer.addEventListener("mousemove", handleMouseMove);
videoContainer.addEventListener("mouseleave", handleMouseLeave);
video.addEventListener("ended", handleEnded);
window.addEventListener("keydown", handleSpaceDown);
