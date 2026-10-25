# Contributor instructions for ACED

Read `README.md` first. ACED is a no-framework, client-side study-pack game, with one shared engine for every subject.

## Conventions

- Vanilla HTML/CSS/JavaScript; no bundler or runtime dependencies.
- Each module attaches a single `window.ACED*` global. Use `defer` and promise-based content loading.
- Keep packs data-only. The shared engine owns poker hands, jokers, difficulty, currencies and player levels.
- All user/pack-derived HTML must go through `ACEDUI.esc`; prefer `textContent`.
- Browser storage is optional and can fill up. Never promise a persistent save when it failed.
- Pack and question IDs remain stable during edits. A new import or shared copy must not overwrite an existing pack.
- MCQ answers are zero-based indices into `choices`. Cards without choices are explicitly self-rated recall.
- Playing cards may award game XP, never learning progress.

## Validation

Run `node tools/check.js`, `node tools/validate.js`, `node aced-library.test.js`, `node aced-game-rules.test.js` and `node aced-core.test.js`.

Scoring tests import the real `aced-game-rules.js`; do not reimplement its math in a test harness. Verify browser flows and mobile layouts before pushing. Keep private content and credentials out of the repository and `dist/`.
