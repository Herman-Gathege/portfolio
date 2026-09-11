/* ==========================================================================
   script.js — homepage interactions
   Navigation, active-section tracking, reveals, spatial motion and slider.
   Progressive enhancement: every effect degrades to a static, readable page.
   ========================================================================== */
(function () {
  "use strict";

  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  const reduceMotion = () => motionQuery.matches;

  const rand = (min, max) => min + Math.random() * (max - min);

  /* ------------------------------------------------------------------ *
   * Galaxy layer: faint stars, cosmic particles, rare shooting star
   * ------------------------------------------------------------------ */
  function initGalaxy() {
    const atmosphere = document.querySelector(".atmosphere");
    if (!atmosphere || atmosphere.dataset.galaxy === "ready") return;
    atmosphere.dataset.galaxy = "ready";

    const nebula = document.createElement("span");
    nebula.className = "atmosphere__nebula";
    atmosphere.insertBefore(nebula, atmosphere.firstChild);

    const layers = [
      { name: "far", share: 0.56, size: [1, 1.4], opacity: [0.12, 0.32], twinkle: [10, 19] },
      { name: "mid", share: 0.3, size: [1.2, 1.8], opacity: [0.18, 0.44], twinkle: [8, 15] },
      { name: "near", share: 0.14, size: [1.6, 2.4], opacity: [0.28, 0.6], twinkle: [6, 12] },
    ];

    const total = Math.max(44, Math.min(150, Math.round((window.innerWidth * window.innerHeight) / 11000)));
    const fragment = document.createDocumentFragment();

    layers.forEach((layer) => {
      const container = document.createElement("span");
      container.className = "atmosphere__stars atmosphere__stars--" + layer.name;

      const count = Math.round(total * layer.share);
      for (let i = 0; i < count; i += 1) {
        const star = document.createElement("span");
        const size = rand(layer.size[0], layer.size[1]);
        star.className = "star";
        star.style.left = rand(0, 100).toFixed(2) + "%";
        star.style.top = rand(0, 100).toFixed(2) + "%";
        star.style.width = size.toFixed(2) + "px";
        star.style.height = size.toFixed(2) + "px";
        star.style.setProperty("--star-o", rand(layer.opacity[0], layer.opacity[1]).toFixed(3));
        star.style.setProperty("--star-t", rand(layer.twinkle[0], layer.twinkle[1]).toFixed(1) + "s");
        star.style.setProperty("--star-d", (-rand(0, 14)).toFixed(1) + "s");
        container.appendChild(star);
      }

      fragment.appendChild(container);
    });

    // A few soft cosmic particles add colour without becoming a focal point.
    const particleLayer = document.createElement("span");
    particleLayer.className = "atmosphere__stars atmosphere__stars--mid";
    const particleCount = window.innerWidth < 720 ? 4 : 8;
    for (let i = 0; i < particleCount; i += 1) {
      const particle = document.createElement("span");
      const size = rand(3, 6);
      particle.className = "star star--particle";
      particle.style.left = rand(4, 96).toFixed(2) + "%";
      particle.style.top = rand(8, 92).toFixed(2) + "%";
      particle.style.width = size.toFixed(1) + "px";
      particle.style.height = size.toFixed(1) + "px";
      particle.style.setProperty("--star-o", rand(0.1, 0.24).toFixed(3));
      particle.style.setProperty("--star-t", rand(36, 72).toFixed(0) + "s");
      particle.style.setProperty("--star-d", (-rand(0, 24)).toFixed(0) + "s");
      particle.style.setProperty("--star-dx", rand(18, 46).toFixed(0) + "px");
      particle.style.setProperty("--star-dy", rand(-46, -16).toFixed(0) + "px");
      particleLayer.appendChild(particle);
    }

    fragment.appendChild(particleLayer);
    atmosphere.appendChild(fragment);

    if (reduceMotion()) return;

    const spawn = () => {
      if (document.visibilityState === "visible") {
        const star = document.createElement("span");
        star.className = "shooting-star";
        star.style.left = rand(4, 38).toFixed(1) + "%";
        star.style.top = rand(6, 34).toFixed(1) + "%";
        atmosphere.appendChild(star);
        window.setTimeout(() => star.remove(), 2200);
      }
      window.setTimeout(spawn, rand(24000, 48000));
    };

    window.setTimeout(spawn, rand(10000, 20000));
  }

  /* ------------------------------------------------------------------ *
   * Navigation: scroll state + mobile sheet
   * ------------------------------------------------------------------ */
  function initNavigation() {
    const topbar = document.querySelector(".topbar");
    const toggle = document.querySelector(".nav-toggle");
    const menu = document.querySelector("#primary-menu");
    const links = Array.from(document.querySelectorAll(".topbar__menu .nav-link"));

    if (!topbar || !toggle || !menu) return;

    let lastY = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      topbar.classList.toggle("is-scrolled", y > 24);

      // Keep the bar out of the way while scrolling deeper into the page.
      if (window.innerWidth < 900) {
        const goingDown = y > lastY && y > 240;
        topbar.style.transform = goingDown ? "translate3d(0, -8px, 0)" : "";
        topbar.style.opacity = goingDown ? "0.92" : "";
      } else {
        topbar.style.transform = "";
        topbar.style.opacity = "";
      }

      lastY = y;
    };

    const setMenu = (open) => {
      document.body.classList.toggle("menu-open", open);
      document.body.classList.toggle("is-locked", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
    };

    toggle.addEventListener("click", () => {
      const isOpen = document.body.classList.contains("menu-open");
      setMenu(!isOpen);
      if (!isOpen) {
        const first = menu.querySelector(".nav-link");
        if (first) first.focus({ preventScroll: true });
      } else {
        toggle.focus({ preventScroll: true });
      }
    });

    links.forEach((link) => link.addEventListener("click", () => setMenu(false)));

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && document.body.classList.contains("menu-open")) {
        setMenu(false);
        toggle.focus({ preventScroll: true });
      }
    });

    document.addEventListener("click", (event) => {
      if (!document.body.classList.contains("menu-open")) return;
      if (event.target.closest(".topbar")) return;
      setMenu(false);
    });

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener(
      "resize",
      () => {
        if (window.innerWidth >= 900) setMenu(false);
        onScroll();
      },
      { passive: true }
    );

    onScroll();
  }

  /* ------------------------------------------------------------------ *
   * Reveal on scroll
   * ------------------------------------------------------------------ */
  function initReveal() {
    const targets = Array.from(document.querySelectorAll("[data-reveal]"));
    if (!targets.length) return;

    if (reduceMotion() || !("IntersectionObserver" in window)) {
      targets.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.08 }
    );

    targets.forEach((el) => observer.observe(el));
  }

  /* ------------------------------------------------------------------ *
   * Pointer light + depth tilt
   * ------------------------------------------------------------------ */
  function initPointerDepth() {
    if (!finePointer.matches) return;

    let pendingTarget = null;
    let pendingEvent = null;
    let queued = false;

    const flush = () => {
      queued = false;
      if (pendingEvent) {
        const root = document.documentElement;
        root.style.setProperty("--px", (pendingEvent.clientX / window.innerWidth).toFixed(3));
        root.style.setProperty("--py", (pendingEvent.clientY / window.innerHeight).toFixed(3));
      }

      if (pendingTarget) {
        const rect = pendingTarget.getBoundingClientRect();
        const x = ((pendingEvent.clientX - rect.left) / rect.width) * 100;
        const y = ((pendingEvent.clientY - rect.top) / rect.height) * 100;
        pendingTarget.style.setProperty("--mx", x.toFixed(2) + "%");
        pendingTarget.style.setProperty("--my", y.toFixed(2) + "%");

        if (pendingTarget.hasAttribute("data-tilt") && !reduceMotion()) {
          const nx = (x - 50) / 50;
          const ny = (y - 50) / 50;
          pendingTarget.style.setProperty("--tilt-y", (nx * 3.2).toFixed(2) + "deg");
          pendingTarget.style.setProperty("--tilt-x", (-ny * 2.6).toFixed(2) + "deg");
        }
      }

      pendingTarget = null;
      pendingEvent = null;
    };

    document.addEventListener(
      "pointermove",
      (event) => {
        pendingEvent = event;
        pendingTarget = event.target.closest(".glass, .media");
        if (queued) return;
        queued = true;
        window.requestAnimationFrame(flush);
      },
      { passive: true }
    );

    document.addEventListener(
      "pointerout",
      (event) => {
        const el = event.target.closest("[data-tilt]");
        if (!el || el.contains(event.relatedTarget)) return;
        el.style.removeProperty("--tilt-x");
        el.style.removeProperty("--tilt-y");
      },
      { passive: true }
    );
  }

  /* ------------------------------------------------------------------ *
   * Scroll-linked parallax + hero depth
   * ------------------------------------------------------------------ */
  function initParallax() {
    const layers = Array.from(document.querySelectorAll("[data-parallax]"));
    const heroInner = document.querySelector(".hero__inner");
    const hero = document.querySelector(".hero");
    const atmosphere = document.querySelector(".atmosphere");
    if (!layers.length && !heroInner && !atmosphere) return;
    if (reduceMotion()) return;

    let ticking = false;

    const update = () => {
      ticking = false;
      const vh = window.innerHeight;
      const narrow = window.innerWidth < 720;

      layers.forEach((layer) => {
        const rect = layer.getBoundingClientRect();
        if (rect.bottom < -160 || rect.top > vh + 160) {
          layer.style.setProperty("--parallax-y", "0px");
          return;
        }
        const speed = parseFloat(layer.dataset.parallax || "0.05");
        const offset = rect.top + rect.height / 2 - vh / 2;
        const shift = -offset * speed * (narrow ? 0.55 : 1);
        const clamped = Math.max(-140, Math.min(140, shift));
        layer.style.setProperty("--parallax-y", clamped.toFixed(2) + "px");
      });

      if (heroInner && hero) {
        const y = window.scrollY;
        const height = hero.offsetHeight || 1;
        const progress = Math.min(y / height, 1);
        heroInner.style.setProperty("--hero-shift", (progress * 46).toFixed(1) + "px");
        heroInner.style.setProperty("--hero-fade", Math.min(progress * 0.85, 0.5).toFixed(3));
      }

      // Galaxy layers drift slower than the page for a sense of distance.
      if (atmosphere) {
        const y = window.scrollY;
        const clamp = (value, limit) => Math.max(-limit, Math.min(limit, value));
        atmosphere.style.setProperty("--stars-y", clamp(y * -0.012, 60).toFixed(2) + "px");
        atmosphere.style.setProperty("--stars-y-mid", clamp(y * -0.022, 90).toFixed(2) + "px");
        atmosphere.style.setProperty("--stars-y-near", clamp(y * -0.036, 130).toFixed(2) + "px");
      }
    };

    const request = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    };

    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request, { passive: true });
    update();
  }

  /* ------------------------------------------------------------------ *
   * Testimonials slider
   * ------------------------------------------------------------------ */
  function initSlider() {
    const slider = document.querySelector(".voices__slider");
    if (!slider || typeof window.Swiper === "undefined") return;

    const sliderRoot = slider.querySelector(".swiper-wrapper");
    const slides = sliderRoot ? sliderRoot.children.length : 0;

    new window.Swiper(slider, {
      loop: slides > 4,
      rewind: true,
      grabCursor: true,
      spaceBetween: 24,
      speed: 620,
      slidesPerView: 1,
      keyboard: { enabled: true, onlyInViewport: true },
      a11y: {
        prevSlideMessage: "Previous testimonial",
        nextSlideMessage: "Next testimonial",
        paginationBulletMessage: "Go to testimonial {{index}}",
      },
      pagination: {
        el: slider.querySelector(".swiper-pagination"),
        clickable: true,
      },
      navigation: {
        nextEl: slider.querySelector(".swiper-button-next"),
        prevEl: slider.querySelector(".swiper-button-prev"),
      },
      breakpoints: {
        720: { slidesPerView: 2, spaceBetween: 20 },
        1080: { slidesPerView: 3, spaceBetween: 24 },
      },
    });
  }

  /* ------------------------------------------------------------------ *
   * Boot
   * ------------------------------------------------------------------ */
  function boot() {
    initGalaxy();
    initNavigation();
    initReveal();
    initPointerDepth();
    initParallax();
    initSlider();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
