/* =============================================================================
   ACED — far-tbs-batch-07.js   (ORIGINAL CONTENT, append-safe)
   -----------------------------------------------------------------------------
   8 original task-based simulations covering the remaining high-yield FAR topics:
   not-for-profit net assets & statement of activities (F4.M5), inventory LCNRV +
   gross-profit method (F2.M3), intangibles & R&D (F2.M5), interim/segment
   reporting (F1.M3), a business combination — goodwill & NCI (F2.M6), fair value
   measurement under ASC 820 (F2.M7), a statement of cash flows built from
   balance-sheet changes (F1.M4), and a long-term construction contract recognized
   over time (F2.M1).

   NOTE on sourcing: the pack has no dedicated "consolidations" module, so the
   business-combination sim is filed under F2.M6 (Investments) — the closest fit
   (accounting for an investment in a controlled entity).

   Schema matches far-tbs-batch-01..06:
     { source, diff, title, scenario,
       items:[ { prompt, type:"numeric", answer, tolerance, explain }
             | { prompt, type:"select", choices:[...], answer:<0-based>, explain } ] }

   Every figure worked by hand and cross-checked. Verify against current ASC/GASB
   before badging as reviewed (your call as CPA).
   ============================================================================= */
window.ACED_TBS = (window.ACED_TBS || []).concat([

  /* ---- TBS 1: Not-for-Profit Net Assets & Activities (F4.M5) ------------- */
  { source:"F4.M5", diff:"medium",
    title:"Not-for-Profit — Net Assets and the Statement of Activities",
    scenario:"Helping Hands, a nongovernmental not-for-profit, begins the year with net assets of $500,000 without donor restrictions and $120,000 with donor restrictions. During the year: cash contributions without restriction $300,000; a $100,000 pledge restricted to a program to be run next year; $40,000 of a prior restriction satisfied this year; investment return without restriction $20,000; total program and support expenses $250,000; and donated legal services requiring specialized skills worth $15,000. Round to the nearest dollar.",
    items:[
      { prompt:"The $100,000 pledge restricted for a future program increases:",
        type:"select",
        choices:["Net assets without donor restrictions","Net assets with donor restrictions","A liability","Contributed services"],
        answer:1,
        explain:"A donor-imposed purpose/time restriction increases net assets WITH donor restrictions." },
      { prompt:"When a $40,000 restriction is satisfied, the release:",
        type:"select",
        choices:["Increases net assets with donor restrictions","Increases net assets without donor restrictions and decreases net assets with donor restrictions","Is recorded as a liability","Has no effect on net assets"],
        answer:1,
        explain:"A reclassification moves the amount from net assets with restrictions to net assets without restrictions." },
      { prompt:"Change in net assets WITHOUT donor restrictions for the year.",
        type:"numeric", answer:110000, tolerance:0,
        explain:"Contributions 300,000 + investment return 20,000 + releases 40,000 − expenses 250,000 = $110,000. (Donated services add equal revenue and expense, a net zero.)" },
      { prompt:"Change in net assets WITH donor restrictions for the year.",
        type:"numeric", answer:60000, tolerance:0,
        explain:"New restricted pledge 100,000 − releases 40,000 = $60,000." },
      { prompt:"Total net assets at year-end.",
        type:"numeric", answer:790000, tolerance:0,
        explain:"Without restrictions 610,000 (500,000 + 110,000) + with restrictions 180,000 (120,000 + 60,000) = $790,000." },
      { prompt:"Donated services requiring specialized skills (that would otherwise be purchased) are:",
        type:"select",
        choices:["Never recognized","Recognized as both contribution revenue and an expense (a net zero effect on net assets)","Recognized only as revenue","Recorded as a liability"],
        answer:1,
        explain:"Such services are recognized at fair value as both revenue and expense, so total net assets are unchanged." }
    ] },

  /* ---- TBS 2: Inventory — LCNRV + Gross Profit Method (F2.M3) ------------ */
  { source:"F2.M3", diff:"medium",
    title:"Inventory — Lower of Cost and NRV, and the Gross Profit Method",
    scenario:"Part A: Birch Co. (FIFO) values three inventory items at the lower of cost and net realizable value (item by item): Item X cost $50,000, NRV $46,000; Item Y cost $30,000, NRV $35,000; Item Z cost $20,000, NRV $17,000. Part B: Birch estimates ending inventory by the gross profit method — beginning inventory $80,000, purchases $420,000, net sales $600,000, and a historical gross profit rate of 30%. Round to the nearest dollar.",
    items:[
      { prompt:"Total inventory carrying value under LCNRV (item by item).",
        type:"numeric", answer:93000, tolerance:0,
        explain:"X 46,000 + Y 30,000 (cost is lower) + Z 17,000 = $93,000." },
      { prompt:"Total inventory write-down (loss) recognized.",
        type:"numeric", answer:7000, tolerance:0,
        explain:"X (50,000 − 46,000) 4,000 + Z (20,000 − 17,000) 3,000 = $7,000; Item Y is not written down." },
      { prompt:"Under U.S. GAAP for a FIFO or average-cost company, inventory is measured at:",
        type:"select",
        choices:["Lower of cost or market (with a ceiling and floor)","Lower of cost and net realizable value","Cost only","Net realizable value only"],
        answer:1,
        explain:"FIFO/average-cost inventories use lower of cost and net realizable value; only LIFO/retail use the older lower-of-cost-or-market rule." },
      { prompt:"Estimated cost of goods sold under the gross profit method.",
        type:"numeric", answer:420000, tolerance:0,
        explain:"Sales × (1 − gross profit rate) = 600,000 × 0.70 = $420,000." },
      { prompt:"Estimated ending inventory under the gross profit method.",
        type:"numeric", answer:80000, tolerance:0,
        explain:"Goods available 500,000 (80,000 + 420,000) − estimated COGS 420,000 = $80,000." },
      { prompt:"The gross profit method is acceptable for:",
        type:"select",
        choices:["The annual GAAP financial statements","Interim estimates and casualty-loss claims, but not the annual statements","Tax returns only","All external reporting"],
        answer:1,
        explain:"It is an estimation technique used for interim reporting and insurance claims, not for the annual audited statements." }
    ] },

  /* ---- TBS 3: Intangibles & R&D (F2.M5) --------------------------------- */
  { source:"F2.M5", diff:"medium",
    title:"Intangible Assets and Research & Development",
    scenario:"During the year Cedar Co. incurs: internal R&D salaries and materials $200,000; the purchase of a patent for $90,000 (useful life 10 years, legal life 15); $20,000 of legal fees to successfully defend the patent; goodwill of $500,000 from an acquisition; and $30,000 of startup/organization costs. Round to the nearest dollar.",
    items:[
      { prompt:"Research and development expense recognized for the year.",
        type:"numeric", answer:200000, tolerance:0,
        explain:"Internally incurred R&D is expensed as incurred under U.S. GAAP." },
      { prompt:"Annual amortization of the purchased patent.",
        type:"numeric", answer:9000, tolerance:0,
        explain:"Amortize over the shorter of useful (10) or legal (15) life: 90,000 ÷ 10 = $9,000." },
      { prompt:"Legal fees to SUCCESSFULLY defend the patent are:",
        type:"select",
        choices:["Expensed as incurred","Capitalized (added to the patent)","Ignored","Recorded as goodwill"],
        answer:1,
        explain:"Costs of a successful defense are capitalized; an unsuccessful defense would be expensed (and the patent likely written off)." },
      { prompt:"Goodwill is:",
        type:"select",
        choices:["Amortized over 10 years","Amortized over 40 years","Not amortized; tested for impairment at least annually","Expensed immediately"],
        answer:2,
        explain:"Goodwill is not amortized (for public entities); it is tested for impairment." },
      { prompt:"Startup and organization costs are:",
        type:"select",
        choices:["Capitalized and amortized","Expensed as incurred","Added to goodwill","Recorded as a prepaid asset"],
        answer:1,
        explain:"Startup and organization costs are expensed as incurred." },
      { prompt:"Total amount expensed this year for R&D and startup costs combined.",
        type:"numeric", answer:230000, tolerance:0,
        explain:"R&D 200,000 + startup 30,000 = $230,000 (the patent is capitalized, not expensed)." }
    ] },

  /* ---- TBS 4: Interim & Segment Reporting (F1.M3) ----------------------- */
  { source:"F1.M3", diff:"medium",
    title:"Interim and Segment Reporting",
    scenario:"Walnut Inc. has five operating segments. Combined revenue (external plus intersegment) of all segments is $1,000,000 and combined assets are $2,000,000. Answer the reporting questions and compute the thresholds. Round to the nearest dollar.",
    items:[
      { prompt:"For interim financial reporting under U.S. GAAP, each interim period is viewed as:",
        type:"select",
        choices:["A discrete, standalone period","An integral part of the annual period","Optional and unregulated","Identical to the annual period"],
        answer:1,
        explain:"U.S. GAAP uses the integral view — interim results are a portion of the annual period." },
      { prompt:"Revenue threshold for a reportable segment (10% of combined revenue).",
        type:"numeric", answer:100000, tolerance:0,
        explain:"10% × combined revenue 1,000,000 = $100,000." },
      { prompt:"Assets threshold for a reportable segment (10% of combined assets).",
        type:"numeric", answer:200000, tolerance:0,
        explain:"10% × combined assets 2,000,000 = $200,000." },
      { prompt:"Reportable segments must together account for at least what percentage of total external revenue?",
        type:"select",
        choices:["50%","75%","90%","100%"],
        answer:1,
        explain:"If identified reportable segments are below 75% of external revenue, more must be added until the 75% test is met." },
      { prompt:"An interim period's income tax provision is based on:",
        type:"select",
        choices:["The statutory rate for the quarter","The estimated annual effective tax rate applied to year-to-date income","A flat 21%","The prior year's actual rate"],
        answer:1,
        explain:"Interim tax uses the estimated annual effective rate applied to year-to-date pretax income." },
      { prompt:"A segment is also reportable based on profit or loss if it is at least 10% of:",
        type:"select",
        choices:["Total company revenue","The greater, in absolute value, of total profit of profitable segments or total loss of loss-making segments","Net income","Total assets"],
        answer:1,
        explain:"The profit-or-loss test uses 10% of the greater absolute amount of combined segment profits or combined segment losses." }
    ] },

  /* ---- TBS 5: Business Combination — Goodwill & NCI (F2.M6) -------------- */
  { source:"F2.M6", diff:"hard",
    title:"Business Combination — Goodwill and Noncontrolling Interest",
    scenario:"On January 1, Acq Co. acquires 80% of Target Co. for $640,000 cash. The fair value of Target's identifiable net assets (identifiable assets less liabilities) is $700,000. The acquisition-date fair value of the 20% noncontrolling interest is $160,000. NCI is measured at fair value. Round to the nearest dollar.",
    items:[
      { prompt:"Total acquisition-date fair value of the acquiree (for measuring goodwill).",
        type:"numeric", answer:800000, tolerance:0,
        explain:"Consideration transferred 640,000 + fair value of NCI 160,000 = $800,000." },
      { prompt:"Goodwill recognized in the combination.",
        type:"numeric", answer:100000, tolerance:0,
        explain:"Total fair value 800,000 − fair value of identifiable net assets 700,000 = $100,000." },
      { prompt:"Noncontrolling interest reported at acquisition (fair value method).",
        type:"numeric", answer:160000, tolerance:0,
        explain:"The NCI is reported at its $160,000 acquisition-date fair value." },
      { prompt:"In the acquisition method, identifiable assets acquired and liabilities assumed are measured at:",
        type:"select",
        choices:["The acquirer's carrying amounts","Their acquisition-date fair values","The lower of cost or fair value","The target's historical cost"],
        answer:1,
        explain:"They are recognized at acquisition-date fair value, with the residual to goodwill." },
      { prompt:"Had the fair value of identifiable net assets exceeded the consideration plus NCI, the difference would be:",
        type:"select",
        choices:["Negative goodwill deferred on the balance sheet","A bargain purchase gain recognized in earnings","Added to the assets pro rata","Ignored"],
        answer:1,
        explain:"An excess of net asset fair value over the total fair value is a bargain purchase gain recognized in income." },
      { prompt:"After the acquisition, the recognized goodwill is:",
        type:"select",
        choices:["Amortized over 10 years","Not amortized; tested for impairment","Written off immediately","Remeasured to fair value each period"],
        answer:1,
        explain:"Goodwill is not amortized; it is tested for impairment at the reporting-unit level." }
    ] },

  /* ---- TBS 6: Fair Value Measurement, ASC 820 (F2.M7) ------------------- */
  { source:"F2.M7", diff:"medium",
    title:"Fair Value Measurement — Hierarchy and Definitions",
    scenario:"Classify each fair value input and identify the key ASC 820 concepts for Fir Co.",
    items:[
      { prompt:"A quoted price in an active market for an identical asset is:",
        type:"select",
        choices:["Level 1","Level 2","Level 3","Outside the hierarchy"],
        answer:0,
        explain:"Unadjusted quoted prices in active markets for identical assets are Level 1 — the highest priority." },
      { prompt:"A quoted price for a similar asset, or for an identical asset in an inactive market, is:",
        type:"select",
        choices:["Level 1","Level 2","Level 3","Outside the hierarchy"],
        answer:1,
        explain:"Observable inputs other than Level 1 quoted prices (similar assets, inactive markets) are Level 2." },
      { prompt:"Unobservable inputs reflecting the entity's own assumptions are:",
        type:"select",
        choices:["Level 1","Level 2","Level 3","Outside the hierarchy"],
        answer:2,
        explain:"Unobservable inputs are Level 3 — the lowest priority in the hierarchy." },
      { prompt:"Fair value is defined as:",
        type:"select",
        choices:["The price to acquire an asset (an entry price)","The price to sell an asset in an orderly transaction between market participants at the measurement date (an exit price)","Replacement cost","An entity-specific value"],
        answer:1,
        explain:"Fair value is an exit price in the principal (or most advantageous) market between market participants." },
      { prompt:"For a nonfinancial asset, fair value assumes:",
        type:"select",
        choices:["The entity's intended use","Its highest and best use by market participants","Liquidation value","Historical cost"],
        answer:1,
        explain:"Nonfinancial-asset fair value reflects the highest and best use by market participants." },
      { prompt:"The three valuation approaches permitted are:",
        type:"select",
        choices:["FIFO, LIFO, and average","The market, income, and cost approaches","Historical, current, and present value","Gross, net, and residual"],
        answer:1,
        explain:"ASC 820 describes the market, income, and cost approaches to measuring fair value." }
    ] },

  /* ---- TBS 7: Statement of Cash Flows from Balance-Sheet Changes (F1.M4) - */
  { source:"F1.M4", diff:"hard",
    title:"Statement of Cash Flows — Building the Three Sections",
    scenario:"Pine Co. reports for Year 1: net income $200,000; depreciation $50,000; accounts receivable increased $30,000; inventory decreased $10,000; accounts payable increased $15,000. It purchased equipment for $120,000 cash; sold land (book value $40,000) for $55,000 cash; issued long-term debt for $80,000 cash; and paid $25,000 of dividends. Round to the nearest dollar.",
    items:[
      { prompt:"Net cash provided by OPERATING activities (indirect method).",
        type:"numeric", answer:230000, tolerance:0,
        explain:"200,000 + depreciation 50,000 − gain on land 15,000 − AR increase 30,000 + inventory decrease 10,000 + AP increase 15,000 = $230,000." },
      { prompt:"The gain on the sale of land, within operating activities, is:",
        type:"select",
        choices:["Added to net income","Subtracted from net income (the $55,000 proceeds are an investing inflow)","Reported in financing","Ignored"],
        answer:1,
        explain:"The gain is removed from operations because the full proceeds appear under investing." },
      { prompt:"Net cash USED IN investing activities.",
        type:"numeric", answer:65000, tolerance:0,
        explain:"Equipment purchase 120,000 out − land sale 55,000 in = $65,000 net outflow." },
      { prompt:"Net cash provided by FINANCING activities.",
        type:"numeric", answer:55000, tolerance:0,
        explain:"Long-term debt issued 80,000 − dividends paid 25,000 = $55,000." },
      { prompt:"Net change in cash for the year.",
        type:"numeric", answer:220000, tolerance:0,
        explain:"Operating 230,000 − investing 65,000 + financing 55,000 = $220,000." },
      { prompt:"The equipment purchase is classified as:",
        type:"select",
        choices:["An operating outflow","An investing outflow","A financing outflow","A noncash item"],
        answer:1,
        explain:"Buying a productive long-lived asset is an investing outflow." }
    ] },

  /* ---- TBS 8: Long-Term Construction Contract — Over Time (F2.M1) -------- */
  { source:"F2.M1", diff:"hard",
    title:"Long-Term Construction Contract — Over Time (Cost-to-Cost)",
    scenario:"Builder Co. has a 3-year fixed-price contract for $3,000,000 and recognizes revenue over time using the cost-to-cost (input) method. Year 1: costs incurred $600,000, estimated costs to complete $1,800,000. Year 2: additional costs incurred $1,000,000 (cumulative $1,600,000), estimated costs to complete $400,000. Round to the nearest dollar.",
    items:[
      { prompt:"Revenue recognized in Year 1.",
        type:"numeric", answer:750000, tolerance:0,
        explain:"Percent complete = 600,000 ÷ 2,400,000 = 25%; revenue = 25% × 3,000,000 = $750,000." },
      { prompt:"Gross profit recognized in Year 1.",
        type:"numeric", answer:150000, tolerance:0,
        explain:"Revenue 750,000 − cost 600,000 = $150,000." },
      { prompt:"Cumulative revenue recognized through the end of Year 2.",
        type:"numeric", answer:2400000, tolerance:0,
        explain:"Percent complete = 1,600,000 ÷ 2,000,000 = 80%; cumulative revenue = 80% × 3,000,000 = $2,400,000." },
      { prompt:"Revenue recognized in Year 2.",
        type:"numeric", answer:1650000, tolerance:0,
        explain:"Cumulative revenue 2,400,000 − Year 1 revenue 750,000 = $1,650,000." },
      { prompt:"Gross profit recognized in Year 2.",
        type:"numeric", answer:650000, tolerance:0,
        explain:"Year 2 revenue 1,650,000 − Year 2 cost 1,000,000 = $650,000." },
      { prompt:"This contract qualifies for OVER-TIME recognition because:",
        type:"select",
        choices:["The contract lasts more than one year","The asset created has no alternative use and the entity has an enforceable right to payment for work completed to date","Payment is collected in advance","Title passes only at completion"],
        answer:1,
        explain:"Over-time recognition applies when, for example, the asset has no alternative use to the entity and there is an enforceable right to payment for performance completed to date." }
    ] }

]);
