/* packs/originals/aud-batch-07.js — CPA · AUD original question bank (batch 07).
   ============================================================================
   16 original Auditing items modeled on the QUESTION PATTERNS in the Becker
   A4 MCQ sets — integrated-audit/ICFR reporting, SSARS engagements (review,
   compilation, preparation), and attestation (examination, agreed-upon
   procedures) — re-created with original scenarios and mapped by CONTENT to
   the AICPA areas so reporting does not overinflate:
     AUD.A4 Forming Conclusions & Reporting        → 8
     AUD.A3 Evidence & Procedures (review scope)   → 3
     AUD.A1 Ethics & Professional Responsibilities → 3 (engagement independence)
     AUD.A2 Risk & Internal Control (ICFR approach)→ 2
   Answer keys balanced 4 per option; distractor lengths varied.

   Scenarios are original; rules are public AICPA/PCAOB/SSARS/SSAE standards.
   Each distractor names a specific mistake. Schema:
   { id, source, diff, q, choices, answer (0-indexed), explain, ref }.
   ============================================================================ */
window.ACED_QUESTIONS = (window.ACED_QUESTIONS || []).concat([

/* ---------------- AUD.A4 — Forming Conclusions & Reporting ---------------- */
{
  id:"cpa-aud-a4-18", source:"AUD.A4", diff:"hard",
  q:"In an integrated audit, the auditor identifies a significant deficiency in ICFR but no material weakness. The opinion on ICFR should be:",
  choices:[
    "Unqualified",
    "Adverse, because any identified control deficiency precludes an unqualified opinion on ICFR",
    "Qualified on account of the significant deficiency identified during the engagement",
    "A disclaimer, since the auditor cannot conclude on the effectiveness of controls"],
  answer:0,
  explain:"Only a material weakness precludes an unqualified opinion on ICFR. A significant deficiency is communicated to the audit committee but does not by itself cause an adverse, qualified, or disclaimed ICFR opinion.",
  ref:"PCAOB AS 2201 — ICFR opinion"
},
{
  id:"cpa-aud-a4-19", source:"AUD.A4", diff:"hard",
  q:"Management imposes a scope limitation on the audit of ICFR that prevents the auditor from obtaining sufficient evidence about a material control. The auditor should:",
  choices:[
    "Issue an unqualified opinion on ICFR and note the limitation in an emphasis-of-matter paragraph",
    "Disclaim an opinion on ICFR (or withdraw)",
    "Issue an adverse opinion, because a scope limitation is equivalent to a material weakness",
    "Ignore the limitation if the financial-statement audit is otherwise unaffected"],
  answer:1,
  explain:"A significant scope limitation on the ICFR audit calls for a disclaimer of opinion (or withdrawal). It is not an adverse opinion (which addresses identified material weaknesses) or an unqualified opinion.",
  ref:"PCAOB AS 2201 — scope limitation"
},
{
  id:"cpa-aud-a4-20", source:"AUD.A4", diff:"medium",
  q:"In an integrated audit, the auditor's opinions on the financial statements and on ICFR may be presented:",
  choices:[
    "Only in a single combined report that may never be separated under any circumstances",
    "Only as two entirely separate reports that are issued on different dates",
    "In either a combined report or two separate reports",
    "In a combined report only when the opinions on both are unqualified and identical in wording"],
  answer:2,
  explain:"The auditor may issue a single combined report or separate reports on the financial statements and on ICFR. It is not restricted to one format, separate dates, or only unqualified conclusions.",
  ref:"PCAOB AS 2201 — form of report"
},
{
  id:"cpa-aud-a4-21", source:"AUD.A4", diff:"medium",
  q:"In a compilation engagement under SSARS, the accountant:",
  choices:[
    "Expresses limited (negative) assurance after performing inquiries of management and analytical procedures on the statements",
    "Must be independent of the entity and disclose the basis for that independence in the report",
    "Audits the underlying accounting records and issues an opinion on the financial statements",
    "Presents management's information without verifying it and provides no assurance"],
  answer:3,
  explain:"In a compilation the accountant assists in presenting management's information and is not required to verify it, obtain evidence, or provide any assurance. Limited assurance is a review, an opinion is an audit, and independence is not required for a compilation.",
  ref:"AR-C 80 — compilation engagements"
},
{
  id:"cpa-aud-a4-22", source:"AUD.A4", diff:"medium",
  q:"A preparation of financial statements engagement under SSARS results in:",
  choices:[
    "No assurance and no accountant's report",
    "A review report expressing limited assurance on the prepared financial statements",
    "An examination report providing positive assurance about the financial statements",
    "A compilation report that must disclose any lack of independence"],
  answer:0,
  explain:"A preparation engagement produces financial statements with no report and no assurance; each page (or a disclaimer) states that no assurance is provided. A review, examination, or compilation report is a different engagement.",
  ref:"AR-C 70 — preparation of financial statements"
},
{
  id:"cpa-aud-a4-23", source:"AUD.A4", diff:"medium",
  q:"An examination engagement performed under the attestation standards results in:",
  choices:[
    "A report of factual findings with no opinion or conclusion, restricted to specified parties",
    "An opinion providing reasonable (positive) assurance about the subject matter",
    "Limited assurance expressed as a negative-form conclusion about the subject matter",
    "No assurance, because attestation engagements never express any assurance"],
  answer:1,
  explain:"An attestation examination expresses an opinion with reasonable (positive) assurance, analogous to an audit. A findings report with no conclusion is agreed-upon procedures; a negative conclusion is an attestation review.",
  ref:"SSAE — examination engagements"
},
{
  id:"cpa-aud-a4-24", source:"AUD.A4", diff:"hard",
  q:"In an agreed-upon procedures (AUP) engagement, the practitioner:",
  choices:[
    "Expresses a positive opinion on whether the subject matter is fairly stated in all material respects",
    "Provides limited assurance through inquiry and analytical procedures on the subject matter",
    "Performs specific procedures and reports the findings, without expressing an opinion or conclusion",
    "Must audit the complete set of financial statements before reporting any findings"],
  answer:2,
  explain:"In an AUP engagement the practitioner performs procedures agreed with specified parties and reports factual findings, expressing no opinion or conclusion. Opinions and assurance are features of other engagement types.",
  ref:"SSAE — agreed-upon procedures"
},
{
  id:"cpa-aud-a4-25", source:"AUD.A4", diff:"medium",
  q:"Regarding other information included in an annual report that also contains the audited financial statements, the auditor is required to:",
  choices:[
    "Express a separate audit opinion on the other information accompanying the statements",
    "Perform a complete and separate audit of all the other information to verify its overall accuracy and completeness",
    "Disregard the other information entirely, since it lies outside the audit",
    "Read the other information and consider whether it is materially inconsistent with the audited statements"],
  answer:3,
  explain:"The auditor reads the other information and considers whether it is materially inconsistent with the audited statements (or the auditor's knowledge) or contains a material misstatement of fact, then responds if a problem exists. The auditor does not opine on or audit it, nor ignore it.",
  ref:"AU-C 720 — other information"
},

/* ---------------- AUD.A3 — Evidence & Procedures (review scope) ----------- */
{
  id:"cpa-aud-a3-42", source:"AUD.A3", diff:"medium",
  q:"A review of financial statements under SSARS consists primarily of:",
  choices:[
    "Inquiries of management and analytical procedures",
    "Tests of controls and external confirmations of significant account balances",
    "Obtaining an understanding of internal control and assessing control risk",
    "Physical observation of inventory and inspection of the entity's major assets"],
  answer:0,
  explain:"A review is limited primarily to inquiry and analytical procedures. Tests of controls, confirmations, understanding/assessing internal control, and physical observation are audit procedures not performed in a review.",
  ref:"AR-C 90 — review procedures"
},
{
  id:"cpa-aud-a3-43", source:"AUD.A3", diff:"medium",
  q:"Which procedure is ordinarily NOT performed in a SSARS review engagement?",
  choices:[
    "Inquiry of the entity's management and, when appropriate, others within the entity",
    "External confirmation of accounts receivable",
    "Analytical procedures applied to financial data",
    "Reading the financial statements for conformity with the applicable framework"],
  answer:1,
  explain:"A review does not include the corroborating procedures of an audit, such as confirmation; it relies on inquiry and analytical procedures. Confirmation would be performed in an audit, not a review.",
  ref:"AR-C 90 — scope of a review"
},
{
  id:"cpa-aud-a3-44", source:"AUD.A3", diff:"hard",
  q:"A review provides only limited assurance primarily because the procedures:",
  choices:[
    "Are performed exclusively by accountants who are not licensed as CPAs in public practice anywhere",
    "Cover only condensed or interim financial statements rather than complete annual ones",
    "Are substantially less in scope than an audit and omit control testing and corroboration",
    "Provide no assurance whatsoever to the users of the financial statements"],
  answer:2,
  explain:"A review is substantially less in scope than an audit — no understanding or testing of controls, no fraud-risk assessment, no corroborating evidence — so it yields only limited assurance. It is not defined by the preparer's license, the period covered, or a total absence of assurance.",
  ref:"AR-C 90 — limited assurance"
},

/* ---------------- AUD.A1 — Engagement Independence (ethics) --------------- */
{
  id:"cpa-aud-a1-20", source:"AUD.A1", diff:"medium",
  q:"Independence of the accountant is REQUIRED for which SSARS engagement?",
  choices:[
    "A preparation of financial statements engagement",
    "A review engagement",
    "A compilation engagement",
    "None of these engagements requires independence"],
  answer:1,
  explain:"A review requires the accountant to be independent. A compilation does not (though a lack of independence must be disclosed), and a preparation engagement has no independence requirement.",
  ref:"AR-C 90 — independence for reviews"
},
{
  id:"cpa-aud-a1-21", source:"AUD.A1", diff:"medium",
  q:"In a compilation engagement, if the accountant is not independent, the accountant:",
  choices:[
    "Must withdraw from the engagement immediately and decline to issue any compilation report",
    "Cannot perform the compilation under any circumstances whatsoever",
    "May still perform the compilation but must disclose the lack of independence in the report",
    "Need not do anything, since independence is irrelevant to every type of engagement"],
  answer:2,
  explain:"The accountant may perform a compilation without independence but must disclose that lack of independence in the compilation report. Independence is not required for a compilation, so withdrawal or refusal is unnecessary, yet the disclosure requirement applies.",
  ref:"AR-C 80 — compilation independence"
},
{
  id:"cpa-aud-a1-22", source:"AUD.A1", diff:"medium",
  q:"To perform an examination engagement under the attestation standards, the practitioner must:",
  choices:[
    "Merely disclose any lack of independence and then proceed with the examination anyway",
    "Be independent only when the subject matter happens to be financial in nature",
    "Have no independence requirement at all, because attestation differs from auditing",
    "Be independent of the responsible party"],
  answer:3,
  explain:"Independence is required to perform an attestation examination. Disclosing a lack of independence and proceeding is not permitted for an examination, and the requirement does not depend on whether the subject matter is financial.",
  ref:"SSAE — independence in attestation"
},

/* ---------------- AUD.A2 — ICFR Approach (risk & control) ----------------- */
{
  id:"cpa-aud-a2-32", source:"AUD.A2", diff:"hard",
  q:"In an integrated audit of internal control, the auditor uses a top-down approach, which:",
  choices:[
    "Tests every single control the entity has implemented, regardless of its relevance to reporting",
    "Begins with the individual transactions and processes and then works its way up toward the overall financial statements",
    "Focuses only on entity-level controls and disregards account-level controls entirely",
    "Starts at the financial-statement level and entity-level controls, then targets controls over relevant assertions in significant accounts"],
  answer:3,
  explain:"The top-down approach starts at the financial-statement level, considers entity-level controls, and then focuses on controls addressing relevant assertions in significant accounts and disclosures. It does not test every control, start at the transaction level, or ignore account-level controls.",
  ref:"PCAOB AS 2201 — top-down approach"
},
{
  id:"cpa-aud-a2-33", source:"AUD.A2", diff:"medium",
  q:"A material weakness in internal control over financial reporting is best described as:",
  choices:[
    "A deficiency, or combination, creating a reasonable possibility that a material misstatement will not be prevented or detected timely",
    "Any control deficiency whatsoever that is identified by the auditor during the engagement, no matter how minor",
    "A deficiency that is less severe than a significant deficiency",
    "A material misstatement that has already occurred and been recorded in the financial statements"],
  answer:0,
  explain:"A material weakness is a deficiency, or combination of deficiencies, such that there is a reasonable possibility that a material misstatement will not be prevented, or detected and corrected, on a timely basis. It is a potential control problem, not a misstatement itself, and is more severe than a significant deficiency.",
  ref:"PCAOB AS 2201 — material weakness"
}

]);
