/* AUTO-GENERATED from content/cpa-far/far-f4-batch-09.json by tools/json-to-js.js — DO NOT EDIT BY HAND.
   Edit the JSON, run `node tools/validate.js` then `node tools/json-to-js.js`, commit both.
   31 questions · schema aced-question-bank/v1 */
window.ACED_QUESTIONS = (window.ACED_QUESTIONS || []).concat(
[
 {
  "id": "cpa-far-f4m1-ts-above",
  "source": "F4.M1",
  "diff": "medium",
  "q": "A company reacquires 1,000 of its own shares at $20 each using the cost method, then later reissues 600 of those shares at $25 each. What is the effect of the reissuance?",
  "choices": [
   "Additional paid-in capital from treasury stock increases by $3,000",
   "Net income increases by a $3,000 gain on the sale",
   "Retained earnings increases by $3,000",
   "Common stock increases by $15,000"
  ],
  "answer": 0,
  "explain": "Under the cost method, reissuing treasury stock above its reacquisition cost credits additional paid-in capital from treasury stock for the $3,000 excess (600 x ($25 - $20)). A company never reports a gain in net income on transactions in its own shares.",
  "reviewed": false,
  "je": {
   "title": "Reissue 600 treasury shares above cost",
   "lines": [
    {
     "dr": "Cash",
     "amt": 15000
    },
    {
     "cr": "Treasury Stock",
     "amt": 12000
    },
    {
     "cr": "APIC — Treasury Stock",
     "amt": 3000
    }
   ]
  }
 },
 {
  "id": "cpa-far-f4m1-ts-below",
  "source": "F4.M1",
  "diff": "hard",
  "q": "A company holds treasury stock acquired at $30 per share under the cost method. It reissues 200 shares at $24 when additional paid-in capital from treasury stock has a $500 balance. What is the effect on retained earnings?",
  "choices": [
   "Decrease of $1,200",
   "Decrease of $700",
   "Decrease of $500",
   "No effect"
  ],
  "answer": 1,
  "explain": "The $1,200 reissuance shortfall (200 x ($30 - $24)) first absorbs the $500 in additional paid-in capital from treasury stock; the remaining $700 reduces retained earnings. Losses on a company's own shares never hit the income statement.",
  "reviewed": false,
  "je": {
   "title": "Reissue 200 treasury shares below cost",
   "lines": [
    {
     "dr": "Cash",
     "amt": 4800
    },
    {
     "dr": "APIC — Treasury Stock",
     "amt": 500
    },
    {
     "dr": "Retained Earnings",
     "amt": 700
    },
    {
     "cr": "Treasury Stock",
     "amt": 6000
    }
   ]
  }
 },
 {
  "id": "cpa-far-f4m1-small-stockdiv",
  "source": "F4.M1",
  "diff": "medium",
  "q": "A corporation has 10,000 shares of $1 par common stock outstanding and declares a 10% stock dividend when the market price is $15 per share. By how much does retained earnings decrease?",
  "choices": [
   "$1,000",
   "$10,000",
   "$15,000",
   "$0"
  ],
  "answer": 2,
  "explain": "A small stock dividend (less than 20-25% of shares outstanding) is capitalized at fair value. The 1,000 new shares (10% x 10,000) are valued at $15 each, so retained earnings is reduced by $15,000.",
  "reviewed": false,
  "je": {
   "title": "Declare 10% stock dividend (small — at fair value)",
   "lines": [
    {
     "dr": "Retained Earnings",
     "amt": 15000
    },
    {
     "cr": "Common Stock (par)",
     "amt": 1000
    },
    {
     "cr": "APIC — Common Stock",
     "amt": 14000
    }
   ]
  }
 },
 {
  "id": "cpa-far-f4m1-large-stockdiv",
  "source": "F4.M1",
  "diff": "hard",
  "q": "A corporation has 50,000 shares of $2 par common stock outstanding and declares a 40% stock dividend when the market price is $9 per share. What amount is transferred out of retained earnings?",
  "choices": [
   "$180,000",
   "$360,000",
   "$100,000",
   "$40,000"
  ],
  "answer": 3,
  "explain": "A large stock dividend (more than 20-25% of shares outstanding) is capitalized at par, not fair value. The 20,000 new shares (40% x 50,000) at $2 par transfer $40,000 from retained earnings; the $180,000 figure wrongly uses the $9 market price.",
  "reviewed": false,
  "je": {
   "title": "Declare 40% stock dividend (large — at par)",
   "lines": [
    {
     "dr": "Retained Earnings",
     "amt": 40000
    },
    {
     "cr": "Common Stock (par)",
     "amt": 40000
    }
   ]
  }
 },
 {
  "id": "cpa-far-f4m1-liquidating",
  "source": "F4.M1",
  "diff": "medium",
  "q": "A corporation with an accumulated deficit and no retained earnings declares and pays a $50,000 cash dividend. How should this distribution be classified?",
  "choices": [
   "As a liquidating dividend that reduces additional paid-in capital",
   "As an ordinary dividend charged to retained earnings",
   "As compensation expense on the income statement",
   "As a prior-period adjustment to opening equity"
  ],
  "answer": 0,
  "explain": "A dividend that exceeds available retained earnings is a liquidating dividend - a return of contributed capital. It reduces additional paid-in capital rather than retained earnings, because there are no earnings to distribute.",
  "reviewed": false,
  "je": {
   "title": "Liquidating dividend (no retained earnings)",
   "lines": [
    {
     "dr": "Additional Paid-in Capital",
     "amt": 50000
    },
    {
     "cr": "Cash",
     "amt": 50000
    }
   ]
  }
 },
 {
  "id": "cpa-far-f4m2-eps-cumulative",
  "source": "F4.M2",
  "diff": "hard",
  "q": "A company reports net income of $500,000 with 100,000 weighted-average common shares outstanding. It also has 10,000 shares of $100 par, 6% cumulative preferred stock; no preferred dividends were declared this year. What is basic EPS?",
  "choices": [
   "$5.00",
   "$4.40",
   "$4.94",
   "$3.80"
  ],
  "answer": 1,
  "explain": "Cumulative preferred dividends are subtracted from the numerator whether or not declared. The annual preferred dividend is $60,000 (10,000 x $100 x 6%), so income available to common is $440,000, and basic EPS is $440,000 / 100,000 = $4.40.",
  "reviewed": false
 },
 {
  "id": "cpa-far-f4m2-eps-noncumulative",
  "source": "F4.M2",
  "diff": "medium",
  "q": "A company has net income of $300,000 and 50,000 weighted-average common shares. It also has noncumulative preferred stock with a $20,000 annual dividend that was not declared this year. What is basic EPS?",
  "choices": [
   "$5.60",
   "$6.40",
   "$6.00",
   "$5.00"
  ],
  "answer": 2,
  "explain": "Noncumulative preferred dividends reduce the numerator only if declared. Because no dividend was declared, nothing is subtracted, so basic EPS is $300,000 / 50,000 = $6.00.",
  "reviewed": false
 },
 {
  "id": "cpa-far-f4m2-wacso-issue",
  "source": "F4.M2",
  "diff": "medium",
  "q": "A company had 120,000 common shares outstanding on January 1 and issued 60,000 additional shares for cash on October 1. What is the weighted-average number of shares outstanding for the year?",
  "choices": [
   "180,000",
   "165,000",
   "150,000",
   "135,000"
  ],
  "answer": 3,
  "explain": "Newly issued shares are weighted for the portion of the year outstanding. The 60,000 shares issued on October 1 count for 3 months (60,000 x 3/12 = 15,000), giving 120,000 + 15,000 = 135,000 weighted-average shares.",
  "reviewed": false
 },
 {
  "id": "cpa-far-f4m2-wacso-split",
  "source": "F4.M2",
  "diff": "medium",
  "q": "A company had 100,000 common shares outstanding for the entire year and executed a 2-for-1 stock split on November 1. What weighted-average share count is used for EPS?",
  "choices": [
   "200,000",
   "116,667",
   "150,000",
   "100,000"
  ],
  "answer": 0,
  "explain": "Stock splits and stock dividends are applied retroactively to the beginning of the earliest period presented, as if they had always existed. The 2-for-1 split makes the weighted-average 200,000 shares for the whole year.",
  "reviewed": false
 },
 {
  "id": "cpa-far-f4m2-diluted-tsm",
  "source": "F4.M2",
  "diff": "hard",
  "q": "A company has 10,000 stock options outstanding with a $20 exercise price; the average market price during the year was $25. Using the treasury stock method, how many incremental shares are added to the diluted EPS denominator?",
  "choices": [
   "10,000",
   "2,000",
   "8,000",
   "2,500"
  ],
  "answer": 1,
  "explain": "Under the treasury stock method, assumed exercise proceeds of $200,000 (10,000 x $20) repurchase 8,000 shares at the $25 average price. The 2,000 net new shares (10,000 - 8,000) are added to the diluted denominator.",
  "reviewed": false
 },
 {
  "id": "cpa-far-f4m4-valuation-allow",
  "source": "F4.M4",
  "diff": "medium",
  "q": "At year-end a company has a deferred tax asset of $80,000. Management concludes it is more likely than not that $30,000 of that asset will not be realized. How should this be reported under US GAAP?",
  "choices": [
   "Disclose the $30,000 in the notes without adjusting the balance sheet",
   "Write the deferred tax asset down directly to $50,000 with no allowance",
   "Record a $30,000 valuation allowance reducing the net deferred tax asset",
   "Wait to adjust until the temporary differences actually reverse"
  ],
  "answer": 2,
  "explain": "When it is more likely than not (greater than 50% probability) that some or all of a deferred tax asset will not be realized, a valuation allowance is recorded to reduce the asset to its realizable amount and tax expense increases by $30,000.",
  "reviewed": false,
  "je": {
   "title": "Record valuation allowance on the DTA",
   "lines": [
    {
     "dr": "Income Tax Expense",
     "amt": 30000
    },
    {
     "cr": "Valuation Allowance (contra-DTA)",
     "amt": 30000
    }
   ]
  }
 },
 {
  "id": "cpa-far-f4m4-enacted-rate",
  "source": "F4.M4",
  "diff": "medium",
  "q": "A $100,000 taxable temporary difference will reverse next year. The current tax rate is 21%, and a 25% rate has been enacted for next year. At what amount is the related deferred tax liability measured?",
  "choices": [
   "$21,000",
   "$23,000",
   "$46,000",
   "$25,000"
  ],
  "answer": 3,
  "explain": "Deferred tax liabilities and assets are measured using the enacted tax rate expected to apply when the temporary difference reverses, not the current-period rate. The DTL is $100,000 x 25% = $25,000.",
  "reviewed": false
 },
 {
  "id": "cpa-far-f4m4-permanent",
  "source": "F4.M4",
  "diff": "easy",
  "q": "A company's book income includes $10,000 of interest earned on tax-exempt municipal bonds. What deferred tax effect does this item create?",
  "choices": [
   "None, because a permanent difference creates no deferred tax asset or liability",
   "A deferred tax liability",
   "A deferred tax asset",
   "Both a deferred tax asset and an offsetting deferred tax liability of the same amount"
  ],
  "answer": 0,
  "explain": "Tax-exempt municipal interest is income for books but never taxable - a permanent difference. Permanent differences never reverse, so they create no deferred tax asset or liability; they only affect the effective tax rate.",
  "reviewed": false
 },
 {
  "id": "cpa-far-f4m4-dtl-direction",
  "source": "F4.M4",
  "diff": "medium",
  "q": "In the current year, tax depreciation exceeds book depreciation on the same asset. What does this originating temporary difference create?",
  "choices": [
   "A deferred tax asset",
   "A deferred tax liability",
   "A permanent difference",
   "A prior-period adjustment"
  ],
  "answer": 1,
  "explain": "Deducting more depreciation for tax than for books lowers taxable income now but produces higher taxable income in later years when book depreciation exceeds tax depreciation. That future taxable amount is a deferred tax liability.",
  "reviewed": false
 },
 {
  "id": "cpa-far-f4m4-dta-warranty",
  "source": "F4.M4",
  "diff": "medium",
  "q": "A company accrues $40,000 of warranty expense for financial reporting but deducts warranty costs for tax purposes only when paid. With a 25% enacted tax rate, what does this create?",
  "choices": [
   "A $10,000 deferred tax liability",
   "A $40,000 deferred tax asset",
   "A $10,000 deferred tax asset",
   "No deferred tax effect"
  ],
  "answer": 2,
  "explain": "The warranty expense is recognized for books now but deducted for tax later, a future deductible amount. That produces a deferred tax asset of $40,000 x 25% = $10,000.",
  "reviewed": false,
  "je": {
   "title": "Recognize deferred tax asset (warranty timing)",
   "lines": [
    {
     "dr": "Deferred Tax Asset",
     "amt": 10000
    },
    {
     "cr": "Income Tax Expense (deferred)",
     "amt": 10000
    }
   ]
  }
 },
 {
  "id": "cpa-far-f4m4-total-expense",
  "source": "F4.M4",
  "diff": "medium",
  "q": "A company's current income tax payable for the year is $90,000, and its deferred tax liability increased by $12,000 during the year. What is total income tax expense?",
  "choices": [
   "$90,000",
   "$78,000",
   "$12,000",
   "$102,000"
  ],
  "answer": 3,
  "explain": "Total income tax expense equals current tax expense plus the change in deferred taxes. An increase in the deferred tax liability adds deferred tax expense, so total expense is $90,000 + $12,000 = $102,000.",
  "reviewed": false,
  "je": {
   "title": "Record the income tax provision",
   "lines": [
    {
     "dr": "Income Tax Expense",
     "amt": 102000
    },
    {
     "cr": "Income Taxes Payable",
     "amt": 90000
    },
    {
     "cr": "Deferred Tax Liability",
     "amt": 12000
    }
   ]
  }
 },
 {
  "id": "cpa-far-f4m4-utp-measure",
  "source": "F4.M4",
  "diff": "hard",
  "q": "Under ASC 740, a company may recognize the benefit of an uncertain tax position only if it is more likely than not to be sustained on examination. Once the recognition threshold is met, at what amount is the benefit measured?",
  "choices": [
   "The largest amount of benefit more than 50% likely to be realized",
   "The full amount claimed on the tax return",
   "Zero until the position is finally settled",
   "The smallest amount that could possibly be realized"
  ],
  "answer": 0,
  "explain": "Uncertain tax positions use a two-step model: recognize the benefit only if it is more likely than not to be sustained, then measure it at the largest amount of benefit that is greater than 50% likely to be realized on settlement.",
  "reviewed": false
 },
 {
  "id": "cpa-far-f4m5-modified-accrual",
  "source": "F4.M5",
  "diff": "medium",
  "q": "A city's General Fund levies $1,000,000 in property taxes. It collects $850,000 during the year, $50,000 within 60 days after year-end, and expects the final $100,000 about nine months after year-end. What is property tax revenue under modified accrual?",
  "choices": [
   "$850,000",
   "$900,000",
   "$1,000,000",
   "$950,000"
  ],
  "answer": 1,
  "explain": "Under modified accrual, revenue is recognized when measurable and available - for property taxes, collected within the year or within 60 days after year-end. That is $850,000 + $50,000 = $900,000; the remaining $100,000 is a deferred inflow of resources.",
  "reviewed": false
 },
 {
  "id": "cpa-far-f4m5-gov-fund-focus",
  "source": "F4.M5",
  "diff": "medium",
  "q": "Which measurement focus and basis of accounting do governmental funds, such as the General Fund, use in the fund financial statements?",
  "choices": [
   "Economic resources measurement focus and full accrual basis",
   "Cash basis of accounting only",
   "Current financial resources measurement focus and modified accrual basis",
   "Economic resources measurement focus and modified accrual basis"
  ],
  "answer": 2,
  "explain": "Governmental funds use the current financial resources measurement focus with the modified accrual basis: revenues are recognized when measurable and available, and expenditures when the related fund liability is incurred.",
  "reviewed": false
 },
 {
  "id": "cpa-far-f4m5-govwide-basis",
  "source": "F4.M5",
  "diff": "medium",
  "q": "The government-wide financial statements report governmental activities using which measurement focus and basis of accounting?",
  "choices": [
   "Current financial resources measurement focus and modified accrual basis",
   "Cash basis of accounting",
   "Budgetary basis of accounting",
   "Economic resources measurement focus and accrual basis"
  ],
  "answer": 3,
  "explain": "The government-wide statements take an entity-wide, long-term view using the economic resources measurement focus and full accrual basis, the same model a business uses, in contrast to the fund-level modified accrual presentation.",
  "reviewed": false
 },
 {
  "id": "cpa-far-f4m5-fund-type",
  "source": "F4.M5",
  "diff": "medium",
  "q": "Which of the following is classified as a governmental fund type?",
  "choices": [
   "Special Revenue Fund",
   "Enterprise Fund",
   "Internal Service Fund",
   "Pension Trust Fund"
  ],
  "answer": 0,
  "explain": "Governmental fund types are the General, Special Revenue, Capital Projects, Debt Service, and Permanent funds. Enterprise and Internal Service funds are proprietary; a Pension Trust fund is fiduciary.",
  "reviewed": false
 },
 {
  "id": "cpa-far-f4m5-encumbrance",
  "source": "F4.M5",
  "diff": "medium",
  "q": "When a government issues a purchase order for $5,000 of supplies, what does the General Fund record at that time?",
  "choices": [
   "Supplies expenditure of $5,000",
   "An encumbrance and a corresponding reserve of fund balance for $5,000",
   "An account payable of $5,000",
   "Nothing is recorded in the accounts until the supplies are actually received and inspected by the department"
  ],
  "answer": 1,
  "explain": "Encumbrance accounting reserves budgetary resources when a commitment is made: the entry debits Encumbrances and credits Budgetary Fund Balance Reserved for Encumbrances for $5,000. The actual expenditure is recorded later when the supplies arrive.",
  "reviewed": false
 },
 {
  "id": "cpa-far-f4m5-fiduciary",
  "source": "F4.M5",
  "diff": "medium",
  "q": "Why are fiduciary funds excluded from the government-wide financial statements?",
  "choices": [
   "They are always too immaterial to report",
   "They use only the cash basis of accounting",
   "Their resources are held for others and cannot support the government's own programs",
   "They are reported solely within the government's annual operating and capital budget documents"
  ],
  "answer": 2,
  "explain": "Fiduciary funds account for resources a government holds as an agent or trustee for parties outside the government. Because those resources cannot be used to support the government's own programs, they are excluded from the government-wide statements.",
  "reviewed": false
 },
 {
  "id": "cpa-far-f4m5-hierarchy",
  "source": "F4.M5",
  "diff": "hard",
  "q": "For a governmental accounting issue not addressed in GASB Statements, which source carries the next-highest authority?",
  "choices": [
   "FASB Statements",
   "AICPA industry guidance not cleared by the GASB",
   "Accounting textbooks and journal articles",
   "GASB Technical Bulletins and Implementation Guides"
  ],
  "answer": 3,
  "explain": "In the GASB authority hierarchy, GASB Statements rank first, followed by GASB Technical Bulletins and Implementation Guides, then AICPA literature cleared by the GASB, and finally other accounting literature.",
  "reviewed": false
 },
 {
  "id": "cpa-far-f4m5-deferred-inflow",
  "source": "F4.M5",
  "diff": "medium",
  "q": "A government levies $1,000,000 of property taxes but expects $80,000 to be collected more than 60 days after year-end. In the fund financial statements, how is that $80,000 reported?",
  "choices": [
   "As a deferred inflow of resources",
   "As revenue of the current period",
   "As a liability owed to taxpayers",
   "As a reduction of the total tax levy"
  ],
  "answer": 0,
  "explain": "Amounts that are measurable but not available - here, not collectible within 60 days of year-end - fail the modified accrual availability test. They are reported as a deferred inflow of resources, not as current revenue.",
  "reviewed": false
 },
 {
  "id": "cpa-far-f4m6-net-asset-classes",
  "source": "F4.M6",
  "diff": "medium",
  "q": "Under current US GAAP, how are a not-for-profit entity's net assets classified on its statement of financial position?",
  "choices": [
   "Three classes: unrestricted, temporarily restricted, and permanently restricted",
   "Two classes: with donor restrictions and without donor restrictions",
   "Four classes: program, support, endowment, and plant",
   "A single total of net assets with no subclasses"
  ],
  "answer": 1,
  "explain": "Current NFP standards require two net asset classes - with donor restrictions and without donor restrictions. The older three-class model (unrestricted, temporarily restricted, permanently restricted) was replaced.",
  "reviewed": false
 },
 {
  "id": "cpa-far-f4m6-conditional",
  "source": "F4.M6",
  "diff": "hard",
  "q": "A donor promises a nonprofit $100,000, but only if the nonprofit raises $100,000 in matching gifts by year-end. Before any matching gifts are received, how should the nonprofit account for the promise?",
  "choices": [
   "Recognize the full $100,000 of contribution revenue immediately",
   "Recognize $50,000 of contribution revenue now",
   "Recognize no contribution revenue until the matching condition is substantially met",
   "Record a $100,000 refundable liability"
  ],
  "answer": 2,
  "explain": "A contribution subject to a measurable barrier and a right of return is conditional. No revenue is recognized until the condition - raising the matching gifts - is substantially met, because the donor is not yet obligated to give.",
  "reviewed": false
 },
 {
  "id": "cpa-far-f4m6-donated-services",
  "source": "F4.M6",
  "diff": "medium",
  "q": "When does a not-for-profit recognize donated (volunteer) services as contribution revenue?",
  "choices": [
   "Whenever any volunteer donates time to the organization, regardless of the nature, skill level, or measurable value of the work performed",
   "Only if the volunteer is paid a stipend for the work",
   "Never, because donated services are not recorded under GAAP",
   "When the services require specialized skills, are provided by people with those skills, and would otherwise be purchased"
  ],
  "answer": 3,
  "explain": "Donated services are recognized only if they create or enhance a nonfinancial asset, or require specialized skills, are provided by people possessing those skills, and would typically need to be purchased if not donated.",
  "reviewed": false
 },
 {
  "id": "cpa-far-f4m6-restricted-gift",
  "source": "F4.M6",
  "diff": "medium",
  "q": "A nonprofit receives a $200,000 cash gift that the donor restricts to constructing a new building. How is the gift initially reported?",
  "choices": [
   "As contribution revenue that increases net assets with donor restrictions",
   "As a refundable liability until the building is constructed",
   "As unrestricted contribution revenue",
   "As a direct addition to the building asset account"
  ],
  "answer": 0,
  "explain": "A donor-imposed purpose restriction does not delay revenue recognition. The gift is recognized immediately as contribution revenue increasing net assets with donor restrictions; the restriction is released when the funds are spent as specified.",
  "reviewed": false
 },
 {
  "id": "cpa-far-f2m1-overtime-right",
  "source": "F2.M1",
  "diff": "hard",
  "q": "Under ASC 606, an entity contracts to build a specialized asset with no alternative use, but the contract gives no enforceable right to payment for performance completed to date. How should revenue be recognized?",
  "choices": [
   "Over time using a cost-to-cost input method",
   "At a point in time when control of the finished asset transfers to the customer",
   "Over time using an output method based on milestones",
   "Ratably in equal amounts over each period of the stated construction contract duration"
  ],
  "answer": 1,
  "explain": "Over-time recognition for an asset with no alternative use also requires an enforceable right to payment for performance completed to date. Without that right, none of the over-time criteria are met, so revenue is recognized at the point control transfers.",
  "reviewed": false
 },
 {
  "id": "cpa-far-f2m1-variable-constraint",
  "source": "F2.M1",
  "diff": "medium",
  "q": "An entity expects to earn a $50,000 performance bonus, but achieving it is highly uncertain. Under ASC 606, the entity includes variable consideration in the transaction price only to the extent that:",
  "choices": [
   "The related cash has already been collected",
   "The contract has been signed by both parties",
   "It is probable a significant revenue reversal will not subsequently occur",
   "The bonus amount has been separately guaranteed in writing by an authorized representative of the customer"
  ],
  "answer": 2,
  "explain": "The variable consideration constraint limits the estimate to the amount for which it is probable that a significant reversal of cumulative revenue will not occur once the uncertainty is resolved. High uncertainty about the bonus means little or none is included.",
  "reviewed": false
 }
]
);
