"use strict";

const preferredDisplaySurface = document.getElementById("displaySurface");
const startButton = document.getElementById("startButton");
const stopButton = document.getElementById("stopButton");
const fullscreenButton = document.getElementById("fullscreenButton");
const changeSourceButton = document.getElementById("changeSourceButton");
const videoElement = document.querySelector("video");

let globalStream = null;

if (
  adapter.browserDetails.browser === "chrome" &&
  adapter.browserDetails.version >= 107
) {
  document.getElementById("options").style.display = "block";
} else if (adapter.browserDetails.browser === "firefox") {
  adapter.browserShim.shimGetDisplayMedia(window, "screen");
}

// Start the WebRTC stream here on success
function handleSuccess(stream) {
  startButton.disabled = true;
  stopButton.disabled = false;
  fullscreenButton.disabled = false;
  changeSourceButton.disabled = false;

  preferredDisplaySurface.disabled = true;
  const video = document.querySelector("video");
  video.srcObject = stream;

  // Get the video track from the stream
  const videoTrack = stream.getVideoTracks()[0];
  globalStream = videoTrack;

  // Get the settings from the video track
  const settings = videoTrack.getSettings();

  // Log the fps and resolution to the console
  console.log(`Frames per second: ${settings.frameRate}`);
  console.log(`Resolution: ${settings.width}x${settings.height}`);
  sendMsg("The user has started sharing");

  // Detect if the user pressed the stop button via their Browser
  videoTrack.addEventListener("ended", () => {
    sendMsg("The user has ended sharing");
    startButton.disabled = false;
    stopButton.disabled = true;
    fullscreenButton.disabled = true;
    changeSourceButton.disabled = true;
    preferredDisplaySurface.disabled = false;
    video.srcObject = null;
    location.reload();
  });
}

function handleError(error) {
  sendMsg(`getDisplayMedia error: ${error.name}`, error);
}

function sendMsg(msg, error) {
  const errorElement = document.querySelector("#msgBox");
  errorElement.innerHTML += `<p>${msg}</p>`;
  if (typeof error !== "undefined") {
    console.error(error);
  }
}

// Add listener when clicking the start button to start the media stream and handle accordingly
startButton.addEventListener("click", () => {
  const options = { audio: true, video: true };
  const displaySurface = preferredDisplaySurface.options[preferredDisplaySurface.selectedIndex].value;
  
  if (displaySurface !== "default") {
    options.video = { 
      displaySurface,
      frameRate: { ideal: 120, max: 240 }
     };
  } else {
    options.video = {
      displaySurface: 'default',
      frameRate: { ideal: 120, max: 240 }
    };
  }

  navigator.mediaDevices
    .getDisplayMedia(options)
    .then(handleSuccess, handleError);
});

// Add listener when clicking the start button to start the media stream and handle accordingly
changeSourceButton.addEventListener("click", () => {
  const options = { audio: true, video: true };
  const displaySurface = preferredDisplaySurface.options[preferredDisplaySurface.selectedIndex].value;
  
  if (displaySurface !== "default") {
    options.video = { 
      displaySurface,
      frameRate: { ideal: 120, max: 240 }
     };
  } else {
    options.video = {
      displaySurface: 'default',
      frameRate: { ideal: 120, max: 240 }
    };
  }

  navigator.mediaDevices
    .getDisplayMedia(options)
    .then(handleSuccess, handleError);
});

// Stop the strema button
stopButton.addEventListener("click", () => {
  if(globalStream !== null) {
    // Make options visible again
    startButton.disabled = false;
    stopButton.disabled = true;
    fullscreenButton.disabled = false;
    preferredDisplaySurface.disabled = false;
    globalStream.stop();
    sendMsg("The user has stopped sharing");
    location.reload();
  } else {
    sendMsg("Cannot stop a nonexistent stream")
  }
});

// Fullscreen button.
fullscreenButton.addEventListener('click', () => {
  const video = document.querySelector("video");
  if (globalStream !== null) {
    if(document.fullscreenElement) {
      if(document.exitFullscreen) {
        fullscreenButton.disabled = false;
        document.exitFullscreen();
      }
    } else {
      if(video.requestFullscreen) {
        fullscreenButton.disabled = true;
        video.requestFullscreen();
      }
    }
  }
});

// Add fullscreen exit listener
videoElement.addEventListener("fullscreenchange", () => {
  if(globalStream !== null) {
    fullscreenButton.disabled = false;
  } else {
    fullscreenButton.disabled = true;
  }
})


if (navigator.mediaDevices && "getDisplayMedia" in navigator.mediaDevices) {
  startButton.disabled = false;
} else {
  sendMsg("getDisplayMedia is not supported");
}
