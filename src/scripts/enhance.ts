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

// 5. Pointer spotlight (--mx/--my) + subtle tilt (--rx/--ry) on interactive
// surfaces. Pointer-driven, never self-running: no new loop is introduced.
// Skipped for reduced-motion and for coarse/no-hover pointers, so touch and
// keyboard users get the static base state the CSS already ships.
const fine = window.matchMedia?.('(hover: hover) and (pointer: fine)').matches ?? false;
if (fine && !reduce) {
  const MAX_TILT = 5; // default degrees; override per element via data-tilt="<deg>"
  const surfaces = document.querySelectorAll<HTMLElement>('[data-spotlight], [data-tilt]');
  surfaces.forEach((el) => {
    const tilt = el.hasAttribute('data-tilt');
    const maxTilt = Number(el.dataset.tilt) || MAX_TILT;
    // Coalesce pointer moves to one update per frame — avoids stutter from
    // many events (and repeated style writes) landing within a single frame.
    let frame = 0;
    let cx = 0;
    let cy = 0;
    const update = () => {
      frame = 0;
      const r = el.getBoundingClientRect();
      const px = (cx - r.left) / r.width; // 0..1
      const py = (cy - r.top) / r.height; // 0..1
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
        if (frame) { cancelAnimationFrame(frame); frame = 0; }
        el.style.setProperty('--rx', '0deg');
        el.style.setProperty('--ry', '0deg');
      });
    }
  });
}

// 6. Macropad — the hero keypad is a nod to a physical build. Each key is a
// real button: click / Enter / Space presses it and plays a short synthesized
// clack. Roving tabindex + arrow keys keep it to one clean tab stop. All
// user-initiated (no self-running loop); the keypad is fully keyboard-operable
// and renders statically with no JS.
const keys = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-key]'));
if (keys.length) {
  const COLS = 6;
  keys.forEach((key, i) => { key.tabIndex = i === 0 ? 0 : -1; });

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

      // Bright click transient: a short band-passed noise burst.
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

      // Low "thock" body under the click.
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
    if (reduce) return; // reduced motion: sound only, no depress animation
    key.classList.add('is-down');
    setTimeout(() => key.classList.remove('is-down'), 90);
  };

  keys.forEach((key, i) => {
    // click fires for mouse, touch, and Enter/Space on a button.
    key.addEventListener('click', () => press(key));
    key.addEventListener('keydown', (e) => {
      const step: Record<string, number | undefined> = {
        ArrowRight: 1, ArrowLeft: -1, ArrowUp: -COLS, ArrowDown: COLS,
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
}

// 7. Selected-work marquee — set the loop duration from content width so the
// scroll speed stays constant no matter how many projects are added. The track
// holds two identical copies, so one set is half its scroll width.
const track = document.querySelector<HTMLElement>('[data-marquee] .marquee__track');
if (track && !reduce) {
  const oneSet = track.scrollWidth / 2;
  if (oneSet > 0) {
    const SPEED = 55; // px per second
    track.style.setProperty('--marquee-duration', `${(oneSet / SPEED).toFixed(1)}s`);
  }
}
