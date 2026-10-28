# ACED Assessment Loop (ASSESS)

Purpose: after every shipped change (and at least weekly), assess acedhq.com for **profitability** from several angles. The results feed the Strategist, who turns them into the next Bet.

## Where it sits in the pipeline
```
Strategist (BET) -> Architect (SPEC) -> Builder (BUILD/MERGE) -> Release Manager (REVIEW/READOUT)
      ^                                                                   |
      |                                                                   v
      +---- Strategist ASSESS  <-- 5 assessor lenses (parallel) <---------+
```
**Triggers** (the Builder or the coordinating assistant starts ASSESS):
1. After an item's CLOSE OUT (all slices merged), or after a Release Manager READOUT.
2. When nothing is APPROVED (replaces plain PROPOSE).
3. On owner request ("assess the site").

## The 5 lenses
Each lens is a specialist agent. Until those agents exist, the Strategist runs each lens itself.

| # | Lens / agent | Question it answers | Main sources |
|---|---|---|---|
| L1 | **Market & Competitor Research** | Who else sells this, at what price, and what gap can ACED own? | web search, competitor pricing pages |
| L2 | **Monetization & Pricing** | What can ACED charge for, where is the upgrade moment, and what is the expected conversion? | pricing.html, aced-pro.js, aced-config.js monetization, docs/ACCOUNTS_STRIPE.md, L1 output |
| L3 | **Growth, SEO & Distribution** | How do people find ACED, and what loop brings more of them? | sitemap.xml, robots.txt, learn/, landing pages, share links, web search results |
| L4 | **Conversion UX & Onboarding** | Where do new visitors drop off before they get value? | index.html, study.html, importer, library, live site |
| L5 | **Data & Retention** | What do the numbers say (once analytics is live)? Is D1/D7 retention improving? | Plausible (after activation), Release Manager READOUTs, docs/specs |

## Lens output format (every lens returns exactly this)
```
LENS: <L1-L5 name>   DATE: <UTC>   BASELINE: main@<sha>
FINDINGS (max 5), each:
  - ID: <L#-n>  Title
  - Evidence: <VERIFIED IN CODE file:line | VERIFIED LIVE url | EXTERNAL RESEARCH url | UNKNOWN>
  - Revenue impact: H/M/L (+ the mechanism: price, conversion, traffic or retention)
  - Confidence: H/M/L   Effort: S/M/L
  - Promise check: PASS / CONFLICT (which promise)
  - Smallest version (one sentence)
NOT ASSESSED: <what it could not check, and why>
```
Lenses are **read-only**. They never write to GitHub, approve work, or contact other agents.

## Strategist consolidation -> SCORECARD
1. Merge duplicate findings across the lenses.
2. Score each finding: **(Revenue impact x Confidence) / Effort**, with H=3, M=2, L=1 and S=1, M=2, L=3. Drop or flag anything that CONFLICTs with a core promise unless the owner has changed that promise.
3. Output the **top 3 Bet candidates** in the Bet format (goal, hypothesis A->B, metric, guardrail, scope, kill criterion, promise check), plus the full ranked table.
4. Hand off to the Builder, which adds them to BACKLOG in the control issue (B-n IDs) and saves the scorecard as `docs/strategy/SCORECARD-<YYYY-MM-DD>.md` through its normal PR flow.
5. **Only the owner moves a candidate to APPROVED.** Nothing in ASSESS approves work.

## Standing constraints the lenses must respect
- Brand option C: no paid launch or brand spend until trademark clearance relative to "Aced" (aced.io).
- Production deploy is blocked until the owner confirms DB certificate validation.
- Working price idea: Pro at $8.99/mo (TUNABLE). Cycle 1 is not CPA-focused; BYO notes is the main segment.
- Never invent metrics. Before analytics is live, revenue and funnel numbers are UNKNOWN.
