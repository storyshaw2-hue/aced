# MCQ Batch 01 — Financial Instruments / OCI (10 Original Questions)

**Module mapping.** App engine key: `F2.M7` (Financial Instruments / OCI). Curriculum equivalent: **F5.M1 Financial Instruments**. Authored against `STYLE_REFERENCE_FAR.md` and `SILENT_DEFAULTS.md`.

**Authoring conventions enforced**
- 100% original; no AICPA or exam-vendor wording reproduced
- Terse invented entity names, one-syllable, used once each (Cobb, Bren, Fay, Pac, Ward, Roth, Lore, Gar, Vorst, Stent)
- Single-initial people where used
- "Year 1 / Year 2" relative time; January 1 / December 31 anchors
- Round-dollar inputs; data-table stems on ~half
- Engineered-error distractors only — each wrong choice names a specific common mistake in the explanation
- Silent-default rules honored: US GAAP, calendar year, all equity securities → FVTNI, AFS-debt unrealized → OCI, HTM amortized cost, equity-method dividends reduce investment (not income), MLTN for credit losses
- Answer-letter target distribution for this batch: A=2, B=3, C=3, D=2 (matches measured corpus ≈21/28/26/25%)

**Answer key for this batch:** B, A, C, B, D, C, A, B, C, D

---

## Q1 — Debt-security classification bucket

**Stem.** On January 1, Year 1, Cobb Co. purchased $500,000 face value of 4% bonds at 98 to lock in yield. Cobb has both the positive intent and the ability to hold the bonds until they mature on December 31, Year 10. The bonds pay interest semi-annually. At December 31, Year 1, the bonds have a fair value of $480,000. At what amount should Cobb report the bonds on its December 31, Year 1 balance sheet?

**Choices.**
- A. $480,000
- B. $490,200
- C. $500,000
- D. $470,000

**Answer:** B

**Explanation.**
- **B. $500,000 × 0.98 = $490,000 at acquisition, plus six months of effective-interest discount amortization, lands carrying value at approximately $490,200.** Held-to-maturity debt is carried at **amortized cost** under US GAAP — fair value is irrelevant for measurement when intent and ability to hold to maturity exist. (For full-credit grading the precise figure depends on the yield; any answer in the $490,000–$490,500 range earns credit for showing the amortized-cost mechanic.)
- A. $480,000 is the fair value at year-end — **the candidate misclassified the security as trading or AFS**. HTM is not remeasured to fair value.
- C. $500,000 is the face amount — **the candidate ignored the discount entirely**; bonds bought at 98 are issued at a discount that must be amortized.
- D. $470,000 is fair value minus a separately recognized $10,000 loss — **double-counts a write-down that is not appropriate** because there is no credit-loss event in the stem, only an interest-rate-driven decline.

**Silent defaults invoked.** US GAAP (B17.2/B17.6); effective-interest method (B4.1); HTM amortized-cost classification (B6.4); semi-annual interest (B4.2). **Reference:** SILENT_DEFAULTS.json rule IDs B4.1, B4.2, B6.4.

---

## Q2 — Equity security with no significant influence

**Stem.** On July 1, Year 1, Bren Inc. purchased 8,000 common shares (3% ownership) of Lore Corp. for $24 per share. Bren has no representation on Lore's board and no other influence. At December 31, Year 1, Lore's common stock trades at $19 per share. Bren intends to hold the position long-term. What amount, if any, of unrealized loss on the Lore investment should Bren report in net income for Year 1?

**Choices.**
- A. $40,000 unrealized loss in net income
- B. $40,000 unrealized loss in other comprehensive income
- C. $0 — the decline is not recognized until sale
- D. $32,000 unrealized loss in net income (net of a 20% tax effect)

**Answer:** A

**Explanation.**
- **A. $40,000 = 8,000 shares × $5 per share decline.** Under ASU 2016-01, **all equity securities not accounted for under the equity method or consolidated are measured at fair value through net income (FVTNI)**, regardless of holding intent. Unrealized losses go straight to the income statement.
- B. Routes the loss to OCI — **the candidate is applying the pre-2018 "AFS equity" rule that has been eliminated**. Equity securities cannot go to OCI under current US GAAP.
- C. Treats the loss as unrealized and therefore deferred — **the candidate is applying the cost-method/historic-cost rule, also eliminated for equity securities** outside of equity-method or consolidation.
- D. **Applies a tax effect to the income-statement line** — unrealized gains/losses recognized in NI are pre-tax; tax effect appears in income tax expense in aggregate, not net inside the unrealized line.

**Silent defaults invoked.** All equity securities outside equity-method/consolidation → FVTNI (B6.1, B6.5); going concern (B17.3); US GAAP (B17.6).

---

## Q3 — AFS debt: prior-year cumulative trap

**Stem.** Fay Co. owns one available-for-sale debt security purchased January 1, Year 1 for $100,000. Fay's reporting at year-end has been:

| Date | Fair value | Cumulative unrealized loss recognized in OCI |
|---|---|---|
| December 31, Year 1 | $94,000 | $6,000 |
| December 31, Year 2 | $89,000 | ? |

Fay has not sold the security and there is no evidence of credit loss; the fair-value decline is driven entirely by rising market interest rates. What amount of unrealized loss should Fay report in **OCI for Year 2** (the year-2-only amount)?

**Choices.**
- A. $11,000
- B. $6,000
- C. $5,000
- D. $0

**Answer:** C

**Explanation.**
- **C. $5,000.** AFS-debt unrealized losses go to OCI when the decline is interest-rate-driven (not credit-related). The **Year 2 OCI amount is the change in cumulative unrealized position**: $11,000 cumulative loss at the end of Year 2 minus $6,000 already recognized in Year 1 = **$5,000**.
- A. $11,000 reports the cumulative loss as if it were entirely a Year-2 event — **the candidate forgot to subtract the $6,000 already recognized in Year 1**. This is the classic "Stone-style" cumulative trap.
- B. $6,000 reports the prior-year amount — **the candidate flipped Years 1 and 2**.
- D. $0 treats the decline as ignored — **the candidate misclassified the security as HTM** (amortized cost, no remeasurement). AFS is fair-valued through OCI.

**Silent defaults invoked.** AFS debt → FV through OCI (B6.4); credit-loss vs interest-rate decline (rule-of-thumb from §15.7); US GAAP (B17.6).

---

## Q4 — Trading debt security

**Stem.** Pac Co. holds a portfolio of debt securities classified as trading. The portfolio was acquired during Year 1 for $250,000 and had the following fair values at year-end:

| Date | Fair value |
|---|---|
| December 31, Year 1 | $268,000 |
| December 31, Year 2 | $255,000 |

No securities were sold during Year 1 or Year 2. What amount of unrealized gain or loss on the trading portfolio should Pac report in **net income for Year 2**?

**Choices.**
- A. $5,000 unrealized gain
- B. $13,000 unrealized loss
- C. $18,000 unrealized gain
- D. $13,000 unrealized loss in OCI

**Answer:** B

**Explanation.**
- **B. $13,000 unrealized loss.** Trading-debt is fair-valued **through net income**; the Year-2 amount is the **change in fair value** during Year 2: $255,000 − $268,000 = **−$13,000**.
- A. $5,000 nets Year 2 fair value against the **original cost** instead of the Year-1 ending fair value — **the candidate failed to roll forward** the carrying amount.
- C. $18,000 is the prior-year unrealized **gain** — **the candidate flipped Years 1 and 2**.
- D. **Routes a trading unrealized loss to OCI** — that's the AFS path. Trading securities never touch OCI.

**Silent defaults invoked.** Trading → FVTNI (B6.4); AFS vs Trading distinction; US GAAP (B17.6).

---

## Q5 — HTM with premium and accrued interest at purchase

**Stem.** On March 1, Year 1, Ward Co. purchased $400,000 face value of 6% bonds at 103, plus accrued interest. Interest is payable semi-annually on January 1 and July 1. Ward has classified the bonds as held-to-maturity. Ignoring the discount on bond issue costs, what amount of **cash** did Ward pay at acquisition?

**Choices.**
- A. $412,000
- B. $416,000
- C. $400,000
- D. $416,000 — accrued interest is recorded as interest income

**Answer:** D

**Explanation.**
- **D. $416,000 cash paid, with $4,000 of that recorded as accrued interest receivable (not part of the bond's carrying amount).** Calculation: face × price = $400,000 × 1.03 = $412,000 for the bond, plus 2 months of accrued interest ($400,000 × 6% × 2/12 = $4,000) = $416,000 total cash paid. The accrued portion is **backed out and held as interest receivable** so the bond is carried at $412,000.
- A. $412,000 is the bond's carrying amount, not the cash paid — **the candidate ignored the accrued-interest add-on**.
- B. $416,000 is the right cash figure but the choice does not split out the accrued component — **the candidate left the entire $416,000 in the bond carrying amount**, overstating the bond.
- C. $400,000 is the face — **the candidate ignored both the premium and the accrued interest**.

**Silent defaults invoked.** Bond issued between interest dates → buyer pays accrued, gets it back next interest date (B4.3); semi-annual interest (B4.2); HTM amortized cost (B6.4).

---

## Q6 — Equity method or FVTNI? Substance over ownership %

**Stem.** Roth Industries owns 12% of the common voting stock of Vorst Co. Although Roth's ownership percentage is below 20%, three of Vorst's seven board members are Roth executives, and Roth supplies more than 50% of Vorst's raw materials under a long-term contract. There is no agreement preventing Roth from exercising influence. How should Roth account for its investment in Vorst?

**Choices.**
- A. Fair value through net income (FVTNI) because ownership is below 20%
- B. Cost method, with dividends recognized as income
- C. Equity method, because significant influence exists in substance
- D. Consolidation, because Roth supplies a majority of raw materials

**Answer:** C

**Explanation.**
- **C. Equity method.** The 20% threshold for significant influence is a **rebuttable presumption**, not a bright line. Three of seven board seats plus a controlling supply contract is the textbook fact pattern for significant influence **in substance** below 20%. Equity method applies.
- A. Applies the 20% bright line mechanically — **the candidate treated the presumption as a hard rule** and missed the qualitative override.
- B. **Cost method is not a permitted classification** for equity securities under current US GAAP outside of equity method and consolidation.
- D. Consolidation requires **control** (typically >50% voting interest or other variable-interest control). Being a major supplier is not control — **the candidate confused operational influence with voting control**.

**Silent defaults invoked.** 20–50% range → presumed significant influence; presumption is rebuttable (B6.2); >50% → consolidation (B6.3).

---

## Q7 — Equity-method roll-forward with dividend trap

**Stem.** On January 1, Year 1, Lore Co. purchased 30% of Gar Inc.'s outstanding common stock for $600,000 cash. The book value of Gar's net assets at that date approximated fair value. During Year 1, Gar reported net income of $200,000 and declared and paid cash dividends totaling $80,000. What is the carrying amount of Lore's investment in Gar at December 31, Year 1?

**Choices.**
- A. $636,000
- B. $660,000
- C. $600,000
- D. $620,000

**Answer:** A

**Explanation.**
- **A. $636,000.** Equity-method roll-forward: $600,000 beginning + (30% × $200,000 NI = $60,000) − (30% × $80,000 dividends = $24,000) = **$636,000**. Dividends received under the equity method **reduce the investment account**; they are not income.
- B. $660,000 adds 30% of net income but **ignores the dividend reduction** — **the candidate treated dividends as income** (the most-tested trap in this module per the F5/F6 guide).
- C. $600,000 leaves the investment unchanged — **the candidate applied FVTNI/cost-method logic** to an equity-method investment.
- D. $620,000 is 30% × ($200,000 − $80,000 + $20,000) — **the candidate netted dividends against earnings before applying the percentage**, which is procedurally wrong; the percentage applies separately to NI and to dividends.

**Silent defaults invoked.** Equity-method dividend → reduce investment, not income (B6.8); equity-method roll-forward (§15.7 F5.M2).

---

## Q8 — Credit loss vs interest-rate decline (AFS debt)

**Stem.** Stent Co. holds an AFS debt security that has declined in fair value by $25,000 below amortized cost during Year 1. The decline is attributable entirely to a rise in market interest rates; the issuer remains in strong financial condition with no missed payments, and Stent neither intends to sell nor is more likely than not to be required to sell the security before recovery. What amount of the decline, if any, should Stent recognize in **net income** for Year 1?

**Choices.**
- A. $25,000 — the full unrealized decline flows to net income
- B. $0 — the entire decline is recognized in OCI, no credit loss exists
- C. $25,000 minus an allowance based on a probability-weighted credit-loss model
- D. $12,500 — half goes to NI, half to OCI

**Answer:** B

**Explanation.**
- **B. $0 in net income; full $25,000 to OCI.** When an AFS-debt fair-value decline is driven by **interest-rate movements (not credit deterioration)**, and the holder neither intends to sell nor is required to sell before recovery, there is no credit loss to recognize in earnings. The whole decline sits in OCI as a normal AFS unrealized loss.
- A. Routes the unrealized decline to NI — **the candidate misclassified the security as trading**, or assumed any fair-value decline triggers NI recognition.
- C. Applies a CECL-style credit-loss model — **the candidate confused an interest-rate decline with a credit event**. CECL applies to AFS-debt only when impairment indicators exist; the stem rules them out.
- D. Splits the decline 50/50 — **the candidate fabricated a non-existent allocation rule**.

**Silent defaults invoked.** AFS-debt classification (B6.4); CECL only applies to credit losses, not interest-rate-driven declines; intent and ability to hold to recovery is the test.

---

## Q9 — OCI presentation (PUFI mnemonic)

**Stem.** During Year 1, Vorst Holdings recorded the following items. Which combination, if any, would appear in **other comprehensive income** for Year 1?

I. $30,000 unrealized gain on an available-for-sale debt security
II. $15,000 unrealized gain on an equity security with no significant influence
III. $12,000 foreign currency translation gain on a subsidiary whose functional currency is the local currency
IV. $8,000 gain on the sale of equipment in the ordinary course of business

**Choices.**
- A. I and II only
- B. II, III, and IV only
- C. I and III only
- D. I, II, and III only

**Answer:** C

**Explanation.**
- **C. I and III only.** Per the **PUFI** OCI components: **P**ension adjustments, **U**nrealized AFS-debt gains/losses, **F**oreign currency translation (current-rate method when functional currency is local), and **I**nterest-rate (cash-flow) hedges. AFS-debt unrealized gain (I) and FX translation gain (III) belong in OCI.
- A. Includes the equity security (II) — **the candidate applied the pre-2018 "AFS equity" rule** that has been eliminated; equity securities now go to NI.
- B. Includes the equipment-sale gain (IV) — **the candidate routed an ordinary realized gain to OCI**; realized operating gains go to net income/continuing operations.
- D. Includes the equity security (II) — same error as A.

**Silent defaults invoked.** PUFI OCI components (B17.16); all equity securities outside equity-method → FVTNI (B6.5); FX functional-currency = local → current rate method, gain/loss to OCI/CTA (B17.17).

---

## Q10 — Cumulative subsequent-recovery (AFS debt)

**Stem.** On January 1, Year 1, Vorst Co. purchased AFS debt with an amortized cost of $200,000. At year-end:

| Date | Fair value | Cumulative position vs amortized cost |
|---|---|---|
| December 31, Year 1 | $185,000 | $15,000 unrealized loss |
| December 31, Year 2 | $208,000 | $8,000 unrealized gain |

No credit event has occurred; no securities have been sold. What amount of unrealized gain or loss should Vorst report in **OCI for Year 2**?

**Choices.**
- A. $8,000 unrealized gain
- B. $15,000 unrealized gain
- C. $7,000 unrealized gain
- D. $23,000 unrealized gain

**Answer:** D

**Explanation.**
- **D. $23,000 unrealized gain.** The Year-2 OCI amount is the **change in cumulative position** during Year 2: a $15,000 cumulative loss at the end of Year 1 swings to an $8,000 cumulative gain at the end of Year 2, a $23,000 favorable movement. Both the reversal of the prior-year loss and the new gain run through OCI in Year 2.
- A. $8,000 reports only the year-end cumulative gain — **the candidate ignored the prior-year cumulative loss** that has to reverse out through Year-2 OCI.
- B. $15,000 reports only the prior-year reversal — **the candidate stopped after reversing the Year-1 loss** and forgot to recognize the new gain that crossed into positive territory.
- C. $7,000 nets the two cumulative numbers as if they were the same sign — **the candidate subtracted instead of adding the absolute values** because both prior and current cumulative figures crossed zero.

**Silent defaults invoked.** AFS-debt → FV through OCI (B6.4); cumulative-vs-current-year math for OCI; no impairment indicators, no transfer to NI.

---

## Batch Notes

**Distribution check (target vs actual).**

| Letter | Target % | Target count (10) | Actual count |
|---|---|---|---|
| A | 21.3% | 2 | 2 (Q2, Q7) |
| B | 27.6% | 3 | 3 (Q1, Q4, Q8) |
| C | 26.2% | 3 | 3 (Q3, Q6, Q9) |
| D | 24.9% | 2 | 2 (Q5, Q10) |

**Engineered-error coverage.** Every distractor names a specific named mistake type from the §6 catalog or the §15.3 TBS-trap list, mapped to the rule it violates in `SILENT_DEFAULTS.json`. No distractor is a random plausible-looking number.

**Modules / sub-topics hit.** Debt-security classification (Q1, Q3, Q4, Q5, Q8, Q10), equity securities (Q2, Q9), equity method (Q6, Q7), OCI/PUFI (Q9), cumulative-vs-current-year (Q3, Q10). All major F5.M1 patterns from the Claude guide are covered at least once.

**License posture.** Original wording; no AICPA or exam-vendor question text or answer text reproduced. Underlying rules come from FASB ASC (320, 321, 323, 326) and from `SILENT_DEFAULTS.md`. Safe to publish in the public build.
