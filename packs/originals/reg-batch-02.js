/* packs/originals/reg-batch-02.js — CPA · REG original question bank (batch 02).
   ============================================================================
   18 original Regulation items modeled on the QUESTION PATTERNS in the Becker
   R3 MCQ sets (entity taxation). Re-created with original facts and mapped by
   CONTENT to the AICPA area they test — all fall in:
     REG.R5 Federal Taxation of Entities
   Coverage: C corporations ×7, S corporations ×5, partnerships ×4,
   exempt organizations & fiduciaries ×2. This populates the REG.R5 module that
   was declared but empty after batch-01.

   Rules cited are the public Internal Revenue Code. Questions test durable
   provisions and computations rather than inflation-adjusted thresholds.
   Answer keys balanced across A/B/C/D and distractor lengths varied so the
   correct choice is not systematically the longest. Each distractor names a
   specific mistake. Schema:
   { id, source, diff, q, choices, answer (0-indexed), explain, ref }.
   ============================================================================ */
window.ACED_QUESTIONS = (window.ACED_QUESTIONS || []).concat([

/* ---------------- C CORPORATIONS ----------------------------------------- */
{
  id:"cpa-reg-r5-01", source:"REG.R5", diff:"medium",
  q:"Several individuals transfer property to a newly formed corporation solely in exchange for 85% of its stock. Under Section 351:",
  choices:[
    "No gain or loss is recognized, because the transferors control at least 80% of the corporation immediately after the exchange",
    "Gain or loss is recognized, because any transfer of property to a corporation is a taxable event",
    "Only losses are recognized; gains are deferred",
    "Gain is recognized to the extent of the property's appreciation"],
  answer:0,
  explain:"Section 351 defers gain or loss when transferors of property are in control (at least 80%) of the corporation immediately after the exchange. Recognition is not automatic, not loss-only, and not based on appreciation unless boot is received.",
  ref:"IRC §351"
},
{
  id:"cpa-reg-r5-02", source:"REG.R5", diff:"medium",
  q:"A C corporation owns 30% of the stock of a domestic corporation from which it receives dividends. Its dividends-received deduction percentage is generally:",
  choices:[
    "0%",
    "50%",
    "65%",
    "100%"],
  answer:2,
  explain:"For ownership of 20% up to 80%, the dividends-received deduction is 65%. Under 20% ownership gives 50%, and 80%-or-more (affiliated) gives 100%.",
  ref:"IRC §243"
},
{
  id:"cpa-reg-r5-03", source:"REG.R5", diff:"medium",
  q:"A C corporation has a net capital loss for the year. The loss:",
  choices:[
    "May offset up to $3,000 of ordinary income each year, exactly as an individual's capital loss does",
    "Is fully deductible against ordinary income with no limitation",
    "Is permanently disallowed and never usable",
    "May be deducted only against capital gains, and carries back 3 years and forward 5 years"],
  answer:3,
  explain:"A C corporation deducts capital losses only against capital gains (no $3,000 allowance), carrying them back 3 years and forward 5. The loss is neither fully deductible against ordinary income nor permanently lost.",
  ref:"IRC §1211(a); §1212(a)"
},
{
  id:"cpa-reg-r5-04", source:"REG.R5", diff:"medium",
  q:"A C corporation's charitable contribution deduction is generally limited to:",
  choices:[
    "10% of taxable income (with modifications), with a five-year carryforward of the excess",
    "60% of adjusted gross income, the same limit that applies to individual cash donors",
    "An unlimited amount",
    "50% of gross receipts"],
  answer:0,
  explain:"A C corporation may deduct charitable contributions up to 10% of taxable income (computed before certain deductions), with a five-year carryforward. 60% of AGI is an individual limit; the deduction is neither unlimited nor based on gross receipts.",
  ref:"IRC §170(b)(2)"
},
{
  id:"cpa-reg-r5-05", source:"REG.R5", diff:"hard",
  q:"A new C corporation incurs $8,000 of qualifying organizational expenditures. It may generally:",
  choices:[
    "Deduct the entire $8,000 in the first year",
    "Deduct none of the amount until the corporation eventually liquidates or dissolves entirely",
    "Deduct $5,000 immediately and amortize the remaining $3,000 over 180 months",
    "Add the $8,000 to the basis of its inventory held for resale"],
  answer:2,
  explain:"Up to $5,000 of organizational expenditures is deductible immediately (the $5,000 phases out once total expenditures exceed $50,000), with the remainder amortized over 180 months. It is not fully immediate, not deferred to liquidation, and not added to inventory.",
  ref:"IRC §248"
},
{
  id:"cpa-reg-r5-06", source:"REG.R5", diff:"hard",
  q:"A C corporation distributes $30,000 cash to its sole shareholder when current and accumulated earnings and profits total $20,000. The shareholder's stock basis is $25,000. The shareholder reports:",
  choices:[
    "$30,000 of dividend income in full",
    "$20,000 of dividend income and $10,000 as a tax-free return of capital (basis reduced to $15,000)",
    "$20,000 of dividend income and $10,000 of capital gain",
    "No income of any kind, because distributions from a corporation are always treated as a return of capital"],
  answer:1,
  explain:"A distribution is a dividend to the extent of E&P ($20,000); the excess ($10,000) is a tax-free return of capital that reduces stock basis to $15,000, and only amounts beyond basis would be capital gain. Not all $30,000 is a dividend, and no capital gain arises here.",
  ref:"IRC §301; §316"
},
{
  id:"cpa-reg-r5-07", source:"REG.R5", diff:"medium",
  q:"Regarding a C corporation's net operating loss (NOL) arising in a post-2020 year, the NOL generally:",
  choices:[
    "May be carried back 2 years and then forward up to 20 years, under the older pre-2018 net operating loss rules",
    "Must be used entirely in the year it arises or it is lost forever",
    "Offsets 100% of future taxable income with no limitation of any kind",
    "May not be carried back, is carried forward indefinitely, and offsets up to 80% of taxable income"],
  answer:3,
  explain:"Post-TCJA NOLs generally cannot be carried back, carry forward indefinitely, and are limited to 80% of taxable income in a carryforward year. The 2-back/20-forward rule and the unlimited or one-year treatments are incorrect.",
  ref:"IRC §172"
},

/* ---------------- S CORPORATIONS ----------------------------------------- */
{
  id:"cpa-reg-r5-08", source:"REG.R5", diff:"medium",
  q:"Which of the following would DISQUALIFY a corporation from making an S election?",
  choices:[
    "Having 90 individual shareholders",
    "Having one class of stock whose shares carry different voting rights",
    "Having a partnership as a shareholder",
    "Having an estate as a shareholder for a limited period"],
  answer:2,
  explain:"A partnership (like a corporation or a nonresident alien) cannot be an S corporation shareholder. Up to 100 shareholders are permitted, differences in voting rights alone do not create a second class of stock, and estates are eligible shareholders.",
  ref:"IRC §1361"
},
{
  id:"cpa-reg-r5-09", source:"REG.R5", diff:"medium",
  q:"Which item must an S corporation separately state on the shareholders' Schedules K-1 (rather than fold into ordinary business income)?",
  choices:[
    "Net long-term capital gain",
    "Salary paid to non-owner employees of the business",
    "Cost of goods sold for the year",
    "Ordinary repairs and maintenance on equipment"],
  answer:0,
  explain:"Items with special tax character—net long-term capital gain, §1231 gains, charitable contributions, investment interest—are separately stated so each shareholder applies the correct treatment. Employee wages, COGS, and ordinary repairs are part of ordinary business income.",
  ref:"IRC §1366(a)"
},
{
  id:"cpa-reg-r5-10", source:"REG.R5", diff:"hard",
  q:"An S corporation shareholder's share of the corporation's loss exceeds the shareholder's stock basis. The excess loss:",
  choices:[
    "Is fully deductible by the shareholder regardless of stock basis or any loans made to the corporation",
    "May be deducted to the extent of the shareholder's direct loans (debt basis) to the corporation, with any remainder suspended",
    "Increases the shareholder's stock basis for the year",
    "Is added to the corporation's net operating loss carryforward"],
  answer:1,
  explain:"Losses are deductible up to stock basis plus the shareholder's debt basis (direct loans to the S corporation); losses beyond that are suspended and carried forward. Losses are not deductible without basis, do not increase basis, and do not create a corporate NOL.",
  ref:"IRC §1366(d)"
},
{
  id:"cpa-reg-r5-11", source:"REG.R5", diff:"medium",
  q:"An S corporation with no accumulated earnings and profits distributes cash to a shareholder. The distribution is:",
  choices:[
    "A fully taxable dividend to the shareholder, exactly as a distribution from a C corporation would be treated",
    "Always fully taxable to the shareholder as ordinary income",
    "Deductible by the S corporation when paid",
    "Tax-free to the extent of the shareholder's stock basis, with any excess treated as capital gain"],
  answer:3,
  explain:"For an S corporation without E&P, distributions are tax-free to the extent of stock basis (reducing it), and any excess is capital gain. They are not dividends, not automatically ordinary income, and never deductible by the corporation.",
  ref:"IRC §1368"
},
{
  id:"cpa-reg-r5-12", source:"REG.R5", diff:"hard",
  q:"The built-in gains tax may apply to an S corporation when it:",
  choices:[
    "Was formerly a C corporation and sells appreciated property within the recognition period",
    "Has been an S corporation continuously since it was first formed",
    "Makes a routine cash distribution to its shareholders",
    "Elects to use a fiscal tax year rather than the required calendar year for reporting"],
  answer:0,
  explain:"The built-in gains tax targets a former C corporation's appreciation that existed at conversion, if the property is sold within the recognition period. It does not apply to an always-S corporation, nor to routine distributions or a fiscal-year election.",
  ref:"IRC §1374"
},

/* ---------------- PARTNERSHIPS ------------------------------------------- */
{
  id:"cpa-reg-r5-13", source:"REG.R5", diff:"medium",
  q:"A partner contributes appreciated property to a partnership in exchange for a partnership interest. Generally:",
  choices:[
    "The partner recognizes gain equal to the property's appreciation at the time of contribution",
    "No gain or loss is recognized on the contribution",
    "The partnership recognizes gain upon receipt of the contributed property",
    "The partner recognizes ordinary income equal to the property's fair market value"],
  answer:1,
  explain:"Under §721, neither the partner nor the partnership generally recognizes gain or loss on a contribution of property for a partnership interest. (Exceptions include contributing services or having liabilities relieved in excess of basis.)",
  ref:"IRC §721"
},
{
  id:"cpa-reg-r5-14", source:"REG.R5", diff:"medium",
  q:"A partner's basis in a partnership interest (outside basis):",
  choices:[
    "Ignores partnership liabilities entirely when it is computed",
    "Equals the partnership's total assets on the balance sheet",
    "Includes the partner's share of partnership liabilities",
    "Can never be reduced below the amount of the partner's original contribution"],
  answer:2,
  explain:"A partner's outside basis includes the partner's share of partnership liabilities and changes with income, distributions, and liability shifts. It does not ignore liabilities, equal total assets, or have a floor at the original contribution.",
  ref:"IRC §752"
},
{
  id:"cpa-reg-r5-15", source:"REG.R5", diff:"hard",
  q:"A guaranteed payment to a partner for services rendered is:",
  choices:[
    "Completely nondeductible by the partnership and also entirely tax-free to the partner who receives it",
    "Treated only as a distribution that reduces the partner's basis",
    "A dividend to the partner, taxed at the lower qualified dividend rates",
    "Deductible by the partnership (if otherwise deductible) and ordinary income to the partner, regardless of partnership income"],
  answer:3,
  explain:"Guaranteed payments are determined without regard to partnership income; they are deductible by the partnership (if the underlying expense is deductible) and are ordinary income to the recipient partner. They are not tax-free, not merely a basis-reducing distribution, and not a dividend.",
  ref:"IRC §707(c)"
},
{
  id:"cpa-reg-r5-16", source:"REG.R5", diff:"hard",
  q:"A partnership makes a current cash distribution of $10,000 to a partner whose basis is $7,000. The partner recognizes:",
  choices:[
    "$0 gain, with basis reduced to zero and the $3,000 excess carried forward as a suspended loss",
    "$10,000 of ordinary income",
    "$3,000 of gain, because the cash distributed exceeds the partner's basis",
    "$7,000 of gain, equal to the partner's basis"],
  answer:2,
  explain:"A current cash distribution is tax-free up to basis; cash exceeding basis ($10,000 − $7,000 = $3,000) triggers gain, and basis becomes zero. It is not ordinary income, not $7,000, and the excess is gain rather than a suspended loss.",
  ref:"IRC §731(a)"
},

/* ---------------- EXEMPT ORGANIZATIONS & FIDUCIARIES --------------------- */
{
  id:"cpa-reg-r5-17", source:"REG.R5", diff:"medium",
  q:"A tax-exempt 501(c)(3) organization operates a business that is unrelated to its exempt purpose. The net income from that activity is:",
  choices:[
    "Subject to the unrelated business income tax (UBIT)",
    "Always tax-free, because the organization itself is tax-exempt",
    "Taxed only in a year the organization actually distributes the income",
    "Exempt as long as the organization qualifies as a church or a similar body"],
  answer:0,
  explain:"Income from a trade or business regularly carried on that is not substantially related to the exempt purpose is subject to UBIT, even for an exempt organization. Exemption does not make unrelated business income tax-free, and the tax does not hinge on distribution or entity type.",
  ref:"IRC §§511–513"
},
{
  id:"cpa-reg-r5-18", source:"REG.R5", diff:"hard",
  q:"Distributable net income (DNI) of a trust or estate primarily serves to:",
  choices:[
    "Determine the total amount of the entity's charitable contribution deduction that is allowed for the year",
    "Limit and characterize the income taxed to the beneficiaries and the entity's distribution deduction",
    "Set the estate tax rate applied to the taxable estate",
    "Measure the reasonable fee payable to the trustee"],
  answer:1,
  explain:"DNI caps the distribution deduction for the trust or estate and the amount taxable to beneficiaries, and it preserves the character of the income passed through. It is not a charitable-deduction, estate-tax-rate, or trustee-fee measure.",
  ref:"IRC §643"
}

]);
