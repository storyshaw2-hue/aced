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
