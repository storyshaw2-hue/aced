/* packs/originals/bar-batch-02.js — CPA · BAR original question bank (batch 02).
   ============================================================================
   41 original multiple-choice items that DEEPEN every module of the unified
   cpa-bar pack to >=3 questions (clearing the validator's THIN-module warnings),
   weighted toward the AICPA blueprint (Area II heaviest, then Area I, then III).

   Patterned (NOT copied) after standard Becker/AICPA archetypes observed across
   the BAR M1–B5 question banks: cost of capital & valuation (Area I), advanced
   technical accounting (Area II), and state/local government (Area III). Every
   scenario, name, and number is written from scratch; the underlying rules are
   public GAAP/GASB/AICPA-blueprint facts. Each distractor maps to a specific,
   named mistake.

   Schema matches the ACED engine:
   { id, source, diff, q, choices, answer (0-indexed), explain, ref }.
   ============================================================================ */
window.ACED_QUESTIONS = (window.ACED_QUESTIONS || []).concat([

/* ============================ Area I · B1 ============================ */

/* --- B1.M1 Ratio & Financial Statement Analysis --- */
{
  id:"cpa-bar-b1m1-02", source:"B1.M1", diff:"medium",
  q:"Tamsin Co. reports cost of goods sold of $600,000. Inventory was $70,000 at the beginning of the year and $90,000 at the end. What is Tamsin's inventory turnover?",
  choices:["7.5","6.7","8.6","0.13"],
  answer:0,
  explain:"Inventory turnover = COGS / average inventory. Average inventory = ($70,000 + $90,000)/2 = $80,000, so turnover = $600,000/$80,000 = 7.5. 6.7 wrongly uses ending inventory ($600,000/$90,000); 8.6 uses beginning inventory; 0.13 inverts the ratio.",
  ref:"Activity ratios — inventory turnover"
},
{
  id:"cpa-bar-b1m1-03", source:"B1.M1", diff:"medium",
  q:"Norwood Inc. reports operating income (EBIT) of $540,000 and interest expense of $90,000, and is taxed at 30%. What is Norwood's times-interest-earned ratio?",
  choices:["3.5","6.0","5.0","7.0"],
  answer:1,
  explain:"Times interest earned = EBIT / interest expense = $540,000 / $90,000 = 6.0. The ratio uses pre-tax operating income, so 3.5 (which wrongly starts from after-tax net income) is incorrect; 5.0 and 7.0 misadd the components.",
  ref:"Solvency ratios — times interest earned"
},
{
  id:"cpa-bar-b1m1-04", source:"B1.M1", diff:"hard",
  q:"Using the DuPont model, a firm has a net profit margin of 8%, total-asset turnover of 1.5, and an equity multiplier of 2.0. What is its return on equity (ROE)?",
  choices:["12%","16%","24%","11.5%"],
  answer:2,
  explain:"DuPont ROE = net profit margin × asset turnover × equity multiplier = 8% × 1.5 × 2.0 = 24%. 12% stops at return on assets (margin × turnover) and omits the equity multiplier; 16% and 11.5% miscombine the factors.",
  ref:"DuPont analysis — ROE decomposition"
},

/* --- B1.M2 Data Analytics & Visualization --- */
{
  id:"cpa-bar-b1m2-02", source:"B1.M2", diff:"easy",
  q:"An analyst wants to show the relative composition of total revenue across four product lines for a single period. Which visualization is most appropriate?",
  choices:["Scatter plot","Single line chart","Box-and-whisker plot","Pie or 100% stacked bar chart"],
  answer:3,
  explain:"Parts-of-a-whole for one period is best shown with a pie or 100% stacked bar chart. A scatter plot shows correlation between two variables; a line chart shows a trend over time; a box plot shows a distribution — none of which conveys composition.",
  ref:"Data visualization — choosing a chart type"
},
{
  id:"cpa-bar-b1m2-03", source:"B1.M2", diff:"easy",
  q:"An analysis that estimates what is most likely to happen to sales next quarter is best classified as which type of analytics?",
  choices:["Predictive","Descriptive","Diagnostic","Prescriptive"],
  answer:0,
  explain:"Predictive analytics forecasts future outcomes. Descriptive analytics summarizes what already happened; diagnostic analytics explains why it happened; prescriptive analytics recommends what action to take.",
  ref:"Analytics maturity — descriptive/diagnostic/predictive/prescriptive"
},

/* --- B1.M3 Forecasting & Prospective Analysis --- */
{
  id:"cpa-bar-b1m3-02", source:"B1.M3", diff:"medium",
  q:"Wexler Co. expects sales to grow from $2,000,000 to $2,400,000 next year. Accounts receivable have historically run at 10% of sales. Using the percentage-of-sales method, what is forecasted accounts receivable?",
  choices:["$200,000","$240,000","$220,000","$24,000"],
  answer:1,
  explain:"Forecasted AR = 10% × projected sales = 10% × $2,400,000 = $240,000. $200,000 applies the ratio to current sales and ignores the growth; $220,000 averages the two years; $24,000 misplaces a decimal.",
  ref:"Pro forma forecasting — percentage of sales"
},
{
  id:"cpa-bar-b1m3-03", source:"B1.M3", diff:"medium",
  q:"A project's payoff is estimated at $100,000 with 30% probability, $200,000 with 50% probability, and $300,000 with 20% probability. What is its expected value?",
  choices:["$200,000","$180,000","$190,000","$210,000"],
  answer:2,
  explain:"Expected value = Σ(probability × outcome) = 0.30($100,000) + 0.50($200,000) + 0.20($300,000) = $30,000 + $100,000 + $60,000 = $190,000. $200,000 is the simple unweighted average; $180,000 and $210,000 misweight the outcomes.",
  ref:"Prospective analysis — expected value"
},

/* --- B1.M4 Capital Budgeting & Valuation --- */
{
  id:"cpa-bar-b1m4-02", source:"B1.M4", diff:"easy",
  q:"Delphi Co. invests $120,000 in a project expected to return even after-tax cash inflows of $30,000 per year. What is the project's payback period?",
  choices:["3.0 years","5.0 years","4.8 years","4.0 years"],
  answer:3,
  explain:"Payback period = initial investment / annual cash inflow = $120,000 / $30,000 = 4.0 years. 3.0 and 5.0 misdivide; 4.8 needlessly discounts the flows (basic payback ignores the time value of money).",
  ref:"Capital budgeting — payback period"
},
{
  id:"cpa-bar-b1m4-03", source:"B1.M4", diff:"medium",
  q:"A project requires an initial outlay of $120,000 and has a present value of future cash inflows of $138,000. What is its profitability index (PI)?",
  choices:["1.15","0.87","1.18","1.20"],
  answer:0,
  explain:"Profitability index = PV of inflows / initial outlay = $138,000 / $120,000 = 1.15 (greater than 1, so accept). 0.87 inverts the ratio; 1.18 and 1.20 miscompute. PI restates NPV as a ratio for ranking projects under capital rationing.",
  ref:"Capital budgeting — profitability index"
},
{
  id:"cpa-bar-b1m4-04", source:"B1.M4", diff:"medium",
  q:"A project's internal rate of return (IRR) is 9% while the firm's required rate of return is 11%. What is true about the project's net present value (NPV)?",
  choices:["Positive; accept the project","Negative; reject the project","Zero; the firm is indifferent","It cannot be determined"],
  answer:1,
  explain:"When IRR is below the required return, discounting the cash flows at the higher hurdle rate produces a negative NPV, so the project is rejected. NPV is zero only when IRR equals the required return and positive only when IRR exceeds it.",
  ref:"Capital budgeting — IRR vs. required return"
},

/* --- B1.M5 Cost Accounting & Allocation --- */
{
  id:"cpa-bar-b1m5-02", source:"B1.M5", diff:"hard",
  q:"Halcyon Co. sets a standard of 2 direct labor hours per unit at $15 per hour. It produced 1,000 units (2,000 standard hours allowed) using 2,100 actual hours. What is the direct labor efficiency (usage) variance?",
  choices:["$1,500 Favorable","$2,100 Unfavorable","$1,500 Unfavorable","$3,000 Unfavorable"],
  answer:2,
  explain:"DL efficiency variance = (actual hours − standard hours allowed) × standard rate = (2,100 − 2,000) × $15 = $1,500, Unfavorable (more hours than allowed). The 'Favorable' option flips the direction; $2,100 and $3,000 misapply the hours.",
  ref:"Standard costing — direct labor efficiency variance"
},
{
  id:"cpa-bar-b1m5-03", source:"B1.M5", diff:"medium",
  q:"Pioneer Co. budgets manufacturing overhead of $400,000 against 20,000 budgeted machine hours. Actual machine hours were 21,000. Using the predetermined rate, how much overhead is applied?",
  choices:["$400,000","$380,000","$441,000","$420,000"],
  answer:3,
  explain:"Predetermined rate = $400,000 / 20,000 = $20 per machine hour. Applied overhead = $20 × 21,000 actual hours = $420,000. $400,000 is the budgeted amount (not applied); $380,000 uses 19,000 hours; $441,000 misapplies the rate.",
  ref:"Cost allocation — applied overhead"
},

/* --- B1.M6 Performance Management (CVP, KPIs) --- */
{
  id:"cpa-bar-b1m6-02", source:"B1.M6", diff:"medium",
  q:"Cobalt Co. sells a product for $50 with variable costs of $30 per unit and total fixed costs of $180,000. How many units must it sell to earn a target operating income of $60,000?",
  choices:["12,000 units","9,000 units","8,000 units","4,800 units"],
  answer:0,
  explain:"Units = (fixed costs + target profit) / contribution margin per unit = ($180,000 + $60,000) / ($50 − $30) = $240,000 / $20 = 12,000 units. 9,000 is the break-even point (ignores target profit); 4,800 divides by price; 8,000 divides only the target by CM.",
  ref:"CVP analysis — target profit volume"
},
{
  id:"cpa-bar-b1m6-03", source:"B1.M6", diff:"hard",
  q:"A division reports operating income of $120,000 on average operating assets of $800,000. If the company's required rate of return is 12%, what is the division's residual income?",
  choices:["15%","$24,000","$96,000","$14,400"],
  answer:1,
  explain:"Residual income = operating income − (required rate × average operating assets) = $120,000 − (12% × $800,000) = $120,000 − $96,000 = $24,000. 15% is the division's ROI (a different metric); $96,000 is the capital charge itself; $14,400 applies the rate to income.",
  ref:"Performance measurement — residual income"
},

/* --- B1.M7 Corporate Finance (WACC, Working Capital) --- */
{
  id:"cpa-bar-b1m7-02", source:"B1.M7", diff:"hard",
  q:"Sterling Co.'s capital structure is 40% debt and 60% equity. The pre-tax cost of debt is 8%, the cost of equity is 14%, and the tax rate is 25%. What is Sterling's weighted-average cost of capital (WACC)?",
  choices:["11.6%","12.2%","10.8%","9.6%"],
  answer:2,
  explain:"After-tax cost of debt = 8% × (1 − 0.25) = 6%. WACC = (0.40 × 6%) + (0.60 × 14%) = 2.4% + 8.4% = 10.8%. 11.6% forgets to tax-adjust the debt; 12.2% and 9.6% swap the weights or misweight the components.",
  ref:"Corporate finance — WACC"
},
{
  id:"cpa-bar-b1m7-03", source:"B1.M7", diff:"hard",
  q:"A supplier offers terms of 2/10, net 40. Assuming a 360-day year, what is the approximate annual cost of NOT taking the cash discount?",
  choices:["24.0%","18.4%","12.2%","24.5%"],
  answer:3,
  explain:"Annual cost = [discount % / (100% − discount %)] × [360 / (payment period − discount period)] = (2/98) × (360/30) = 24.5%. 24.0% wrongly uses 2/100 in the first term; 18.4% and 12.2% misuse the day count.",
  ref:"Working capital — cost of trade credit"
},

/* --- B1.M8 Risk Management (COSO ERM) --- */
{
  id:"cpa-bar-b1m8-02", source:"B1.M8", diff:"medium",
  q:"A company purchases insurance to cover potential flood losses at a warehouse. Under COSO ERM, this is best described as which risk response?",
  choices:["Risk sharing","Risk avoidance","Risk acceptance","Risk reduction"],
  answer:0,
  explain:"Transferring risk to a third party (an insurer) is risk sharing. Avoidance exits the activity entirely; acceptance takes no action and absorbs the risk; reduction lowers likelihood or impact through internal controls.",
  ref:"COSO ERM — risk responses"
},
{
  id:"cpa-bar-b1m8-03", source:"B1.M8", diff:"medium",
  q:"The amount of risk that remains after management implements its risk responses is referred to as:",
  choices:["Inherent risk","Residual risk","Detection risk","Control risk"],
  answer:1,
  explain:"Residual risk is the risk that remains after responses are applied. Inherent risk is the risk before any response. Detection risk and control risk are components of audit risk, not COSO ERM terminology.",
  ref:"COSO ERM — inherent vs. residual risk"
},

/* ============================ Area II · B2 ============================ */

/* --- B2.M1 Business Combinations & Consolidations --- */
{
  id:"cpa-bar-b2m1-02", source:"B2.M1", diff:"medium",
  q:"Apex Co. acquires 100% of Borden Co. for $900,000 in cash. The fair value of Borden's identifiable net assets is $760,000. What amount of goodwill is recognized?",
  choices:["$160,000","$0","$140,000","$900,000"],
  answer:2,
  explain:"Goodwill = consideration transferred − fair value of identifiable net assets = $900,000 − $760,000 = $140,000. $160,000 misreads the net assets; $0 ignores the premium paid; $900,000 is the total purchase price, not the residual goodwill.",
  ref:"Business combinations — goodwill"
},
{
  id:"cpa-bar-b2m1-03", source:"B2.M1", diff:"hard",
  q:"Crestview Co. acquires 80% of Dunmore Co. for $640,000. The fair value of the 20% noncontrolling interest is $160,000, and the fair value of Dunmore's identifiable net assets is $700,000. Under U.S. GAAP, what is total goodwill?",
  choices:["$80,000","$60,000","$140,000","$100,000"],
  answer:3,
  explain:"Under the acquisition (full goodwill) method, goodwill = (consideration $640,000 + fair value of NCI $160,000) − fair value of identifiable net assets $700,000 = $100,000. $80,000 uses only the parent's 80% share of net assets (the proportionate method, not U.S. GAAP); the others misadd.",
  ref:"Business combinations — full goodwill with NCI"
},
{
  id:"cpa-bar-b2m1-04", source:"B2.M1", diff:"hard",
  q:"During the year a parent sold inventory to its subsidiary for $100,000; the parent's cost was $70,000. At year-end, 40% of those goods remain unsold in the subsidiary's inventory. What unrealized intercompany profit must be eliminated?",
  choices:["$12,000","$30,000","$40,000","$18,000"],
  answer:0,
  explain:"Intercompany gross profit = $100,000 − $70,000 = $30,000. The deferred (unrealized) profit equals profit × the unsold portion = $30,000 × 40% = $12,000. $30,000 eliminates the entire profit (not just the unsold part); $18,000 uses the 60% sold; $40,000 misuses the markup.",
  ref:"Consolidations — unrealized intercompany inventory profit"
},

/* --- B2.M2 Intangibles, Goodwill & Impairment --- */
{
  id:"cpa-bar-b2m2-02", source:"B2.M2", diff:"hard",
  q:"A reporting unit has a carrying amount of $500,000, including $120,000 of goodwill. Its fair value is $430,000. Under current U.S. GAAP (one-step test), what is the goodwill impairment loss?",
  choices:["$120,000","$70,000","$0","$50,000"],
  answer:1,
  explain:"Under ASU 2017-04, goodwill impairment = carrying amount of the reporting unit − its fair value = $500,000 − $430,000 = $70,000, limited to the $120,000 of goodwill (which it is). $120,000 writes off all goodwill; $0 ignores the shortfall; $50,000 miscomputes.",
  ref:"Goodwill impairment — one-step test"
},
{
  id:"cpa-bar-b2m2-03", source:"B2.M2", diff:"medium",
  q:"A patent has a 10-year remaining legal life but is expected to generate cash flows for only 6 years. Over what period should it be amortized?",
  choices:["10 years","Indefinite (not amortized)","6 years","3 years"],
  answer:2,
  explain:"A finite-lived intangible is amortized over the shorter of its legal life and its useful (economic) life = 6 years. 10 years ignores the shorter cash-flow life; 'indefinite' applies only to indefinite-lived intangibles such as goodwill; 3 years has no basis.",
  ref:"Intangibles — amortization period"
},

/* --- B2.M3 Share-Based Compensation --- */
{
  id:"cpa-bar-b2m3-03", source:"B2.M3", diff:"medium",
  q:"On January 1, a company grants 10,000 stock options with a grant-date fair value of $6 each, vesting evenly over a 4-year service period. What is compensation expense for the first year?",
  choices:["$60,000","$6,000","$2,500","$15,000"],
  answer:3,
  explain:"Total compensation = 10,000 × $6 = $60,000, recognized straight-line over the 4-year requisite service period = $15,000 per year. $60,000 expenses the entire award at grant; $6,000 and $2,500 misuse the per-option value or the period.",
  ref:"Share-based compensation — equity options expense"
},

/* --- B2.M4 Derivatives & Hedge Accounting --- */
{
  id:"cpa-bar-b2m4-02", source:"B2.M4", diff:"medium",
  q:"The effective portion of the gain or loss on a cash flow hedge is initially reported in:",
  choices:["Other comprehensive income","Net income","Retained earnings","Additional paid-in capital"],
  answer:0,
  explain:"For a cash flow hedge, the effective portion is recorded in OCI and later reclassified to earnings when the hedged forecasted transaction affects earnings. Routing it directly to net income describes a fair value hedge, not a cash flow hedge.",
  ref:"Hedge accounting — cash flow hedge (OCI)"
},
{
  id:"cpa-bar-b2m4-03", source:"B2.M4", diff:"medium",
  q:"For a fair value hedge, the gain or loss on the hedging derivative is recognized in:",
  choices:["Other comprehensive income","Current earnings","Retained earnings","A valuation allowance"],
  answer:1,
  explain:"A fair value hedge recognizes the derivative's gain or loss in current earnings, offset by the loss or gain on the hedged item. OCI treatment is reserved for the effective portion of a cash flow hedge.",
  ref:"Hedge accounting — fair value hedge (earnings)"
},

/* --- B2.M5 Revenue Recognition (Advanced) --- */
{
  id:"cpa-bar-b2m5-02", source:"B2.M5", diff:"medium",
  q:"A contract's transaction price includes a bonus the entity cannot conclude is highly probable of not reversing. Under ASC 606, the bonus should be:",
  choices:["Recognized in full immediately","Recorded as a separate liability","Excluded from the transaction price until the constraint is resolved","Recognized straight-line over the contract term"],
  answer:2,
  explain:"Variable consideration is included only to the extent it is highly probable that a significant reversal will not occur (the constraint). If the entity cannot reach that conclusion, the amount is excluded until the uncertainty is resolved. Recognizing it in full ignores the constraint.",
  ref:"ASC 606 — variable consideration constraint"
},
{
  id:"cpa-bar-b2m5-03", source:"B2.M5", diff:"hard",
  q:"A bundle of a good and a service sells for $1,000. Their standalone selling prices are $800 (good) and $400 (service). Using the relative standalone-selling-price method, how much revenue is allocated to the good?",
  choices:["$800","$600","$500","$667"],
  answer:3,
  explain:"Allocate the $1,000 by relative standalone selling price: good = $1,000 × ($800 / $1,200) = $667. $800 ignores the discount allocation; $600 splits the price evenly; $500 simply halves it.",
  ref:"ASC 606 — allocate by relative SSP"
},

/* --- B2.M6 Leases (Lessor / Advanced) --- */
{
  id:"cpa-bar-b2m6-02", source:"B2.M6", diff:"hard",
  q:"At commencement of a sales-type lease, the fair value of the underlying asset is $100,000 and its carrying amount on the lessor's books is $80,000. How much selling profit does the lessor recognize at commencement?",
  choices:["$20,000","$0","$100,000","$80,000"],
  answer:0,
  explain:"A sales-type lease recognizes selling profit at commencement = fair value − carrying amount = $100,000 − $80,000 = $20,000. $0 would apply to a direct financing lease (no selling profit); $100,000 and $80,000 are the gross figures, not the profit.",
  ref:"Lessor accounting — sales-type lease selling profit"
},
{
  id:"cpa-bar-b2m6-03", source:"B2.M6", diff:"medium",
  q:"A lessor lease meets a finance-lease classification criterion and conveys dealer (selling) profit to the lessor. How is it classified?",
  choices:["Operating lease","Sales-type lease","Direct financing lease","Short-term lease"],
  answer:1,
  explain:"A lessor lease that meets a finance criterion and includes selling profit is a sales-type lease. A direct financing lease meets a criterion but has no selling profit; an operating lease meets none of the criteria.",
  ref:"Lessor accounting — lease classification"
},

/* --- B2.M7 Foreign Currency --- */
{
  id:"cpa-bar-b2m7-02", source:"B2.M7", diff:"medium",
  q:"When a foreign subsidiary's functional currency is its local currency, the adjustment from translating its statements into the parent's reporting currency is reported in:",
  choices:["Net income","Retained earnings","Other comprehensive income","Paid-in capital"],
  answer:2,
  explain:"Under the current-rate (translation) method, the translation adjustment accumulates in OCI as the cumulative translation adjustment. Recognition in net income describes a remeasurement gain/loss under the temporal method, not translation.",
  ref:"Foreign currency — translation (OCI)"
},
{
  id:"cpa-bar-b2m7-03", source:"B2.M7", diff:"hard",
  q:"When the U.S. dollar is the functional currency, the gain or loss from remeasuring a foreign subsidiary's statements (temporal method) is reported in:",
  choices:["Other comprehensive income","A separate equity reserve","Deferred until disposal","Net income"],
  answer:3,
  explain:"Remeasurement under the temporal method routes the resulting gain or loss through net income. OCI is used for translation adjustments when the local currency (not the U.S. dollar) is the functional currency.",
  ref:"Foreign currency — remeasurement (net income)"
},

/* --- B2.M8 Segment Reporting & Public-Company Disclosures --- */
{
  id:"cpa-bar-b2m8-02", source:"B2.M8", diff:"medium",
  q:"An operating segment is separately reportable if its revenue, absolute reported profit or loss, or assets equals or exceeds what percentage of the appropriate combined total?",
  choices:["10%","5%","25%","75%"],
  answer:0,
  explain:"The quantitative threshold for a reportable segment is 10% of combined revenue, of the greater absolute amount of reported profit or loss, or of total assets. 75% is the separate external-revenue coverage test, not the per-segment threshold.",
  ref:"Segment reporting — 10% thresholds"
},
{
  id:"cpa-bar-b2m8-03", source:"B2.M8", diff:"medium",
  q:"If the segments already deemed reportable do not capture at least a specified share of total consolidated external revenue, more segments must be added. What is that share?",
  choices:["50%","75%","90%","10%"],
  answer:1,
  explain:"Reportable segments must collectively account for at least 75% of total external (consolidated) revenue; if not, additional segments are identified until the 75% test is met. 10% is the individual-segment threshold; 50% and 90% are distractors.",
  ref:"Segment reporting — 75% revenue test"
},

/* ============================ Area III · B3 ============================ */

/* --- B3.M1 Governmental Funds & Modified Accrual --- */
{
  id:"cpa-bar-b3m1-02", source:"B3.M1", diff:"medium",
  q:"Under the modified accrual basis, property tax revenue is recognized when it is measurable and 'available' — meaning collectible within how long after the fiscal year-end?",
  choices:["30 days","90 days","60 days","One year"],
  answer:2,
  explain:"For property taxes, 'available' means collected within the year or within 60 days after year-end. 30 days is too short, 90 days and one year are too long for the standard availability period under modified accrual.",
  ref:"Modified accrual — 'available' (60-day) rule"
},
{
  id:"cpa-bar-b3m1-03", source:"B3.M1", diff:"medium",
  q:"When the general fund acquires a $50,000 vehicle, how is the purchase recorded in the general fund?",
  choices:["As a capital asset","As an other financing use","As a prepaid asset","As an expenditure"],
  answer:3,
  explain:"Governmental funds use the current financial resources focus, so a capital acquisition is recorded as an expenditure; the asset itself is reported only in the government-wide statements. 'Other financing use' is reserved for transfers out and similar items.",
  ref:"Governmental funds — capital outlay as expenditure"
},
{
  id:"cpa-bar-b3m1-04", source:"B3.M1", diff:"medium",
  q:"When a governmental fund issues a purchase order for goods that have not yet been received, what does it record?",
  choices:["An encumbrance","An expenditure","A liability","Nothing until delivery"],
  answer:0,
  explain:"Issuing a purchase order is recorded as an encumbrance, which reserves fund balance for the commitment. The expenditure and the related liability are recorded later, when the goods and invoice are received.",
  ref:"Governmental funds — encumbrance accounting"
},

/* --- B3.M2 Government-Wide Reporting & Reconciliation --- */
{
  id:"cpa-bar-b3m2-02", source:"B3.M2", diff:"medium",
  q:"Government-wide financial statements are prepared using which measurement focus and basis of accounting?",
  choices:["Current financial resources; modified accrual","Economic resources; full accrual","Cash; cash basis","Economic resources; modified accrual"],
  answer:1,
  explain:"Government-wide statements use the economic resources measurement focus and the full accrual basis, similar to a business. The current financial resources focus with modified accrual is used by the governmental funds, not at the government-wide level.",
  ref:"Government-wide reporting — focus and basis"
},
{
  id:"cpa-bar-b3m2-03", source:"B3.M2", diff:"hard",
  q:"In reconciling total governmental fund balances to government-wide net position, capital assets (net of depreciation) are:",
  choices:["Subtracted","Reclassified to liabilities","Added","Ignored"],
  answer:2,
  explain:"Capital assets are reported in the government-wide statements but not in the governmental funds (they were recorded as expenditures), so they are added back in the reconciliation. Long-term liabilities, by contrast, are subtracted.",
  ref:"Reconciliation — fund balances to net position"
},

/* --- B3.M3 Fund Statements & Net Position --- */
{
  id:"cpa-bar-b3m3-02", source:"B3.M3", diff:"medium",
  q:"An enterprise fund reports using which basis of accounting?",
  choices:["Modified accrual","Cash","Budgetary","Full accrual"],
  answer:3,
  explain:"Proprietary funds — enterprise and internal service — use the full accrual basis and the economic resources focus, mirroring the government-wide statements. Modified accrual is used only by the governmental funds.",
  ref:"Proprietary funds — basis of accounting"
},
{
  id:"cpa-bar-b3m3-03", source:"B3.M3", diff:"medium",
  q:"Government-wide net position is displayed in three components: net investment in capital assets, restricted, and:",
  choices:["Unrestricted","Assigned","Committed","Nonspendable"],
  answer:0,
  explain:"The three components of net position are net investment in capital assets, restricted, and unrestricted. Assigned, committed, and nonspendable are fund-balance classifications used in the governmental funds, not net position categories.",
  ref:"Net position — three components"
}

]);
