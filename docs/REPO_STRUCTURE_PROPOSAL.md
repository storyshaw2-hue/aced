# Repository Structure & Contribution Proposal

A short, decision-ready audit of how `storyshaw2-hue/aced` is organized today, plus a
proposed cleaner hierarchy and a contributor on-ramp. Nothing here is applied yet — it's
a plan for you to approve, adjust, or reject piece by piece.

---

## 1. Audit: what the repo looks like today

The project works and the code is healthy, but the **root directory is doing too much**.
36 files sit at the top level, mixing five unrelated concerns:

| Concern | Examples currently at root |
| --- | --- |
| Entry pages (HTML) | `index.html`, `study.html`, `daily.html`, `engine.html`, `importer.html`, `library.html`, `ledger.html`, `close.html` |
| Runtime JS modules | `aced-core.js`, `aced-config.js`, `aced-account.js`, `aced-progress.js`, `aced-fx.js`, `nemesis.js`, `social.js`, `confidence.js`, `daily.js`, `tbs_engine.js` |
| Web/SEO assets | `favicon.svg`, `og-image.png`, `manifest.webmanifest`, `robots.txt`, `sitemap.xml`, `theme.css` |
| Top-level docs/specs | `README_CANONICAL.md`, `STRATEGY.md`, `STUDY_V6_SPEC.md`, `UNIVERSAL_ENGINE_PLAN.md`, `SCAN_REPORT.md`, `_BUILD_PLAN.md` |
| Likely-orphaned files | `engine.js`, `extras.js`, `juice.js` (see §3) |

Folders that already exist and work well: `packs/` + `packs/originals/` (content),
`content/cpa-far/` (JSON twins), `docs/` (13 files), `server/` (backend), `tools/` +
`tools/lib/` (pipeline), `.github/`.

**Intuitive for a new contributor?** Partly. The subfolders are clear, but the root is a
wall of 36 files where a newcomer can't tell an entry page from a helper module from a
stale draft. The biggest friction points:

1. **No `src/` (or `js/`) folder** — runtime modules are scattered among HTML, assets, and docs.
2. **Specs live next to the README** — `STRATEGY.md`, `STUDY_V6_SPEC.md`, etc. compete with the README for attention at root.
3. **Possible dead files** in the mix make it unclear what's load-bearing.
4. **Two README-like files** (`README.md` and `README_CANONICAL.md`) with no stated relationship.

---

## 2. One important constraint (why we can't just drag files around)

Every page loads scripts with **bare relative paths**, e.g. `study.html` has:

```html
<script src="aced-core.js"></script>
<script src="nemesis.js"></script>
```

and `study.html` also **dynamically** loads banks/engines by hardcoded paths
(`packs/originals/far-tbs-batch-01.js`, `tbs_engine.js`, etc.).

So moving any JS file **requires updating every `src=` reference and every dynamic path**
that points to it. This is doable and low-risk *if done in one careful pass with testing*,
but it's the reason the root got messy in the first place — moving files isn't free.
**Recommendation: do the reorg as one dedicated, tested commit (see §5), not piecemeal.**

---

## 3. Cleanup opportunity: likely-orphaned files

These three appear unused (verified: no page loads them, and their globals are referenced
nowhere):

- `engine.js` (`window.ACEDEngine`) — `engine.html` does **not** load it.
- `extras.js` (`window.ACEDCampaign`) — referenced nowhere.
- `juice.js` (`window.ACEDJuice`) — only *mentioned in a comment* in `aced-fx.js`, which
  describes itself as the "live replacement for the unwired juice.js draft."

**Proposal:** move these to an `archive/` folder (don't delete outright) so history is
preserved but the working tree is honest about what ships. Confirm with a quick search
before archiving — superseded drafts are easy to mistake for load-bearing code.

> Note: `confidence.js`, `daily.js`, and `tbs_engine.js` ARE used (dynamically loaded by
> `study.html`) — keep them in the runtime folder.

---

## 4. Proposed directory hierarchy

The goal: a newcomer can open the repo and immediately know "pages here, code there,
content there, docs there." Keeps the no-build, open-a-file simplicity intact.

```
aced/
├── README.md                  # the front door (already AI/contributor-friendly)
├── CONTRIBUTING.md            # NEW — how to contribute (see §6)
├── LICENSE
├── index.html                 # keep the landing page at root (it's the entry point)
│
├── pages/                     # the other HTML screens
│   ├── study.html  daily.html  engine.html  importer.html
│   └── library.html  ledger.html  close.html
│
├── src/                       # runtime JS + shared styles (the "app")
│   ├── aced-config.js  aced-core.js  aced-account.js  aced-progress.js
│   ├── aced-fx.js  nemesis.js  social.js  confidence.js  daily.js  tbs_engine.js
│   └── theme.css
│
├── assets/                    # static web/SEO assets
│   └── favicon.svg  og-image.png  manifest.webmanifest  robots.txt  sitemap.xml
│
├── packs/                     # UNCHANGED — content packs + question banks
│   ├── cpa-far.js  cpa-aud.js  _schema.md
│   └── originals/ …
│
├── content/                   # UNCHANGED — canonical JSON twins of the banks
│   └── cpa-far/ …
│
├── server/                    # UNCHANGED — optional Express/SQLite/Stripe backend
│
├── tools/                     # UNCHANGED — Node content pipeline + validator
│   └── lib/
│
├── docs/                      # all specs & guides consolidated here
│   ├── STRATEGY.md  STUDY_V6_SPEC.md  UNIVERSAL_ENGINE_PLAN.md   # moved from root
│   ├── SCAN_REPORT.md  BUILD_PLAN.md                              # moved from root
│   ├── BACKEND_SPEC.md  CONTENT_PIPELINE.md  STYLE_REFERENCE_FAR.md …  # already here
│   └── REPO_STRUCTURE_PROPOSAL.md   # this file
│
├── archive/                   # NEW — superseded drafts, kept for history (see §3)
│   └── engine.js  extras.js  juice.js
│
└── .github/  .gitignore       # CI + copilot-instructions.md
```

**What moves:** 7 HTML pages → `pages/`, ~11 JS+CSS → `src/`, 5 assets → `assets/`,
6 specs → `docs/`, 3 orphans → `archive/`. **What stays at root:** `README.md`,
`CONTRIBUTING.md`, `LICENSE`, `index.html`. Result: **root drops from 36 files to ~4.**

### Trade-offs to weigh
- **Pro:** dramatically more intuitive; contributors (and AI tools) grok it instantly.
- **Con:** requires rewriting all `src=` references + dynamic load paths in one pass, and
  re-pointing the publish/deploy + GitHub Pages root. Must be tested page-by-page after.
- **Lighter alternative:** if a full move feels risky, do the **safe 80%** first — move only
  the 6 specs into `docs/` and archive the 3 orphans. That declutters root meaningfully
  with **zero** risk to runtime paths (no page loads those files). The `src/`/`pages/`/
  `assets/` move can come later as its own tested commit.

### About `README.md` vs `README_CANONICAL.md`
Two near-identical front-door files is confusing. Proposal: keep `README.md` as the
canonical front door (it's already the detailed, AI-friendly one) and either fold anything
unique from `README_CANONICAL.md` into it or move that file to `docs/` as a historical note.

---

## 5. Suggested rollout (low-risk order)

1. **Phase 1 — zero-risk declutter (recommended first):** move the 6 root specs into
   `docs/`, archive `engine.js`/`extras.js`/`juice.js`, reconcile the two READMEs. No runtime
   paths change. One commit, instantly cleaner root.
2. **Phase 2 — the structural move (optional, later):** create `pages/`, `src/`, `assets/`,
   move files, update every `<script src>`, every `<link href>`, and every dynamic
   `packs/...`/`tbs_engine.js` load path, then re-test all 8 pages + redeploy. One dedicated commit.
3. Update `README.md` file-map and `.github/copilot-instructions.md` to match the new layout.

---

## 6. Contribution on-ramp (`CONTRIBUTING.md`)

The repo already has `docs/BRAND_AND_CONTRIBUTING.md`, but a top-level `CONTRIBUTING.md` is
what GitHub surfaces automatically on PRs/issues. Proposed contents:

- **What ACED is** + the no-build philosophy (open a file, no toolchain).
- **Local setup:** clone, `python3 -m http.server`, open `index.html`.
- **Project map:** one-line pointer to the README file-map.
- **How to add exam content** (the most common contribution):
  1. Author a bank in `packs/originals/` following `packs/_schema.md`.
  2. Keep the `content/*.json` twin in sync.
  3. Register MCQ banks in `questionBanks` (`packs/cpa-far.js`); TBS banks in the loader in `study.html`.
  4. Run `node tools/validate.js` until it's PASS — clean.
  5. **Never** include question text from paid prep vendors (original/blueprint-derived only).
- **Code conventions:** vanilla ES5 IIFEs, one `window.ACED*` global per module, load order
  (`aced-config` → `aced-core` → rest), defensive/sandbox-safe code, `esc()` on every
  injected string, 0-based answers.
- **PR checklist:** validator passes, all 8 pages load with no console errors, no secrets,
  `engine.html`/`tbs_engine.js` escaping preserved.
- **For storytelling/creative collaborators:** because the engine is content-agnostic, a new
  "exam" is really just a pack — point them at `packs/_schema.md` and the importer
  (`importer.html`) as the lowest-friction way to turn a narrative/topic into a playable deck.

---

## 7. How this helps Copilot see the repo

A cleaner tree + a clear `README.md`/`CONTRIBUTING.md` makes any AI that *can* read the repo
far more effective — it can navigate by folder instead of guessing among 36 root files.

That said, to be direct: **structure is not why your browser Copilot couldn't read the
repo.** The repo is verified fully public (anonymous requests return HTTP 200). The failures
trace to Copilot's web-fetch tool and to being handed the `…/aced.git` URL, which returns a
301 redirect that some fetchers don't follow. Reliable fixes, in order:

1. Give Copilot the **clean** URL (no `.git`): `https://github.com/storyshaw2-hue/aced`
   — or the live Pages site `https://storyshaw2-hue.github.io/aced/`.
2. Start a **fresh** Copilot chat (old sessions cache the earlier failure).
3. If its fetch tool still can't reach GitHub, upload the code directly (bundled files) or
   use **Copilot in VS Code** with a local clone — neither depends on fetching.
