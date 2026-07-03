/* packs/originals/aud-batch-06.js — CPA · AUD original question bank (batch 06).
   ============================================================================
   20 original Auditing items modeled on the QUESTION PATTERNS in the Becker
   A3 (Evidence & Procedures) MCQ sets — audit sampling, substantive procedures
   for specific accounts, auditing estimates and fair value, going concern, and
   using internal auditors — re-created with original scenarios and mapped by
   CONTENT to the AICPA areas (weighted toward A3, the largest area):
     AUD.A3 Evidence & Procedures              → 12
     AUD.A2 Risk Assessment & Internal Control → 5
     AUD.A1 Ethics & Professional Responsibilities → 2
     AUD.A4 Forming Conclusions & Reporting    → 1
   Answer keys balanced 5 per option; distractor lengths varied so the correct
   choice is not systematically the longest.

   Scenarios are original; rules are public AICPA/PCAOB standards. Each
   distractor names a specific mistake. Schema:
   { id, source, diff, q, choices, answer (0-indexed), explain, ref }.
   ============================================================================ */
window.ACED_QUESTIONS = (window.ACED_QUESTIONS || []).concat([

/* ---------------- AUD.A3 — Evidence & Procedures -------------------------- */
{
  id:"cpa-aud-a3-30", source:"AUD.A3", diff:"medium",
  q:"Compared with a negative confirmation request, a positive confirmation request:",
  choices:[
    "Asks the recipient to respond whether or not they agree with the stated balance",
    "Requires a response only when the recipient disagrees with the balance",
    "Is generally preferred when the assessed risk of material misstatement is low",
    "Provides substantially weaker evidence than a negative request in nearly all circumstances"],
  answer:0,
  explain:"A positive confirmation requests a reply in all cases, so a nonreply must be followed up — making it stronger than a negative request, which is returned only on disagreement and suits low-risk, homogeneous populations.",
  ref:"AU-C 505 — positive vs negative confirmations"
},
{
  id:"cpa-aud-a3-31", source:"AUD.A3", diff:"medium",
  q:"The standard financial institution confirmation form is designed to confirm:",
  choices:[
    "Only the year-end cash balance the entity holds on deposit",
    "Both deposit balances and the entity's direct liabilities to the institution, such as loans",
    "The existence and condition of any inventory the entity has pledged to the institution as collateral",
    "The collectibility of the entity's outstanding receivables"],
  answer:1,
  explain:"The standard bank confirmation captures deposit balances and direct liabilities (loans) to the institution. It is not limited to cash on deposit and does not address inventory or receivable collectibility.",
  ref:"AU-C 505 — bank confirmations"
},
{
  id:"cpa-aud-a3-32", source:"AUD.A3", diff:"hard",
  q:"An auditor obtains a cutoff bank statement primarily to:",
  choices:[
    "Confirm the client's compliance with the restrictive covenants in its outstanding loan agreements",
    "Detect kiting occurring between affiliated companies near the balance sheet date",
    "Verify the reconciling items on the year-end bank reconciliation, such as outstanding checks",
    "Test the propriety of the client's payroll disbursements"],
  answer:2,
  explain:"A cutoff bank statement covering a short period after year-end lets the auditor confirm that year-end reconciling items cleared as expected. Kiting is addressed with an interbank transfer schedule, not a cutoff statement.",
  ref:"AU-C 500 — cash, cutoff bank statement"
},
{
  id:"cpa-aud-a3-33", source:"AUD.A3", diff:"medium",
  q:"After observing the physical inventory count, the auditor tests unit costs by agreeing them to recent vendor invoices. This procedure primarily addresses which assertion?",
  choices:["Existence","Completeness","Rights and obligations over the inventory","Valuation and allocation"],
  answer:3,
  explain:"Testing unit costs against vendor invoices addresses valuation (inventory carried at the proper amount). Observing the count addresses existence, tracing count sheets to the records addresses completeness, and purchase terms address rights.",
  ref:"AU-C 500 — inventory valuation"
},
{
  id:"cpa-aud-a3-34", source:"AUD.A3", diff:"medium",
  q:"Examining shipping documents and sales invoices for the days just before and after year-end tests primarily the:",
  choices:[
    "Cutoff of sales — recording them in the correct period",
    "Collectibility of the resulting trade receivables",
    "Adequacy of the allowance established for expected future sales returns and allowances",
    "Physical existence of the finished-goods inventory on hand"],
  answer:0,
  explain:"Comparing shipping dates to recording dates around year-end tests sales cutoff (proper period). It does not measure collectibility, the returns allowance, or inventory existence.",
  ref:"AU-C 500 — sales cutoff"
},
{
  id:"cpa-aud-a3-35", source:"AUD.A3", diff:"hard",
  q:"Auditors often examine vendor statements and search for unrecorded liabilities rather than confirm accounts payable because:",
  choices:[
    "Confirmation of accounts payable balances is expressly prohibited by the auditing standards",
    "The main risk is completeness, and reliable external documents exist; confirming recorded payables only addresses existence",
    "Vendors are generally not permitted to respond to an auditor's confirmation request",
    "Accounts payable balances are never material to the financial statements"],
  answer:1,
  explain:"The main payables risk is understatement (completeness), which confirming recorded balances would not detect; vendor statements and the unrecorded-liability search give better external evidence. Confirmation is allowed but less useful here, and payables can be highly material.",
  ref:"AU-C 500 — accounts payable, completeness"
},
{
  id:"cpa-aud-a3-36", source:"AUD.A3", diff:"hard",
  q:"Monetary-unit sampling (MUS) is designed so that:",
  choices:[
    "Every account balance, regardless of its dollar size, has an exactly equal chance of being selected for the test",
    "Only the smallest-dollar items in the population are selected for testing",
    "Larger-dollar items have a higher probability of selection, making it effective at detecting overstatement",
    "The required sample size is unaffected by the tolerable misstatement"],
  answer:2,
  explain:"MUS selects each dollar with equal probability, so larger balances are more likely to be chosen; it is well suited to detecting overstatement. It is not equal-probability by item, does not target small items, and its sample size depends on tolerable misstatement.",
  ref:"AU-C 530 — monetary-unit sampling"
},
{
  id:"cpa-aud-a3-37", source:"AUD.A3", diff:"hard",
  q:"In a substantive test of details using sampling, after finding misstatements in the sample the auditor should:",
  choices:[
    "Ignore them entirely whenever each individual sampled item is immaterial on its own",
    "Adjust only the specific sampled items and then stop the procedure",
    "Assume the untested remainder of the population is fairly stated",
    "Project the misstatement to the population and compare it, with an allowance for sampling risk, to tolerable misstatement"],
  answer:3,
  explain:"The auditor projects the sample misstatement to the population and compares it (with an allowance for sampling risk) to tolerable misstatement to reach a conclusion. Correcting only sampled items or assuming the rest is fine defeats the purpose of sampling.",
  ref:"AU-C 530 — projected misstatement"
},
{
  id:"cpa-aud-a3-38", source:"AUD.A3", diff:"medium",
  q:"In auditing an accounting estimate, the auditor may do all of the following to evaluate reasonableness EXCEPT:",
  choices:[
    "Accept management's estimate without corroboration because estimates are subjective",
    "Test the process management used to develop it, including the underlying data and all significant assumptions",
    "Develop an independent point estimate or range for comparison with management's",
    "Review subsequent events or transactions that provide evidence about the estimate"],
  answer:0,
  explain:"The auditor must obtain evidence — by testing management's process, developing an independent estimate, or reviewing subsequent events — and cannot simply accept an estimate because it is subjective.",
  ref:"AU-C 540 — auditing estimates"
},
{
  id:"cpa-aud-a3-39", source:"AUD.A3", diff:"medium",
  q:"When auditing a fair value measurement, the auditor focuses primarily on:",
  choices:[
    "Whether the reported measurement is exactly equal to the asset's original historical cost",
    "The appropriateness of the valuation method and the reasonableness of the significant assumptions used",
    "Confirming the reported fair value directly with the entity's largest customers",
    "Whether the underlying asset physically exists at the measurement date, without regard to how it was valued"],
  answer:1,
  explain:"Auditing fair value centers on the appropriateness of the valuation method and the reasonableness and consistency of significant assumptions and data. Fair value need not equal historical cost, and customer confirmation or mere existence is not the focus.",
  ref:"AU-C 540 — fair value measurements"
},
{
  id:"cpa-aud-a3-40", source:"AUD.A3", diff:"hard",
  q:"After identifying events or conditions that raise substantial doubt about going concern, the auditor should:",
  choices:[
    "Immediately issue a disclaimer of opinion citing the substantial going-concern uncertainty involved",
    "Require the entity's management to begin an orderly liquidation",
    "Evaluate management's plans to mitigate the doubt and whether they can be effectively implemented",
    "Disregard the doubt if the entity reported a profit in the prior year"],
  answer:2,
  explain:"The auditor evaluates management's plans and whether it is probable they will be implemented and will mitigate the doubt. A disclaimer is not automatic, the auditor does not force liquidation, and prior profitability does not remove current doubt.",
  ref:"AU-C 570 — going concern, management's plans"
},
{
  id:"cpa-aud-a3-41", source:"AUD.A3", diff:"medium",
  q:"When the external auditor uses the work of the entity's internal audit function, the external auditor:",
  choices:[
    "May shift responsibility for the audit opinion to the internal audit function",
    "Must use all of internal audit's work product without any independent evaluation of its quality or objectivity",
    "Is entirely barred from using any of that work as audit evidence",
    "Stays solely responsible for the opinion and uses the work more when internal audit is competent and objective"],
  answer:3,
  explain:"The external auditor stays solely responsible for the opinion and evaluates internal audit's competence and objectivity, using the work more where quality is high; high-judgment or high-risk areas remain the external auditor's. Responsibility is never shifted, nor is the work used blindly or prohibited.",
  ref:"AU-C 610 — using internal auditors"
},

/* ---------------- AUD.A2 — Risk Assessment & Internal Control ------------- */
{
  id:"cpa-aud-a2-27", source:"AUD.A2", diff:"medium",
  q:"Which procedure ordinarily provides the STRONGEST evidence about the operating effectiveness of a control?",
  choices:[
    "Reperformance, or inspection of evidence that the control operated",
    "Inquiry of the relevant client personnel by itself",
    "Reading through the client's written accounting policy manual",
    "A single, casual observation of the process performed once during the planning phase"],
  answer:0,
  explain:"Reperformance and inspection of documentary evidence prove more convincingly that a control actually operated than inquiry alone, which is never sufficient by itself; reading a manual shows design, not operation.",
  ref:"AU-C 330 — nature of tests of controls"
},
{
  id:"cpa-aud-a2-28", source:"AUD.A2", diff:"medium",
  q:"During planning, the auditor notes that the gross margin percentage rose sharply and unexpectedly from the prior year. This most likely indicates:",
  choices:[
    "That no further audit work is needed, since higher gross margins are generally favorable",
    "A possible risk of material misstatement that should be investigated",
    "That the entity's internal controls are operating effectively",
    "That planning materiality should be increased"],
  answer:1,
  explain:"Unusual or unexpected relationships identified by analytical procedures signal a possible risk of material misstatement to investigate. A favorable-looking change is not self-explanatory and says nothing about control effectiveness or materiality levels.",
  ref:"AU-C 315/520 — analytical procedures in risk assessment"
},
{
  id:"cpa-aud-a2-29", source:"AUD.A2", diff:"hard",
  q:"Understanding the design and implementation of relevant controls is required on every audit; testing the operating effectiveness of those controls is required:",
  choices:[
    "On every audit engagement, without any exception",
    "Never, because sufficient appropriate audit evidence can always be obtained through substantive testing",
    "When the auditor intends to rely on controls, or when substantive procedures alone cannot suffice",
    "Only for first-year (initial) audit engagements"],
  answer:2,
  explain:"Operating-effectiveness testing is required when the auditor plans to rely on controls or when substantive procedures alone are insufficient (for example, highly automated processing). Understanding design and implementation is always required, but effectiveness testing is not automatic.",
  ref:"AU-C 330 — when to test controls"
},
{
  id:"cpa-aud-a2-30", source:"AUD.A2", diff:"hard",
  q:"Irrespective of the assessed risk of material misstatement, the auditor must perform certain substantive procedures, including:",
  choices:[
    "Confirming every single one of the entity's account balances directly with independent outside third parties",
    "Testing one hundred percent of the entity's transactions for the period",
    "Physically observing every asset the entity owns, wherever located",
    "Agreeing the statements to the underlying records and examining material journal entries and adjustments"],
  answer:3,
  explain:"For all audits, the auditor agrees or reconciles the statements to the underlying accounting records and examines material journal entries and adjustments (addressing management override). Confirming or testing everything, or observing all assets, is neither required nor feasible.",
  ref:"AU-C 330 — required substantive procedures"
},
{
  id:"cpa-aud-a2-31", source:"AUD.A2", diff:"medium",
  q:"Risks of material misstatement assessed at the overall financial-statement level (such as a weak control environment) are best addressed by:",
  choices:[
    "Overall responses, such as assigning more experienced staff and building in unpredictability",
    "A single confirmation of the year-end cash balance",
    "Ignoring them when the individual account balances look reasonable",
    "Applying only substantive analytical procedures broadly across all of the financial statements"],
  answer:0,
  explain:"Pervasive, financial-statement-level risks call for overall responses — more experienced or specialized staff, heightened skepticism, and unpredictable procedures. Assertion-level risks are handled with specific procedures; a single test or ignoring the risk is inadequate.",
  ref:"AU-C 330 — overall responses"
},

/* ---------------- AUD.A1 — Ethics & Professional Responsibilities --------- */
{
  id:"cpa-aud-a1-18", source:"AUD.A1", diff:"medium",
  q:"The requirement to exercise due professional care means the auditor should:",
  choices:[
    "Provide users an absolute guarantee that the financial statements are free of misstatement",
    "Have the competence and exercise the diligence expected of an auditor, using professional skepticism",
    "Detect every single instance of fraud, no matter how carefully management has concealed it from view",
    "Serve as a guarantor of the client's continued solvency"],
  answer:1,
  explain:"Due care requires appropriate competence, diligence, and professional skepticism — not perfection. The auditor does not guarantee freedom from all misstatement, detect every concealed fraud, or guarantee solvency.",
  ref:"AU-C 200 — due professional care"
},
{
  id:"cpa-aud-a1-19", source:"AUD.A1", diff:"medium",
  q:"The auditor's responsibility for detecting material misstatement caused by fraud versus by error is:",
  choices:[
    "Greater for error than for fraud in virtually all circumstances of the audit",
    "Limited to fraud only, not error",
    "The same — reasonable assurance the statements are free of material misstatement from either — though fraud is harder to detect due to concealment",
    "Effectively nonexistent for both fraud and error"],
  answer:2,
  explain:"The auditor seeks reasonable assurance the statements are free of material misstatement whether caused by fraud or error; the responsibility is the same, but concealment (collusion, forgery, override) makes fraud harder to detect.",
  ref:"AU-C 240 — fraud vs error"
},

/* ---------------- AUD.A4 — Forming Conclusions & Reporting ---------------- */
{
  id:"cpa-aud-a4-17", source:"AUD.A4", diff:"hard",
  q:"At the conclusion of the audit, uncorrected misstatements identified during the engagement should be:",
  choices:[
    "Disregarded whenever each one considered on its own falls below overall materiality",
    "Netted only against the misstatements that management already corrected",
    "Automatically treated as immaterial to the financial statements taken as a whole",
    "Accumulated and evaluated individually and in the aggregate against materiality, with correction requested or the opinion modified if material"],
  answer:3,
  explain:"The auditor accumulates uncorrected misstatements and evaluates them individually and in aggregate against materiality; if the total is material, the auditor requests correction or modifies the opinion. Individually immaterial items can still be material in aggregate.",
  ref:"AU-C 450 — evaluation of misstatements"
}

]);
