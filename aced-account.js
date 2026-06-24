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
   ============================================================================ */
(function () {
  "use strict";
  var API = (typeof window !== "undefined" && window.ACED_API_URL) || null;
  var TOKEN_KEY = "aced_session";

  function ls() { try { return window["local" + "Storage"]; } catch (e) { return null; } }
  function getTok() { var s = ls(); try { return s ? s.getItem(TOKEN_KEY) : null; } catch (e) { return null; } }
  function setTok(t) { var s = ls(); try { if (!s) return; if (t) s.setItem(TOKEN_KEY, t); else s.removeItem(TOKEN_KEY); } catch (e) {} }
  function packId() { try { return (new URLSearchParams(location.search).get("pack") || "cpa-far").replace(/[^a-z0-9._-]/gi, ""); } catch (e) { return "cpa-far"; } }

  // 1) Capture a token handed back in the URL fragment after /auth/verify, then clean the URL.
  (function captureFragmentToken() {
    try {
      if (location.hash && location.hash.indexOf("token=") >= 0) {
        var m = /token=([^&]+)/.exec(location.hash);
        if (m && m[1]) {
          setTok(decodeURIComponent(m[1]));
          history.replaceState(null, "", location.pathname + location.search);
        }
      }
    } catch (e) {}
  })();

  function api(path, opts) {
    if (!API) return Promise.reject(new Error("no-api"));
    opts = opts || {};
    var headers = Object.assign({ "Content-Type": "application/json" }, opts.headers || {});
    var tok = getTok(); if (tok) headers.Authorization = "Bearer " + tok;
    return fetch(API + path, {
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
    email: function () { try { var t = getTok(); if (!t) return null; var p = JSON.parse(atob(t.split(".")[1])); return p.email || null; } catch (e) { return null; } },

    signIn: function (email) {
      if (!API) return Promise.reject(new Error("Sync isn't configured on this build."));
      return api("/auth/request", { method: "POST", body: { email: String(email || "").trim() } })
        .then(function (res) {
          if (res && res.devLink) { try { location.href = res.devLink; } catch (e) {} }   // dev convenience
          return res;
        });
    },
    signOut: function () { setTok(null); try { if (window.ACEDCore && ACEDCore.backend) ACEDCore.backend.configure({ endpoint: API, token: null }); } catch (e) {} },

    entitlements: function () { return api("/entitlements").then(function (r) { return (r && r.packs) || []; }).catch(function () { return []; }); },
    has: function (pid) { return this.entitlements().then(function (list) { return list.indexOf(pid || packId()) >= 0; }); },

    checkout: function (pid) {
      if (!API) return Promise.reject(new Error("Billing isn't configured on this build."));
      if (!getTok()) return Promise.reject(new Error("Sign in first."));
      return api("/billing/checkout", { method: "POST", body: { pack: pid || packId() } })
        .then(function (r) { if (r && r.url) location.href = r.url; else throw new Error((r && r.error) || "checkout failed"); });
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
