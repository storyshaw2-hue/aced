# ACED Brand Voice & Contributor Guide

## Section 1 — Brand Voice

ACED earns focus the same way a good game earns a second run: through clarity, momentum, and honest feedback. The tone should feel like a sharp study partner — encouraging without being saccharine, precise without being cold.

### Voice Principles

**Talk like a coach, not a textbook.** Plain language first, precision second. "You missed the revenue recognition trigger" beats "Criterion (a)(iii) was not satisfied."

**Respect the exam without mythologizing it.** CPA, USMLE, Bar, and GRE are hard. Name that directly. Confidence comes from reps, not pep talks.

**Use game terms as domain terms.** Doctrines, Closes, Fiscal Years are real vocabulary in this engine. Use them consistently, without scare quotes or apology.

**Stay brief.** Every tooltip and error message is a chance to waste a student's time. Don't take it.

### Do / Don't

| Situation | Do | Don't |
|---|---|---|
| Describing a round | "You're entering the Mid-Year Close. Three modules remain." | "Get ready for the Big Blind! Good luck!" |
| Explaining a Doctrine | "Matching Principle fires on any pair, adding ×4 to your Mult." | "This joker gives you a Mult boost when cards match." |
| Encouraging after a loss | "Close failed. Review weak modules before the next Fiscal Year." | "Don't give up! You can do it!" |

### Terminology

Never use "Balatro," "joker," or "blind" in any user-facing string, label, or documentation example. Canonical terms: **Doctrine / Doctrines**, **Close** (a round), **Q1 Close / Mid-Year Close / Year-End Close**, and **Fiscal Year**.

---

## Section 2 — Repository Structure

```
aced/
├── index.html        Entry point and pack-selection screen
├── study.html        Canonical study engine — do not fork
├── library.html      Browsable doctrine and card library
├── importer.html     Tool for importing custom MCQ sets
├── close.html        Close summary screen
├── ledger.html       Score history and progress ledger
├── juice.js          Animation and visual feedback layer
├── confidence.js     Spaced-repetition confidence tracking
├── extras.js         Shared utility helpers
├── theme.css         Global design tokens and component styles
├── packs/
│   ├── cpa-far.js    Legacy first-party pack (migrating to JSON)
│   ├── originals/    First-party question banks (legacy JS format)
│   └── *.json        Declarative pack specs (current target format)
└── docs/
    ├── BRAND_AND_CONTRIBUTING.md   This file
    └── DOCTRINE_RULES.md           Registry of all supported doctrine rule types
```

`study.html` is the single canonical engine. Do not create alternative engine pages. New capabilities belong in `study.html`. New packs go in `packs/` as JSON, not in `originals/`.

---

## Section 3 — How to Add a New Pack

New packs are pure JSON — no JavaScript executed from pack files.

1. Create `packs/<exam-code>.json` (e.g., `packs/gre-verbal.json`).
2. Fill in required fields: `subject`, `modules`, `mcqs`, and `doctrines`.
3. Add the pack to the selector in `index.html`.
4. Open a PR with at least 10 MCQs and one working Doctrine rule.

### Minimum JSON Shape

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

### Rule Interpreter Reference

Each doctrine object is evaluated after every scored card.

**`when` triggers:** `pair` (two consecutive correct), `streak` (three or more correct), `module_clear` (all MCQs in a module cleared in one Close), `first_correct` (first correct of the Close), `score_threshold` (chips exceed a value; requires `threshold`).

**`element` filters:** `"ANY"` fires for any module; a module name string scopes the rule to that module only.

**Effect keys:** `addChips` (integer), `addMult` (integer), `xMult` (float, applied after addMult), `addMoney` (integer).

### What NOT to Do

- No JavaScript in pack files — no functions, arrow functions, or `eval`.
- No `localStorage` access from packs; state management belongs to the engine.
- No `<script>` tags or inline event handlers (`onclick`, `onerror`) in any MCQ field.

---

## Section 4 — How to Document a New Doctrine Rule

When adding a new `when` trigger or effect key, the same PR must include:

1. The case added to the interpreter switch in `study.html`.
2. A one-line entry in `docs/DOCTRINE_RULES.md` using this template:

```markdown
| `when` value   | Effect keys | Description                              | Added in |
|----------------|-------------|------------------------------------------|----------|
| `module_clear` | `xMult`     | Fires when all MCQs in a module cleared. | PR #42   |
```

3. A minimal JSON doctrine example in the PR description with stated expected output.

---

## Section 5 — PR Checklist

- [ ] No "Balatro," "joker," or "blind" in any user-visible string or UI copy
- [ ] No executable code (functions, eval) in any file under `packs/`
- [ ] All user-supplied strings escaped before `innerHTML` insertion
- [ ] Every `localStorage` call wrapped in `try/catch` with an in-memory fallback
- [ ] Every MCQ has exactly one correct index, four distinct choices, and a non-empty explanation
- [ ] Feature tested in a sandboxed iframe with no console errors
- [ ] No new engine pages introduced; `study.html` remains the single canonical engine
- [ ] Structural QA pass over `packs/` run to confirm valid JSON and required fields
