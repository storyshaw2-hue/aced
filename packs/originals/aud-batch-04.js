/* packs/originals/aud-batch-04.js — CPA · AUD original question bank (batch 04).
   ============================================================================
   16 original Auditing items:
     AUD.A1 Ethics, Independence & Professional Responsibilities → 6
     AUD.A3 Evidence & Procedures (sampling, specialists, docs)  → 5
     AUD.A4 Forming Conclusions & Reporting                      → 5
   Answer keys are balanced 4 per option; distractor lengths are varied.

   Scenarios are original; rules are public AICPA/PCAOB/SSARS standards. Each
   distractor names a specific mistake. Schema:
   { id, source, diff, q, choices, answer (0-indexed), explain, ref }.
   ============================================================================ */
window.ACED_QUESTIONS = (window.ACED_QUESTIONS || []).concat([

/* ---------------- AUD.A1 — Ethics, Independence & Responsibilities -------- */
{
  id:"cpa-aud-a1-09", source:"AUD.A1", diff:"medium",
  q:"Under the Sarbanes-Oxley Act, the lead and concurring audit partners on an issuer engagement must rotate off after serving for:",
  choices:["5 consecutive years","3 consecutive years","7 consecutive years","10 consecutive years"],
  answer:0,
  explain:"SOX requires the lead and concurring (engagement quality review) partners to rotate off after five consecutive years, followed by a five-year time-out. The other intervals are incorrect.",
  ref:"SOX §203 — partner rotation"
},
{
  id:"cpa-aud-a1-10", source:"AUD.A1", diff:"hard",
  q:"Under the AICPA Confidential Client Information Rule, a member may disclose confidential client information WITHOUT the client's consent when:",
  choices:[
    "A prospective client requests it to evaluate the member",
    "It would help the member market services to other companies",
    "Responding to a validly issued and enforceable subpoena or summons",
    "A competitor of the client asks for the information"],
  answer:2,
  explain:"Disclosure without consent is permitted only in limited circumstances such as a valid subpoena/summons, a peer review, or an authorized regulatory inquiry. Marketing, prospective clients, or competitors are never valid reasons.",
  ref:"AICPA Code — Confidential Client Information Rule"
},
{
  id:"cpa-aud-a1-11", source:"AUD.A1", diff:"medium",
  q:"A CPA firm may NOT accept a contingent fee from which of the following?",
  choices:[
    "Representing a client before the IRS on an examination",
    "Consulting services performed for a nonattest client",
    "A fee that is fixed by a court in a legal matter",
    "An audit of the client's financial statements"],
  answer:3,
  explain:"Contingent fees are prohibited for clients for whom the firm performs attest services (audit, review, certain exams). Many tax representation and consulting arrangements for nonattest clients, and court-fixed fees, are permitted.",
  ref:"AICPA Code — Contingent Fees Rule"
},
{
  id:"cpa-aud-a1-12", source:"AUD.A1", diff:"medium",
  q:"Before accepting an engagement, a successor auditor's communication with the predecessor auditor requires:",
  choices:[
    "Approval from the AICPA before any contact",
    "The client's permission, because the predecessor's confidentiality duty continues",
    "No client involvement of any kind",
    "Payment of the predecessor's unpaid fees first"],
  answer:1,
  explain:"The successor must obtain the client's permission because the predecessor remains bound by confidentiality. Inquiries cover management integrity, disagreements over accounting or auditing, and the reason for the change.",
  ref:"AU-C 210 — predecessor auditor communication"
},
{
  id:"cpa-aud-a1-13", source:"AUD.A1", diff:"hard",
  q:"Under SOX, a one-year 'cooling-off' period is required before a member of the audit engagement team may become:",
  choices:[
    "A staff accountant at an unrelated firm",
    "A university accounting instructor",
    "A financial reporting oversight officer (CEO, CFO, or controller) of the audit client",
    "An examiner for a state taxing authority"],
  answer:2,
  explain:"A one-year cooling-off period applies before certain audit team members can take a financial reporting oversight role (CEO, CFO, controller, CAO) at the issuer client, protecting independence. The other roles are unaffected.",
  ref:"SOX §206 — cooling-off period"
},
{
  id:"cpa-aud-a1-14", source:"AUD.A1", diff:"medium",
  q:"Under PCAOB standards, audit documentation for an issuer engagement must be retained for:",
  choices:["3 years","Indefinitely","5 years","7 years"],
  answer:3,
  explain:"PCAOB AS 1215 requires retention of audit documentation for seven years. Under AICPA standards for nonissuers the minimum is five years; neither standard requires indefinite retention.",
  ref:"PCAOB AS 1215 — documentation retention"
},

/* ---------------- AUD.A3 — Evidence & Procedures (advanced) --------------- */
{
  id:"cpa-aud-a3-18", source:"AUD.A3", diff:"hard",
  q:"In substantive testing, the sampling risk that concerns audit effectiveness — wrongly concluding a materially misstated balance is acceptable — is the:",
  choices:["Risk of incorrect acceptance","Risk of incorrect rejection","Nonsampling risk","Tolerable misstatement"],
  answer:0,
  explain:"The risk of incorrect acceptance (concluding a materially misstated balance is fine) impairs effectiveness. The risk of incorrect rejection affects efficiency; nonsampling risk comes from human error; tolerable misstatement is a threshold, not a risk.",
  ref:"AU-C 530 — sampling risk"
},
{
  id:"cpa-aud-a3-19", source:"AUD.A3", diff:"hard",
  q:"Holding other factors constant, which change INCREASES the required sample size for a substantive test of details?",
  choices:[
    "A higher acceptable level of sampling risk",
    "A decrease in tolerable misstatement",
    "A larger tolerable misstatement",
    "A smaller expected misstatement"],
  answer:1,
  explain:"A smaller tolerable misstatement demands more precision, so sample size rises. Higher acceptable risk and a larger tolerable misstatement reduce sample size, and a smaller expected misstatement reduces it as well.",
  ref:"AU-C 530 — sample size factors"
},
{
  id:"cpa-aud-a3-20", source:"AUD.A3", diff:"medium",
  q:"A substantive analytical procedure is most effective when the auditor:",
  choices:[
    "Uses balances prepared by client management as its expectation",
    "Sets a very wide threshold for investigating differences",
    "Develops an independent expectation of the recorded amount from reliable data",
    "Relies on unaudited interim figures without corroboration"],
  answer:2,
  explain:"Effectiveness depends on an independent, reasonably precise expectation built from reliable data, with a suitably narrow investigation threshold. Using the client's own figures, a wide threshold, or unaudited data undermines the procedure.",
  ref:"AU-C 520 — substantive analytics"
},
{
  id:"cpa-aud-a3-21", source:"AUD.A3", diff:"medium",
  q:"When the auditor uses the work of an auditor's specialist (such as a valuation expert) as audit evidence, the auditor:",
  choices:[
    "Transfers responsibility for the opinion to the specialist",
    "May never refer to the specialist in the report",
    "Must personally be an expert in the specialist's field to use the work",
    "Remains solely responsible for the opinion and evaluates the specialist's competence, objectivity, and work"],
  answer:3,
  explain:"The auditor remains solely responsible for the opinion and must evaluate the specialist's competence, capabilities, objectivity, and work. Responsibility is not transferred, and the auditor need not personally be an expert.",
  ref:"AU-C 620 — using a specialist"
},
{
  id:"cpa-aud-a3-22", source:"AUD.A3", diff:"medium",
  q:"Audit documentation should be sufficient to enable:",
  choices:[
    "An experienced auditor with no previous connection to the engagement to understand the procedures performed and the conclusions reached",
    "Only the engagement partner to follow the work",
    "The client to reproduce its own financial statements",
    "A regulator to redo the entire audit from scratch"],
  answer:0,
  explain:"Documentation must let an experienced auditor with no previous connection to the engagement understand the nature, timing, extent, and results of procedures and the conclusions reached. It is not limited to the partner nor meant to reproduce statements.",
  ref:"AU-C 230 — audit documentation"
},

/* ---------------- AUD.A4 — Forming Conclusions & Reporting ---------------- */
{
  id:"cpa-aud-a4-08", source:"AUD.A4", diff:"medium",
  q:"Under current auditing standards (AU-C 700), the auditor's report on a nonissuer presents which section FIRST?",
  choices:["The Basis for Opinion section","The Opinion section","Management's responsibilities section","The auditor's responsibilities section"],
  answer:1,
  explain:"The report leads with the Opinion section, immediately followed by the Basis for Opinion. The responsibilities of management and of the auditor are presented afterward.",
  ref:"AU-C 700 — report format"
},
{
  id:"cpa-aud-a4-09", source:"AUD.A4", diff:"medium",
  q:"A company makes a justified change in accounting principle that is properly accounted for and disclosed. In the auditor's report this is most likely addressed by:",
  choices:[
    "An emphasis-of-matter paragraph, with the opinion left unmodified",
    "A qualified opinion",
    "An adverse opinion",
    "Omitting any reference to the change"],
  answer:0,
  explain:"A justified, properly disclosed change in principle is a consistency matter highlighted with an emphasis-of-matter paragraph while the opinion stays unmodified. It is not a basis for a qualified or adverse opinion.",
  ref:"AU-C 706 — emphasis-of-matter"
},
{
  id:"cpa-aud-a4-10", source:"AUD.A4", diff:"medium",
  q:"Critical audit matters (CAMs) are required to be communicated in the auditor's report for:",
  choices:[
    "All nonissuer audit engagements",
    "Audits of issuers under PCAOB standards",
    "Compilation engagements",
    "Review engagements under SSARS"],
  answer:1,
  explain:"PCAOB AS 3101 requires CAMs in issuer audit reports — matters communicated to the audit committee that involved especially challenging, subjective, or complex auditor judgment. Nonissuer audits report the analogous key audit matters only when engaged to; compilations and reviews have none.",
  ref:"PCAOB AS 3101 — critical audit matters"
},
{
  id:"cpa-aud-a4-11", source:"AUD.A4", diff:"easy",
  q:"Under SSARS, a review of a nonissuer's financial statements provides:",
  choices:[
    "Reasonable (positive) assurance",
    "No assurance at all",
    "Limited (negative) assurance",
    "An opinion on internal control"],
  answer:2,
  explain:"A review provides limited assurance, expressed negatively ('we are not aware of any material modifications that should be made'). A compilation provides no assurance; only an audit provides reasonable assurance and a positive opinion.",
  ref:"SSARS 21 — review engagements"
},
{
  id:"cpa-aud-a4-12", source:"AUD.A4", diff:"hard",
  q:"In an integrated audit of an issuer, if a material weakness in internal control over financial reporting exists at year-end, the auditor should express:",
  choices:[
    "An unqualified opinion on ICFR",
    "A qualified opinion on ICFR",
    "An automatic disclaimer on ICFR",
    "An adverse opinion on ICFR"],
  answer:3,
  explain:"A material weakness requires an adverse opinion on the effectiveness of ICFR under AS 2201. A disclaimer is used only for a scope limitation, not for an identified material weakness, and the ICFR opinion is not qualified in this framework.",
  ref:"PCAOB AS 2201 — integrated audit"
}

]);
