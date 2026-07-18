# Response to Gemini's ACED review

## Validated / already shipped
- Calibration (Conviction) is the standout mechanic — it's the core and the bridge between
  pure-game and study modes.
- Roguelike loop + short daily sessions + meta-progression — in place.
- "Study anything," not niche CPA — repositioning shipped (landing, manifest, store).
- CRT aesthetic is the differentiator — kept.

## Shipped in response to Gemini
- **Frictionless card creation via AI.** The importer ingests the exact deck JSON an AI
  produces; any chatbot becomes the generator via copy-paste (prompt built into the UI). Traps
  keep their near-miss + debrief. No backend, no API cost. (`docs/AI_PIPELINE_SPEC.md`)
- **Human-in-the-loop.** The importer's review/confirm step is the hallucination guard; the
  prompt also hard-requires "use only facts in the source" (`prompts/trap_generator.md`).
- **Eye-strain fix.** Opt-in "Reading" control on the arcade (dim CRT glow/scanlines + bigger
  text), saved per device, off by default.
- **`.json` upload** alongside PDF/Word/text.

## Backend (Perplexity), captured not built
- In-app AI generation (`POST /api/generate`); client seam ready.
- Server-side mastery model + 50/30/20 Run Director. Flagged a real bug in Gemini's
  `calculateCalibration` (uses mastery where it should use calibration).

## Lower priority
- Terminology abstraction ("Audit Moment" → "Elite Encounter", etc.). The canonical arcade is
  already subject-neutral; the CPA jargon lives in legacy `study.html` (being phased out), so a
  risky full rewrite wasn't warranted. Good dedicated skin pass later.

## One push-back
- Gemini leans on "keep them addicted." Optimize for genuine learning and healthy habits, not
  compulsion — no fake scarcity, honest guarantees. Retention through real value.
