/* ACED — aced-progress.js
   ============================================================================
   The career ladder + daily briefing. A thin, dependency-free meta-progression
   layer that gives players a reason to come back for weeks (a rank they climb)
   and a reason to come back *today* (three date-seeded objectives), without any
   dark patterns — every point is earned by actually studying.

   It rides on ACEDCore.store (so it syncs cross-device like everything else)
   and is driven by ONE hook the engine calls at points it already has:

       ACEDProgress.event(type, payload)  ->  { gained, xp, promotion, completed }

   type            payload                                fired from
   --------------  -------------------------------------  ----------------------
   hand_scored     { total }                              study.html play()
   audit_answered  { correct, confidence, module }        study.html submitAudit()
   close_cleared   { ante }                               study.html blindClear()
   run_filed       { score, ante, won }                   study.html win/lose/end
   question_answered { correct, module }                  study.html review/mock
   review_done     { pct, correct, n }                    study.html runQuiz
   mock_done       { pct, correct, n }                    study.html runQuiz
   tbs_graded      { pct, correct, n }                    study.html renderTBS
   daily_completed { correct, total, perfect, score }     daily.html finishRun()

   Everything degrades gracefully: no ACEDCore, no problem — it self-hosts a
   tiny store so the landing page can still read a rank. Load AFTER aced-core.js.
   ============================================================================ */
(function () {
  "use strict";

  /* ---------- storage: prefer the shared core, fall back to a local one ---------- */
  function makeLocalStore() {
    var mem = {}, ok = false, NS = "aced:cpa-far:";
    try { var k = "__acedprog__"; window["local" + "Storage"].setItem(k, "1"); window["local" + "Storage"].removeItem(k); ok = true; } catch (e) { ok = false; }
    function rd(key) { if (ok) { try { return window["local" + "Storage"].getItem(NS + key); } catch (e) {} } return mem[key] == null ? null : mem[key]; }
    function wr(key, v) { if (ok) { try { window["local" + "Storage"].setItem(NS + key, v); return; } catch (e) {} } mem[key] = v; }
    return {
      get: function (key, fb) { var raw = rd(key); if (raw == null) return fb; try { return JSON.parse(raw); } catch (e) { return fb; } },
      set: function (key, v) { try { wr(key, JSON.stringify(v)); } catch (e) {} }
    };
  }
  var store = (window.ACEDCore && ACEDCore.store) ? ACEDCore.store : makeLocalStore();
  function track(ev, p) { try { if (window.ACEDCore && ACEDCore.analytics) ACEDCore.analytics.track(ev, p || {}); } catch (e) {} }

  /* ---------- the career ladder ----------
     Cumulative XP thresholds. Names map onto the firm-progression ladder the
     share card already speaks (Intern -> Partner), so the whole product tells
     one story. Tuned so a regular daily player makes Senior in ~a week and has
     a long tail (Managing Partner) to chase well past one exam cycle. */
  var RANKS = [
    { key: "INTERN",          short: "INTERN",     at: 0,    blurb: "First day on the engagement. Tie your shoes and tie out the cash." },
    { key: "STAFF",           short: "STAFF",      at: 150,  blurb: "Staff Accountant. The workpapers are yours now." },
    { key: "SENIOR",          short: "SENIOR",     at: 450,  blurb: "Senior. You review the juniors and the judgment calls." },
    { key: "MANAGER",         short: "MANAGER",    at: 1000, blurb: "Manager. You own the close, not just a tie-out." },
    { key: "SR MANAGER",      short: "SR MGR",     at: 1900, blurb: "Senior Manager. The hard estimates land on your desk." },
    { key: "CONTROLLER",      short: "CONTROL",    at: 3200, blurb: "Controller. The whole ledger answers to you." },
    { key: "PARTNER",         short: "PARTNER",    at: 5200, blurb: "Partner. Your signature is the opinion." },
    { key: "MANAGING PARTNER",short: "MNG PTR",    at: 8000, blurb: "Managing Partner. The firm is the engagement now." }
  ];
  function rankIndexFor(xp) { var i = 0; for (var k = 0; k < RANKS.length; k++) { if (xp >= RANKS[k].at) i = k; } return i; }

  /* ---------- XP awards per event (small, frequent drip + chunky milestones) ---------- */
  function xpFor(type, p) {
    p = p || {};
    switch (type) {
      case "hand_scored":      return 3 + ((p.total >= 2500) ? 12 : (p.total >= 1200) ? 6 : 0);
      case "audit_answered":   return p.correct ? (14 + ((p.confidence === "HIGH") ? 6 : 0)) : 5;
      case "close_cleared":    return 12;
      case "run_filed":        return Math.min(50, Math.round((p.score || 0) / 200)) + (p.won ? 25 : 0);
      case "question_answered":return p.correct ? 2 : 0;
      case "review_done":      return 10;
      case "mock_done":        return 25 + ((p.pct >= 75) ? 15 : 0);
      case "tbs_graded":       return 10 + ((p.pct >= 70) ? 12 : 0);
      case "daily_completed":  return 40 + (p.perfect ? 20 : 0);
      default:                 return 0;
    }
  }

  /* ---------- deterministic per-day RNG (so objectives are stable + comparable) ---------- */
  function hashStr(s) { var h = 2166136261 >>> 0; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; } return h >>> 0; }
  function mulberry32(a) { return function () { a = (a + 0x6D2B79F5) >>> 0; var t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  function todayKey() { var d = new Date(); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }

  /* ---------- objective catalogue ----------
     Each def builds a concrete objective from the day's RNG and exposes apply(),
     which returns how much progress a given event contributes. Threshold-style
     objectives cap their own progress so they read as a clean n/goal. */
  function pick(rng, arr) { return arr[Math.floor(rng() * arr.length)]; }
  var DEFS = {
    daily_close: {
      build: function () { return { label: "Close today's books — finish the Daily Close", hint: "Daily tab", goal: 1, reward: 60 }; },
      apply: function (q, type) { return type === "daily_completed" ? 1 : 0; }
    },
    pass_audits: {
      build: function (rng) { var g = pick(rng, [2, 3, 3, 4]); return { label: "Pass " + g + " Audit Moments", hint: "Clear closes in a run", goal: g, reward: 45 }; },
      apply: function (q, type, p) { return (type === "audit_answered" && p.correct) ? 1 : 0; }
    },
    confident_correct: {
      build: function (rng) { var g = pick(rng, [2, 3]); return { label: "Nail " + g + " answers you bet MED or HIGH on", hint: "Back yourself in Audit Moments", goal: g, reward: 55 }; },
      apply: function (q, type, p) { return (type === "audit_answered" && p.correct && (p.confidence === "MED" || p.confidence === "HIGH")) ? 1 : 0; }
    },
    big_hand: {
      build: function (rng) { var th = pick(rng, [1200, 1800, 2500]); return { label: "Bank a single hand worth " + th.toLocaleString() + "+", hint: "Stack a combo your doctrines love", goal: 1, reward: 50, th: th }; },
      apply: function (q, type, p) { return (type === "hand_scored" && p.total >= q.th) ? 1 : 0; }
    },
    clear_closes: {
      build: function (rng) { var g = pick(rng, [3, 4, 5]); return { label: "Clear " + g + " closes", hint: "Beat the score target each round", goal: g, reward: 45 }; },
      apply: function (q, type) { return type === "close_cleared" ? 1 : 0; }
    },
    reach_fy: {
      build: function (rng) { var t = pick(rng, [2, 3]); return { label: "Reach Fiscal Year " + t + " in a run", hint: "Survive the boss closes", goal: 1, reward: 55, t: t }; },
      apply: function (q, type, p) { return ((type === "run_filed" || type === "close_cleared") && (p.ante || 0) >= q.t) ? 1 : 0; }
    },
    correct_today: {
      build: function (rng) { var g = pick(rng, [6, 8, 10]); return { label: "Answer " + g + " questions correctly today", hint: "Audits, Review, Daily — all count", goal: g, reward: 50 }; },
      apply: function (q, type, p) {
        if (type === "audit_answered" && p.correct) return 1;
        if (type === "question_answered" && p.correct) return 1;
        if (type === "daily_completed") return p.correct || 0;
        return 0;
      }
    },
    finish_tbs: {
      build: function () { return { label: "Work a Task-Based Simulation", hint: "TBS button — graded with explanations", goal: 1, reward: 50 }; },
      apply: function (q, type) { return type === "tbs_graded" ? 1 : 0; }
    },
    run_score: {
      build: function (rng) { var th = pick(rng, [4000, 6000, 8000]); return { label: "Finish a run scoring " + th.toLocaleString() + "+", hint: "Push the multiplier deep into the run", goal: 1, reward: 60, th: th }; },
      apply: function (q, type, p) { return (type === "run_filed" && (p.score || 0) >= q.th) ? 1 : 0; }
    },
    play_hands: {
      build: function (rng) { var g = pick(rng, [8, 10, 12]); return { label: "Play " + g + " hands", hint: "Any run — warm up the engine", goal: g, reward: 40 }; },
      apply: function (q, type) { return type === "hand_scored" ? 1 : 0; }
    }
  };
  // Pool the daily picker draws its two rotating objectives from (the Daily Close is always #1).
  var ROTATION = ["pass_audits", "confident_correct", "big_hand", "clear_closes", "reach_fy", "correct_today", "finish_tbs", "run_score", "play_hands"];

  function buildDay(key) {
    var rng = mulberry32(hashStr("aced-objectives|" + key));
    var chosen = ["daily_close"];
    var bag = ROTATION.slice();
    for (var i = bag.length - 1; i > 0; i--) { var j = Math.floor(rng() * (i + 1)); var t = bag[i]; bag[i] = bag[j]; bag[j] = t; }
    chosen.push(bag[0], bag[1]);
    var list = chosen.map(function (kind, idx) {
      var o = DEFS[kind].build(rng);
      o.id = key + ":" + idx + ":" + kind; o.kind = kind; o.prog = 0; o.done = false;
      return o;
    });
    return { date: key, list: list, dayXp: 0 };
  }

  /* ---------- state ---------- */
  function loadProgress() { var s = store.get("progress", null) || {}; return { xp: s.xp || 0, seenRank: (s.seenRank == null ? 0 : s.seenRank) }; }
  function saveProgress(p) { store.set("progress", p); }
  function loadDay() {
    var key = todayKey();
    var d = store.get("objectives", null);
    if (!d || d.date !== key || !Array.isArray(d.list)) { d = buildDay(key); store.set("objectives", d); }
    return d;
  }
  function saveDay(d) { store.set("objectives", d); }

  /* ---------- subscribers (so HUDs repaint on change) ---------- */
  var subs = [];
  function notify() { for (var i = 0; i < subs.length; i++) { try { subs[i](); } catch (e) {} } }

  /* ---------- public API ---------- */
  function rankObj(xp) { return RANKS[rankIndexFor(xp == null ? loadProgress().xp : xp)]; }
  function nextRankObj(xp) { var i = rankIndexFor(xp); return RANKS[i + 1] || null; }

  function event(type, payload) {
    payload = payload || {};
    var prog = loadProgress();
    var day = loadDay();
    var before = prog.xp;

    // 1) flat XP for the action itself
    var gained = xpFor(type, payload);

    // 2) advance any matching objective; completion pays its reward once
    var completed = [];
    day.list.forEach(function (q) {
      if (q.done) return;
      var inc = 0;
      try { inc = DEFS[q.kind].apply(q, type, payload) || 0; } catch (e) { inc = 0; }
      if (inc > 0) {
        q.prog = Math.min(q.goal, q.prog + inc);
        if (q.prog >= q.goal) {
          q.done = true; gained += q.reward; day.dayXp += q.reward;
          completed.push({ label: q.label, reward: q.reward });
          track("objective_completed", { kind: q.kind, reward: q.reward });
        }
      }
    });

    prog.xp = before + gained;
    day.dayXp += xpFor(type, payload);

    // 3) promotion?
    var promotion = null;
    var newIdx = rankIndexFor(prog.xp);
    if (newIdx > prog.seenRank) {
      promotion = { from: RANKS[prog.seenRank], to: RANKS[newIdx] };
      prog.seenRank = newIdx;
      track("promoted", { rank: RANKS[newIdx].key, xp: prog.xp });
    }

    saveProgress(prog); saveDay(day);
    try { if (window.ACEDCore && ACEDCore.sync && ACEDCore.sync.isEnabled && ACEDCore.sync.isEnabled()) ACEDCore.sync.push(); } catch (e) {}
    if (gained > 0 || completed.length || promotion) notify();
    return { gained: gained, xp: prog.xp, promotion: promotion, completed: completed };
  }

  function state() {
    var prog = loadProgress(), day = loadDay();
    var idx = rankIndexFor(prog.xp), cur = RANKS[idx], next = RANKS[idx + 1] || null;
    var floor = cur.at, ceil = next ? next.at : cur.at;
    var pct = next ? Math.max(0, Math.min(100, Math.round((prog.xp - floor) / (ceil - floor) * 100))) : 100;
    return {
      xp: prog.xp, rank: cur, next: next,
      intoRank: prog.xp - floor, span: next ? (ceil - floor) : 0,
      toNext: next ? Math.max(0, ceil - prog.xp) : 0, pct: pct,
      objectives: day.list, dayXp: day.dayXp,
      objectivesDone: day.list.filter(function (q) { return q.done; }).length,
      objectivesTotal: day.list.length
    };
  }

  window.ACEDProgress = {
    version: 1,
    event: event,
    state: state,
    rankObj: rankObj,
    nextRankObj: nextRankObj,
    ranks: function () { return RANKS.slice(); },
    onChange: function (fn) { if (typeof fn === "function") subs.push(fn); },
    // expose for tests / debugging
    _buildDay: buildDay, _xpFor: xpFor
  };
})();
