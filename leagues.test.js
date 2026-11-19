/* leagues.test.js — the weekly league must say honestly whether its room is real.
   Zero-dependency. Run: node leagues.test.js  (exit 0 = all pass) */
"use strict";
var fs = require("fs"), path = require("path");
var modPath = require.resolve("./leagues.js");
function ok(v, msg) { if (!v) throw new Error(msg || "assertion failed"); }
function same(a, b, msg) { if (a !== b) throw new Error(msg || "value mismatch"); }

/* One page load. `signedIn` turns the backend on, as aced-account.js does after sign-in.
   `server` answers GET /leaderboard/league; POSTs are recorded and answered 404. */
function load(opts) {
  opts = opts || {};
  var mem = {}, calls = [];
  var store = { get: function (k, d) { return Object.prototype.hasOwnProperty.call(mem, k) ? mem[k] : d; }, set: function (k, v) { mem[k] = v; } };
  global.window = {
    ACED_API_URL: opts.api === undefined ? "https://api.example.test" : opts.api,
    ACEDCore: { store: store, backend: { isEnabled: function () { return !!opts.signedIn; } } },
    ACEDAccount: { token: function () { return opts.signedIn ? "fixture.session.value" : null; } }
  };
  global.ACEDCore = global.window.ACEDCore;
  global.ACEDAccount = global.window.ACEDAccount;
  global.localStorage = { length: 0, key: function () { return null; }, getItem: function () { return null; }, setItem: function () {} };
  global.fetch = function (url, init) {
    var method = (init && init.method) || "GET";
    calls.push(method + " " + String(url).replace(global.window.ACED_API_URL, "").split("?")[0]);
    if (method !== "GET") return Promise.resolve({ ok: false, status: 404, json: function () { return Promise.reject(new Error("not json")); } });
    if (opts.server === "network-error") return Promise.reject(new Error("offline"));
    return Promise.resolve(opts.server());
  };
  delete require.cache[modPath];
  require("./leagues.js");
  return { L: global.window.ACEDLeagues, calls: calls };
}
function reply(status, body) { return function () { return { ok: status >= 200 && status < 300, status: status, json: function () { return body === undefined ? Promise.reject(new Error("not json")) : Promise.resolve(body); } }; }; }

var tests = [];
function test(name, fn) { tests.push({ name: name, fn: fn }); }

test("signed out: simulated room, labelled solo, no network", function () {
  var e = load({ signedIn: false });
  return e.L.standings().then(function (s) {
    same(s.source, "solo");
    same(s.room.length, e.L.COHORT_SIZE, "a full simulated room");
    same(e.calls.length, 0, "no request");
  });
});

test("signed in, but the server has no league: still labelled solo, never live", function () {
  var cases = [
    reply(404),                                   // endpoint does not exist (HTML error page)
    reply(404, { error: "not found" }),
    reply(500, { error: "server error" }),
    reply(401, { error: "bad token" }),
    reply(200, {}),                               // answered, but with no room
    reply(200, { ok: true }),
    reply(200, { rows: "nope" }),
    reply(200, null),
    reply(200),                                   // not JSON
    "network-error"
  ];
  var chain = Promise.resolve();
  cases.forEach(function (server, i) {
    chain = chain.then(function () {
      var e = load({ signedIn: true, server: server });
      return e.L.standings().then(function (s) {
        same(s.source, "solo", "case " + i + ": must not claim a live league");
        same(s.room.length, e.L.COHORT_SIZE, "case " + i + ": falls back to the simulated room");
        ok(s.room.some(function (r) { return r.you; }), "case " + i + ": you are in the room");
      });
    });
  });
  return chain;
});

test("signed in and the server returns a room: labelled live, server tier adopted", function () {
  var e = load({ signedIn: true, server: reply(200, { rows: [{ name: "Ada", points: 90 }, { name: "Lin", points: 40 }], tier: "silver", you: { points: 55 } }) });
  return e.L.standings().then(function (s) {
    same(s.source, "server");
    same(s.room.length, 3, "server rows plus you");
    same(s.tier, "silver");
    same(s.rank, 2, "ranked among real rows");
  });
});

test("the page copy does not promise real opponents for signing in", function () {
  var html = fs.readFileSync(path.join(__dirname, "league.html"), "utf8");
  ok(/simulated pace-setters, not real players/.test(html), "solo room is called simulated");
  ok(!/Sign in[^"]*matched with real players/.test(html), "no promise that signing in matches real players");
  ok(/s\.source==="solo"/.test(html), "the label still follows the reported source");
});

(async function run() {
  var pass = 0, fail = 0;
  for (var i = 0; i < tests.length; i++) {
    try { await tests[i].fn(); pass++; }
    catch (err) { fail++; console.log("FAIL: " + tests[i].name + "\n  " + (err && err.message)); }
  }
  console.log("\nleagues.test.js: " + pass + " passed, " + fail + " failed");
  process.exit(fail ? 1 : 0);
})();
