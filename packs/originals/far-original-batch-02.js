/* =============================================================================
   ACED — far-bank-batch3.js   (ORIGINAL CONTENT, append-safe)
   -----------------------------------------------------------------------------
   20 original FAR MCQs authored from the GAAP rules and the pattern spec in
   STYLE_REFERENCE_FAR.md / SILENT_DEFAULTS.md / the F1-F3 & F5-F6 pattern files.
   No exam-vendor question text is reproduced — stems, numbers, choices and
   explanations are written from scratch.

   SCHEMA (matches study.html):
     { q, choices:[4 strings], answer:<0-based index>, explain, source:<moduleKey>, diff }
     - source keys map to packs/cpa-far.js MODULES (F1.M1 … F4.M4)
     - diff is "easy" | "medium" | "hard"  (re-map if your files use 1/2/3)

   PATTERNS APPLIED
     - Silent-default family (items 1-6): preferred noncumulative, treasury cost
       method, lease implicit-rate, salvage=0, R&D expensed, cash-equivalent 90-day.
     - Engineered-error distractors: every wrong choice is one specific named
       mistake (wrong input, stopped early, wrong bucket, wrong period/rate,
       sign flip). $0 used as a *live* answer where a no-recognition gate exists.
     - ~Balanced key: A x5, B x5, C x5, D x5.
     - This batch runs calc-heavy (~70%); next batch will skew conceptual to
       settle the bank near the ~50/50 the real bank shows.

   *** Drafts. Verify each against current ASC before shipping (your call as CPA).
   ============================================================================= */
window.ACED_QUESTIONS = (window.ACED_QUESTIONS || []).concat([

  /* 1 — EPS, preferred NONCUMULATIVE by default (A) ------------------------- */
  { source:"F4.M2", diff:"medium",
    q:"Orr Company, a calendar-year corporation, reported net income of $500,000 for Year 1. Throughout Year 1 it had 100,000 shares of common stock and 10,000 shares of 6%, $100 par preferred stock outstanding. No dividends were declared in Year 1. What is Year 1 basic earnings per share?",
    // preferred is silent on 'cumulative' -> noncumulative -> undeclared dividends are NOT subtracted
    choices:["$5.00","$4.40","$5.60","$4.70"], answer:0,
    explain:"Preferred stock is noncumulative unless the stem says 'cumulative.' For noncumulative preferred, dividends reduce the EPS numerator only if declared; none were declared, so basic EPS = 500,000 / 100,000 = $5.00. $4.40 subtracts the $60,000 annual preferred dividend as if it were cumulative. $5.60 adds it (wrong direction). $4.70 subtracts only a partial dividend." },

  /* 2 — Treasury stock, COST method, reissue below cost (B) ----------------- */
  { source:"F4.M1", diff:"medium",
    q:"Pell Corporation accounts for treasury stock under the cost method. It reissued 400 treasury shares that had cost $30 per share for $22 per share. Immediately before the reissuance, additional paid-in capital from treasury stock had a $2,000 balance. By what amount does this reissuance reduce retained earnings?",
    // cost 400x30=12,000; proceeds 8,800; shortfall 3,200; APIC-TS absorbs 2,000; remainder 1,200 -> RE
    choices:["$3,200","$1,200","$0","$2,000"], answer:1,
    explain:"Cost method is the default. Reissuing below cost creates a $3,200 shortfall (12,000 cost − 8,800 proceeds) that reduces APIC–treasury stock first ($2,000), with the remaining $1,200 charged to retained earnings — never to income. $3,200 ignores the APIC–T/S balance. $0 wrongly books the loss to the income statement. $2,000 is only the APIC–T/S portion." },

  /* 3 — Lease discount rate, implicit determinable (C) ---------------------- */
  { source:"F3.M5", diff:"easy",
    q:"Sten Company, a lessee, enters a five-year equipment lease. The rate implicit in the lease is readily determinable and equals 6%. Sten's incremental borrowing rate is 8%. Sten is not eligible for any private-company elections. At which rate should Sten discount the payments to measure the lease liability?",
    choices:["8%, the incremental borrowing rate","7%, the average of the two rates","6%, the rate implicit in the lease","A risk-free rate for a comparable term"], answer:2,
    explain:"The lessee discount-rate hierarchy is: rate implicit in the lease (if determinable) → incremental borrowing rate → risk-free rate (private-company election). Because the implicit rate is determinable, Sten uses 6%. The IBR is only a fallback, not a choice. Averaging is never permitted. The risk-free election is unavailable here and applies only when the implicit rate is not determinable." },

  /* 4 — Depreciation, salvage = 0 default + partial year (D) ---------------- */
  { source:"F2.M4", diff:"medium",
    q:"Dax Company purchased equipment for $120,000 on October 1, Year 1. The equipment has a four-year useful life and is depreciated straight-line. The reporting period ends December 31. What is depreciation expense for Year 1?",
    // salvage silent -> 0; annual 30,000; Oct 1 -> 3 months -> 7,500
    choices:["$30,000","$22,500","$10,000","$7,500"], answer:3,
    explain:"Salvage value is assumed to be zero when not stated, so the annual straight-line charge is 120,000 / 4 = $30,000. The asset was held only three months in Year 1 (Oct 1–Dec 31): 30,000 × 3/12 = $7,500. $30,000 ignores the partial period. $22,500 uses nine months (counts in the wrong direction). $10,000 miscounts the partial period as four months." },

  /* 5 — R&D expensed; special-purpose equipment (A) ------------------------- */
  { source:"F2.M5", diff:"hard",
    q:"Quill Company incurred the following during Year 1 on a project to develop a new product: research staff salaries $400,000; equipment purchased solely for this project with no alternative future use $250,000; and routine quality-control testing of existing products $60,000. What amount should Quill expense as research and development for Year 1?",
    // R&D = 400,000 + 250,000 (no alt use -> full cost is R&D); QC excluded
    choices:["$650,000","$400,000","$710,000","$460,000"], answer:0,
    explain:"Under U.S. GAAP, R&D is expensed as incurred. Equipment with no alternative future use is expensed in full as R&D (only equipment with alternative future use is capitalized and depreciated). Routine quality control is a production cost, not R&D. R&D = 400,000 + 250,000 = $650,000. $400,000 wrongly capitalizes the special-purpose equipment. $710,000 includes quality control. $460,000 makes both errors." },

  /* 6 — Cash equivalents, ORIGINAL maturity <= 90 days (B) ------------------ */
  { source:"F3.M1", diff:"medium",
    q:"At December 31, Year 1, Brae Company held: currency on hand $10,000; a Treasury bill purchased November 1, Year 1 maturing January 30, Year 2 (original maturity 90 days) $50,000; a Treasury bill purchased six months earlier with a six-month original maturity, now one month from maturity $40,000; and a 90-day certificate of deposit purchased in December $20,000. What amount should Brae report as cash and cash equivalents?",
    // cash equiv status uses ORIGINAL maturity -> 40,000 excluded; 10+50+20 = 80,000
    choices:["$120,000","$80,000","$60,000","$10,000"], answer:1,
    explain:"A cash equivalent must have an original maturity of three months or less from the date of purchase. The $40,000 bill had a six-month original maturity, so it is not a cash equivalent even though only one month remains. Cash and cash equivalents = 10,000 + 50,000 + 20,000 = $80,000. $120,000 uses remaining maturity. $60,000 wrongly excludes the qualifying 90-day CD. $10,000 counts currency only." },

  /* 7 — Revenue, variable-consideration CONSTRAINT (C) ---------------------- */
  { source:"F2.M1", diff:"medium",
    q:"Vance Company contracts to build equipment for a fixed price of $500,000 plus a $50,000 bonus if completed by a target date. Vance concludes it is not highly probable that a significant reversal of the bonus will not occur. What transaction price should Vance use?",
    choices:["$550,000","$525,000","$500,000","$450,000"], answer:2,
    explain:"Variable consideration is included only to the extent it is highly probable that a significant reversal will not occur (the constraint). The bonus fails that test, so it is excluded: transaction price = $500,000. $550,000 ignores the constraint. $525,000 includes half. $450,000 wrongly reduces the fixed price." },

  /* 8 — Revenue, principal vs AGENT (net) (D) ------------------------------- */
  { source:"F2.M1", diff:"medium",
    q:"Mott operates a platform that arranges services performed by independent providers. Mott does not control the services before they transfer to customers. During Year 1, customers paid $100,000; Mott remitted $85,000 to providers and retained $15,000. What amount of revenue should Mott recognize?",
    choices:["$100,000","$85,000","$115,000","$15,000"], answer:3,
    explain:"An entity that arranges for another party to provide goods or services, and does not control them before transfer, is an agent and recognizes revenue net of amounts paid to the provider: $15,000. $100,000 treats Mott as a principal (gross). $85,000 is the providers' share. $115,000 double-counts." },

  /* 9 — Bonds, EFFECTIVE-INTEREST expense by default (A) -------------------- */
  { source:"F3.M4", diff:"hard",
    q:"Pard Company issued $500,000 of five-year, 6% bonds paying interest semiannually. The bonds were issued for $463,202 to yield 8% compounded semiannually. The bond agreement does not specify an amortization method. What is interest expense for the first six-month interest period?",
    // effective interest default: carrying 463,202 x 4% = 18,528
    choices:["$18,528","$15,000","$20,000","$37,056"], answer:0,
    explain:"The effective-interest method is the default. Interest expense = carrying amount × semiannual yield = 463,202 × 4% = $18,528. $15,000 is the cash coupon (500,000 × 3%), which ignores amortization. $20,000 applies the yield to face value instead of carrying amount. $37,056 uses the annual rate for a six-month period." },

  /* 10 — Leases, initial liability at IMPLICIT rate (B) --------------------- */
  { source:"F3.M5", diff:"hard",
    q:"Crane Company, a lessee, signs a five-year lease requiring payments of $50,000 at the end of each year. The rate implicit in the lease is determinable and is 6%; Crane's incremental borrowing rate is 8%. The present value of an ordinary annuity of $1 for five periods is 4.2124 at 6% and 3.9927 at 8%. What amount should Crane record as the initial lease liability?",
    // implicit determinable -> 6%: 50,000 x 4.2124 = 210,620
    choices:["$199,635","$210,620","$223,257","$250,000"], answer:1,
    explain:"Discount at the implicit rate when it is determinable: 50,000 × 4.2124 = $210,620. $199,635 uses the IBR (50,000 × 3.9927), a fallback only. $223,257 treats the payments as an annuity due. $250,000 fails to discount." },

  /* 11 — Inventory LCNRV for FIFO (C) --------------------------------------- */
  { source:"F2.M3", diff:"medium",
    q:"Tine Company uses FIFO. At year-end it holds 1,000 units of a product with a unit cost of $48. The product sells for $60 per unit; estimated costs to complete are $12 per unit and costs to sell are $3 per unit. At what amount should the inventory be reported?",
    // NRV = 60 - 12 - 3 = 45 < cost 48 -> 45,000
    choices:["$48,000","$57,000","$45,000","$60,000"], answer:2,
    explain:"Non-LIFO inventory is measured at the lower of cost and net realizable value. NRV = 60 − 12 − 3 = $45 per unit, which is below the $48 cost, so inventory is written down to 1,000 × 45 = $45,000. $48,000 keeps cost (no write-down). $57,000 deducts only the selling cost and forgets the completion cost. $60,000 uses the selling price." },

  /* 12 — Inventory error cascade (D) ---------------------------------------- */
  { source:"F2.M3", diff:"medium",
    q:"Lure Company overstated its December 31, Year 1 ending inventory by $20,000. The error is discovered in Year 3. Ignoring income taxes, what is the effect on net income for Year 1 and Year 2?",
    choices:["Overstated in both Year 1 and Year 2","Understated in Year 1; overstated in Year 2","No effect on either year","Overstated in Year 1; understated in Year 2"], answer:3,
    explain:"Overstated ending inventory understates cost of goods sold, so Year 1 net income is overstated. That ending balance becomes Year 2 beginning inventory, overstating Year 2 COGS and understating Year 2 net income — the error counterbalances over two years. 'Both overstated' ignores the reversal; the second option reverses the direction; 'no effect' ignores the impact entirely." },

  /* 13 — Equity-method roll-forward (A) ------------------------------------- */
  { source:"F2.M6", diff:"medium",
    q:"On January 1, Year 1, Saxe Company acquired 30% of the voting common stock of Vee Company for $400,000, giving Saxe significant influence. During Year 1, Vee reported net income of $200,000 and paid cash dividends of $50,000. What amount should Saxe report as its investment in Vee at December 31, Year 1?",
    // 400,000 + 30%*200,000 - 30%*50,000 = 445,000
    choices:["$445,000","$460,000","$415,000","$400,000"], answer:0,
    explain:"Under the equity method (20–50% ownership), the investment increases by the investor's share of investee net income (+60,000) and decreases by its share of dividends (−15,000): 400,000 + 60,000 − 15,000 = $445,000. $460,000 omits the dividend reduction (treats dividends as income). $415,000 records dividends but not income. $400,000 leaves the investment at cost." },

  /* 14 — Equity securities -> FVTNI (post-ASU 2016-01) (B) ------------------ */
  { source:"F2.M7", diff:"medium",
    q:"Poe Company holds equity securities representing a 5% interest in another entity, with no significant influence. The securities cost $100,000 and have a fair value of $120,000 at year-end. How should the $20,000 increase in fair value be reported?",
    choices:["In other comprehensive income","In net income","Not recognized until the securities are sold","As a direct adjustment to retained earnings"], answer:1,
    explain:"Equity securities without significant influence are measured at fair value through net income; the $20,000 unrealized gain goes to net income. Routing equity-security fair-value changes to OCI is the superseded available-for-sale treatment (eliminated). Deferring recognition until sale and adjusting retained earnings directly are both incorrect." },

  /* 15 — AFS debt, cumulative vs incremental OCI (C) ------------------------ */
  { source:"F2.M7", diff:"hard",
    q:"Yarn Company holds debt securities appropriately classified as available-for-sale. The securities cost $200,000. At December 31, Year 1, their fair value was $185,000 and Yarn recognized the resulting unrealized loss. At December 31, Year 2, their fair value was $172,000. There is no expected credit loss. What unrealized loss should Yarn report in other comprehensive income for Year 2?",
    // cumulative 200,000-172,000 = 28,000; prior 15,000; current 13,000
    choices:["$28,000","$15,000","$13,000","$0"], answer:2,
    explain:"For AFS debt, unrealized gains and losses accumulate in OCI; the current-year amount is the change in the cumulative unrealized position. Cumulative loss = 200,000 − 172,000 = 28,000; $15,000 was recognized in Year 1, so Year 2 OCI loss = $13,000. $28,000 is the cumulative figure. $15,000 repeats the prior year. $0 recognizes nothing." },

  /* 16 — Deferred tax at ENACTED future rate (D) ---------------------------- */
  { source:"F4.M4", diff:"medium",
    q:"Stent Company has a taxable temporary difference of $100,000 at December 31, Year 1 that is expected to reverse in future years. The enacted tax rate is 30% for Year 1 and 21% for all future years. What amount should Stent report as a deferred tax liability at December 31, Year 1?",
    // enacted reversal rate 21% -> 21,000
    choices:["$30,000","$25,500","$0","$21,000"], answer:3,
    explain:"Deferred tax balances are measured at the enacted tax rate expected to apply when the difference reverses — 21% — so the DTL = 100,000 × 21% = $21,000. $30,000 uses the current-period rate. $25,500 averages the two rates. $0 wrongly treats the item as a permanent difference." },

  /* 17 — Permanent difference (A) ------------------------------------------- */
  { source:"F4.M4", diff:"easy",
    q:"Roth Company earned $40,000 of interest on municipal bonds during the year. The interest is included in financial-statement income but is never taxable. This item gives rise to:",
    choices:["No deferred tax — it is a permanent difference","A deferred tax asset","A deferred tax liability","A valuation allowance"], answer:0,
    explain:"Items that affect book income but never affect taxable income (or vice versa) are permanent differences and create no deferred tax. Deferred tax assets and liabilities arise only from temporary differences that reverse in future periods. A valuation allowance addresses a DTA's realizability, which is not at issue here." },

  /* 18 — Income statement, net gain & not discontinued (B) ------------------ */
  { source:"F1.M1", diff:"medium",
    q:"Gray Company sold a single delivery truck used in operations for more than its carrying amount. The truck is not a component of the entity. How should Gray report this transaction in its income statement?",
    choices:["At gross, with proceeds in revenues and the carrying amount in expenses","At the net gain, within continuing operations","At the net gain, within other comprehensive income","At the net gain, within discontinued operations"], answer:1,
    explain:"Gains and losses on disposals of operating assets are reported net within continuing operations. Gross presentation applies to ordinary revenues and expenses, not asset disposals. OCI excludes such gains. Discontinued-operations treatment requires disposal of a component representing a strategic shift — a single asset does not qualify." },

  /* 19 — SCF classification: dividends paid vs interest paid (C) ------------ */
  { source:"F1.M4", diff:"easy",
    q:"Under U.S. GAAP, how should a company classify cash dividends paid to shareholders and cash interest paid on debt in the statement of cash flows?",
    choices:["Both as financing activities","Both as operating activities","Dividends paid as financing; interest paid as operating","Dividends paid as operating; interest paid as financing"], answer:2,
    explain:"Under U.S. GAAP, dividends paid to owners are financing activities, while interest paid is an operating activity (it enters the determination of net income). The other combinations mix up these required classifications. (IFRS permits more flexibility, but U.S. GAAP is the default.)" },

  /* 20 — SCF indirect, reverse the gain (D) --------------------------------- */
  { source:"F1.M4", diff:"medium",
    q:"Nilo Company reported net income of $300,000 for Year 1. Net income includes depreciation expense of $40,000 and a $25,000 gain on the sale of equipment (the equipment was sold for $90,000 cash). Assuming no changes in working-capital accounts, what is net cash provided by operating activities under the indirect method?",
    // 300,000 + 40,000 - 25,000 = 315,000
    choices:["$365,000","$340,000","$405,000","$315,000"], answer:3,
    explain:"The indirect method starts with net income, adds back non-cash depreciation (+40,000), and removes the gain (−25,000) because the full $90,000 proceeds belong in investing: 300,000 + 40,000 − 25,000 = $315,000. $365,000 adds the gain (wrong direction). $340,000 omits the gain adjustment. $405,000 puts the sale proceeds in operating." }

]);
