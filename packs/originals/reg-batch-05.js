/* packs/originals/reg-batch-05.js — CPA · REG original question bank (batch 05).
   ============================================================================
   10 original Regulation items modeled on the QUESTION PATTERNS in the Becker
   R5 MCQ sets (business law deep-dive) plus the employment-tax content that
   recurs there. Mapped by CONTENT to the AICPA areas:
     REG.R2 Business Law → 8  (parol evidence, UCC firm offer, UCC §2-207
            additional terms, warranty disclaimers, discharge of contracts,
            suretyship, PMSI/secured transactions, offer termination)
     REG.R1 Ethics, Prof. Responsibilities & Federal Tax Procedures → 2
            (FICA, FUTA — federal employment taxes)
   Topics are distinct from batches 01–04. Rules are public (UCC, common law,
   IRC employment-tax provisions). Keys balanced across A/B/C/D; distractor
   lengths varied so the correct choice is not the longest. Schema:
   { id, source, diff, q, choices, answer (0-indexed), explain, ref }.
   ============================================================================ */
window.ACED_QUESTIONS = (window.ACED_QUESTIONS || []).concat([

/* ---------------- REG.R2 — Business Law (deeper) ------------------------- */
{
  id:"cpa-reg-r2-14", source:"REG.R2", diff:"hard",
  q:"Under the parol evidence rule, a completely integrated written contract generally may NOT be contradicted by:",
  choices:[
    "Evidence of a prior or contemporaneous oral agreement",
    "Evidence of a later, separately negotiated modification that both parties agreed to afterward",
    "Evidence offered to show the contract was induced by fraud",
    "Evidence explaining the meaning of an ambiguous term in the writing"],
  answer:0,
  explain:"The parol evidence rule bars prior or contemporaneous statements that contradict a fully integrated writing. It does not bar evidence of later modifications, fraud in the inducement, or evidence that merely clarifies an ambiguity.",
  ref:"Contract law — parol evidence rule"
},
{
  id:"cpa-reg-r2-15", source:"REG.R2", diff:"medium",
  q:"Under the UCC, a merchant's written and signed promise to hold an offer open is:",
  choices:[
    "Unenforceable unless the offeree pays separate consideration for it",
    "Irrevocable for the time stated, up to three months, even without consideration",
    "Revocable at any time before acceptance, like any common-law offer",
    "Enforceable only if the offeree is also a merchant who signs a written acknowledgment in reply to it"],
  answer:1,
  explain:"A merchant's signed written 'firm offer' is irrevocable for the time stated (maximum three months) without consideration. It is not conditioned on consideration, not freely revocable, and does not require the offeree to be a merchant.",
  ref:"UCC §2-205"
},
{
  id:"cpa-reg-r2-16", source:"REG.R2", diff:"hard",
  q:"Between two merchants, a definite acceptance that also states additional terms generally:",
  choices:[
    "Is automatically a rejection and counteroffer in every case",
    "Forms no contract at all, because the terms are not identical",
    "Forms a contract, and the additional terms usually become part of it unless they materially alter it or are objected to",
    "Forms a contract only if the original offeror later signs an entirely new written agreement that expressly contains every one of the added terms"],
  answer:2,
  explain:"Under UCC §2-207, between merchants a definite acceptance forms a contract even with additional terms, and those terms become part of the contract unless they materially alter it, the offer limited acceptance to its terms, or the offeror objects. It is not automatically a counteroffer, and no new signed agreement is required.",
  ref:"UCC §2-207"
},
{
  id:"cpa-reg-r2-17", source:"REG.R2", diff:"medium",
  q:"A seller sells goods 'as is.' Under the UCC, this language generally:",
  choices:[
    "Has no legal effect whatsoever on any of the warranties that would otherwise apply to the sale of the goods",
    "Disclaims only the express warranties the seller actually made",
    "Eliminates the seller's warranty of title automatically",
    "Disclaims the implied warranties of merchantability and fitness"],
  answer:3,
  explain:"Language like 'as is' disclaims implied warranties (merchantability and fitness for a particular purpose). It does not erase express warranties actually made, and the warranty of title is disclaimed only by specific language, not by 'as is.'",
  ref:"UCC §2-316"
},
{
  id:"cpa-reg-r2-18", source:"REG.R2", diff:"hard",
  q:"A contractual duty may be discharged by all of the following EXCEPT:",
  choices:[
    "A unilateral decision by one party to stop performing because performance became inconvenient",
    "Accord and satisfaction between the parties",
    "A novation that substitutes a new party",
    "Objective impossibility of performance arising from a supervening event outside either party's control"],
  answer:0,
  explain:"Duties are discharged by accord and satisfaction, novation, mutual rescission, or objective impossibility/impracticability — not by one party's unilateral choice to quit because performance became inconvenient, which is a breach.",
  ref:"Contract law — discharge"
},
{
  id:"cpa-reg-r2-19", source:"REG.R2", diff:"medium",
  q:"A surety who pays the creditor upon the principal debtor's default is generally entitled to:",
  choices:[
    "Nothing, because a surety assumes the debt as a gift to the debtor",
    "Reimbursement from the principal debtor (and, where applicable, subrogation and contribution)",
    "Double the amount paid, as a statutory penalty against the debtor",
    "Repayment only if the surety first obtains a separate court judgment declaring the debtor insolvent"],
  answer:1,
  explain:"A paying surety may seek reimbursement (indemnity) from the principal debtor, may be subrogated to the creditor's rights, and may seek contribution from co-sureties. The surety is not uncompensated, not entitled to a penalty multiple, and need not first prove insolvency.",
  ref:"Suretyship — surety's rights"
},
{
  id:"cpa-reg-r2-20", source:"REG.R2", diff:"hard",
  q:"A seller finances a consumer's purchase of a refrigerator and retains a purchase-money security interest (PMSI) in it. This PMSI in consumer goods is generally:",
  choices:[
    "Unperfected unless the seller physically takes possession of the refrigerator",
    "Perfected only by filing a financing statement with the state",
    "Perfected automatically upon attachment, without filing",
    "Subordinate to every later creditor who extends any credit at all to the consumer afterward"],
  answer:2,
  explain:"A PMSI in consumer goods perfects automatically upon attachment, without filing. Possession is not required, filing is not the only method here, and a PMSI generally enjoys priority rather than being subordinate.",
  ref:"UCC §9-309"
},
{
  id:"cpa-reg-r2-21", source:"REG.R2", diff:"medium",
  q:"An offeree responds to an offer with a counteroffer. At common law, the original offer is:",
  choices:[
    "Still open and available for the offeree to accept at a later time",
    "Converted into an irrevocable option contract",
    "Automatically accepted on its original terms",
    "Terminated"],
  answer:3,
  explain:"A counteroffer operates as a rejection that terminates the original offer and substitutes the counteroffer. The original is not still open, is not converted into an option (which requires consideration), and is not automatically accepted.",
  ref:"Contract law — termination of offer"
},

/* ---------------- REG.R1 — Federal Employment Taxes ---------------------- */
{
  id:"cpa-reg-r1-13", source:"REG.R1", diff:"medium",
  q:"Regarding FICA (Social Security and Medicare) taxes on an employee's wages:",
  choices:[
    "Both the employer and the employee pay a share, and the employer withholds and remits the employee's portion",
    "Only the employee pays; the employer has no FICA obligation",
    "Only the employer pays, and nothing is withheld from the employee",
    "They are entirely voluntary contributions that the employee may elect to decline to make at any point during the year"],
  answer:0,
  explain:"FICA is shared: employer and employee each pay a matching portion, and the employer withholds the employee's share and remits both halves. It is not employee-only, not employer-only, and not voluntary.",
  ref:"IRC §3101; §3111"
},
{
  id:"cpa-reg-r1-14", source:"REG.R1", diff:"medium",
  q:"The Federal Unemployment Tax Act (FUTA) tax is:",
  choices:[
    "Withheld from the employee's paycheck each pay period",
    "Paid by the employer only",
    "Split equally between the employer and the employee",
    "Imposed on the self-employed in place of the self-employment tax on their net earnings"],
  answer:1,
  explain:"FUTA is paid by the employer only and is not withheld from employees. It is not shared with employees, and it does not apply to the self-employed, who instead pay self-employment tax.",
  ref:"IRC §3301 (FUTA)"
}

]);
