(function () {
  "use strict";
  var L = window.ACEDLibrary;
  if (!L) return;
  var ACCENTS = ["green", "cyan", "gold", "magenta", "amber", "purple"];
  var section = document.getElementById("mine"), grid = document.getElementById("mine-grid");
  var search = document.getElementById("mine-search"), note = document.getElementById("lib-note");
  var count = document.getElementById("mine-count"), notice = document.getElementById("storage-notice");

  function esc(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function accent(id) {
    var h = 0; for (var i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
    return ACCENTS[h % ACCENTS.length];
  }
  function say(text) { note.textContent = text || ""; }
  function topics(pack) {
    var seen = {}; pack.questions.forEach(function (q) { seen[q.source || "General"] = 1; });
    return Object.keys(seen).length;
  }
  function download(pack) {
    var blob = new Blob([L.exportText(pack)], { type: "application/json" });
    var url = URL.createObjectURL(blob), a = document.createElement("a");
    a.href = url;
    a.download = (pack.name.replace(/[^a-z0-9_-]+/gi, "-").replace(/^-|-$/g, "").slice(0, 80) || "pack") + ".aced.json";
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }
  function share(pack) {
    var url;
    try { url = L.shareUrl(pack); } catch (e) { say(e.message); return; }
    function fallback() { window.prompt("Copy this link to share your pack:", url); }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(function () { say("Share link copied. Anyone with it can open a copy of this pack."); }, fallback);
    } else fallback();
  }

  function render() {
    var packs = L.list(), activity = L.activity(), term = search.value.toLocaleLowerCase().trim();
    notice.hidden = L.isPersistent();
    if (!L.isPersistent()) notice.textContent = "Browser storage is unavailable, so packs and progress last only in this tab. Export your pack before leaving, or open ACED in its own tab to enable saving.";
    section.hidden = !packs.length;
    search.hidden = packs.length < 5;
    count.textContent = "\u2014 " + packs.length + " saved on this device";
    packs = packs.filter(function (p) { return (p.name + " " + p.subject).toLocaleLowerCase().indexOf(term) !== -1; });
    packs.sort(function (a, b) { return (activity[b.id] || 0) - (activity[a.id] || 0) || (b.createdAt || 0) - (a.createdAt || 0); });
    grid.innerHTML = packs.map(function (pack) {
      var n = pack.questions.length, progress = L.progress(pack.id, pack.questions), played = activity[pack.id];
      var date = played ? new Date(played).toLocaleDateString(undefined, { month: "short", day: "numeric" }) : "not played yet";
      var id = encodeURIComponent(pack.id);
      return '<div class="cart" style="--ac:var(--' + accent(pack.id) + ')" data-pack="' + esc(pack.id) + '">' +
        '<div class="mode">Your pack \u00b7 ' + esc(pack.subject || "General") + '</div>' +
        '<div class="name">' + esc(pack.name) + '</div>' +
        '<div class="ammo"><b>Ammo:</b> ' + n + ' questions \u00b7 ' + topics(pack) + ' topic' + (topics(pack) === 1 ? "" : "s") + '</div>' +
        '<div class="hook">' + esc(pack.description || "Your material, ready for another run.") + '</div>' +
        '<div class="prog" role="progressbar" aria-label="Recall progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + progress.pct + '"><span style="width:' + progress.pct + '%"></span></div>' +
        '<div class="ptxt">' + progress.pct + '% recall \u00b7 ' + progress.practiced + '/' + n + ' practiced \u00b7 ' + esc(date) + '</div>' +
        '<a class="go" href="study.html?pack=' + id + '">\u25b6 PLAY RUN</a>' +
        '<div class="tools"><a href="importer.html?edit=' + id + '">EDIT</a><button type="button" data-action="export">EXPORT</button><button type="button" data-action="share">SHARE</button><button type="button" class="danger" data-action="delete" aria-label="Delete ' + esc(pack.name) + '">DELETE</button></div>' +
        '</div>';
    }).join("") || '<div class="empty-mine">No packs match that search.</div>';
  }

  var armed = null;
  grid.addEventListener("click", function (event) {
    var button = event.target.closest("[data-action]");
    if (!button) return;
    var card = button.closest("[data-pack]"), id = card.dataset.pack, action = button.dataset.action, pack = L.get(id);
    if (!pack) { say("That pack is no longer in this browser."); render(); return; }
    if (action === "export") { download(pack); say("Backup downloaded."); }
    else if (action === "share") share(pack);
    else if (action === "delete") {
      if (armed !== button) {
        if (armed) { armed.classList.remove("arm"); armed.textContent = "DELETE"; }
        armed = button; button.classList.add("arm"); button.textContent = "SURE? CLICK AGAIN";
        say("Deleting removes this pack and its progress from this browser. Export a backup first if you might want it.");
        setTimeout(function () { if (armed === button && button.isConnected) { button.classList.remove("arm"); button.textContent = "DELETE"; armed = null; } }, 4000);
        return;
      }
      armed = null; L.remove(id); say("Pack removed from your library."); render();
    }
  });
  search.addEventListener("input", render);
  window.addEventListener("storage", render);
  render();
})();
