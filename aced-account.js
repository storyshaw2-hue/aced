/* ACED — aced-account.js
   ============================================================================
   Thin client glue between the pages and the reference backend (server/). Load
   AFTER aced-core.js. It is a NO-OP until an API URL is configured, so every page
   keeps working exactly as it does today (localStorage-only) when offline/unset.

   Configure once, before this script, on any page that should sync:
     <script>window.ACED_API_URL = "https://api.youraced.app";</script>
     <script src="aced-core.js"></script>
     <script src="aced-account.js"></script>

   API:
     ACEDAccount.isSignedIn()                  -> bool
     ACEDAccount.email()                        -> string | null
     ACEDAccount.signIn(email)                  -> Promise (sends magic link; dev: opens link)
     ACEDAccount.signOut()                      -> clears the session (local play continues)
     ACEDAccount.entitlements()                 -> Promise<string[]>  (owned pack ids)
     ACEDAccount.has(packId)                    -> Promise<bool>
     ACEDAccount.checkout(packId)               -> Promise (redirects to Stripe Checkout)
     ACEDAccount.requireEntitlement(packId,opt) -> Promise<bool>  (redirects to paywall if missing)
     ACEDAccount.signOutEverywhere()            -> Promise (revoke ALL sessions, then drop local)
     ACEDAccount.leaderboardOptIn(handle)       -> Promise (show on the public board as `handle`)
     ACEDAccount.leaderboardOptOut()            -> Promise (hide from the public board)
   ============================================================================ */
(function () {
  "use strict";
  var API = (typeof window !== "undefined" && window.ACED_API_URL) || null;
  var TOKEN_KEY = "aced_session";

  function ls() { try { return window["local" + "Storage"]; } catch (e) { return null; } }
  function getTok() { var s = ls(); try { return s ? s.getItem(TOKEN_KEY) : null; } catch (e) { return null; } }
  function setTok(t) { var s = ls(); try { if (!s) return; if (t) s.setItem(TOKEN_KEY, t); else s.removeItem(TOKEN_KEY); } catch (e) {} }
  function packId() { try { return (new URLSearchParams(location.search).get("pack") || "world-capitals").replace(/[^a-z0-9._-]/gi, ""); } catch (e) { return "world-capitals"; } }

  // Sign-in state (login-CSRF / session-fixation guard). signIn() stores a random one-time
  // state in THIS browser and sends it with the link request; the server echoes it back in
  // the fragment. A fragment token is accepted only with a matching, unexpired state, so a
  // link crafted for another account cannot sign this browser in. localStorage (not
  // sessionStorage) so the emailed link still works when it opens in a new tab.
  var AUTH_STATE_KEY = "aced_auth_state";
  var AUTH_STATE_TTL_MS = 15 * 60 * 1000;      // matches the server's magic-link lifetime
  var AUTH_STATE_MAX = 5;                      // matches the per-email link limit per hour
  var JWT_SHAPE = /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/;
  function readStates() {
    var s = ls(), now = Date.now(), list;
    try { list = JSON.parse((s && s.getItem(AUTH_STATE_KEY)) || "[]"); } catch (e) { list = []; }
    if (!Array.isArray(list)) return [];
    return list.filter(function (x) { return x && typeof x.s === "string" && Number(x.exp) > now; });
  }
  function writeStates(list) {
    var s = ls(); if (!s) return;
    try { if (list.length) s.setItem(AUTH_STATE_KEY, JSON.stringify(list.slice(-AUTH_STATE_MAX))); else s.removeItem(AUTH_STATE_KEY); } catch (e) {}
  }
  function newAuthState() {
    var c = (typeof window !== "undefined" && window.crypto) || (typeof crypto !== "undefined" ? crypto : null);
    if (!c || !c.getRandomValues) return null;
    var b = new Uint8Array(32), str = "", i;
    c.getRandomValues(b);
    for (i = 0; i < b.length; i++) str += String.fromCharCode(b[i]);
    return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }
  function sameString(a, b) {
    if (typeof a !== "string" || typeof b !== "string" || a.length !== b.length) return false;
    var d = 0, i; for (i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i);
    return d === 0;
  }

  // 1) Capture a token handed back in the URL fragment after /auth/verify, then clean the URL.
  //    The fragment is ALWAYS scrubbed; the token is kept only if its state matches a
  //    pending sign-in from this browser. A rejected token never replaces a current session.
  (function captureFragmentToken() {
    try {
      if (location.hash && location.hash.indexOf("token=") >= 0) {
        var params = new URLSearchParams(location.hash.slice(1));
        var tok = params.get("token"), st = params.get("state");
        try { history.replaceState(null, "", location.pathname + location.search); } catch (e) {}
        var pending = readStates(), match = false, i;
        for (i = 0; i < pending.length; i++) { if (sameString(st, pending[i].s)) match = true; }
        if (match && tok && JWT_SHAPE.test(tok)) {
          setTok(tok);
          writeStates([]);                       // single use: clear every pending sign-in
        } else {
          writeStates(pending);                  // prune expired entries only
        }
      }
    } catch (e) {}
  })();

  // Guard every network call with a timeout so a cold/hung backend (Render free
  // tier can cold-start ~15-20s) can't leave a request pending forever. Uses
  // AbortController when available and always clears the timer.
  var API_TIMEOUT_MS = 20000;
  function fetchT(url, init, ms) {
    init = init || {};
    var ac = (typeof AbortController !== "undefined") ? new AbortController() : null;
    if (ac) init.signal = ac.signal;
    var timer = setTimeout(function () { try { if (ac) ac.abort(); } catch (e) {} }, ms || API_TIMEOUT_MS);
    return fetch(url, init).then(
      function (r) { clearTimeout(timer); return r; },
      function (err) { clearTimeout(timer); throw err; }
    );
  }

  function api(path, opts) {
    if (!API) return Promise.reject(new Error("no-api"));
    opts = opts || {};
    var headers = Object.assign({ "Content-Type": "application/json" }, opts.headers || {});
    var tok = getTok(); if (tok) headers.Authorization = "Bearer " + tok;
    return fetchT(API + path, {
      method: opts.method || "GET",
      headers: headers,
      body: opts.body ? JSON.stringify(opts.body) : undefined
    }).then(function (r) {
      if (r.status === 401) { setTok(null); }       // stale session — drop it, fall back to local
      return r.json().catch(function () { return {}; });
    });
  }

  // 2) If we have a session + API + the core's backend, configure it and hydrate.
  //    push-then-pull: send local progress first so anything earned offline is merged
  //    (mastery/streak take the max server-side), then pull the merged result back.
  var ready = Promise.resolve();
  (function activate() {
    if (!API || !getTok() || !window.ACEDCore || !ACEDCore.backend) return;
    try {
      ACEDCore.backend.configure({ endpoint: API, token: getTok() });
      if (ACEDCore.sync && ACEDCore.sync.isEnabled && ACEDCore.sync.isEnabled()) {
        ready = ACEDCore.sync.push()
          .then(function () { return ACEDCore.sync.pull(); })
          .then(function (r) { try { if (r && r.applied && window.ACEDFX) ACEDFX.toast && ACEDFX.toast("Progress synced.", ACEDFX.palette.cyan); } catch (e) {} })
          .catch(function () {});
      }
    } catch (e) {}
  })();

  var ACEDAccount = {
    ready: function () { return ready; },
    isSignedIn: function () { return !!getTok(); },
    token: function () { return getTok(); },   // leagues.js authHeader() reads this
    email: function () { try { var t = getTok(); if (!t) return null; var p = JSON.parse(atob(t.split(".")[1])); return p.email || null; } catch (e) { return null; } },

    signIn: function (email) {
      if (!API) return Promise.reject(new Error("Sync isn't configured on this build."));
      var state = newAuthState();
      if (!state) return Promise.reject(new Error("This browser can't sign in securely."));
      var pending = readStates(); pending.push({ s: state, exp: Date.now() + AUTH_STATE_TTL_MS }); writeStates(pending);
      return api("/auth/request", { method: "POST", body: { email: String(email || "").trim(), state: state } })
        .then(function (res) {
          if (res && res.devLink) { try { location.href = res.devLink; } catch (e) {} }   // dev convenience
          return res;
        });
    },
    signOut: function () { setTok(null); try { if (window.ACEDCore && ACEDCore.backend) ACEDCore.backend.configure({ endpoint: API, token: null }); } catch (e) {} },

    // GET /entitlements is Bearer-only server-side, so an anonymous call can never succeed —
    // it just burns a round trip and logs a network/CORS error on every signed-out page load.
    // Resolve empty locally instead, matching what the failed request already fell back to.
    entitlements: function () {
      if (!API || !getTok()) return Promise.resolve([]);
      return api("/entitlements").then(function (r) { return (r && r.packs) || []; }).catch(function () { return []; });
    },
    has: function (pid) { return this.entitlements().then(function (list) { return list.indexOf(pid || packId()) >= 0; }); },

    checkout: function (pid) {
      if (!API) return Promise.reject(new Error("Billing isn't configured on this build."));
      if (!getTok()) return Promise.reject(new Error("Sign in first."));
      return api("/billing/checkout", { method: "POST", body: { pack: pid || packId() } })
        .then(function (r) { if (r && r.url) location.href = r.url; else throw new Error((r && r.error) || "checkout failed"); });
    },

    // Revoke every session for this account (e.g. lost device), then clear the local
    // token so this device falls back to local-only play immediately.
    signOutEverywhere: function () {
      if (!API || !getTok()) { setTok(null); return Promise.resolve({ ok: true }); }
      return api("/auth/signout-all", { method: "POST" }).then(function (r) { setTok(null); return r; });
    },
    // Opt IN to the public leaderboard under a display handle (2-24 chars; the server
    // sanitizes). Until this is called the user is invisible on the board.
    leaderboardOptIn: function (handle) {
      if (!API) return Promise.reject(new Error("Sync isn't configured on this build."));
      if (!getTok()) return Promise.reject(new Error("Sign in first."));
      return api("/leaderboard/optin", { method: "POST", body: { handle: String(handle || "").trim() } });
    },
    // Opt OUT — remove the handle and disappear from the public board.
    leaderboardOptOut: function () {
      if (!API) return Promise.resolve({ ok: true });
      if (!getTok()) return Promise.reject(new Error("Sign in first."));
      return api("/leaderboard/optout", { method: "POST" });
    },

    /* Gate a paid pack. Resolves true if entitled; otherwise redirects to `opt.redirect`
       (default the landing paywall) and resolves false. Free packs/no-API => always true. */
    requireEntitlement: function (pid, opt) {
      opt = opt || {};
      if (!API) return Promise.resolve(true);                 // unconfigured build stays fully open
      pid = pid || packId();
      var self = this;
      return self.entitlements().then(function (list) {
        if (list.indexOf(pid) >= 0) return true;
        var dest = opt.redirect || ("/?upgrade=" + pid);
        if (!opt.noRedirect) { try { location.href = dest; } catch (e) {} }
        return false;
      });
    }
  };

  if (typeof window !== "undefined") window.ACEDAccount = ACEDAccount;
})();
