/* aced-account.test.js — fragment-token sign-in containment (audit G3: #token= session fixation).
   Zero-dependency. Run: node aced-account.test.js   (exit 0 = all pass)

   A session token arriving in the URL fragment is accepted ONLY when it carries the
   one-time state this browser created when it asked for the sign-in link. A link that
   cannot be completed here (crafted by someone else, opened in another browser, expired
   or malformed) must be refused, must not replace an existing session, must not trigger
   a progress upload, must always be scrubbed from the address bar, and must show one
   neutral message that reveals nothing about the link, account or email. */
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
var STATE = "realrealrealrealrealreal00";
var FORGED = "forgedforgedforgedforged00";
var EMAIL = "someone@example.test";
function pending(s, ttl) { return JSON.stringify([{ s: s, exp: Date.now() + (ttl == null ? 60000 : ttl) }]); }

/* Minimal DOM: enough for the notice (createElement, textContent, attributes, insert/remove). */
function fakeDocument(withBody) {
  var listeners = {};
  function el(tag) {
    var n = { tagName: String(tag).toUpperCase(), children: [], attrs: {}, style: {}, textContent: "", parentNode: null, id: "" };
    n.setAttribute = function (k, v) { n.attrs[k] = String(v); };
    n.getAttribute = function (k) { return Object.prototype.hasOwnProperty.call(n.attrs, k) ? n.attrs[k] : null; };
    n.appendChild = function (c) { c.parentNode = n; n.children.push(c); return c; };
    n.insertBefore = function (c, ref) { c.parentNode = n; var i = n.children.indexOf(ref); if (i < 0) n.children.push(c); else n.children.splice(i, 0, c); return c; };
    n.removeChild = function (c) { var i = n.children.indexOf(c); if (i >= 0) n.children.splice(i, 1); c.parentNode = null; return c; };
    Object.defineProperty(n, "firstChild", { get: function () { return n.children[0] || null; } });
    return n;
  }
  function find(n, pred) { if (pred(n)) return n; for (var i = 0; i < n.children.length; i++) { var r = find(n.children[i], pred); if (r) return r; } return null; }
  var doc = {
    body: withBody === false ? null : el("body"),
    createElement: el,
    getElementById: function (id) { return doc.body ? find(doc.body, function (x) { return x.id === id; }) : null; },
    addEventListener: function (t, fn) { (listeners[t] = listeners[t] || []).push(fn); },
    _fire: function (t) { (listeners[t] || []).forEach(function (fn) { fn(); }); },
    _find: function (pred) { return doc.body ? find(doc.body, pred) : null; },
    _text: function (n) { var s = n.textContent || ""; n.children.forEach(function (c) { s += " " + doc._text(c); }); return s; },
    _el: el
  };
  return doc;
}

/* Fresh page load of aced-account.js with the given fragment, storage, search and DOM.
   A stub ACEDCore records every backend/sync call so uploads can be asserted. */
function env(hash, mem, opts) {
  opts = opts || {};
  mem = mem || {};
  var replaced = [], coreCalls = [], logs = [];
  var storage = {
    getItem: function (k) { return Object.prototype.hasOwnProperty.call(mem, k) ? mem[k] : null; },
    setItem: function (k, v) { mem[k] = String(v); },
    removeItem: function (k) { delete mem[k]; }
  };
  var core = {
    backend: { configure: function () { coreCalls.push("configure"); }, isEnabled: function () { return true; } },
    sync: {
      isEnabled: function () { return true; },
      push: function () { coreCalls.push("push"); return Promise.resolve({}); },
      pull: function () { coreCalls.push("pull"); return Promise.resolve({ applied: false }); }
    }
  };
  var search = opts.search || "";
  global.window = { localStorage: storage, ACED_API_URL: "https://api.example.test", crypto: require("crypto").webcrypto, ACEDCore: core };
  global.ACEDCore = core;
  global.location = { hash: hash || "", search: search, pathname: "/", href: "https://app.example.test/" + search + (hash || "") };
  global.history = { replaceState: function (a, b, url) { replaced.push(url); global.location.hash = ""; } };
  global.document = opts.document === undefined ? fakeDocument() : opts.document;
  var saved = {};
  ["log", "info", "warn", "error", "debug"].forEach(function (k) {
    saved[k] = console[k];
    console[k] = function () { logs.push(Array.prototype.join.call(arguments, " ")); };
  });
  try {
    delete require.cache[path];
    require("./aced-account.js");
  } finally {
    Object.keys(saved).forEach(function (k) { console[k] = saved[k]; });
  }
  return { mem: mem, replaced: replaced, coreCalls: coreCalls, logs: logs, doc: global.document, A: global.window.ACEDAccount };
}
function notice(e) { return e.doc && e.doc._find(function (n) { return n.id === "aced-signin-notice"; }); }
// Let any promise chains started by the page load finish before asserting on them.
function settle() { return new Promise(function (r) { setTimeout(r, 0); }); }
function assertRefused(e, label) {
  assert.ok(e.A.signInNotice(), label + ": refusal must expose the neutral notice");
  var n = notice(e);
  assert.ok(n, label + ": notice must be shown on the page");
  assert.strictEqual(n.getAttribute("role"), "alert", label + ": notice is announced to assistive tech");
  assert.strictEqual(e.replaced.length, 1, label + ": fragment must be scrubbed");
  return settle().then(function () {
    assert.deepStrictEqual(e.coreCalls, [], label + ": a refused link must not configure sync or upload progress");
  });
}

var tests = [];
function test(name, fn) { tests.push({ name: name, fn: fn }); }

test("missing browser state: link is refused, scrubbed and explained", function () {
  var e = env("#token=" + OTHER_JWT + "&state=" + STATE);
  assert.strictEqual(e.mem.aced_session, undefined, "token must not become the session");
  return assertRefused(e, "missing state");
});

test("mismatched browser state: link is refused", function () {
  var e = env("#token=" + OTHER_JWT + "&state=" + FORGED, { aced_auth_state: pending(STATE) });
  assert.strictEqual(e.mem.aced_session, undefined);
  assert.ok(e.mem.aced_auth_state, "the genuine pending sign-in is kept for its own link");
  return assertRefused(e, "mismatched state");
});

test("state missing from the link while a sign-in is pending is refused", function () {
  var e = env("#token=" + OTHER_JWT, { aced_auth_state: pending(STATE) });
  assert.strictEqual(e.mem.aced_session, undefined);
  return assertRefused(e, "no state in link");
});

test("expired pending state is refused", function () {
  var e = env("#token=" + JWT + "&state=" + STATE, { aced_auth_state: pending(STATE, -1) });
  assert.strictEqual(e.mem.aced_session, undefined);
  return assertRefused(e, "expired");
});

test("malformed token with a matching state is refused", function () {
  var e = env("#token=not-a-jwt&state=" + STATE, { aced_auth_state: pending(STATE) });
  assert.strictEqual(e.mem.aced_session, undefined);
  return assertRefused(e, "malformed");
});

test("existing session is preserved after a refused link, and no progress is uploaded", function () {
  var e = env("#token=" + OTHER_JWT + "&state=" + FORGED, { aced_session: JWT, aced_auth_state: pending(STATE) });
  assert.strictEqual(e.mem.aced_session, JWT, "existing session kept");
  assert.ok(e.A.isSignedIn(), "still signed in");
  return assertRefused(e, "existing session");
});

test("control: an existing session with no link still syncs (so the no-upload check is meaningful)", function () {
  var e = env("", { aced_session: JWT });
  return e.A.ready().then(function () {
    assert.deepStrictEqual(e.coreCalls, ["configure", "push", "pull"], "normal page load pushes then pulls");
    assert.strictEqual(e.A.signInNotice(), null);
    assert.strictEqual(notice(e), null);
  });
});

test("valid same-browser state signs in, clears state, shows no notice, then syncs", function () {
  var e = env("#token=" + JWT + "&state=" + STATE, { aced_auth_state: pending(STATE) });
  assert.strictEqual(e.mem.aced_session, JWT, "legitimate sign-in succeeds");
  assert.strictEqual(e.mem.aced_auth_state, undefined, "pending state is single-use");
  assert.strictEqual(e.A.signInNotice(), null, "no failure notice");
  assert.strictEqual(notice(e), null);
  return e.A.ready().then(function () {
    assert.deepStrictEqual(e.coreCalls, ["configure", "push", "pull"], "the new session syncs as before");
  });
});

test("URL authentication material is removed and the rest of the URL is kept", function () {
  var e = env("#token=" + OTHER_JWT + "&state=" + FORGED, {}, { search: "?pack=world-capitals" });
  assert.deepStrictEqual(e.replaced, ["/?pack=world-capitals"], "token and state removed, path and query kept");
  assert.strictEqual(global.location.hash, "", "no fragment left");
  var ok = env("#token=" + JWT + "&state=" + STATE, { aced_auth_state: pending(STATE) });
  assert.deepStrictEqual(ok.replaced, ["/"], "scrubbed on success too");
});

test("the notice is neutral: identical for every cause and free of token, state and email", function () {
  var causes = [
    env("#token=" + OTHER_JWT + "&state=" + STATE),
    env("#token=" + OTHER_JWT + "&state=" + FORGED, { aced_auth_state: pending(STATE) }),
    env("#token=" + JWT + "&state=" + STATE, { aced_auth_state: pending(STATE, -1) }),
    env("#token=not-a-jwt&state=" + STATE, { aced_auth_state: pending(STATE) })
  ];
  var first = causes[0].A.signInNotice();
  causes.forEach(function (e, i) {
    var msg = e.A.signInNotice();
    assert.strictEqual(msg, first, "cause " + i + ": same message regardless of why the link failed");
    var shown = e.doc._text(notice(e));
    [JWT, OTHER_JWT, STATE, FORGED, EMAIL, "not-a-jwt"].forEach(function (secret) {
      assert.ok(msg.indexOf(secret) < 0 && shown.indexOf(secret) < 0, "cause " + i + ": message must not contain link or account data");
    });
    assert.ok(msg.indexOf("@") < 0, "no email-like text");
  });
  assert.ok(/same browser/i.test(first) && /new sign-in link/i.test(first), "tells the user what to do");
});

test("the notice is built with text nodes only and can be dismissed", function () {
  var e = env("#token=" + OTHER_JWT + "&state=" + FORGED);
  var n = notice(e);
  var usedHtml = e.doc._find(function (x) { return Object.prototype.hasOwnProperty.call(x, "innerHTML"); });
  assert.strictEqual(usedHtml, null, "no innerHTML");
  var btn = e.doc._find(function (x) { return x.tagName === "BUTTON"; });
  assert.ok(btn && typeof btn.onclick === "function", "dismiss button present");
  btn.onclick();
  assert.strictEqual(notice(e), null, "dismiss removes the notice");
  assert.ok(n && n.parentNode === null);
});

test("the notice waits for the page body when the script loads early", function () {
  var doc = fakeDocument(false);
  var e = env("#token=" + OTHER_JWT + "&state=" + FORGED, {}, { document: doc });
  assert.ok(e.A.signInNotice(), "refusal recorded immediately");
  doc.body = doc._el("body");
  doc._fire("DOMContentLoaded");
  assert.ok(notice(e), "notice rendered once the body exists");
});

test("no DOM available: refusal still works without throwing", function () {
  var e = env("#token=" + OTHER_JWT + "&state=" + FORGED, {}, { document: null });
  assert.strictEqual(e.mem.aced_session, undefined);
  assert.ok(e.A.signInNotice());
  return settle().then(function () { assert.deepStrictEqual(e.coreCalls, []); });
});

test("nothing is logged on refusal, success or sign-in request", function () {
  var refused = env("#token=" + OTHER_JWT + "&state=" + FORGED);
  var ok = env("#token=" + JWT + "&state=" + STATE, { aced_auth_state: pending(STATE) });
  assert.deepStrictEqual(refused.logs, [], "no console output on refusal");
  assert.deepStrictEqual(ok.logs, [], "no console output on success");
});

test("signIn sends a fresh state; the returning link with that state signs in once", function () {
  var e = env("");
  var sent = null;
  global.fetch = function (url, init) {
    sent = { url: String(url), body: JSON.parse(init.body) };
    return Promise.resolve({ status: 200, json: function () { return Promise.resolve({ ok: true }); } });
  };
  return e.A.signIn(EMAIL).then(function () {
    assert.ok(/\/auth\/request$/.test(sent.url));
    assert.ok(/^[A-Za-z0-9_-]{22,128}$/.test(sent.body.state), "request carries a url-safe random state");
    var p = JSON.parse(e.mem.aced_auth_state);
    assert.strictEqual(p[p.length - 1].s, sent.body.state, "state kept only in this browser");
    var back = env("#token=" + JWT + "&state=" + sent.body.state, e.mem);
    assert.strictEqual(back.mem.aced_session, JWT, "legitimate sign-in succeeds");
    assert.strictEqual(back.mem.aced_auth_state, undefined, "pending state is single-use");
    delete back.mem.aced_session;
    var replay = env("#token=" + JWT + "&state=" + sent.body.state, back.mem);
    assert.strictEqual(replay.mem.aced_session, undefined, "state cannot be replayed");
    assert.ok(replay.A.signInNotice(), "replay is refused with the neutral notice");
  });
});

test("a page without #token= leaves an existing session alone and shows nothing", function () {
  var e = env("#pack=abc", { aced_session: JWT });
  assert.strictEqual(e.mem.aced_session, JWT);
  assert.deepStrictEqual(e.replaced, []);
  assert.strictEqual(e.A.signInNotice(), null);
  assert.strictEqual(notice(e), null);
});

(async function run() {
  var pass = 0, fail = 0;
  for (var i = 0; i < tests.length; i++) {
    try { await tests[i].fn(); pass++; }
    catch (err) { fail++; console.log("FAIL: " + tests[i].name + "\n  " + (err && err.message)); }
    await settle();   // isolate tests: no async work from one page load leaks into the next
  }
  console.log("\naced-account.test.js: " + pass + " passed, " + fail + " failed");
  process.exit(fail ? 1 : 0);
})();
