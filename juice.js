// ACED Juice Layer — sound, screen-shake, streaks, crits, share, daily.
// Drop-in module, exposes window.ACEDJuice.
(function(){
  'use strict';

  // ============================================================
  // WEB AUDIO — chiptune SFX synth (no external assets)
  // ============================================================
  let _ctx = null;
  let _masterVol = 0.35;
  let _muted = false;
  function ac(){
    if(_muted) return null;
    if(!_ctx){
      try { _ctx = new (window.AudioContext||window.webkitAudioContext)(); }
      catch(e){ return null; }
    }
    if(_ctx.state === 'suspended') _ctx.resume();
    return _ctx;
  }
  function setMuted(v){ _muted = !!v; try{ localStorage.setItem('aced_muted', _muted?'1':'0'); }catch(e){} }
  function isMuted(){ return _muted; }
  try { _muted = localStorage.getItem('aced_muted')==='1'; } catch(e){}

  function tone(freq, dur, type='square', vol=0.2, attack=0.005, release=0.05){
    const c = ac(); if(!c) return;
    const t0 = c.currentTime;
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t0);
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(vol*_masterVol, t0+attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t0+dur);
    o.connect(g); g.connect(c.destination);
    o.start(t0); o.stop(t0+dur+release);
  }
  function sweep(f1, f2, dur, type='sawtooth', vol=0.18){
    const c = ac(); if(!c) return;
    const t0 = c.currentTime;
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = type;
    o.frequency.setValueAtTime(f1, t0);
    o.frequency.exponentialRampToValueAtTime(Math.max(20,f2), t0+dur);
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(vol*_masterVol, t0+0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t0+dur);
    o.connect(g); g.connect(c.destination);
    o.start(t0); o.stop(t0+dur+0.05);
  }
  function noise(dur, vol=0.15, hp=1000){
    const c = ac(); if(!c) return;
    const t0 = c.currentTime;
    const buf = c.createBuffer(1, Math.floor(c.sampleRate*dur), c.sampleRate);
    const data = buf.getChannelData(0);
    for(let i=0;i<data.length;i++) data[i] = (Math.random()*2-1) * (1 - i/data.length);
    const src = c.createBufferSource(); src.buffer = buf;
    const filt = c.createBiquadFilter(); filt.type='highpass'; filt.frequency.value=hp;
    const g = c.createGain(); g.gain.value = vol*_masterVol;
    src.connect(filt); filt.connect(g); g.connect(c.destination);
    src.start(t0); src.stop(t0+dur+0.05);
  }

  // High-level SFX
  const sfx = {
    select(){ tone(880, 0.05, 'square', 0.10); },
    deselect(){ tone(440, 0.04, 'square', 0.08); },
    correct(){ tone(660, 0.08, 'square', 0.22); setTimeout(()=>tone(990, 0.10, 'square', 0.20), 70); },
    wrong(){ sweep(220, 80, 0.35, 'sawtooth', 0.22); noise(0.18, 0.10, 600); },
    strike(){ sweep(180, 50, 0.5, 'square', 0.28); noise(0.30, 0.18, 400); },
    chips(n=0){
      const base = 600 + Math.min(800, n*4);
      tone(base, 0.05, 'triangle', 0.16);
      setTimeout(()=>tone(base*1.5, 0.05, 'triangle', 0.14), 35);
    },
    mult(n=0){
      tone(880 + n*20, 0.06, 'sawtooth', 0.18);
      setTimeout(()=>tone(1320 + n*30, 0.08, 'sawtooth', 0.16), 50);
    },
    crit(){
      // Big multi-step ascending fanfare
      const notes = [523, 659, 784, 988, 1319];
      notes.forEach((f,i)=>setTimeout(()=>tone(f, 0.10, 'square', 0.22), i*55));
      setTimeout(()=>noise(0.20, 0.12, 2000), 100);
    },
    streak(level){
      // level 1..5 = bigger fanfare
      const base = 440 * Math.pow(1.5, level);
      tone(base, 0.08, 'square', 0.20);
      setTimeout(()=>tone(base*1.25, 0.08, 'square', 0.20), 80);
      setTimeout(()=>tone(base*1.5, 0.12, 'square', 0.22), 160);
      if(level>=3) setTimeout(()=>tone(base*2, 0.15, 'square', 0.22), 240);
    },
    handPlay(){ sweep(200, 800, 0.18, 'square', 0.16); },
    cashIn(){
      const seq = [523,659,784,1047,1319];
      seq.forEach((f,i)=>setTimeout(()=>tone(f, 0.09, 'triangle', 0.22), i*70));
    },
    bossDefeat(){
      sweep(80, 400, 0.6, 'sawtooth', 0.30);
      setTimeout(()=>{
        const seq = [523,659,784,1047,1319,1568,2093];
        seq.forEach((f,i)=>setTimeout(()=>tone(f, 0.11, 'square', 0.24), i*60));
      }, 200);
      setTimeout(()=>noise(0.5, 0.16, 1500), 100);
    },
    bossStart(){
      // ominous drone
      sweep(440, 110, 0.7, 'sawtooth', 0.22);
      setTimeout(()=>sweep(110, 55, 0.5, 'sawtooth', 0.18), 200);
    },
    advisorBuy(){ tone(660, 0.10, 'triangle', 0.20); setTimeout(()=>tone(990, 0.12, 'triangle', 0.20), 80); },
    runOver(){
      sweep(440, 55, 1.2, 'sawtooth', 0.28);
      setTimeout(()=>noise(0.6, 0.18, 200), 200);
    },
    achievement(){
      const seq = [784,988,1319,1568];
      seq.forEach((f,i)=>setTimeout(()=>tone(f, 0.12, 'triangle', 0.24), i*90));
    },
    click(){ tone(440, 0.02, 'square', 0.06); },
    hover(){ tone(1320, 0.015, 'square', 0.04); },
  };

  // ============================================================
  // SCREEN SHAKE
  // ============================================================
  let _shakeT = 0, _shakeMag = 0, _shakeRaf = 0;
  function shake(magnitude=8, dur=300){
    _shakeMag = Math.max(_shakeMag, magnitude);
    _shakeT = Math.max(_shakeT, dur);
    if(!_shakeRaf){
      const start = performance.now();
      const tick = (now)=>{
        const dt = now - start;
        if(dt >= _shakeT){
          document.body.style.transform = '';
          _shakeRaf = 0; _shakeT = 0; _shakeMag = 0;
          return;
        }
        const decay = 1 - dt/_shakeT;
        const m = _shakeMag * decay;
        const dx = (Math.random()*2-1) * m;
        const dy = (Math.random()*2-1) * m;
        document.body.style.transform = `translate(${dx.toFixed(2)}px,${dy.toFixed(2)}px)`;
        _shakeRaf = requestAnimationFrame(tick);
      };
      _shakeRaf = requestAnimationFrame(tick);
    }
  }

  // ============================================================
  // FLASH (full-screen color burst)
  // ============================================================
  function flash(color='#fff', dur=200, opacity=0.4){
    let el = document.getElementById('aced-flash-layer');
    if(!el){
      el = document.createElement('div');
      el.id = 'aced-flash-layer';
      el.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:300;mix-blend-mode:screen;opacity:0;transition:opacity 80ms';
      document.body.appendChild(el);
    }
    el.style.background = color;
    el.style.opacity = String(opacity);
    setTimeout(()=>{ el.style.opacity = '0'; }, 50);
  }

  // ============================================================
  // CRIT POPUP (big floating number)
  // ============================================================
  function critPop(text, x, y, color='#ffd23f'){
    let layer = document.getElementById('aced-crit-layer');
    if(!layer){
      layer = document.createElement('div');
      layer.id = 'aced-crit-layer';
      layer.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:250;overflow:hidden';
      document.body.appendChild(layer);
    }
    const el = document.createElement('div');
    el.textContent = text;
    el.style.cssText = `position:absolute;left:${x}px;top:${y}px;
      font-family:'Press Start 2P',monospace;font-size:40px;color:${color};
      text-shadow:0 0 16px ${color},0 0 32px ${color};
      transform:translate(-50%,-50%) scale(0.4);opacity:0;
      transition:transform 600ms cubic-bezier(.18,.89,.32,1.28), opacity 600ms;
      letter-spacing:2px;font-weight:bold;will-change:transform,opacity`;
    layer.appendChild(el);
    requestAnimationFrame(()=>{
      el.style.transform = 'translate(-50%,-50%) scale(1.4)';
      el.style.opacity = '1';
    });
    setTimeout(()=>{
      el.style.transition = 'transform 400ms ease-in, opacity 400ms';
      el.style.transform = 'translate(-50%,-150%) scale(1.0)';
      el.style.opacity = '0';
    }, 500);
    setTimeout(()=>el.remove(), 1000);
  }

  // ============================================================
  // CONFETTI / PARTICLES
  // ============================================================
  function particles(x, y, opts={}){
    const count = opts.count || 24;
    const colors = opts.colors || ['#ffd23f','#22ff66','#5cffea','#ff5cb8','#ff3838'];
    let layer = document.getElementById('aced-particle-layer');
    if(!layer){
      layer = document.createElement('div');
      layer.id = 'aced-particle-layer';
      layer.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:240;overflow:hidden';
      document.body.appendChild(layer);
    }
    for(let i=0;i<count;i++){
      const p = document.createElement('div');
      const c = colors[Math.floor(Math.random()*colors.length)];
      const angle = Math.random()*Math.PI*2;
      const speed = 200 + Math.random()*400;
      const dx = Math.cos(angle)*speed;
      const dy = Math.sin(angle)*speed - 100;
      const size = 4 + Math.random()*6;
      p.style.cssText = `position:absolute;left:${x}px;top:${y}px;
        width:${size}px;height:${size}px;background:${c};
        box-shadow:0 0 6px ${c};
        transform:translate(-50%,-50%);
        transition:transform 1000ms cubic-bezier(.2,.6,.4,1),opacity 1000ms;
        will-change:transform,opacity`;
      layer.appendChild(p);
      requestAnimationFrame(()=>{
        p.style.transform = `translate(${dx-size/2}px,${dy+300}px) rotate(${Math.random()*720}deg)`;
        p.style.opacity = '0';
      });
      setTimeout(()=>p.remove(), 1050);
    }
  }

  // ============================================================
  // STREAK TRACKER — combos of consecutive correct answers
  // Drives meta-multiplier and dopamine
  // ============================================================
  const streak = {
    count: 0,
    best: 0,
    onCorrect(){
      streak.count++;
      streak.best = Math.max(streak.best, streak.count);
      try { localStorage.setItem('aced_best_streak', String(streak.best)); } catch(e){}
      const tier = streak.tier();
      const el = document.getElementById('streak-counter');
      if(el){
        el.textContent = streak.count;
        el.classList.remove('pulse','tier1','tier2','tier3','tier4','tier5');
        el.classList.add('pulse','tier'+tier);
        setTimeout(()=>el.classList.remove('pulse'), 400);
      }
      // Milestone effects
      const milestones = [5,10,15,25,50,100];
      if(milestones.includes(streak.count)){
        const labels = {5:'HEATING UP',10:'ON FIRE',15:'UNSTOPPABLE',25:'GODLIKE',50:'LEGENDARY',100:'PERFECT MIND'};
        const level = milestones.indexOf(streak.count)+1;
        sfx.streak(level);
        critPop(labels[streak.count]+' x'+streak.count, window.innerWidth/2, window.innerHeight*0.35,
          ['#22ff66','#ffb627','#ff5cb8','#ff3838','#a855f7','#ffd23f'][level-1]);
        particles(window.innerWidth/2, window.innerHeight*0.35, {count: 30 + level*10});
        flash(['#22ff66','#ffb627','#ff5cb8','#ff3838','#a855f7','#ffd23f'][level-1], 200, 0.3);
        shake(6 + level*2, 250 + level*50);
      }
    },
    onWrong(){
      if(streak.count >= 5){
        // visible "streak broken" feedback
        critPop('STREAK BROKEN', window.innerWidth/2, window.innerHeight*0.4, '#ff3838');
        flash('#ff3838', 200, 0.25);
      }
      streak.count = 0;
      const el = document.getElementById('streak-counter');
      if(el){ el.textContent = '0'; el.classList.remove('tier1','tier2','tier3','tier4','tier5'); }
    },
    reset(){
      streak.count = 0;
      const el = document.getElementById('streak-counter');
      if(el){ el.textContent = '0'; el.classList.remove('tier1','tier2','tier3','tier4','tier5'); }
    },
    tier(){
      if(streak.count >= 50) return 5;
      if(streak.count >= 25) return 4;
      if(streak.count >= 15) return 3;
      if(streak.count >= 10) return 2;
      if(streak.count >= 5)  return 1;
      return 0;
    },
    multiplier(){
      // Streak bonus multiplier applied to mult at end of hand
      const t = streak.tier();
      return [1, 1.25, 1.5, 2, 3, 5][t];
    },
  };
  try { streak.best = parseInt(localStorage.getItem('aced_best_streak')||'0',10) || 0; } catch(e){}

  // ============================================================
  // ACHIEVEMENTS
  // ============================================================
  const ACHIEVEMENTS = [
    { id:'first_run', name:'FIRST CONTACT', desc:'Start your first run.' },
    { id:'first_blind', name:'WARMING UP', desc:'Defeat your first blind.' },
    { id:'first_boss', name:'BOSS HUNTER', desc:'Defeat your first boss.' },
    { id:'streak_5', name:'HEATING UP', desc:'5 correct answers in a row.' },
    { id:'streak_10', name:'ON FIRE', desc:'10 in a row.' },
    { id:'streak_25', name:'GODLIKE', desc:'25 in a row.' },
    { id:'streak_50', name:'LEGENDARY', desc:'50 in a row.' },
    { id:'streak_100', name:'PERFECT MIND', desc:'100 in a row.' },
    { id:'flush', name:'SUITS YOU', desc:'Score a Flush.' },
    { id:'fullhouse', name:'FULL HOUSE', desc:'Score a Full House.' },
    { id:'four', name:'QUARTET', desc:'Score Four of a Kind.' },
    { id:'five', name:'FIVE OF A KIND', desc:'Score Five of a Kind.' },
    { id:'no_miss_blind', name:'FLAWLESS', desc:'Beat a blind with zero wrong answers.' },
    { id:'survivor', name:'SURVIVOR', desc:'Win a run with 1 strike remaining.' },
    { id:'ante_3', name:'JUNIOR', desc:'Reach Ante 3.' },
    { id:'ante_5', name:'SENIOR', desc:'Reach Ante 5.' },
    { id:'ante_8', name:'PARTNER', desc:'Reach Ante 8.' },
    { id:'win', name:'CPA', desc:'Complete a full run (8 antes).' },
    { id:'six_advisors', name:'CABINET', desc:'Own 6 advisors at once.' },
    { id:'rare_advisor', name:'PRESTIGE PICK', desc:'Buy a rare advisor.' },
    { id:'daily', name:'DAILY GRIND', desc:'Complete a Daily Challenge.' },
  ];
  function unlocked(){
    try { return JSON.parse(localStorage.getItem('aced_achievements')||'{}'); } catch(e){ return {}; }
  }
  function unlock(id){
    const u = unlocked();
    if(u[id]) return false;
    u[id] = Date.now();
    try { localStorage.setItem('aced_achievements', JSON.stringify(u)); } catch(e){}
    const ach = ACHIEVEMENTS.find(a=>a.id===id);
    if(ach){
      sfx.achievement();
      showToast('🏆 '+ach.name+' — '+ach.desc, 'gold');
      critPop('ACHIEVEMENT', window.innerWidth/2, window.innerHeight*0.2, '#ffd23f');
      particles(window.innerWidth/2, window.innerHeight*0.2, {count:40});
    }
    return true;
  }

  // ============================================================
  // META PROGRESSION — XP & profile
  // ============================================================
  function getProfile(){
    try { return JSON.parse(localStorage.getItem('aced_profile')||'{"xp":0,"runs":0,"wins":0,"totalAnswered":0,"totalCorrect":0}'); }
    catch(e){ return {xp:0,runs:0,wins:0,totalAnswered:0,totalCorrect:0}; }
  }
  function saveProfile(p){
    try { localStorage.setItem('aced_profile', JSON.stringify(p)); } catch(e){}
  }
  function addXP(amount, reason){
    const p = getProfile();
    const before = p.xp;
    p.xp += amount;
    saveProfile(p);
    const lvlBefore = level(before);
    const lvlAfter = level(p.xp);
    if(lvlAfter > lvlBefore){
      sfx.streak(3);
      critPop('LEVEL '+lvlAfter, window.innerWidth/2, window.innerHeight*0.3, '#5cffea');
      particles(window.innerWidth/2, window.innerHeight*0.3, {count:50});
      flash('#5cffea', 200, 0.3);
    }
  }
  function level(xp){
    // 100 XP → lvl 2, 250 → 3, 500 → 4, 1000 → 5, ...
    return Math.floor(Math.log2((xp/100)+1)) + 1;
  }
  function xpToNext(xp){
    const lvl = level(xp);
    const next = (Math.pow(2, lvl) - 1) * 100;
    return next - xp;
  }

  // ============================================================
  // DAILY CHALLENGE — date-seeded run
  // ============================================================
  function dateSeed(d=new Date()){
    const s = d.getFullYear()*10000 + (d.getMonth()+1)*100 + d.getDate();
    return s;
  }
  function dailyStatus(){
    const today = dateSeed();
    let dd;
    try { dd = JSON.parse(localStorage.getItem('aced_daily')||'{}'); }
    catch(e){ dd = {}; }
    return {
      seed: today,
      completed: dd.last === today,
      score: dd.last === today ? dd.score : 0,
      streak: dd.streak || 0,
      lastDate: dd.last || 0,
    };
  }
  function completeDaily(score){
    const today = dateSeed();
    let dd;
    try { dd = JSON.parse(localStorage.getItem('aced_daily')||'{}'); }
    catch(e){ dd = {}; }
    const yesterday = dateSeed(new Date(Date.now()-86400000));
    const newStreak = (dd.last === yesterday) ? (dd.streak||0)+1 : 1;
    dd = { last: today, score, streak: newStreak };
    try { localStorage.setItem('aced_daily', JSON.stringify(dd)); } catch(e){}
    unlock('daily');
    return newStreak;
  }

  // ============================================================
  // TOAST (re-export, polished)
  // ============================================================
  function showToast(text, kind){
    const layer = document.getElementById('toast-layer');
    if(!layer) return;
    const el = document.createElement('div');
    el.className = 'toast'+(kind?' '+kind:'');
    el.textContent = text;
    layer.appendChild(el);
    setTimeout(()=>el.remove(), 3200);
  }

  // ============================================================
  // SHARE RESULT
  // ============================================================
  function shareText(run, victory){
    const lines = [];
    lines.push(victory ? '🏆 ACED — CPA Roguelike — Victory!' : '💀 ACED — CPA Roguelike — Run Over');
    lines.push(`Ante ${run.ante} • Strikes ${run.strikes}/${run.maxStrikes}`);
    lines.push(`Best Streak: ${streak.best}`);
    lines.push(`Try it: aced.cpa`); // placeholder
    return lines.join('\n');
  }

  // ============================================================
  // EXPORT
  // ============================================================
  window.ACEDJuice = {
    sfx, shake, flash, critPop, particles,
    streak, unlock, unlocked, ACHIEVEMENTS,
    getProfile, saveProfile, addXP, level, xpToNext,
    dailyStatus, completeDaily, dateSeed,
    shareText, showToast,
    setMuted, isMuted,
  };
})();
