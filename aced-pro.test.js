/* Node tests for aced-pro.js — no framework, plain asserts, async-aware runner. */
var assert = require("assert");
var fs = require("fs");
var vm = require("vm");

var SRC = fs.readFileSync(__dirname + "/aced-pro.js", "utf8");

function fakeCoreStore() {
  var m = {}, track = [];
  var core = {
    store: {
      get: function (k, fb) { return Object.prototype.hasOwnProperty.call(m, k) ? JSON.parse(m[k]) : fb; },
      set: function (k, v) { m[k] = JSON.stringify(v); }
    },
    analytics: { track: function (e, p) { track.push([e, p]); } }
  };
  return { core: core, _m: m, _track: track };
}
function load(win) {
  var ctx = { window: win || {}, Date: Date, Math: Math, Promise: Promise,
              URLSearchParams: (typeof URLSearchParams !== "undefined" ? URLSearchParams : undefined) };
  vm.runInNewContext(SRC, ctx);
  return ctx.window.ACEDPro;
}

/* 1. Ships inert: everyone free; pro features locked; free/unknown allowed; quotas enforced. */
function t1() {
  var P = load({ ACEDCore: fakeCoreStore().core });
  assert.strictEqual(P.isPro(), false, "free by default");
  assert.strictEqual(P.has("cloud_sync"), false, "pro feature locked");
  assert.strictEqual(P.has("play"), true, "unknown feature is free");
  assert.strictEqual(P.has("builder_publish"), true, "publishing stays free (flywheel)");
  assert.strictEqual(P.withinLimit("savedPacks", 9), true, "under free cap");
  assert.strictEqual(P.withinLimit("savedPacks", 10), false, "at free cap");
  assert.strictEqual(P.remaining("savedPacks", 7), 3, "remaining computed");
  console.log("PASS 1  inert by default: gates locked, quotas enforced");
}

/* 2. Grant unlocks everything; revoke re-locks. */
function t2() {
  var P = load({ ACEDCore: fakeCoreStore().core });
  P.grant({ plan: "lifetime", source: "test" });
  assert.strictEqual(P.isPro(), true, "pro after grant");
  assert.strictEqual(P.has("cloud_sync"), true, "pro feature unlocked");
  assert.strictEqual(P.withinLimit("savedPacks", 9999), true, "no cap for pro");
  assert.strictEqual(P.remaining("savedPacks", 9999), Infinity, "unlimited remaining");
  P.revoke();
  assert.strictEqual(P.isPro(), false, "free again after revoke");
  assert.strictEqual(P.has("cloud_sync"), false, "feature re-locked");
  console.log("PASS 2  grant unlocks / revoke re-locks");
}

/* 3. Expiry is honored. */
function t3() {
  var P = load({ ACEDCore: fakeCoreStore().core });
  P.grant({ plan: "monthly", expires: Date.now() - 1000 });
  assert.strictEqual(P.isPro(), false, "expired grant is not pro");
  P.grant({ plan: "monthly", expires: Date.now() + 60000 });
  assert.strictEqual(P.isPro(), true, "future expiry is pro");
  console.log("PASS 3  expiry honored");
}

/* 4. require()/guardSave() fire the upsell only when locked, and return the gate result. */
function t4() {
  var P = load({ ACEDCore: fakeCoreStore().core });
  var seen = [];
  P.onUpsell(function (info) { seen.push(info); });

  assert.strictEqual(P.require("advanced_analytics"), false, "locked feature -> false");
  assert.strictEqual(seen.length, 1, "upsell fired once");
  assert.strictEqual(seen[0].feature, "advanced_analytics", "upsell carries the feature");
  assert.strictEqual(Array.isArray(seen[0].plans), true, "upsell carries plans");

  assert.strictEqual(P.guardSave("savedPacks", 10, null), false, "at cap -> false + upsell");
  assert.strictEqual(seen[seen.length - 1].cap, 10, "quota upsell carries the cap");

  P.grant({ plan: "lifetime" });
  var before = seen.length;
  assert.strictEqual(P.require("advanced_analytics"), true, "unlocked -> true, no upsell");
  assert.strictEqual(P.guardSave("savedPacks", 10, null), true, "pro ignores cap");
  assert.strictEqual(seen.length, before, "no upsell fired when allowed");
  console.log("PASS 4  require/guardSave gate + upsell behavior");
}

/* 5. Verifier seam sets entitlement from a check (async + sync). */
function t5() {
  var P = load({ ACEDCore: fakeCoreStore().core });
  P.setVerifier(function () { return Promise.resolve(true); });
  return P.verify().then(function (ok) {
    assert.strictEqual(ok, true, "verify true -> pro");
    assert.strictEqual(P.isPro(), true, "state reflects verify");
    P.setVerifier(function () { return false; }); // sync verifier also fine
    return P.verify();
  }).then(function (ok2) {
    assert.strictEqual(ok2, false, "verify false -> not pro");
    assert.strictEqual(P.isPro(), false, "state downgraded");
    console.log("PASS 5  verifier seam (async + sync)");
  });
}

/* 6. Checkout seam: uses a wired processor if present, else surfaces a no-processor upsell. */
function t6() {
  var P = load({ ACEDCore: fakeCoreStore().core });
  var seen = [];
  P.onUpsell(function (info) { seen.push(info); });

  P.startCheckout("monthly"); // no processor wired
  assert.strictEqual(seen.length, 1, "no processor -> one upsell");
  assert.strictEqual(seen[0].noProcessor, true, "upsell carries noProcessor flag");

  var called = null;
  P.setCheckout(function (plan) { called = plan; return "redirected"; });
  var r = P.startCheckout("lifetime");
  assert.strictEqual(called, "lifetime", "wired checkout receives the plan");
  assert.strictEqual(r, "redirected", "checkout return value passed through");
  console.log("PASS 6  checkout seam (unwired vs wired)");
}

/* 7. Entitlement persists across reload via the shared store. */
function t7() {
  var cs = fakeCoreStore();
  var P = load({ ACEDCore: cs.core });
  P.grant({ plan: "lifetime", source: "test" });
  var P2 = load({ ACEDCore: cs.core });
  assert.strictEqual(P2.isPro(), true, "pro persisted across reload");
  console.log("PASS 7  entitlement persists");
}

async function main() {
  t1(); t2(); t3(); t4(); t6(); t7();
  await t5();
  console.log("\nALL TESTS PASSED");
}
main().catch(function (e) { console.error(e); process.exit(1); });
