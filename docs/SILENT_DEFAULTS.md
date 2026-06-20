# SILENT_DEFAULTS.md — Single-Page Reference of FAR Silent Assumption Signals

**Purpose.** When a FAR question stem is silent on a controlling fact, an unstated default applies. This page is the consolidated **Rule / Context / Logic** reference, derived from §14 of `STYLE_REFERENCE_FAR.md`. It is built to be loaded directly into an AI evaluator's system prompt or used as an authoring checklist so no subtle default-assumption rule slips through.

- **Rule** — the default the candidate is expected to apply when the stem is silent.
- **Context** — the specific stem signal (or absence of a signal) that triggers the rule.
- **Logic** — the underlying GAAP/IFRS basis and how the trap is typically constructed.

**How to use this file**
1. **As an authoring checklist.** Before publishing any MCQ/TBS, walk the table; for every rule whose topic appears in your stem, confirm you either (a) state the controlling fact explicitly, or (b) intend the default to apply and embed it in the correct answer.
2. **As an AI-evaluator source.** Concatenate this file (or the JSON sibling at `SILENT_DEFAULTS.json`) into an evaluator's grading prompt. The evaluator should treat a candidate answer as correct only if it is consistent with the listed rule **for the matching context**.
3. **As a distractor generator.** Every "Rule" has at least one obvious wrong sibling (e.g., cumulative vs noncumulative). The §14.18 weaponization patterns apply: flip the rule, and the resulting answer is a textbook trap distractor.

---

## A. The Three User-Flagged Rules (Top Priority)

These were called out explicitly as "missing" from an earlier pattern pass. They lead the table.

| # | Rule | Context | Logic |
|---|---|---|---|
| **A1** | **Preferred stock is noncumulative** | Stem describes preferred stock (e.g., "6% preferred stock") and does **not** include the word "cumulative" anywhere. | Default classification is noncumulative. Dividends in arrears do **not** carry forward; unpaid dividends are lost. Bites EPS numerator (skip subtracting undeclared preferred dividends), dividend-allocation between common and preferred, and retained-earnings appropriation problems. Wrong-answer pull: candidate subtracts dividends in arrears as if cumulative. |
| **A2** | **Treasury stock uses the cost method** | Stem describes a treasury stock reacquisition or reissuance and does **not** name "par value method" or "constructive retirement method." | Cost method records T/S at acquisition cost as a contra-equity account. On reissuance: difference goes to **APIC–Treasury** first, then to retained earnings if APIC–T/S is exhausted (never to gain/loss in net income). Wrong-answer pull: candidate books a gain or loss to the income statement, or splits between common stock and APIC as if par-value method. |
| **A3** | **Lease discount rate = implicit rate if known; IBR only when implicit not determinable** | Lessee lease problem. The stem gives an implicit rate (or enough data to compute it) **and** an IBR. | The lessee discount-rate hierarchy under ASC 842 is: **(1) rate implicit in the lease** if readily determinable → **(2) incremental borrowing rate** → **(3) risk-free rate election** (private companies only). The IBR is a fallback, not a choice. Lessors always use the implicit rate. Wrong-answer pull: candidate uses IBR despite the implicit rate being provided, inflating/deflating the lease liability. |

---

## B. Consolidated Rule / Context / Logic Table (All §14 Defaults)

Sourced 1:1 from §14 of `STYLE_REFERENCE_FAR.md`. Section column is the upstream §14.X tag for traceability.

### B.1 Stockholders' Equity (§14.1)

| Rule | Context | Logic |
|---|---|---|
| Preferred stock → **noncumulative** | "X% preferred stock" with no "cumulative" qualifier | Dividends in arrears do not carry forward. Drives EPS numerator and dividend-allocation problems. *(See A1.)* |
| Preferred stock → **nonparticipating** | Preferred stock named without "participating" | Preferred takes its stated rate only; common gets the residual. Drives two-class dividend allocations. |
| Preferred stock → **nonconvertible** | Preferred stock named without "convertible" | No diluted-EPS impact. If treated as convertible, candidate wrongly adds shares to diluted denominator. |
| Treasury stock → **cost method** | T/S reissuance/reacquisition without "par value method" stated | Cost method, contra-equity at acquisition cost; reissue differences hit APIC–T/S, then RE — never NI. *(See A2.)* |
| **Small stock dividend** (<20–25%) → **at fair value**; **large stock dividend** (≥25%) → **at par** | "Stock dividend" with no size-based treatment specified | Determines how much RE is reduced. Small dividends are treated as quasi-cash distributions (FV); large dividends are treated more like splits (par). |
| **Stock split** → no journal entry; memo entry only; par value reduced proportionally | "2-for-1 stock split" with no other accounting instructions | EPS denominators are restated retrospectively for **all** periods presented. |
| **Property dividend** → fair value at declaration; gain/loss on remeasurement | Non-cash dividend with no other valuation specified | Recognize gain/loss in NI for difference between FV and book value of the distributed property. |
| **Liquidating dividend** → reduces APIC first, then other contributed capital | Dividend exceeds available retained earnings | Does **not** touch retained earnings further once RE is exhausted. |
| Dividend recognition → **declaration date** creates liability | "Board declared a dividend on …" with multiple dates given | Record date is informational only; payment date settles cash. Cutoff questions hinge on this. |

### B.2 EPS (§14.2)

| Rule | Context | Logic |
|---|---|---|
| **Weighted-average shares** = time-weight by months outstanding | EPS denominator with mid-year share issuance/repurchase | Standard denominator construction; weights are fractions of the year. |
| Stock splits / stock dividends → **retroactive to earliest period presented** | EPS computation crossing periods | Comparative EPS must be restated as if the split happened at the beginning of the earliest period. |
| **Cumulative preferred dividend** → subtract from numerator **whether declared or not** | Cumulative preferred mentioned (note: cumulative is **not** the silent default — see A1) | NI available to common is reduced annually for cumulative preferred even without declaration. |
| **Noncumulative preferred dividend** → subtract from numerator **only if declared** | Silent default per A1; or noncumulative explicitly stated | If not declared, no numerator reduction. |
| Convertible debt → **if-converted** method | Diluted EPS with convertible debt | Add interest (net of tax) back to numerator; add converted shares to denominator. Test for dilution. |
| Options/warrants → **treasury stock** method, included only if **average market > exercise** | Diluted EPS with options outstanding | Out-of-the-money options are antidilutive — exclude. |
| Antidilutive securities → **exclude** | Any potentially dilutive security with antidilutive effect | Always test each convertible/option **individually** for dilution. |
| **Basic only** if simple capital structure; **basic and diluted** if complex | EPS presentation question | Triggers diluted-EPS disclosure requirements. |

### B.3 Leases — ASC 842 (§14.3)

| Rule | Context | Logic |
|---|---|---|
| Lessee discount rate → **implicit rate → IBR → risk-free** (private only) | Lessee lease initial measurement | Hierarchy not a choice. Lessor always uses implicit. *(See A3.)* |
| Lease term = noncancelable + options **reasonably certain** to exercise + termination penalties reasonably certain to incur | Lease with renewal/termination options | Determines 12-month threshold and liability size. |
| Classification → default **operating** unless **any one** of five finance-lease criteria met | Lessee classification | Five criteria: ownership transfer, BPO, term ≥75% useful life, PV ≥90% FV, asset specialized to lessee. |
| **Short-term lease (≤12 months, no BPO)** → may elect to expense straight-line | Short lease named without ROU/liability instruction | Off-balance-sheet election. |
| **Initial direct costs** → capitalize into ROU | ROU initial measurement | Increase the ROU above the lease liability. |
| **Variable lease payments** → only index/rate-based payments are in initial liability (using rate at commencement); truly variable → expense | Variable payment clauses in the lease | Truly variable (e.g., % of sales) never enter the liability. |
| **Lease incentives received** → reduce ROU | Lessor pays/credits lessee at inception | Reduces the recorded ROU, not the lease liability. |

### B.4 Bonds & Long-Term Debt (§14.4)

| Rule | Context | Logic |
|---|---|---|
| Amortization → **effective interest method** | Bond discount/premium amortization without method specified | Straight-line allowed only if not materially different. Default to effective interest. |
| Interest payments → **semi-annual** | "10%, 10-year bond" with no payment frequency | Use semi-annual rate and 2× periods in PV computations. |
| Bond issued between interest dates → buyer pays accrued interest at issue, receives back at next interest date | Bond issued mid-period | Carrying amount at issuance excludes the accrued interest portion. |
| **Imputed interest** at market rate | Note has no stated rate or unreasonably low rate | Exception: short-term trade receivables/payables (≤12 months) and customary trade transactions are not imputed. |
| Bond with **detachable warrants** → allocate proceeds by **relative fair value** | Bond + detachable warrants issued together | Bond carrying amount = total proceeds × (bond FV ÷ combined FV). |
| Bond with **nondetachable conversion feature** → **all proceeds to bond** (post-ASU 2020-06) | Convertible bond with conversion feature embedded | No separate equity component under US GAAP for vanilla convertibles. |
| Early extinguishment → gain/loss in **net income, continuing operations** | Bond reacquired before maturity | Not OCI, not extraordinary. |

### B.5 Inventory (§14.5)

| Rule | Context | Logic |
|---|---|---|
| Cost flow method → **must be stated** (no default) | FIFO/LIFO/weighted-average/specific ID computation | If two methods are mentioned, the question tests which applies. |
| Inventory system → **must be stated** (no default) | Periodic vs perpetual not specified | Periodic counts only at period end; perpetual updates every transaction. LIFO can differ between systems. |
| **LCNRV** for FIFO and weighted-average | Year-end inventory write-down with non-LIFO method | Compare cost to NRV (selling price − costs to complete and sell). |
| **LCM** only for LIFO and retail method | Year-end inventory write-down with LIFO/retail | Market = middle of (ceiling = NRV, floor = NRV − normal profit, replacement cost). |
| **FOB shipping point** → title at seller's dock; in-transit is **buyer's** | Year-end inventory cutoff with shipping terms | Owns the goods on the truck at year-end. |
| **FOB destination** → title at buyer's dock; in-transit is **seller's** | Year-end inventory cutoff with shipping terms | Goods en route belong to the seller. |
| Consignment → inventory stays on **consignor's** books | "Consignment" anywhere in stem | Until consignee sells to end customer. |
| Sale on right of return → revenue net of expected returns; refund liability + return asset | Customer can return product | Both sides recognized at sale. |
| Inventory write-down reversal → **US GAAP: no reversal**; **IFRS: reversal allowed up to original cost** | NRV recovers after a write-down | Under IFRS only the original cost ceiling applies. |

### B.6 Investments (§14.6)

| Rule | Context | Logic |
|---|---|---|
| **≤20% ownership, no significant influence** → **FVTNI** for equity securities | Equity investment with low ownership | Post-ASU 2016-01. No more AFS-for-equity. |
| **20–50% ownership** → **equity method (presumed significant influence)** | Investment in voting common in this range | Presumption rebuttable but is the default. Investee dividends reduce the investment account, not income. |
| **>50% ownership** → **consolidation** | Majority voting interest | No election; control mandates consolidation. |
| Debt security classification → **must be stated** | Debt security held with no classification given | Trading → FVTNI. AFS → FV through OCI. HTM → amortized cost. |
| Equity securities (post-ASU 2016-01) → **all FVTNI** unless equity method or consolidated | Equity holding outside equity-method/consolidation | All unrealized gains/losses to NI. |
| Crypto assets (post-ASU 2023-08) → **FVTNI**, presented separately on B/S | Bitcoin/other crypto holdings | Separate balance-sheet line; periodic remeasurement to NI. |
| Stock split received → **no entry**; cost allocated over new total shares | Investor receives a split from investee | Per-share basis recalculated; total cost unchanged. |
| Equity-method dividend received → **reduce investment**, **not income** | Investee declares cash dividend | Income recognized as investee earns. |

### B.7 Income Taxes (§14.7)

| Rule | Context | Logic |
|---|---|---|
| DTA/DTL measurement → **enacted future tax rate** | Future temporary-difference reversal | Not the current-period rate. Re-measure DTAs/DTLs when rates change. |
| **Valuation allowance** when **more likely than not (>50%)** that DTA won't realize | DTA carried with uncertain future income | Reduce DTA, increase tax expense. |
| **Permanent differences** → no DTA/DTL | Municipal interest, life-insurance proceeds, fines, 50% meals add-back | Differences never reverse. |
| **Temporary differences** → DTA or DTL | Depreciation timing, warranty accruals, unearned revenue, NOLs | Reverse in future periods. |
| Post-TCJA NOL → **carry forward indefinitely; no carryback**; 80% limitation | Stem mentions NOL after 2017 | DTA created; usage capped at 80% of future taxable income. |
| Uncertain tax position → recognize benefit if **MLTN to be sustained**; measure at largest amount **>50% likely** | UTP language in stem | Two-step recognize-then-measure. |
| **Intraperiod tax allocation** required | Continuing ops, discontinued, OCI, direct-to-equity items in same period | Allocate tax effects to each component. |

### B.8 Revenue Recognition — ASC 606 (§14.8)

| Rule | Context | Logic |
|---|---|---|
| Contract must have: approval, identifiable rights, identifiable payment terms, commercial substance, **probable collection** | "Customer signed an arrangement to…" | If any criterion fails, no contract → no revenue. |
| Performance obligation → separately identifiable + **distinct** | Bundled deliverables | Default to assess separately unless not distinct in context of the contract. |
| Variable consideration → **expected value or most likely amount**, constrained to amount **highly probable not to reverse** | Discounts, rebates, performance bonuses | Constraint is the trap — candidate often forgets to constrain. |
| Significant financing component → adjust if payment ≥1 year apart from delivery | Payment terms straddle a year boundary | Practical expedient: ignore if <1 year. |
| Allocation → **relative standalone selling price** | Multiple POs with bundled price | If SSP not observable, estimate (adjusted market, expected-cost-plus-margin, residual). |
| Recognition timing → **point-in-time** by default | Sale of goods with no over-time criterion met | Three over-time criteria: simultaneous receive/consume; customer-controlled asset; no alternative use + enforceable right to payment. |
| Bill-and-hold → recognize only if substantive reason, identified, ready to transfer, seller cannot use | "Customer asked seller to hold until…" | Strict 4-part test. |
| Consignment → **no revenue at consignment**; recognize when consignee sells | Goods shipped to consignee | Consignor still owns and still doesn't have revenue. |
| Principal vs agent → **control before transfer** = principal (gross); arranges = agent (net) | Two-party fulfillment | Determines gross vs net revenue. |
| Right of return → revenue net of expected returns; refund liability + return asset | Return policy explicit or implicit | Net revenue presentation. |
| Sales taxes collected → **net** (excluded from transaction price) | Stem includes sales tax line | Sales tax never goes to revenue. |

### B.9 Contingencies (§14.9)

| Rule | Context | Logic |
|---|---|---|
| Loss contingency **probable + estimable** → **accrue + disclose** | Lawsuit, warranty, environmental obligation | Debit loss, credit liability. |
| Loss contingency **probable + range, no point estimate better** → accrue **low end** (US GAAP); **midpoint** (IFRS) | Range given without a most-likely point | Disclose the range. |
| Loss contingency **reasonably possible** → **disclose only** | Below probable but more than remote | No accrual. |
| Loss contingency **remote** → **ignore** | Negligible probability | Exception: guarantees always disclose. |
| Gain contingency → **never accrue**; disclose if probable | Pending favorable ruling | Conservatism. |
| Warranty → **always accrue at sale** (assurance-type) | Standard product warranty | Service-type warranty is a separate PO, deferred. |

### B.10 PP&E, Intangibles, Impairment (§14.10)

| Rule | Context | Logic |
|---|---|---|
| Depreciation method → **must be stated** (no default) | Annual depreciation computation | Straight-line, units-of-production, declining-balance, SYD. |
| Salvage value → **zero if not stated** | Depreciable base calculation | Stem silence ⇒ assume zero. |
| Useful life → **must be stated** | Annual depreciation | Asset class conventions exist but stem provides the number. |
| Capitalize → cost to acquire and **prepare for intended use**; expense routine maintenance | Initial measurement / repairs | Betterments that extend life are capitalized. |
| Interest capitalization → **self-constructed assets only**, during construction, on average accumulated expenditures, at weighted-average rate | Long-lived construction project with related debt | Capped at actual interest cost incurred. |
| Long-lived asset impairment (US GAAP, held-and-used) → **two-step**: (1) carrying > **undiscounted** future cash flows? (2) if yes, write down to **fair value** | Triggering event for long-lived asset | Two-step is the US-GAAP-only path. |
| Impairment (IFRS) → **one-step**: carrying > **recoverable amount** (greater of FVLCS or VIU) | IFRS context | VIU uses discounted CF. |
| Impairment reversal → **US GAAP no**; **IFRS yes** (except goodwill) | NRV recovers post-impairment | IFRS reversal limited to original carrying amount net of normal depreciation. |
| Goodwill impairment (post-ASU 2017-04) → **one-step**: reporting unit FV < carrying → write down by difference (not below zero) | Goodwill impairment test | Step 2 (implied FV of goodwill) eliminated. |
| Goodwill amortization → **public: no, test annually**; private: may elect 10-year amortization | Public vs private election | Annual qualitative/quantitative test for public. |
| R&D (US GAAP) → **expense as incurred** | Research/development costs | Exceptions: software past technological feasibility, materials/equipment with alternative future use (capitalize and depreciate). |
| R&D (IFRS) → **research expense; development capitalize if 6 criteria met** | IFRS context | 6 criteria from IAS 38. |
| Internal-use software → expense preliminary; **capitalize application development**; expense post-implementation | Internally developed software for own use | Three-stage model. |
| Software for sale → expense to technological feasibility; capitalize through release; amortize **greater of revenue ratio or straight-line** | Software developed for external sale | Different from internal-use rule. |

### B.11 Consolidations (§14.11)

| Rule | Context | Logic |
|---|---|---|
| Business combination → **acquisition method** | Any business combination | Pooling is dead. |
| Goodwill = consideration + FV of NCI + FV of previously held interest − FV of net identifiable assets | Combination with NCI | Full goodwill under US GAAP. |
| NCI (US GAAP) → **fair value** | Acquisition with <100% ownership | IFRS allows election: FV or proportionate share of net assets. |
| Intercompany transactions → **100% eliminated** | Any intercompany activity | Regardless of NCI %. |
| Intercompany inventory profit → eliminate **unrealized** portion (in ending inventory not yet sold downstream) | Parent-sub inventory transfer | Eliminated in proportion to unsold portion. |
| Intercompany fixed-asset gain → eliminate gain; adjust depreciation over remaining life | Intercompany asset transfer | Gain reverses through future depreciation adjustment. |
| Acquisition-related costs → **expense as incurred** | Legal/advisory/diligence fees | Not part of consideration transferred. |
| Contingent consideration → **FV at acquisition**; equity not remeasured; liability/asset remeasured through earnings | Earn-out or contingent payment | Classification at inception controls subsequent treatment. |
| Measurement period → up to **12 months** from acquisition date to finalize provisional amounts | Provisional acquisition-date amounts | Retrospective adjustment within the window. |

### B.12 Statement of Cash Flows (§14.12)

| Rule | Context | Logic |
|---|---|---|
| Method → **indirect** most common; direct allowed (requires indirect reconciliation as supplemental) | SOCF presentation question | Indirect is the standard exam default. |
| Interest paid → **operating** (US GAAP) | Cash interest on debt | IFRS allows operating **or** financing. |
| Interest received → **operating** (US GAAP) | Cash interest income | IFRS allows operating **or** investing. |
| Dividends received → **operating** (US GAAP) | Cash dividends from investees | IFRS allows operating **or** investing. |
| Dividends paid → **financing** (US GAAP) | Cash dividends to owners | IFRS allows operating **or** financing. |
| Income taxes paid → **operating** (always) | Cash taxes | No US GAAP flexibility. |
| Acquisition/sale of PP&E → **investing** | Capex / asset divestiture | Standard classification. |
| Issuance/repurchase of own stock → **financing** | Equity transactions with owners | Standard classification. |
| Issuance/repayment of debt → **financing** | Debt principal flows | Interest goes operating; principal goes financing. |
| Non-cash transactions → **disclose separately** (not in main statement) | Equipment acquired by issuing stock | Schedule of non-cash investing and financing. |

### B.13 Not-for-Profit (§14.13)

| Rule | Context | Logic |
|---|---|---|
| Net asset classes → **without donor restrictions / with donor restrictions** (post-ASU 2016-14) | NFP balance sheet | Old 3-class system is dead. |
| Unconditional pledges → recognize as contribution revenue when **promise is made**, net of estimated uncollectibles | "Donor pledged $X over 5 years" | Revenue immediately, even though cash arrives later. |
| Conditional pledges → **no revenue until conditions substantially met** | Pledge contingent on matching grant, etc. | Barrier must be overcome. |
| Multi-year pledge → present-valued at pledge date; subsequent accretion is **contribution revenue**, not interest income | Multi-year unconditional pledge | Discount unwind classified differently than for-profit interest. |
| Donated services → recognize only if (a) create/enhance nonfinancial asset, **or** (b) require **specialized skills** that would have been purchased | Volunteer attorney, doctor, accountant | Routine volunteer hours are not recognized. |
| Donated materials → **fair value** at donation date | In-kind goods received | Revenue + asset at FV. |
| Collections (art, historical artifacts) → **may elect** to capitalize or not (if exhibition / preserved / proceeds-of-sale policy) | Museum or library context | One of FAR's rare election rules. |
| Endowment income → with donor restrictions unless donor specifies otherwise (UPMIFA default) | Investment return on donor-restricted endowment | Defaults conservatively to restricted. |
| Functional expense classification → **program services and supporting activities** required | NFP expense reporting | All NFPs present functional expenses. |

### B.14 Governmental (§14.14)

| Rule | Context | Logic |
|---|---|---|
| Governmental funds → **current financial resources** measurement focus | Governmental fund (GF, SRF, CPF, DSF, PF) | Drives what's an asset/liability. |
| Proprietary funds & government-wide → **economic resources** | Enterprise, ISF, government-wide | Full accrual. |
| Governmental funds → **modified accrual** basis | Revenue/expenditure timing in GF | Revenues when measurable + available; expenditures when liability incurred. |
| Proprietary & government-wide → **full accrual** | Same | Revenue when earned; expense when incurred. |
| "Available" → collectible within period or **soon enough** after period-end (60 days for property taxes) | Modified-accrual recognition test | Property tax availability is the classic exam fact. |
| Capital assets in governmental funds → **not reported as assets** | GF purchase of equipment | Reported only in government-wide; GF treats it as expenditure. |
| Long-term debt in governmental funds → **not reported as a liability** | GF bond issuance | Issuance is "other financing source"; debt sits in government-wide only. |
| Encumbrances recorded when commitments are made; reverse at year-end if intent is to honor next year | PO issued, goods not yet received | Reserve fund balance. |
| Fund balance categories → **NRCAU** (Nonspendable / Restricted / Committed / Assigned / Unassigned) | GF fund balance display | Five-category hierarchy from most to least constrained. |
| GASB hierarchy → GASB → GASB ITGs / Implementation Guides → AICPA literature cleared by GASB → other accounting literature | Governmental source-not-explicit question | Authority order for governmental accounting. |

### B.15 IFRS vs US GAAP Switch Points (§14.15)

Apply when the stem says "under IFRS" or "the entity prepares financial statements under IFRS." Otherwise US GAAP applies.

| Topic | US GAAP default | IFRS default |
|---|---|---|
| LIFO | Permitted | **Prohibited** |
| Inventory write-down reversal | Not permitted | Permitted (up to original cost) |
| PP&E subsequent measurement | Cost model | Cost **or revaluation** |
| Impairment | Two-step, undiscounted CF first | One-step, recoverable amount |
| Impairment reversal | Prohibited | Permitted (except goodwill) |
| Development costs | Expense | **Capitalize if 6 criteria met** |
| Interest on SOCF | Operating | Operating **or** financing |
| Dividends paid on SOCF | Financing | Operating **or** financing |
| Range of loss contingency | Low end if no amount better | **Midpoint** |
| Convertible debt | Single instrument (post-2020-06) | Split between **liability and equity** |
| Bank overdrafts | Financing | Cash **and** cash equivalents if integral to cash management |
| Extraordinary items | Eliminated (since 2015) | Prohibited |

### B.16 Fair Value Measurement — ASC 820 (§14.16)

| Rule | Context | Logic |
|---|---|---|
| Fair value = **exit price** in an orderly transaction between market participants at measurement date | Any FV measurement | Not entry price, not entity-specific value. |
| Use the **principal market** (greatest volume and activity) | FV when multiple markets exist | Even if a better price exists elsewhere. |
| **Most advantageous market** → only if there is no principal market | No identifiable principal market | Fallback rule. |
| Nonfinancial assets → **highest and best use** from market-participant perspective | Real estate, equipment | Not entity's intended use. |
| Hierarchy → **L1 > L2 > L3**; disclose lowest level of significant input | L1 quoted active prices; L2 observable other; L3 unobservable | Lowest-level significant input drives the disclosed level. |
| **Transaction costs** → **not included** in fair value | Cost of selling/transferring | They affect choice of most advantageous market, not the FV itself. |

### B.17 Other Recurring Silent Defaults (§14.17)

| Rule | Context | Logic |
|---|---|---|
| Reporting period → **calendar year**, annual, comparative with prior year | "Year 1, Year 2, …" with no period dates | Cutoffs default to Dec 31. |
| Functional currency → **US dollars** | Domestic stem with no currency | FX translation assumes USD functional. |
| **Going concern assumed** | Asset valuation question | Disclosure required only when substantial doubt exists. |
| Materiality → **material unless stated immaterial** | Recognition / disclosure question | Defaults to record/disclose. |
| Cash equivalents → **≤3 months to maturity when purchased** | T-bills, money-market funds | A T-bill with 6-month original maturity is not a cash equivalent even if now <3 months. |
| Accrual basis → **assumed for GAAP entities** | Revenue/expense timing | Cash basis is a special-purpose framework. |
| Allowance for doubtful accounts method → **must be stated** | Bad debt expense computation | Percentage-of-sales (I/S) vs aging-of-receivables (B/S). |
| Specific identification → for unique, large-dollar items only | Real estate, custom equipment | Fungible inventory defaults to FIFO/LIFO/WAVG. |
| Bond covenant violation → reclassify as **current** unless lender has waived right to call | Year-end covenant breach | Drives current vs noncurrent classification. |
| Subsequent events **Type 1** (recognized) → conditions existed at B/S date → **adjust** | Settlement of pre-existing lawsuit before issuance | Adjust the financials. |
| Subsequent events **Type 2** (non-recognized) → conditions arose after B/S date → **disclose only** | Fire after year-end | Footnote disclosure only. |
| Pension expense → service cost in **operating**; other components **below operating income** | Pension I/S presentation | Interest, expected return, amortization of PSC/gains-losses are non-operating. |
| Pension funded status → PBO − plan assets at FV → single net B/S item | Pension B/S presentation | Surplus = asset; deficit = liability. |
| Discontinued operations definition → disposal of a **component** representing a **strategic shift** with major effect | Sale/abandonment of a business line | A single asset is not enough. |
| Component of an entity → operating segment, reportable segment, reporting unit, subsidiary, or asset group whose ops and CFs are clearly distinguishable | Discontinued-ops eligibility | Granularity threshold. |
| OCI components → **PUFI**: Pension adjustments, Unrealized gains/losses on AFS debt, Foreign currency translation, Interest-rate hedges (cash-flow hedges) | OCI vs NI sorting | Mnemonic from §14.17. |
| Foreign currency translation: functional = local → **current rate method** (OCI/CTA); functional = USD → **remeasurement** (gain/loss to NI) | Subsidiary functional currency question | Method choice determines where FX P/L lands. |
| Statement of changes in equity → required basic statement | Set of financials presentation | One of the basic financials. |
| 10-K (annual, audited), 10-Q (quarterly, reviewed), 8-K (current material events, 4 business days) | SEC reporting | Form distinctions. |
| Large accelerated filer deadlines → 10-K: 60 days; 10-Q: 40 days; 8-K: 4 business days | SEC filing deadline questions | Tier-specific. |
| First-time IFRS adopter → apply **retrospectively** as if always used; restate comparative period | IFRS 1 transition | Specific retrospective rule. |
| Interim reporting → **integral part of annual period** (US GAAP) | Quarterly recognition | Discrete view for certain items (taxes use annual effective rate). |
| Segment reporting threshold → revenue ≥10% of total, OR profit/loss ≥10% of greater of combined profits or combined losses, OR assets ≥10% of total; plus the 75% reportable-segments rule | Segment-disclosure question | Three quantitative thresholds + the aggregate-coverage rule. |

---

## C. Weaponization Quick-Reference (from §14.18)

For each rule above, an MCQ author can produce a distractor by **flipping the default**:

- State no qualifier on preferred stock → correct answer requires noncumulative; distractor treats as cumulative. *(A1.)*
- Mention treasury stock without "par value method" → correct answer uses cost; distractor uses par. *(A2.)*
- Provide both implicit rate and IBR → correct answer uses implicit; distractor uses IBR. *(A3.)*
- Omit residual value → correct answer assumes zero; distractor uses a "typical" salvage.
- Omit cost-flow method → no default; question must state it; distractor uses FIFO assumption.
- Omit currency → correct answer assumes USD; distractor invents a translation.

When grading or evaluating, the inverse: any answer that silently *imposes* a non-default assumption that conflicts with this table should be marked incorrect (or flagged for review if it explicitly justifies a rebuttal).

---

## D. AI-Evaluator Usage Notes

1. **Load both files.** `SILENT_DEFAULTS.md` is human-readable; `SILENT_DEFAULTS.json` (sibling) is the machine-parseable mirror with `{id, rule, context, logic, section}` per record.
2. **Match on context first.** For each candidate answer, identify which rule's `context` the stem matches (silent qualifier presence/absence, US GAAP vs IFRS marker, classification language).
3. **Score against the rule.** If the candidate answer implicitly assumes a different default, mark wrong.
4. **Distinguish "no default" rules.** Cost flow method, inventory system, depreciation method, useful life, debt classification, and ADA method are explicitly **no-default** — the stem *must* state them. An evaluator should flag any candidate answer that fabricates a default in these categories.
5. **Apply switch points (§B.15) globally.** If the IFRS marker is present, override the matching US GAAP defaults before scoring.

---

## E. Provenance & Disclaimer

This file is a derivative reorganization of §14 of `STYLE_REFERENCE_FAR.md`, which catalogs the *pedagogical conventions* the AICPA uses on FAR. It contains no copied exam-vendor question content. The rules below are standard US GAAP / IFRS defaults documented in primary authoritative sources (FASB ASC, IFRS Standards, GASB) and in widely-available CPA-prep curricula. Use of this file in ACED is grounded in (1) the idea/expression dichotomy (rules and conventions are not protectable), (2) Sega v Accolade and Sony v Connectix (reverse engineering for interoperability is fair use), (3) Feist (factual compilations require originality), and (4) Baker v Selden (systems and methods are not protectable through their description). This file is for **authoring and evaluation tooling** only and should not be republished as exam content.
