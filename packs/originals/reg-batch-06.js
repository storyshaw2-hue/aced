/* packs/originals/reg-batch-06.js — CPA · REG original question bank (batch 06).
   ============================================================================
   12 original Regulation items authored to LINE UP the pack to the AICPA
   blueprint. After batch 05, Entities (Area V) had slipped below its ~28%
   weight, so this batch restores it and tops up Individuals:
     REG.R5 Federal Taxation of Entities           → 8
            (accumulated earnings tax, personal holding company tax, §1244
             stock, corporate liquidation, §751 hot assets, partnership loss
             limitations, S-corp AAA distribution ordering, gift annual exclusion)
     REG.R4 Federal Taxation of Individuals        → 4
            (gambling losses, net investment income tax, casualty losses,
             hobby-loss rules)
   Distinct from batches 01–05. Rules are the public Internal Revenue Code.
   Keys balanced 3/3/3/3 across A/B/C/D; distractor lengths varied so the
   correct choice is not the longest. Schema:
   { id, source, diff, q, choices, answer (0-indexed), explain, ref }.
   ============================================================================ */
window.ACED_QUESTIONS = (window.ACED_QUESTIONS || []).concat([

/* ---------------- REG.R5 — Federal Taxation of Entities (deeper) --------- */
{
  id:"cpa-reg-r5-19", source:"REG.R5", diff:"hard",
  q:"The accumulated earnings tax is imposed to discourage a corporation from:",
  choices:[
    "Retaining earnings beyond its reasonable business needs to avoid tax on shareholder dividends",
    "Paying out regular quarterly cash dividends to each of its shareholders in every year of its operation",
    "Electing S corporation status",
    "Deducting ordinary and necessary business expenses"],
  answer:0,
  explain:"The accumulated earnings tax (a 20% penalty) targets C corporations that retain earnings beyond reasonable business needs to shield shareholders from dividend tax. It does not penalize paying dividends, electing S status, or deducting legitimate expenses.",
  ref:"IRC §531"
},
{
  id:"cpa-reg-r5-20", source:"REG.R5", diff:"hard",
  q:"The personal holding company (PHC) tax generally applies to a corporation that is:",
  choices:[
    "Widely held by many thousands of public shareholders and earning only active business income from its day-to-day operations",
    "Closely held and derives most of its income from passive sources such as dividends, interest, and rents",
    "A tax-exempt charitable organization",
    "An S corporation with a single shareholder"],
  answer:1,
  explain:"The PHC tax hits closely held corporations (5 or fewer owning over 50%) whose income is 60%+ passive (dividends, interest, rents, royalties). It does not apply to widely held active businesses, exempt organizations, or S corporations.",
  ref:"IRC §541"
},
{
  id:"cpa-reg-r5-21", source:"REG.R5", diff:"medium",
  q:"A qualifying original investor's loss on Section 1244 small business stock is:",
  choices:[
    "Always a long-term capital loss, regardless of the amount",
    "Fully nondeductible",
    "Treated as an ordinary loss up to an annual limit ($50,000; $100,000 on a joint return)",
    "Deductible only to the extent the investor has recognized gains from the sale of other Section 1244 stock"],
  answer:2,
  explain:"§1244 lets an original investor treat a loss on qualifying small business stock as an ordinary loss up to $50,000 ($100,000 MFJ) per year, with any excess as a capital loss. It is not all capital, not nondeductible, and not limited to §1244 gains.",
  ref:"IRC §1244"
},
{
  id:"cpa-reg-r5-22", source:"REG.R5", diff:"hard",
  q:"In a complete liquidation of a corporation that is not a subsidiary, a shareholder generally:",
  choices:[
    "Recognizes no gain or loss on the liquidating distribution",
    "Reports the entire amount of the liquidating distribution received as ordinary dividend income in the year of liquidation",
    "Increases stock basis by the amount received",
    "Treats the distribution as full payment in exchange for the stock, recognizing capital gain or loss"],
  answer:3,
  explain:"Under §331, a shareholder treats amounts received in a complete liquidation as full payment for the stock, recognizing capital gain or loss. It is not tax-free (that is §332 for an 80% parent), not ordinary dividend income, and does not increase basis.",
  ref:"IRC §331"
},
{
  id:"cpa-reg-r5-23", source:"REG.R5", diff:"hard",
  q:"When a partner sells a partnership interest, the portion of the gain attributable to the partnership's unrealized receivables and inventory ('hot assets') is:",
  choices:[
    "Ordinary income rather than capital gain",
    "Always long-term capital gain, regardless of the underlying partnership assets",
    "Entirely tax-free to the selling partner",
    "Added to the buyer's outside basis only"],
  answer:0,
  explain:"§751 recharacterizes the gain attributable to hot assets (unrealized receivables and inventory) as ordinary income; the remaining gain is generally capital. It is not all capital, not tax-free, and not merely a basis adjustment.",
  ref:"IRC §751"
},
{
  id:"cpa-reg-r5-24", source:"REG.R5", diff:"hard",
  q:"A partner's distributive share of partnership loss is deductible by the partner only to the extent of:",
  choices:[
    "The partnership's total assets",
    "The partner's basis, then subject to the at-risk and passive activity loss rules",
    "The partner's original cash contribution only",
    "The total amount that the partnership entity itself would be permitted to deduct on its own return in that year"],
  answer:1,
  explain:"A partner may deduct losses only up to outside basis, then the at-risk limitation, then the passive activity loss rules — three successive hurdles. It is not limited to total assets, the original contribution alone, or the partnership's own deduction.",
  ref:"IRC §704(d); §465; §469"
},
{
  id:"cpa-reg-r5-25", source:"REG.R5", diff:"hard",
  q:"An S corporation that has accumulated earnings and profits (from prior C years) makes a distribution. It is generally treated first as:",
  choices:[
    "A taxable dividend from earnings and profits",
    "A capital gain to the shareholder",
    "A tax-free distribution from the accumulated adjustments account (AAA), to the extent of basis",
    "Ordinary compensation income that is fully subject to Social Security and Medicare payroll taxes in the year received"],
  answer:2,
  explain:"For an S corporation with E&P, distributions come first from the AAA (tax-free to the extent of basis), then from E&P (a dividend), then remaining basis (return of capital), then capital gain. E&P is not first, and the distribution is not automatically capital gain or compensation.",
  ref:"IRC §1368(c)"
},
{
  id:"cpa-reg-r5-26", source:"REG.R5", diff:"medium",
  q:"The gift tax annual exclusion:",
  choices:[
    "Applies only to gifts made to the donor's spouse",
    "Covers gifts of future interests to the donee but specifically excludes any gift of a present interest of any kind",
    "Is a single, once-per-lifetime exclusion for one gift",
    "Allows a donor to exclude a set amount per donee each year for gifts of a present interest"],
  answer:3,
  explain:"The annual exclusion lets a donor exclude a set amount per donee each year for gifts of a present interest (gift-splitting doubles it for married couples). It is not spouse-only, does not cover future interests, and is not a once-per-lifetime amount (that is the unified credit/exemption).",
  ref:"IRC §2503(b)"
},

/* ---------------- REG.R4 — Federal Taxation of Individuals (top-up) ------ */
{
  id:"cpa-reg-r4-22", source:"REG.R4", diff:"medium",
  q:"A casual gambler has $10,000 of gambling winnings and $12,000 of gambling losses for the year. The gambler may:",
  choices:[
    "Deduct gambling losses as an itemized deduction, but only up to the $10,000 of winnings",
    "Deduct the entire $12,000 of gambling losses against any type of income the taxpayer earned during the year",
    "Exclude the winnings from income and simply ignore the losses",
    "Deduct the $2,000 net loss against ordinary income"],
  answer:0,
  explain:"Gambling winnings are fully included in income, and losses are deductible as an itemized deduction only up to the amount of winnings ($10,000 here). The excess $2,000 is not deductible, and winnings cannot be excluded.",
  ref:"IRC §165(d)"
},
{
  id:"cpa-reg-r4-23", source:"REG.R4", diff:"hard",
  q:"The 3.8% net investment income tax applies to:",
  choices:[
    "All of the taxpayer's wage and salary income earned above a specified statutory dollar threshold amount",
    "Net investment income, to the extent modified AGI exceeds a threshold",
    "Only municipal bond interest",
    "Every taxpayer, regardless of income level"],
  answer:1,
  explain:"The 3.8% NIIT applies to the lesser of net investment income or the excess of MAGI over the threshold ($200,000 single / $250,000 MFJ). It targets investment income — not wages (which face the 0.9% additional Medicare tax), not tax-exempt interest, and not all taxpayers.",
  ref:"IRC §1411"
},
{
  id:"cpa-reg-r4-24", source:"REG.R4", diff:"hard",
  q:"Under current law, an individual's personal casualty loss is deductible only if:",
  choices:[
    "It exceeds $500, with no other conditions",
    "The taxpayer itemized deductions in the prior year",
    "It is attributable to a federally declared disaster (then reduced by $100 per event and 10% of AGI)",
    "The damaged or destroyed property was fully insured but the insurance company denied the taxpayer's claim for any reason at all"],
  answer:2,
  explain:"Post-TCJA, a personal casualty loss is deductible only if attributable to a federally declared disaster, then reduced by a $100 floor per event and 10% of AGI. A flat $500 test, prior-year itemizing, or a denied insurance claim are not the standard.",
  ref:"IRC §165(h)"
},
{
  id:"cpa-reg-r4-25", source:"REG.R4", diff:"medium",
  q:"An activity is determined to be a hobby (not engaged in for profit). For federal income tax:",
  choices:[
    "All of the expenses of the hobby activity are fully deductible against the taxpayer's other sources of income",
    "The hobby's net loss offsets the taxpayer's wages",
    "Both the income and the expenses are ignored entirely",
    "Hobby income is included in gross income, but hobby expenses are generally not deductible"],
  answer:3,
  explain:"Hobby income is included in gross income, but the related expenses are generally nondeductible (the miscellaneous itemized deduction for them is suspended post-TCJA). Losses cannot offset wages, and the income is not ignored.",
  ref:"IRC §183"
}

]);
