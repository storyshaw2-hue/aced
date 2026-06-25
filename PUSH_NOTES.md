# ACED — Push Bundle (BAR build + server hardening)

This bundle contains the **13 files that changed** across this work session. Every
path here is **relative to your repo root** — unzip over your local clone and the
paths line up, then `git add -A`.

Everything has been validated against your own tooling (see "Verified" below).

---

## File manifest

### New files (6)
| Path | What it is |
|---|---|
| `packs/cpa-bar.js` | The unified **CPA · BAR** content pack — 5 suits across the 3 AICPA blueprint areas, 19 modules, 41 cards, 20 doctrines, blueprint-weighted readiness, engine-honored boss IDs. |
| `packs/originals/bar-batch-01.js` | First original BAR question bank — 20 verified MCQs, all 19 modules, 25/25/25/25 answer-key spread, includes the State & Local Gov area. |
| `server/leaderboard.js` | Pure module: `leaderboardMetrics()` clamps client-submitted readiness / streak / mockBest to sane bounds before they reach the public board. |
| `server/leaderboard.test.js` | Unit tests for the caps (run by `npm test`). |
| `tools/score-harness.js` | Headless reproduction of `study.html`'s scoring math — loads any real pack via the window shim, no DOM. |
| `tools/score.test.js` | 19 scoring tests: chip math, hand hierarchy, doctrine golden values, order-invariance, boss modifiers, fuzz. |

### Modified files (7)
| Path | What changed |
|---|---|
| `server/server.js` | Rate limiting (3 limiters: per-IP API cap, per-IP auth cap, **per-email** magic-link cap); `trust proxy: 1`; **JWT fail-closed guard** (refuses to boot in prod with a weak/default secret); `/sync` now routes leaderboard writes through `leaderboardMetrics()`. |
| `server/db.js` | Added `users.get(id)` (returns `created_at`) to **both** the SQLite and Postgres backends — the leaderboard caps need account age. |
| `server/package.json` | Added `express-rate-limit ^8.5.2`; `test` now runs `merge.test.js && leaderboard.test.js`. |
| `.github/workflows/validate.yml` | CI now validates **both** `cpa-far` and `cpa-bar`, plus runs the scoring tests. |
| `README.md` | Corrected content counts (260 MCQs / 57 TBS); reframed the importer as a manual structured builder (not AI-powered). |
| `README_CANONICAL.md` | Moved `nemesis.js` to the live table; corrected bank list + MCQ/TBS counts. |
| `library.html` | Added the `cpa-bar` pack tile (status: ready); fixed FAR's stale count (was 449 → 260) and doctrine count (30 → 40). |

---

## After you pull

```bash
# 1) install the new server dependency (regenerates package-lock.json)
cd server && npm install

# 2) (optional) run the suites locally — all should pass
npm test                                   # merge (6) + leaderboard
cd .. && node tools/validate.js --pack cpa-far   # PASS — clean
node tools/validate.js --pack cpa-bar            # PASS (1 expected "thin modules" warning)
node tools/score.test.js                         # 19/19
```

**Play BAR:** open `study.html?pack=cpa-bar` (or pick it in the Library).

Suggested commit message:

```
feat(bar): unified CPA-BAR pack + first original bank; harden server

- packs/cpa-bar.js: 5 suits / 3 AICPA areas / 19 modules / 41 cards / 20 doctrines
- packs/originals/bar-batch-01.js: 20 verified MCQs, all modules incl. Gov
- server: rate limiting (per-IP + per-email), JWT fail-closed guard, leaderboard sanity caps
- tools: headless scoring harness + 19 scoring/doctrine tests
- ci: validate cpa-far AND cpa-bar + scoring tests
- docs: correct counts (260 MCQ / 57 TBS), importer + library fixes
```

---

## Verified before bundling
- `validate.js --pack cpa-bar` → PASS; blueprint coverage 40/45/15% vs 38/44/18% targets.
- Scoring harness on the BAR pack: all 20 doctrines fire, **zero NaN/Infinity**, ×Mult order-invariance holds.
- `validate.js --pack cpa-far` → still clean; 19 scoring tests still pass.
- Server booted with a stubbed DB: `/health` OK, magic-link limiter trips on the 6th request to one email (and normalizes casing), other emails unaffected.

## Known caveats (by design — not blockers)
- **BAR bank is a seed (20 Qs).** Hence the lone "thin modules" warning. Grow toward FAR's depth as you feed materials.
- **0 / 20 CPA-reviewed.** Author-verified arithmetic, but get a licensed pass before anyone relies on it for the exam (same bar as FAR).
- **BAR TBS not wired.** The TBS loader in `study.html` is still hardcoded to the FAR banks — separate small task.
- `package-lock.json` is intentionally **not** in this bundle; `npm install` regenerates it cleanly (the sandbox couldn't build the native `better-sqlite3`, which is irrelevant since Postgres is the hosted backend).
