# ACED — wiring notes for this file drop

Hand this to whoever deploys. Assumes no prior conversation context.

## Files in this drop
- `aced-vault.js` — persistent spendable currency + permanent upgrade tree (meta-progression). Subject-neutral.
- `aced-pack.js` — turns a study pack into a game skin (palette/labels) + light tuning; auto-derives sensible defaults from the pack's own content. Subject-neutral.
- `builder.html` — no-code game builder. Outputs a pack JSON, a live preview, a self-contained play link, and a (stubbed) publish button.
- `engine-share-loader.snippet.js` — one-time add to the game engine so builder play links work with no backend.
- `*.test.js` — plain Node tests, no framework. Run each with `node <file>`. All currently pass.

## Load order (in study.html / the arcade)
1. `aced-core.js`
2. the pack file (e.g. `packs/cpa-far.js`) — or nothing
3. `aced-pack.js`
4. `engine-share-loader.snippet.js` — **must run before** the code that reads `window.ACED_PACK`

On boot, after those load: `ACEDPack.init(); ACEDPack.applyTheme();`

## Confirm these two before it works end-to-end
1. **Correct-answer field.** `builder.html` writes each question as `{ q, options:[...], answer:<index> }`. If the engine expects a different key (e.g. `correct`, `correctIndex`, `a`), remap it in `builder.html` → `buildPack()` (one line).
2. **CSS token names.** `ACEDPack.applyTheme()` sets `--bg --fg --accent --dim --font`. Rename these in `aced-pack.js` → `applyTheme()` to match the engine's real CRT variable names if they differ (the engine uses `--green`, `--cyan`, `--white`, etc. — decide which the game screen actually reads).

## Vault hookup (optional but easy)
- Earn: call `ACEDVault.event("run_end", { outcome, score, ante })` anywhere `ACEDProgress.event(...)` already fires. Unknown event types no-op, so it's safe to co-locate.
- Apply at run start: read `ACEDVault.bonuses()` → `{ hands, discards, slots, rerollDiscount, startCash }` and add to run state.
- Cross-device sync: add `"vault"` to `SYNC_KEYS` in `aced-core.js` (one line).

## Not done yet — needs the backend
`builder.html`'s **Publish** posts to `/games` only when `ACEDCore.backend` is enabled; otherwise it honestly tells the user the shared library is off. A browsable community library (`POST /games`, `GET /games`, `GET /games/:id`, plus a `library.html` browse-and-play page) is the next build once Render is live. That's also where moderation (report button, review-before-public) needs to land, since it's public user content.
