# ACED Growth Experiment Backlog

## Context

The two metrics this backlog moves are **DAU** and **D7 retention**. The hypothesis is that the daily-loop (one deterministic Daily Close per day, streak visible on return) combined with a shareable spoiler-free score card is the highest-ROI organic growth lever available to a solo founder — because it creates a daily re-engagement hook that requires no ad spend and spreads the product for free through the same social channels exam candidates already use (Discord study servers, Reddit, group chats). Every other experiment in this list either feeds that loop (streaks, confidence, mastery) or amplifies its reach (leaderboard, friend challenge). Use this doc top-to-bottom: the highest-scoring rows have the best return on your limited hours and should ship before anything below them.

---

## Ranked Experiment Table

Score = (Retention Impact + Virality Impact) / Effort (hrs), rounded to 1 decimal. Table sorted by Score descending.

| # | Experiment | Hypothesis | Effort (hrs) | Retention Impact (1–5) | Virality Impact (1–5) | Score | Notes |
|---|---|---|---|---|---|---|---|
| 1 | **Comeback Tab Nudge** | If we change the browser tab title to "Your streak ends tonight — ACED" when a user has an active streak but hasn't played today, then same-day return rate will increase because loss aversion is a stronger motivator than reward anticipation. | 1.5 | 4 | 1 | 3.3 | Pure JS, no backend. Use `document.visibilitychange` + `localStorage` streak date. Ship in one session. |
| 2 | **Friend Challenge Link** | If we let a player share a seed code that lets a friend play the exact same Daily Close deck, then new-user acquisition will increase because exam candidates study in cohorts and peer comparison is inherently motivating. | 5 | 4 | 5 | 1.8 | URL param `?seed=YYYYMMDD-{hash}`. Reuse daily.js deterministic seeder. No server required. |
| 3 | **Streak Rewards + Streak-Freeze** | If we show a visible streak counter and unlock a bonus doctrine slot at 7 days and a free shop reroll at 14 days, then D7 retention will increase because tangible milestone rewards convert abstract habit-forming into a concrete goal. | 4 | 5 | 2 | 1.8 | One free streak-freeze per week stored in `localStorage`. Show freeze icon in HUD. Effort is UI + reward trigger logic. |
| 4 | **Confidence Betting** | If we ask players to declare LOW / MED / HIGH confidence before each answer, then session depth and accuracy will both improve because metacognitive tagging forces active recall rather than passive recognition. | 3.5 | 4 | 2 | 1.7 | confidence.js already exists and is unwired. Main effort is UI (pre-answer modal or inline toggle) and chip delta logic. |
| 5 | **Spoiler-Free Share Card** | If we generate a Wordle-style result grid (🟩🟨⬜) after the Daily Close with a one-tap copy and an image download, then organic new-user acquisition will increase because low-friction shareables are proven to spread exam-prep tools through existing study communities. | 5 | 3 | 5 | 1.6 | social.js already has share-card scaffolding. Use Canvas API for image export. Include acedhq.com URL in card footer. Example grid: `🟩🟨🟩🟩⬜`. |
| 6 | **Local Leaderboard + Username** | If we show players an anonymous username (e.g. "BoldLedger47") and their rank against the top-50 daily scores stored in `localStorage`, then session-end engagement will increase because social comparison — even against anonymous peers — extends time-on-site and increases return probability. | 5 | 3 | 3 | 1.2 | social.js has leaderboard scaffolding. Persist top-50 objects in `localStorage`. "You placed #3 of 41 today" message on result screen. No server needed for MVP. |
| 7 | **Daily Close** | If we ship a single deterministic 5-question run seeded by date (same deck for every player, one attempt per day), then D1 and D7 retention will increase because a hard daily deadline creates urgency that open-ended practice sessions cannot. | 8 | 5 | 3 | 1.0 | daily.js exists and is unwired. Effort includes: date-seeded MCQ picker, attempt-lock after first submit, streak write to `localStorage`, and result screen. The foundation all other experiments depend on. |
| 8 | **Module Mastery Rail** | If we display visible progress bars per module (e.g. "Revenue Recognition: 72%") and unlock advanced cards at 80% mastery, then session depth per module will increase because progress visibility creates completion motivation — the Zeigarnik effect in action. | 6 | 4 | 1 | 0.8 | Requires per-module answer history in `localStorage`. Unlocking advanced cards needs a card-tier flag in the question data. Plan for this after Daily Close is stable. |
| 9 | **Codex Unlocks** | If we let players unlock flavor entries about accounting, legal, and medical concepts as they play (e.g. "27 of 142 unlocked"), then long-term retention will increase because collection mechanics satisfy a completionist drive that extends engagement well past exam prep deadlines. | 22 | 4 | 2 | 0.3 | extras.js has codex scaffolding. Wiring is ~2 hrs; writing 142 high-quality entries is the true cost (~20 hrs). Batch content authoring with an LLM but plan a dedicated content sprint. Lowest score — defer to Wave 3. |

---

## Rollout Plan

### Wave 1 — Foundation (Weeks 1–3, ~14.5 hrs)

**Ship:** Comeback Tab Nudge + Daily Close + Streak Rewards + Streak-Freeze

These three experiments must ship together because they are mutually dependent. The Daily Close is the loop. The streak is the loop's memory. The Comeback Nudge is the loop's re-engagement mechanism. None of the higher-virality experiments (Share Card, Friend Challenge) make sense until players have something worth sharing — a streak and a daily result. Total estimated effort: 1.5 + 8 + 4 = **13.5 hrs**, fitting inside two focused weekends.

**Success looks like:** D7 retention reaches 20% or higher within 30 days of launch, measured as the share of Day-0 cohort that returns for a Daily Close on Day 7.

---

### Wave 2 — Compounding (Weeks 4–6, ~13.5 hrs)

**Ship:** Spoiler-Free Share Card + Friend Challenge Link + Confidence Betting

Once a streak exists, players have a result worth sharing. The Share Card turns Daily Close completions into organic impressions. The Friend Challenge Link turns those impressions into new-user installs — same seed, same deck, head-to-head competition. Confidence Betting ships here because it deepens the session experience for the new users arriving from Wave 2 virality, improving D14+ retention. Total estimated effort: 5 + 5 + 3.5 = **13.5 hrs**.

**Success looks like:** 1 in 8 daily players shares their score card, and at least 15% of share-link clicks result in a new account or session start, within 60 days of ship.

---

### Wave 3 — Depth (Weeks 7–12, ~33 hrs)

**Ship:** Local Leaderboard + Username + Module Mastery Rail + Codex Unlocks

These three experiments reward players who have already formed the daily habit. The Leaderboard gives the returning player a social rank to protect. The Mastery Rail gives them a progress narrative across their exam syllabus. The Codex gives completionists a meta-game that outlasts any single exam cycle — meaning players who pass the Bar still have a reason to return for CPA season. This wave is the heaviest in content hours; Codex authoring should be parallelized with an LLM writing assistant to stay within the time budget. Total estimated effort: 5 + 6 + 22 = **33 hrs**.

**Success looks like:** Average session length increases by 30% compared to Wave 1 baseline, and monthly active users show less than 20% churn month-over-month for users who have unlocked at least one Mastery Rail bar above 50%.

---

## Measurement Plan

All events below are compatible with Plausible custom events or PostHog `posthog.capture()` calls. Each event is a single `localStorage` read away from being populated client-side — no server required.

- **`daily_close_started`** — fires when the player clicks into the Daily Close. Success: fires for >40% of active sessions within 30 days of Wave 1 ship.
- **`daily_close_completed`** — fires on Daily Close result screen render. Track `streak_length` as a property. Success: completion rate >80% of `daily_close_started`.
- **`streak_extended`** — fires when `streak_length` increments. Track length value. Success: median streak length >3 days after 30 days live.
- **`streak_freeze_used`** — fires when player activates the weekly freeze. Success: used by >10% of players with streaks ≥5 days.
- **`share_card_copied`** — fires on clipboard write or image download. Success: fires on >12% of `daily_close_completed` events.
- **`friend_challenge_opened`** — fires when a session loads with a `?seed=` URL param. Success: >15% of share-card recipients open a challenge link.
- **`confidence_bet_placed`** — fires on each confidence declaration. Track `level` (LOW/MED/HIGH). Success: >60% of Daily Close questions receive a bet after feature ships.
- **`tab_nudge_shown`** — fires when document title flips to streak-warning copy. Track `streak_length`. Success: same-day return rate for nudge-triggered sessions >50%.
- **`codex_entry_unlocked`** — fires on each new unlock. Track `entry_id` and `total_unlocked`. Success: average unlocked count per active user >10 within 60 days of Wave 3 ship.
- **`mastery_rail_milestone`** — fires when a module crosses 50% or 80%. Track `module_id` and `threshold`. Success: >20% of active users cross at least one 80% threshold within 90 days.
