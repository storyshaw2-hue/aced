# ACED — Canonical engine decision + `aced-fx.js` integration

_Decision date: 2026-06-23. Companion to `README_CANONICAL.md`._

## Decision: `study.html` is the canonical engine

There were drifting toward **two** engines. This settles it.

| Build | Verdict | Why |
|---|---|---|
| `study.html` (1.8k lines) | **CANONICAL** | Loads the real ~317-question pack via `ACED_PACK.questionBanks`; wired to `aced-core` (calibration, spaced review, sync), `aced-progress` (career ladder + objectives), `social.js` (share card), `nemesis.js`. This is the product. |
| `aced-enhanced.html` (1.0k lines) | **REFERENCE only** | A cleaner re-implementation, but it ships **18 inline MCQs** and is disconnected from the pack architecture and every meta-system above. Adopting it = re-authoring the content moat and re-wiring core/progress/social. Keep it as a style reference for a *future in-place refactor of `study.html`* — do **not** build features or author content in it. |
| `aced-fx-demo.html` | **REFERENCE only** | Standalone preview of `aced-fx.js`. Superseded by the real wiring below. |

> Rule going forward (mirrors the existing "don't wire dead files" note): content and
> features land in `study.html` + the `packs/`. `aced-enhanced.html` is read-only inspiration.

## `aced-fx.js` — folded into `study.html`

`study.html` already has its **own** Web-Audio `sfx` and a CSS `screenShake()`. So `aced-fx.js`
was wired to add **only net-new feel** — never the things the engine already does — to avoid
double audio / double shake.

**Reused from the engine (unchanged):** `sfx.*`, `screenShake()`, `callout()`, `toast()`.

**Added from `aced-fx.js`:**
- **Audit combo engine** — consecutive correct audits escalate (`CLEAN → … → BULLETPROOF`).
  On the correct path it now **owns the answer chime** (the old `sfx.coin()` was removed there
  so the two don't stack); a miss calls `combo.miss()` (silent; shows "STREAK BROKEN" only if ≥3).
  This ties dopamine to *knowing the material*, not to grinding score.
- **Pixel-particle `burst` + full-screen `flash`** on big hand scores (≥600 / ≥1800), on every
  close cleared, and a bigger one on a full-run win. The engine had neither.
- **Achievements** (fire-once): `first_run`, `first_close`, `first_boss`, `combo_5`, `combo_10`,
  `first_partner`.
- **Coach-mark** — a one-time `teach()` at the first Audit Moment naming the calibration mechanic
  (addresses "guide the first run" in `STRATEGY.md`). Gated by `seenAuditTeach`.
- **Persistent mute** — the `SOUND` toggle now also drives `ACEDFX.setMuted()`, and both the
  engine and FX layer read the shared `aced_muted` key, so the preference survives reloads and
  is consistent across pages.

Load order: `aced-core.js` → `aced-progress.js` → **`aced-fx.js`** → engine. (`aced-fx.js` is
loaded before the engine so `ACEDFX` exists when boot reads the mute flag.)

## Clear follow-ups (not done here)

1. **Daily share grid — highest-virality use of the module.** Wire `ACEDFX.grid(...)` +
   `ACEDFX.copy(...)` into `daily.html`'s result screen (the demo's "SHARE" step). The text grid
   (🟩🟨⬛ + URL) inlines in Discord/Reddit/iMessage where the graphical run-card doesn't. This is
   GROWTH_BACKLOG #5; the run-cashout graphical card in `study.html` stays as-is.
2. **Remaining achievements:** `flawless` (no missed audit in a close — track a per-close miss flag),
   `calibrated` (hook `renderCalibration()` when grade ≥ B+), `ready_60` (hook `renderReadiness()`
   when a module crosses 60%). `streak_7` / `daily` / `share` belong in `daily.html`.
3. **`README_CANONICAL.md` is now slightly stale** — it lists `nemesis.js` as dormant, but
   `study.html` loads it and calls `ACEDNemesis`. Worth a quick correction while you're here.
