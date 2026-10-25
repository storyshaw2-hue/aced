/* packs/originals/bar-batch-06.js — CPA · BAR original question bank (batch 06).
   ============================================================================
   10 original Area III (State & Local Government) items, added to pull Area III
   from ~10% toward its ~18% blueprint weight. Topics extend (do not duplicate)
   the earlier B3 questions: fund-type identification, debt-service expenditure
   timing, nonexchange revenue classification, the general fund's role, the two
   government-wide statements, long-term-liability reconciliation, internal
   service fund presentation, fiduciary-fund exclusion, proprietary-fund
   statements, and fund-balance classification.

   Scenarios are original; rules are public GASB facts. Each distractor names a
   specific mistake. Schema matches the ACED engine:
   { id, source, diff, q, choices, answer (0-indexed), explain, ref }.
   ============================================================================ */
window.ACED_QUESTIONS = (window.ACED_QUESTIONS || []).concat([

/* --- B3.M1 Governmental Funds & Modified Accrual --- */
{
  id:"cpa-bar-b3m1-05", source:"B3.M1", diff:"medium",
  q:"Which of the following is a governmental fund?",
  choices:["Capital projects fund","Enterprise fund","Internal service fund","Pension trust fund"],
  answer:0,
  explain:"Governmental funds are the general, special revenue, capital projects, debt service, and permanent funds. Enterprise and internal service funds are proprietary funds; a pension trust fund is a fiduciary fund.",
  ref:"Fund structure — governmental fund types"
},
{
  id:"cpa-bar-b3m1-06", source:"B3.M1", diff:"hard",
  q:"Under the modified accrual basis, expenditures for principal on general long-term debt are recognized:",
  choices:["Accrued evenly over the life of the debt","When the principal payment is due (matured)","When the debt is originally issued","Only in the government-wide statements"],
  answer:1,
  explain:"In governmental funds, debt service expenditures for principal and interest are recognized when due (matured), not accrued in advance. The long-term debt itself is reported only government-wide, not as a governmental-fund liability.",
  ref:"Modified accrual — debt service expenditures"
},
{
  id:"cpa-bar-b3m1-07", source:"B3.M1", diff:"hard",
  q:"A state assesses a sales tax and remits a portion to a city. In the city's financial statements, this revenue is classified as:",
  choices:["An imposed nonexchange transaction","A government-mandated nonexchange transaction","Derived tax revenue","A voluntary nonexchange transaction"],
  answer:2,
  explain:"Derived tax revenues are taxes assessed on exchange transactions, such as sales and income taxes. Imposed nonexchange revenues are taxes not derived from a transaction (property taxes, fines); government-mandated and voluntary nonexchange transactions involve grants or agreements.",
  ref:"Nonexchange revenue — classification"
},
{
  id:"cpa-bar-b3m1-08", source:"B3.M1", diff:"medium",
  q:"The general fund accounts for:",
  choices:["Only property tax revenues of the government","Resources legally restricted to financing major capital construction","Proceeds from issues of general long-term debt","All financial resources not required to be reported in another fund"],
  answer:3,
  explain:"The general fund is the chief operating fund and accounts for all financial resources not accounted for in another specific fund. Restricted resources, capital-project resources, and debt proceeds are reported in other governmental funds.",
  ref:"Governmental funds — the general fund"
},

/* --- B3.M2 Government-Wide Reporting & Reconciliation --- */
{
  id:"cpa-bar-b3m2-04", source:"B3.M2", diff:"medium",
  q:"The two government-wide financial statements are the:",
  choices:["Statement of net position and the statement of activities","Balance sheet and the income statement","Statement of revenues, expenditures, and changes in fund balances","Statement of cash flows and the statement of net position"],
  answer:0,
  explain:"The government-wide statements are the statement of net position and the statement of activities, both prepared on the full accrual basis. The statement of revenues, expenditures, and changes in fund balances is a governmental-fund statement, not a government-wide one.",
  ref:"Government-wide reporting — required statements"
},
{
  id:"cpa-bar-b3m2-05", source:"B3.M2", diff:"hard",
  q:"In reconciling total governmental fund balances to government-wide net position, general long-term liabilities such as bonds payable are:",
  choices:["Added","Subtracted","Ignored","Reclassified as fund balance"],
  answer:1,
  explain:"General long-term liabilities are reported government-wide but not in the governmental funds, so they are subtracted in the reconciliation. Capital assets, by contrast, are added because they appear government-wide but not in the funds.",
  ref:"Reconciliation — long-term liabilities"
},
{
  id:"cpa-bar-b3m2-06", source:"B3.M2", diff:"hard",
  q:"Internal service fund activities are most often reported in which column of the government-wide statements?",
  choices:["Business-type activities","Fiduciary activities","Governmental activities","They are excluded from the government-wide statements"],
  answer:2,
  explain:"Although internal service funds use proprietary (full accrual) accounting, they predominantly serve the government's own departments, so their activities are usually consolidated into the governmental activities column at the government-wide level.",
  ref:"Government-wide reporting — internal service funds"
},

/* --- B3.M3 Fund Statements & Net Position --- */
{
  id:"cpa-bar-b3m3-04", source:"B3.M3", diff:"medium",
  q:"Fiduciary funds (such as custodial and pension trust funds) are reported:",
  choices:["In the government-wide statements only","In both the fund and the government-wide statements","Only within the governmental activities column","In the fund financial statements but excluded from the government-wide statements"],
  answer:3,
  explain:"Fiduciary resources are held for parties outside the government and cannot be used to support its own programs, so fiduciary funds appear in the fund financial statements but are excluded from the government-wide statements.",
  ref:"Fiduciary funds — reporting"
},
{
  id:"cpa-bar-b3m3-05", source:"B3.M3", diff:"medium",
  q:"Which set of financial statements does a proprietary fund present?",
  choices:["Statement of net position; statement of revenues, expenses, and changes in net position; and statement of cash flows","A statement of revenues, expenditures, and changes in fund balances only","Only a balance sheet and an income statement, exactly as a business would","A statement of activities and a budgetary comparison schedule"],
  answer:0,
  explain:"Proprietary funds (enterprise and internal service) present a statement of net position; a statement of revenues, expenses, and changes in fund net position; and a statement of cash flows. The 'revenues, expenditures, and changes in fund balances' statement is used by governmental funds.",
  ref:"Proprietary funds — financial statements"
},
{
  id:"cpa-bar-b3m3-06", source:"B3.M3", diff:"hard",
  q:"Amounts that may be used only for specific purposes as determined by formal action of the government's highest decision-making authority are classified as:",
  choices:["Restricted fund balance","Committed fund balance","Assigned fund balance","Unassigned fund balance"],
  answer:1,
  explain:"Committed fund balance reflects constraints imposed by the government's own highest decision-making authority (for example, the governing board by ordinance). Restricted balance is externally imposed (creditors or law), assigned reflects intent, and unassigned is the residual in the general fund.",
  ref:"Fund balance — classifications"
}

]);
