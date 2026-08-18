/* packs/originals/far-tbs-advanced-types-01.js
   Original FAR simulations demonstrating ACED's v15 task types.

   These cases were authored from public rules and the 2026 AICPA CPA Exam Blueprint.
   They do not reproduce or adapt any released exam question or test-prep scenario.

   Sources:
   - AICPA 2026 CPA Exam Blueprints:
     https://assets.ctfassets.net/rb9cdnjh59cm/71s84dkfo3KEsoLlz4vv6G/f4314469ec5368b5b4dd0d0184f00a71/CPA_Exam_Blueprints_2026.pdf
   - FASB Accounting Standards Codification access:
     https://asc.fasb.org/
   - FASB Accounting Standards Codification topic 230 (Statement of Cash Flows):
     https://asc.fasb.org/topic&trid=2128923
*/
window.ACED_TBS = (window.ACED_TBS || []).concat([

  /* ---------------- Receivables rollforward + correcting entry ---------------- */
  {
    id:"far-v15-receivables-rollforward",
    schema:2,
    source:"F2.M2",
    diff:"hard",
    title:"Allowance Rollforward — Reconcile and Correct",
    scenario:"Brightwater Distributors is closing its June 30 books. Use the allowance ledger, write-off log, cash receipts journal, and aging analysis to complete the rollforward. Then prepare the entry that brings the general ledger allowance to the amount supported by the aging analysis.",
    exhibits:[
      {label:"EXHIBIT A · ALLOWANCE LEDGER",content:"Beginning credit balance: $142,500\nCredit-loss expense recorded: $96,000\nEnding GL credit balance: $154,300"},
      {label:"EXHIBIT B · SUBLEDGER ACTIVITY",content:"Accounts written off: $88,300\nRecoveries of prior write-offs: $4,100"},
      {label:"EXHIBIT C · YEAR-END AGING",content:"Gross trade receivables: $2,910,000\nRequired ending allowance: $153,200"}
    ],
    references:[
      "https://asc.fasb.org/",
      "https://assets.ctfassets.net/rb9cdnjh59cm/71s84dkfo3KEsoLlz4vv6G/f4314469ec5368b5b4dd0d0184f00a71/CPA_Exam_Blueprints_2026.pdf"
    ],
    items:[
      {
        id:"allowance-rollforward",
        type:"table_grid",
        prompt:"Complete the allowance rollforward. Enter decreases as negative amounts.",
        columns:[{key:"amount",label:"Amount",type:"numeric"}],
        rows:[
          {id:"beginning",label:"Beginning allowance",answer:{amount:142500}},
          {id:"expense",label:"Credit-loss expense",answer:{amount:96000}},
          {id:"writeoffs",label:"Write-offs",answer:{amount:-88300}},
          {id:"recoveries",label:"Recoveries",answer:{amount:4100}},
          {id:"unadjusted",label:"Unadjusted ending allowance",answer:{amount:154300}},
          {id:"required",label:"Required ending allowance",answer:{amount:153200}},
          {id:"adjustment",label:"Required adjustment",answer:{amount:-1100}}
        ],
        explain:"The unadjusted allowance is $142,500 + $96,000 − $88,300 + $4,100 = $154,300. The aging supports $153,200, so the allowance must decrease by $1,100."
      },
      {
        id:"allowance-correcting-entry",
        type:"journal_entry",
        prompt:"Prepare the June 30 entry that adjusts the allowance from $154,300 to the $153,200 amount supported by the aging analysis. Omit unused rows.",
        accounts:[
          {id:"allowance",label:"Allowance for credit losses"},
          {id:"credit-loss-expense",label:"Credit-loss expense"},
          {id:"accounts-receivable",label:"Accounts receivable"},
          {id:"cash",label:"Cash"}
        ],
        rowCount:3,
        answer:[
          {account:"allowance",debit:1100,credit:0},
          {account:"credit-loss-expense",debit:0,credit:1100}
        ],
        tolerance:0,
        explain:"The supported contra-asset balance is $1,100 lower than the GL balance. Debit the allowance and credit credit-loss expense to reduce both the allowance and the current-period provision."
      }
    ]
  },

  /* ---------------- Nongovernmental NFP statement completion ---------------- */
  {
    id:"far-v15-nfp-statement-activities",
    schema:2,
    source:"F4.M6",
    diff:"hard",
    title:"NFP Statement of Activities — Complete the Columns",
    scenario:"Cedarline Community Literacy Foundation is a nongovernmental not-for-profit. Complete its statement of activities for the year ended December 31. Enter decreases and expenses as negative amounts.",
    exhibits:[
      {label:"EXHIBIT A · CURRENT-YEAR ACTIVITY",content:"Contributions without donor restrictions: $412,000\nContributions restricted for a tutoring center: $185,000\nInvestment income without donor restrictions: $21,500\nNet assets released from restriction: $130,000"},
      {label:"EXHIBIT B · EXPENSES",content:"Program services: $298,000\nManagement and general: $74,000\nFundraising: $52,000"},
      {label:"EXHIBIT C · BEGINNING NET ASSETS",content:"Without donor restrictions: $610,000\nWith donor restrictions: $240,000"}
    ],
    references:[
      "https://asc.fasb.org/",
      "https://assets.ctfassets.net/rb9cdnjh59cm/71s84dkfo3KEsoLlz4vv6G/f4314469ec5368b5b4dd0d0184f00a71/CPA_Exam_Blueprints_2026.pdf"
    ],
    items:[
      {
        id:"statement-grid",
        type:"table_grid",
        prompt:"Complete the statement. Enter each amount in all three columns.",
        columns:[
          {key:"without",label:"Without donor restrictions",type:"numeric"},
          {key:"with",label:"With donor restrictions",type:"numeric"},
          {key:"total",label:"Total",type:"numeric"}
        ],
        rows:[
          {id:"contrib-without",label:"Contributions — without restrictions",answer:{without:412000,with:0,total:412000}},
          {id:"contrib-with",label:"Contributions — with restrictions",answer:{without:0,with:185000,total:185000}},
          {id:"investment",label:"Investment income",answer:{without:21500,with:0,total:21500}},
          {id:"release",label:"Net assets released from restrictions",answer:{without:130000,with:-130000,total:0}},
          {id:"expenses",label:"Total expenses",answer:{without:-424000,with:0,total:-424000}},
          {id:"change",label:"Change in net assets",answer:{without:139500,with:55000,total:194500}},
          {id:"beginning",label:"Net assets — beginning",answer:{without:610000,with:240000,total:850000}},
          {id:"ending",label:"Net assets — ending",answer:{without:749500,with:295000,total:1044500}}
        ],
        explain:"All expenses are reported in the without-donor-restrictions column. A release adds $130,000 to without-restriction activity and subtracts the same amount from with-restriction activity, with no total effect."
      }
    ]
  },

  /* ---------------- Exhibit review / subsequent events ---------------- */
  {
    id:"far-v15-subsequent-event-review",
    schema:2,
    source:"F1.M2",
    diff:"hard",
    title:"Subsequent Events — Review the Exhibits",
    scenario:"Northline Robotics has a December 31 year-end and expects to issue its financial statements on February 28. Review the three exhibits and select every conclusion supported by the facts.",
    exhibits:[
      {label:"EXHIBIT A · LEGAL LETTER",content:"A customer filed a product-liability claim on October 12. At December 31, counsel considered a loss probable and estimated a $1.8–$2.4 million range, with no amount a better estimate."},
      {label:"EXHIBIT B · SETTLEMENT MEMO",content:"On January 20, before issuance, Northline signed a final settlement for $2.1 million. The settlement resolves the October claim."},
      {label:"EXHIBIT C · FINANCING MEMO",content:"On January 18, Northline entered a new $45 million revolving credit facility to fund next year's expansion. Negotiations began January 4; no obligation existed at December 31."}
    ],
    references:[
      "https://asc.fasb.org/",
      "https://assets.ctfassets.net/rb9cdnjh59cm/71s84dkfo3KEsoLlz4vv6G/f4314469ec5368b5b4dd0d0184f00a71/CPA_Exam_Blueprints_2026.pdf"
    ],
    items:[
      {
        id:"litigation-conclusions",
        type:"multi_select",
        prompt:"Which conclusions about the litigation are supported? Select all that apply.",
        choices:[
          "The January settlement provides additional evidence about a condition that existed at December 31.",
          "The claim arose after year-end and cannot affect the December 31 statements.",
          "The December 31 financial statements should reflect the $2.1 million settlement amount.",
          "The settlement should be ignored because cash was paid after year-end."
        ],
        answer:[0,2],
        explain:"The claim existed before year-end. The pre-issuance settlement supplies additional evidence about that existing condition and is reflected in the December 31 financial statements."
      },
      {
        id:"facility-conclusions",
        type:"multi_select",
        prompt:"Which conclusions about the new credit facility are supported? Select all that apply.",
        choices:[
          "A $45 million liability existed at December 31.",
          "The facility is a nonrecognized subsequent event because the financing arose after year-end.",
          "If material, the nature and estimated financial effect should be disclosed.",
          "The facility changes the amount accrued for the October litigation."
        ],
        answer:[1,2],
        explain:"The financing condition did not exist at December 31, so it is not recognized in that balance sheet. A material nonrecognized event is disclosed so the statements are not misleading."
      }
    ]
  },

  /* ---------------- Constrained authoritative response ---------------- */
  {
    id:"far-v15-cash-flow-authority",
    schema:2,
    source:"F1.M4",
    diff:"medium",
    title:"Authoritative Research — Statement of Cash Flows",
    scenario:"You are reviewing the classification of cash receipts and payments in a U.S. GAAP statement of cash flows. Identify the relevant Codification topic before applying the classification rules.",
    references:[
      "https://asc.fasb.org/topic&trid=2128923",
      "https://assets.ctfassets.net/rb9cdnjh59cm/71s84dkfo3KEsoLlz4vv6G/f4314469ec5368b5b4dd0d0184f00a71/CPA_Exam_Blueprints_2026.pdf"
    ],
    items:[
      {
        id:"cash-flow-topic",
        type:"text_response",
        prompt:"Enter the Accounting Standards Codification topic number for the statement of cash flows.",
        placeholder:"Example: ASC 000",
        maxLength:80,
        answers:["ASC 230","230","Accounting Standards Codification 230"],
        authority:{
          title:"FASB ASC Topic 230 — Statement of Cash Flows",
          url:"https://asc.fasb.org/topic&trid=2128923",
          locator:"Topic 230"
        },
        explain:"ASC Topic 230 contains the U.S. GAAP guidance for the statement of cash flows. The response is constrained to authored aliases so the static app can grade it deterministically."
      },
      {
        id:"interest-paid-classification",
        type:"select",
        prompt:"Under U.S. GAAP, how is cash paid for interest ordinarily classified?",
        choices:["Operating activity","Investing activity","Financing activity","Noncash activity"],
        answer:0,
        explain:"Under U.S. GAAP, cash interest paid is ordinarily an operating cash flow; repayment of debt principal is financing."
      }
    ]
  }
]);
