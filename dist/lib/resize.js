let isResizing = false;
let lastX;
let lastY;

const resizableHandle = document.getElementById("resizable-handle");
const container = document.getElementById("container");
const video = document.getElementById("video-container");

resizableHandle.addEventListener("mousedown", (e) => {
  isResizing = true;
  lastX = e.clientX;
  lastY = e.clientY;
});

document.addEventListener("mousemove", (e) => {
  if (isResizing) {
    const width = container.offsetWidth + (e.clientX - lastX);
    const height = (width / video.videoWidth) * video.videoHeight;

    container.style.width = `${width}px`;
    video.style.width = `${width}px`;
    video.style.height = `${height}px`;

    lastX = e.clientX;
    lastY = e.clientY;
  }
});

document.addEventListener("mouseup", (event) => {
  isResizing = false;
});