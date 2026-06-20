// ACED Social — local leaderboard + share card generator
(function () {
  const LB_KEY = 'aced_leaderboard';
  const MAX_ENTRIES = 10;

  function load() {
    try { return JSON.parse(localStorage.getItem(LB_KEY)) || []; }
    catch (e) { return []; }
  }
  function save(d) { try { localStorage.setItem(LB_KEY, JSON.stringify(d)); } catch (e) {} }

  function recordRun({ score, section, ante, streak, bossesDefeated }) {
    const lb = load();
    lb.push({
      score, section: section || 'FAR',
      ante, streak, bossesDefeated,
      date: new Date().toISOString().slice(0, 10)
    });
    lb.sort((a, b) => b.score - a.score);
    save(lb.slice(0, MAX_ENTRIES));
  }

  function getLeaderboard() { return load(); }

  // Generate share-card data URL via canvas
  function generateShareCard({ score, streak, section, bossesDefeated, perfectPulses }) {
    const c = document.createElement('canvas');
    c.width = 1200; c.height = 630;
    const ctx = c.getContext('2d');

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, 1200, 630);
    grad.addColorStop(0, '#0a0a14');
    grad.addColorStop(1, '#1a0f2e');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1200, 630);

    // Accent stripe
    ctx.fillStyle = '#ff4b9b';
    ctx.fillRect(0, 0, 1200, 8);
    ctx.fillStyle = '#4be3ff';
    ctx.fillRect(0, 622, 1200, 8);

    // Logo
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 56px system-ui, -apple-system, sans-serif';
    ctx.fillText('ACED', 60, 110);
    ctx.fillStyle = '#888';
    ctx.font = '24px system-ui, sans-serif';
    ctx.fillText('CPA Roguelike — Story Shaw audited reality.', 60, 145);

    // Score huge
    ctx.fillStyle = '#ffd34b';
    ctx.font = 'bold 180px system-ui, sans-serif';
    ctx.fillText(score.toLocaleString(), 60, 350);
    ctx.fillStyle = '#aaa';
    ctx.font = '28px system-ui, sans-serif';
    ctx.fillText('FINAL SCORE', 60, 390);

    // Stats grid
    const stats = [
      { label: 'STREAK', value: streak || 0 },
      { label: 'BOSSES', value: bossesDefeated || 0 },
      { label: 'PULSES', value: perfectPulses || 0 },
      { label: 'SECTION', value: section || 'FAR' }
    ];
    let x = 60;
    const y = 470;
    for (const s of stats) {
      ctx.fillStyle = '#4be3ff';
      ctx.font = 'bold 48px system-ui, sans-serif';
      ctx.fillText(String(s.value), x, y);
      ctx.fillStyle = '#888';
      ctx.font = '18px system-ui, sans-serif';
      ctx.fillText(s.label, x, y + 30);
      x += 280;
    }

    // Tagline
    ctx.fillStyle = '#ff4b9b';
    ctx.font = 'italic 26px system-ui, sans-serif';
    ctx.fillText('"the only CPA prep roguelike that actively roasts you"', 60, 580);

    return c.toDataURL('image/png');
  }

  function downloadCard(dataURL, filename = 'aced-score.png') {
    const a = document.createElement('a');
    a.href = dataURL;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  async function copyCardToClipboard(dataURL) {
    try {
      const blob = await (await fetch(dataURL)).blob();
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
      return true;
    } catch (e) { return false; }
  }

  window.ACEDSocial = {
    recordRun, getLeaderboard, generateShareCard, downloadCard, copyCardToClipboard
  };
})();
