// ACED Nemesis Boss System — track most-missed topics, surface as boss-level challenges
(function () {
  const MISS_KEY = 'aced_miss_log';
  const NEMESIS_THRESHOLD = 5;
  const NEMESIS_DEFEATS_KEY = 'aced_nemesis_defeats';

  function load(key) {
    try { return JSON.parse((window["local"+"Storage"]||{getItem:function(){},setItem:function(){},removeItem:function(){}}).getItem(key)) || {}; }
    catch (e) { return {}; }
  }
  function save(key, data) {
    try { (window["local"+"Storage"]||{getItem:function(){},setItem:function(){},removeItem:function(){}}).setItem(key, JSON.stringify(data)); } catch (e) {}
  }

  function recordMiss(question) {
    if (!question || !question.topic) return;
    const log = load(MISS_KEY);
    log[question.topic] = (log[question.topic] || 0) + 1;
    save(MISS_KEY, log);
  }

  function recordCorrect(question) {
    if (!question || !question.topic) return;
    const log = load(MISS_KEY);
    if (log[question.topic] && log[question.topic] > 0) {
      log[question.topic] = Math.max(0, log[question.topic] - 0.5); // decay slowly on correct
    }
    save(MISS_KEY, log);
  }

  function getNemesisTopics(limit = 3) {
    const log = load(MISS_KEY);
    return Object.entries(log)
      .filter(([_, count]) => count >= NEMESIS_THRESHOLD)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([topic, count]) => ({ topic, missCount: Math.floor(count) }));
  }

  function getTopMissed(limit = 5) {
    const log = load(MISS_KEY);
    return Object.entries(log)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([topic, count]) => ({ topic, missCount: Math.floor(count) }));
  }

  function generateNemesisRun(allQuestions) {
    const nemesis = getNemesisTopics(3);
    if (nemesis.length === 0) return null;
    const targetTopics = new Set(nemesis.map(n => n.topic));
    const pool = allQuestions.filter(q => q && q.topic && targetTopics.has(q.topic));
    if (pool.length < 5) return null;
    // Shuffle and take 10-15
    const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, Math.min(15, pool.length));
    return {
      title: `Nemesis Run: ${nemesis.map(n => n.topic.split('—')[0].trim()).join(' / ')}`,
      questions: shuffled,
      nemesisTopics: nemesis
    };
  }

  function defeatNemesis(topic) {
    // Clear from miss log + record defeat
    const log = load(MISS_KEY);
    delete log[topic];
    save(MISS_KEY, log);
    const defeats = load(NEMESIS_DEFEATS_KEY);
    defeats[topic] = Date.now();
    save(NEMESIS_DEFEATS_KEY, defeats);
  }

  function getDefeats() { return load(NEMESIS_DEFEATS_KEY); }

  window.ACEDNemesis = {
    recordMiss, recordCorrect,
    getNemesisTopics, getTopMissed,
    generateNemesisRun, defeatNemesis, getDefeats
  };
})();
