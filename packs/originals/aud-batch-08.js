/* packs/originals/aud-batch-08.js — CPA · AUD original question bank (batch 08).
   ============================================================================
   14 original Auditing items modeled on the QUESTION PATTERNS in the Becker
   M5 (specialized) MCQ sets — single audit / governmental (GAGAS, Uniform
   Guidance, major programs, compliance), SOC reports (service organizations,
   SOC 1 vs SOC 2), and prospective financial information (forecasts,
   projections, pro forma). Re-created with original scenarios and mapped by
   CONTENT to the AICPA areas so reporting does not overinflate:
     AUD.A4 Forming Conclusions & Reporting        → 7
     AUD.A2 Risk & Internal Control (programs, SOC) → 4
     AUD.A1 Ethics & Professional Responsibilities → 3 (GAGAS)
   Answer keys balanced ~25% per option; distractor lengths varied so the
   correct choice is not systematically the longest.

   Single audit threshold reflects the 2024 Uniform Guidance ($1,000,000).
   Scenarios are original; rules are public GAGAS/Uniform Guidance/SSAE/AICPA
   standards. Each distractor names a specific mistake. Schema:
   { id, source, diff, q, choices, answer (0-indexed), explain, ref }.
   ============================================================================ */
window.ACED_QUESTIONS = (window.ACED_QUESTIONS || []).concat([

/* ---------------- AUD.A4 — Reporting on specialized engagements ----------- */
{
  id:"cpa-aud-a4-26", source:"AUD.A4", diff:"hard",
  q:"In addition to the reports issued in a GAAS financial-statement audit, a single audit under the Uniform Guidance requires the auditor to report on:",
  choices:[
    "Compliance for each major federal program and internal control over compliance",
    "The fair value of every asset that was purchased using any amount of federal award money",
    "The personal income tax returns of the officers who administer the federal programs",
    "A forecast of the entity's expected federal funding levels for the next five fiscal years"],
  answer:0,
  explain:"A single audit adds a report on compliance for each major program and on internal control over compliance, beyond the financial-statement audit reports. It does not opine on asset fair values, officers' tax returns, or funding forecasts.",
  ref:"Uniform Guidance — single audit reporting"
},
{
  id:"cpa-aud-a4-27", source:"AUD.A4", diff:"hard",
  q:"In a financial audit performed under Government Auditing Standards (the Yellow Book), the auditor is required to issue a written report on:",
  choices:[
    "The entity's projected future cash flows and its overall ability to repay all outstanding federal loans",
    "Internal control over financial reporting and on compliance with laws, regulations, and provisions of agreements",
    "Each individual employee's personal compliance with the entity's travel and expense policies",
    "The current market value of the entity's investment portfolio as of the audit date"],
  answer:1,
  explain:"GAGAS financial audits require a written report on internal control over financial reporting and on compliance, based on the work performed. The other items are not required GAGAS reports.",
  ref:"GAGAS (Yellow Book) — reporting"
},
{
  id:"cpa-aud-a4-28", source:"AUD.A4", diff:"medium",
  q:"How does a SOC 1 report differ from a SOC 2 report?",
  choices:[
    "A SOC 1 report is always prepared by the user's own external auditor, while a SOC 2 is prepared by the user entity's management",
    "A SOC 1 report covers a period of time, while a SOC 2 report is always as of a single point in time only",
    "A SOC 1 addresses controls relevant to user entities' financial reporting; a SOC 2 addresses the trust services criteria (security, availability, and so on)",
    "There is no meaningful difference; the two report types are fully interchangeable"],
  answer:2,
  explain:"A SOC 1 report addresses controls at a service organization relevant to user entities' internal control over financial reporting; a SOC 2 report addresses controls relevant to the trust services criteria (security, availability, processing integrity, confidentiality, privacy). Both are produced by the service auditor and can be Type 1 or Type 2.",
  ref:"AICPA SOC reporting — SOC 1 vs SOC 2"
},
{
  id:"cpa-aud-a4-29", source:"AUD.A4", diff:"hard",
  q:"The distinction between a financial forecast and a financial projection is that a projection:",
  choices:[
    "Is prepared only by publicly traded companies for the benefit of their outside investors and their regulators each year",
    "Covers only historical periods rather than any future periods of the entity",
    "Is always examined, whereas a financial forecast can only ever be compiled",
    "Is based on one or more hypothetical assumptions, whereas a forecast reflects expected conditions and actions"],
  answer:3,
  explain:"A financial projection is based on hypothetical ('what-if') assumptions; a financial forecast reflects the conditions the responsible party expects and the course of action it expects to take. Both address the future, and either can be examined or compiled.",
  ref:"SSAE — prospective financial information"
},
{
  id:"cpa-aud-a4-30", source:"AUD.A4", diff:"medium",
  q:"A financial projection's distribution is ordinarily:",
  choices:[
    "Restricted to specified parties, because it relies on hypothetical assumptions",
    "Available for completely general use, exactly as an audited financial statement would be",
    "Prohibited entirely, since a projection may never be issued to anyone at all",
    "Required to be filed publicly with the securities regulators along with the annual report"],
  answer:0,
  explain:"Because a projection is built on hypothetical assumptions, its use is restricted to the specified parties who understand those assumptions. A forecast may be for general use; projections are neither prohibited nor publicly filed by rule.",
  ref:"SSAE — restricted use of a projection"
},
{
  id:"cpa-aud-a4-31", source:"AUD.A4", diff:"medium",
  q:"Pro forma financial information is prepared to:",
  choices:[
    "Replace the entity's historical financial statements entirely within the annual report",
    "Show the effect of a transaction or event as if it had occurred at an earlier date",
    "Forecast the entity's revenues and expenses for the next several fiscal years ahead",
    "Present the personal financial position of the entity's individual owners and officers"],
  answer:1,
  explain:"Pro forma financial information shows how the historical statements might have looked had a transaction or event occurred earlier. It does not replace historical statements, forecast the future, or present owners' personal finances.",
  ref:"SSAE — pro forma financial information"
},
{
  id:"cpa-aud-a4-32", source:"AUD.A4", diff:"hard",
  q:"When a practitioner examines a financial forecast, the practitioner expresses an opinion on whether:",
  choices:[
    "The forecast effectively guarantees that the projected financial results will in fact be achieved by the entity",
    "The entity's historical financial statements were audited in accordance with GAAS in prior years",
    "The forecast is presented in conformity with AICPA guidelines and the assumptions provide a reasonable basis",
    "The entity will remain solvent throughout the entire forecast period without any exception"],
  answer:2,
  explain:"An examination of prospective financial information yields an opinion on whether it is presented in conformity with AICPA presentation guidelines and whether the underlying assumptions provide a reasonable basis. The practitioner never guarantees the results will be achieved.",
  ref:"SSAE — examination of a forecast"
},

/* ---------------- AUD.A2 — Risk, Programs & Service Organizations --------- */
{
  id:"cpa-aud-a2-34", source:"AUD.A2", diff:"hard",
  q:"Under the Uniform Guidance, the auditor identifies which federal programs are 'major programs' by:",
  choices:[
    "Selecting only the single largest federal program measured by total dollars expended during the fiscal year",
    "Choosing federal programs entirely at random from the schedule of expenditures of federal awards",
    "Testing every federal program the entity administers, regardless of its size or assessed risk",
    "Applying a risk-based approach that considers program size (Type A vs Type B) and assessed risk"],
  answer:3,
  explain:"The Uniform Guidance prescribes a risk-based approach: classify Type A versus Type B programs by size, then assess risk to determine which are audited as major programs. It is not simply the largest program, a random selection, or every program.",
  ref:"Uniform Guidance — major program determination"
},
{
  id:"cpa-aud-a2-35", source:"AUD.A2", diff:"medium",
  q:"Under the current Uniform Guidance, a non-federal entity generally must have a single audit when, in a fiscal year, it expends federal awards of at least:",
  choices:[
    "$1,000,000",
    "$100,000, which has long been the minimum for any recipient of federal award money",
    "$5,000,000, matching the threshold applied to large publicly traded companies",
    "Any amount at all, since every dollar of federal funding triggers a single audit"],
  answer:0,
  explain:"The 2024 Uniform Guidance raised the single audit threshold to $1,000,000 of federal awards expended in the entity's fiscal year (up from $750,000). Smaller expenditures do not trigger a single audit, and there is no $100,000 or $5,000,000 rule.",
  ref:"Uniform Guidance (2024) — single audit threshold"
},
{
  id:"cpa-aud-a2-36", source:"AUD.A2", diff:"hard",
  q:"A user auditor needs evidence about controls at a service organization but cannot obtain a satisfactory SOC report. The user auditor should:",
  choices:[
    "Automatically issue a disclaimer of opinion on the user entity's financial statements",
    "Perform alternative procedures, such as visiting the service organization or testing controls there",
    "Assume the service organization's controls are operating effectively without any evidence",
    "Ignore the service organization entirely, because the operation of its controls is solely the service auditor's concern"],
  answer:1,
  explain:"Without a satisfactory SOC report, the user auditor obtains evidence through alternative procedures — for example, visiting the service organization or arranging tests of its controls. The auditor neither disclaims automatically, assumes effectiveness, nor ignores the outsourced processing.",
  ref:"AU-C 402 — no service auditor report available"
},
{
  id:"cpa-aud-a2-37", source:"AUD.A2", diff:"medium",
  q:"When a user entity uses a service organization to process significant transactions, the user auditor must:",
  choices:[
    "Express an opinion directly on the service organization's own financial statements",
    "Rely entirely on the user entity management's verbal assurances about the service organization without further work",
    "Obtain an understanding of how the entity uses the service organization as part of understanding internal control",
    "Terminate the engagement, because outsourced processing cannot be audited"],
  answer:2,
  explain:"Understanding the user entity's internal control includes understanding how it uses the service organization and the related controls. The user auditor does not opine on the service organization's statements, rely blindly on management, or withdraw.",
  ref:"AU-C 402 — understanding a service organization"
},

/* ---------------- AUD.A1 — GAGAS Professional Responsibilities ------------ */
{
  id:"cpa-aud-a1-23", source:"AUD.A1", diff:"medium",
  q:"Auditors performing engagements under Government Auditing Standards must complete continuing professional education of:",
  choices:[
    "No continuing education, because GAGAS imposes no CPE requirement whatsoever on its auditors",
    "Only the general CPE required by their state board, with nothing specific to the government environment",
    "40 hours every single year, none of which is required to relate to government auditing",
    "80 hours every two years, including 24 hours directly related to government auditing"],
  answer:3,
  explain:"GAGAS requires 80 hours of CPE every two years, with at least 24 hours directly related to government auditing or the government environment. A blanket exemption or a purely general-CPE rule is incorrect.",
  ref:"GAGAS — continuing professional education"
},
{
  id:"cpa-aud-a1-24", source:"AUD.A1", diff:"hard",
  q:"Before performing a nonaudit service for an audited entity under GAGAS, the auditor should determine that:",
  choices:[
    "Management has the skills, knowledge, and experience to oversee the service and take responsibility for it",
    "The nonaudit service will generate a professional fee that is larger than the fee for the financial statement audit",
    "The audit firm has never previously performed any service of any kind for any government entity",
    "The service has been approved in advance by the federal Government Accountability Office"],
  answer:0,
  explain:"Under GAGAS, before providing a nonaudit service the auditor evaluates threats and confirms that management has the skills, knowledge, and experience (SKE) to oversee the service and accept responsibility for the results. Fee size, prior service, and GAO approval are not the test.",
  ref:"GAGAS — independence and nonaudit services"
},
{
  id:"cpa-aud-a1-25", source:"AUD.A1", diff:"medium",
  q:"GAGAS places special emphasis on which aspect of auditor independence in the government setting?",
  choices:[
    "Independence from the auditor's own immediate family members and their financial interests exclusively",
    "Freedom from organizational and external impairments to independence",
    "Independence only in appearance and never in fact for governmental engagements",
    "Independence solely with respect to the audit firm's other fee-paying clients"],
  answer:1,
  explain:"GAGAS stresses organizational independence and freedom from external impairments (such as political pressure or scope restrictions), in addition to personal independence. Independence is required in both fact and appearance, not one alone.",
  ref:"GAGAS — organizational independence"
}

]);
