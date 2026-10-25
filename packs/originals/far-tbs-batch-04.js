/* =============================================================================
   ACED — far-tbs-batch-04.js   (ORIGINAL CONTENT, append-safe)
   -----------------------------------------------------------------------------
   8 original task-based simulations authored from U.S. GAAP + the AICPA FAR
   blueprint, chosen to fill modules with NO prior TBS coverage: bank
   reconciliation (F3.M1), receivables/CECL (F2.M2), PP&E depreciation & disposal
   (F2.M4), EPS basic+diluted (F4.M2), stockholders' equity (F4.M1), governmental
   funds (F4.M5), the multi-step income statement (F1.M1), and impairment (F2.M5).

   Schema matches far-tbs-batch-01/02/03:
     { source, diff, title, scenario,
       items:[ { prompt, type:"numeric", answer, tolerance, explain }
             | { prompt, type:"select", choices:[...], answer:<0-based>, explain } ] }

   Every figure was worked by hand and cross-checked; still, verify against current
   ASC before badging as reviewed (your call as CPA).
   ============================================================================= */
window.ACED_TBS = (window.ACED_TBS || []).concat([

  /* ---- TBS 1: Bank Reconciliation (F3.M1) -------------------------------- */
  { source:"F3.M1", diff:"medium",
    title:"Bank Reconciliation — Adjusted Cash Balance",
    scenario:"At June 30, Cedar Co.'s ledger shows a cash balance of $15,920, while its bank statement shows $18,400. Cedar identifies: deposits in transit $3,200; outstanding checks $5,150; a bank service charge of $40; an NSF check from a customer of $600; a note the bank collected for Cedar of $1,260 ($1,200 principal + $60 interest); and a $90 check belonging to another customer that the bank charged to Cedar in error. Round to the nearest dollar.",
    items:[
      { prompt:"Deposits in transit are:",
        type:"select",
        choices:["Added to the bank balance","Subtracted from the bank balance","Added to the book balance","Subtracted from the book balance"],
        answer:0,
        explain:"The bank has not yet recorded these deposits, so they are added to the bank side of the reconciliation." },
      { prompt:"Adjusted (true) cash balance computed from the BANK side.",
        type:"numeric", answer:16540, tolerance:0,
        explain:"18,400 + deposits in transit 3,200 − outstanding checks 5,150 + bank error 90 = $16,540." },
      { prompt:"Adjusted cash balance computed from the BOOK side.",
        type:"numeric", answer:16540, tolerance:0,
        explain:"15,920 − service charge 40 − NSF 600 + note collected 1,260 = $16,540. Both sides must agree." },
      { prompt:"The note the bank collected on Cedar's behalf is:",
        type:"select",
        choices:["Added to the book balance","Subtracted from the book balance","Added to the bank balance","Ignored in the reconciliation"],
        answer:0,
        explain:"Cedar has not recorded the collection yet, so the principal and interest are added to the book side." },
      { prompt:"Which item requires an adjusting journal entry on Cedar's books?",
        type:"select",
        choices:["Deposits in transit","Outstanding checks","The NSF check from the customer","The bank's $90 error"],
        answer:2,
        explain:"Only book-side reconciling items (service charge, NSF, note) require journal entries. Bank-side items (deposits in transit, outstanding checks, the bank's error) are corrected by the bank, not on Cedar's books." }
    ] },

  /* ---- TBS 2: Receivables & Allowance / CECL (F2.M2) --------------------- */
  { source:"F2.M2", diff:"medium",
    title:"Allowance for Credit Losses — Year-End Schedule",
    scenario:"Birch Co. began the year with a $8,000 credit balance in its allowance for credit losses. During the year it wrote off $11,000 of specific accounts and recovered $2,000 of accounts previously written off. Gross accounts receivable at year-end are $420,000, and Birch estimates lifetime expected credit losses (CECL) at 5% of gross receivables. Round to the nearest dollar.",
    items:[
      { prompt:"Required balance in the allowance at year-end.",
        type:"numeric", answer:21000, tolerance:0,
        explain:"Lifetime expected loss = 5% × 420,000 = $21,000 (a credit balance)." },
      { prompt:"Credit loss (bad-debt) expense for the year.",
        type:"numeric", answer:22000, tolerance:0,
        explain:"Unadjusted allowance = 8,000 − 11,000 write-offs + 2,000 recoveries = −1,000 (a $1,000 debit). To reach a $21,000 credit balance, expense = 21,000 − (−1,000) = $22,000." },
      { prompt:"Net realizable value of accounts receivable at year-end.",
        type:"numeric", answer:399000, tolerance:0,
        explain:"Gross 420,000 − allowance 21,000 = $399,000." },
      { prompt:"Writing off a specific uncollectible account under the allowance method:",
        type:"select",
        choices:["Reduces accounts receivable and the allowance equally, with no effect on net realizable value or expense","Increases bad-debt expense in the period of write-off","Reduces net realizable value of receivables","Increases net income"],
        answer:0,
        explain:"The write-off debits the allowance and credits receivables by the same amount, so net realizable value and expense are unchanged; the expense was recognized earlier through the estimate." },
      { prompt:"Under CECL, the allowance reflects:",
        type:"select",
        choices:["Only losses already incurred at the balance sheet date","Lifetime expected credit losses using past, current, and reasonable forecast information","A fixed percentage of net income","Losses only once an account is 90 days past due"],
        answer:1,
        explain:"CECL is a forward-looking, lifetime expected-loss model — it does not wait for a loss to be incurred." }
    ] },

  /* ---- TBS 3: PP&E Depreciation & Disposal (F2.M4) ----------------------- */
  { source:"F2.M4", diff:"medium",
    title:"Depreciation Methods and Disposal",
    scenario:"On January 1, Year 1, Aspen Co. buys a machine for $90,000. It has a $10,000 residual value and a 5-year useful life, and is expected to produce 200,000 units over its life. In Year 1 it produces 50,000 units. Round to the nearest dollar.",
    items:[
      { prompt:"Annual depreciation under the straight-line method.",
        type:"numeric", answer:16000, tolerance:0,
        explain:"(Cost − residual) ÷ life = (90,000 − 10,000) ÷ 5 = $16,000 per year." },
      { prompt:"Year 1 depreciation under the double-declining-balance method.",
        type:"numeric", answer:36000, tolerance:0,
        explain:"DDB rate = 2 ÷ 5 = 40%; first year = 40% × 90,000 = $36,000 (residual ignored until book value nears it)." },
      { prompt:"Year 2 depreciation under the double-declining-balance method.",
        type:"numeric", answer:21600, tolerance:0,
        explain:"40% × (90,000 − 36,000) = 40% × 54,000 = $21,600." },
      { prompt:"Year 1 depreciation under the units-of-production method.",
        type:"numeric", answer:20000, tolerance:0,
        explain:"Rate = (90,000 − 10,000) ÷ 200,000 = $0.40/unit; Year 1 = 50,000 × 0.40 = $20,000." },
      { prompt:"Using straight-line, the carrying amount at the end of Year 3.",
        type:"numeric", answer:42000, tolerance:0,
        explain:"Accumulated depreciation = 16,000 × 3 = 48,000; carrying amount = 90,000 − 48,000 = $42,000." },
      { prompt:"If the machine is sold at the end of Year 3 for $40,000 (straight-line), the result is:",
        type:"select",
        choices:["Gain of $2,000","Loss of $2,000","Gain of $8,000","No gain or loss"],
        answer:1,
        explain:"Proceeds 40,000 − carrying amount 42,000 = a $2,000 loss." }
    ] },

  /* ---- TBS 4: Earnings Per Share — basic & diluted (F4.M2) --------------- */
  { source:"F4.M2", diff:"hard",
    title:"Earnings Per Share — Basic and Diluted",
    scenario:"Dogwood Inc. reports net income of $500,000 for Year 1 with 200,000 weighted-average common shares outstanding all year. It has $1,000,000 par of 8% cumulative preferred stock (no dividends declared this year), $1,000,000 of 5% convertible bonds outstanding all year (each $1,000 bond converts into 40 common shares), and 10,000 stock options with a $20 exercise price (average market price $25). The tax rate is 25%. Round EPS to the nearest cent.",
    items:[
      { prompt:"Annual preferred dividend requirement.",
        type:"numeric", answer:80000, tolerance:0,
        explain:"8% × 1,000,000 par = $80,000. Because the preferred is cumulative, the current year's dividend is subtracted for EPS even though it was not declared." },
      { prompt:"Basic earnings per share.",
        type:"numeric", answer:2.10, tolerance:0.01,
        explain:"(Net income 500,000 − preferred 80,000) ÷ 200,000 = $2.10." },
      { prompt:"After-tax interest add-back for the convertible bonds.",
        type:"numeric", answer:37500, tolerance:0,
        explain:"Interest 5% × 1,000,000 = 50,000; after tax = 50,000 × (1 − 25%) = $37,500. (No preferred effect from a bond conversion.)" },
      { prompt:"Incremental shares from the options (treasury stock method).",
        type:"numeric", answer:2000, tolerance:0,
        explain:"10,000 × (1 − 20/25) = 10,000 × 0.20 = 2,000 shares." },
      { prompt:"Diluted earnings per share.",
        type:"numeric", answer:1.89, tolerance:0.02,
        explain:"Numerator = 420,000 + 37,500 = 457,500; denominator = 200,000 + 40,000 (bonds) + 2,000 (options) = 242,000; 457,500 ÷ 242,000 = $1.89. Both the bonds (37,500/40,000 = 0.94 < 2.10) and the options are dilutive." },
      { prompt:"For basic EPS, the cumulative preferred dividend is:",
        type:"select",
        choices:["Subtracted only if it was declared during the year","Subtracted for the current year whether or not it was declared","Never subtracted because it was not paid","Added back to net income"],
        answer:1,
        explain:"For cumulative preferred, the current year's dividend reduces income available to common regardless of declaration." }
    ] },

  /* ---- TBS 5: Stockholders' Equity roll-forward (F4.M1) ------------------ */
  { source:"F4.M1", diff:"medium",
    title:"Stockholders' Equity — Year 1 Roll-Forward",
    scenario:"Elm Corp. began Year 1 with: common stock ($1 par, 100,000 shares issued and outstanding) $100,000; additional paid-in capital $400,000; retained earnings $600,000; and no treasury stock. During Year 1 it: (a) issued 20,000 new shares at $8; (b) reacquired 5,000 shares as treasury stock at $10 (cost method); (c) reissued 2,000 of those treasury shares at $13; (d) earned net income of $250,000; and (e) declared and paid $90,000 of cash dividends. Round to the nearest dollar.",
    items:[
      { prompt:"Common shares outstanding at year-end.",
        type:"numeric", answer:117000, tolerance:0,
        explain:"100,000 + 20,000 issued − 5,000 treasury + 2,000 reissued = 117,000 shares." },
      { prompt:"Treasury stock balance (cost method) at year-end.",
        type:"numeric", answer:30000, tolerance:0,
        explain:"Remaining treasury shares (5,000 − 2,000) × $10 cost = $30,000 (a contra-equity balance)." },
      { prompt:"Retained earnings at year-end.",
        type:"numeric", answer:760000, tolerance:0,
        explain:"600,000 + net income 250,000 − dividends 90,000 = $760,000." },
      { prompt:"Total stockholders' equity at year-end.",
        type:"numeric", answer:1396000, tolerance:0,
        explain:"Common 120,000 + APIC 546,000 (400,000 + 140,000 issuance + 6,000 treasury reissue) + RE 760,000 − treasury 30,000 = $1,396,000." },
      { prompt:"Reissuing treasury stock above its cost:",
        type:"select",
        choices:["Recognizes a gain in net income","Increases additional paid-in capital, with no gain in net income","Increases retained earnings directly","Has no effect on equity"],
        answer:1,
        explain:"Gains and losses on a company's own treasury stock never hit the income statement; the $3/share excess increases paid-in capital." }
    ] },

  /* ---- TBS 6: Governmental Fund Accounting (F4.M5) ----------------------- */
  { source:"F4.M5", diff:"medium",
    title:"Governmental Funds — Classification and Fund Balance",
    scenario:"A city is preparing its fund financial statements under GASB. Classify each item and compute the General Fund result. Round to the nearest dollar.",
    items:[
      { prompt:"The General Fund uses which measurement focus and basis of accounting?",
        type:"select",
        choices:["Economic resources / full accrual","Current financial resources / modified accrual","Cash basis only","Budgetary basis only"],
        answer:1,
        explain:"Governmental funds use the current financial resources measurement focus and the modified accrual basis." },
      { prompt:"Which fund is a proprietary fund reported on the full accrual basis?",
        type:"select",
        choices:["General Fund","Special Revenue Fund","Enterprise Fund","Capital Projects Fund"],
        answer:2,
        explain:"Enterprise (and internal service) funds are proprietary funds using the economic resources focus and full accrual." },
      { prompt:"Under modified accrual, property tax revenue is recognized when it is:",
        type:"select",
        choices:["Levied, regardless of collection","Measurable and available (collectible within the period or soon enough after)","Received in cash only","Budgeted for the year"],
        answer:1,
        explain:"Revenue is recognized when measurable and available — collectible within the current period or shortly after year-end (commonly within 60 days)." },
      { prompt:"The General Fund's purchase of a police car is reported as:",
        type:"select",
        choices:["A capital asset on the fund balance sheet","An expenditure when acquired","A reduction of fund balance with no expenditure","Deferred and depreciated in the fund"],
        answer:1,
        explain:"Governmental funds record capital outlays as expenditures; the asset is shown only in the government-wide statements, where it is capitalized and depreciated." },
      { prompt:"General Fund data: revenues $5,000,000; expenditures $4,600,000; bond proceeds $1,000,000; transfers out $300,000. The net change in fund balance is:",
        type:"numeric", answer:1100000, tolerance:0,
        explain:"5,000,000 − 4,600,000 + 1,000,000 (other financing source) − 300,000 (other financing use) = $1,100,000." }
    ] },

  /* ---- TBS 7: Multi-Step Income Statement (F1.M1) ------------------------ */
  { source:"F1.M1", diff:"medium",
    title:"Multi-Step Income Statement",
    scenario:"For Year 1, Fir Co. reports: net sales $2,000,000; cost of goods sold $1,200,000; selling expenses $250,000; general & administrative expenses $150,000; interest expense $40,000; a $30,000 gain on the sale of equipment; and a $70,000 loss from discontinued operations (net of tax). The tax rate on continuing operations is 25%. Round to the nearest dollar.",
    items:[
      { prompt:"Gross profit.",
        type:"numeric", answer:800000, tolerance:0,
        explain:"Net sales 2,000,000 − COGS 1,200,000 = $800,000." },
      { prompt:"Operating income.",
        type:"numeric", answer:400000, tolerance:0,
        explain:"Gross profit 800,000 − selling 250,000 − G&A 150,000 = $400,000." },
      { prompt:"Income from continuing operations before income tax.",
        type:"numeric", answer:390000, tolerance:0,
        explain:"Operating income 400,000 − interest 40,000 + gain 30,000 = $390,000." },
      { prompt:"Income tax expense on continuing operations.",
        type:"numeric", answer:97500, tolerance:0,
        explain:"25% × 390,000 = $97,500." },
      { prompt:"Income from continuing operations.",
        type:"numeric", answer:292500, tolerance:0,
        explain:"390,000 − 97,500 = $292,500." },
      { prompt:"Net income.",
        type:"numeric", answer:222500, tolerance:0,
        explain:"Income from continuing operations 292,500 − discontinued operations loss 70,000 (net of tax) = $222,500." },
      { prompt:"The discontinued-operations loss is reported:",
        type:"select",
        choices:["Within operating expenses","Net of tax, in a separate section below income from continuing operations","As a direct charge to retained earnings","In other comprehensive income"],
        answer:1,
        explain:"Discontinued operations are presented separately, net of tax, after income from continuing operations." }
    ] },

  /* ---- TBS 8: Asset Impairment (F2.M5) ----------------------------------- */
  { source:"F2.M5", diff:"hard",
    title:"Impairment — Long-Lived Asset, Patent, and Goodwill",
    scenario:"Gum Co. tests three items at year-end. (1) A machine held for use: carrying amount $500,000, estimated undiscounted future cash flows $460,000, fair value $400,000. (2) A finite-life patent: carrying amount $200,000, undiscounted future cash flows $250,000. (3) A reporting unit with goodwill: carrying amount of the unit $1,000,000 (including $300,000 goodwill), fair value of the unit $900,000. Round to the nearest dollar.",
    items:[
      { prompt:"Is the machine impaired (recoverability test)?",
        type:"select",
        choices:["No — undiscounted cash flows exceed carrying amount","Yes — carrying amount $500,000 exceeds undiscounted cash flows $460,000","Cannot tell without the discount rate","Only if fair value is below residual value"],
        answer:1,
        explain:"Step 1 fails: carrying amount 500,000 > undiscounted cash flows 460,000, so the asset is impaired and is written down to fair value." },
      { prompt:"Impairment loss on the machine.",
        type:"numeric", answer:100000, tolerance:0,
        explain:"Once impaired, the loss = carrying amount 500,000 − fair value 400,000 = $100,000." },
      { prompt:"Impairment loss on the patent.",
        type:"numeric", answer:0, tolerance:0,
        explain:"Undiscounted cash flows 250,000 ≥ carrying amount 200,000, so the patent is not impaired — no loss." },
      { prompt:"Goodwill impairment loss for the reporting unit.",
        type:"numeric", answer:100000, tolerance:0,
        explain:"Carrying amount of the unit 1,000,000 − fair value 900,000 = $100,000, which is less than the $300,000 of goodwill, so the full $100,000 is the loss." },
      { prompt:"Under U.S. GAAP, a recognized impairment of a long-lived asset held for use:",
        type:"select",
        choices:["May be reversed if fair value later recovers","May not be reversed in a later period","Is reversed only for intangibles","Is always reversed at disposal"],
        answer:1,
        explain:"U.S. GAAP prohibits reversing impairment losses on long-lived assets held for use (unlike IFRS for some assets)." }
    ] }

]);
