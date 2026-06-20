/* =========================================================================
   ACED CONFIDENCE — Calibration Betting + Brier Scoring
   =========================================================================
   Forces user to call their confidence BEFORE seeing the answer.
   - Trains the metacognitive skill that sinks 60%+ of FAR fails (overconfidence)
   - Plugs into chips × mult: higher confidence = higher multiplier + higher risk
   - Tracks Brier-equivalent calibration score, broken down by module/topic

   Brier score for a single answer:
       brier = (p_correct - actual)^2
       where p_correct ∈ {0.50, 0.75, 0.95}, actual ∈ {0, 1}
   Calibration display = 1 - mean(brier), shown as a 0-100% bar.

   Persistence: localStorage with in-memory fallback (sandbox-safe).
   ========================================================================= */
(function () {
  'use strict';

  const STORAGE_KEY = 'aced_calibration_v1';

  // The three tiers. Tuned so:
  //   - LOW is safe but unrewarding (don't spam it)
  //   - MED is neutral expected-value at ~75% accuracy
  //   - HIGH is huge upside but punishing if you're overconfident
  const TIERS = {
    LOW:  { id:'LOW',  prob:0.50, mult:1.0, label:'50%', emoji:'🤔', text:'NOT SURE',     riskNote:'safe — no penalty if wrong' },
    MED:  { id:'MED',  prob:0.75, mult:1.5, label:'75%', emoji:'💡', text:'PRETTY SURE',  riskNote:'+50% reward · −2 mult on a future card if wrong' },
    HIGH: { id:'HIGH', prob:0.95, mult:2.5, label:'95%', emoji:'💪', text:'LOCKED IN',     riskNote:'×2.5 reward · double strike if wrong' },
  };

  // ============ STORAGE ============
  let memoryStore = null;
  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch(e) {}
    return memoryStore || { samples: [], byModule: {}, byTopic: {} };
  }
  function save(s) {
    memoryStore = s;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch(e) {}
  }

  // ============ RECORDING ============
  // Record one calibration sample. q is the card question object.
  function record(tierId, correct, q) {
    const tier = TIERS[tierId];
    if (!tier) return;
    const s = load();
    const brier = Math.pow(tier.prob - (correct ? 1 : 0), 2);
    const sample = {
      tier: tierId,
      prob: tier.prob,
      correct: !!correct,
      brier,
      module: (q && q.source) || null,
      topic: (q && q.topic) || null,
      t: Date.now()
    };
    s.samples = s.samples || [];
    s.samples.push(sample);
    // Cap memory at last 2000 samples
    if (s.samples.length > 2000) s.samples = s.samples.slice(-2000);

    if (sample.module) {
      s.byModule[sample.module] = s.byModule[sample.module] || { n:0, sumBrier:0, correct:0 };
      const m = s.byModule[sample.module];
      m.n++; m.sumBrier += brier; if (correct) m.correct++;
    }
    if (sample.topic) {
      s.byTopic[sample.topic] = s.byTopic[sample.topic] || { n:0, sumBrier:0, correct:0 };
      const t = s.byTopic[sample.topic];
      t.n++; t.sumBrier += brier; if (correct) t.correct++;
    }
    save(s);
    return sample;
  }

  // ============ READOUTS ============
  function calibrationScore() {
    const s = load();
    if (!s.samples || !s.samples.length) return null;
    const mean = s.samples.reduce((a,x)=>a+x.brier, 0) / s.samples.length;
    return Math.max(0, Math.min(1, 1 - mean));   // 0..1
  }

  // How well-calibrated is this user at each tier?
  // Returns [{ tier, predicted, actualAccuracy, n, drift }]
  function tierBreakdown() {
    const s = load();
    const out = [];
    for (const tid of Object.keys(TIERS)) {
      const samples = (s.samples||[]).filter(x => x.tier === tid);
      const n = samples.length;
      const acc = n ? samples.filter(x=>x.correct).length / n : 0;
      const tier = TIERS[tid];
      out.push({
        tier: tid,
        label: tier.label,
        emoji: tier.emoji,
        predicted: tier.prob,
        actualAccuracy: acc,
        n,
        drift: n ? (acc - tier.prob) : 0   // positive = underconfident, negative = overconfident
      });
    }
    return out;
  }

  // Best/worst modules by Brier
  function moduleRanking() {
    const s = load();
    const arr = Object.entries(s.byModule||{}).map(([mod,m])=>({
      module: mod,
      n: m.n,
      brier: m.n ? m.sumBrier/m.n : 0,
      calibration: m.n ? 1 - (m.sumBrier/m.n) : 0,
      accuracy: m.n ? m.correct/m.n : 0
    }));
    arr.sort((a,b)=>a.brier - b.brier);  // best first
    return arr;
  }

  function recentSamples(n) {
    const s = load();
    return (s.samples||[]).slice(-(n||25));
  }

  function summary() {
    const s = load();
    const n = (s.samples||[]).length;
    return {
      total: n,
      calibration: calibrationScore(),
      tierBreakdown: tierBreakdown(),
      topModules: moduleRanking().slice(0,5),
      worstModules: moduleRanking().slice(-5).reverse()
    };
  }

  function reset() {
    memoryStore = { samples: [], byModule: {}, byTopic: {} };
    try { localStorage.removeItem(STORAGE_KEY); } catch(e) {}
  }

  // ============ EXPORT ============
  window.ACEDConfidence = {
    TIERS, record, calibrationScore, tierBreakdown,
    moduleRanking, recentSamples, summary, reset
  };
})();
