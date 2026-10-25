/* tools/_fix_tell_f306.js — destroy the length tell in far-f3-batch-06 by making option
   length uninformative. Each offender's correct text is kept verbatim; its 3 distractors
   are rewritten (still WRONG) so the correct option's length rank is DISTRIBUTED:
     pat "A" -> correct is the longest  (all distractors shorter)
     pat "B" -> correct is the shortest (all distractors longer)
     pat "M" -> correct is middle       (one distractor shorter, one longer)
   ~4 A, ~4 B, ~8 M  => ≈25% longest / ≈25% shortest across the patched set (chance level).
   The script ENFORCES the length relationship and aborts on any violation. */
"use strict";
const fs=require("fs"),path=require("path");
const JSONP=path.resolve(__dirname,"..","content","cpa-far","far-f3-batch-06.json");

// id -> { pat, d:[3 wrong distractors] }
const PATCH={
 "cpa-far-f3m1-217f6367":{pat:"A",d:["Trade accounts receivable from customers","Equity securities held for trading","A certificate of deposit maturing in nine months"]},
 "cpa-far-f3m1-b241be3d":{pat:"M",d:["A deposit in transit at the balance sheet date","An outstanding check the company wrote that has not yet cleared","A deposit the bank credited to the wrong customer account"]},
 "cpa-far-f3m1-48fd7f64":{pat:"B",d:["Recording bad debt expense for the full amount of the returned check","Reducing only the bank balance on the reconciliation, with no book entry","Deferring any entry until the customer has been contacted about payment"]},
 "cpa-far-f3m1-0be3da5b":{pat:"M",d:["Part of current cash and cash equivalents","A direct reduction of the related long-term bonds payable on the balance sheet","A current asset in every case despite the multi-year restriction"]},
 "cpa-far-f3m1-93090668":{pat:"A",d:["Disclosed only in the notes, with no balance sheet effect","Reported as a noncurrent investment","Included without distinction in cash and cash equivalents"]},
 "cpa-far-f3m1-6a3fd1ff":{pat:"M",d:["Recorded by the bank but not yet by the company","Received by the company but not yet deposited at the bank","Returned by the bank unpaid because of insufficient funds in the account"]},
 "cpa-far-f3m4-1b57927e":{pat:"B",d:["Bond is issued exactly at its par value, with no premium or discount","Stated coupon rate is greater than the prevailing market rate of interest","Prevailing market rate of interest on the bond happens to be zero"]},
 "cpa-far-f3m4-7ca87b5d":{pat:"M",d:["An expense recognized immediately at issuance","A separate asset amortized over the life of the debt","A direct reduction of additional paid-in capital within equity"]},
 "cpa-far-f3m4-191e70f0":{pat:"A",d:["Recorded entirely as a liability, with nothing assigned to equity","Allocated only if and when the warrants are exercised","Recorded entirely as equity until the bonds mature"]},
 "cpa-far-f3m4-70fb0711":{pat:"M",d:["The equipment's list price plus the note's face value","Zero, until cash payments are actually made","The total undiscounted face amount of the note payable over its full term"]},
 "cpa-far-f3m4-ccd8c907":{pat:"B",d:["Two separate components, with the conversion option recorded in equity","A derivative remeasured to fair value through earnings each period","Entirely within stockholders' equity until the bonds are converted"]},
 "cpa-far-f3m5-38a675dc":{pat:"M",d:["Operating leases only","Finance leases only","Neither type of lease, until the lessee actually makes the lease payments"]},
 "cpa-far-f3m5-0fb01b94":{pat:"A",d:["Lease term is less than 12 months","Asset reverts to the lessor at the end of the term","Present value of the payments is well below the asset's fair value"]},
 "cpa-far-f3m5-e94db782":{pat:"M",d:["No expense, only a reduction of the lease liability","Interest expense only, with no amortization recorded","Separate interest and amortization, which front-load the total lease expense"]},
 "cpa-far-f3m5-1749bf52":{pat:"B",d:["Short-term lease that is fully exempt from balance sheet recognition","Direct financing lease in every case, deferring all selling profit","Operating lease, with the underlying asset remaining on the lessor's books"]},
 "cpa-far-f3m5-ebd02c01":{pat:"M",d:["Recognized immediately in net income when they arise","Added directly to the projected benefit obligation","Not recognized in the financial statements until the plan is settled"]}
};
function djb2(s){let h=5381;for(let i=0;i<s.length;i++)h=((h<<5)+h+s.charCodeAt(i))>>>0;return h>>>0;}
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function shuf(arr,seed){const r=mulberry32(seed);const a=arr.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}

const doc=JSON.parse(fs.readFileSync(JSONP,"utf8"));
let patched=0,err=0;
doc.questions.forEach(q=>{const P=PATCH[q.id];if(!P)return;
  const c=q.choices[q.answer], C=c.length, dl=P.d.map(x=>x.length), mx=Math.max(...dl), mn=Math.min(...dl);
  let okPat = P.pat==="A"? mx<C : P.pat==="B"? mn>C : (mn<C&&mx>C);
  if(P.d.length!==3){console.log("arity "+q.id);err++;return;}
  if(P.d.indexOf(c)>=0||new Set(P.d).size!==3){console.log("dup/equal "+q.id);err++;return;}
  if(!okPat){console.log("PATTERN FAIL "+q.id+" pat="+P.pat+" C="+C+" distractors="+dl.join(","));err++;return;}
  const four=shuf([c,...P.d],djb2(q.id)); q.choices=four; q.answer=four.indexOf(c); patched++;
});
if(err){console.error("ABORT — "+err+" errors, no write");process.exit(1);}
fs.writeFileSync(JSONP,JSON.stringify(doc,null,1)+"\n");
console.log("patched "+patched+" (expected 16) — all length patterns enforced OK");
