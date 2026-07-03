/* packs/originals/bar-batch-01.js — CPA · BAR original question bank (batch 01).
   ============================================================================
   20 original multiple-choice items covering all 19 modules of the unified
   cpa-bar pack (Areas I/II/III). Scenarios, names, and numbers are written from
   scratch; the underlying rules are public GAAP/GASB/AICPA-blueprint facts.
   Patterned (NOT copied) after standard exam archetypes. Each distractor maps
   to a specific, named mistake.

   Schema matches the ACED engine:
   { id, source, diff, q, choices, answer (0-indexed), explain, ref }.
   ============================================================================ */
window.ACED_QUESTIONS = (window.ACED_QUESTIONS || []).concat([

/* ===== Area I · Business Analysis & Financial Management ===== */

{
  id: "cpa-bar-b1m1-01", source: "B1.M1", diff: "medium",
  q: "Marlowe Co. reports current assets of $360,000 (which include $90,000 of inventory and $30,000 of prepaid expenses) and current liabilities of $150,000. What is Marlowe's quick (acid-test) ratio?",
  choices: ["1.60", "2.40", "1.80", "0.63"],
  answer: 0,
  explain: "The quick ratio excludes inventory and prepaid expenses from current assets: ($360,000 − $90,000 − $30,000) / $150,000 = $240,000 / $150,000 = 1.60. 2.40 is the current ratio (it leaves inventory and prepaids in). 1.80 removes only inventory and forgets prepaids ($270,000/$150,000). 0.63 inverts the ratio.",
  ref: "Liquidity ratios — quick (acid-test)"
},
{
  id: "cpa-bar-b1m2-01", source: "B1.M2", diff: "easy",
  q: "On the BAR exam, the data-analytics tasks primarily require a candidate to:",
  choices: [
    "Write SQL or Python to query a database",
    "Interpret data visualizations and draw conclusions from financial data",
    "Design a normalized relational database schema",
    "Configure and secure server infrastructure"
  ],
  answer: 1,
  explain: "BAR tests data concepts and the interpretation of visualizations (reading a chart, spotting a trend or anomaly, supporting a decision) — not programming. Writing SQL/Python, schema design, and infrastructure are out of scope for the discipline.",
  ref: "Data analytics on BAR — interpretation, not coding"
},
{
  id: "cpa-bar-b1m3-01", source: "B1.M3", diff: "hard",
  q: "Raxan Inc. estimates maintenance cost behavior with the high-low method. Its highest activity was 9,000 machine hours at a total cost of $52,000; its lowest was 6,000 machine hours at $40,000. Using the high-low method, what total maintenance cost should Raxan project at 7,000 machine hours?",
  choices: ["$40,000", "$28,000", "$46,000", "$44,000"],
  answer: 3,
  explain: "Variable rate = change in cost / change in hours = ($52,000 − $40,000) / (9,000 − 6,000) = $12,000 / 3,000 = $4.00 per hour. Fixed cost = $52,000 − ($4.00 × 9,000) = $16,000. Projected at 7,000 hours = $16,000 + ($4.00 × 7,000) = $44,000. $40,000 is the low-point total cost; $28,000 is the variable portion only; $46,000 misapplies the rate.",
  ref: "Cost estimation — high-low method"
},
{
  id: "cpa-bar-b1m4-01", source: "B1.M4", diff: "hard",
  q: "Delgado Co. is evaluating a machine that costs $150,000 today and is expected to generate after-tax cash inflows of $42,000 per year for five years. The required rate of return is 10%, and the present value of an ordinary annuity of $1 for five periods at 10% is 3.791. What is the project's net present value (NPV)?",
  choices: ["$60,000", "$9,222", "$159,222", "$(9,222)"],
  answer: 1,
  explain: "PV of the inflows = $42,000 × 3.791 = $159,222. NPV = PV of inflows − initial outlay = $159,222 − $150,000 = $9,222 (positive, so the project clears the hurdle). $60,000 ignores the time value of money ($42,000 × 5 − $150,000). $159,222 omits the initial outlay. The negative figure flips the sign.",
  ref: "Capital budgeting — NPV"
},
{
  id: "cpa-bar-b1m5-01", source: "B1.M5", diff: "hard",
  q: "Carlisle Co. uses a standard cost of $6.00 per pound of direct material. During the period it purchased 12,000 pounds for a total of $73,200. What is the direct materials price variance, computed at the point of purchase?",
  choices: ["$1,200 Unfavorable", "$1,200 Favorable", "$2,400 Unfavorable", "$600 Unfavorable"],
  answer: 0,
  explain: "Actual price = $73,200 / 12,000 = $6.10 per pound. Price variance = (actual price − standard price) × quantity purchased = ($6.10 − $6.00) × 12,000 = $1,200. It is unfavorable because the actual price exceeded standard. The 'Favorable' option flips the direction; $2,400 doubles the rate difference; $600 halves the quantity.",
  ref: "Standard costing — direct materials price variance"
},
{
  id: "cpa-bar-b1m6-01", source: "B1.M6", diff: "medium",
  q: "Brightline Co. sells a product for $60 per unit with variable costs of $36 per unit and total fixed costs of $240,000. How many units must Brightline sell to break even?",
  choices: ["6,667 units", "4,000 units", "10,000 units", "5,000 units"],
  answer: 2,
  explain: "Contribution margin per unit = $60 − $36 = $24. Break-even units = fixed costs / contribution margin = $240,000 / $24 = 10,000 units. 6,667 wrongly divides by the variable cost ($36); 4,000 divides by the selling price ($60); 5,000 is a miscalculation.",
  ref: "CVP analysis — break-even point"
},
{
  id: "cpa-bar-b1m7-01", source: "B1.M7", diff: "hard",
  q: "Tamarind Corp.'s capital structure is 60% common equity and 40% long-term debt. The cost of common equity is 12%, the pre-tax cost of debt is 8%, and the tax rate is 25%. What is Tamarind's weighted-average cost of capital (WACC)?",
  choices: ["10.40%", "9.60%", "9.20%", "10.80%"],
  answer: 1,
  explain: "After-tax cost of debt = 8% × (1 − 0.25) = 6.00%. WACC = (0.60 × 12%) + (0.40 × 6%) = 7.20% + 2.40% = 9.60%. 10.40% forgets the interest tax shield and uses the pre-tax 8% (0.60×12% + 0.40×8%). The other options use incorrect weights.",
  ref: "Corporate finance — WACC with the debt tax shield"
},
{
  id: "cpa-bar-b1m8-01", source: "B1.M8", diff: "medium",
  q: "Under the COSO Enterprise Risk Management framework, which statement best describes an entity's risk appetite?",
  choices: [
    "The acceptable variation in performance around a specific objective",
    "The maximum amount of risk the entity can absorb before failing",
    "The broad amount and type of risk the entity is willing to pursue in creating value",
    "The risk that remains after management applies its controls"
  ],
  answer: 2,
  explain: "Risk appetite is the broad amount and type of risk an organization is willing to accept in pursuit of value — a wide range, not a precise limit. 'Acceptable variation around an objective' is risk tolerance; the 'maximum the entity can absorb' is risk capacity; 'risk remaining after controls' is residual risk.",
  ref: "COSO ERM (2017) — risk appetite vs. tolerance, capacity, residual"
},

/* ===== Area II · Technical Accounting & Reporting ===== */

{
  id: "cpa-bar-b2m1-01", source: "B2.M1", diff: "hard",
  q: "Parent Co. acquires 75% of Sub Co. for $600,000. At the acquisition date, the fair value of the 25% noncontrolling interest is $200,000, Sub's book value of net assets is $660,000, and the fair value of Sub's identifiable net assets is $720,000. Under the full (acquisition) goodwill method required by U.S. GAAP, what goodwill is recognized?",
  choices: ["$140,000", "$60,000", "$0", "$80,000"],
  answer: 3,
  explain: "Goodwill = (consideration transferred + fair value of the NCI) − fair value of identifiable net assets = ($600,000 + $200,000) − $720,000 = $80,000. $60,000 is the proportionate/partial method ($600,000 − 75% × $720,000), which U.S. GAAP does not use here. $140,000 wrongly subtracts book value ($800,000 − $660,000). $0 ignores the computation.",
  ref: "ASC 805 — acquisition-method (full) goodwill"
},
{
  id: "cpa-bar-b2m2-01", source: "B2.M2", diff: "medium",
  q: "Crestline Media tests a reporting unit for goodwill impairment at year-end. The unit's carrying amount is $640,000 (including $90,000 of allocated goodwill), and its fair value is estimated at $580,000. Under current U.S. GAAP, what goodwill impairment loss should Crestline recognize?",
  choices: ["$60,000", "$90,000", "$0", "$150,000"],
  answer: 0,
  explain: "Under the single-step test (ASU 2017-04), impairment = the excess of carrying amount over fair value, capped at the goodwill balance: $640,000 − $580,000 = $60,000, which is below the $90,000 of goodwill, so $60,000 is recognized. $90,000 wrongly writes off all goodwill (old two-step thinking). $0 ignores the shortfall. $150,000 nets goodwill out of the carrying amount first.",
  ref: "ASC 350 — goodwill impairment (single-step)"
},
{
  id: "cpa-bar-b2m3-01", source: "B2.M3", diff: "medium",
  q: "On January 1, ABC Co. grants 12,000 stock options with a grant-date fair value of $5 per option and a four-year service (vesting) period. At the end of Year 1 the stock has risen sharply. What compensation expense should ABC recognize for Year 1?",
  choices: ["$60,000", "$20,000", "$15,000", "$0"],
  answer: 2,
  explain: "Equity-classified options are measured at grant-date fair value and expensed straight-line over the requisite service period. Total = 12,000 × $5 = $60,000; Year 1 = $60,000 / 4 = $15,000. Later changes in the stock price do not change the grant-date measure. $60,000 expenses the whole grant at once; $20,000 uses a three-year period; $0 ignores the cost.",
  ref: "ASC 718 — equity-classified stock options"
},
{
  id: "cpa-bar-b2m3-02", source: "B2.M3", diff: "hard",
  q: "On January 1, Year 1, Loud Corp. grants its CEO 4,000 cash-settled stock appreciation rights (SARs) with a two-year service period and a $20 grant price. The stock closes at $26 on December 31, Year 1 and $31 on December 31, Year 2. What SAR compensation expense should Loud recognize in Year 2?",
  choices: ["$44,000", "$24,000", "$22,000", "$32,000"],
  answer: 3,
  explain: "Cash-settled SARs are liability-classified and remeasured to fair value each period. Year 1 liability = ($26 − $20) × 4,000 × (1/2 vested) = $12,000. By the end of Year 2 the awards are fully vested, so the required cumulative liability = ($31 − $20) × 4,000 × (2/2) = $44,000. Year 2 expense = cumulative − amount already recognized = $44,000 − $12,000 = $32,000. $44,000 forgets Year 1 was already expensed; $24,000 is Year 1's unprorated appreciation; $22,000 simply halves the cumulative.",
  ref: "ASC 718 — cash-settled SARs (liability remeasurement)"
},
{
  id: "cpa-bar-b2m4-01", source: "B2.M4", diff: "medium",
  q: "An entity holds an interest-rate swap designated as a cash flow hedge of its variable-rate debt, and the hedge is highly effective. How is the gain on the effective portion of the swap reported?",
  choices: [
    "Recognized immediately in net income",
    "Reported in other comprehensive income until the hedged transaction affects earnings",
    "Added to the carrying amount of the related debt",
    "Disclosed only in the footnotes"
  ],
  answer: 1,
  explain: "For a cash flow hedge, the effective portion of the derivative's gain or loss is reported in OCI and reclassified into earnings in the period the hedged item affects earnings (e.g., as interest accrues). A fair value hedge — the contrast — runs the gain or loss through net income immediately.",
  ref: "ASC 815 — cash flow hedge (effective portion to OCI)"
},
{
  id: "cpa-bar-b2m5-01", source: "B2.M5", diff: "medium",
  q: "Under ASC 606, an entity estimating variable consideration includes that amount in the transaction price:",
  choices: [
    "At the maximum amount allowed under the contract",
    "Only after all of the cash has been collected",
    "Only to the extent that a significant revenue reversal is not probable",
    "Only when the contract is fully complete"
  ],
  answer: 2,
  explain: "The constraint on variable consideration limits the amount included to the portion for which it is probable that a significant reversal of cumulative revenue will not occur. It is not the contractual maximum, not a cash basis, and not a completion basis.",
  ref: "ASC 606 — constraint on variable consideration"
},
{
  id: "cpa-bar-b2m6-01", source: "B2.M6", diff: "hard",
  q: "Under ASC 842, when does a lessor classify a lease as a sales-type lease?",
  choices: [
    "If any one of the five lease-classification criteria is met",
    "Only if all five lease-classification criteria are met",
    "Only if the lease term is 12 months or less",
    "Only when collection of the payments is not probable"
  ],
  answer: 0,
  explain: "Meeting ANY one of the five criteria — title transfers, a purchase option the lessee is reasonably certain to exercise, the term is a major part of the asset's remaining economic life, the present value of payments is substantially all of fair value, or the asset is so specialized it has no alternative use — makes the lease sales-type. If none are met, the lessor uses direct-financing (when PV is substantially all of fair value and collection is probable) or operating classification.",
  ref: "ASC 842 — lessor sales-type classification"
},
{
  id: "cpa-bar-b2m7-01", source: "B2.M7", diff: "hard",
  q: "A U.S. parent has a foreign subsidiary whose functional currency is its own local currency. When the subsidiary's statements are converted to U.S. dollars for consolidation, where is the resulting adjustment reported?",
  choices: [
    "In net income for the period",
    "Directly in retained earnings",
    "As a financing activity in the statement of cash flows",
    "In other comprehensive income as a cumulative translation adjustment"
  ],
  answer: 3,
  explain: "When the functional currency is the local currency, the current-rate (translation) method applies and the adjustment accumulates in OCI as the cumulative translation adjustment. If instead the functional currency were the U.S. dollar, the temporal (remeasurement) method would apply and the gain or loss would hit net income.",
  ref: "ASC 830 — translation (current-rate) vs. remeasurement (temporal)"
},
{
  id: "cpa-bar-b2m8-01", source: "B2.M8", diff: "medium",
  q: "Under ASC 280, an operating segment must be reported separately when its revenue, absolute profit or loss, or assets equal or exceed what percentage of the respective combined amounts for all operating segments?",
  choices: ["5%", "10%", "25%", "75%"],
  answer: 1,
  explain: "A segment is reportable if it meets any of the three 10% tests (revenue, the absolute value of profit or loss, or assets). The 75% figure is a different test: total external revenue of reportable segments must be at least 75% of consolidated revenue, or more segments are added.",
  ref: "ASC 280 — segment 10% quantitative thresholds"
},

/* ===== Area III · State, Local & Governmental ===== */

{
  id: "cpa-bar-b3m1-01", source: "B3.M1", diff: "medium",
  q: "Under the modified accrual basis used by governmental-type funds, revenues are recognized when they are:",
  choices: [
    "Both measurable and available",
    "Earned, regardless of when they are collected",
    "Received in cash",
    "Appropriated in the adopted budget"
  ],
  answer: 0,
  explain: "Governmental funds use modified accrual: revenue is recognized when it is measurable AND available (collectible within the period or soon enough afterward — often within about 60 days — to pay current-period liabilities). Recognizing revenue when 'earned' is full accrual, used for government-wide and proprietary statements; cash receipt and budget adoption are not the triggers.",
  ref: "GASB — modified accrual (measurable and available)"
},
{
  id: "cpa-bar-b3m2-01", source: "B3.M2", diff: "hard",
  q: "When reconciling a governmental fund's change in fund balance to the government-wide change in net position, which of the following is ADDED?",
  choices: [
    "Depreciation expense for the period",
    "Proceeds received from issuing long-term bonds",
    "Capital outlay reported as expenditures in the funds",
    "Property tax revenue recognized in the funds"
  ],
  answer: 2,
  explain: "Governmental funds record capital outlay as an expenditure, but the government-wide statements capitalize the asset and depreciate it over time. So the reconciliation ADDS back capital outlay (it reduced fund balance but not net position) and SUBTRACTS depreciation. Bond proceeds increased fund balance but created a liability at the government-wide level, so they are subtracted, not added.",
  ref: "GASB — fund-to-government-wide reconciliation"
},
{
  id: "cpa-bar-b3m3-01", source: "B3.M3", diff: "medium",
  q: "Which of the following funds uses the accrual basis of accounting and the economic-resources measurement focus (rather than modified accrual)?",
  choices: [
    "General fund",
    "Capital projects fund",
    "Special revenue fund",
    "Enterprise fund"
  ],
  answer: 3,
  explain: "Proprietary funds — enterprise and internal service — use the accrual basis and the economic-resources measurement focus, like a business. The general, special revenue, capital projects, debt service, and permanent funds are governmental-type funds that use modified accrual and the current-financial-resources focus.",
  ref: "GASB — fund categories and measurement focus"
}

]);
