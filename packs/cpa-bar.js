/* packs/cpa-bar.js — CPA · BAR (Business Analysis & Reporting) content pack.
   ============================================================================
   ONE unified pack for the whole discipline, organized around the three AICPA
   BAR blueprint AREAS (not a prep-vendor's chapter order):
     Area I   — Business Analysis & Financial Management   (~30-40%)  prefix B1
     Area II  — Technical Accounting & Reporting           (~35-45%)  prefix B2
     Area III — State, Local & Governmental Accounting     (~10-20%)  prefix B3

   Mirrors the FAR pack's shape so study.html consumes it identically: one
   Exam-Readiness meter (blueprint-weighted by the B1/B2/B3 module prefix), one
   Mock at 60%. All content is original / blueprint-derived.

   ENGINE NOTES (why this pack actually works rather than being cosmetic):
   • Boss IDs: the engine only honors four hardcoded ids — "audit" (hand size 7),
     "restate" (first scored hand halves), "doubt" (one fewer discard), and
     "conservative" (−10 chips per REV card). A pack boss with a novel id is
     picked but does NOTHING. So BAR reuses audit/restate/doubt (all suit-agnostic
     and functional) and SKIPS conservative, whose effect keys off a REV suit BAR
     doesn't have. Themed names below; mechanics are real.
   • Module prefixes feed blueprint weighting (study.html splits moduleKey on ".").
   • Doctrine apply(c) uses only ctx members the engine provides:
     c.el.<SUIT> (count), c.t("tag") (count), c.played[], c.handsThisBlind,
     c.hand.mult, c.addChips/addMult/xMult, c.st(id). Every per-suit multiplier
     is guarded by `if (c.el.X)` so an absent suit can never produce NaN.
   ============================================================================ */
(function () {
"use strict";

function elCounts(cs){ var e={}; cs.forEach(function(c){ e[c.el]=(e[c.el]||0)+1; }); return e; }
function maxElCount(cs){ var e=elCounts(cs); return Math.max(0, ...Object.values(e)); }
function distinctEls(cs){ return Object.keys(elCounts(cs)).length; }

/* ---------- elements (the five "suits") ---------- */
var ELEMENTS = {
  ANLY: { label: "Analysis & Ratios",  color: "#5cffea" },  // Area I
  COST: { label: "Cost & Managerial",  color: "#ffb627" },  // Area I
  FIN:  { label: "Corporate Finance",  color: "#5cb8ff" },  // Area I
  AFR:  { label: "Advanced Reporting", color: "#7dff9e" },  // Area II
  GOV:  { label: "State & Local Gov",  color: "#c08bff" }   // Area III
};

/* ---------- modules (19, grouped into the three blueprint areas) ---------- */
var MODULES = {
  // Area I — Business Analysis & Financial Management
  "B1.M1": "Ratio & Financial Statement Analysis",
  "B1.M2": "Data Analytics & Visualization",
  "B1.M3": "Forecasting & Prospective Analysis",
  "B1.M4": "Capital Budgeting & Valuation",
  "B1.M5": "Cost Accounting & Allocation",
  "B1.M6": "Performance Management (CVP, KPIs)",
  "B1.M7": "Corporate Finance (WACC, Working Capital)",
  "B1.M8": "Risk Management (COSO ERM)",
  // Area II — Technical Accounting & Reporting
  "B2.M1": "Business Combinations & Consolidations",
  "B2.M2": "Intangibles, Goodwill & Impairment",
  "B2.M3": "Share-Based Compensation",
  "B2.M4": "Derivatives & Hedge Accounting",
  "B2.M5": "Revenue Recognition (Advanced)",
  "B2.M6": "Leases (Lessor / Advanced)",
  "B2.M7": "Foreign Currency",
  "B2.M8": "Segment Reporting & Public-Company Disclosures",
  // Area III — State, Local & Governmental
  "B3.M1": "Governmental Funds & Modified Accrual",
  "B3.M2": "Government-Wide Reporting & Reconciliation",
  "B3.M3": "Fund Statements & Net Position"
};

// blueprint-area weights (midpoints of the AICPA ranges, normalized to 1.0).
// keyed by the module-key prefix the engine extracts via key.split(".")[0].
var BLUEPRINT_WEIGHTS = { B1: 0.38, B2: 0.44, B3: 0.18 };

/* ---------- card pool (the deck the player drafts from) ---------- */
var POOL = [
  // ---- Area I · Analysis & Ratios (ANLY) ----
  { n: "Current Ratio",            el: "ANLY", v: 30, tags: ["ratio"],          moduleKey: "B1.M1" },
  { n: "Quick Ratio",              el: "ANLY", v: 30, tags: ["ratio"],          moduleKey: "B1.M1" },
  { n: "Debt-to-Equity",           el: "ANLY", v: 35, tags: ["ratio"],          moduleKey: "B1.M1" },
  { n: "Return on Equity",         el: "ANLY", v: 35, tags: ["ratio"],          moduleKey: "B1.M1" },
  { n: "Inventory Turnover",       el: "ANLY", v: 30, tags: ["ratio"],          moduleKey: "B1.M1" },
  { n: "Cash Conversion Cycle",    el: "ANLY", v: 40, tags: ["ratio"],          moduleKey: "B1.M1" },
  { n: "Trend Dashboard",          el: "ANLY", v: 35, tags: ["dataviz"],        moduleKey: "B1.M2" },
  { n: "Variance Scatterplot",     el: "ANLY", v: 30, tags: ["dataviz"],        moduleKey: "B1.M2" },
  // ---- Area I · Cost & Managerial (COST) ----
  { n: "Direct Material Variance", el: "COST", v: 35, tags: ["variance"],       moduleKey: "B1.M5" },
  { n: "Direct Labor Variance",    el: "COST", v: 35, tags: ["variance"],       moduleKey: "B1.M5" },
  { n: "Overhead Applied",         el: "COST", v: 30, tags: ["overhead"],       moduleKey: "B1.M5" },
  { n: "Equivalent Units",         el: "COST", v: 40, tags: ["allocation"],     moduleKey: "B1.M5" },
  { n: "Contribution Margin",      el: "COST", v: 35, tags: ["cvp"],            moduleKey: "B1.M6" },
  { n: "Break-Even Point",         el: "COST", v: 30, tags: ["cvp"],            moduleKey: "B1.M6" },
  { n: "Balanced Scorecard",       el: "COST", v: 35, tags: ["kpi"],            moduleKey: "B1.M6" },
  // ---- Area I · Corporate Finance (FIN) ----
  { n: "Net Present Value",        el: "FIN",  v: 45, tags: ["npv"],            moduleKey: "B1.M4" },
  { n: "Internal Rate of Return",  el: "FIN",  v: 40, tags: ["npv"],            moduleKey: "B1.M4" },
  { n: "Payback Period",           el: "FIN",  v: 25, tags: ["capbudget"],      moduleKey: "B1.M4" },
  { n: "Cost of Capital (WACC)",   el: "FIN",  v: 40, tags: ["wacc"],           moduleKey: "B1.M7" },
  { n: "Working Capital",          el: "FIN",  v: 30, tags: ["liquidity"],      moduleKey: "B1.M7" },
  { n: "Sales Forecast",           el: "FIN",  v: 35, tags: ["forecast"],       moduleKey: "B1.M3" },
  { n: "Sensitivity Analysis",     el: "FIN",  v: 35, tags: ["forecast"],       moduleKey: "B1.M3" },
  { n: "COSO ERM Map",             el: "FIN",  v: 35, tags: ["risk"],           moduleKey: "B1.M8" },
  // ---- Area II · Advanced Financial Reporting (AFR) ----
  { n: "Acquisition Goodwill",     el: "AFR",  v: 45, tags: ["consol","goodwill"], moduleKey: "B2.M1" },
  { n: "Intercompany Elimination", el: "AFR",  v: 50, tags: ["consol"],         moduleKey: "B2.M1" },
  { n: "Noncontrolling Interest",  el: "AFR",  v: 45, tags: ["consol"],         moduleKey: "B2.M1" },
  { n: "Goodwill Impairment",      el: "AFR",  v: 40, tags: ["goodwill","impair"], moduleKey: "B2.M2" },
  { n: "Stock Options",            el: "AFR",  v: 40, tags: ["sbc"],            moduleKey: "B2.M3" },
  { n: "Stock Appreciation Rights",el: "AFR",  v: 35, tags: ["sbc"],            moduleKey: "B2.M3" },
  { n: "Interest Rate Swap",       el: "AFR",  v: 40, tags: ["deriv","hedge"],  moduleKey: "B2.M4" },
  { n: "Cash Flow Hedge",          el: "AFR",  v: 40, tags: ["deriv","hedge"],  moduleKey: "B2.M4" },
  { n: "Variable Consideration",   el: "AFR",  v: 35, tags: ["rev"],            moduleKey: "B2.M5" },
  { n: "Sales-Type Lease",         el: "AFR",  v: 40, tags: ["lease"],          moduleKey: "B2.M6" },
  { n: "Foreign Currency Translation", el: "AFR", v: 35, tags: ["fx"],          moduleKey: "B2.M7" },
  { n: "Segment Disclosure",       el: "AFR",  v: 35, tags: ["segment"],        moduleKey: "B2.M8" },
  // ---- Area III · State & Local Government (GOV) ----
  { n: "General Fund",             el: "GOV",  v: 35, tags: ["fund"],           moduleKey: "B3.M1" },
  { n: "Modified Accrual",         el: "GOV",  v: 35, tags: ["fund"],           moduleKey: "B3.M1" },
  { n: "Government-Wide Statements", el: "GOV", v: 40, tags: ["govwide"],       moduleKey: "B3.M2" },
  { n: "Fund-to-Government Reconciliation", el: "GOV", v: 45, tags: ["recon","govwide"], moduleKey: "B3.M2" },
  { n: "Enterprise Fund",          el: "GOV",  v: 35, tags: ["fund"],           moduleKey: "B3.M3" },
  { n: "Net Position",             el: "GOV",  v: 35, tags: ["govwide"],        moduleKey: "B3.M3" }
];

var WEAKNESS_CARD = { n: "Unsupported Assumption", el: "ANLY", v: 0, tags: ["weakness"], moduleKey: null, weakness: true };

/* ---------- hand types (poker-like; highest matching mult wins) ----------
   Cross-Functional Analysis (×3, three DIFFERENT suits) sits below the
   three-of-a-kind, so breadth vs. depth is a real choice — the BAR analog of
   FAR's Matched Entry. */
var HAND_TYPES = [
  { name: "Single Metric",            condition: function(cs){ return true; },                 mult: 1, how: "Any single card" },
  { name: "Comparative Pair",         condition: function(cs){ return maxElCount(cs) >= 2; },  mult: 2, how: "2 cards of the same suit" },
  { name: "Cross-Functional Analysis",condition: function(cs){ return distinctEls(cs) >= 3; }, mult: 3, how: "3 cards of different suits" },
  { name: "Trend Line",               condition: function(cs){ return maxElCount(cs) >= 3; },  mult: 4, how: "3 cards of the same suit" },
  { name: "Consolidation",            condition: function(cs){ return maxElCount(cs) >= 4; },  mult: 6, how: "4 cards of the same suit" },
  { name: "Integrated Report",        condition: function(cs){ return maxElCount(cs) >= 5; },  mult: 9, how: "5 cards of the same suit" }
];

/* ---------- doctrines (the "jokers") — each teaches one BAR concept ----------
   Schema mirrors FAR: {id, rarity, n, d, apply}. d carries the teaching note. */
var ALLJK = [
  // -- common: per-suit chip engines + light mult --
  { id:"ratioanalysis", rarity:"common", n:"Ratio Analysis",
    d:"+12 chips per Analysis card. (Ratios condense statements into comparable signals.)",
    apply: function(c){ if(c.el.ANLY) c.addChips(12*c.el.ANLY, "Ratio Analysis"); } },
  { id:"standardcosting", rarity:"common", n:"Standard Costing",
    d:"+12 chips per Cost card. (Standards are the yardstick variances are measured against.)",
    apply: function(c){ if(c.el.COST) c.addChips(12*c.el.COST, "Standard Costing"); } },
  { id:"timevalue", rarity:"common", n:"Time Value of Money",
    d:"+13 chips per Corporate-Finance card. (A dollar today is worth more than a dollar later.)",
    apply: function(c){ if(c.el.FIN) c.addChips(13*c.el.FIN, "Time Value"); } },
  { id:"fundaccounting", rarity:"common", n:"Fund Accounting",
    d:"+14 chips per Government card. (Governments account by fund, not by entity.)",
    apply: function(c){ if(c.el.GOV) c.addChips(14*c.el.GOV, "Fund Accounting"); } },
  { id:"consolidatedreporting", rarity:"common", n:"Consolidated Reporting",
    d:"+10 chips per Advanced-Reporting card.",
    apply: function(c){ if(c.el.AFR) c.addChips(10*c.el.AFR, "Consolidated Reporting"); } },
  { id:"benchmarking", rarity:"common", n:"Benchmarking",
    d:"2+ Analysis cards: +3 Mult. (A ratio means little until compared to a peer.)",
    apply: function(c){ if((c.el.ANLY||0) >= 2) c.addMult(3, "Benchmarking"); } },
  { id:"horizontal", rarity:"common", n:"Horizontal Analysis",
    d:"Any combo (a pair or better): +2 Mult. (Period-over-period change is the lens.)",
    apply: function(c){ if(c.hand.mult >= 2) c.addMult(2, "Horizontal"); } },

  // -- uncommon: concept combos --
  { id:"varianceanalysis", rarity:"uncommon", n:"Variance Analysis",
    d:"2+ variance cards: +40 chips and +3 Mult. (Split the flex-budget gap into price and quantity.)",
    apply: function(c){ if(c.t("variance") >= 2){ c.addChips(40,"Variance Analysis"); c.addMult(3,"Variance Analysis"); } } },
  { id:"cvp", rarity:"uncommon", n:"Cost-Volume-Profit",
    d:"2+ CVP cards: +5 Mult. (Contribution margin drives the break-even.)",
    apply: function(c){ if(c.t("cvp") >= 2) c.addMult(5, "CVP"); } },
  { id:"hedgeeffectiveness", rarity:"uncommon", n:"Hedge Effectiveness",
    d:"2+ hedge cards: +35 chips and +2 Mult. (An effective hedge defers gains to OCI.)",
    apply: function(c){ if(c.t("hedge") >= 2){ c.addChips(35,"Hedge"); c.addMult(2,"Hedge"); } } },
  { id:"sharebasedcomp", rarity:"uncommon", n:"Share-Based Comp",
    d:"+3 Mult per stock-comp card. (Expensed over the requisite service period.)",
    apply: function(c){ var n=c.t("sbc"); if(n) c.addMult(3*n, "Share-Based Comp"); } },
  { id:"dataanalytics", rarity:"uncommon", n:"Data Analytics",
    d:"With a visualization card, re-score your highest Analysis card's chips. (Read the data twice.)",
    apply: function(c){ if(c.t("dataviz")){ var vals=c.played.filter(function(x){return x.el==="ANLY";}).map(function(x){return x.v;}); var mx=vals.length?Math.max.apply(null,vals):0; if(mx>0) c.addChips(mx, "Data Analytics"); } } },
  { id:"govwide", rarity:"uncommon", n:"Government-Wide Reconciliation",
    d:"A fund card + a government-wide card: +50 chips. (Bridge modified-accrual funds to full-accrual government-wide.)",
    apply: function(c){ if(c.t("fund") && c.t("govwide")) c.addChips(50, "Gov-Wide Recon"); } },
  { id:"prospective", rarity:"uncommon", n:"Prospective Analysis",
    d:"+2 Mult, plus +1 more for each hand already played this close. (Forecasts compound.)",
    apply: function(c){ c.addMult(2 + (c.handsThisBlind||0), "Prospective"); } },
  { id:"leverage", rarity:"uncommon", n:"Operating Leverage",
    d:"+2 Mult per Cost card. (Fixed costs magnify swings in operating income.)",
    apply: function(c){ if(c.el.COST) c.addMult(2*c.el.COST, "Operating Leverage"); } },

  // -- rare: ×Mult that scales the whole build --
  { id:"consolidation", rarity:"rare", n:"Intercompany Elimination",
    d:"2+ consolidation cards: ×2 Mult. (Eliminate 100% of intercompany activity.)",
    apply: function(c){ if(c.t("consol") >= 2) c.xMult(2, "Elimination"); } },
  { id:"synergy", rarity:"rare", n:"Acquisition Synergy",
    d:"×Mult grows 0.5 for each Advanced-Reporting card played.",
    apply: function(c){ if(c.el.AFR) c.xMult(1 + 0.5*c.el.AFR, "Synergy"); } },
  { id:"npvpremium", rarity:"rare", n:"Positive NPV",
    d:"On a Cross-Functional Analysis or better: ×1.5 Mult. (A positive-NPV project adds value.)",
    apply: function(c){ if(c.hand.mult >= 3) c.xMult(1.5, "Positive NPV"); } },
  { id:"wacc", rarity:"rare", n:"Cost of Capital",
    d:"×Mult grows 0.25 for each Corporate-Finance card played.",
    apply: function(c){ if(c.el.FIN) c.xMult(1 + 0.25*c.el.FIN, "WACC"); } },
  { id:"integratedreport", rarity:"rare", n:"Integrated Reporting",
    d:"On a Consolidation or better (4+ same suit): ×2 Mult.",
    apply: function(c){ if(c.hand.mult >= 6) c.xMult(2, "Integrated Report"); } }
];

var STARTER_UNLOCKS = ["ratioanalysis", "timevalue"];

var UNLOCK_CONDITIONS = {
  ratioanalysis:        function(ctx){ return (ctx.el.ANLY||0) >= 1; },
  standardcosting:      function(ctx){ return (ctx.el.COST||0) >= 1; },
  timevalue:            function(ctx){ return (ctx.el.FIN||0)  >= 1; },
  fundaccounting:       function(ctx){ return (ctx.el.GOV||0)  >= 1; },
  consolidatedreporting:function(ctx){ return (ctx.el.AFR||0)  >= 1; },
  benchmarking:         function(ctx){ return (ctx.el.ANLY||0) >= 2; },
  horizontal:           function(ctx){ return ctx.hand.mult >= 2; },
  varianceanalysis:     function(ctx){ return ctx.t("variance") >= 2; },
  cvp:                  function(ctx){ return ctx.t("cvp") >= 2; },
  hedgeeffectiveness:   function(ctx){ return ctx.t("hedge") >= 2; },
  sharebasedcomp:       function(ctx){ return ctx.t("sbc") >= 1; },
  dataanalytics:        function(ctx){ return ctx.t("dataviz") >= 1; },
  govwide:              function(ctx){ return ctx.t("fund") >= 1 && ctx.t("govwide") >= 1; },
  prospective:          function(ctx){ return (ctx.el.FIN||0) >= 1; },
  leverage:             function(ctx){ return (ctx.el.COST||0) >= 2; },
  consolidation:        function(ctx){ return ctx.t("consol") >= 2; },
  synergy:              function(ctx){ return (ctx.el.AFR||0) >= 2; },
  npvpremium:           function(ctx){ return ctx.hand.mult >= 3; },
  wacc:                 function(ctx){ return (ctx.el.FIN||0) >= 2; },
  integratedreport:     function(ctx){ return ctx.hand.mult >= 6; }
};

var TAGINFO = {
  ratio:"financial ratio", dataviz:"data visualization", variance:"standard-cost variance",
  overhead:"overhead allocation", cvp:"cost-volume-profit", allocation:"cost allocation",
  kpi:"performance metric", npv:"time-value", capbudget:"capital budgeting", wacc:"cost of capital",
  liquidity:"working capital", forecast:"prospective", risk:"enterprise risk",
  consol:"consolidation", goodwill:"goodwill", impair:"impairment", sbc:"share-based comp",
  deriv:"derivative", hedge:"hedge", rev:"advanced revenue", lease:"lessor lease",
  fx:"foreign currency", segment:"segment", fund:"governmental fund", govwide:"government-wide",
  recon:"fund reconciliation"
};

var CONSUMABLES = [
  { id:"reforecast",    n:"Re-Forecast",     d:"A selected card gains a forecast tag.",                          type:"target", ok:function(){return true;}, act:function(c){ if(!c.tags.includes("forecast")) c.tags.push("forecast"); } },
  { id:"capitalize",    n:"Capitalize",      d:"Turn a selected Cost card into an Advanced-Reporting card.",     type:"target", ok:function(c){ return c.el==="COST"; }, act:function(c){ c.el="AFR"; } },
  { id:"designatehedge",n:"Designate Hedge", d:"A selected card gains a hedge tag.",                             type:"target", ok:function(){return true;}, act:function(c){ if(!c.tags.includes("hedge")) c.tags.push("hedge"); } },
  { id:"consolidate",   n:"Consolidate",     d:"A selected card gains a consolidation tag.",                     type:"target", ok:function(){return true;}, act:function(c){ if(!c.tags.includes("consol")) c.tags.push("consol"); } },
  { id:"dividend",      n:"Issue Dividend",  d:"Distribute cash to shareholders: gain $5.",                      type:"instant", act:function(h){ h.G.money += 5; } },
  { id:"addratio",      n:"Add Ratio",       d:"Add a Return on Equity card to your deck.",                      type:"instant", act:function(h){ h.G.masterDeck.push(h.mk({ n:"Return on Equity", el:"ANLY", v:35, moduleKey:"B1.M1", tags:["ratio"] })); } }
];

// Reuse only the four engine-honored boss ids (see header). conservative is
// omitted because its −10/REV effect is a no-op without a REV suit.
var BOSSES = [
  { id:"audit",   n:"SEC COMMENT LETTER",       d:"Hand size reduced to 7." },
  { id:"restate", n:"PRIOR-PERIOD RESTATEMENT",  d:"Your first scored hand this close scores half." },
  { id:"doubt",   n:"GOING CONCERN DOUBT",       d:"One fewer discard." }
];

var TARGETS = { 1:[300,600,1000], 2:[1200,1800,2800], 3:[3500,5000,7500], 4:[9000,13000,20000] };

window.ACED_PACK = {
  id: "cpa-bar",
  name: "CPA · BAR",
  description: "Business Analysis & Reporting · 4-hour CPA discipline. Financial analysis, advanced technical accounting, and state & local government, taught as a roguelike deckbuilder.",
  section: "BAR",
  // Original-content question banks, loaded in sequence by study.html / daily.html.
  questionBanks: [
    "packs/originals/bar-batch-01.js"
  ],
  elements: ELEMENTS,
  modules: MODULES,
  blueprintWeights: BLUEPRINT_WEIGHTS,
  cards: POOL,
  doctrines: ALLJK,
  consumables: CONSUMABLES,
  bosses: BOSSES,
  targets: TARGETS,
  maxAnte: 4,
  blindLabels: ["Q1 ANALYSIS", "MID-YEAR REVIEW", "YEAR-END REPORT"],
  tagInfo: TAGINFO,
  starterUnlocks: STARTER_UNLOCKS,
  codexHints: {
    ratioanalysis:"Starter doctrine.", timevalue:"Starter doctrine.",
    consolidation:"Play 2+ consolidation-tagged cards in one hand.",
    govwide:"Play a fund card next to a government-wide card.",
    cvp:"Pair Contribution Margin with Break-Even Point."
  },
  handTypes: HAND_TYPES,
  unlockConditions: UNLOCK_CONDITIONS,
  weaknessCard: WEAKNESS_CARD,
  starter: { doctrines: ["ratioanalysis", "timevalue"], money: 4 }
};
})();
