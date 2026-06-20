# ACED Public Build — Scan Report

Source: `/home/user/workspace/aced`  
Destination: `/home/user/workspace/aced-public`

- Files copied: **23**
- Files dropped: **8**
- Files patched: **1**
- Files flagged for review: **0**

## Dropped (excluded from public build)

- `campaign.js` — filename in DROP_FILENAMES (campaign.js)
- `far_combined.js` — filename in DROP_FILENAMES (far_combined.js)
- `index.html` — filename in DROP_FILENAMES (index.html)
- `packs/far-aicpa-2026.json` — filename in DROP_FILENAMES (far-aicpa-2026.json)
- `packs/far-becker-mega.json` — filename in DROP_FILENAMES (far-becker-mega.json)
- `questions.js` — filename in DROP_FILENAMES (questions.js)
- `tbs.js` — filename in DROP_FILENAMES (tbs.js)
- `wittywrongs.js` — filename in DROP_FILENAMES (wittywrongs.js)

## Patched (menu hooks stripped)

- `engine.html`
    - stripped pattern: \s*<button class="act play" id="pMega"[^>]*>[^<]*</button>\s...
    - stripped pattern: \s*\$\("pMega"\)\.onclick=loadFarMega;\s*...
    - stripped pattern: \s*<button class="act play" id="pAicpa"[^>]*>[^<]*</button>\...
    - stripped pattern: \s*\$\("pAicpa"\)\.onclick=loadAicpa;\s*...

## Flagged content (review before publishing)

_No flags. Build is clean._
