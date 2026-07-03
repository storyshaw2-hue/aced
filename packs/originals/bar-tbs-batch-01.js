/* =============================================================================
   ACED — bar-tbs-batch-01.js   (ORIGINAL CONTENT, append-safe)
   -----------------------------------------------------------------------------
   3 original BAR task-based simulations modeled on the skills Becker tests in
   the M1/M2 sims — marginal analysis (make-or-buy, sell-or-process, keep-or-
   drop), cost of capital (after-tax debt, preferred, CAPM, WACC), and ratio
   analysis. Scenarios, company names, and numbers are original; the rules are
   public managerial-accounting / corporate-finance facts.

   SCHEMA (matches the existing far-tbs-batch files / window.ACED_TBS):
     { source, diff, title, scenario,
       items:[ { prompt, type:"numeric", answer, tolerance, explain }
             | { prompt, type:"select", choices:[...], answer:<0-based>, explain } ] }

   Source keys are cpa-bar AICPA-area modules (B1 = Area I). To make these load
   in-game, add "packs/originals/bar-tbs-batch-01.js" to the TBS banks array in
   study.html (the same array that lists the far-tbs-batch files).
   ============================================================================= */
window.ACED_TBS = (window.ACED_TBS || []).concat([

  /* ---- TBS 1: Marginal analysis — three operational decisions ------------- */
  { source:"B1.M6", diff:"hard",
    title:"Marginal Analysis — Make-or-Buy, Sell-or-Process, Keep-or-Drop",
    scenario:"Brightwheel Manufacturing is evaluating three independent operational decisions. Use only the relevant (incremental) costs and revenues for each; ignore sunk and unavoidable allocated costs. Enter dollar amounts as numbers (enter a decrease in income as a negative number).\n\n(A) MAKE-OR-BUY: Brightwheel makes 20,000 units of a component per year. Unit costs to make are: direct materials $6, direct labor $5, variable overhead $3, and allocated fixed overhead $4 (of which only $1.50 per unit would be avoided if the part were purchased). An outside supplier offers the component for $17 per unit. The freed capacity would have no alternative use.\n\n(B) SELL-OR-PROCESS-FURTHER: A joint product can be sold at the split-off point for $40,000. Alternatively, it can be processed further for an additional $12,000 and then sold for $58,000. Allocated joint cost to this product is $25,000.\n\n(C) KEEP-OR-DROP: A segment reports sales of $150,000 and variable costs of $95,000. It is charged $70,000 of fixed costs, of which $30,000 is avoidable if the segment is dropped and $40,000 is allocated common cost that would continue.",
    items:[
      { prompt:"(A) Relevant cost PER UNIT to make the component.",
        type:"numeric", answer:15.50, tolerance:0.05,
        explain:"Relevant make cost = variable cost + avoidable fixed = ($6 + $5 + $3) + $1.50 = $15.50. The $2.50 of allocated fixed overhead that is unavoidable is irrelevant because it continues whether the part is made or bought." },
      { prompt:"(A) Should Brightwheel make or buy the component?",
        type:"select", choices:["Make the component","Buy the component"], answer:0,
        explain:"Relevant cost to make ($15.50) is less than the $17 purchase price, so making is cheaper by $1.50 per unit. Make the component." },
      { prompt:"(A) Annual cost advantage of the better alternative.",
        type:"numeric", answer:30000, tolerance:1,
        explain:"$1.50 per unit advantage × 20,000 units = $30,000 saved per year by making rather than buying." },
      { prompt:"(B) Incremental profit (or loss) from processing further instead of selling at split-off.",
        type:"numeric", answer:6000, tolerance:1,
        explain:"Incremental revenue = $58,000 − $40,000 = $18,000; incremental cost = $12,000; net benefit = $6,000. The $25,000 joint cost is sunk and irrelevant to this decision." },
      { prompt:"(B) Should the product be sold at split-off or processed further?",
        type:"select", choices:["Sell at the split-off point","Process further"], answer:1,
        explain:"Processing further adds $6,000 of incremental profit, so process further." },
      { prompt:"(C) Effect on operating income if the segment is dropped (enter a decrease as a negative).",
        type:"numeric", answer:-25000, tolerance:1,
        explain:"Dropping the segment forgoes its contribution margin ($150,000 − $95,000 = $55,000) but saves only the $30,000 of avoidable fixed costs: −$55,000 + $30,000 = −$25,000. The $40,000 allocated common cost continues." },
      { prompt:"(C) Should the segment be kept or dropped?",
        type:"select", choices:["Keep the segment","Drop the segment"], answer:0,
        explain:"Dropping reduces operating income by $25,000, so keep the segment. A segment should be dropped only when its avoidable fixed costs exceed its contribution margin." }
    ] },

  /* ---- TBS 2: Cost of capital — components and WACC ----------------------- */
  { source:"B1.M7", diff:"hard",
    title:"Cost of Capital — Component Costs and WACC",
    scenario:"Calabria Corp. finances its operations with 40% debt, 10% preferred stock, and 50% common equity (based on target weights). Relevant data: the pretax cost of debt is 8% and the marginal tax rate is 25%; preferred stock pays an annual dividend of $6 and currently trades at $50 per share; for common equity, the risk-free rate is 4%, the stock's beta is 1.2, and the expected market return is 10%. Enter each cost as a percentage (for example, enter 6.0 for 6%). Round to one decimal place.",
    items:[
      { prompt:"After-tax cost of debt (%).",
        type:"numeric", answer:6.0, tolerance:0.1,
        explain:"After-tax cost of debt = pretax rate × (1 − tax rate) = 8% × (1 − 0.25) = 6.0%. Interest is tax-deductible, so the cost is reduced by the tax shield." },
      { prompt:"Cost of preferred stock (%).",
        type:"numeric", answer:12.0, tolerance:0.1,
        explain:"Cost of preferred = annual dividend ÷ price = $6 ÷ $50 = 12.0%. Preferred dividends are not tax-deductible, so there is no tax adjustment." },
      { prompt:"Cost of common equity using CAPM (%).",
        type:"numeric", answer:11.2, tolerance:0.1,
        explain:"CAPM = risk-free rate + beta × (market return − risk-free rate) = 4% + 1.2 × (10% − 4%) = 4% + 7.2% = 11.2%. Equity is never tax-adjusted." },
      { prompt:"Weighted-average cost of capital (%).",
        type:"numeric", answer:9.2, tolerance:0.1,
        explain:"WACC = (0.40 × 6.0%) + (0.10 × 12.0%) + (0.50 × 11.2%) = 2.4% + 1.2% + 5.6% = 9.2%." },
      { prompt:"If Calabria's tax rate rose to 35% with everything else unchanged, its WACC would:",
        type:"select", choices:["Increase","Decrease","Stay the same","Change in an indeterminate direction"], answer:1,
        explain:"A higher tax rate lowers the after-tax cost of debt (8% × 0.65 = 5.2%), which lowers the WACC to about 8.9%. Only the debt component carries a tax shield, so a tax increase reduces the WACC." },
      { prompt:"Which rate should Calabria use to discount a new project of average (firm-level) risk?",
        type:"select", choices:["The weighted-average cost of capital","The after-tax cost of debt only","The cost of equity only","The risk-free rate"], answer:0,
        explain:"A project of average risk is discounted at the firm's WACC, which blends the costs of all capital sources. Using only the cost of debt would understate the hurdle rate; using only equity would overstate it." }
    ] },

  /* ---- TBS 3: Ratio analysis from financial statements -------------------- */
  { source:"B1.M1", diff:"medium",
    title:"Ratio Analysis — Liquidity, Activity, and Return",
    scenario:"Dunmore Retail reports the following. Balance sheet: cash and receivables $400,000; inventory $200,000; total current assets $600,000; current liabilities $300,000; total liabilities $1,000,000; total stockholders' equity $1,000,000. Income statement: net credit sales $1,800,000; cost of goods sold $1,200,000; net income $240,000. Averages: average inventory $200,000; average accounts receivable $300,000; average stockholders' equity $1,000,000. Enter ratios to two decimals; enter return on equity as a percentage (for example, 24.0 for 24%).",
    items:[
      { prompt:"Current ratio.",
        type:"numeric", answer:2.0, tolerance:0.02,
        explain:"Current ratio = current assets ÷ current liabilities = $600,000 ÷ $300,000 = 2.00." },
      { prompt:"Quick (acid-test) ratio.",
        type:"numeric", answer:1.33, tolerance:0.03,
        explain:"Quick ratio = (current assets − inventory) ÷ current liabilities = ($600,000 − $200,000) ÷ $300,000 = $400,000 ÷ $300,000 = 1.33. Inventory is excluded because it is the least liquid current asset." },
      { prompt:"Inventory turnover.",
        type:"numeric", answer:6.0, tolerance:0.05,
        explain:"Inventory turnover = cost of goods sold ÷ average inventory = $1,200,000 ÷ $200,000 = 6.00. COGS (not sales) is the correct numerator." },
      { prompt:"Accounts receivable turnover.",
        type:"numeric", answer:6.0, tolerance:0.05,
        explain:"AR turnover = net credit sales ÷ average accounts receivable = $1,800,000 ÷ $300,000 = 6.00." },
      { prompt:"Return on equity (%).",
        type:"numeric", answer:24.0, tolerance:0.1,
        explain:"ROE = net income ÷ average stockholders' equity = $240,000 ÷ $1,000,000 = 24.0%." },
      { prompt:"Debt-to-equity ratio.",
        type:"numeric", answer:1.0, tolerance:0.02,
        explain:"Debt-to-equity = total liabilities ÷ total equity = $1,000,000 ÷ $1,000,000 = 1.00." },
      { prompt:"A current ratio of 2.0 is best interpreted to mean that the company has:",
        type:"select", choices:["$2 of current assets for every $1 of current liabilities","$2 of net income for every $1 of equity","twice as much inventory as cash","$2 of total assets for every $1 of total debt"], answer:0,
        explain:"The current ratio compares current assets to current liabilities, so 2.0 means $2 of current assets exist for every $1 of current liabilities — a measure of short-term liquidity." }
    ] }

]);
