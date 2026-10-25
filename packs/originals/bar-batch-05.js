/* packs/originals/bar-batch-05.js — CPA · BAR original question bank (batch 05).
   ============================================================================
   18 original Area II (Technical Accounting & Reporting) items, written to
   deepen every B2 module and pull Area II toward its ~44% blueprint weight.
   Topics extend (do not duplicate) batches 01-02: bargain purchase, NCI income
   attribution, indefinite-lived & internally generated intangibles, RSUs and
   forfeitures, speculative & net-investment hedges, principal-vs-agent, over-
   time revenue & significant financing, lessor operating/direct-financing
   leases, FX transaction gain/loss & functional-currency tests, and segment
   management-approach / major-customer / entity-wide disclosures.

   Scenarios, names, and numbers are original; the underlying rules are public
   GAAP/AICPA-blueprint facts. Each distractor names a specific mistake. Schema
   matches the ACED engine: { id, source, diff, q, choices, answer (0-indexed),
   explain, ref }.
   ============================================================================ */
window.ACED_QUESTIONS = (window.ACED_QUESTIONS || []).concat([

/* --- B2.M1 Business Combinations & Consolidations --- */
{
  id:"cpa-bar-b2m1-05", source:"B2.M1", diff:"hard",
  q:"Vantage Co. acquires 100% of Reed Co. for $480,000 cash when the fair value of Reed's identifiable net assets is $520,000. How is the $40,000 excess accounted for?",
  choices:["Recognize a $40,000 bargain purchase gain in earnings","Capitalize $40,000 as goodwill","Record $40,000 as a deferred credit and amortize it","Reduce the acquired noncurrent assets by $40,000 pro rata"],
  answer:0,
  explain:"When consideration ($480,000) is less than the fair value of identifiable net assets ($520,000), the $40,000 excess is a bargain purchase gain recognized in earnings on the acquisition date. U.S. GAAP no longer records 'negative goodwill' as a deferred credit or a pro-rata asset reduction; goodwill arises only when price exceeds net assets.",
  ref:"Business combinations — bargain purchase"
},
{
  id:"cpa-bar-b2m1-06", source:"B2.M1", diff:"medium",
  q:"Parent owns 80% of Sub. Sub reports net income of $200,000 with no intercompany transactions. In the consolidated statements, how much of Sub's income is attributed to the noncontrolling interest?",
  choices:["$200,000","$40,000","$160,000","$0"],
  answer:1,
  explain:"NCI's share of subsidiary income = NCI % × subsidiary net income = 20% × $200,000 = $40,000. Consolidated net income includes 100% of the sub's income, then allocates $40,000 to the NCI and $160,000 to the parent. $160,000 is the parent's share; $0 wrongly gives the NCI nothing.",
  ref:"Consolidations — income attributable to NCI"
},

/* --- B2.M2 Intangibles, Goodwill & Impairment --- */
{
  id:"cpa-bar-b2m2-04", source:"B2.M2", diff:"medium",
  q:"An indefinite-lived trademark has a carrying amount of $300,000 and a fair value of $260,000. What impairment loss is recognized?",
  choices:["$0 — indefinite-lived intangibles are never written down for impairment","$300,000","$40,000","$260,000"],
  answer:2,
  explain:"An indefinite-lived intangible other than goodwill is tested by comparing carrying amount to fair value; impairment = $300,000 − $260,000 = $40,000. Such intangibles are not amortized, but they ARE tested for impairment, so $0 is wrong; $300,000 and $260,000 confuse the carrying and fair values with the loss itself.",
  ref:"Intangibles — indefinite-lived impairment"
},
{
  id:"cpa-bar-b2m2-05", source:"B2.M2", diff:"medium",
  q:"Under U.S. GAAP, which of the following is capitalized as an intangible asset rather than expensed?",
  choices:["Internally generated goodwill","Internal research and development costs","Internally developed brand and customer lists","A patent purchased from a third party"],
  answer:3,
  explain:"Only acquired/purchased intangibles, such as a patent bought from a third party, are capitalized. Internally generated goodwill, internal R&D, and internally developed brands are expensed as incurred under U.S. GAAP because their future benefit is too uncertain to recognize as an asset.",
  ref:"Intangibles — internally generated vs. purchased"
},

/* --- B2.M3 Share-Based Compensation --- */
{
  id:"cpa-bar-b2m3-04", source:"B2.M3", diff:"medium",
  q:"On January 1, Wexford Co. grants 5,000 restricted stock units when its stock's fair value is $20 per share; the units vest over 4 years. What is the first-year compensation expense?",
  choices:["$25,000","$100,000","$5,000","$20,000"],
  answer:0,
  explain:"RSU compensation = number of units × grant-date fair value of the stock = 5,000 × $20 = $100,000, recognized straight-line over the 4-year vesting period = $25,000 per year. $100,000 expenses the whole award immediately; the other options misuse the unit count or the vesting period.",
  ref:"Share-based comp — restricted stock units"
},
{
  id:"cpa-bar-b2m3-05", source:"B2.M3", diff:"hard",
  q:"A company grants options with a total grant-date fair value of $400,000 that vest over 4 years, and it estimates that 10% of the awards will be forfeited. Using estimated forfeitures, what is the annual compensation expense?",
  choices:["$100,000","$90,000","$40,000","$360,000"],
  answer:1,
  explain:"When forfeitures are estimated, compensation is based on awards expected to vest: $400,000 × (1 − 10%) = $360,000, recognized over 4 years = $90,000 per year. $100,000 ignores forfeitures ($400,000 / 4); $360,000 is the full expected cost, not the annual amount; $40,000 misapplies the rate.",
  ref:"Share-based comp — estimated forfeitures"
},

/* --- B2.M4 Derivatives & Hedge Accounting --- */
{
  id:"cpa-bar-b2m4-04", source:"B2.M4", diff:"medium",
  q:"A company holds a derivative that is NOT designated as a hedge (it is held for speculation). How are changes in the derivative's fair value reported?",
  choices:["In other comprehensive income until the contract settles","Deferred and presented as a contra-asset","In current earnings","Not recognized until the gain or loss is realized"],
  answer:2,
  explain:"A derivative that is not designated as a hedge is carried at fair value with changes recognized immediately in current earnings. OCI treatment applies only to the effective portion of a cash flow (or net investment) hedge, and derivatives are always recognized at fair value — never deferred until realized.",
  ref:"Derivatives — speculative (undesignated) derivative"
},
{
  id:"cpa-bar-b2m4-05", source:"B2.M4", diff:"hard",
  q:"The effective portion of a gain on a derivative designated as a hedge of a net investment in a foreign operation is reported in:",
  choices:["Current earnings as a realized gain","Retained earnings as a prior-period adjustment that bypasses income","A deferred asset until the operation is sold","Other comprehensive income, within the cumulative translation adjustment"],
  answer:3,
  explain:"The effective portion of a net investment hedge is reported in OCI within the cumulative translation adjustment, where it offsets translation effects until the foreign operation is disposed of. Current-earnings treatment would apply only to the ineffective portion or to a fair value hedge.",
  ref:"Hedge accounting — net investment hedge"
},

/* --- B2.M5 Revenue Recognition (Advanced) --- */
{
  id:"cpa-bar-b2m5-04", source:"B2.M5", diff:"medium",
  q:"A company arranges for a third party to provide a service to its customer and never controls that service before it is transferred. How should the company recognize revenue?",
  choices:["Net — only the fee or commission it retains","Gross — the entire amount billed to the customer","It cannot recognize revenue because it is not the provider","Gross, presenting the third party's cost as cost of sales"],
  answer:0,
  explain:"An entity that does not control the good or service before transfer is an agent and recognizes revenue net — only the fee or commission it keeps. A principal (which controls the good/service first) reports gross. Because this entity is an agent, gross presentation would overstate its revenue.",
  ref:"ASC 606 — principal vs. agent"
},
{
  id:"cpa-bar-b2m5-05", source:"B2.M5", diff:"hard",
  q:"Under ASC 606, a performance obligation is satisfied OVER TIME (rather than at a point in time) when which condition is met?",
  choices:["The customer has paid a large nonrefundable upfront deposit","The asset created has no alternative use to the entity and the entity has an enforceable right to payment for work completed to date","The contract term extends across more than one fiscal reporting period","Legal title to the finished goods has passed to the customer"],
  answer:1,
  explain:"One of the three over-time criteria is that the asset has no alternative use to the entity AND the entity has an enforceable right to payment for performance completed to date. A long contract term, an upfront deposit, or transfer of title do not by themselves trigger over-time recognition.",
  ref:"ASC 606 — over-time recognition criteria"
},
{
  id:"cpa-bar-b2m5-06", source:"B2.M5", diff:"hard",
  q:"A contract lets the customer pay two years after the goods are delivered, and the delayed timing provides the customer a significant financing benefit. How does this affect revenue?",
  choices:["Recognize the full contract amount as revenue at delivery","Recognize revenue only as the customer remits cash over the two years","Recognize revenue at the cash selling price and account for interest separately over the financing period","Treat the financing difference as a reduction of cost of sales"],
  answer:2,
  explain:"With a significant financing component, the entity recognizes revenue at the cash selling price (the amount reflecting payment at the time of transfer) and accounts for the financing as interest income separately over the payment period. Recognizing the full nominal amount at delivery ignores the time value of money.",
  ref:"ASC 606 — significant financing component"
},

/* --- B2.M6 Leases (Lessor / Advanced) --- */
{
  id:"cpa-bar-b2m6-04", source:"B2.M6", diff:"medium",
  q:"A lessor classifies a lease as an operating lease. How does it account for the underlying asset and the lease income?",
  choices:["Derecognize the asset and record a net investment in the lease","Recognize selling profit on the asset at lease commencement","Record a lease receivable and recognize interest income over the term","Keep and depreciate the asset, and recognize lease income on a straight-line basis"],
  answer:3,
  explain:"In an operating lease, the lessor keeps the underlying asset on its books and continues to depreciate it, recognizing lease income straight-line over the term. Derecognizing the asset, recording a net investment, and recognizing selling profit are features of sales-type or direct financing (finance) leases.",
  ref:"Lessor accounting — operating lease"
},
{
  id:"cpa-bar-b2m6-05", source:"B2.M6", diff:"medium",
  q:"A lessor's direct financing lease has a net investment of $100,000 and an implicit interest rate of 8%. What finance (interest) income does the lessor recognize in the first year?",
  choices:["$8,000","$100,000","$0","$12,500"],
  answer:0,
  explain:"A lessor recognizes finance income equal to the implicit rate times the net investment in the lease = 8% × $100,000 = $8,000 in the first year. $0 wrongly treats it like an operating lease; $100,000 is the principal balance; $12,500 inverts the rate.",
  ref:"Lessor accounting — direct financing interest income"
},

/* --- B2.M7 Foreign Currency --- */
{
  id:"cpa-bar-b2m7-05", source:"B2.M7", diff:"hard",
  q:"A U.S. company sells goods for €100,000 when the spot rate is $1.10/€. At the balance sheet date, before collection, the spot rate is $1.15/€. What foreign-currency transaction gain or loss is recognized?",
  choices:["$5,000 loss","$5,000 gain","$15,000 gain","$0 — no adjustment is made until the receivable is collected"],
  answer:1,
  explain:"A foreign-currency receivable is remeasured at the current spot rate each balance sheet date. €100,000 × $1.10 = $110,000 initially; at $1.15 it is $115,000, a $5,000 transaction gain (the dollar value of the receivable rose). It is not deferred to collection; $15,000 misuses the rate; the result is a gain, not a loss.",
  ref:"Foreign currency — transaction gain/loss"
},
{
  id:"cpa-bar-b2m7-06", source:"B2.M7", diff:"medium",
  q:"Which factor most indicates that a foreign subsidiary's functional currency is its LOCAL currency rather than the U.S. dollar?",
  choices:["Its financing comes mainly from the U.S. parent and is denominated in dollars","Most of its sales are made to the U.S. parent and are priced and settled in dollars","Its day-to-day sales, costs, and cash flows are primarily denominated in the local currency","It routinely remits most of its cash flows to the U.S. parent"],
  answer:2,
  explain:"The functional currency is that of the primary economic environment in which the entity operates. When sales prices, labor, materials, and cash flows are primarily in the local currency and the operation is self-contained, the local currency is functional (translation method). Dollar-based financing and sales to the parent instead point toward the dollar as functional (remeasurement).",
  ref:"Foreign currency — functional currency determination"
},

/* --- B2.M8 Segment Reporting & Public-Company Disclosures --- */
{
  id:"cpa-bar-b2m8-04", source:"B2.M8", diff:"medium",
  q:"Under ASC 280, an entity must disclose the existence of a major customer when revenue from that single external customer is at least what percentage of total revenue?",
  choices:["1%","5%","25%","10%"],
  answer:3,
  explain:"If revenue from a single external customer is 10% or more of total revenue, the entity discloses that fact, the amount of revenue, and the segment(s) reporting it (the customer's identity need not be revealed). 1%, 5%, and 25% are not the threshold.",
  ref:"Segment reporting — major customer disclosure"
},
{
  id:"cpa-bar-b2m8-05", source:"B2.M8", diff:"medium",
  q:"Under ASC 280, how does an entity identify its operating segments?",
  choices:["By how the chief operating decision maker reviews results to allocate resources and assess performance","By the legal-entity structure used in preparing the consolidated financial statements","By assigning each product to a standard industry classification code","By the geographic country in which each unit is incorporated"],
  answer:0,
  explain:"ASC 280 uses the management approach: operating segments are the components whose discrete financial results are regularly reviewed by the chief operating decision maker to allocate resources and assess performance. Legal structure, industry codes, and country of incorporation do not define operating segments.",
  ref:"Segment reporting — management approach / CODM"
},
{
  id:"cpa-bar-b2m8-06", source:"B2.M8", diff:"medium",
  q:"Even an entity with only a single reportable segment must provide certain entity-wide disclosures. These include:",
  choices:["A separate statement of cash flows for each product line","Revenues and long-lived assets split between domestic and foreign operations","A complete balance sheet for each major product group","Earnings per share computed separately for each segment"],
  answer:1,
  explain:"Entity-wide disclosures, required even with one segment, include revenues and long-lived assets attributed to the domestic country versus all foreign countries, information about products and services, and major customers. Per-product cash flow statements, per-product balance sheets, and per-segment EPS are not required.",
  ref:"Segment reporting — entity-wide disclosures"
}

]);
