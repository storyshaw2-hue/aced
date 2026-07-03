# ACED — Content Pipeline

_Added 2026-06-23. The scaling layer for the question banks. Companion to `STRATEGY.md`._

## Why

Questions ship as hand-edited JS (`window.ACED_QUESTIONS = (...).concat([...])`). That is
fine at 317 and breaks down at FAR→600 + five more sections + CPA errata: no validation,
no stable IDs, no way to catch a bad answer index or a duplicated stem before it reaches a
candidate. This pipeline adds a **dev-time** data layer and a linter **without changing the
static, no-build runtime** — the deployed site still just loads `.js` files.

```
author/edit  →  content/<pack>/*.json   (canonical source of truth, stable IDs)
validate     →  node tools/validate.js   (CI gate — blocks bad data)
compile      →  node tools/json-to-js.js (the ONLY build step, dev-time only)
ship         →  packs/originals/*.js      (generated; the browser loads these, unchanged)
```

Everything is **zero-dependency** (pure Node, no `npm install`) to match the repo's ethos.

## The tools

| Command | Does |
|---|---|
| `node tools/validate.js` | Lints the live banks: structure, duplicate choices/stems, near-duplicates, answer-key skew, blueprint coverage, thin/empty modules, difficulty mix. Exit 1 on any error. |
| `node tools/validate.js --json` | Same, machine-readable (for dashboards). |
| `node tools/js-to-json.js` | One-time migration: current `.js` banks → `content/cpa-far/*.json`, assigning a **stable id** per question (`cpa-far-<module>-<stemhash>`). Lossless. |
| `node tools/json-to-js.js` | Compiles `content/*.json` back to the runtime `.js`. Run after editing JSON; commit both. |

`.github/workflows/validate.yml` runs the linter on every push/PR touching `packs/`,
`content/`, or `tools/`.

### Canonical record

Field names match the runtime schema (so the round-trip is lossless and the engine never
changes), plus a stable `id` and optional `ref`:

```json
{
  "id": "cpa-far-f2m1-9a3f0c12",
  "source": "F2.M1", "diff": "medium",
  "q": "Under ASC 606, ...",
  "choices": ["...", "...", "...", "..."],
  "answer": 0,
  "explain": "...",
  "reviewed": false, "verifiedBy": null, "ref": "ASC 606-10-25"
}
```

> Migration is **opt-in and reversible**. `js-to-json` was run once to generate
> `content/cpa-far/*.json`; the live banks are still the hand-edited `.js`. When you're
> ready, switch authoring to the JSON, wire `json-to-js` into your deploy, and flip the
> commented-out drift check in the CI workflow on.

## What the linter found on the current 317 (run it yourself)

**0 errors, 22 warnings** — and the warnings point straight at the content work that matters:

1. **Severe blueprint imbalance — the headline.** F2 is **65%** of the bank vs a ~32% target;
   **F1 is 5% vs ~30%**; F3 is 9% vs ~18%. You've drilled revenue/PP&E/investments ~2× too
   hard and barely covered F1 (income statement, reporting, statement of cash flows), which is
   nearly a third of the exam. The path to "600 questions" should be **F1-first**, not more F2.
2. **~670 near-duplicate stems, almost all in F2.M1 (Revenue Recognition).** The generated
   batch produced templated variants — the same ASC 606 over-time-criteria question with a
   different company name (Welk / Marr / Oste / Penn …). A candidate notices. Collapse the
   near-clones to a handful of distinct items and reinvest the slots in F1/F3.
3. **CPA-verified badge (optional).** The engine renders a `✓ CPA-REVIEWED` badge from
   `q.reviewed`; set `reviewed:true` (+ `verifiedBy`) on items to surface it — a trust signal
   your `STRATEGY.md` can lean on.
4. **Difficulty skews hard:** 41% hard / 55% medium / **4% easy**. A few more easy items make
   early runs and the Daily Close less punishing for first-timers.
5. **Thin modules:** F1.M3 = 1, F4.M3 = 1, F1.M2 = 2.

The validator caught one accounting nuance worth noting: an early version flagged
`$100,000` vs `($100,000)` as "duplicate choices." It isn't — that's a positive vs a
parenthetical-negative (a legitimate sign-flip distractor). The choice-equality check now
preserves sign-bearing punctuation. A FAR linter has to be accounting-aware.

## Recommended next steps (content, in priority order)

1. **Rebalance toward F1** — author ~40–60 F1 items (IS, comprehensive income, notes &
   disclosures, cash flows). Biggest single lift to exam-validity.
2. **Dedupe F2.M1** — keep ~6–8 distinct revenue items; delete the templated clones.
3. **Start flipping `reviewed:true`** as items are CPA-checked; surface the count.
4. **Add easy items** until the mix is roughly 25/55/20 easy/medium/hard.
5. Re-run `node tools/validate.js` until it's clean, then keep it green in CI.
