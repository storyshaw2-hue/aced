/* aced-welcome.test.js — the home page's sign-in-first screen (aced-welcome.js).
   Zero-dependency, with a small fake page. Run: node aced-welcome.test.js  (exit 0 = all pass)
   The screen is one class on <html>; these tests check when it is added and removed, that
   sign-in stays optional, and that nothing but a per-tab "skipped" flag is ever written. */
"use strict";
var fs = require("fs"), path = require("path");
var modPath = require.resolve("./aced-welcome.js");
var SOURCE = fs.readFileSync(modPath, "utf8");
var HOME = fs.readFileSync(path.join(__dirname, "index.html"), "utf8");
function ok(v, msg) { if (!v) throw new Error(msg || "assertion failed"); }
function same(a, b, msg) { if (a !== b) throw new Error(msg || "value mismatch"); }

var CLASS = "aced-welcome-on";
function storage(initial, opts) {
  opts = opts || {};
  var data = Object.assign({}, initial || {}), log = { reads: [], writes: [] };
  return {
    _data: data, _log: log,
    getItem: function (k) { if (opts.throws) throw new Error("blocked"); log.reads.push(k); return Object.prototype.hasOwnProperty.call(data, k) ? data[k] : null; },
    setItem: function (k, v) { if (opts.throws || opts.readOnly) throw new Error("blocked"); log.writes.push(k); data[k] = String(v); },
    removeItem: function (k) { delete data[k]; }
  };
}
/* One page load. opts: api, session (truthy = signed in), skipped, hash, readyState,
   noUI (account button script missing), localThrows, noLocal, sessionThrows. */
function load(opts) {
  opts = opts || {};
  var classes = {}, docListeners = {}, winListeners = {}, skipListeners = [], focused = { main: 0 };
  var root = { classList: {
    add: function (c) { classes[c] = true; }, remove: function (c) { delete classes[c]; },
    contains: function (c) { return classes[c] === true; } } };
  var mainAttrs = {};
  var main = { hasAttribute: function (k) { return k in mainAttrs; }, setAttribute: function (k, v) { mainAttrs[k] = String(v); }, focus: function () { focused.main++; } };
  var skip = { addEventListener: function (t, fn) { if (t === "click") skipListeners.push(fn); } };
  var doc = {
    documentElement: root, readyState: opts.readyState || "loading",
    getElementById: function (id) { return id === "aced-welcome-skip" && !opts.noSkipLink ? skip : null; },
    querySelector: function (sel) { if (sel !== "main") throw new Error("unexpected selector"); return main; },
    addEventListener: function (t, fn) { (docListeners[t] = docListeners[t] || []).push(fn); }
  };
  var local = opts.noLocal ? null : storage(opts.session ? { aced_session: "opaque-session-value" } : {}, { throws: opts.localThrows });
  var session = storage(opts.skipped ? { aced_welcome_skipped: "1" } : {}, { throws: opts.sessionThrows });
  var win = {
    location: { hash: opts.hash || "" },
    addEventListener: function (t, fn) { (winListeners[t] = winListeners[t] || []).push(fn); }
  };
  Object.defineProperty(win, "localStorage", { get: function () { if (opts.localGetterThrows) throw new Error("denied"); return local; } });
  Object.defineProperty(win, "sessionStorage", { get: function () { return session; } });
  if (opts.api !== null) win.ACED_API_URL = opts.api === undefined ? "https://api.example.test" : opts.api;
  if (!opts.noUI) win.ACEDAccountUI = { refresh: function () {} };
  global.window = win; global.document = doc;
  delete require.cache[modPath];
  require("./aced-welcome.js");
  var page = {
    win: win, local: local, session: session, focused: focused, mainAttrs: mainAttrs,
    on: function () { return root.classList.contains(CLASS); },
    ready: function () { (docListeners.DOMContentLoaded || []).forEach(function (fn) { fn(); }); },
    hasReadyListener: function () { return !!(docListeners.DOMContentLoaded || []).length; },
    clickSkip: function () { var prevented = 0; skipListeners.forEach(function (fn) { fn({ preventDefault: function () { prevented++; } }); }); return prevented; },
    skipWired: function () { return skipListeners.length; },
    announce: function (change) { (docListeners["aced:account"] || []).forEach(function (fn) { fn({ detail: { change: change } }); }); },
    storageEvent: function (ev) { (winListeners.storage || []).forEach(function (fn) { fn(ev); }); },
    pageshow: function () { (winListeners.pageshow || []).forEach(function (fn) { fn({}); }); }
  };
  return page;
}

var tests = [];
function test(name, fn) { tests.push({ name: name, fn: fn }); }

test("signed-out visitor with accounts on: the sign-in screen shows before the page is ready", function () {
  var p = load();
  ok(p.on(), "class is set while the document is still loading");
  ok(p.hasReadyListener(), "wiring waits for the document");
  p.ready();
  ok(p.on(), "still shown once the page is ready");
  same(p.skipWired(), 1, "the skip link is wired once");
  same(p.win.ACEDWelcome.shown(), true, "ACEDWelcome.shown() reports it");
});

test("accounts off: no sign-in screen", function () {
  ok(!load({ api: null }).on(), "no API URL");
  ok(!load({ api: "" }).on(), "empty API URL");
  ok(!load({ api: "   " }).on(), "blank API URL");
  ok(!load({ api: 42 }).on(), "non-string API URL");
});

test("already signed in: no sign-in screen", function () {
  var p = load({ session: true });
  ok(!p.on(), "not shown");
  p.ready();
  ok(!p.on(), "not shown after ready");
});

test("arriving from an emailed link: the normal page shows, so the confirm bar is usable", function () {
  ok(!load({ hash: "#signin=abc123" }).on(), "sign-in code in the address");
  ok(!load({ hash: "#x=1&signin=abc123" }).on(), "sign-in code after another value");
  ok(!load({ hash: "#token=abc" }).on(), "older token links");
  ok(load({ hash: "#pricing" }).on(), "an ordinary anchor does not suppress the screen");
});

test("Continue without signing in: hides the screen, moves focus to the page and is remembered for the tab", function () {
  var p = load();
  p.ready();
  same(p.clickSkip(), 1, "default action prevented");
  ok(!p.on(), "screen hidden");
  same(p.focused.main, 1, "focus moved to the main content");
  same(p.mainAttrs.tabindex, "-1", "main made focusable without joining the tab order");
  same(p.session._data.aced_welcome_skipped, "1", "skip remembered in session storage");
  var again = load({ skipped: true });
  ok(!again.on(), "a later home page visit in the same tab does not show the screen again");
});

test("skip still works when session storage is blocked", function () {
  var p = load({ sessionThrows: true });
  ok(p.on(), "shown");
  p.ready();
  p.clickSkip();
  ok(!p.on(), "hidden even though the flag could not be saved");
});

test("a confirmed sign-in hides the screen; a sign-out does not bring it back mid-visit", function () {
  var p = load();
  p.ready();
  p.announce("signed_out");
  ok(p.on(), "unrelated announcement leaves it shown");
  p.announce("signed_in");
  ok(!p.on(), "hidden after sign-in");
  p.announce("signed_out");
  ok(!p.on(), "signing out from the account dialog does not cover the page again");
});

test("another tab signs in (emailed link opened in a new tab): this tab follows", function () {
  var p = load();
  p.ready();
  p.storageEvent({ key: "some_other_key" });
  ok(p.on(), "other keys are ignored");
  p.storageEvent({ key: "aced_session" });
  ok(p.on(), "still shown while there is no session");
  p.local._data.aced_session = "opaque-session-value";
  p.storageEvent({ key: "aced_session" });
  ok(!p.on(), "hidden once the session exists");
  var q = load(); q.ready();
  q.local._data.aced_session = "opaque-session-value";
  q.storageEvent({ key: null });
  ok(!q.on(), "a storage clear/replace event is rechecked too");
});

test("coming back with the Back button after signing in elsewhere hides the screen", function () {
  var p = load();
  p.ready();
  p.pageshow();
  ok(p.on(), "still shown while signed out");
  p.local._data.aced_session = "opaque-session-value";
  p.pageshow();
  ok(!p.on(), "hidden when a session now exists");
});

test("storage cannot be read: no sign-in screen (a session could not be kept anyway)", function () {
  ok(!load({ localThrows: true }).on(), "getItem throws");
  ok(!load({ noLocal: true }).on(), "no local storage object");
  ok(!load({ localGetterThrows: true }).on(), "reading the storage object throws");
});

test("account button script missing: the screen is withdrawn instead of showing a dead button", function () {
  var p = load({ noUI: true });
  ok(p.on(), "shown first");
  p.ready();
  ok(!p.on(), "withdrawn once the page is ready");
  same(p.skipWired(), 0, "nothing else wired");
  same(Object.keys(p.session._data).length, 0, "not recorded as a skip");
});

test("already-parsed document: wiring runs immediately", function () {
  var p = load({ readyState: "complete" });
  ok(p.on(), "shown");
  ok(!p.hasReadyListener(), "no ready listener needed");
  same(p.skipWired(), 1, "skip wired");
});

test("the session value is never read into the page, and only the skip flag is written", function () {
  var p = load({ session: true });
  p.ready();
  ok(p.local._log.reads.every(function (k) { return k === "aced_session"; }), "only the session key is looked at");
  same(p.local._log.writes.length, 0, "nothing written to local storage");
  var q = load(); q.ready(); q.clickSkip();
  same(q.local._log.writes.length, 0, "skip writes nothing to local storage");
  same(q.session._log.writes.join(","), "aced_welcome_skipped", "skip writes one flag to session storage");
  ok(SOURCE.indexOf("opaque") < 0 && !/fetch\(|XMLHttpRequest|sendBeacon|innerHTML|document\.cookie/.test(SOURCE), "no network, markup or cookie use in the source");
  ok(!/atob\(|JSON\.parse|\.split\(/.test(SOURCE), "the session is not decoded");
});

test("missing or minimal environments do not throw", function () {
  var savedW = global.window, savedD = global.document;
  try {
    global.window = undefined; global.document = undefined;
    delete require.cache[modPath]; require("./aced-welcome.js");
    global.window = {}; global.document = { documentElement: null };
    delete require.cache[modPath]; require("./aced-welcome.js");
    global.window = {}; global.document = { documentElement: {} };
    delete require.cache[modPath]; require("./aced-welcome.js");
  } finally { global.window = savedW; global.document = savedD; }
});

test("index.html: screen markup, script order and the optional-sign-in promises", function () {
  var head = HOME.slice(0, HOME.indexOf("</head>")), body = HOME.slice(HOME.indexOf("<body"));
  var cfg = head.search(/<script src="aced-config\.js(\?v=\d+)?"><\/script>/), wel = head.indexOf('<script src="aced-welcome.js"></script>');
  ok(cfg > 0 && wel > cfg, "config then welcome script, both in <head>");
  same((HOME.match(/<script src="aced-config\.js/g) || []).length, 1, "config is loaded once");
  var start = body.indexOf('<section id="aced-welcome"'), end = body.indexOf("</section>", start);
  ok(start > 0 && end > start && start < body.indexOf("<header"), "screen is the first thing in <body>");
  var screen = body.slice(start, end);
  ok(/<button type="button" class="welcome-btn" data-aced-account>SIGN IN<\/button>/.test(screen), "one large SIGN IN button, handled by the account script");
  ok(/<button type="button" class="welcome-skip" id="aced-welcome-skip">Continue without signing in<\/button>/.test(screen), "a way in without signing in");
  ok(screen.indexOf("sign-in is optional") > 0, "says sign-in is optional");
  ok(/<a href="privacy\.html">/.test(screen), "links to how the email is used");
  ok(screen.indexOf("welcome-btn") < screen.indexOf("welcome-skip"), "sign-in comes before the skip link");
  ok(!/sync|save|progress|device/i.test(screen.replace(/<[^>]+>/g, " ")), "makes no sync or saving claims");
  ok(HOME.indexOf("#aced-welcome{display:none}") > 0, "hidden unless the class is set");
  ok(/html\.aced-welcome-on body>\*:not\(#aced-welcome\):not\(\.aced-acct-dialog\):not\(#aced-signin-confirm\):not\(#aced-signin-notice\)\{display:none!important\}/.test(HOME),
    "the rest of the page is hidden, but not the sign-in dialog or the sign-in bars");
  ok(HOME.indexOf("FREE &middot; NO SIGNUP") > 0, "the no-signup promise is still on the home page");
  // No other page shows the screen: every other page still opens directly.
  fs.readdirSync(__dirname).filter(function (f) { return /\.html$/.test(f) && f !== "index.html"; }).forEach(function (f) {
    ok(fs.readFileSync(path.join(__dirname, f), "utf8").indexOf("aced-welcome") < 0, f + " does not load the sign-in screen");
  });
});

(async function run() {
  var pass = 0, fail = 0;
  for (var i = 0; i < tests.length; i++) {
    try { await tests[i].fn(); pass++; }
    catch (err) { fail++; console.log("FAIL: " + tests[i].name + "\n  " + (err && err.message)); }
  }
  console.log("\naced-welcome.test.js: " + pass + " passed, " + fail + " failed");
  process.exit(fail ? 1 : 0);
})();
