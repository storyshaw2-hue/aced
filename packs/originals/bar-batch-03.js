/* packs/originals/bar-batch-03.js — CPA · BAR original question bank (batch 03).
   ============================================================================
   10 original items targeting high-yield BAR archetypes that batch-02 under-
   covered: relevant-cost decision making (special order, keep-or-drop), cash-
   collections & materials-purchases budgets, cost-variance direction, CAPM,
   COSO ERM component mapping, and foreign-currency hedge direction.

   Patterned (NOT copied) after standard exam archetypes; every scenario, name,
   and number is original and the underlying rules are public GAAP/AICPA-
   blueprint facts. Authoring discipline applied here: several items embed a
   plausible-but-irrelevant figure (a sunk cost, an allocated common cost, a tax
   rate) so the distractor that "uses the irrelevant data" maps to a real learner
   mistake, and the calculation items require two or more steps.

   Module keys are the cpa-bar AICPA-area keys (B1 = Area I, B2 = Area II,
   B3 = Area III) — NOT a prep vendor's chapter numbering. Schema matches the
   ACED engine: { id, source, diff, q, choices, answer (0-indexed), explain, ref }.
   ============================================================================ */
window.ACED_QUESTIONS = (window.ACED_QUESTIONS || []).concat([

/* --- B1.M1 Ratio & Financial Statement Analysis · transaction effect --- */
{
  id:"cpa-bar-b1m1-05", source:"B1.M1", diff:"hard",
  q:"Larkfield Co. has current assets of $400,000 and current liabilities of $200,000 (current ratio 2.0). It then pays $50,000 cash to settle an account payable. What is the effect on the current ratio?",
  choices:["Increases to 2.33","Decreases to 1.75","No change; it stays 2.0","Increases to 4.0"],
  answer:0,
  explain:"Paying a current liability with cash reduces both current assets and current liabilities by $50,000: ($400,000 − $50,000)/($200,000 − $50,000) = $350,000/$150,000 = 2.33. When the current ratio already exceeds 1.0, paying down a current liability raises it. 'No change' assumes both sides move proportionally (they don't); 1.75 reverses the direction.",
  ref:"Ratio analysis — effect of a transaction on the current ratio"
},

/* --- B1.M3 Forecasting & Prospective Analysis · cash-collections budget --- */
{
  id:"cpa-bar-b1m3-04", source:"B1.M3", diff:"medium",
  q:"Merrow Co. collects 60% of its sales in the month of sale and 40% in the following month. Sales were $200,000 in April and $250,000 in May. What are budgeted cash collections for May?",
  choices:["$250,000","$230,000","$150,000","$220,000"],
  answer:1,
  explain:"Collections = (60% × current-month sales) + (40% × prior-month sales) = (60% × $250,000) + (40% × $200,000) = $150,000 + $80,000 = $230,000. $250,000 wrongly treats May accrual sales as cash; $150,000 omits the prior-month (April) collection; $220,000 reverses the 60%/40% percentages.",
  ref:"Cash budget — collections from an aging schedule"
},
{
  id:"cpa-bar-b1m3-05", source:"B1.M3", diff:"medium",
  q:"The demand for Vorne Co.'s product is price-elastic, with a price elasticity of about 2.0. If Vorne raises its selling price by 5%, what happens to total revenue?",
  choices:["It increases, because price rose","It stays the same","It decreases, because demand is elastic","It increases, because quantity rises"],
  answer:2,
  explain:"With elastic demand (|elasticity| > 1), a 5% price increase reduces quantity demanded by roughly 10% — proportionally more than the price rose — so total revenue falls. Revenue would rise from a price increase only if demand were inelastic; it does not stay constant, and quantity falls (it does not rise).",
  ref:"Economics — price elasticity and total revenue"
},

/* --- B1.M5 Cost Accounting & Allocation · variance direction + purchases budget --- */
{
  id:"cpa-bar-b1m5-04", source:"B1.M5", diff:"medium",
  q:"Calder Co. has a standard direct-materials price of $5.00 per pound. During the period it actually paid $5.20 per pound and purchased 8,000 pounds. What is the direct-materials price variance?",
  choices:["$1,600 Favorable","$1,000 Unfavorable","Cannot be determined without usage","$1,600 Unfavorable"],
  answer:3,
  explain:"DM price variance = (actual price − standard price) × actual quantity purchased = ($5.20 − $5.00) × 8,000 = $1,600, Unfavorable because the actual price exceeded standard. 'Favorable' reverses the direction; $1,000 misuses the quantity; the price variance does not depend on usage — that is the efficiency (usage) variance.",
  ref:"Standard costing — materials price variance and direction"
},
{
  id:"cpa-bar-b1m5-05", source:"B1.M5", diff:"hard",
  q:"Pell Co.'s production plan requires 30,000 pounds of raw material. It wants 4,000 pounds of raw material in ending inventory and currently holds 5,000 pounds in beginning inventory. How many pounds should Pell budget to purchase?",
  choices:["29,000 pounds","31,000 pounds","30,000 pounds","39,000 pounds"],
  answer:0,
  explain:"Purchases = production needs + desired ending inventory − beginning inventory = 30,000 + 4,000 − 5,000 = 29,000 pounds. 31,000 reverses the inventory adjustment (adds beginning and subtracts ending); 30,000 ignores the change in inventory; 39,000 adds both inventory balances.",
  ref:"Direct-materials purchases budget"
},

/* --- B1.M6 Performance Management · relevant-cost decisions --- */
{
  id:"cpa-bar-b1m6-04", source:"B1.M6", diff:"hard",
  q:"Halsey Co. has idle capacity and receives a one-time order for 1,000 units at $18 each. Per unit: variable manufacturing cost is $12, variable selling cost on this order is $1, and allocated fixed overhead is $6. Should Halsey accept the order?",
  choices:["Reject — the $18 price is below the $19 full cost","Accept — operating income increases $5,000","Accept — operating income increases $6,000","Reject — the order adds no contribution"],
  answer:1,
  explain:"With idle capacity, only incremental costs are relevant. Contribution = $18 − ($12 variable manufacturing + $1 variable selling) = $5 per unit × 1,000 = $5,000 increase, so accept. The $6 allocated fixed overhead is unavoidable (sunk to this decision), so rejecting on the $19 'full cost' is the trap; $6,000 omits the $1 variable selling cost.",
  ref:"Relevant costing — special order with idle capacity"
},
{
  id:"cpa-bar-b1m6-05", source:"B1.M6", diff:"hard",
  q:"A segment of Dorne Co. reports sales of $200,000, variable costs of $130,000, and $90,000 of fixed costs — of which $40,000 is avoidable if the segment is dropped and $50,000 is allocated common cost that would continue. Should Dorne drop the segment?",
  choices:["Drop — the segment shows a $20,000 loss","Drop — dropping saves $90,000 of fixed costs","Keep — dropping would reduce operating income by $30,000","Keep — dropping would reduce operating income by $70,000"],
  answer:2,
  explain:"Compare lost contribution margin to avoidable fixed costs: CM = $200,000 − $130,000 = $70,000; avoidable fixed = $40,000. Net effect of dropping = −$70,000 + $40,000 = −$30,000, so keep. The 'drop' answers wrongly treat the $50,000 allocated common cost (which continues) as avoidable; the $70,000 answer ignores the $40,000 that would be saved.",
  ref:"Relevant costing — keep-or-drop a segment"
},

/* --- B1.M7 Corporate Finance · CAPM cost of equity --- */
{
  id:"cpa-bar-b1m7-04", source:"B1.M7", diff:"hard",
  q:"Sable Co. has a risk-free rate of 4%, a beta of 1.2, and an expected market return of 10%. Its tax rate is 30%. Using the capital asset pricing model, what is Sable's cost of common equity?",
  choices:["7.2%","12.0%","7.84%","11.2%"],
  answer:3,
  explain:"CAPM cost of equity = risk-free rate + beta × (market return − risk-free rate) = 4% + 1.2 × (10% − 4%) = 4% + 7.2% = 11.2%. 7.2% omits adding back the risk-free rate; 12.0% multiplies beta by the full market return; 7.84% wrongly tax-adjusts equity (there is no tax shield on equity) — the 30% rate is irrelevant to the cost of equity.",
  ref:"Corporate finance — CAPM cost of equity"
},

/* --- B1.M8 Risk Management (COSO ERM) · component classification --- */
{
  id:"cpa-bar-b1m8-04", source:"B1.M8", diff:"medium",
  q:"A company's board defines the entity's risk appetite, oversees management, and shapes the organization's risk culture. Under the COSO ERM (2017) framework, these activities fall within which component?",
  choices:["Governance & Culture","Strategy & Objective-Setting","Performance","Information, Communication & Reporting"],
  answer:0,
  explain:"Board oversight, setting risk appetite, and shaping risk culture are part of Governance & Culture. Strategy & Objective-Setting links risk appetite to strategy and objectives; Performance identifies, assesses, and prioritizes risks; Information, Communication & Reporting is the fifth component (the framework's other component is Review & Revision).",
  ref:"COSO ERM — five components"
},

/* --- B2.M7 Foreign Currency · hedge direction --- */
{
  id:"cpa-bar-b2m7-04", source:"B2.M7", diff:"medium",
  q:"A U.S. company has an account receivable denominated in euros that will be collected in 90 days and wants to hedge its currency exposure with a forward contract. What should it do?",
  choices:["Buy euros forward","Sell euros forward","Buy a euro call option","Enter an interest-rate swap"],
  answer:1,
  explain:"A foreign-currency receivable is hedged by selling the foreign currency forward, which locks in the dollar amount to be received. Buying euros forward hedges a payable (the opposite exposure); a euro call option also profits from a rising euro (wrong direction for a receivable); an interest-rate swap hedges interest-rate risk, not currency risk.",
  ref:"Foreign currency — hedging a receivable (sell forward)"
}

]);
