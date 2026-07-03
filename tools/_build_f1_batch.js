/* tools/_build_f1_batch.js — author + compile the F1 batch to canonical JSON.
   Run: node tools/_build_f1_batch.js  ->  content/cpa-far/far-f1-batch-05.json
   - choices are deterministically shuffled (seeded by the stem hash) so the answer
     key spreads across A/B/C/D and "longest == answer" is decorrelated.
   - IDs use the SAME djb2 hash as tools/js-to-json.js, so they're stable + consistent.
   - reviewed is omitted here; set reviewed:true on items to surface the in-app badge. */
"use strict";
const fs = require("fs"), path = require("path");
const ROOT = path.resolve(__dirname, "..");

// answer = index of the correct choice in the AUTHORED order (pre-shuffle).
const Q = [
/* ===== F1.M1 — Income Statement & Comprehensive Income ===== */
{source:"F1.M1",diff:"easy",ref:"ASC 225",
 q:"On which income statement format does gross profit appear as a separate subtotal?",
 choices:["A multi-step income statement","A single-step income statement","Both formats, in the same position","The statement of cash flows"],answer:0,
 explain:"A multi-step income statement presents gross profit (net sales minus cost of goods sold) as a subtotal before operating expenses. A single-step statement groups all revenues and all expenses with no gross profit line."},
{source:"F1.M1",diff:"medium",ref:"ASC 220",
 q:"Comprehensive income for a period is best described as the change in equity from:",
 choices:["Nonowner sources, equal to net income plus other comprehensive income","Net income plus dividends declared during the period","Net income excluding the results of discontinued operations","Revenues minus expenses from continuing operations only"],answer:0,
 explain:"Comprehensive income is the change in equity during a period from transactions and events with nonowners; it equals net income plus other comprehensive income. Owner transactions such as dividends and stock issuances are excluded."},
{source:"F1.M1",diff:"medium",ref:"ASC 320",
 q:"Under U.S. GAAP, which item is reported in other comprehensive income rather than in net income?",
 choices:["An unrealized holding gain on an available-for-sale debt security","An unrealized holding gain on a trading debt security","A realized gain on the sale of equipment","An unrealized holding gain on an equity security with a readily determinable fair value"],answer:0,
 explain:"Unrealized holding gains and losses on available-for-sale debt securities are recognized in OCI. Trading securities and, since ASU 2016-01, equity securities with readily determinable fair values are remeasured through net income."},
{source:"F1.M1",diff:"hard",ref:"ASC 220",
 q:"Net income is $400,000. During the year there was a $30,000 unrealized gain on available-for-sale debt securities, a $12,000 foreign currency translation loss, a $5,000 unrealized loss on the effective portion of a cash flow hedge, and $50,000 of dividends declared. Comprehensive income is:",
 choices:["$413,000","$363,000","$400,000","$430,000"],answer:0,
 explain:"Comprehensive income = net income + net OCI. Net OCI = 30,000 - 12,000 - 5,000 = 13,000, so 400,000 + 13,000 = 413,000. Dividends declared are a transaction with owners and are excluded."},
{source:"F1.M1",diff:"medium",ref:"ASC 220",
 q:"When an available-for-sale debt security whose gain was previously recognized in OCI is sold at that gain, the effect on other comprehensive income in the period of sale is:",
 choices:["A reclassification adjustment that decreases OCI so the gain is not counted twice","An increase in OCI equal to the realized gain","No effect, because the gain was already recognized in a prior period","A direct credit to retained earnings"],answer:0,
 explain:"The previously unrealized gain held in accumulated OCI is reclassified out of OCI and into net income when realized. The reclassification adjustment prevents the same gain from being included in comprehensive income twice."},
{source:"F1.M1",diff:"easy",ref:"ASC 220",
 q:"U.S. GAAP allows an entity to present comprehensive income:",
 choices:["In a single continuous statement, or in two consecutive statements","Only within the statement of changes in stockholders' equity","Only in the notes to the financial statements","Only as a single combined statement of income and comprehensive income"],answer:0,
 explain:"Comprehensive income may be shown either in one continuous statement of comprehensive income or in two consecutive statements (an income statement followed by a statement of comprehensive income). Presenting it solely within the equity statement is not permitted."},
{source:"F1.M1",diff:"medium",ref:"ASC 205-20",
 q:"Which item is presented, net of tax, in a separate section below income from continuing operations?",
 choices:["The results of discontinued operations","A loss caused by a labor strike","A write-down of inventory to net realizable value","The effect of a change in an accounting estimate"],answer:0,
 explain:"Discontinued operations are reported separately, net of tax, below income from continuing operations. The other items remain within continuing operations; separate extraordinary-item treatment was eliminated by ASU 2015-01."},
{source:"F1.M1",diff:"medium",ref:"ASC 225",
 q:"Net sales were $900,000, cost of goods sold $540,000, selling and administrative expenses $180,000, interest expense $20,000, and there was a $15,000 gain on the sale of equipment. Operating income is:",
 choices:["$180,000","$175,000","$195,000","$160,000"],answer:0,
 explain:"Operating income = gross profit - operating expenses = (900,000 - 540,000) - 180,000 = 180,000. Interest expense and the gain on sale of equipment are nonoperating and excluded from operating income."},
{source:"F1.M1",diff:"hard",ref:"ASC 220",
 q:"Accumulated other comprehensive income is reported as:",
 choices:["A separate component of stockholders' equity on the balance sheet","A line item within the determination of net income","A liability remeasured to fair value each period","A required line within the statement of cash flows"],answer:0,
 explain:"Items of OCI accumulate in accumulated other comprehensive income (AOCI), a separate component of equity on the balance sheet. Comprehensive income is the flow for the period; AOCI is the cumulative balance."},
{source:"F1.M1",diff:"easy",ref:"ASC 225",
 q:"In a single-step income statement, income before taxes is computed as:",
 choices:["Total revenues and gains minus total expenses and losses","Net sales minus cost of goods sold","Gross profit minus operating expenses","Operating income plus other comprehensive income"],answer:0,
 explain:"A single-step statement totals all revenues and gains, totals all expenses and losses, and subtracts in a single step. There are no intermediate subtotals such as gross profit or operating income."},
{source:"F1.M1",diff:"hard",ref:"ASC 715",
 q:"Which of the following is recognized in other comprehensive income?",
 choices:["Prior service cost arising during the current period in a defined benefit pension plan","The service cost component of net periodic pension cost","Interest cost on the projected benefit obligation","Amortization of prior service cost into net periodic pension cost"],answer:0,
 explain:"Prior service cost (and net actuarial gains and losses) arising during the period are recognized in OCI and later amortized into net periodic pension cost. Service cost, interest cost, and the amortization itself are components of pension expense in net income."},

/* ===== F1.M2 — Reporting & Disclosures ===== */
{source:"F1.M2",diff:"medium",ref:"ASC 855",
 q:"A customer that was already in financial difficulty at the balance sheet date settled its receivable for a reduced amount before the statements were issued. This is:",
 choices:["A recognized subsequent event requiring adjustment of the financial statements","A nonrecognized subsequent event requiring only note disclosure","An event that is neither recognized nor disclosed","A change in accounting estimate applied prospectively"],answer:0,
 explain:"A recognized (Type I) subsequent event provides more evidence about a condition that existed at the balance sheet date - here the customer's difficulty existed at year end - so the statements are adjusted. Conditions arising only after year end are nonrecognized (Type II) and merely disclosed."},
{source:"F1.M2",diff:"medium",ref:"ASC 855",
 q:"After the balance sheet date but before issuance, a fire destroyed one of the company's major plants. This event should be:",
 choices:["Disclosed in the notes as a nonrecognized subsequent event","Recorded as a loss in the current-year income statement","Ignored until the following reporting period","Reported as a prior period adjustment to retained earnings"],answer:0,
 explain:"The fire reflects a condition that arose after the balance sheet date, so it is a nonrecognized (Type II) subsequent event. The statements are not adjusted, but a material event like this is disclosed so the statements are not misleading."},
{source:"F1.M2",diff:"easy",ref:"ASC 235",
 q:"The summary of significant accounting policies note would most likely disclose:",
 choices:["The depreciation method used for property, plant, and equipment","The detailed composition of the plant assets balance","The maturity dates of the company's long-term debt","The detailed components of the income tax provision"],answer:0,
 explain:"The significant accounting policies note describes the methods chosen, such as depreciation method, inventory costing, and revenue recognition. Specific balances and their composition are disclosed in other notes, not the policies note."},
{source:"F1.M2",diff:"medium",ref:"ASC 850",
 q:"Disclosure of related party transactions must include all of the following EXCEPT:",
 choices:["A representation that the transactions were on arm's-length terms, absent substantiation","The nature of the relationship between the parties","A description of the transactions","The dollar amounts involved in the transactions"],answer:0,
 explain:"Related party disclosures cover the nature of the relationship, a description of the transactions, and the dollar amounts. An entity must not assert that terms were equivalent to arm's-length transactions unless that representation can be substantiated."},
{source:"F1.M2",diff:"medium",ref:"ASC 820",
 q:"An unadjusted quoted price for an identical asset in an active market is categorized within the fair value hierarchy as:",
 choices:["Level 1","Level 2","Level 3","Outside the fair value hierarchy"],answer:0,
 explain:"Level 1 inputs are unadjusted quoted prices in active markets for identical assets or liabilities. Level 2 uses other observable inputs, and Level 3 uses unobservable inputs."},
{source:"F1.M2",diff:"hard",ref:"ASC 275",
 q:"Under the risks and uncertainties guidance, disclosure of a concentration is required when the concentration exists at the balance sheet date and:",
 choices:["It makes the entity vulnerable to the risk of a near-term severe impact","It is expected to be eliminated within the next five years","Management has concluded the concentration is immaterial","It relates to a single customer rather than a group"],answer:0,
 explain:"A concentration is disclosed when it exists at the balance sheet date, it makes the entity vulnerable to a near-term severe impact, and it is at least reasonably possible that the impact will occur in the near term."},
{source:"F1.M2",diff:"easy",ref:"ASC 205-40",
 q:"Management must evaluate whether there is substantial doubt about the entity's ability to continue as a going concern for a period of:",
 choices:["One year after the date the financial statements are issued or available to be issued","Five years after the balance sheet date","The length of the entity's operating cycle","An indefinite period into the future"],answer:0,
 explain:"Under ASU 2014-15, management evaluates going concern for one year from the date the financial statements are issued (or available to be issued) and discloses the conditions when substantial doubt exists."},

/* ===== F1.M3 — Special Reporting (changes, errors, discontinued ops, segments) ===== */
{source:"F1.M3",diff:"medium",ref:"ASC 250",
 q:"A change from the FIFO inventory method to the weighted-average method is accounted for:",
 choices:["Retrospectively, adjusting the opening retained earnings of the earliest period presented","Prospectively, in the current and future periods only","As a correction of a prior period error, by restatement","Through note disclosure only, with no adjustment to the statements"],answer:0,
 explain:"A change in accounting principle is applied retrospectively: prior periods presented are recast and the cumulative effect adjusts beginning retained earnings of the earliest period shown. A change to LIFO is the exception and is applied prospectively."},
{source:"F1.M3",diff:"medium",ref:"ASC 250",
 q:"Revising the estimated useful life of a machine is treated as:",
 choices:["A change in accounting estimate, accounted for prospectively","A change in accounting principle, accounted for retrospectively","A correction of an error, requiring restatement","A change in reporting entity"],answer:0,
 explain:"A change in an estimate, such as useful life, salvage value, or the bad debt rate, is accounted for prospectively in the period of change and future periods, with no restatement of prior periods."},
{source:"F1.M3",diff:"hard",ref:"ASC 250",
 q:"Depreciation expense omitted in a prior year is discovered in the current year. The error is corrected by:",
 choices:["Restating the prior period statements and adjusting beginning retained earnings","Including a cumulative-effect adjustment in current-year net income","Adjusting prospectively over the asset's remaining useful life","Disclosing the error in the notes with no adjustment"],answer:0,
 explain:"Correcting a prior period error is a prior period adjustment: the prior statements presented are restated and the beginning balance of retained earnings is adjusted for the cumulative effect, net of tax."},
{source:"F1.M3",diff:"medium",ref:"ASC 205-20",
 q:"A disposal of a component of an entity is reported in discontinued operations only when it:",
 choices:["Represents a strategic shift that has, or will have, a major effect on operations and results","Produces any gain or loss, regardless of its significance","Is expected to be completed within the entity's operating cycle","Involves the sale of any individual long-lived asset"],answer:0,
 explain:"Since ASU 2014-08, a disposal qualifies as a discontinued operation only when it represents a strategic shift that has (or will have) a major effect on the entity's operations and financial results, such as exiting a major line of business or geographic area."},
{source:"F1.M3",diff:"medium",ref:"ASC 205-20",
 q:"A component classified as discontinued had a $200,000 pretax operating loss, and its disposal produced a $50,000 pretax gain. At a 25% tax rate, the amount reported in discontinued operations is a:",
 choices:["$(112,500) loss","$(150,000) loss","$(187,500) loss","$(37,500) loss"],answer:0,
 explain:"Combine the pretax amounts: -200,000 + 50,000 = -150,000, then apply tax: -150,000 x (1 - 0.25) = -112,500. Discontinued operations are reported net of tax."},
{source:"F1.M3",diff:"hard",ref:"ASC 280",
 q:"An operating segment is a reportable segment if its reported revenue, including intersegment sales, is at least:",
 choices:["10% of the combined revenue of all operating segments","5% of consolidated external revenue","25% of consolidated external revenue","75% of the combined revenue of all operating segments"],answer:0,
 explain:"A segment is reportable if it meets any 10% test - revenue, absolute reported profit or loss, or assets. Separately, the reportable segments together must represent at least 75% of consolidated external revenue."},

/* ===== F1.M4 — Statement of Cash Flows ===== */
{source:"F1.M4",diff:"easy",ref:"ASC 230",
 q:"Under U.S. GAAP, cash dividends paid to shareholders are classified in the statement of cash flows as a(n):",
 choices:["Financing activity","Operating activity","Investing activity","Noncash activity"],answer:0,
 explain:"Dividends paid are a financing activity. By contrast, interest paid, and interest and dividends received, are operating activities under U.S. GAAP."},
{source:"F1.M4",diff:"medium",ref:"ASC 230",
 q:"Under U.S. GAAP, interest paid on debt is reported in the statement of cash flows as a(n):",
 choices:["Operating activity","Financing activity","Investing activity","Noncash financing activity"],answer:0,
 explain:"U.S. GAAP classifies interest paid, and interest and dividends received, as operating activities. Only dividends paid and the principal portion of debt are financing. IFRS allows more presentation choice."},
{source:"F1.M4",diff:"medium",ref:"ASC 230",
 q:"Net income is $250,000. Depreciation was $40,000, accounts receivable increased $15,000, inventory decreased $10,000, and accounts payable decreased $8,000. Cash flow from operating activities under the indirect method is:",
 choices:["$277,000","$253,000","$293,000","$267,000"],answer:0,
 explain:"Begin with net income, add back depreciation (+40,000), subtract the AR increase (-15,000), add the inventory decrease (+10,000), and subtract the AP decrease (-8,000): 250,000 + 40,000 - 15,000 + 10,000 - 8,000 = 277,000."},
{source:"F1.M4",diff:"medium",ref:"ASC 230",
 q:"Under the indirect method, a gain on the sale of equipment is:",
 choices:["Subtracted from net income in operating activities, with the proceeds shown in investing","Added to net income in operating activities","Reported as an inflow in financing activities","Ignored entirely because it is a noncash item"],answer:0,
 explain:"The gain is removed (subtracted) from operating cash flow because the entire cash proceeds, including the gain, are reported as an investing inflow. Leaving the gain in operating activities would double-count it."},
{source:"F1.M4",diff:"hard",ref:"ASC 230",
 q:"Equipment with a carrying amount of $30,000 was sold at a $7,000 gain. The cash inflow reported in investing activities is:",
 choices:["$37,000","$30,000","$23,000","$7,000"],answer:0,
 explain:"Cash proceeds = carrying amount + gain = 30,000 + 7,000 = 37,000, reported as an investing inflow. The 7,000 gain is removed from operating activities under the indirect method to avoid double-counting."},
{source:"F1.M4",diff:"easy",ref:"ASC 230",
 q:"Acquiring a building by issuing common stock directly to the seller is reported:",
 choices:["As a noncash investing and financing activity, disclosed separately","As an investing outflow and a financing inflow within the statement body","As an operating activity in the period of acquisition","Only within the statement of changes in stockholders' equity"],answer:0,
 explain:"A direct exchange of stock for a building involves no cash, so it is excluded from the body of the statement and disclosed separately as a noncash investing and financing activity."},
{source:"F1.M4",diff:"medium",ref:"ASC 230",
 q:"To qualify as a cash equivalent, a highly liquid investment must have an original maturity to the holder of:",
 choices:["Three months or less","Six months or less","One year or less","Three months or less measured from the balance sheet date"],answer:0,
 explain:"A cash equivalent must be highly liquid with an original maturity of three months or less when acquired by the holder. Maturity measured from the balance sheet date, or any longer maturity, does not qualify."},
{source:"F1.M4",diff:"medium",ref:"ASC 230",
 q:"The purchase of treasury stock is reported in the statement of cash flows as a(n):",
 choices:["Financing outflow","Investing outflow","Operating outflow","Noncash transaction"],answer:0,
 explain:"Treasury stock transactions are dealings with the entity's own owners, so a purchase of treasury stock is a financing outflow and a reissuance is a financing inflow."}
];

/* ---- build ---- */
function hash8(s){let h=5381;s=String(s||"");for(let i=0;i<s.length;i++)h=((h<<5)+h+s.charCodeAt(i))>>>0;return("0000000"+h.toString(16)).slice(-8);}
function idFor(q){return "cpa-far-"+String(q.source).toLowerCase().replace(/[^a-z0-9]/g,"")+"-"+hash8(q.q);}
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function shuffleStable(arr,seed){const a=arr.slice(),rnd=mulberry32(seed);for(let i=a.length-1;i>0;i--){const j=Math.floor(rnd()*(i+1));const t=a[i];a[i]=a[j];a[j]=t;}return a;}

const out=Q.map(q=>{
  const correct=q.choices[q.answer];
  const shuffled=shuffleStable(q.choices, parseInt(hash8(q.q),16));
  const rec={id:idFor(q),source:q.source,diff:q.diff,q:q.q,choices:shuffled,answer:shuffled.indexOf(correct),explain:q.explain};
  if(q.ref)rec.ref=q.ref;
  return rec;
});
const doc={$schema:"aced-question-bank/v1",pack:"cpa-far",section:"FAR",bank:"far-f1-batch-05",generated:false,count:out.length,questions:out};
const dest=path.join(ROOT,"content","cpa-far","far-f1-batch-05.json");
fs.mkdirSync(path.dirname(dest),{recursive:true});
fs.writeFileSync(dest,JSON.stringify(doc,null,1)+"\n");

const byMod={},byKey=[0,0,0,0],byDiff={};
out.forEach(r=>{byMod[r.source]=(byMod[r.source]||0)+1;byKey[r.answer]++;byDiff[r.diff]=(byDiff[r.diff]||0)+1;});
console.log("wrote "+path.relative(ROOT,dest)+"  ("+out.length+" questions)");
console.log("per module:",JSON.stringify(byMod));
console.log("answer spread A/B/C/D:",byKey.map((c,i)=>"ABCD"[i]+":"+c).join(" "));
console.log("difficulty:",JSON.stringify(byDiff));
console.log("unique ids:",new Set(out.map(r=>r.id)).size+"/"+out.length);
