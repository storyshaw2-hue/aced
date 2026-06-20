/* =========================================================================
   ACED PACK — Exam Pack Configuration (single source of truth)
   =========================================================================
   This is the seam between the engine and exam content.
   To add a new exam pack (Bar / USMLE / MCAT / LSAT / GMAT / Series 7 / CFA / PMP):
     1. Drop the pack metadata into ACED_PACKS below
     2. Drop the questions.js and tbs.js content tagged with that pack id
     3. Flip the "available" flag when content is ready
   No engine changes required.
   ========================================================================= */
(function(){
  'use strict';

  // Active pack — controls UI labels, question filtering, paywall logic
  const ACTIVE_PACK_ID = 'cpa-far';

  const ACED_PACKS = {
    'cpa-far': {
      id: 'cpa-far',
      examFamily: 'CPA',
      examName: 'Financial Accounting & Reporting',
      shortName: 'CPA · FAR',
      tagline: 'CPA · ROGUELIKE · BUILT FOR THE EXAM',
      moduleTag: 'F',                          // matches module ids like F1.M1
      blueprintSections: ['F1','F2','F3','F4','F5','F6'],
      antagonistTheme: 'audit',                // used by nemesis flavor
      available: true,
      free: true,                              // free for now — paywall hook ready
      priceUsd: 0,
      paidPriceUsd: 49,
      bundlePriceUsd: 129,
      subscriptionPriceUsd: 19,
      careerLadder: [
        { hours:0,     name:'INTERN' },
        { hours:50,    name:'STAFF I' },
        { hours:150,   name:'STAFF II' },
        { hours:350,   name:'SENIOR' },
        { hours:700,   name:'MANAGER' },
        { hours:1500,  name:'SENIOR MGR' },
        { hours:3000,  name:'DIRECTOR' },
        { hours:6000,  name:'PARTNER' },
        { hours:12000, name:'EQUITY PARTNER' }
      ],
    },
    'cpa-aud': {
      id: 'cpa-aud', examFamily: 'CPA', examName: 'Auditing & Attestation', shortName: 'CPA · AUD',
      tagline: 'AUDIT · ROGUELIKE · CLOSE THE WORKPAPERS',
      moduleTag: 'A', blueprintSections: ['A1','A2','A3','A4','A5'],
      available: false, free: false, priceUsd: 49,
    },
    'cpa-reg': {
      id: 'cpa-reg', examFamily: 'CPA', examName: 'Regulation', shortName: 'CPA · REG',
      tagline: 'TAX · ROGUELIKE · 1040 INSTINCTS',
      moduleTag: 'R', blueprintSections: ['R1','R2','R3','R4','R5','R6'],
      available: false, free: false, priceUsd: 49,
    },
    'bar-mbe': {
      id: 'bar-mbe', examFamily: 'Bar', examName: 'Multistate Bar Exam', shortName: 'BAR · MBE',
      tagline: 'BAR · ROGUELIKE · OBJECTION OVERRULED',
      moduleTag: 'L', blueprintSections: ['Torts','Contracts','CrimLaw','Evidence','RealProp','CivPro','ConLaw'],
      available: false, free: false, priceUsd: 49,
    },
    'usmle-step1': {
      id: 'usmle-step1', examFamily: 'USMLE', examName: 'Step 1', shortName: 'USMLE · STEP 1',
      tagline: 'MED · ROGUELIKE · DIAGNOSE THE BLIND',
      moduleTag: 'M', blueprintSections: [],
      available: false, free: false, priceUsd: 49,
    },
    // Bundle SKU (not a content pack — paywall surfaces as upsell)
    'lifetime-bundle': {
      id: 'lifetime-bundle', examFamily: 'ALL', examName: 'Lifetime · All Packs', shortName: 'LIFETIME',
      tagline: 'All exams. All updates. Forever.',
      available: false, free: false, priceUsd: 129, isBundle: true,
    }
  };

  // ===== PAYWALL CONFIG ==================================================
  // Soft paywall: surfaces an upsell at the configured ante, but does NOT
  // actually block. Flip PAYWALL_ENABLED to true + set ANTE_LOCK to enforce.
  // ALL flags are local — no network. Future Stripe Payment Link slots in
  // at PAYWALL_PAYMENT_URL.
  const PAYWALL = {
    enabled: false,           // master switch — false = fully free
    softAnte: 3,              // ante at which to surface the upsell card
    hardLockAnte: null,       // ante after which play is blocked (null = never)
    paymentUrl: null,         // Stripe Payment Link goes here later
    upsellCopy: {
      title: 'Going pro?',
      body: 'You\'re crushing this run. Unlock the full pack — every question, every TBS, no ante cap.',
      ctaPrice: '$49 one-time · lifetime access',
      ctaBundle: 'or $129 for ALL exam packs',
      ctaContinue: 'Keep playing free for now'
    },
    // Set true once the user has paid (env flag or Stripe webhook later)
    isUnlocked: function(){ return true; }   // currently always unlocked
  };

  // ===== HELPERS =========================================================
  function active(){ return ACED_PACKS[ACTIVE_PACK_ID]; }

  function shouldShowSoftUpsell(ante){
    if(!PAYWALL.enabled) return false;
    if(PAYWALL.isUnlocked()) return false;
    return ante === PAYWALL.softAnte;
  }

  function isAnteLocked(ante){
    if(!PAYWALL.enabled) return false;
    if(PAYWALL.isUnlocked()) return false;
    if(PAYWALL.hardLockAnte == null) return false;
    return ante > PAYWALL.hardLockAnte;
  }

  function rankFor(hours){
    const ladder = active().careerLadder || [{hours:0,name:'INTERN'}];
    let r = ladder[0];
    for(const tier of ladder){ if(hours >= tier.hours) r = tier; }
    return r;
  }

  // ===== EXPORT ==========================================================
  window.ACED_PACK = {
    ACTIVE_PACK_ID,
    PACKS: ACED_PACKS,
    active,
    PAYWALL,
    shouldShowSoftUpsell,
    isAnteLocked,
    rankFor,
    availablePacks: function(){
      return Object.values(ACED_PACKS).filter(p=>p.available && !p.isBundle);
    },
    lockedPacks: function(){
      return Object.values(ACED_PACKS).filter(p=>!p.available && !p.isBundle);
    }
  };
})();
