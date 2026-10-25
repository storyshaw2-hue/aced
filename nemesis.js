// ACED Nemesis — v8 (subject-agnostic)
// ============================================================================
// A persistent, NAMED boss assembled from the player's OWN recurring misses,
// derived from aced-core's review store (per-question {miss,ok,box,src}),
// aggregated by "domain" (the card's `src` — a module key, topic, tag, whatever
// the pack uses). It resurfaces in boss-blind slots, weakens as the player
// answers its domain correctly, strengthens on misses, and is defeated when net
// misses in that domain reach zero.
//
// WHAT CHANGED FROM v7.1: the boss's IDENTITY is no longer tied to any subject.
// Names are generated procedurally from the domain label, so this works for ANY
// pack — Spanish verbs, cell biology, case law, trivia, anything. A pack (or the
// host page) MAY optionally supply nicer hand-authored names via
// `window.ACED_BOSS_NAMES` or `ACEDNemesis.setNames({...})`; any domain not in
// that map gets a good generated name. All HP / spawn / defeat logic is byte-for
// -byte the same as v7.1 and still derives purely from review data — no separate
// bookkeeping to drift out of sync.
//
// (The old FAR villain names now live in an optional file, cpa-far.bossnames.js,
// so the CPA pack keeps its flavor without the engine being CPA-coupled.)
// ============================================================================
(function () {
  "use strict";
  function store() { return window.ACEDCore ? ACEDCore.store : null; }

  var THRESHOLD = 3; // net misses in a domain needed to spawn / respawn a Nemesis

  // ---- bounded recent window ------------------------------------------------
  // `net` used to be a LIFETIME miss-minus-ok tally, which made the mechanic
  // switch itself off for well-practiced domains (net deeply negative forever)
  // and made an early-bombed domain effectively unkillable (30-40 net). Two
  // bounds fix that without any bookkeeping the review store doesn't already
  // hold:
  //   * recency decay — a question's contribution halves every HALF_LIFE_MS and
  //     drops out entirely once negligible, so old history stops voting.
  //   * per-question clamp — one question can swing a domain by at most
  //     PER_Q_CAP either way, so net stays proportional to how many DISTINCT
  //     cards are currently weak instead of to raw repetition count.
  // There is deliberately no domain-level clamp on net: hp IS net, so clamping
  // it would freeze the health bar for the first (raw net - cap) correct answers.
  var HALF_LIFE_MS = 14 * 864e5; // 14 days
  var MIN_WEIGHT = 0.05;         // below this a question has aged out of the window
  var PER_Q_CAP = 3;             // max signed contribution of a single question

  // A defeated domain sits out this long so the villain the player just
  // destroyed cannot reappear later in the same session.
  var RETIRE_MS = 6 * 36e5; // 6 hours

  // ---- optional externally-supplied names (opt-in flavor, never required) ----
  var NAMES = {};
  try { if (window.ACED_BOSS_NAMES && typeof window.ACED_BOSS_NAMES === "object") NAMES = window.ACED_BOSS_NAMES; } catch (e) {}
  function setNames(map) { if (map && typeof map === "object") NAMES = map; }

  // ---- procedural, subject-agnostic name generation --------------------------
  function hashStr(s) { var h = 0, i; s = String(s == null ? "" : s); for (i = 0; i < s.length; i++) { h = (h * 31 + s.charCodeAt(i)) >>> 0; } return h; }
  function titleCase(w) { return w ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : w; }

  var EPITHETS = [
    "keeps finding your errors",
    "feeds on the cards you avoid",
    "guards what you haven't learned",
    "returns for every miss",
    "hardens with each mistake",
    "haunts your weak spots"
  ];
  var WORD_TEMPLATES = ["The %s Warden", "The %s Wall", "The %s Reckoning", "The %s Snare"];
  // Used when the domain is an opaque code with no readable word (e.g. "F2.M3").
  var GENERIC = ["The Discrepancy", "The Blind Spot", "The Gap", "The Lapse", "The Snag", "The Fault Line", "The Oversight"];

  function prettyLabel(label) {
    return String(label || "").split(/[^A-Za-z0-9]+/).filter(Boolean).map(titleCase).join(" ") || "the Unknown";
  }
  // Most descriptive token in a label; "" when the label is just a code.
  function salientWord(label) {
    var words = String(label || "").split(/[^A-Za-z]+/).filter(function (w) { return w.length >= 3; });
    if (!words.length) return "";
    words.sort(function (a, b) { return b.length - a.length; });
    return words[0];
  }
  function procedural(domain) {
    var seed = hashStr(domain);
    var epithet = EPITHETS[seed % EPITHETS.length];
    var word = salientWord(domain);
    if (word) {
      var i = seed % WORD_TEMPLATES.length;
      // "Keeper of <full label>" reads better than the single-word templates
      var name = (i === 0) ? ("Keeper of " + prettyLabel(domain)) : WORD_TEMPLATES[i].replace("%s", titleCase(word));
      return [name, epithet];
    }
    return [GENERIC[seed % GENERIC.length], epithet];
  }
  function nameFor(mod) {
    if (mod && NAMES[mod]) return NAMES[mod];
    if (!mod) return ["The Discrepancy", "keeps finding your errors"];
    return procedural(mod);
  }

  // ---- review aggregation over the bounded recent window ---------------------
  // Entries with no `last` timestamp (older data, or a test fixture) can't be
  // aged, so they count at full weight rather than being silently discarded.
  function weightOf(e) {
    var last = +(e && e.last) || 0;
    if (!last) return 1;
    var age = Date.now() - last;
    if (age <= 0) return 1;
    var w = Math.pow(0.5, age / HALF_LIFE_MS);
    return w < MIN_WEIGHT ? 0 : w;
  }
  function clampContrib(v) { return Math.max(-PER_Q_CAP, Math.min(PER_Q_CAP, v)); }

  function byModule() {
    var s = store(); if (!s) return [];
    var r = s.get("review", {}), agg = {};
    for (var k in r) {
      if (!r.hasOwnProperty(k)) continue;
      var e = r[k], m = e.src; if (!m) continue;
      var w = weightOf(e); if (!w) continue;
      var a = agg[m] || (agg[m] = { module: m, miss: 0, ok: 0, net: 0 });
      a.miss += w * (e.miss || 0);
      a.ok += w * (e.ok || 0);
      a.net += w * clampContrib((e.miss || 0) - (e.ok || 0));
    }
    var out = [];
    for (var mm in agg) {
      if (!agg.hasOwnProperty(mm)) continue;
      var x = agg[mm];
      x.miss = Math.round(x.miss); x.ok = Math.round(x.ok); x.net = Math.round(x.net);
      out.push(x);
    }
    out.sort(function (p, q) { return q.net - p.net || q.miss - p.miss; });
    return out;
  }
  function netFor(mod) { var b = byModule(); for (var i = 0; i < b.length; i++) if (b[i].module === mod) return b[i].net; return 0; }

  function get() { var s = store(); return s ? s.get("nemesis", null) : null; }
  function set(n) { var s = store(); if (s) s.set("nemesis", n); }

  function retired() { var s = store(); return (s && s.get("nemesisRetired", {})) || {}; }
  function isRetired(mod) {
    var t = +retired()[mod] || 0;
    return !!t && (Date.now() - t) < RETIRE_MS;
  }
  // Single place that books a defeat, so a boss dying can never go uncredited
  // no matter which code path killed it.
  function creditDefeat(mod) {
    var s = store(); if (!s || !mod) return;
    var d = s.get("nemesisDefeats", {}) || {};
    d[mod] = (d[mod] || 0) + 1;
    s.set("nemesisDefeats", d);
    var r = s.get("nemesisRetired", {}) || {};
    r[mod] = Date.now();
    s.set("nemesisRetired", r);
  }

  // Keep the existing Nemesis while it still has a hold (net > 0), else credit
  // the defeat and spawn from the worst eligible domain once it crosses
  // THRESHOLD. Crediting here (not only in onAudit) means a defeat survives any
  // code path that drives net to <= 0 — including engines that write to the
  // review store without calling onAudit.
  function sync() {
    var cur = get();
    if (cur) {
      if (netFor(cur.module) > 0) return cur;
      creditDefeat(cur.module);
      set(null); cur = null;
    }
    var list = byModule();
    for (var i = 0; i < list.length; i++) {
      var top = list[i];
      if (top.net < THRESHOLD) break;          // sorted desc — nothing below qualifies
      if (isRetired(top.module)) continue;     // just beaten; let it rest
      var nm = nameFor(top.module);
      var n = { module: top.module, name: nm[0], epithet: nm[1], spawnNet: top.net, born: Date.now() };
      set(n); return n;
    }
    return null;
  }
  function current() { return sync(); }
  function hp(n) { n = n || get(); return n ? Math.max(0, netFor(n.module)) : 0; }
  function maxHp(n) { n = n || get(); return n ? Math.max(THRESHOLD, n.spawnNet || THRESHOLD, hp(n)) : 0; }

  // Apply an audit result. review.record() must have run first. (Unchanged.)
  function onAudit(moduleKey, correct) {
    var n = get(); if (!n || moduleKey !== n.module) return null;
    var h = hp(n);
    if (h <= 0) {
      var mx = maxHp(n);
      creditDefeat(n.module);
      set(null);
      return { defeated: true, correct: !!correct, name: n.name, module: n.module, hp: 0, maxHp: mx };
    }
    return { defeated: false, correct: !!correct, name: n.name, module: n.module, hp: h, maxHp: maxHp(n) };
  }

  // Credit a real defeat for `moduleKey` and retire the villain. This is what a
  // WON boss encounter calls: nemesis-encounter.js owns the fight's transient
  // bars, but beating it is real progress against that domain, so the end screen
  // ("<DOMAIN> CLEANSED") is telling the truth and the same villain does not
  // reappear a few antes later in the same run.
  function defeat(moduleKey) {
    var n = get();
    if (!moduleKey && n) moduleKey = n.module;
    if (!moduleKey) return null;
    creditDefeat(moduleKey);
    if (n && n.module === moduleKey) set(null);
    return { defeated: true, module: moduleKey, count: (defeats()[moduleKey] || 0) };
  }

  function defeats() { var s = store(); return s ? s.get("nemesisDefeats", {}) : {}; }
  function defeatCount() { var d = defeats(), c = 0; for (var k in d) if (d.hasOwnProperty(k)) c += d[k]; return c; }

  window.ACEDNemesis = {
    sync: sync, current: current, hp: hp, maxHp: maxHp, onAudit: onAudit,
    defeat: defeat, byModule: byModule, defeats: defeats, defeatCount: defeatCount,
    nameFor: nameFor, setNames: setNames, THRESHOLD: THRESHOLD
  };
})();
