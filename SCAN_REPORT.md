# ACED Public Build — Scan Report

Source: `/home/user/workspace/aced`  
Destination: `/home/user/workspace/aced-public`

- Files copied: **21**
- Files dropped: **22**
- Files patched: **1**
- Files flagged for review: **1**

## Dropped (excluded from public build)

- `_pattern_analysis/FAR-F4-MCQs.txt` — under dropped directory _pattern_analysis
- `_pattern_analysis/FAR-F5-MCQs.txt` — under dropped directory _pattern_analysis
- `_pattern_analysis/FAR-F6-MCQs.txt` — under dropped directory _pattern_analysis
- `_pattern_analysis/FAR-MCQ-F1-through-F3.txt` — under dropped directory _pattern_analysis
- `_pattern_analysis/all_mcqs.json` — under dropped directory _pattern_analysis
- `_pattern_analysis/tbs/Far-F1-Task-Based-Sims.txt` — under dropped directory _pattern_analysis
- `_pattern_analysis/tbs/Far-F2-Task-Based-Sims.txt` — under dropped directory _pattern_analysis
- `_pattern_analysis/tbs/Far-F3-Task-Based-Sims.txt` — under dropped directory _pattern_analysis
- `_pattern_analysis/tbs/Far-F4-Task-Based-Sims.txt` — under dropped directory _pattern_analysis
- `_pattern_analysis/tbs/Far-F5-Task-Based-Sims.txt` — under dropped directory _pattern_analysis
- `_pattern_analysis/tbs/Far-F6-Task-Based-Sims.txt` — under dropped directory _pattern_analysis
- `campaign.js` — filename in DROP_FILENAMES (campaign.js)
- `far_combined.js` — filename in DROP_FILENAMES (far_combined.js)
- `index.html` — filename in DROP_FILENAMES (index.html)
- `mockexam.html` — filename in DROP_FILENAMES (mockexam.html)
- `pack.js` — filename in DROP_FILENAMES (pack.js)
- `packs/far-aicpa-2026.json` — filename in DROP_FILENAMES (far-aicpa-2026.json)
- `packs/far-becker-mega.json` — filename in DROP_FILENAMES (far-becker-mega.json)
- `packs/far-sims.json` — filename in DROP_FILENAMES (far-sims.json)
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

Each hit shows the matched pattern, a label, and a snippet of surrounding text. Review and either:
  - Decide it's a false positive (e.g. the word 'AICPA' in a README explaining what was removed), or
  - Strip / rewrite that line in the source and re-run.

### `docs/STYLE_REFERENCE_FAR.md`  (17 hit(s))
- **AICPA brand** — `ENCE_FAR.md — Pattern Map for AICPA-Style FAR Multiple Choice **`
- **AICPA brand** — `nd pedagogical *patterns* the AICPA uses on the FAR section of th`
- **AICPA brand** — `set, cross-referenced with 3 AICPA "newly released" sample quest`
- **AICPA brand** — `sed" sample questions and the AICPA Blueprint. All counts in this`
- **AICPA brand** — `rate Question Difficulty The AICPA exam adaptively serves harder`
- **AICPA brand** — `print topic.** Cite the exact AICPA Blueprint location (e.g., "F1`
- **AICPA brand** — `this project. - It is not the AICPA Blueprint. The Blueprint is c`
- **AICPA brand** — `t is consulted separately at [aicpa-cima.com](https://www.aicpa-c`
- **AICPA brand** — `[aicpa-cima.com](https://www.aicpa-cima.com/resources/download/u`
- **AICPA brand** — `. - It does not reproduce any AICPA-released question. The three`
- **AICPA brand** — `ased question. The three 2026 AICPA released questions consulted`
- **AICPA brand** — `is document is living. As new AICPA Blueprint editions drop and a`
- **AICPA brand** — `ITGs/Implementation Guides → AICPA literature cleared by GASB →`
- **AICPA brand** — `ASC 606-10-25-1"). Per recent AICPA blueprint updates, Research w`
- **AICPA brand** — `in the ACED bank** unless the AICPA reintroduces them. ### 15.2`
- **AICPA brand** — `hidden Blueprint signal) The AICPA Blueprint tags every TBS at o`
- **AICPA brand** — `lty Calibration for TBSs The AICPA does not publish exact scorin`

