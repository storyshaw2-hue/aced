# ACED Contributor Guide

This document covers UI copy rules, repository layout, pack authoring, and PR requirements. It applies to every PR against `storyshaw2-hue/aced`.

---

## Section 1 — UI Copy Rules

ACED uses domain-accurate vocabulary for its game mechanics. The following terms are canonical and must be used consistently across UI strings, tooltips, error messages, and documentation:

- **Doctrine / Doctrines** — scoring modifiers tied to exam principles
- **Close** — a single scoring round (`Q1 Close`, `Mid-Year Close`, `Year-End Close`)
- **Fiscal Year** — a full run, from Q1 Close through Year-End Close
- **Module** — a content subdivision within a pack (e.g., F1–F4 for FAR)
- **Mastery** — per-module accuracy score, persisted across runs
- **Audit Moment** — a live MCQ triggered after a Close completes

Forbidden terms in any user-visible string: `Balatro`, `joker`, `blind`. These existed in earlier prototypes and have been replaced by the canonical terms above.

### Copy conventions

| Element | Convention |
|---|---|
| Round labels | Use the canonical Close name: `"Mid-Year Close"`, not `"Round 2"` or `"Blind 2"` |
| Doctrine descriptions | State the trigger and the effect: `"Fires on any pair. +4 Mult."` |
| Failure states | State the result and the next action: `"Close failed. Target $300, scored $215. Review F2 before retry."` |
| Buttons | Imperative verb + object: `"Play Hand"`, `"Open Shop"`, `"Skip Audit"` |

Do not use marketing language ("addictive", "enjoy studying", "fall in love with"). Describe the mechanic.

---

## Section 2 — Repository Structure

```
aced/
├── index.html        Landing page and pack selector
├── study.html        Canonical study engine — all new features land here
├── library.html      Doctrine and card browser
├── importer.html     Custom MCQ import tool
├── close.html        Close summary screen
├── ledger.html       Score history and run log
├── juice.js          Animation and visual feedback
├── confidence.js     Spaced-repetition confidence tracking
├── extras.js         Shared utility helpers
├── theme.css         Design tokens and component styles
├── packs/
│   ├── cpa-far.js    First-party pack (legacy JS format, being migrated)
│   ├── originals/    First-party MCQ banks (legacy JS format)
│   └── *.json        Declarative pack specs (current target format)
└── docs/
    ├── BRAND_AND_CONTRIBUTING.md   This file
    └── DOCTRINE_RULES.md           Registry of supported doctrine rule types
```

`study.html` is the only engine page. Do not introduce alternative engine pages. New packs are added as JSON under `packs/`, not as new files in `packs/originals/`.

---

## Section 3 — Adding a New Pack

Packs are pure JSON. No JavaScript is executed from pack files.

1. Create `packs/<exam-code>.json` (e.g., `packs/gre-verbal.json`).
2. Populate required fields: `subject`, `version`, `modules`, `mcqs`, `doctrines`.
3. Register the pack in the selector in `index.html`.
4. Open a PR with at least 10 MCQs and at least one functional doctrine.

### Minimum JSON shape

```json
{
  "subject": "GRE Verbal Reasoning",
  "version": "1.0.0",
  "modules": ["Text Completion", "Reading Comprehension"],
  "mcqs": [
    {
      "id": "gre-v-001",
      "module": "Text Completion",
      "stem": "The critic's review was ______: thorough in praise yet unsparing in critique.",
      "choices": ["ambivalent", "equivocal", "nuanced", "perfunctory"],
      "correct": 2,
      "explanation": "Nuanced captures fine distinctions — matching the balanced quality described."
    }
  ],
  "doctrines": [
    {
      "name": "Lexical Pair",
      "description": "Fires when two consecutive correct answers share a module.",
      "when": "pair",
      "element": "ANY",
      "addMult": 4
    }
  ]
}
```

### Rule interpreter reference

Each doctrine is evaluated after every scored card.

**`when` triggers**
- `pair` — two consecutive correct answers
- `streak` — three or more consecutive correct
- `module_clear` — all MCQs in a module answered correctly within one Close
- `first_correct` — first correct answer of the Close
- `score_threshold` — chips exceed `threshold` (requires `threshold` field)

**`element` filter**
- `"ANY"` — fires regardless of module
- `"<module name>"` — scopes the rule to a single module

**Effect keys** (applied in order)
- `addChips` (integer)
- `addMult` (integer)
- `xMult` (float, applied after `addMult`)
- `addMoney` (integer)

### Pack constraints

- No JavaScript in pack files — no functions, arrow functions, or `eval` strings.
- No `localStorage` access from packs. State persistence is engine-owned.
- No `<script>` tags or inline event handlers (`onclick`, `onerror`) inside any MCQ field. All user-supplied strings are escaped before insertion, but pack files should not include them in the first place.

---

## Section 4 — Adding a New Doctrine Rule

A new `when` trigger or effect key requires three things in the same PR:

1. The case added to the interpreter switch in `study.html`.
2. A row in `docs/DOCTRINE_RULES.md`:

   ```markdown
   | `when` value   | Effect keys | Description                              | Added in |
   |----------------|-------------|------------------------------------------|----------|
   | `module_clear` | `xMult`     | Fires when all MCQs in a module cleared. | PR #42   |
   ```

3. A minimal JSON doctrine example in the PR description with the expected scoring output stated explicitly.

---

## Section 5 — PR Checklist

- [ ] No forbidden terms (`Balatro`, `joker`, `blind`) in any user-visible string
- [ ] No executable code (functions, `eval`) in any file under `packs/`
- [ ] All user-supplied strings escaped before `innerHTML` insertion
- [ ] Every `localStorage` call wrapped in `try/catch` with an in-memory fallback
- [ ] Every MCQ has exactly one `correct` index, four distinct `choices`, and a non-empty `explanation`
- [ ] Feature tested in a sandboxed iframe with no console errors
- [ ] No new engine pages introduced; `study.html` remains the only engine page
- [ ] `packs/` validates as JSON and contains all required fields
