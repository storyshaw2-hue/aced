/* =============================================================================
   ACED — aud-tbs-batch-01.js   (ORIGINAL CONTENT, append-safe)
   -----------------------------------------------------------------------------
   The first task-based simulations for the AUD pack — 5 sims across all four
   AICPA AUD areas:
     • AUD.A4 — Selecting the appropriate audit opinion
     • AUD.A2 — Audit risk model & materiality (numeric)
     • AUD.A3 — Attribute sampling for tests of controls (numeric)
     • AUD.A2 — Evaluating internal control deficiencies
     • AUD.A1 — Evaluating auditor independence
   Scenarios and numbers are original; the rules are public AICPA/PCAOB standards.

   SCHEMA (matches the far-tbs / bar-tbs batch files):
     { source, diff, title, scenario,
       items:[ { prompt, type:"numeric", answer, tolerance, explain }
             | { prompt, type:"select", choices:[...], answer:<0-based>, explain } ] }

   Load by adding "packs/originals/aud-tbs-batch-01.js" to the TBS banks array
   in study.html.
   ============================================================================= */
window.ACED_TBS = (window.ACED_TBS || []).concat([

  /* ---- TBS 1: Selecting the appropriate opinion (A4) --------------------- */
  { source:"AUD.A4", diff:"hard",
    title:"Selecting the Appropriate Audit Opinion",
    scenario:"For each independent situation below, select the report or opinion the auditor should issue on a nonissuer's financial statements. Assume all other conditions for the audit are satisfied.",
    items:[
      { prompt:"The financial statements contain a departure from GAAP that is material but not pervasive; management refuses to correct it.",
        type:"select",
        choices:["Unmodified opinion","Qualified opinion","Adverse opinion","Disclaimer of opinion"],
        answer:1,
        explain:"A material-but-not-pervasive GAAP departure warrants a qualified ('except for') opinion. Adverse is reserved for pervasive misstatements; a disclaimer is for scope limitations, not known misstatements." },
      { prompt:"A GAAP departure is so material and far-reaching that the financial statements as a whole are misleading.",
        type:"select",
        choices:["Unmodified opinion","Qualified opinion","Adverse opinion","Disclaimer of opinion"],
        answer:2,
        explain:"When a misstatement is both material and pervasive, the statements are not fairly presented and an adverse opinion is required. A qualified opinion would understate the severity." },
      { prompt:"The auditor cannot obtain sufficient appropriate audit evidence, and the possible effects could be both material and pervasive.",
        type:"select",
        choices:["Unmodified opinion","Qualified opinion","Adverse opinion","Disclaimer of opinion"],
        answer:3,
        explain:"A pervasive scope limitation prevents the auditor from forming an opinion, so a disclaimer is issued. An adverse opinion addresses known pervasive misstatements, not a lack of evidence." },
      { prompt:"Substantial doubt exists about the entity's ability to continue as a going concern, and it is adequately disclosed in the notes.",
        type:"select",
        choices:["Qualified opinion","Adverse opinion","Unmodified opinion with a separate going-concern section","Disclaimer of opinion"],
        answer:2,
        explain:"When going-concern doubt is adequately disclosed, the opinion stays unmodified and a separate 'going concern' section is added. Inadequate disclosure would instead be a GAAP departure (qualified or adverse)." },
      { prompt:"The entity made a justified change in accounting principle that is properly accounted for and adequately disclosed.",
        type:"select",
        choices:["Unmodified opinion with an emphasis-of-matter paragraph","Qualified opinion","Adverse opinion","Disclaimer of opinion"],
        answer:0,
        explain:"A justified, properly disclosed change in principle is a consistency matter noted in an emphasis-of-matter paragraph; the opinion remains unmodified. It is not a basis to qualify." },
      { prompt:"The group engagement partner decides to make reference to a component auditor who audited a subsidiary.",
        type:"select",
        choices:["A disclaimer, because another auditor was involved","An unmodified opinion that references the component auditor and indicates shared responsibility","A qualified opinion","An adverse opinion"],
        answer:1,
        explain:"Making reference to a component auditor divides responsibility; the group auditor still issues an unmodified opinion and the report indicates that part of the audit was performed by another auditor." }
    ] },

  /* ---- TBS 2: Audit risk model & materiality (A2) ------------------------ */
  { source:"AUD.A2", diff:"hard",
    title:"Audit Risk Model and Materiality",
    scenario:"An auditor is planning the engagement. The desired overall audit risk is 5%. Based on risk assessment, inherent risk is assessed at 50% and control risk at 40%. Overall (financial-statement) materiality is set at $600,000.\n\nEnter percentages as whole numbers (e.g., 25 for 25%) and dollar amounts as numbers.",
    items:[
      { prompt:"Using the audit risk model, what is the maximum acceptable level of detection risk (as a %)?",
        type:"numeric", answer:25, tolerance:1,
        explain:"Detection risk = audit risk ÷ (inherent risk × control risk) = 0.05 ÷ (0.50 × 0.40) = 0.05 ÷ 0.20 = 0.25, or 25%." },
      { prompt:"If the auditor later reassesses control risk upward from 40% to 70%, acceptable detection risk should:",
        type:"select",
        choices:["Increase, so less substantive evidence is needed","Decrease, requiring more persuasive substantive evidence","Stay the same","Become irrelevant"],
        answer:1,
        explain:"Detection risk varies inversely with the risk of material misstatement. A higher control risk raises RMM, so acceptable detection risk falls and the auditor gathers more substantive evidence." },
      { prompt:"If the auditor sets performance materiality at 75% of overall materiality, what is performance materiality (in dollars)?",
        type:"numeric", answer:450000, tolerance:1000,
        explain:"Performance materiality = 75% × $600,000 = $450,000. It is set below overall materiality to leave a margin for undetected and aggregated misstatements." },
      { prompt:"Performance materiality is set below overall materiality primarily to:",
        type:"select",
        choices:["Reduce the audit fee","Provide a margin for undetected and aggregated misstatements","Eliminate the need for substantive testing","Satisfy an independence requirement"],
        answer:1,
        explain:"The lower amount reduces the probability that the total of uncorrected and undetected misstatements exceeds overall materiality. It is unrelated to fees, independence, or eliminating testing." },
      { prompt:"Materiality determined during planning is used to:",
        type:"select",
        choices:["Guarantee that no misstatements exist","Plan the nature, timing, and extent of procedures and evaluate the effect of identified misstatements","Set the client's accounting policies","Replace the need for an engagement letter"],
        answer:1,
        explain:"Materiality drives audit scope and the evaluation of misstatements. It does not guarantee an error-free statement, set client policy, or substitute for the engagement letter." }
    ] },

  /* ---- TBS 3: Attribute sampling for tests of controls (A3) -------------- */
  { source:"AUD.A3", diff:"hard",
    title:"Attribute Sampling — Test of Controls",
    scenario:"An auditor uses statistical attribute sampling to test the operating effectiveness of a control over sales approvals. The auditor examines a sample of 60 items and finds 3 deviations. The tolerable deviation rate is 8%. From the sampling evaluation table, the computed upper deviation rate for these results is 9%.\n\nEnter percentages as whole numbers (e.g., 5 for 5%).",
    items:[
      { prompt:"What is the sample deviation rate (as a %)?",
        type:"numeric", answer:5, tolerance:0.5,
        explain:"Sample deviation rate = deviations ÷ sample size = 3 ÷ 60 = 5%." },
      { prompt:"What is the allowance for sampling risk implied by these results (as a %)?",
        type:"numeric", answer:4, tolerance:0.5,
        explain:"Allowance for sampling risk = upper deviation rate − sample deviation rate = 9% − 5% = 4%." },
      { prompt:"Comparing the upper deviation rate (9%) to the tolerable deviation rate (8%), the auditor should:",
        type:"select",
        choices:["Rely on the control as planned","Not rely on the control as planned and increase substantive procedures","Reduce the sample size","Ignore the result as immaterial"],
        answer:1,
        explain:"Because the upper deviation rate (9%) exceeds the tolerable rate (8%), the control is not operating effectively enough to rely on; the auditor increases substantive testing." },
      { prompt:"Attribute sampling is appropriate for tests of controls because it estimates:",
        type:"select",
        choices:["A dollar amount of misstatement","The rate of deviation from a prescribed control","The fair value of an asset","The client's net income"],
        answer:1,
        explain:"Tests of controls measure how often a control fails — a rate — which is what attribute sampling estimates. Dollar amounts are estimated with variables or monetary-unit sampling in substantive tests." },
      { prompt:"Holding other factors constant, if the auditor lowered the tolerable deviation rate, the required sample size would:",
        type:"select",
        choices:["Decrease","Increase","Stay the same","Drop to zero"],
        answer:1,
        explain:"A lower tolerable deviation rate demands greater precision, which increases the required sample size." }
    ] },

  /* ---- TBS 4: Evaluating internal control deficiencies (A2) -------------- */
  { source:"AUD.A2", diff:"medium",
    title:"Evaluating Internal Control Deficiencies",
    scenario:"During the audit, the auditor identifies several internal control issues. For each, classify its severity or the required action under the auditing standards.",
    items:[
      { prompt:"A deficiency creates a reasonable possibility that a material misstatement will not be prevented or detected and corrected on a timely basis.",
        type:"select",
        choices:["A control deficiency only","A significant deficiency","No deficiency","A material weakness"],
        answer:3,
        explain:"A reasonable possibility of an uncorrected MATERIAL misstatement defines a material weakness — the most severe category." },
      { prompt:"A deficiency is less severe than a material weakness, yet important enough to merit the attention of those charged with governance.",
        type:"select",
        choices:["A material weakness","A significant deficiency","An immaterial matter requiring no attention","A scope limitation"],
        answer:1,
        explain:"That description is exactly a significant deficiency — below a material weakness but still meriting governance attention." },
      { prompt:"A minor deficiency exists but is offset by another control that operates effectively.",
        type:"select",
        choices:["A material weakness","A significant deficiency","A control deficiency that is neither a significant deficiency nor a material weakness","An adverse ICFR condition"],
        answer:2,
        explain:"With an effective compensating control, the issue is a lesser control deficiency; it may be communicated to management but is not a significant deficiency or material weakness." },
      { prompt:"Significant deficiencies and material weaknesses identified in the audit must be communicated to those charged with governance:",
        type:"select",
        choices:["Orally, which is sufficient","In writing","Only to management, not to governance","Not at all"],
        answer:1,
        explain:"The standards require significant deficiencies and material weaknesses to be communicated in writing to those charged with governance." },
      { prompt:"In an integrated audit of an issuer, a material weakness existing at year-end results in:",
        type:"select",
        choices:["An unqualified opinion on ICFR","A qualified opinion on ICFR","An adverse opinion on ICFR","A disclaimer on ICFR"],
        answer:2,
        explain:"A material weakness at the reporting date requires an adverse opinion on the effectiveness of internal control over financial reporting under AS 2201." }
    ] },

  /* ---- TBS 5: Evaluating auditor independence (A1) ----------------------- */
  { source:"AUD.A1", diff:"medium",
    title:"Evaluating Auditor Independence",
    scenario:"For each independent situation, evaluate the effect on the firm's independence with respect to an audit client under the AICPA Code (and SEC/PCAOB rules where the client is an issuer).",
    items:[
      { prompt:"A covered member on the engagement holds a direct financial interest in the audit client.",
        type:"select",
        choices:["Impaired","Not impaired","Impaired only if the interest is material"],
        answer:0,
        explain:"A direct financial interest of a covered member impairs independence regardless of amount; materiality matters only for indirect interests." },
      { prompt:"The spouse of a covered member is employed by the client in a financial-reporting oversight role.",
        type:"select",
        choices:["Impaired","Not impaired","Impaired only if the interest is material"],
        answer:0,
        explain:"A close family member in a key financial-reporting oversight position at the client impairs independence." },
      { prompt:"The firm maintains the accounting records and prepares the financial statements for an issuer audit client.",
        type:"select",
        choices:["Impaired","Not impaired","Impaired only if the interest is material"],
        answer:0,
        explain:"Bookkeeping and preparing the financial statements of an issuer audit client is a prohibited nonaudit service that impairs independence." },
      { prompt:"A partner in a different office, not on the engagement team and unable to influence it, holds an immaterial INDIRECT financial interest in the client.",
        type:"select",
        choices:["Impaired","Not impaired","Impaired only if the interest is material"],
        answer:1,
        explain:"An immaterial indirect interest held by someone who is not a covered member and cannot influence the engagement does not impair independence." },
      { prompt:"The firm agrees to perform the audit for a fee contingent on reporting a specific financial result.",
        type:"select",
        choices:["Impaired","Not impaired","Impaired only if the interest is material"],
        answer:0,
        explain:"Contingent fees for an attest client impair independence and are prohibited, regardless of the amount involved." },
      { prompt:"The period during which the firm must be independent is:",
        type:"select",
        choices:["Only the period covered by the financial statements","Only the period of fieldwork","The period of the professional engagement and the period covered by the financial statements","Only the date of the auditor's report"],
        answer:2,
        explain:"Independence must be maintained throughout both the period covered by the financial statements and the period of the professional engagement." }
    ] }

]);
