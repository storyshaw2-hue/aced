/* =============================================================================
   ACED — far-f4m3-batch-08.js   (ORIGINAL CONTENT, append-safe)
   -----------------------------------------------------------------------------
   6 original FAR MCQs for F4.M3 "Statement of Changes in Stockholders' Equity."
   Authored from U.S. GAAP (ASC 220 comprehensive income, ASC 250 error/PPA,
   ASC 505 equity, ASC 718/505-30 treasury). This module was thin (1 question);
   this batch brings it to a teachable depth with a balanced concept spread.

   No exam-vendor text reproduced — stems, numbers, choices, and explanations
   are written from scratch. Every distractor is one specific, named mistake.

   SCHEMA (matches study.html / packs/cpa-far.js):
     { source:"F4.M3", diff:"easy|medium|hard", q, choices:[4], answer:<0-based>, explain }

   *** Drafts authored from current GAAP. Verify against ASC before shipping.
   ============================================================================= */
window.ACED_QUESTIONS = (window.ACED_QUESTIONS || []).concat([

  /* 1 — what columns the statement reconciles (concept) --------------------- */
  { source:"F4.M3", diff:"easy",
    q:"The statement of changes in stockholders' equity reconciles the beginning and ending balances of each equity component. Which of the following is NOT a column typically presented in that statement?",
    choices:[
      "Common stock and additional paid-in capital",
      "Retained earnings",
      "Accumulated other comprehensive income",
      "Allowance for doubtful accounts"
    ], answer:3,
    explain:"The statement rolls forward the equity accounts: contributed capital (common/preferred stock + APIC), retained earnings, treasury stock, AOCI, and noncontrolling interest. The allowance for doubtful accounts is a contra-asset on the balance sheet, not an equity component, so it never appears as a column here." },

  /* 2 — net income vs OCI both land in equity (concept) --------------------- */
  { source:"F4.M3", diff:"medium",
    q:"During the year a company reports net income of $300,000 and an unrealized gain of $40,000 on available-for-sale debt securities. By how much does total stockholders' equity increase from these two items, before any dividends?",
    choices:["$340,000","$300,000","$40,000","$260,000"], answer:0,
    explain:"Net income closes to retained earnings (+$300,000) and the unrealized AFS gain is other comprehensive income that closes to AOCI (+$40,000). Both are components of equity, so total equity rises $340,000. $300,000 ignores OCI; $40,000 counts only OCI; $260,000 wrongly nets the gain against income." },

  /* 3 — prior-period adjustment hits beginning RE, not income (ASC 250) ----- */
  { source:"F4.M3", diff:"hard",
    q:"In Year 2, a company discovers it failed to record $90,000 of depreciation in Year 1 (a material error). The tax rate is 21%. How is this correction reported in the Year 2 statement of changes in stockholders' equity?",
    choices:[
      "As a $71,100 reduction of the beginning balance of retained earnings",
      "As a $90,000 reduction of Year 2 net income",
      "As a $71,100 reduction of accumulated other comprehensive income",
      "As a $90,000 reduction of additional paid-in capital"
    ], answer:0,
    explain:"A material prior-period error is a prior-period adjustment under ASC 250: it is corrected by restating and reducing the BEGINNING balance of retained earnings, net of tax — 90,000 × (1 − 0.21) = $71,100 — not by running it through current income. It is unrelated to OCI/AOCI or paid-in capital." },

  /* 4 — treasury stock reduces total equity (contra-equity) ----------------- */
  { source:"F4.M3", diff:"medium",
    q:"A corporation reacquires 5,000 shares of its own common stock for $25 per share, accounting for them under the cost method. In the statement of changes in stockholders' equity, this transaction is shown as a:",
    choices:[
      "$125,000 decrease in total equity, reported in a treasury stock column",
      "$125,000 increase in total equity, reported in additional paid-in capital",
      "$125,000 expense reducing net income for the period",
      "No effect, because the shares are still legally issued"
    ], answer:0,
    explain:"Treasury stock is a contra-equity account. Under the cost method, buying back 5,000 × $25 = $125,000 of stock is shown as a $125,000 reduction of total equity in the treasury stock column. It never touches the income statement, and although the shares remain issued, they are no longer outstanding — equity still falls." },

  /* 5 — cash dividend: declaration date reduces RE -------------------------- */
  { source:"F4.M3", diff:"easy",
    q:"On which date does a cash dividend reduce retained earnings in the statement of changes in stockholders' equity?",
    choices:["The declaration date","The date of record","The payment date","The fiscal year-end, regardless of declaration"], answer:0,
    explain:"A cash dividend becomes a legal liability — and reduces retained earnings — on the DECLARATION date (debit retained earnings, credit dividends payable). The record date only identifies who gets paid, and the payment date settles the liability with cash; neither affects retained earnings." },

  /* 6 — stock dividend moves RE to paid-in; total equity unchanged ---------- */
  { source:"F4.M3", diff:"hard",
    q:"A company with 100,000 shares of $1 par common stock outstanding (market price $15) declares a 10% small stock dividend. What is the effect on the components of stockholders' equity?",
    choices:[
      "Retained earnings decreases $150,000; common stock and APIC increase $150,000; total equity is unchanged",
      "Retained earnings decreases $10,000; total equity decreases $10,000",
      "Retained earnings decreases $150,000; total equity decreases $150,000",
      "No accounts change until the shares are issued"
    ], answer:0,
    explain:"A small stock dividend (<20–25%) is capitalized at fair value: 10,000 new shares × $15 = $150,000 is moved OUT of retained earnings and INTO contributed capital ($10,000 to common stock at par + $140,000 to APIC). It is a reclassification within equity, so total stockholders' equity is unchanged. Cash dividends reduce total equity; stock dividends do not." },

]);
