/* tools/_build_f3_batch.js — author + compile the F3 batch to canonical JSON.
   Run: node tools/_build_f3_batch.js  ->  content/cpa-far/far-f3-batch-06.json
   Same conventions as the F1 builder: choices deterministically shuffled (seeded by
   the stem hash) to balance the key + decorrelate length; IDs via the shared djb2 hash;
   `reviewed` omitted here; set reviewed:true on items to surface the badge. */
"use strict";
const fs = require("fs"), path = require("path");
const ROOT = path.resolve(__dirname, "..");

// answer = index of the correct choice in the AUTHORED order (pre-shuffle).
const Q = [
/* ===== F3.M1 — Cash & Equivalents (classification, bank reconciliations, restricted cash) ===== */
{source:"F3.M1",diff:"easy",ref:"ASC 305",
 q:"Which item is reported within 'cash and cash equivalents' on the balance sheet?",
 choices:["Balances in a money market fund and a demand checking account","A certificate of deposit maturing in nine months","Trade accounts receivable from customers","Equity securities held for trading"],answer:0,
 explain:"Cash and cash equivalents include unrestricted demand deposits and highly liquid investments with original maturities of three months or less, such as money market funds. A nine-month CD, receivables, and trading securities do not qualify."},
{source:"F3.M1",diff:"medium",ref:"ASC 305",
 q:"Per the bank statement the balance is $18,400. Deposits in transit are $3,200, outstanding checks total $4,500, and the bank erroneously charged the company $300 for another depositor's check. The correct cash balance is:",
 choices:["$17,400","$16,800","$18,000","$17,100"],answer:0,
 explain:"Adjust the bank balance: add deposits in transit (+3,200), subtract outstanding checks (-4,500), and add back the bank's $300 error: 18,400 + 3,200 - 4,500 + 300 = 17,400."},
{source:"F3.M1",diff:"medium",ref:"ASC 305",
 q:"In a bank reconciliation, which item is an adjustment to the company's BOOK balance rather than the bank balance?",
 choices:["A bank service charge the company has not yet recorded","A deposit in transit at the balance sheet date","An outstanding check that has not cleared","A deposit the bank credited to the wrong account"],answer:0,
 explain:"Items the bank has processed but the company has not yet recorded - service charges, NSF checks, interest earned, note collections - adjust the book balance. Deposits in transit, outstanding checks, and bank errors adjust the bank balance."},
{source:"F3.M1",diff:"medium",ref:"ASC 305",
 q:"A customer's check that was previously deposited is returned by the bank marked NSF. On the company's books this requires:",
 choices:["Reducing cash and reinstating the receivable from the customer","Reducing the bank balance only, with no entry on the books","Recording bad debt expense for the full amount of the check","No entry until the customer has been contacted"],answer:0,
 explain:"An NSF check means the deposit did not clear, so the company reduces cash and reinstates the customer receivable. It is a book-side reconciling item and is not automatically a bad debt."},
{source:"F3.M1",diff:"medium",ref:"ASC 210",
 q:"Cash restricted for the retirement of bonds due in three years should be classified as:",
 choices:["A noncurrent asset, reported separately from cash and cash equivalents","Part of current cash and cash equivalents","A direct reduction of the related long-term debt","A current asset, regardless of the restriction period"],answer:0,
 explain:"Cash restricted for a noncurrent purpose, such as a sinking fund to retire bonds due in three years, is reported as a noncurrent asset separate from unrestricted cash and is not netted against the debt."},
{source:"F3.M1",diff:"medium",ref:"ASC 210",
 q:"A legally restricted compensating balance maintained against a short-term loan should be:",
 choices:["Reported separately as a current asset, apart from unrestricted cash","Included without distinction in cash and cash equivalents","Disclosed only in the notes with no balance sheet effect","Reported as a noncurrent investment"],answer:0,
 explain:"A legally restricted compensating balance tied to a short-term borrowing is reported separately as a current restricted-cash asset, distinct from unrestricted cash and cash equivalents."},
{source:"F3.M1",diff:"easy",ref:"ASC 305",
 q:"Outstanding checks in a bank reconciliation are checks that have been:",
 choices:["Written and recorded by the company but not yet cleared by the bank","Received by the company but not yet deposited","Recorded by the bank but not yet by the company","Returned by the bank for insufficient funds"],answer:0,
 explain:"Outstanding checks have been issued and recorded by the company but have not yet cleared the bank, so they are subtracted from the bank balance in a reconciliation."},
{source:"F3.M1",diff:"hard",ref:"ASC 305",
 q:"A company's general ledger cash balance is $10,500 and its bank statement shows $9,950. Deposits in transit are $2,500, outstanding checks $1,200, the bank collected a $1,000 note on the company's behalf (unrecorded), and there is an unrecorded $250 service charge. The reconciled cash balance is:",
 choices:["$11,250","$10,500","$9,950","$12,750"],answer:0,
 explain:"Both sides reconcile to the same figure. Bank side: 9,950 + 2,500 - 1,200 = 11,250. Book side: 10,500 + 1,000 note collected - 250 service charge = 11,250."},

/* ===== F3.M4 — Bonds & Long-Term Debt ===== */
{source:"F3.M4",diff:"easy",ref:"ASC 470",
 q:"A bond is issued at a discount when the:",
 choices:["Stated (coupon) rate is less than the market (effective) rate","Stated rate is greater than the market rate","Bond is issued exactly at its par value","Market rate of interest is zero"],answer:0,
 explain:"When a bond's stated rate is below the market rate investors require, it sells for less than face value - at a discount. When the stated rate exceeds the market rate, it sells at a premium."},
{source:"F3.M4",diff:"medium",ref:"ASC 835",
 q:"Bonds with a $500,000 face amount and a 7% stated rate were issued at 96 to yield 8%, with interest paid annually. Under the effective interest method, the first year's interest expense is:",
 choices:["$38,400","$35,000","$40,000","$33,600"],answer:0,
 explain:"Interest expense = carrying amount x market rate = (500,000 x 0.96) x 8% = 480,000 x 8% = 38,400. Cash paid is 500,000 x 7% = 35,000; the 3,400 difference amortizes the discount."},
{source:"F3.M4",diff:"medium",ref:"ASC 835",
 q:"$600,000 of bonds with a 9% stated rate were issued to yield 8% (interest paid annually), producing a $620,000 carrying amount. The first-year interest expense under the effective interest method is:",
 choices:["$49,600","$54,000","$48,000","$55,800"],answer:0,
 explain:"For a premium bond, interest expense = carrying amount x market rate = 620,000 x 8% = 49,600. Cash paid is 600,000 x 9% = 54,000; the 4,400 excess amortizes the premium and reduces the carrying amount."},
{source:"F3.M4",diff:"medium",ref:"ASC 835",
 q:"As a bond issued at a premium approaches maturity under the effective interest method, periodic interest expense:",
 choices:["Decreases each period as the carrying amount declines","Increases each period as the carrying amount declines","Remains constant each period","Equals the cash interest paid each period"],answer:0,
 explain:"With a premium bond the carrying amount falls toward face value as the premium amortizes, so interest expense (carrying amount x market rate) decreases each period. For a discount bond, interest expense increases over time."},
{source:"F3.M4",diff:"hard",ref:"ASC 835",
 q:"A 3-year, $100,000 bond pays 6% annually and is priced to yield 8%. Using a PV of $1 factor of 0.7938 and a PV of an ordinary annuity factor of 2.5771 (8%, 3 years), the issue price is approximately:",
 choices:["$94,843","$100,000","$105,154","$79,380"],answer:0,
 explain:"Issue price = PV of principal + PV of interest = (100,000 x 0.7938) + (6,000 x 2.5771) = 79,380 + 15,463 = 94,843. A 6% coupon priced to yield 8% sells at a discount."},
{source:"F3.M4",diff:"hard",ref:"ASC 470-50",
 q:"Bonds with a carrying amount of $515,000 (face $500,000) were retired early at a call price of 102. The result on extinguishment is a:",
 choices:["$5,000 gain","$5,000 loss","$15,000 gain","$10,000 loss"],answer:0,
 explain:"Gain or loss = carrying amount - reacquisition price = 515,000 - (500,000 x 1.02) = 515,000 - 510,000 = 5,000. Paying less than the carrying amount produces a gain."},
{source:"F3.M4",diff:"medium",ref:"ASC 835-30",
 q:"Under U.S. GAAP, debt issuance costs are reported as:",
 choices:["A direct reduction of the carrying amount of the related debt","A separate asset amortized over the life of the debt","An expense recognized immediately at issuance","A reduction of additional paid-in capital"],answer:0,
 explain:"Debt issuance costs are presented as a direct deduction from the carrying amount of the related debt (like a discount) and amortized to interest expense using the effective interest method."},
{source:"F3.M4",diff:"medium",ref:"ASC 470-20",
 q:"When bonds are issued with detachable stock warrants, the issuance proceeds are:",
 choices:["Allocated between the bonds and the warrants based on their relative fair values","Recorded entirely as a liability, with nothing assigned to equity","Recorded entirely as equity until the bonds mature","Allocated only if and when the warrants are exercised"],answer:0,
 explain:"Detachable warrants have separate value, so proceeds are allocated between the debt and the warrants (paid-in capital) based on relative fair values. The amount assigned to the warrants increases equity."},
{source:"F3.M4",diff:"medium",ref:"ASC 835",
 q:"On April 1, a company issued $200,000 of 12% bonds dated January 1 that pay interest semiannually on June 30 and December 31. The cash collected at issuance (par plus accrued interest) is:",
 choices:["$206,000","$200,000","$212,000","$194,000"],answer:0,
 explain:"Bonds issued between interest dates sell at price plus interest accrued since the last interest date: 200,000 x 12% x 3/12 = 6,000 accrued, so cash collected = 200,000 + 6,000 = 206,000. The accrued portion is returned at the next interest payment."},
{source:"F3.M4",diff:"medium",ref:"ASC 835-30",
 q:"A long-term note payable bearing no stated interest is issued in exchange for equipment. It should be recorded at:",
 choices:["The present value of the future payments, using an imputed market rate","The total undiscounted face amount of the note","The equipment's list price plus the note's face value","Zero, until cash payments are actually made"],answer:0,
 explain:"A noninterest-bearing (or unreasonably low-rate) note is recorded at the present value of the payments using an imputed market rate; the difference between face and present value is a discount amortized to interest expense."},
{source:"F3.M4",diff:"easy",ref:"ASC 470",
 q:"Whether a bond was originally issued at a premium or a discount, its carrying amount at maturity equals the:",
 choices:["Face (par) amount","Original issue price","Face amount plus unamortized premium","Face amount minus unamortized discount"],answer:0,
 explain:"Premium and discount amortize fully over the bond's life, so the carrying amount converges to the face amount at maturity, when par is repaid."},
{source:"F3.M4",diff:"hard",ref:"ASC 470-20",
 q:"Under current U.S. GAAP (after ASU 2020-06), an issuer generally accounts for convertible bonds as:",
 choices:["A single liability, without separating a component into equity","Two components, with the conversion option recorded in equity","Entirely within equity until the bonds are converted","A derivative remeasured to fair value through earnings"],answer:0,
 explain:"ASU 2020-06 eliminated the cash conversion and beneficial conversion feature models, so most convertible debt is now reported as a single liability. Splitting out an equity component is the former U.S. GAAP approach (and the IFRS approach)."},

/* ===== F3.M5 — Leases & Pensions ===== */
{source:"F3.M5",diff:"easy",ref:"ASC 842",
 q:"Under ASC 842, a lessee recognizes a right-of-use asset and a lease liability for:",
 choices:["Both finance and operating leases, subject to a short-term exception","Finance leases only","Operating leases only","Neither, until lease payments are actually made"],answer:0,
 explain:"ASC 842 requires lessees to recognize a right-of-use asset and a lease liability for both finance and operating leases. A short-term lease of 12 months or less may be exempted."},
{source:"F3.M5",diff:"medium",ref:"ASC 842",
 q:"A lessee classifies a lease as a finance lease if, among other criteria, the:",
 choices:["Lease term is for the major part of the asset's remaining economic life","Lease term is less than 12 months","Asset reverts to the lessor at the end of the term","Present value of the payments is well below the asset's fair value"],answer:0,
 explain:"A finance lease meets any one of the ASC 842 criteria: ownership transfer, a purchase option reasonably certain to be exercised, a term covering the major part of economic life, payments whose PV is substantially all of fair value, or a specialized asset with no alternative use."},
{source:"F3.M5",diff:"medium",ref:"ASC 842",
 q:"For an operating lease under ASC 842, the lessee recognizes:",
 choices:["A single lease expense on a straight-line basis over the lease term","Separate interest and amortization, front-loading total expense","Interest expense only, with no amortization","No expense, only a reduction of the lease liability"],answer:0,
 explain:"An operating lease produces a single straight-line lease expense. A finance lease instead reports interest on the liability plus amortization of the right-of-use asset, which front-loads total expense."},
{source:"F3.M5",diff:"hard",ref:"ASC 842",
 q:"A 4-year lease requires $20,000 payments at each year end; the lessee's incremental borrowing rate is 6% and the PV of an ordinary annuity of $1 for 4 years at 6% is 3.4651. The initial lease liability is:",
 choices:["$69,302","$80,000","$20,000","$73,460"],answer:0,
 explain:"The initial lease liability is the present value of the lease payments: 20,000 x 3.4651 = 69,302. The right-of-use asset begins at the same amount, adjusted for items such as prepaid rent or initial direct costs."},
{source:"F3.M5",diff:"medium",ref:"ASC 842",
 q:"In the first year of a finance lease, the lessee's income statement reflects:",
 choices:["Amortization of the right-of-use asset plus interest on the lease liability","A single straight-line lease expense","Interest expense only","Rent expense equal to the cash payment"],answer:0,
 explain:"A finance lease is presented like a financed purchase: the lessee records amortization of the right-of-use asset and interest expense on the lease liability separately, producing higher total expense in the early years."},
{source:"F3.M5",diff:"easy",ref:"ASC 715",
 q:"In a defined contribution pension plan, the employer's obligation each period is:",
 choices:["Limited to the contribution promised for that period","To fund a specified future benefit regardless of plan performance","To guarantee a fixed retirement income to each employee","Measured by the projected benefit obligation"],answer:0,
 explain:"In a defined contribution plan the employer owes only the agreed periodic contribution, and investment risk falls on the employee. A defined benefit plan promises a specified future benefit, so the employer bears the funding and investment risk."},
{source:"F3.M5",diff:"hard",ref:"ASC 715",
 q:"A defined benefit plan reports service cost $90,000, interest cost $40,000, expected return on plan assets $30,000, amortization of prior service cost $10,000, and amortization of a net loss $5,000. Net periodic pension cost is:",
 choices:["$115,000","$175,000","$105,000","$95,000"],answer:0,
 explain:"Net periodic pension cost = service cost + interest cost - expected return + amortization of prior service cost + amortization of net loss = 90,000 + 40,000 - 30,000 + 10,000 + 5,000 = 115,000. The expected return reduces the cost."},
{source:"F3.M5",diff:"medium",ref:"ASC 715",
 q:"At year end the projected benefit obligation is $820,000 and the fair value of plan assets is $760,000. The plan's funded status reported on the balance sheet is a:",
 choices:["$60,000 net pension liability","$60,000 net pension asset","$820,000 net pension liability","$760,000 net pension asset"],answer:0,
 explain:"Funded status = fair value of plan assets - PBO = 760,000 - 820,000 = -60,000. A negative funded status means the plan is underfunded, and a $60,000 net pension liability is reported."},
{source:"F3.M5",diff:"medium",ref:"ASC 715",
 q:"The projected benefit obligation (PBO) measures the present value of benefits attributed to service to date based on:",
 choices:["Expected future salary levels","Current salary levels only","Vested benefits only","The fair value of plan assets"],answer:0,
 explain:"The PBO incorporates expected future salary increases. The accumulated benefit obligation uses current salaries, and the vested benefit obligation reflects only vested benefits."},
{source:"F3.M5",diff:"medium",ref:"ASC 842",
 q:"From the lessor's perspective, a lease that transfers control of the underlying asset and meets a classification criterion is a:",
 choices:["Sales-type lease, recognizing any selling profit at commencement","Operating lease, with the asset remaining on the lessor's books","Direct financing lease in every case","Short-term lease exempt from recognition"],answer:0,
 explain:"When a lease meets a finance-type criterion from the lessor's side, it is a sales-type lease and any selling profit is recognized at commencement. A direct financing lease arises in narrower cases and defers selling profit."},
{source:"F3.M5",diff:"hard",ref:"ASC 715",
 q:"Net actuarial gains and losses not yet recognized in net periodic pension cost are:",
 choices:["Reported in accumulated other comprehensive income until amortized","Recognized immediately in net income in the period they arise","Added directly to the projected benefit obligation","Not recognized in the financial statements at all"],answer:0,
 explain:"Unrecognized net gains and losses (and prior service cost) are recorded in OCI and accumulate in AOCI, then amortized into net periodic pension cost over time, for example under the corridor approach."}
];

/* ---- build (identical conventions to tools/_build_f1_batch.js) ---- */
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
const doc={$schema:"aced-question-bank/v1",pack:"cpa-far",section:"FAR",bank:"far-f3-batch-06",generated:false,count:out.length,questions:out};
const dest=path.join(ROOT,"content","cpa-far","far-f3-batch-06.json");
fs.mkdirSync(path.dirname(dest),{recursive:true});
fs.writeFileSync(dest,JSON.stringify(doc,null,1)+"\n");

const byMod={},byKey=[0,0,0,0],byDiff={};
out.forEach(r=>{byMod[r.source]=(byMod[r.source]||0)+1;byKey[r.answer]++;byDiff[r.diff]=(byDiff[r.diff]||0)+1;});
console.log("wrote "+path.relative(ROOT,dest)+"  ("+out.length+" questions)");
console.log("per module:",JSON.stringify(byMod));
console.log("answer spread A/B/C/D:",byKey.map((c,i)=>"ABCD"[i]+":"+c).join(" "));
console.log("difficulty:",JSON.stringify(byDiff));
console.log("unique ids:",new Set(out.map(r=>r.id)).size+"/"+out.length);
