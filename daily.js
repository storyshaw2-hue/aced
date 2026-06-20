// ACED Daily Pulse — 5 questions, 60s, 1x/day, hard-lock with Streak Freeze tokens
(function () {
  const STORAGE_KEY = 'aced_daily_state';
  const NUM_QUESTIONS = 5;
  const TIME_LIMIT_SEC = 60;
  const FREEZE_EARN_INTERVAL = 7; // earn 1 freeze per 7-day streak

  // Deterministic seed from date string YYYY-MM-DD
  function dateSeed(d = new Date()) {
    const s = d.toISOString().slice(0, 10);
    let h = 0;
    for (let i = 0; i < s.length; i++) {
      h = (h * 31 + s.charCodeAt(i)) >>> 0;
    }
    return h;
  }
  function todayKey() { return new Date().toISOString().slice(0, 10); }

  // Seeded pseudo-random (mulberry32)
  function rng(seed) {
    return function () {
      seed = (seed + 0x6D2B79F5) >>> 0;
      let t = seed;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function load() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
    catch (e) { return {}; }
  }
  function save(s) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch (e) {}
  }

  function getState() {
    const s = load();
    return {
      currentStreak: s.currentStreak || 0,
      longestStreak: s.longestStreak || 0,
      lastCompletedDate: s.lastCompletedDate || null,
      todayCompleted: s.lastCompletedDate === todayKey(),
      todayScore: s.todayScore || null,
      freezeTokens: s.freezeTokens || 0,
      history: s.history || [], // [{date, score, correct, timeSec}]
      perfectPulses: s.perfectPulses || 0
    };
  }

  // Pick 5 questions from the question bank, biased toward user's weakest topics
  function selectQuestions(allQuestions, missLog) {
    const seed = dateSeed();
    const r = rng(seed);
    const pool = allQuestions.filter(q => q && q.stem && q.choices);
    if (pool.length === 0) return [];

    // Score each question: higher score if topic is in miss log
    const scored = pool.map(q => {
      const topic = q.topic || '';
      const missScore = (missLog && missLog[topic]) ? missLog[topic] : 0;
      return { q, score: missScore + r() * 0.5 };
    });
    scored.sort((a, b) => b.score - a.score);

    // Take top 50% by miss-weight, then sample 5
    const topHalf = scored.slice(0, Math.max(NUM_QUESTIONS * 4, Math.floor(scored.length / 2)));
    const picks = [];
    const used = new Set();
    while (picks.length < NUM_QUESTIONS && used.size < topHalf.length) {
      const idx = Math.floor(r() * topHalf.length);
      if (!used.has(idx)) { used.add(idx); picks.push(topHalf[idx].q); }
    }
    return picks;
  }

  function recordCompletion({ score, correct, total, timeSec }) {
    const s = load();
    const today = todayKey();
    if (s.lastCompletedDate === today) return getState(); // already done

    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    let newStreak;
    if (s.lastCompletedDate === yesterday) {
      newStreak = (s.currentStreak || 0) + 1;
    } else if (s.lastCompletedDate && s.freezeTokens > 0) {
      // Use a freeze token
      s.freezeTokens -= 1;
      newStreak = (s.currentStreak || 0) + 1;
    } else {
      newStreak = 1;
    }

    // Earn a freeze every 7-day streak threshold
    if (newStreak > 0 && newStreak % FREEZE_EARN_INTERVAL === 0) {
      s.freezeTokens = (s.freezeTokens || 0) + 1;
    }

    s.currentStreak = newStreak;
    s.longestStreak = Math.max(s.longestStreak || 0, newStreak);
    s.lastCompletedDate = today;
    s.todayScore = score;
    s.history = s.history || [];
    s.history.unshift({ date: today, score, correct, total, timeSec });
    s.history = s.history.slice(0, 30); // keep 30 days
    if (correct === total) s.perfectPulses = (s.perfectPulses || 0) + 1;
    save(s);
    return getState();
  }

  function getAverage(days = 7) {
    const s = load();
    const hist = (s.history || []).slice(0, days);
    if (hist.length === 0) return null;
    const sum = hist.reduce((a, b) => a + (b.score || 0), 0);
    return Math.round(sum / hist.length);
  }

  window.ACEDDaily = {
    NUM_QUESTIONS, TIME_LIMIT_SEC,
    selectQuestions, recordCompletion, getState, getAverage, todayKey
  };
})();
