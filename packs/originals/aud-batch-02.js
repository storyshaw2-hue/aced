/* packs/originals/aud-batch-02.js — CPA · AUD original question bank (batch 02).
   ============================================================================
   20 original Auditing items, weighted toward the AICPA AUD blueprint:
     AUD.A1 Ethics, Independence & Professional Responsibilities  (~20%)  → 4
     AUD.A2 Risk Assessment & Planning                            (~30%)  → 6
     AUD.A3 Evidence & Procedures                                 (~35%)  → 7
     AUD.A4 Forming Conclusions & Reporting                       (~15%)  → 3
   Answer keys are balanced ~25% per option and distractor lengths are varied
   so the correct choice is not systematically the longest.

   Scenarios are original; rules are public AICPA/PCAOB auditing standards.
   Each distractor names a specific mistake. Schema matches the ACED engine:
   { id, source, diff, q, choices, answer (0-indexed), explain, ref }.
   ============================================================================ */
window.ACED_QUESTIONS = (window.ACED_QUESTIONS || []).concat([

/* ---------------- AUD.A1 — Ethics, Independence & Responsibilities -------- */
{
  id:"cpa-aud-a1-05", source:"AUD.A1", diff:"medium",
  q:"A staff accountant assigned to an audit engagement owns a small number of shares in the audit client. Under the AICPA Code of Professional Conduct, the firm's independence is:",
  choices:[
    "Not impaired, because the dollar amount of the shares is clearly immaterial to the auditor",
    "Not impaired, as long as the shares are sold before the report date",
    "Impaired only for the engagement partner, not for assigned staff",
    "Impaired, because a covered member holds a direct financial interest in the client"],
  answer:3,
  explain:"A direct financial interest held by any covered member (including assigned staff) impairs independence regardless of amount. Materiality matters only for indirect interests; selling later or limiting the concern to the partner does not cure a current direct interest.",
  ref:"AICPA Code — independence, financial interests"
},
{
  id:"cpa-aud-a1-06", source:"AUD.A1", diff:"medium",
  q:"A firm audits financial statements produced by an information system the same firm designed and implemented for the client. This most directly creates which threat to independence?",
  choices:["Self-review threat","Advocacy threat","Familiarity threat","Undue influence threat"],
  answer:0,
  explain:"Evaluating the results of one's own prior nonaudit work is a self-review threat. Advocacy is promoting a client's position, familiarity arises from close relationships, and undue influence comes from pressure or gifts.",
  ref:"AICPA Code — conceptual framework, threats"
},
{
  id:"cpa-aud-a1-07", source:"AUD.A1", diff:"easy",
  q:"The principal purpose of an audit engagement letter is to:",
  choices:[
    "Express the auditor's opinion on the financial statements",
    "Provide the client with a guarantee that all material fraud, error, and illegal acts will be detected during the course of the audit",
    "Document the agreed terms of the engagement, including the responsibilities of management and the auditor",
    "Establish the auditor's independence from the client"],
  answer:2,
  explain:"The engagement letter records a written understanding of the objective, scope, and respective responsibilities of management and the auditor, reducing misunderstandings. It is not the opinion, a fraud guarantee, or the basis of independence.",
  ref:"AU-C 210 — terms of engagement"
},
{
  id:"cpa-aud-a1-08", source:"AUD.A1", diff:"hard",
  q:"For an issuer (public company) audit client, which nonaudit service is prohibited under SEC/PCAOB independence rules?",
  choices:[
    "Preparing the client's federal and state income tax returns with the required audit committee preapproval",
    "Providing permitted tax compliance services",
    "Attending audit committee meetings as the auditor",
    "Maintaining the client's accounting records and preparing its financial statements"],
  answer:3,
  explain:"Bookkeeping and preparing an issuer client's financial statements are prohibited because the auditor would be auditing its own work. Many tax services remain permitted with audit committee preapproval.",
  ref:"SOX/PCAOB — prohibited nonaudit services"
},

/* ---------------- AUD.A2 — Risk Assessment & Planning --------------------- */
{
  id:"cpa-aud-a2-05", source:"AUD.A2", diff:"medium",
  q:"In the audit risk model, if the auditor assesses both inherent risk and control risk as high, acceptable detection risk should be set:",
  choices:[
    "High, to conserve audit effort",
    "Low, requiring more persuasive substantive procedures",
    "At the maximum allowable level",
    "Unchanged, because detection risk is fixed by the standards"],
  answer:1,
  explain:"Detection risk varies inversely with the risk of material misstatement (inherent × control). When RMM is high, the auditor lowers acceptable detection risk and performs more effective substantive procedures. It is not fixed.",
  ref:"AU-C 200 — audit risk model"
},
{
  id:"cpa-aud-a2-06", source:"AUD.A2", diff:"medium",
  q:"Which component of audit risk does the auditor most directly control by adjusting the nature, timing, and extent of procedures?",
  choices:["Inherent risk","Control risk","Detection risk","The risk of material misstatement"],
  answer:2,
  explain:"Detection risk is the risk that the auditor's procedures fail to detect a material misstatement, and it is managed through the auditor's own substantive work. Inherent and control risk (together, RMM) exist independent of the audit.",
  ref:"AU-C 200 — components of audit risk"
},
{
  id:"cpa-aud-a2-07", source:"AUD.A2", diff:"hard",
  q:"Performance materiality is ordinarily set:",
  choices:[
    "Below overall materiality, giving a margin for aggregated and undetected misstatements",
    "Equal to overall materiality",
    "Above overall materiality, so that only the very largest and most obvious misstatements are ever investigated",
    "Based solely on a fixed percentage of reported net income"],
  answer:0,
  explain:"Performance materiality is an amount less than overall materiality that gives a margin for undetected and aggregated misstatements. It is not equal to or above overall materiality, nor mechanically tied to a single metric.",
  ref:"AU-C 320 — materiality"
},
{
  id:"cpa-aud-a2-08", source:"AUD.A2", diff:"medium",
  q:"Obtaining an understanding of internal control relevant to the audit is:",
  choices:[
    "Required only when the auditor intends to rely on the operating effectiveness of controls",
    "Optional for a financial statement audit",
    "Required only for issuer audits",
    "Required on every audit to identify and assess the risks of material misstatement"],
  answer:3,
  explain:"Every audit requires an understanding of relevant internal control to assess RMM and design procedures, even in a fully substantive approach. Deciding to test controls for reliance is a separate step.",
  ref:"AU-C 315 — understanding the entity and its control"
},
{
  id:"cpa-aud-a2-09", source:"AUD.A2", diff:"medium",
  q:"Under the auditing standards, the auditor should ordinarily presume that a fraud risk exists in:",
  choices:["Revenue recognition","Payroll disbursements","Depreciation of fixed assets","Petty cash custody"],
  answer:0,
  explain:"The standards direct the auditor to presume risks of material misstatement due to fraud in revenue recognition (and to address management override of controls). The other areas are not subject to that rebuttable presumption.",
  ref:"AU-C 240 — fraud, revenue recognition presumption"
},
{
  id:"cpa-aud-a2-10", source:"AUD.A2", diff:"hard",
  q:"Analytical procedures are required to be performed:",
  choices:[
    "Only as substantive tests of the details of account balances and classes of transactions during fieldwork",
    "Only when internal control is assessed as weak",
    "Only for issuer engagements",
    "During risk assessment (planning) and in the overall review near the end of the audit"],
  answer:3,
  explain:"Analytical procedures are mandatory in the risk assessment phase and in the final overall review; using them as substantive procedures is optional. They are not limited to weak-control situations or issuers.",
  ref:"AU-C 520 — analytical procedures"
},

/* ---------------- AUD.A3 — Evidence & Procedures -------------------------- */
{
  id:"cpa-aud-a3-05", source:"AUD.A3", diff:"medium",
  q:"Which of the following ordinarily provides the most reliable audit evidence?",
  choices:[
    "A confirmation received directly by the auditor from an independent third party",
    "A photocopy of a vendor's invoice retained by the client",
    "A schedule prepared by the client's accounting staff from its own internal records",
    "Oral responses to inquiries of client management"],
  answer:0,
  explain:"Evidence from independent external sources obtained directly by the auditor is more reliable than client-generated documents or oral inquiry. Photocopies and internally prepared schedules rank lower on the reliability hierarchy.",
  ref:"AU-C 500 — reliability of audit evidence"
},
{
  id:"cpa-aud-a3-06", source:"AUD.A3", diff:"medium",
  q:"Confirming accounts receivable directly with customers primarily provides evidence about which assertion?",
  choices:[
    "Completeness of recorded receivables",
    "Valuation and collectibility of receivables",
    "Presentation and disclosure of receivables",
    "Existence of the recorded receivables"],
  answer:3,
  explain:"A positive confirmation tests whether recorded receivables exist and are owed by the customer. It provides little assurance about collectibility (valuation) or completeness, because unrecorded receivables are never selected for confirmation.",
  ref:"AU-C 505 — external confirmations"
},
{
  id:"cpa-aud-a3-07", source:"AUD.A3", diff:"hard",
  q:"To test the completeness of recorded liabilities, the auditor is most likely to:",
  choices:[
    "Perform a search for unrecorded liabilities using subsequent cash disbursements and unmatched receiving reports",
    "Vouch a large sample of the recorded accounts payable back to the underlying vendor invoices and receiving reports on hand",
    "Confirm the balances already recorded in accounts payable",
    "Recompute the recorded accounts payable balance"],
  answer:0,
  explain:"Completeness concerns liabilities that should be recorded but may be omitted, so the auditor searches for unrecorded items (later payments, unmatched receiving reports). Vouching, confirming, or recomputing recorded balances addresses existence or accuracy, not omissions.",
  ref:"AU-C 500 — completeness, search for unrecorded liabilities"
},
{
  id:"cpa-aud-a3-08", source:"AUD.A3", diff:"medium",
  q:"The written representations obtained from management should be dated:",
  choices:[
    "As of the balance sheet date",
    "As of the date fieldwork began",
    "As of the date the financial statements are issued to users",
    "As of the date of the auditor's report"],
  answer:3,
  explain:"The management representation letter is dated as of the date of the auditor's report because it covers events through that date. It is addressed to the auditor and is required but not sufficient evidence on its own.",
  ref:"AU-C 580 — written representations"
},
{
  id:"cpa-aud-a3-09", source:"AUD.A3", diff:"medium",
  q:"When performing tests of controls, the auditor typically uses:",
  choices:[
    "Variables sampling to estimate the total dollar amount of misstatement in the account balance",
    "Monetary-unit sampling to project a dollar error",
    "Attribute sampling to estimate the rate of deviation from a control",
    "Only nonstatistical, judgmental selection"],
  answer:2,
  explain:"Tests of controls assess how often a control fails — a rate — so attribute sampling applies. Variables and monetary-unit sampling estimate dollar amounts and are used in substantive testing of balances.",
  ref:"AU-C 530 — audit sampling"
},
{
  id:"cpa-aud-a3-10", source:"AUD.A3", diff:"easy",
  q:"The 'appropriateness' of audit evidence refers to its:",
  choices:[
    "Quantity",
    "The overall cost incurred by the firm to obtain and document it",
    "Relevance and reliability (its quality)",
    "The timeliness with which it happened to be collected during fieldwork"],
  answer:2,
  explain:"Appropriateness is the quality of evidence — its relevance and reliability; sufficiency is the quantity. Cost and timing are practical considerations, not the meaning of appropriateness.",
  ref:"AU-C 500 — sufficient appropriate evidence"
},
{
  id:"cpa-aud-a3-11", source:"AUD.A3", diff:"hard",
  q:"Which procedure is most useful for identifying subsequent events between the balance sheet date and the date of the auditor's report?",
  choices:[
    "Observing the client's physical inventory count as it is conducted by warehouse staff at the balance sheet date",
    "Recomputing depreciation expense for the year",
    "Confirming year-end accounts receivable balances",
    "Reading minutes of board meetings held after year-end and inquiring of management about subsequent events"],
  answer:3,
  explain:"Subsequent-events procedures include reading later minutes, inquiring of management and legal counsel, and reviewing interim data. Inventory observation, depreciation recomputation, and receivable confirmation address balance-sheet-date assertions, not later events.",
  ref:"AU-C 560 — subsequent events"
},

/* ---------------- AUD.A4 — Forming Conclusions & Reporting ---------------- */
{
  id:"cpa-aud-a4-05", source:"AUD.A4", diff:"medium",
  q:"A client refuses to record an adjustment for a misstatement that is material but not pervasive to the financial statements. The auditor should issue:",
  choices:[
    "An unmodified opinion with an emphasis-of-matter paragraph",
    "A qualified opinion",
    "An adverse opinion",
    "A disclaimer of opinion"],
  answer:1,
  explain:"A material-but-not-pervasive GAAP departure warrants a qualified 'except for' opinion. An adverse opinion is reserved for pervasive misstatements, a disclaimer for pervasive scope limitations, and emphasis-of-matter does not modify the opinion.",
  ref:"AU-C 705 — modifications to the opinion"
},
{
  id:"cpa-aud-a4-06", source:"AUD.A4", diff:"hard",
  q:"The auditor cannot obtain sufficient appropriate evidence, and the possible effects of undetected misstatements could be both material and pervasive. The auditor should:",
  choices:[
    "Issue a qualified opinion",
    "Disclaim an opinion",
    "Issue an adverse opinion",
    "Issue an unmodified opinion with an other-matter paragraph"],
  answer:1,
  explain:"A pervasive scope limitation prevents the auditor from forming an opinion, so a disclaimer is appropriate. A qualified opinion fits a material-but-not-pervasive scope limit; an adverse opinion addresses pervasive misstatements, not scope.",
  ref:"AU-C 705 — scope limitations"
},
{
  id:"cpa-aud-a4-07", source:"AUD.A4", diff:"medium",
  q:"Substantial doubt about an entity's ability to continue as a going concern exists and is adequately disclosed in the notes. The auditor should ordinarily issue:",
  choices:[
    "A qualified 'except for' opinion because of the disclosed going-concern uncertainty",
    "An adverse opinion",
    "An unmodified opinion with a separate 'going concern' section",
    "A disclaimer of opinion"],
  answer:2,
  explain:"When going-concern doubt is adequately disclosed, the opinion stays unmodified and the auditor adds a separate section addressing the substantial doubt. Inadequate disclosure would instead be a GAAP departure leading to a qualified or adverse opinion.",
  ref:"AU-C 570 — going concern"
}

]);
