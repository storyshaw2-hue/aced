// ACED extras — Witty Toast, Side Panel (Codex/Daily/Bosses/Leaderboard), Daily Pulse runner
'use strict';

function showWittyToast(message, patternLabel) {
  const layer = document.getElementById('toast-layer');
  if (!layer) return;
  const el = document.createElement('div');
  el.className = 'toast witty' + (patternLabel ? ' tagged' : '');
  el.innerHTML = (patternLabel ? '<div style="color:#ff4b9b;font-size:10px;letter-spacing:1px;margin-bottom:4px;font-weight:bold">⚠ ' + patternLabel + '</div>' : '') +
                 '<div>' + message + '</div>';
  el.style.cssText = 'max-width:480px;background:linear-gradient(135deg,#1a0f2e 0%,#2d1b3d 100%);border:1px solid #ff4b9b;color:#fff;padding:14px 18px;font-size:13px;line-height:1.45;text-align:left;border-radius:6px;box-shadow:0 8px 32px rgba(255,75,155,.3);margin:6px';
  layer.appendChild(el);
  setTimeout(() => { el.style.opacity = '0'; el.style.transition = 'opacity .4s'; }, 6000);
  setTimeout(() => el.remove(), 6500);
}

function openPanel(which) {
  closePanel();
  const p = document.createElement('div');
  p.id = 'side-panel';
  p.style.cssText = 'position:fixed;top:0;right:0;width:min(520px,100vw);height:100vh;background:#0a0a14;border-left:2px solid #4be3ff;z-index:9999;overflow-y:auto;padding:24px;box-shadow:-8px 0 32px rgba(0,0,0,.7);color:#eee;font-family:system-ui,sans-serif';
  let html = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px"><h2 style="margin:0;color:#4be3ff;letter-spacing:2px">' + which.toUpperCase() + '</h2><button onclick="closePanel()" style="background:#222;color:#fff;border:1px solid #555;padding:6px 12px;cursor:pointer;border-radius:4px">✕</button></div>';
  if (which === 'codex') html += renderCodex();
  else if (which === 'daily') html += renderDaily();
  else if (which === 'bosses') html += renderBossVault();
  else if (which === 'leaderboard') html += renderLeaderboard();
  p.innerHTML = html;
  document.body.appendChild(p);
}
function closePanel() { const p = document.getElementById('side-panel'); if (p) p.remove(); }

function renderCodex() {
  if (!window.ACEDCampaign) return '<p>Loading...</p>';
  const status = window.ACEDCampaign.getStatus();
  const codex = window.ACEDCampaign.getCodex();
  let html = '<h3 style="color:#ffd34b;margin-top:0">Campaign Progress</h3>';
  for (const ch of status) {
    const pct = Math.min(100, Math.floor((ch.progress.correct / ch.requiredCorrect) * 100));
    const cleared = ch.progress.cleared;
    html += '<div style="margin-bottom:18px;padding:14px;background:' + (cleared ? '#1a2e1f' : '#1a1a24') + ';border-left:3px solid ' + (cleared ? '#22ff66' : '#4be3ff') + ';border-radius:4px">' +
            '<div style="display:flex;justify-content:space-between;align-items:center"><strong>' + ch.id + ' — ' + ch.title + '</strong>' + (cleared ? '<span style="color:#22ff66">✅ CLEARED</span>' : '') + '</div>' +
            '<div style="color:#888;font-size:12px;margin:4px 0">' + ch.subtitle + '</div>' +
            '<div style="color:#ff4b9b;font-size:11px;margin-bottom:6px">vs ' + ch.antagonist + '</div>' +
            '<div style="background:#222;height:8px;border-radius:4px;overflow:hidden"><div style="width:' + pct + '%;height:100%;background:linear-gradient(90deg,#4be3ff,#ff4b9b);transition:width .4s"></div></div>' +
            '<div style="font-size:11px;color:#888;margin-top:4px">' + ch.progress.correct + ' / ' + ch.requiredCorrect + ' correct</div>' +
            '</div>';
  }
  html += '<h3 style="color:#ffd34b;margin-top:24px">Codex Fragments (' + codex.length + '/6)</h3>';
  if (codex.length === 0) html += '<p style="color:#888;font-size:13px">Clear a chapter to unlock your first fragment.</p>';
  for (const c of codex) {
    html += '<div style="margin-bottom:14px;padding:14px;background:#1a0f2e;border:1px solid #ff4b9b;border-radius:6px">' +
            '<div style="color:#ff4b9b;font-size:11px;letter-spacing:1px">' + c.chapter + '</div>' +
            '<strong style="color:#ffd34b;display:block;margin:4px 0">' + c.title + '</strong>' +
            '<p style="font-size:12px;line-height:1.6;color:#ccc;margin:8px 0 0">' + c.body + '</p>' +
            '</div>';
  }
  return html;
}

function renderDaily() {
  if (!window.ACEDDaily) return '<p>Loading...</p>';
  const s = window.ACEDDaily.getState();
  const avg = window.ACEDDaily.getAverage(7);
  let html = '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:20px">' +
    '<div style="background:#1a0f2e;padding:14px;border-radius:6px;text-align:center"><div style="color:#888;font-size:11px">STREAK</div><div style="font-size:36px;color:#ff4b9b;font-weight:bold">' + s.currentStreak + '🔥</div></div>' +
    '<div style="background:#1a0f2e;padding:14px;border-radius:6px;text-align:center"><div style="color:#888;font-size:11px">LONGEST</div><div style="font-size:36px;color:#ffd34b;font-weight:bold">' + s.longestStreak + '</div></div>' +
    '<div style="background:#1a0f2e;padding:14px;border-radius:6px;text-align:center"><div style="color:#888;font-size:11px">PERFECT PULSES</div><div style="font-size:36px;color:#22ff66;font-weight:bold">' + s.perfectPulses + '</div></div>' +
    '<div style="background:#1a0f2e;padding:14px;border-radius:6px;text-align:center"><div style="color:#888;font-size:11px">FREEZE TOKENS</div><div style="font-size:36px;color:#4be3ff;font-weight:bold">' + s.freezeTokens + '❄</div></div>' +
    '</div>';
  if (s.todayCompleted) {
    html += '<div style="background:#1a2e1f;padding:16px;border-left:3px solid #22ff66;border-radius:4px;margin-bottom:16px"><strong style="color:#22ff66">✅ Today\'s pulse: ' + s.todayScore + '</strong><p style="color:#aaa;font-size:13px;margin:8px 0 0">Come back tomorrow to extend your streak.</p></div>';
  } else {
    html += '<button onclick="startDailyPulse()" style="width:100%;padding:18px;background:linear-gradient(135deg,#ff4b9b,#ffd34b);color:#0a0a14;border:none;font-size:16px;font-weight:bold;cursor:pointer;border-radius:6px;letter-spacing:1px">☀ START TODAY\'S PULSE — 5 Q / 60s</button>';
  }
  if (avg !== null) html += '<p style="color:#888;font-size:13px;margin-top:16px">7-day average: <strong style="color:#4be3ff">' + avg + '</strong></p>';
  html += '<h3 style="color:#ffd34b;margin-top:24px">Recent Pulses</h3>';
  for (const h of (s.history || []).slice(0, 7)) {
    html += '<div style="display:flex;justify-content:space-between;padding:8px 12px;background:#1a1a24;margin-bottom:4px;border-radius:4px;font-size:13px"><span>' + h.date + '</span><span style="color:#4be3ff">' + h.correct + '/' + h.total + '</span><span style="color:#ffd34b">' + h.score + ' pts</span></div>';
  }
  return html;
}

function renderBossVault() {
  if (!window.ACEDNemesis) return '<p>Loading...</p>';
  const nemesis = window.ACEDNemesis.getNemesisTopics(5);
  const topMissed = window.ACEDNemesis.getTopMissed(10);
  const defeats = window.ACEDNemesis.getDefeats();
  let html = '<h3 style="color:#ff4b9b;margin-top:0">Active Nemeses</h3>';
  if (nemesis.length === 0) html += '<p style="color:#888;font-size:13px">No nemeses yet. Miss the same topic 5+ times to spawn one.</p>';
  for (const n of nemesis) {
    html += '<div style="background:#2d1b1b;border:1px solid #ff4b9b;padding:14px;border-radius:6px;margin-bottom:10px"><strong style="color:#ff4b9b">👿 ' + n.topic + '</strong><div style="font-size:12px;color:#aaa;margin-top:4px">Missed ' + n.missCount + '×</div></div>';
  }
  if (nemesis.length > 0) html += '<button onclick="startNemesisRun()" style="width:100%;padding:14px;background:#ff4b9b;color:#fff;border:none;font-weight:bold;cursor:pointer;border-radius:6px;margin-top:8px">⚔ LAUNCH NEMESIS RUN</button>';
  html += '<h3 style="color:#ffd34b;margin-top:24px">Top Missed (all-time)</h3>';
  for (const m of topMissed) {
    html += '<div style="display:flex;justify-content:space-between;padding:6px 10px;background:#1a1a24;margin-bottom:4px;border-radius:3px;font-size:12px"><span>' + m.topic + '</span><span style="color:#ff4b9b">' + m.missCount + '×</span></div>';
  }
  const defKeys = Object.keys(defeats || {});
  if (defKeys.length) {
    html += '<h3 style="color:#22ff66;margin-top:24px">Defeated Nemeses</h3>';
    for (const k of defKeys) {
      html += '<div style="padding:6px 10px;background:#1a2e1f;margin-bottom:4px;border-radius:3px;font-size:12px;color:#22ff66">💀 ' + k + '</div>';
    }
  }
  return html;
}

function renderLeaderboard() {
  if (!window.ACEDSocial) return '<p>Loading...</p>';
  const lb = window.ACEDSocial.getLeaderboard();
  let html = '<h3 style="color:#ffd34b;margin-top:0">Your Best Runs (Top 10)</h3>';
  if (lb.length === 0) html += '<p style="color:#888;font-size:13px">Finish a run to start your leaderboard.</p>';
  if (lb.length > 0) {
    html += '<table style="width:100%;border-collapse:collapse;font-size:13px"><thead><tr style="color:#888;font-size:11px"><th style="text-align:left;padding:6px">#</th><th style="text-align:left;padding:6px">DATE</th><th style="text-align:right;padding:6px">SCORE</th><th style="text-align:right;padding:6px">ANTE</th></tr></thead><tbody>';
    lb.forEach((e, i) => {
      html += '<tr style="border-top:1px solid #222"><td style="padding:8px 6px;color:#ffd34b">' + (i + 1) + '</td><td style="padding:8px 6px;color:#aaa">' + e.date + '</td><td style="padding:8px 6px;text-align:right;color:#4be3ff;font-weight:bold">' + (e.score || 0).toLocaleString() + '</td><td style="padding:8px 6px;text-align:right">' + (e.ante || '-') + '</td></tr>';
    });
    html += '</tbody></table>';
  }
  html += '<h3 style="color:#ffd34b;margin-top:24px">Share Your Best</h3>';
  html += '<button onclick="shareLastRun()" style="width:100%;padding:14px;background:linear-gradient(135deg,#4be3ff,#ff4b9b);color:#fff;border:none;font-weight:bold;cursor:pointer;border-radius:6px">📸 GENERATE SHARE CARD</button>';
  return html;
}

function shareLastRun() {
  if (!window.ACEDSocial) return;
  const lb = window.ACEDSocial.getLeaderboard();
  if (lb.length === 0) { (window.toast || alert)('No runs yet'); return; }
  const top = lb[0];
  const s = window.ACEDDaily ? window.ACEDDaily.getState() : { currentStreak: 0, perfectPulses: 0 };
  const dataURL = window.ACEDSocial.generateShareCard({ score: top.score, streak: s.currentStreak, section: top.section, bossesDefeated: top.bossesDefeated, perfectPulses: s.perfectPulses });
  window.ACEDSocial.downloadCard(dataURL, 'aced-' + top.date + '.png');
  if (window.toast) window.toast('Share card saved', 'gold');
}

function startDailyPulse() {
  if (!window.ACEDDaily) return;
  const s = window.ACEDDaily.getState();
  if (s.todayCompleted) { if (window.toast) window.toast('Already done today', 'amber'); return; }
  closePanel();
  const all = collectAllQuestions();
  const missLog = (function () { try { return JSON.parse(localStorage.getItem('aced_miss_log')) || {}; } catch (e) { return {}; } })();
  const qs = window.ACEDDaily.selectQuestions(all, missLog);
  if (qs.length < 5) { if (window.toast) window.toast('Not enough questions', 'red'); return; }
  runDailyPulse(qs, false);
}

function collectAllQuestions() {
  const Q = window.QUESTIONS || {};
  const all = [];
  for (let t = 1; t <= 8; t++) {
    if (Q[t] && Q[t].questions) all.push(...Q[t].questions);
  }
  return all;
}

function runDailyPulse(questions, isNemesis) {
  let idx = 0, correct = 0, score = 0;
  const startMs = Date.now();
  const timeLimit = isNemesis ? 999 : window.ACEDDaily.TIME_LIMIT_SEC;
  const overlay = document.createElement('div');
  overlay.id = 'daily-pulse-overlay';
  overlay.style.cssText = 'position:fixed;inset:0;background:#0a0a14;z-index:10000;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px;color:#fff;font-family:system-ui,sans-serif';
  document.body.appendChild(overlay);

  function render() {
    if (idx >= questions.length) { finish(); return; }
    const q = questions[idx];
    const elapsed = (Date.now() - startMs) / 1000;
    if (elapsed > timeLimit) { finish(); return; }
    const remaining = Math.max(0, timeLimit - elapsed);
    const timerColor = remaining < 15 ? '#ff4b9b' : '#4be3ff';
    overlay.innerHTML =
      '<div style="width:100%;max-width:720px">' +
      '<div style="display:flex;justify-content:space-between;margin-bottom:16px;font-size:13px;color:#888"><span>' + (isNemesis ? '⚔ NEMESIS' : '☀ DAILY PULSE') + ' · Q' + (idx + 1) + '/' + questions.length + '</span>' + (isNemesis ? '' : '<span style="color:' + timerColor + ';font-weight:bold">' + Math.ceil(remaining) + 's</span>') + '</div>' +
      '<div style="background:#1a0f2e;padding:24px;border-radius:8px;border-left:3px solid #ff4b9b;margin-bottom:20px"><div style="font-size:11px;color:#ffd34b;margin-bottom:8px;letter-spacing:.5px">' + (q.topic || '') + '</div><div style="font-size:15px;line-height:1.55">' + (q.stem || q.q) + '</div></div>' +
      q.choices.map((c, i) => '<button onclick="window.__dpAnswer(' + i + ')" style="display:block;width:100%;text-align:left;padding:14px 18px;margin-bottom:8px;background:#1a1a24;border:1px solid #333;color:#eee;cursor:pointer;border-radius:4px;font-size:14px;font-family:inherit">' + String.fromCharCode(65 + i) + '. ' + c + '</button>').join('') +
      '</div>';
  }

  const timer = isNemesis ? null : setInterval(render, 500);

  window.__dpAnswer = function (choiceIdx) {
    const q = questions[idx];
    if (choiceIdx === q.answer) {
      correct++;
      score += 200;
      if (window.ACEDJuice) window.ACEDJuice.sfx.correct();
      if (window.ACEDNemesis) window.ACEDNemesis.recordCorrect(q);
    } else {
      if (window.ACEDJuice) window.ACEDJuice.sfx.wrong();
      if (window.ACEDNemesis) window.ACEDNemesis.recordMiss(q);
      if (window.ACEDWittyWrongs) {
        const roast = window.ACEDWittyWrongs.getRoast(q);
        showWittyToast(roast.message, roast.tagged ? roast.patternLabel : null);
      }
    }
    idx++;
    render();
  };

  function finish() {
    if (timer) clearInterval(timer);
    const timeSec = Math.round((Date.now() - startMs) / 1000);
    if (!isNemesis) {
      score += Math.max(0, (window.ACEDDaily.TIME_LIMIT_SEC - timeSec) * 10);
      const newState = window.ACEDDaily.recordCompletion({ score, correct, total: questions.length, timeSec });
      if (correct === questions.length && window.ACEDJuice) {
        window.ACEDJuice.sfx.bossDefeat && window.ACEDJuice.sfx.bossDefeat();
        window.ACEDJuice.flash('#ffd23f', 800, 0.4);
      }
      overlay.innerHTML =
        '<div style="text-align:center;max-width:520px">' +
        '<h1 style="font-size:48px;color:#ffd34b;margin:0 0 8px;letter-spacing:3px">PULSE COMPLETE</h1>' +
        '<div style="font-size:80px;color:' + (correct === questions.length ? '#22ff66' : '#4be3ff') + ';font-weight:bold;margin:16px 0">' + correct + '/' + questions.length + '</div>' +
        '<div style="color:#888;margin-bottom:20px">Score: <strong style="color:#ff4b9b">' + score + '</strong> · Time: ' + timeSec + 's</div>' +
        '<div style="background:#1a0f2e;padding:16px;border-radius:6px;margin-bottom:20px">' +
        '<div style="color:#ff4b9b;font-size:14px">STREAK: ' + newState.currentStreak + '🔥</div>' +
        (correct === questions.length ? '<div style="color:#22ff66;margin-top:6px">✨ PERFECT PULSE</div>' : '') +
        '</div>' +
        '<button onclick="document.getElementById(\'daily-pulse-overlay\').remove()" style="padding:12px 32px;background:#4be3ff;color:#0a0a14;border:none;font-weight:bold;cursor:pointer;border-radius:4px">CLOSE</button>' +
        '</div>';
    } else {
      overlay.innerHTML = '<div style="text-align:center"><h1 style="color:#ff4b9b">NEMESIS RUN COMPLETE</h1><div style="font-size:60px;color:#ffd34b;font-weight:bold">' + correct + '/' + questions.length + '</div><button onclick="document.getElementById(\'daily-pulse-overlay\').remove()" style="padding:12px 32px;background:#4be3ff;color:#0a0a14;border:none;font-weight:bold;cursor:pointer;border-radius:4px;margin-top:20px">CLOSE</button></div>';
    }
  }

  render();
}

function startNemesisRun() {
  if (!window.ACEDNemesis) return;
  const all = collectAllQuestions();
  const run = window.ACEDNemesis.generateNemesisRun(all);
  if (!run) { if (window.toast) window.toast('No nemeses to fight yet', 'amber'); return; }
  closePanel();
  if (window.toast) window.toast('NEMESIS RUN: ' + run.title, 'gold');
  runDailyPulse(run.questions.slice(0, 10), true);
}

// Expose globals
window.openPanel = openPanel;
window.closePanel = closePanel;
window.showWittyToast = showWittyToast;
window.startDailyPulse = startDailyPulse;
window.startNemesisRun = startNemesisRun;
window.shareLastRun = shareLastRun;
