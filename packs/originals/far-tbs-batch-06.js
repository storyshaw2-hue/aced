/* =============================================================================
   ACED — far-tbs-batch-06.js   (ORIGINAL CONTENT, append-safe)
   -----------------------------------------------------------------------------
   8 original task-based simulations adding depth on high-yield FAR topics now
   that every module has baseline coverage: lessor sales-type lease (F3.M5),
   ASC 606 transaction-price allocation (F2.M1), government-wide reconciliation
   (F4.M5), share-based compensation (F4.M1), troubled debt restructuring (F3.M4),
   equity securities at fair value through net income (F2.M7), dollar-value LIFO
   (F2.M3), and a deferred-tax NOL / valuation-allowance schedule (F4.M4).

   Schema matches far-tbs-batch-01..05:
     { source, diff, title, scenario,
       items:[ { prompt, type:"numeric", answer, tolerance, explain }
             | { prompt, type:"select", choices:[...], answer:<0-based>, explain } ] }

   Every figure worked by hand and cross-checked. Verify against current
   ASC/GASB before badging as reviewed (your call as CPA).
   ============================================================================= */
window.ACED_TBS = (window.ACED_TBS || []).concat([

  /* ---- TBS 1: Lessor — Sales-Type Lease (F3.M5) -------------------------- */
  { source:"F3.M5", diff:"hard",
    title:"Lessor — Sales-Type Lease",
    scenario:"On January 1, Year 1, Maple Leasing (lessor) leases equipment under a sales-type lease. The equipment's fair value (selling price) is $250,000 and its carrying amount (cost) is $190,000. The lease requires payments of $62,614 at the end of each year for 5 years; the rate implicit in the lease is 8%, and the present value of the lease payments equals $250,000. There is no residual value. Round to the nearest dollar.",
    items:[
      { prompt:"Selling profit the lessor recognizes at commencement.",
        type:"numeric", answer:60000, tolerance:0,
        explain:"Selling price (PV of lease payments) 250,000 − cost of goods 190,000 = $60,000 recognized at commencement." },
      { prompt:"Net investment in the lease at commencement.",
        type:"numeric", answer:250000, tolerance:0,
        explain:"The net investment equals the present value of the lease payments = $250,000." },
      { prompt:"Interest income for Year 1.",
        type:"numeric", answer:20000, tolerance:0,
        explain:"Net investment × implicit rate = 250,000 × 8% = $20,000." },
      { prompt:"Net investment in the lease at the end of Year 1 (after the payment).",
        type:"numeric", answer:207386, tolerance:50,
        explain:"250,000 + interest 20,000 − payment 62,614 = $207,386." },
      { prompt:"In a sales-type lease, at commencement the lessor:",
        type:"select",
        choices:["Keeps the asset and depreciates it","Derecognizes the asset and recognizes selling profit","Recognizes profit straight-line over the term","Never recognizes any profit"],
        answer:1,
        explain:"A sales-type lease transfers control, so the lessor removes the asset and recognizes selling profit up front, then interest income over the term." },
      { prompt:"Under an operating lease, by contrast, the lessor:",
        type:"select",
        choices:["Keeps the asset on its books and records lease income (usually straight-line)","Derecognizes the asset and books a gain","Records a net investment in the lease","Recognizes interest income only"],
        answer:0,
        explain:"In an operating lease the lessor retains and depreciates the asset and recognizes lease income, typically straight-line." }
    ] },

  /* ---- TBS 2: Revenue — Allocate Transaction Price (F2.M1) --------------- */
  { source:"F2.M1", diff:"hard",
    title:"ASC 606 — Allocating the Transaction Price",
    scenario:"Tech Co. sells a bundle for $100,000 that contains three performance obligations: hardware, one year of support service, and a software license. Their standalone selling prices are hardware $66,000, support $22,000, and software $22,000. The hardware and software are delivered at contract inception; support is provided evenly over one year. Round to the nearest dollar.",
    items:[
      { prompt:"Total of the standalone selling prices.",
        type:"numeric", answer:110000, tolerance:0,
        explain:"66,000 + 22,000 + 22,000 = $110,000 (which exceeds the $100,000 price, so the bundle is discounted)." },
      { prompt:"Transaction price allocated to the hardware.",
        type:"numeric", answer:60000, tolerance:0,
        explain:"100,000 × (66,000 ÷ 110,000) = $60,000." },
      { prompt:"Transaction price allocated to the support service.",
        type:"numeric", answer:20000, tolerance:0,
        explain:"100,000 × (22,000 ÷ 110,000) = $20,000." },
      { prompt:"Support revenue recognized after the first 3 months.",
        type:"numeric", answer:5000, tolerance:0,
        explain:"Support is satisfied over time: 20,000 × 3/12 = $5,000." },
      { prompt:"The hardware revenue is recognized:",
        type:"select",
        choices:["Ratably over one year","At the point in time control transfers (delivery)","Only when cash is collected","When the support period ends"],
        answer:1,
        explain:"A good transferred at a point in time is recognized when the customer obtains control — here, at delivery." },
      { prompt:"The $10,000 discount (SSP 110,000 vs price 100,000) is:",
        type:"select",
        choices:["Assigned entirely to the hardware","Allocated proportionately to all obligations by relative standalone selling price","Ignored","Recorded as a separate expense"],
        answer:1,
        explain:"A discount is generally allocated proportionately across all performance obligations based on relative standalone selling prices." }
    ] },

  /* ---- TBS 3: Government-Wide Reconciliation (F4.M5) --------------------- */
  { source:"F4.M5", diff:"hard",
    title:"Reconciling Fund Balance to Government-Wide Net Position",
    scenario:"A city reconciles the total fund balance of its governmental funds to the net position of governmental activities. Total governmental fund balances are $2,000,000. Reconciling items: capital assets (net of depreciation) used in governmental activities $5,000,000; long-term bonds payable not due currently $3,500,000; accrued interest on long-term debt not reported in the funds $40,000; internal service fund net position $120,000; and unavailable revenue deferred in the funds $80,000. Round to the nearest dollar.",
    items:[
      { prompt:"Capital assets used in governmental activities are:",
        type:"select",
        choices:["Subtracted","Added — they are absent from the funds but reported government-wide","Ignored","Reported only as expenditures"],
        answer:1,
        explain:"Capital assets are not in the governmental funds but are capitalized in the government-wide statements, so they are added in the reconciliation." },
      { prompt:"Long-term bonds payable not due in the current period are:",
        type:"select",
        choices:["Added","Subtracted — they are a government-wide liability, not a fund liability","Ignored","Reported as an other financing source"],
        answer:1,
        explain:"Long-term debt is omitted from the funds but is a liability government-wide, so it is subtracted." },
      { prompt:"Revenue that was unavailable (deferred) in the funds is:",
        type:"select",
        choices:["Subtracted","Added — it is recognized as revenue under full accrual government-wide","Ignored","Reported as a liability"],
        answer:1,
        explain:"Full accrual recognizes the revenue that modified accrual deferred, so it is added back." },
      { prompt:"Net position of governmental activities.",
        type:"numeric", answer:3660000, tolerance:0,
        explain:"2,000,000 + 5,000,000 capital assets − 3,500,000 long-term debt − 40,000 accrued interest + 120,000 internal service fund + 80,000 unavailable revenue = $3,660,000." },
      { prompt:"The government-wide statements are prepared on the:",
        type:"select",
        choices:["Modified accrual basis / current financial resources","Full accrual basis / economic resources","Cash basis","Budgetary basis"],
        answer:1,
        explain:"Government-wide statements use the economic resources measurement focus and full accrual basis." },
      { prompt:"Internal service fund balances are generally reported in:",
        type:"select",
        choices:["Business-type activities","Governmental activities","A fiduciary fund","A separate column only"],
        answer:1,
        explain:"Internal service funds predominantly serve governmental functions, so their balances are usually folded into governmental activities government-wide." }
    ] },

  /* ---- TBS 4: Share-Based Compensation — Stock Options (F4.M1) ----------- */
  { source:"F4.M1", diff:"medium",
    title:"Share-Based Compensation — Stock Options",
    scenario:"On January 1, Year 1, Birch Co. grants 10,000 employee stock options with a grant-date fair value of $9 each. The options cliff-vest at the end of Year 3 (a 3-year service condition). No forfeitures are expected. Round to the nearest dollar.",
    items:[
      { prompt:"Total compensation cost to be recognized over the vesting period.",
        type:"numeric", answer:90000, tolerance:0,
        explain:"Options × grant-date fair value = 10,000 × $9 = $90,000." },
      { prompt:"Compensation expense for Year 1.",
        type:"numeric", answer:30000, tolerance:0,
        explain:"Recognized straight-line over the 3-year vesting period: 90,000 ÷ 3 = $30,000." },
      { prompt:"Cumulative compensation expense recognized through the end of Year 2.",
        type:"numeric", answer:60000, tolerance:0,
        explain:"Two years at $30,000 = $60,000." },
      { prompt:"Share-based compensation to employees is measured at:",
        type:"select",
        choices:["Intrinsic value remeasured each period","The grant-date fair value, recognized over the service period","The exercise price","Fair value at the exercise date"],
        answer:1,
        explain:"Equity-classified awards are measured at grant-date fair value and expensed over the requisite service (vesting) period." },
      { prompt:"If vested options later expire unexercised, the compensation expense already recognized is:",
        type:"select",
        choices:["Reversed entirely","Not reversed — it remains recognized","Reversed only to additional paid-in capital","Credited back to income"],
        answer:1,
        explain:"Compensation cost for vested awards is not reversed even if the options are never exercised." }
    ] },

  /* ---- TBS 5: Troubled Debt Restructuring (F3.M4) ----------------------- */
  { source:"F3.M4", diff:"hard",
    title:"Troubled Debt Restructuring — Debtor",
    scenario:"Debtor Co. owes a bank a note with a carrying amount of $500,000 (ignore accrued interest). Because Debtor is in financial difficulty, the bank grants a concession. Consider two independent restructurings. Round to the nearest dollar.",
    items:[
      { prompt:"Case A — settlement by asset transfer: Debtor transfers land (book value $300,000, fair value $380,000) to fully settle the debt. Gain or loss on disposal of the land:",
        type:"numeric", answer:80000, tolerance:0,
        explain:"Land is first remeasured to fair value: 380,000 − 300,000 book value = an $80,000 gain on disposal." },
      { prompt:"Case A — gain on restructuring of the debt.",
        type:"numeric", answer:120000, tolerance:0,
        explain:"Carrying amount of debt 500,000 − fair value of asset transferred 380,000 = a $120,000 gain on restructuring." },
      { prompt:"Case B — modification of terms: total future cash flows under the new terms are $460,000 versus the $500,000 carrying amount. The debtor's gain on restructuring is:",
        type:"numeric", answer:40000, tolerance:0,
        explain:"Future undiscounted cash flows 460,000 < carrying amount 500,000, so the debtor recognizes a $40,000 gain and reduces the debt to $460,000." },
      { prompt:"Case B — after recognizing that gain, the debtor's future payments are:",
        type:"select",
        choices:["Split into interest and principal at the original rate","Treated entirely as reductions of principal — no interest expense","Recognized as all interest expense","Ignored until maturity"],
        answer:1,
        explain:"When future cash flows are less than the carrying amount, all subsequent payments reduce principal and no interest expense is recognized by the debtor." },
      { prompt:"A troubled debt restructuring exists when:",
        type:"select",
        choices:["Any loan is refinanced","A creditor grants a concession, due to the debtor's financial difficulty, that it would not otherwise consider","Interest rates fall in the market","The debtor prepays early"],
        answer:1,
        explain:"A TDR requires both the debtor's financial difficulty and a concession by the creditor." }
    ] },

  /* ---- TBS 6: Equity Securities at FVNI (F2.M7) ------------------------- */
  { source:"F2.M7", diff:"medium",
    title:"Equity Securities — Fair Value Through Net Income",
    scenario:"Cedar Co. holds equity securities with no significant influence. It buys them on January 1, Year 1 for $80,000. Fair value is $86,000 at December 31, Year 1. In Year 2 it receives $2,000 of dividends and fair value falls to $79,000 at December 31, Year 2. On March 1, Year 3 it sells all the securities for $84,000. Round to the nearest dollar.",
    items:[
      { prompt:"Equity securities without significant influence are measured at:",
        type:"select",
        choices:["Fair value, with changes in other comprehensive income","Fair value, with changes in net income","Amortized cost","The equity method"],
        answer:1,
        explain:"Under ASU 2016-01, equity securities (no significant influence, readily determinable fair value) are carried at fair value with changes in net income." },
      { prompt:"Unrealized gain recognized in net income for Year 1.",
        type:"numeric", answer:6000, tolerance:0,
        explain:"Fair value 86,000 − cost 80,000 = a $6,000 unrealized gain, recognized in net income." },
      { prompt:"Dividend income recognized in Year 2.",
        type:"numeric", answer:2000, tolerance:0,
        explain:"Dividends of $2,000 are recognized in net income when declared/received." },
      { prompt:"Unrealized loss recognized in Year 2 income.",
        type:"numeric", answer:7000, tolerance:0,
        explain:"Fair value 79,000 − prior carrying 86,000 = a $7,000 unrealized loss in net income." },
      { prompt:"Gain recognized on the Year 3 sale.",
        type:"numeric", answer:5000, tolerance:0,
        explain:"Proceeds 84,000 − carrying amount 79,000 = a $5,000 gain in net income." },
      { prompt:"Versus an available-for-sale DEBT security, the key difference is:",
        type:"select",
        choices:["Equity-security fair-value changes go to net income, not OCI","Equity securities are held at amortized cost","Equity securities use the equity method","There is no difference"],
        answer:0,
        explain:"AFS debt fair-value changes flow through OCI; equity-security fair-value changes flow through net income." }
    ] },

  /* ---- TBS 7: Dollar-Value LIFO (F2.M3) --------------------------------- */
  { source:"F2.M3", diff:"hard",
    title:"Dollar-Value LIFO — Layers and Liquidation",
    scenario:"Aspen Co. adopts dollar-value LIFO on December 31, Year 0 (base year), when ending inventory is $200,000 and the price index is 1.00. Ending inventory at current-year cost is $231,000 with an index of 1.10 at the end of Year 1, and $237,500 with an index of 1.25 at the end of Year 2. Round to the nearest dollar.",
    items:[
      { prompt:"Year 1 ending inventory restated to base-year cost.",
        type:"numeric", answer:210000, tolerance:0,
        explain:"Current cost ÷ index = 231,000 ÷ 1.10 = $210,000." },
      { prompt:"Year 1 dollar-value LIFO inventory.",
        type:"numeric", answer:211000, tolerance:0,
        explain:"Base layer 200,000 (× 1.00) + new layer 10,000 × 1.10 = 11,000, total $211,000." },
      { prompt:"Year 2 ending inventory restated to base-year cost.",
        type:"numeric", answer:190000, tolerance:0,
        explain:"237,500 ÷ 1.25 = $190,000." },
      { prompt:"Year 2 dollar-value LIFO inventory.",
        type:"numeric", answer:190000, tolerance:0,
        explain:"Base-year cost fell to 190,000, liquidating the entire Year-1 layer and part of the base layer; the remaining 190,000 is valued at the base index 1.00 = $190,000." },
      { prompt:"When ending inventory at base-year cost falls below the prior year's, the result is:",
        type:"select",
        choices:["A new LIFO layer is added","A LIFO liquidation — the most recent layers are removed first","A change in accounting principle","No effect on inventory"],
        answer:1,
        explain:"A decline in base-year quantities removes the most recently added layers first (LIFO liquidation), which can pull older, lower costs into income." }
    ] },

  /* ---- TBS 8: Deferred Taxes — NOL & Valuation Allowance (F4.M4) -------- */
  { source:"F4.M4", diff:"hard",
    title:"Deferred Taxes — NOL Carryforward and Valuation Allowance",
    scenario:"In Year 1 (a loss year), Dogwood Inc. reports a pretax book loss of $400,000. The loss includes $20,000 of tax-exempt municipal interest income. It also accrued $50,000 of warranty expense (deductible only when paid) and took $30,000 more tax depreciation than book depreciation. The enacted rate is 25%. Dogwood concludes a valuation allowance is needed for 40% of the NOL-related deferred tax asset. Round to the nearest dollar.",
    items:[
      { prompt:"Net operating loss (NOL) carryforward generated in Year 1.",
        type:"numeric", answer:400000, tolerance:0,
        explain:"Book loss −400,000 − 20,000 muni interest (permanent) + 50,000 warranty (not yet deductible) − 30,000 extra tax depreciation = a $400,000 taxable loss." },
      { prompt:"Deferred tax asset from the NOL carryforward.",
        type:"numeric", answer:100000, tolerance:0,
        explain:"NOL 400,000 × 25% = $100,000." },
      { prompt:"Deferred tax asset from the warranty difference.",
        type:"numeric", answer:12500, tolerance:0,
        explain:"Future deductible difference 50,000 × 25% = $12,500." },
      { prompt:"Deferred tax liability from the depreciation difference.",
        type:"numeric", answer:7500, tolerance:0,
        explain:"Future taxable difference 30,000 × 25% = $7,500." },
      { prompt:"Valuation allowance (40% of the NOL deferred tax asset).",
        type:"numeric", answer:40000, tolerance:0,
        explain:"40% × 100,000 = $40,000." },
      { prompt:"Net deferred tax asset reported on the balance sheet.",
        type:"numeric", answer:65000, tolerance:0,
        explain:"(NOL DTA 100,000 + warranty DTA 12,500 − DTL 7,500) − valuation allowance 40,000 = $65,000." },
      { prompt:"A valuation allowance against a deferred tax asset is recorded when:",
        type:"select",
        choices:["The asset is certain to be realized","It is more likely than not that some portion will not be realized","The enacted rate changes","The company is profitable"],
        answer:1,
        explain:"A valuation allowance reduces the DTA to the amount more likely than not to be realized." }
    ] }

]);
