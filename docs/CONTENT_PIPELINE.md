# Content pipeline

All imported and shipped material goes through `ACEDLibrary.normalize`. This is the same validation contract used in the browser and `node tools/validate.js`.

## Starter packs

Register starter metadata in `aced-library.js`, supply a content-only file in `packs/`, and set a stable pack ID. The question count in the registry must match the actual content.

Keep poker cards, scoring, jokers and run length out of content files. Every subject uses `aced-game-rules.js` and `aced-game.js`.

## Validation

Run `node tools/validate.js` for all starters, or `node tools/validate.js --pack ID`. Run the library and rules unit tests before shipping.

Use material you have rights to distribute. Do not import or publish paid-provider question text or private study materials into the public repository. A user's personal upload remains in their browser unless they export or share it.
