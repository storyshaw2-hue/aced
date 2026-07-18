# ACED — AI content pipeline

## A. Ships now — any LLM as generator (no backend)
The importer ingests the deck JSON an AI produces (`deck_name` / `cards` / `traps`). Loop:
copy the built-in prompt → paste material into ChatGPT/Gemini/Claude → paste the JSON back →
review/confirm → Play. Converter lives in the inlined `ACEDExtract.fromAny` → `deckToQuestions`,
tolerant of both trap variants (`correct`/`explanation` and `correct_answer`/`debrief`).

Mapping to ACED's MCQ pack (`{q, choices[], answer, explain}`):
- `cards {question, answer}` → MCQ (answer + 3 distractors from other answers; skipped if <3
  distinct answers exist — a 1-card deck can't make a fair MCQ).
- `traps {scenario, distractor, correct, explanation}` → MCQ whose wrong option is the AI's
  designed near-miss; `explanation`/`debrief` becomes the on-screen debrief.
- `modifiers` → ignored for the slim play pack (deckbuilder-engine concern).
Also accepts a bare `[...]` array or `{questions:[...]}` in ACED's own shape.

## B. In-app AI path — backend (Perplexity)
`POST /api/generate  { "text": "...", "deckName": "optional" } -> { deck_name, cards[], traps[], modifiers[] }`
- Gate behind existing JWT; count against Pro entitlement.
- Extract text (PyMuPDF/Unstructured/OCR); chunk by topic, not page; cap chunk size.
- Use `prompts/trap_generator.md` as the system prompt so output matches the converter.
- Client runs the returned deck through the same `ACEDExtract.fromAny`, then the review step
  (don't skip review — it's the hallucination guard).

## C. Gemini's calibration + Run Director (for when per-user mastery is persisted)
ACED already has the Conviction wager. If you build the server-side mastery model:
1. **Bug in Gemini's `calculateCalibration`** — it derives `new_calibration` from
   `current_mastery + calibrationChange`; it must use the current **calibration** score. Pass
   `current_calibration` in and clamp that. Don't copy it verbatim.
2. **50/30/20 Run Director** (review/new/traps, "boss finish", combo multipliers) is sound and
   frontend-feasible atop the existing spaced-repetition scheduler; deferred to avoid
   destabilizing the live engine.
