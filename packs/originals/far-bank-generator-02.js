/* =============================================================================
   ACED — far-bank-generator2.js   (Node script; ORIGINAL CONTENT)
   -----------------------------------------------------------------------------
   Companion to far-bank-generator.js. Broadens coverage into the rules-heavy
   areas that the first generator was thin on, to push the bank toward the
   ~50/50 calc/concept mix the exam shows:
     - Revenue recognition (ASC 606)        - Lease classification (ASC 842)
     - Consolidations / business combos     - Partnerships
     - Governmental fund accounting depth    - Not-for-profit depth
   Plus computational templates: goodwill, capitalized interest, intercompany
   inventory profit, SSP allocation, quid-pro-quo contribution, pledge allowance.

   OUTPUT: far-bank-generated2.js (append-safe window.ACED_QUESTIONS).
   Schema { q, choices:[4], answer:<0-based>, explain, source, diff }.
   Re-run: `node far-bank-generator2.js`. Verify each rule/table once vs ASC.
   ============================================================================= */
const fs = require("fs");
const NAMES=["Welk","Marr","Oste","Penn","Quade","Tarn","Volk","Wren","Yale","Zorn","Ames","Birk",
  "Cole","Dunn","Esk","Frye","Goss","Hale","Ives","Jode","Kerr","Lund","Mabe","Nuss","Pace","Rune",
  "Selk","Tove","Urne","Vance","Pard","Spin","Poe","Saxe","Pine","Spruce","Pare","Shel"];
let nameI=0; const nm=()=>NAMES[(nameI++)%NAMES.length];
let keyCounter=0;
const round=n=>Math.round(n);
const money=n=>{const v=Math.round(n);return v<0?"($"+Math.abs(v).toLocaleString("en-US")+")":"$"+v.toLocaleString("en-US");};
const pct=n=>(n*100).toFixed(n*100%1?1:0)+"%";
function pick3(correct,cands){const out=[];for(const c of cands){if(out.length>=3)break;if(c!==correct&&!out.includes(c))out.push(c);}let k=1,step=Math.max(1,Math.round(Math.abs(correct)*0.013)||1);while(out.length<3){const c=correct+k*step;if(c!==correct&&!out.includes(c))out.push(c);k++;}return out;}
function numItem(correct,distractors,fmt,q,explain,source,diff){const ds=pick3(correct,distractors);const pos=(keyCounter++)%4;const vals=[];let di=0;for(let i=0;i<4;i++)vals[i]=(i===pos)?correct:ds[di++];const choices=vals.map(fmt);if(new Set(choices).size!==4)return null;return{source,diff,q,choices,answer:pos,explain};}
function conItem(correct,distractors,q,explain,source,diff){const ds=[];for(const d of distractors){if(ds.length>=3)break;if(d!==correct&&!ds.includes(d))ds.push(d);}if(ds.length<3)return null;const pos=(keyCounter++)%4;const arr=[];let di=0;for(let i=0;i<4;i++)arr[i]=(i===pos)?correct:ds[di++];if(new Set(arr).size!==4)return null;return{source,diff,q,choices:arr,answer:pos,explain};}
const out=[]; const emit=it=>{if(it)out.push(it);};

/* ===== CONCEPTUAL TABLES  (rows: [scenario, correct, [distractors]]) ======== */

// Revenue recognition — ASC 606
const REV=[
 ["a sale of goods for which no over-time criterion is met","Recognize revenue at the point in time control transfers",["Recognize revenue over time as costs are incurred","Defer all revenue until cash is collected","Recognize revenue when the contract is signed"]],
 ["a service the customer simultaneously receives and consumes as the entity performs","Recognize revenue over time",["Recognize revenue at completion","Recognize revenue when invoiced","Defer until the customer confirms satisfaction"]],
 ["construction of an asset the customer controls as it is built","Recognize revenue over time",["Recognize revenue at delivery","Recognize revenue when title transfers","Recognize revenue only upon final inspection"]],
 ["an asset with no alternative use to the entity plus an enforceable right to payment for performance to date","Recognize revenue over time",["Recognize revenue at the point of delivery","Defer revenue until the asset is sold to a third party","Recognize revenue when production begins"]],
 ["variable consideration such as a performance bonus or rebate","Estimate it and include only the amount highly probable not to reverse",["Include the full amount regardless of reversal risk","Exclude it entirely until it is received","Recognize it only when the cash is collected"]],
 ["an arrangement where the entity arranges for a third party to provide the good and does not control it before transfer","Recognize revenue net, as an agent",["Recognize revenue gross, as a principal","Recognize no revenue at all","Recognize revenue equal to the amount paid to the supplier"]],
 ["sales taxes collected from customers on behalf of the government","Exclude them from the transaction price",["Include them in revenue","Recognize them as other income","Defer them as a contract liability"]],
 ["goods shipped to a consignee under a consignment arrangement","Recognize no revenue until the consignee sells to an end customer",["Recognize revenue when the goods are shipped to the consignee","Recognize revenue when the consignee receives the goods","Recognize revenue ratably over the consignment period"]],
 ["a bill-and-hold arrangement","Recognize revenue only if the strict bill-and-hold criteria are met",["Recognize revenue when payment is received","Never recognize revenue until physical delivery","Recognize revenue when the order is placed"]],
 ["a contract that fails the 'probable collection' criterion","Conclude no contract exists and recognize no revenue",["Recognize revenue and a large allowance","Recognize revenue over the expected collection period","Recognize revenue net of estimated bad debts"]],
 ["allocation of a bundled transaction price among multiple performance obligations","Allocate based on relative standalone selling prices",["Allocate equally to each obligation","Allocate entirely to the obligation delivered first","Allocate based on the entity's cost of each obligation"]],
 ["a product sold with a right of return","Recognize revenue net of expected returns, with a refund liability and return asset",["Recognize the full sales amount with no adjustment","Defer all revenue until the return period expires","Recognize revenue only for items not returned, when known"]],
];
// Lease classification — ASC 842
const LEASE=[
 ["ownership of the asset transfers to the lessee by the end of the term","A finance lease",["An operating lease","A short-term lease expensed straight-line","A direct-financing lease"]],
 ["the lease contains a purchase option the lessee is reasonably certain to exercise","A finance lease",["An operating lease","A short-term lease","A service contract"]],
 ["the lease term is for the major part of the asset's remaining economic life","A finance lease",["An operating lease","A short-term lease","An executory contract"]],
 ["the present value of the payments is substantially all of the asset's fair value","A finance lease",["An operating lease","A short-term lease","A month-to-month lease"]],
 ["the asset is so specialized it has no alternative use to the lessor at the end of the term","A finance lease",["An operating lease","A short-term lease","A sale-leaseback"]],
 ["a lease in which none of the five finance-lease criteria are met","An operating lease",["A finance lease","A sales-type lease","A direct-financing lease"]],
 ["a lease of 12 months or less with no purchase option","Eligible for the short-term lease election (expense payments straight-line)",["Always a finance lease","Always capitalized at present value","Never recognized in the financial statements"]],
];
// Consolidations / business combinations
const CONSOL=[
 ["intercompany receivables and payables between a parent and subsidiary","Eliminated in full, regardless of the ownership percentage",["Eliminated only to the extent of the parent's ownership","Reported as related-party balances","Netted against noncontrolling interest"]],
 ["the noncontrolling interest at the acquisition date under U.S. GAAP","Measured at fair value",["Measured at the parent's cost","Measured at the NCI's share of book value","Not recognized until the subsidiary is sold"]],
 ["acquisition-related legal, advisory, and due-diligence costs","Expensed as incurred",["Capitalized as part of the consideration transferred","Added to goodwill","Recorded as a reduction of equity"]],
 ["the accounting method required for a business combination","The acquisition method",["The pooling-of-interests method","The equity method","The proportionate consolidation method"]],
 ["unrealized profit in ending inventory from an intercompany sale","Deferred until the inventory is sold to an outside party",["Recognized immediately in consolidated income","Allocated entirely to noncontrolling interest","Ignored if the subsidiary is wholly owned"]],
 ["a gain on an intercompany sale of land","Deferred until the land is sold outside the consolidated group",["Recognized in consolidated income in the year of sale","Recorded directly in equity","Amortized over the land's remaining life"]],
 ["an investment that conveys control (more than 50% of voting interest)","Consolidated",["Accounted for under the equity method","Reported at fair value through net income","Reported at amortized cost"]],
 ["goodwill recognized in a business combination","Consideration transferred + fair value of NCI − fair value of identifiable net assets",["Consideration transferred − book value of net assets","The excess of book value over fair value of net assets","Consideration transferred + fair value of identifiable net assets"]],
];
// Governmental fund accounting depth
const GOV=[
 ["revenue recognition under the modified accrual basis","When measurable and available",["When earned, regardless of collection","When the budget is adopted","When cash is ultimately received, always"]],
 ["the 'available' criterion for property taxes","Collectible within 60 days after year-end",["Collectible within the next fiscal year","Collectible at any future date","Collectible within 90 days after year-end"]],
 ["a capital asset purchased by a governmental fund","Reported as an expenditure of the fund (not capitalized in the fund)",["Capitalized and depreciated in the fund","Reported as an other financing use","Recorded only in fiduciary funds"]],
 ["long-term debt issued by a governmental fund","Recorded as an other financing source (the liability appears only government-wide)",["Recorded as a fund liability","Recorded as fund revenue","Netted against capital outlay"]],
 ["the fund balance categories, most-constrained to least","Nonspendable, Restricted, Committed, Assigned, Unassigned",["Restricted, Unrestricted, Designated, Reserved, Free","Reserved, Designated, Unreserved","Spendable, Nonspendable, Reserved, Free"]],
 ["when encumbrances are recorded","When a purchase commitment (such as a purchase order) is made",["When the goods are received","When the invoice is paid","At the end of the fiscal year only"]],
 ["the measurement focus and basis used by the government-wide statements","Economic resources focus, full accrual basis",["Current financial resources focus, modified accrual","Cash basis","Budgetary basis"]],
];
// Not-for-profit depth
const NFP=[
 ["donated services","Recognized only if they create or enhance a nonfinancial asset, or require specialized skills that would otherwise be purchased",["Recognized for all volunteer hours at fair value","Never recognized","Recognized only if the donor requests it"]],
 ["a quid pro quo contribution where the donor receives a benefit","Contribution revenue equals the amount paid minus the fair value of the benefit received",["Contribution revenue equals the full amount paid","Contribution revenue equals the fair value of the benefit","No contribution revenue is recognized"]],
 ["a cost-reimbursement grant","Conditional — revenue is recognized as qualifying costs are incurred",["Unconditional — revenue is recognized immediately","Recognized only when the grant is closed out","Recorded as a liability until the grant expires"]],
 ["an unconditional pledge collectible over several years","Contribution revenue now at present value, net of an estimated uncollectible allowance",["Deferred until the cash is received","Recognized only as each installment arrives","Recorded as a conditional promise"]],
 ["the net asset classes a nongovernmental NFP reports","With donor restrictions and without donor restrictions",["Unrestricted, temporarily restricted, permanently restricted","Restricted and unrestricted fund balances","Spendable and nonspendable"]],
];
// Partnerships (conceptual)
const PARTNER=[
 ["a noncash asset contributed by a partner","Recorded at its fair value at the contribution date",["Recorded at the partner's carrying amount","Recorded at original cost","Recorded at the lower of cost or fair value"]],
 ["the order of payment in a partnership liquidation","Outside creditors, then partner loans, then partner capital",["Partner capital, then loans, then creditors","Pro rata among all claimants","Partner loans, then creditors, then capital"]],
 ["the bonus method when an incoming partner pays more than book value for an interest","The excess is allocated to the existing partners' capital; no goodwill is recorded",["Goodwill is recorded for the excess","The excess is recognized as income","The excess is recorded as a liability"]],
 ["allocation of partnership profit when salary and interest allowances exceed net income","Allowances are still allocated, and the resulting deficiency is shared in the loss ratio",["No allowances are given when income is insufficient","Income is split equally regardless of the agreement","Allowances are prorated to available income"]],
];

function table(rows,qFn,exFn,source,diff,reps){let m=0;for(let r=0;r<reps;r++)for(const [scen,correct,ds] of rows){const e=nm();emit(conItem(correct,ds,qFn(scen,e),exFn(scen,correct,e),source,diff));m++;}}

table(REV,(s,e)=>`Under ASC 606, how should ${e} Company account for ${s}?`,(s,c)=>`Correct: ${c}.`,"F2.M1","medium",3);
table(LEASE,(s,e)=>`For ${e} Company, a lessee, a lease in which ${s} is classified as:`,(s,c)=>`Correct: ${c}. A lessee uses a finance lease if any one of the five criteria (ownership transfer, purchase option reasonably certain, term = major part of life, PV = substantially all of FV, specialized asset) is met; otherwise it is an operating lease.`,"F3.M5","medium",3);
table(CONSOL,(s,e)=>`In preparing consolidated financial statements for ${e} Company and its subsidiary, ${s} is:`,(s,c)=>`Correct: ${c}. Combinations use the acquisition method; 100% of intercompany items eliminate; NCI is at fair value (US GAAP); acquisition costs are expensed; intercompany profit is deferred until realized outside the group.`,"F2.M6","hard",3);
table(GOV,(s,e)=>`In governmental fund accounting, ${s} is:`,(s,c)=>`Correct: ${c}. Governmental funds use current financial resources / modified accrual; capital assets and long-term debt appear only government-wide.`,"F4.M4","medium",3);
table(NFP,(s,e)=>`For ${e}, a nongovernmental not-for-profit organization, ${s} is treated as follows:`,(s,c)=>`Correct: ${c}.`,"F4.M4","medium",3);
table(PARTNER,(s,e)=>`In partnership accounting, ${s} is handled as:`,(s,c)=>`Correct: ${c}.`,"F2.M6","medium",3);

/* ===== COMPUTATIONAL templates ============================================= */

// Goodwill = consideration + FV of NCI − FV of identifiable net assets
function t_goodwill(n){let m=0;
  const CONS=[600000,700000,800000,900000,1000000,1200000];
  const PCT=[0.80,0.75,0.90,0.70];
  const FVNA=[700000,800000,900000,1000000];
  for(const cons of CONS)for(const p of PCT)for(const fvna of FVNA){
    if(m>=n)return; const nciFV=round(fvna*(1-p)); const correct=cons+nciFV-fvna;
    if(correct<=0)continue; const e=nm();
    emit(numItem(correct,[cons-fvna,cons-round(fvna*p),cons+nciFV+fvna,round(correct*1.04)],money,
      `${e} Company (the parent) acquired ${pct(p)} of a subsidiary. Consideration transferred was ${money(cons)}, the fair value of the noncontrolling interest was ${money(nciFV)}, and the fair value of the subsidiary's identifiable net assets was ${money(fvna)}. What is goodwill?`,
      `Goodwill = consideration + FV of NCI − FV of identifiable net assets = ${money(cons)} + ${money(nciFV)} − ${money(fvna)} = ${money(correct)}. Distractors omit the NCI, use only the parent's share of net assets, or add net assets instead of subtracting.`,
      "F2.M6","hard")); m++;
  }
}
// Capitalized interest = weighted-average accumulated expenditures × rate (<= actual)
function t_capint(n){let m=0;
  const AAE=[400000,500000,600000,800000,1000000]; const RATE=[0.06,0.08,0.10]; const TOTAL=[800000,1000000,1200000];
  for(const aae of AAE)for(const r of RATE)for(const tot of TOTAL){
    if(tot<aae)continue; if(m>=n)return; const correct=round(aae*r); const e=nm();
    emit(numItem(correct,[round(tot*r),aae,round(aae*r/2),round(correct*1.05)],money,
      `${e} Company is constructing a building for its own use. Weighted-average accumulated expenditures during the year were ${money(aae)}, total construction cost to date was ${money(tot)}, and the relevant interest rate was ${pct(r)} (actual interest cost exceeded the computed amount). How much interest should be capitalized this year?`,
      `Capitalized interest = weighted-average accumulated expenditures × rate = ${money(aae)} × ${pct(r)} = ${money(correct)} (capped at actual interest, not binding here). Distractors apply the rate to total cost, omit the rate, or halve the result.`,
      "F2.M4","hard")); m++;
  }
}
// Intercompany inventory profit to defer (markup ON COST)
function t_icprofit(n){let m=0;
  const HELD=[20000,30000,40000,50000,60000,80000]; const MK=[0.25,0.20,0.30,0.50];
  for(const held of HELD)for(const mk of MK){
    if(m>=n)return; const marginPct=mk/(1+mk); const correct=round(held*marginPct); const e=nm();
    emit(numItem(correct,[round(held*mk),held,round(held/(1+mk)),round(correct*1.06)],money,
      `At year-end, the subsidiary of ${e} Company still holds ${money(held)} (at transfer price) of inventory purchased from the parent, who sells to the subsidiary at ${pct(mk)} above cost. What unrealized intercompany profit must be eliminated in consolidation?`,
      `Markup of ${pct(mk)} on cost equals a ${pct(marginPct)} margin on selling price; unrealized profit = ${money(held)} × ${pct(marginPct)} = ${money(correct)}. Distractors apply the markup rate to the selling price, defer the whole balance, or back into the cost portion.`,
      "F2.M6","hard")); m++;
  }
}
// Transaction-price allocation by relative standalone selling price
function t_ssp(n){let m=0;
  const PAIRS=[[40000,60000],[60000,40000],[30000,90000],[80000,20000],[50000,50000],[25000,75000],[70000,30000],[45000,55000]];
  const FACTOR=[0.90,0.85,0.80]; // bundle is sold at a discount to total SSP
  for(const [a,b] of PAIRS)for(const d of FACTOR){
    if(m>=n)return; const P=round((a+b)*d); const correct=round(P*a/(a+b)); const e=nm();
    emit(numItem(correct,[a,round(P*b/(a+b)),round(P/2),round(correct*1.06)],money,
      `${e} Company signs a contract for a bundled price of ${money(P)} covering two performance obligations whose standalone selling prices are ${money(a)} and ${money(b)}. How much of the transaction price is allocated to the first obligation?`,
      `Allocate by relative standalone selling price: ${money(P)} × ${money(a)} / ${money(a+b)} = ${money(correct)}. Distractors use the standalone price without allocating the discount, allocate to the other obligation, or split the price equally.`,
      "F2.M1","medium")); m++;
  }
}
// Quid pro quo contribution revenue (NFP)
function t_quidproquo(n){let m=0;
  const PAID=[150,200,250,500,1000]; const FV=[40,60,100,150,300];
  for(const paid of PAID)for(const fv of FV){
    if(m>=n||fv>=paid)return; const correct=paid-fv; const e=nm();
    emit(numItem(correct,[paid,fv,paid+fv,round(correct*0.9)],money,
      `A donor pays ${money(paid)} to attend a fundraising gala held by ${e}, a nongovernmental not-for-profit, and receives benefits with a fair value of ${money(fv)}. What amount should ${e} record as contribution revenue?`,
      `Contribution revenue = amount paid − fair value of the benefit received = ${money(paid)} − ${money(fv)} = ${money(correct)}. Distractors use the full amount, only the benefit, or the sum.`,
      "F4.M4","medium")); m++;
  }
}
// Pledge revenue net of uncollectible allowance (NFP)
function t_pledge(n){let m=0;
  const PL=[40000,50000,60000,80000,100000,120000]; const U=[0.05,0.10,0.15,0.20];
  for(const pl of PL)for(const u of U){
    if(m>=n)return; const correct=round(pl*(1-u)); const e=nm();
    emit(numItem(correct,[pl,round(pl*u),round(pl*(1+u)),round(correct*0.97)],money,
      `${e}, a nongovernmental not-for-profit, receives unconditional pledges of ${money(pl)} during the year and estimates that ${pct(u)} will be uncollectible. What amount of contribution revenue should be recognized?`,
      `Unconditional pledges are revenue now, net of the estimated uncollectible allowance: ${money(pl)} × (1 − ${pct(u)}) = ${money(correct)}. Distractors ignore the allowance, report only the allowance, or add it.`,
      "F4.M4","medium")); m++;
  }
}

[ [t_goodwill,40],[t_capint,30],[t_icprofit,30],[t_ssp,28],[t_quidproquo,24],[t_pledge,28] ].forEach(([fn,n])=>fn(n));

/* ===== de-dupe + write ===================================================== */
const seen=new Set(); const final=[];
for(const it of out){ if(!it||seen.has(it.q))continue; seen.add(it.q); final.push(it); }
const header=`/* ACED — far-bank-generated2.js (ORIGINAL, machine-generated; append-safe)
   ${final.length} additional FAR MCQs (revenue, leases, consolidations, partnerships,
   governmental, NFP + goodwill/cap-interest/intercompany/SSP/NFP computations).
   Schema {q,choices[4],answer,explain,source,diff}. Verify each rule once vs ASC. */\n`;
fs.writeFileSync("far-bank-generated2.js", header+"window.ACED_QUESTIONS = (window.ACED_QUESTIONS || []).concat(\n"+JSON.stringify(final,null,1)+"\n);\n");
console.log("Generated", final.length, "MCQs -> far-bank-generated2.js");
