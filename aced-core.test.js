/* Canonical question-ID identity + review migration tests (Copilot part 2, item 8). Run: node aced-core.test.js */
"use strict";
var assert = require("assert");
var _mem = {};
global.localStorage = { getItem: function (k) { return k in _mem ? _mem[k] : null; }, setItem: function (k, v) { _mem[k] = String(v); }, removeItem: function (k) { delete _mem[k]; } };
global.window = {};
require("./aced-core.js");
var C = window.window && window.window.ACEDCore ? window.window.ACEDCore : window.ACEDCore;

// 1. canonical id wins over stem hash
assert.strictEqual(C.qKey({ id: "cpa-far-f1m1-abc12345", source: "F1.M1", q: "Original wording" }), "cpa-far-f1m1-abc12345");
// 2. editing the stem does NOT change identity
assert.strictEqual(C.qKey({ id: "x1", source: "F1.M1", q: "Original wording" }), C.qKey({ id: "x1", source: "F1.M1", q: "Improved wording" }));
// 3. legacy questions (no id) still work via the fallback
var lq = { source: "F1.M1", q: "Legacy question" };
assert.strictEqual(C.qKey(lq), C.legacyQKey(lq));
// 4. migration moves an old stem-hash record onto the canonical id, preserving history
var q = { id: "cpa-far-f1m1-abc12345", source: "F1.M1", q: "Legacy question" };
var oldKey = C.legacyQKey(q);
C.store.set("review", (function () { var o = {}; o[oldKey] = { seen: 4, miss: 2, ok: 2, box: 1, last: 1000, src: "F1.M1" }; return o; })());
var res = C.review.migrateIds([q]);
var rv = C.store.get("review", {});
assert.strictEqual(res.migrated, 1);
assert.strictEqual(rv[oldKey], undefined);
assert.strictEqual(rv[q.id].seen, 4);
assert.strictEqual(rv[q.id].miss, 2);
// 5. migration is idempotent (won't double-run) but may run for another pack later
var second = C.review.migrateIds([q]);
assert.strictEqual(second.migrated, 0);
assert.strictEqual(second.reason, "complete");
// A global migration flag must not block a second pack's legacy history.
var q2 = { id: "cpa-aud-a1-new-id", source: "AUD.A1", q: "Second pack legacy question" };
var oldKey2 = C.legacyQKey(q2);
var all = C.store.get("review", {});
all[oldKey2] = { seen: 2, miss: 1, ok: 1, box: 1, last: 2000, src: "AUD.A1" };
C.store.set("review", all);
var third = C.review.migrateIds([q2]);
assert.strictEqual(third.migrated, 1);
assert.ok(C.store.get("review", {})[q2.id], "second pack record migrated");
// 6. record() now keys by canonical id
_mem["review"] = "{}";
_mem["reviewCanonicalIdsV1"] = "";  delete _mem["reviewCanonicalIdsV1"];
C.review.record({ id: "cpa-reg-r1-deadbeef", source: "R1", q: "whatever" }, true);
assert.ok(C.store.get("review", {})["cpa-reg-r1-deadbeef"], "record keyed by id");
console.log("aced-core.test.js: all 7 canonical-ID tests passed");

// Topic labels are authored data, including names inherited by ordinary objects.
C.calibration.record({ confidence: "HIGH", correct: true, source: "__proto__" });
C.calibration.record({ confidence: "MED", correct: false, source: "constructor" });
assert.ok(Object.prototype.hasOwnProperty.call(C.store.get("calib", {}).byModule, "__proto__"));
assert.strictEqual({}.n, undefined, "authored topic names must not mutate Object.prototype");
assert.ok(Number.isFinite(C.calibration.summary().accuracy));
console.log("aced-core.test.js: authored-topic prototype safety passed");

// ---- Cross-pack sync containment (audit G1) ----
// A signed-in pull must ask the server for THIS page's pack and must never apply another
// pack's state into this pack's local namespace. Runs a fresh core instance with ?pack=cpa-far.
(function crossPackSyncTests() {
  var path = require.resolve("./aced-core.js");
  var prevCore = window.ACEDCore;
  delete require.cache[path];
  global.location = { search: "?pack=cpa-far", hash: "", pathname: "/study.html" };
  require("./aced-core.js");
  var P = window.ACEDCore;
  window.ACEDCore = prevCore;
  delete global.location;
  delete require.cache[path];

  var calls = [], reply = null;
  global.fetch = function (url, init) {
    calls.push({ url: String(url), init: init || {} });
    return Promise.resolve({ json: function () { return Promise.resolve(reply); } });
  };
  P.backend.configure({ endpoint: "https://api.example.test", token: "t" });
  P.store.set("mastery", { "F1.M1": 7 });

  function done(name) { console.log("aced-core.test.js: " + name); }
  Promise.resolve()
    .then(function () {
      reply = { v: 1, pack: "cpa-far", updatedAt: 0, data: {} };
      return P.sync.pull().then(function () {
        var u = calls[calls.length - 1].url;
        assert.ok(/\/state\?pack=cpa-far$/.test(u), "pull must request this page's pack");
        done("pull requests ?pack= for the current pack");
      });
    })
    .then(function () {
      return P.sync.push().then(function () {
        var c = calls[calls.length - 1];
        assert.ok(/\/sync\?pack=cpa-far$/.test(c.url), "push must name this page's pack");
        assert.strictEqual(JSON.parse(c.init.body).pack, "cpa-far");
        done("push names the current pack");
      });
    })
    .then(function () {
      reply = { v: 1, pack: "world-capitals", updatedAt: 9000, data: { mastery: { "Europe": 99 } } };
      return P.sync.pull().then(function (r) {
        assert.strictEqual(r.applied, false, "another pack's state must not be applied");
        assert.strictEqual(r.reason, "pack-mismatch");
        assert.deepStrictEqual(P.store.get("mastery", null), { "F1.M1": 7 }, "local progress preserved");
        done("pull rejects another pack's state and preserves local progress");
      });
    })
    .then(function () {
      reply = { v: 1, updatedAt: 9001, data: { mastery: { "Europe": 99 } } };
      return P.sync.pull().then(function (r) {
        assert.strictEqual(r.applied, false, "state without a pack id must not be applied");
        assert.deepStrictEqual(P.store.get("mastery", null), { "F1.M1": 7 });
        done("pull rejects state that does not name a pack");
      });
    })
    .then(function () {
      var fresh = Date.now() + 60000;   // newer than the lastSyncApplied recorded by the first pull
      reply = { v: 1, pack: "cpa-far", updatedAt: fresh, data: { mastery: { "F1.M1": 9 }, lastSyncApplied: 0, unknownKey: 1 } };
      return P.sync.pull().then(function (r) {
        assert.strictEqual(r.applied, true, "same-pack state still applies");
        assert.deepStrictEqual(P.store.get("mastery", null), { "F1.M1": 9 });
        assert.strictEqual(P.store.get("lastSyncApplied", 0), fresh, "bookkeeping keys are not overwritten by remote data");
        assert.strictEqual(P.store.get("unknownKey", null), null, "only synced keys are written");
        done("same-pack pull still applies, limited to synced keys");
      });
    })
    .catch(function (e) { console.error("FAIL: " + (e && e.message)); process.exit(1); });
})();
