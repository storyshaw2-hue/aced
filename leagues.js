/* leagues.js — weekly promotion/relegation league ladder (Duolingo-style).
   ---------------------------------------------------------------------------
   Works standalone TODAY with a deterministic simulated room (stable per week),
   and swaps to REAL opponents from server/leaderboard.js the moment the backend
   is configured (window.ACED_API_URL + ACEDCore.backend). Weekly points are
   derived from the Daily Close history already in localStorage, so nothing else
   in the app needs to change.

   Public API (window.ACEDLeagues):
     .TIERS                 ordered tier list [{key,name,color}]
     .weekKey([date])       Monday-anchored week id "YYYY-MM-DD"
     .current()             {tier, week, history:[{week,tier,rank,points,outcome}], lastOutcome?}
     .weeklyPoints()        points earned this week (from Daily Close history)
     .standings()           Promise<{tier,week,points,rank,room[],promoteAt,relegateAt,msLeft,source,lastOutcome}>

   Server contract to unblock real leagues (add in server/leaderboard.js):
     GET  {API}/leaderboard/league?week=KEY&tier=TIER   (Bearer auth)
          -> { rows:[{name,points}], you:{points}, tier? }   // server places user in a 15-room
     POST {API}/leaderboard/league  { week, points }         // report this week's points
   When present, the server should own promotion/relegation; the client rollover
   below is the solo-mode fallback. If the GET returns `tier`, the client adopts it.
   --------------------------------------------------------------------------- */
(function () {
  var TIERS = [
    { key: "bronze",   name: "Bronze League",   color: "#cd7f32" },
    { key: "silver",   name: "Silver League",   color: "#c7ccd1" },
    { key: "gold",     name: "Gold League",     color: "#ffd23f" },
    { key: "sapphire", name: "Sapphire League", color: "#5cffea" },
    { key: "ruby",     name: "Ruby League",     color: "#ff5238" },
    { key: "emerald",  name: "Emerald League",  color: "#22ff66" },
    { key: "diamond",  name: "Diamond League",  color: "#b39bff" }
  ];
  var COHORT_SIZE = 15;   // players per room
  var PROMOTE = 3;        // top N promote
  var RELEGATE = 3;       // bottom N relegate (Bronze can't drop)
  var STORE_KEY = "aced_league_v1";
  var WEEK_MS = 7 * 86400000;

  /* ---- week id: Monday 00:00 local boundaries ---- */
  function weekKey(d) {
    d = d || new Date();
    var x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    var dow = (x.getDay() + 6) % 7;              // Mon=0
    x.setDate(x.getDate() - dow);
    var y = x.getFullYear(), m = String(x.getMonth() + 1).padStart(2, "0"), da = String(x.getDate()).padStart(2, "0");
    return y + "-" + m + "-" + da;
  }
  function weekStartMs(key) { var p = key.split("-").map(Number); return new Date(p[0], p[1] - 1, p[2]).getTime(); }

  /* ---- storage (prefers ACEDCore.store; falls back to localStorage) ---- */
  function S() { try { return window.ACEDCore ? ACEDCore.store : null; } catch (e) { return null; } }
  function load() {
    var s = S(); if (s) { var v = s.get(STORE_KEY, null); if (v) return v; }
    try { return JSON.parse(localStorage.getItem(STORE_KEY)) || null; } catch (e) { return null; }
  }
  function save(v) { var s = S(); if (s) { s.set(STORE_KEY, v); return; } try { localStorage.setItem(STORE_KEY, JSON.stringify(v)); } catch (e) {} }

  /* ---- points earned in a given week, read from the Daily Close history ---- */
  function pointsForWeek(key) {
    var pts = 0;
    try {
      var ds = JSON.parse(localStorage.getItem("aced_daily_state")) || {};
      var start = weekStartMs(key), end = start + WEEK_MS;
      (ds.history || []).forEach(function (h) {
        var t = Date.parse((h.date || "") + "T00:00:00");
        if (!isNaN(t) && t >= start && t < end) pts += (h.score || 0);
      });
    } catch (e) {}
    return pts;
  }

  /* ---- deterministic simulated room (stable for a given week+tier) ---- */
  function hash(s) { var h = 2166136261 >>> 0; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; } return h >>> 0; }
  function rngFrom(seed) { var a = seed >>> 0; return function () { a = (a + 0x6D2B79F5) >>> 0; var t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  var BOTS = ["Ledger", "Accrual", "Debit", "Credit", "Journal", "TrialBalance", "Prepaid", "Goodwill", "Deferral", "Amortize", "Nexus", "Basis", "Equity", "Prudence", "Footnote", "Variance", "Auditor", "Margin", "Yield", "Nominal", "Sunk", "Escrow", "Tranche", "Covenant"];
  function simRoom(key, tier, youPoints) {
    var rng = rngFrom(hash(key + "|" + tier));
    var tierIdx = TIERS.map(function (t) { return t.key; }).indexOf(tier);
    var base = 45 + tierIdx * 40;               // higher tiers grind harder
    var rows = [], used = {};
    for (var i = 0; i < COHORT_SIZE - 1; i++) {
      var nm; do { nm = BOTS[Math.floor(rng() * BOTS.length)] + String(10 + Math.floor(rng() * 89)); } while (used[nm]);
      used[nm] = 1;
      rows.push({ name: nm, points: Math.max(0, Math.round(base + rng() * rng() * base * 2.4)) });
    }
    rows.push({ name: "You", points: youPoints, you: true });
    rows.sort(function (a, b) { return b.points - a.points; });
    return rows;
  }

  /* ---- backend seam ---- */
  function backendOn() { try { return !!(window.ACEDCore && ACEDCore.backend && ACEDCore.backend.isEnabled() && window.ACED_API_URL); } catch (e) { return false; } }
  function authHeader() { try { var t = window.ACEDAccount && ACEDAccount.token && ACEDAccount.token(); return t ? { "Authorization": "Bearer " + t } : {}; } catch (e) { return {}; } }
  function fetchRoom(key, tier, youPoints) {
    if (backendOn()) {
      var base = String(window.ACED_API_URL).replace(/\/$/, "");
      // best-effort report of this week's points, then fetch the room
      try { fetch(base + "/leaderboard/league", { method: "POST", headers: Object.assign({ "Content-Type": "application/json" }, authHeader()), body: JSON.stringify({ week: key, points: youPoints }) }).catch(function () {}); } catch (e) {}
      var url = base + "/leaderboard/league?week=" + encodeURIComponent(key) + "&tier=" + encodeURIComponent(tier);
      return fetch(url, { headers: authHeader() }).then(function (r) { return r.json(); }).then(function (j) {
        var rows = (j && j.rows ? j.rows.slice() : []);
        rows.push({ name: "You", points: (j && j.you && j.you.points != null) ? j.you.points : youPoints, you: true });
        rows.sort(function (a, b) { return b.points - a.points; });
        return { rows: rows, tier: (j && j.tier) || null };
      }).catch(function () { return { rows: simRoom(key, tier, youPoints), tier: null }; });
    }
    return Promise.resolve({ rows: simRoom(key, tier, youPoints), tier: null });
  }

  /* ---- state + weekly rollover (solo-mode promotion/relegation) ---- */
  function state() {
    var st = load(), wk = weekKey();
    if (!st) { st = { tier: "bronze", week: wk, history: [] }; save(st); return st; }
    if (st.week !== wk) { st = rollover(st, wk); save(st); }
    return st;
  }
  function rollover(st, newWeek) {
    var lastPts = (st.lastPoints != null) ? st.lastPoints : pointsForWeek(st.week);
    var room = simRoom(st.week, st.tier, lastPts);   // deterministic re-creation of last week's room
    var rank = room.map(function (r) { return r.you ? 1 : 0; }).indexOf(1) + 1;
    var idx = TIERS.map(function (t) { return t.key; }).indexOf(st.tier);
    var outcome = "stayed";
    if (rank <= PROMOTE && idx < TIERS.length - 1) { idx++; outcome = "promoted"; }
    else if (rank > COHORT_SIZE - RELEGATE && idx > 0) { idx--; outcome = "relegated"; }
    var hist = (st.history || []).slice(0, 11);
    hist.unshift({ week: st.week, tier: st.tier, rank: rank, points: lastPts, outcome: outcome });
    return { tier: TIERS[idx].key, week: newWeek, history: hist, lastPoints: 0,
             lastOutcome: { week: st.week, rank: rank, outcome: outcome, from: st.tier, to: TIERS[idx].key } };
  }

  window.ACEDLeagues = {
    TIERS: TIERS, COHORT_SIZE: COHORT_SIZE, PROMOTE: PROMOTE, RELEGATE: RELEGATE,
    weekKey: weekKey,
    current: state,
    weeklyPoints: function () { return pointsForWeek(weekKey()); },
    standings: function () {
      var st = state(), pts = pointsForWeek(st.week);
      return fetchRoom(st.week, st.tier, pts).then(function (res) {
        if (res.tier && res.tier !== st.tier) { st.tier = res.tier; }   // server is authoritative when present
        st.lastPoints = pts; save(st);
        var room = res.rows, rank = room.map(function (r) { return r.you ? 1 : 0; }).indexOf(1) + 1;
        return {
          tier: st.tier, week: st.week, points: pts, rank: rank, room: room,
          promoteAt: PROMOTE, relegateAt: COHORT_SIZE - RELEGATE + 1,
          msLeft: Math.max(0, weekStartMs(st.week) + WEEK_MS - Date.now()),
          source: backendOn() ? "server" : "solo",
          lastOutcome: st.lastOutcome || null
        };
      });
    }
  };
})();
