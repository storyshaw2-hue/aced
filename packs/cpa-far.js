/* ===== ACED EXAM PACK · CPA · FAR =====
   Financial Accounting & Reporting. Extracted from the original FAR-hardcoded
   study.html engine into a swappable pack file. Exposes window.ACED_PACK.
   The engine (study.html) loads this, then loads pack.questionBank, then
   calls window._packReady(). All scoring/teaching content lives here. */
(function () {
"use strict";

// ---- TAG INFO: tag key -> human label shown on cards ----
var TAGINFO={cash:"cash",inv:"inventory",ppe:"PP&E",intang:"intangible",def:"deferral",oci:"OCI item",loss:"loss/write-down",impair:"impairment",treasury:"treasury",fx:"foreign currency",fv:"fair value",bond:"bond",lease:"lease"};

// ---- ELEMENTS: the suits / categories of cards ----
var ELEMENTS={
  REV:    {label:"Revenue",   color:"#5cffea"},
  EXP:    {label:"Expense",   color:"#ff8a5c"},
  ASSET:  {label:"Asset",     color:"#7dff9e"},
  LIAB:   {label:"Liability", color:"#ff5cb8"},
  EQUITY: {label:"Equity",    color:"#ffd23f"}
};

// ---- MODULES: FAR F1-F4 module key -> human label (standard FAR curriculum) ----
var MODULES={
  "F1.M1":"Income Statement","F1.M2":"Reporting & Disclosures","F1.M3":"Special Reporting","F1.M4":"Statement of Cash Flows",
  "F2.M1":"Revenue Recognition","F2.M2":"Receivables","F2.M3":"Inventory","F2.M4":"PP&E","F2.M5":"Intangibles & Impairment",
  "F2.M6":"Investments","F2.M7":"Financial Instruments / OCI","F3.M1":"Cash & Equivalents","F3.M4":"Bonds & Long-Term Debt",
  "F3.M5":"Leases & Pensions","F4.M1":"Stockholders' Equity","F4.M2":"Earnings per Share","F4.M3":"Statement of Changes",
  "F4.M4":"Income Taxes","F4.M5":"Governmental Accounting","F4.M6":"Not-for-Profit Entities"
};

// ---- CARDS: the deck pool ----
var POOL=[
  {n:"Sales Revenue",el:"REV",v:35,moduleKey:"F2.M1"},{n:"Service Revenue",el:"REV",v:40,moduleKey:"F2.M1"},{n:"Interest Income",el:"REV",v:30,moduleKey:"F2.M6"},
  {n:"Rental Income",el:"REV",v:35,moduleKey:"F3.M5"},{n:"Gain on Sale",el:"REV",v:45,moduleKey:"F2.M4"},{n:"FX Transaction Gain",el:"REV",v:35,tags:["fx"],moduleKey:"F1.M3"},
  {n:"Cost of Goods Sold",el:"EXP",v:35,moduleKey:"F2.M3"},{n:"Wages Expense",el:"EXP",v:30,moduleKey:"F1.M1"},{n:"Rent Expense",el:"EXP",v:30,moduleKey:"F1.M1"},
  {n:"Depreciation",el:"EXP",v:25,tags:["loss"],moduleKey:"F2.M4"},{n:"Impairment Loss",el:"EXP",v:40,tags:["loss","impair"],moduleKey:"F2.M5"},
  {n:"Interest Expense",el:"EXP",v:25,moduleKey:"F3.M4"},{n:"Amortization",el:"EXP",v:25,tags:["loss"],moduleKey:"F2.M5"},
  {n:"Cash",el:"ASSET",v:30,tags:["cash"],moduleKey:"F1.M1"},{n:"Accounts Receivable",el:"ASSET",v:35,moduleKey:"F2.M2"},{n:"Inventory",el:"ASSET",v:30,tags:["inv"],moduleKey:"F2.M3"},
  {n:"Equipment",el:"ASSET",v:40,tags:["ppe"],moduleKey:"F2.M4"},{n:"Land",el:"ASSET",v:45,tags:["ppe"],moduleKey:"F2.M4"},{n:"Patent",el:"ASSET",v:35,tags:["intang"],moduleKey:"F2.M5"},
  {n:"Goodwill",el:"ASSET",v:40,tags:["intang"],moduleKey:"F2.M5"},{n:"Right-of-Use Asset",el:"ASSET",v:40,tags:["ppe","lease"],moduleKey:"F3.M5"},
  {n:"Construction in Progress",el:"ASSET",v:35,moduleKey:"F2.M1"},{n:"AFS Debt Securities",el:"ASSET",v:35,tags:["oci","fv"],moduleKey:"F2.M7"},
  {n:"Accounts Payable",el:"LIAB",v:30,moduleKey:"F1.M2"},{n:"Unearned Revenue",el:"LIAB",v:30,tags:["def"],moduleKey:"F2.M1"},{n:"Notes Payable",el:"LIAB",v:35,moduleKey:"F3.M4"},
  {n:"Bonds Payable",el:"LIAB",v:40,tags:["bond"],moduleKey:"F3.M4"},{n:"Lease Liability",el:"LIAB",v:35,tags:["lease"],moduleKey:"F3.M5"},
  {n:"Deferred Tax Liability",el:"LIAB",v:30,tags:["def"],moduleKey:"F4.M4"},{n:"Pension Liability",el:"LIAB",v:30,tags:["oci"],moduleKey:"F3.M5"},
  {n:"Common Stock",el:"EQUITY",v:40,moduleKey:"F4.M1"},{n:"Retained Earnings",el:"EQUITY",v:45,moduleKey:"F4.M1"},{n:"Paid-In Capital",el:"EQUITY",v:35,moduleKey:"F4.M1"},
  {n:"Treasury Stock",el:"EQUITY",v:35,tags:["treasury"],moduleKey:"F4.M1"},{n:"AOCI",el:"EQUITY",v:35,tags:["oci"],moduleKey:"F4.M1"}
];

// Weakness Card — polluted into the deck when an Audit Moment is missed. Scores 0 chips.
var WEAKNESS_CARD={n:"Unstudied Topic",el:"EXP",v:0,tags:["weakness"],moduleKey:null,weakness:true};

// v13: the accounting-themed doctrines, their codex hints and their unlock conditions were
// all REMOVED. Jokers are a subject-agnostic game layer that now lives in the engine's core
// library (packs/core-jokers.js), so this pack carries only CPA content.

// ---- CONSUMABLES: adjusting entries, one-shot deck modifiers ----
// `act` for instant types receives the engine helpers {G, mk} so it can mutate the deck.
var CONSUMABLES=[
  {id:"capitalize",n:"Capitalize",d:"Turn a selected Expense card into a PP&E Asset (deck-wide).",type:"target",ok:c=>c.el==="EXP",act:c=>{c.el="ASSET";if(!c.tags.includes("ppe"))c.tags=["ppe"];}},
  {id:"writedown",n:"Write-Down",d:"A selected card gains a loss tag (impairment).",type:"target",ok:()=>true,act:c=>{if(!c.tags.includes("loss"))c.tags.push("loss");}},
  {id:"defer",n:"Deferral",d:"A selected card gains a deferral tag.",type:"target",ok:()=>true,act:c=>{if(!c.tags.includes("def"))c.tags.push("def");}},
  {id:"reclassify",n:"Reclassify",d:"Change a selected card's element to the next type.",type:"target",ok:()=>true,act:c=>{const o=["REV","EXP","ASSET","LIAB","EQUITY"];c.el=o[(o.indexOf(c.el)+1)%o.length];}},
  {id:"accrue",n:"Accrue Revenue",d:"Add a Service Revenue card to your deck.",type:"instant",act:(helpers)=>{helpers.G.masterDeck.push(helpers.mk({n:"Service Revenue",el:"REV",v:40}));}},
  {id:"issue",n:"Issue Stock",d:"Issue equity for cash: gain $5.",type:"instant",act:(helpers)=>{helpers.G.money+=5;}}
];

// ---- TARGETS per ante/blind ----
var TARGETS={1:[300,600,1000],2:[1200,1800,2800],3:[3500,5000,7500],4:[9000,13000,20000]};
var MAXANTE=4;
var BLINDLBL=["Q1 CLOSE","MID-YEAR CLOSE","YEAR-END CLOSE"];

window.ACED_PACK={
  id:"cpa-far",
  name:"CPA · FAR",
  description:"Financial Accounting & Reporting · 4-hour CPA exam section. F1–F4 taught through a roguelike-deckbuilder roguelike.",
  examDate:"2026-06-25",
  section:"FAR",
  // Original-content question banks, loaded in sequence by study.html / daily.html.
  // Single source of truth so every mode shares the same bank set.
  questionBanks:[
    "packs/originals/far-original-batch-02.js",
    "packs/originals/far-original-batch-03.js",
    "packs/originals/far-original-batch-04.js",
    "packs/originals/far-f1-batch-05.js",
    "packs/originals/far-f3-batch-06.js",
    "packs/originals/far-original-batch-07.js",
    "packs/originals/far-f4m3-batch-08.js",
    "packs/originals/far-f4-batch-09.js",
    "packs/originals/far-f1-batch-10.js"
  ],
  // content
  cards:POOL,
  // NOTE: jokers ("doctrines") are NOT provided here. They're a subject-agnostic game layer
  // that lives in the engine (packs/core-jokers.js, window.ACED_CORE_JOKERS), so every exam
  // pack inherits the same set. A pack MAY still add its own via a `doctrines` array here.
  consumables:CONSUMABLES,
  // bosses removed — generic boss blinds come from the engine (CORE_BOSSES).
  targets:TARGETS,
  maxAnte:MAXANTE,
  blindLabels:BLINDLBL,
  tagInfo:TAGINFO,
  modules:MODULES,
  // Approx AICPA FAR area emphasis by F-group (sums to ~1). Public blueprint weighting,
  // not exam content; tune with a CPA. Used to weight the Exam Readiness meter (CC-3).
  blueprintWeights:{F1:0.30,F2:0.32,F3:0.18,F4:0.20},
  elements:ELEMENTS,
  // handTypes removed — combos come from the engine (generic CORE_HAND_TYPES).
  weaknessCard:WEAKNESS_CARD,
  // starter: only opening money — the equipped joker loadout comes from core-jokers.js
  starter:{money:4}
};
})();
