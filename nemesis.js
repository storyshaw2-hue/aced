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

  // ---- review aggregation (unchanged from v7.1) ------------------------------
  function byModule() {
    var s = store(); if (!s) return [];
    var r = s.get("review", {}), agg = {};
    for (var k in r) {
      if (!r.hasOwnProperty(k)) continue;
      var e = r[k], m = e.src; if (!m) continue;
      var a = agg[m] || (agg[m] = { module: m, miss: 0, ok: 0 });
      a.miss += e.miss || 0; a.ok += e.ok || 0;
    }
    var out = [];
    for (var mm in agg) { if (agg.hasOwnProperty(mm)) { var x = agg[mm]; x.net = x.miss - x.ok; out.push(x); } }
    out.sort(function (p, q) { return q.net - p.net || q.miss - p.miss; });
    return out;
  }
  function netFor(mod) { var b = byModule(); for (var i = 0; i < b.length; i++) if (b[i].module === mod) return b[i].net; return 0; }

  function get() { var s = store(); return s ? s.get("nemesis", null) : null; }
  function set(n) { var s = store(); if (s) s.set("nemesis", n); }

  // Keep the existing Nemesis while it still has a hold (net > 0), else spawn
  // from the worst domain once it crosses THRESHOLD. (Unchanged from v7.1.)
  function sync() {
    var cur = get();
    if (cur) { if (netFor(cur.module) > 0) return cur; set(null); cur = null; }
    var top = byModule()[0];
    if (top && top.net >= THRESHOLD) {
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
      var d = (store() && store().get("nemesisDefeats", {})) || {};
      d[n.module] = (d[n.module] || 0) + 1; if (store()) store().set("nemesisDefeats", d);
      set(null);
      return { defeated: true, correct: !!correct, name: n.name, module: n.module, hp: 0, maxHp: maxHp(n) };
    }
    return { defeated: false, correct: !!correct, name: n.name, module: n.module, hp: h, maxHp: maxHp(n) };
  }

  function defeats() { var s = store(); return s ? s.get("nemesisDefeats", {}) : {}; }
  function defeatCount() { var d = defeats(), c = 0; for (var k in d) if (d.hasOwnProperty(k)) c += d[k]; return c; }

  window.ACEDNemesis = {
    sync: sync, current: current, hp: hp, maxHp: maxHp, onAudit: onAudit,
    byModule: byModule, defeats: defeats, defeatCount: defeatCount,
    nameFor: nameFor, setNames: setNames, THRESHOLD: THRESHOLD
  };
})();
