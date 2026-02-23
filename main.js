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

// SCROLL OBSERVER for EarGear Story
const scrollSteps = document.querySelectorAll(".scroll-step");
const eargearImages = document.querySelectorAll(".eargear-img");

const observerOptions = {
  root: null,
  rootMargin: "-40% 0px -40% 0px", // Trigger when text is centered
  threshold: 0
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const index = entry.target.getAttribute("data-index");
      
      // Update text opacity
      scrollSteps.forEach(step => step.classList.remove("active"));
      entry.target.classList.add("active");
      
      // Crossfade the sticky image
      eargearImages.forEach(img => img.classList.remove("active"));
      const targetImg = document.getElementById(`eg-img-${index}`);
      if (targetImg) {
        targetImg.classList.add("active");
      }
    }
  });
}, observerOptions);

scrollSteps.forEach(step => {
  observer.observe(step);
});

// MAIN SCROLL EVENT
window.addEventListener("scroll", () => {
  // Hero section scroll calculation
  const html = document.documentElement;
  const scrollTop = html.scrollTop;
  
  const heroTop = heroSection.offsetTop;
  const heroHeight = heroSection.offsetHeight;
  
  const maxHeroScroll = heroHeight - window.innerHeight;
  let scrollFraction = (scrollTop - heroTop) / maxHeroScroll;
  scrollFraction = Math.max(0, Math.min(1, scrollFraction));
  
  const frameIndex = Math.min(
    frameCount - 1,
    Math.ceil(scrollFraction * frameCount)
  );
  
  requestAnimationFrame(() => updateImage(frameIndex));
  
  // Fade hero text near the end of the hero sequence
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
