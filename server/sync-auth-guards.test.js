/* server/sync-auth-guards.test.js — zero-dependency tests for the sync pack and sign-in state guards.
   Run:  node server/sync-auth-guards.test.js   (exit 0 = all pass) */
"use strict";
const { syncPackId, cleanAuthState, magicLinkUrl, sessionRedirectUrl } = require("./sync-auth-guards");
let pass = 0, fail = 0;
function eq(actual, expected, name) {
  const a = JSON.stringify(actual), e = JSON.stringify(expected);
  if (a === e) { pass++; } else { fail++; console.log("FAIL: " + name); }
}

// --- pack scoping (audit G1) ---
eq(syncPackId({ query: {}, body: {} }), { error: "pack_required" }, "no pack -> rejected, never defaults to world-capitals");
eq(syncPackId({ query: {} }), { error: "pack_required" }, "GET without ?pack= -> rejected");
eq(syncPackId({ query: { pack: "cpa-far" } }), { pack: "cpa-far" }, "query pack accepted");
eq(syncPackId({ query: {}, body: { pack: "cpa-far" } }), { pack: "cpa-far" }, "body pack accepted (older clients)");
eq(syncPackId({ query: { pack: "cpa-far" }, body: { pack: "cpa-far" } }), { pack: "cpa-far" }, "matching query and body accepted");
eq(syncPackId({ query: { pack: "cpa-far" }, body: { pack: "world-capitals" } }), { error: "pack_mismatch" }, "conflicting packs rejected");
eq(syncPackId({ query: { pack: "!!!" } }), { error: "pack_required" }, "pack that sanitises to empty rejected");
eq(syncPackId({ query: { pack: ["a", "b"] } }), { error: "pack_required" }, "array pack rejected");
eq(syncPackId({ query: { pack: "My.Pack_1-x" } }), { pack: "My.Pack_1-x" }, "sanitisation unchanged: existing pack keys preserved");
eq(syncPackId({ query: { pack: "cpa far" } }), { pack: "cpafar" }, "sanitisation unchanged: same stripping as before");

// --- sign-in state (audit G3) ---
const good = "AbCdEfGhIjKlMnOpQrStUv_-09";
eq(cleanAuthState(good), good, "url-safe 26-char state accepted");
eq(cleanAuthState(undefined), null, "missing state rejected");
eq(cleanAuthState("short"), null, "short state rejected");
eq(cleanAuthState("a".repeat(129)), null, "overlong state rejected");
eq(cleanAuthState("abc&token=xyzabcdefghijklmnop"), null, "state cannot inject URL parameters");
eq(cleanAuthState({ s: good }), null, "non-string state rejected");
eq(magicLinkUrl("https://api.example.test", "ab12", good),
  "https://api.example.test/auth/verify?token=ab12&state=" + good, "magic link carries state");
eq(sessionRedirectUrl("https://app.example.test", "h.p.s", good),
  "https://app.example.test/#token=h.p.s&state=" + good, "redirect fragment carries state");

console.log("\nsync-auth-guards.test.js: " + pass + " passed, " + fail + " failed");
process.exit(fail ? 1 : 0);
