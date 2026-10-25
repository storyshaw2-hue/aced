/* packs/originals/reg-batch-03.js — CPA · REG original question bank (batch 03).
   ============================================================================
   20 original Regulation items modeled on the QUESTION PATTERNS in the Becker
   R4 MCQ sets. Re-created with original facts and mapped by CONTENT to the
   AICPA areas they test:
     REG.R1 Ethics, Professional Responsibilities & Federal Tax Procedures → 9
            (Circular 230, preparer penalties, §7525 privilege, accountant
             common-law and statutory liability — the "legal duties &
             responsibilities" content the AICPA places in Area I)
     REG.R2 Business Law → 11
            (contracts, UCC sales, agency, negotiable instruments, secured
             transactions, bankruptcy)
   This fills the REG.R2 module (previously the only empty area) and deepens
   the thin REG.R1 module.

   Rules cited are public law (IRC/Circular 230, common law, the UCC, the
   Bankruptcy Code, and the federal securities acts). Answer keys balanced
   5/5/5/5 across A/B/C/D; distractor lengths varied so the correct choice is
   not systematically longest. Each distractor names a specific mistake. Schema:
   { id, source, diff, q, choices, answer (0-indexed), explain, ref }.
   ============================================================================ */
window.ACED_QUESTIONS = (window.ACED_QUESTIONS || []).concat([

/* ---------------- REG.R1 — Ethics, Prof. Responsibilities & Tax Procedures */
{
  id:"cpa-reg-r1-04", source:"REG.R1", diff:"medium",
  q:"Under Circular 230, a practitioner who receives a client's request for records the client needs to comply with federal tax obligations must generally:",
  choices:[
    "Promptly return those records to the client, even if a fee dispute exists",
    "Retain the records until all outstanding fees for the engagement have been paid in full",
    "Forward the records only to a successor practitioner",
    "Destroy the records automatically after three years"],
  answer:0,
  explain:"Circular 230 requires returning records the client needs to meet tax obligations, even amid a fee dispute (the practitioner may keep certain work product where state law permits). Withholding to force payment, diverting only to a successor, or destroying records is improper.",
  ref:"Circular 230 §10.28"
},
{
  id:"cpa-reg-r1-05", source:"REG.R1", diff:"medium",
  q:"Which sanction may the IRS Office of Professional Responsibility (OPR) impose on a practitioner who violates Circular 230?",
  choices:[
    "A criminal prison sentence imposed directly by the OPR",
    "Censure, suspension, or disbarment from practice before the IRS",
    "Revocation of the practitioner's state CPA license",
    "An automatic bar from ever preparing any tax return again anywhere in the country"],
  answer:1,
  explain:"OPR may censure, suspend, disbar, or impose monetary penalties on practitioners before the IRS. It cannot imprison (only courts can) or revoke a state-issued CPA license (that is the state board's authority).",
  ref:"Circular 230 §10.50"
},
{
  id:"cpa-reg-r1-06", source:"REG.R1", diff:"hard",
  q:"A tax return preparer takes an undisclosed position that lacks substantial authority, resulting in an understatement of tax. The preparer penalty generally applies UNLESS:",
  choices:[
    "The client, rather than the preparer, signed the return",
    "The understatement is less than $1,000 in tax",
    "There was substantial authority for the position",
    "The preparer relied entirely on tax software without reviewing the return, which the preparer argues eliminates responsibility"],
  answer:2,
  explain:"For an unreasonable position, the §6694 penalty is avoided by substantial authority (if undisclosed) or reasonable basis plus disclosure. It does not turn on who signed, a tax-dollar threshold, or blind reliance on software.",
  ref:"IRC §6694(a)"
},
{
  id:"cpa-reg-r1-07", source:"REG.R1", diff:"medium",
  q:"A preparer's understatement of a client's tax that is due to willful or reckless conduct is subject to:",
  choices:[
    "No penalty, because only the taxpayer is liable for the tax",
    "A penalty that applies only if the IRS proves criminal intent beyond a reasonable doubt in court",
    "A fixed $50 penalty per return",
    "A larger penalty than the penalty for an unreasonable position"],
  answer:3,
  explain:"Willful or reckless conduct triggers a higher §6694(b) penalty (the greater of a set dollar amount or a percentage of the income derived). It is not zero, not conditioned on criminal proof, and not a token fixed amount.",
  ref:"IRC §6694(b)"
},
{
  id:"cpa-reg-r1-08", source:"REG.R1", diff:"easy",
  q:"A signing tax return preparer is required to:",
  choices:[
    "Sign the return and furnish a completed copy to the taxpayer",
    "Guarantee that the IRS will not audit the return in the future",
    "Personally pay any additional tax the IRS later assesses against the client",
    "Obtain the taxpayer's power of attorney before completing any return at all"],
  answer:0,
  explain:"A signing preparer must sign the return, include a PTIN, provide the taxpayer a copy, and retain records. Preparers do not guarantee against audit, assume the client's tax, or need a power of attorney merely to prepare a return.",
  ref:"IRC §6695"
},
{
  id:"cpa-reg-r1-09", source:"REG.R1", diff:"hard",
  q:"The federally authorized tax practitioner privilege under IRC §7525:",
  choices:[
    "Applies in criminal tax proceedings as well as civil ones",
    "Applies to civil tax matters before the IRS and federal courts, but not to criminal matters or tax-shelter promotion",
    "Is identical in every respect to the traditional attorney-client privilege in all legal contexts, civil and criminal alike",
    "Protects all communications the taxpayer has with any bookkeeper, payroll clerk, or unenrolled return preparer"],
  answer:1,
  explain:"The §7525 privilege covers tax advice in civil matters before the IRS and in federal courts; it does not reach criminal proceedings or communications promoting tax shelters, and it is narrower than the attorney-client privilege. It applies only to federally authorized practitioners such as CPAs and EAs.",
  ref:"IRC §7525"
},
{
  id:"cpa-reg-r1-10", source:"REG.R1", diff:"medium",
  q:"An accountant who fails to exercise the due care of a reasonably competent practitioner, causing a client loss, is liable to the client for:",
  choices:[
    "Nothing, because accountants are never liable for mere mistakes",
    "Only the fee charged for the engagement",
    "Ordinary negligence",
    "Fraud, regardless of whether any intent to deceive can be shown at all"],
  answer:2,
  explain:"Failing to exercise due care is ordinary negligence, for which the accountant is liable to the client (and to known or intended third-party beneficiaries). It is not automatically excused, not capped at the fee, and not fraud absent scienter.",
  ref:"Common law — negligence"
},
{
  id:"cpa-reg-r1-11", source:"REG.R1", diff:"hard",
  q:"For which type of accountant misconduct is the accountant generally liable to ALL reasonably foreseeable third parties, not just the client?",
  choices:[
    "A breach of the engagement letter's filing deadline",
    "Ordinary negligence, in a jurisdiction that follows the narrow privity or near-privity approach to accountant liability",
    "A late filing caused by the client's own delay in providing records",
    "Actual or constructive fraud, including gross negligence"],
  answer:3,
  explain:"Fraud and constructive fraud (gross negligence) expose the accountant to all reasonably foreseeable third parties. Ordinary-negligence liability to third parties is limited under the privity/Ultramares or Restatement approaches, and contract or client-caused delays are separate matters.",
  ref:"Common law — fraud vs negligence"
},
{
  id:"cpa-reg-r1-12", source:"REG.R1", diff:"hard",
  q:"Under Section 11 of the Securities Act of 1933, a plaintiff suing an auditor over a materially misstated registration statement generally:",
  choices:[
    "Need not prove reliance or that the auditor was negligent; the auditor must instead establish a due-diligence defense",
    "Must prove that the auditor acted with scienter, meaning an actual intent to deceive, manipulate, or defraud investors",
    "Must be in privity of contract with the auditor to recover anything",
    "Can recover only if the auditor was first criminally convicted in a separate proceeding"],
  answer:0,
  explain:"Under 1933 Act §11, the plaintiff need only show a material misstatement or omission (reliance and negligence generally need not be proven); the auditor's principal defense is due diligence. Scienter and privity are not required — scienter is a 1934 Act §10(b)/Rule 10b-5 element.",
  ref:"Securities Act of 1933 §11"
},

/* ---------------- REG.R2 — Business Law ---------------------------------- */
{
  id:"cpa-reg-r2-01", source:"REG.R2", diff:"easy",
  q:"Which of the following is required for a valid, enforceable contract?",
  choices:[
    "That the agreement be reduced to writing in every case",
    "Consideration — a bargained-for exchange of legal value",
    "That both parties be represented by attorneys",
    "That the contract be filed with a government agency in order to take effect"],
  answer:1,
  explain:"A contract requires an offer, acceptance, and consideration (a bargained-for exchange of legal value), plus capacity and legality. Most contracts need not be written, do not require attorneys, and are not government-filed.",
  ref:"Contract law — elements"
},
{
  id:"cpa-reg-r2-02", source:"REG.R2", diff:"medium",
  q:"Under the common-law 'mailbox rule,' an acceptance of an offer is generally effective:",
  choices:[
    "Only when the offeror actually reads it",
    "When the offeror receives it",
    "When the offeree dispatches it (for example, places it in the mail)",
    "Only after both parties sign a single written document together, in person"],
  answer:2,
  explain:"Under the mailbox rule, acceptance is effective upon dispatch, while revocations and rejections are effective on receipt. It is not delayed until the offeror reads or receives it, and no simultaneous in-person signing is required.",
  ref:"Contract law — acceptance"
},
{
  id:"cpa-reg-r2-03", source:"REG.R2", diff:"medium",
  q:"A promise to pay a person extra for work the person is already contractually obligated to perform is generally:",
  choices:[
    "Fully enforceable as a valid modification, even though nothing new is given in exchange",
    "Enforceable because past performance is valid consideration",
    "Enforceable only if the additional promise has been formally notarized and witnessed by a licensed public notary",
    "Unenforceable, because there is no new consideration for the additional promise"],
  answer:3,
  explain:"Under the pre-existing duty rule, doing what one is already bound to do is not consideration, so the extra-pay promise is unenforceable at common law without new consideration. Notarization does not cure the defect. (The UCC relaxes this for good-faith modifications of goods contracts.)",
  ref:"Contract law — pre-existing duty"
},
{
  id:"cpa-reg-r2-04", source:"REG.R2", diff:"medium",
  q:"Which contract must be in writing to be enforceable under the statute of frauds?",
  choices:[
    "A contract for the sale of land",
    "A contract that can be fully performed within one week",
    "A contract to buy a $50 pair of shoes",
    "An agreement to paint a house for $300, to be completed next month"],
  answer:0,
  explain:"The statute of frauds requires a writing for, among others, sales of land, agreements not performable within one year, sales of goods of $500 or more, and suretyship promises. Short-term, low-dollar, and within-one-year service contracts need not be written.",
  ref:"Statute of frauds"
},
{
  id:"cpa-reg-r2-05", source:"REG.R2", diff:"hard",
  q:"Under the UCC, in a shipment contract (FOB seller's location) using a common carrier, risk of loss passes to the buyer when:",
  choices:[
    "The buyer receives and inspects the goods",
    "The seller delivers conforming goods to the carrier",
    "The seller receives payment in full",
    "The goods reach the buyer's designated place of business and are unloaded there"],
  answer:1,
  explain:"In a shipment contract, risk of loss passes when the seller duly delivers conforming goods to the carrier. In a destination contract it passes on tender at the destination. Receipt/inspection, payment, or unloading is not the trigger for a shipment contract.",
  ref:"UCC §2-509"
},
{
  id:"cpa-reg-r2-06", source:"REG.R2", diff:"medium",
  q:"The UCC implied warranty of merchantability arises automatically when:",
  choices:[
    "Any seller, whether or not a merchant, sells any goods",
    "The buyer specifically requests a written warranty",
    "A merchant who deals in goods of that kind sells them",
    "The seller expressly promises that the goods will last for a specific number of years"],
  answer:2,
  explain:"The implied warranty of merchantability is given by a merchant who deals in goods of that kind, warranting the goods are fit for their ordinary purpose. Non-merchant sellers do not give it, no buyer request is needed, and an express durability promise is an express warranty.",
  ref:"UCC §2-314"
},
{
  id:"cpa-reg-r2-07", source:"REG.R2", diff:"medium",
  q:"A principal is bound by an agent's contract with a third party when the agent acts with:",
  choices:[
    "No authority of any kind, as long as the agent intended to help the principal",
    "Only express written authority spelled out in a formal document",
    "Authority that the agent privately believes exists in their own mind but that the principal never communicated to anyone",
    "Actual authority (express or implied) or apparent authority"],
  answer:3,
  explain:"A principal is bound when the agent has actual authority (express or implied) or apparent authority (created by the principal's manifestations to the third party). An agent's private belief, or a total absence of authority, does not bind the principal, and authority need not be written.",
  ref:"Agency — authority"
},
{
  id:"cpa-reg-r2-08", source:"REG.R2", diff:"medium",
  q:"Under respondeat superior, a principal (employer) is generally liable for an agent's (employee's) tort when the tort is committed:",
  choices:[
    "Within the scope of employment",
    "While the employee is off duty and pursuing purely personal matters",
    "Only if the employer personally directed the specific wrongful act",
    "Only after the injured third party first sues the employee and fails to collect anything from them"],
  answer:0,
  explain:"An employer is vicariously liable for an employee's torts committed within the scope of employment. Off-duty personal conduct falls outside the scope; the employer need not have directed the act, and the third party need not first pursue the employee.",
  ref:"Agency — respondeat superior"
},
{
  id:"cpa-reg-r2-09", source:"REG.R2", diff:"hard",
  q:"A holder in due course of a negotiable instrument takes it free of:",
  choices:[
    "Real defenses such as forgery and fraud in the execution",
    "Personal defenses such as breach of contract or failure of consideration",
    "All defenses of every kind, without exception",
    "Nothing at all, because a holder in due course has the same rights as an ordinary contract assignee"],
  answer:1,
  explain:"A holder in due course takes free of personal defenses (e.g., breach, failure of consideration) but remains subject to real defenses (forgery, fraud in the execution, material alteration, infancy, discharge in bankruptcy). It is neither free of all defenses nor merely an ordinary assignee.",
  ref:"UCC Article 3 — HDC"
},
{
  id:"cpa-reg-r2-10", source:"REG.R2", diff:"hard",
  q:"For a security interest to be enforceable against the debtor (attachment), which is required?",
  choices:[
    "Filing a financing statement with the state's central filing office",
    "Taking physical possession of the collateral in every case",
    "Value given, the debtor has rights in the collateral, and an authenticated security agreement",
    "A public notice published in a newspaper of general circulation once a week for at least three consecutive weeks"],
  answer:2,
  explain:"Attachment (enforceability against the debtor) requires value, the debtor's rights in the collateral, and a security agreement (or the creditor's possession/control). Filing a financing statement is for perfection — priority against third parties — not attachment; newspaper notice is irrelevant.",
  ref:"UCC §9-203"
},
{
  id:"cpa-reg-r2-11", source:"REG.R2", diff:"medium",
  q:"Which statement about the bankruptcy chapters is correct?",
  choices:[
    "Chapter 7 is a reorganization proceeding that allows a struggling business to keep operating under a plan approved by the court and its creditors",
    "Chapter 11 always requires the immediate liquidation of all of the debtor's assets",
    "Chapter 13 is available to large, publicly traded corporations",
    "Chapter 7 is a liquidation, Chapter 11 is a reorganization, and Chapter 13 is an adjustment of an individual's debts"],
  answer:3,
  explain:"Chapter 7 is liquidation, Chapter 11 is reorganization (often used by businesses), and Chapter 13 is an adjustment of debts of an individual with regular income. Chapter 7 is not a reorganization, Chapter 11 is not automatic liquidation, and Chapter 13 is not for large public corporations.",
  ref:"Bankruptcy Code — Chapters 7/11/13"
}

]);
