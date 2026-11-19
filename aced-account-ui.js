/* ACED — aced-account-ui.js
   ============================================================================
   The account button for pages that are not the game: Home, Daily, Leagues and
   Library. The game page (study.html) keeps its own, fuller account menu.

   Markup:  <button type="button" data-aced-account hidden></button>
   Load AFTER aced-account.js. The button stays hidden, and this file does nothing
   else, unless an API is configured (aced-config.js) and ACEDAccount is present.

   A page that redraws its own menu (daily.html) calls ACEDAccountUI.refresh()
   after each redraw; clicks are handled on the document, so a redrawn button
   keeps working.

   What it does:
     - labels the button SIGN IN or ACCOUNT;
     - signed out: a dialog that asks for an email and requests a sign-in link;
     - signed in: a dialog that shows the address and offers SIGN OUT;
     - after an emailed link is confirmed in this browser, a one-line
       "You're signed in" message (aced-account.js announces the change).

   Every node is built with createElement/textContent. No markup strings are
   parsed, so an address or server reply can never become HTML. Nothing here
   reads or stores the session, the sign-in code or the pending state.
   ============================================================================ */
(function () {
  "use strict";
  if (typeof window === "undefined" || typeof document === "undefined" || !document) return;
  var A = window.ACEDAccount;
  if (!A || !document.querySelectorAll) return;
  if (typeof window.ACED_API_URL !== "string" || !window.ACED_API_URL.trim()) return;
  var SELECTOR = "[data-aced-account]";
  var lastButton = null;                         // the button that opened the dialog
  function buttons() { try { return Array.prototype.slice.call(document.querySelectorAll(SELECTOR)); } catch (e) { return []; } }

  var EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;       // same shape check as the game page
  var COPY = {
    signInTitle: "SIGN IN",
    signInIntro: "Optional. ACED plays without an account. Enter your email and we'll send a one-time sign-in link \u2014 no password. Open the link in this same browser.",
    scope: "Sign-in can sync study progress between devices. Packs you build stay in this browser.",
    emailLabel: "Email address",
    send: "SEND LINK",
    sending: "SENDING...",
    cancel: "CANCEL",
    close: "CLOSE",
    privacy: "How your email is used",
    invalid: "Enter a valid email address.",
    limited: "Too many sign-in requests. Wait a while before asking for another link.",
    failed: "Could not send the link. Try again in a moment.",
    sentTitle: "CHECK YOUR EMAIL",
    sent: "Check your email for your sign-in link. Open it in this browser, then choose Sign in. The link works once and expires in 15 minutes.",
    sentHelp: "Nothing after a few minutes? Check spam, then request a new link.",
    accountTitle: "ACCOUNT",
    signedInAs: "Signed in as ",
    signedInNoEmail: "Signed in on this device.",
    accountHelp: "Sync runs from the game. For sync status and leaderboard options, open ACCOUNT in the game's top bar.",
    openGame: "Open the game",
    signOut: "SIGN OUT",
    signedOutTitle: "SIGNED OUT",
    signedOut: "Signed out. Play continues on this device.",
    bannerPrefix: "You're signed in",
    bannerHeld: " Sync is paused here because this browser's progress belongs to a different account.",
    dismiss: "Dismiss"
  };

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function signedIn() { try { return A.isSignedIn() === true; } catch (e) { return false; } }
  function address() { try { var v = A.email(); return typeof v === "string" && v ? v : null; } catch (e) { return null; } }

  function addStyles() {
    if (document.getElementById("aced-acct-ui-style")) return;
    var s = el("style");
    s.id = "aced-acct-ui-style";
    s.textContent =
      "[data-aced-account]:not([hidden]){display:inline-flex;align-items:center;justify-content:center;min-height:32px;cursor:pointer;color:var(--cyan,#5cffea);border-color:#0a4a4a;line-height:1;white-space:nowrap}" +
      "[data-aced-account]:hover{color:var(--green,#22ff66);border-color:var(--green-dim,#0fa84a)}" +
      "@media(pointer:coarse){[data-aced-account]:not([hidden]){min-height:44px;min-width:44px}}" +
      ".aced-acct-dialog{box-sizing:border-box;width:min(440px,calc(100vw - 24px));max-height:calc(100vh - 24px);overflow:auto;margin:auto;padding:22px 20px;background:var(--panel,#0a160a);color:var(--white,#d8f5d8);border:1px solid var(--green,#22ff66);box-shadow:0 0 26px rgba(34,255,102,.22);font-family:'VT323',monospace;font-size:19px;line-height:1.3}" +
      ".aced-acct-dialog::backdrop{background:rgba(0,0,0,.72)}" +
      ".aced-acct-dialog:not([open]){display:none}" +
      ".aced-acct-dialog.aced-acct-fallback[open]{position:fixed;top:12px;left:0;right:0;z-index:2147483000}" +
      ".aced-acct-dialog h2{font-family:'Press Start 2P',monospace;font-size:13px;line-height:1.5;color:var(--green,#22ff66);margin:0 0 12px;letter-spacing:1px}" +
      ".aced-acct-dialog p{margin:0 0 12px}" +
      ".aced-acct-dialog b{color:var(--gold,#ffd23f);font-weight:normal;overflow-wrap:anywhere}" +
      ".aced-acct-dialog label{display:block;margin:0 0 6px;color:var(--white,#d8f5d8)}" +
      ".aced-acct-dialog input{display:block;width:100%;box-sizing:border-box;min-height:44px;margin:0 0 10px;padding:9px 11px;font-family:'VT323',monospace;font-size:20px;color:var(--white,#d8f5d8);background:#04090a;border:1px solid var(--green-dim,#0fa84a)}" +
      ".aced-acct-status{min-height:1.3em;color:var(--amber,#ffb627)}" +
      ".aced-acct-row{display:flex;flex-wrap:wrap;gap:10px;margin:4px 0 12px}" +
      ".aced-acct-row button{flex:1 1 130px;min-height:44px;padding:10px 12px;font-family:'Press Start 2P',monospace;font-size:10px;letter-spacing:1px;cursor:pointer;color:var(--green,#22ff66);background:#0a160a;border:1px solid var(--green-dim,#0fa84a)}" +
      ".aced-acct-row button.aced-acct-primary{color:#07120b;background:var(--gold,#ffd23f);border-color:var(--gold,#ffd23f)}" +
      ".aced-acct-row button:disabled{opacity:.6;cursor:default}" +
      ".aced-acct-dialog a{color:var(--cyan,#5cffea);text-decoration:underline}" +
      ".aced-acct-small{font-size:17px;margin:0}" +
      ".aced-acct-dialog p.aced-acct-scope{margin:0 0 12px}" +
      "#aced-signedin-notice{position:relative;z-index:1;box-sizing:border-box;max-width:560px;margin:12px auto;width:calc(100% - 24px);display:flex;gap:12px;align-items:flex-start;padding:12px 14px;background:#111;color:#fff;border:2px solid #4dff9e;border-radius:8px;font:15px/1.4 system-ui,sans-serif}" +
      "#aced-signedin-notice span{flex:1 1 auto;overflow-wrap:anywhere}" +
      "#aced-signedin-notice button{flex:none;font:inherit;color:#111;background:#4dff9e;border:0;border-radius:4px;padding:4px 10px;min-height:32px;cursor:pointer}";
    (document.head || document.body || document.documentElement).appendChild(s);
  }

  function renderButton() {
    var on = signedIn(), list = buttons(), i, b;
    for (i = 0; i < list.length; i++) {
      b = list[i];
      b.textContent = on ? "ACCOUNT" : "SIGN IN";
      b.setAttribute("aria-label", on ? "Account: signed in. Open account options." : "Sign in to an account");
      b.setAttribute("aria-haspopup", "dialog");
      b.hidden = false;
      b.removeAttribute("hidden");
    }
  }
  // Focus goes back to the button that opened the dialog, or to the current one if the
  // page redrew its menu in the meantime.
  function restoreFocus() {
    var list = buttons(), target = (lastButton && list.indexOf(lastButton) >= 0) ? lastButton : list[0];
    try { if (target && target.focus) target.focus(); } catch (e) {}
  }

  /* ---------- dialog ---------- */
  var dialog = null, titleId = "aced-acct-title";
  function ensureDialog() {
    if (dialog) return dialog;
    dialog = el("dialog", "aced-acct-dialog");
    dialog.id = "aced-acct-dialog";
    dialog.setAttribute("aria-labelledby", titleId);
    if (typeof dialog.showModal !== "function") {
      dialog.className += " aced-acct-fallback";
      dialog.setAttribute("role", "dialog");
      dialog.setAttribute("aria-modal", "true");
    }
    document.body.appendChild(dialog);
    return dialog;
  }
  function openDialog() {
    var d = ensureDialog();
    if (d.open || d.hasAttribute("open")) return;
    try { if (typeof d.showModal === "function") { d.showModal(); return; } } catch (e) {}
    d.setAttribute("open", "");
  }
  function closeDialog() {
    if (!dialog) return;
    try { if (typeof dialog.close === "function") dialog.close(); else dialog.removeAttribute("open"); } catch (e) { dialog.removeAttribute("open"); }
    restoreFocus();
  }
  function fill(title, nodes) {
    var d = ensureDialog();
    while (d.firstChild) d.removeChild(d.firstChild);
    var h = el("h2", null, title);
    h.id = titleId;
    d.appendChild(h);
    for (var i = 0; i < nodes.length; i++) if (nodes[i]) d.appendChild(nodes[i]);
  }
  function actionRow(buttons) {
    var row = el("div", "aced-acct-row");
    for (var i = 0; i < buttons.length; i++) row.appendChild(buttons[i]);
    return row;
  }
  function actionButton(label, onClick, primary) {
    var b = el("button", primary ? "aced-acct-primary" : null, label);
    b.type = "button";
    b.addEventListener("click", onClick);
    return b;
  }
  function focusSoon(node) { try { if (node && node.focus) node.focus(); } catch (e) {} }

  function showSignIn() {
    var form = el("form");
    form.setAttribute("novalidate", "");
    var label = el("label", null, COPY.emailLabel);
    label.setAttribute("for", "aced-acct-email");
    var input = el("input");
    input.id = "aced-acct-email";
    input.type = "email";
    input.setAttribute("inputmode", "email");
    input.setAttribute("autocomplete", "email");
    input.setAttribute("placeholder", "you@example.com");
    input.setAttribute("aria-describedby", "aced-acct-status");
    var status = el("p", "aced-acct-status");
    status.id = "aced-acct-status";
    status.setAttribute("role", "status");
    status.setAttribute("aria-live", "polite");
    var send = el("button", "aced-acct-primary", COPY.send);
    send.type = "submit";
    var cancel = actionButton(COPY.cancel, closeDialog, false);
    var busy = false;
    form.addEventListener("submit", function (ev) {
      try { if (ev && ev.preventDefault) ev.preventDefault(); } catch (e) {}
      if (busy) return;
      var value = String(input.value || "").trim();
      if (!EMAIL_RE.test(value)) { status.textContent = COPY.invalid; focusSoon(input); return; }
      busy = true;
      send.disabled = true;
      send.textContent = COPY.sending;
      status.textContent = "";
      function fail(message) {
        busy = false;
        send.disabled = false;
        send.textContent = COPY.send;
        status.textContent = message;
      }
      var request;
      try { request = A.signIn(value); } catch (e) { fail(COPY.failed); return; }
      Promise.resolve(request).then(function (res) {
        if (res && res.ok === true) { showSent(); return; }
        var code = res && typeof res.error === "string" ? res.error : "";
        if (code === "invalid email") fail(COPY.invalid);
        else if (code === "too_many_link_requests" || code === "too_many_auth_attempts" || code === "rate_limited") fail(COPY.limited);
        else fail(COPY.failed);
      }, function () { fail(COPY.failed); });
    });
    form.appendChild(label);
    form.appendChild(input);
    form.appendChild(status);
    form.appendChild(actionRow([send, cancel]));
    var privacy = el("p", "aced-acct-small");
    var link = el("a", null, COPY.privacy);
    link.setAttribute("href", "privacy.html");
    privacy.appendChild(link);
    fill(COPY.signInTitle, [el("p", null, COPY.signInIntro), el("p", "aced-acct-small aced-acct-scope", COPY.scope), form, privacy]);
    openDialog();
    focusSoon(input);
  }

  function showSent() {
    var close = actionButton(COPY.close, closeDialog, true);
    var status = el("p", null, COPY.sent);
    status.setAttribute("role", "status");
    fill(COPY.sentTitle, [status, el("p", "aced-acct-small", COPY.sentHelp), actionRow([close])]);
    openDialog();
    focusSoon(close);
  }

  function showAccount() {
    var who = el("p");
    var email = address();
    if (email) {
      who.appendChild(document.createTextNode(COPY.signedInAs));
      who.appendChild(el("b", null, email));
      who.appendChild(document.createTextNode("."));
    } else {
      who.textContent = COPY.signedInNoEmail;
    }
    var help = el("p", null, COPY.accountHelp + " ");
    var game = el("a", null, COPY.openGame);
    game.setAttribute("href", "study.html");
    help.appendChild(game);
    var out = actionButton(COPY.signOut, function () {
      try { Promise.resolve(A.signOut()).then(function () {}, function () {}); } catch (e) {}
      renderButton();
      showSignedOut();
    }, false);
    var close = actionButton(COPY.close, closeDialog, true);
    fill(COPY.accountTitle, [who, help, el("p", "aced-acct-small aced-acct-scope", COPY.scope), actionRow([out, close])]);
    openDialog();
    focusSoon(close);
  }

  function showSignedOut() {
    var close = actionButton(COPY.close, closeDialog, true);
    var status = el("p", null, COPY.signedOut);
    status.setAttribute("role", "status");
    fill(COPY.signedOutTitle, [status, actionRow([close])]);
    openDialog();
    focusSoon(close);
  }

  /* ---------- "you're signed in" message ---------- */
  function removeNotice() {
    try { var n = document.getElementById("aced-signedin-notice"); if (n && n.parentNode) n.parentNode.removeChild(n); } catch (e) {}
  }
  function showSignedInNotice() {
    removeNotice();
    if (!signedIn() || !document.body) return;
    var box = el("div");
    box.id = "aced-signedin-notice";
    box.setAttribute("role", "status");
    var email = address(), held = false;
    try { held = A.syncHeld() === true; } catch (e) { held = false; }
    var text = el("span", null, COPY.bannerPrefix + (email ? " as " + email : "") + "." + (held ? COPY.bannerHeld : ""));
    var close = el("button", null, COPY.dismiss);
    close.type = "button";
    close.setAttribute("aria-label", "Dismiss signed-in message");
    close.addEventListener("click", removeNotice);
    box.appendChild(text);
    box.appendChild(close);
    // In the page flow, directly under the header, so it never covers the menu or the
    // account button (a fixed bar would sit on top of them on a phone).
    var header = document.querySelector("header");
    if (header && header.parentNode) header.parentNode.insertBefore(box, header.nextSibling);
    else document.body.insertBefore(box, document.body.firstChild);
  }

  addStyles();
  renderButton();
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", renderButton);
  // One listener on the document, so a button that a page redraws keeps working.
  document.addEventListener("click", function (ev) {
    var t = ev && ev.target, b = null;
    try { b = t && t.closest ? t.closest(SELECTOR) : null; } catch (e) { b = null; }
    if (!b) return;
    lastButton = b;
    removeNotice();
    if (signedIn()) showAccount(); else showSignIn();
  });
  window.ACEDAccountUI = { refresh: renderButton };
  // aced-account.js announces session changes with a name only (no address, no token).
  document.addEventListener("aced:account", function (ev) {
    var change = ev && ev.detail && ev.detail.change;
    renderButton();
    if (change === "signed_in") {
      if (dialog && (dialog.open || dialog.hasAttribute("open"))) closeDialog();
      showSignedInNotice();
    } else if (change === "signed_out") removeNotice();
  });
  // Another tab signed in or out (for example, the emailed link opened in a new tab).
  // Only the storage key name is checked; its value is never read here.
  if (window.addEventListener) window.addEventListener("storage", function (ev) {
    if (!ev || ev.key === "aced_session" || ev.key === null) { renderButton(); if (!signedIn()) removeNotice(); }
  });
})();
