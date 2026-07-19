/* Node tests for nemesis.js v8 — no framework, plain asserts.
   Verifies (a) subject-agnostic naming and (b) that the ported HP/spawn/defeat
   logic still behaves exactly like v7.1. */
var assert = require("assert");
var fs = require("fs");
var vm = require("vm");

var SRC = fs.readFileSync(__dirname + "/nemesis.js", "utf8");

function makeCore(review) {
  var m = { review: review || {} };
  var core = { store: {
    get: function (k, fb) { return Object.prototype.hasOwnProperty.call(m, k) ? m[k] : fb; },
    set: function (k, v) { m[k] = v; }
  } };
  return { core: core, _m: m };
}
function load(win, globals) {
  // In a browser, window IS the global object, so the module's `ACEDCore` and
  // `window.ACEDCore` are one and the same. Replicate that here by mirroring
  // any globals onto the vm context too.
  var ctx = { window: win || {}, Date: Date, Math: Math };
  if (globals) { for (var k in globals) { if (globals.hasOwnProperty(k)) ctx[k] = globals[k]; } }
  vm.runInNewContext(SRC, ctx);
  return ctx.window.ACEDNemesis;
}
var ACCOUNTING = ["lifo", "goodwill", "accrual", "ledger", "far", "cpa", "deferred", "eps"];

/* 1. Procedural names work for arbitrary subjects: readable, deterministic, neutral. */
(function () {
  var N = load({});
  ["Cell Biology", "Spanish Verbs", "photosynthesis", "French Revolution"].forEach(function (domain) {
    var a = N.nameFor(domain), b = N.nameFor(domain);
    assert.strictEqual(typeof a[0] === "string" && a[0].length > 0, true, domain + ": has a name");
    assert.strictEqual(typeof a[1] === "string" && a[1].length > 0, true, domain + ": has an epithet");
    assert.deepStrictEqual(a, b, domain + ": name is deterministic");
    var low = (a[0] + " " + a[1]).toLowerCase();
    ACCOUNTING.forEach(function (w) { assert.strictEqual(low.indexOf(w) === -1, true, domain + ": no accounting word '" + w + "'"); });
  });
  // a salient word from the label should surface in the name
  assert.strictEqual(/biology|cell/i.test(N.nameFor("Cell Biology")[0]), true, "name reflects the domain");
  console.log("PASS 1  procedural names: any subject, deterministic, neutral");
})();

/* 2. Opaque codes fall back to a generic villain (no digits, no subject words). */
(function () {
  var N = load({});
  var nm = N.nameFor("F2.M3"); // a code with no readable word
  assert.strictEqual(/\d/.test(nm[0]), false, "generic villain has no digits");
  assert.strictEqual(nm[0].length > 0, true, "generic villain is non-empty");
  console.log("PASS 2  opaque codes -> clean generic villain");
})();

/* 3. Optional pack-supplied names override generation for matching keys only. */
(function () {
  var N = load({ ACED_BOSS_NAMES: { "custom.key": ["The Test Lord", "tests you"] } });
  assert.deepStrictEqual(N.nameFor("custom.key"), ["The Test Lord", "tests you"], "supplied name used");
  assert.notDeepStrictEqual(N.nameFor("some.other"), ["The Test Lord", "tests you"], "other keys still generated");
  // setNames() at runtime also works
  N.setNames({ "z": ["The Z", "z"] });
  assert.deepStrictEqual(N.nameFor("z"), ["The Z", "z"], "setNames applied");
  console.log("PASS 3  optional supplied names override generation");
})();

/* 4. Ported logic intact: spawn from worst domain, weaken, defeat at net 0. */
(function () {
  var review = {
    q1: { src: "Cell Biology", miss: 3, ok: 0, box: 1 },
    q2: { src: "Cell Biology", miss: 2, ok: 0, box: 1 },
    q3: { src: "Spanish",      miss: 1, ok: 0 }
  };
  var core = makeCore(review);
  var N = load({ ACEDCore: core.core }, { ACEDCore: core.core });

  var n = N.sync(); // worst domain: Cell Biology, net = 5 >= THRESHOLD(3)
  assert.strictEqual(n && n.module, "Cell Biology", "spawns on worst domain");
  assert.strictEqual(N.hp(n), 5, "hp = net misses = 5");
  assert.strictEqual(N.maxHp(n) >= 5, true, "maxHp tracks spawn strength");

  // an audit on a different domain does nothing to this boss
  assert.strictEqual(N.onAudit("Spanish", true), null, "wrong-domain audit is a no-op");

  // still alive while net > 0
  var mid = N.onAudit("Cell Biology", true);
  assert.strictEqual(mid.defeated, false, "alive while net > 0");
  assert.strictEqual(mid.hp, 5, "reports current hp");

  // player recovers the domain (caller records review first): net -> 0
  core._m.review.q1.ok += 5; // (3+2) miss - (5) ok = 0 net
  var end = N.onAudit("Cell Biology", true);
  assert.strictEqual(end.defeated, true, "defeated at net 0");
  assert.strictEqual(end.hp, 0, "hp 0 on defeat");
  assert.strictEqual(N.defeatCount(), 1, "defeat recorded");
  assert.strictEqual(N.current(), null, "no active nemesis after defeat (net 0)");
  console.log("PASS 4  spawn / weaken / defeat logic intact");
})();

console.log("\nALL TESTS PASSED");
