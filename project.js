/* ==========================================================================
   project.js — case study screenshot carousel
   Buttons, dots, arrow keys and swipe are all supported; without JavaScript
   the first screenshot stays visible.
   ========================================================================== */
(function () {
  "use strict";

  const gallery = document.querySelector("[data-gallery]");
  if (!gallery) return;

  const slides = Array.from(gallery.querySelectorAll(".slide"));
  const dots = Array.from(gallery.querySelectorAll(".dot"));
  const prevButton = gallery.querySelector("[data-slide-prev]");
  const nextButton = gallery.querySelector("[data-slide-next]");
  const counter = gallery.querySelector(".slideshow__counter");
  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  let index = 0;

  if (!slides.length) return;

  function preload(i) {
    const slide = slides[(i + slides.length) % slides.length];
    if (!slide || slide.dataset.preloaded) return;
    slide.dataset.preloaded = "true";
    const image = new Image();
    image.src = slide.currentSrc || slide.src;
  }

  function show(next) {
    index = (next + slides.length) % slides.length;

    slides.forEach((slide, i) => {
      slide.classList.toggle("is-active", i === index);
    });

    dots.forEach((dot, i) => {
      const active = i === index;
      dot.classList.toggle("is-active", active);
      dot.setAttribute("aria-current", active ? "true" : "false");
    });

    if (counter) {
      counter.textContent = index + 1 + " / " + slides.length;
    }

    if (motionQuery.matches) return;
    preload(index + 1);
    preload(index - 1);
  }

  prevButton?.addEventListener("click", () => show(index - 1));
  nextButton?.addEventListener("click", () => show(index + 1));
  dots.forEach((dot, i) => dot.addEventListener("click", () => show(i)));

  gallery.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      show(index + 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      show(index - 1);
    }
  });

  let pointerStart = null;
  gallery.addEventListener(
    "pointerdown",
    (event) => {
      if (event.pointerType === "mouse") return;
      pointerStart = event.clientX;
    },
    { passive: true }
  );

  gallery.addEventListener(
    "pointerup",
    (event) => {
      if (pointerStart === null) return;
      const delta = event.clientX - pointerStart;
      pointerStart = null;
      if (Math.abs(delta) < 45) return;
      show(delta < 0 ? index + 1 : index - 1);
    },
    { passive: true }
  );

  show(0);
})();
