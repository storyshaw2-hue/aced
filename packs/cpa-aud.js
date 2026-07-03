/* ===== ACED EXAM PACK · CPA · AUD  (TEMPLATE / multi-section proof) =====
   Auditing & Attestation. This is a STRUCTURAL TEMPLATE that demonstrates the
   engine is section-agnostic: same study.html, different window.ACED_PACK.
   Open it with  study.html?pack=cpa-aud  (or daily.html?pack=cpa-aud).

   It is intentionally lighter than cpa-far.js: the suits, cards, and doctrines
   are an AUD reskin sufficient to play and to drive Audit Moments from the AUD
   starter bank. A production AUD pack would deepen the card pool, the doctrine
   set, and the question bank to FAR's level — the wiring shown here does not change.
   Exposes window.ACED_PACK. */
(function () {
"use strict";

// helpers (element-count utilities used by hand types / doctrines)
function elCounts(cs){const e={};cs.forEach(c=>e[c.el]=(e[c.el]||0)+1);return e;}
function maxElCount(cs){const e=elCounts(cs);return Math.max(0,...Object.values(e));}
function distinctEls(cs){return Object.keys(elCounts(cs)).length;}

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

// DOCTRINES — audit principles that warp scoring (starter set; reskin of FAR doctrines)
var ALLJK=[
  {id:"skepticism",n:"Professional Skepticism",d:"+2 Mult, +1 more each hand this engagement.",apply:c=>{c.addMult(2+c.handsThisBlind,"Skepticism");}},
  {id:"riskbased",n:"Risk-Based Approach",d:"+14 chips per Risk card.",apply:c=>{if(c.el.RISK)c.addChips(14*c.el.RISK,"Risk-Based");}},
  {id:"evidence",n:"Sufficient Appropriate Evidence",d:"2+ Evidence cards: +6 Mult.",apply:c=>{if(c.el.EVID>=2)c.addMult(6,"Evidence");}},
  {id:"independence",n:"Independence in Fact",d:"+4 Mult per Ethics card.",apply:c=>{if(c.el.ETH)c.addMult(4*c.el.ETH,"Independence");}},
  {id:"controls",n:"Control Reliance",d:"Any Controls card: +20 chips and +2 Mult.",apply:c=>{if(c.el.CTRL){c.addChips(20,"Controls");c.addMult(2,"Controls");}}},
  {id:"confirm",n:"Third-Party Confirmation",d:"+30 chips per confirmation card (most reliable evidence).",apply:c=>{if(c.t("confirm"))c.addChips(30*c.t("confirm"),"Confirmation");}},
  {id:"materiality",n:"Materiality",d:"+50 chips if any card is played.",apply:c=>{if(c.played.length)c.addChips(50,"Materiality");}},
  {id:"cleanop",n:"Clean Opinion",d:"A Reporting card with 4+ different suits: ×1.5 Mult.",apply:c=>{if(c.el.RPT&&distinctElsCtx(c)>=4)c.xMult(1.5,"Clean Opinion ×1.5");}},
  {id:"fraudlens",n:"Fraud Lens",d:"Any fraud-risk card: ×2 chips on your highest card.",apply:c=>{if(c.t("fraud")&&c.played.length){const m=Math.max(0,...c.played.map(x=>x.weakness?0:x.v));if(m)c.addChips(m,"Fraud Re-exam");}}}
];
// doctrine helper bound through ctx (distinct suits among played)
function distinctElsCtx(c){return ["ETH","RISK","EVID","CTRL","RPT"].filter(e=>c.el[e]).length;}

var STARTER_UNLOCKS=["skepticism","riskbased","evidence"];
var CODEX_HINT={
  skepticism:"Starter doctrine.",riskbased:"Starter doctrine.",evidence:"Starter doctrine.",
  independence:"Play any Ethics card.",
  controls:"Play a Tests of Controls card.",
  confirm:"Play an External Confirmation card.",
  materiality:"Play any hand at all.",
  cleanop:"Play a Reporting card in a hand spanning 4+ suits.",
  fraudlens:"Play a fraud-risk card."
};
var UNLOCK_CONDITIONS={
  independence:(ctx)=>ctx.el.ETH>0,
  controls:(ctx)=>ctx.el.CTRL>0,
  confirm:(ctx)=>ctx.t("confirm")>0,
  materiality:(ctx)=>ctx.played.length>0,
  cleanop:(ctx)=>ctx.el.RPT>0 && ["ETH","RISK","EVID","CTRL","RPT"].filter(e=>ctx.el[e]).length>=4,
  fraudlens:(ctx)=>ctx.t("fraud")>0,
  evidence:(ctx)=>ctx.el.EVID>=2,
  riskbased:(ctx)=>ctx.el.RISK>0,
  skepticism:(ctx,G)=>G.handsThisBlind>=2
};

// CONSUMABLES — audit "procedures" as one-shot deck modifiers
var CONSUMABLES=[
  {id:"document",n:"Document",d:"A selected card gains a confirmation tag (stronger evidence).",type:"target",ok:()=>true,act:c=>{if(!c.tags.includes("confirm"))c.tags.push("confirm");}},
  {id:"testcontrol",n:"Test a Control",d:"Turn a selected card into a Controls card.",type:"target",ok:()=>true,act:c=>{c.el="CTRL";if(!c.tags.includes("control"))c.tags.push("control");}},
  {id:"reassess",n:"Reassess Assertion",d:"Change a selected card's suit to the next phase.",type:"target",ok:()=>true,act:c=>{const o=["ETH","RISK","EVID","CTRL","RPT"];c.el=o[(o.indexOf(c.el)+1)%o.length];}},
  {id:"expand",n:"Expand Sample",d:"Add a Substantive Testing card to your deck.",type:"instant",act:(helpers)=>{helpers.G.masterDeck.push(helpers.mk({n:"Substantive Testing",el:"EVID",v:35}));}},
  {id:"confirm",n:"Send Confirmation",d:"Add an External Confirmation card to your deck.",type:"instant",act:(helpers)=>{helpers.G.masterDeck.push(helpers.mk({n:"External Confirmation",el:"EVID",v:40,tags:["confirm"]}));}}
];

// BOSSES — engagement complications
var BOSSES=[
  {id:"pcaob",n:"PCAOB INSPECTION",d:"Hand size reduced to 7."},
  {id:"bias",n:"MANAGEMENT BIAS",d:"Your first scored hand this engagement scores half."},
  {id:"scope",n:"SCOPE LIMITATION",d:"One fewer discard."},
  {id:"fraudrisk",n:"ELEVATED FRAUD RISK",d:"Evidence cards score −10 chips each."}
];

var TARGETS={1:[300,600,1000],2:[1200,1800,2800],3:[3500,5000,7500],4:[9000,13000,20000]};
var MAXANTE=4;
var BLINDLBL=["INTERIM","FIELDWORK","OPINION"];

// HAND TYPES — element-agnostic (work for any suit set)
var HAND_TYPES=[
  {name:"Single Procedure",   condition:(cs)=>true,                 mult:1},
  {name:"Corroborating Pair", condition:(cs)=>maxElCount(cs)>=2,    mult:2},
  {name:"Linked Evidence",    condition:(cs)=>distinctEls(cs)>=3,   mult:3},
  {name:"Walkthrough",        condition:(cs)=>maxElCount(cs)>=3,    mult:4},
  {name:"Full Workpaper",     condition:(cs)=>maxElCount(cs)>=4,    mult:6},
  {name:"Complete Audit File",condition:(cs)=>maxElCount(cs)>=5,    mult:9}
];

window.ACED_PACK={
  id:"cpa-aud",
  name:"CPA · AUD",
  description:"Auditing & Attestation · CPA Core section. TEMPLATE pack proving ACED is section-swappable.",
  section:"AUD",
  template:true,
  questionBanks:["packs/originals/cpa-aud-starter-01.js","packs/originals/aud-batch-02.js","packs/originals/aud-batch-03.js","packs/originals/aud-batch-04.js","packs/originals/aud-batch-05.js","packs/originals/aud-batch-06.js","packs/originals/aud-batch-07.js","packs/originals/aud-batch-08.js","packs/originals/aud-batch-09.js"],
  cards:POOL,
  doctrines:ALLJK,
  consumables:CONSUMABLES,
  bosses:BOSSES,
  targets:TARGETS,
  maxAnte:MAXANTE,
  blindLabels:BLINDLBL,
  tagInfo:TAGINFO,
  starterUnlocks:STARTER_UNLOCKS,
  codexHints:CODEX_HINT,
  modules:MODULES,
  elements:ELEMENTS,
  handTypes:HAND_TYPES,
  unlockConditions:UNLOCK_CONDITIONS,
  weaknessCard:WEAKNESS_CARD,
  starter:{doctrines:["skepticism","riskbased"],money:4}
};
})();
