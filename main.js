const heroImg = document.querySelector(".hero-img");
const glare = document.querySelector(".glare");
const overlayText = document.querySelector(".overlay-text");
const heroSection = document.getElementById("hero");

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
  
  // 1-IMAGE MAGIC MATH
  requestAnimationFrame(() => {
    if (heroImg && glare) {
      // 1. Camera Zoom out (starts big, scales to 1.0)
      const scale = 1.8 - (scrollFraction * 0.8);
      
      // 2. Camera Blur (starts blurry, focuses to 0px)
      const blur = Math.max(0, 20 - (scrollFraction * 40));
      
      // 3. Fade in from shadows (starts 0 opacity, reaches 1 quickly)
      const opacity = Math.min(1, scrollFraction * 4);
      
      // Apply transforms
      heroImg.style.transform = `scale(${scale})`;
      heroImg.style.filter = `blur(${blur}px) opacity(${opacity})`;
      
      // 4. Studio Light Sweep
      // Glare moves from left to right diagonally
      const glarePos = -100 + (scrollFraction * 200);
      
      // Glare opacity peaks in the middle of the scroll
      const glareOpacity = Math.max(0, Math.sin(scrollFraction * Math.PI) * 0.9);
      
      glare.style.transform = `translateX(${glarePos}%)`;
      glare.style.background = `linear-gradient(105deg, transparent 40%, rgba(255, 255, 255, ${glareOpacity}) 48%, rgba(255, 255, 255, ${glareOpacity}) 52%, transparent 60%)`;
    }
  });
  
  // Fade hero text near the end of the hero sequence
  if (scrollFraction > 0.6) {
    overlayText.classList.add("visible");
  } else {
    overlayText.classList.remove("visible");
  }
});