
  // AUDIO SYNTH FX
  const soundEngine = {
    ctx: null,
    init() {
      if (!this.ctx) {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(e => console.warn("Failed to resume context:", e));
      }
      // Proactive hardware unlock on mobile browsers (Safari/Chrome touch requirement)
      try {
        if (this.ctx && this.ctx.state === 'running') {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          gain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(0);
          osc.stop(0.01);
        }
      } catch (err) {
        console.log("Audio warm-up skipped", err);
      }
    },
    play(id) {
      try {
        this.init();
        if (!this.ctx) return;
        if (this.ctx.state === 'suspended') {
          this.ctx.resume().catch(e => console.warn("Failed to resume context on play:", e));
        }
        
        const now = this.ctx.currentTime;
        
        if (id === 'jump') {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          
          osc.type = 'sine';
          osc.frequency.setValueAtTime(160, now);
          osc.frequency.exponentialRampToValueAtTime(500, now + 0.15);
          gain.gain.setValueAtTime(0.06, now);
          gain.gain.linearRampToValueAtTime(0.001, now + 0.15);
          osc.start(now);
          osc.stop(now + 0.15);
        } else if (id === 'hit') {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(140, now);
          osc.frequency.linearRampToValueAtTime(30, now + 0.22);
          gain.gain.setValueAtTime(0.1, now);
          gain.gain.linearRampToValueAtTime(0.001, now + 0.22);
          osc.start(now);
          osc.stop(now + 0.22);
        } else if (id === 'collect') {
          [330, 440, 550, 660].forEach((freq, i) => {
            const co = this.ctx.createOscillator();
            const cg = this.ctx.createGain();
            co.connect(cg);
            cg.connect(this.ctx.destination);
            co.frequency.setValueAtTime(freq, now + i * 0.05);
            cg.gain.setValueAtTime(0.05, now + i * 0.05);
            cg.gain.linearRampToValueAtTime(0.001, now + i * 0.05 + 0.16);
            co.start(now + i * 0.05);
            co.stop(now + i * 0.05 + 0.17);
          });
        } else if (id === 'success') {
          // A glorious celebratory ascending major seventh arpeggio harmony on milestone reach!
          [261.63, 329.63, 392.00, 493.88, 523.25].forEach((freq, idx) => {
            const co = this.ctx.createOscillator();
            const cg = this.ctx.createGain();
            co.connect(cg);
            cg.connect(this.ctx.destination);
            co.type = idx % 2 === 0 ? 'sine' : 'triangle';
            co.frequency.setValueAtTime(freq, now + idx * 0.06);
            cg.gain.setValueAtTime(0.08, now + idx * 0.06);
            cg.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.35);
            co.start(now + idx * 0.06);
            co.stop(now + idx * 0.06 + 0.36);
          });
        }
      } catch (err) {
        console.warn("Synth skipped:", err);
      }
    }
  };

  // WEB AUDIO MOBILE AUTO-UNLOCKER AND WARM-UP PRIMER
  const unlockAudio = () => {
    soundEngine.init();
    if (soundEngine.ctx) {
      if (soundEngine.ctx.state === 'suspended') {
        soundEngine.ctx.resume().catch(e => console.warn(e));
      }
      try {
        // Prime buffer with brief sub-detectable oscillator tone
        const osc = soundEngine.ctx.createOscillator();
        const gain = soundEngine.ctx.createGain();
        osc.connect(gain);
        gain.connect(soundEngine.ctx.destination);
        gain.gain.setValueAtTime(0.0001, soundEngine.ctx.currentTime);
        osc.start(0);
        osc.stop(0.01);
      } catch (e) {
        console.warn("Audio warm-up skipped:", e);
      }
    }
    // Safely unsubscribe once activated
    window.removeEventListener('click', unlockAudio);
    window.removeEventListener('touchstart', unlockAudio);
    window.removeEventListener('pointerdown', unlockAudio);
  };
  window.addEventListener('click', unlockAudio);
  window.addEventListener('touchstart', unlockAudio, { passive: true });
  window.addEventListener('pointerdown', unlockAudio, { passive: true });

  // CONSTANT LEVELS DECLARATIONS
  const LEVELS_CONFIG = [
    {
      num: 1,
      name: "Lassi Valley (Humanitarian & CSR Office)",
      slope: "20° Slope",
      slant: 0,
      npcName: "🥛 Zainab, CSR & Program Director",
      npcLine: "Secure community alignment first. Then deployment.",
      npcLineSub: "Assalam-o-Alaikum, Delegate! Nutrition is the fundamental milestone of any sustainable intervention. Gulp down this cold-chain yogurt lassi to qualify your preliminary project bandwidth.",
      foodTitle: "FIELD-LEVEL NUTRITION INFUSION",
      foodDesc: "Chilled prebiotic yoghurt from the local community cluster. Guaranteed to increase field-team project delivery velocity by 24%!",
      foodGlow: "🥛",
      badge: "🥛 ESG Strategy Seeker",
      badgeGlyph: "🥛",
      obstacles: [260, 480, 680, 860, 1020],
      npcX: 1180,
      skyGrad: "linear-gradient(to bottom, #10b981 0%, #172554 100%)",
      groundColor: "#0f766e"
    },
    {
      num: 2,
      name: "Karahi Dhaba (Energy & Industrial Sector)",
      slope: "40° Slope",
      slant: -7,
      npcName: "🍛 Bashir, Energy Operations Lead",
      npcLine: "AI operates like a high-pressure drilling valve.",
      npcLineSub: "Welcome, Engineer! Down here, high pressure isn't a bug—it's a feature. This sizzling karahi is perfect for clearing operational friction. Let's audit your comfortable tech deployment capacity.",
      foodTitle: "HIGH-PRESSURE DRILL SITE FUEL",
      foodDesc: "Sizzling mutton karahi cooked with premium garlic. Calibrated to maximize geological survey compliance and core courage!",
      foodGlow: "🍛",
      badge: "🍛 Rig-Ready Optimizer",
      badgeGlyph: "🍛",
      obstacles: [250, 440, 620, 780, 940, 1040],
      npcX: 1180,
      skyGrad: "linear-gradient(to bottom, #f59e0b 0%, #301008 100%)",
      groundColor: "#854d0e"
    },
    {
      num: 3,
      name: "Mango Ridge (Telecom & Digital Infrastructure Hub)",
      slope: "60° Slope",
      slant: -14,
      npcName: "🥭 Sameer, Telecom Infrastructure Lead",
      npcLine: "Clear the network fog. Latency is the real enemy.",
      npcLineSub: "Slices of pure yellow mangoes cut the high mountain line-of-sight cloud cover. Relish these, clear your connection buffers, and let's find out what's congesting your weekly schedule.",
      foodTitle: "HIGH-BANDWIDTH CHUNSA BUFFER",
      foodDesc: "Golden, sun-ripened organic mango slices. Instantly improves cognitive network latency and optimizes schedule queues!",
      foodGlow: "🥭",
      badge: "🥭 Bandwidth Ranger",
      badgeGlyph: "🥭",
      obstacles: [230, 410, 580, 720, 880, 1000],
      npcX: 1180,
      skyGrad: "linear-gradient(to bottom, #ca8a04 0%, #1e1b4b 100%)",
      groundColor: "#4d7c0f"
    },
    {
      num: 4,
      name: "Summit Boardroom (The Altar)",
      slope: "80° Slope",
      slant: -21,
      npcName: "🏆 Wise Council, Kashmiri Summit",
      npcLine: "Sovereign commitment generates executive dividends.",
      npcLineSub: "Congratulations! You have climbed past the operational valleys. Drink this hot Kashmiri Saffron Kahwa, and let us ratify your custom-vetted 30-day AI Action Roadmap!",
      foodTitle: "BOARD-APPROVED KAHWA RESOLUTION",
      foodDesc: "Brew of hand-picked saffron, green cardamom, and almonds. Full executive endorsement and governance capability unlocked!",
      foodGlow: "🏆",
      badge: "🏆 AI Transformation Director",
      badgeGlyph: "🏆",
      obstacles: [240, 450, 650, 820, 1000],
      npcX: 1180,
      skyGrad: "linear-gradient(to bottom, #4338ca 0%, #030712 100%)",
      groundColor: "#475569"
    }
  ];

  const SVGS_PROCEDURAL = {
    log: `<svg viewBox="0 0 34 34" width="100%" height="100%"><rect x="2" y="16" width="30" height="12" rx="3" fill="#78350f" stroke="#451a03" stroke-width="2"/><ellipse cx="2" cy="22" rx="2" ry="6" fill="#451a03"/><circle cx="16" cy="22" r="1.5" fill="#facc15"/></svg>`,
    rock: `<svg viewBox="0 0 34 34" width="100%" height="100%"><path d="M2,30 L10,8 L22,4 L32,22 L32,30 Z" fill="#64748b" stroke="#1e293b" stroke-width="2"/><path d="M10,8 L18,18 L32,18" stroke="#94a3b8" stroke-width="1.5" fill="none"/></svg>`,
    woman: `<svg viewBox="0 0 60 90" width="100%" height="100%"><path d="M15,40 C15,25 45,25 45,40 L40,85 L20,85 Z" fill="#047857"/><ellipse cx="30" cy="22" rx="8" ry="9" fill="#fda4af"/><path d="M15,18 C15,8, 45,8, 45,18 L48,50 L12,50 Z" fill="#14b8a6" opacity="0.8"/></svg>`,
    turban_man: `<svg viewBox="0 0 60 90" width="100%" height="100%"><rect x="20" y="42" width="20" height="42" fill="#1e293b"/><ellipse cx="30" cy="28" rx="8" ry="9" fill="#fbcfe8"/><path d="M16,16 C16,16, 44,16, 44,22 C44,28, 16,28, 16,16" fill="#b91c1c"/><rect x="24" y="34" width="12" height="3" fill="#090d16"/></svg>`,
    orchard_girl: `<svg viewBox="0 0 60 90" width="100%" height="100%"><path d="M15,40 L45,40 L40,85 L20,85 Z" fill="#15803d"/><ellipse cx="30" cy="22" rx="8" ry="9" fill="#fecdd3"/><path d="M16,14 C16,6, 44,6, 44,14" fill="#a21caf"/></svg>`,
    wise_sage: `<svg viewBox="0 0 60 90" width="100%" height="100%"><path d="M15,40 L45,40 L42,85 L18,85 Z" fill="#312e81"/><ellipse cx="30" cy="22" rx="8" ry="9" fill="#ffedd5"/><rect x="22" y="31" width="16" height="24" rx="4" fill="#f8fafc"/><path d="M22,12 C22,6, 38,6, 38,12" fill="#e2e8f0"/></svg>`
  };

  // SYSTEM STATE MODULE
  const state = {
    userName: "Strategic Climber",
    levelIndex: 0,
    score: 0,
    lives: 3,
    running: false,
    invulnerable: 0,

    trackX: 0,
    guduY: 0,
    guduVelocityY: 0,
    isJumping: false,

    answers: {
      role: "",
      realm: "",
      maturity: 0,
      drains: [],
      starPoint: "",
      targetHrs: 0,
      workMode: ""
    }
  };

  const TRACK_DUR = 1150;
  const RUN_SPEED = 2.4; // smooth pixel advance per tick frame
  const JUMP_POWER = 13.5;
  const GRAVITY_Y = 0.76;

  // DYNAMIC TERRAIN HEIGHT MAPPER (Steeper altitude variations!)
  function getTerrainHeight(x, levelIndex) {
    let evalX = x;
    if (LEVELS_CONFIG && LEVELS_CONFIG[levelIndex]) {
      const npcX = LEVELS_CONFIG[levelIndex].npcX;
      if (x > npcX + 150) {
        evalX = npcX + 150;
      }
    }

    if (levelIndex === 0) {
      // Rolling hills: gentle rolling terrain with minor slopes
      return 10 + Math.sin(evalX * 0.012) * 16 + Math.sin(evalX * 0.035) * 4 + (evalX / TRACK_DUR) * 20;
    } else if (levelIndex === 1) {
      // Steeper road: dhaba hillside roads rising up wavelike styling
      return 15 + Math.sin(evalX * 0.015) * 28 + Math.cos(evalX * 0.03) * 8 + (evalX / TRACK_DUR) * 65;
    } else if (levelIndex === 2) {
      // Mango Ridge: steeper drop paths, deep valley dips and high orchards climb
      return 20 + Math.sin(evalX * 0.016) * 52 + Math.cos(evalX * 0.007) * 20 + (evalX / TRACK_DUR) * 95;
    } else if (levelIndex === 3) {
      // Summit Climb: extreme vertical ascent reaching the highest snowy Srinagar peak
      const progress = evalX / TRACK_DUR;
      const baseClimb = progress * 140; // rises 140px vertically!
      const peaks = Math.sin(evalX * 0.02) * 28 + Math.cos(evalX * 0.008) * 14;
      return 15 + baseClimb + peaks;
    }
    return 0;
  }

  // BUILD DYNAMIC TERRAIN SVG PATHS (using 360px height mapping for high climbs)
  function buildTerrainSvgPath(levelIndex) {
    const H = 360; // Height of the SVG coordinate space representation
    const width = Math.max(5000, window.innerWidth + 2000); // Massive width to ensure it is never broken at the end on any screens!
    let d_fill = "";
    let d_stroke = "";
    
    // Dynamic starting point
    const y0 = H - (72 + getTerrainHeight(0, levelIndex));
    d_fill += `M 0,${y0} `;
    d_stroke += `M 0,${y0} `;
    
    // Compute intermediate vertices
    for (let x = 15; x <= width; x += 15) {
      const yVal = H - (72 + getTerrainHeight(x, levelIndex));
      d_fill += `L ${x},${yVal} `;
      d_stroke += `L ${x},${yVal} `;
    }
    
    // Anchor fill bottom edges to make it solid representation
    d_fill += `L ${width},${H} L 0,${H} Z`;
    
    return { fill: d_fill, stroke: d_stroke, width: width };
  }

  // FLOATING XP REWARDS POPUP INJECTOR
  function showFloatingXp(x, y, amount) {
    const popup = document.createElement("div");
    popup.className = "floating-xp";
    popup.textContent = `+${amount} XP`;
    popup.style.left = `${x}px`;
    popup.style.bottom = `${y}px`;
    trackScroll.appendChild(popup);
    
    setTimeout(() => {
      if (popup.parentNode) {
        popup.parentNode.removeChild(popup);
      }
    }, 900);
  }

  // DOM REFERENCES
  const scWelcome = document.getElementById("scWelcome");
  const scStageGrid = document.getElementById("scStageGrid");
  const scIntermission = document.getElementById("scIntermission");
  const scReveal = document.getElementById("scReveal");
  const scCinematic = document.getElementById("scCinematic");

  const hud = document.getElementById("hud");
  const timelineBar = document.getElementById("timelineBar");
  const timelineFill = document.getElementById("timelineFill");
  const hudScore = document.getElementById("hudScore");
  const livesBar = document.getElementById("livesBar");
  
  const guduChar = document.getElementById("guduChar");
  const guduAnimator = document.getElementById("guduAnimator");
  const trackScroll = document.getElementById("trackScroll");
  const mtnStrip = document.getElementById("mtnStrip");
  const gameViewport = document.getElementById("gameViewport");
  const pathBed = document.getElementById("pathBed");
  
  const panelRetry = document.getElementById("panelRetry");
  const panelPowerup = document.getElementById("panelPowerup");
  const panelBadge = document.getElementById("panelBadge");
  const bsQuiz = document.getElementById("bsQuiz");

  // JUMPING TRIGGERS
  function executeJump() {
    if (!state.running || state.isJumping) return;
    state.isJumping = true;
    state.guduVelocityY = JUMP_POWER;
    guduAnimator.className = "gudu-body gudu-jump";
    soundEngine.play('jump');
  }

  // JUMP TRIGGERS MOUSE, POINTERS & NATIVE MOBILE TOUCH
  const handleJumpTrigger = (e) => {
    // Proactive touch warming and AudioContext resume for mobile engines
    soundEngine.init();
    if (soundEngine.ctx && soundEngine.ctx.state === 'suspended') {
      soundEngine.ctx.resume().catch(() => {});
    }
    // Avoid triggering if clicked inside an interactive element
    if (
      e.target.closest('button') || 
      e.target.closest('input') || 
      e.target.closest('.tile') || 
      e.target.closest('.chip') || 
      e.target.closest('.bp-item') || 
      e.target.closest('textarea') ||
      e.target.closest('a')
    ) return;
    executeJump();
  };

  // Listen directly to touchstart with passive option, and pointerdown for mice
  window.addEventListener("pointerdown", (e) => {
    // If it's a touch pointer, let touchstart handle it to avoid double-firing or lag
    if (e.pointerType === 'touch') return;
    handleJumpTrigger(e);
  });
  window.addEventListener("touchstart", (e) => {
    handleJumpTrigger(e);
  }, { passive: true });

  window.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
      e.preventDefault();
      executeJump();
    }
  });

  // INITIALIZE WELCOME RUN
  document.getElementById("startBtn").onclick = () => {
    const rawVal = document.getElementById("userName").value.trim();
    if (rawVal) state.userName = rawVal;
    soundEngine.init();
    switchToScreen(scStageGrid);
    hud.style.display = "flex";
    timelineBar.style.display = "block";
    loadLevelIntermission(0);
  };

  function switchToScreen(target) {
    document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
    target.classList.add("active");
  }

  // LOADING LEVEL INTERMISSION LAYOUTS
  function loadLevelIntermission(idx) {
    state.levelIndex = idx;
    const l = LEVELS_CONFIG[idx];
    
    // Reset HUD details
    document.getElementById("hudIdx").textContent = `Milestone ${l.num} of 4`;
    document.getElementById("hudName").textContent = l.name;
    document.getElementById("intTitle").textContent = `Milestone ${l.num}: ${l.name}`;
    document.getElementById("intSlope").textContent = l.slope;
    document.getElementById("intQuote").textContent = `“${l.npcLine}” - ${l.npcName.split(",")[0]}`;
    document.getElementById("levelStartGlow").textContent = l.foodGlow;

    switchToScreen(scIntermission);
  }

  // GAME TRIGGER START CLIMB
  document.getElementById("levelResumeBtn").onclick = () => {
    soundEngine.init();
    const l = LEVELS_CONFIG[state.levelIndex];
    
    // Layout and gradient themes
    gameViewport.style.background = l.skyGrad;
    
    // Hide flat bottom line since we are using beautiful dynamic SVG mountain paths!
    pathBed.style.display = "none";

    // Clear and build dynamic mountain SVG path container
    trackScroll.innerHTML = `
      <svg id="terrainSvg" style="position: absolute; left: 0; bottom: 0; height: 360px; overflow: visible; z-index: 5; pointer-events: none;">
        <defs>
          <linearGradient id="terrainGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" id="terrainGradStart" stop-color="#0f766e" stop-opacity="0.85"/>
            <stop offset="100%" stop-color="#020617" stop-opacity="0.95"/>
          </linearGradient>
        </defs>
        <path id="terrainFill" fill="url(#terrainGrad)" />
        <path id="terrainStroke" fill="none" stroke-width="4" />
      </svg>
    `;

    // Render curved SVG terrain path dynamically
    const { fill, stroke, width } = buildTerrainSvgPath(state.levelIndex);
    const terrainSvg = document.getElementById("terrainSvg");
    const terrainFill = document.getElementById("terrainFill");
    const terrainStroke = document.getElementById("terrainStroke");
    const terrainGradStart = document.getElementById("terrainGradStart");
    
    terrainSvg.setAttribute("width", width);
    terrainFill.setAttribute("d", fill);
    terrainStroke.setAttribute("d", stroke);
    
    // Adapt colors matching each unique level
    const strokeColor = (idx => {
      if (idx === 0) return "#10b981";
      if (idx === 1) return "#f59e0b";
      if (idx === 2) return "#eab308";
      return "#A100FF"; // Think FRST summit purple
    })(state.levelIndex);
    
    terrainStroke.setAttribute("stroke", strokeColor);
    terrainStroke.style.filter = `drop-shadow(0 0 5px ${strokeColor})`;
    terrainGradStart.setAttribute("stop-color", l.groundColor);
    
    // Generate hurdles onto the dynamic coordinates
    l.obstacles.forEach((obX, id) => {
      const el = document.createElement("div");
      el.className = "track-element obstacle";
      el.style.left = `${obX}px`;
      el.innerHTML = (id % 2 === 0) ? SVGS_PROCEDURAL.log : SVGS_PROCEDURAL.rock;
      el.dataset.x = obX;
      el.dataset.hit = "false";

      // Position hurdle on the rolling terrain profile
      const obY = getTerrainHeight(obX, state.levelIndex);
      el.style.bottom = `${72 + obY}px`;
      
      // Align option rotate angle matching the slope of the hill
      const obYNext = getTerrainHeight(obX + 10, state.levelIndex);
      const obSlope = (obYNext - obY) / 10;
      const obAngleDeg = Math.max(-45, Math.min(45, Math.atan(obSlope) * (180 / Math.PI)));
      el.style.transform = `translateX(-50%) rotate(${obAngleDeg}deg)`;
      el.style.transformOrigin = "bottom center";

      trackScroll.appendChild(el);
    });

    // Generate NPC aligned on sloping terrain
    const npcEl = document.createElement("div");
    npcEl.className = "track-element npc";
    npcEl.style.left = `${l.npcX}px`;
    npcEl.dataset.x = l.npcX;
    
    const npcY = getTerrainHeight(l.npcX, state.levelIndex);
    npcEl.style.bottom = `${72 + npcY}px`;
    
    // To ensure the stations and host characters stand tall and never fall or tilt, we use 0deg rotation
    npcEl.style.transform = `translateX(-50%) rotate(0deg)`;
    npcEl.style.transformOrigin = "bottom center";
    
    let npcSvg = SVGS_PROCEDURAL.woman;
    if (state.levelIndex === 1) npcSvg = SVGS_PROCEDURAL.turban_man;
    if (state.levelIndex === 2) npcSvg = SVGS_PROCEDURAL.orchard_girl;
    if (state.levelIndex === 3) npcSvg = SVGS_PROCEDURAL.wise_sage;

    const flagColor = (idx => {
      if (idx === 0) return "#10b981"; // green
      if (idx === 1) return "#f59e0b"; // orange
      if (idx === 2) return "#facc15"; // juicy mango yellow/gold
      return "#A100FF"; // Think FRST summit purple
    })(state.levelIndex);

    const flagStrokeColor = (idx => {
      if (idx === 0) return "#047857";
      if (idx === 1) return "#b45309";
      if (idx === 2) return "#ca8a04";
      return "#7500C0";
    })(state.levelIndex);

    const flagHtml = `
      <div class="npc-station-flag">
        <svg viewBox="0 0 40 130" style="width: 100%; height: 100%; overflow: visible; filter: drop-shadow(0 0 10px ${flagColor});">
          <!-- Tall flagpole with silver gradient -->
          <rect x="18" y="10" width="4" height="120" rx="2" fill="#cbd5e1" stroke="#475569" stroke-width="1"/>
          <!-- Heavy marble pedestal mount -->
          <path d="M 8,130 L 32,130 L 26,122 L 14,122 Z" fill="#64748b" stroke="#334155" stroke-width="1"/>
          <!-- Floating glowing banner on top -->
          <path d="M 22,14 L 52,14 L 46,28 L 52,42 L 22,42 Z" fill="${flagColor}" stroke="${flagStrokeColor}" stroke-width="1.5"/>
          <circle cx="36" cy="28" r="9.5" fill="#ffffff"/>
          <text x="27.5" y="34.5" font-size="15" font-weight="bold">${l.foodGlow}</text>
          <!-- Level text badge -->
          <rect x="-8" y="52" width="56" height="18" rx="4" fill="#020617" stroke="${flagColor}" stroke-width="1.5" />
          <text x="20" y="65" font-size="9" fill="#ffffff" font-weight="900" font-family="'Space Grotesk', sans-serif" text-anchor="middle">STN-${l.num}</text>
        </svg>
      </div>
    `;

    npcEl.innerHTML = `
      <div class="npc-label">${l.npcName.split(",")[0]}</div>
      <div class="npc-char-body">${npcSvg}</div>
      ${flagHtml}
    `;
    trackScroll.appendChild(npcEl);

    // Reset physics trackers
    state.trackX = 0;
    state.guduY = 0;
    state.guduVelocityY = 0;
    state.isJumping = false;
    state.invulnerable = 0;
    
    const startY = getTerrainHeight(80, state.levelIndex);
    guduChar.style.bottom = `${72 + startY}px`;
    guduChar.style.transform = `translateY(0px)`;
    guduAnimator.className = "gudu-body gudu-run";
    guduAnimator.style.opacity = "1";

    trackScroll.style.transform = `translateX(0px)`;
    timelineFill.style.width = "0%";

    // Start Running ticks loop
    switchToScreen(scStageGrid);
    state.running = true;
    lastFrameTime = performance.now();
    requestAnimationFrame(gameLoop);
  };

  // LOOP MECHANISM
  let lastFrameTime = 0;
  function gameLoop(time) {
    if (!state.running) return;
    
    // Delta frames for steady rendering on laggy devices
    const delta = Math.min((time - lastFrameTime) / 16.66, 3);
    lastFrameTime = time;

    // Tick down invulnerability flash
    if (state.invulnerable > 0) {
      state.invulnerable -= delta;
      if (state.invulnerable <= 0) {
        guduAnimator.classList.remove("gudu-flash");
      }
    }

    // Advance scrolling
    state.trackX += RUN_SPEED * delta;
    if (state.trackX >= TRACK_DUR) {
      state.trackX = TRACK_DUR;
    }

    // Set translation transform
    trackScroll.style.transform = `translateX(${-state.trackX}px)`;
    mtnStrip.style.transform = `translateX(${-state.trackX * 0.15}px)`;

    // Update timelines progress
    const timelinePct = Math.min((state.trackX / TRACK_DUR) * 100, 100);
    timelineFill.style.width = `${timelinePct}%`;

    // Process Gudu jumps
    if (state.isJumping) {
      state.guduY += state.guduVelocityY * delta;
      state.guduVelocityY -= GRAVITY_Y * delta;
      if (state.guduY <= 0) {
        state.guduY = 0;
        state.guduVelocityY = 0;
        state.isJumping = false;
        guduAnimator.className = "gudu-body gudu-run";
      }
    }

    // Process Gudu height along dynamic mountaintop terrain on every tick frame
    const worldGuduX = state.trackX + 80;
    const terrainY = getTerrainHeight(worldGuduX, state.levelIndex);
    const terrainYNext = getTerrainHeight(worldGuduX + 10, state.levelIndex);
    const slope = (terrainYNext - terrainY) / 10;
    const angleRad = Math.atan(slope);
    let angleDeg = angleRad * (180 / Math.PI);
    angleDeg = Math.max(-45, Math.min(45, angleDeg)); // cap tilt angle matching steep altitude rises

    guduChar.style.bottom = `${72 + terrainY}px`;
    guduChar.style.transform = `translateY(${-state.guduY}px) rotate(${angleDeg}deg)`;

    // Collision math detector
    const guduLeft = 80;
    const guduWidth = 44;
    const worldGuduLeft = state.trackX + guduLeft;
    const worldGuduRight = worldGuduLeft + guduWidth;

    const obstacles = trackScroll.querySelectorAll(".obstacle");
    obstacles.forEach(ob => {
      const obX = parseInt(ob.dataset.x);
      const obWidth = 34;
      const obRight = obX + obWidth;

      // Successful Obstacle Passing Check: if Gudu's left edge is clear past obstacle's right edge
      if (worldGuduLeft > obRight && ob.dataset.passed !== "true" && ob.dataset.hit !== "true") {
        ob.dataset.passed = "true";
        state.score += 25; // Award 25 XP for successful jumps/passes!
        hudScore.textContent = `${state.score}/1000 XP`;
        soundEngine.play('collect');

        // Render beautiful floating indicator above the newly crossed obstacle
        const terrainObY = getTerrainHeight(obX, state.levelIndex);
        showFloatingXp(obX, 72 + terrainObY + 45, 25);
      }

      if (ob.dataset.hit === "true") return;

      // Overlap on X check
      if (worldGuduRight - 6 >= obX && worldGuduLeft + 6 <= obRight) {
        // Overlap on Y check (low enough to collide)
        if (state.guduY < 28) {
          ob.dataset.hit = "true";
          triggerGuduHit();
        }
      }
    });

    // Check NPC meeting stop
    const currentL = LEVELS_CONFIG[state.levelIndex];
    if (state.trackX >= currentL.npcX - 110) {
      // Reached host! Stop game and trigger feasting
      state.running = false;
      state.trackX = currentL.npcX - 110;
      trackScroll.style.transform = `translateX(${-state.trackX}px)`;
      
      // Update Gudu position on stop
      const finalY = getTerrainHeight(state.trackX + 80, state.levelIndex);
      guduChar.style.bottom = `${72 + finalY}px`;
      guduChar.style.transform = `translateY(0px) rotate(0deg)`;

      trackScroll.style.transform = `translateX(${-state.trackX}px)`;
      timelineFill.style.width = "100%";
      triggerNpcArrive();
      return;
    }

    requestAnimationFrame(gameLoop);
  }

  // COLLISION EXHAUST PROCESS
  function triggerGuduHit() {
    if (state.invulnerable > 0) return;
    
    soundEngine.play('hit');
    state.lives--;
    updateHudHearts();

    if (state.lives <= 0) {
      state.running = false;
      showOverlay(panelRetry);
    } else {
      // Add brief invulnerability buffer
      state.invulnerable = 65;
      guduAnimator.classList.add("gudu-flash");
    }
  }

  function updateHudHearts() {
    const hearts = ["h3", "h2", "h1"];
    hearts.forEach((hid, index) => {
      const el = document.getElementById(hid);
      if (state.lives <= index) {
        el.classList.add("lost");
      } else {
        el.classList.remove("lost");
      }
    });
  }

  // RESET RETRY FROM INCLUSIVE STAGE
  document.getElementById("retryLevelBtn").onclick = () => {
    soundEngine.init();
    state.lives = 3;
    updateHudHearts();
    hideOverlay(panelRetry);
    
    document.querySelectorAll(".obstacle").forEach(ob => ob.dataset.hit = "false");
    
    state.trackX = 0;
    state.guduY = 0;
    state.isJumping = false;
    trackScroll.style.transform = `translateX(0px)`;
    
    const initialY = getTerrainHeight(80, state.levelIndex);
    guduChar.style.bottom = `${72 + initialY}px`;
    guduChar.style.transform = `translateY(0px)`;
    guduAnimator.className = "gudu-body gudu-run";
    
    state.running = true;
    lastFrameTime = performance.now();
    requestAnimationFrame(gameLoop);
  };

  // OVERLAY ACTIONS
  function showOverlay(el) {
    el.classList.add("active");
  }
  function hideOverlay(el) {
    el.classList.remove("active");
  }

  // NPC FEAST START
  function triggerNpcArrive() {
    const l = LEVELS_CONFIG[state.levelIndex];
    
    // Set up Power-up Panel Description
    document.getElementById("powerupTitle").textContent = l.foodTitle;
    document.getElementById("powerupDesc").textContent = l.foodDesc;
    document.getElementById("powerGlowIcon").textContent = l.foodGlow;

    guduAnimator.className = "gudu-body"; // Idle state
    soundEngine.play('success');
    
    setTimeout(() => {
      showOverlay(panelPowerup);
    }, 400);
  }

  // OPEN MILESTONE QUIZ
  document.getElementById("powerupOkBtn").onclick = () => {
    soundEngine.init();
    hideOverlay(panelPowerup);
    openQuizSheet();
  };

  function openQuizSheet() {
    state.quizStep = 0;
    renderQuizStep();
    const bs = document.getElementById("bsQuiz");
    bs.classList.add("active");
  }

  function getQuizTotalSteps() {
    if (state.levelIndex === 0) return 2;
    if (state.levelIndex === 1) return 1;
    if (state.levelIndex === 2) return 1;
    if (state.levelIndex === 3) return 3;
    return 1;
  }

  function renderQuizStep() {
    const l = LEVELS_CONFIG[state.levelIndex];
    const step = state.quizStep || 0;
    const totalSteps = getQuizTotalSteps();

    // Show progressive header state
    document.getElementById("bsSubtitle").textContent = `Milestone ${l.num} of 4 · Screen ${step + 1} of ${totalSteps}`;
    document.getElementById("bsNpcLine").textContent = `"${l.npcLineSub}" - ${l.npcName}`;

    // Update Ori's happy pose dynamically on every quiz screen!
    updateQuizOriPose(state.levelIndex, step);

    const content = document.getElementById("bsContent");
    content.innerHTML = "";
    
    // Default disabled button
    document.getElementById("quizProceedBtn").disabled = true;

    // Show step button text: Next Step vs Complete
    const isLast = (step === totalSteps - 1);
    const proceedBtn = document.getElementById("quizProceedBtn");
    if (isLast) {
      proceedBtn.textContent = "Secure Stage Boost →";
    } else {
      proceedBtn.textContent = `Next Step (${step + 1}/${totalSteps}) →`;
    }

    if (state.levelIndex === 0) {
      if (step === 0) {
        document.getElementById("bsQuestion").className = "bs-q text-2xl font-black text-white tracking-tight leading-tight";
        document.getElementById("bsQuestion").textContent = "First, what is your professional role & seniority?";
        content.innerHTML = `
          <div class="large-quiz-list">
            <div class="large-tile ${state.answers.role === 'Executive' ? 'selected' : ''}" data-cat="role" data-val="Executive">
              <span class="tile-emoji">👑</span>
              <div class="tile-texts">
                <span class="tile-title text-base font-extrabold text-white">Executive Lead</span>
                <span class="tile-desc text-xs text-slate-400">CEO, Founder, General Manager, Director</span>
              </div>
            </div>
            <div class="large-tile ${state.answers.role === 'Manager_Senior' ? 'selected' : ''}" data-cat="role" data-val="Manager_Senior">
              <span class="tile-emoji">💼</span>
              <div class="tile-texts">
                <span class="tile-title text-base font-extrabold text-white">Senior Manager</span>
                <span class="tile-desc text-xs text-slate-400">Team Leader, Project Manager, Dept Head</span>
              </div>
            </div>
            <div class="large-tile ${state.answers.role === 'Workforce_Senior' ? 'selected' : ''}" data-cat="role" data-val="Workforce_Senior">
              <span class="tile-emoji">💻</span>
              <div class="tile-texts">
                <span class="tile-title text-base font-extrabold text-white">Technical Practitioner</span>
                <span class="tile-desc text-xs text-slate-400">Senior Analyst, Software Engineer, Specialist</span>
              </div>
            </div>
            <div class="large-tile ${state.answers.role === 'Workforce' ? 'selected' : ''}" data-cat="role" data-val="Workforce">
              <span class="tile-emoji">⚙️</span>
              <div class="tile-texts">
                <span class="tile-title text-base font-extrabold text-white">Frontline Associate</span>
                <span class="tile-desc text-xs text-slate-400">Officer, Analyst, Operations Executive</span>
              </div>
            </div>
          </div>
        `;
        setupLargeTileListeners("role");
      } else if (step === 1) {
        document.getElementById("bsQuestion").className = "bs-q text-2xl font-black text-white tracking-tight leading-tight";
        document.getElementById("bsQuestion").textContent = "Excellent! What core industry is your workflow in?";
        content.innerHTML = `
          <div class="large-chip-list">
            <div class="large-chip-item ${state.answers.realm === 'Banking' ? 'selected' : ''}" data-cat="realm" data-val="Banking">
              <span>🏦 Banking & Financial Services</span>
              <span class="text-xs opacity-60">→</span>
            </div>
            <div class="large-chip-item ${state.answers.realm === 'Education' ? 'selected' : ''}" data-cat="realm" data-val="Education">
              <span>🎓 Education & Academic Learning</span>
              <span class="text-xs opacity-60">→</span>
            </div>
            <div class="large-chip-item ${state.answers.realm === 'Healthcare' ? 'selected' : ''}" data-cat="realm" data-val="Healthcare">
              <span>🏥 Healthcare & Medical Sciences</span>
              <span class="text-xs opacity-60">→</span>
            </div>
            <div class="large-chip-item ${state.answers.realm === 'Technology' ? 'selected' : ''}" data-cat="realm" data-val="Technology">
              <span>💻 Technology & Software Systems</span>
              <span class="text-xs opacity-60">→</span>
            </div>
            <div class="large-chip-item ${state.answers.realm === 'Other' ? 'selected' : ''}" data-cat="realm" data-val="Other">
              <span>🌐 Other General Sectors</span>
              <span class="text-xs opacity-60">→</span>
            </div>
          </div>
        `;
        setupLargeChipListeners("realm");
      }
    } else if (state.levelIndex === 1) {
      // Comfort level selection
      document.getElementById("bsQuestion").className = "bs-q text-xl font-black text-white tracking-tight leading-snug";
      document.getElementById("bsQuestion").textContent = "Where do you stand now on the AI curve?";
      content.innerHTML = `
        <div class="large-quiz-list">
          <div class="large-tile ${state.answers.maturity === 1 ? 'selected' : ''}" data-cat="maturity" data-val="1">
            <span class="tile-emoji">🙈</span>
            <div class="tile-texts">
              <span class="tile-title text-base font-extrabold text-white">Pure Novice</span>
              <span class="tile-desc text-xs text-slate-400">I have barely touched AI interfaces yet.</span>
            </div>
          </div>
          <div class="large-tile ${state.answers.maturity === 2 ? 'selected' : ''}" data-cat="maturity" data-val="2">
            <span class="tile-emoji">🤔</span>
            <div class="tile-texts">
              <span class="tile-title text-base font-extrabold text-white">Curious Tester</span>
              <span class="tile-desc text-xs text-slate-400">I tried standard prompts, but quality felt simple or generic.</span>
            </div>
          </div>
          <div class="large-tile ${state.answers.maturity === 3 ? 'selected' : ''}" data-cat="maturity" data-val="3">
            <span class="tile-emoji">😎</span>
            <div class="tile-texts">
              <span class="tile-title text-base font-extrabold text-white">Occasional User</span>
              <span class="tile-desc text-xs text-slate-400">I prompt when someone hands me a template or a list.</span>
            </div>
          </div>
          <div class="large-tile ${state.answers.maturity === 4 ? 'selected' : ''}" data-cat="maturity" data-val="4">
            <span class="tile-emoji">🚀</span>
            <div class="tile-texts">
              <span class="tile-title text-base font-extrabold text-white">Frequent Operator</span>
              <span class="tile-desc text-xs text-slate-400">Regular prompting to write emails and speed up coding or reports.</span>
            </div>
          </div>
          <div class="large-tile ${state.answers.maturity === 5 ? 'selected' : ''}" data-cat="maturity" data-val="5">
            <span class="tile-emoji">🧠</span>
            <div class="tile-texts">
              <span class="tile-title text-base font-extrabold text-white">Co-Pilot Master</span>
              <span class="tile-desc text-xs text-slate-400">AI remains my constant second brain, running in all active tabs.</span>
            </div>
          </div>
        </div>
      `;
      setupLargeTileListeners("maturity");
    } else if (state.levelIndex === 2) {
      // Multi select drains
      document.getElementById("bsQuestion").className = "bs-q text-xl font-black text-white tracking-tight leading-snug";
      document.getElementById("bsQuestion").textContent = "What is eating your schedule? Select exactly 3 time-drain tasks:";
      content.innerHTML = `
        <div class="grid-tiles" id="drainsGrid" style="gap:10px;">
          <div class="large-tile ${state.answers.drains && state.answers.drains.includes("Drafting reports and memos") ? 'selected' : ''}" data-val="Drafting reports and memos" style="padding:14px 10px;">
            <span class="tile-emoji">📝</span>
            <div class="tile-texts">
              <span class="tile-title font-extrabold" style="font-size:13px;">Drafting reports</span>
            </div>
          </div>
          <div class="large-tile ${state.answers.drains && state.answers.drains.includes("Replying to email and escalations") ? 'selected' : ''}" data-val="Replying to email and escalations" style="padding:14px 10px;">
            <span class="tile-emoji">✉️</span>
            <div class="tile-texts">
              <span class="tile-title font-extrabold" style="font-size:13px;">Inbox emails</span>
            </div>
          </div>
          <div class="large-tile ${state.answers.drains && state.answers.drains.includes("Meeting preparation and follow-up") ? 'selected' : ''}" data-val="Meeting preparation and follow-up" style="padding:14px 10px;">
            <span class="tile-emoji">📅</span>
            <div class="tile-texts">
              <span class="tile-title font-extrabold" style="font-size:13px;">Meeting prep</span>
            </div>
          </div>
          <div class="large-tile ${state.answers.drains && state.answers.drains.includes("Reading long documents") ? 'selected' : ''}" data-val="Reading long documents" style="padding:14px 10px;">
            <span class="tile-emoji">📖</span>
            <div class="tile-texts">
              <span class="tile-title font-extrabold" style="font-size:13px;">Long documents</span>
            </div>
          </div>
          <div class="large-tile ${state.answers.drains && state.answers.drains.includes("Data reconciliation and cleanup") ? 'selected' : ''}" data-val="Data reconciliation and cleanup" style="padding:14px 10px;">
            <span class="tile-emoji">📊</span>
            <div class="tile-texts">
              <span class="tile-title font-extrabold" style="font-size:13px;">Data reconcile</span>
            </div>
          </div>
          <div class="large-tile ${state.answers.drains && state.answers.drains.includes("Vendor or proposal review") ? 'selected' : ''}" data-val="Vendor or proposal review" style="padding:14px 10px;">
            <span class="tile-emoji">⚖️</span>
            <div class="tile-texts">
              <span class="tile-title font-extrabold" style="font-size:13px;">Proposal review</span>
            </div>
          </div>
          <div class="large-tile ${state.answers.drains && state.answers.drains.includes("Status updates and reporting") ? 'selected' : ''}" data-val="Status updates and reporting" style="padding:14px 10px;">
            <span class="tile-emoji">🔔</span>
            <div class="tile-texts">
              <span class="tile-title font-extrabold" style="font-size:13px;">Status reporting</span>
            </div>
          </div>
          <div class="large-tile ${state.answers.drains && state.answers.drains.includes("Customer query triage") ? 'selected' : ''}" data-val="Customer query triage" style="padding:14px 10px;">
            <span class="tile-emoji">💬</span>
            <div class="tile-texts">
              <span class="tile-title font-extrabold" style="font-size:13px;">Customer query</span>
            </div>
          </div>
        </div>
        <div class="limit-lbl font-extrabold mt-4" id="drainsCountLabel" style="font-size:14px;">Selected: ${(state.answers.drains || []).length} of 3 required</div>
      `;
      setupDrainsListeners();
    } else if (state.levelIndex === 3) {
      if (step === 0) {
        document.getElementById("bsQuestion").className = "bs-q text-xl font-black text-white tracking-tight leading-snug";
        document.getElementById("bsQuestion").textContent = "What is your primary AI objective for the next 30 days?";
        content.innerHTML = `
          <div class="large-quiz-list">
            <div class="large-tile ${state.answers.starPoint === 'Save 5+ hours a week on routine work' ? 'selected' : ''}" data-cat="starPoint" data-val="Save 5+ hours a week on routine work">
              <span class="tile-emoji">⏳</span>
              <div class="tile-texts">
                <span class="tile-title text-base font-extrabold text-white">Save 5+ Hours Weekly</span>
                <span class="tile-desc text-xs text-slate-400">Automate high-occurrence weekly routine tasks.</span>
              </div>
            </div>
            <div class="large-tile ${state.answers.starPoint === 'Lead my team’s first AI initiative' ? 'selected' : ''}" data-cat="starPoint" data-val="Lead my team’s first AI initiative">
              <span class="tile-emoji">🎯</span>
              <div class="tile-texts">
                <span class="tile-title text-base font-extrabold text-white">Lead Team AI Playbook</span>
                <span class="tile-desc text-xs text-slate-400">Introduce shared templates & team automated flows.</span>
              </div>
            </div>
            <div class="large-tile ${state.answers.starPoint === 'Build my reputation as the AI-savvy leader' ? 'selected' : ''}" data-cat="starPoint" data-val="Build my reputation as the AI-savvy leader">
              <span class="tile-emoji">🌟</span>
              <div class="tile-texts">
                <span class="tile-title text-base font-extrabold text-white">Establish as AI Tech Leader</span>
                <span class="tile-desc text-xs text-slate-400">Gain distinction of high-tech efficiency authority.</span>
              </div>
            </div>
            <div class="large-tile ${state.answers.starPoint === 'Free up time for higher-value work' ? 'selected' : ''}" data-cat="starPoint" data-val="Free up time for higher-value work">
              <span class="tile-emoji">⚡</span>
              <div class="tile-texts">
                <span class="tile-title text-base font-extrabold text-white">Free Hours for Higher Value</span>
                <span class="tile-desc text-xs text-slate-400">Shift focus to strategic projects & partnerships.</span>
              </div>
            </div>
          </div>
        `;
        setupLargeTileListeners("starPoint");
      } else if (step === 1) {
        document.getElementById("bsQuestion").className = "bs-q text-xl font-black text-white tracking-tight leading-snug";
        document.getElementById("bsQuestion").textContent = "How many hours of speed-savings do you target?";
        content.innerHTML = `
          <div class="large-chip-list">
            <div class="large-chip-item ${state.answers.targetHrs === 2 ? 'selected' : ''}" data-cat="targetHrs" data-val="2">
              <span>⏳ 1-3 Hours Saved Weekly (Core Speed Up)</span>
              <span class="text-xs opacity-60">→</span>
            </div>
            <div class="large-chip-item ${state.answers.targetHrs === 5 ? 'selected' : ''}" data-cat="targetHrs" data-val="5">
              <span>⚡ 4-7 Hours Saved Weekly (Divisional Lift)</span>
              <span class="text-xs opacity-60">→</span>
            </div>
            <div class="large-chip-item ${state.answers.targetHrs === 10 ? 'selected' : ''}" data-cat="targetHrs" data-val="10">
              <span>🚀 8-15 Hours Saved Weekly (Strategic Mastery)</span>
              <span class="text-xs opacity-60">→</span>
            </div>
            <div class="large-chip-item ${state.answers.targetHrs === 18 ? 'selected' : ''}" data-cat="targetHrs" data-val="18">
              <span>🧠 15+ Hours Saved Weekly (Department Cascade)</span>
              <span class="text-xs opacity-60">→</span>
            </div>
          </div>
        `;
        setupLargeChipListeners("targetHrs");
      } else if (step === 2) {
        document.getElementById("bsQuestion").className = "bs-q text-xl font-black text-white tracking-tight leading-snug";
        document.getElementById("bsQuestion").textContent = "Perfect! Choose your Traction Flight Mode:";
        content.innerHTML = `
          <div class="large-quiz-list">
            <div class="large-tile ${state.answers.workMode === 'Buddy' ? 'selected' : ''}" data-cat="workMode" data-val="Buddy">
              <span class="tile-emoji">👥</span>
              <div class="tile-texts">
                <span class="tile-title text-base font-extrabold text-white">Climb with a Buddy</span>
                <span class="tile-desc text-xs text-slate-400">Share prompts and secure colleague checkpoints weekly.</span>
              </div>
            </div>
            <div class="large-tile ${state.answers.workMode === 'Solo' ? 'selected' : ''}" data-cat="workMode" data-val="Solo">
              <span class="tile-emoji">🦅</span>
              <div class="tile-texts">
                <span class="tile-title text-base font-extrabold text-white">Fly Solo</span>
                <span class="tile-desc text-xs text-slate-400">Build personal dashboard workspace tracking loops.</span>
              </div>
            </div>
          </div>
        `;
        setupLargeTileListeners("workMode");
      }
    }

    evalQuizEnable();
  }

  function updateQuizOriPose(levelIndex, step) {
    const avatarDiv = document.getElementById("quizOriAvatar");
    const tipDiv = document.getElementById("quizOriTip");
    if (!avatarDiv || !tipDiv) return;

    let svgStr = "";
    let tipStr = "";

    if (levelIndex === 0) {
      if (step === 0) {
        tipStr = `"Pehle energy, phir climb! First, choose your professional leadership role so design parameters fit your daily pace!"`;
        svgStr = `
<svg viewBox="0 0 100 100" style="width: 100%; height: 100%;">
  <defs>
    <radialGradient id="grad1" cx="45%" cy="35%" r="55%">
      <stop offset="0%" stop-color="#fffbeb" />
      <stop offset="35%" stop-color="#fef08a" />
      <stop offset="85%" stop-color="#facc15" />
      <stop offset="100%" stop-color="#eab308" />
    </radialGradient>
  </defs>
  <!-- Sprout leaves -->
  <path d="M 47,20 Q 37,7 47,3 Q 51,9 48,19 Z" fill="#22c55e" stroke="#15803d" stroke-width="1" />
  <path d="M 51,20 Q 61,7 51,4 Q 47,10 50,19 Z" fill="#4ade80" stroke="#166534" stroke-width="1" />
  
  <!-- Main Fluffy Body -->
  <circle cx="50" cy="51" r="26" fill="url(#grad1)" stroke="#ca8a04" stroke-width="1.5" />
  
  <!-- Cute black frame glasses over eyes -->
  <circle cx="41" cy="46" r="7.5" fill="none" stroke="#1e293b" stroke-width="2" />
  <circle cx="59" cy="46" r="7.5" fill="none" stroke="#1e293b" stroke-width="2" />
  <line x1="48.5" y1="46" x2="51.5" y2="46" stroke="#1e293b" stroke-width="2" />
  
  <!-- Shiny happy eyes inside glasses (Blinking!) -->
  <circle cx="41" cy="46" r="2" fill="#1e293b" class="blink-eye" />
  <circle cx="59" cy="46" r="2" fill="#1e293b" class="blink-eye" />
  
  <!-- Beak -->
  <path d="M 46,50 Q 50,47 54,50 Q 50,56 46,50" fill="#f97316" stroke="#c2410c" stroke-width="1" />
  
  <!-- Blushes -->
  <circle cx="34" cy="54" r="5" fill="#f43f5e" opacity="0.4" />
  <circle cx="66" cy="54" r="5" fill="#f43f5e" opacity="0.4" />
  
  <!-- Wing holding notepad -->
  <path d="M 76,51 C 82,51 86,59 80,59" fill="#fef08a" stroke="#ca8a04" stroke-width="1" />
  <!-- Left wing holding custom cute notepad -->
  <path d="M 24,51 C 18,51 14,59 20,59" fill="#fef08a" stroke="#ca8a04" stroke-width="1" />
  <rect x="12" y="44" width="10" height="13" rx="1.5" fill="#A100FF" stroke="#5e0099" stroke-width="1" />
  <line x1="14" y1="48" x2="20" y2="48" stroke="#fff" stroke-width="1" />
  <line x1="14" y1="51" x2="20" y2="51" stroke="#fff" stroke-width="1" />
  <line x1="14" y1="54" x2="18" y2="54" stroke="#fff" stroke-width="1" />
  
  <!-- Bouncy feet -->
  <ellipse cx="40" cy="77" rx="6" ry="4" fill="#ea580c" />
  <ellipse cx="60" cy="77" rx="6" ry="4" fill="#ea580c" />
</svg>
        `;
      } else {
        tipStr = `"Fascinating! Let's choose your enterprise sector. Custom workflows have unique alignment guidelines!"`;
        svgStr = `
<svg viewBox="0 0 100 100" style="width: 100%; height: 100%;">
  <defs>
    <radialGradient id="grad2" cx="45%" cy="35%" r="55%">
      <stop offset="0%" stop-color="#fffbeb" />
      <stop offset="35%" stop-color="#fef08a" />
      <stop offset="85%" stop-color="#facc15" />
      <stop offset="100%" stop-color="#eab308" />
    </radialGradient>
  </defs>
  <!-- Sprout leaves -->
  <path d="M 47,20 Q 37,7 47,3 Q 51,9 48,19 Z" fill="#22c55e" stroke="#15803d" stroke-width="1" />
  <path d="M 51,20 Q 61,7 51,4 Q 47,10 50,19 Z" fill="#4ade80" stroke="#166534" stroke-width="1" />
  <circle cx="50" cy="51" r="26" fill="url(#grad2)" stroke="#ca8a04" stroke-width="1.5" />
  
  <!-- Gesturing happy eyes looking up-right (Blinking!) -->
  <g transform="translate(1, 0)" class="blink-eye">
    <circle cx="39" cy="44" r="5" fill="#1e293b" />
    <circle cx="57" cy="44" r="5" fill="#1e293b" />
    <circle cx="41" cy="42" r="1.8" fill="#fff" />
    <circle cx="59" cy="42" r="1.8" fill="#fff" />
  </g>
  
  <!-- Rosy cheeks -->
  <circle cx="32" cy="53" r="5" fill="#f43f5e" opacity="0.45" />
  <circle cx="64" cy="53" r="5" fill="#f43f5e" opacity="0.45" />
  
  <path d="M 44,50 Q 50,45 56,50 L 50,57 Z" fill="#f97316" stroke="#c2410c" stroke-width="1" />
  
  <!-- Left wing gesturing up -->
  <path d="M 23,55 Q 15,44 19,40" fill="none" stroke="#ca8a04" stroke-width="4.5" stroke-linecap="round" />
  <path d="M 23,55 Q 15,44 19,40" fill="none" stroke="#fef08a" stroke-width="2.5" stroke-linecap="round" />
  
  <!-- Right wing holding a miniature globe of cyan color -->
  <path d="M 76,51 C 82,51 86,59 80,59" fill="#fef08a" stroke="#ca8a04" stroke-width="1" />
  <circle cx="82" cy="48" r="7" fill="#06b6d4" stroke="#0891b2" stroke-width="1" />
  <path d="M 77,48 Q 82,45 87,48" stroke="#ffffff" stroke-width="1" fill="none" opacity="0.6" />
  <path d="M 82,41 Q 84,48 82,55" stroke="#ffffff" stroke-width="1" fill="none" opacity="0.6" />
  
  <ellipse cx="40" cy="77" rx="6" ry="4" fill="#ea580c" />
  <ellipse cx="60" cy="77" rx="6" ry="4" fill="#ea580c" />
</svg>
        `;
      }
    } else if (levelIndex === 1) {
      tipStr = `"Let's detect your current AI adoption tier! This lets me prepare custom prompt difficulty and governance benchmarks!"`;
      svgStr = `
<svg viewBox="0 0 100 100" style="width: 100%; height: 100%;">
  <defs>
    <radialGradient id="grad3" cx="45%" cy="35%" r="55%">
      <stop offset="0%" stop-color="#fffbeb" />
      <stop offset="35%" stop-color="#fef08a" />
      <stop offset="85%" stop-color="#facc15" />
      <stop offset="100%" stop-color="#eab308" />
    </radialGradient>
  </defs>
  <path d="M 47,20 Q 37,7 47,3 Z" fill="#22c55e" stroke="#15803d" stroke-width="1" />
  <circle cx="50" cy="51" r="26" fill="url(#grad3)" stroke="#ca8a04" stroke-width="1.5" />
  
  <!-- Headlamp strap with glowing light -->
  <rect x="34" y="27" width="32" height="7" rx="2.5" fill="#475569" stroke="#334155" stroke-width="1" />
  <circle cx="50" cy="30" r="5" fill="#A100FF" stroke="#5e0099" stroke-width="1" />
  <polygon points="50,30 35,18 65,18" fill="#fef08a" opacity="0.3" />
  
  <!-- Winking curious eye design (Blinking open eye!) -->
  <g class="blink-eye">
    <circle cx="39" cy="45" r="4.5" fill="#1e293b" />
    <circle cx="40.5" cy="43.5" r="1.5" fill="#fff" />
  </g>
  <path d="M 56,47 Q 61,42 66,47" fill="none" stroke="#1e293b" stroke-width="2.5" stroke-linecap="round" />
  
  <path d="M 45,52 Q 50,48 55,52 L 50,58 Z" fill="#f97316" stroke="#c2410c" stroke-width="1" />
  
  <!-- Left wing holding a magnifying glass -->
  <g transform="translate(18, 48)">
    <path d="M 0,0 C -8,0 -12,12 -6,14 C -2,15 4,8 4,1" fill="#fef08a" stroke="#ca8a04" stroke-width="1" />
    <path d="M -10,12 L -15,18" stroke="#94a3b8" stroke-width="2.5" stroke-linecap="round" />
    <circle cx="-10" cy="12" r="4.5" fill="rgba(161,0,255,0.25)" stroke="#94a3b8" stroke-width="1.5" />
  </g>
  
  <path d="M 76,51 C 82,51 86,59 80,59" fill="#fef08a" stroke="#ca8a04" stroke-width="1" />
  
  <ellipse cx="40" cy="77" rx="6" ry="4" fill="#ea580c" />
  <ellipse cx="60" cy="77" rx="6" ry="4" fill="#ea580c" />
</svg>
      `;
    } else if (levelIndex === 2) {
      tipStr = `" Roadblocks spotted! Select exactly 3 time-drain tasks so we can automate them and reclaim focus!"`;
      svgStr = `
<svg viewBox="0 0 100 100" style="width: 100%; height: 100%;">
  <defs>
    <radialGradient id="grad4" cx="45%" cy="35%" r="55%">
      <stop offset="0%" stop-color="#fffbeb" />
      <stop offset="35%" stop-color="#fef08a" />
      <stop offset="85%" stop-color="#facc15" />
      <stop offset="100%" stop-color="#eab308" />
    </radialGradient>
  </defs>
  <path d="M 47,20 Q 37,7 47,3 Z" fill="#22c55e" stroke="#15803d" stroke-width="1" />
  <circle cx="50" cy="51" r="26" fill="url(#grad4)" stroke="#ca8a04" stroke-width="1.5" />
  
  <!-- High Vis Orange vest over belly -->
  <path d="M 32,60 C 35,74 65,74 68,60 L 62,56 C 60,63 40,63 38,56 Z" fill="#f97316" stroke="#ea580c" stroke-width="1" />
  <path d="M 39,58 L 41,71" stroke="#cbd5e1" stroke-width="2" />
  <path d="M 61,58 L 59,71" stroke="#cbd5e1" stroke-width="2" />
  
  <!-- Protective clear goggles -->
  <rect x="31" y="38" width="38" height="11" rx="4" fill="rgba(161,0,255,0.18)" stroke="#5e0099" stroke-width="1.5" />
  <line x1="50" y1="38" x2="50" y2="49" stroke="#5e0099" stroke-width="1.2" />
  
  <!-- Eyes inside goggles (Blinking!) -->
  <circle cx="41" cy="43.5" r="2.5" fill="#1e293b" class="blink-eye" />
  <circle cx="59" cy="43.5" r="2.5" fill="#1e293b" class="blink-eye" />
  
  <!-- Beak -->
  <path d="M 46,47 Q 50,45 54,47 L 50,53 Z" fill="#f97316" stroke="#c2410c" stroke-width="1" />
  
  <!-- Saluting proud Wing -->
  <path d="M 23,48 Q 12,41 16,36" fill="none" stroke="#ca8a04" stroke-width="4.5" stroke-linecap="round" />
  <path d="M 23,48 Q 12,41 16,36" fill="none" stroke="#fef08a" stroke-width="2.5" stroke-linecap="round" />
  
  <!-- Left wing -->
  <path d="M 76,51 C 82,51 86,59 80,59" fill="#fef08a" stroke="#ca8a04" stroke-width="1" />
  
  <ellipse cx="40" cy="77" rx="6" ry="4" fill="#ea580c" />
  <ellipse cx="60" cy="77" rx="6" ry="4" fill="#ea580c" />
</svg>
      `;
    } else if (levelIndex === 3) {
      if (step === 0) {
        tipStr = `"Almost to the summit, Leader! Choose your primary 30-day objective to channel our strategic directives!"`;
        svgStr = `
<svg viewBox="0 0 100 100" style="width: 100%; height: 100%;">
  <defs>
    <radialGradient id="grad5" cx="45%" cy="35%" r="55%">
      <stop offset="0%" stop-color="#fffbeb" />
      <stop offset="35%" stop-color="#fef08a" />
      <stop offset="85%" stop-color="#facc15" />
      <stop offset="100%" stop-color="#eab308" />
    </radialGradient>
  </defs>
  <circle cx="50" cy="51" r="26" fill="url(#grad5)" stroke="#ca8a04" stroke-width="1.5" />
  
  <!-- Magician hat with stars -->
  <path d="M 30,28 L 50,4 L 70,28 Z" fill="#6b21a8" stroke="#581c87" stroke-width="1.2" />
  <polygon points="46,12 50,5 54,12" fill="#6b21a8" />
  <ellipse cx="50" cy="27" rx="22" ry="4.5" fill="#581c87" />
  <polygon points="50,14 52,18 56,18 53,21 54,25 50,23 46,25 47,21 44,18 48,18" fill="#facc15" />
  
  <!-- Closed laughing eyes -->
  <path d="M 32,46 Q 37,41 42,46" fill="none" stroke="#0f172a" stroke-width="3" stroke-linecap="round" />
  <path d="M 58,46 Q 63,41 68,46" fill="none" stroke="#0f172a" stroke-width="3" stroke-linecap="round" />
  
  <circle cx="34" cy="53" r="5" fill="#f43f5e" opacity="0.45" />
  <circle cx="66" cy="53" r="5" fill="#f43f5e" opacity="0.45" />
  
  <!-- Beak -->
  <path d="M 45,50 Q 50,46 55,50 L 50,57 Z" fill="#f97316" stroke="#c2410c" stroke-width="1" />
  
  <!-- Magic wand in left wing -->
  <g transform="translate(18, 48)">
    <path d="M 0,0 C -8,0 -12,12 -6,14" fill="#fef08a" stroke="#ca8a04" stroke-width="1" />
    <line x1="-8" y1="1" x2="-22" y2="-12" stroke="#451a03" stroke-width="2" stroke-linecap="round" />
    <polygon points="-22,-12 -23,-16 -27,-16 -24,-19 -26,-23 -22,-21 -18,-23 -20,-19 -17,-16 -21,-16" fill="#facc15" />
  </g>
  
  <path d="M 76,51 C 82,51 86,59 80,59" fill="#fef08a" stroke="#ca8a04" stroke-width="1" />
  
  <ellipse cx="40" cy="77" rx="6" ry="4" fill="#ea580c" />
  <ellipse cx="60" cy="77" rx="6" ry="4" fill="#ea580c" />
</svg>
        `;
      } else if (step === 1) {
        tipStr = `"Let's configure target hours saved weekly! Even 5 hours release incredible bandwidth support!"`;
        svgStr = `
<svg viewBox="0 0 100 100" style="width: 100%; height: 100%;">
  <defs>
    <radialGradient id="grad6" cx="45%" cy="35%" r="55%">
      <stop offset="0%" stop-color="#fffbeb" />
      <stop offset="35%" stop-color="#fef08a" />
      <stop offset="85%" stop-color="#facc15" />
      <stop offset="100%" stop-color="#eab308" />
    </radialGradient>
  </defs>
  <path d="M 47,20 Q 37,7 47,3 Z" fill="#22c55e" stroke="#15803d" stroke-width="1" />
  <circle cx="50" cy="51" r="26" fill="url(#grad6)" stroke="#ca8a04" stroke-width="1.5" />
  
  <!-- Headphones arc and ear pads -->
  <path d="M 23,51 A 27,27 0 0,1 77,51" fill="none" stroke="#A100FF" stroke-width="3" />
  <rect x="18" y="44" width="6" height="14" rx="3" fill="#7500C0" stroke="#5e0099" stroke-width="1" />
  <rect x="76" y="44" width="6" height="14" rx="3" fill="#7500C0" stroke="#5e0099" stroke-width="1" />
  
  <!-- Eyes (Blinking!) -->
  <g class="blink-eye">
    <circle cx="41" cy="45" r="4.5" fill="#1e293b" />
    <circle cx="42.5" cy="43.5" r="1.5" fill="#fff" />
  </g>
  <path d="M 56,47 Q 61,42 66,47" fill="none" stroke="#1e293b" stroke-width="2.5" stroke-linecap="round" />
  
  <circle cx="34" cy="53" r="5" fill="#f43f5e" opacity="0.4" />
  <circle cx="66" cy="53" r="5" fill="#f43f5e" opacity="0.4" />
  
  <!-- Beak -->
  <path d="M 45,51 Q 50,47 55,51 L 50,58 Z" fill="#f97316" stroke="#c2410c" stroke-width="1" />
  
  <!-- Red bowtie -->
  <polygon points="46,65 54,65 50,69" fill="#dc2626" />
  <polygon points="46,73 54,73 50,69" fill="#dc2626" />
  <circle cx="50" cy="69" r="2.2" fill="#ef4444" />
  
  <path d="M 24,51 C 18,51 14,59 20,59" fill="#fef08a" stroke="#ca8a04" stroke-width="1" />
  <path d="M 76,51 C 82,51 86,59 80,59" fill="#fef08a" stroke="#ca8a04" stroke-width="1" />
  
  <ellipse cx="40" cy="77" rx="6" ry="4" fill="#ea580c" />
  <ellipse cx="60" cy="77" rx="6" ry="4" fill="#ea580c" />
</svg>
        `;
      } else {
        tipStr = `"Almost complete! Select your Traction Flight Mode to lock in and assemble your official success roadmap!"`;
        svgStr = `
<svg viewBox="0 0 100 100" style="width: 100%; height: 100%;">
  <defs>
    <radialGradient id="grad7" cx="45%" cy="35%" r="55%">
      <stop offset="0%" stop-color="#fffbeb" />
      <stop offset="35%" stop-color="#fef08a" />
      <stop offset="85%" stop-color="#facc15" />
      <stop offset="100%" stop-color="#eab308" />
    </radialGradient>
  </defs>
  <path d="M 47,20 Q 37,7 47,3 Z" fill="#22c55e" stroke="#15803d" stroke-width="1" />
  <circle cx="50" cy="51" r="26" fill="url(#grad7)" stroke="#ca8a04" stroke-width="1.5" />
  
  <!-- Laurel crown on head -->
  <ellipse cx="50" cy="24" rx="14" ry="4.5" fill="none" stroke="#facc15" stroke-width="2.2" />
  <circle cx="36" cy="24" r="2.2" fill="#facc15" />
  <circle cx="64" cy="24" r="2.2" fill="#facc15" />
  <circle cx="50" cy="19.5" r="2" fill="#facc15" />
  
  <!-- Super sparkling happy curved eyes -->
  <path d="M 31,46 Q 36,41 41,46" fill="none" stroke="#0f172a" stroke-width="3.5" stroke-linecap="round" />
  <path d="M 59,46 Q 64,41 69,46" fill="none" stroke="#0f172a" stroke-width="3.5" stroke-linecap="round" />
  
  <circle cx="34" cy="54" r="6" fill="#f43f5e" opacity="0.45" />
  <circle cx="66" cy="54" r="6" fill="#f43f5e" opacity="0.45" />
  
  <path d="M 44,50 Q 50,45 56,50 L 50,59 Z" fill="#f97316" stroke="#c2410c" stroke-width="1" />
  
  <!-- Golden shield on side -->
  <path d="M 74,42 L 85,38 L 90,44 Q 90,56 82,62 Q 74,56 74,44 Z" fill="rgba(161, 0, 255, 0.15)" stroke="#A100FF" stroke-width="1.5" />
  <path d="M 82,39 L 82,61 M 74,48 L 90,48" stroke="#A100FF" stroke-width="1.2" />
  <polygon points="82,41 84,48 82,51 80,48" fill="#A100FF" />
  
  <!-- Left wing cheering -->
  <path d="M 23,48 Q 14,41 18,37" fill="none" stroke="#ca8a04" stroke-width="4.5" stroke-linecap="round" />
  <path d="M 23,48 Q 14,41 18,37" fill="none" stroke="#fef08a" stroke-width="2.5" stroke-linecap="round" />
  
  <ellipse cx="40" cy="77" rx="6" ry="4" fill="#ea580c" />
  <ellipse cx="60" cy="77" rx="6" ry="4" fill="#ea580c" />
</svg>
        `;
      }
    }

    avatarDiv.innerHTML = svgStr;
    tipDiv.textContent = tipStr;
  }

  function setupLargeTileListeners(cat) {
    const tiles = bsQuiz.querySelectorAll(".large-tile");
    tiles.forEach(t => {
      t.onclick = () => {
        soundEngine.init();
        soundEngine.play('collect');
        let val = t.dataset.val;
        if (cat === "maturity") val = parseInt(val);
        state.answers[cat] = val;
        
        tiles.forEach(x => { x.classList.remove("selected"); });
        t.classList.add("selected");
        
        evalQuizEnable();
      };
    });
  }

  function setupLargeChipListeners(cat) {
    const chips = bsQuiz.querySelectorAll(".large-chip-item");
    chips.forEach(c => {
      c.onclick = () => {
        soundEngine.init();
        soundEngine.play('collect');
        let val = c.dataset.val;
        if (cat === "targetHrs") val = parseInt(val);
        state.answers[cat] = val;
        
        chips.forEach(x => { x.classList.remove("selected"); });
        c.classList.add("selected");
        
        evalQuizEnable();
      };
    });
  }

  function setupDrainsListeners() {
    const tiles = bsQuiz.querySelectorAll("#drainsGrid .large-tile");
    if (!state.answers.drains) {
      state.answers.drains = [];
    }
    tiles.forEach(t => {
      t.onclick = () => {
        soundEngine.init();
        soundEngine.play('collect');
        const val = t.dataset.val;
        const index = state.answers.drains.indexOf(val);
        
        if (index > -1) {
          state.answers.drains.splice(index, 1);
          t.classList.remove("selected");
        } else {
          if (state.answers.drains.length >= 3) return;
          state.answers.drains.push(val);
          t.classList.add("selected");
        }
        
        document.getElementById("drainsCountLabel").textContent = `Selected: ${state.answers.drains.length} of 3 required`;
        evalQuizEnable();
      };
    });
  }

  function evalQuizEnable() {
    const btn = document.getElementById("quizProceedBtn");
    const step = state.quizStep || 0;
    let ready = false;
    
    if (state.levelIndex === 0) {
      if (step === 0) {
        ready = !!state.answers.role;
      } else if (step === 1) {
        ready = !!state.answers.realm;
      }
    } else if (state.levelIndex === 1) {
      ready = !!state.answers.maturity;
    } else if (state.levelIndex === 2) {
      ready = (state.answers.drains && state.answers.drains.length === 3);
    } else if (state.levelIndex === 3) {
      if (step === 0) {
        ready = !!state.answers.starPoint;
      } else if (step === 1) {
        ready = !!state.answers.targetHrs;
      } else if (step === 2) {
        ready = !!state.answers.workMode;
      }
    }
    
    btn.disabled = !ready;
  }

  // COMPLETE QUIZ QUIET BOOST CHIPS OR NEXT STEP TRANSITION
  document.getElementById("quizProceedBtn").onclick = () => {
    soundEngine.init();
    
    const step = state.quizStep || 0;
    const totalSteps = getQuizTotalSteps();
    
    if (step < totalSteps - 1) {
      // Advance step inside other screens
      state.quizStep++;
      renderQuizStep();
      soundEngine.play('collect');
    } else {
      // Confirmed last screen! Close quiz sheet, update score
      document.getElementById("bsQuiz").classList.remove("active");
      
      // XP awards
      state.score += 100;
      hudScore.textContent = `${state.score}/1000 XP`;

      // Unlock badge and reveal popup banner
      const l = LEVELS_CONFIG[state.levelIndex];
      document.getElementById("badgeGlyph").textContent = l.badgeGlyph;
      document.getElementById("badgeAnnounce").textContent = `You unlocked: ${l.badge}`;
      
      soundEngine.play('collect');
      showOverlay(panelBadge);
    }
  };

  // ADVANCE NEXT HEIGHT CHASSIS
  document.getElementById("nextLevelActionBtn").onclick = () => {
    soundEngine.init();
    hideOverlay(panelBadge);
    
    if (state.levelIndex < 3) {
      loadLevelIntermission(state.levelIndex + 1);
    } else {
      // Completed Level 4! Trigger final cinema reveal
      hud.style.display = "none";
      timelineBar.style.display = "none";
      startCinematicReveal();
    }
  };

  // CINEMATIC COUNTER REVEAL
  function startCinematicReveal() {
    switchToScreen(scCinematic);
    soundEngine.play('collect');

    let loadBar = 0;
    const barFill = document.getElementById("cinematicBar");
    
    const interval = setInterval(() => {
      loadBar += 4;
      barFill.style.width = `${loadBar}%`;
      if (loadBar >= 100) {
        clearInterval(interval);
        compileAIIdentityReport();
      }
    }, 100);
  }

  // COMPILE RESULTS INTEL ARCHETYPES
  function compileAIIdentityReport() {
    // 1. Process Career Lane
    const r = state.answers.role || "Workforce";
    let laneName = "Frontline Officer";
    let group = "Workforce";
    
    if (r === "Executive") {
      laneName = "Executive Lead";
      group = "Executive";
    } else if (r === "Manager_Senior") {
      laneName = "Senior Manager";
      group = "Manager";
    } else if (r === "Workforce_Senior") {
      laneName = "Senior Practitioner";
      group = "Workforce";
    }

    // 2. Process Maturity
    const mat = state.answers.maturity || 2;
    let maturityName = "Silver Tier";
    let matKey = "Silver";
    
    if (mat <= 2) {
      maturityName = "Bronze Tier";
      matKey = "Bronze";
    } else if (mat >= 5) {
      maturityName = "Gold Tier";
      matKey = "Gold";
    }

    // 3. Archetype Databases
    const DATABASE = {
      "Workforce-Bronze": { name: "The Beginner Believer", tagline: "Cautious but ready. AI is currently new to your toolkit. Six weeks closes that friction." },
      "Workforce-Silver": { name: "The Quiet Practitioner", tagline: "Using AI quietly inside single silos. Six weeks puts you at the team spearhead." },
      "Workforce-Gold": { name: "The Hidden Power User", tagline: "Operating advanced flows in private margins. Six weeks establishes department cascades." },
      "Manager-Bronze": { name: "The Cautious Climber", tagline: "Managing timelines cleanly, but AI remains to-learn. Six weeks secures this authority." },
      "Manager-Silver": { name: "The Curious Steady", tagline: "Evolving steadily. Six weeks elevates you as the primary strategic voice of AI in your squad." },
      "Manager-Gold": { name: "The Pace Setter", tagline: "Accelerated builder. Six weeks formalizes templates to securely standardize operations." },
      "Executive-Bronze": { name: "The Quiet Skeptic", tagline: "Observing AI developments but yet to adopt. Six weeks establishes boardroom metrics." },
      "Executive-Silver": { name: "The Strategic Explorer", tagline: "Understands potential vectors. Six weeks designs personal playgrounds to safe-guard actions." },
      "Executive-Gold": { name: "The AI Ambassador", tagline: "Leading corporate visions. Six weeks deploys complete playbooks for divisional scaling." }
    };

    const archKey = `${group}-${matKey}`;
    const arch = DATABASE[archKey] || DATABASE["Workforce-Silver"];

    // Update holographic screen values
    document.getElementById("resultArchName").textContent = arch.name;
    document.getElementById("resultArchDesc").textContent = arch.tagline;
    document.getElementById("resultRarity").textContent = (matKey === "Gold" ? "LEGENDARY" : matKey === "Silver" ? "EPIC" : "RARE");
    document.getElementById("resultRarity").className = `holo-rarity ${matKey.toLowerCase()}`;

    document.getElementById("resLane").textContent = laneName;
    document.getElementById("resMaturity").textContent = maturityName;
    document.getElementById("resSector").textContent = state.answers.realm || "Services";
    
    const hrs = state.answers.targetHrs || 5;
    document.getElementById("resHours").textContent = `${hrs} Hrs / Wk`;

    // Render badges list
    document.getElementById("resUnlockedBadges").innerHTML = LEVELS_CONFIG.map(l => `<span class="badge-item">${l.badge}</span>`).join("");

    // Render Sages Quotes
    renderAdvisorBoard(group, matKey);

    // Render Week Checklist
    buildInteractiveSuccessTimeline(group, matKey, hrs);

    // Result saved sheets placeholder hook
    saveResultToGoogleSheet({
      userName: state.userName,
      archetype: arch.name,
      lane: laneName,
      maturity: maturityName,
      sector: state.answers.realm,
      hoursSaved: hrs,
      drains: state.answers.drains,
      starGoal: state.answers.starPoint
    });

    switchToScreen(scReveal);
    soundEngine.play('collect');

    // Hover interactive effect for hologram element
    const container = document.getElementById("holoContainer");
    const el = document.getElementById("holoElement");
    
    container.onmousemove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `rotateY(${x / 12}deg) rotateX(${-y / 12}deg)`;
    };
    container.onmouseleave = () => {
      el.style.transform = "rotateY(0) rotateX(0)";
    };
  }

  // RENDER MENTORS
  function renderAdvisorBoard(group, maturity) {
    const globalLeaders = [
      {
        name: "Andrew Ng",
        role: "Founder, DeepLearning.AI & Stanford Adjunct Professor",
        achievement: "Empowered over 8 million learners globally through foundational AI workflows.",
        quote: "Don't jump immediately into complex multi-agentic flows. Master structured prompting and build your daily competence routine first."
      },
      {
        name: "Fei-Fei Li",
        role: "Co-Director, Stanford Human-Centered AI Institute",
        achievement: "Pioneered ImageNet and led major healthcare & ethical AI research systems.",
        quote: "Design your AI tools representing a collaborative dialogue. Keep human perspective and empathy at the core of all automation."
      },
      {
        name: "Satya Nadella",
        role: "CEO of Microsoft",
        achievement: "Scaled commercial Copilot environments to 500 million enterprise accounts.",
        quote: "The value of AI lies solely in temporal compression. Focus on reducing meeting prep overload and automating drafting chokepoints first."
      },
      {
        name: "Demis Hassabis",
        role: "Founder & CEO, Google DeepMind",
        achievement: "Led legendary AlphaFold biochem research and deep multi-agent reinforcement models.",
        quote: "Direct AI to solve the most complex structural bottlenecks of your field rather than just simple search loops."
      },
      {
        name: "Sam Altman",
        role: "CEO of OpenAI",
        achievement: "Catalyzed worldwide consumer adoption of modern conversational GPT networks.",
        quote: "Intelligence is becoming a zero-marginal-cost resource. Build full end-to-end task agents, not just light assistant overlays."
      },
      {
        name: "Jensen Huang",
        role: "CEO of NVIDIA",
        achievement: "Built the high-performance accelerated hardware fabric of the global AI boom.",
        quote: "Adopt state-of-the-art tooling with absolute haste. The ultimate winner is the one who operates the most efficient automated pipeline."
      },
      {
        name: "Sundar Pichai",
        role: "CEO of Alphabet & Google",
        achievement: "Democratized context-grounded mobile search tools and Gemini models internationally.",
        quote: "True helpfulness is the best design pattern. Deploy tools that simplify complex document indexing and save team coordination hours."
      }
    ];

    // Score and select two global leaders dynamically based on user's setup answers!
    const ans = state.answers || {};
    const scores = globalLeaders.map(leader => {
      let score = 0;
      if (leader.name === "Andrew Ng") {
        if (ans.realm === "Education") score += 12;
        if (ans.maturity && parseInt(ans.maturity) <= 3) score += 10;
        if (ans.role && ans.role.includes("Workforce")) score += 6;
      } else if (leader.name === "Fei-Fei Li") {
        if (ans.realm === "Healthcare") score += 15;
        if (ans.realm === "Education") score += 8;
        if (ans.role === "Manager_Senior" || ans.role === "Workforce_Senior") score += 6;
      } else if (leader.name === "Satya Nadella") {
        if (ans.realm === "Banking") score += 15;
        if (ans.role === "Executive") score += 10;
        if (ans.drains && (ans.drains.some(d => d.includes("email") || d.includes("Status") || d.includes("reports")))) score += 8;
      } else if (leader.name === "Demis Hassabis") {
        if (ans.maturity && parseInt(ans.maturity) >= 4) score += 15;
        if (ans.realm === "Technology") score += 10;
        if (ans.role === "Executive") score += 5;
      } else if (leader.name === "Sam Altman") {
        if (ans.realm === "Technology") score += 12;
        if (ans.maturity && parseInt(ans.maturity) >= 3) score += 8;
        if (ans.role && ans.role.includes("Senior")) score += 6;
      } else if (leader.name === "Jensen Huang") {
        if (ans.realm === "Technology") score += 15;
        if (ans.role === "Executive") score += 10;
        if (ans.targetHrs && parseInt(ans.targetHrs) >= 10) score += 8;
      } else if (leader.name === "Sundar Pichai") {
        if (ans.realm === "Other") score += 10;
        if (ans.role === "Executive" || ans.role === "Manager_Senior") score += 8;
        if (ans.drains && (ans.drains.some(d => d.includes("documents") || d.includes("Proposal")))) score += 6;
      }
      return { leader, score };
    });

    // Sort by descending score
    scores.sort((a,b) => b.score - a.score);

    // Pick top 1 supreme global advisor to prevent text-heavy clutter!
    const m = scores[0].leader;

    const parent = document.getElementById("councilRows");
    parent.innerHTML = `
      <div class="council-row" style="display: flex; gap: 12px; align-items: flex-start; margin-top: 6px;">
        <div class="council-avatar" style="width: 36px; height: 36px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #ffffff; font-weight: 950; font-size: 14px; flex-shrink: 0; box-shadow: 0 0 10px rgba(16,185,129,0.3); font-family: 'Space Grotesk', sans-serif;">
          ${m.name[0]}
        </div>
        <div class="council-info" style="flex: 1; min-width: 0; text-align: left;">
          <h5 style="font-size: 13px; font-weight: 900; color: #ffffff; margin: 0; display: flex; align-items: center; gap: 6px;">
            ${m.name}
            <span style="font-size: 8px; font-weight: 900; letter-spacing: 0.8px; color: #34d399; border: 1.5px solid rgba(52,211,153,0.3); padding: 1px 5px; border-radius: 4px; background: rgba(52,211,153,0.06); text-transform: uppercase;">Top Board Advisor</span>
          </h5>
          <p style="font-size: 10px; font-weight: 700; color: #94a3b8; margin: 2px 0 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${m.role}</p>
          <div class="council-quote" style="font-size: 11px; font-weight: 700; font-style: italic; color: #e2e8f0; line-height: 1.45; padding-left: 10px; border-left: 2px solid #10b981; margin: 6px 0 0;">"${m.quote}"</div>
        </div>
      </div>
    `;
  }

  // BUILD 30-DAY SUCCESS TIMELINE (CALENDAR FOCUS)
  function buildInteractiveSuccessTimeline(group, maturity, hrs) {
    const burns = state.answers.drains && state.answers.drains.length === 3 ? state.answers.drains : ["Manual Drafting", "Inbox Emails", "Data Alignment"];
    const starGoalVal = state.answers.starPoint || "Save 5+ hours weekly";

    document.getElementById("bpLevelTitle").textContent = `30-Day Executive AI Wall Calendar: ${maturity} Track`;

    let ritualText = "Ritual: Open an AI window daily. Spend 10 minutes prompt-crafting a simple reporting task.";
    if (maturity === "Silver") ritualText = "Ritual: Run custom saved instructions templates daily to quickly draft recurring mails.";
    if (maturity === "Gold") ritualText = "Ritual: Leverage prompt pipelines or local macros to automate sheet formatting.";

    let proofText = "Proof Deliverable: A side-by-side time efficiency matrix demonstrating 5 saved weekly hours.";
    if (group === "Manager") proofText = "Proof Deliverable: A published Operational AI playbook checklist with 5 shared core templates.";
    if (group === "Executive") proofText = "Proof Deliverable: A division AI audit deck and department feasibility proposal pitch.";

    // Action-based 30-day mini-tasks dynamically personalized around they options and level
    const dayTasks = [
      // Week 1: Pipeline Activation (Days 1 - 7)
      `Audit current manual flows for handling <b>${burns[0]}</b>.`,
      `Log exact total minutes lost on raw <b>${burns[0]}</b>.`,
      `Identify the top 3 friction chokepoints in <b>${burns[0]}</b>.`,
      `Draft a primary system instruction prompt to solve <b>${burns[0]}</b>.`,
      `Sandbox & test prompt variations in a secure AI playground.`,
      `Refine safety bounds to prevent unapproved proprietary data leak.`,
      `Store Week 1 completed system instruction guidelines in your archive.`,

      // Week 2: Latency & Friction Minimization (Days 8 - 14)
      `Analyze manual communication latency associated with <b>${burns[1]}</b>.`,
      `Create modular pre-draft structures for recurring communications.`,
      `Integrate prompt pilot assistant into your active daily routine.`,
      `Pre-draft 5 high-importance messages with your generative helper.`,
      `Calibrate system instructions to stabilize tone and stylistic format.`,
      `Measure saved weekly time metrics on <b>${burns[1]}</b> tasks.`,
      `Publish the Latency Pilot guideline standard to your bookmark logs.`,

      // Week 3: Corporate Policy Alignment (Days 15 - 21)
      `Review company specific regulations and GDPR privacy limits.`,
      `Establish local standards regarding local vs cloud model queries.`,
      `Scrub client fields, names, or intellectual data from draft logs.`,
      `Audit secondary team automation apps for unapproved model logins.`,
      `Verify 'Zero-Leak' parameters on your active saved guidelines.`,
      `Demonstrate compliance standards by acing custom quiz practices.`,
      `Publish standardized team safety compliance checklist to your workspace.`,

      // Week 4: Executive Roadmap Scale (Days 22 - 28)
      `Review output accuracy score against your primary target metrics.`,
      `Set folder/shortcut configurations to quickly access template cards.`,
      `Run cross-team prompt trials to validate scalable employee speed.`,
      `Audit performance metrics aligning with key objective: <b>${starGoalVal}</b>.`,
      `Compile concrete time-saving scorecards over 4 target weeks.`,
      `Distribute quick-reference cheat sheets to local onboarding routes.`,
      `Catalog and index final approved department prompt libraries.`,

      // Week 5 (Climactic Habits & Final Deliverable Validation)
      `Habit Trigger: ${ritualText.replace('Ritual: ', '')}`,
      `Milestone Delivery: ${proofText.replace('Proof Deliverable: ', '')}`
    ];

    const weeks = [
      {
        num: 1,
        title: "Week 1: Pipeline Activation",
        focus: `Audit workflows and establish system templates to automate raw <b>${burns[0]}</b> loopholes.`,
        days: [1, 2, 3, 4, 5, 6, 7]
      },
      {
        num: 2,
        title: "Week 2: Latency & Friction Minimization",
        focus: `Deploy generative pilots and modular presets to automate and optimize <b>${burns[1]}</b>.`,
        days: [8, 9, 10, 11, 12, 13, 14]
      },
      {
        num: 3,
        title: "Week 3: Corporate Policy Alignment",
        focus: `Secure data privacy rules. Establish secure guidelines to protect critical organizational information.`,
        days: [15, 16, 17, 18, 19, 20, 21]
      },
      {
        num: 4,
        title: "Week 4: Executive Roadmap Scale",
        focus: `Govern team-wide benchmarks and templates to validate strategic intent: <b>${starGoalVal}</b>.`,
        days: [22, 23, 24, 25, 26, 27, 28]
      },
      {
        num: 5,
        title: "Day 29 & 30: Climactic Habits & Governance Validation",
        focus: `Lock down a sustainable daily ritual time-reclaim and validate final deliverables.`,
        days: [29, 30]
      }
    ];

    let plannerHtml = `<div class="calendar-container">`;

    weeks.forEach(w => {
      plannerHtml += `
        <div class="week-row-block">
          <div class="week-header">
            <h4 class="week-title" style="font-family: 'Space Grotesk', sans-serif;">${w.title}</h4>
            <p class="week-focus">${w.focus}</p>
          </div>
          <div class="calendar-grid">
      `;

      w.days.forEach(day => {
        const taskText = dayTasks[day - 1];
        const isHighlight = day === 29 || day === 30;
        
        let colorAccent = "var(--sky-glow)";
        if (day === 29) colorAccent = "var(--gold)";
        if (day === 30) colorAccent = "var(--emerald)";
        if (day >= 8 && day <= 14) colorAccent = "var(--gold)";
        if (day >= 15 && day <= 21) colorAccent = "#d84cff";
        if (day >= 22 && day <= 28) colorAccent = "#A100FF";

        const cardStyle = isHighlight 
          ? `border: 1.5px solid ${colorAccent}; background: rgba(255,255,255,0.01); box-shadow: 0 0 10px rgba(16,185,129,0.03);` 
          : `border-left: 3px solid ${colorAccent};`;

        plannerHtml += `
          <div class="calendar-day-card bp-item" onclick="toggleWeekTaskCheck(this)" style="${cardStyle}">
            <div class="day-badge">
              <span style="color: ${colorAccent}; font-family: 'Space Grotesk', sans-serif; font-size: 8px; font-weight: 900; letter-spacing: 0.5px;">DAY ${day < 10 ? '0' + day : day}</span>
              <div class="day-chk"></div>
            </div>
            <p class="day-task-text" style="margin-top: 2px;">${taskText}</p>
          </div>
        `;
      });

      plannerHtml += `
          </div>
        </div>
      `;
    });

    plannerHtml += `</div>`;

    document.getElementById("bpWeeksWrapper").innerHTML = plannerHtml;

    // Reset progress text
    document.getElementById("bpCheckProgress").textContent = "0% Complete";

    // Update Outcome calculations
    const yearlyHours = hrs * 52;
    document.getElementById("bpReclTitle").textContent = `${yearlyHours} Hours Saved / Year!`;
    document.getElementById("bpReclSub").innerHTML = `Targeting saving of <b>${hrs} hours weekly</b> on timewastes. This reclaims <b>${yearlyHours} hours annually</b> to invest in strategic department priorities.`;
  }

  function toggleWeekTaskCheck(el) {
    el.classList.toggle("checked");
    soundEngine.play('jump');

    // Calculate total completed tasks
    const items = document.querySelectorAll(".bp-item");
    const checks = document.querySelectorAll(".bp-item.checked");
    const pct = Math.round((checks.length / items.length) * 100);
    document.getElementById("bpCheckProgress").textContent = `${pct}% Complete`;
  }

  // COPY OUTCOMES TO CLIPBOARD
  function copyResultsToClip() {
    const valMap = `
=== My AI Quest Strategic Roadmap Report ===
Climber/Delegate: ${state.userName}
Executive Role: ${document.getElementById("resLane").textContent}
AI Maturity Rating: ${document.getElementById("resMaturity").textContent}
Organizational Sector: ${document.getElementById("resSector").textContent}
Primary AI Objective: ${state.answers.starPoint}
Target Resource Speedup: ${document.getElementById("resHours").textContent}
Estimated Strategic Dividend: ${document.getElementById("bpReclTitle").textContent}
    `;

    navigator.clipboard.writeText(valMap.trim()).then(() => {
      alert("AI Quest results successfully copied! 📋");
    }).catch(err => {
      // Direct alert backup if blocked
      alert(`AI Quest results:\n${valMap.trim()}`);
    });
  }

  // COHORT EMAIL STRATEGIC BOOKING FLOW
  function handleReserveCohort() {
    soundEngine.play('collect');

    const userName = state.userName || "Strategic Delegate";
    const userRole = document.getElementById("resLane") ? document.getElementById("resLane").textContent : "Management";
    const userMaturity = document.getElementById("resMaturity") ? document.getElementById("resMaturity").textContent : "Silver";
    const userSector = document.getElementById("resSector") ? document.getElementById("resSector").textContent : "Strategy & Development";
    const savedHours = document.getElementById("bpReclTitle") ? document.getElementById("bpReclTitle").textContent : "260 Hours Saved";
    const primaryGoal = state.answers.starPoint || "Accelerate weekly task execution";

    const subjectText = `My AI-Quest Cohort Reservation [${userName}]`;
    const bodyText = `Dear Usman,

I have successfully completed the 30-Day Strategic AI-Quest Ascent. Please reserve a seat for me in the upcoming executive cohort to review and align this roadmap!

--- MY AI-QUEST ASCENT ROADMAP DETAILS ---
Delegate Name: ${userName}
Executive Role: ${userRole}
Baseline AI Maturity: ${userMaturity}
Organizational Sector: ${userSector}
Primary AI Objective: ${primaryGoal}
Annual Strategic Dividend: ${savedHours}

Let me know the confirmation status and next onboarding session slot details.

Best regards,
${userName}`;

    // Populate preview textarea
    const preview = document.getElementById("cohortEmailBodyPreview");
    if (preview) {
      preview.value = bodyText;
    }

    // Configure Mailto link
    const mailtoUrl = `mailto:usman@thinkfrst.com?subject=${encodeURIComponent(subjectText)}&body=${encodeURIComponent(bodyText)}`;
    const mailtoLink = document.getElementById("cohortMailtoLink");
    if (mailtoLink) {
      mailtoLink.href = mailtoUrl;
    }

    // Configure copy handler
    const copyBtn = document.getElementById("cohortCopyBtn");
    if (copyBtn) {
      copyBtn.onclick = () => {
        soundEngine.play('collect');
        navigator.clipboard.writeText(bodyText).then(() => {
          const origText = copyBtn.innerHTML;
          copyBtn.innerHTML = "<span>✅</span> Body Copied!";
          copyBtn.style.borderColor = "var(--emerald)";
          copyBtn.style.color = "var(--emerald)";
          setTimeout(() => {
            copyBtn.innerHTML = origText;
            copyBtn.style.borderColor = "#A100FF";
            copyBtn.style.color = "#A100FF";
          }, 2000);
        }).catch(err => {
          // Fallback selection in case iframe sandbox restrictions block modern clipboard APIs
          try {
            preview.select();
            document.execCommand('copy');
            const origText = copyBtn.innerHTML;
            copyBtn.innerHTML = "<span>✅</span> Selected & Copied!";
            setTimeout(() => {
              copyBtn.innerHTML = origText;
            }, 2000);
          } catch(err2) {
            alert("Please copy the text manually from the container!");
          }
        });
      };
    }

    // Configure Dismiss Button
    const dismissBtn = document.getElementById("cohortDismissBtn");
    const panel = document.getElementById("panelCohortSuccess");
    if (dismissBtn && panel) {
      dismissBtn.onclick = () => {
        soundEngine.play('click');
        panel.style.display = "none";
      };
    }

    // Show the modal elegantly
    if (panel) {
      panel.style.display = "flex";
    }

    // Attempt native pop trigger to draft mail in mail client directly
    try {
      const tempLink = document.createElement("a");
      tempLink.href = mailtoUrl;
      tempLink.target = "_blank";
      tempLink.click();
    } catch(e) {
      console.warn("Direct mail client opening restricted by sandbox constraints, fallback to interactive copy modal.", e);
    }
  }

  // GOOGLE BLUEPRINT PERSISTENCE SAVING HANDLER
  const GOOGLE_SCRIPT_URL = "";

  function saveResultToGoogleSheet(data) {
    if (!GOOGLE_SCRIPT_URL) return;
    fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    }).catch(err => console.warn("Persistence saved offline:", err));
  }
