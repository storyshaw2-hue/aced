# Study-pack schema

A pack contains material, not executable rules. All packs use the same game engine.

## Pack fields

| Field | Meaning |
| --- | --- |
| `version` | Export schema version, currently `1` |
| `id` | Stable library identity; generated for a new import |
| `name` | Pack title, up to 100 characters |
| `subject` | Optional human-readable subject, up to 100 characters |
| `description` | Optional summary, up to 500 characters |
| `questions` | 1 to 2,000 question objects |

## Question fields

| Field | Meaning |
| --- | --- |
| `id` | Stable question ID; generated from content when absent |
| `q` | Question text |
| `answer` | Zero-based correct index for MCQ; expected text for recall |
| `choices` | Optional list of 2 to 8 distinct, non-empty strings |
| `source` | Optional topic label; defaults to `General` |
| `explain` | Optional explanation shown after answering |

Fields are plain text. HTML is displayed literally, never executed. A field may contain up to 6,000 characters; topics and names have shorter limits. Duplicate question IDs, identical imported questions, invalid answers and invalid choices are rejected with actionable messages.

## Compatible import aliases

`title` maps to `name`; `section` maps to `subject`. A bare array of questions is accepted. `cards` can stand in for `questions`, and front/back flashcards work without choices.

Question aliases include `prompt`, `question`, or `front` for `q`; `back` or `a` for a recall answer; `options` for `choices`; `topic` for `source`; and `explanation` or `why` for `explain`. Letter-based MCQ answer keys and exact answer text are accepted on import and normalized to zero-based indices on export.

## Content-only example

```json
{
  "name": "Getting started",
  "subject": "ACED",
  "questions": [
    {"q": "What can you buy between rounds?", "answer": "Jokers"},
    {"q": "What earns Insight?", "choices": ["A correct answer", "Sorting cards"], "answer": 0}
  ]
}
```

Exported packs include no personal answer history, game scores or learning records. Shared copies receive a separate library identity; editing an existing saved pack retains its ID.
