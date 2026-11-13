/* MADE FOR YOU — Complete Interactive Script */
(() => {
  'use strict';

  // ========================================
  // PERSONAL DETAILS — EDIT THESE
  // ========================================
  const CONFIG = {
    fromName: 'Yash',   // Apna naam yahan likhein
    toName: 'Priya',    // Unka naam yahan likhein

    letter: 'I wanted to make something special for you. Thank you for being a beautiful part of my life. I hope your birthday is full of happiness, laughter and everything you love. Always keep smiling. ❤️',

    promises: [
      'Always respect each other',
      'Celebrate little victories together',
      'Listen with patience & care',
      'Keep choosing kindness always',
      'Be each others cheerleader',
      'Never go to sleep angry',
      'Share every silly joke & secret',
      'Support each others dreams',
      'Hold hands through every storm',
      'Love each other more every day'
    ],

    music: 'assets/music/music.mp3'
  };

  const $ = id => document.getElementById(id);
  const scenes = [...document.querySelectorAll('.scene')];

  let knockCount = 0;
  let audio = null;
  let cakeCutDone = false;

  // ========================================
  // SCENE NAVIGATION
  // ========================================
  function show(id) {
    const index = scenes.findIndex(scene => scene.id === id);
    if (index < 0) return;

    scenes.forEach((scene, i) => {
      scene.classList.toggle('active', i === index);
    });

    $('app')?.setAttribute('data-scene', id);

    document.querySelectorAll('.page-next').forEach(btn => {
      btn.hidden = true;
    });

    const nextButton = scenes[index].querySelector('.page-next');
    if (nextButton) nextButton.hidden = false;

    if ($('dots')) {
      $('dots').style.opacity = index > 0 ? '1' : '0';
    }

    document.querySelectorAll('#dots i').forEach((dot, i) => {
      dot.classList.toggle('on', i === index % 5);
    });

    if (id === 'reading' && $('letter')) $('letter').textContent = CONFIG.letter;
    if (id === 'promises') buildBubbles();
    if (id === 'tree') drawTree();
  }

  // ========================================
  // AUTOMATIC NEXT BUTTONS
  // ========================================
  function addNext(sceneId, label, target) {
    const scene = $(sceneId);
    if (!scene) return;

    const button = document.createElement('button');
    button.className = 'page-next';
    button.type = 'button';
    button.textContent = label;
    button.hidden = true;
    button.addEventListener('click', () => show(target));
    scene.appendChild(button);
  }

  [
    ['still', 'Continue →', 'love'],
    ['love', 'Continue →', 'tree'],
    ['tree', 'Open your gift →', 'gift'],
    ['fromme', 'Continue →', 'polaroids']
  ].forEach(route => addNext(...route));

  // ========================================
  // INTRO & GIFT -> CAKE SCENE
  // ========================================
  $('heartBtn')?.addEventListener('click', () => {
    tryPlayMusic();
    show('still');
  });

  $('giftBtn')?.addEventListener('click', () => {
    $('giftBtn')?.classList.add('opened');
    setTimeout(() => show('cakeScene'), 550);
  });

  // ========================================
  // CAKE CUTTING INTERACTION
  // ========================================
  $('cakeBox')?.addEventListener('click', () => {
    if (cakeCutDone) return;
    cakeCutDone = true;

    $('cakeBox').classList.add('cut');
    
    const hintEl = $('cakeHint');
    if (hintEl) hintEl.textContent = '🎉 Candles blown! Cake cut successfully! 🎂';

    const nextBtn = $('cakeNext');
    if (nextBtn) {
      nextBtn.disabled = false;
      nextBtn.textContent = 'Read my Birthday Wish →';
    }
    
    celebrate();
  });

  $('cakeNext')?.addEventListener('click', () => {
    show('bdayWishScene');
  });

  $('wishNext')?.addEventListener('click', () => {
    show('fromme');
  });

  // ========================================
  // FULL-SCREEN ZOOM SCENE CLICK TO DOOR
  // ========================================
  $('polaroids')?.addEventListener('click', event => {
    show('door');
  });

  // ========================================
  // MUSEUM DOOR (3 KNOCKS)
  // ========================================
  $('knocker')?.addEventListener('click', () => {
    if (knockCount >= 3) return;
    knockCount++;

    const pips = document.querySelectorAll('#knockPips b');
    if (pips[knockCount - 1]) pips[knockCount - 1].classList.add('on');

    const subtitle = $('doorSub');
    if (subtitle) {
      subtitle.textContent = knockCount < 3
        ? `Knock ${knockCount}/3…`
        : 'The door is opening…';
    }

    if (knockCount >= 3) {
      document.querySelector('.door-stage')?.classList.add('open');
      $('walking')?.classList.add('show');
      setTimeout(() => show('gallery'), 1100);
    }
  });

  // ========================================
  // ROOM 1: SPECIAL GALLERY -> READING ROOM
  // ========================================
  $('galNext')?.addEventListener('click', () => {
    show('reading');
  });

  // ========================================
  // ROOM 2: LETTER ROOM
  // ========================================
  function openLetter() {
    $('env')?.classList.add('open');
    setTimeout(() => {
      $('envBox')?.setAttribute('hidden', '');
      $('letterWrap')?.removeAttribute('hidden');
    }, 550);
  }

  $('env')?.addEventListener('click', openLetter);
  $('env')?.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openLetter();
    }
  });

  $('readNext')?.addEventListener('click', () => show('promises'));

  // ========================================
  // ROOM 3: BUBBLE PROMISES
  // ========================================
  function buildBubbles() {
    const grid = $('bubbleGrid');
    if (!grid || grid.dataset.ready) return;
    grid.dataset.ready = '1';

    CONFIG.promises.forEach(text => {
      const bubble = document.createElement('div');
      bubble.className = 'promise-bubble';
      bubble.textContent = text;

      bubble.addEventListener('click', () => {
        bubble.classList.toggle('selected');
        const selectedBubbles = grid.querySelectorAll('.promise-bubble.selected');
        const count = selectedBubbles.length;
        const canProceed = count >= 4;

        if ($('promNext')) {
          $('promNext').disabled = !canProceed;
          $('promNext').textContent = canProceed ? `Sealed (${count}/10 bubbles) ✓` : `Pick at least 4 (${count}/4)`;
        }
      });

      grid.appendChild(bubble);
    });
  }

  $('promNext')?.addEventListener('click', () => show('question'));

  // ========================================
  // FINAL QUESTION & ESCAPING NO BUTTON
  // ========================================
  $('yesBtn')?.addEventListener('click', () => {
    $('qBox')?.setAttribute('hidden', '');
    $('finalBox')?.removeAttribute('hidden');
    if ($('finalMsg')) {
      $('finalMsg').textContent = 'Thank you for being you. Wishing you a life full of joy, peace and beautiful memories. ❤️';
    }
    celebrate();
  });

  const noBtn = $('noBtn');
  const funnyTexts = [
    "No 🤭", "Arre socho toh! 🥺", "Wrong button! 😂", "Try Yes instead! 💕", "Naah pakda na! 🏃‍♂️", "Koshish jaari rakho! 😜"
  ];
  let textIndex = 0;

  function moveNoButton() {
    const randomX = (Math.random() - 0.5) * 220;
    const randomY = (Math.random() - 0.5) * 160;
    noBtn.style.transform = `translate(${randomX}px, ${randomY}px)`;
    
    textIndex = (textIndex + 1) % funnyTexts.length;
    noBtn.textContent = funnyTexts[textIndex];
  }

  noBtn?.addEventListener('mouseover', moveNoButton);
  noBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    moveNoButton();
    if ($('qMsg')) {
      $('qMsg').textContent = 'Yeh button kaam nahi karega, "Yes" dabao! 💖';
    }
  });

  $('replayBtn')?.addEventListener('click', () => {
    knockCount = 0;
    cakeCutDone = false;
    $('cakeBox')?.classList.remove('cut');
    
    if (noBtn) {
      noBtn.style.transform = 'translate(0px, 0px)';
      noBtn.textContent = 'No 🤭';
    }

    const hintEl = $('cakeHint');
    if (hintEl) hintEl.textContent = '🎂 Tap the cake to cut & blow candles!';

    const nextBtn = $('cakeNext');
    if (nextBtn) {
      nextBtn.disabled = true;
      nextBtn.textContent = 'Cut the cake first →';
    }

    document.querySelectorAll('#knockPips b').forEach(b => b.classList.remove('on'));
    document.querySelector('.door-stage')?.classList.remove('open');
    $('walking')?.classList.remove('show');
    if ($('doorSub')) $('doorSub').textContent = "Knock three times. That's the rule.";

    $('env')?.classList.remove('open');
    $('envBox')?.removeAttribute('hidden');
    $('letterWrap')?.setAttribute('hidden', '');

    if ($('bubbleGrid')) {
      $('bubbleGrid').innerHTML = '';
      delete $('bubbleGrid').dataset.ready;
    }
    if ($('promNext')) {
      $('promNext').disabled = true;
      $('promNext').textContent = 'Pick at least 4 bubbles to seal';
    }

    $('qBox')?.removeAttribute('hidden');
    $('finalBox')?.setAttribute('hidden', '');
    if ($('qMsg')) $('qMsg').textContent = '';

    show('intro');
  });

  // ========================================
  // NAMES & MUSIC
  // ========================================
  document.querySelectorAll('[data-him]').forEach(el => { el.textContent = CONFIG.fromName; });
  document.querySelectorAll('[data-her]').forEach(el => { el.textContent = CONFIG.toName; });

  function tryPlayMusic() {
    if (!audio) {
      audio = new Audio(CONFIG.music);
      audio.loop = true;
    }
    audio.play()
      .then(() => $('mute')?.classList.remove('muted'))
      .catch(() => $('mute')?.classList.add('muted'));
  }

  $('mute')?.addEventListener('click', () => {
    if (!audio) {
      tryPlayMusic();
      return;
    }
    if (audio.paused) {
      audio.play().then(() => $('mute')?.classList.remove('muted')).catch(() => {});
    } else {
      audio.pause();
      $('mute')?.classList.add('muted');
    }
  });

  // ========================================
  // HEART TREE & CONFETTI CELEBRATION
  // ========================================
  function drawTree() {
    const canvas = $('treeCanvas');
    if (!canvas || canvas.dataset.drawn) return;
    canvas.dataset.drawn = '1';

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const cx = canvas.width / 2;
    const baseY = canvas.height * 0.56;

    ctx.strokeStyle = '#7a4328';
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(cx, baseY);
    ctx.lineTo(cx, baseY - 90);
    ctx.stroke();

    const colors = ['#e11d63', '#ff4d85', '#ff85a2', '#fb6f92'];
    for (let i = 0; i < 160; i++) {
      const t = Math.random() * Math.PI * 2;
      const r = Math.sqrt(Math.random()) * 7.5;
      const hx = 16 * Math.pow(Math.sin(t), 3) * r;
      const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * r;

      ctx.fillStyle = colors[i % colors.length];
      ctx.beginPath();
      ctx.arc(cx + hx, baseY - 140 + hy, 3.5 + Math.random() * 4.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function celebrate() {
    const canvas = $('fx');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const pieces = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      r: 3 + Math.random() * 5,
      vy: 2 + Math.random() * 3.5,
      color: ['#ff4d85', '#ffd479', '#ffffff', '#ff9fbd', '#ff5c8a'][Math.floor(Math.random() * 5)]
    }));

    let frames = 0;
    function tick() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pieces.forEach(p => {
        p.y += p.vy;
        if (p.y > canvas.height) p.y = -10;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
      if (++frames < 300) requestAnimationFrame(tick);
      else ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    tick();
  }
})();