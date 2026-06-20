/* =============================================================================
   ACED — far-tbs-batch2.js   (ORIGINAL CONTENT, append-safe)
   -----------------------------------------------------------------------------
   2 original task-based simulations authored from the GAAP rules + the §15 TBS
   patterns. Both use a roll-forward structure (the dominant TBS shape) and embed
   silent defaults (lease implicit-rate; equity-method dividend treatment).

   SCHEMA (matches the TBS draft schema):
     { source, diff, title, scenario,
       items:[ { prompt, type:"numeric", answer, tolerance, explain }
             | { prompt, type:"select", choices:[...], answer:<0-based>, explain } ] }

   NOTE: study.html currently renders MCQs only — a TBS renderer (numeric +
   select item types) is still a dev task before these are playable in-game.

   *** Drafts. Verify against current ASC before shipping (your call as CPA).
   ============================================================================= */
window.ACED_TBS = (window.ACED_TBS || []).concat([

  /* ---- TBS 1: Lessee — initial measurement & Year 1 roll-forward ---------- */
  { source:"F3.M5", diff:"hard",
    title:"Lease — Initial Measurement and Year 1",
    scenario:"On January 1, Year 1, Crane Company (a lessee) enters a five-year lease for equipment. Lease payments are $50,000 at the end of each year. The rate implicit in the lease is determinable and equals 6%; Crane's incremental borrowing rate is 8%. Crane incurs $5,000 of initial direct costs at commencement and receives no lease incentives. The present value of an ordinary annuity of $1 for five periods at 6% is 4.2124. Round to the nearest dollar.",
    items:[
      { prompt:"Initial lease liability at January 1, Year 1.",
        type:"numeric", answer:210620, tolerance:5,
        explain:"Discount the payments at the implicit rate because it is determinable: 50,000 × 4.2124 = $210,620. The IBR (8%) is only a fallback." },
      { prompt:"Initial right-of-use asset at January 1, Year 1.",
        type:"numeric", answer:215620, tolerance:5,
        explain:"ROU asset = lease liability + initial direct costs − incentives = 210,620 + 5,000 − 0 = $215,620." },
      { prompt:"Interest expense on the lease liability for Year 1.",
        type:"numeric", answer:12637, tolerance:5,
        explain:"Interest = beginning liability × implicit rate = 210,620 × 6% = $12,637." },
      { prompt:"Lease liability at December 31, Year 1 (after the first payment).",
        type:"numeric", answer:173257, tolerance:5,
        explain:"Beginning liability + interest − payment = 210,620 + 12,637 − 50,000 = $173,257." },
      { prompt:"If the rate implicit in the lease had NOT been determinable, which rate would Crane use to discount the payments?",
        type:"select",
        choices:["The incremental borrowing rate, 8%","The risk-free rate","An average of 6% and 8%","No discounting is required"],
        answer:0,
        explain:"The hierarchy is implicit rate → incremental borrowing rate → risk-free rate (private-company election). With the implicit rate unavailable, the lessee uses its 8% IBR." }
    ] },

  /* ---- TBS 2: Equity-method investment — two-year roll-forward ------------- */
  { source:"F2.M6", diff:"medium",
    title:"Equity-Method Investment — Two-Year Roll-Forward",
    scenario:"On January 1, Year 1, Saxe Company acquired 30% of the voting common stock of Vee Company for $400,000, obtaining significant influence. The price equaled 30% of the fair value of Vee's identifiable net assets, so there is no fair-value excess to amortize. Vee reported net income of $200,000 in Year 1 and $150,000 in Year 2, and paid total cash dividends of $50,000 in Year 1 and $40,000 in Year 2.",
    items:[
      { prompt:"Investment income Saxe recognizes for Year 1.",
        type:"numeric", answer:60000, tolerance:0,
        explain:"Share of investee net income = 30% × 200,000 = $60,000. Dividends are not income under the equity method." },
      { prompt:"Investment in Vee balance at December 31, Year 1.",
        type:"numeric", answer:445000, tolerance:0,
        explain:"400,000 + share of NI 60,000 − share of dividends (30% × 50,000 = 15,000) = $445,000." },
      { prompt:"Investment income Saxe recognizes for Year 2.",
        type:"numeric", answer:45000, tolerance:0,
        explain:"Share of Year 2 net income = 30% × 150,000 = $45,000." },
      { prompt:"Investment in Vee balance at December 31, Year 2.",
        type:"numeric", answer:478000, tolerance:0,
        explain:"445,000 + share of NI 45,000 − share of dividends (30% × 40,000 = 12,000) = $478,000." },
      { prompt:"How should Saxe account for cash dividends received from Vee?",
        type:"select",
        choices:["As dividend income","As a reduction of the investment account","As other comprehensive income","As a return of capital recognized in net income"],
        answer:1,
        explain:"Under the equity method, the investor recognizes income as the investee earns it; dividends received are a return of that investment and reduce the carrying amount of the investment account, not income." }
    ] }

]);
