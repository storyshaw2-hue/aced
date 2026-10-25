/* =============================================================================
   ACED — aud-tbs-batch-03.js   (ORIGINAL CONTENT, append-safe)
   -----------------------------------------------------------------------------
   5 more AUD task-based simulations, modeled on the skills in the Becker A4/A5/A6
   TBS sets — completing the audit (subsequent events, report dating), the single
   audit, selecting the right engagement and assurance level, prospective
   financial information, and group audits. These complement batch-01 (opinions,
   audit risk, attribute sampling, control deficiencies, independence) and
   batch-02 (ratios, fraud, receivables, cash, materiality). Scenarios are
   original; the rules are public AICPA/PCAOB/GAGAS/Uniform Guidance/SSAE/SSARS.

     • AUD.A4 — Completing the audit: subsequent events & report dating
     • AUD.A2 — Single audit: major program determination & reporting
     • AUD.A4 — Selecting the engagement and assurance level
     • AUD.A4 — Prospective financial information
     • AUD.A2 — Group audits and component auditors

   SCHEMA matches the other *-tbs-batch files. Load by adding
   "packs/originals/aud-tbs-batch-03.js" to the TBS banks array in study.html.
   Single audit thresholds reflect the 2024 Uniform Guidance ($1,000,000).
   ============================================================================= */
window.ACED_TBS = (window.ACED_TBS || []).concat([

  /* ---- TBS 1: Completing the audit — subsequent events & dating (A4) ----- */
  { source:"AUD.A4", diff:"hard",
    title:"Completing the Audit — Subsequent Events and Report Dating",
    scenario:"The auditor is completing the engagement. For each item, select the appropriate treatment or conclusion under the auditing standards.",
    items:[
      { prompt:"A lawsuit outstanding at the balance sheet date is settled after year-end for an amount different from the recorded estimate.",
        type:"select",
        choices:["Disclose only, with no adjustment","Recognized (Type I) subsequent event — adjust the financial statements","Ignore it, since it occurred after year-end","Report it as a change in accounting principle"],
        answer:1,
        explain:"The condition (the lawsuit) existed at the balance sheet date, so the settlement is evidence about that condition — a recognized (Type I) event requiring adjustment." },
      { prompt:"A fire destroys a major facility after year-end but before the statements are issued.",
        type:"select",
        choices:["Adjust the year-end financial statements","Recognized event requiring restatement","Nonrecognized (Type II) subsequent event — disclose only","Omit it from the statements entirely"],
        answer:2,
        explain:"The fire is a new condition arising after year-end — a nonrecognized (Type II) event — so it is disclosed but does not adjust the year-end amounts." },
      { prompt:"The date of the auditor's report should be:",
        type:"select",
        choices:["The balance sheet date","The date the engagement letter was signed","The report release date to users","No earlier than the date the auditor obtained sufficient appropriate audit evidence"],
        answer:3,
        explain:"The report is dated no earlier than when sufficient appropriate evidence was obtained, including that the statements were prepared and management accepted responsibility." },
      { prompt:"The management representation letter should be dated:",
        type:"select",
        choices:["As of the date of the auditor's report","As of the balance sheet date","As of the date fieldwork began","As of the date the statements are filed"],
        answer:0,
        explain:"The representation letter is dated as of the date of the auditor's report, because it covers events through that date." },
      { prompt:"After the report date but before issuance, management discloses a new subsequent event; the auditor performs procedures limited to that event. The auditor may:",
        type:"select",
        choices:["Backdate the report to year-end","Dual-date the report — keeping the original date and adding a later date limited to that event","Refuse to consider the event","Withdraw automatically"],
        answer:1,
        explain:"Dual dating retains the original report date for the overall audit while assuming responsibility for the one later event as of its date (alternatively, dating the whole report later extends responsibility)." },
      { prompt:"After the report release date, the auditor discovers a fact that existed at the report date and would have affected the report. The auditor should:",
        type:"select",
        choices:["Do nothing, because the report was already released","Immediately withdraw the prior opinion in the press","Determine whether the statements need revision and discuss the matter with management","Reissue the report with a new date and no other action"],
        answer:2,
        explain:"On subsequent discovery of facts existing at the report date, the auditor determines whether the statements need revision, discusses with management, and takes steps so that anyone relying on the statements is informed if necessary." }
    ] },

  /* ---- TBS 2: Single audit — major programs & reporting (A2) ------------- */
  { source:"AUD.A2", diff:"hard",
    title:"Single Audit — Major Program Determination and Reporting",
    scenario:"A non-federal entity expends $3,000,000 in federal awards this year across three programs: Program A $1,500,000, Program B $900,000, and Program C $600,000. Under the 2024 Uniform Guidance, for an entity expending less than $34 million, a Type A program is one with federal awards of at least $1,000,000.",
    items:[
      { prompt:"Which program is a Type A program?",
        type:"select",
        choices:["Program A only","Program B only","Program C only","All three programs"],
        answer:0,
        explain:"Only Program A ($1,500,000) meets the $1,000,000 Type A threshold. Programs B and C are below $1,000,000 and are therefore Type B programs." },
      { prompt:"The auditor determines which programs are 'major programs' by:",
        type:"select",
        choices:["Selecting only the single largest program by dollars","Applying a risk-based approach that considers program type (A vs B) and assessed risk","Choosing programs at random","Testing every federal program regardless of risk"],
        answer:1,
        explain:"The Uniform Guidance prescribes a risk-based approach: classify Type A vs Type B by size, then assess risk to select major programs — not simply the largest, a random pick, or every program." },
      { prompt:"In addition to the financial-statement audit reports, the single audit requires a report on:",
        type:"select",
        choices:["The fair value of assets bought with federal funds","The officers' personal tax returns","Compliance for each major program and internal control over compliance","A five-year forecast of federal funding"],
        answer:2,
        explain:"A single audit adds a report on compliance for each major program and on internal control over compliance, beyond the financial-statement audit reports." },
      { prompt:"Noncompliance that is material to a major program leads the auditor to express:",
        type:"select",
        choices:["An unmodified opinion on compliance anyway","A modified (qualified or adverse) opinion on compliance for that program","No opinion on compliance at all","An opinion only on the financial statements"],
        answer:1,
        explain:"Material noncompliance affecting a major program results in a modified (qualified or adverse) opinion on compliance for that program." },
      { prompt:"A single audit is performed under:",
        type:"select",
        choices:["The AICPA Code of Professional Conduct only","Government Auditing Standards (GAGAS) and the Uniform Guidance","The PCAOB auditing standards for issuers","IFRS reporting requirements"],
        answer:1,
        explain:"A single audit is conducted under Government Auditing Standards (the Yellow Book) together with the Uniform Guidance compliance audit requirements." }
    ] },

  /* ---- TBS 3: Selecting the engagement and assurance level (A4) ---------- */
  { source:"AUD.A4", diff:"medium",
    title:"Selecting the Engagement and Assurance Level",
    scenario:"For each client situation, select the engagement that best fits the described need.",
    items:[
      { prompt:"The client wants the highest level of assurance — a positive opinion — on its GAAP financial statements.",
        type:"select",
        choices:["An audit","A review","A compilation","A preparation engagement"],
        answer:0,
        explain:"Only an audit provides reasonable (positive) assurance expressed as an opinion on the financial statements." },
      { prompt:"The client wants limited assurance on its statements at a lower cost than an audit.",
        type:"select",
        choices:["A compilation","A review","A preparation engagement","An examination"],
        answer:1,
        explain:"A review provides limited (negative) assurance and is less in scope than an audit." },
      { prompt:"The client wants the accountant to simply prepare financial statements, with no report and no assurance.",
        type:"select",
        choices:["An audit","A review","A preparation engagement","Agreed-upon procedures"],
        answer:2,
        explain:"A preparation engagement produces financial statements with no report and no assurance (each page notes that no assurance is provided)." },
      { prompt:"A practitioner is engaged to express an opinion on whether a company's schedule of sustainability metrics conforms to stated criteria.",
        type:"select",
        choices:["A compilation","A preparation engagement","An attestation examination","A review of financial statements"],
        answer:2,
        explain:"Expressing an opinion on subject matter (or an assertion) against criteria is an attestation examination, which provides reasonable assurance." },
      { prompt:"A lender asks the practitioner to perform specific procedures on a debt-covenant schedule and report only the findings.",
        type:"select",
        choices:["An audit of the schedule","A review of the schedule","An agreed-upon procedures engagement","A compilation of the schedule"],
        answer:2,
        explain:"Performing specified procedures and reporting factual findings, with no opinion or conclusion and use restricted to specified parties, is an agreed-upon procedures engagement." }
    ] },

  /* ---- TBS 4: Prospective financial information (A4) --------------------- */
  { source:"AUD.A4", diff:"medium",
    title:"Prospective Financial Information",
    scenario:"A practitioner is engaged in connection with the entity's prospective financial information. Select the correct treatment for each item.",
    items:[
      { prompt:"A financial FORECAST is based on:",
        type:"select",
        choices:["The responsible party's expected conditions and its expected course of action","One or more hypothetical assumptions","Only historical results of the entity","Assumptions the practitioner personally selects"],
        answer:0,
        explain:"A forecast reflects the conditions the responsible party expects and the course of action it expects to take." },
      { prompt:"A financial PROJECTION is based on:",
        type:"select",
        choices:["Expected conditions only","One or more hypothetical ('what-if') assumptions","Audited historical statements","A guarantee of future results"],
        answer:1,
        explain:"A projection is built on hypothetical assumptions — a 'what would happen if' scenario." },
      { prompt:"The distribution of a financial projection is ordinarily:",
        type:"select",
        choices:["Available for general use like an audited statement","Prohibited entirely","Restricted to specified parties who understand the assumptions","Required to be filed publicly"],
        answer:2,
        explain:"Because a projection relies on hypothetical assumptions, its use is restricted to the specified parties who understand them; a forecast may be for general use." },
      { prompt:"Pro forma financial information is prepared to:",
        type:"select",
        choices:["Replace the historical financial statements","Forecast the next five years of operations","Show the effect of a transaction or event as if it had occurred earlier","Present the owners' personal finances"],
        answer:2,
        explain:"Pro forma information demonstrates how the historical statements might have looked had a transaction or event occurred at an earlier date." },
      { prompt:"In examining a forecast, the practitioner expresses an opinion on whether it is presented in conformity with AICPA guidelines and the assumptions provide a reasonable basis; the practitioner does NOT:",
        type:"select",
        choices:["Evaluate the presentation of the forecast","Guarantee that the forecasted results will be achieved","Consider whether the assumptions are suitably supported","Report on the forecast at all"],
        answer:1,
        explain:"The practitioner never guarantees that prospective results will be achieved; the examination opinion addresses presentation and whether the assumptions provide a reasonable basis." }
    ] },

  /* ---- TBS 5: Group audits and component auditors (A2) ------------------- */
  { source:"AUD.A2", diff:"hard",
    title:"Group Audits and Component Auditors",
    scenario:"A group engagement team audits consolidated financial statements. A subsidiary (a component) is audited by another firm, the component auditor. Select the correct conclusion for each item.",
    items:[
      { prompt:"If the group engagement partner decides to ASSUME responsibility for the component auditor's work, the group auditor's report:",
        type:"select",
        choices:["Makes no reference to the component auditor","Names the component auditor and divides responsibility","Must be a disclaimer","Must be qualified"],
        answer:0,
        explain:"Assuming responsibility means the group report makes no reference to the component auditor; the group auditor is responsible for the whole audit." },
      { prompt:"If the group auditor decides NOT to assume responsibility, the group report:",
        type:"select",
        choices:["Ignores the component entirely","Refers to the component auditor and indicates the division of responsibility","Automatically expresses an adverse opinion","Cannot be issued"],
        answer:1,
        explain:"Making reference divides responsibility: the report indicates that a portion of the audit was performed by the component auditor, whose work supports that portion." },
      { prompt:"Before using the work of a component auditor, the group engagement team should:",
        type:"select",
        choices:["Assume the component auditor is competent without inquiry","Evaluate the component auditor's competence and independence","Re-audit the entire component regardless","Rely solely on the component's management"],
        answer:1,
        explain:"The group team obtains an understanding of and evaluates the component auditor's competence, capabilities, and independence before relying on that auditor's work." },
      { prompt:"Component performance materiality is ordinarily set:",
        type:"select",
        choices:["Higher than group materiality","Equal to group materiality in every case","Lower than group materiality, to allow for aggregation across components","At zero"],
        answer:2,
        explain:"Component materiality is set lower than overall group materiality so that the aggregate of uncorrected misstatements across components is unlikely to exceed group materiality." },
      { prompt:"A component is considered significant when it:",
        type:"select",
        choices:["Has any activity at all during the year","Is of individual financial significance to the group or carries significant risks of material misstatement","Uses the same software as the parent","Is located in the same country as the parent"],
        answer:1,
        explain:"A significant component is one of individual financial significance to the group or one likely to include significant risks of material misstatement of the group statements." }
    ] }

]);
