/* =========================================================
   Wedding Invitation — Musthakeem & Safra
   ========================================================= */

(function () {
  'use strict';

  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  /* --------- Preloader --------- */
  const preloader = $('#preloader');
  window.addEventListener('load', () => {
    setTimeout(() => preloader.classList.add('hide'), 2600);
  });

  /* --------- Mobile detection --------- */
  const isMobile = window.matchMedia('(hover: none) and (pointer: coarse)').matches
                || window.matchMedia('(max-width: 768px)').matches;
  const isSmallMobile = window.matchMedia('(max-width: 420px)').matches;

  /* --------- Sparkle particles (persistent gold background) --------- */
  const sparkles = $('#sparkles');
  const SPARKLE_COUNT = isSmallMobile ? 8 : (isMobile ? 12 : 24);
  for (let i = 0; i < SPARKLE_COUNT; i++) {
    const s = document.createElement('span');
    s.className = 'spark';
    s.style.left = Math.random() * 100 + '%';
    s.style.top = 100 + Math.random() * 20 + '%';
    const dur = 6 + Math.random() * 8;
    s.style.animationDuration = dur + 's';
    s.style.animationDelay = -(Math.random() * dur) + 's';
    const sz = 2 + Math.random() * 3;
    s.style.width = sz + 'px';
    s.style.height = sz + 'px';
    sparkles.appendChild(s);
  }


  /* --------- Envelope --------- */
  const envelope = $('#envelope');
  const wrapper = $('#envelopeWrapper');
  const scene = $('#envelopeScene');
  const tapHint = $('#tapHint');
  const openFullBtn = $('#openFullBtn');
  const invitation = $('#invitation');
  const musicToggle = $('#musicToggle');

  function openEnvelope() {
    if (wrapper.classList.contains('open')) return;
    wrapper.classList.add('open');
    if (tapHint) tapHint.classList.add('hide');
  }

  envelope.addEventListener('click', (e) => {
    // Don't intercept the "Open Invitation" button — let its own handler fire
    if (e.target.closest('#openFullBtn')) return;
    openEnvelope();
  });

  openFullBtn.addEventListener('click', () => {
    // Big celebration first
    celebrate();
    starburstPulse();
    flashScreen();

    // Reveal the experience
    scene.classList.add('hide');
    invitation.classList.add('show');
    // Add .enter to trigger all grand-scene animations only now
    requestAnimationFrame(() => invitation.classList.add('enter'));

    // Restore natural document scrolling — clear ALL inline overflow so the
    // CSS (body { overflow-x: hidden }) handles it. Setting overflow-y: auto
    // fights the browser's default scroll on trackpad/touch.
    document.body.style.overflow = '';
    document.body.style.overflowY = '';
    document.documentElement.style.overflow = '';
    setTimeout(() => {
      musicToggle.classList.add('show');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 800);

    // After the entrance keyframes finish, switch figures to idle sway
    setTimeout(() => {
      document.querySelectorAll('.figure').forEach(f => f.classList.add('settled'));
    }, 3000);

    // Second smaller burst when the couple meets
    setTimeout(() => celebrate(true), 2400);
    // Third burst on the names reveal
    setTimeout(() => celebrate(true), 3600);
  });

  function flashScreen() {
    const flash = document.getElementById('flash');
    if (!flash) return;
    flash.classList.remove('burst');
    void flash.offsetWidth;
    flash.classList.add('burst');
  }

  function starburstPulse() {
    const s = document.getElementById('starburst');
    if (!s) return;
    s.classList.remove('burst');
    void s.offsetWidth;
    s.classList.add('burst');
    setTimeout(() => s.classList.remove('burst'), 2000);
  }

  /* --------- Celebration confetti + fireworks --------- */
  function celebrate(smaller) {
    const container = document.getElementById('celebration');
    if (!container) return;

    // Brighter, more visible palette - skip dark browns
    const colors = ['#D4A659', '#E6C88A', '#FFF3D1', '#FBF7EF', '#B08D57', '#B87333', '#D9BE7A'];
    // Lower particle counts on mobile so the phone GPU stays smooth
    const base = smaller ? 80 : 200;
    const fwBase = smaller ? 20 : 50;
    const confettiCount = isSmallMobile ? Math.round(base * 0.35)
                        : isMobile      ? Math.round(base * 0.55)
                        : base;
    const fireworkCount = isSmallMobile ? Math.round(fwBase * 0.4)
                        : isMobile      ? Math.round(fwBase * 0.55)
                        : fwBase;

    // Multi-origin bursts (center + top corners + bottom corners)
    const origins = smaller
      ? [{ x: 50, y: 45 }]
      : [
          { x: 50, y: 45 },
          { x: 20, y: 55 },
          { x: 80, y: 55 },
          { x: 50, y: 20 },
        ];

    // Confetti — bursts from each origin
    origins.forEach((origin, idx) => {
      const perOrigin = Math.floor(confettiCount / origins.length);
      for (let i = 0; i < perOrigin; i++) {
        const p = document.createElement('span');
        p.className = 'confetti';
        p.style.background = colors[Math.floor(Math.random() * colors.length)];
        p.style.left = origin.x + '%';
        p.style.top = origin.y + '%';
        const w = 6 + Math.random() * 10;
        const h = 10 + Math.random() * 14;
        p.style.width = w + 'px';
        p.style.height = h + 'px';
        const angle = Math.random() * Math.PI * 2;
        const dist = 250 + Math.random() * 550;
        p.style.setProperty('--tx', Math.cos(angle) * dist + 'px');
        p.style.setProperty('--ty', Math.sin(angle) * dist * 0.4 + 'px');
        p.style.setProperty('--rot', (Math.random() * 1440 - 720) + 'deg');
        p.style.animationDuration = 2.6 + Math.random() * 2 + 's';
        p.style.animationDelay = (idx * 0.15) + Math.random() * 0.5 + 's';
        container.appendChild(p);
      }
    });

    // Firework sparks scattered across screen
    for (let i = 0; i < fireworkCount; i++) {
      const f = document.createElement('span');
      f.className = 'firework';
      const c = colors[Math.floor(Math.random() * colors.length)];
      f.style.color = c;
      f.style.background = c;
      const originX = 10 + Math.random() * 80;
      const originY = 15 + Math.random() * 60;
      f.style.left = originX + '%';
      f.style.top = originY + '%';
      const angle = Math.random() * Math.PI * 2;
      const dist = 100 + Math.random() * 220;
      f.style.setProperty('--fx', Math.cos(angle) * dist + 'px');
      f.style.setProperty('--fy', Math.sin(angle) * dist + 'px');
      f.style.animationDelay = Math.random() * 1.6 + 's';
      container.appendChild(f);
    }

    // Cleanup
    setTimeout(() => { container.innerHTML = ''; }, 6000);
  }

  document.body.style.overflow = 'hidden';


  /* --------- Countdown (target: 01 Aug 2026, 1:00 PM Sri Lanka UTC+05:30) --------- */
  const target = new Date('2026-08-01T13:00:00+05:30').getTime();
  const cdDays = $('#cdDays'),
        cdHours = $('#cdHours'),
        cdMins = $('#cdMins'),
        cdSecs = $('#cdSecs');
  const pad = (n) => String(Math.max(0, n)).padStart(2, '0');

  function updateCountdown() {
    let diff = target - Date.now();
    if (diff <= 0) {
      cdDays.textContent = cdHours.textContent = cdMins.textContent = cdSecs.textContent = '00';
      return;
    }
    const d = Math.floor(diff / 864e5); diff -= d * 864e5;
    const h = Math.floor(diff / 36e5);  diff -= h * 36e5;
    const m = Math.floor(diff / 6e4);   diff -= m * 6e4;
    const s = Math.floor(diff / 1000);
    cdDays.textContent = pad(d);
    cdHours.textContent = pad(h);
    cdMins.textContent = pad(m);
    cdSecs.textContent = pad(s);
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);


  /* --------- Scroll reveal --------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
  $$('.reveal').forEach((el) => io.observe(el));


  /* --------- Background Music (HTMLAudioElement) --------- */
  const bgMusic = document.getElementById('bgMusic');
  let musicPlaying = false;

  if (bgMusic) {
    bgMusic.volume = 0.7;

    bgMusic.addEventListener('play', () => {
      musicPlaying = true;
      musicToggle.classList.add('playing');
    });
    bgMusic.addEventListener('pause', () => {
      musicPlaying = false;
      musicToggle.classList.remove('playing');
    });
    bgMusic.addEventListener('error', () => {
      musicPlaying = false;
      musicToggle.classList.remove('playing');
    });
  }

  function startMusic() {
    if (!bgMusic) return;
    const p = bgMusic.play();
    if (p && typeof p.catch === 'function') {
      p.catch(() => { /* autoplay blocked; user must tap the toggle */ });
    }
  }

  function stopMusic() {
    if (!bgMusic) return;
    bgMusic.pause();
  }

  musicToggle.addEventListener('click', () => {
    if (musicPlaying) stopMusic(); else startMusic();
  });

  // Try to start the song when the invitation opens (user gesture is required
  // for mobile autoplay — the tap on this button counts).
  openFullBtn.addEventListener('click', () => {
    setTimeout(() => {
      if (!musicPlaying) startMusic();
    }, 900);
  });

  function showToast(text) {
    const t = document.createElement('div');
    t.textContent = text;
    Object.assign(t.style, {
      position: 'fixed', bottom: '80px', right: '20px',
      background: 'rgba(62,39,35,0.95)', color: '#f5efe6',
      padding: '10px 14px', borderRadius: '6px',
      fontSize: '12px', letterSpacing: '0.5px', zIndex: 300,
      boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
      maxWidth: '260px', lineHeight: '1.4',
    });
    document.body.appendChild(t);
    setTimeout(() => { t.style.transition = 'opacity 0.6s'; t.style.opacity = '0'; }, 3000);
    setTimeout(() => t.remove(), 3800);
  }


  /* --------- Subtle parallax on grand glow (desktop only) --------- */
  if (window.matchMedia('(min-width: 900px)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const grandGlow = document.querySelector('.grand-glow');
    const coupleStage = document.querySelector('.couple-stage');
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (y < 800) {
        if (grandGlow) grandGlow.style.transform = `translate(-50%, ${-50 + y * 0.04}%)`;
        if (coupleStage) coupleStage.style.transform = `translateY(${y * 0.15}px) scale(${1 - y * 0.0004})`;
      }
    }, { passive: true });
  }

})();
