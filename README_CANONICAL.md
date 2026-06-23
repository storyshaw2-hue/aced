# ACED — Canonical Files (what ships vs. what's legacy)

This repo accumulated several prototype passes. This note is the source of truth
for **what is live** and **what is leftover**, so nobody wires a dead file by mistake.

The app is static (no build step). Open `index.html` and everything is reachable
from there. State is stored in `localStorage` under `aced:<packId>:`.

---

## ✅ SHIP — the live app

| File | Role |
|---|---|
| `index.html` | Landing page. CRT study terminal; routes to a run and to the Daily Close; shows the live streak; section roadmap + email-capture scaffold. |
| `study.html` | **The game engine.** Roguelike-deckbuilder, **Close Briefing** (per-round goal, run ladder, upcoming closes), a **left-sidebar play layout** (persistent score readout, round score, counters), a **Balatro-style shop** (Next-Close/Reroll column, priced item cards, Common/Uncommon/Rare rarity badges + tier-colored borders, rarity-scaled prices) and **cash-out screen** (orange banner + itemized breakdown), a **post-boss “choose 1 of 3 Doctrines” Year-End bonus** (free pick after each Year-End close), a **Voucher system** (8 permanent run-upgrades — +slot, +hand, +discard, reroll/cost discounts, interest cap, +consumable, CPE cash — one offered per fiscal year via a shop voucher slot), a sidebar **RUN INFO hub** (active doctrines, active vouchers, deck composition, and exam-readiness % with your 3 weakest FAR modules surfaced as study guidance), a post-run **STUDY REPORT** reachable from every run-end screen (win / loss / voluntary file) showing exam-readiness %, strongest & weakest FAR modules, and the exact Audit questions missed this run — each with its correct answer, explanation, and a one-tap jump into spaced Review, a **Hands reference** + **live chips×mult score preview** + **per-card chip tip** + **sort hand**, Audit Moments, Exam Readiness, Review, Mock Exam, TBS, Daily/streak HUD, career rank pill. Self-contained (inline CSS + audio). |
| `daily.html` | The Daily Close — one date-seeded MCQ challenge per day, confidence betting, streak + freeze tokens, shareable result. |
| `aced-core.js` | Shared core: `localStorage` wrapper, analytics, confidence **calibration** (Brier), **spaced review** (Leitner-lite), **streak** reader, and the **backend** sync abstraction. Loaded before the engine. |
| `aced-progress.js` | **Career ladder + daily objectives** (meta-progression). XP-driven rank ladder (Intern → Managing Partner) and three date-seeded daily objectives, driven by a single `ACEDProgress.event(type, payload)` hook the engine calls at points it already has. Persists via `ACEDCore.store` (so it rides the existing sync). Loaded after `aced-core.js`; surfaced in `study.html` (rank pill + Daily Briefing modal), `daily.html` (anchor objective + career strip), and `index.html` (rank chip). |
| `social.js` | Run-cashout share card (end-of-run sharing). Still wired by `study.html`. |
| `packs/cpa-far.js` | The CPA·FAR content pack (`window.ACED_PACK`): cards, doctrines, modules, and the `questionBanks` list. **Single source of truth for which banks load.** |
| `packs/originals/far-original-batch-02.js` | Hand-authored MCQ bank (original). |
| `packs/originals/far-original-batch-03.js` | MCQ bank (original); all explanations rewritten; NFP/gov items correctly tagged `F4.M5`. |
| `packs/originals/far-original-batch-04.js` | MCQ bank (original); fills thin/empty modules incl. real Income Taxes. |
| `packs/originals/far-tbs-batch-01.js` / `-02.js` | Task-based simulations (`window.ACED_TBS`): 6 sims, numeric + select items. Lazy-loaded by `study.html` on first TBS open. |
| `importer.html` | "Bring your own deck" — optional secondary entry, linked from the landing footer. |
| `docs/` | Reference + specs (see `BACKEND_SPEC.md`, `GROWTH_BACKLOG.md`). |

**Total question pool:** ~317 MCQs across the three banks, covering all 19 FAR
modules (F1.M1–F4.M5). Distribution is uneven (revenue, PP&E, investments,
leases, and governmental are deepest) but every module has playable content.

> Content note: all questions and explanations are **original**, authored from the
> underlying accounting standards (GAAP/ASC) and the publicly published AICPA FAR
> blueprint — not from any commercial review provider. A CPA should still verify
> each rule against the current Codification before relying on it for the exam;
> the batch headers flag this.

---

## 🗄️ LEGACY / DORMANT — do not wire these

Superseded prototypes kept only for reference. None are loaded by the live pages.

| File | Why it's dead |
|---|---|
| `confidence.js`, `nemesis.js`, `daily.js` | Early drafts of calibration / most-missed / daily logic written against an **older question schema** (`q.topic`, `q.stem`). The real banks use `q.source` / `q.q`, so these silently no-op. **`aced-core.js` replaces all three** with schema-correct versions. |
| `extras.js` | Same schema mismatch; unused. |
| `juice.js` | Duplicate sound engine. `study.html` has its own inline Web-Audio `sfx`; `juice.js` is **not loaded** — don't add it or you'll get double audio. |
| `engine.html`, `ledger.html`, `close.html`, `library.html` | Earlier multi-page prototype of the game, superseded by the single-page `study.html`. |
| `engine.js`, `tbs_engine.js` | Earlier engine/TBS scripts, superseded by `study.html`'s inline engine and the in-engine TBS renderer. |
| `packs/far-original-batch-01.json` | Early bank format, superseded by `far-original-batch-02/03/04.js`. Not in `questionBanks`. |
| `packs/originals/far-bank-generator-02.js` | A content **generator** script, not runtime content. |

---

## How the pages boot (so edits go to the right place)

1. Each page runs a tiny **pack loader** that injects `packs/cpa-far.js`, then each
   file in `ACED_PACK.questionBanks` (which append to `window.ACED_QUESTIONS`),
   then calls the page's ready hook (`_packReady` / `_dailyReady`).
2. `aced-core.js` is loaded **before** the engine so the engine can call into it.
3. To add or reorder question banks, edit **`questionBanks` in `packs/cpa-far.js`** —
   not the individual pages.
4. To add a new exam section, copy `packs/cpa-far.js` to a new pack (see
   `packs/cpa-aud.js` for a minimal multi-section proof) and open with `?pack=<id>`.
