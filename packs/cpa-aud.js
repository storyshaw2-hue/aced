/* ===== ACED EXAM PACK · CPA · AUD  (TEMPLATE / multi-section proof) =====
   Auditing & Attestation. This is a STRUCTURAL TEMPLATE that demonstrates the
   engine is section-agnostic: same study.html, different window.ACED_PACK.
   Open it with  study.html?pack=cpa-aud  (or daily.html?pack=cpa-aud).

   It is intentionally lighter than cpa-far.js: the suits and cards are an AUD
   reskin sufficient to play and to drive Audit Moments from the AUD starter bank.
   A production AUD pack would deepen the card pool and the question bank to FAR's
   level — the wiring shown here does not change.

   v13: this pack ships CONTENT ONLY. Jokers, boss blinds and hand types are a
   subject-agnostic game layer supplied by the engine (packs/core-jokers.js plus
   CORE_BOSSES / CORE_HAND_TYPES in study.html); a pack may still override them.
   Exposes window.ACED_PACK. */
(function () {
"use strict";

// TAG INFO
var TAGINFO={confirm:"confirmation",sample:"sampling",control:"control test",fraud:"fraud risk",estimate:"estimate",party:"related party",subseq:"subsequent event"};

// ELEMENTS — the "suits" are audit phases / dimensions (reskin of FAR's account types)
var ELEMENTS={
  ETH:  {label:"Ethics",   color:"#ffd23f"},
  RISK: {label:"Risk",     color:"#ff8a5c"},
  EVID: {label:"Evidence", color:"#5cffea"},
  CTRL: {label:"Controls", color:"#7dff9e"},
  RPT:  {label:"Reporting",color:"#ff5cb8"}
};

// MODULES — the four AICPA AUD blueprint areas
var MODULES={
  "AUD.A1":"Ethics, Independence & Professional Responsibilities",
  "AUD.A2":"Risk Assessment & Planning",
  "AUD.A3":"Evidence & Procedures",
  "AUD.A4":"Forming Conclusions & Reporting"
};

// CARDS — audit concepts mapped to suits + modules (mastery accrues per area)
var POOL=[
  // Ethics / A1
  {n:"Independence",el:"ETH",v:40,tags:[],moduleKey:"AUD.A1"},
  {n:"AICPA Code",el:"ETH",v:30,moduleKey:"AUD.A1"},
  {n:"Engagement Quality Review",el:"ETH",v:30,moduleKey:"AUD.A1"},
  {n:"Engagement Letter",el:"ETH",v:25,moduleKey:"AUD.A1"},
  // Risk & planning / A2
  {n:"Risk Assessment",el:"RISK",v:35,moduleKey:"AUD.A2"},
  {n:"Materiality",el:"RISK",v:35,moduleKey:"AUD.A2"},
  {n:"Audit Strategy",el:"RISK",v:30,moduleKey:"AUD.A2"},
  {n:"Understanding the Entity",el:"RISK",v:30,moduleKey:"AUD.A2"},
  {n:"Fraud Brainstorming",el:"RISK",v:35,tags:["fraud"],moduleKey:"AUD.A2"},
  // Evidence & procedures / A3
  {n:"External Confirmation",el:"EVID",v:40,tags:["confirm"],moduleKey:"AUD.A3"},
  {n:"Audit Sampling",el:"EVID",v:35,tags:["sample"],moduleKey:"AUD.A3"},
  {n:"Substantive Testing",el:"EVID",v:35,moduleKey:"AUD.A3"},
  {n:"Tests of Controls",el:"CTRL",v:35,tags:["control"],moduleKey:"AUD.A3"},
  {n:"Management Representation",el:"EVID",v:30,moduleKey:"AUD.A3"},
  {n:"Analytical Procedures",el:"EVID",v:30,moduleKey:"AUD.A3"},
  // Reporting / A4
  {n:"Unmodified Opinion",el:"RPT",v:40,moduleKey:"AUD.A4"},
  {n:"Emphasis-of-Matter",el:"RPT",v:30,moduleKey:"AUD.A4"},
  {n:"Qualified Opinion",el:"RPT",v:35,moduleKey:"AUD.A4"},
  {n:"Going Concern Section",el:"RPT",v:30,tags:["subseq"],moduleKey:"AUD.A4"}
];

var WEAKNESS_CARD={n:"Unaddressed Risk",el:"RISK",v:0,tags:["weakness"],moduleKey:null,weakness:true};

// CONSUMABLES — audit "procedures" as one-shot deck modifiers
var CONSUMABLES=[
  {id:"document",n:"Document",d:"A selected card gains a confirmation tag (stronger evidence).",type:"target",ok:()=>true,act:c=>{if(!c.tags.includes("confirm"))c.tags.push("confirm");}},
  {id:"testcontrol",n:"Test a Control",d:"Turn a selected card into a Controls card.",type:"target",ok:()=>true,act:c=>{c.el="CTRL";if(!c.tags.includes("control"))c.tags.push("control");}},
  {id:"reassess",n:"Reassess Assertion",d:"Change a selected card's suit to the next phase.",type:"target",ok:()=>true,act:c=>{const o=["ETH","RISK","EVID","CTRL","RPT"];c.el=o[(o.indexOf(c.el)+1)%o.length];}},
  {id:"expand",n:"Expand Sample",d:"Add a Substantive Testing card to your deck.",type:"instant",act:(helpers)=>{helpers.G.masterDeck.push(helpers.mk({n:"Substantive Testing",el:"EVID",v:35}));}},
  {id:"confirm",n:"Send Confirmation",d:"Add an External Confirmation card to your deck.",type:"instant",act:(helpers)=>{helpers.G.masterDeck.push(helpers.mk({n:"External Confirmation",el:"EVID",v:40,tags:["confirm"]}));}}
];

var TARGETS={1:[300,600,1000],2:[1200,1800,2800],3:[3500,5000,7500],4:[9000,13000,20000]};
var MAXANTE=4;
var BLINDLBL=["INTERIM","FIELDWORK","OPINION"];

window.ACED_PACK={
  id:"cpa-aud",
  name:"CPA · AUD",
  description:"Auditing & Attestation · CPA Core section. TEMPLATE pack proving ACED is section-swappable.",
  section:"AUD",
  template:true,
  questionBanks:["packs/originals/cpa-aud-starter-01.js","packs/originals/aud-batch-02.js","packs/originals/aud-batch-03.js","packs/originals/aud-batch-04.js","packs/originals/aud-batch-05.js","packs/originals/aud-batch-06.js","packs/originals/aud-batch-07.js","packs/originals/aud-batch-08.js","packs/originals/aud-batch-09.js"],
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
