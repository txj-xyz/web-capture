"use strict";

const preferredDisplaySurface = document.getElementById("displaySurface");
const startButton = document.getElementById("startButton");
const stopButton = document.getElementById("stopButton");
let globalStream = null;

if (
  adapter.browserDetails.browser === "chrome" &&
  adapter.browserDetails.version >= 107
) {
  document.getElementById("options").style.display = "block";
} else if (adapter.browserDetails.browser === "firefox") {
  adapter.browserShim.shimGetDisplayMedia(window, "screen");
}

function handleSuccess(stream) {
  startButton.disabled = true;
  stopButton.disabled = false;

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
    preferredDisplaySurface.disabled = false;
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

stopButton.addEventListener("click", () => {
  if(globalStream !== null) {
    // Make options visible again
    startButton.disabled = false;
    stopButton.disabled = true;
    preferredDisplaySurface.disabled = false;
    globalStream.stop();
    sendMsg("The user has stopped sharing");
  } else {
    sendMsg("Cannot stop a nonexistent stream")
  }
})


if (navigator.mediaDevices && "getDisplayMedia" in navigator.mediaDevices) {
  startButton.disabled = false;
  stopButton.disabled = true;
} else {
  sendMsg("getDisplayMedia is not supported");
}
