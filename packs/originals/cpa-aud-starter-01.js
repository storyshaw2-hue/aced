/* ACED — cpa-aud-starter-01.js  (TEMPLATE / STARTER bank, append-safe)
   ------------------------------------------------------------------------
   A SMALL starter set proving the pack system is section-agnostic — NOT a
   full AUD bank. These are original questions on core AUD concepts (the
   AICPA AUD blueprint areas), enough to make Audit Moments work in the AUD
   pack. Authoring a real AUD bank = the same effort that produced the 300+
   FAR questions. Schema matches FAR: {q, choices[4], answer, explain, source, diff}.
   `source` values are AUD module keys (AUD.A1–AUD.A4) defined in cpa-aud.js.
   ======================================================================== */
window.ACED_QUESTIONS = (window.ACED_QUESTIONS || []).concat(
[
 { "source":"AUD.A1","diff":"medium",
   "q":"A covered member on an audit engagement holds a direct financial interest in the client. Under the AICPA Code, independence is:",
   "choices":[
     "Impaired, regardless of how small the interest is",
     "Impaired only if the interest is material to the member",
     "Not impaired if the shares are held in a blind trust automatically",
     "A matter of professional judgment with no bright line"],
   "answer":0,
   "explain":"A direct financial interest in an attest client impairs a covered member's independence regardless of materiality. (For an INDIRECT financial interest, materiality matters — but direct interests are a bright-line prohibition.)" },
 { "source":"AUD.A1","diff":"medium",
   "q":"The AICPA conceptual framework approach to independence requires a member to:",
   "choices":[
     "Avoid all clients in regulated industries",
     "Identify threats, evaluate their significance, and apply safeguards to reduce them to an acceptable level",
     "Obtain written client approval for every service",
     "Rotate off every engagement annually"],
   "answer":1,
   "explain":"When no specific rule addresses a situation, the member applies the threats-and-safeguards framework: identify threats (self-interest, self-review, advocacy, familiarity, undue influence, management participation), evaluate significance, and apply safeguards until any threat is at an acceptable level." },
 { "source":"AUD.A2","diff":"medium",
   "q":"In the audit risk model (AR = IR × CR × DR), if the auditor assesses both inherent and control risk as high, detection risk must be set:",
   "choices":[
     "High, performing fewer substantive procedures",
     "Low, performing more persuasive substantive procedures",
     "At zero",
     "Equal to control risk"],
   "answer":1,
   "explain":"To hold overall audit risk at an acceptably low level, detection risk varies inversely with the assessed risks of material misstatement. High IR and CR force a low DR, which the auditor achieves with more extensive, more persuasive substantive testing (often shifted to year-end)." },
 { "source":"AUD.A2","diff":"easy",
   "q":"Lowering the materiality level used in planning the audit generally results in:",
   "choices":[
     "Less audit evidence being required",
     "More audit evidence being required",
     "No change to the scope of work",
     "A modified opinion"],
   "answer":1,
   "explain":"Materiality is inversely related to the extent of audit work: a lower materiality threshold means smaller misstatements matter, so the auditor must gather more evidence to obtain reasonable assurance." },
 { "source":"AUD.A3","diff":"medium",
   "q":"Which procedure provides the MOST reliable evidence about the existence of accounts receivable?",
   "choices":[
     "Recalculating the aging schedule",
     "Inquiry of the credit manager",
     "External confirmation sent directly to and returned from customers",
     "Reviewing the company's own collection policy"],
   "answer":2,
   "explain":"Evidence obtained directly from a knowledgeable independent external source is generally more reliable than internally generated evidence. A confirmation returned directly by the customer is strong evidence of existence; internal recalculations and inquiries are weaker on their own." },
 { "source":"AUD.A3","diff":"medium",
   "q":"An auditor plans to rely on internal controls to reduce substantive testing. To support that reliance, the auditor must:",
   "choices":[
     "Perform tests of controls to confirm the controls operated effectively",
     "Issue an adverse opinion on the financial statements",
     "Increase materiality",
     "Skip substantive procedures entirely"],
   "answer":0,
   "explain":"Reliance on controls to assess control risk below maximum must be supported by tests of controls demonstrating the controls operated effectively during the period. Substantive procedures are still required for material account balances and disclosures." },
 { "source":"AUD.A4","diff":"easy",
   "q":"An auditor concludes the financial statements are presented fairly, in all material respects, in conformity with GAAP. The appropriate report contains:",
   "choices":[
     "A qualified opinion",
     "An unmodified (unqualified) opinion",
     "An adverse opinion",
     "A disclaimer of opinion"],
   "answer":1,
   "explain":"Fair presentation in all material respects in accordance with the applicable framework warrants an unmodified opinion. Qualified/adverse opinions stem from material misstatements; a disclaimer stems from an inability to obtain sufficient appropriate evidence (a scope limitation)." },
 { "source":"AUD.A4","diff":"medium",
   "q":"The auditor has substantial doubt about the entity's ability to continue as a going concern for a reasonable period. If disclosures are adequate, the auditor issues:",
   "choices":[
     "An adverse opinion",
     "A qualified opinion for a scope limitation",
     "An unmodified opinion with a separate 'Substantial Doubt About Going Concern' section",
     "A disclaimer of opinion"],
   "answer":2,
   "explain":"When going-concern doubt is substantial but disclosures are adequate, the opinion remains unmodified and the auditor adds a separate going-concern section drawing attention to the matter. Inadequate disclosure, by contrast, is a GAAP departure leading to a qualified or adverse opinion." }
]
);
