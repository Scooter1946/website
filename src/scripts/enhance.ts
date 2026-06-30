const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

// 1. Entrance stagger (hero) — elements carry data-rise="0|1|2..."
const rises = Array.from(document.querySelectorAll<HTMLElement>('[data-rise]'));
if (reduce) {
  rises.forEach((el) => el.classList.add('is-in'));
} else {
  rises
    .sort((a, b) => Number(a.dataset.rise) - Number(b.dataset.rise))
    .forEach((el, i) => setTimeout(() => el.classList.add('is-in'), 80 * i));
}

// 2. Signature moment: kinetic headline. Element: data-kinetic, data-words='["a","b"]'
const k = document.querySelector<HTMLElement>('[data-kinetic]');
if (k && !reduce) {
  const words = JSON.parse(k.dataset.words || '[]') as string[];
  let i = 0;
  const cycle = () => {
    i = (i + 1) % words.length;
    k.style.transition = 'opacity .26s ease';
    k.style.opacity = '0';
    setTimeout(() => { k.textContent = words[i]; k.style.opacity = '1'; }, 260);
    setTimeout(cycle, 2600);
  };
  setTimeout(cycle, 2600);
}

// 3. Scroll reveal for below-the-fold sections (data-reveal)
const reveals = document.querySelectorAll<HTMLElement>('[data-reveal]');
if (reveals.length && !reduce && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.15 });
  reveals.forEach((el) => io.observe(el));
} else {
  reveals.forEach((el) => el.classList.add('is-in'));
}

// 4. Availability dot pulse (data-pulse) — the only other permitted ambient loop
const dot = document.querySelector<HTMLElement>('[data-pulse]');
if (dot && !reduce) {
  setInterval(() => {
    dot.style.transition = 'opacity .9s ease';
    dot.style.opacity = dot.style.opacity === '0.35' ? '1' : '0.35';
  }, 1100);
}
