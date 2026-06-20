# STYLE_REFERENCE_FAR.md — Pattern Map for AICPA-Style FAR Multiple Choice

**Author:** Story Shaw
**Status:** Original analytical work. Not a reproduction, paraphrase, or adaptation of any third-party question bank.
**Purpose:** Document the stylistic, structural, and pedagogical *patterns* the AICPA uses on the FAR section of the CPA exam, derived from publicly available sample questions and from a structural analysis of how commercial review providers frame their own questions. The output is a style guide for writing original FAR MCQs that read like the real thing without copying any third party's expression.

**Legal posture (do not skip):** Style, structure, formulas, fact archetypes, and pedagogical conventions are not copyrightable. *Sega v Accolade* (9th Cir. 1992) and *Sony v Connectix* (9th Cir. 2000) hold that intermediate study of a competitor's work *for the purpose of understanding* its functional patterns is fair use. *Feist v Rural Telephone* (1991) holds that facts and underlying ideas are uncopyrightable; only creative selection/arrangement is. *Baker v Selden* (1879) and the merger doctrine hold that when a factual idea can only be expressed in a small number of ways, the expression merges with the idea and is not protectable. This document captures patterns only — never expression — and the question bank built from it will use original numeric facts, original fact patterns, and original prose. See `PROVENANCE.md`.

**Methodology:** Quantitative analysis of 982 sample MCQs from a commercial review provider's homework set, cross-referenced with 3 AICPA "newly released" sample questions and the AICPA Blueprint. All counts in this document are from that corpus. No question is reproduced or paraphrased here. The corpus is referenced only as a source of *pattern* signal and is not redistributed.

---

## 1. Macro Architecture: How Every FAR MCQ Is Built

Every FAR MCQ in the wild follows this 5-part architecture. Stay inside it.

```
┌─────────────────────────────────────────────┐
│ 1. FACT SETUP          (1–6 sentences)      │
│ 2. NUMERICAL PAYLOAD   (table or inline)    │  ← optional in conceptual Qs
│ 3. INTERROGATIVE       (1 sentence, ?: ?)   │
│ 4. FOUR CHOICES        (parallel structure) │
│ 5. EXPLANATION         (1 correct + 3 wrong)│  ← we author this too
└─────────────────────────────────────────────┘
```

Hard constraints observed in 982 sampled questions:

- **Stem length:** 90% are 25–120 words. Median ~55 words. The hardest questions are not the longest — they are the *densest* (lots of information in 60 words).
- **Choice parallelism:** All four choices share the same grammatical shape. If A is a dollar amount, all four are dollar amounts. If A is a "Yes – No" pair, all four are "Yes/No – Yes/No" pairs. Breaking parallelism gives the answer away.
- **One correct, three plausible.** Distractors are never absurd. Each distractor must correspond to a specific misstep a reasonable candidate could make.
- **Explanation order:** Correct choice explained first, then the three wrong choices in letter order (A → D, skipping the correct one).

---

## 2. Stem Patterns: The 8 Openers That Cover ~70% of FAR

Quantitative analysis of stem first-six-words. Use these openers in roughly these proportions when generating a new bank.

| # | Opener archetype | Frequency in corpus | When to use |
|---|---|---|---|
| 1 | `Which of the following [is / statements / items / should]…` | ~9% | Conceptual recall: definitions, scope, classification |
| 2 | `On [Month] [DD], Year [N], [XCo] [did something]…` | ~6% | Transaction-based calculation. The date matters. |
| 3 | `The following [data / information] [has been / pertains to / is]…` | ~5% | Multi-line numeric setup, usually followed by a table |
| 4 | `At [December 31 / the beginning / the end of] Year [N]…` | ~4% | Balance-sheet-date snapshot questions |
| 5 | `During Year [N], [XCo] [did something]…` | ~2% | Period-spanning event |
| 6 | `[XCo]'s [account] balance at [date] was…` | ~2% | Account-roll-forward setups |
| 7 | `For the year ended December 31, Year [N]…` | ~2% | Income-statement-period questions |
| 8 | `What is the [primary purpose / objective / definition] of…` | ~1% | Definitional recall (most common in F1 and F6) |

**Year language conventions (use exactly these):**
- `Year 1`, `Year 2`, `Year 3`, `Year 4` — by far the most common (1,800+ hits in corpus)
- `January 1` and `December 31` — the only two specific dates used heavily (640 + 428 hits)
- Avoid using `2024`, `2025`, etc. The exam is timeless. Use abstract Year N.
- A handful of legitimate uses of real years exist for crypto/recent topics — keep these to <2% of bank.

**Fictional company name conventions:**
- Short, one-word, capitalized, often surname-like: `Scott`, `Dart`, `Doe`, `Hutton`, `Smith`, `West`, `Oak`, `Jones`, `Cobb`, `Brown`, `Davis`, `Hill`, `Moss`, `King`.
- Always followed by one of: `Corp.`, `Corporation`, `Co.`, `Inc.`, `Company`.
- Never use real-world company names. Never use cute names. Never use full-paragraph names.
- For multi-entity scenarios (consolidation, equity method): pairings like `Parent / Sub`, `Pare / Sub`, single-letter aliases (`P` and `S`), or two surnames (`Smith and Jones`).

---

## 3. The Interrogative Sentence: The Final Line of the Stem

Every stem ends with one of these grammatical shapes. The shape determines the choice format.

| Shape | Choice format that follows | Example archetype |
|---|---|---|
| `What amount should X report as Y?` | Four dollar amounts | Numeric reporting |
| `Which of the following statements is correct?` | Four full-sentence statements | Conceptual |
| `Which of the following is not Z?` | Four nouns/phrases | Negation-trap conceptual |
| `How should X be reported?` | Four classification phrases | Classification |
| `X should be:` (colon, no question mark) | Four completions | Sentence-completion conceptual |
| `What is the [gain / loss / balance] on [date]?` | Four dollar amounts (incl. zero) | Single-figure calc |
| `In its Year N [statement], at what amount…?` | Four dollar amounts | Reporting amount |
| Two-column header (`Year 3` `Year 4`) | Four pairs of amounts | Comparative period |

**Critical:** The interrogative carries the trap. The words `not`, `except`, `only`, `excludes`, `disclose`, and `report` are signal-bearing. In the sampled corpus:
- The word **`should`** appears in **49.4%** of all stems.
- The word **`not`** appears in **17.3%** (always for negation traps).
- The word **`except`** appears in **1.3%** (use sparingly — too obvious otherwise).

---

## 4. Numerical Payload: The Table

When numbers are needed, the convention is a small inline table:

```
Sales                                $250,000
Purchase discounts                       3,000
Recovery of accounts written off        10,000
Total revenues                       $263,000
```

Rules:

1. **Round to the thousand 78% of the time.** Use non-round numbers (e.g., $263,000, $52,400) when round numbers would give the trap away.
2. **Magnitude clustering:** answer choices live in one of these buckets and never mix:
   - `<$1,000` (per-share, ratios) — 12% of choices
   - `$1,000 – $10,000` (small biz) — 14%
   - `$10,000 – $100,000` (most common) — 43%
   - `$100,000 – $1,000,000` (mid-corp) — 35%
   - `$1,000,000+` (rare; used for large companies, leases, bonds) — 7%
3. **The "total" line in the prompt is often a trap.** The provided "Total revenues $263,000" line is the wrong answer because the candidate must recognize that two of the three items don't belong in revenue. The correct answer is the recomputed total.
4. **One-line spelled-out facts:** when the table would be too small, the facts are bulleted into the stem: "Sales were $250,000, purchase discounts were $3,000, and recoveries were $10,000."

---

## 5. The Four Choices: Construction Rules

### 5.1 Parallel structure

All four choices share the same grammatical category:
- **All dollar amounts** (most common): `$X`, `$Y`, `$Z`, `$W` — always sorted in some discernible order (usually ascending, sometimes by trap-severity).
- **All Yes/No pairs** (~1% of corpus, used for two-part conceptual questions): `Yes – Yes`, `Yes – No`, `No – Yes`, `No – No`. Always all four combinations.
- **All single concepts** (conceptual): four parallel noun phrases of similar length.
- **All full sentences** (conceptual reasoning): four complete sentences of comparable length (within 30% of each other).

### 5.2 Length parity

Choices should be within ~30% length of each other. The longest choice should *not* be the correct one as a rule (a common test-prep myth) — verify with corpus that lengths are roughly uniform.

### 5.3 The correct-answer letter distribution (verified across 938 of the 982 corpus questions)

| Letter | % of correct answers in corpus |
|---|---|
| A | 21.3% |
| B | 27.6% |
| C | 26.2% |
| D | 24.9% |

**Target distribution for our bank:** 24/26/26/24 to be neutral. A slight B/C bias mirrors the wild but isn't required.

### 5.4 The "zero" choice

A common distractor: `$0`. Used when the trap is "the candidate thinks something should be recognized but actually isn't." About 6% of numeric questions include $0 as one of the four choices. The candidate who recognizes the item shouldn't be recognized picks $0.

---

## 6. Distractor Archetypes: The 14 Wrong-Answer Recipes

Every distractor in the corpus implements one of these recipes. When writing a new MCQ, derive each of the three distractors by applying a *different* recipe to the same underlying scenario. Doing this is what makes the question feel professionally constructed.

| # | Archetype | What the candidate did wrong | Example pattern (abstract) |
|---|---|---|---|
| 1 | **WRONG_BASIS** | Used face/book/carrying value instead of fair value (or vice versa) | "Reports the asset at carrying amount rather than fair value." |
| 2 | **FLIPPED_DIRECTION** | Added when they should have subtracted, or vice versa | "Subtracts the discount instead of adding the premium." |
| 3 | **UNCLASSIFIED_INCLUDES_EXCLUDES** | Included an item that shouldn't be in the figure, or excluded one that should | "Improperly includes purchase discounts in revenue." |
| 4 | **WRONG_PERIOD** | Reported the item in Year N when it belongs in Year N±1 | "Reports the Year 4 loss in Year 3." |
| 5 | **OFF_BY_PARTIAL_YEAR** | Used 12 months when partial-year is required, or vice versa | "Uses 12 months of interest instead of 10." |
| 6 | **CLASSIFICATION_ERROR** | Put the item in the wrong section of the statement | "Classifies the gain in OCI rather than continuing operations." |
| 7 | **GROSS_VS_NET** | Reported gross when net was required, or vice versa | "Reports the proceeds and carrying amount separately instead of the gain." |
| 8 | **WRONG_RULE_IFRS_GAAP** | Applied IFRS treatment under US GAAP, or vice versa | "Uses the IFRS revaluation model, not permitted under US GAAP." |
| 9 | **IGNORED_TIME_VALUE** | Failed to discount future cash flows | "Uses the undiscounted face amount." |
| 10 | **FORGOT_TAX_EFFECT** | Failed to net the tax effect | "Reports the gross gain instead of net of tax." |
| 11 | **PARTIAL_INCLUSION** | Only counted some of the contributing items | "Only includes Q1 sales." |
| 12 | **LITERAL_FROM_STEM** | Picked a number written directly in the stem without computing | "$263,000 — the stated total, which is wrong because…" |
| 13 | **TIMING_ERROR** | Recognized too early or too late | "Recognized revenue at contract signing rather than transfer of control." |
| 14 | **PRINCIPLE_RESTATEMENT** | Stated a true principle that is irrelevant to this fact pattern | "True for trading securities; this is an available-for-sale security." |

Each MCQ should pull **three different recipes**. Repeating the same recipe twice is a tell.

The most common single archetype in the corpus is **UNCLASSIFIED_INCLUDES_EXCLUDES** (the candidate added or omitted something that didn't belong) — about 30% of all distractors after the numeric ones are decomposed. The second-most-common is **WRONG_BASIS** / **WRONG_PERIOD**, each ~10%.

---

## 7. The Explanation Block

The explanation has a fixed template:

```
Choice "<correct>" is correct. <One-sentence statement of the rule.> <One sentence applying the rule to the facts, often with the calculation.>

Choice "<wrong1>" is incorrect. <Diagnostic sentence: what the candidate did wrong.>

Choice "<wrong2>" is incorrect. <Diagnostic sentence.>

Choice "<wrong3>" is incorrect. <Diagnostic sentence.>
```

Conventions:

- **Correct-choice explanations open with the rule, not the calculation.** "Gains are reported using the net concept" comes before "i.e., proceeds less carrying amount." This is pedagogical — the candidate needs the principle, not just the number.
- **Each distractor explanation diagnoses a specific archetype** from §6. The phrase usually echoes the archetype:
  - WRONG_BASIS: "Gains are reported using the net concept."
  - WRONG_PERIOD: "Each amount should be reported in the period it occurred."
  - CLASSIFICATION_ERROR: "…are not included in other comprehensive income."
- **Length:** correct-choice explanation is typically 2–4 sentences; distractor explanations 1–2 sentences each. The whole explanation block is rarely more than 120 words.
- **Tone:** Declarative, dry, present tense. Never apologetic, never conversational. Never "Remember that…" or "It's important to note…".

---

## 8. Difficulty Escalation: How to Calibrate Question Difficulty

The AICPA exam adaptively serves harder questions to higher-performing candidates. The pattern that emerges from the corpus:

| Difficulty | Stem length | Numeric ops needed | Distractor sophistication |
|---|---|---|---|
| **Easy (recall)** | 20–40 words, no table | 0 — pure recall | Distractors are wrong concepts |
| **Medium (single-step)** | 40–80 words, may include 2–4 line table | 1 step (add, subtract, multiply) | Distractors are off-by-one or wrong-basis |
| **Hard (multi-step)** | 80–150 words, 5+ line table | 2–4 steps, often involving timing or classification | Each distractor implements a different recipe from §6 |
| **Brutal (synthesis)** | 100–200 words, multiple constraints | 3+ steps + judgment call on which framework applies | Distractors include plausibly-correct rule applied to wrong facts (PRINCIPLE_RESTATEMENT) |

For ACED's pack target (300+ questions per section), aim for roughly:
- 25% Easy
- 35% Medium
- 30% Hard
- 10% Brutal

---

## 9. Module-Specific Patterns

### F1 — Conceptual Framework, Financial Statements, Special Reporting

Most-common opener: `Which of the following [is/should/statements]…` (negation-trap conceptual).
Most-common interrogative shape: `How should X be reported?` / `Which of the following statements is correct?`
Distractor flavor: heavy on **CLASSIFICATION_ERROR** (OCI vs net income, continuing vs discontinued operations) and **PRINCIPLE_RESTATEMENT** (the candidate knows the rule for trading securities but the question is about AFS).
Year language: rarely uses dates. Pure concept tests.

### F2 — Revenue, Receivables, Inventory, PP&E, Intangibles, Investments, Instruments/OCI

Most-common opener: `On [date], Year N, X did Y…` (transaction).
Most-common interrogative: `What amount should X report as Y on [date]?`
Distractor flavor: **WRONG_BASIS**, **OFF_BY_PARTIAL_YEAR**, **TIMING_ERROR** dominate. Revenue recognition is the trap-rich zone (when does the performance obligation transfer?). Inventory always has FOB destination / FOB shipping point tricks.

### F3 — Cash, Bonds, Leases, Pensions

Most-common opener: `On January 1, Year 1, X issued/leased/borrowed…`
Most-common interrogative: `What is the carrying amount / interest expense / lease liability at December 31, Year N?`
Distractor flavor: **WRONG_PERIOD**, **OFF_BY_PARTIAL_YEAR**, **IGNORED_TIME_VALUE**. Bonds questions almost always require effective-interest amortization across multiple periods.

### F4 — Stockholders' Equity, EPS, Changes, Income Taxes, Governmental

Most-common opener: `During Year N, X declared/issued/changed…`
Most-common interrogative: `What is the basic/diluted EPS for Year N?` or `What is deferred tax expense?`
Distractor flavor: **FLIPPED_DIRECTION** (numerator/denominator inversion), **PARTIAL_INCLUSION** (forgetting contingent shares or out-of-the-money options), **GROSS_VS_NET** (income tax expense vs net of tax).
Governmental sub-module has its own pattern: `Which of the following funds…` openers, and the trap is always knowing the right measurement focus and basis of accounting (current financial resources vs economic resources; modified accrual vs accrual).

### F5 — Business Combinations, Consolidation, Partnerships, Cash Flows

Most-common opener: `On January 1, Year 1, Parent acquired N% of Sub…` or `Selected information from the separate and consolidated…`
Most-common interrogative: `What amount should be reported on the consolidated balance sheet for X?`
Distractor flavor: **UNCLASSIFIED_INCLUDES_EXCLUDES** (does the intercompany profit get eliminated?), **CLASSIFICATION_ERROR** (where does the NCI go?), **WRONG_BASIS** (book value vs fair value at acquisition).
Cash flow sub-module: openers like `On a statement of cash flows…` and `In a statement of cash flows prepared using the indirect method…`. Trap is always classification (operating vs investing vs financing) and gross-vs-net for changes in working capital.

### F6 — Not-for-Profit, Governmental

Most-common opener: `Which of the following funds of [a city / a government / a not-for-profit]…`
Most-common interrogative: `Which fund type would record this transaction?` / `What is the primary purpose of fund accounting?`
Distractor flavor: **WRONG_RULE_IFRS_GAAP** but applied to governmental vs business-type accounting (the candidate applies for-profit GAAP to a governmental fund). Heavy on **PRINCIPLE_RESTATEMENT** and **CLASSIFICATION_ERROR**.

---

## 10. Trap Concepts That Recur Across Modules

These are the *content* traps — the recurring conceptual gotchas that experienced writers plant in distractors. A good FAR bank cycles through these.

1. **OCI vs Net Income.** Unrealized gain on AFS debt securities → OCI. Realized gain on AFS → net income. Trading securities → always net income. The trap: applying the trading rule to AFS, or vice versa.

2. **Continuing Operations vs Discontinued Operations.** A "component" of an entity with a major strategic shift → discontinued. A fixed asset sale → continuing, even if large. The trap: classifying any large gain/loss as discontinued.

3. **Net vs Gross Concept.** Gains on asset sales → net concept (proceeds − carrying amount, reported as one line). Sales of inventory → gross concept (revenue gross, COGS separate). The trap: showing the proceeds line and the carrying-amount line separately for a fixed asset sale.

4. **Comprehensive Income Excludes Owner Transactions.** Comprehensive income includes everything *except* owner investments and distributions. The trap: including dividends paid in comprehensive income.

5. **Cash Flow Classification.** Interest paid / received → operating under US GAAP. Dividends paid → financing. Dividends received → operating. Equipment purchase → investing. The trap: classifying interest as financing (which feels intuitive but is wrong under GAAP — IFRS allows either, GAAP locks to operating).

6. **FOB Destination vs FOB Shipping Point.** Title transfers at the FOB point. Inventory in transit FOB shipping point → buyer's inventory at year-end. FOB destination → seller's. The trap: including FOB destination goods in transit in buyer's count.

7. **Revenue Recognition: Point-in-Time vs Over-Time.** Recognize over time only if one of three criteria is met (customer simultaneously receives/consumes; creates/enhances an asset the customer controls; or no alternative use + enforceable right to payment). Otherwise point-in-time at transfer of control. The trap: pro-rating a point-in-time contract by time, or vice versa.

8. **Effective Interest vs Straight-Line.** Effective interest is US GAAP for bonds. Straight-line is allowed only when results aren't materially different. The trap: using straight-line on a problem where the discount/premium is material.

9. **Capital vs Operating Lease (under ASC 842).** All leases over 12 months on the balance sheet. Finance lease has front-loaded expense (interest + amortization); operating lease has straight-line expense. The trap: applying old GAAP rules or applying IFRS (no operating/finance distinction).

10. **Defined Benefit Pension Components.** Service cost in operating expenses; all other components (interest, expected return, amortization of prior service cost) in non-operating. The trap: lumping all pension cost into operating.

11. **Deferred Tax Assets/Liabilities Direction.** Future deductible difference → DTA (book < tax now, will reverse). Future taxable difference → DTL (book > tax now, will reverse). The trap: flipping the direction.

12. **EPS Denominator: Weighted Average.** Treasury stock reduces shares; new issuances are weighted for the months outstanding; stock splits are retroactive to the beginning of the earliest period presented. The trap: using period-end shares instead of weighted average.

13. **Consolidation: Eliminate Intercompany Profit in Inventory.** When sub sells to parent and inventory remains, the intercompany profit is eliminated. The trap: only eliminating the cash side of the transaction.

14. **Governmental Fund Statements Use Modified Accrual.** Revenues when measurable and available; expenditures when liability incurred. Government-wide statements use full accrual. The trap: applying full accrual to a governmental fund.

15. **NFP Net Asset Classification (post ASU 2016-14).** Two categories: without donor restrictions, with donor restrictions. Old three-class (unrestricted/temp/perm) is dead. The trap: using the old categories.

---

## 11. Writing Workflow: From Topic to Finished Question

For every new MCQ:

1. **Pick a Blueprint topic.** Cite the exact AICPA Blueprint location (e.g., "F1 → Income Statement → Discontinued Operations").
2. **Pick a trap concept** from §10 that lives inside that topic.
3. **Pick a stem opener** from §2 sized to the difficulty target.
4. **Build the fact pattern from scratch.** Original numbers, original company name from the §2 conventions, original dates (always Year N, never real years).
5. **Compute the correct answer.** Show the work in a comment in the JSON.
6. **Build three distractors using three different recipes from §6.** Each recipe must correspond to a *plausible* mistake a real candidate could make, not a random wrong number.
7. **Write the explanation block per §7 template.**
8. **Set the source tag** to the cpa-far.js module (F1.M1, F1.M2, …, F4.M5).
9. **Verify checklist:**
   - [ ] No proper noun, number, or phrase is taken verbatim from any third party.
   - [ ] All four choices are grammatically parallel.
   - [ ] The correct answer letter cycles toward the §5.3 distribution across the bank.
   - [ ] The explanation diagnoses the specific error in each distractor.
   - [ ] The Blueprint citation is correct.

---

## 12. What This Document Is *Not*

- It is not a transcription of any commercial review provider's content.
- It is not a paraphrase. Paraphrasing is derivative work and is forbidden in this project.
- It is not the AICPA Blueprint. The Blueprint is consulted separately at [aicpa-cima.com](https://www.aicpa-cima.com/resources/download/uniform-cpa-examination-blueprints).
- It does not reproduce any AICPA-released question. The three 2026 AICPA released questions consulted for calibration are referenced abstractly only.

The only thing taken from third-party material is the *idea space* — the set of formal patterns the test uses. Patterns are not protectable expression. See `PROVENANCE.md` for the full source-material audit trail.

---

## 13. Maintenance

This document is living. As new AICPA Blueprint editions drop and as the bank grows, update:
- §3 (interrogative shapes) if a new question format emerges
- §6 (distractor archetypes) if a new recipe shows up
- §10 (trap concepts) as ASC standards change

Last updated: June 19, 2026.

---

## 14. The Unstated Defaults: The Hidden Rulebook

**This is the section that separates a candidate who passes from one who doesn't.** Every FAR question is written assuming the candidate knows a long list of *unstated default conventions*. The question doesn't tell you which method to use; you're expected to know which method applies *when the question is silent*. Examiners exploit this constantly: they omit a fact that would tell you which method to use, knowing that candidates who don't know the default will pick the wrong distractor.

This section catalogs the defaults. Memorize the left column. When you author a new MCQ, you can deliberately exploit any one of these by writing a stem that omits the controlling fact — the trap writes itself.

### 14.1 Stockholders' Equity Defaults

| Topic | Default when stem is silent | Where it bites |
|---|---|---|
| **Preferred stock cumulative vs noncumulative** | **Noncumulative.** If the stem just says "6% preferred stock" with no "cumulative" qualifier, treat as noncumulative — dividends in arrears don't carry forward. | EPS denominator, dividend-allocation problems, retained earnings appropriation. |
| **Preferred stock participating vs nonparticipating** | **Nonparticipating.** Preferred gets its stated rate only; common takes the residual. | Two-class dividend allocation. |
| **Preferred stock convertible vs nonconvertible** | **Nonconvertible.** No diluted-EPS impact unless explicitly stated. | Diluted EPS. |
| **Treasury stock accounting method** | **Cost method.** If the stem doesn't say "par value method," use cost. T/S is recorded at acquisition cost, contra-equity. | Reissuance gains/losses, APIC–treasury entries. |
| **Stock dividend size** | **Small (<20–25%) is at fair value; large (≥25%) is at par.** No qualifier in the stem → size of dividend determines treatment. | Retained earnings reduction amount. |
| **Stock split** | **No journal entry; memo only; par value reduced proportionally.** | EPS retrospective restatement. |
| **Property dividend** | **Fair value of distributed property at declaration date; gain/loss recognized for difference from book value.** | Net income, RE reduction. |
| **Liquidating dividend** | **Reduces APIC first, then any other contributed capital.** Not retained earnings. | When dividend exceeds RE. |
| **Date for dividend payable recognition** | **Declaration date** creates the liability. Record date is informational only; payment date settles cash. | Cutoff problems. |

### 14.2 Earnings Per Share (EPS) Defaults

| Topic | Default | Why it matters |
|---|---|---|
| **Weighted-average shares** | Time-weight every issuance/repurchase by months outstanding within the period. | Denominator. |
| **Stock split / stock dividend** | **Retroactive to the beginning of the earliest period presented.** Always. | Restating comparative periods. |
| **Cumulative preferred dividend** | Subtract from numerator **whether declared or not**. | NI available to common. |
| **Noncumulative preferred dividend** | Subtract from numerator **only if declared**. | NI available to common. |
| **Convertible debt — if-converted method** | Add interest (net of tax) back to numerator; add converted shares to denominator. | Diluted EPS. |
| **Options/warrants — treasury stock method** | Only include if **average market price > exercise price** (in-the-money). Out-of-the-money options are antidilutive and excluded. | Diluted EPS. |
| **Antidilutive securities** | **Exclude.** Always. Test each convertible security individually for dilution. | Diluted EPS. |
| **Basic vs diluted EPS** | Simple capital structure → basic only. Complex capital structure → both. | Disclosure. |

### 14.3 Leases (ASC 842) Defaults

| Topic | Default | Why it matters |
|---|---|---|
| **Discount rate — lessee** | **If the rate implicit in the lease is readily determinable, use it. Otherwise, use the lessee's incremental borrowing rate (IBR).** The default progression is: implicit → IBR → (private companies only) risk-free rate election. | Initial lease liability measurement. |
| **Discount rate — lessor** | **Always use the rate implicit in the lease.** Lessor knows their own rate. | Initial net investment. |
| **Lease term** | Noncancelable term + options the lessee is **reasonably certain** to exercise + termination penalties the lessee is reasonably certain to incur. | Lease classification (12-month threshold) and liability measurement. |
| **Lease classification for lessee** | Default to **operating** unless any one of five finance-lease criteria is met (transfer of ownership, BPO, term ≥75% of useful life, PV ≥90% of FV, asset specialized to lessee). | Income statement pattern (straight-line vs front-loaded). |
| **Short-term lease election** | Lease term ≤12 months and no purchase option the lessee is reasonably certain to exercise → **may elect** to expense straight-line. Off balance sheet. | Decision to recognize ROU/liability or not. |
| **Initial direct costs** | Capitalize into the ROU asset. | Initial measurement. |
| **Variable lease payments** | Only those that depend on an index/rate at commencement are in the initial liability (using the index/rate at commencement). Truly variable payments → expense as incurred. | Liability size. |
| **Lease incentives received** | Reduce the ROU asset. | Initial measurement. |

### 14.4 Bonds & Long-Term Debt Defaults

| Topic | Default | Why it matters |
|---|---|---|
| **Amortization method** | **Effective interest method.** Straight-line is allowed only if results aren't materially different. Assume effective interest unless told otherwise. | Interest expense for the period. |
| **Interest payments** | **Semi-annual** unless stated otherwise. A "10%, 10-year bond" pays 5% every 6 months — use the semi-annual rate (and double the periods) in PV computations. | Bond pricing, amortization schedule. |
| **Issue date vs interest date** | If a bond is issued between interest dates, the buyer pays accrued interest at issue and gets it back at the next interest date. | Carrying amount at issuance. |
| **Imputed interest** | **If no stated rate or an unreasonably low rate, impute interest at the market rate.** Exception: short-term trade receivables/payables (≤12 months) and customary trade transactions. | Initial measurement of the receivable/payable. |
| **Bond issued with detachable warrants** | Allocate proceeds between bond and warrants based on their **relative fair values**. | Initial bond carrying amount. |
| **Bond issued with nondetachable conversion feature** | Allocate **all** proceeds to the bond (no separate equity component under US GAAP, post-ASU 2020-06). | Initial bond carrying amount. |
| **Early extinguishment of debt** | Difference between reacquisition price and net carrying amount → **gain/loss in net income**, continuing operations. Not OCI. | Income statement. |

### 14.5 Inventory Defaults

| Topic | Default | Why it matters |
|---|---|---|
| **Cost flow method** | **None assumed.** The stem will tell you FIFO, LIFO, weighted-average, or specific identification. If two methods are mentioned, the question is testing which one applies. | COGS, ending inventory. |
| **Inventory system** | **None assumed.** Periodic vs perpetual must be stated. Periodic → inventory counted only at period end. Perpetual → every transaction updates inventory. | Timing of COGS recognition; LIFO vs LIFO-perpetual differences. |
| **Lower of cost and net realizable value (LCNRV)** | **Default for non-LIFO methods (FIFO, weighted-average).** | Year-end write-downs. |
| **Lower of cost or market (LCM)** | **Only for LIFO and retail inventory method.** Market = middle of three (ceiling = NRV, floor = NRV − normal profit, replacement cost as midpoint). | LIFO write-downs only. |
| **FOB shipping point** | Title transfers at the **seller's dock**. Inventory in transit → **buyer's**. | Year-end inventory cutoff. |
| **FOB destination** | Title transfers at the **buyer's dock**. Inventory in transit → **seller's**. | Year-end inventory cutoff. |
| **Consignment inventory** | Stays on **consignor's** books until sold by consignee. | Whose inventory is it at year-end. |
| **Goods on approval / sale on right of return** | Estimate returns; recognize revenue net of expected returns; record return asset and refund liability. | Revenue and inventory. |
| **Inventory write-down reversal** | **US GAAP: no reversals** once written down. **IFRS: reversal allowed up to original cost** if NRV recovers. | Year-end measurement. |

### 14.6 Investments Defaults

| Topic | Default | Why it matters |
|---|---|---|
| **Ownership ≤20% (and no significant influence)** | **Fair value through net income (FVTNI)** for equity securities. For debt securities, classification (trading / AFS / HTM) must be stated. | Subsequent measurement. |
| **Ownership 20–50%** | **Presumed significant influence → equity method.** This presumption can be rebutted, but is the default. | Subsequent measurement. |
| **Ownership >50%** | **Control → consolidation.** No election. | Whether to consolidate. |
| **Debt security classification** | **None assumed.** The stem will say "trading" or "available-for-sale" or "held-to-maturity." Trading → FVTNI. AFS → FV through OCI. HTM → amortized cost. | Subsequent measurement. |
| **Equity securities (post-ASU 2016-01)** | **All equity securities (except equity-method or consolidated) → FVTNI.** The old AFS-for-equity category is gone. | Where unrealized gains/losses go. |
| **Crypto assets (post-ASU 2023-08)** | **Fair value through net income**, separately presented on the balance sheet. | Subsequent measurement. |
| **Stock split received by investor** | **No entry; allocate cost over new total shares.** | Per-share basis. |
| **Investee dividend received under equity method** | **Reduce the investment account; not income.** Income is recognized as investee earns. | Investment carrying amount. |

### 14.7 Income Taxes Defaults

| Topic | Default | Why it matters |
|---|---|---|
| **Enacted tax rate** | Use the **enacted future rate** (not the current-period rate) for measuring DTAs and DTLs. | DTA/DTL measurement. |
| **Valuation allowance** | Reduce DTA when it is **more likely than not** (>50%) that some/all of the DTA won't be realized. | Net DTA. |
| **Permanent vs temporary differences** | **Permanent** (e.g., municipal interest, life insurance proceeds, fines) → no DTA/DTL. **Temporary** → DTA or DTL. | Existence of deferred tax. |
| **Net operating loss (NOL) post-TCJA** | **Carryforward indefinitely; no carryback** (with limited exceptions). 80% limitation on use against future income. | DTA creation, expiration. |
| **Uncertain tax positions** | Recognize benefit only if **more likely than not** to be sustained on examination; measure at the **largest amount that is >50% likely** to be realized. | Tax expense, liability. |
| **Intraperiod tax allocation** | Required by US GAAP. Tax effects allocated to continuing operations, discontinued operations, OCI, and direct entries to equity. | Where the tax expense appears. |

### 14.8 Revenue Recognition (ASC 606) Defaults

| Topic | Default | Why it matters |
|---|---|---|
| **Contract existence** | Must have: approval, identifiable rights, identifiable payment terms, commercial substance, and **probable collection**. If any fails, no contract → no revenue. | Step 1. |
| **Performance obligation** | A promise is a separate PO if **distinct** (capable of being distinct + separately identifiable). Default for a bundle is to assess separately. | Step 2. |
| **Transaction price — variable consideration** | Estimate using **expected value or most likely amount** (whichever better predicts), constrained to amount **highly probable** not to reverse. | Step 3. |
| **Significant financing component** | Adjust if payment is ≥ 1 year before/after delivery. Practical expedient: ignore if <1 year. | Step 3. |
| **Allocation** | **Relative standalone selling price.** | Step 4. |
| **Recognition timing** | **Point-in-time by default**, unless one of three over-time criteria is met (simultaneous receive/consume; customer-controlled asset; no alternative use + enforceable right to payment). | Step 5. |
| **Bill-and-hold** | Recognize only if the substantive reason for the arrangement exists, the product is identified separately, it's ready for physical transfer, and the seller cannot use it. | Revenue timing. |
| **Consignment** | **No revenue at consignment.** Recognize when consignee sells to end customer. | Revenue timing. |
| **Principal vs agent** | **Principal** controls the good/service before transfer (records gross revenue). **Agent** arranges (records net commission). The default test is control. | Gross vs net presentation. |
| **Right of return** | Recognize revenue net of expected returns; record refund liability and return asset. | Revenue amount. |
| **Sales taxes collected** | **Net** — excluded from transaction price. | Revenue amount. |

### 14.9 Contingencies Defaults

| Topic | Default | Why it matters |
|---|---|---|
| **Loss contingency — probable + estimable** | **Accrue** (debit loss, credit liability) AND disclose. | Liability recognition. |
| **Loss contingency — probable but range estimable** | Accrue the **low end** of the range under US GAAP if no amount in the range is better than another (under IFRS: midpoint). Disclose the range. | Liability amount. |
| **Loss contingency — reasonably possible** | **Disclose only, do not accrue.** | Disclosure-only. |
| **Loss contingency — remote** | **Ignore** (except for guarantees, which always disclose). | No action. |
| **Gain contingency — any likelihood** | **Never accrue.** Disclose if probable. | Conservatism. |
| **Warranty obligation** | **Always accrue** at sale (assurance-type warranty) based on expected cost. Service-type warranty → separate performance obligation deferred. | Liability + expense. |

### 14.10 PP&E, Intangibles, and Impairment Defaults

| Topic | Default | Why it matters |
|---|---|---|
| **Depreciation method** | **None assumed.** Stem will say straight-line, units-of-production, declining-balance, or sum-of-years-digits. | Annual depreciation. |
| **Residual / salvage value** | **Zero if not stated.** | Depreciable base. |
| **Useful life** | Must be stated. Asset class conventions exist but the stem will give you the number. | Annual depreciation. |
| **Capitalize vs expense** | Cost to **acquire and prepare for intended use** → capitalize. Routine maintenance → expense. Betterment that extends life → capitalize. | Initial measurement. |
| **Interest capitalization** | Capitalize on **self-constructed assets** only, during the construction period, on average accumulated expenditures, at the weighted-average rate of other debt or specific borrowing. | Initial cost of self-constructed asset. |
| **Impairment test — long-lived assets held and used (US GAAP)** | Two-step: (1) **Recoverability test:** carrying amount > undiscounted future cash flows? (2) If yes, **write down to fair value.** | Impairment loss. |
| **Impairment test — IFRS** | One-step: carrying amount > **recoverable amount** (greater of fair value less costs to sell, or value-in-use, which uses discounted CF). | Impairment loss. |
| **Impairment reversal** | **US GAAP: no reversal.** **IFRS: reversal allowed (except goodwill).** | Subsequent measurement. |
| **Goodwill impairment (post-ASU 2017-04)** | **One-step:** carrying amount of reporting unit > FV → write down goodwill by the difference (not below zero). Step 2 eliminated. | Goodwill carrying amount. |
| **Goodwill amortization** | **Public: no amortization, test annually.** Private companies may elect to amortize over up to 10 years. | Annual expense. |
| **R&D costs (US GAAP)** | **Expense as incurred.** Exceptions: software development past technological feasibility, costs of materials/equipment with alternative future use (capitalize then depreciate). | Period expense. |
| **R&D costs (IFRS)** | **Research → expense. Development → capitalize if 6 criteria met.** | Period expense vs intangible. |
| **Internally developed software — internal use** | Expense preliminary stage; **capitalize** application development stage; expense post-implementation. | Capitalized cost. |
| **Internally developed software — for sale** | Expense until **technological feasibility** established; capitalize from then until release; amortize over greater of (a) revenue ratio or (b) straight-line over useful life. | Capitalized cost. |

### 14.11 Consolidations Defaults

| Topic | Default | Why it matters |
|---|---|---|
| **Acquisition method** | **Required for all business combinations.** Pooling is dead. | Initial measurement. |
| **Goodwill measurement (full goodwill, US GAAP and IFRS)** | FV of consideration + FV of NCI + FV of previously held interest − FV of net identifiable assets. | Goodwill on the books. |
| **NCI measurement (US GAAP)** | **Fair value.** (IFRS allows election: FV or proportionate share of net assets.) | NCI initial amount. |
| **Intercompany transactions** | **100% eliminated**, regardless of NCI %. | Consolidated balance sheet. |
| **Intercompany inventory profit** | Eliminate **unrealized** portion (in ending inventory not sold to outside party). | Consolidated inventory, COGS. |
| **Intercompany fixed asset gain** | Eliminate the gain; depreciation is adjusted back over the remaining life. | Consolidated PP&E, depreciation. |
| **Acquisition-related costs** | **Expense as incurred.** Not part of consideration transferred. | Expense in period of acquisition. |
| **Contingent consideration** | Recognize at **fair value at acquisition date**. Subsequent changes: equity → not remeasured; liability/asset → remeasured through earnings. | Initial measurement, subsequent. |
| **Measurement period** | Up to 12 months from acquisition date to finalize provisional amounts. Adjustments are retrospective within this window. | Restatement. |

### 14.12 Statement of Cash Flows Defaults

| Topic | Default (US GAAP) | Why it matters |
|---|---|---|
| **Method** | **Indirect method is the most common; direct method also allowed.** If direct is used, a reconciliation (indirect) is required as supplemental. | Presentation. |
| **Interest paid** | **Operating.** | Classification. |
| **Interest received** | **Operating.** | Classification. |
| **Dividends received** | **Operating.** | Classification. |
| **Dividends paid** | **Financing.** | Classification. |
| **Income taxes paid** | **Operating** (always). | Classification. |
| **Acquisition/sale of PP&E** | **Investing.** | Classification. |
| **Issuance/repurchase of own stock** | **Financing.** | Classification. |
| **Issuance/repayment of debt** | **Financing.** | Classification. |
| **Non-cash transactions** | Disclosed separately (not in main statement). E.g., acquiring equipment by issuing stock. | Disclosure. |
| **IFRS classification flexibility** | Interest paid: operating **or** financing. Interest received and dividends received: operating **or** investing. Dividends paid: operating **or** financing. | US GAAP vs IFRS distinction. |

### 14.13 Not-for-Profit Defaults

| Topic | Default | Why it matters |
|---|---|---|
| **Net asset classification (post-ASU 2016-14)** | **Two classes: without donor restrictions / with donor restrictions.** Old 3-class system is dead. | All NFP statements. |
| **Unconditional pledges** | Recognize as contribution revenue when **promise is made**, net of estimated uncollectibles. | Revenue timing. |
| **Conditional pledges** | **No revenue until conditions are substantially met** or barrier is overcome. | Revenue timing. |
| **Multi-year pledges** | Present value at the date the pledge is made; subsequent accretion is **contribution revenue, not interest income**. | Initial measurement. |
| **Donated services** | Recognize only if (a) they create/enhance a nonfinancial asset, **or** (b) they require **specialized skills** that would have been purchased otherwise. | Revenue & expense. |
| **Donated materials** | Recognize at **fair value** at the date of donation. | Revenue & asset. |
| **Collections** | NFPs **may elect** to capitalize or not, as long as the items are held for public exhibition, protected/preserved, and subject to a policy requiring proceeds of sale to fund acquisition of new collection items. | Asset recognition. |
| **Endowment income** | Donor-restricted unless donor specifies otherwise; underlying corpus is permanently restricted (with donor restrictions). | Net asset class. |
| **Investment return on donor-restricted endowment** | **With donor restrictions** unless the donor explicitly says otherwise (the so-called "UPMIFA default"). | Net asset class. |
| **Functional expense classification** | Required: **program services** and **supporting activities** (management & general, fundraising, membership development). All NFPs must present. | Functional expense statement. |

### 14.14 Governmental Defaults

| Topic | Default | Why it matters |
|---|---|---|
| **Measurement focus — governmental funds** | **Current financial resources.** | What's reported as an asset/liability. |
| **Measurement focus — proprietary funds and government-wide** | **Economic resources.** | Full accrual. |
| **Basis of accounting — governmental funds** | **Modified accrual** (revenues when measurable and available; expenditures when liability incurred). | Recognition timing. |
| **Basis of accounting — proprietary funds and government-wide** | **Full accrual.** | Recognition timing. |
| **Available** (modified accrual) | Generally collectible within the period or **soon enough after period-end** to pay liabilities (commonly 60 days for property taxes). | Property tax recognition. |
| **Capital assets in governmental funds** | **Not reported as assets.** Acquisition is an expenditure. Reported in government-wide statements only. | Where the asset shows up. |
| **Long-term debt in governmental funds** | **Not reported as a liability.** Issuance is "other financing source." Reported in government-wide statements only. | Where the debt shows up. |
| **Encumbrances** | Recorded for governmental funds when commitments are made; reverse at year-end if intent is to honor next year. | Fund balance reservation. |
| **Fund balance categories** | Nonspendable / Restricted / Committed / Assigned / Unassigned (NRCAU). | Fund balance display. |
| **GASB hierarchy** | GASB → GASB ITGs/Implementation Guides → AICPA literature cleared by GASB → other accounting literature. | When source not explicit. |

### 14.15 IFRS vs US GAAP Defaults (Switch Points)

When a stem mentions "under IFRS" or "the company prepares financial statements under IFRS," flip these defaults. Otherwise, US GAAP applies.

| Topic | US GAAP default | IFRS default |
|---|---|---|
| LIFO | Permitted | **Prohibited** |
| Inventory write-down reversal | Not permitted | Permitted (up to original cost) |
| PP&E subsequent measurement | Cost model | Cost or **revaluation model** |
| Impairment | Two-step, undiscounted CF first | One-step, recoverable amount |
| Impairment reversal | Prohibited | Permitted (except goodwill) |
| Development costs | Expense | **Capitalize if 6 criteria met** |
| Interest on SOCF | Operating | **Operating or financing** |
| Dividends paid on SOCF | Financing | **Operating or financing** |
| Range of loss contingency | Low end if no amount better | **Midpoint** |
| Convertible debt | Single instrument (post-2020-06) | **Split between liability and equity** |
| Bank overdrafts | Financing | **Cash and cash equivalents** if integral to cash management |
| Extraordinary items | Eliminated (since 2015) | Prohibited |

### 14.16 Fair Value Measurement (ASC 820) Defaults

| Topic | Default | Why it matters |
|---|---|---|
| **Definition of fair value** | **Exit price** (price to sell the asset / transfer the liability) in an orderly transaction between market participants at the measurement date. Not entry price, not entity-specific value. | All FV measurements. |
| **Principal market** | The market with the **greatest volume and activity** for the asset/liability. Use the principal market's price even if a better price exists elsewhere. | Which price to use. |
| **Most advantageous market** | Used **only if there is no principal market**. | Which price to use. |
| **Highest and best use** | For nonfinancial assets, FV reflects **highest and best use** from a market-participant perspective, not the entity's intended use. | Nonfinancial asset measurement. |
| **Hierarchy** | **Level 1** (quoted prices in active markets for identical assets) > **Level 2** (observable inputs other than L1) > **Level 3** (unobservable inputs). Use lowest-level input that is significant. | Disclosure. |
| **Transaction costs** | **Not included** in fair value. (They are considered in determining the most advantageous market but not in the FV measurement itself.) | FV amount. |

### 14.17 Other Recurring Silent Defaults

| Topic | Default | Where it bites |
|---|---|---|
| **Tax year / reporting period** | **Calendar year** (Jan 1–Dec 31), annual, comparative with prior year. | All Year N references. |
| **Currency / functional currency** | **US dollars.** Unless stated otherwise. | Foreign currency translation. |
| **Going concern** | **Assumed.** Disclosure required only if substantial doubt exists. | Asset valuation basis. |
| **Materiality** | Item is material unless the stem says "immaterial." | Whether to record. |
| **Cash equivalents** | Investments **≤3 months to maturity when purchased**. T-bills with 6-month original maturity → NOT cash equivalents. | Cash classification. |
| **Accrual basis** | **Assumed for GAAP entities.** Cash basis is a special-purpose framework. | All revenue/expense timing. |
| **Allowance for doubtful accounts method** | **None assumed.** Stem must specify — percentage-of-sales (income statement approach) or aging-of-receivables (balance sheet approach). | Bad debt expense calc. |
| **Specific identification** | Used for **unique, large-dollar items** (real estate, custom equipment). Default for fungible inventory is one of FIFO / LIFO / weighted-average. | Cost flow assumption. |
| **Bond covenant violation** | Reclassify the debt as **current** unless the lender has waived the right to call. | Current vs noncurrent. |
| **Subsequent events Type 1 (recognized)** | Conditions existed at balance sheet date → **adjust** the financial statements. | Year-end recognition. |
| **Subsequent events Type 2 (non-recognized)** | Conditions arose after balance sheet date → **disclose only**. | Footnote only. |
| **Pension expense components** | Service cost → **operating**. All other components (interest, expected return, amortization of PSC, gains/losses) → **non-operating, below operating income**. | Income statement presentation. |
| **Pension funded status** | PBO − plan assets at fair value → single net asset or liability on balance sheet. | Balance sheet line. |
| **Discontinued operations definition** | Disposal of a **component** of an entity that represents a **strategic shift** with a major effect on operations and financial results. A single fixed asset is not enough. | Where the gain/loss goes. |
| **Component of an entity** | An operating segment, reportable segment, reporting unit, subsidiary, or asset group whose operations and cash flows can be clearly distinguished. | Discontinued ops eligibility. |
| **Comprehensive income components** | Net income + OCI. OCI = **PUFI**: **P**ension adjustments, **U**nrealized gains/losses on AFS debt securities, **F**oreign currency translation, **I**nterest-rate hedges (cash flow hedges). | OCI vs NI classification. |
| **Foreign currency translation method** | Functional currency = local → **current rate method** (translate B/S at year-end rate, I/S at average rate, gain/loss to OCI/CTA). Functional currency = USD → **remeasurement** (monetary items at year-end rate, nonmonetary at historical, gain/loss to NI). | Where the FX gain/loss goes. |
| **Statement of changes in equity** | Required as a basic statement. | One of the basic financials. |
| **Form 10-K vs 10-Q** | 10-K = annual, audited. 10-Q = quarterly, reviewed (not audited). 8-K = current material events. | SEC reporting questions. |
| **Filing deadlines (large accelerated filer)** | 10-K: 60 days. 10-Q: 40 days. 8-K: 4 business days. | SEC reporting questions. |
| **First-time IFRS adopter** | Apply IFRS retrospectively as if always used; restate comparative period. | IFRS 1 questions. |
| **Interim reporting** | Each interim period viewed as an **integral part of the annual period** (US GAAP). Discrete view used only for certain items (e.g., taxes are based on annual effective tax rate). | Quarterly recognition. |
| **Segment reporting threshold** | Report a segment if it meets any of: revenue ≥10% of total, profit/loss ≥10% of greater of combined profits or combined losses, assets ≥10% of total. Plus the 75% reportable-segments rule. | Which segments disclose. |

### 14.18 How to Weaponize Defaults in Question Writing

When authoring a new MCQ:

1. **Pick a default from §14.1–14.17.**
2. **Write a stem that is deliberately silent** on the controlling fact.
3. **The correct answer assumes the default.** The distractors assume the alternative (e.g., the stem doesn't say "cumulative," the correct answer treats preferred as noncumulative, the distractor treats it as cumulative).
4. **The explanation cites the default rule explicitly.** "When the question is silent on whether preferred stock is cumulative, treat as noncumulative. Therefore, undeclared dividends do not accumulate, and the EPS numerator is reduced only by dividends declared."
5. **Test difficulty escalates** by stacking defaults: a Brutal-tier question forces the candidate to apply 2–3 silent defaults in one fact pattern (e.g., a lease question where the implicit rate isn't given, the lease term has options of uncertain certainty, and the lessee is a private company eligible for the risk-free rate election).

This is the engine room of the exam. The Blueprint tells you *which topics* are tested; the defaults tell you *how* they're tested. Every commercial review course pours its real teaching energy here, even when they don't call it out by name.

---

## 15. Task-Based Simulations (TBSs) — Their Own Pattern Universe

TBSs are not "long MCQs." They're a separate question class with their own architecture, response format, scoring model, and trap mechanics. The FAR section delivers **7 TBSs across two testlets** after the MCQs are done. Each TBS represents ~5–15 minutes of work and is worth roughly the same as a chunk of the MCQ section.

This section catalogs the patterns. Methodology: structural and quantitative analysis of 121 sample TBSs across F1–F6 (~695 pages of screenshots and answer keys).

### 15.1 The Six TBS Response Formats

Every FAR TBS uses one of these six response formats. Memorize which formats live in which modules.

| # | Format | What the candidate does | Most common in |
|---|---|---|---|
| 1 | **Form-completion grid** | Fill rows of a multi-row table (account name + amount). Most rows pre-filled; candidate fills the rest. | F1 (income statement, balance sheet, comprehensive income), F2 (revenue), F5 (cash flows, consolidations), F6 (NFP statements) |
| 2 | **Journal-entry grid** | For each transaction, fill account name (drop-down) + debit + credit. Multiple rows per entry. | F2 (AJEs, error corrections), F4 (bonds, leases), F5 (financial instruments, equity method) |
| 3 | **Multi-account adjustment grid** | Given a trial balance / subsidiary ledger, post adjustments to specific accounts and compute new balances. | F3 (cash recon, inventory cutoff, PP&E rollforward), F5 (consolidation workpapers) |
| 4 | **Calculation grid (numeric only)** | Fill numeric cells only (no drop-downs). Often comparative-year columns. | F1 (EPS), F4 (bond amortization), F5 (income taxes), F6 (governmental fund balance) |
| 5 | **Drop-down classification grid** | For each item, pick from a drop-down (e.g., "Operating / Investing / Financing"; "Current asset / Long-term asset / Liability"; "With donor restrictions / Without donor restrictions"). | F5 (SOCF classification), F6 (NFP net-asset classification), F2 (subsequent events: recognize vs disclose) |
| 6 | **Document Review Simulation (DRS)** | Read a draft document (financial statement, footnote, memo); for each highlighted item pick: "No change / Replace with X / Delete." Mixed numerical and textual edits. | F2 (footnote disclosures), F3 (PP&E disclosures), F5 (cash flow narrative), F6 (NFP MD&A) |

There is also a **Research tab** that historically appeared on one TBS per testlet and required typing or selecting an exact ASC citation (e.g., "ASC 606-10-25-1"). Per recent AICPA blueprint updates, Research was removed from the FAR core. **Do not include Research tabs in the ACED bank** unless the AICPA reintroduces them.

### 15.2 The Anatomy of a FAR TBS

Every TBS follows this 7-component architecture:

```
┌─────────────────────────────────────────────────────────────┐
│ A. TBS ID                  (e.g., "TBS-029006")             │
│ B. Skill tag               (Application or Analysis)        │
│ C. Module header           (F1.M1 - Balance Sheet, IS, CI)  │
│ D. Exhibit panel           (3-7 clickable exhibits)         │
│ E. Instruction sentence    (1-3 sentences, top of task)     │
│ F. Response area           (grid / form / DRS / journal)    │
│ G. Submit button           (single submission)              │
└─────────────────────────────────────────────────────────────┘
```

#### A. TBS ID
Numeric identifier `TBS-NNNNNN`. We use our own `ACED-TBS-NNNN` scheme — never reproduce a third-party ID.

#### B. Skill tag (this is the hidden Blueprint signal)
The AICPA Blueprint tags every TBS at one of two cognitive levels:

- **Application** — execute a known procedure with given inputs (~80% of FAR TBSs). The candidate isn't synthesizing; they're applying a rule.
- **Analysis** — decompose a complex scenario, reconcile conflicting facts across exhibits, identify what's wrong with a draft (~20% of FAR TBSs, concentrated in DRS-format tasks).

When writing a new TBS, **tag it** with the intended skill level. Application tasks have one right answer per cell; Analysis tasks accept a narrower set of correct moves but require more reasoning.

#### C. Module header
Format: `F[1-6].M[1-N] - <Module Name>`. The 38 FAR modules and their TBS-frequency distribution (from the 121-sample corpus) are:

| Section | Top TBS-heavy modules (count in corpus) |
|---|---|
| F1 | M1 Balance Sheet/IS/CI (7), M2 EPS & Public Reporting (4), M3-M4 Stockholders' Equity (4) |
| F2 | M1 Revenue (8), M2 Accounting Changes & Errors (7), M7 Special Purpose Frameworks (7), M3 AJEs (4) |
| F3 | M3 Inventory (10), M4 PP&E Cost Basis (8), M5 PP&E Depreciation/Disposal/Impairment (6), M2 Trade Receivables (6), M1 Cash (5) |
| F4 | M7 Lessee Accounting (5), M5 Bonds Part 2 (3), M1 Payables (3), M3 LT Liabilities (3) |
| F5 | M1 Financial Instruments (8), M5 Statement of Cash Flows (7), M7 Income Taxes Part 2 (4), M4 Partnerships (4), M3 Consolidated FS (3) |
| F6 | M1 NFP Reporting Part 1 (4), M3 NFP Revenue Recognition (3) |

**Inventory (F3.M3), Revenue (F2.M1), and Financial Instruments (F5.M1) are the most-tested TBS topics.** Allocate ACED's TBS bank weight accordingly.

#### D. Exhibit panel
The exhibits are the most important pattern. Every FAR TBS has **3-7 clickable exhibits** at the top of the screen. The candidate must read multiple exhibits and **reconcile information across them** to solve the task. Common exhibit types and their frequency in the corpus:

| Exhibit type | Corpus hits | What it contains | Common trap |
|---|---|---|---|
| **Note / Footnote draft** | 60 | A draft footnote disclosure with errors | DRS-format edits |
| **General Ledger / Trial Balance** | 43 | Raw accounting data | Misclassified accounts; the candidate must reclassify |
| **E-mail from accountant / auditor / controller** | 37+3 | Casual prose hiding 1-3 critical accounting facts | A throwaway sentence ("By the way, we forgot to record…") is a required adjustment |
| **Invoice / Vendor statement** | 19 | Specific transaction details | FOB terms hidden in fine print; cutoff issues |
| **Subsidiary Ledger Report** | 16 | Detailed account activity | Reconciliation between sub-ledger and GL |
| **Letter from public accounting firm / auditor** | 14 | Formal correction or audit adjustment | Authoritative — overrides the GL |
| **Calc / Worksheet / Spreadsheet** | 13 | Partial computation | A formula that's slightly wrong |
| **Lease Agreement** | 11 | Lease terms (implicit rate, term, options) | The candidate must extract the discount rate; if implicit not given, must use IBR (see §14.3) |
| **Memo (internal)** | 8 | Management's intent or policy change | Reveals a "strategic shift" → discontinued ops |
| **Bank Statement / Reconciliation** | 6+3 | Cash and bank activity | Outstanding checks, deposits in transit, NSF, bank errors |
| **Contract (customer / supplier)** | 6 | Performance obligations, payment terms | Variable consideration, financing component, principal vs agent |

**Pattern: there is always at least one exhibit whose information conflicts with the trial balance or draft document.** The whole point of TBS is forcing the candidate to integrate information across documents. ACED TBSs should follow this rule: include at least one "correction-bearing" exhibit per task.

#### E. Instruction sentence
Always 1–3 sentences. Always begins with one of these verbs (frequency in corpus):

| Verb | What it signals |
|---|---|
| `Using` / `From` | Reference-the-exhibits framing |
| `Select` | Drop-down format |
| `Enter` | Numeric-cell format |
| `Complete` | Form-completion grid |
| `Determine` | Calculation grid |
| `Calculate` | Calculation grid (math-heavy) |
| `Indicate` | Yes/No or category drop-down |
| `Prepare` | Journal entries or full statement |
| `Adjust` / `Record` | Adjustment / journal-entry grid |
| `Classify` | Classification grid |
| `For each` | Iterative task across rows |

Tone: terse, declarative, present tense. Always describes the exact response format. Always tells the candidate what to enter in negative-number cells (e.g., "Numbers to be subtracted must be entered as negative numbers").

#### F. Response area
The grid is the heart of the TBS. Conventions:

- **Pre-filled rows.** Roughly 30–60% of cells are pre-filled with correct values to anchor the candidate. They cannot be edited.
- **Editable cells are flagged** with icons (drop-down vs numeric input).
- **Negative numbers** entered in parentheses on display, with leading `-` accepted on input.
- **Blank rows allowed.** If an item doesn't belong in the schedule, leave the row blank or zero.
- **No partial credit on a single cell** — the cell is either right or wrong. Across a task, every correct cell earns its share of the points; this is why **easy-to-get cells are pre-filled** (to test the harder ones).

### 15.3 TBS-Specific Trap Mechanics (Different from MCQ)

MCQ traps are single-choice gotchas. TBS traps are **multi-exhibit reconciliation traps**. The most common TBS-specific traps in the corpus:

| # | TBS-Specific Trap | What it looks like |
|---|---|---|
| 1 | **Email throwaway adjustment** | A casual email ("Oh, btw, we forgot to record the unrealized gain on equity securities of $10,000") contains a required adjustment buried in conversational prose. The candidate who skims the email misses it. |
| 2 | **Auditor letter override** | A formal letter from the auditor identifies an error in the trial balance. The TB is wrong; the auditor's letter governs. The candidate must journalize the correction. |
| 3 | **FOB / cutoff trap in invoice exhibit** | The invoice exhibit shows "FOB destination" or "FOB shipping point" in fine print. The candidate must adjust year-end inventory. |
| 4 | **Implicit rate vs IBR in lease exhibit** | Lease Agreement gives the implicit rate; the trial balance was computed with IBR. The candidate must recompute with the implicit rate (per §14.3 default). |
| 5 | **Note-disclosure error in DRS** | A draft footnote mis-states an amount or applies an old rule (e.g., uses three-class net-asset language for an NFP). The candidate selects "Replace with…" |
| 6 | **Conflicting exhibits force a choice** | E-mail says inventory was $100K; subsidiary ledger says $97K; the candidate must pick which is authoritative. Usually the subsidiary ledger wins unless the email is from the auditor or controller. |
| 7 | **Pre-filled total is a lie** | The form shows "Net income = $0" pre-filled (placeholder), and the candidate's job is to compute and enter the correct amount. The "$0" is not "the answer" — it's a UI default. |
| 8 | **Cross-period restatement** | The task gives Year 1 and Year 2 data; an error discovered in Year 2 requires restating Year 1 comparative information. The candidate must apply ASC 250 retrospectively. |
| 9 | **Tax rate mismatch** | Trial balance uses 21% tax rate; "Other Information" exhibit says enacted future rate is 25%. The candidate must use 25% for DTA/DTL measurement (per §14.7 default). |
| 10 | **Functional currency surprise** | An exhibit notes the foreign sub's functional currency is USD (not local), so the candidate must remeasure, not translate. Reverses the SOCF/OCI classification. |
| 11 | **"Ignore tax effects" instruction** | The instruction sentence sometimes says "Ignore tax effects." Reading too fast → candidate net-of-tax everything and gets it wrong. |
| 12 | **Held-for-sale criteria buried in memo** | An internal memo describes a planned divestiture. The candidate must determine whether the 6 held-for-sale criteria are met before classifying as discontinued operations. |

### 15.4 Pre-fill Strategy (How Examiners Decide What to Give)

Pattern recognized in the corpus:

- **Pre-fill the easy / direct-from-TB rows.** Net sales, cost of sales, interest expense — these come straight from the trial balance and are typically given.
- **Leave blank the rows that require judgment, reclassification, or computation.** Discontinued operations, OCI components, deferred tax, gain on extinguishment of debt, EPS denominator.
- **Force the candidate to insert rows** for items the TB doesn't show (e.g., an unrealized gain disclosed in an auditor letter that's missing from the TB).
- **Pre-fill subtotals as "$0"** so the candidate sees the structure but must compute and override.

When writing an ACED TBS:
1. Build the full correct grid first.
2. Pre-fill 40–60% of cells (the easy ones).
3. Blank the cells that test the §14 defaults or the §15.3 traps.
4. For Application tasks, the blanked cells are computational. For Analysis tasks, they require multi-exhibit reconciliation.

### 15.5 Scoring & Difficulty Calibration for TBSs

The AICPA does not publish exact scoring rubrics, but recovered from sample behavior:

- **Each editable cell is one scored point.** A 10-cell grid is worth 10 cell-points.
- **No partial credit per cell.** Either the cell matches the expected value (with tolerance for monetary roundings) or it doesn't.
- **Cells are weighted equally within a TBS.** A pre-filled "$0" cell that the candidate overrides correctly is worth the same as a tricky FX remeasurement cell.
- **Total points per TBS** roll into the section-level score. A 7-TBS testlet is worth ~50% of the FAR score (the other half is MCQs).

For ACED's TBS bank:
- Easy TBS: 5–8 editable cells, all Application-level, single-step computations
- Medium TBS: 8–12 editable cells, mix of Application and one Analysis cell, 2–3 exhibits
- Hard TBS: 12–20 editable cells, Analysis-heavy, 4–5 exhibits with at least one reconciliation conflict

### 15.6 Exhibit-Writing Conventions

When authoring an exhibit, follow these conventions from the corpus:

| Exhibit type | Voice / format | Required elements |
|---|---|---|
| **E-mail** | First-person, casual, signed by an internal accountant | From, To, Sent date, Subject, body with 1-3 numbered "questions/answers" |
| **Auditor letter** | Third-person formal, signed by a "senior associate" at "XYZ Accounting" | To, From, Re, single bulleted correction, professional sign-off |
| **Trial balance** | Two-column (Debit / Credit), accounts in standard order (assets → liabilities → equity → revenue → expenses) | Header with company name, year-end date, columns labeled |
| **Lease agreement (excerpt)** | Legal style, bullet list of terms | Commencement date, term, payment amount, payment timing, residual value, implicit rate if known, options |
| **Footnote (draft for DRS)** | Same prose voice as real financial statements, contains 3-8 highlightable items | Title (e.g., "Discontinued Operations"), 3-6 sentences mixing prose and amounts, errors planted in 30-50% of highlighted items |
| **Bank statement** | Standard bank-statement layout | Period beginning / ending balance, deposits, checks paid, fees, ending balance |
| **Invoice** | Standard invoice layout | Vendor, invoice date, payment terms, FOB terms (the trap), line items |
| **Memo (internal)** | Stylized memo format, third-person formal | To, From, Re, Date, body with strategic decision |

### 15.7 Module-Specific TBS Patterns

#### F1 (Conceptual / Statements)
Almost always **form-completion** of an income statement, balance sheet, or comprehensive income statement. The trap is **classification** (continuing vs discontinued; net income vs OCI; operating vs non-operating). Heavy use of email + auditor letter as adjustment vehicles. EPS TBSs (F1.M2) are pure **calculation grids** comparing basic vs diluted.

#### F2 (Revenue, Changes, AJEs, Subsequent Events, SPF)
Mix of **journal-entry grids** (AJEs, error corrections) and **DRS** (footnote disclosure drafts). Revenue TBSs (F2.M1) involve **percentage-of-completion** or **variable consideration constraint** computations across multiple periods. Error correction TBSs (F2.M2) require knowing **retrospective vs prospective** treatment.

#### F3 (Cash, AR, Inventory, PP&E, Intangibles)
Heaviest module range in the corpus (~37 of 121 TBSs). **Multi-account adjustment grids** dominate. Cash TBSs (F3.M1) use **bank-reconciliation grids** with subsidiary ledger conflicts. Inventory TBSs (F3.M3) involve **FOB cutoff**, **LCNRV write-downs**, and **cost-flow method swaps**. PP&E TBSs (F3.M4, F3.M5) use **rollforward grids** (beginning balance + acquisitions + disposals + depreciation = ending balance).

#### F4 (Liabilities, Leases, Bonds)
Lease TBSs (F4.M7) require **building the amortization schedule** and computing ROU asset + lease liability at year-end. Bond TBSs (F4.M5) require **effective-interest amortization** over multiple years. **Journal-entry grid** format dominates.

#### F5 (Financial Instruments, Consolidations, Partnerships, SOCF, Income Taxes)
Most diverse section. Financial instrument TBSs (F5.M1) use **journal-entry grids** for trading / AFS / HTM classification. SOCF TBSs (F5.M5) use **drop-down classification grids** for operating / investing / financing categorization plus a calculation grid for the indirect-method reconciliation. Income tax TBSs (F5.M6, F5.M7) require **tax rate reconciliation** and **DTA/DTL computation**.

#### F6 (NFP, Governmental)
NFP TBSs use **form-completion grids** for the Statement of Activities (without donor restrictions / with donor restrictions columns). Donor restriction classification is the trap. Governmental TBSs use **fund-by-fund reporting grids** and test the measurement focus + basis of accounting defaults from §14.14.

### 15.8 ACED TBS Authoring Workflow

For every TBS:

1. **Pick a module** weighted by §15.2 corpus distribution (F3.M3 inventory and F2.M1 revenue should get the most TBSs).
2. **Pick a response format** from §15.1 appropriate to the module.
3. **Pick a Bloom level** — 80% Application, 20% Analysis.
4. **Outline the fact pattern.** Identify which §14 defaults will be tested (silent on cumulative? silent on cost-flow? silent on implicit rate?).
5. **Build the exhibits.** Minimum 3, maximum 7. At least one must be a **conflict-bearing exhibit** (an email or auditor letter that overrides the trial balance).
6. **Plant 1–3 traps from §15.3** appropriate to the module.
7. **Build the correct solution grid.** Pre-fill 40–60% of cells using §15.4 strategy.
8. **Write the instruction sentence** using §15.2.E conventions.
9. **Tag with module ID** (e.g., `ACED-TBS-F3M3-014`) and Bloom level (Application / Analysis).
10. **Verify checklist:**
    - [ ] All amounts and account names are original (not lifted from any third-party material).
    - [ ] No exhibit, footnote, or instruction is paraphrased from any commercial review provider.
    - [ ] Solution grid is internally consistent (every total ties).
    - [ ] At least one exhibit conflict exists.
    - [ ] At least one §14 silent default is exploited.
    - [ ] Instruction sentence specifies the exact response format (parens, negative numbers, dropdown source).

### 15.9 What This Section Is *Not*

Same as §12: this is structural analysis only. No third-party TBS, exhibit text, footnote, or solution is reproduced or paraphrased. The corpus is read solely to extract abstract format patterns and trap mechanics, both of which are uncopyrightable per *Sega v Accolade* and the merger doctrine (§1).

Last updated: June 20, 2026.
