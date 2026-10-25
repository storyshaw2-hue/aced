/* =============================================================================
   ACED — aud-tbs-batch-02.js   (ORIGINAL CONTENT, append-safe)
   -----------------------------------------------------------------------------
   5 more AUD task-based simulations, modeled on the skills emphasized in the
   Becker AUD TBS sets (analytical/ratio review, fraud risk assessment,
   substantive testing of receivables and cash, and materiality determination).
   These complement aud-tbs-batch-01 (opinions, audit risk, attribute sampling,
   control deficiencies, independence). Scenarios and numbers are original; the
   rules are public AICPA/PCAOB standards.

     • AUD.A3 — Substantive analytical procedures (ratio analysis)   [numeric]
     • AUD.A2 — Fraud risk assessment                                [select]
     • AUD.A3 — Substantive testing: accounts receivable & allowance [numeric]
     • AUD.A3 — Bank reconciliation and cash                         [numeric]
     • AUD.A2 — Materiality determination                            [numeric]

   SCHEMA (matches the far-tbs / bar-tbs / aud-tbs batch files):
     { source, diff, title, scenario,
       items:[ { prompt, type:"numeric", answer, tolerance, explain }
             | { prompt, type:"select", choices:[...], answer:<0-based>, explain } ] }

   Load by adding "packs/originals/aud-tbs-batch-02.js" to the TBS banks array
   in study.html.
   ============================================================================= */
window.ACED_TBS = (window.ACED_TBS || []).concat([

  /* ---- TBS 1: Substantive analytical procedures — ratio analysis (A3) ---- */
  { source:"AUD.A3", diff:"hard",
    title:"Substantive Analytical Procedures — Ratio Analysis",
    scenario:"As part of substantive analytical procedures, the auditor computes key ratios from the client's data:\n• Current assets $600,000; current liabilities $250,000\n• Net credit sales $1,800,000; average accounts receivable $200,000\n• Cost of goods sold $1,200,000; average inventory $150,000\n• Gross profit $600,000 on net sales of $1,800,000\n\nEnter ratios to one decimal place; use 365 days in the year.",
    items:[
      { prompt:"Current ratio.",
        type:"numeric", answer:2.4, tolerance:0.1,
        explain:"Current ratio = current assets ÷ current liabilities = $600,000 ÷ $250,000 = 2.4." },
      { prompt:"Accounts receivable turnover (times).",
        type:"numeric", answer:9, tolerance:0.2,
        explain:"AR turnover = net credit sales ÷ average accounts receivable = $1,800,000 ÷ $200,000 = 9.0 times." },
      { prompt:"Days sales outstanding (days).",
        type:"numeric", answer:40.6, tolerance:1.5,
        explain:"Days sales outstanding = 365 ÷ AR turnover = 365 ÷ 9.0 ≈ 40.6 days." },
      { prompt:"Inventory turnover (times).",
        type:"numeric", answer:8, tolerance:0.2,
        explain:"Inventory turnover = cost of goods sold ÷ average inventory = $1,200,000 ÷ $150,000 = 8.0 times." },
      { prompt:"Gross margin percentage (enter as a percent, e.g., 33.3).",
        type:"numeric", answer:33.3, tolerance:0.5,
        explain:"Gross margin % = gross profit ÷ net sales = $600,000 ÷ $1,800,000 = 33.3%." },
      { prompt:"The gross margin percentage is sharply higher than both the prior year and the industry. The auditor should:",
        type:"select",
        choices:["Conclude the results are favorable and perform no further work","Investigate the unexpected fluctuation as a possible risk of material misstatement","Automatically issue an adverse opinion","Lower planning materiality in response"],
        answer:1,
        explain:"A significant unexpected fluctuation identified by analytical procedures signals a possible risk of material misstatement to investigate. A favorable-looking change is not self-explanatory, and it does not by itself dictate an opinion or a materiality change." }
    ] },

  /* ---- TBS 2: Fraud risk assessment (A2) --------------------------------- */
  { source:"AUD.A2", diff:"medium",
    title:"Fraud Risk Assessment",
    scenario:"During planning, the auditor considers conditions at the client. For each item, identify the fraud-triangle element it represents or the appropriate auditor response.",
    items:[
      { prompt:"Management faces intense pressure to meet analysts' earnings targets to support the stock price. This is a fraud risk factor representing:",
        type:"select",
        choices:["Incentive/pressure","Opportunity","Rationalization","A compensating control"],
        answer:0,
        explain:"Pressure to hit earnings targets is an incentive/pressure condition — one of the three fraud-triangle elements." },
      { prompt:"A single employee has sole, unsupervised control over both cash receipts and their recording. This represents:",
        type:"select",
        choices:["Incentive/pressure","Rationalization","Opportunity","An analytical procedure"],
        answer:2,
        explain:"Weak segregation of duties gives a person the opportunity to commit and conceal fraud — the 'opportunity' element." },
      { prompt:"Management habitually justifies aggressive accounting with the attitude that 'everyone in the industry does it.' This represents:",
        type:"select",
        choices:["Opportunity","Rationalization/attitude","A test of controls","Incentive/pressure"],
        answer:1,
        explain:"An attitude that excuses or justifies improper accounting is the rationalization element of the fraud triangle." },
      { prompt:"To address the risk of management override of controls, the auditor should, among other things:",
        type:"select",
        choices:["Rely solely on management's representations","Examine journal entries and review estimates for bias","Reduce substantive testing","Skip the engagement-team discussion"],
        answer:1,
        explain:"Required responses to management override include examining journal entries and other adjustments, reviewing accounting estimates for bias, and evaluating significant unusual transactions." },
      { prompt:"The auditor's responsibility with respect to fraud is to:",
        type:"select",
        choices:["Detect every instance of fraud regardless of concealment","Obtain reasonable assurance the statements are free of material misstatement whether from fraud or error","Guarantee no fraud has occurred","Investigate only immaterial fraud"],
        answer:1,
        explain:"The auditor seeks reasonable assurance that the statements are free of material misstatement due to fraud or error — not a guarantee, and not detection of every concealed fraud." }
    ] },

  /* ---- TBS 3: Substantive testing — receivables & allowance (A3) --------- */
  { source:"AUD.A3", diff:"hard",
    title:"Substantive Testing — Accounts Receivable and Allowance",
    scenario:"The auditor tests accounts receivable. Recorded gross accounts receivable total $500,000. Using aging, the auditor estimates the allowance for doubtful accounts as: current balances $400,000 at 1%, plus past-due balances $100,000 at 10%. Positive confirmations were sent for a sample; $15,000 of those confirmations were not returned.\n\nEnter dollar amounts as numbers.",
    items:[
      { prompt:"Estimated allowance for doubtful accounts based on the aging.",
        type:"numeric", answer:14000, tolerance:100,
        explain:"Allowance = ($400,000 × 1%) + ($100,000 × 10%) = $4,000 + $10,000 = $14,000." },
      { prompt:"Net realizable value of accounts receivable.",
        type:"numeric", answer:486000, tolerance:100,
        explain:"Net realizable value = gross receivables − allowance = $500,000 − $14,000 = $486,000." },
      { prompt:"For the $15,000 of confirmations that were not returned, the auditor should:",
        type:"select",
        choices:["Assume those balances are fairly stated","Perform alternative procedures, such as examining subsequent cash receipts and shipping documents","Immediately propose a write-off","Send negative confirmations instead"],
        answer:1,
        explain:"Non-responses to positive confirmations are followed up with alternative procedures — examining subsequent cash receipts and the underlying shipping and sales documents. Assuming fairness or writing off is not appropriate." },
      { prompt:"Confirming accounts receivable directly with customers primarily provides evidence about which assertion?",
        type:"select",
        choices:["Existence","Completeness","Presentation","Rights that have been pledged"],
        answer:0,
        explain:"Confirmation tests whether recorded receivables exist and are owed. It gives little assurance about completeness (unrecorded receivables are not confirmed) or valuation." },
      { prompt:"The allowance for doubtful accounts primarily addresses which assertion for receivables?",
        type:"select",
        choices:["Existence","Valuation and allocation (net realizable value)","Rights and obligations","Cutoff"],
        answer:1,
        explain:"The allowance reduces receivables to net realizable value, addressing the valuation and allocation assertion. Existence and rights are separate assertions." }
    ] },

  /* ---- TBS 4: Bank reconciliation and cash (A3) -------------------------- */
  { source:"AUD.A3", diff:"hard",
    title:"Bank Reconciliation and Cash",
    scenario:"The auditor examines the client's year-end bank reconciliation and the related items:\n• Balance per bank statement: $50,000\n• Deposits in transit: $8,000\n• Outstanding checks: $12,000\n• A bank error charged the client $1,000 for another customer's check (the bank owes it back)\n• Unrecorded bank service charge: $200\n• Unrecorded customer NSF check: $1,500\n\nEnter dollar amounts as numbers.",
    items:[
      { prompt:"Adjusted (true) cash balance computed from the bank side.",
        type:"numeric", answer:47000, tolerance:10,
        explain:"Adjusted bank balance = $50,000 + deposits in transit $8,000 − outstanding checks $12,000 + bank error $1,000 = $47,000." },
      { prompt:"Unadjusted balance per the client's books (before the book-side adjustments).",
        type:"numeric", answer:48700, tolerance:10,
        explain:"The book balance must reconcile to $47,000 after deducting the unrecorded service charge and NSF check: book − $200 − $1,500 = $47,000, so the unadjusted book balance is $48,700." },
      { prompt:"Deposits in transit are:",
        type:"select",
        choices:["Added to the bank balance","Subtracted from the bank balance","Added to the book balance","Ignored in the reconciliation"],
        answer:0,
        explain:"Deposits in transit have been recorded by the client but not yet by the bank, so they are added to the bank balance." },
      { prompt:"The unrecorded NSF check and bank service charge are:",
        type:"select",
        choices:["Adjustments to the bank balance","Adjustments to the book balance that require adjusting journal entries","Not reconciling items at all","Added to the book balance"],
        answer:1,
        explain:"Items the bank has recorded but the client has not (service charges, NSF checks) are book-side adjustments and require adjusting entries on the client's records." },
      { prompt:"The auditor obtains a cutoff bank statement primarily to:",
        type:"select",
        choices:["Detect kiting among affiliated entities","Verify that the year-end reconciling items (deposits in transit and outstanding checks) cleared as expected","Confirm loan covenant compliance","Test payroll disbursements"],
        answer:1,
        explain:"A cutoff bank statement lets the auditor confirm that reconciling items cleared shortly after year-end. Kiting is addressed by an interbank transfer schedule." }
    ] },

  /* ---- TBS 5: Materiality determination (A2) ----------------------------- */
  { source:"AUD.A2", diff:"medium",
    title:"Materiality Determination",
    scenario:"The auditor of a profit-oriented company sets materiality using the firm's policy: overall materiality = 5% of pretax income; performance materiality = 75% of overall materiality; the clearly-trivial threshold = 5% of overall materiality. The client's pretax income is $2,000,000.\n\nEnter dollar amounts as numbers.",
    items:[
      { prompt:"Overall (financial-statement) materiality.",
        type:"numeric", answer:100000, tolerance:1000,
        explain:"Overall materiality = 5% × pretax income = 5% × $2,000,000 = $100,000." },
      { prompt:"Performance materiality.",
        type:"numeric", answer:75000, tolerance:1000,
        explain:"Performance materiality = 75% × overall materiality = 75% × $100,000 = $75,000." },
      { prompt:"Clearly-trivial threshold (below which misstatements need not be accumulated).",
        type:"numeric", answer:5000, tolerance:100,
        explain:"Clearly-trivial threshold = 5% × overall materiality = 5% × $100,000 = $5,000." },
      { prompt:"Performance materiality is set below overall materiality in order to:",
        type:"select",
        choices:["Reduce the audit fee","Provide a margin for undetected and aggregated misstatements","Eliminate substantive testing","Satisfy an independence rule"],
        answer:1,
        explain:"Setting performance materiality below overall materiality reduces the chance that the total of undetected and aggregated misstatements exceeds overall materiality." },
      { prompt:"Pretax income was chosen as the benchmark because it:",
        type:"select",
        choices:["Is the smallest available number","Is a key measure of interest to users of a profit-oriented entity's statements","Is required for every entity regardless of type","Eliminates the need for judgment"],
        answer:1,
        explain:"For a profit-oriented entity, earnings (pretax income) is typically a benchmark of high interest to users. The choice of benchmark is a matter of judgment and depends on the entity." }
    ] }

]);
