const active = new WeakMap<HTMLElement, () => void>();

/** Mount the local, illustrative Sift reconciliation toggle. */
export function initSiftDemo(): {
  setProgress(value: number): void;
  setPaused(value: boolean): void;
  dispose(): void;
} {
  const root = document.querySelector<HTMLElement>("[data-sift]");
  if (!root) {
    return { setProgress() {}, setPaused() {}, dispose() {} };
  }
  active.get(root)?.();

  const matchButton =
    root.querySelector<HTMLButtonElement>("[data-sift-match]");
  const reviewButton =
    root.querySelector<HTMLButtonElement>("[data-sift-review]");
  const amount = root.querySelector<HTMLElement>("[data-sift-amount]");
  const result = root.querySelector<HTMLElement>("[data-sift-result]");
  const difference = root.querySelector<HTMLElement>("[data-sift-flag]");
  const announcement = root.querySelector<HTMLElement>(
    "[data-sift-announcement]",
  );
  if (
    !matchButton ||
    !reviewButton ||
    !amount ||
    !result ||
    !difference ||
    !announcement
  ) {
    return { setProgress() {}, setPaused() {}, dispose() {} };
  }

  let disposed = false;
  let paused = false;
  let manual = false;
  const controls = root.querySelector<HTMLElement>(".sift-demo__controls");
  if (controls) controls.hidden = false;
  const show = (state: "matched" | "review", announce = false) => {
    if (disposed) return;
    if (root.dataset.state === state && !announce) return;
    root.dataset.state = state;
    matchButton.setAttribute("aria-pressed", String(state === "matched"));
    reviewButton.setAttribute("aria-pressed", String(state === "review"));
    amount.textContent = state === "matched" ? "$42.00" : "$48.00";
    result.textContent = state === "matched" ? "Matched" : "Needs review";
    difference.textContent =
      state === "matched" ? "Amounts match" : "Difference  $6.00";
    announcement.setAttribute("aria-live", announce ? "polite" : "off");
    announcement.textContent =
      state === "matched"
        ? "Claim is $42.00 and receipt is $42.00. Matched."
        : "Claim is $48.00 and receipt is $42.00. Needs review.";
  };
  const onMatch = () => {
    manual = true;
    root.dataset.scanning = "false";
    show("matched", true);
  };
  const onReview = () => {
    manual = true;
    root.dataset.scanning = "false";
    show("review", true);
  };

  matchButton.addEventListener("click", onMatch);
  reviewButton.addEventListener("click", onReview);
  root.dataset.paused = "false";
  active.set(root, () => {
    disposed = true;
    if (controls) controls.hidden = true;
    matchButton.removeEventListener("click", onMatch);
    reviewButton.removeEventListener("click", onReview);
    active.delete(root);
  });

  return {
    setProgress(value) {
      if (disposed || paused) return;
      root.style.setProperty("--sift-progress", String(value));
      if (!manual) {
        const complete = value > 0.62;
        root.dataset.scanning = String(!complete);
        const label = complete ? "Needs review" : "Checking receipt";
        if (result.textContent !== label) {
          result.textContent = label;
          announcement.setAttribute("aria-live", "off");
          announcement.textContent = complete
            ? "A $6.00 difference needs human review."
            : "Comparing the receipt with the claim.";
        }
      }
    },
    setPaused(value) {
      paused = value;
      if (!disposed) root.dataset.paused = String(value);
    },
    dispose() {
      if (disposed) return;
      active.get(root)?.();
    },
  };
}
