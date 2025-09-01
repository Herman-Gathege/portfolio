const navLinks = document.querySelectorAll(".nav-menu .nav-link");
const menuOpenButton = document.querySelector("#menu-open-button");
const menuCloseButton = document.querySelector("#menu-close-button");

menuOpenButton.addEventListener("click", () => {
  // Toggle mobile menu visibility
  document.body.classList.toggle("show-mobile-menu");
});

// close menu when the close button is clicked
menuCloseButton.addEventListener("click", () => menuOpenButton.click());

// close menu when the nav link is clicked
navLinks.forEach((link) => {
  link.addEventListener("click", () => menuOpenButton.click());
});

// Initialize Swiper
const swiper = new Swiper(".slider-wrapper", {
  loop: true,
  grabCursor: true,
  spaceBetween: 25,

  // If we need pagination
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
    dynamicBullets: true,
  },

  // Navigation arrows
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },

  // Responsive breakpoints
  breakpoints: {
    0: {
      slidesPerView: 1,
    },
    768: {
      slidesPerView: 2,
    },
    1024: {
      slidesPerView: 3,
    },
  },
});

// Parallax effect for hero section
window.addEventListener("scroll", () => {
  const hero = document.querySelector(".hero-section");
  if (!hero) return; // safety check

  if (window.scrollY > 100) {
    hero.classList.add("scrolled");
  } else {
    hero.classList.remove("scrolled");
  }
});



// Parallax and shooting stars
const hero = document.querySelector(".hero-section");
const spaceman = document.querySelector(".spaceman");
const shootingStarsContainer = document.querySelector(".shooting-stars-container");

let lastScrollY = 0;

function handleScroll() {
  const scrollY = window.scrollY;

  // Add scrolled class for background parallax
  if (scrollY > 100) {
    hero.classList.add("scrolled");
  } else {
    hero.classList.remove("scrolled");
  }

  // Parallax for spaceman (subtle movement)
  const parallaxY = scrollY * -0.15; // Move up slightly as you scroll down
  const parallaxX = scrollY * -0.1;  // Move left slightly
  spaceman.style.transform = `translate(${parallaxX}px, ${parallaxY}px)`; // Combine with CSS animation

  lastScrollY = scrollY;
}

// Shooting stars effect
function createShootingStar() {
  const star = document.createElement("div");
  star.className = "shooting-star";
  star.style.left = `${Math.random() * 50 + 25}%`; // Random start position
  shootingStarsContainer.appendChild(star);

  // Remove star after animation
  setTimeout(() => star.remove(), 1500);
}

// Create shooting stars periodically
setInterval(createShootingStar, 2000);

// Throttle scroll for performance
let ticking = false;
window.addEventListener("scroll", () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      handleScroll();
      ticking = false;
    });
    ticking = true;
  }
});

// Initial call to set up
handleScroll();