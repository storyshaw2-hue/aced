/* Node test harness for aced-pack.js — no framework, plain asserts. */
var assert = require("assert");
var fs = require("fs");
var vm = require("vm");

var SRC = fs.readFileSync(__dirname + "/aced-pack.js", "utf8");

function fakeCoreStore() {
  var m = {};
  var api = {
    get: function (k, fb) { return Object.prototype.hasOwnProperty.call(m, k) ? JSON.parse(m[k]) : fb; },
    set: function (k, v) { m[k] = JSON.stringify(v); }
  };
  api._raw = m;
  return api;
}
function loadPack(win) {
  var ctx = { window: win || {} };
  vm.runInNewContext(SRC, ctx);
  return ctx.window.ACEDPack;
}

/* 1. A bare questions-only pack yields neutral, subject-free defaults. */
(function () {
  var P = loadPack({});
  var cfg = P.init({ questions: [{ q: "hola?", options: ["a", "b"] }] });

  assert.strictEqual(cfg.labels.currency, "Coins", "default currency is neutral 'Coins'");
  assert.strictEqual(cfg.labels.hand, "Hand", "default label 'Hand'");
  assert.strictEqual(cfg.labels.round, "Round", "default label 'Round'");
  assert.strictEqual(typeof cfg.theme.accent, "string", "a palette was auto-assigned");
  assert.strictEqual(cfg.tuning.handSize, 8, "default hand size");
  assert.strictEqual(cfg.tuning.runLength >= 3 && cfg.tuning.runLength <= 12, true, "run length clamped");
  // sanity: no accounting/subject words leaked into defaults
  var blob = JSON.stringify(cfg.labels).toLowerCase();
  ["far", "cpa", "audit", "accounting", "doctrine", "ledger"].forEach(function (w) {
    assert.strictEqual(blob.indexOf(w) === -1, true, "no subject word '" + w + "' in labels");
  });
  console.log("PASS 1  bare pack -> neutral subject-free defaults");
})();

/* 2. Author-driven labels + named palette + tuning override the defaults. */
(function () {
  var P = loadPack({});
  var cfg = P.init({
    name: "Intro Spanish",
    questions: [{ q: "x" }],
    labels: { currency: "Pesos", boss: "El Jefe" },
    theme: { palette: "amber", scanlines: false },
    tuning: { handSize: 6, runLength: 5 }
  });
  assert.strictEqual(cfg.labels.currency, "Pesos", "author currency label applied");
  assert.strictEqual(cfg.labels.boss, "El Jefe", "author boss label applied");
  assert.strictEqual(cfg.labels.hand, "Hand", "untouched label keeps default");
  assert.strictEqual(cfg.theme.paletteId, "amber", "named palette applied");
  assert.strictEqual(cfg.theme.scanlines, false, "scanlines opt-out honored");
  assert.strictEqual(cfg.tuning.handSize, 6, "author handSize applied");
  assert.strictEqual(cfg.tuning.runLength, 5, "author runLength applied");
  console.log("PASS 2  author overrides (labels + palette + tuning)");
})();

/* 3. Author explicit palette tokens produce a custom palette. */
(function () {
  var P = loadPack({});
  var cfg = P.init({ questions: [{ q: "x" }], theme: { palette: { bg: "#111", fg: "#eee", accent: "#0f0" } } });
  assert.strictEqual(cfg.theme.paletteId, "custom", "explicit tokens => custom palette");
  assert.strictEqual(cfg.theme.accent, "#0f0", "custom accent applied");
  assert.strictEqual(cfg.theme.dim, "#0f0", "dim falls back to accent when omitted");
  console.log("PASS 3  explicit custom palette tokens");
})();

/* 4. Auto palette is deterministic per pack name. */
(function () {
  var a = loadPack({}).init({ id: "deck-alpha", questions: [{ q: "x" }] }).theme.paletteId;
  var b = loadPack({}).init({ id: "deck-alpha", questions: [{ q: "x" }] }).theme.paletteId;
  assert.strictEqual(a, b, "same pack id => same auto palette");
  var ids = {};
  loadPack({}).palettes().forEach(function (p) { ids[p.id] = 1; });
  assert.strictEqual(ids[a] === 1, true, "auto palette is one of the curated set");
  console.log("PASS 4  auto palette deterministic + in-set");
})();

/* 5. Difficulty tiers derive from THIS pack's own spread (terciles). */
(function () {
  var P = loadPack({});
  function stem(n) { var s = ""; while (s.length < n) s += "x"; return s; }
  // weights (stem length only, no options): 5,6,7, 50,51,52, 200,201,202
  var qs = [5, 6, 7, 50, 51, 52, 200, 201, 202].map(function (n) { return { q: stem(n) }; });
  P.init({ questions: qs });
  assert.strictEqual(P.difficultyOf({ q: stem(5) }), "easy", "short prompt => easy");
  assert.strictEqual(P.difficultyOf({ q: stem(51) }), "medium", "mid prompt => medium");
  assert.strictEqual(P.difficultyOf({ q: stem(200) }), "hard", "long prompt => hard");
  // author-provided numeric difficulty is respected by weightOf
  assert.strictEqual(P.weightOf({ q: "x", difficulty: 999 }), 999, "explicit numeric difficulty respected");
  console.log("PASS 5  per-pack tercile difficulty + explicit difficulty");
})();

/* 6. Player re-skin wins, persists across reload, clears back to auto; bad id rejected. */
(function () {
  var cs = fakeCoreStore();
  var P = loadPack({ ACEDCore: { store: cs } });
  var autoId = P.init({ id: "deck-beta", questions: [{ q: "x" }] }).theme.paletteId;

  var bad = P.setPalette("nope");
  assert.strictEqual(bad.ok === false && bad.reason === "unknown-palette", true, "unknown palette rejected");

  var res = P.setPalette("ice");
  assert.strictEqual(res.ok && res.paletteId === "ice", true, "player palette applied");
  assert.strictEqual(P.palette().id, "ice", "palette() reflects override");

  // reload with the SAME core store -> override persisted
  var P2 = loadPack({ ACEDCore: { store: cs } });
  assert.strictEqual(P2.init({ id: "deck-beta", questions: [{ q: "x" }] }).theme.paletteId, "ice", "override persisted across reload");

  // clear -> back to the auto palette
  P2.setPalette(null);
  assert.strictEqual(P2.init({ id: "deck-beta", questions: [{ q: "x" }] }).theme.paletteId, autoId, "cleared override returns to auto");
  console.log("PASS 6  player re-skin persists + clears (rides ACEDCore.store)");
})();

console.log("\nALL TESTS PASSED");
