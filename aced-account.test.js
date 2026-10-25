/* aced-account.test.js — fragment-token sign-in containment (audit G3: #token= session fixation).
   Zero-dependency. Run: node aced-account.test.js   (exit 0 = all pass)

   A session token arriving in the URL fragment is accepted ONLY when it carries the
   one-time state this browser created when it asked for the sign-in link. A link
   crafted by someone else (login CSRF / session fixation) must be ignored, must not
   replace an existing session, and must always be scrubbed from the address bar. */
"use strict";
// Assertions never echo compared values: token fixtures must not appear in test output.
var nodeAssert = require("assert");
var assert = {
  strictEqual: function (a, b, msg) { if (a !== b) throw new Error(msg || "value mismatch"); },
  deepStrictEqual: function (a, b, msg) { try { nodeAssert.deepStrictEqual(a, b); } catch (e) { throw new Error(msg || "structure mismatch"); } },
  ok: function (v, msg) { if (!v) throw new Error(msg || "assertion failed"); }
};
var path = require.resolve("./aced-account.js");

// Synthetic three-part fixtures with the JWT shape only (not real or decodable tokens).
var JWT = ["fixture", "session", "one"].join(".");
var OTHER_JWT = ["fixture", "other", "two"].join(".");

function env(hash, mem) {
  mem = mem || {};
  var replaced = [];
  var storage = {
    getItem: function (k) { return Object.prototype.hasOwnProperty.call(mem, k) ? mem[k] : null; },
    setItem: function (k, v) { mem[k] = String(v); },
    removeItem: function (k) { delete mem[k]; }
  };
  global.window = { localStorage: storage, ACED_API_URL: "https://api.example.test", crypto: require("crypto").webcrypto };
  global.location = { hash: hash || "", search: "", pathname: "/", href: "https://app.example.test/" + (hash || "") };
  global.history = { replaceState: function (a, b, url) { replaced.push(url); global.location.hash = ""; } };
  delete require.cache[path];
  require("./aced-account.js");
  return { mem: mem, replaced: replaced, A: global.window.ACEDAccount };
}

var tests = [];
function test(name, fn) { tests.push({ name: name, fn: fn }); }

test("unsolicited #token= (no pending sign-in) is rejected and scrubbed", function () {
  var e = env("#token=" + OTHER_JWT);
  assert.strictEqual(e.mem.aced_session, undefined, "attacker token must not become the session");
  assert.deepStrictEqual(e.replaced, ["/"], "fragment must be removed from the address bar");
});

test("#token= with a forged state is rejected and does not replace an existing session", function () {
  var e = env("#token=" + OTHER_JWT + "&state=forgedforgedforgedforged00",
    { aced_session: JWT, aced_auth_state: JSON.stringify([{ s: "realrealrealrealrealreal00", exp: Date.now() + 60000 }]) });
  assert.strictEqual(e.mem.aced_session, JWT, "existing session kept");
  assert.deepStrictEqual(e.replaced, ["/"]);
});

test("#token= without state is rejected even when a sign-in is pending", function () {
  var e = env("#token=" + OTHER_JWT,
    { aced_auth_state: JSON.stringify([{ s: "realrealrealrealrealreal00", exp: Date.now() + 60000 }]) });
  assert.strictEqual(e.mem.aced_session, undefined);
});

test("expired pending state is rejected", function () {
  var st = "realrealrealrealrealreal00";
  var e = env("#token=" + JWT + "&state=" + st,
    { aced_auth_state: JSON.stringify([{ s: st, exp: Date.now() - 1 }]) });
  assert.strictEqual(e.mem.aced_session, undefined);
});

test("malformed token with a matching state is rejected", function () {
  var st = "realrealrealrealrealreal00";
  var e = env("#token=not-a-jwt&state=" + st,
    { aced_auth_state: JSON.stringify([{ s: st, exp: Date.now() + 60000 }]) });
  assert.strictEqual(e.mem.aced_session, undefined);
});

test("signIn sends a fresh state; the returning link with that state signs in once", function () {
  var e = env("");
  var sent = null;
  global.fetch = function (url, init) {
    sent = { url: String(url), body: JSON.parse(init.body) };
    return Promise.resolve({ status: 200, json: function () { return Promise.resolve({ ok: true }); } });
  };
  return e.A.signIn("someone@example.test").then(function () {
    assert.ok(/\/auth\/request$/.test(sent.url));
    assert.ok(/^[A-Za-z0-9_-]{22,128}$/.test(sent.body.state), "request carries a url-safe random state");
    var pending = JSON.parse(e.mem.aced_auth_state);
    assert.strictEqual(pending[pending.length - 1].s, sent.body.state, "state kept only in this browser");
    // The magic link lands back on the app (same browser, possibly a new tab).
    var back = env("#token=" + JWT + "&state=" + sent.body.state, e.mem);
    assert.strictEqual(back.mem.aced_session, JWT, "legitimate sign-in succeeds");
    assert.strictEqual(back.mem.aced_auth_state, undefined, "pending state is single-use");
    assert.deepStrictEqual(back.replaced, ["/"]);
    // Replaying the same link must not work again.
    delete back.mem.aced_session;
    var replay = env("#token=" + JWT + "&state=" + sent.body.state, back.mem);
    assert.strictEqual(replay.mem.aced_session, undefined, "state cannot be replayed");
  });
});

test("a page without #token= leaves an existing session alone", function () {
  var e = env("#pack=abc", { aced_session: JWT });
  assert.strictEqual(e.mem.aced_session, JWT);
  assert.deepStrictEqual(e.replaced, []);
});

(async function run() {
  var pass = 0, fail = 0;
  for (var i = 0; i < tests.length; i++) {
    try { await tests[i].fn(); pass++; }
    catch (err) { fail++; console.log("FAIL: " + tests[i].name + "\n  " + (err && err.message)); }
  }
  console.log("\naced-account.test.js: " + pass + " passed, " + fail + " failed");
  process.exit(fail ? 1 : 0);
})();
