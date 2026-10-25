# ACED

Your notes. Game on. ACED turns structured study material into a poker roguelike, with one subject-neutral engine and a personal library of independently saved study packs.

Live site: [acedhq.com](https://acedhq.com). The app is vanilla HTML, CSS and JavaScript, with no framework, dependencies or transpilation required for the core experience.

## The product

- **Bring a pack:** import JSON, CSV, TSV, TXT or Markdown, or paste question/answer pairs.
- **Review before playing:** edit questions, answers, choices, explanations, topics, name and subject.
- **Keep a collection:** save multiple packs, search and sort them, edit later, export backups, and share a copy with a link.
- **Play a run:** poker hands, 120 shared jokers, boss rounds, shops and an Insight economy.
- **Practice honestly:** automatically graded multiple choice or explicitly self-rated recall. Question progress is separate from game XP and never increases from playing cards.
- **Return to missed material:** per-pack spaced review and confidence calibration for graded answers.

World Capitals and Everyday Spanish are starter packs, not privileged product tracks. Uploaded packs use the exact same game rules and progression.

## Main pages

| Page | Purpose |
| --- | --- |
| `index.html` | Upload-first homepage and quick-paste handoff |
| `library.html` | My packs and starter packs; play, edit, export, share and delete |
| `importer.html` | Import, review, edit and save; `?edit=PACK_ID` edits a saved pack |
| `study.html?pack=PACK_ID` | One shared game engine; defaults to World Capitals |
| `daily.html` | Today's deterministic run for the most recently played pack |

Older general-purpose entry URLs redirect to these pages. There are no paid-content offers or subject-specific versions of the game.

## Architecture

| File | Responsibility |
| --- | --- |
| `aced-library.js` | Pack schema, parsing, validation, identities, collection storage, exports, share links and progress reads |
| `aced-ui.js` | Escaping, reusable dialogs, exports, sharing UI and homepage handoff |
| `aced-importer.js` | File/paste input, editable review, save and launch |
| `aced-library-page.js` | Personal collection, search/sort, copies and management |
| `aced-game-rules.js` | Pure poker rules, deterministic randomness, scoring and joker orchestration; imported directly by tests |
| `aced-game.js` | Run state, rendering, question challenges, shops, audio and learning records |
| `aced-core.js` | Defensive per-pack storage, question identity, spaced review and calibration |
| `packs/core-jokers.js` | Shared, subject-neutral joker effects |
| `app.css` | Shared green-terminal design, responsive layouts and accessibility |

Load scripts with `defer`; initialize the game only after the selected pack's load promise resolves. User-imported files are data, never executable JavaScript.

Some independent utility modules and the optional `server/` reference implementation remain available for development, but are not loaded by the public app. The current pack library does not offer accounts, cloud sync or a hosted community catalog.

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
node aced-game-rules.test.js
node aced-core.test.js
node aced-pack.test.js
```

The GitHub workflow also runs the independent utility and optional-backend unit tests. Browser QA should cover upload → review → save → play, a second independently saved pack, export/import, shared-link import, MCQ and recall challenges, shops, end/restart, and desktop/mobile layouts.

For hosting, `node tools/build.js` copies only public runtime files into `dist/`. Vercel uses this output, excluding repository metadata, internal docs, tests, server code and private packs.

## License

All Rights Reserved. © Story Shaw. Not licensed for redistribution.
