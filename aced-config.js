/* ACED — aced-config.js
   ============================================================================
   The ONE place to turn on accounts + cloud sync across the whole app.

   To enable: deploy the reference backend in server/ (see BACKEND_SPEC.md), then
   uncomment the line below and point it at your API's public URL. That's it —
   every page that loads this file will show sign-in and sync phone <-> laptop.

   Leave it commented to keep ACED 100% local (localStorage only). When unset,
   ACEDAccount is a no-op and no sign-in control appears, so this is safe to ship.

   Load order on each page:  aced-config.js  ->  aced-core.js  ->  aced-account.js
   ============================================================================ */
window.ACED_API_URL = "https://aced-api.onrender.com";

/* ----------------------------------------------------------------------------
   OPTIONAL paywall — OFF by default. ACED stays 100% free unless you BOTH deploy the
   backend (set ACED_API_URL above) AND uncomment + enable the block below. With it off,
   there are no locks and no buy UI anywhere — players see exactly what they see today.

   Model: a single one-time "Full FAR" unlock (no subscription) that opens the Mock Exam
   and the full task-based-simulation library. Everything else — the deckbuilder, the
   daily close, mastery, readiness, the entire MCQ bank, and the first few simulations —
   stays free, so acquisition and the daily-share loop are never gated.

   `pack` must match a Stripe Price you create (server/.env PRICE_CPA_FAR) and the server's
   PRICES map. `price` is DISPLAY TEXT ONLY — the real charge is your Stripe Price; keep the
   two in sync by hand. Turn this on ONLY after Stripe is live, or players will see locks
   they cannot unlock. (Safety net: even if enabled here, the paywall stays off until
   ACED_API_URL is also set, so you can't accidentally lock people out with no way to buy.)
   ---------------------------------------------------------------------------- */
// window.ACED_MONETIZATION = {
//   enabled:  true,        // master switch for the paywall (also needs ACED_API_URL + Stripe live)
//   pack:     "cpa-far",   // Stripe pack id to sell (must match the server PRICES key)
//   price:    "$29",       // DISPLAY price only — keep it equal to your Stripe Price amount
//   lockMock: true,        // gate the Mock Exam behind the unlock
//   lockTbs:  true,        // gate the full TBS library behind the unlock
//   freeTbs:  5            // simulations playable free before the unlock prompt (the taste)
// };
