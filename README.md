# ACED

Study is a video game now, for anything you want to learn. ACED turns study material into a poker roguelike where every round ends in a real question you bet LOW, MED or HIGH on.

Live site: [acedhq.com](https://acedhq.com). The app is vanilla HTML, CSS and JavaScript, with no framework or transpilation required for the core experience.

## The game

- **Poker hands, chips and mult:** colored suits, hand types, boss blinds and a 120-joker pool whose effects stack and chain by position.
- **Exam Moments with confidence betting:** clear a round, answer a question from your weakest topic, and bet LOW, MED or HIGH before you see the result. Honest calibration is scored.
- **Shop economy:** jokers, consumables, booster packs, vouchers, rerolls and an Insight meter.
- **Nemesis, daily close, achievements, codex, review queue and task-based simulations** for the CPA packs.
- **Stakes and a starting joker:** Casual, Standard or Brutal, plus an optional relic joker, chosen when you save a pack or from the library.

## Content

- **CPA exam packs:** FAR, AUD, REG and BAR, with original questions, simulations, boss names and learning pages. They keep their exam wording (fiscal years, closes, doctrines).
- **Starter runs:** World Capitals and Everyday Spanish.
- **Exam hubs:** USMLE, MCAT, NCLEX, LSAT and Bar pages.
- **Your own packs:** import JSON, CSV, TSV, TXT or Markdown, or paste question/answer pairs. PDFs and Word files go through the document importer. Packs you upload play in the same engine as everything else and use neutral run wording (antes, rounds) instead of exam wording.

## Main pages

| Page | Purpose |
| --- | --- |
| `index.html` | Landing page and quick-paste handoff |
| `library.html` | Your saved packs (play, edit, export, share, delete) plus every built-in run |
| `importer.html` | Upload, review, edit and save a pack; `?edit=PACK_ID` edits a saved pack |
| `importer-classic.html` | Document importer for PDF and Word files |
| `study.html?pack=PACK_ID` | The full game; built-in packs (`cpa-far`, `world-capitals`, ...) and saved library packs |
| `daily.html` | The Daily Close |
| `cpa.html`, `usmle.html`, `mcat.html`, `nclex.html`, `lsat.html`, `bar-exam.html` | Exam hubs |
| `aced-jokers-demo.html`, `league.html`, `builder.html`, `store.html`, `pricing.html` | Joker sandbox, leagues, pack builder, full catalog, plans |

## Architecture

| File | Responsibility |
| --- | --- |
| `study.html` | The game engine: rounds, scoring, shop, Exam Moments, bosses, review, simulations |
| `aced-bridge.js` | Lets the game play library packs: turns questions into gradable multiple choice, maps stakes and starting joker to engine mods, records answers as pack progress |
| `aced-library.js` | Pack schema, parsing, validation, identities, collection storage, exports, share links and progress reads |
| `aced-importer.js`, `aced-ui.js`, `aced-library-page.js` | Upload and review flow, shared dialogs, the "Your packs" section of the library |
| `aced-core.js` | Defensive per-pack storage, question identity, spaced review and calibration |
| `packs/` | Built-in packs; `packs/core-jokers.js` holds the shared joker effects |
| `tools/build.js` | Copies the public runtime into `dist/` (no docs, tests, server code or source banks) |

Load scripts with `defer` unless a page needs the value immediately. User-imported files are data, never executable JavaScript.

The optional `server/` reference implementation (accounts, sync, leaderboard) stays available. The paywall is switched off in `aced-config.js`, so everything is free.

## Pack format

```json
{
  "version": 1,
  "name": "My study pack",
  "subject": "Anything",
  "questions": [
    {
      "id": "question-1",
      "q": "What powers a study run?",
      "choices": ["Your questions", "A subscription"],
      "answer": 0,
      "source": "Getting started",
      "explain": "The same engine uses the questions in your selected pack."
    },
    {
      "id": "question-2",
      "q": "What can correct answers earn?",
      "answer": "Insight and bonus cash",
      "source": "Getting started"
    }
  ]
}
```

`choices` is optional. With choices, `answer` is a zero-based index; without choices, it is the expected recall answer. Import aliases include `prompt`, `question`, `front`/`back`, and legacy `options`. IDs are stable through edits. Explanations and topics are optional.

See [packs/_schema.md](packs/_schema.md) and [docs/IMPORTER.md](docs/IMPORTER.md) for the complete contract. Parsing is deterministic; arbitrary prose and PDFs are not represented as generated questions.

## Storage and privacy

Packs are stored in `aced:packs:v1`. Each pack has a unique ID and separate `aced:PACK_ID:` progress keys. Saving a second pack does not overwrite the first; editing through `?edit=` retains identity.

Browser storage can be unavailable or full. The app then displays a warning and uses temporary in-memory state; export is the backup path. The play handoff can carry a small temporary pack in a URL fragment. Do not promise cross-device persistence.

Shared links contain the pack itself, not the author's progress. Anyone with the link can import it; larger packs must be exported as JSON instead. Uploaded material is not sent to an AI provider or a backend.

## Development and tests

Serve this folder with any static server, for example `npx serve . -l 3000 --no-clipboard`, then open `http://127.0.0.1:3000/index.html`. No build step is needed to develop the app.

```sh
node tools/check.js
node tools/validate.js
node aced-library.test.js
node aced-importer.test.js
node tools/check.test.js
node --test aced-bridge.test.js
node tools/score.test.js
node aced-core.test.js
node aced-pack.test.js
```

The GitHub workflow also runs the independent utility and optional-backend unit tests. Browser QA should cover upload → review → save → play, a second independently saved pack, export/import, shared-link import, MCQ and recall challenges, shops, end/restart, and desktop/mobile layouts.

For hosting, `node tools/build.js` copies only public runtime files into `dist/`. Vercel uses this output, excluding repository metadata, internal docs, tests, server code and private packs.

## License

All Rights Reserved. © Story Shaw. Not licensed for redistribution.
