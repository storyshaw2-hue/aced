/* ===== ACED EXAM PACK · CPA · REG =====
   Regulation — federal taxation, business law, ethics & professional
   responsibilities. Section-agnostic engine: same study.html, different
   window.ACED_PACK. Open with  study.html?pack=cpa-reg  (or daily.html?pack=cpa-reg).

   Module keys follow the FIVE AICPA REG blueprint AREAS (not Becker chapters):
     REG.R1 = Area I   Ethics, Professional Responsibilities & Federal Tax Procedures
     REG.R2 = Area II  Business Law
     REG.R3 = Area III Federal Taxation of Property Transactions
     REG.R4 = Area IV  Federal Taxation of Individuals
     REG.R5 = Area V   Federal Taxation of Entities
   Content is always classified by SUBJECT MATTER into these areas.
   Exposes window.ACED_PACK. */
(function () {
"use strict";

// TAG INFO — concept tags surfaced on cards (and keyed off by consumables)
var TAGINFO={credit:"tax credit",basis:"basis rule",election:"tax election",capgain:"capital gain",flow:"flow-through"};

// ELEMENTS — the "suits" are the five REG areas (reskin of FAR's account types)
var ELEMENTS={
  PROC:  {label:"Procedures & Ethics", color:"#ffd23f"},
  LAW:   {label:"Business Law",        color:"#7dff9e"},
  PROP:  {label:"Property",            color:"#ff8a5c"},
  INDIV: {label:"Individuals",         color:"#5cffea"},
  ENT:   {label:"Entities",            color:"#ff5cb8"}
};

// MODULES — the five AICPA REG blueprint areas
var MODULES={
  "REG.R1":"Ethics, Professional Responsibilities & Federal Tax Procedures",
  "REG.R2":"Business Law",
  "REG.R3":"Federal Taxation of Property Transactions",
  "REG.R4":"Federal Taxation of Individuals",
  "REG.R5":"Federal Taxation of Entities"
};

// CARDS — tax/law concepts mapped to suits + modules (mastery accrues per area)
var POOL=[
  // Procedures & Ethics / R1
  {n:"Circular 230",el:"PROC",v:35,moduleKey:"REG.R1"},
  {n:"Statute of Limitations",el:"PROC",v:30,moduleKey:"REG.R1"},
  {n:"Estimated Payments",el:"PROC",v:30,moduleKey:"REG.R1"},
  {n:"Preparer Penalties",el:"PROC",v:30,moduleKey:"REG.R1"},
  // Business Law / R2
  {n:"Contract Formation",el:"LAW",v:35,moduleKey:"REG.R2"},
  {n:"UCC Sales",el:"LAW",v:30,moduleKey:"REG.R2"},
  {n:"Agency",el:"LAW",v:30,moduleKey:"REG.R2"},
  {n:"Secured Transactions",el:"LAW",v:35,tags:["basis"],moduleKey:"REG.R2"},
  {n:"Bankruptcy",el:"LAW",v:35,moduleKey:"REG.R2"},
  // Property Transactions / R3
  {n:"Adjusted Basis",el:"PROP",v:40,tags:["basis"],moduleKey:"REG.R3"},
  {n:"Capital Gain & Loss",el:"PROP",v:35,tags:["capgain"],moduleKey:"REG.R3"},
  {n:"Section 1231/1245",el:"PROP",v:35,moduleKey:"REG.R3"},
  {n:"Like-Kind Exchange",el:"PROP",v:35,tags:["election"],moduleKey:"REG.R3"},
  {n:"Depreciation & §179",el:"PROP",v:30,moduleKey:"REG.R3"},
  // Individuals / R4
  {n:"Gross Income",el:"INDIV",v:40,moduleKey:"REG.R4"},
  {n:"Adjustments to Income",el:"INDIV",v:30,moduleKey:"REG.R4"},
  {n:"Itemized Deductions",el:"INDIV",v:35,moduleKey:"REG.R4"},
  {n:"Tax Credits",el:"INDIV",v:35,tags:["credit"],moduleKey:"REG.R4"},
  {n:"Filing Status",el:"INDIV",v:25,moduleKey:"REG.R4"},
  // Entities / R5
  {n:"C Corporation",el:"ENT",v:40,moduleKey:"REG.R5"},
  {n:"S Corporation",el:"ENT",v:35,tags:["flow"],moduleKey:"REG.R5"},
  {n:"Partnership",el:"ENT",v:35,tags:["flow"],moduleKey:"REG.R5"},
  {n:"Estate & Gift",el:"ENT",v:30,moduleKey:"REG.R5"}
];

var WEAKNESS_CARD={n:"Disallowed Deduction",el:"INDIV",v:0,tags:["weakness"],moduleKey:null,weakness:true};

// CONSUMABLES — tax elections/forms as one-shot deck modifiers
var CONSUMABLES=[
  {id:"election",n:"File an Election",d:"A selected card gains a like-kind (election) tag.",type:"target",ok:()=>true,act:c=>{if(!c.tags.includes("election"))c.tags.push("election");}},
  {id:"recharacterize",n:"Recharacterize",d:"Change a selected card's suit to the next area.",type:"target",ok:()=>true,act:c=>{const o=["PROC","LAW","PROP","INDIV","ENT"];c.el=o[(o.indexOf(c.el)+1)%o.length];}},
  {id:"claimcredit",n:"Claim a Credit",d:"Turn a selected card into a Tax Credits card.",type:"target",ok:()=>true,act:c=>{c.el="INDIV";if(!c.tags.includes("credit"))c.tags.push("credit");}},
  {id:"depreciate",n:"Take Depreciation",d:"Add a Depreciation & §179 card to your deck.",type:"instant",act:(helpers)=>{helpers.G.masterDeck.push(helpers.mk({n:"Depreciation & §179",el:"PROP",v:30}));}},
  {id:"basisstep",n:"Step-Up Basis",d:"Add an Adjusted Basis card to your deck.",type:"instant",act:(helpers)=>{helpers.G.masterDeck.push(helpers.mk({n:"Adjusted Basis",el:"PROP",v:40,tags:["basis"]}));}}
];

var TARGETS={1:[300,600,1000],2:[1200,1800,2800],3:[3500,5000,7500],4:[9000,13000,20000]};
var MAXANTE=4;
var BLINDLBL=["PREPARATION","EXAMINATION","APPEAL"];

window.ACED_PACK={
  id:"cpa-reg",
  name:"CPA · REG",
  description:"Regulation · CPA Core section. Federal taxation, business law, ethics & professional responsibilities.",
  section:"REG",
  template:true,
  questionBanks:["packs/originals/reg-batch-01.js","packs/originals/reg-batch-02.js","packs/originals/reg-batch-03.js","packs/originals/reg-batch-04.js","packs/originals/reg-batch-05.js","packs/originals/reg-batch-06.js","packs/originals/reg-batch-07.js"],
  cards:POOL,
  // doctrines removed — jokers come from the engine core (window.ACED_CORE_JOKERS).
  consumables:CONSUMABLES,
  // bosses removed — generic boss blinds come from the engine (CORE_BOSSES).
  targets:TARGETS,
  maxAnte:MAXANTE,
  blindLabels:BLINDLBL,
  tagInfo:TAGINFO,
  // starterUnlocks removed — the engine core unlocks its own commons (window.ACED_CORE_JOKERS).
  modules:MODULES,
  elements:ELEMENTS,
  // handTypes removed — combos come from the engine (generic CORE_HAND_TYPES).
  weaknessCard:WEAKNESS_CARD,
  // starter: only opening money — the equipped joker loadout comes from core-jokers.js
  starter:{money:4}
};
})();
