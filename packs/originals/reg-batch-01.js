/* packs/originals/reg-batch-01.js — CPA · REG original question bank (batch 01).
   ============================================================================
   20 original Regulation items modeled on the QUESTION PATTERNS in the Becker
   R1/R2 MCQ sets. Re-created with original facts and mapped by CONTENT to the
   AICPA REG areas (never by Becker chapter). This first bank covers the three
   areas the R1/R2 material addresses:
     REG.R4 Federal Taxation of Individuals        → 11
     REG.R3 Federal Taxation of Property Transactions → 6
     REG.R1 Ethics, Prof. Responsibilities & Fed. Tax Procedures → 3
   (Business Law [R2] and Entities [R5] are declared in the pack and will be
   populated as their Becker source is added.)

   Rules cited are the public Internal Revenue Code / Treasury regulations.
   Questions test durable provisions and computations rather than
   inflation-adjusted dollar thresholds, so they stay correct year to year.
   Answer keys are balanced 5/5/5/5 across A/B/C/D and distractor lengths are
   varied so the correct choice is not systematically longest. Each distractor
   names a specific mistake. Schema:
   { id, source, diff, q, choices, answer (0-indexed), explain, ref }.
   ============================================================================ */
window.ACED_QUESTIONS = (window.ACED_QUESTIONS || []).concat([

/* ---------------- REG.R4 — Federal Taxation of Individuals ---------------- */
{
  id:"cpa-reg-r4-01", source:"REG.R4", diff:"easy",
  q:"Which of the following is EXCLUDED from a taxpayer's gross income?",
  choices:[
    "Life insurance proceeds received because of the insured's death",
    "Gambling winnings from a casino, even when offset by later gambling losses",
    "A cash prize won on a television game show",
    "Tips received by a restaurant server during the year"],
  answer:0,
  explain:"Life insurance proceeds paid by reason of death are excluded from gross income. Gambling winnings, prizes and awards, and tips are all taxable inclusions.",
  ref:"IRC §101; §61"
},
{
  id:"cpa-reg-r4-02", source:"REG.R4", diff:"medium",
  q:"Under a divorce decree executed in 2020, one former spouse pays the other $2,000 per month. For federal income tax, the payments are:",
  choices:[
    "Deductible by the payer and taxable to the recipient, as under pre-2019 decrees",
    "Neither deductible by the payer nor taxable to the recipient",
    "Deductible by the payer but not taxable to the recipient",
    "A nondeductible gift subject to gift tax"],
  answer:1,
  explain:"For divorce or separation instruments executed after 12/31/2018, alimony is neither deductible by the payer nor included in the recipient's income. The deduct/include treatment survives only for pre-2019 decrees, and the payments are not a gift.",
  ref:"IRC §71/§215 (post-TCJA)"
},
{
  id:"cpa-reg-r4-03", source:"REG.R4", diff:"medium",
  q:"A taxpayer who is an active participant in an employer's retirement plan wants to deduct a traditional IRA contribution. The deduction is:",
  choices:[
    "Always fully deductible, regardless of the taxpayer's income",
    "Never allowed for an active participant in an employer plan",
    "Phased out once modified AGI exceeds the applicable threshold",
    "Allowed only if the taxpayer also contributes the maximum to a Roth IRA that same year"],
  answer:2,
  explain:"For an active participant, the traditional IRA deduction phases out over an income range based on modified AGI. It is not always allowed, not categorically denied, and not conditioned on a Roth contribution.",
  ref:"IRC §219"
},
{
  id:"cpa-reg-r4-04", source:"REG.R4", diff:"medium",
  q:"A self-employed taxpayer pays self-employment tax on net earnings. In computing adjusted gross income, the taxpayer may deduct:",
  choices:[
    "The full amount of the self-employment tax paid",
    "None of the self-employment tax, which is never deductible",
    "Only the Medicare portion of the self-employment tax",
    "One-half of the self-employment tax"],
  answer:3,
  explain:"One-half of self-employment tax (the employer-equivalent portion) is an above-the-line deduction. The full amount, none, or only the Medicare portion are all incorrect.",
  ref:"IRC §164(f)"
},
{
  id:"cpa-reg-r4-05", source:"REG.R4", diff:"medium",
  q:"A taxpayer's spouse died in Year 1. The taxpayer has not remarried and maintains a home for a dependent child. In Year 2 and Year 3, the taxpayer may file as:",
  choices:[
    "Qualifying surviving spouse",
    "Married filing jointly for both years, as though the spouse were still alive",
    "Head of household in Year 1 only",
    "Single, with no available alternative"],
  answer:0,
  explain:"A qualifying surviving spouse with a dependent child uses joint rates for the two years after the year of death. MFJ is allowed only in the year of death, and the taxpayer's status afterward is qualifying surviving spouse rather than single.",
  ref:"IRC §2(a)"
},
{
  id:"cpa-reg-r4-06", source:"REG.R4", diff:"hard",
  q:"Which requirement must be met for a person to be the taxpayer's qualifying CHILD?",
  choices:[
    "The child must have gross income below the annual exemption threshold",
    "The child must be under age 19 (or under 24 if a full-time student) at year-end",
    "The child must have lived with the taxpayer for the entire calendar year",
    "The taxpayer must have provided more than half of the child's support, and the child must have earned no wages at all"],
  answer:1,
  explain:"A qualifying child must meet the age test (under 19, or under 24 if a full-time student). The gross-income test is a qualifying-relative rule, residency requires more than half the year (not all year), and for a qualifying child the support test asks whether the CHILD provided over half of their own support.",
  ref:"IRC §152(c)"
},
{
  id:"cpa-reg-r4-07", source:"REG.R4", diff:"medium",
  q:"For an individual who itemizes, the deduction for state and local taxes (income or sales, plus property taxes) is limited to:",
  choices:[
    "An unlimited amount, with no cap",
    "7.5% of adjusted gross income",
    "$10,000 ($5,000 if married filing separately)",
    "2% of adjusted gross income, as a miscellaneous itemized deduction"],
  answer:2,
  explain:"The state and local tax (SALT) deduction is capped at $10,000 ($5,000 MFS). It is not unlimited; 7.5% of AGI is the medical floor; and the 2%-of-AGI miscellaneous category is currently suspended.",
  ref:"IRC §164(b)(6)"
},
{
  id:"cpa-reg-r4-08", source:"REG.R4", diff:"medium",
  q:"A taxpayer with AGI of $80,000 pays $9,000 of unreimbursed medical expenses. The deductible medical expense (before considering the standard deduction) is:",
  choices:[
    "$9,000",
    "$0",
    "$6,000",
    "$3,000"],
  answer:3,
  explain:"Medical expenses are deductible only to the extent they exceed 7.5% of AGI: $80,000 × 7.5% = $6,000 floor, so $9,000 − $6,000 = $3,000. $9,000 ignores the floor, $6,000 is the floor itself, and $0 wrongly assumes nothing is deductible.",
  ref:"IRC §213"
},
{
  id:"cpa-reg-r4-09", source:"REG.R4", diff:"medium",
  q:"An individual donates cash to a public charity. The current-year deduction for cash gifts to public charities is limited to:",
  choices:[
    "60% of adjusted gross income, with a five-year carryforward of the excess",
    "30% of adjusted gross income, with no carryforward permitted",
    "100% of taxable income in every case",
    "The lesser of the amount donated or the taxpayer's total itemized deductions for the year"],
  answer:0,
  explain:"Cash gifts to public charities are deductible up to 60% of AGI, with a five-year carryforward. The 30% ceiling applies to certain property or other organizations; it is not 100% of taxable income, and it is not limited to total itemized deductions.",
  ref:"IRC §170(b)"
},
{
  id:"cpa-reg-r4-10", source:"REG.R4", diff:"hard",
  q:"Which statement about the American Opportunity Tax Credit (AOTC) is correct?",
  choices:[
    "It may be claimed for an unlimited number of years of postsecondary education",
    "It is partially refundable (up to 40%) and limited to the first four years of postsecondary education",
    "It equals 20% of up to $10,000 of qualified expenses per return",
    "It is available only to taxpayers who are themselves enrolled as full-time graduate students"],
  answer:1,
  explain:"The AOTC is up to $2,500 per student, 40% refundable, for the first four years of postsecondary education. Unlimited years and the 20%-of-$10,000 formula describe the Lifetime Learning Credit; graduate-only enrollment is incorrect.",
  ref:"IRC §25A"
},
{
  id:"cpa-reg-r4-11", source:"REG.R4", diff:"hard",
  q:"A taxpayer who actively participates in a rental real estate activity has a loss. Subject to a phaseout as AGI rises, the taxpayer may generally deduct up to:",
  choices:[
    "The full loss with no limitation, because rental losses are always active",
    "$3,000 of the loss per year, like a capital loss",
    "$25,000 of the loss against nonpassive income",
    "None of the loss, because all rental real estate losses are permanently disallowed"],
  answer:2,
  explain:"Active participation in rental real estate allows up to $25,000 of loss against nonpassive income, phased out between $100,000 and $150,000 of AGI. Rental losses are generally passive (not unlimited), the $3,000 limit is for capital losses, and disallowed passive losses are suspended—not permanently lost.",
  ref:"IRC §469(i)"
},

/* ---------------- REG.R3 — Property Transactions -------------------------- */
{
  id:"cpa-reg-r3-01", source:"REG.R3", diff:"medium",
  q:"An individual has a net capital loss of $10,000 for the year and no capital gains. How much may be deducted against ordinary income this year, with the remainder carried forward?",
  choices:[
    "$10,000 deducted this year; $0 carried forward",
    "$0 deducted; $10,000 carried forward",
    "$1,500 deducted; $8,500 carried forward",
    "$3,000 deducted; $7,000 carried forward"],
  answer:3,
  explain:"An individual may deduct up to $3,000 of net capital loss against ordinary income ($1,500 MFS), carrying the rest forward indefinitely: $3,000 now and $7,000 forward. The other splits misstate the annual limit.",
  ref:"IRC §1211(b); §1212(b)"
},
{
  id:"cpa-reg-r3-02", source:"REG.R3", diff:"hard",
  q:"A donor gives stock with an adjusted basis of $4,000 and a fair market value of $10,000 at the date of the gift. The donee later sells it for $12,000. The donee's recognized gain is:",
  choices:[
    "$8,000",
    "$2,000, using the fair market value at the date of the gift as the basis",
    "$12,000, because the donee has no basis in gifted property",
    "$0, because gifts are never taxable to the donee"],
  answer:0,
  explain:"For a sale at a gain, the donee uses the donor's carryover basis ($4,000), so gain = $12,000 − $4,000 = $8,000. Using FMV as basis, a zero basis, or treating the sale as tax-free are all incorrect.",
  ref:"IRC §1015"
},
{
  id:"cpa-reg-r3-03", source:"REG.R3", diff:"medium",
  q:"A taxpayer inherits land from a decedent. The decedent's adjusted basis was $50,000; the fair market value on the date of death was $200,000. The heir's basis and holding period are:",
  choices:[
    "$50,000 basis; holding period carries over from the decedent",
    "$200,000 basis; automatically treated as long-term",
    "$200,000 basis; short-term until held more than one year by the heir",
    "$0 basis until the heir pays estate tax on the property's value"],
  answer:1,
  explain:"Inherited property takes a basis equal to FMV at the date of death (a step-up here), and the holding period is automatically long-term. The decedent's basis and holding period do not carry over, and there is no 'basis upon payment of estate tax' rule.",
  ref:"IRC §1014; §1223(9)"
},
{
  id:"cpa-reg-r3-04", source:"REG.R3", diff:"hard",
  q:"A business sells equipment (Section 1231 property) for $30,000. Original cost was $40,000 and accumulated depreciation was $25,000 (adjusted basis $15,000). How is the $15,000 gain characterized?",
  choices:[
    "$15,000 long-term capital gain",
    "$15,000 Section 1231 gain, all treated as capital",
    "$15,000 ordinary income under Section 1245 depreciation recapture",
    "$25,000 of ordinary income, equal to all of the depreciation previously taken"],
  answer:2,
  explain:"Section 1245 recaptures gain as ordinary income up to the depreciation taken. Gain is $15,000, and because depreciation ($25,000) exceeds the gain, all $15,000 is ordinary—no capital or §1231 gain remains, and recapture cannot exceed the actual $15,000 gain.",
  ref:"IRC §1245"
},
{
  id:"cpa-reg-r3-05", source:"REG.R3", diff:"medium",
  q:"Which statement about like-kind exchanges under current law is correct?",
  choices:[
    "Exchanges of business equipment for other equipment still qualify for deferral",
    "Any recognized gain is limited to the fair market value of the like-kind property received",
    "Personal-use property, such as a primary residence, qualifies if exchanged for similar property",
    "Only real property held for business or investment qualifies, and boot received triggers gain"],
  answer:3,
  explain:"Since the TCJA, only real property held for business or investment qualifies for §1031, and gain is recognized to the extent of boot received (the lesser of boot or realized gain). Business equipment and personal-use property no longer qualify.",
  ref:"IRC §1031 (post-TCJA)"
},
{
  id:"cpa-reg-r3-06", source:"REG.R3", diff:"medium",
  q:"An investor sells stock at a $5,000 loss and buys the same stock 10 days later. The tax treatment is:",
  choices:[
    "The loss is disallowed, and the disallowed amount is added to the basis of the newly purchased stock",
    "The loss is fully deductible, since the shares were actually sold",
    "The loss is permanently and completely disallowed, with no adjustment whatsoever to the basis of the replacement shares purchased within the period",
    "Half of the loss is deductible and half is disallowed"],
  answer:0,
  explain:"This is a wash sale (repurchase within 30 days before or after the sale). The loss is disallowed but not lost—it is added to the basis of the replacement shares. It is not fully deductible, not permanently lost without a basis adjustment, and not split in half.",
  ref:"IRC §1091"
},

/* ---------------- REG.R1 — Ethics & Federal Tax Procedures ---------------- */
{
  id:"cpa-reg-r1-01", source:"REG.R1", diff:"medium",
  q:"A taxpayer files a return that omits gross income exceeding 25% of the gross income reported on the return. The IRS generally may assess additional tax within:",
  choices:[
    "3 years from the date the return was filed",
    "6 years from the date the return was filed",
    "No time limit applies in this situation",
    "10 years, the same period allowed for collecting a tax that has been assessed"],
  answer:1,
  explain:"A greater-than-25% omission of gross income extends the assessment statute to 6 years. The normal period is 3 years; an unlimited period applies to fraud or a non-filed return; and 10 years is the collection period after assessment, not the assessment period.",
  ref:"IRC §6501(e)"
},
{
  id:"cpa-reg-r1-02", source:"REG.R1", diff:"hard",
  q:"An individual (prior-year AGI of $90,000) wants to avoid the underpayment penalty. Generally, no penalty applies if withholding plus estimated payments total at least:",
  choices:[
    "100% of the current year's tax, computed only after the return is filed",
    "80% of the current year's tax",
    "the smaller of 90% of the current-year tax or 100% of the prior-year tax",
    "any amount, as long as the balance due is paid by the extended due date of the return"],
  answer:2,
  explain:"The safe harbor is the lesser of 90% of the current-year tax or 100% of the prior-year tax (110% if prior-year AGI exceeds $150,000). 80% is not the threshold, computing 'after filing' misstates the timing, and paying by the extended due date does not avoid the underpayment penalty.",
  ref:"IRC §6654"
},
{
  id:"cpa-reg-r1-03", source:"REG.R1", diff:"medium",
  q:"The penalty for failure to FILE a return by its due date (absent reasonable cause) is generally:",
  choices:[
    "0.5% of the unpaid tax for each month or part of a month that the tax remains unpaid, up to a maximum of 25%",
    "20% of the entire underpayment of tax",
    "a flat dollar amount that applies regardless of how much tax the taxpayer actually owes",
    "5% of the unpaid tax per month (up to 25%), reduced by any failure-to-pay penalty for the same month"],
  answer:3,
  explain:"The failure-to-file penalty is 5% of unpaid tax per month up to 25%, coordinated with (reduced by) the 0.5%/month failure-to-pay penalty. The 0.5% figure is the failure-to-pay penalty, 20% is the accuracy-related penalty, and the flat dollar amount is only a minimum that applies when a return is more than 60 days late.",
  ref:"IRC §6651"
}

]);
