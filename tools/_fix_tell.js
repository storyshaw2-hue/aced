/* tools/_fix_tell.js — reduce the "longest choice is the answer" tell.
   For each listed question, the THREE distractors are rewritten to be fuller and more
   parallel in length (at least one >= the correct answer), so length no longer signals
   the answer. The correct answer text is taken verbatim from the JSON and never edited,
   then the four choices are reshuffled (seeded) and the answer index recomputed.
   Run: node tools/_fix_tell.js   (rewrites content/cpa-far/*.json, then re-measures)
*/
"use strict";
const fs = require("fs"), path = require("path");
const dir = path.resolve(__dirname, "..", "content", "cpa-far");

// id -> three replacement distractors (wrong, plausible, parallel length). Correct kept from JSON.
const PATCH = {
  "cpa-far-f4m5-e4ad5808": ["Recognized for all volunteer hours at fair value, regardless of whether the services create a nonfinancial asset or require specialized skills","Never recognized as contribution revenue, even when the services require specialized professional skills","Recognized only when the donor formally requests recognition and supplies a written fair-value estimate"],
  "cpa-far-f4m5-6e880f73": ["Recognized for all volunteer hours at fair value, regardless of whether the services create a nonfinancial asset or require specialized skills","Never recognized as contribution revenue, even when the services require specialized professional skills","Recognized only when the donor formally requests recognition and supplies a written fair-value estimate"],
  "cpa-far-f4m5-9a1385a1": ["Recognized for all volunteer hours at fair value, regardless of whether the services create a nonfinancial asset or require specialized skills","Never recognized as contribution revenue, even when the services require specialized professional skills","Recognized only when the donor formally requests recognition and supplies a written fair-value estimate"],
  "cpa-far-f2m2-e1bb08c6": ["It avoids estimating uncollectible amounts and recognizes a loss only when a specific account actually defaults","It is simpler to apply because no estimate of uncollectible accounts is ever required","It is permitted only for income-tax reporting, not for financial-statement purposes"],
  "cpa-far-f2m2-166c7eff": ["Its face (maturity) amount, since a noninterest-bearing note carries no stated rate and therefore no discount","Zero until the note is collected, when the full amount is recorded as interest income","Its face amount reduced by a fixed ten-percent allowance for imputed interest"],
  "cpa-far-f2m2-3d5c4373": ["Only the credit losses already incurred and probable at the balance sheet date, under the old incurred-loss model","A fixed one percent of the outstanding receivable balance applied uniformly each period","Credit losses recognized only once an account becomes ninety days past due"],
  "cpa-far-f2m7-966c0e7d": ["Profit on sales, undistributed retained earnings, fixed manufacturing overhead costs, and interest paid to lenders during the year","Prepaid expenses, unearned revenue, fixed assets, and inventory","Accounts payable, unsecured debt, finance leases, and interest expense"],
  "cpa-far-f2m2-90333f86": ["A fixed percentage prescribed by GAAP for every class of trade receivable, applied uniformly across all periods","Only the losses probable and estimable at the balance sheet date, under the incurred-loss model","Actual write-offs incurred during the period, recognized when specific accounts default"],
  "cpa-far-f1m3-e895d68b": ["Whenever management formally decides to sell the component, regardless of whether the disposal has a major effect","Only when the disposed component had been operating at a loss before its disposal","Whenever any component of the entity is sold at any point during the fiscal year"],
  "cpa-far-f4m5-ba4438a4": ["Recorded as a fund liability of the governmental fund, just as it appears in the government-wide statements","Recorded as fund revenue in the period the debt proceeds are received","Netted against capital outlay expenditures in the fund statements"],
  "cpa-far-f1m3-44ef4cd0": ["Through current-year depreciation expense only, recognizing the entire omitted amount in Year 3 with no restatement","Prospectively over the asset's remaining useful life beginning in Year 3","As a change in accounting estimate recognized entirely in Year 3 earnings"],
  "cpa-far-f1m1-16c00f22": ["Be any sale of a long-lived asset, regardless of whether it represents a strategic shift in operations","Result in a realized loss on the disposal of the component","Exceed ten percent of the entity's total assets at year end"],
  "cpa-far-f2m6-39b0641e": ["Goodwill is recorded for the excess paid above the book value of the partnership interest acquired","The excess is recognized immediately as income by the partnership","The excess is recorded as a liability owed to the incoming partner"],
  "cpa-far-f1m2-3c20bf29": ["An indefinite period extending into the foreseeable future, with no fixed assessment horizon","Five years after the balance sheet date","The length of the entity's normal operating cycle"],
  "cpa-far-f1m4-586a9c69": ["Ignored entirely because the sale is treated as a noncash transaction disclosed only in the notes","Reported as an inflow within financing activities","Added to net income within operating activities"],
  "cpa-far-f4m5-37727fce": ["Deferred entirely until the pledged cash is received, since multi-year pledges are not yet earned","Recognized only as each annual installment of the pledge arrives","Recorded as a conditional promise to give"],
  "cpa-far-f4m2-d21f94a3": ["Net income divided by the number of common shares outstanding at the end of the reporting period","Net income divided by the entity's total assets at year end","(Net income plus interest) divided by diluted shares outstanding"],
  "cpa-far-f4m4-edc92e55": ["The deferred tax asset is virtually certain to be realized in full in future periods","The enacted statutory tax rate changes during the reporting period","The company reports any net operating loss for the year"],
  "cpa-far-f2m5-d898fd5a": ["The asset's current fair value measured using market-participant assumptions","The asset's current replacement cost","The asset's original acquisition cost"],
  "cpa-far-f4m4-79107241": ["Only the current taxes payable for the year, with deferred amounts disclosed separately in the notes","Only the change in the deferred tax accounts during the year","The cash taxes actually paid to the authorities during the year"],
  "cpa-far-f2m1-022a2154": ["The entity retains legal title to the goods until the customer pays the full contract price","Payment is collected in installments over the life of the contract","The contract term spans more than one annual reporting period"],
  "cpa-far-f1m3-3f48ee69": ["Fair value of the asset received, with the full gain or loss recognized immediately in earnings","The acquirer's estimated replacement cost for the asset","Zero, until cash consideration is actually paid"],
  "cpa-far-f2m4-a7b391bc": ["No interest at all, because all borrowing costs incurred during construction must be expensed as a period cost","All interest incurred by the company during the entire construction period","Only interest on debt that was used to retire other outstanding obligations"],
  "cpa-far-f1m2-fea56db1": ["The nature of the relationship between the related parties that entered into the transactions","A description of the transactions, including their terms and manner of settlement","The dollar amounts of the transactions for each period presented"],
  "cpa-far-f3m5-3b7ca3b4": ["Rent expense equal to the cash lease payment made during the period, on a straight-line basis","Interest expense on the lease liability only, with no amortization","A single straight-line lease expense, as under an operating lease"],
  "cpa-far-f2m6-c49fecf4": ["No salary or interest allowances are granted in any year that partnership net income is insufficient","Income is divided equally among the partners, regardless of the partnership agreement","Allowances are prorated down to the amount of income actually available"],
  "cpa-far-f2m5-f599c5f5": ["Its fair value measured using market-participant assumptions at the test date","Its current replacement cost in the asset's existing condition","The present value of the discounted future cash flows from the asset"],
  "cpa-far-f2m5-bae14fb6": ["Amortized on a straight-line basis over a ten-year statutory period","Amortized over a maximum allowable period of forty years","Expensed in full immediately in the period it is acquired"],
  "cpa-far-f4m4-193d7d92": ["The current year's average effective tax rate computed from the rate reconciliation","A flat twenty-one percent, regardless of when the difference reverses","The statutory rate that was in effect when the related asset was acquired"],
  "cpa-far-f1m4-ebf24d36": ["Subtract depreciation expense and add an increase in accounts receivable to net income","Add an increase in accounts receivable directly to reported net income","Subtract a decrease in inventory from net income for the period"],
  "cpa-far-f4m1-8874fdff": ["Reducing common stock at its par value and adjusting paid-in capital accordingly","Recognizing a gain or loss on the reacquisition in current net income","Increasing retained earnings by the cost of the reacquired shares"],
  "cpa-far-f4m1-7d277ba3": ["Recorded as a liability on the balance sheet at the end of each undeclared year","Lost permanently once the year of nondeclaration has passed","Recognized as an expense in the period they would normally be paid"]
};

function hash8(s){let h=5381;s=String(s||"");for(let i=0;i<s.length;i++)h=((h<<5)+h+s.charCodeAt(i))>>>0;return h>>>0;}
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function shuffle(arr,seed){const a=arr.slice(),r=mulberry32(seed);for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));const t=a[i];a[i]=a[j];a[j]=t;}return a;}
function nc(s){return String(s).toLowerCase().replace(/\s+/g," ").trim();}

const files = fs.readdirSync(dir).filter(f => f.endsWith(".json") && !f.startsWith("_"));
const byId = {};
const docs = {};
files.forEach(f => { const d = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")); docs[f] = d; (d.questions || []).forEach(q => byId[q.id] = { f, q }); });

let applied = 0, skipped = [];
const dirty = new Set();
Object.keys(PATCH).forEach(id => {
  const hit = byId[id];
  if (!hit) { skipped.push(id + " (not found)"); return; }
  const q = hit.q;
  const correct = q.choices[q.answer];                 // taken verbatim — never edited
  const four = [correct].concat(PATCH[id]);
  if (new Set(four.map(nc)).size !== 4) { skipped.push(id + " (would create duplicate choice)"); return; }
  const shuffled = shuffle(four, hash8(q.q));
  q.choices = shuffled;
  q.answer = shuffled.indexOf(correct);
  dirty.add(hit.f); applied++;
});
dirty.forEach(f => fs.writeFileSync(path.join(dir, f), JSON.stringify(docs[f], null, 1) + "\n"));

// re-measure the tell across ALL content
let tot = 0, longest = 0;
Object.values(docs).forEach(d => (d.questions || []).forEach(q => {
  if (!Array.isArray(q.choices) || q.choices.length !== 4) return;
  const L = q.choices.map(c => String(c).length), mx = Math.max.apply(null, L);
  tot++; if (L[q.answer] === mx && L.filter(x => x === mx).length === 1) longest++;
}));
console.log("patched: " + applied + " | skipped: " + skipped.length);
skipped.forEach(s => console.log("  skip " + s));
console.log("rewrote banks: " + [...dirty].join(", "));
console.log("longest-is-answer now: " + longest + "/" + tot + " = " + (100 * longest / tot).toFixed(1) + "% (threshold 40%)");
