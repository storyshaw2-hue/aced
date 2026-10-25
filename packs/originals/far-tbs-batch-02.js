/* =============================================================================
   ACED — far-tbs-batch3.js   (ORIGINAL CONTENT, append-safe)
   -----------------------------------------------------------------------------
   4 original task-based simulations in high-yield areas not yet covered by
   batch1 (bond amortization, deferred taxes, bank reconciliation) or batch2
   (lease, equity method): income tax provision, revenue allocation &
   recognition, goodwill & NCI at acquisition, inventory estimation + LCNRV.

   SCHEMA: { source, diff, title, scenario,
             items:[ {prompt,type:"numeric",answer,tolerance,explain}
                   | {prompt,type:"select",choices:[...],answer:<0-based>,explain} ] }

   NOTE: study.html renders MCQs only — a numeric+select TBS renderer is still a
   dev task before these are playable in-game.
   *** Drafts. Verify against current ASC before shipping.
   ============================================================================= */
window.ACED_TBS = (window.ACED_TBS || []).concat([

  /* ---- TBS 1: Income tax provision (current + deferred + effective rate) --- */
  { source:"F4.M4", diff:"hard",
    title:"Income Tax Provision — Current, Deferred, and Effective Rate",
    scenario:"Penn Company reports pretax financial income of $1,000,000 for Year 1. It includes $50,000 of interest earned on municipal bonds (never taxable). Tax depreciation exceeds book depreciation by $200,000 (a taxable temporary difference expected to reverse in future years). The enacted tax rate is 21% for all years. There are no other differences and no beginning deferred balances.",
    items:[
      { prompt:"Taxable income for Year 1.",
        type:"numeric", answer:750000, tolerance:0,
        explain:"Start with pretax income, remove the permanent item, and subtract the taxable temporary difference: 1,000,000 − 50,000 (municipal interest, never taxable) − 200,000 (excess tax depreciation) = $750,000." },
      { prompt:"Current income tax expense (taxes payable) for Year 1.",
        type:"numeric", answer:157500, tolerance:0,
        explain:"Current tax = taxable income × rate = 750,000 × 21% = $157,500." },
      { prompt:"Deferred tax expense for Year 1.",
        type:"numeric", answer:42000, tolerance:0,
        explain:"The $200,000 taxable temporary difference creates a deferred tax liability: 200,000 × 21% = $42,000 of deferred tax expense (the change in the DTL)." },
      { prompt:"Total income tax expense for Year 1.",
        type:"numeric", answer:199500, tolerance:0,
        explain:"Total tax expense = current + deferred = 157,500 + 42,000 = $199,500." },
      { prompt:"How does the municipal bond interest affect the effective tax rate?",
        type:"select",
        choices:["It lowers the effective rate below the statutory rate","It raises the effective rate above the statutory rate","It has no effect on the effective rate","It creates a deferred tax asset"],
        answer:0,
        explain:"Tax-exempt income is a permanent difference that reduces tax expense relative to book income, so the effective rate (199,500 / 1,000,000 = 19.95%) falls below the 21% statutory rate." }
    ] },

  /* ---- TBS 2: Revenue — allocate transaction price & recognize ------------- */
  { source:"F2.M1", diff:"medium",
    title:"Revenue — Allocation and Recognition Timing",
    scenario:"Marr Company enters a contract to deliver equipment and provide a two-year service plan for a single bundled price of $108,000. The standalone selling price of the equipment is $90,000 and of the service plan is $30,000. Control of the equipment transfers at delivery; the service plan is provided evenly over two years.",
    items:[
      { prompt:"Transaction price allocated to the equipment.",
        type:"numeric", answer:81000, tolerance:0,
        explain:"Allocate by relative standalone selling price: 108,000 × 90,000 / 120,000 = $81,000." },
      { prompt:"Transaction price allocated to the service plan.",
        type:"numeric", answer:27000, tolerance:0,
        explain:"108,000 × 30,000 / 120,000 = $27,000 (the two allocations sum to the $108,000 contract price)." },
      { prompt:"Revenue recognized on the equipment in Year 1.",
        type:"numeric", answer:81000, tolerance:0,
        explain:"Control of the equipment transfers at delivery — a point in time — so the full $81,000 is recognized in Year 1." },
      { prompt:"Revenue recognized on the service plan in Year 1.",
        type:"numeric", answer:13500, tolerance:0,
        explain:"The service is satisfied over time (the customer consumes the benefit evenly), so recognize 27,000 ÷ 2 = $13,500 in Year 1." },
      { prompt:"How is the service plan recognized?",
        type:"select",
        choices:["At a point in time when the contract is signed","Over time as the service is provided","Entirely in Year 2 when the plan ends","Only when the customer uses the service"],
        answer:1,
        explain:"A stand-ready service the customer consumes as the entity performs is satisfied over time, so its allocated price is recognized ratably across the service period." }
    ] },

  /* ---- TBS 3: Goodwill & NCI at acquisition -------------------------------- */
  { source:"F2.M6", diff:"hard",
    title:"Business Combination — Goodwill and Noncontrolling Interest",
    scenario:"On January 1, Year 1, Pare Company acquired 80% of Shel Company by transferring consideration of $800,000. At that date the fair value of the 20% noncontrolling interest was $190,000, and the fair value of Shel's identifiable net assets was $850,000. Pare incurred $30,000 of legal and advisory fees for the acquisition.",
    items:[
      { prompt:"Goodwill recognized in the combination.",
        type:"numeric", answer:140000, tolerance:0,
        explain:"Goodwill = consideration + fair value of NCI − fair value of identifiable net assets = 800,000 + 190,000 − 850,000 = $140,000." },
      { prompt:"Noncontrolling interest reported in consolidated equity at the acquisition date.",
        type:"numeric", answer:190000, tolerance:0,
        explain:"Under U.S. GAAP the NCI is measured at its acquisition-date fair value, $190,000, and presented within consolidated equity, separate from the parent's equity." },
      { prompt:"How should the $30,000 of legal and advisory fees be accounted for?",
        type:"select",
        choices:["Expensed as incurred","Capitalized as part of the consideration transferred","Added to goodwill","Recorded as a reduction of noncontrolling interest"],
        answer:0,
        explain:"Acquisition-related costs are expensed as incurred; they are not part of the consideration transferred and do not affect goodwill." },
      { prompt:"Which method is required to account for this combination?",
        type:"select",
        choices:["The pooling-of-interests method","The equity method","The acquisition method","Proportionate consolidation"],
        answer:2,
        explain:"Business combinations are accounted for using the acquisition method; pooling is prohibited, and control (>50%) requires consolidation rather than the equity method." }
    ] },

  /* ---- TBS 4: Inventory — gross profit method then LCNRV -------------------- */
  { source:"F2.M3", diff:"medium",
    title:"Inventory — Gross Profit Estimate and LCNRV",
    scenario:"Oste Company needs to estimate inventory destroyed in a fire. Beginning inventory was $80,000, purchases for the period were $400,000, and net sales were $500,000. The company's normal gross profit rate is 30%. Separately, surviving goods that cost $50,000 have a net realizable value of $44,000.",
    items:[
      { prompt:"Estimated cost of goods sold using the gross profit method.",
        type:"numeric", answer:350000, tolerance:0,
        explain:"COGS = net sales × (1 − gross profit rate) = 500,000 × 70% = $350,000." },
      { prompt:"Estimated ending inventory before the fire (gross profit method).",
        type:"numeric", answer:130000, tolerance:0,
        explain:"Ending inventory = beginning + purchases − COGS = 80,000 + 400,000 − 350,000 = $130,000." },
      { prompt:"Carrying amount of the surviving goods after applying LCNRV.",
        type:"numeric", answer:44000, tolerance:0,
        explain:"Under lower of cost and NRV, the surviving goods are written down from $50,000 cost to their $44,000 NRV." },
      { prompt:"Under U.S. GAAP, may the LCNRV write-down be reversed if NRV later recovers?",
        type:"select",
        choices:["Yes, up to the original cost","No, write-downs are not reversed","Yes, without limit","Only if the recovery occurs in the same year"],
        answer:1,
        explain:"U.S. GAAP prohibits reversing inventory write-downs (IFRS permits reversal up to original cost — a common switch-point trap)." }
    ] }

]);
