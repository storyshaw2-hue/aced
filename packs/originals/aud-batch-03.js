/* packs/originals/aud-batch-03.js — CPA · AUD original question bank (batch 03).
   ============================================================================
   16 original Auditing items deepening the two heaviest AUD areas:
     AUD.A2 Risk Assessment & Planning   → 10  (assertions, COSO, fraud, SOC)
     AUD.A3 Evidence & Procedures        → 6   (confirmations, kiting, sampling)
   Answer keys are balanced 4 per option; distractor lengths are varied.

   Scenarios are original; rules are public AICPA/PCAOB standards. Each
   distractor names a specific mistake. Schema:
   { id, source, diff, q, choices, answer (0-indexed), explain, ref }.
   ============================================================================ */
window.ACED_QUESTIONS = (window.ACED_QUESTIONS || []).concat([

/* ---------------- AUD.A2 — Risk Assessment & Planning -------------------- */
{
  id:"cpa-aud-a2-11", source:"AUD.A2", diff:"medium",
  q:"The assertion that recorded sales transactions actually took place and pertain to the entity is:",
  choices:["Occurrence","Completeness","Classification","Cutoff"],
  answer:0,
  explain:"Occurrence asserts that recorded transactions and events actually happened and relate to the entity. Completeness is the opposite concern (unrecorded items); classification is proper account coding; cutoff is recording in the correct period.",
  ref:"AU-C 315 — assertions about transactions"
},
{
  id:"cpa-aud-a2-12", source:"AUD.A2", diff:"medium",
  q:"Which assertion is violated when a company fails to record a liability that exists at year-end?",
  choices:["Existence","Completeness","Rights and obligations","Valuation and allocation"],
  answer:1,
  explain:"Completeness asserts that all transactions and balances that should be recorded are recorded, so an omitted liability is a completeness failure. Existence concerns recorded items that may not exist — the opposite direction.",
  ref:"AU-C 315 — completeness assertion"
},
{
  id:"cpa-aud-a2-13", source:"AUD.A2", diff:"medium",
  q:"The five interrelated components of internal control under the COSO framework include all of the following EXCEPT:",
  choices:["Control environment","Risk assessment","Monitoring activities","Detection risk"],
  answer:3,
  explain:"COSO's five components are the control environment, risk assessment, control activities, information and communication, and monitoring. Detection risk belongs to the audit risk model, not the COSO framework.",
  ref:"COSO — components of internal control"
},
{
  id:"cpa-aud-a2-14", source:"AUD.A2", diff:"medium",
  q:"Which component of internal control sets the overall tone of the organization and serves as the foundation for the others?",
  choices:["Control activities","Monitoring","The control environment","Information and communication"],
  answer:2,
  explain:"The control environment ('tone at the top') is the foundation, covering integrity, ethical values, and governance. Control activities are the specific policies and procedures built upon that foundation.",
  ref:"COSO — control environment"
},
{
  id:"cpa-aud-a2-15", source:"AUD.A2", diff:"easy",
  q:"The 'fraud triangle' describes three conditions generally present when fraud occurs: incentive/pressure, rationalization, and:",
  choices:["Opportunity","Materiality","Collusion","Detection risk"],
  answer:0,
  explain:"The three conditions are incentive/pressure, opportunity, and rationalization. Materiality and detection risk are audit concepts; collusion can conceal fraud but is not one of the three fraud-triangle conditions.",
  ref:"AU-C 240 — the fraud triangle"
},
{
  id:"cpa-aud-a2-16", source:"AUD.A2", diff:"medium",
  q:"The two types of misstatement relevant to the auditor's consideration of fraud are fraudulent financial reporting and:",
  choices:["Unintentional errors in judgment","Noncompliance with laws and regulations","Internal control deficiencies","Misappropriation of assets"],
  answer:3,
  explain:"The auditor considers fraudulent financial reporting (intentional misstatement of the statements) and misappropriation of assets (theft). Errors are unintentional; noncompliance and control deficiencies are separate matters.",
  ref:"AU-C 240 — types of fraud"
},
{
  id:"cpa-aud-a2-17", source:"AUD.A2", diff:"medium",
  q:"The required engagement team discussion ('brainstorming') during planning focuses primarily on:",
  choices:[
    "Assigning individual staff members to the various audit areas",
    "Negotiating and setting the audit fee with the client",
    "How and where the financial statements might be susceptible to material misstatement due to fraud",
    "Drafting the wording of the auditor's report"],
  answer:2,
  explain:"The brainstorming session addresses the susceptibility of the statements to material misstatement, especially due to fraud, and how management might perpetrate or conceal it. Staffing, fees, and report wording are not its purpose.",
  ref:"AU-C 240 — engagement team discussion"
},
{
  id:"cpa-aud-a2-18", source:"AUD.A2", diff:"hard",
  q:"When the auditor identifies a significant risk, the auditor should:",
  choices:[
    "Rely solely on controls without testing them",
    "Perform substantive procedures specifically responsive to that risk",
    "Disregard it whenever controls appear strong",
    "Reduce the extent of all related testing"],
  answer:1,
  explain:"Significant risks require special audit consideration, including substantive procedures responsive to the risk; to rely on controls over a significant risk, the auditor must test those controls in the current period.",
  ref:"AU-C 330 — responses to significant risks"
},
{
  id:"cpa-aud-a2-19", source:"AUD.A2", diff:"hard",
  q:"A user auditor wants evidence about the operating effectiveness of controls at a service organization over a period of time. The most useful report is a:",
  choices:["SOC 1 Type 1 report","SOC 2 privacy report","Compilation report","SOC 1 Type 2 report"],
  answer:3,
  explain:"A SOC 1 Type 2 report covers the design and operating effectiveness of controls over a period, supporting a reduction in control risk. A Type 1 report addresses design at a single point in time only.",
  ref:"AU-C 402 — service organizations"
},
{
  id:"cpa-aud-a2-20", source:"AUD.A2", diff:"medium",
  q:"Performing a walkthrough — tracing one transaction from initiation through the accounting records — primarily helps the auditor to:",
  choices:[
    "Confirm the understanding of the transaction flow and the design of relevant controls",
    "Estimate the allowance for doubtful accounts",
    "Determine overall materiality",
    "Test the mathematical accuracy of the general ledger"],
  answer:0,
  explain:"A walkthrough confirms the auditor's understanding of how transactions flow and whether controls are designed and implemented. It is not a way to estimate allowances, set materiality, or foot the ledger.",
  ref:"AU-C 315 — walkthroughs"
},

/* ---------------- AUD.A3 — Evidence & Procedures ------------------------- */
{
  id:"cpa-aud-a3-12", source:"AUD.A3", diff:"hard",
  q:"Negative accounts receivable confirmations (customer replies only if the balance is wrong) are appropriate when:",
  choices:[
    "The risk of material misstatement is assessed as high",
    "Individual customer balances are large and few in number",
    "The risk of material misstatement is low, there are many small homogeneous balances, and a low exception rate is expected",
    "The auditor expects a large number of disputed customer balances"],
  answer:2,
  explain:"Negative confirmations suit low-RMM situations with many small, homogeneous balances and an expected low exception rate, where recipients would notice errors. High risk or large/disputed balances call for positive confirmations.",
  ref:"AU-C 505 — negative confirmations"
},
{
  id:"cpa-aud-a3-13", source:"AUD.A3", diff:"medium",
  q:"When customers do not respond to positive accounts receivable confirmations, the auditor's best alternative procedure is to:",
  choices:[
    "Send the same confirmation a third time and stop if it is unanswered",
    "Assume the recorded balances are fairly stated",
    "Confirm the balances with the client's own management instead",
    "Examine subsequent cash receipts and the supporting shipping documents and sales invoices"],
  answer:3,
  explain:"Alternative procedures examine subsequent cash receipts and the underlying shipping and sales documents to verify the receivable existed. Assuming fairness, asking management, or merely resending does not provide sufficient evidence.",
  ref:"AU-C 505 — alternative procedures"
},
{
  id:"cpa-aud-a3-14", source:"AUD.A3", diff:"medium",
  q:"Observing the client's physical inventory count primarily provides evidence about which assertion for inventory?",
  choices:["Valuation and allocation","Existence","Rights and obligations","Presentation and disclosure"],
  answer:1,
  explain:"Observing the count tests the existence of recorded inventory. Valuation is tested through pricing and net-realizable-value work; rights through purchase/consignment terms; presentation through disclosure review.",
  ref:"AU-C 501 — inventory observation"
},
{
  id:"cpa-aud-a3-15", source:"AUD.A3", diff:"hard",
  q:"To detect kiting at year-end, the auditor would most likely prepare a(n):",
  choices:["Aged trial balance of receivables","Depreciation continuity schedule","Interbank transfer schedule","Lead schedule for owners' equity"],
  answer:2,
  explain:"An interbank transfer schedule lists transfers near year-end to detect kiting — recording a deposit in one bank before the offsetting disbursement clears another, overstating cash. The other schedules do not address inter-bank timing.",
  ref:"AU-C 500 — cash, kiting"
},
{
  id:"cpa-aud-a3-16", source:"AUD.A3", diff:"medium",
  q:"A letter of inquiry to the client's external legal counsel is the auditor's primary means of obtaining evidence about:",
  choices:["The collectibility of receivables","Litigation, claims, and assessments","The existence of physical inventory","Related-party ownership interests"],
  answer:1,
  explain:"The attorney's letter corroborates management's information about litigation, claims, and assessments; a client's refusal to permit the inquiry is a scope limitation. It does not address receivable collectibility, inventory, or ownership.",
  ref:"AU-C 501 — litigation, claims, and assessments"
},
{
  id:"cpa-aud-a3-17", source:"AUD.A3", diff:"easy",
  q:"Independently checking the mathematical accuracy of a client-prepared depreciation schedule is an example of:",
  choices:["Recalculation","Inquiry","Observation","External confirmation"],
  answer:0,
  explain:"Recalculation is checking the mathematical accuracy of documents or records. Inquiry is asking questions, observation is watching a process, and confirmation is obtaining a direct third-party response.",
  ref:"AU-C 500 — audit procedures"
}

]);
