/* ACED — aced-welcome.js
   ============================================================================
   Home page only. A signed-out visitor sees a sign-in screen first: one large
   SIGN IN button in the middle of the page, and a "Continue without signing in"
   link under it. Sign-in stays optional — the link opens the normal home page,
   and every other page still opens directly.

   Load in <head>, after aced-config.js, so the choice is made before the page
   is painted. The screen itself is plain markup in index.html (#aced-welcome);
   this file only adds or removes one class on <html>:

       <html class="aced-welcome-on">   -> the sign-in screen is shown

   The screen is NOT shown when:
     - no API is configured (accounts are off);
     - this browser already holds a session;
     - the visitor arrived from an emailed sign-in link (the confirm bar needs
       the normal page);
     - the visitor already chose "Continue without signing in" in this tab;
     - browser storage cannot be read (sign-in could not be kept anyway);
     - the account button script did not load (there would be no way to sign in).

   Only the NAME of the session key is checked. Its value is never read, kept
   or sent anywhere. The only thing written is a per-tab flag in session
   storage that remembers "Continue without signing in".
   ============================================================================ */
(function () {
  "use strict";
  if (typeof window === "undefined" || typeof document === "undefined" || !document) return;
  var root = document.documentElement;
  if (!root || !root.classList) return;

  var SESSION_KEY = "aced_session";            // written by aced-account.js
  var SKIP_KEY = "aced_welcome_skipped";       // per tab, value "1"
  var CLASS = "aced-welcome-on";

  function store(kind) { try { return window[kind + "Storage"] || null; } catch (e) { return null; } }
  function configured() { return typeof window.ACED_API_URL === "string" && !!window.ACED_API_URL.trim(); }
  // true / false, or null when storage cannot be read at all
  function hasSession() {
    try { var s = store("local"); if (!s) return null; return s.getItem(SESSION_KEY) ? true : false; } catch (e) { return null; }
  }
  function skipped() {
    try { var s = store("session"); return !!s && s.getItem(SKIP_KEY) === "1"; } catch (e) { return false; }
  }
  function fromEmailLink() {
    try { var h = String(window.location.hash || ""); return h.indexOf("signin=") >= 0 || h.indexOf("token=") >= 0; } catch (e) { return false; }
  }
  function shouldShow() {
    return configured() && hasSession() === false && !skipped() && !fromEmailLink();
  }
  function shown() { return root.classList.contains(CLASS); }
  function show() { root.classList.add(CLASS); }
  function hide() { root.classList.remove(CLASS); }

  // If session storage is blocked the screen simply shows again on the next home page visit.
  function rememberSkip() {
    try { var s = store("session"); if (s) s.setItem(SKIP_KEY, "1"); } catch (e) {}
  }
  function focusPage() {
    try {
      var main = document.querySelector("main");
      if (!main) return;
      if (!main.hasAttribute("tabindex")) main.setAttribute("tabindex", "-1");
      main.focus();
    } catch (e) {}
  }

  if (shouldShow()) show();

  function wire() {
    // No account button script: a sign-in screen with no way to sign in helps nobody.
    if (shown() && !window.ACEDAccountUI) { hide(); return; }
    var skip = document.getElementById("aced-welcome-skip");
    if (skip) skip.addEventListener("click", function (ev) {
      if (ev && ev.preventDefault) ev.preventDefault();
      rememberSkip();
      hide();
      focusPage();
    });
    // aced-account.js announces a confirmed sign-in with a name only (no address, no token).
    document.addEventListener("aced:account", function (ev) {
      var change = ev && ev.detail && ev.detail.change;
      if (change === "signed_in") hide();
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", wire);
  else wire();

  if (window.addEventListener) {
    // The emailed link usually opens in a new tab. When that tab signs in, this one follows.
    window.addEventListener("storage", function (ev) {
      if (!ev || ev.key === SESSION_KEY || ev.key === null) { if (hasSession() === true) hide(); }
    });
    // Coming back with the browser's Back button can restore an old copy of the page.
    window.addEventListener("pageshow", function () { if (shown() && hasSession() === true) hide(); });
  }

  window.ACEDWelcome = { shown: shown };
})();
