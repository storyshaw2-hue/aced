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

// helpers (element-count utilities used by hand types / doctrines)
function elCounts(cs){const e={};cs.forEach(c=>e[c.el]=(e[c.el]||0)+1);return e;}
function maxElCount(cs){const e=elCounts(cs);return Math.max(0,...Object.values(e));}
function distinctEls(cs){return Object.keys(elCounts(cs)).length;}

// TAG INFO — concept tags that certain doctrines key off
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

// helper bound through ctx (distinct suits among played)
function distinctElsCtx(c){return ["PROC","LAW","PROP","INDIV","ENT"].filter(e=>c.el[e]).length;}

// DOCTRINES — tax/law principles that warp scoring (starter set; reskin of FAR doctrines)
var ALLJK=[
  {id:"substance",n:"Substance Over Form",d:"+2 Mult, +1 more each hand this filing.",apply:c=>{c.addMult(2+c.handsThisBlind,"Substance Over Form");}},
  {id:"basisfirst",n:"Basis First",d:"+14 chips per Property card.",apply:c=>{if(c.el.PROP)c.addChips(14*c.el.PROP,"Basis First");}},
  {id:"abovetheline",n:"Above-the-Line",d:"2+ Individuals cards: +6 Mult.",apply:c=>{if(c.el.INDIV>=2)c.addMult(6,"Above-the-Line");}},
  {id:"duediligence",n:"Preparer Due Diligence",d:"+4 Mult per Procedures/Ethics card.",apply:c=>{if(c.el.PROC)c.addMult(4*c.el.PROC,"Due Diligence");}},
  {id:"flowthrough",n:"Flow-Through",d:"Any Entities card: +20 chips and +2 Mult.",apply:c=>{if(c.el.ENT){c.addChips(20,"Flow-Through");c.addMult(2,"Flow-Through");}}},
  {id:"creditshelter",n:"Credit Beats Deduction",d:"+30 chips per tax-credit card (credits offset tax dollar-for-dollar).",apply:c=>{if(c.t("credit"))c.addChips(30*c.t("credit"),"Credit");}},
  {id:"safeharbor",n:"Safe Harbor",d:"+50 chips if any card is played.",apply:c=>{if(c.played.length)c.addChips(50,"Safe Harbor");}},
  {id:"cleanreturn",n:"Clean Return",d:"An Individuals card with 4+ different suits: ×1.5 Mult.",apply:c=>{if(c.el.INDIV&&distinctElsCtx(c)>=4)c.xMult(1.5,"Clean Return ×1.5");}},
  {id:"1031lens",n:"Like-Kind Deferral",d:"Any like-kind (election) card: ×2 chips on your highest card.",apply:c=>{if(c.t("election")&&c.played.length){const m=Math.max(0,...c.played.map(x=>x.weakness?0:x.v));if(m)c.addChips(m,"Deferral");}}}
];

var STARTER_UNLOCKS=["substance","basisfirst","abovetheline"];
var CODEX_HINT={
  substance:"Starter doctrine.",basisfirst:"Starter doctrine.",abovetheline:"Starter doctrine.",
  duediligence:"Play any Procedures/Ethics card.",
  flowthrough:"Play a C/S Corp or Partnership card.",
  creditshelter:"Play a Tax Credits card.",
  safeharbor:"Play any hand at all.",
  cleanreturn:"Play an Individuals card in a hand spanning 4+ suits.",
  "1031lens":"Play a Like-Kind Exchange card."
};
var UNLOCK_CONDITIONS={
  duediligence:(ctx)=>ctx.el.PROC>0,
  flowthrough:(ctx)=>ctx.el.ENT>0,
  creditshelter:(ctx)=>ctx.t("credit")>0,
  safeharbor:(ctx)=>ctx.played.length>0,
  cleanreturn:(ctx)=>ctx.el.INDIV>0 && ["PROC","LAW","PROP","INDIV","ENT"].filter(e=>ctx.el[e]).length>=4,
  "1031lens":(ctx)=>ctx.t("election")>0,
  abovetheline:(ctx)=>ctx.el.INDIV>=2,
  basisfirst:(ctx)=>ctx.el.PROP>0,
  substance:(ctx,G)=>G.handsThisBlind>=2
};

// CONSUMABLES — tax elections/forms as one-shot deck modifiers
var CONSUMABLES=[
  {id:"election",n:"File an Election",d:"A selected card gains a like-kind (election) tag.",type:"target",ok:()=>true,act:c=>{if(!c.tags.includes("election"))c.tags.push("election");}},
  {id:"recharacterize",n:"Recharacterize",d:"Change a selected card's suit to the next area.",type:"target",ok:()=>true,act:c=>{const o=["PROC","LAW","PROP","INDIV","ENT"];c.el=o[(o.indexOf(c.el)+1)%o.length];}},
  {id:"claimcredit",n:"Claim a Credit",d:"Turn a selected card into a Tax Credits card.",type:"target",ok:()=>true,act:c=>{c.el="INDIV";if(!c.tags.includes("credit"))c.tags.push("credit");}},
  {id:"depreciate",n:"Take Depreciation",d:"Add a Depreciation & §179 card to your deck.",type:"instant",act:(helpers)=>{helpers.G.masterDeck.push(helpers.mk({n:"Depreciation & §179",el:"PROP",v:30}));}},
  {id:"basisstep",n:"Step-Up Basis",d:"Add an Adjusted Basis card to your deck.",type:"instant",act:(helpers)=>{helpers.G.masterDeck.push(helpers.mk({n:"Adjusted Basis",el:"PROP",v:40,tags:["basis"]}));}}
];

// BOSSES — tax controversy complications
var BOSSES=[
  {id:"irsaudit",n:"IRS AUDIT",d:"Hand size reduced to 7."},
  {id:"substantiation",n:"SUBSTANTIATION",d:"Your first scored hand this filing scores half (missing receipts)."},
  {id:"penaltynotice",n:"PENALTY NOTICE",d:"One fewer discard."},
  {id:"phaseout",n:"PHASEOUT",d:"Individuals cards score −10 chips each."}
];

var TARGETS={1:[300,600,1000],2:[1200,1800,2800],3:[3500,5000,7500],4:[9000,13000,20000]};
var MAXANTE=4;
var BLINDLBL=["PREPARATION","EXAMINATION","APPEAL"];

// HAND TYPES — element-agnostic (work for any suit set)
var HAND_TYPES=[
  {name:"Single Position",     condition:(cs)=>true,               mult:1},
  {name:"Supported Pair",      condition:(cs)=>maxElCount(cs)>=2,  mult:2},
  {name:"Cross-Area Return",   condition:(cs)=>distinctEls(cs)>=3, mult:3},
  {name:"Full Schedule",       condition:(cs)=>maxElCount(cs)>=3,  mult:4},
  {name:"Complete Return",     condition:(cs)=>maxElCount(cs)>=4,  mult:6},
  {name:"Filed & Substantiated",condition:(cs)=>maxElCount(cs)>=5, mult:9}
];

window.ACED_PACK={
  id:"cpa-reg",
  name:"CPA · REG",
  description:"Regulation · CPA Core section. Federal taxation, business law, ethics & professional responsibilities.",
  section:"REG",
  template:true,
  questionBanks:["packs/originals/reg-batch-01.js","packs/originals/reg-batch-02.js","packs/originals/reg-batch-03.js","packs/originals/reg-batch-04.js","packs/originals/reg-batch-05.js","packs/originals/reg-batch-06.js","packs/originals/reg-batch-07.js"],
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
  starter:{doctrines:["substance","basisfirst"],money:4}
};
})();
