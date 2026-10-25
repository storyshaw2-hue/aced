# Import and review

The importer supports deterministic question/answer extraction and a mandatory review opportunity before playing. It does not generate answers from arbitrary prose.

## Supported inputs

- **JSON:** the [pack schema](../packs/_schema.md), question arrays, or front/back flashcard arrays.
- **CSV/TSV:** question and answer columns, with optional topic and explanation. Quoted commas, newlines, and doubled quotation marks are supported. A header is optional.
- **TXT/Markdown:** one `Term: definition`, `Term = definition`, or `word / translation` per line; alternatively, `Q:` and `A:` blocks. Markdown headings are ignored.
- **Paste:** any of those structured formats.

Files are limited to 5 MB; parsed text to 2,000,000 characters; packs to 2,000 questions. Unsupported formats, incomplete rows, unmatched CSV quotes and partly unstructured notes produce errors rather than silently discarded content.

## Review and save

Edit pack name/subject and each question's prompt, answer, choices, topic and explanation. Remove or add questions as needed. Run difficulty is optional and defaults to Standard.

`Save & play` creates a stable pack identity and launches the shared engine. `Save to library` keeps the review open. Editing through `?edit=ID` retains that pack and its question identities; importing another file creates an independent pack.

Changing a question's expected answer resets its recall progress and spaced-review record, without changing the question ID. Removing a pack through the library confirmation also removes its per-pack browser history.

## Sharing and privacy

Exports are JSON files, with content but no progress. Small packs can be encoded in a share-link fragment; recipients review and save a separate copy. Links beyond the reliability limit use file export instead.

The new library has no cloud sync or public publishing. If browser storage is blocked or full, a warning appears and export is offered; do not describe temporary state as a persistent save.
