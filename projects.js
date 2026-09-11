/* ==========================================================================
   projects.js — showcase filtering
   Two filter groups (type + stack). Without JavaScript every project is
   simply listed, so nothing is hidden from recruiters or crawlers.
   ========================================================================== */
(function () {
  "use strict";

  const bar = document.querySelector(".filter-bar");
  const grid = document.getElementById("projects-grid");
  if (!bar || !grid) return;

  const cards = Array.from(grid.querySelectorAll(".case-card"));
  const buttons = Array.from(bar.querySelectorAll(".filter-chip"));
  const status = bar.querySelector(".filter-status");
  const empty = document.querySelector(".work-empty");
  const state = { type: "all", stack: "all" };

  function matches(card, dataKey, stateKey) {
    const value = state[stateKey];
    if (value === "all") return true;
    return (card.dataset[dataKey] || "").split(/\s+/).includes(value);
  }

  function apply() {
    let visible = 0;

    cards.forEach((card) => {
      const show = matches(card, "types", "type") && matches(card, "stack", "stack");
      card.classList.toggle("is-hidden", !show);
      if (show) visible += 1;
    });

    buttons.forEach((button) => {
      const group = button.dataset.filterGroup;
      button.setAttribute("aria-pressed", String(state[group] === button.dataset.filterValue));
    });

    if (status) {
      status.textContent = visible + (visible === 1 ? " project shown" : " projects shown");
    }

    if (empty) empty.hidden = visible !== 0;
  }

  bar.addEventListener("click", (event) => {
    const button = event.target.closest(".filter-chip");
    if (!button) return;
    state[button.dataset.filterGroup] = button.dataset.filterValue;
    apply();
  });

  apply();
})();
