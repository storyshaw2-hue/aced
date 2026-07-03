/* =============================================================================
   ACED — bar-tbs-batch-04.js   (ORIGINAL CONTENT, append-safe)
   -----------------------------------------------------------------------------
   2 original BAR task-based simulations that extend TBS coverage beyond Area I
   for the first time:
     • B2.M1 — Business Combination: goodwill and noncontrolling interest
     • B3.M1 — Governmental funds: modified-accrual recognition + conversion
   Scenarios, names, and numbers are original; the rules are public GAAP/GASB.

   SCHEMA (matches the far-tbs / bar-tbs batch files):
     { source, diff, title, scenario,
       items:[ { prompt, type:"numeric", answer, tolerance, explain }
             | { prompt, type:"select", choices:[...], answer:<0-based>, explain } ] }

   Load by adding "packs/originals/bar-tbs-batch-04.js" to the TBS banks array
   in study.html.
   ============================================================================= */
window.ACED_TBS = (window.ACED_TBS || []).concat([

  /* ---- TBS 1: Business combination — goodwill & NCI (Area II) ------------ */
  { source:"B2.M1", diff:"hard",
    title:"Business Combination — Goodwill and Noncontrolling Interest",
    scenario:"On January 1, Pinnacle Corp. acquires 80% of the voting stock of Summit Inc. for $640,000 cash. On the acquisition date the fair value of Summit's identifiable net assets is $700,000, and the fair value of the 20% noncontrolling interest is $160,000. Pinnacle uses the acquisition (full-goodwill) method. During the first year Summit reports net income of $50,000.\n\nEnter dollar amounts as numbers.",
    items:[
      { prompt:"Total acquisition-date fair value of Summit (consideration transferred plus the fair value of the noncontrolling interest).",
        type:"numeric", answer:800000, tolerance:10,
        explain:"Total fair value = consideration for the 80% interest ($640,000) + fair value of the 20% NCI ($160,000) = $800,000. (Consistent with an implied 100% value of $640,000 / 0.80 = $800,000.)" },
      { prompt:"Goodwill recognized in the consolidation.",
        type:"numeric", answer:100000, tolerance:10,
        explain:"Goodwill = total fair value of the acquiree − fair value of identifiable net assets = $800,000 − $700,000 = $100,000." },
      { prompt:"Noncontrolling interest reported on the acquisition-date consolidated balance sheet.",
        type:"numeric", answer:160000, tolerance:10,
        explain:"Under the full-goodwill method the NCI is reported at its acquisition-date fair value, $160,000." },
      { prompt:"In the consolidated balance sheet, Summit's identifiable assets are included at:",
        type:"select",
        choices:["100% of their acquisition-date fair value","80% of their acquisition-date fair value","Their pre-acquisition book value","80% of their pre-acquisition book value"],
        answer:0,
        explain:"Consolidation includes 100% of the subsidiary's identifiable assets and liabilities at acquisition-date fair value, even though the parent owns only 80%. The 20% not owned is captured through the noncontrolling interest in equity." },
      { prompt:"Net income attributable to the noncontrolling interest in Year 1 (Summit's net income is $50,000).",
        type:"numeric", answer:10000, tolerance:5,
        explain:"NCI share of income = 20% × $50,000 = $10,000. The remaining $40,000 is attributable to the controlling (parent) interest." },
      { prompt:"After the acquisition, the recognized goodwill is:",
        type:"select",
        choices:["Amortized on a straight-line basis over 10 years","Amortized over its estimated useful life","Not amortized, but tested for impairment at least annually","Written off immediately against retained earnings"],
        answer:2,
        explain:"Under U.S. GAAP, goodwill is not amortized; it is tested for impairment at least annually (private companies may elect an amortization alternative, but the default model is impairment-only)." }
    ] },

  /* ---- TBS 2: Governmental funds — modified accrual & conversion (Area III) */
  { source:"B3.M1", diff:"hard",
    title:"Governmental Funds — Modified Accrual and Government-Wide Conversion",
    scenario:"During the year the General Fund of the City of Westbrook had the following:\n• Property taxes levied $2,000,000; $1,850,000 collected during the year; $90,000 more expected within 60 days of year-end; the remaining $60,000 not expected within 60 days.\n• Salaries paid $1,200,000, plus $40,000 owed at year-end and due early in the next period.\n• Purchased a police vehicle for $35,000 cash.\n• Issued general obligation bonds, receiving $500,000 in proceeds.\n\nEnter dollar amounts as numbers.",
    items:[
      { prompt:"Property tax revenue recognized in the General Fund under modified accrual.",
        type:"numeric", answer:1940000, tolerance:100,
        explain:"Modified accrual recognizes revenue when measurable and available. Available = collected during the year ($1,850,000) plus amounts collectible within ~60 days ($90,000) = $1,940,000. The $60,000 not available within 60 days is a deferred inflow, not revenue." },
      { prompt:"Salaries expenditure recognized in the General Fund.",
        type:"numeric", answer:1240000, tolerance:10,
        explain:"Expenditures are recognized when the fund liability is incurred for items normally paid from current financial resources. Salaries paid ($1,200,000) plus the $40,000 accrued and due shortly = $1,240,000." },
      { prompt:"The $35,000 police vehicle is reported in the General Fund as:",
        type:"select",
        choices:["A capital asset, net of depreciation","An expenditure (capital outlay)","Depreciation expense for the year","An other financing use"],
        answer:1,
        explain:"Governmental funds use the current financial resources measurement focus, so buying a capital asset is recorded as a capital-outlay expenditure. The asset itself (and depreciation) appears only in the government-wide statements." },
      { prompt:"The $500,000 of bond proceeds is reported in the General Fund as:",
        type:"select",
        choices:["Revenue of the period","A long-term liability of the fund","An other financing source","A reduction of expenditures"],
        answer:2,
        explain:"In the fund statements, long-term debt proceeds are reported as an other financing source, not revenue. The bond obligation is not a governmental-fund liability; it appears as a long-term liability only government-wide." },
      { prompt:"When converting to the government-wide statements, the $35,000 vehicle is:",
        type:"select",
        choices:["Capitalized as a capital asset and depreciated over its useful life","Reported as an expenditure, exactly as in the fund","Excluded from the financial statements entirely","Recorded as an other financing use"],
        answer:0,
        explain:"The government-wide statements use the economic resources focus and full accrual, so the capital-outlay expenditure is removed and the vehicle is capitalized and depreciated." },
      { prompt:"In the government-wide statements, the $500,000 of bonds is reported as:",
        type:"select",
        choices:["An other financing source","Revenue of the period","A long-term liability","A direct reduction of net position"],
        answer:2,
        explain:"Government-wide reporting recognizes the bonds as a long-term liability. The 'other financing source' presentation exists only in the governmental-fund statements." }
    ] }

]);
