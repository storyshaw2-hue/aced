# Copilot / AI assistant instructions for ACED

ACED is a **100% client-side, no-build static web app** (vanilla HTML/CSS/JS,
ES5-style IIFEs — no framework, bundler, or transpile step). It turns study
material into a roguelike-deckbuilder exam trainer. Live at https://aced.pplx.app.

**Read `README.md` first** — it has the full architecture, file map, and data model.

## How the code is organized
- Each JS module is a self-contained IIFE that attaches one global to `window`
  (`ACEDCore`, `ACEDProgress`, `ACEDFX`, `ACEDNemesis`, `ACEDAccount`, …).
  Modules communicate via these globals — there are no imports/exports.
- **Load order matters:** `aced-config.js` → `aced-core.js` → everything else.
- Start here to understand the system: `aced-core.js` (data model: store,
  calibration, review/SRS, streak), `study.html` (the game loop),
  `packs/cpa-far.js` (content pack format, documented in `packs/_schema.md`).

## Conventions to follow when editing
- Vanilla JS only. No new dependencies, no build step. Keep it runnable by
  opening an `.html` file directly.
- **Defensive coding:** wrap DOM/storage access in try/catch; tolerate
  sandboxed iframes (web storage is accessed indirectly, never assume it exists).
- **Self-XSS hygiene:** HTML-escape every pack-authored or user-derived string
  with `esc(...)` before assigning to `innerHTML`. This matters in
  `engine.html`, `tbs_engine.js`, `study.html`, and `aced-fx.js`.
- MCQ/TBS answers are **0-based** indices into `choices`.

## Content workflow
- Question banks ship as `packs/originals/*.js` (each appends to
  `window.ACED_QUESTIONS`; TBS appends to `window.ACED_TBS`).
- Keep the JSON twin in `content/cpa-far/*.json` in sync with the `.js` bank.
- New MCQ banks must be registered in `questionBanks` in `packs/cpa-far.js`;
  new TBS banks in the loader list in `study.html`.
- Validate content with `node tools/validate.js` (also runs in CI).
- Content is original / blueprint-derived only — **never** add question text
  from paid prep vendors (Becker, Wiley, Gleim, Roger, UWorld, etc.).

## Optional backend (`server/`)
Express + better-sqlite3 + JWT + Stripe. The app is fully functional and
local-only until `window.ACED_API_URL` is set in `aced-config.js`. Don't assume
it's running. Never commit real secrets — `.env` is gitignored; only
`server/.env.example` (placeholders) is tracked.
