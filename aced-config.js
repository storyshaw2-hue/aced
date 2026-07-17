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
window.ACED_API_URL = "https://aced-api.onrender.com";  // ENABLED: acedhq.com verified in Resend (Jul 2026), so magic-link sign-in delivers to all users. Backend production-ready (NODE_ENV=production, Resend wired, Postgres).

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
window.ACED_MONETIZATION = {
  enabled:  true,        // master switch for the paywall (also needs ACED_API_URL + Stripe live)
  pack:     "cpa-far",   // Stripe pack id to sell (must match the server PRICES key)
  price:    "$29",       // DISPLAY price only — must equal the Stripe Price amount (PRICE_CPA_FAR = $29)
  lockMock: true,        // gate the Mock Exam behind the unlock
  lockTbs:  true,        // gate the full TBS library behind the unlock
  freeTbs:  5            // simulations playable free before the unlock prompt (the taste)
};

/* ----------------------------------------------------------------------------
   OPTIONAL white-label branding (B2B / institutional resale).
   Defaults below are ACED's own brand, so leaving this untouched changes NOTHING.
   An institutional client ships a fork of this one file with their own values and
   the whole app reskins — no code edits. Applied FOUC-safe by aced-brand.js, which
   must load synchronously in <head> right after this file (see that file's header).
   ---------------------------------------------------------------------------- */
window.ACED_BRAND = {
  name:    "ACED",                              // fills [data-brand-name] / .brand-name
  logoText:"ACED_",                             // fills [data-brand-logo]
  tagline: "study anything like a roguelike",   // fills [data-brand-tagline]
  colors: {                                     // any subset → CSS vars on <html>
    green:"#22ff66", amber:"#ffb627", cyan:"#5cffea", gold:"#ffd23f",
    bg:"#070b08", panel:"#0a160a", border:"#16291a"
  }
};

/* ----------------------------------------------------------------------------
   PRICING MODEL (single source of truth for pricing.html).
   Recommended for wide-scale growth: a genuinely-free core game (max funnel +
   word of mouth), a subscription for recurring revenue (the retention levers —
   leagues, streaks, spaced repetition — already justify it), and an optional
   one-time "Exam Pass" for candidates who won't subscribe for a time-boxed goal.
   `status:"live"` renders a real buy/play CTA; `status:"soon"` renders a
   get-notified capture until billing is wired (see PRICING_STRATEGY.md).
   ---------------------------------------------------------------------------- */
window.ACED_PLANS = {
  currency: "USD",
  free: { name:"Free", price:"$0", cadence:"forever", status:"live", highlight:false,
    cta:{ label:"PLAY FREE", href:"aced-arcade.html" },
    features:[
      "The full game — arcade, Daily Close, leagues, streaks",
      "Study your own material: upload a PDF or paste notes, play it instantly",
      "Spaced-repetition review + mastery tracking",
      "Sample packs for every exam"
    ] },
  pro: { name:"ACED Pro", price:"$8.99", cadence:"/mo", annual:"or $59.99/yr", status:"soon", highlight:true,
    cta:{ label:"GET NOTIFIED", source:"pricing-pro" },
    features:[
      "Everything in Free",
      "All official exam packs (CPA today; more rolling out)",
      "Unlimited AI question generation from your files",
      "Mock exams + the full simulation library",
      "Advanced readiness analytics + unlimited streak freezes"
    ] },
  pass: { name:"Exam Pass", price:"$39", cadence:"one-time · per exam", status:"soon", highlight:false,
    cta:{ label:"GET NOTIFIED", source:"pricing-pass" },
    features:[
      "Lifetime access to one exam track's full bank",
      "All mock exams + simulations for that exam",
      "No subscription — pay once",
      "Best for a single, time-boxed exam push"
    ] },
  pdf: { name:"FAR Quick-Reference PDF", price:"$9", cadence:"one-time", status:"live", highlight:false,
    cta:{ label:"BUY ON GUMROAD", href:"https://storyteller2277.gumroad.com/l/nlmmgc" },
    features:[
      "A focused FAR study PDF — available today",
      "A low-cost starter while Pro is in the works"
    ] }
};
