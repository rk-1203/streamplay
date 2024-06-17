const defaultPlaybackSpeed = '1.0';

const getPlaybackSpeedElements = () => {
  const speedController = document.getElementById('speed-controller');
  const speedValue = document.getElementById('speed-value');
  const speedResetButton = document.getElementById('speed-reset-button');

  return {speedController, speedValue, speedResetButton};
};

const changePlaybackSpeed = (playbackSpeed) => {
  const {speedController, speedValue} = getPlaybackSpeedElements();

  // Update the HTML elements with the new playback speed
  speedController.value = playbackSpeed;
  speedValue.textContent = `${playbackSpeed}x`;

  // Update the current tab with the new playback speed
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    const currentTab = tabs[0];
    const currentTabOrigin = new URL(currentTab.url).origin;

    // Send a message to change the playback speed for the tab
    chrome.tabs.sendMessage(currentTab.id, {
      action: 'SET_PLAYBACK_SPEED',
      playbackSpeed: parseFloat(playbackSpeed),
    });

    // Save the playback speed to chrome storage
    chrome.storage.sync.set({
      [currentTabOrigin]: playbackSpeed,
    });
  });
};

const loadPlaybackSpeedFromStorage = () => {
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    const currentTab = tabs[0];
    const currentTabOrigin = new URL(currentTab.url).origin;

    chrome.storage.sync.get([currentTabOrigin], (playbackSpeedMap) => {
      const currentOriginPlaybackSpeed = playbackSpeedMap[currentTabOrigin];
      if (currentOriginPlaybackSpeed) {
        changePlaybackSpeed(currentOriginPlaybackSpeed);
      } else {
        changePlaybackSpeed(defaultPlaybackSpeed);
      }
    });
  });
};

document.addEventListener('DOMContentLoaded', () => {
  const {speedController, speedResetButton} = getPlaybackSpeedElements();

  loadPlaybackSpeedFromStorage();

  speedController.addEventListener('input', (e) => {
    const playbackSpeed = e.target.value;
    changePlaybackSpeed(playbackSpeed);
  });

  speedResetButton.addEventListener('click', () => {
    changePlaybackSpeed(defaultPlaybackSpeed);
  });
});
