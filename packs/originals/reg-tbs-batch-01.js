/* =============================================================================
   ACED — reg-tbs-batch-01.js   (ORIGINAL CONTENT, append-safe)
   -----------------------------------------------------------------------------
   REG's first 5 task-based simulations, in the numeric/select TBS format used by
   the FAR/BAR/AUD sim batches. Tax computations are original; the rules are the
   public Internal Revenue Code. Where an inflation-adjusted figure is needed
   (e.g., the standard deduction), it is GIVEN in the scenario so the sim tests
   the computation rather than a memorized threshold.

     • REG.R4 — Individual taxable income          [numeric + select]
     • REG.R5 — Corporate book-to-tax (M-1) & DRD   [numeric + select]
     • REG.R5 — Partner outside basis              [numeric + select]
     • REG.R3 — Property gain: character            [numeric + select]
     • REG.R4 — Itemized deductions                 [numeric + select]

   SCHEMA matches the other *-tbs-batch files. Load by adding
   "packs/originals/reg-tbs-batch-01.js" to the TBS banks array in study.html.
   ============================================================================= */
window.ACED_TBS = (window.ACED_TBS || []).concat([

  /* ---- TBS 1: Individual taxable income (R4) ----------------------------- */
  { source:"REG.R4", diff:"hard",
    title:"Individual Taxable Income",
    scenario:"A single taxpayer with no dependents has the following for the year:\n• Salary: $90,000\n• Taxable interest: $2,000\n• Municipal bond interest: $3,000 (tax-exempt)\n• Above-the-line adjustments: HSA contribution $2,000 and student loan interest $1,000\n• Total itemized deductions available: $8,000\n• Standard deduction (single, given): $14,000\n\nEnter dollar amounts as numbers.",
    items:[
      { prompt:"Gross income included on the return.",
        type:"numeric", answer:92000, tolerance:10,
        explain:"Salary $90,000 + taxable interest $2,000 = $92,000. Municipal bond interest ($3,000) is excluded from gross income." },
      { prompt:"Total above-the-line adjustments to income.",
        type:"numeric", answer:3000, tolerance:10,
        explain:"HSA contribution $2,000 + student loan interest $1,000 = $3,000. Both are adjustments used to arrive at AGI." },
      { prompt:"Adjusted gross income (AGI).",
        type:"numeric", answer:89000, tolerance:10,
        explain:"AGI = gross income $92,000 − adjustments $3,000 = $89,000." },
      { prompt:"Should the taxpayer itemize or take the standard deduction?",
        type:"select",
        choices:["Itemize the $8,000","Take the $14,000 standard deduction","It makes no difference","Neither is allowed"],
        answer:1,
        explain:"The taxpayer takes the larger deduction: the $14,000 standard deduction exceeds the $8,000 of itemized deductions." },
      { prompt:"Taxable income.",
        type:"numeric", answer:75000, tolerance:10,
        explain:"Taxable income = AGI $89,000 − standard deduction $14,000 = $75,000." }
    ] },

  /* ---- TBS 2: Corporate book-to-tax (M-1) & DRD (R5) --------------------- */
  { source:"REG.R5", diff:"hard",
    title:"Corporate Book-to-Tax Reconciliation and DRD",
    scenario:"A C corporation reports book net income (after tax) of $200,000, which reflects:\n• Federal income tax expense: $50,000\n• Municipal bond interest income: $10,000 (not taxable)\n• Meals expense of $8,000, of which 50% ($4,000) is nondeductible\n• Dividends of $20,000 received from a 30%-owned domestic corporation\n\nEnter dollar amounts as numbers.",
    items:[
      { prompt:"Income after the Schedule M-1 adjustments but BEFORE the dividends-received deduction (add back federal tax, subtract municipal interest, add back nondeductible meals).",
        type:"numeric", answer:244000, tolerance:100,
        explain:"$200,000 + federal tax $50,000 − municipal interest $10,000 + nondeductible meals $4,000 = $244,000." },
      { prompt:"Dividends-received deduction (30% ownership).",
        type:"numeric", answer:13000, tolerance:100,
        explain:"For 20%–under-80% ownership, the DRD is 65%: 65% × $20,000 = $13,000." },
      { prompt:"Taxable income.",
        type:"numeric", answer:231000, tolerance:100,
        explain:"$244,000 − DRD $13,000 = $231,000 of taxable income." },
      { prompt:"The municipal bond interest is:",
        type:"select",
        choices:["Added to taxable income","Subtracted in reconciling book income to taxable income (a permanent difference)","Ignored entirely","Taxed at a special 25% rate"],
        answer:1,
        explain:"Municipal interest is in book income but is not taxable, so it is subtracted on Schedule M-1 as a permanent difference." },
      { prompt:"The $4,000 of nondeductible meals is:",
        type:"select",
        choices:["Fully deductible for tax","Added back in reconciling book income to taxable income","A temporary timing difference that reverses later","Eligible for the DRD"],
        answer:1,
        explain:"The nondeductible half of meals is a permanent difference added back to book income to reach taxable income; it never reverses." }
    ] },

  /* ---- TBS 3: Partner outside basis (R5) -------------------------------- */
  { source:"REG.R5", diff:"medium",
    title:"Partner's Outside Basis",
    scenario:"A partner's outside basis at the beginning of the year is $50,000. During the year the partner's Schedule K-1 and the partnership show:\n• Share of ordinary business income: $20,000\n• Share of tax-exempt income: $2,000\n• Increase in the partner's share of partnership liabilities: $10,000\n• Cash distribution to the partner: $15,000\n• Share of nondeductible expenses: $1,000\n\nEnter dollar amounts as numbers.",
    items:[
      { prompt:"Total additions to basis (ordinary income + tax-exempt income + increase in share of liabilities).",
        type:"numeric", answer:32000, tolerance:100,
        explain:"$20,000 ordinary income + $2,000 tax-exempt income + $10,000 liability increase = $32,000. Tax-exempt income increases basis so the exclusion is preserved; a liability increase is treated as a cash contribution." },
      { prompt:"Total reductions to basis (distribution + nondeductible expenses).",
        type:"numeric", answer:16000, tolerance:100,
        explain:"$15,000 cash distribution + $1,000 nondeductible expenses = $16,000. Nondeductible expenses reduce basis even though they are not deductible." },
      { prompt:"Ending outside basis.",
        type:"numeric", answer:66000, tolerance:100,
        explain:"$50,000 + additions $32,000 − reductions $16,000 = $66,000." },
      { prompt:"A cash distribution's effect on the partner's basis is to:",
        type:"select",
        choices:["Increase it","Decrease it, but not below zero","Have no effect","Convert it to capital gain automatically"],
        answer:1,
        explain:"A distribution reduces outside basis (never below zero); cash exceeding basis triggers gain, but the distribution itself decreases basis." },
      { prompt:"An increase in the partner's share of partnership liabilities is:",
        type:"select",
        choices:["A distribution that decreases basis","Treated as a contribution of money that increases basis","Ignored for basis","Taxable income to the partner"],
        answer:1,
        explain:"An increase in a partner's share of liabilities is deemed a cash contribution that increases outside basis; a decrease is deemed a cash distribution." }
    ] },

  /* ---- TBS 4: Property gain character (R3) ------------------------------ */
  { source:"REG.R3", diff:"hard",
    title:"Property Gain — Character of the Gain",
    scenario:"A business sells a machine (Section 1231 property). Original cost was $100,000; accumulated depreciation is $60,000; the machine is sold for $110,000. Assume there are no other §1231 transactions and no nonrecaptured §1231 losses in the lookback period.\n\nEnter dollar amounts as numbers.",
    items:[
      { prompt:"Adjusted basis of the machine.",
        type:"numeric", answer:40000, tolerance:10,
        explain:"Adjusted basis = cost $100,000 − accumulated depreciation $60,000 = $40,000." },
      { prompt:"Total realized gain.",
        type:"numeric", answer:70000, tolerance:10,
        explain:"Amount realized $110,000 − adjusted basis $40,000 = $70,000 gain." },
      { prompt:"Amount taxed as ordinary income under Section 1245 depreciation recapture.",
        type:"numeric", answer:60000, tolerance:10,
        explain:"§1245 recaptures the lesser of the gain ($70,000) or the depreciation taken ($60,000) as ordinary income = $60,000." },
      { prompt:"Remaining Section 1231 gain (the portion eligible for long-term capital gain treatment).",
        type:"numeric", answer:10000, tolerance:10,
        explain:"Gain $70,000 − §1245 ordinary recapture $60,000 = $10,000, which represents the gain above original cost and is §1231 gain." },
      { prompt:"The remaining net §1231 gain is:",
        type:"select",
        choices:["Ordinary income","Treated as long-term capital gain","A nondeductible loss","Tax-exempt"],
        answer:1,
        explain:"A net §1231 gain (after recapture and lookback) is treated as long-term capital gain, receiving preferential treatment." }
    ] },

  /* ---- TBS 5: Itemized deductions (R4) ---------------------------------- */
  { source:"REG.R4", diff:"hard",
    title:"Itemized Deductions",
    scenario:"A married-filing-jointly couple has AGI of $150,000 and these expenses:\n• Unreimbursed medical expenses: $15,000\n• State and local taxes (income + property): $14,000\n• Home mortgage interest on $600,000 of acquisition debt: $18,000\n• Cash charitable contributions to public charities: $10,000\n• Standard deduction (MFJ, given): $29,000\n\nEnter dollar amounts as numbers.",
    items:[
      { prompt:"Deductible medical expense (after the AGI floor).",
        type:"numeric", answer:3750, tolerance:10,
        explain:"Medical is deductible above 7.5% of AGI: $150,000 × 7.5% = $11,250 floor; $15,000 − $11,250 = $3,750." },
      { prompt:"Deductible state and local taxes.",
        type:"numeric", answer:10000, tolerance:10,
        explain:"State and local taxes are capped at $10,000 (MFJ), so only $10,000 of the $14,000 is deductible." },
      { prompt:"Total allowable itemized deductions.",
        type:"numeric", answer:41750, tolerance:50,
        explain:"Medical $3,750 + SALT $10,000 + mortgage interest $18,000 (acquisition debt $600,000 < $750,000 limit) + charitable $10,000 (within 60% of AGI) = $41,750." },
      { prompt:"Should the couple itemize or take the standard deduction?",
        type:"select",
        choices:["Take the $29,000 standard deduction","Itemize, because $41,750 exceeds $29,000","It makes no difference","Neither is permitted"],
        answer:1,
        explain:"They itemize because total itemized deductions of $41,750 exceed the $29,000 standard deduction." },
      { prompt:"The state and local tax deduction was limited because:",
        type:"select",
        choices:["Charitable gifts reduce it","State and local taxes are capped at $10,000","Medical expenses used it up","Mortgage interest is not deductible"],
        answer:1,
        explain:"The SALT deduction is capped at $10,000 ($5,000 MFS), so $4,000 of the $14,000 paid is nondeductible." }
    ] }

]);
