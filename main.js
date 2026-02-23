const canvas = document.getElementById("airpods-canvas");
const context = canvas.getContext("2d");
const overlayText = document.querySelector(".overlay-text");

canvas.width = 1158;
canvas.height = 770;

const frameCount = 148;
// Apple's public image sequence for AirPods Pro
const currentFrame = index => (
  `https://www.apple.com/105/media/us/airpods-pro/2019/1299e2f5_9206_4470_b28e_08307a42f19b/anim/sequence/large/01-hero-lightpass/${(index + 1).toString().padStart(4, '0')}.jpg`
);

// Preload images into an array so they draw instantly on scroll
const images = [];
let loadedCount = 0;

for (let i = 0; i < frameCount; i++) {
  const img = new Image();
  img.src = currentFrame(i);
  images.push(img);
  
  img.onload = () => {
    loadedCount++;
    if (i === 0) {
      context.drawImage(images[0], 0, 0);
    }
  };
}

// Map scroll progress to the image sequence index
window.addEventListener("scroll", () => {
  const html = document.documentElement;
  const scrollTop = html.scrollTop;
  // Calculate total scrollable height
  const maxScrollTop = html.scrollHeight - window.innerHeight;
  const scrollFraction = scrollTop / maxScrollTop;
  
  // Calculate which frame corresponds to the scroll fraction
  const frameIndex = Math.min(
    frameCount - 1,
    Math.ceil(scrollFraction * frameCount)
  );
  
  // Draw the new frame
  requestAnimationFrame(() => updateImage(frameIndex));
  
  // Trigger text fade-in at 80% scroll
  if (scrollFraction > 0.8) {
    overlayText.classList.add("visible");
  } else {
    overlayText.classList.remove("visible");
  }
});

function updateImage(index) {
  if (images[index]) {
    // Clear canvas and draw new frame
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(images[index], 0, 0);
  }
}
