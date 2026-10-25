/* packs/originals/far-f1-batch-10.js — CPA · FAR original question bank (batch 10).
   ============================================================================
   14 original Area F1 (Financial Reporting) items, added to lift F1 toward its
   ~30% blueprint weight. Spread across the four F1 modules:
     F1.M1 Income Statement, F1.M2 Reporting & Disclosures,
     F1.M3 Special Reporting, F1.M4 Statement of Cash Flows.
   Topics extend (do not duplicate) the existing F1 banks.

   Scenarios are original; rules are public U.S. GAAP. Each distractor names a
   specific mistake. Schema matches the ACED engine:
   { id, source, diff, q, choices, answer (0-indexed), explain, ref }.
   ============================================================================ */
window.ACED_QUESTIONS = (window.ACED_QUESTIONS || []).concat([

/* --- F1.M1 Income Statement --- */
{
  id:"cpa-far-f1m1-n01", source:"F1.M1", diff:"medium",
  q:"A company sells a major component that represents a strategic shift in operations. How is the result of that component reported?",
  choices:["As discontinued operations, net of tax, below income from continuing operations","Within income from continuing operations, before tax","As a direct adjustment to retained earnings","In other comprehensive income"],
  answer:0,
  explain:"A disposal representing a strategic shift is reported as discontinued operations, shown net of tax in a separate section below income from continuing operations. It is not buried in continuing operations, charged directly to retained earnings, or placed in OCI.",
  ref:"ASC 205-20 — discontinued operations"
},
{
  id:"cpa-far-f1m1-n02", source:"F1.M1", diff:"medium",
  q:"Net sales were $1,200,000, cost of goods sold $700,000, operating expenses $300,000, interest expense $25,000, and a gain on sale of equipment $15,000. What is operating income?",
  choices:["$215,000","$200,000","$190,000","$500,000"],
  answer:1,
  explain:"Operating income = net sales − COGS − operating expenses = $1,200,000 − $700,000 − $300,000 = $200,000. Interest expense and the gain on sale are non-operating items, so $215,000 (adds the gain) and $190,000 (subtracts interest) are wrong; $500,000 is gross profit.",
  ref:"ASC 225 — multi-step income statement"
},
{
  id:"cpa-far-f1m1-n03", source:"F1.M1", diff:"easy",
  q:"Under current U.S. GAAP, how are extraordinary items presented?",
  choices:["Net of tax, immediately below discontinued operations","Gross, within continuing operations","The separate extraordinary-item classification has been eliminated","As a component of other comprehensive income"],
  answer:2,
  explain:"The concept of separately reported extraordinary items was eliminated; unusual or infrequent items are now shown within continuing operations (and may be disclosed separately) but never as a distinct 'extraordinary' caption net of tax.",
  ref:"ASU 2015-01 — extraordinary items"
},

/* --- F1.M2 Reporting & Disclosures --- */
{
  id:"cpa-far-f1m2-n01", source:"F1.M2", diff:"medium",
  q:"In interim financial reporting, income tax expense for an interim period is generally computed using:",
  choices:["The statutory federal tax rate applied to interim income","The estimated annual effective tax rate","The prior year's actual effective tax rate","Only the taxes actually paid during the interim period"],
  answer:1,
  explain:"Interim reporting treats each interim period as an integral part of the annual period, so tax expense is based on the estimated annual effective tax rate applied to year-to-date income. The statutory rate, the prior-year rate, and cash taxes paid are not the basis.",
  ref:"ASC 270 — interim income taxes"
},
{
  id:"cpa-far-f1m2-n02", source:"F1.M2", diff:"hard",
  q:"Management's evaluation of whether there is substantial doubt about the entity's ability to continue as a going concern covers a period of:",
  choices:["One year from the balance sheet date","Ninety days from the balance sheet date","One year from the date the financial statements are issued (or available to be issued)","The foreseeable future, with no defined time horizon"],
  answer:2,
  explain:"Under ASC 205-40, management evaluates conditions for one year after the date the financial statements are issued (or available to be issued). 'One year from the balance sheet date' is the common trap; 90 days and an undefined horizon are incorrect.",
  ref:"ASC 205-40 — going concern"
},
{
  id:"cpa-far-f1m2-n03", source:"F1.M2", diff:"medium",
  q:"Which subsequent event requires ADJUSTMENT of the financial statements rather than only disclosure?",
  choices:["A fire that destroys a warehouse after year-end","Settlement of litigation for a condition that existed at the balance sheet date","Issuance of common stock after year-end","A business combination completed after year-end"],
  answer:1,
  explain:"A recognized (Type 1) subsequent event provides evidence about conditions that existed at the balance sheet date — such as settling litigation that arose before year-end — and requires adjustment. The fire, stock issuance, and business combination arose after year-end (Type 2) and are only disclosed.",
  ref:"ASC 855 — subsequent events"
},
{
  id:"cpa-far-f1m2-n04", source:"F1.M2", diff:"medium",
  q:"Regarding related-party transactions, U.S. GAAP requires disclosure of:",
  choices:["Nothing, if the transactions occurred at arm's length","Only transactions that are material to net income","Only related-party balances of public companies","The nature of the relationship, a description of the transactions, and the dollar amounts"],
  answer:3,
  explain:"Related-party disclosures include the nature of the relationship, a description of the transactions, the dollar amounts, and amounts due to/from related parties. Disclosure is required even when terms appear to be arm's length, and it is not limited to public companies.",
  ref:"ASC 850 — related party disclosures"
},

/* --- F1.M3 Special Reporting --- */
{
  id:"cpa-far-f1m3-n01", source:"F1.M3", diff:"hard",
  q:"In a nonmonetary exchange that HAS commercial substance, the asset received is recorded at:",
  choices:["The book value of the asset given up, with no gain recognized","The fair value given up, with any gain or loss recognized in full","The book value given up plus any cash paid, deferring the gain","The lower of fair value or book value"],
  answer:1,
  explain:"When an exchange has commercial substance, it is accounted for at fair value and the entire gain or loss is recognized. Recording at book value with no gain applies when the exchange LACKS commercial substance (gain is generally deferred unless boot is received).",
  ref:"ASC 845 — nonmonetary exchanges"
},
{
  id:"cpa-far-f1m3-n02", source:"F1.M3", diff:"medium",
  q:"Financial statements a company prepares on its income-tax basis are an example of:",
  choices:["U.S. GAAP financial statements","A special purpose framework (an other comprehensive basis of accounting)","International Financial Reporting Standards","The modified accrual basis"],
  answer:1,
  explain:"Income-tax-basis statements are prepared under a special purpose framework (often called an other comprehensive basis of accounting, OCBOA), not U.S. GAAP or IFRS. Modified accrual is a governmental-fund basis.",
  ref:"Special purpose frameworks (OCBOA)"
},
{
  id:"cpa-far-f1m3-n03", source:"F1.M3", diff:"hard",
  q:"A change in the reporting entity, such as presenting consolidated statements in place of statements of individual companies, is reported:",
  choices:["Prospectively, in the current and future periods only","Retrospectively, by restating all prior periods presented","As a prior-period adjustment to beginning retained earnings only","As a cumulative-effect adjustment in current-period income"],
  answer:1,
  explain:"A change in reporting entity is applied retrospectively: all prior periods presented are restated as if the new entity had always existed. Prospective treatment is for changes in estimate; a cumulative-effect-in-income approach is not used for entity changes.",
  ref:"ASC 250 — change in reporting entity"
},

/* --- F1.M4 Statement of Cash Flows --- */
{
  id:"cpa-far-f1m4-n01", source:"F1.M4", diff:"hard",
  q:"Net income is $300,000. Depreciation is $40,000; accounts receivable increased $20,000; inventory decreased $15,000; and accounts payable increased $10,000. Using the indirect method, what is net cash provided by operating activities?",
  choices:["$300,000","$305,000","$345,000","$385,000"],
  answer:2,
  explain:"Start with net income $300,000; add back depreciation $40,000; subtract the $20,000 AR increase; add the $15,000 inventory decrease; add the $10,000 AP increase = $345,000. $300,000 ignores the adjustments; $305,000 reverses signs; $385,000 mis-signs the AR change.",
  ref:"ASC 230 — indirect method"
},
{
  id:"cpa-far-f1m4-n02", source:"F1.M4", diff:"easy",
  q:"Proceeds from the sale of equipment are reported in the statement of cash flows as a cash flow from:",
  choices:["Operating activities","Financing activities","Investing activities","A noncash transaction disclosed separately"],
  answer:2,
  explain:"Buying and selling productive (long-lived) assets are investing activities, so proceeds from selling equipment are an investing inflow. Operating relates to the entity's core revenue activities; financing relates to debt and equity.",
  ref:"ASC 230 — investing activities"
},
{
  id:"cpa-far-f1m4-n03", source:"F1.M4", diff:"medium",
  q:"Under U.S. GAAP, cash interest and dividends RECEIVED are classified in the statement of cash flows as:",
  choices:["Operating activities","Investing activities","Financing activities","Either operating or investing, at the entity's option"],
  answer:0,
  explain:"Under U.S. GAAP, interest received, dividends received, and interest paid are all operating activities; only dividends PAID are financing. (IFRS, by contrast, allows more classification choice.)",
  ref:"ASC 230 — interest and dividends received"
},
{
  id:"cpa-far-f1m4-n04", source:"F1.M4", diff:"medium",
  q:"During the year a company issued common stock for $100,000, paid dividends of $30,000, borrowed $50,000 on a note, and repaid $20,000 of note principal. What is net cash provided by financing activities?",
  choices:["$130,000","$100,000","$70,000","$200,000"],
  answer:1,
  explain:"Financing cash flows = stock issued $100,000 − dividends paid $30,000 + borrowings $50,000 − principal repaid $20,000 = $100,000. $130,000 omits the dividend payment; $70,000 omits the new borrowing; $200,000 ignores both outflows.",
  ref:"ASC 230 — financing activities"
}

]);
