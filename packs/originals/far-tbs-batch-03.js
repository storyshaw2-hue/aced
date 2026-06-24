/* =============================================================================
   ACED — far-tbs-batch-03.js   (ORIGINAL CONTENT, append-safe)
   -----------------------------------------------------------------------------
   3 original task-based simulations authored from the GAAP rules + the AICPA
   FAR blueprint (Areas I & II). Formats mirror the real exam: a classification
   grid (SCF), a numeric roll-forward (bond discount, effective interest), and a
   numeric/select schedule (deferred taxes). Schema matches far-tbs-batch-01/02.

   NOTE: `source` values were remapped to this pack's module keys
   (F3.M4 = Bonds & Long-Term Debt; F4.M4 = Income Taxes) so the TBS menu labels
   resolve correctly. Math verified against the standards; have a CPA confirm.
   ============================================================================= */
window.ACED_TBS = (window.ACED_TBS || []).concat([

  /* ---- TBS 1: Statement of Cash Flows — classification grid --------------- */
  { source:"F1.M4", diff:"medium",
    title:"Statement of Cash Flows — Classify the Activity",
    scenario:"Maple Ridge Corp prepares its statement of cash flows under U.S. GAAP. For each cash transaction below, identify the section of the statement in which it is reported. Watch the items that are intuitive but classified differently under U.S. GAAP.",
    items:[
      { prompt:"Cash collected from customers for goods sold.",
        type:"select",
        choices:["Operating activities","Investing activities","Financing activities"],
        answer:0,
        explain:"Cash from customers is the core of operations and is an operating inflow." },
      { prompt:"Cash paid to purchase a delivery truck.",
        type:"select",
        choices:["Operating activities","Investing activities","Financing activities"],
        answer:1,
        explain:"Acquiring a long-lived productive asset is an investing outflow." },
      { prompt:"Cash received from issuing a long-term note payable.",
        type:"select",
        choices:["Operating activities","Investing activities","Financing activities"],
        answer:2,
        explain:"Borrowing principal from a creditor is a financing inflow." },
      { prompt:"Cash dividends paid to shareholders.",
        type:"select",
        choices:["Operating activities","Investing activities","Financing activities"],
        answer:2,
        explain:"Dividends paid are a transaction with owners and are financing. (Note: dividends RECEIVED are operating.)" },
      { prompt:"Cash paid for interest on the company's debt.",
        type:"select",
        choices:["Operating activities","Investing activities","Financing activities"],
        answer:0,
        explain:"Under U.S. GAAP interest paid is operating, even though the related principal is financing. This is the classic trap." },
      { prompt:"Cash received from selling an investment in another company's stock.",
        type:"select",
        choices:["Operating activities","Investing activities","Financing activities"],
        answer:1,
        explain:"Buying and selling investments in other entities are investing activities." },
      { prompt:"Cash paid to repurchase the company's own treasury stock.",
        type:"select",
        choices:["Operating activities","Investing activities","Financing activities"],
        answer:2,
        explain:"Treasury stock transactions are with owners over capital and are financing." },
      { prompt:"Cash dividends received from an equity investment.",
        type:"select",
        choices:["Operating activities","Investing activities","Financing activities"],
        answer:0,
        explain:"Under U.S. GAAP interest and dividends received are operating inflows, in contrast to dividends paid (financing)." }
    ] },

  /* ---- TBS 2: Bonds issued at a discount — effective-interest roll-forward - */
  { source:"F3.M4", diff:"hard",
    title:"Bonds Issued at a Discount — Year 1 (Effective Interest)",
    scenario:"On January 1, Year 1, Alder Corp issues $500,000 face value, 5-year bonds with a stated rate of 6% paid annually each December 31. The market (effective) rate at issuance is 8%. Use these factors at 8% for 5 periods: PV of $1 = 0.6806; PV of an ordinary annuity of $1 = 3.9927. Round to the nearest dollar.",
    items:[
      { prompt:"Issue price (cash received) on January 1, Year 1.",
        type:"numeric", answer:460081, tolerance:150,
        explain:"PV of face 500,000 x 0.6806 = 340,300, plus PV of coupons 30,000 x 3.9927 = 119,781, equals $460,081. The bond sells at a discount because the 6% coupon is below the 8% market rate." },
      { prompt:"Cash interest paid each December 31.",
        type:"numeric", answer:30000, tolerance:0,
        explain:"Face x stated rate = 500,000 x 6% = $30,000, fixed every period." },
      { prompt:"Interest expense for Year 1.",
        type:"numeric", answer:36806, tolerance:60,
        explain:"Carrying amount x market rate = 460,081 x 8% = $36,806." },
      { prompt:"Discount amortized during Year 1.",
        type:"numeric", answer:6806, tolerance:60,
        explain:"Interest expense minus cash interest = 36,806 - 30,000 = $6,806." },
      { prompt:"Carrying amount of the bonds at December 31, Year 1.",
        type:"numeric", answer:466887, tolerance:150,
        explain:"Beginning carrying amount plus discount amortized = 460,081 + 6,806 = $466,887." },
      { prompt:"As the discount amortizes over the life of the bonds, interest expense each year:",
        type:"select",
        choices:["Increases","Decreases","Stays constant","Equals the cash interest"],
        answer:0,
        explain:"The carrying amount rises toward face value, so interest expense (carrying amount x market rate) increases each period under a discount." }
    ] },

  /* ---- TBS 3: Deferred income taxes — first-year schedule ----------------- */
  { source:"F4.M4", diff:"hard",
    title:"Deferred Income Taxes — First Year",
    scenario:"In its first year of operations, Birchwood Inc. reports pretax financial income of $800,000. Three differences exist: (1) tax depreciation exceeds book depreciation by $120,000 (will reverse); (2) book income includes $20,000 of interest on tax-exempt municipal bonds; (3) Birchwood accrued $30,000 of warranty expense for books, deductible only when paid in future years. The enacted tax rate is 25%. Round to the nearest dollar.",
    items:[
      { prompt:"Taxable income for the year.",
        type:"numeric", answer:690000, tolerance:0,
        explain:"800,000 - 20,000 muni interest (permanent, never taxed) - 120,000 extra tax depreciation + 30,000 warranty (book expense not yet deductible) = $690,000." },
      { prompt:"Current income tax payable.",
        type:"numeric", answer:172500, tolerance:0,
        explain:"Taxable income x rate = 690,000 x 25% = $172,500." },
      { prompt:"Deferred tax liability from the depreciation difference.",
        type:"numeric", answer:30000, tolerance:0,
        explain:"Future taxable temporary difference 120,000 x 25% = $30,000 DTL." },
      { prompt:"Deferred tax asset from the warranty difference.",
        type:"numeric", answer:7500, tolerance:0,
        explain:"Future deductible temporary difference 30,000 x 25% = $7,500 DTA." },
      { prompt:"Total income tax expense for the year.",
        type:"numeric", answer:195000, tolerance:0,
        explain:"Current 172,500 + net deferred expense (30,000 DTL - 7,500 DTA = 22,500) = $195,000. Check: (800,000 - 20,000 permanent) x 25% = $195,000." },
      { prompt:"The municipal bond interest is best described as:",
        type:"select",
        choices:["A temporary difference creating a deferred tax asset","A temporary difference creating a deferred tax liability","A permanent difference with no deferred tax effect","An error that must be corrected"],
        answer:2,
        explain:"Tax-exempt municipal interest never enters taxable income, so it is a permanent difference and creates no deferred tax. It only lowers the effective rate." }
    ] }

]);
