/* ACED — aced-core.js
   ============================================================================
   One small dependency-free core that the game pages share. It supersedes the
   earlier confidence.js / nemesis.js / daily.js drafts, which were written
   against an older question schema (q.topic / q.stem). The real banks use
   q.source / q.q, so this module is written against THAT schema and is the
   single, correct home for:

     ACEDCore.store        namespaced localStorage with in-memory fallback
     ACEDCore.analytics    fire-and-forget event tracking (growth-doc events)
     ACEDCore.calibration  Brier-score confidence calibration, by module
     ACEDCore.review       missed-question tracking + spaced review queue
     ACEDCore.streak       read the shared Daily Close streak (for HUD badges)
     ACEDCore.backend      optional sync abstraction (no-op until configured)

   Everything degrades gracefully: no storage, no network, no problem.
   Load this BEFORE the engine so the engine can call into it.
   ============================================================================ */
(function () {
  "use strict";

  var PACKID = (function () {
    try {
      var p = new URLSearchParams(location.search).get("pack");
      return (p || "cpa-far").replace(/[^a-z0-9._-]/gi, "");
    } catch (e) { return "cpa-far"; }
  })();
  var NS = "aced:" + PACKID + ":";

  /* ---------- storage (try/catch + in-memory fallback) ---------- */
  var mem = {}, lsOk = false;
  try { var k = "__acedcore__"; window["local" + "Storage"].setItem(k, "1"); window["local" + "Storage"].removeItem(k); lsOk = true; } catch (e) { lsOk = false; }
  function rd(key) { if (lsOk) { try { return window["local" + "Storage"].getItem(NS + key); } catch (e) { lsOk = false; return mem[key] == null ? null : mem[key]; } } return mem[key] == null ? null : mem[key]; }
  function wr(key, v) { if (lsOk) { try { window["local" + "Storage"].setItem(NS + key, v); return; } catch (e) { lsOk = false; mem[key] = v; return; } } mem[key] = v; }
  var store = {
    get: function (key, fb) { var raw = rd(key); if (raw == null) return fb; try { return JSON.parse(raw); } catch (e) { return fb; } },
    set: function (key, v) { try { wr(key, JSON.stringify(v)); } catch (e) {} },
    isPersistent: function () { return lsOk; }
  };

  /* short stable hash for a question (used as a review key with its module) */
  function hash(s) { var h = 0, i; s = String(s == null ? "" : s); for (i = 0; i < s.length; i++) { h = (h * 31 + s.charCodeAt(i)) >>> 0; } return h.toString(36); }
  function qKey(q) { return (q && q.source ? q.source : "?") + ":" + hash(q && q.q ? q.q : ""); }

  /* ---------- analytics (fire-and-forget; matches GROWTH_BACKLOG events) ---------- */
  var EVENT_CAP = 200;
  // Defensive PII scrubber: analytics props should never carry raw emails or
  // auth tokens. This is a safety net (nothing intentionally logs PII), so it
  // redacts email-like values and long token-like strings and drops keys whose
  // name suggests a secret. Objects are recursed one level deep; capped in size.
  var PII_KEY = /(email|mail|token|jwt|secret|password|passwd|pwd|auth|bearer|apikey|api_key|session)/i;
  var EMAIL_RE = /[^\s@]+@[^\s@]+\.[^\s@]+/;
  function scrubVal(v) {
    if (v == null) return v;
    if (typeof v === "string") {
      if (EMAIL_RE.test(v)) return "[redacted:email]";
      // long opaque strings (tokens/ids) — keep short human-readable labels
      if (v.length > 64 || /^(ey[A-Za-z0-9._-]{20,}|Bearer\s)/i.test(v)) return "[redacted]";
      return v;
    }
    if (typeof v === "number" || typeof v === "boolean") return v;
    return undefined; // drop nested objects/arrays/functions from analytics props
  }
  function scrubProps(props) {
    var out = {}, n = 0;
    if (!props || typeof props !== "object") return out;
    try {
      for (var kk in props) {
        if (!Object.prototype.hasOwnProperty.call(props, kk)) continue;
        if (n++ >= 40) break;                    // cap prop count
        if (PII_KEY.test(kk)) { out[kk] = "[redacted]"; continue; }
        var sv = scrubVal(props[kk]);
        if (sv !== undefined) out[kk] = sv;
      }
    } catch (e) {}
    return out;
  }
  var analytics = {
    track: function (event, props) {
      var rec = { e: event, t: Date.now(), p: scrubProps(props) };
      try {
        var buf = store.get("events", []);
        buf.push(rec); if (buf.length > EVENT_CAP) buf = buf.slice(-EVENT_CAP);
        store.set("events", buf);
      } catch (e) {}
      // optional live sink (e.g., Plausible/PostHog) — wired by the host if present
      try { if (typeof window.ACED_ANALYTICS_SINK === "function") window.ACED_ANALYTICS_SINK(event, rec.p); } catch (e) {}
      try { if (window.console && console.debug) console.debug("[aced]", event, rec.p); } catch (e) {}
    },
    recent: function (n) { var b = store.get("events", []); return n ? b.slice(-n) : b; }
  };

  /* ---------- calibration (Brier score by module) ----------
     prob: LOW .50 / MED .75 / HIGH .95 ; brier = (prob - actual)^2
     display = (1 - mean brier) * 100, clamped 0..100. */
  var PROB = { LOW: 0.50, MED: 0.75, HIGH: 0.95 };
  var CAL_CAP = 400;
  var calibration = {
    PROB: PROB,
    record: function (o) {
      o = o || {};
      var p = PROB[o.confidence]; if (p == null) return;
      var actual = o.correct ? 1 : 0;
      var s = store.get("calib", { samples: [], byModule: {} });
      var brier = (p - actual) * (p - actual);
      s.samples.push({ b: brier, c: o.confidence, ok: actual, m: o.source || null, t: Date.now() });
      if (s.samples.length > CAL_CAP) s.samples = s.samples.slice(-CAL_CAP);
      if (o.source) {
        var bm = s.byModule[o.source] || { n: 0, sum: 0, correct: 0 };
        bm.n += 1; bm.sum += brier; bm.correct += actual; s.byModule[o.source] = bm;
      }
      store.set("calib", s);
      analytics.track("confidence_bet_placed", { level: o.confidence, correct: !!o.correct, module: o.source || null });
      return this.summary();
    },
    summary: function () {
      var s = store.get("calib", { samples: [], byModule: {} });
      var n = s.samples.length;
      if (!n) return { pct: null, n: 0, byModule: {} };
      var sum = 0, correct = 0, i;
      for (i = 0; i < n; i++) { sum += s.samples[i].b; correct += s.samples[i].ok; }
      var pct = Math.max(0, Math.min(100, Math.round((1 - sum / n) * 100)));
      return { pct: pct, n: n, accuracy: Math.round((correct / n) * 100), byModule: s.byModule };
    }
  };

  /* ---------- review / spaced repetition (Leitner-lite, keyed by module+question) ----------
     Each answered question gets a "box" 0..5. Correct -> box+1, miss -> box=0.
     A question is "due" if missed more than mastered, or box 0/1. The review
     queue resurfaces the actual missed questions so a wrong answer becomes a
     second chance to learn, not just a scoring penalty. */
  var review = {
    record: function (q, correct) {
      if (!q) return;
      var key = qKey(q);
      var r = store.get("review", {});
      var e = r[key] || { seen: 0, miss: 0, ok: 0, box: 0, last: 0, src: q.source || null };
      e.seen += 1; e.last = Date.now();
      if (correct) { e.ok += 1; e.box = Math.min(5, e.box + 1); }
      else { e.miss += 1; e.box = 0; }
      r[key] = e; store.set("review", r);
    },
    isWeak: function (q) {
      var r = store.get("review", {}); var e = r[qKey(q)];
      if (!e) return false;
      return (e.miss > e.ok) || (e.miss > 0 && e.box <= 1);
    },
    /* return up to n questions from allQs that the player has missed/not mastered,
       hardest first (most misses, lowest box). */
    queue: function (allQs, n) {
      n = n || 10;
      var r = store.get("review", {});
      var scored = [];
      (allQs || []).forEach(function (q) {
        var e = r[qKey(q)];
        if (e && ((e.miss > e.ok) || (e.miss > 0 && e.box <= 1))) {
          scored.push({ q: q, rank: (e.miss * 10) - e.box + (5 - Math.min(5, e.ok)) });
        }
      });
      scored.sort(function (a, b) { return b.rank - a.rank; });
      return scored.slice(0, n).map(function (x) { return x.q; });
    },
    count: function () {
      var r = store.get("review", {}); var c = 0;
      for (var k in r) { if (r.hasOwnProperty(k)) { var e = r[k]; if ((e.miss > e.ok) || (e.miss > 0 && e.box <= 1)) c++; } }
      return c;
    }
  };

  /* ---------- streak (read the Daily Close streak written by daily.html) ---------- */
  var streak = {
    get: function () {
      var d = store.get("dailyV1", {});
      return { current: d.currentStreak || 0, best: d.bestStreak || 0, freezes: d.freezes || 0, lastDate: d.lastDate || null };
    },
    playedToday: function () {
      var d = store.get("dailyV1", {});
      var today = new Date(); var key = today.getFullYear() + "-" + String(today.getMonth() + 1).padStart(2, "0") + "-" + String(today.getDate()).padStart(2, "0");
      return !!(d.results && d.results[key]);
    }
  };

  /* ---------- backend abstraction (no-op until configured) ----------
     Set ACEDCore.backend.configure({endpoint, token}) to enable cross-device
     sync. Until then push/pull resolve to local data. See BACKEND_SPEC.md. */
  var _be = { endpoint: null, token: null };
  // Timeout guard so a cold/hung backend can't leave sync requests pending
  // forever (Render free tier cold-starts ~15-20s). Always clears the timer.
  var BE_TIMEOUT_MS = 20000;
  function fetchT(url, init, ms) {
    init = init || {};
    var ac = (typeof AbortController !== "undefined") ? new AbortController() : null;
    if (ac) init.signal = ac.signal;
    var timer = setTimeout(function () { try { if (ac) ac.abort(); } catch (e) {} }, ms || BE_TIMEOUT_MS);
    return fetch(url, init).then(
      function (r) { clearTimeout(timer); return r; },
      function (err) { clearTimeout(timer); throw err; }
    );
  }
  var backend = {
    configure: function (cfg) { _be.endpoint = (cfg && cfg.endpoint) || null; _be.token = (cfg && cfg.token) || null; },
    isEnabled: function () { return !!_be.endpoint; },
    push: function (payload) {
      if (!_be.endpoint) return Promise.resolve({ synced: false, local: true });
      try {
        return fetchT(_be.endpoint + "/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": _be.token ? ("Bearer " + _be.token) : "" },
          body: JSON.stringify(payload || {})
        }).then(function (r) { return r.json(); }).catch(function () { return { synced: false, error: true }; });
      } catch (e) { return Promise.resolve({ synced: false, error: true }); }
    },
    pull: function () {
      if (!_be.endpoint) return Promise.resolve(null);
      try {
        return fetchT(_be.endpoint + "/state", { headers: { "Authorization": _be.token ? ("Bearer " + _be.token) : "" } })
          .then(function (r) { return r.json(); }).catch(function () { return null; });
      } catch (e) { return Promise.resolve(null); }
    }
  };

  /* ---------- cross-device sync (MI-2) ----------
     Bundles the keys this device owns and round-trips them through the backend
     abstraction. Entirely a no-op until ACEDCore.backend.configure({endpoint})
     is called, so it is safe to wire eagerly. Streak lives under "dailyV1", so
     including it here is what lets a streak survive phone <-> laptop. */
  var SYNC_KEYS = ["mastery", "review", "calib", "events", "unlocked", "unlocks",
    "nemesis", "nemesisDefeats", "bestScore", "bestAnte", "dailyV1", "subscribers", "muted",
    "progress", "objectives"];
  var sync = {
    snapshot: function () {
      var data = {}, i, k, v;
      for (i = 0; i < SYNC_KEYS.length; i++) { k = SYNC_KEYS[i]; v = store.get(k, null); if (v != null) data[k] = v; }
      return { v: 1, pack: PACKID, updatedAt: Date.now(), data: data };
    },
    isEnabled: function () { return backend.isEnabled(); },
    push: function () {
      if (!backend.isEnabled()) return Promise.resolve({ synced: false, reason: "no-endpoint" });
      var snap = this.snapshot();
      try { store.set("lastSyncPush", snap.updatedAt); } catch (e) {}
      analytics.track("sync_push", { keys: Object.keys(snap.data).length });
      return backend.push(snap);
    },
    // Pull remote and apply ONLY if it is newer than the last applied pull (conservative,
    // last-write-wins by timestamp). Returns {applied, keys|reason}.
    pull: function () {
      if (!backend.isEnabled()) return Promise.resolve({ applied: false, reason: "no-endpoint" });
      var lastApplied = store.get("lastSyncApplied", 0);
      return backend.pull().then(function (remote) {
        if (!remote || !remote.data) return { applied: false, reason: "empty" };
        if (remote.updatedAt && remote.updatedAt <= lastApplied) return { applied: false, reason: "stale" };
        var keys = Object.keys(remote.data), i;
        for (i = 0; i < keys.length; i++) { try { store.set(keys[i], remote.data[keys[i]]); } catch (e) {} }
        try { store.set("lastSyncApplied", remote.updatedAt || Date.now()); } catch (e) {}
        analytics.track("sync_pull", { keys: keys.length });
        return { applied: true, keys: keys.length };
      });
    }
  };

  window.ACEDCore = {
    version: 1,
    store: store,
    analytics: analytics,
    calibration: calibration,
    review: review,
    streak: streak,
    backend: backend,
    sync: sync,
    qKey: qKey
  };
})();
