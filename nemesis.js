// ACED Nemesis — a persistent, NAMED boss assembled from the player's own recurring misses.
// v7.1 rebuild (schema-correct): derives from aced-core's review store (per-question
// {miss,ok,box,src}), aggregated by module (q.source). Resurfaces in boss-blind slots;
// it weakens as the player answers its module correctly and strengthens on misses, and is
// defeated when the player's net misses in its domain fall to zero.
//
// HP is fully derived from review data (net misses = miss - ok), so it tracks the player's
// real accuracy with no separate bookkeeping to drift out of sync. The caller records the
// audit result via ACEDCore.review BEFORE calling onAudit(), so onAudit() reads fresh state.
(function () {
  "use strict";
  function store() { return window.ACEDCore ? ACEDCore.store : null; }

  var THRESHOLD = 3; // net misses in a module needed to spawn / respawn a Nemesis

  // Villain identities per FAR module (flavor only — no exam content).
  var NAMES = {
    "F1.M1": ["The Bottom Line", "drags your net income into the red"],
    "F1.M2": ["The Footnote", "buries you in disclosures"],
    "F1.M3": ["The Restatement", "rewrites your past"],
    "F1.M4": ["The Reconciler", "turns accrual into cash and back"],
    "F2.M1": ["The Five-Step Phantom", "recognizes revenue you cannot"],
    "F2.M2": ["The Bad Debt", "writes you off"],
    "F2.M3": ["The LIFO Layer", "buries your cost in old strata"],
    "F2.M4": ["The Depreciator", "wears down everything you own"],
    "F2.M5": ["The Impairment", "marks your goodwill to zero"],
    "F2.M6": ["The Equity Method", "consolidates your will"],
    "F2.M7": ["The OCI Specter", "haunts other comprehensive income"],
    "F3.M1": ["The Float", "holds your cash in transit"],
    "F3.M4": ["The Amortizer", "grinds your premium down to par"],
    "F3.M5": ["The Lessor", "tightens every term"],
    "F4.M1": ["The Treasury", "buys back your shares"],
    "F4.M2": ["The Dilutionist", "waters down your EPS"],
    "F4.M3": ["The Rollforward", "never lets the period close"],
    "F4.M4": ["The Deferred", "taxes you later, and harder"],
    "F4.M5": ["The Comptroller", "audits your every fund"]
  };
  function nameFor(mod) { return NAMES[mod] || ["The Discrepancy", "keeps finding your errors"]; }

  // Aggregate review misses by module → sorted worst-first.
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

  // Resolve the current Nemesis: keep the existing one while it still has a hold (net > 0),
  // otherwise spawn from the worst module once it crosses THRESHOLD.
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

  // Apply an audit result. review.record() must have run first. Returns a result or null.
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
    byModule: byModule, defeats: defeats, defeatCount: defeatCount, nameFor: nameFor, THRESHOLD: THRESHOLD
  };
})();
