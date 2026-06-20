# MCQ Batch 03 — Claude Generator-Driven · Review & Integration

**Files added this batch:**
- `packs/originals/far-bank-generator-02.js` — Node.js generator script (188 lines)
- `packs/originals/far-original-batch-03.js` — Generator output (252 MCQs, ~3,300 lines)
- `packs/originals/far-tbs-batch-02.js` — 4 additional TBSs (renderer still pending)

**Authored:** 2026-06-20 by Claude (machine-generated from rule + formula templates)
**Status:** Drafts — verify each rule once against current ASC

---

## What Claude Did Differently This Round

Instead of hand-writing 20 more MCQs, Claude wrote a **generator script** that produces hundreds of original MCQs from:

- **Conceptual tables** (rule → correct rule statement → 3 engineered-error distractors) replicated across multiple invented entity names. Six tables: Revenue Recognition (ASC 606), Lease Classification, Consolidations / Business Combos, Governmental Funds, Not-for-Profit, Partnerships.
- **Computational templates** — parametrized formulas that vary inputs across realistic ranges. Six computations: Goodwill, Capitalized Interest, Intercompany Inventory Profit, SSP Allocation, Quid Pro Quo, Pledge Allowance.

**This is a 10x output multiplier.** The generator can be re-run with new parameter ranges to produce more. The pattern is reusable for the rest of FAR (and eventually AUD/REG/BEC).

## Stats — Batch 03 Output

| Metric | Value |
|---|---|
| Total MCQs | 252 (zero dupes, zero malformed) |
| Letter distribution | A/B/C/D = 63 each (perfect) |
| Difficulty mix | 134 medium / 118 hard |
| Modules covered | F2.M1 (60), F3.M5 (21), F2.M6 (92), F2.M4 (30), F4.M4 (49) |
| Avg stem length | 197 chars (range 67-321) |
| Conceptual mismatches | 0 (all answer/explain pairs verified) |
| Negative-dollar choices | 16 items use them as distractors — 0 as live answers |

## Quality Assessment

**Strengths:**
- Schema is engine-native (`{source, diff, q, choices, answer, explain}`)
- Append-safe (`window.ACED_QUESTIONS.concat([...])`)
- Engineered-error distractors are real exam traps: "omits the NCI", "uses cost not fair value", "applies markup to selling price", etc.
- Goodwill formula is correct: `consideration + FV of NCI − FV of identifiable net assets` (full goodwill method, U.S. GAAP)
- Capitalized interest correctly caps at actual interest (template enforces it)
- Intercompany markup correctly converts markup-on-cost to gross-margin-on-price
- SSP allocation correctly uses relative standalone selling prices

**Weaknesses (fixable):**
- Conceptual items' `explain` field is thin: `"Correct: <restated answer>."` — no per-distractor explanations. Computational items have richer explanations.
- Some module assignments are imprecise (e.g. Governmental → `F4.M4` is technically Income Taxes module in our pack; should be a new GASB module). Same for NFP — both lumped in `F4.M4`. We may need to add module keys to `cpa-far.js`.
- 92 of 252 items land in `F2.M6` (Investments) — heavy because consol + equity + intercompany + goodwill all routed there. Engine should still sample fine, but worth rebalancing later.
- Names overlap with Batch 02 (Saxe, Poe, Pard, Vance) — minor cosmetic.

**No rewrites required to ship as drafts.**

## TBS Batch 02 (4 new sims)

| # | Title | Module | Type |
|---|---|---|---|
| 1 | Income Tax Provision — Current / Deferred / Effective | F4.M4 | numeric × 4 + select × 1 |
| 2 | Revenue — Allocation and Recognition Timing | F2.M1 | numeric × 4 + select × 1 |
| 3 | Business Combination — Goodwill & NCI | F2.M6 | numeric × 2 + select × 2 |
| 4 | Inventory — Gross Profit Estimate + LCNRV | F2.M3 | numeric × 3 + select × 1 |

**Running total: 6 TBSs across 2 batches.** Still blocked on the TBS renderer (Option A from Batch 02 review).

## Cumulative Originals

| Source | MCQs | TBSs |
|---|---|---|
| Batch 01 (mine — F2.M7) | 10 | — |
| Batch 02 (Claude — F2.M7 + scatter) | 20 | 2 |
| Batch 03 (Claude generator) | 252 | 4 |
| **Total** | **282** | **6** |

**Target to fully replace `far_combined.js` (449 third-party MCQs): ~450 originals.**
**Gap: 168 MCQs from "shippable replacement."**

## What's Next

The generator pattern unlocks fast iteration. Top priorities:

1. **Cleanup pass:** Add per-distractor explanations to the 6 conceptual tables in the generator (or post-process the JSON to enrich them) — ~1 hr work for the user-quality bar.
2. **Add missing modules to pack:** `F4.M6 Governmental` and `F4.M7 Not-for-Profit` so generator output routes correctly.
3. **Author 2-3 more generator tables** to fill thin areas — fair value hierarchy (F2.M7), pensions (F3.M5), foreign currency (F1.M3), error corrections (F1.M2). Each table = ~30-40 MCQs.
4. **Run cleanup pass on Batch 02 + 03 to remove name duplicates across batches.**
5. **Build the TBS v2 renderer** (numeric + select item types reading `window.ACED_TBS`) — required to ship the 6 sims.
6. **Wire the new banks into the engine:** add `<script src="packs/originals/...">` tags to `study.html` and the deploy template.

After steps 1-3 we should have ~400 originals and can begin retiring the third-party bank.
