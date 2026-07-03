/* packs/originals/aud-batch-09.js — CPA · AUD original question bank (batch 09).
   ============================================================================
   14 original Auditing items modeled on the QUESTION PATTERNS in the Becker
   A6 MCQ sets — the AICPA Code of Professional Conduct (commissions, referral
   fees, advertising, firm names, acts discreditable, integrity/objectivity,
   general standards, contingent fees, independence loans, gifts) plus SSARS
   reporting specifics. Re-created with original scenarios and mapped by CONTENT
   to the AICPA areas, weighted to Area I (ethics) to balance the pack:
     AUD.A1 Ethics & Professional Responsibilities → 10
     AUD.A4 Forming Conclusions & Reporting (SSARS)→ 3
     AUD.A2 Risk & Planning (engagement letter)    → 1
   Answer keys balanced ~25% per option; distractor lengths varied so the
   correct choice is not systematically the longest.

   Scenarios are original; rules are the public AICPA Code / SSARS. Each
   distractor names a specific mistake. Schema:
   { id, source, diff, q, choices, answer (0-indexed), explain, ref }.
   ============================================================================ */
window.ACED_QUESTIONS = (window.ACED_QUESTIONS || []).concat([

/* ---------------- AUD.A1 — AICPA Code of Professional Conduct ------------- */
{
  id:"cpa-aud-a1-26", source:"AUD.A1", diff:"medium",
  q:"Under the AICPA Code, a member in public practice may NOT accept a commission from a client when the member also:",
  choices:[
    "Performs an audit or review for that client",
    "Prepares the client's individual income tax return for a fixed hourly fee each year",
    "Provides bookkeeping services to a different, unrelated client entity",
    "Has been in public practice for fewer than five years in total"],
  answer:0,
  explain:"Commissions are prohibited when the member performs attest services (audit, review, certain others) for that client. For a non-attest client a commission may be permitted but must be disclosed. Tax prep for a fee, unrelated bookkeeping, or years of experience are irrelevant to the prohibition.",
  ref:"AICPA Code — Commissions Rule"
},
{
  id:"cpa-aud-a1-27", source:"AUD.A1", diff:"medium",
  q:"A member who receives a fee for referring a third party's product to a client must:",
  choices:[
    "Refuse the fee in all circumstances, since referral fees are categorically prohibited",
    "Disclose the referral fee to the client",
    "Remit the entire referral fee to the state board of accountancy",
    "Obtain written approval from the AICPA before accepting it"],
  answer:1,
  explain:"Referral fees are permitted but must be disclosed to the client. They are not categorically prohibited, remitted to the board, or subject to AICPA pre-approval.",
  ref:"AICPA Code — referral fees"
},
{
  id:"cpa-aud-a1-28", source:"AUD.A1", diff:"easy",
  q:"Under the AICPA Code, advertising by a CPA firm is:",
  choices:[
    "Prohibited entirely, because it is thought to undermine the dignity of the profession",
    "Permitted only in printed newspapers and professional journals, and never online",
    "Permitted, as long as it is not false, misleading, or deceptive",
    "Allowed only after the state board reviews and approves each advertisement"],
  answer:2,
  explain:"Advertising is permitted provided it is not false, misleading, or deceptive. It is not banned, limited to print, or subject to board pre-approval of each ad.",
  ref:"AICPA Code — advertising and solicitation"
},
{
  id:"cpa-aud-a1-29", source:"AUD.A1", diff:"medium",
  q:"Under the AICPA Code, a CPA firm's name:",
  choices:[
    "Must at all times include the full names of every one of the firm's current partners",
    "May never include the name of a partner who has retired from or died in the firm",
    "Must be pre-approved in writing by the AICPA ethics division before use",
    "May not be misleading about the firm's form of organization or who is in the firm"],
  answer:3,
  explain:"A firm name is permitted so long as it is not misleading (for example, about the firm's structure or membership). It need not list every partner, may include a retired or deceased partner's name in some cases, and is not pre-approved by the AICPA.",
  ref:"AICPA Code — form of organization and name"
},
{
  id:"cpa-aud-a1-30", source:"AUD.A1", diff:"medium",
  q:"After a fee dispute arises, a client requests the return of its own records (documents the client originally provided). Under the AICPA Code, the member should:",
  choices:[
    "Return the client-provided records, even though fees remain unpaid",
    "Withhold all of the records until the client pays every outstanding invoice in full",
    "Destroy the records so that the client cannot use them against the member",
    "Transfer the records directly to a successor accountant without informing the client"],
  answer:0,
  explain:"Client-provided records must be returned on request even if fees are unpaid; withholding them to coerce payment is an act discreditable. Destroying records or diverting them without the client's knowledge is improper.",
  ref:"AICPA Code — Acts Discreditable Rule"
},
{
  id:"cpa-aud-a1-31", source:"AUD.A1", diff:"hard",
  q:"A staff accountant believes the financial statements are materially misstated, but a supervisor directs that no change be made. Under the integrity and objectivity rule, the accountant should:",
  choices:[
    "Defer entirely to the supervisor's position, since the supervisor clearly outranks the staff accountant",
    "Not knowingly subordinate professional judgment, and pursue the disagreement through appropriate channels",
    "Immediately resign from the firm without raising the matter internally at all",
    "Report the supervisor to the police for suspected criminal fraud right away"],
  answer:1,
  explain:"The integrity and objectivity rule prohibits knowingly subordinating one's judgment; the accountant should escalate the disagreement through appropriate channels. Blind deference is a violation, while immediate resignation or a police report is not the prescribed first step.",
  ref:"AICPA Code — Integrity and Objectivity Rule"
},
{
  id:"cpa-aud-a1-32", source:"AUD.A1", diff:"medium",
  q:"The AICPA Code's General Standards Rule requires a member to comply with all of the following EXCEPT:",
  choices:[
    "Undertake only those services the member can reasonably expect to complete with professional competence",
    "Exercise due professional care in performing professional services",
    "Guarantee the accuracy of every forecast or projection with which the member is associated",
    "Adequately plan and supervise the performance of professional services"],
  answer:2,
  explain:"The General Standards Rule requires professional competence, due professional care, planning and supervision, and sufficient relevant data — not a guarantee of forecast accuracy, which no member can provide.",
  ref:"AICPA Code — General Standards Rule"
},
{
  id:"cpa-aud-a1-33", source:"AUD.A1", diff:"medium",
  q:"Under the AICPA Code, a contingent fee is prohibited for:",
  choices:[
    "Representing a client in an examination of the client's return by a taxing authority",
    "A consulting engagement for a client for whom the member performs no attest services",
    "A matter in which the fee is fixed by a court or other public authority",
    "Preparing an original tax return for the client"],
  answer:3,
  explain:"Preparing an original tax return for a contingent fee is prohibited. Representing a client in an examination, consulting for a non-attest client, or a fee fixed by a court are permitted exceptions.",
  ref:"AICPA Code — Contingent Fees Rule"
},
{
  id:"cpa-aud-a1-34", source:"AUD.A1", diff:"hard",
  q:"Which loan from a financial-institution audit client would ordinarily NOT impair a covered member's independence?",
  choices:[
    "A car loan collateralized by the automobile, obtained under the institution's normal lending terms",
    "A large, unsecured personal loan obtained from the client on specially favorable, below-market terms",
    "A loan taken out specifically to purchase shares of the audit client itself",
    "An interest-free loan that has no fixed repayment date at all"],
  answer:0,
  explain:"Certain 'permitted' and grandfathered loans — such as an auto loan secured by the vehicle on normal terms — do not impair independence. Unsecured loans on favorable terms, loans to buy client stock, or off-market interest-free loans are impairing.",
  ref:"AICPA Code — permitted loans"
},
{
  id:"cpa-aud-a1-35", source:"AUD.A1", diff:"medium",
  q:"A member accepts small token gifts from a client. Under the AICPA Code, this:",
  choices:[
    "Always impairs the member's independence and objectivity, regardless of how small the gift is",
    "May be acceptable if the gifts are clearly insignificant and reasonable in the circumstances",
    "Is permitted only when the gifts are reported to the state board of accountancy",
    "Requires the member to resign from the engagement immediately upon acceptance"],
  answer:1,
  explain:"Gifts or entertainment that are clearly insignificant and reasonable may be acceptable; only those not reasonable in the circumstances create a threat requiring safeguards or would impair objectivity. Reporting to the board or resigning is not required for token gifts.",
  ref:"AICPA Code — gifts and entertainment"
},

/* ---------------- AUD.A4 — SSARS Reporting Specifics ---------------------- */
{
  id:"cpa-aud-a4-33", source:"AUD.A4", diff:"hard",
  q:"During a SSARS review, the accountant identifies a material departure from the applicable framework that management will not correct. The accountant should:",
  choices:[
    "Withdraw immediately and issue no communication of any kind to the client",
    "Express an unmodified conclusion but attach the entity's tax return for additional context",
    "Modify the review conclusion to describe the departure or its effects",
    "Convert the engagement to a compilation in order to avoid mentioning the departure"],
  answer:2,
  explain:"A known, uncorrected material departure in a review leads the accountant to modify the review conclusion and disclose the departure (or its effects). Withdrawing silently, ignoring it, or downgrading the engagement to hide it is improper.",
  ref:"AR-C 90 — modified review conclusion"
},
{
  id:"cpa-aud-a4-34", source:"AUD.A4", diff:"medium",
  q:"In a SSARS review, substantial doubt about going concern exists and is adequately disclosed in the notes. The accountant ordinarily:",
  choices:[
    "Expresses an adverse conclusion on the entity's financial statements taken as a whole",
    "Disclaims any conclusion, because going concern cannot be evaluated in a review",
    "Withdraws from the review engagement automatically",
    "Adds an emphasis-of-matter paragraph referring to the going-concern disclosure, without modifying the conclusion"],
  answer:3,
  explain:"With adequate disclosure, the accountant adds an emphasis-of-matter paragraph highlighting the going-concern matter and does not modify the conclusion. An adverse conclusion, disclaimer, or automatic withdrawal is not appropriate when disclosure is adequate.",
  ref:"AR-C 90 — going concern in a review"
},
{
  id:"cpa-aud-a4-35", source:"AUD.A4", diff:"hard",
  q:"The current-period statements are reviewed, while the prior-period statements presented for comparison were compiled. The accountant's report should:",
  choices:[
    "Cover both periods, describing the review of the current period and the compilation of the prior period",
    "Address only the current period and omit any mention of the prior period presented",
    "Upgrade the prior-period statements to a review without performing any of the additional required procedures",
    "Express an audit opinion covering both of the periods presented"],
  answer:0,
  explain:"When comparative statements carry different levels of service, the report describes each period's engagement (here, a review of the current period and a compilation of the prior). It does not ignore the prior period, silently upgrade it, or claim an audit.",
  ref:"AR-C 90 — comparative statements"
},

/* ---------------- AUD.A2 — Engagement Acceptance -------------------------- */
{
  id:"cpa-aud-a2-38", source:"AUD.A2", diff:"medium",
  q:"For a SSARS review, compilation, or preparation engagement, an engagement letter (or other written agreement) is:",
  choices:[
    "Optional and, as a matter of practice, only rarely used for these types of engagements",
    "Required, and should be signed by the accountant (or firm) and management",
    "Required only when the client is a publicly traded company",
    "Prohibited, because SSARS engagements are informal by their nature"],
  answer:1,
  explain:"SSARS requires a written engagement understanding for review, compilation, and preparation engagements, signed by the accountant/firm and management. It is neither optional, limited to issuers, nor prohibited.",
  ref:"AR-C — engagement letter"
}

]);
