# MCQ Batch 02 — Claude-Authored · Review & Integration Notes

**File:** `packs/originals/far-original-batch-02.js` (20 MCQs)
**Companion TBS:** `packs/originals/far-tbs-batch-01.js` (2 TBSs — renderer pending)
**Author:** Claude (drafted from `STYLE_REFERENCE_FAR.md` + `SILENT_DEFAULTS.json` + F1-F3 / F5-F6 pattern guides)
**Authored:** 2026-06-20
**Status:** Drafts. Verify against current ASC before shipping.

---

## Snapshot

- **20 MCQs**, balanced key A=5 / B=5 / C=5 / D=5
- Mix: ~70% calc, 30% conceptual (Claude flagged that next batch will skew conceptual)
- Schema (engine-native): `{ source, diff, q, choices[4], answer:0-3, explain }`
- All `source` values are valid module keys defined in `packs/cpa-far.js`
- Append-safe: `window.ACED_QUESTIONS = (window.ACED_QUESTIONS || []).concat([...])`

## Pattern Coverage

| Items | Concept | Rule(s) tested |
|---|---|---|
| Q1 | EPS — preferred noncumulative default | A1 (HIGH priority) |
| Q2 | Treasury stock — cost method, reissue below cost, APIC-TS cascade | A2 (HIGH priority) + B10.2 |
| Q3, Q10 | Lease discount-rate hierarchy (implicit determinable) | A3 (HIGH priority) |
| Q4 | Straight-line depreciation — salvage=0 + partial year | B5.1, B5.5 |
| Q5 | R&D — special-purpose equipment expense-in-full | B6.2 |
| Q6 | Cash equivalents — ORIGINAL maturity ≤ 90 days | B3.2 |
| Q7 | Variable consideration — constraint | B1.3 |
| Q8 | Principal vs agent (net) | B1.5 |
| Q9 | Bonds — effective-interest default | B4.7 |
| Q11 | LCNRV for FIFO | B2.4 |
| Q12 | Inventory error cascade — counterbalancing | B2.7 |
| Q13 | Equity-method roll-forward | B7.2 |
| Q14 | FVTNI equity (post-ASU 2016-01) | B8.1 |
| Q15 | AFS debt — cumulative vs incremental OCI trap | B8.3 |
| Q16 | Deferred tax at enacted future rate | B14.1 |
| Q17 | Permanent difference — no deferred tax | B14.4 |
| Q18 | Asset disposal — net gain, continuing operations | B17.5 |
| Q19 | SCF — dividends paid financing / interest paid operating | B11.1 |
| Q20 | SCF indirect — reverse gain on sale | B11.3 |

Strong **silent-default weaponization** in items 1-6 — directly hits all three user-flagged top-priority rules (A1, A2, A3).

## Distractor Engineering

Every wrong choice has a named engineered error in the explanation (matches §6 of STYLE_REFERENCE_FAR.md):
- "treats it as cumulative" / "ignores the constraint" / "uses face value instead of carrying"
- "ignores partial period" / "uses IBR instead of implicit" / "includes quality control as R&D"

No throwaway/lazy distractors observed.

## Overlap With Batch 01 (mine)

| Batch 02 # | Concept | Batch 01 Q | Action |
|---|---|---|---|
| Q10 | Lease initial liability at implicit rate | Q1 (HTM — DIFFERENT concept) | No conflict — keep both |
| Q13 | Equity-method roll-forward | Q7 (substance-over-form equity) | Partial overlap; keep both (different stems/numbers) |
| Q14 | FVTNI equity treatment | Q2 (FVTNI equity treatment) | **Direct concept overlap** — keep both (different facts) |
| Q15 | AFS cumulative OCI trap | Q3 (AFS cumulative OCI trap) | **Direct concept overlap** — keep both (different numbers; both are good practice) |

**Decision:** Keep all overlaps. Both batches teach the same rule with different facts, which builds robustness. No two questions are textually similar.

## TBS Batch (separate file)

`far-tbs-batch-01.js` contains 2 TBSs:
1. **Lease Initial Measurement Year 1** (F3.M5) — 5-item roll-forward, weaponizes A3
2. **Equity-Method Two-Year Roll-Forward** (F2.M6) — 5-item, weaponizes equity-method math

**Schema:** `{ source, diff, title, scenario, items:[{prompt, type:"numeric"|"select", answer, tolerance|choices, explain}] }`

**Blocker:** The current engine renders MCQs only. `study.html` reads `window.ACED_QUESTIONS`; `tbs.js` uses a different `TBS_LIBRARY` schema (third-party vendor-derived cells/exhibits). To ship these:

**Option A** — Build a generic TBS renderer for Claude's schema:
- New file `tbs_v2_engine.js` reads `window.ACED_TBS`
- Renders numeric input or 4-choice select per item
- Scores correct/total → multiplier
- ~2-3 hrs work

**Option B** — Convert Claude's TBS schema into the existing `TBS_LIBRARY` schema:
- Manual rewrite, less DRY but works in current engine
- ~30 min per TBS

**Option C** — Park the TBSs as drafts, ship MCQs first.

**Recommendation:** Option C for now; revisit after we get the MCQ bank to ~150+ originals.

## third-party vendor Replacement Status

Live bank `far_combined.js` still contains 449 third-party vendor MCQs. Per user directive ("i dont want any third-party vendor stuff in the app"), this must be replaced.

**Originals to date:** 30 MCQs (10 mine + 20 Claude)
**Target before flip:** ~400-500 to credibly replace `far_combined.js`
**Path:** Continue alternating Claude + me, batch-by-batch, until we can fully swap.

## Quality Assessment

Claude's work is **shippable as drafts**. No third-party vendor text reproduced. All silent-defaults tested in items 1-6 hit the user-flagged priority rules. Distractor engineering is clean. Letter distribution is perfectly balanced. Naming convention (one-syllable invented entities: Orr, Pell, Sten, Dax, Quill, Brae, Vance, Mott, Pard, Crane, Tine, Lure, Saxe, Poe, Yarn, Stent, Roth, Gray, Nilo) matches our style.

**Minor flags:**
- Q3 says "not eligible for any private-company elections" — slightly awkward but technically clean
- Q15 (AFS) is a hard item but the explanation is crystal clear
- All items would benefit from a CPA pass-through before shipping (Story)

**No rewrites required for repo integration.**
