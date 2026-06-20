# ACED — Universal Exam Engine

A roguelike study game for any high-stakes exam. Inspired by the deck-building, score-snowball loop of Balatro, applied to CPA, NCLEX, USMLE, Bar, AWS, and any test where active recall beats passive reading.

> Drop in your study material. Get a playable, score-chasing study session. Actually want to keep studying.

**Live site:** [aced.pplx.app](https://aced.pplx.app)

---

## What it does

ACED turns multiple-choice questions into a Balatro-style roguelike:

- **Cards** are concepts from your study material (e.g. "Revenue Recognition", "Deferred Tax", "Fair Value")
- **Hands** are scored with `chips × mult`, where bigger streaks + faster answers compound
- **Doctrines** (the "Jokers" of ACED) modify scoring — `+Mult` builders and `×Mult` payoffs create deckbuilding tension
- **Audit Risk** (the "Strikes" of ACED) increases on wrong answers; max out and the run ends
- **Bosses** are exam-style obstacles ("Oral Exam" = faster answers needed, "Pop Quiz" = wrong answers cost 2 questions)
- **Shop** between rounds lets you draft new doctrines, buy consumables, or rebuild your deck

After every answer, the correct answer + explanation appears, so playing the game IS studying.

## Decks

- **AICPA Official 2026 (FAR)** — 25 released questions tagged with official Blueprint codes
- **CPA · FAR Simulations** — 115 questions across 24 topics
- **CPA · FAR (F1–F4)** — 26 starter questions
- **World Geography** — demo deck showing the engine works for any subject
- **Daily Challenge** — seeded RNG rotation
- **Generate from your material** — drop a PDF / notes / question bank, the in-app LLM builds a deck (uses your own OpenAI or Anthropic API key)

## Tech

Pure static site. No build step.

- `index.html` — splash + onboarding
- `engine.html` — the game engine and menu
- `study.html` — alternate Balatro-mode engine with doctrine snowball
- `packs/` — JSON/JS question packs
- LLM generator uses pdf.js (CDN) + browser-direct calls to OpenAI / Anthropic with the user's own key

## Local dev

```bash
# Any static server works
python3 -m http.server 8080
# then open http://localhost:8080
```

## Status

In active development. Public launch via Gumroad coming soon.

## License

All rights reserved. See [LICENSE](LICENSE).
