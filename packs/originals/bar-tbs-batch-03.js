/* =============================================================================
   ACED — bar-tbs-batch-03.js   (ORIGINAL CONTENT, append-safe)
   -----------------------------------------------------------------------------
   2 original BAR task-based simulations modeled on the skills in Becker's M3
   sims (standard-cost variance analysis and flexible-budget performance
   reporting). Scenarios, names, and numbers are original; the rules are public
   managerial-accounting facts.

   SCHEMA (matches the far-tbs / bar-tbs batch files):
     { source, diff, title, scenario,
       items:[ { prompt, type:"numeric", answer, tolerance, explain }
             | { prompt, type:"select", choices:[...], answer:<0-based>, explain } ] }

   Source keys are cpa-bar AICPA-area modules (B1 = Area I). Load by adding
   "packs/originals/bar-tbs-batch-03.js" to the TBS banks array in study.html.
   ============================================================================= */
window.ACED_TBS = (window.ACED_TBS || []).concat([

  /* ---- TBS 1: Standard-cost variances — materials and labor -------------- */
  { source:"B1.M5", diff:"hard",
    title:"Standard-Cost Variances — Direct Materials and Direct Labor",
    scenario:"Ashford Manufacturing uses a standard cost system. The standards per finished unit are: direct materials 4 pounds at $5.00 per pound, and direct labor 2 hours at $15.00 per hour.\n\nDuring the period Ashford produced 5,000 units and recorded these actual results: it purchased and used 21,000 pounds of materials at $5.20 per pound, and it used 9,800 direct labor hours at $14.50 per hour.\n\nFor each variance, enter the amount as a positive number, then select whether it is favorable or unfavorable.",
    items:[
      { prompt:"Direct materials PRICE variance (amount).",
        type:"numeric", answer:4200, tolerance:1,
        explain:"DM price variance = (actual price − standard price) × actual quantity purchased = ($5.20 − $5.00) × 21,000 = $4,200." },
      { prompt:"The direct materials price variance is:",
        type:"select", choices:["Favorable","Unfavorable"], answer:1,
        explain:"The actual price ($5.20) exceeded the standard price ($5.00), so paying more than standard is unfavorable." },
      { prompt:"Direct materials QUANTITY (usage) variance (amount).",
        type:"numeric", answer:5000, tolerance:1,
        explain:"DM quantity variance = (actual quantity used − standard quantity allowed) × standard price = (21,000 − (5,000 × 4 = 20,000)) × $5.00 = 1,000 × $5.00 = $5,000." },
      { prompt:"The direct materials quantity variance is:",
        type:"select", choices:["Favorable","Unfavorable"], answer:1,
        explain:"21,000 pounds were used versus 20,000 allowed for 5,000 units, so using more material than standard is unfavorable." },
      { prompt:"Direct labor RATE variance (amount).",
        type:"numeric", answer:4900, tolerance:1,
        explain:"DL rate variance = (actual rate − standard rate) × actual hours = ($14.50 − $15.00) × 9,800 = $4,900." },
      { prompt:"The direct labor rate variance is:",
        type:"select", choices:["Favorable","Unfavorable"], answer:0,
        explain:"The actual wage rate ($14.50) was below the standard ($15.00), so paying less than standard is favorable." },
      { prompt:"Direct labor EFFICIENCY variance (amount).",
        type:"numeric", answer:3000, tolerance:1,
        explain:"DL efficiency variance = (actual hours − standard hours allowed) × standard rate = (9,800 − (5,000 × 2 = 10,000)) × $15.00 = 200 × $15.00 = $3,000." },
      { prompt:"The direct labor efficiency variance is:",
        type:"select", choices:["Favorable","Unfavorable"], answer:0,
        explain:"Only 9,800 hours were used versus 10,000 allowed for 5,000 units, so using fewer hours than standard is favorable." }
    ] },

  /* ---- TBS 2: Flexible budget & performance report ----------------------- */
  { source:"B1.M6", diff:"hard",
    title:"Flexible Budget and Performance Report",
    scenario:"Brookline Co. prepared a static (master) budget based on 10,000 units: selling price $50 per unit, variable cost $30 per unit, and total fixed costs of $150,000. Actual results for the period were: 12,000 units sold, actual revenue $588,000, actual variable costs $372,000, and actual fixed costs $155,000.\n\nEnter dollar amounts as numbers; enter each variance as a positive amount and then select its direction.",
    items:[
      { prompt:"Operating income in the FLEXIBLE budget (built at the actual 12,000 units).",
        type:"numeric", answer:90000, tolerance:10,
        explain:"Flexible budget at 12,000 units: revenue 12,000 × $50 = $600,000; variable costs 12,000 × $30 = $360,000; contribution margin $240,000; less budgeted fixed costs $150,000 = $90,000 operating income." },
      { prompt:"Sales-volume variance for operating income (amount).",
        type:"numeric", answer:40000, tolerance:10,
        explain:"Sales-volume variance = flexible-budget operating income − static-budget operating income = $90,000 − $50,000 = $40,000 (equivalently, the 2,000 extra units × $20 contribution margin)." },
      { prompt:"The sales-volume variance is:",
        type:"select", choices:["Favorable","Unfavorable"], answer:0,
        explain:"Selling 12,000 units versus the 10,000 budgeted increases expected income, so the sales-volume variance is favorable." },
      { prompt:"Flexible-budget variance for operating income (amount).",
        type:"numeric", answer:29000, tolerance:10,
        explain:"Actual operating income = $588,000 − $372,000 − $155,000 = $61,000. Flexible-budget variance = actual − flexible = $61,000 − $90,000 = $29,000." },
      { prompt:"The flexible-budget variance is:",
        type:"select", choices:["Favorable","Unfavorable"], answer:1,
        explain:"Actual operating income ($61,000) fell short of the flexible-budget income ($90,000) for the same 12,000 units, so the flexible-budget variance is unfavorable." },
      { prompt:"A flexible budget is more useful than a static budget for performance evaluation because it:",
        type:"select",
        choices:["Is restated to the actual level of activity, so volume differences don't distort cost comparisons","Always uses the originally budgeted number of units","Replaces standard costs with actual costs","Ignores fixed costs entirely"],
        answer:0,
        explain:"A flexible budget recomputes budgeted revenues and costs at the actual activity level (12,000 units), isolating price/spending performance from the effect of producing a different volume than planned. A static budget stays at the original 10,000 units." }
    ] }

]);
