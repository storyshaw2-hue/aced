# Optional backend boundary

The current public study-pack app is local-first and does not call the reference backend in `server/`. Its personal pack library, direct sharing, game and learning records work without an account.

## Retained reference code

The optional Express service contains authentication, generic state synchronization, opt-in leaderboard guards, and disabled billing routes. Its tests still run independently. No database tables or existing user rows are removed by the universal-engine update.

## Before enabling integrations

The pack collection is stored separately from per-pack question history. Connecting an account client alone does not synchronize the collection; specify collection merging, stable IDs, conflict handling, deletion semantics and exports first.

Do not advertise accounts, cloud backup, hosted community publishing or paid content until their actual flows have been implemented and tested. The public frontend currently contains no purchase offers.
