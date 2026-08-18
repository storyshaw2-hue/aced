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
   • Module prefixes feed blueprint weighting (study.html splits moduleKey on ".").
   • v13: this pack ships CONTENT ONLY — cards, suits, modules, tags, consumables
     and targets. The game layer (jokers, boss blinds, hand types) is subject-
     agnostic and lives in the engine: packs/core-jokers.js plus CORE_BOSSES and
     CORE_HAND_TYPES in study.html. A pack may still override any of them by
     exporting its own `doctrines`, `bosses` or `handTypes`; when it doesn't, the
     engine's generic set is used. Those generic bosses and combos read card TYPES
     abstractly, so nothing keys off a suit BAR doesn't have.
   ============================================================================ */
(function () {
"use strict";

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

var TARGETS = { 1:[300,600,1000], 2:[1200,1800,2800], 3:[3500,5000,7500], 4:[9000,13000,20000] };

window.ACED_PACK = {
  id: "cpa-bar",
  name: "CPA · BAR",
  description: "Business Analysis & Reporting · 4-hour CPA discipline. Financial analysis, advanced technical accounting, and state & local government, taught as a roguelike deckbuilder.",
  section: "BAR",
  // Original-content question banks, loaded in sequence by study.html / daily.html.
  questionBanks: [
    "packs/originals/bar-batch-01.js",
    "packs/originals/bar-batch-02.js",
    "packs/originals/bar-batch-03.js",
    "packs/originals/bar-batch-04.js",
    "packs/originals/bar-batch-05.js",
    "packs/originals/bar-batch-06.js"
  ],
  elements: ELEMENTS,
  modules: MODULES,
  blueprintWeights: BLUEPRINT_WEIGHTS,
  cards: POOL,
  // doctrines removed — jokers come from the engine core (window.ACED_CORE_JOKERS).
  consumables: CONSUMABLES,
  // bosses removed — generic boss blinds come from the engine (CORE_BOSSES).
  targets: TARGETS,
  maxAnte: 4,
  blindLabels: ["Q1 ANALYSIS", "MID-YEAR REVIEW", "YEAR-END REPORT"],
  tagInfo: TAGINFO,
  // starterUnlocks removed — the engine core unlocks its own commons (window.ACED_CORE_JOKERS).
  // handTypes removed — combos come from the engine (generic CORE_HAND_TYPES).
  weaknessCard: WEAKNESS_CARD,
  // starter: only opening money — the equipped joker loadout comes from core-jokers.js
  starter: { money: 4 }
};
})();
