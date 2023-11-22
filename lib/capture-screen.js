"use strict";

const preferredDisplaySurface = document.getElementById("displaySurface");
const startButton = document.getElementById("startButton");

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
  preferredDisplaySurface.disabled = true;
  const video = document.querySelector("video");
  video.srcObject = stream;

  // Get the video track from the stream
  const videoTrack = stream.getVideoTracks()[0];

  // Get the settings from the video track
  const settings = videoTrack.getSettings();

  // Log the fps and resolution to the console
  console.log(`Frames per second: ${settings.frameRate}`);
  console.log(`Resolution: ${settings.width}x${settings.height}`);
  sendMsg("The user has started sharing");

  // demonstrates how to detect that the user has stopped
  // sharing the screen via the browser UI.
  stream.getVideoTracks()[0].addEventListener("ended", () => {
    sendMsg("The user has ended sharing");
    startButton.disabled = false;
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

startButton.addEventListener("click", () => {
  const options = { audio: true, video: true };

  const displaySurface =
    preferredDisplaySurface.options[preferredDisplaySurface.selectedIndex]
      .value;
  if (displaySurface !== "default") {
    options.video = { displaySurface };
  }

  // Set FPS to prefer 120+
  options.video.frameRate = { ideal: 120, max: 240 };

  navigator.mediaDevices
    .getDisplayMedia(options)
    .then(handleSuccess, handleError);
});


if (navigator.mediaDevices && "getDisplayMedia" in navigator.mediaDevices) {
  startButton.disabled = false;
} else {
  sendMsg("getDisplayMedia is not supported");
}
