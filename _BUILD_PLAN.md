# ACED — "take on all of them" build plan

Legend: [ ] todo  [~] in progress  [x] done  [SCAF] scaffolded+documented  [CPA] needs human review

## 1. Question bank
[x] Rewrite 107 weak explanations (done, 0 remaining)
[x] New original bank (batch-04, 45 Qs) — all 19 modules now covered
[x] ASC accuracy improved + human-CPA-review flagged in headers

## 2. Match the real exam
[x] TBS renderer in study.html (numeric + select; menu→open→graded) — tested
[x] Mock Exam mode behind 60% gate — tested (gate unlock + modal)
[x] Review/spaced-repetition mode (Leitner-lite) — tested

## 3. Retention & daily loop
[x] Landing wires Daily Close (primary CTA) + live streak chip
[x] DAILY link in study.html topbar
[x] Streak HUD badge + calm comeback tab nudge

## 4. Dormant modules
[x] Calibration (Brier) tracking + readiness mini-bar — via aced-core
[x] Miss-tracking + review feed — via aced-core (schema-correct)
[x] Removed broken daily.js from study.html (superseded by aced-core)
[x] juice.js documented as legacy duplicate (README_CANONICAL.md)

## 5. Persistence & data
[x] Fixed mastery-reset: readiness now accumulates across runs
[x] Analytics shim in aced-core (buffers + sink hook) — tested
[x] Backend abstraction (aced-core) + BACKEND_SPEC.md (scaffold)

## 6. UX / mobile / accessibility
[x] Rebuilt index.html — CRT brand, Daily loop, streak, roadmap, email scaffold — tested
[x] Keyboard play + ARIA + focus styles in study.html — tested (cards + choices)
[~] Mobile: responsive breakpoints in landing + study; engine still desktop-first (noted)

## 7. Marketability & growth
[x] cpa-aud.js template + AUD starter bank — boots in same engine, tested
[x] Email capture scaffold + honest section roadmap on landing

## 8. Code hygiene
[x] README_CANONICAL.md (ship vs legacy)
