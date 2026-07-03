/* packs/originals/reg-batch-04.js — CPA · REG original question bank (batch 04).
   ============================================================================
   14 original Regulation items authored to IMPROVE BLUEPRINT BALANCE. After
   batches 01–03, Federal Taxation of Individuals (Area IV) was under-weighted
   relative to its ~27% AICPA target, so this batch is weighted there:
     REG.R4 Federal Taxation of Individuals        → 10
     REG.R3 Federal Taxation of Property Transactions → 2  (essential topics)
     REG.R2 Business Law                            → 2  (essential topics)
   No topic duplicates an earlier batch. Rules are the public Internal Revenue
   Code / common law; questions test durable provisions rather than
   inflation-adjusted thresholds. Keys balanced across A/B/C/D and distractor
   lengths varied. Schema:
   { id, source, diff, q, choices, answer (0-indexed), explain, ref }.
   ============================================================================ */
window.ACED_QUESTIONS = (window.ACED_QUESTIONS || []).concat([

/* ---------------- REG.R4 — Federal Taxation of Individuals ---------------- */
{
  id:"cpa-reg-r4-12", source:"REG.R4", diff:"hard",
  q:"The qualified business income (QBI) deduction under Section 199A generally allows an eligible taxpayer to deduct:",
  choices:[
    "Up to 20% of qualified business income from a pass-through, subject to taxable-income thresholds and limitations",
    "100% of all business income earned through any type of business entity, with no thresholds, wage limits, or other restrictions of any kind",
    "A flat credit of $2,000 against the tax on business income",
    "Only the self-employment tax paid on the business income for the year"],
  answer:0,
  explain:"§199A allows up to a 20% deduction on qualified business income from sole proprietorships, partnerships, and S corporations, subject to taxable-income thresholds and, above them, W-2 wage/property limits and the SSTB phaseout. It is not 100%, not a flat credit, and not merely the SE-tax deduction.",
  ref:"IRC §199A"
},
{
  id:"cpa-reg-r4-13", source:"REG.R4", diff:"medium",
  q:"A child has substantial unearned (investment) income. Under the 'kiddie tax,' that net unearned income above the annual threshold is generally taxed:",
  choices:[
    "At a flat 10% rate in all cases",
    "At the child's parents' marginal tax rate",
    "Not at all, because minors are exempt from income tax",
    "At the highest corporate income tax rate"],
  answer:1,
  explain:"The kiddie tax taxes a child's net unearned income above the threshold at the parents' marginal rate, preventing income shifting to low-bracket children. It is not a flat 10%, not exempt, and not taxed at corporate rates.",
  ref:"IRC §1(g)"
},
{
  id:"cpa-reg-r4-14", source:"REG.R4", diff:"medium",
  q:"The child and dependent care credit is:",
  choices:[
    "A refundable credit equal to the full cost of any childcare",
    "Available only to those taxpayers who have absolutely no earned income from any source during the entire tax year",
    "A nonrefundable credit for a percentage of eligible care expenses that enable the taxpayer to work",
    "A deduction rather than a credit"],
  answer:2,
  explain:"The credit is a nonrefundable credit equal to a percentage (20%–35%) of eligible care expenses (subject to dollar caps) incurred so the taxpayer can work or look for work. It is not the full cost, requires earned income, and is a credit, not a deduction.",
  ref:"IRC §21"
},
{
  id:"cpa-reg-r4-15", source:"REG.R4", diff:"medium",
  q:"For an individual, net long-term capital gain (net LTCG in excess of any net short-term capital loss) is generally:",
  choices:[
    "Taxed entirely as ordinary income at the taxpayer's highest marginal tax rate, in the same manner as wages",
    "Entirely exempt from federal income tax",
    "Subject to a mandatory 28% rate on all such gains",
    "Taxed at preferential rates of 0%, 15%, or 20% depending on taxable income"],
  answer:3,
  explain:"Net long-term capital gains are taxed at preferential 0/15/20% rates based on the taxpayer's taxable income (some special assets differ). Short-term gains are taxed at ordinary rates; the gains are neither exempt nor uniformly 28%.",
  ref:"IRC §1(h)"
},
{
  id:"cpa-reg-r4-16", source:"REG.R4", diff:"hard",
  q:"How are a taxpayer's Social Security retirement benefits treated for federal income tax?",
  choices:[
    "Up to 85% of the benefits may be taxable, depending on the taxpayer's income",
    "They are always fully taxable, like wages",
    "They are always entirely tax-free",
    "They are taxable only in a year during which the taxpayer remains actively employed and earning wages"],
  answer:0,
  explain:"Depending on 'provisional income,' 0%, up to 50%, or up to 85% of Social Security benefits are included in gross income. They are neither always fully taxable, always tax-free, nor keyed to current employment.",
  ref:"IRC §86"
},
{
  id:"cpa-reg-r4-17", source:"REG.R4", diff:"medium",
  q:"Which of the following is an above-the-line deduction (an adjustment used to arrive at adjusted gross income)?",
  choices:[
    "Home mortgage interest on the taxpayer's residence",
    "Contributions to a health savings account (HSA)",
    "State and local income taxes paid",
    "Cash contributions to a public charity"],
  answer:1,
  explain:"HSA contributions are an above-the-line adjustment (as are educator expenses, student loan interest, and one-half of SE tax). Mortgage interest, SALT, and charitable contributions are itemized deductions taken below the line.",
  ref:"IRC §62; §223"
},
{
  id:"cpa-reg-r4-18", source:"REG.R4", diff:"hard",
  q:"An unmarried taxpayer wants to claim head of household status. A key requirement is that the taxpayer:",
  choices:[
    "Have been widowed within the current tax year",
    "Have any dependent at all, regardless of living arrangements",
    "Pay more than half the cost of keeping up a home that is the principal residence of a qualifying person for more than half the year",
    "Earn less than the standard deduction amount for the year"],
  answer:2,
  explain:"Head of household requires being unmarried (or considered unmarried) and paying more than half the cost of maintaining a home that is the principal residence of a qualifying person for over half the year. It is not the widow(er) rule, not any dependent regardless of residence, and not an income ceiling.",
  ref:"IRC §2(b)"
},
{
  id:"cpa-reg-r4-19", source:"REG.R4", diff:"medium",
  q:"The child tax credit is generally:",
  choices:[
    "Available for a qualifying dependent of absolutely any age, including adult children and elderly parents",
    "A fully refundable credit with no income limitation",
    "Equal to a percentage of the child's own earned income",
    "$2,000 per qualifying child under age 17, phased out at higher income and partially refundable"],
  answer:3,
  explain:"The child tax credit is $2,000 per qualifying child under age 17, subject to a MAGI phaseout, with a portion refundable as the additional child tax credit. It is not for a dependent of any age, not unlimited or fully refundable, and not based on the child's earnings.",
  ref:"IRC §24"
},
{
  id:"cpa-reg-r4-20", source:"REG.R4", diff:"hard",
  q:"A taxpayer who itemized last year and deducted state income taxes receives a state income tax refund this year. Under the tax benefit rule, the refund is:",
  choices:[
    "Taxable this year to the extent the deduction produced a tax benefit last year",
    "Always fully excluded from income",
    "Always fully taxable in the year received, regardless of what happened on the taxpayer's prior-year return",
    "Taxable only if the taxpayer moves to another state"],
  answer:0,
  explain:"Under the tax benefit rule, a state tax refund is taxable this year only to the extent the prior-year deduction reduced tax (e.g., the taxpayer itemized and benefited). A taxpayer who took the standard deduction excludes the refund; it is neither always excluded, always taxable, nor tied to relocation.",
  ref:"IRC §111"
},
{
  id:"cpa-reg-r4-21", source:"REG.R4", diff:"medium",
  q:"Home mortgage interest is deductible as an itemized deduction on acquisition indebtedness up to a principal limit of:",
  choices:[
    "An unlimited amount of mortgage debt, no matter how large the underlying home loan happens to be",
    "$750,000 of acquisition debt (for debt incurred after 2017)",
    "$100,000 in all cases",
    "The amount of the taxpayer's adjusted gross income"],
  answer:1,
  explain:"For acquisition debt incurred after 12/15/2017, mortgage interest is deductible on up to $750,000 of debt ($1,000,000 for older debt). It is not unlimited, not a flat $100,000, and not tied to AGI.",
  ref:"IRC §163(h)"
},

/* ---------------- REG.R3 — Property Transactions (essentials) ------------- */
{
  id:"cpa-reg-r3-07", source:"REG.R3", diff:"hard",
  q:"On the sale of depreciable real property (e.g., a building) that was depreciated using the straight-line method, the gain attributable to that depreciation is:",
  choices:[
    "Fully recaptured as ordinary income under Section 1245",
    "Entirely exempt from tax",
    "'Unrecaptured Section 1250 gain,' taxed at a maximum rate of 25%",
    "Always taxed at the 0% long-term capital gains rate"],
  answer:2,
  explain:"Real property depreciated straight-line has no §1250 ordinary recapture, but the depreciation-related gain is 'unrecaptured §1250 gain,' taxed at a maximum 25% rate. §1245 applies to personal property, and the gain is neither exempt nor automatically 0%.",
  ref:"IRC §1250; §1(h)"
},
{
  id:"cpa-reg-r3-08", source:"REG.R3", diff:"medium",
  q:"A single taxpayer sells a principal residence owned and used as a main home for the last four years, realizing a $200,000 gain. Under Section 121, the taxpayer may:",
  choices:[
    "Exclude the entire $200,000 gain (within the $250,000 single-filer limit)",
    "Exclude nothing, because gains on homes are always taxable",
    "Defer the gain only by buying a more expensive home",
    "Exclude only $50,000 of the gain"],
  answer:0,
  explain:"Section 121 excludes up to $250,000 of gain ($500,000 MFJ) on a principal residence owned and used as such for at least 2 of the last 5 years, so the full $200,000 is excluded. The old rollover/replacement rule was repealed, and the exclusion is not denied or capped at $50,000 here.",
  ref:"IRC §121"
},

/* ---------------- REG.R2 — Business Law (essentials) --------------------- */
{
  id:"cpa-reg-r2-12", source:"REG.R2", diff:"medium",
  q:"A seller breaches a contract for the sale of a unique, one-of-a-kind antique. The buyer's most appropriate remedy is generally:",
  choices:[
    "Specific performance, because the goods are unique",
    "Punitive damages as a matter of right",
    "Nothing at all, because a breach of a contract of this kind simply has no available legal remedy",
    "Automatic criminal prosecution of the seller"],
  answer:0,
  explain:"Specific performance is available when the subject matter is unique (one-of-a-kind goods or real property) and money damages are inadequate. Punitive damages are generally unavailable for ordinary breach, a remedy does exist, and breach of contract is civil, not criminal.",
  ref:"Contract remedies; UCC §2-716"
},
{
  id:"cpa-reg-r2-13", source:"REG.R2", diff:"medium",
  q:"Which statement about the liability of business owners is correct?",
  choices:[
    "A general partner in a general partnership has limited liability up to the amount invested",
    "Members of a limited liability company (LLC) generally are not personally liable for the entity's debts beyond their investment",
    "Shareholders of a corporation are personally liable for all corporate debts",
    "A limited partner must manage the partnership to keep limited liability"],
  answer:1,
  explain:"LLC members generally have limited liability, risking only their investment. A general partner has unlimited personal liability, corporate shareholders are generally not personally liable, and a limited partner who takes control of management can lose limited-liability protection.",
  ref:"Business organizations — liability"
}

]);
