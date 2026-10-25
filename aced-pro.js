/* ACED — aced-pro.js
   ============================================================================
   The PAYWALL SEAM. This gates "Pro" features and free-tier limits, and holds
   the hooks a payment processor plugs into later. It ships INERT: everyone is
   free until you (a) wire a verifier and (b) grant entitlement after a real
   purchase. Nothing here charges anyone or unlocks anything on its own.

   IMPORTANT — this is a UX/seam layer, NOT a security boundary. Client-side
   gating decides what the UI shows and stops casual use; it does not stop a
   determined user with devtools. Real enforcement has to live on the server:
   the server verifies the purchase and actually holds the Pro-only value
   (cloud sync, server-computed analytics). Treat this file as the switch and
   the storefront glue, and let the backend be the lock.

   FLYWHEEL NOTE: creating decks, building games, publishing to the library, and
   sharing are deliberately NOT Pro — gating them would choke the free content
   loop that makes the app spread. Pro is reserved for things that don't reduce
   supply or virality: cloud sync, deep analytics, premium palettes, and
   unlimited saves past a generous free cap. Retune in CONFIG.

   Vanilla ES5 IIFE, no build step, attaches to window.ACEDPro. Persists via
   ACEDCore.store (→ localStorage → memory). Load after aced-core.js.

   ---- Typical wiring -------------------------------------------------------
     // gate a Pro feature (returns false + opens your paywall if locked):
     if (ACEDPro.require("advanced_analytics", openPaywall)) { renderAnalytics(); }

     // gate a free-tier quota:
     if (ACEDPro.guardSave("savedPacks", packs.length, openPaywall)) { savePack(); }

     // show your paywall modal whenever something locks:
     ACEDPro.onUpsell(function (info) { showPaywallModal(info); });

     // the day you wire Stripe/Gumroad/etc:
     ACEDPro.setCheckout(function (plan) { window.location = checkoutUrlFor(plan); });
     ACEDPro.setVerifier(function () { return fetch("/api/pro").then(r=>r.json()).then(j=>!!j.active); });
     // ...and after a confirmed purchase (ideally server-told):
     ACEDPro.grant({ plan: "lifetime", source: "stripe" });

   Cross-device: add "pro" to SYNC_KEYS in aced-core.js for convenience, but the
   server verify() is the source of truth.
   ============================================================================ */
(function () {
  "use strict";

  /* ---------------------------------------------------------------------------
     CONFIG — the whole Pro offer lives here. Prices are intentionally null
     until you decide them; the UI should show nothing false in the meantime.
  --------------------------------------------------------------------------- */
  var CONFIG = {
    // Features flagged pro:true gate behind entitlement. Anything not listed
    // (playing, building, publishing, sharing) is always free.
    FEATURES: {
      cloud_sync:         { pro: true, label: "Cloud sync across devices" },
      advanced_analytics: { pro: true, label: "Retention, calibration & mastery analytics" },
      premium_themes:     { pro: true, label: "Premium CRT palettes" },
      unlimited_saves:    { pro: true, label: "Unlimited saved packs & games" }
    },
    // Free-tier quotas (generous, so the create/share loop isn't strangled).
    // Pro removes the cap. Anything not listed here is unlimited for everyone.
    FREE_LIMITS: { savedPacks: 10, savedGames: 5 },
    // Fill these in when you decide pricing; leave null to display nothing.
    PLANS: [
      { id: "monthly",  label: "Pro · monthly",  price: null },
      { id: "lifetime", label: "Pro · lifetime", price: null }
    ]
  };

  /* ---- storage: ACEDCore.store → localStorage → memory ---------------------- */
  var KEY = "pro";
  var mem = {};
  function coreStore() { try { return (window.ACEDCore && window.ACEDCore.store) ? window.ACEDCore.store : null; } catch (e) { return null; } }
  var NS = (function () {
    try { var p = new URLSearchParams(location.search).get("pack"); return "aced:" + ((p || "cpa-far").replace(/[^a-z0-9._-]/gi, "")) + ":"; }
    catch (e) { return "aced:cpa-far:"; }
  })();
  var lsOk = false;
  try { var t = "__acedpro__"; window.localStorage.setItem(t, "1"); window.localStorage.removeItem(t); lsOk = true; } catch (e) { lsOk = false; }

  function fresh() { return { v: 1, active: false, since: null, plan: null, source: null, expires: null, verifiedAt: null }; }
  function normalize(s) {
    if (!s || typeof s !== "object") s = fresh();
    s.active = !!s.active;
    if (s.since === undefined) s.since = null;
    if (s.expires === undefined) s.expires = null;
    s.v = 1;
    return s;
  }
  function load() {
    var raw = null, cs = coreStore();
    if (cs) { try { raw = cs.get(KEY, null); } catch (e) { raw = null; } }
    if (raw == null && lsOk) { try { var v = window.localStorage.getItem(NS + KEY); if (v != null) raw = JSON.parse(v); } catch (e) {} }
    if (raw == null && mem[KEY] != null) raw = mem[KEY];
    return normalize(raw || fresh());
  }
  function save(s) {
    var cs = coreStore();
    if (cs) { try { cs.set(KEY, s); return; } catch (e) {} }
    if (lsOk) { try { window.localStorage.setItem(NS + KEY, JSON.stringify(s)); return; } catch (e) {} }
    mem[KEY] = s;
  }
  function track(evt, props) { try { if (window.ACEDCore && window.ACEDCore.analytics) window.ACEDCore.analytics.track(evt, props || {}); } catch (e) {} }

  /* ---- entitlement ---------------------------------------------------------- */
  function isPro() {
    var s = load();
    if (!s.active) return false;
    if (s.expires && Date.now() > s.expires) return false;
    return true;
  }
  function grant(opts) {
    opts = opts || {};
    var s = load();
    s.active = true;
    s.since = s.since || Date.now();
    s.plan = opts.plan || s.plan || "pro";
    s.source = opts.source || s.source || "manual";
    if (opts.expires) s.expires = opts.expires; // ms timestamp; omit for lifetime
    save(s);
    track("pro_grant", { plan: s.plan, source: s.source });
    return isPro();
  }
  function revoke() { var s = fresh(); save(s); track("pro_revoke", {}); return false; }

  /* ---- verification seam (server tells us the truth once wired) ------------- */
  var verifier = null;
  function setVerifier(fn) { verifier = (typeof fn === "function") ? fn : null; }
  function verify() {
    if (!verifier) return Promise.resolve(isPro());
    return Promise.resolve().then(function () { return verifier(); }).then(function (ok) {
      var s = load();
      s.active = !!ok;
      if (ok && !s.since) s.since = Date.now();
      s.verifiedAt = Date.now();
      save(s);
      track("pro_verify", { active: !!ok });
      return isPro();
    }).catch(function () { return isPro(); });
  }

  /* ---- feature + limit gating ---------------------------------------------- */
  function feat(id) { return CONFIG.FEATURES[id]; }
  function has(feature) {
    var f = feat(feature);
    if (!f || !f.pro) return true;   // unknown / non-pro features are always free
    return isPro();
  }
  function freeLimit(kind) { var n = CONFIG.FREE_LIMITS[kind]; return (typeof n === "number") ? n : Infinity; }
  function withinLimit(kind, count) { return isPro() ? true : ((count | 0) < freeLimit(kind)); }
  function remaining(kind, count) { return isPro() ? Infinity : Math.max(0, freeLimit(kind) - (count | 0)); }

  /* ---- upsell / checkout seams ---------------------------------------------- */
  var upsellCb = null, checkoutFn = null;
  function onUpsell(cb) { upsellCb = (typeof cb === "function") ? cb : null; }
  function fireUpsell(info) { try { if (upsellCb) upsellCb(info); } catch (e) {} }
  function upsellInfo(feature, extra) {
    var f = feat(feature);
    var info = { feature: feature, label: (f && f.label) || feature, plans: CONFIG.PLANS };
    if (extra) { for (var k in extra) { if (extra.hasOwnProperty(k)) info[k] = extra[k]; } }
    return info;
  }
  function setCheckout(fn) { checkoutFn = (typeof fn === "function") ? fn : null; }
  function startCheckout(plan) {
    track("checkout_start", { plan: plan || null });
    if (checkoutFn) { try { return checkoutFn(plan); } catch (e) {} }
    // No processor wired yet — surface the upsell so the UI can show a
    // "coming soon" / waitlist state instead of a broken button.
    fireUpsell(upsellInfo("cloud_sync", { plan: plan || null, noProcessor: true }));
    return null;
  }

  // Gate a Pro feature. Returns true if allowed; otherwise fires the upsell and
  // returns false. Pass an optional onLocked(info) to override the global upsell.
  function require(feature, onLocked) {
    if (has(feature)) return true;
    track("paywall_view", { feature: feature });
    var info = upsellInfo(feature);
    if (typeof onLocked === "function") onLocked(info); else fireUpsell(info);
    return false;
  }
  // Gate a free-tier quota (e.g. number of saved packs). Same contract.
  function guardSave(kind, count, onLocked) {
    if (withinLimit(kind, count)) return true;
    track("paywall_view", { limit: kind, count: count });
    var info = upsellInfo("unlimited_saves", { limit: kind, count: (count | 0), cap: freeLimit(kind) });
    if (typeof onLocked === "function") onLocked(info); else fireUpsell(info);
    return false;
  }

  function state() { return load(); }
  function reset() { save(fresh()); return true; }

  window.ACEDPro = {
    version: 1,
    CONFIG: CONFIG,
    FEATURES: CONFIG.FEATURES,
    // entitlement
    isPro: isPro, grant: grant, revoke: revoke,
    setVerifier: setVerifier, verify: verify,
    // gating
    has: has, withinLimit: withinLimit, remaining: remaining,
    require: require, guardSave: guardSave,
    // storefront glue
    onUpsell: onUpsell, setCheckout: setCheckout, startCheckout: startCheckout,
    // misc
    state: state, reset: reset
  };
})();
