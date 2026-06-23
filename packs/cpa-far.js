/* ===== ACED EXAM PACK · CPA · FAR =====
   Financial Accounting & Reporting. Extracted from the original FAR-hardcoded
   study.html engine into a swappable pack file. Exposes window.ACED_PACK.
   The engine (study.html) loads this, then loads pack.questionBank, then
   calls window._packReady(). All scoring/teaching content lives here. */
(function () {
"use strict";

// ---- helper used by handTypes conditions (counts of each element) ----
function elCounts(cs){const e={};cs.forEach(c=>e[c.el]=(e[c.el]||0)+1);return e;}
function maxElCount(cs){const e=elCounts(cs);return Math.max(0,...Object.values(e));}
function hasRev(cs){return cs.some(c=>c.el==="REV");}
function hasExp(cs){return cs.some(c=>c.el==="EXP");}

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
  "F4.M4":"Income Taxes","F4.M5":"Governmental Accounting"
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

// ---- DOCTRINES: concept-based scoring multipliers ----
var ALLJK=[
  {id:"match",n:"Matching Principle",d:"Matched Entry (REV+EXP together): +5 Mult.",apply:c=>{if(c.hasRev&&c.hasExp)c.addMult(5,"Matching");}},
  {id:"revrec",n:"Revenue Recognition",d:"+16 chips per REV card.",apply:c=>{if(c.el.REV)c.addChips(16*c.el.REV,"Rev Rec");}},
  {id:"deferred",n:"Deferred Revenue",d:"2+ deferral cards together: +9 Mult.",apply:c=>{if(c.t("def")>=2)c.addMult(9,"Recognition");}},
  {id:"accrual",n:"Full Accrual",d:"No Cash card played: +4 Mult.",apply:c=>{if(!c.t("cash"))c.addMult(4,"Accrual");}},
  {id:"estimate",n:"Prospective Estimate",d:"+2 Mult, +1 more each hand this close.",apply:c=>{c.addMult(2+c.handsThisBlind,"Estimate");}},
  {id:"fv",n:"Fair Value",d:"Each fair-value (AFS) card: ±chips, remeasured each play.",apply:c=>{const n=c.t("fv");if(n){let d=0;for(let i=0;i<n;i++)d+=Math.floor(Math.random()*61)-20;c.addChips(d,"Mark-to-Market");}}},
  {id:"compinc",n:"Comprehensive Income",d:"+4 Mult per OCI card.",apply:c=>{if(c.t("oci"))c.addMult(4*c.t("oci"),"OCI");}},
  {id:"currency",n:"Currency Exposure",d:"+5 Mult per foreign-currency card.",apply:c=>{if(c.t("fx"))c.addMult(5*c.t("fx"),"FX");}},
  {id:"treasury",n:"Treasury Stock",d:"+6 Mult per Treasury Stock card.",apply:c=>{if(c.t("treasury"))c.addMult(6*c.t("treasury"),"Treasury");}},
  {id:"retained",n:"Retained Earnings",d:"+2 Mult per EQUITY card.",apply:c=>{if(c.el.EQUITY)c.addMult(2*c.el.EQUITY,"Retained Earnings");}},
  {id:"cons",n:"Conservatism",d:"Loss cards score x2 chips.",apply:c=>{const ex=c.played.filter(x=>x.tags.includes("loss")).reduce((s,x)=>s+x.v,0);if(ex)c.addChips(ex,"Conservatism");}},
  {id:"impair",n:"Impairment Hawk",d:"Play an Impairment Loss: +40 chips and +2 Mult.",apply:c=>{if(c.t("impair")){c.addChips(40,"Impairment");c.addMult(2,"Impairment");}}},
  {id:"bigbath",n:"Big Bath",d:"2+ loss cards together: +50 chips and +3 Mult.",apply:c=>{if(c.played.filter(x=>x.tags.includes("loss")).length>=2){c.addChips(50,"Big Bath");c.addMult(3,"Big Bath");}}},
  {id:"lifo",n:"LIFO Layers",d:"2+ Inventory cards: +30 chips per inventory card.",apply:c=>{if(c.t("inv")>=2)c.addChips(30*c.t("inv"),"LIFO");}},
  {id:"goingc",n:"Going Concern",d:"+14 chips per Asset card.",apply:c=>{if(c.el.ASSET)c.addChips(14*c.el.ASSET,"Going Concern");}},
  {id:"amort",n:"Finite Life",d:"Intangible cards: +Mult that decays (+4 to +1).",apply:c=>{if(c.t("intang"))c.addMult(Math.max(1,4-c.handsThisBlind),"Amortization");}},
  {id:"goodwill",n:"Goodwill",d:"+3 Mult per intangible card (indefinite life).",apply:c=>{if(c.t("intang"))c.addMult(3*c.t("intang"),"Goodwill");}},
  {id:"bond",n:"Bond Amortization",d:"+25 chips per Bonds Payable card.",apply:c=>{if(c.t("bond"))c.addChips(25*c.t("bond"),"Bonds");}},
  {id:"lease",n:"Right-of-Use",d:"Any lease card: +3 Mult, +2 per extra lease card.",apply:c=>{const n=c.t("lease");if(n)c.addMult(3+2*(n-1),"Leases");}},
  {id:"contingency",n:"Loss Contingency",d:"3+ Liability cards: +7 Mult (probable & estimable).",apply:c=>{if(c.el.LIAB>=3)c.addMult(7,"Contingency");}},
  {id:"poc",n:"% of Completion",d:"A Matched Entry that also includes an Asset: +8 Mult.",apply:c=>{if(c.hasRev&&c.hasExp&&c.el.ASSET)c.addMult(8,"% Completion");}},
  {id:"equitymethod",n:"Equity Method",d:"2+ EQUITY cards: +5 Mult.",apply:c=>{if(c.el.EQUITY>=2)c.addMult(5,"Equity Method");}},
  {id:"tax",n:"Deferred Taxes",d:"+18 chips per deferral card.",apply:c=>{if(c.t("def"))c.addChips(18*c.t("def"),"Deferred Tax");}},
  {id:"leverage",n:"Leverage",d:"+3 Mult per Liability card.",apply:c=>{if(c.el.LIAB)c.addMult(3*c.el.LIAB,"Leverage");}},
  {id:"compound",n:"Compounding Interest",d:"+1 Mult, +1 more per hand this close.",apply:c=>{c.addMult(1+c.handsThisBlind,"Compounding");}},
  {id:"material",n:"Materiality",d:"+55 chips if any card is played.",apply:c=>{if(c.played.length)c.addChips(55,"Materiality");}},
  {id:"doubleentry",n:"Double Entry",d:"Pair or better (mult ≥2): +2 Mult.",apply:c=>{if(c.hand.mult>=2)c.addMult(2,"Double Entry");}},
  // ===== v6 mnemonic doctrines =====
  {id:"pufi",n:"PUFI",d:"2+ OCI cards: +30 chips. (Pension, Unrealized AFS, FX translation, Instrument credit risk — these hit OCI, not Net Income.)",apply:c=>{if(c.t("oci")>=2){c.addChips(30,"PUFI");c._callout="PUFI: these go to OCI, not Net Income.";}}},
  {id:"fob",n:"FOB Shipping Point",d:"Inventory + Cash card together: +5 Mult. (Title transfers at shipping; revenue recognized.)",apply:c=>{if(c.t("inv")&&c.t("cash")){c.addMult(5,"FOB Shipping Pt");c._callout="FOB: title transfers at shipping — revenue recognized.";}}},
  {id:"dealor",n:"DEALOR",d:"Hand with 4+ different elements: +4 Mult. (Discontinued ops, Extraordinary, Accounting changes, Loss from ops, Other gains, Regular tax — income statement structure.)",apply:c=>{const els=["REV","EXP","ASSET","LIAB","EQUITY"].filter(e=>c.el[e]).length;if(els>=4){c.addMult(4,"DEALOR");c._callout="DEALOR — income statement structure.";}}},
  // ===== ×Mult payoffs, run-scalers & retrigger — these multiply the whole +Mult build =====
  {id:"recap",n:"Leveraged Recap",d:"3+ Liability cards: ×1.5 Mult (after all additions).",apply:c=>{if(c.el.LIAB>=3)c.xMult(1.5,"Recap ×1.5");}},
  {id:"consol",n:"Consolidation Premium",d:"Ledger Flush or better (4+ same element): ×2 Mult.",apply:c=>{if(c.hand.mult>=6)c.xMult(2,"Consolidation ×2");}},
  {id:"gwprem",n:"Goodwill Premium",d:"×Mult equal to 1 + 0.5 per intangible card.",apply:c=>{const n=c.t("intang");if(n)c.xMult(1+0.5*n,"Goodwill Premium");}},
  {id:"eqmult",n:"Equity Multiplier",d:"3+ Equity cards: ×2 Mult.",apply:c=>{if(c.el.EQUITY>=3)c.xMult(2,"Equity ×2");}},
  {id:"compret",n:"Compounding Returns",d:"×Mult that grows +0.2 every hand you play this run (starts ×1.2).",apply:(c,j)=>{const s=c.st(j.id);s.x=(s.x||1)+0.2;c.xMult(s.x,"Compounding ×"+s.x.toFixed(1));}},
  {id:"sampling",n:"Audit Sampling",d:"Re-score your highest-value card — its chips count twice.",apply:c=>{if(c.played.length){const m=Math.max(0,...c.played.map(x=>x.weakness?0:x.v));if(m)c.addChips(m,"Resampled");}}}
];

// Starter unlocks; others unlock when their condition fires naturally OR via an Audit Moment.
var STARTER_UNLOCKS=["match","compound","revrec"];
var CODEX_HINT={
  match:"Starter doctrine.",compound:"Starter doctrine.",revrec:"Starter doctrine.",
  deferred:"Play 2+ deferral cards in one hand.",accrual:"Play a hand with NO Cash card.",
  estimate:"Play 3 hands in a single close.",fv:"Play an AFS / fair-value card.",
  compinc:"Play any OCI-tagged card.",currency:"Play a foreign-currency card.",
  treasury:"Play a Treasury Stock card.",retained:"Play 2+ EQUITY cards.",
  cons:"Play a loss / write-down card.",impair:"Play an Impairment Loss card.",
  bigbath:"Play 2+ loss cards together.",lifo:"Play 2+ Inventory cards together.",
  goingc:"Play 3+ Asset cards in one hand.",amort:"Play an intangible card.",
  goodwill:"Play a Goodwill / intangible card.",bond:"Play a Bonds Payable card.",
  lease:"Play any lease card.",contingency:"Play 3+ Liability cards.",
  poc:"Play a Matched Entry that also has an Asset.",equitymethod:"Play 2+ EQUITY cards.",
  tax:"Play a deferral / deferred-tax card.",leverage:"Play 3+ Liability cards.",
  material:"Play any hand at all.",doubleentry:"Form a pair or better.",
  pufi:"Clear an Audit Moment, or play 2+ OCI cards.",
  fob:"Play Inventory + Cash together.",
  dealor:"Play a hand spanning 4+ element types.",
  recap:"Play 3+ Liability cards in one hand.",
  consol:"Form a Ledger Flush (4 cards of the same element).",
  gwprem:"Play 2+ intangible cards in one hand.",
  eqmult:"Play 3+ Equity cards in one hand.",
  compret:"Play 4+ hands in a single close.",
  sampling:"Play a hand of 3 or more cards."
};

// Conditions checked after each hand to auto-unlock doctrines from the played cards.
// Each is a function (ctx, G) -> bool. G is the engine game state (for handsThisBlind).
var UNLOCK_CONDITIONS={
  deferred:(ctx)=>ctx.t("def")>=2,accrual:(ctx)=>!ctx.t("cash")&&ctx.played.length>0,
  fv:(ctx)=>ctx.t("fv")>0,compinc:(ctx)=>ctx.t("oci")>0,currency:(ctx)=>ctx.t("fx")>0,
  treasury:(ctx)=>ctx.t("treasury")>0,retained:(ctx)=>ctx.el.EQUITY>=2,
  cons:(ctx)=>ctx.played.some(x=>x.tags.includes("loss")),impair:(ctx)=>ctx.t("impair")>0,
  bigbath:(ctx)=>ctx.played.filter(x=>x.tags.includes("loss")).length>=2,
  lifo:(ctx)=>ctx.t("inv")>=2,goingc:(ctx)=>ctx.el.ASSET>=3,amort:(ctx)=>ctx.t("intang")>0,
  goodwill:(ctx)=>ctx.played.some(x=>x.n==="Goodwill"),bond:(ctx)=>ctx.t("bond")>0,
  lease:(ctx)=>ctx.t("lease")>0,contingency:(ctx)=>ctx.el.LIAB>=3,
  poc:(ctx)=>ctx.hasRev&&ctx.hasExp&&ctx.el.ASSET>0,equitymethod:(ctx)=>ctx.el.EQUITY>=2,
  tax:(ctx)=>ctx.t("def")>0,leverage:(ctx)=>ctx.el.LIAB>=3,material:(ctx)=>ctx.played.length>0,
  doubleentry:(ctx)=>ctx.hand.mult>=2,estimate:(ctx,G)=>G.handsThisBlind>=2,
  pufi:(ctx)=>ctx.t("oci")>=2,fob:(ctx)=>ctx.t("inv")&&ctx.t("cash"),
  dealor:(ctx)=>["REV","EXP","ASSET","LIAB","EQUITY"].filter(e=>ctx.el[e]).length>=4,
  recap:(ctx)=>ctx.el.LIAB>=3,
  consol:(ctx)=>ctx.hand.mult>=6,
  gwprem:(ctx)=>ctx.t("intang")>=2,
  eqmult:(ctx)=>ctx.el.EQUITY>=3,
  compret:(ctx,G)=>G.handsThisBlind>=3,
  sampling:(ctx)=>ctx.played.length>=3
};

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

// ---- BOSSES: modifier challenges that appear at boss blinds ----
var BOSSES=[
  {id:"audit",n:"THE AUDIT",d:"Hand size reduced to 7."},
  {id:"restate",n:"RESTATEMENT",d:"Your first scored hand this close scores half."},
  {id:"doubt",n:"GOING CONCERN DOUBT",d:"One fewer discard."},
  {id:"conservative",n:"CONSERVATIVE AUDITOR",d:"Revenue cards score −10 chips each."}
];

// ---- TARGETS per ante/blind ----
var TARGETS={1:[300,600,1000],2:[1200,1800,2800],3:[3500,5000,7500],4:[9000,13000,20000]};
var MAXANTE=4;
var BLINDLBL=["Q1 CLOSE","MID-YEAR CLOSE","YEAR-END CLOSE"];

// ---- HAND TYPES: each {name, condition(cards)->bool, mult} ----
var HAND_TYPES=[
  {name:"Single Posting",      condition:(cs)=>true,                          mult:1},
  {name:"Matching Pair",       condition:(cs)=>maxElCount(cs)>=2,             mult:2},
  {name:"Matched Entry",       condition:(cs)=>hasRev(cs)&&hasExp(cs),        mult:3},
  {name:"Three-Account Entry", condition:(cs)=>maxElCount(cs)>=3,             mult:4},
  {name:"Ledger Flush",        condition:(cs)=>maxElCount(cs)>=4,             mult:6},
  {name:"Full Consolidation",  condition:(cs)=>maxElCount(cs)>=5,             mult:9}
];

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
    "packs/originals/far-original-batch-04.js"
  ],
  // content
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
  // starter loadout: doctrines equipped + opening money
  starter:{doctrines:["match","compound"],money:4}
};
})();
