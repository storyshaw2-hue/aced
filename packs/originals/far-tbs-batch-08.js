/* =============================================================================
   ACED — far-tbs-batch-08.js   (ORIGINAL CONTENT, append-safe)
   -----------------------------------------------------------------------------
   9 original task-based simulations rounding the library to 50 with high-yield
   topics not yet drilled: operating-lease lessee (F3.M5), direct-method SCF
   (F1.M4), counterbalancing error correction (F1.M3), partnership liquidation
   (F2.M6), governmental budgetary accounting & encumbrances (F4.M5), a deferred-
   tax enacted-rate change (F4.M4), capitalized interest on self-construction
   (F2.M4), a held-to-maturity bond INVESTMENT (F2.M6), and comprehensive income
   with a reclassification adjustment (F1.M1).

   Schema matches far-tbs-batch-01..07:
     { source, diff, title, scenario,
       items:[ { prompt, type:"numeric", answer, tolerance, explain }
             | { prompt, type:"select", choices:[...], answer:<0-based>, explain } ] }

   Every figure worked by hand and cross-checked. Verify against current ASC/GASB
   before badging as reviewed (your call as CPA).
   ============================================================================= */
window.ACED_TBS = (window.ACED_TBS || []).concat([

  /* ---- TBS 1: Operating Lease — Lessee (F3.M5) -------------------------- */
  { source:"F3.M5", diff:"medium",
    title:"Operating Lease — Lessee (ASC 842)",
    scenario:"On January 1, Year 1, Crane Co. (lessee) signs a 4-year operating lease with payments of $30,000 at the end of each year. The discount rate is 5%; the present value of an ordinary annuity of $1 for 4 periods at 5% is 3.5460. There are no initial direct costs or incentives. Round to the nearest dollar.",
    items:[
      { prompt:"Initial lease liability at commencement.",
        type:"numeric", answer:106380, tolerance:20,
        explain:"Present value of the payments = 30,000 × 3.5460 = $106,380." },
      { prompt:"Initial right-of-use asset at commencement.",
        type:"numeric", answer:106380, tolerance:20,
        explain:"ROU asset = lease liability + initial direct costs − incentives = 106,380 + 0 = $106,380." },
      { prompt:"Annual lease expense recognized for an operating lease.",
        type:"numeric", answer:30000, tolerance:0,
        explain:"A single straight-line lease cost = total payments 120,000 ÷ 4 years = $30,000 per year." },
      { prompt:"Lease liability at the end of Year 1.",
        type:"numeric", answer:81699, tolerance:20,
        explain:"Beginning 106,380 + interest (106,380 × 5% = 5,319) − payment 30,000 = $81,699." },
      { prompt:"How does an operating lease differ from a finance lease on the lessee's income statement?",
        type:"select",
        choices:["It reports separate amortization and interest expense","It reports a single straight-line lease expense","It reports no expense","It reports only interest"],
        answer:1,
        explain:"An operating lease produces one straight-line lease expense; a finance lease splits amortization of the ROU asset and interest on the liability." },
      { prompt:"Under ASC 842, both finance and operating leases (lessee) require:",
        type:"select",
        choices:["Off-balance-sheet treatment for operating leases","Recognition of a right-of-use asset and a lease liability","Expensing payments only","Capitalizing only leases over 10 years"],
        answer:1,
        explain:"ASC 842 puts both lease types on the balance sheet as an ROU asset and a lease liability (short-term leases excepted)." }
    ] },

  /* ---- TBS 2: Statement of Cash Flows — Direct Method (F1.M4) ------------ */
  { source:"F1.M4", diff:"medium",
    title:"Operating Cash Flow — Direct Method",
    scenario:"For Year 1, Pine Co. reports: sales $800,000 with accounts receivable up $40,000; cost of goods sold $500,000 with inventory up $20,000 and accounts payable up $15,000; operating expenses (excluding depreciation) $120,000 with prepaid expenses up $5,000 and accrued liabilities down $8,000; and depreciation of $30,000. Round to the nearest dollar.",
    items:[
      { prompt:"Cash received from customers.",
        type:"numeric", answer:760000, tolerance:0,
        explain:"Sales 800,000 − increase in receivables 40,000 = $760,000." },
      { prompt:"Cash paid to suppliers.",
        type:"numeric", answer:505000, tolerance:0,
        explain:"COGS 500,000 + inventory increase 20,000 − accounts payable increase 15,000 = $505,000." },
      { prompt:"Cash paid for operating expenses.",
        type:"numeric", answer:133000, tolerance:0,
        explain:"Operating expenses 120,000 + prepaid increase 5,000 + accrued-liability decrease 8,000 = $133,000." },
      { prompt:"Net cash provided by operating activities (direct method).",
        type:"numeric", answer:122000, tolerance:0,
        explain:"760,000 − 505,000 − 133,000 = $122,000." },
      { prompt:"Under the direct method, depreciation is:",
        type:"select",
        choices:["Reported as a cash outflow","Added to cash received from customers","Not reported in the operating section (it is noncash)","Reported in investing"],
        answer:2,
        explain:"Depreciation is noncash and does not appear in the direct-method operating section (it appears only in the indirect reconciliation)." },
      { prompt:"The direct method reports the operating section as:",
        type:"select",
        choices:["Net income adjusted for noncash items","Gross cash receipts and payments (e.g., cash from customers, cash to suppliers)","Only the net change in cash","Investing and financing flows"],
        answer:1,
        explain:"The direct method lists gross operating cash receipts and payments; the indirect method starts from net income." }
    ] },

  /* ---- TBS 3: Error Correction — Counterbalancing (F1.M3) --------------- */
  { source:"F1.M3", diff:"medium",
    title:"Inventory Error — Counterbalancing Effects",
    scenario:"In Year 2, Maple Co. discovers that its Year 1 ENDING inventory was overstated by $30,000 (the count mistakenly included goods it did not own). Year 1 is closed; Year 2's books are still open. Year 1 reported net income was $250,000. Round to the nearest dollar.",
    items:[
      { prompt:"Effect of the error on Year 1 net income.",
        type:"select",
        choices:["Overstated by $30,000","Understated by $30,000","No effect","Overstated by $60,000"],
        answer:0,
        explain:"Overstated ending inventory understates COGS, which overstates Year 1 net income by $30,000." },
      { prompt:"Effect on Year 2 net income if the error is not corrected.",
        type:"select",
        choices:["Overstated by $30,000","Understated by $30,000","No effect","Understated by $60,000"],
        answer:1,
        explain:"Year 1 ending inventory is Year 2 beginning inventory, so Year 2 COGS is overstated and Year 2 net income is understated by $30,000." },
      { prompt:"Corrected Year 1 net income.",
        type:"numeric", answer:220000, tolerance:0,
        explain:"Reported 250,000 − 30,000 overstatement = $220,000." },
      { prompt:"This is an example of:",
        type:"select",
        choices:["A non-counterbalancing error","A counterbalancing error (it self-corrects over two periods)","A change in estimate","A change in principle"],
        answer:1,
        explain:"Inventory errors counterbalance — the Year 1 overstatement reverses through Year 2 COGS." },
      { prompt:"By the end of Year 2, the cumulative effect on retained earnings if never corrected is:",
        type:"select",
        choices:["Overstated by $30,000","Understated by $30,000","Zero — the error has counterbalanced","Overstated by $60,000"],
        answer:2,
        explain:"After two periods the offsetting effects cancel, so retained earnings is correct." },
      { prompt:"If corrected in Year 2 (Year 1 closed), beginning retained earnings is:",
        type:"select",
        choices:["Increased by $30,000","Decreased by $30,000","Unchanged","Decreased by $60,000"],
        answer:1,
        explain:"Beginning retained earnings was overstated by the Year 1 error, so it is reduced by $30,000." }
    ] },

  /* ---- TBS 4: Partnership Liquidation (F2.M6) --------------------------- */
  { source:"F2.M6", diff:"hard",
    title:"Partnership Liquidation — Loss Absorption and a Deficit",
    scenario:"Partners A, B, and C share profits and losses 5:3:2. At liquidation the partnership has cash $20,000, noncash assets (book value) $130,000, liabilities $40,000, and capital balances A $60,000, B $36,000, C $14,000. The noncash assets are sold for $50,000. Round to the nearest dollar.",
    items:[
      { prompt:"Loss on the sale of the noncash assets.",
        type:"numeric", answer:80000, tolerance:0,
        explain:"Book value 130,000 − proceeds 50,000 = an $80,000 loss, shared 5:3:2." },
      { prompt:"C's capital deficit after the loss is allocated (amount of the deficit).",
        type:"numeric", answer:2000, tolerance:0,
        explain:"C's share of the loss = 80,000 × 2/10 = 16,000; capital 14,000 − 16,000 = a $2,000 deficit." },
      { prompt:"Cash available to distribute to partners (after paying the $40,000 of liabilities).",
        type:"numeric", answer:30000, tolerance:0,
        explain:"Cash 20,000 + sale proceeds 50,000 − liabilities 40,000 = $30,000." },
      { prompt:"If C is insolvent and cannot pay the deficit, A's share of C's $2,000 deficit (A:B = 5:3).",
        type:"numeric", answer:1250, tolerance:0,
        explain:"A absorbs 2,000 × 5/8 = $1,250 (B absorbs 2,000 × 3/8 = $750)." },
      { prompt:"Final cash distributed to A.",
        type:"numeric", answer:18750, tolerance:0,
        explain:"A's capital after the loss 20,000 − share of C's deficit 1,250 = $18,750." },
      { prompt:"A solvent partner with a debit (deficit) capital balance must:",
        type:"select",
        choices:["Be paid by the other partners","Contribute additional cash to cover the deficit","Forfeit the deficit","Convert it to a loan"],
        answer:1,
        explain:"A solvent partner with a capital deficit must contribute the shortfall to the partnership." }
    ] },

  /* ---- TBS 5: Governmental Budgetary Accounting & Encumbrances (F4.M5) --- */
  { source:"F4.M5", diff:"medium",
    title:"Budgetary Accounting and Encumbrances",
    scenario:"A city's General Fund has supplies appropriations of $500,000 for the year. It issues purchase orders (encumbrances) totaling $450,000; goods costing $420,000 (equal to the related orders) are received and vouchered, leaving the rest of the orders open at year-end. Round to the nearest dollar.",
    items:[
      { prompt:"When a purchase order is issued, the fund records:",
        type:"select",
        choices:["An expenditure","An encumbrance (a commitment) that reserves part of the appropriation","a liability","Revenue"],
        answer:1,
        explain:"Issuing a purchase order records an encumbrance, reserving budgetary authority so the amount cannot be re-spent." },
      { prompt:"When the goods are received, the fund:",
        type:"select",
        choices:["Records a second encumbrance","Reverses the encumbrance and records an expenditure","Records revenue","Does nothing until payment"],
        answer:1,
        explain:"On receipt the encumbrance is reversed and an actual expenditure (and liability) is recorded." },
      { prompt:"Total expenditures recorded for the year.",
        type:"numeric", answer:420000, tolerance:0,
        explain:"Goods received and vouchered = $420,000." },
      { prompt:"Outstanding encumbrances at year-end.",
        type:"numeric", answer:30000, tolerance:0,
        explain:"Orders 450,000 − goods received 420,000 = $30,000 still open." },
      { prompt:"Available (unencumbered) appropriation balance at year-end.",
        type:"numeric", answer:50000, tolerance:0,
        explain:"Appropriations 500,000 − expenditures 420,000 − outstanding encumbrances 30,000 = $50,000." },
      { prompt:"Encumbrance accounting exists primarily to:",
        type:"select",
        choices:["Recognize revenue earlier","Prevent overspending the budget by tracking commitments","Defer expenses","Replace the budget"],
        answer:1,
        explain:"Encumbrances track outstanding commitments so a fund does not exceed its appropriations." }
    ] },

  /* ---- TBS 6: Deferred Taxes — Enacted Rate Change (F4.M4) -------------- */
  { source:"F4.M4", diff:"hard",
    title:"Deferred Taxes — Change in the Enacted Rate",
    scenario:"At the start of Year 2, Birch Co. has a single taxable temporary difference of $400,000 and a deferred tax liability recorded at the old enacted rate of 30%. During Year 2 a new law lowers the rate to 25% for future periods, and the temporary difference grows by $50,000 (to $450,000 at year-end). Round to the nearest dollar.",
    items:[
      { prompt:"Deferred tax liability at the beginning of Year 2 (at 30%).",
        type:"numeric", answer:120000, tolerance:0,
        explain:"400,000 × 30% = $120,000." },
      { prompt:"Deferred tax liability at the end of Year 2 (at the new 25%).",
        type:"numeric", answer:112500, tolerance:0,
        explain:"450,000 × 25% = $112,500." },
      { prompt:"Reduction in the beginning DTL caused by the rate change.",
        type:"numeric", answer:20000, tolerance:0,
        explain:"400,000 × (30% − 25%) = a $20,000 decrease (a deferred tax benefit)." },
      { prompt:"The effect of an enacted rate change on existing deferred balances is recognized:",
        type:"select",
        choices:["Retrospectively in prior periods","In income from continuing operations in the period of enactment","In other comprehensive income","Deferred until the difference reverses"],
        answer:1,
        explain:"The remeasurement hits income from continuing operations in the period the new rate is enacted." },
      { prompt:"Deferred tax assets and liabilities are measured using:",
        type:"select",
        choices:["The current effective rate","The enacted rate expected to apply when the difference reverses","A flat 21%","The historical rate at origination"],
        answer:1,
        explain:"Deferred balances use the enacted rate expected to apply in the reversal period." },
      { prompt:"Net decrease in the deferred tax liability during Year 2.",
        type:"numeric", answer:7500, tolerance:0,
        explain:"120,000 − 112,500 = a $7,500 net decrease (a $20,000 rate benefit partly offset by $12,500 from the larger difference)." }
    ] },

  /* ---- TBS 7: Capitalized Interest on Self-Construction (F2.M4) --------- */
  { source:"F2.M4", diff:"hard",
    title:"Capitalized Interest — Self-Constructed Asset",
    scenario:"During Year 1, Cedar Co. constructs a building for its own use, spending $600,000 on January 1 and $600,000 on July 1. It has a $500,000 construction loan at 8% and $1,000,000 of other general debt at 6%, all outstanding the full year. Round to the nearest dollar.",
    items:[
      { prompt:"Weighted-average accumulated expenditures for the year.",
        type:"numeric", answer:900000, tolerance:0,
        explain:"600,000 × 12/12 + 600,000 × 6/12 = 600,000 + 300,000 = $900,000." },
      { prompt:"Interest on the portion covered by the specific construction loan.",
        type:"numeric", answer:40000, tolerance:0,
        explain:"500,000 × 8% = $40,000." },
      { prompt:"Interest on the remaining expenditures at the general borrowing rate.",
        type:"numeric", answer:24000, tolerance:0,
        explain:"(900,000 − 500,000) × 6% = $24,000." },
      { prompt:"Avoidable interest.",
        type:"numeric", answer:64000, tolerance:0,
        explain:"40,000 + 24,000 = $64,000." },
      { prompt:"Actual interest incurred during the year.",
        type:"numeric", answer:100000, tolerance:0,
        explain:"Construction loan 500,000 × 8% = 40,000 + general 1,000,000 × 6% = 60,000 = $100,000." },
      { prompt:"Interest capitalized for the year.",
        type:"numeric", answer:64000, tolerance:0,
        explain:"Capitalize the lesser of avoidable interest (64,000) and actual interest (100,000) = $64,000." },
      { prompt:"Capitalized interest is:",
        type:"select",
        choices:["Expensed immediately","Added to the cost of the constructed asset and then depreciated","Recorded as a prepaid asset","Reported in other comprehensive income"],
        answer:1,
        explain:"Capitalized interest becomes part of the asset's cost and is depreciated over its useful life." }
    ] },

  /* ---- TBS 8: Held-to-Maturity Bond Investment (F2.M6) ------------------ */
  { source:"F2.M6", diff:"hard",
    title:"Bond Investment — Held-to-Maturity (Effective Interest)",
    scenario:"On January 1, Year 1, Spruce Co. buys $200,000 face value, 5-year bonds with a stated rate of 5% paid annually each December 31, priced to yield 7%, and classifies them as held-to-maturity. Factors at 7% for 5 periods: PV of $1 = 0.7130; PV of an ordinary annuity of $1 = 4.1002. Round to the nearest dollar.",
    items:[
      { prompt:"Purchase price of the bond investment.",
        type:"numeric", answer:183602, tolerance:150,
        explain:"PV of face 200,000 × 0.7130 = 142,600, plus PV of coupons 10,000 × 4.1002 = 41,002, equals $183,602 (a discount, since 5% < 7%)." },
      { prompt:"Cash interest received each December 31.",
        type:"numeric", answer:10000, tolerance:0,
        explain:"Face × stated rate = 200,000 × 5% = $10,000." },
      { prompt:"Interest income for Year 1 (effective interest).",
        type:"numeric", answer:12852, tolerance:60,
        explain:"Carrying amount × yield = 183,602 × 7% = $12,852." },
      { prompt:"Discount amortized in Year 1.",
        type:"numeric", answer:2852, tolerance:60,
        explain:"Interest income 12,852 − cash received 10,000 = $2,852." },
      { prompt:"Carrying amount of the investment at the end of Year 1.",
        type:"numeric", answer:186454, tolerance:150,
        explain:"183,602 + discount amortized 2,852 = $186,454." },
      { prompt:"A held-to-maturity debt investment is reported at:",
        type:"select",
        choices:["Fair value through net income","Fair value through OCI","Amortized cost (subject to a credit-loss allowance)","Lower of cost or market"],
        answer:2,
        explain:"HTM debt is carried at amortized cost; only AFS and trading classifications use fair value." }
    ] },

  /* ---- TBS 9: Comprehensive Income & Reclassification (F1.M1) ----------- */
  { source:"F1.M1", diff:"medium",
    title:"Comprehensive Income and a Reclassification Adjustment",
    scenario:"Walnut Co. reports Year 1 net income of $400,000. During the year it also has: a $25,000 unrealized gain on available-for-sale debt securities; a $10,000 foreign-currency translation gain; an $8,000 reclassification adjustment for AFS gains realized and reported in net income this year; and a $15,000 pension prior-service-cost loss arising in OCI. Round to the nearest dollar.",
    items:[
      { prompt:"Which item is reported in OTHER comprehensive income rather than net income?",
        type:"select",
        choices:["The realized gain on securities sold","The unrealized gain on available-for-sale debt securities","Interest revenue","Cost of goods sold"],
        answer:1,
        explain:"Unrealized AFS gains flow through OCI; the realized portion is in net income." },
      { prompt:"The $8,000 reclassification adjustment:",
        type:"select",
        choices:["Adds the realized gain to OCI again","Removes from OCI the gains now realized in net income, to avoid double counting","Is ignored","Increases net income a second time"],
        answer:1,
        explain:"A reclassification adjustment removes previously recognized OCI amounts that are now in net income." },
      { prompt:"Total other comprehensive income for the year.",
        type:"numeric", answer:12000, tolerance:0,
        explain:"25,000 unrealized − 8,000 reclassification + 10,000 translation − 15,000 pension = $12,000." },
      { prompt:"Comprehensive income for the year.",
        type:"numeric", answer:412000, tolerance:0,
        explain:"Net income 400,000 + other comprehensive income 12,000 = $412,000." },
      { prompt:"Accumulated other comprehensive income is reported:",
        type:"select",
        choices:["Within net income","As a separate component of stockholders' equity","As a liability","On the income statement"],
        answer:1,
        explain:"Accumulated OCI is a separate equity component on the balance sheet." },
      { prompt:"Comprehensive income may be presented:",
        type:"select",
        choices:["Only in the notes","In a single continuous statement or in two consecutive statements","Only within retained earnings","Only on the balance sheet"],
        answer:1,
        explain:"U.S. GAAP allows a single continuous statement of comprehensive income or two consecutive statements." }
    ] }

]);
