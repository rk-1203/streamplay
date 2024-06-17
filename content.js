const setPlaybackSpeedForVideo = (video, playbackSpeed) => {
  video.playbackRate = playbackSpeed;
};

const setPlaybackSpeedForAllVideos = (playbackSpeed) => {
  document
    .querySelectorAll('video')
    .forEach((video) => setPlaybackSpeedForVideo(video, playbackSpeed));
};

chrome.runtime.onMessage.addListener((request) => {
  if (request.action === 'SET_PLAYBACK_SPEED') {
    setPlaybackSpeedForAllVideos(request.playbackSpeed);
  }
});
