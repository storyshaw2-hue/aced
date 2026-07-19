/* Node test harness for aced-vault.js — no framework, plain asserts.
   Loads the browser IIFE inside a fresh VM context with a fake window,
   exercising both the localStorage fallback and the ACEDCore.store path. */
var assert = require("assert");
var fs = require("fs");
var vm = require("vm");

var SRC = fs.readFileSync(__dirname + "/aced-vault.js", "utf8");

function fakeLocalStorage() {
  var m = {};
  return {
    getItem: function (k) { return Object.prototype.hasOwnProperty.call(m, k) ? m[k] : null; },
    setItem: function (k, v) { m[k] = String(v); },
    removeItem: function (k) { delete m[k]; }
  };
}
function fakeCoreStore() {
  var m = {};
  var api = {
    get: function (k, fb) { return Object.prototype.hasOwnProperty.call(m, k) ? JSON.parse(m[k]) : fb; },
    set: function (k, v) { m[k] = JSON.stringify(v); }
  };
  api._raw = m;
  return api;
}
function loadVault(win) {
  var ctx = { window: win };
  vm.runInNewContext(SRC, ctx);
  return ctx.window.ACEDVault;
}

/* 1. Standalone (localStorage only): a LOSS still pays, and state persists. */
(function () {
  var ls = fakeLocalStorage();
  var V = loadVault({ localStorage: ls });

  assert.strictEqual(V.balance(), 0, "fresh balance is 0");

  var loss = V.awardRunEnd({ outcome: "loss", score: 4500, ante: 2 });
  // finish 3 + floor(4500/1500)=3 + ante 2 = 8
  assert.strictEqual(loss, 8, "loss payout formula");
  assert.strictEqual(V.balance(), 8, "loss credited");

  // reload against the SAME storage -> balance survives
  var V2 = loadVault({ localStorage: ls });
  assert.strictEqual(V2.balance(), 8, "balance persisted across reload");
  console.log("PASS 1  standalone localStorage + loss payout + persistence");
})();

/* 2. Win bonus + first-win-of-day fires once per calendar day. */
(function () {
  var V = loadVault({ localStorage: fakeLocalStorage() });
  var w1 = V.awardRunEnd({ outcome: "win", score: 0, ante: 0 });
  assert.strictEqual(w1, 28, "first win: finish 3 + win 15 + firstWinOfDay 10");
  var w2 = V.awardRunEnd({ outcome: "win", score: 0, ante: 0 });
  assert.strictEqual(w2, 18, "second win same day omits daily bonus");
  console.log("PASS 2  win bonus + once-per-day daily bonus");
})();

/* 3. Purchases: affordability gate, cost scaling, level cap, bonuses aggregate. */
(function () {
  var cs = fakeCoreStore();
  var V = loadVault({ ACEDCore: { store: cs } });

  assert.strictEqual(V.canAfford("extra_hand"), false, "broke: cannot afford");
  var r0 = V.purchase("extra_hand");
  assert.strictEqual(r0.ok, false, "purchase fails when broke");
  assert.strictEqual(r0.reason, "insufficient", "reason=insufficient");

  V.award(1000, "test");
  assert.strictEqual(V.balance(), 1000, "funded");

  assert.strictEqual(V.costOf("extra_hand"), 40, "L1 cost = 40");
  var r1 = V.purchase("extra_hand");
  assert.strictEqual(r1.ok && r1.level === 1, true, "bought L1");
  assert.strictEqual(V.balance(), 960, "deducted 40");
  assert.strictEqual(V.bonuses().hands, 1, "bonus reflects L1");

  assert.strictEqual(V.costOf("extra_hand"), 80, "L2 cost scales to 80");
  V.purchase("extra_hand"); // L2 (-80 => 880)
  V.purchase("extra_hand"); // L3 (-120 => 760)
  assert.strictEqual(V.level("extra_hand"), 3, "reached max L3");
  assert.strictEqual(V.balance(), 760, "running balance correct");
  assert.strictEqual(V.bonuses().hands, 3, "bonus reflects L3");

  assert.strictEqual(V.costOf("extra_hand"), null, "maxed => cost null");
  assert.strictEqual(V.canAfford("extra_hand"), false, "maxed => not affordable");
  var rMax = V.purchase("extra_hand");
  assert.strictEqual(rMax.ok === false && rMax.reason === "maxed", true, "maxed purchase blocked");
  console.log("PASS 3  purchase gate + cost scaling + level cap + bonuses");
})();

/* 4. One-shot cosmetic unlock cannot be re-bought. */
(function () {
  var V = loadVault({ ACEDCore: { store: fakeCoreStore() } });
  V.award(200, "test");
  assert.strictEqual(V.isUnlocked("skin_amber"), false, "not unlocked initially");
  var r = V.purchase("skin_amber");
  assert.strictEqual(r.ok, true, "unlock purchased");
  assert.strictEqual(V.isUnlocked("skin_amber"), true, "now unlocked");
  assert.strictEqual(V.balance(), 150, "deducted 50");
  var r2 = V.purchase("skin_amber");
  assert.strictEqual(r2.ok === false && r2.reason === "maxed", true, "cannot re-buy one-shot");
  console.log("PASS 4  one-shot unlock (cosmetic)");
})();

/* 5. Event router pays out; unknown events no-op; state hits the core store. */
(function () {
  var cs = fakeCoreStore();
  var V = loadVault({ ACEDCore: { store: cs, analytics: { track: function () {} } } });

  var c = V.event("run_end", { outcome: "loss", score: 1600, ante: 1 });
  assert.strictEqual(c, 5, "event run_end pays 3+1+1");
  assert.strictEqual(V.balance(), 5, "credited via event");

  var noop = V.event("totally_unknown_event", { foo: 1 });
  assert.strictEqual(noop, 0, "unknown event is a no-op");
  assert.strictEqual(V.balance(), 5, "balance unchanged by unknown event");

  var written = JSON.parse(cs._raw["vault"]);
  assert.strictEqual(written.bal, 5, "state persisted under 'vault' key in core store");
  console.log("PASS 5  event routing + unknown no-op + rides ACEDCore.store");
})();

/* 6. Catalog is render-ready with correct level/cost/affordability. */
(function () {
  var V = loadVault({ ACEDCore: { store: fakeCoreStore() } });
  var cat = V.catalog();
  assert.strictEqual(Array.isArray(cat) && cat.length === 7, true, "catalog has 7 entries");
  var eh = cat.filter(function (x) { return x.id === "extra_hand"; })[0];
  assert.strictEqual(eh.level === 0 && eh.cost === 40 && eh.affordable === false, true, "extra_hand row correct at 0 balance");
  console.log("PASS 6  catalog view shape");
})();

console.log("\nALL TESTS PASSED");
