/* =============================================================================
   ACED — bar-tbs-batch-02.js   (ORIGINAL CONTENT, append-safe)
   -----------------------------------------------------------------------------
   2 original BAR task-based simulations covering capital budgeting (payback,
   NPV, profitability index, IRR relationship) and forecasting / prospective
   analysis (high-low cost estimation, percentage-of-sales pro forma, expected
   value). Scenarios, names, and numbers are original; the rules are public
   managerial-accounting / finance facts.

   SCHEMA (matches the existing far-tbs-batch / bar-tbs-batch-01 files):
     { source, diff, title, scenario,
       items:[ { prompt, type:"numeric", answer, tolerance, explain }
             | { prompt, type:"select", choices:[...], answer:<0-based>, explain } ] }

   Source keys are cpa-bar AICPA-area modules (B1 = Area I). Load by adding
   "packs/originals/bar-tbs-batch-02.js" to the TBS banks array in study.html.
   ============================================================================= */
window.ACED_TBS = (window.ACED_TBS || []).concat([

  /* ---- TBS 1: Capital budgeting — payback, NPV, PI, IRR ------------------- */
  { source:"B1.M4", diff:"hard",
    title:"Capital Budgeting — Payback, NPV, and Profitability Index",
    scenario:"Northgate Logistics is evaluating a project that requires an initial investment of $200,000 and is expected to generate even after-tax cash inflows of $60,000 per year for five years. The company's required rate of return is 10%. The present value of an ordinary annuity of $1 for five periods at 10% is 3.7908. Round dollar answers to the nearest dollar, the payback period to two decimals, and the profitability index to two decimals.",
    items:[
      { prompt:"Payback period, in years.",
        type:"numeric", answer:3.33, tolerance:0.05,
        explain:"With even cash flows, payback = initial investment ÷ annual cash inflow = $200,000 ÷ $60,000 = 3.33 years. Payback ignores the time value of money and any cash flows after the payback point." },
      { prompt:"Present value of the project's cash inflows.",
        type:"numeric", answer:227448, tolerance:50,
        explain:"PV of inflows = annual cash flow × annuity factor = $60,000 × 3.7908 = $227,448." },
      { prompt:"Net present value (NPV) of the project.",
        type:"numeric", answer:27448, tolerance:50,
        explain:"NPV = PV of inflows − initial investment = $227,448 − $200,000 = $27,448. A positive NPV means the project earns more than the 10% required return." },
      { prompt:"Profitability index (PI).",
        type:"numeric", answer:1.14, tolerance:0.02,
        explain:"PI = PV of inflows ÷ initial investment = $227,448 ÷ $200,000 = 1.14. A PI above 1.0 corresponds to a positive NPV." },
      { prompt:"Based on NPV, should Northgate accept the project?",
        type:"select", choices:["Accept — NPV is positive","Reject — NPV is negative","Indifferent — NPV is zero","Cannot tell from NPV alone"], answer:0,
        explain:"NPV is positive ($27,448), so the project adds value and should be accepted." },
      { prompt:"The project's internal rate of return (IRR) must be:",
        type:"select", choices:["Greater than 10%","Less than 10%","Exactly 10%","Unrelated to 10%"], answer:0,
        explain:"Because NPV is positive when the cash flows are discounted at 10%, the rate that drives NPV to zero (the IRR) must be greater than 10%. NPV equals zero only when the discount rate equals the IRR." }
    ] },

  /* ---- TBS 2: Forecasting — high-low, pro forma, expected value ----------- */
  { source:"B1.M3", diff:"medium",
    title:"Forecasting — Cost Estimation, Pro Forma, and Expected Value",
    scenario:"Vireo Co. is preparing forecasts.\n\n(A) COST BEHAVIOR: At an activity level of 10,000 units, total manufacturing cost was $80,000; at 6,000 units, total manufacturing cost was $56,000. Use the high-low method.\n\n(B) PRO FORMA: Next year's sales are projected to be $1,200,000. Accounts receivable have historically averaged 8% of sales.\n\n(C) EXPECTED VALUE: A new product's first-year cash flow is estimated at $50,000 with 20% probability, $80,000 with 50% probability, and $120,000 with 30% probability.\n\nEnter dollar amounts and per-unit costs as numbers.",
    items:[
      { prompt:"(A) Variable cost per unit (high-low method).",
        type:"numeric", answer:6.00, tolerance:0.05,
        explain:"Variable cost per unit = (cost at high − cost at low) ÷ (units at high − units at low) = ($80,000 − $56,000) ÷ (10,000 − 6,000) = $24,000 ÷ 4,000 = $6.00." },
      { prompt:"(A) Total fixed cost (high-low method).",
        type:"numeric", answer:20000, tolerance:10,
        explain:"Fixed cost = total cost − variable cost at a known level = $80,000 − ($6 × 10,000) = $80,000 − $60,000 = $20,000 (it checks at the low point: $56,000 − $6 × 6,000 = $20,000)." },
      { prompt:"(A) Forecasted total manufacturing cost at 8,000 units.",
        type:"numeric", answer:68000, tolerance:10,
        explain:"Total cost = fixed + (variable per unit × units) = $20,000 + ($6 × 8,000) = $20,000 + $48,000 = $68,000." },
      { prompt:"(B) Forecasted accounts receivable.",
        type:"numeric", answer:96000, tolerance:10,
        explain:"Percentage-of-sales forecast = 8% × projected sales = 8% × $1,200,000 = $96,000." },
      { prompt:"(C) Expected value of the first-year cash flow.",
        type:"numeric", answer:86000, tolerance:10,
        explain:"Expected value = Σ(probability × outcome) = 0.20($50,000) + 0.50($80,000) + 0.30($120,000) = $10,000 + $40,000 + $36,000 = $86,000." },
      { prompt:"(A) In the high-low method, total fixed cost is determined by:",
        type:"select", choices:["Subtracting total variable cost from total cost at either the high or low activity level","Averaging the total costs at the high and low levels","Dividing total cost by the number of units","Using only the cost at the lowest activity level as fixed cost"], answer:0,
        explain:"After computing the variable rate from the change in cost over the change in activity, fixed cost is found by subtracting total variable cost from total cost at either the high or the low point — both give the same fixed amount." }
    ] }

]);
