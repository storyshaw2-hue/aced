# ACED

> A roguelike-deckbuilder study engine for big professional exams. Drop in study
> material (questions, blueprints, notes) and ACED turns it into a Balatro-style
> run — cards, jokers, boss "Audit Moments", score multipliers — wrapped around
> real spaced-repetition, confidence calibration, and exam-readiness tracking.
> Live: **https://acedhq.com**

---

## TL;DR for anyone (or any AI) reading this repo

- **What it is:** a 100% client-side, no-build static web app (vanilla HTML/CSS/JS, ES5-style IIFEs). Open an `.html` file and it runs. There is **no framework, no bundler, no transpile step.**
- **Primary product:** a CPA **FAR** exam trainer (`study.html`) plus a shared **Daily Close** challenge (`daily.html`). The engine is content-agnostic and can host any exam via a "pack".
- **Persistence:** browser `localStorage` by default. An **optional** reference backend in `server/` (Express + SQLite + Stripe + JWT) adds cross-device sync and billing, but the app is fully functional and 100% local until you set `window.ACED_API_URL` in `aced-config.js`.
- **Content:** 260 original MCQs across 19 FAR modules + 57 task-based simulations (TBS). All original / blueprint-derived — **no paid-prep-vendor question text** is included. _(MCQ count tracks `node tools/validate.js`.)_
- **No secrets in the repo.** `.env` is gitignored; only `server/.env.example` (placeholders) is committed.

If you only read three files to understand the system: **`aced-core.js`** (data model), **`study.html`** (the game loop), and **`packs/cpa-far.js`** (the content pack format).

---

## Architecture at a glance

```
Browser page (e.g. study.html)
  │  loads, in this order:
  ├─ aced-config.js     → optional window.ACED_API_URL toggle (commented out = local-only)
  ├─ aced-core.js       → window.ACEDCore: storage, analytics, calibration, review (SRS), streak, sync
  ├─ aced-account.js    → window.ACEDAccount: sign-in + cloud sync glue (no-op until API_URL set)
  ├─ aced-progress.js   → window.ACEDProgress: per-module mastery / "Exam Readiness"
  ├─ aced-fx.js         → window.ACEDFX: SFX, particles, combo engine, achievements, share grid (v2)
  ├─ social.js          → window.ACEDSocial: share-text helpers
  ├─ nemesis.js         → window.ACEDNemesis: adaptive-difficulty boss derived from your miss data
  └─ pack + question banks (packs/cpa-far.js + packs/originals/*.js → window.ACED_QUESTIONS)

Optional server/ (only if you deploy it and set ACED_API_URL):
  Express API → SQLite (better-sqlite3) → JWT auth, Stripe billing, state sync, leaderboard
```

Each module is a self-contained IIFE that attaches one global to `window` and degrades gracefully (wrapped in try/catch; tolerates missing DOM nodes and sandboxed/storage-less environments).

---

## Run it locally

No build step. Either:

```bash
# simplest: open the file
open index.html              # macOS

# or serve the folder (recommended; avoids file:// fetch limits)
python3 -m http.server 8000  # then visit http://localhost:8000
```

Key pages:

| URL | What it is |
| --- | --- |
| `index.html` | Landing page (terminal/CRT aesthetic). |
| `study.html` | **Main game** — the pack-driven roguelike run. Loads `?pack=cpa-far` by default. |
| `daily.html` | **The Daily Close** — one shared deterministic challenge per day. |
| `engine.html` | Alternate/standalone run mode (also has a PDF importer via pdf.js). |
| `importer.html` | "Bring your own deck" — build a pack from structured input (modules, cards, doctrines, MCQs) with a live preview + JSON download. (LLM-assisted generation is scaffolded in the UI but **not yet wired** — the form is the supported path today.) |
| `library.html` | Browse built-in packs. |
| `ledger.html`, `close.html` | Supporting screens. |

---

## File map

### Core runtime modules (load on the game pages)
| File | Global | Responsibility |
| --- | --- | --- |
| `aced-config.js` | `ACED_API_URL` | Single toggle to enable accounts/sync. Ships commented out (local-only). |
| `aced-core.js` | `ACEDCore` | Foundation: namespaced `store` (localStorage + in-memory fallback), `analytics`, `calibration` (Brier-style), `review` (spaced-repetition queue of missed items), `streak`, `backend`/`sync` stubs, `qKey`. |
| `aced-account.js` | `ACEDAccount` | Sign-in + cloud-sync client. No-op unless `ACED_API_URL` is set. |
| `aced-progress.js` | `ACEDProgress` | Per-module mastery and "Exam Readiness" score, persisted. |
| `aced-fx.js` | `ACEDFX` | "Game feel" + virality layer (v2): chiptune SFX, particle bursts, screen shake, floating crit text, an answer-streak **combo engine**, achievements, teaching coach-marks, and a spoiler-free Wordle-style **share grid** + clipboard copy. Owns no game state. |
| `social.js` | `ACEDSocial` | Share-text/URL helpers. |
| `nemesis.js` | `ACEDNemesis` | Adaptive-difficulty "boss": derives HP from your net misses per module (from `ACEDCore.review`); spawns/strengthens/weakens/defeats as you study. |
| `confidence.js` | `ACEDConfidence` | Confidence-calibration helpers for the Audit Moment. |
| `daily.js` | `ACEDDaily` | Daily Close logic (deterministic per-day question selection, streak). |
| `engine.js` | `ACEDEngine` | Engine for `engine.html` (alternate run mode). |
| `tbs_engine.js` | `TBS` | Renders/grades task-based simulations. |
| `juice.js`, `extras.js` | `ACEDJuice`, `ACEDCampaign`… | Older/auxiliary effect + campaign helpers. |
| `theme.css` | — | Shared CRT-terminal styling. |

### Content
| Path | What |
| --- | --- |
| `packs/cpa-far.js` | The **CPA FAR pack**: `window.ACED_PACK` = elements, 19 modules, cards, jokers/doctrines, blueprint weights, and the `questionBanks` list. **The schema is documented in `packs/_schema.md`.** |
| `packs/cpa-aud.js` | CPA AUD starter pack. |
| `packs/originals/far-*.js` | Question banks — each appends to `window.ACED_QUESTIONS`. `far-original-batch-*`, `far-f1/f3/f4m3-batch-*` (MCQs) and `far-tbs-batch-01..08` (50 simulations → `window.ACED_TBS`). |
| `content/cpa-far/*.json` | Canonical JSON twins of the MCQ banks (source of truth for the content pipeline). |
| `packs/_schema.md` | **Read this to author a new pack or exam.** |

### Question / TBS data model
```js
// MCQ (window.ACED_QUESTIONS)
{ source:"F4.M3", diff:"easy|medium|hard", q:"…",
  choices:["…","…","…","…"], answer:1 /* 0-based */, explain:"…" }

// TBS simulation (window.ACED_TBS)
{ source:"F1.M4", diff:"medium", title:"…", scenario:"…",
  items:[ { type:"select", prompt:"…", choices:[…], answer:0, explain:"…" },
          { type:"numeric", prompt:"…", answer:210620, explain:"…" } ] }
```
`source` keys map to `ACED_PACK.modules` (e.g. `F1.M1` … `F4.M5`). Every wrong MCQ choice is an engineered, specific mistake explained in `explain`.

### Content pipeline & tooling (Node, zero-dependency, dev/CI only)
| Path | What |
| --- | --- |
| `tools/validate.js` | Lints all banks: unknown modules, out-of-range answers, dup IDs, thin/empty modules, difficulty mix, blueprint coverage. Run: `node tools/validate.js`. |
| `tools/js-to-json.js`, `tools/json-to-js.js` | Convert MCQ banks between the shipped `.js` and canonical `.json`. |
| `tools/dedupe.js` | Finds near-duplicate stems. |
| `tools/lib/load-banks.js` | Evaluates pack/bank `.js` in a tiny `window` shim so the **same files that ship to the browser** can be linted in Node — no build. |
| `.github/workflows/validate.yml` | CI: runs the validator on push. |

### Optional backend (`server/`) — not needed to run the app
| File | What |
| --- | --- |
| `server/server.js` | Express API. Routes: `/auth/request`, `/auth/verify` (JWT magic-link), `/state`, `/sync`, `/entitlements`, `/billing/checkout`, `/billing/webhook` (Stripe), `/leaderboard`, `/health`. |
| `server/merge.js` + `merge.test.js` | Conflict-free state merge (last-write-wins per key) with tests (`node server/merge.test.js`). |
| `server/.env.example` | Placeholder env (Stripe keys, JWT secret, etc.). Copy to `.env` (gitignored) to run. |
| `docs/BACKEND_SPEC.md`, `docs/ACCOUNTS_STRIPE.md` | How accounts/sync/billing work. |

To enable accounts: deploy `server/`, then uncomment and set `window.ACED_API_URL` in `aced-config.js`. Stack: Node + Express + better-sqlite3 + jsonwebtoken + Stripe.

### Docs worth reading
- `README_CANONICAL.md` — the long-form canonical project note.
- `STRATEGY.md` — product / go-to-market thinking.
- `packs/_schema.md` — pack authoring schema.
- `docs/CONTENT_PIPELINE.md`, `docs/ACED_FX_INTEGRATION.md`, `docs/STYLE_REFERENCE_FAR.md`, `docs/SILENT_DEFAULTS.md` — content + integration guides.
- `STUDY_V6_SPEC.md`, `UNIVERSAL_ENGINE_PLAN.md` — engine design.

---

## Conventions & gotchas (useful for code review / AI assistance)

- **Vanilla, ES5-flavored IIFEs.** No imports/exports; modules communicate via `window.ACED*` globals. Load order matters (`aced-config` → `aced-core` → others).
- **Defensive everywhere.** Effects and storage are wrapped in try/catch and tolerate sandboxed iframes (web storage is accessed indirectly).
- **Self-XSS hygiene.** All pack-authored / user-derived strings are HTML-escaped (`esc(...)`) before going into `innerHTML`. Preserve this when editing `engine.html`, `tbs_engine.js`, `study.html`, `aced-fx.js`.
- **Content edits:** change the `.js` bank (what ships) and keep the `content/*.json` twin in sync, then run `node tools/validate.js`. New MCQ banks must be added to `questionBanks` in `packs/cpa-far.js`; new TBS banks to the loader list in `study.html`.
- **Answers are 0-based** indices into `choices`.

---

## License

All Rights Reserved. © Story Shaw. Not licensed for redistribution.

## Status

Active development. Built-in CPA content is original / blueprint-derived only —
question banks from paid prep providers (Becker, Wiley, Gleim, Roger, UWorld,
etc.) are **not** included.
