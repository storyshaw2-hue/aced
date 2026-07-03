/* packs/originals/aud-batch-05.js — CPA · AUD original question bank (batch 05).
   ============================================================================
   20 original Auditing items modeled on the QUESTION PATTERNS in the Becker
   A1 (audit reports/opinions, subsequent events, emphasis-of-matter) and A2
   (internal control/COSO, engagement acceptance, predecessor) MCQ sets —
   re-created with original scenarios and mapped by CONTENT to the AICPA areas:
     AUD.A1 Ethics & Professional Responsibilities → 3
     AUD.A2 Risk Assessment & Planning             → 6  (internal control heavy)
     AUD.A3 Evidence & Procedures                  → 7  (incl. subsequent events)
     AUD.A4 Forming Conclusions & Reporting        → 4
   Answer keys balanced 5 per option; distractor lengths varied.

   Scenarios are original; rules are public AICPA/PCAOB standards. Each
   distractor names a specific mistake. Schema:
   { id, source, diff, q, choices, answer (0-indexed), explain, ref }.
   ============================================================================ */
window.ACED_QUESTIONS = (window.ACED_QUESTIONS || []).concat([

/* ---------------- AUD.A1 — Ethics & Professional Responsibilities --------- */
{
  id:"cpa-aud-a1-15", source:"AUD.A1", diff:"easy",
  q:"Professional skepticism is best described as:",
  choices:[
    "An attitude that includes a questioning mind and a critical assessment of audit evidence",
    "A working assumption that management is dishonest",
    "Reliance on management's representations without corroboration",
    "A requirement to detect every instance of fraud"],
  answer:0,
  explain:"Professional skepticism is a questioning mind and critical evaluation of evidence — neither presuming dishonesty nor trusting blindly. It does not require detecting all fraud, and it does not permit uncorroborated reliance on representations.",
  ref:"AU-C 200 — professional skepticism"
},
{
  id:"cpa-aud-a1-16", source:"AUD.A1", diff:"medium",
  q:"Regarding laws and regulations, the auditor's responsibility to obtain sufficient appropriate evidence is greatest for those that:",
  choices:[
    "Have only an indirect effect on the financial statements",
    "Have a direct effect on the determination of material amounts and disclosures in the financial statements",
    "Are unrelated to financial reporting",
    "Management happens to consider unimportant"],
  answer:1,
  explain:"For laws with a direct effect on material financial-statement amounts, the auditor gathers sufficient appropriate evidence about compliance, as with any material item. For indirect-effect laws, the auditor performs only limited procedures such as inquiry and inspecting correspondence.",
  ref:"AU-C 250 — consideration of laws and regulations"
},
{
  id:"cpa-aud-a1-17", source:"AUD.A1", diff:"hard",
  q:"Midway through an audit, the client asks to change the engagement to a review. Which is NOT a reasonable basis for agreeing to the change?",
  choices:[
    "A genuine change in circumstances affecting the need for an audit",
    "A misunderstanding about the nature of the service originally requested",
    "The client wishes to avoid a likely qualified or adverse audit opinion",
    "A change in the entity's regulatory or contractual requirements"],
  answer:2,
  explain:"Downgrading the service to avoid an unfavorable audit opinion is not a reasonable justification. A real change in circumstances, an original misunderstanding, or altered requirements can be acceptable reasons to change the engagement.",
  ref:"AU-C 210 — change in engagement terms"
},

/* ---------------- AUD.A2 — Risk Assessment & Internal Control ------------- */
{
  id:"cpa-aud-a2-21", source:"AUD.A2", diff:"hard",
  q:"Adequate segregation of duties keeps one person from both perpetrating and concealing errors or fraud. Which combination represents the WEAKEST segregation?",
  choices:[
    "Authorizing major transactions and preparing the annual operating budgets",
    "Reconciling the bank account and preparing periodic sales forecasts",
    "Maintaining the general ledger and mailing checks that others have signed",
    "Having custody of cash receipts and recording those receipts in the accounting records"],
  answer:3,
  explain:"Combining custody of an asset (cash) with recordkeeping for that asset lets one person both take and hide a theft — the classic failure. Authorization, recordkeeping, and custody should be separated; the other pairings do not unite custody with recordkeeping.",
  ref:"AU-C 315 — segregation of duties"
},
{
  id:"cpa-aud-a2-22", source:"AUD.A2", diff:"medium",
  q:"A supervisor's monthly comparison of actual expenses to budget, with investigation of significant variances, is an example of which type of control activity?",
  choices:[
    "A performance (management) review",
    "A physical control over assets",
    "Segregation of duties",
    "A general information-technology control"],
  answer:0,
  explain:"Comparing results to budgets and following up on variances is a performance review. Physical controls safeguard assets, segregation splits incompatible duties, and IT general controls govern the computing environment.",
  ref:"AU-C 315 — control activities"
},
{
  id:"cpa-aud-a2-23", source:"AUD.A2", diff:"medium",
  q:"An automated edit that rejects a payroll entry whenever hours worked exceed a preset maximum is best classified as:",
  choices:[
    "An IT general control governing the computing environment",
    "An application (automated) control",
    "A control-environment element",
    "A monitoring control"],
  answer:1,
  explain:"A limit/validation check built into a specific application is an application control. IT general controls (access, program changes, operations) support the environment in which applications run, not a single input edit.",
  ref:"AU-C 315 — IT controls"
},
{
  id:"cpa-aud-a2-24", source:"AUD.A2", diff:"medium",
  q:"Even a well-designed system of internal control can provide only reasonable, not absolute, assurance primarily because of:",
  choices:[
    "The external auditor's independence from the entity",
    "The entity's use of a financial reporting framework",
    "Management override, collusion, human error, and cost-benefit constraints",
    "The requirement that the auditor issue a written report expressing an opinion"],
  answer:2,
  explain:"Inherent limitations — management override, collusion among individuals, ordinary human error, and cost-benefit trade-offs — mean controls cannot give absolute assurance. Independence, the framework, and the reporting requirement are unrelated to this limitation.",
  ref:"AU-C 315 — inherent limitations of internal control"
},
{
  id:"cpa-aud-a2-25", source:"AUD.A2", diff:"hard",
  q:"As a precondition for accepting an audit engagement, the auditor must establish that:",
  choices:[
    "The client will guarantee in writing that an unmodified opinion will be issued",
    "The auditor may also maintain the client's accounting records",
    "The audit fee will be contingent on the reported results",
    "Management uses an acceptable reporting framework and acknowledges its responsibilities for the statements, internal control, and access"],
  answer:3,
  explain:"Preconditions require an acceptable financial reporting framework and management's acknowledgment of its responsibilities (the 'premise' of an audit). A guaranteed opinion, contingent fees, or performing the bookkeeping are improper, not preconditions.",
  ref:"AU-C 210 — preconditions for an audit"
},
{
  id:"cpa-aud-a2-26", source:"AUD.A2", diff:"medium",
  q:"After obtaining the client's permission, the successor auditor's inquiries of the predecessor should include all of the following EXCEPT:",
  choices:[
    "The predecessor's opinion on whether the successor's proposed fee is reasonable",
    "Information bearing on the integrity of management",
    "Disagreements with management about accounting or auditing matters",
    "The predecessor's understanding of the reason for the change of auditors"],
  answer:0,
  explain:"The successor asks about management's integrity, disagreements, communications regarding fraud or noncompliance, and the reason for the change — not the predecessor's view of the successor's fee, which is irrelevant to acceptance.",
  ref:"AU-C 210 — communication with predecessor"
},

/* ---------------- AUD.A3 — Evidence & Procedures -------------------------- */
{
  id:"cpa-aud-a3-23", source:"AUD.A3", diff:"hard",
  q:"Before issuing the report, the auditor learns that a lawsuit outstanding at year-end was settled after year-end for an amount different from the recorded estimate. This subsequent event should be:",
  choices:[
    "Disclosed only, with no adjustment to the statements",
    "Recognized by adjusting the financial statements",
    "Ignored, because it occurred after year-end",
    "Reported as a change in accounting principle"],
  answer:1,
  explain:"The lawsuit condition existed at the balance sheet date, so the settlement is evidence about that condition — a recognized (Type I) event requiring adjustment. Type II events (new conditions arising after year-end) are only disclosed.",
  ref:"AU-C 560 — recognized subsequent events"
},
{
  id:"cpa-aud-a3-24", source:"AUD.A3", diff:"medium",
  q:"After year-end but before issuance, the entity issues a large amount of new common stock. This subsequent event should be:",
  choices:[
    "Recognized by adjusting the year-end statements",
    "Treated as a prior-period adjustment",
    "Disclosed in the notes without adjusting the year-end statements",
    "Omitted from the financial statements entirely"],
  answer:2,
  explain:"A stock issuance is a new condition arising after the balance sheet date — a nonrecognized (Type II) event — so it is disclosed but not used to adjust the year-end amounts. It is not a prior-period adjustment or an item to ignore.",
  ref:"AU-C 560 — nonrecognized subsequent events"
},
{
  id:"cpa-aud-a3-25", source:"AUD.A3", diff:"hard",
  q:"When the auditor tests controls at an interim date and plans to rely on them for the full year, the auditor should:",
  choices:[
    "Perform no further work for the remaining period",
    "Re-audit the entire year from the beginning",
    "Assume the controls stopped operating after the interim date",
    "Obtain evidence about how the controls operated during the remaining period"],
  answer:3,
  explain:"Interim testing must be supplemented with evidence covering the remaining period — typically inquiries plus some additional testing, considering any changes. Doing nothing leaves a gap, re-auditing everything is unnecessary, and assuming failure is unwarranted.",
  ref:"AU-C 330 — interim testing of controls"
},
{
  id:"cpa-aud-a3-26", source:"AUD.A3", diff:"medium",
  q:"To reduce control risk below maximum and rely on a control, the auditor must:",
  choices:[
    "Test the operating effectiveness of the control",
    "Merely inquire whether the control exists",
    "Observe the control operate one time during planning",
    "Obtain a written representation that controls function"],
  answer:0,
  explain:"Reliance requires testing operating effectiveness (some mix of inspection, reperformance, observation, and inquiry). Understanding design and implementation, a single observation, or a management representation alone is not enough to rely.",
  ref:"AU-C 330 — tests of controls"
},
{
  id:"cpa-aud-a3-27", source:"AUD.A3", diff:"medium",
  q:"A procedure that simultaneously evaluates the operating effectiveness of a control and detects monetary misstatement in the same transaction is a:",
  choices:[
    "Substantive analytical procedure",
    "Dual-purpose test",
    "Walkthrough",
    "External confirmation"],
  answer:1,
  explain:"A dual-purpose test combines a test of controls with a substantive test of details on the same transaction. A walkthrough only confirms understanding of the process; analytics and confirmations are not tests of controls.",
  ref:"AU-C 330 — dual-purpose tests"
},
{
  id:"cpa-aud-a3-28", source:"AUD.A3", diff:"hard",
  q:"Selecting recorded journal entries and agreeing them back to supporting source documents (vouching) primarily tests:",
  choices:[
    "Completeness of the records",
    "The rate of control deviations",
    "Existence/occurrence of the recorded items",
    "Presentation and disclosure"],
  answer:2,
  explain:"Vouching moves from the records to source documents, testing whether recorded items actually occurred (existence/occurrence). Tracing from source documents forward to the records tests completeness — the opposite direction.",
  ref:"AU-C 500 — direction of testing"
},
{
  id:"cpa-aud-a3-29", source:"AUD.A3", diff:"easy",
  q:"The auditor independently re-executes a bank reconciliation that a client employee originally prepared. This procedure is:",
  choices:[
    "Inquiry",
    "Observation",
    "External confirmation",
    "Reperformance"],
  answer:3,
  explain:"Reperformance is the auditor's independent execution of procedures or controls that the entity originally performed. Inquiry is asking questions, observation is watching a process, and confirmation is a direct third-party response.",
  ref:"AU-C 500 — reperformance"
},

/* ---------------- AUD.A4 — Forming Conclusions & Reporting ---------------- */
{
  id:"cpa-aud-a4-13", source:"AUD.A4", diff:"medium",
  q:"An 'other-matter' paragraph in the auditor's report is used to refer to a matter that is:",
  choices:[
    "Not presented or disclosed in the financial statements but relevant to users' understanding of the audit or report",
    "Appropriately presented and disclosed in the statements and fundamental to users' understanding of them",
    "A material misstatement that requires a qualified opinion",
    "A scope limitation that requires a disclaimer of opinion"],
  answer:0,
  explain:"An other-matter paragraph addresses something NOT in the statements (for example, a prior period audited by a predecessor, or restricting the report's use). An emphasis-of-matter paragraph refers to a matter appropriately presented IN the statements. Neither modifies the opinion.",
  ref:"AU-C 706 — emphasis-of-matter and other-matter paragraphs"
},
{
  id:"cpa-aud-a4-14", source:"AUD.A4", diff:"hard",
  q:"The prior-year statements presented for comparison were audited by a predecessor whose report is not being reissued. The successor's report should:",
  choices:[
    "Express an opinion on the prior-year statements as if the successor had performed that audit",
    "Include an other-matter paragraph stating the prior period was audited by a predecessor, the type of opinion, and its date",
    "Omit any reference to the prior period entirely",
    "Disclaim an opinion on the current-year statements"],
  answer:1,
  explain:"When the predecessor's report is not reissued, the successor adds an other-matter paragraph identifying that a predecessor audited the prior period, the type of opinion expressed, and the report date. The successor does not opine on the prior period itself.",
  ref:"AU-C 700/706 — comparative statements, predecessor"
},
{
  id:"cpa-aud-a4-15", source:"AUD.A4", diff:"hard",
  q:"After the date of the auditor's report but before issuance, management discloses a newly occurring subsequent event, and the auditor performs procedures limited to that event. The auditor may:",
  choices:[
    "Backdate the report to the balance sheet date",
    "Refuse to consider the event at all",
    "Dual-date the report — retaining the original date for the audit and adding a later date limited to that specific event",
    "Withdraw from the engagement automatically"],
  answer:2,
  explain:"Dual dating lets the auditor keep the original report date for the overall audit while assuming responsibility for the one later event as of its date. Alternatively, dating the entire report later extends responsibility to that date. Backdating or ignoring the event is improper.",
  ref:"AU-C 560 — dual dating"
},
{
  id:"cpa-aud-a4-16", source:"AUD.A4", diff:"medium",
  q:"The date of the auditor's report should be:",
  choices:[
    "The balance sheet date",
    "The date the engagement letter was signed",
    "The date on which the audited financial statements are filed with the securities regulators",
    "No earlier than the date the auditor obtained sufficient appropriate audit evidence to support the opinion"],
  answer:3,
  explain:"The report is dated no earlier than when the auditor has obtained sufficient appropriate evidence — including that the statements were prepared and management accepted responsibility for them. It is not the balance sheet, engagement, or filing date.",
  ref:"AU-C 700 — dating the auditor's report"
}

]);
