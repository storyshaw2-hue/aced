/* Node tests for nemesis-encounter.js — no framework, plain asserts. */
var assert = require("assert");
var fs = require("fs");
var vm = require("vm");

var SRC = fs.readFileSync(__dirname + "/nemesis-encounter.js", "utf8");

function load(win) {
  var ctx = { window: win || {}, Math: Math };
  vm.runInNewContext(SRC, ctx);
  return ctx.window.ACEDEncounter;
}

/* 1. Identity: explicit overrides, else pulled from ACEDNemesis.current(). */
(function () {
  var E1 = load({});
  var s = E1.start({ name: "The Test Wall", domain: "Testing", shield: 2, hp: 2 });
  assert.strictEqual(s.name, "The Test Wall", "explicit name used");
  assert.strictEqual(s.shieldMax, 2, "explicit shield used");
  assert.strictEqual(s.phase, "shield", "starts in shield phase");

  var E2 = load({ ACEDNemesis: { current: function () { return { name: "The LIFO Layer", epithet: "buries your cost", module: "F2.M3" }; } } });
  var s2 = E2.start();
  assert.strictEqual(s2.name, "The LIFO Layer", "identity pulled from ACEDNemesis.current()");
  assert.strictEqual(s2.domain, "F2.M3", "domain pulled from current()");
  console.log("PASS 1  identity resolution (explicit + ACEDNemesis)");
})();

/* 2. Safe card scores chips but does not touch the boss. */
(function () {
  var E = load({});
  E.start({ name: "X", domain: "d", shield: 3, hp: 5 });
  var r = E.resolve({ weak: false, correct: true });
  assert.strictEqual(r.event, "safe_score", "safe correct -> safe_score");
  assert.strictEqual(r.delta.shield, 0, "shield unchanged");
  assert.strictEqual(r.delta.hp, 0, "hp unchanged");
  assert.strictEqual(r.chipsGained > 0, true, "chips gained");
  console.log("PASS 2  safe card scores, no boss damage");
})();

/* 3. Weak correct breaks shield; last pip flips to the core phase. */
(function () {
  var E = load({});
  E.start({ name: "X", domain: "d", shield: 2, hp: 5 });
  var r1 = E.resolve({ weak: true, correct: true });
  assert.strictEqual(r1.event, "shield_break", "weak correct -> shield_break");
  assert.strictEqual(r1.shield, 1, "shield down to 1");
  assert.strictEqual(r1.phaseChange, false, "not yet core");
  var r2 = E.resolve({ weak: true, correct: true });
  assert.strictEqual(r2.shield, 0, "shield down to 0");
  assert.strictEqual(r2.phaseChange, true, "phase change on last pip");
  assert.strictEqual(r2.phase, "core", "now in core phase");
  console.log("PASS 3  shield break + phase change");
})();

/* 4. Once the shield is down, correct answers wound HP; HP 0 = win. */
(function () {
  var E = load({});
  E.start({ name: "X", domain: "d", shield: 1, hp: 2 });
  E.resolve({ weak: true, correct: true });          // break the only pip -> core
  var r1 = E.resolve({ weak: false, correct: true }); // any correct now wounds core
  assert.strictEqual(r1.event, "core_hit", "correct while core -> core_hit");
  assert.strictEqual(r1.hp, 1, "hp down to 1");
  assert.strictEqual(r1.outcome, null, "not over yet");
  var r2 = E.resolve({ weak: true, correct: true });
  assert.strictEqual(r2.hp, 0, "hp to 0");
  assert.strictEqual(r2.outcome, "win", "hp 0 -> win");
  assert.strictEqual(E.active(), false, "encounter inactive after win");
  assert.strictEqual(E.resolve({ weak: true, correct: true }), null, "resolve after end -> null");
  console.log("PASS 4  core hits + win outcome");
})();

/* 5. Wrong on its own topic re-armors it and raises menace; menace max = lose. */
(function () {
  var E = load({});
  E.start({ name: "X", domain: "d", shield: 1, hp: 5, menaceMax: 2 });
  E.resolve({ weak: true, correct: true });           // shield 1 -> 0
  var h = E.resolve({ weak: true, correct: false });  // whiff on its topic
  assert.strictEqual(h.event, "harden", "wrong weak -> harden");
  assert.strictEqual(h.shield, 1, "shield re-armored to 1");
  assert.strictEqual(h.menace, 1, "menace +1");
  var l = E.resolve({ weak: false, correct: false }); // menace -> 2 = max
  assert.strictEqual(l.event, "miss", "wrong normal -> miss");
  assert.strictEqual(l.outcome, "lose", "menace max -> lose");
  console.log("PASS 5  harden + menace + lose outcome");
})();

/* 6. Conviction commit doubles stakes (breaks 2 pips, double chips). */
(function () {
  var E = load({});
  E.start({ name: "X", domain: "d", shield: 3, hp: 5 });
  var safe = E.resolve({ weak: true, correct: true, commit: false });
  var baseChips = safe.chipsGained; // one weak break, no commit
  var r = E.resolve({ weak: true, correct: true, commit: true });
  assert.strictEqual(r.delta.shield, -2, "commit breaks two pips");
  assert.strictEqual(r.chipsGained, baseChips * 2, "commit doubles chips");
  assert.strictEqual(r.commit, true, "commit reflected");
  // commit on a NORMAL card is ignored (only meaningful on its topic)
  var E2 = load({}); E2.start({ name: "X", domain: "d", shield: 3, hp: 5 });
  var n = E2.resolve({ weak: false, correct: true, commit: true });
  assert.strictEqual(n.commit, false, "commit ignored on non-weak card");
  console.log("PASS 6  conviction commit doubles stakes");
})();

console.log("\nALL TESTS PASSED");
