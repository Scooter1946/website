const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
const fine = window.matchMedia?.('(hover: hover) and (pointer: fine)').matches ?? false;

// 1. Entrance stagger (hero) — elements carry data-rise="0|1|2..."
const rises = Array.from(document.querySelectorAll<HTMLElement>('[data-rise]'));
if (reduce) {
  rises.forEach((el) => el.classList.add('is-in'));
} else {
  rises
    .sort((a, b) => Number(a.dataset.rise) - Number(b.dataset.rise))
    .forEach((el, i) => setTimeout(() => el.classList.add('is-in'), 90 * i));
}

// 2. Signature moment: kinetic headline. Element: data-kinetic, data-words='["a","b"]'
const k = document.querySelector<HTMLElement>('[data-kinetic]');
if (k && !reduce) {
  const words = JSON.parse(k.dataset.words || '[]') as string[];
  let i = 0;
  const cycle = () => {
    i = (i + 1) % words.length;
    k.style.transition = 'opacity .26s ease, transform .26s ease';
    k.style.opacity = '0';
    k.style.transform = 'translateY(0.35em)';
    setTimeout(() => {
      k.textContent = words[i];
      k.style.opacity = '1';
      k.style.transform = 'translateY(0)';
    }, 260);
    setTimeout(cycle, 2800);
  };
  setTimeout(cycle, 2800);
}

// 3. Scroll reveal for below-the-fold sections (data-reveal)
const reveals = document.querySelectorAll<HTMLElement>('[data-reveal]');
if (reveals.length && !reduce && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
  );
  reveals.forEach((el) => io.observe(el));
} else {
  reveals.forEach((el) => el.classList.add('is-in'));
}

// 4. Availability dot pulse (data-pulse) — ambient loop
const dot = document.querySelector<HTMLElement>('[data-pulse]');
if (dot && !reduce) {
  setInterval(() => {
    dot.style.transition = 'opacity .9s ease';
    dot.style.opacity = dot.style.opacity === '0.35' ? '1' : '0.35';
  }, 1100);
}

// 5. Pointer spotlight (--mx/--my) + subtle tilt (--rx/--ry) on interactive
// surfaces. Pointer-driven; skipped for reduced-motion and coarse pointers.
if (fine && !reduce) {
  const MAX_TILT = 5; // default degrees; override per element via data-tilt="<deg>"
  const surfaces = document.querySelectorAll<HTMLElement>('[data-spotlight], [data-tilt]');
  surfaces.forEach((el) => {
    const tilt = el.hasAttribute('data-tilt');
    const maxTilt = Number(el.dataset.tilt) || MAX_TILT;
    let frame = 0;
    let cx = 0;
    let cy = 0;
    const update = () => {
      frame = 0;
      const r = el.getBoundingClientRect();
      const px = (cx - r.left) / r.width;
      const py = (cy - r.top) / r.height;
      el.style.setProperty('--mx', `${(px * 100).toFixed(1)}%`);
      el.style.setProperty('--my', `${(py * 100).toFixed(1)}%`);
      if (tilt) {
        el.style.setProperty('--ry', `${((px - 0.5) * 2 * maxTilt).toFixed(2)}deg`);
        el.style.setProperty('--rx', `${((0.5 - py) * 2 * maxTilt).toFixed(2)}deg`);
      }
    };
    el.addEventListener('pointermove', (e) => {
      cx = e.clientX;
      cy = e.clientY;
      if (!frame) frame = requestAnimationFrame(update);
    });
    if (tilt) {
      el.addEventListener('pointerleave', () => {
        if (frame) {
          cancelAnimationFrame(frame);
          frame = 0;
        }
        el.style.setProperty('--rx', '0deg');
        el.style.setProperty('--ry', '0deg');
      });
    }
  });
}

// 6. Macropad — each key is a real button: click / Enter / Space presses it
// and plays a short synthesized clack. Roving tabindex + arrow keys keep it to
// one tab stop. Fully keyboard-operable; renders statically with no JS.
const keys = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-key]'));
if (keys.length) {
  const COLS = 5;
  keys.forEach((key, i) => {
    key.tabIndex = i === 0 ? 0 : -1;
  });

  const AudioCtor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  let audio: AudioContext | null = null;

  const clack = () => {
    if (!AudioCtor) return;
    try {
      audio = audio ?? new AudioCtor();
      if (audio.state === 'suspended') void audio.resume();
      const t = audio.currentTime;

      const dur = 0.05;
      const buffer = audio.createBuffer(1, Math.floor(audio.sampleRate * dur), audio.sampleRate);
      const ch = buffer.getChannelData(0);
      for (let i = 0; i < ch.length; i++) ch[i] = Math.random() * 2 - 1;
      const noise = audio.createBufferSource();
      noise.buffer = buffer;
      const band = audio.createBiquadFilter();
      band.type = 'bandpass';
      band.frequency.value = 2400;
      band.Q.value = 0.7;
      const noiseGain = audio.createGain();
      noiseGain.gain.setValueAtTime(0.0001, t);
      noiseGain.gain.exponentialRampToValueAtTime(0.3, t + 0.004);
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      noise.connect(band).connect(noiseGain).connect(audio.destination);
      noise.start(t);
      noise.stop(t + dur);

      const osc = audio.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(190, t);
      osc.frequency.exponentialRampToValueAtTime(90, t + 0.05);
      const oscGain = audio.createGain();
      oscGain.gain.setValueAtTime(0.0001, t);
      oscGain.gain.exponentialRampToValueAtTime(0.22, t + 0.005);
      oscGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);
      osc.connect(oscGain).connect(audio.destination);
      osc.start(t);
      osc.stop(t + 0.07);
    } catch {
      /* audio unavailable — keys still work silently */
    }
  };

  const press = (key: HTMLButtonElement) => {
    clack();
    if (reduce) return;
    key.classList.add('is-down');
    setTimeout(() => key.classList.remove('is-down'), 90);
  };

  // --- Name-spelling game -------------------------------------------------
  // The keys forming the current letter of the name light up (amber). Clicking
  // a lit key damps it; once every lit key for the letter has been clicked, the
  // next letter appears. 5x5 uppercase bitmaps, row-major to match key order.
  const NAME = 'JUSTINCHEN';
  const FONT: Record<string, string[]> = {
    J: ['01110', '00010', '00010', '10010', '01100'],
    U: ['10001', '10001', '10001', '10001', '01110'],
    S: ['01111', '10000', '01110', '00001', '11110'],
    T: ['11111', '00100', '00100', '00100', '00100'],
    I: ['11111', '00100', '00100', '00100', '11111'],
    N: ['10001', '11001', '10101', '10011', '10001'],
    C: ['01110', '10001', '10000', '10001', '01110'],
    H: ['10001', '10001', '11111', '10001', '10001'],
    E: ['11111', '10000', '11110', '10000', '11111'],
  };
  let letterIdx = 0;
  const lit = new Set<number>();
  const hit = new Set<number>();
  let advancing = false;

  const showLetter = (idx: number) => {
    const bits = (FONT[NAME[idx]] ?? []).join('');
    lit.clear();
    hit.clear();
    advancing = false;
    keys.forEach((key, i) => {
      key.classList.remove('key--lit', 'key--damped');
      if (bits[i] === '1') {
        key.classList.add('key--lit');
        lit.add(i);
      }
    });
  };

  const registerHit = (i: number) => {
    if (advancing || !lit.has(i) || hit.has(i)) return;
    hit.add(i);
    keys[i].classList.remove('key--lit');
    keys[i].classList.add('key--damped');
    if (hit.size === lit.size) {
      advancing = true; // ignore clicks during the hand-off to the next letter
      letterIdx = (letterIdx + 1) % NAME.length;
      setTimeout(() => showLetter(letterIdx), 420);
    }
  };

  keys.forEach((key, i) => {
    key.addEventListener('click', () => {
      press(key);
      registerHit(i);
    });
    key.addEventListener('keydown', (e) => {
      const step: Record<string, number | undefined> = {
        ArrowRight: 1,
        ArrowLeft: -1,
        ArrowUp: -COLS,
        ArrowDown: COLS,
      };
      const delta = step[e.key];
      if (delta === undefined) return;
      const target = keys[i + delta];
      if (!target) return;
      e.preventDefault();
      key.tabIndex = -1;
      target.tabIndex = 0;
      target.focus();
    });
  });

  // Light up the first letter to kick off the name.
  showLetter(0);
}

// 6b. Macropad lock toggle — pins the pad flat/forward so keys are easy to
// click. The locked CSS transform ignores the pointer tilt, and the stage's
// transition makes it glide there smoothly from any current position.
const pad = document.querySelector<HTMLElement>('.pad');
const lockBtn = document.querySelector<HTMLButtonElement>('[data-pad-lock]');
if (pad && lockBtn) {
  const label = lockBtn.querySelector<HTMLElement>('.pad-lock__label');
  lockBtn.addEventListener('click', () => {
    const locked = pad.classList.toggle('pad--locked');
    lockBtn.classList.toggle('is-locked', locked);
    lockBtn.setAttribute('aria-pressed', String(locked));
    if (label) label.textContent = locked ? 'Unlock' : 'Lock to click';
  });
}

// 7. Marquee / ticker — set the loop duration from content width so the scroll
// speed stays constant no matter how many items are added. Each track holds two
// identical copies, so one set is half its scroll width. Supports any number of
// [data-marquee] containers (project marquee + keyword ticker).
if (!reduce) {
  const SPEED = 55; // px per second
  document.querySelectorAll<HTMLElement>('[data-marquee]').forEach((box) => {
    const track = box.querySelector<HTMLElement>('.marquee__track, .ticker__track');
    if (!track) return;
    const oneSet = track.scrollWidth / 2;
    if (oneSet > 0) track.style.setProperty('--marquee-duration', `${(oneSet / SPEED).toFixed(1)}s`);
  });
}

// 8. Scroll progress bar (data-progress) + parallax (data-parallax="<speed>").
// One rAF-throttled scroll loop drives both.
const progress = document.querySelector<HTMLElement>('[data-progress]');
const parallax = Array.from(document.querySelectorAll<HTMLElement>('[data-parallax]'));
if ((progress || parallax.length) && !reduce) {
  let frame = 0;
  const onScroll = () => {
    frame = 0;
    const y = window.scrollY;
    if (progress) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.setProperty('--progress', max > 0 ? (y / max).toFixed(4) : '0');
    }
    for (const el of parallax) {
      const speed = Number(el.dataset.parallax) || 0.1;
      el.style.transform = `translate3d(0, ${(y * speed).toFixed(1)}px, 0)`;
    }
  };
  const request = () => {
    if (!frame) frame = requestAnimationFrame(onScroll);
  };
  window.addEventListener('scroll', request, { passive: true });
  onScroll();
}

// 9. Active-section highlight in the nav. A thin band near the top of the
// viewport decides which section is "current".
const navLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>('[data-navlink]'));
if (navLinks.length && 'IntersectionObserver' in window) {
  const byId = new Map<string, HTMLAnchorElement>();
  navLinks.forEach((a) => {
    const id = a.getAttribute('href')?.replace('#', '');
    if (id) byId.set(id, a);
  });
  const sections = Array.from(byId.keys())
    .map((id) => document.getElementById(id))
    .filter((el): el is HTMLElement => Boolean(el));

  const setActive = (id: string) => {
    navLinks.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === `#${id}`));
  };
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) setActive(e.target.id);
      });
    },
    { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
  );
  sections.forEach((s) => io.observe(s));
}

// 10. Magnetic buttons (data-magnet) — the control eases toward the pointer.
if (fine && !reduce) {
  const magnets = document.querySelectorAll<HTMLElement>('[data-magnet]');
  magnets.forEach((el) => {
    const STRENGTH = 0.3;
    const MAX = 7; // px
    let frame = 0;
    let cx = 0;
    let cy = 0;
    const update = () => {
      frame = 0;
      const r = el.getBoundingClientRect();
      const dx = cx - (r.left + r.width / 2);
      const dy = cy - (r.top + r.height / 2);
      const mx = Math.max(-MAX, Math.min(MAX, dx * STRENGTH));
      const my = Math.max(-MAX, Math.min(MAX, dy * STRENGTH));
      el.style.setProperty('--mag-x', `${mx.toFixed(1)}px`);
      el.style.setProperty('--mag-y', `${my.toFixed(1)}px`);
    };
    el.addEventListener('pointermove', (e) => {
      cx = e.clientX;
      cy = e.clientY;
      if (!frame) frame = requestAnimationFrame(update);
    });
    el.addEventListener('pointerleave', () => {
      if (frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
      el.style.setProperty('--mag-x', '0px');
      el.style.setProperty('--mag-y', '0px');
    });
  });
}
