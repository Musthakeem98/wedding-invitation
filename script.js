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

  /* --------- Lottie load detection (fall back to emoji if animations don't load) --------- */
  function ensureLottieOrFallback() {
    const players = document.querySelectorAll('lottie-player');
    // If the custom element didn't register at all, immediately fallback
    if (!('customElements' in window) || !customElements.get('lottie-player')) {
      document.body.classList.add('no-lottie');
      return;
    }
    let anyLoaded = false;
    players.forEach(p => {
      p.addEventListener('ready', () => { anyLoaded = true; });
      p.addEventListener('load', () => { anyLoaded = true; });
      p.addEventListener('error', () => {
        p.style.display = 'none';
        p.parentElement.querySelector('.figure-fallback').style.display = 'block';
      });
    });
    // If nothing loaded within 4s, fall back
    setTimeout(() => {
      if (!anyLoaded) document.body.classList.add('no-lottie');
    }, 4000);
  }
  ensureLottieOrFallback();

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
    welcomeFlash();
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

  function welcomeFlash() {
    const w = document.getElementById('welcomeText');
    if (!w) return;
    w.classList.remove('show');
    void w.offsetWidth;
    setTimeout(() => w.classList.add('show'), 400);
    setTimeout(() => w.classList.remove('show'), 2600);
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


  /* --------- Countdown (target: 01 Aug 2026, 12:00 PM Sri Lanka UTC+05:30) --------- */
  const target = new Date('2026-08-01T12:00:00+05:30').getTime();
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


  /* --------- WhatsApp RSVP link --------- */
  const rsvpBtn = $('#rsvpBtn');
  const rsvpMsg = encodeURIComponent(
    "Assalamu Alaikum\n\nI am confirming my attendance to the wedding of Musthakeem & Safra on 01 August 2026 at Ilma Reception Hall, Mawanella.\n\nJazakAllah Khair"
  );
  rsvpBtn.href = `https://wa.me/94774804214?text=${rsvpMsg}`;


  /* --------- Background Music (Web Audio API — ambient chord progression) --------- */
  let audioCtx = null;
  let musicMaster = null;
  let musicInterval = null;
  let musicPlaying = false;

  // Pachelbel's Canon-inspired progression in D — the classic wedding feel
  const chords = [
    [146.83, 220.00, 293.66, 369.99], // D  major (D-A-D-F#)
    [110.00, 220.00, 277.18, 329.63], // A  major (A-A-C#-E)
    [123.47, 246.94, 293.66, 369.99], // Bm      (B-B-D-F#)
    [ 92.50, 184.99, 277.18, 369.99], // F#m     (F#-F#-C#-F#)
    [ 98.00, 196.00, 293.66, 392.00], // G  major (G-G-D-G)
    [146.83, 220.00, 293.66, 369.99], // D  major
    [ 98.00, 196.00, 293.66, 392.00], // G  major
    [110.00, 220.00, 277.18, 329.63], // A  major
  ];
  // Music-box melody (two notes per chord) sitting an octave above
  const melody = [
    [739.99, 659.26], // F#5 → E5
    [554.37, 659.26], // C#5 → E5
    [739.99, 587.33], // F#5 → D5
    [554.37, 440.00], // C#5 → A4
    [493.88, 587.33], // B4  → D5
    [739.99, 659.26], // F#5 → E5
    [493.88, 587.33], // B4  → D5
    [554.37, 659.26], // C#5 → E5
  ];
  let chordIndex = 0;
  const beat = 5.2; // slower, more romantic tempo

  function playPluck(freq, when, duration, peak, type) {
    const osc = audioCtx.createOscillator();
    osc.type = type || 'sine';
    osc.frequency.value = freq;
    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.0001, when);
    gain.gain.exponentialRampToValueAtTime(peak, when + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, when + duration);
    osc.connect(gain);
    gain.connect(musicMaster);
    osc.start(when);
    osc.stop(when + duration + 0.05);
  }

  function playChord() {
    if (!audioCtx || !musicMaster) return;
    const now = audioCtx.currentTime;
    const chord = chords[chordIndex % chords.length];
    const mel = melody[chordIndex % melody.length];

    // Pad chord — warm sine + triangle for piano-ish body
    chord.forEach((freq, i) => {
      [freq, freq * 2].forEach((f, k) => {
        const osc = audioCtx.createOscillator();
        osc.type = k === 0 ? 'sine' : 'triangle';
        osc.frequency.value = f;
        const gain = audioCtx.createGain();
        const peak = k === 0 ? 0.075 : 0.022;
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(peak, now + 1.2);
        gain.gain.exponentialRampToValueAtTime(peak * 0.55, now + beat * 0.65);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + beat);
        osc.detune.value = (i - chord.length / 2) * 2;
        osc.connect(gain);
        gain.connect(musicMaster);
        osc.start(now);
        osc.stop(now + beat + 0.1);
      });
    });

    // Music-box melody — pluck two notes per chord
    playPluck(mel[0], now + 0.15, 2.4, 0.13, 'sine');
    playPluck(mel[0] * 2, now + 0.15, 1.6, 0.035, 'sine'); // sparkle overtone
    playPluck(mel[1], now + beat * 0.55, 2.4, 0.12, 'sine');
    playPluck(mel[1] * 2, now + beat * 0.55, 1.6, 0.032, 'sine');

    // Soft bass root pulse on beat
    playPluck(chord[0] / 2, now + 0.05, beat * 0.9, 0.06, 'sine');

    chordIndex++;
  }

  // Create the AudioContext + graph synchronously (must happen inside user gesture on iOS)
  function initAudioContext() {
    if (audioCtx) return true;
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return false;
      audioCtx = new Ctx();
      musicMaster = audioCtx.createGain();
      musicMaster.gain.value = 0.0001;
      const delay = audioCtx.createDelay(2);
      delay.delayTime.value = 0.32;
      const feedback = audioCtx.createGain();
      feedback.gain.value = 0.35;
      const wet = audioCtx.createGain();
      wet.gain.value = 0.4;
      musicMaster.connect(delay);
      delay.connect(feedback);
      feedback.connect(delay);
      delay.connect(wet);
      wet.connect(audioCtx.destination);
      musicMaster.connect(audioCtx.destination);
      return true;
    } catch (e) {
      return false;
    }
  }

  // The classic iOS Web Audio unlock — call synchronously in a user gesture.
  // Playing a 1-sample silent buffer forces iOS Safari/Chrome to fully
  // activate the audio graph so subsequent oscillators actually output sound.
  let audioUnlocked = false;
  function unlockAudio() {
    if (audioUnlocked || !audioCtx) return;
    try {
      if (audioCtx.state === 'suspended') audioCtx.resume();
      const buffer = audioCtx.createBuffer(1, 1, 22050);
      const source = audioCtx.createBufferSource();
      source.buffer = buffer;
      source.connect(audioCtx.destination);
      source.start(0);
      // Also play a very short, near-silent oscillator to prime the graph
      const primeOsc = audioCtx.createOscillator();
      const primeGain = audioCtx.createGain();
      primeGain.gain.value = 0.0001;
      primeOsc.connect(primeGain);
      primeGain.connect(audioCtx.destination);
      primeOsc.start(audioCtx.currentTime);
      primeOsc.stop(audioCtx.currentTime + 0.05);
      audioUnlocked = true;
    } catch (e) {}
  }

  function startMusic() {
    if (musicPlaying) return;
    if (!initAudioContext()) return;
    if (audioCtx.state === 'suspended') audioCtx.resume();

    musicMaster.gain.cancelScheduledValues(audioCtx.currentTime);
    musicMaster.gain.setValueAtTime(musicMaster.gain.value, audioCtx.currentTime);
    musicMaster.gain.linearRampToValueAtTime(0.55, audioCtx.currentTime + 1.2);

    playChord();
    musicInterval = setInterval(playChord, beat * 1000);
    musicPlaying = true;
    musicToggle.classList.add('playing');
  }

  function stopMusic() {
    if (!musicPlaying || !audioCtx) return;
    musicMaster.gain.cancelScheduledValues(audioCtx.currentTime);
    musicMaster.gain.setValueAtTime(musicMaster.gain.value, audioCtx.currentTime);
    musicMaster.gain.linearRampToValueAtTime(0.0001, audioCtx.currentTime + 0.8);
    clearInterval(musicInterval);
    musicInterval = null;
    musicPlaying = false;
    musicToggle.classList.remove('playing');
  }

  musicToggle.addEventListener('click', () => {
    initAudioContext();
    unlockAudio();
    if (musicPlaying) stopMusic(); else startMusic();
  });

  // Prime + unlock audio in the Open Invitation click (user gesture),
  // then start music playback shortly after.
  openFullBtn.addEventListener('click', () => {
    initAudioContext();
    unlockAudio();
    setTimeout(() => {
      if (!musicPlaying) startMusic();
    }, 900);
  });

  // Also unlock audio on the very first tap/click anywhere else, in case
  // the user opens the invitation but the initial gesture wasn't enough.
  ['touchend', 'click'].forEach(evt => {
    document.addEventListener(evt, function firstTouch() {
      initAudioContext();
      unlockAudio();
      if (audioUnlocked) {
        document.removeEventListener('touchend', firstTouch);
        document.removeEventListener('click', firstTouch);
      }
    }, { once: false, passive: true });
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
