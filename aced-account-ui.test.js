/* aced-account-ui.test.js — the home page account button, dialog and signed-in message.
   Zero-dependency, with a small fake DOM. Run: node aced-account-ui.test.js  (exit 0 = all pass)
   Assertions never echo compared values: fixtures must not appear in test output. */
"use strict";
var fs = require("fs"), path = require("path");
var modPath = require.resolve("./aced-account-ui.js");
var SOURCE = fs.readFileSync(modPath, "utf8");
function ok(v, msg) { if (!v) throw new Error(msg || "assertion failed"); }
function same(a, b, msg) { if (a !== b) throw new Error(msg || "value mismatch"); }

var EMAIL = "someone@example.test";
var MARKUP_EMAIL = "<img src=x onerror=alert(1)>@example.test";

function fakeDom() {
  function node(tag) {
    var n = { tagName: String(tag).toUpperCase(), children: [], attrs: {}, listeners: {}, style: {}, textContent: "", className: "", id: "",
      parentNode: null, hidden: false, disabled: false, value: "", type: "", open: false, focused: 0 };
    n.setAttribute = function (k, v) { n.attrs[k] = String(v); if (k === "hidden") n.hidden = true; if (k === "open") n.open = true; };
    n.getAttribute = function (k) { return Object.prototype.hasOwnProperty.call(n.attrs, k) ? n.attrs[k] : null; };
    n.hasAttribute = function (k) { return Object.prototype.hasOwnProperty.call(n.attrs, k); };
    n.removeAttribute = function (k) { delete n.attrs[k]; if (k === "hidden") n.hidden = false; if (k === "open") n.open = false; };
    n.appendChild = function (c) { if (c.parentNode) c.parentNode.removeChild(c); c.parentNode = n; n.children.push(c); return c; };
    n.insertBefore = function (c, ref) { c.parentNode = n; var i = ref ? n.children.indexOf(ref) : -1; if (i < 0) n.children.push(c); else n.children.splice(i, 0, c); return c; };
    n.removeChild = function (c) { var i = n.children.indexOf(c); if (i >= 0) n.children.splice(i, 1); c.parentNode = null; return c; };
    n.addEventListener = function (t, fn) { (n.listeners[t] = n.listeners[t] || []).push(fn); };
    n.focus = function () { n.focused++; doc.activeElement = n; };
    Object.defineProperty(n, "firstChild", { get: function () { return n.children[0] || null; } });
    Object.defineProperty(n, "nextSibling", { get: function () { if (!n.parentNode) return null; var s = n.parentNode.children; return s[s.indexOf(n) + 1] || null; } });
    if (n.tagName === "DIALOG") {
      n.showModal = function () { n.open = true; n.modal = true; };
      n.close = function () { n.open = false; };
    }
    return n;
  }
  function find(n, pred) { if (pred(n)) return n; for (var i = 0; i < n.children.length; i++) { var r = find(n.children[i], pred); if (r) return r; } return null; }
  var listeners = {};
  var doc = {
    activeElement: null,
    head: node("head"), body: node("body"),
    createElement: node,
    createTextNode: function (t) { var n = node("#text"); n.textContent = String(t); return n; },
    getElementById: function (id) { return find(doc.head, function (x) { return x.id === id; }) || find(doc.body, function (x) { return x.id === id; }); },
    querySelector: function (sel) {
      if (sel === "[data-aced-account]") return find(doc.body, function (x) { return x.hasAttribute("data-aced-account"); });
      if (sel === "header") return find(doc.body, function (x) { return x.tagName === "HEADER"; });
      throw new Error("unexpected selector");
    },
    addEventListener: function (t, fn) { (listeners[t] = listeners[t] || []).push(fn); },
    dispatchEvent: function (ev) { (listeners[ev.type] || []).forEach(function (fn) { fn(ev); }); return true; },
    _listeners: listeners, _find: function (pred) { return find(doc.body, pred); }
  };
  doc.documentElement = doc.body;
  return doc;
}
function text(n) { var s = n.textContent || ""; n.children.forEach(function (c) { s += " " + text(c); }); return s; }
function fire(n, type, ev) { (n.listeners[type] || []).forEach(function (fn) { fn(ev || { preventDefault: function () {} }); }); }
function settle() { return new Promise(function (r) { setTimeout(r, 0); }); }

/* One page load. `opts.account` overrides the ACEDAccount stub; `opts.api` sets ACED_API_URL. */
function load(opts) {
  opts = opts || {};
  var doc = fakeDom();
  var header = doc.createElement("header");
  var button = doc.createElement("button");
  button.setAttribute("data-aced-account", "");
  button.setAttribute("hidden", "");
  if (!opts.noButton) header.appendChild(button);
  doc.body.appendChild(header);
  var main = doc.createElement("main");
  doc.body.appendChild(main);
  var state = { signedIn: !!opts.signedIn, email: opts.email === undefined ? EMAIL : opts.email, held: !!opts.held, signInCalls: [], signOutCalls: 0 };
  var account = opts.noAccount ? undefined : {
    isSignedIn: function () { return state.signedIn; },
    email: function () { return state.signedIn ? state.email : null; },
    syncHeld: function () { return state.held; },
    signIn: function (v) { state.signInCalls.push(v); return opts.signIn ? opts.signIn(v) : Promise.resolve({ ok: true }); },
    signOut: function () { state.signOutCalls++; state.signedIn = false; return Promise.resolve({ ok: true }); }
  };
  var winListeners = {};
  global.document = doc;
  global.window = { ACEDAccount: account, addEventListener: function (t, fn) { (winListeners[t] = winListeners[t] || []).push(fn); } };
  if (opts.api !== null) global.window.ACED_API_URL = opts.api === undefined ? "https://api.example.test" : opts.api;
  delete require.cache[modPath];
  require("./aced-account-ui.js");
  return {
    doc: doc, button: button, header: header, main: main, state: state, winListeners: winListeners,
    dialog: function () { return doc.getElementById("aced-acct-dialog"); },
    notice: function () { return doc.getElementById("aced-signedin-notice"); },
    title: function () { var t = doc.getElementById("aced-acct-title"); return t ? t.textContent : null; },
    status: function () { var t = doc.getElementById("aced-acct-status"); return t ? t.textContent : null; },
    input: function () { return doc.getElementById("aced-acct-email"); },
    form: function () { return doc._find(function (n) { return n.tagName === "FORM"; }); },
    btn: function (label) { return doc._find(function (n) { return n.tagName === "BUTTON" && n.textContent === label && !n.hasAttribute("data-aced-account"); }); },
    announce: function (change) { doc.dispatchEvent({ type: "aced:account", detail: { change: change } }); }
  };
}
function submit(p, value) { p.input().value = value; fire(p.form(), "submit"); return settle(); }

var tests = [];
function test(name, fn) { tests.push({ name: name, fn: fn }); }

/* ---------- stays out of the way ---------- */
test("no API configured: the button stays hidden and nothing is added to the page", function () {
  [null, "", "   "].forEach(function (api) {
    var p = load({ api: api });
    ok(p.button.hidden && p.button.hasAttribute("hidden"), "button still hidden");
    same((p.button.listeners.click || []).length, 0, "no click handler");
    same(p.doc.head.children.length, 0, "no style injected");
    same(Object.keys(p.doc._listeners).length, 0, "no document listeners");
  });
});

test("no ACEDAccount, or no button on the page: does nothing", function () {
  var a = load({ noAccount: true });
  ok(a.button.hidden, "hidden without ACEDAccount");
  same(a.doc.head.children.length, 0);
  var b = load({ noButton: true });
  same(b.doc.head.children.length, 0, "nothing injected without a button");
});

/* ---------- button ---------- */
test("the button is shown and labelled for the current state", function () {
  var out = load({ signedIn: false });
  ok(!out.button.hidden && !out.button.hasAttribute("hidden"), "visible");
  same(out.button.textContent, "SIGN IN");
  same(out.button.getAttribute("aria-haspopup"), "dialog");
  var inn = load({ signedIn: true });
  same(inn.button.textContent, "ACCOUNT");
  ok(inn.button.getAttribute("aria-label").indexOf(EMAIL) < 0, "address is not placed in the button label");
});

/* ---------- sign-in dialog ---------- */
test("signed out: the button opens a labelled modal dialog with the email field focused", function () {
  var p = load();
  fire(p.button, "click");
  var d = p.dialog();
  ok(d && d.open && d.modal, "opened as a modal");
  same(d.getAttribute("aria-labelledby"), "aced-acct-title");
  same(p.title(), "SIGN IN");
  same(p.doc.activeElement, p.input(), "email field focused");
  same(p.input().type, "email");
  same(p.input().getAttribute("autocomplete"), "email");
  var privacy = p.doc._find(function (n) { return n.tagName === "A" && n.getAttribute("href") === "privacy.html"; });
  ok(privacy, "links to the privacy policy");
  ok(/Optional/.test(text(d)), "says sign-in is optional");
});

test("an invalid address is refused locally and never sent", function () {
  var p = load();
  fire(p.button, "click");
  return submit(p, "not-an-address").then(function () {
    same(p.state.signInCalls.length, 0, "no request");
    same(p.status(), "Enter a valid email address.");
    same(p.title(), "SIGN IN", "dialog unchanged");
  });
});

test("an accepted request shows the check-your-email view; the address is trimmed", function () {
  var p = load();
  fire(p.button, "click");
  return submit(p, "  " + EMAIL + "  ").then(function () {
    same(p.state.signInCalls.length, 1, "one request");
    same(p.state.signInCalls[0], EMAIL, "trimmed");
    same(p.title(), "CHECK YOUR EMAIL");
    ok(text(p.dialog()).indexOf(EMAIL) < 0, "the address is not echoed back");
    same(p.button.textContent, "SIGN IN", "not signed in until the link is confirmed");
  });
});

test("a refusal or failure never shows check-your-email, and the form can be used again", function () {
  var cases = [
    [function () { return Promise.resolve({ error: "too_many_link_requests" }); }, /Too many/],
    [function () { return Promise.resolve({ error: "too_many_auth_attempts" }); }, /Too many/],
    [function () { return Promise.resolve({ error: "rate_limited" }); }, /Too many/],
    [function () { return Promise.resolve({ error: "invalid email" }); }, /valid email/],
    [function () { return Promise.resolve({ error: "server error" }); }, /Could not send/],
    [function () { return Promise.resolve({}); }, /Could not send/],
    [function () { return Promise.resolve({ ok: "true" }); }, /Could not send/],
    [function () { return Promise.resolve(null); }, /Could not send/],
    [function () { return Promise.reject(new Error("offline")); }, /Could not send/],
    [function () { throw new Error("sync throw"); }, /Could not send/]
  ];
  var chain = Promise.resolve();
  cases.forEach(function (c, i) {
    chain = chain.then(function () {
      var p = load({ signIn: c[0] });
      fire(p.button, "click");
      return submit(p, EMAIL).then(function () {
        same(p.title(), "SIGN IN", "case " + i + ": still the sign-in view");
        ok(c[1].test(p.status()), "case " + i + ": message shown");
        var send = p.btn("SEND LINK");
        ok(send && send.disabled === false, "case " + i + ": send is usable again");
      });
    });
  });
  return chain;
});

test("a second submit while the first is pending sends nothing more", function () {
  var release;
  var p = load({ signIn: function () { return new Promise(function (r) { release = r; }); } });
  fire(p.button, "click");
  p.input().value = EMAIL;
  fire(p.form(), "submit"); fire(p.form(), "submit"); fire(p.form(), "submit");
  same(p.state.signInCalls.length, 1, "one request while pending");
  ok(p.btn("SENDING...").disabled === true, "send disabled while pending");
  release({ ok: true });
  return settle().then(function () { same(p.title(), "CHECK YOUR EMAIL"); });
});

test("CANCEL closes the dialog and returns focus to the button", function () {
  var p = load();
  fire(p.button, "click");
  fire(p.btn("CANCEL"), "click");
  ok(!p.dialog().open, "closed");
  same(p.doc.activeElement, p.button, "focus restored");
});

/* ---------- account dialog ---------- */
test("signed in: the dialog shows the address as text and offers sign out", function () {
  var p = load({ signedIn: true });
  fire(p.button, "click");
  same(p.title(), "ACCOUNT");
  var b = p.doc._find(function (n) { return n.tagName === "B"; });
  same(b && b.textContent, EMAIL, "address shown");
  ok(p.btn("SIGN OUT") && p.btn("CLOSE"), "sign out and close offered");
  ok(p.doc._find(function (n) { return n.tagName === "A" && n.getAttribute("href") === "study.html"; }), "links to the game");
  ok(!/saved|synced|backed up/i.test(text(p.dialog())), "makes no claim that progress was saved or synced");
});

test("a session with no readable address still shows a signed-in dialog", function () {
  var p = load({ signedIn: true, email: null });
  fire(p.button, "click");
  ok(/Signed in on this device\./.test(text(p.dialog())), "generic signed-in line");
});

test("SIGN OUT signs out once, relabels the button and says play continues", function () {
  var p = load({ signedIn: true });
  fire(p.button, "click");
  fire(p.btn("SIGN OUT"), "click");
  same(p.state.signOutCalls, 1, "signOut called once");
  same(p.button.textContent, "SIGN IN");
  same(p.title(), "SIGNED OUT");
  ok(/Play continues on this device/.test(text(p.dialog())), "says play continues");
  ok(text(p.dialog()).indexOf(EMAIL) < 0, "address no longer shown");
});

/* ---------- signed-in message ---------- */
test("a signed_in announcement shows the message under the header and relabels the button", function () {
  var p = load({ signedIn: false });
  fire(p.button, "click");                      // the check-your-email dialog may still be open
  p.state.signedIn = true;
  p.announce("signed_in");
  var n = p.notice();
  ok(n, "message shown");
  same(n.getAttribute("role"), "status");
  same(n.children[0].textContent, "You're signed in as " + EMAIL + ".");
  same(n.parentNode, p.doc.body, "in the page flow");
  same(p.header.nextSibling, n, "directly under the header, not over it");
  same(p.button.textContent, "ACCOUNT");
  ok(!p.dialog().open, "an open dialog is closed");
});

test("the message is honest about held sync and about a missing address", function () {
  var held = load({ signedIn: true, held: true });
  held.announce("signed_in");
  ok(/Sync is paused here/.test(held.notice().children[0].textContent), "held sync is stated");
  var anon = load({ signedIn: true, email: null });
  anon.announce("signed_in");
  same(anon.notice().children[0].textContent, "You're signed in.");
});

test("no message unless a session really exists; never on an ordinary page load", function () {
  var p = load({ signedIn: true });
  ok(!p.notice(), "not shown just because the visitor is already signed in");
  var q = load({ signedIn: false });
  q.announce("signed_in");
  ok(!q.notice(), "an announcement without a session shows nothing");
  same(q.button.textContent, "SIGN IN");
});

test("the message can be dismissed, is not duplicated, and goes away on sign-out", function () {
  var p = load({ signedIn: true });
  p.announce("signed_in"); p.announce("signed_in");
  same(p.doc.body.children.filter(function (c) { return c.id === "aced-signedin-notice"; }).length, 1, "one message");
  fire(p.notice().children[1], "click");
  ok(!p.notice(), "dismissed");
  p.announce("signed_in");
  p.state.signedIn = false;
  p.announce("signed_out");
  ok(!p.notice(), "removed on sign-out");
  same(p.button.textContent, "SIGN IN");
});

test("a session change in another tab relabels the button", function () {
  var p = load({ signedIn: false });
  p.state.signedIn = true;
  (p.winListeners.storage || []).forEach(function (fn) { fn({ key: "aced_session" }); });
  same(p.button.textContent, "ACCOUNT");
  p.state.signedIn = false;
  (p.winListeners.storage || []).forEach(function (fn) { fn({ key: "some_other_key" }); });
  same(p.button.textContent, "ACCOUNT", "unrelated keys are ignored");
  (p.winListeners.storage || []).forEach(function (fn) { fn({ key: "aced_session" }); });
  same(p.button.textContent, "SIGN IN");
});

/* ---------- containment ---------- */
test("an address containing markup only ever becomes text", function () {
  var p = load({ signedIn: true, email: MARKUP_EMAIL });
  p.announce("signed_in");
  fire(p.button, "click");
  ok(!p.doc._find(function (n) { return n.tagName === "IMG"; }), "no element was created from the address");
  same(p.doc._find(function (n) { return n.tagName === "B"; }).textContent, MARKUP_EMAIL, "verbatim as text");
});

test("the source never parses markup and never touches the session, code or pending state", function () {
  var code = SOURCE.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
  ["innerHTML", "outerHTML", "insertAdjacentHTML", "document.write", "DOMParser", "eval(", "new Function"].forEach(function (s) {
    ok(code.indexOf(s) < 0, "must not use " + s);
  });
  ["localStorage", "sessionStorage", "getItem", "setItem", "aced_auth_state", ".token(", "location.hash", "fetch(", "XMLHttpRequest", "console."].forEach(function (s) {
    ok(code.indexOf(s) < 0, "must not use " + s);
  });
});

test("the home page loads the button and script in the right order", function () {
  var html = fs.readFileSync(path.join(__dirname, "index.html"), "utf8");
  same((html.match(/data-aced-account/g) || []).length, 1, "one account button");
  ok(/<button type="button" class="chip" data-aced-account hidden>/.test(html), "button is hidden until the script decides");
  var a = html.indexOf('<script src="aced-account.js"></script>'), b = html.indexOf('<script src="aced-account-ui.js"></script>');
  ok(a > 0 && b > a, "aced-account-ui.js loads after aced-account.js");
  ok(html.indexOf("FREE &middot; NO SIGNUP") > 0, "the no-signup promise is still on the page");
});

(async function run() {
  var pass = 0, fail = 0;
  for (var i = 0; i < tests.length; i++) {
    try { await tests[i].fn(); pass++; }
    catch (err) { fail++; console.log("FAIL: " + tests[i].name + "\n  " + (err && err.message)); }
  }
  console.log("\naced-account-ui.test.js: " + pass + " passed, " + fail + " failed");
  process.exit(fail ? 1 : 0);
})();
