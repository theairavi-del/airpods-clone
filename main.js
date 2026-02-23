const canvas = document.getElementById("airpods-canvas");
const context = canvas.getContext("2d");
const overlayText = document.querySelector(".overlay-text");
const heroSection = document.getElementById("hero");

canvas.width = 1158;
canvas.height = 770;

const frameCount = 148;
// Apple's public image sequence for AirPods Pro
const currentFrame = index => (
  `https://www.apple.com/105/media/us/airpods-pro/2019/1299e2f5_9206_4470_b28e_08307a42f19b/anim/sequence/large/01-hero-lightpass/${(index + 1).toString().padStart(4, '0')}.jpg`
);

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

window.addEventListener("scroll", () => {
  // Calculate progress purely within the hero section
  const html = document.documentElement;
  const scrollTop = html.scrollTop;
  
  const heroTop = heroSection.offsetTop;
  const heroHeight = heroSection.offsetHeight;
  
  // Total scrollable distance within the hero section (leaving 1vh for the sticky frame itself)
  const maxHeroScroll = heroHeight - window.innerHeight;
  
  // Prevent negative progress and cap it at 1 (100%)
  let scrollFraction = (scrollTop - heroTop) / maxHeroScroll;
  scrollFraction = Math.max(0, Math.min(1, scrollFraction));
  
  const frameIndex = Math.min(
    frameCount - 1,
    Math.ceil(scrollFraction * frameCount)
  );
  
  requestAnimationFrame(() => updateImage(frameIndex));
  
  // Trigger text fade-in at 80% scroll of the hero section
  if (scrollFraction > 0.8) {
    overlayText.classList.add("visible");
  } else {
    overlayText.classList.remove("visible");
  }
});

function updateImage(index) {
  if (images[index]) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(images[index], 0, 0);
  }
}
