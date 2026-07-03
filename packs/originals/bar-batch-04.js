/* packs/originals/bar-batch-04.js — CPA · BAR original question bank (batch 04).
   ============================================================================
   9 curated items covering Area I topics the prior batches did NOT have:
   process-costing equivalent units, joint-cost allocation, over/underapplied
   overhead, production-volume variance, sell-or-process-further, make-or-buy,
   COSO ERM limitations, the value creation/preservation/realization/erosion
   taxonomy, and structured-vs-unstructured data.

   These were adapted from an external pattern-derived BAR draft: the arithmetic
   was independently re-verified, the wording rewritten in ACED's voice, each
   distractor's mistake named in `explain`, the answer key rebalanced, and — most
   important — every item RE-CLASSIFIED to the correct cpa-bar AICPA-area module
   by its actual content (the draft's Becker-style B3.Mx keys do not match this
   pack, where B3 = Area III governmental). Schema matches the ACED engine:
   { id, source, diff, q, choices, answer (0-indexed), explain, ref }.
   ============================================================================ */
window.ACED_QUESTIONS = (window.ACED_QUESTIONS || []).concat([

/* --- B1.M5 Cost Accounting & Allocation --- */
{
  id:"cpa-bar-b1m5-06", source:"B1.M5", diff:"hard",
  q:"A process-costing department using weighted-average costing has 12,000 units in ending work in process that are 100% complete for materials and 40% complete for conversion. Unit costs are $3 for materials and $8 for conversion. What cost is assigned to ending work in process?",
  choices:["$74,400","$36,000","$38,400","$132,000"],
  answer:0,
  explain:"Ending WIP = (materials equivalent units × materials cost) + (conversion equivalent units × conversion cost). Materials (100%): 12,000 × $3 = $36,000. Conversion (40%): 12,000 × 40% × $8 = $38,400. Total = $74,400. $36,000 counts materials only; $38,400 counts conversion only; $132,000 ignores the 40% completion on conversion.",
  ref:"Process costing — equivalent units (weighted average)"
},
{
  id:"cpa-bar-b1m5-07", source:"B1.M5", diff:"medium",
  q:"Joint products X and Y come from a $90,000 joint process. At split-off, X has a sales value of $120,000 and Y has a sales value of $180,000. Using the relative-sales-value method, how much joint cost is allocated to X?",
  choices:["$27,000","$36,000","$54,000","$90,000"],
  answer:1,
  explain:"Allocate joint cost by relative sales value at split-off: X's share = $120,000 / ($120,000 + $180,000) = 40%, so 40% × $90,000 = $36,000. $54,000 applies Y's 60% share to X; $27,000 uses a wrong proportion; $90,000 assigns the entire joint cost to a single product.",
  ref:"Joint cost allocation — relative sales value"
},
{
  id:"cpa-bar-b1m5-08", source:"B1.M5", diff:"medium",
  q:"A company applies overhead at $5 per machine hour. Actual machine hours were 22,000 and actual overhead was $118,000 (overhead is applied on actual hours). Was overhead over- or underapplied, and by how much?",
  choices:["Overapplied by $8,000","Overapplied by $110,000","Underapplied by $8,000","Underapplied by $118,000"],
  answer:2,
  explain:"Applied overhead = 22,000 × $5 = $110,000. Actual overhead $118,000 exceeds applied $110,000 by $8,000, so overhead is underapplied (too little was applied). 'Overapplied' reverses the direction; the $110,000 and $118,000 options mistake a total for the variance.",
  ref:"Overhead — over/underapplied"
},
{
  id:"cpa-bar-b1m5-09", source:"B1.M5", diff:"hard",
  q:"A company reports an unfavorable production-volume variance for fixed overhead. Which explanation is most consistent with that result?",
  choices:["Actual production exceeded the expected level","The actual variable-overhead rate was lower than expected","Actual selling price exceeded the budgeted price","Actual production was below the denominator (expected) level"],
  answer:3,
  explain:"An unfavorable production-volume variance means fixed overhead was underapplied because actual output fell short of the denominator activity used to set the fixed-overhead rate. Production above the expected level would be favorable; a variable-rate change drives the spending variance, not the volume variance; selling price is unrelated to an overhead variance.",
  ref:"Overhead — production-volume variance"
},

/* --- B1.M6 Performance Management · relevant-cost decisions --- */
{
  id:"cpa-bar-b1m6-06", source:"B1.M6", diff:"medium",
  q:"A joint product can be sold at split-off for $70,000 or processed further for an additional $18,000 and then sold for $91,000. What should the company do?",
  choices:["Process further — the incremental benefit is $3,000","Sell at split-off — the joint costs are relevant","Sell at split-off — processing further lowers income","Process further — total sales value is $21,000 higher"],
  answer:0,
  explain:"Only costs and revenues beyond split-off are relevant: incremental revenue = $91,000 − $70,000 = $21,000, less incremental cost $18,000 = $3,000 net benefit, so process further. Joint costs are sunk and irrelevant; '$21,000 higher' ignores the $18,000 processing cost; selling at split-off forgoes the $3,000 gain.",
  ref:"Relevant costing — sell or process further"
},
{
  id:"cpa-bar-b1m6-07", source:"B1.M6", diff:"hard",
  q:"A company can make a component for a $38 variable cost per unit or buy it for $42 per unit. Buying would let it avoid $30,000 of fixed costs and use the freed capacity to earn $20,000 of contribution margin. Annual demand is 10,000 units. Which is better, and by how much?",
  choices:["Make, by $40,000","Buy, by $10,000","Make, by $10,000","Buy, by $30,000"],
  answer:1,
  explain:"Make = 10,000 × $38 = $380,000. Buy = 10,000 × $42 = $420,000, reduced by the $30,000 avoidable fixed cost and the $20,000 contribution from freed capacity → net relevant cost of buying = $370,000. Since $370,000 < $380,000, buy, by $10,000. The 'make' answers ignore the avoidable fixed cost and the freed-capacity benefit.",
  ref:"Relevant costing — make or buy with opportunity cost"
},

/* --- B1.M8 Risk Management (COSO ERM) --- */
{
  id:"cpa-bar-b1m8-05", source:"B1.M8", diff:"medium",
  q:"Which statement best describes a limitation of enterprise risk management (ERM)?",
  choices:["ERM eliminates uncertainty when properly implemented","ERM provides absolute assurance that objectives will be achieved","ERM depends on the judgment and actions of people","ERM prevents all future adverse events"],
  answer:2,
  explain:"A core limitation of ERM is that it relies on human judgment and execution, so it can provide only reasonable — not absolute — assurance. The other options overstate ERM: it cannot eliminate uncertainty, guarantee objectives, or prevent every adverse event.",
  ref:"COSO ERM — inherent limitations"
},
{
  id:"cpa-bar-b1m8-06", source:"B1.M8", diff:"medium",
  q:"A failed product launch causes a company to lose market share and reduces its expected future cash flows. Under the COSO ERM value lens, this outcome is best described as:",
  choices:["Value creation","Value preservation","Value realization","Value erosion"],
  answer:3,
  explain:"Value erosion occurs when adverse events or poor execution reduce expected future cash flows and destroy value, as a failed launch losing market share does. Value creation increases value, value preservation maintains it, and value realization converts created value into benefits for stakeholders.",
  ref:"COSO ERM — value creation, preservation, realization, erosion"
},

/* --- B1.M2 Data Analytics & Visualization --- */
{
  id:"cpa-bar-b1m2-04", source:"B1.M2", diff:"easy",
  q:"Which of the following data sources is most likely to be unstructured?",
  choices:["Free-form customer review text","A general-ledger transaction table","An inventory item master file","A payroll database"],
  answer:0,
  explain:"Unstructured data lacks a predefined row-and-column model; free-form text such as customer reviews is the classic example. A general-ledger table, an item master file, and a payroll database are all structured — organized into defined fields and records.",
  ref:"Data analytics — structured vs. unstructured data"
}

]);
