export {};

// Cards and Copper are the selected designs, including on old comparison URLs.
document.documentElement.dataset.projectLayout = "cards";
const url = new URL(location.href);
if (url.searchParams.has("projects")) {
  url.searchParams.set("projects", "cards");
  history.replaceState(null, "", url);
}

const cards = [
  ...document.querySelectorAll<HTMLElement>("[data-project-card]"),
];
const revealItems = [
  ...cards,
  ...document.querySelectorAll<HTMLElement>("[data-accolade]"),
];
const reduced = matchMedia("(prefers-reduced-motion: reduce)");
const finePointer = matchMedia("(hover: hover) and (pointer: fine)");
cards.forEach((card) => {
  const link = card.querySelector<HTMLAnchorElement>(".archive-project")!;
  link.addEventListener(
    "pointermove",
    (event) => {
      if (
        !finePointer.matches ||
        reduced.matches ||
        document.documentElement.classList.contains("visuals-paused")
      )
        return;
      const rect = link.getBoundingClientRect();
      link.style.setProperty("--light-x", `${event.clientX - rect.left}px`);
      link.style.setProperty("--light-y", `${event.clientY - rect.top}px`);
    },
    { passive: true },
  );
});
let observer: IntersectionObserver | null = null;
const showAll = () => {
  observer?.disconnect();
  revealItems.forEach((card) =>
    card.classList.remove("card-pending", "card-arriving"),
  );
};
// Content is visible without JS. Only offscreen cards await an entrance.
if (!reduced.matches && "IntersectionObserver" in window) {
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const card = entry.target as HTMLElement;
        card.classList.remove("card-pending");
        card.classList.add("card-arriving");
        observer?.unobserve(card);
      }
    },
    { threshold: 0.05 },
  );
  revealItems.forEach((card, index) => {
    const columns = getComputedStyle(
      card.parentElement!,
    ).gridTemplateColumns.split(" ").length;
    card.style.setProperty("--card-delay", `${(index % columns) * 65}ms`);
    if (card.getBoundingClientRect().top >= innerHeight)
      card.classList.add("card-pending");
    else card.classList.add("card-arriving");
    observer!.observe(card);
    card.addEventListener("focusin", () => {
      card.classList.remove("card-pending", "card-arriving");
      observer?.unobserve(card);
    });
    card.addEventListener("animationend", () =>
      card.classList.remove("card-arriving"),
    );
  });
}
reduced.addEventListener("change", showAll);
window.addEventListener("pagehide", showAll);
