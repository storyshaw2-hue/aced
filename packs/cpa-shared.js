/* packs/cpa-shared.js — content and flavor shared by the four CPA exam packs (FAR, AUD, REG, BAR).
   The game engine (study.html) knows nothing about accounting: everything below is pack-owned
   content that the engine picks up through documented hooks.
     ACED_PACK.vocab          wording for rounds / antes / consumables
     ACED_PACK.win / .lose    end-of-run copy
     ACED_PACK.tbsBanks       simulation banks, ACED_PACK.tbsSource filters them to this section
     ACED_TBS_BOSS            boss worksheets for the boss round (cards must fit the worksheet rows)
     ACED_BOSS_JOKER_THEMES   jokers that boost boss rewards
     ACED_SHOP_DRILL          an optional one-question drill offered in the shop */
(function () {
  "use strict";
  var W = typeof window !== "undefined" ? window : globalThis;

  /* ---- boss worksheets ---- */
  W.ACED_TBS_BOSS=[
  { id:"pension", source:"F3.M5", title:"PENSION", mode:"sum",
    tally:{label:"Net periodic pension cost", target:100000},
    exhibits:[
      {name:"Actuary Memo", body:"Service cost earned this year is <b>$80,000</b>. The discount rate is <b>5%</b>, applied to a beginning PBO of <b>$800,000</b>. Expected return on plan assets is <b>$30,000</b>. Amortization of prior service cost from AOCI is <b>$10,000</b>."},
      {name:"Controller Email", body:"Book net periodic pension cost and reflect the OCI amortization. We funded $90,000 of cash this year."},
      {name:"GL Trial Balance", body:"Pension benefit liability, beginning: $40,000 (credit). Plan assets at fair value: $600,000. No settlements or curtailments occurred."}
    ],
    rows:[
      {label:"Service cost", sign:1, expected:80000, matchingElements:["EXP"], amountOptions:[80000,40000,800000], fit:"current-year cost of benefits earned \u2014 an expense", amt:"stated directly in the actuary memo"},
      {label:"Interest cost", sign:1, expected:40000, matchingElements:["EXP"], amountOptions:[40000,30000,80000], fit:"growth in the PBO \u2014 an expense", amt:"beginning PBO \u00d7 discount rate (800,000 \u00d7 5%)"},
      {label:"Expected return on plan assets", sign:-1, expected:30000, matchingElements:["ASSET"], amountOptions:[30000,40000,90000], fit:"a return on plan assets \u2014 reduces the cost", amt:"the expected return, not the $90,000 funded"},
      {label:"Amortization of prior service cost (OCI)", sign:1, expected:10000, matchingTags:["oci"], amountOptions:[10000,5000,30000], fit:"reclassified out of AOCI \u2014 needs an OCI account", amt:"prior service cost amortization in the memo"}
    ] },
  { id:"bond", source:"F3.M4", title:"BOND INTEREST", mode:"entry",
    tally:{label:"Interest expense"},
    exhibits:[
      {name:"Bond Indenture", body:"$500,000 face amount, <b>7%</b> stated coupon, interest paid annually."},
      {name:"Market Memo", body:"Issued at 96 (proceeds <b>$480,000</b>) to yield <b>8%</b> \u2014 a discount bond. Effective-interest method."},
      {name:"GL Trial Balance", body:"Bonds payable carrying amount at the start of Year 1: $480,000."}
    ],
    rows:[
      {label:"Interest expense", side:"DR", expected:38400, matchingElements:["EXP"], amountOptions:[38400,40000,35000], fit:"the period's expense", amt:"carrying amount \u00d7 market rate (480,000 \u00d7 8%)"},
      {label:"Discount on bonds payable (amortized)", side:"CR", expected:3400, matchingElements:["LIAB"], matchingTags:["bond"], amountOptions:[3400,4400,1600], fit:"the bond liability account", amt:"interest expense \u2212 cash coupon (38,400 \u2212 35,000)"},
      {label:"Cash (coupon paid)", side:"CR", expected:35000, matchingTags:["cash"], amountOptions:[35000,38400,40000], fit:"cash paid out", amt:"face \u00d7 stated rate (500,000 \u00d7 7%)"}
    ] },
  { id:"lease", source:"F3.M5", title:"LEASE", mode:"entry",
    tally:{label:"Right-of-use asset"},
    exhibits:[
      {name:"Lease Agreement", body:"Five-year lease, <b>$50,000</b> paid at each year-end. Rate implicit in the lease is determinable at <b>6%</b>. Initial direct costs of <b>$5,000</b> paid in cash at commencement."},
      {name:"PV Table", body:"PV of an ordinary annuity of $1, 5 periods: <b>4.2124</b> at 6%; 3.9927 at 8%."},
      {name:"Controller Note", body:"Use the implicit rate because it is determinable. No lease incentives received."}
    ],
    rows:[
      {label:"Right-of-use asset", side:"DR", expected:215620, matchingElements:["ASSET"], matchingTags:["lease"], amountOptions:[215620,210620,250000], fit:"the leased asset on the books", amt:"lease liability + initial direct costs (210,620 + 5,000)"},
      {label:"Lease liability", side:"CR", expected:210620, matchingElements:["LIAB"], matchingTags:["lease"], amountOptions:[210620,215620,199635], fit:"the obligation to pay", amt:"PV of payments at 6% (50,000 \u00d7 4.2124)"},
      {label:"Cash (initial direct costs)", side:"CR", expected:5000, matchingTags:["cash"], amountOptions:[5000,10000,12637], fit:"cash paid at commencement", amt:"the initial direct costs in the agreement"}
    ] },
  { id:"tax", source:"F4.M4", title:"INCOME TAX", mode:"entry",
    tally:{label:"Income tax expense"},
    exhibits:[
      {name:"Tax Provision Memo", body:"Current income tax payable per the return is <b>$90,000</b>. The deferred tax liability increased by <b>$12,000</b> this year from depreciation timing."},
      {name:"Rate Note", body:"Deferred balances are measured at the enacted rate expected to apply on reversal."},
      {name:"GL Trial Balance", body:"No valuation allowance is required; realization of any deferred tax asset is more likely than not."}
    ],
    rows:[
      {label:"Income tax expense (total)", side:"DR", expected:102000, matchingElements:["EXP"], amountOptions:[102000,90000,12000], fit:"the period's total tax cost \u2014 an expense", amt:"current payable + change in deferred (90,000 + 12,000)"},
      {label:"Income taxes payable (current)", side:"CR", expected:90000, matchingElements:["LIAB"], amountOptions:[90000,102000,78000], fit:"the amount owed on the return", amt:"current tax per the return"},
      {label:"Deferred tax liability (change)", side:"CR", expected:12000, matchingElements:["LIAB"], matchingTags:["def"], amountOptions:[12000,21000,6000], fit:"the deferred liability account", amt:"the increase in the DTL this year"}
    ] }
];

  /* ---- jokers that boost boss rewards ---- */
  W.ACED_BOSS_JOKER_THEMES={
  compinc:{tag:"oci",bonus:3}, match:{el:"EXP",bonus:2}, bond:{tag:"bond",bonus:3},
  lease:{tag:"lease",bonus:3}, retained:{el:"EQUITY",bonus:2}, goingc:{el:"ASSET",bonus:2},
  contingency:{el:"LIAB",bonus:2}, goodwill:{tag:"intang",bonus:3}
};

  /* ---- optional shop drill ---- */
  function makeDrill(shuffle){
  const t=Math.floor(Math.random()*3);
  if(t===0){const rev=200+50*Math.floor(Math.random()*8),exp=100+50*Math.floor(Math.random()*6),oci=20+10*Math.floor(Math.random()*5);
    const ni=rev-exp;const opts=shuffle(["$"+ni,"$"+(ni+oci),"$"+rev,"$"+(rev-exp-oci)]);
    return {q:`Revenue $${rev}, Expenses $${exp}, and an unrealized AFS gain (OCI) of $${oci}. What is NET INCOME?`,opts,a:"$"+ni};}
  if(t===1){const price=8000+1000*Math.floor(Math.random()*5),fv=price-1000*(1+Math.floor(Math.random()*3));
    const loss=price-fv;const opts=shuffle(["$"+loss,"$"+price,"$"+fv,"$0"]);
    return {q:`A division's carrying value is $${price} and its fair value less costs to sell is $${fv}. What IMPAIRMENT LOSS is recognized?`,opts,a:"$"+loss};}
  const cv=10000+2000*Math.floor(Math.random()*5),life=Math.floor(Math.random()*3)*0+10,used=4,rem=life-used;
  const annual=Math.round(cv/life),bv=cv-annual*used,newDep=Math.round(bv/rem);
  const opts=shuffle(["$"+newDep,"$"+annual,"$"+bv,"$"+Math.round(cv/life)]);
  return {q:`Equipment cost $${cv}, straight-line over ${life} yrs, no salvage. After ${used} yrs the life is unchanged. What is annual DEPRECIATION?`,opts:shuffle(["$"+annual,"$"+Math.round(cv/(life+2)),"$"+(annual+200),"$"+(annual-150)]),a:"$"+annual};
}

  W.ACED_SHOP_DRILL = {
    name: "CPA EXAM", title: "CPA EXAM \u2014 OPTIONAL", reward: 6,
    blurb: "One quick computation. Nail it for +$6.",
    note: "Optional drill. Nail it for +$6. This is the only place numbers get tested \u2014 skip it freely.",
    make: makeDrill
  };

  /* ---- pack flavor ---- */
  var P = W.ACED_PACK;
  if (!P) return;
  P.vocab = { yr: "FISCAL YEAR", yrs: "fiscal years", round: "close", final: "final close", cons: "ADJUSTING ENTRIES", finish: "FILE THE 10-K",
              bonus: "YEAR-END BONUS", bossCleared: "the Year-End audit" };
  P.lose = { title: "BOOKS DIDN'T BALANCE" };
  if (/^FAR$/i.test(P.section || "")) {
    P.win = {
      title: "BOOKS CLOSED \u2014 CLEAN",
      body: "You survived four fiscal years, every boss, and the year-end close. You ended with ${money} and a hand-built engine.",
      note: "Across the run you exploited matching, revenue recognition, deferral, accrual, conservatism, impairment, LIFO, fair value, comprehensive income, leverage, bonds, leases, contingencies, goodwill and more \u2014 F1 through F4, learned by breaking the ledger, not by answering questions."
    };
  }
  P.onboarding = {
    title: "HOW A CLOSE WORKS",
    sessionName: "far_onboarding.session",
    steps: [
      { label: "STEP 1 \u00b7 THE CLOSE", color: "green", body: "Each round is a fiscal close with a score target. Play hands of account cards for chips \u00d7 multiplier \u2014 doctrines (real GAAP principles) warp the math. Beat the target to advance." },
      { label: "STEP 2 \u00b7 POP QUIZ", color: "amber", body: "Clear a close and a question from your weakest module appears. Call your confidence \u2014 LOW / MED / HIGH \u2014 before you answer. Honesty scores: that is your calibration." },
      { label: "STEP 3 \u00b7 THE SHOP", color: "amber", body: "Between closes you cash out and shop: spend chips on doctrines and jokers that bend scoring, grab a voucher, or reroll for new options. The right buys compound \u2014 they can turn a losing board into a blowout." },
      { label: "STEP 4 \u00b7 READINESS", color: "cyan", body: "Every card and answer feeds per-module mastery that carries across runs. Miss one and it is queued in Review. The goal is not one win \u2014 it is pushing readiness to exam-ready." }
    ],
    primaryLabel: "START MY FIRST CLOSE",
    cheatSheetUrl: "cheatsheet.html",
    cheatSheetLabel: "New here? The free FAR trap sheet pairs well \u2192"
  };
  P.tbsBanks = [
    "packs/originals/far-tbs-batch-01.js", "packs/originals/far-tbs-batch-02.js", "packs/originals/far-tbs-batch-03.js",
    "packs/originals/far-tbs-batch-04.js", "packs/originals/far-tbs-batch-05.js", "packs/originals/far-tbs-batch-06.js",
    "packs/originals/far-tbs-batch-07.js", "packs/originals/far-tbs-batch-08.js", "packs/originals/far-tbs-advanced-types-01.js",
    "packs/originals/bar-tbs-batch-01.js", "packs/originals/bar-tbs-batch-02.js", "packs/originals/bar-tbs-batch-03.js", "packs/originals/bar-tbs-batch-04.js",
    "packs/originals/aud-tbs-batch-01.js", "packs/originals/aud-tbs-batch-02.js", "packs/originals/aud-tbs-batch-03.js",
    "packs/originals/reg-tbs-batch-01.js"
  ];
  var sections = { FAR: "^F\\d+\\.", BAR: "^B\\d+\\.", AUD: "^AUD\\.", REG: "^REG\\." };
  var key = String(P.section || "").toUpperCase();
  if (sections[key]) P.tbsSource = sections[key];
  P.tbsIntro = "Multi-part exam work: calculations, document review, journal entries, reconciliations and short authoritative responses \u2014 graded with worked explanations.";
})();
