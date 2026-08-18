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
