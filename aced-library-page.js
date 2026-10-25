(function () {
  "use strict";
  var L = window.ACEDLibrary, U = window.ACEDUI, esc = U.esc, tab = "mine";
  var grid = document.getElementById("pack-grid"), empty = document.getElementById("empty-state");
  function render() {
    var packs = tab === "mine" ? L.list() : L.starters.slice();
    var search = document.getElementById("pack-search").value.toLocaleLowerCase().trim();
    var sort = document.getElementById("pack-sort").value, activity = L.activity();
    packs = packs.filter(function (p) { return (p.name + " " + p.subject).toLocaleLowerCase().indexOf(search) !== -1; });
    packs.sort(function (a, b) {
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "added") return (b.createdAt || 0) - (a.createdAt || 0);
      return (activity[b.id] || 0) - (activity[a.id] || 0) || (b.createdAt || 0) - (a.createdAt || 0);
    });
    document.getElementById("my-count").textContent = L.list().length;
    grid.innerHTML = packs.map(function (pack) {
      var mine = !L.starter(pack.id), count = mine ? pack.questions.length : pack.count;
      var progress = L.progress(pack.id, mine ? pack.questions : count);
      var date = activity[pack.id] ? new Date(activity[pack.id]).toLocaleDateString(undefined, { month: "short", day: "numeric" }) : null;
      return '<article class="pack-card" data-pack="' + esc(pack.id) + '">' +
        '<div class="pack-top"><span class="tag ' + (mine ? "green" : "amber") + '">' + esc(pack.subject || "General") + '</span><span class="section-label">' + (mine ? "YOUR PACK" : "STARTER") + '</span></div>' +
        '<h2>' + esc(pack.name) + '</h2><p class="pack-description">' + esc(pack.description || (mine ? "Your material, ready for another run." : "")) + '</p>' +
        '<div class="pack-meta">' + count + ' questions · ' + (date ? "Played " + esc(date) : "Not played yet") +
        '<div class="pack-progress" role="progressbar" aria-label="Recall progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + progress.pct + '"><span style="width:' + progress.pct + '%"></span></div>' +
        '<span>' + progress.pct + '% recall progress · ' + progress.practiced + '/' + count + ' practiced</span></div>' +
        '<div class="button-row"><a class="button primary" href="study.html?pack=' + encodeURIComponent(pack.id) + '">Play run →</a>' +
        (mine ? '<a class="button" href="importer.html?edit=' + encodeURIComponent(pack.id) + '">Edit</a>' : '<button class="button" data-action="copy">Make a copy</button>') + '</div>' +
        '<div class="pack-tools"><button data-action="export">Export</button><button data-action="share">Share</button>' +
        (mine ? '<button data-action="delete" aria-label="Delete ' + esc(pack.name) + '">Delete</button>' : "") + '</div></article>';
    }).join("");
    empty.hidden = packs.length > 0;
    if (!packs.length) {
      empty.innerHTML = search
        ? '<div class="empty-mark">[ ? ]</div><h2>No matching packs.</h2><p>Try a different name or subject, or clear your search.</p><button class="button" id="clear-search">Clear search</button>'
        : '<div class="empty-mark">[ + ]</div><h2>Your library is waiting for its first pack.</h2><p>Bring the questions you want to remember. Save more than one pack, switch subjects, and pick up any run later.</p><div class="button-row"><a class="button primary" href="importer.html">Add your first pack →</a><button class="button quiet" id="explore-starters">Try a starter pack</button></div>';
      var clear = document.getElementById("clear-search"), explore = document.getElementById("explore-starters");
      if (clear) clear.onclick = function () { document.getElementById("pack-search").value = ""; render(); };
      if (explore) explore.onclick = function () { selectTab("starters"); };
    }
    U.storageNotice();
  }
  function selectTab(value) {
    tab = value;
    document.querySelectorAll("[data-tab]").forEach(function (button) {
      var active = button.dataset.tab === value;
      button.setAttribute("aria-selected", String(active)); button.tabIndex = active ? 0 : -1;
    });
    document.getElementById("pack-panel").setAttribute("aria-labelledby", value === "mine" ? "my-tab" : "starter-tab");
    render();
  }
  document.querySelectorAll("[data-tab]").forEach(function (button) {
    button.onclick = function () { selectTab(button.dataset.tab); };
    button.onkeydown = function (event) {
      if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
        event.preventDefault(); selectTab(tab === "mine" ? "starters" : "mine");
        document.querySelector('[data-tab="' + tab + '"]').focus();
      }
    };
  });
  document.getElementById("pack-search").oninput = render;
  document.getElementById("pack-sort").onchange = render;
  grid.onclick = async function (event) {
    var button = event.target.closest("[data-action]");
    if (!button) return;
    var card = button.closest("[data-pack]"), id = card.dataset.pack, action = button.dataset.action, pack;
    var status = document.getElementById("library-status");
    try {
      if (action === "delete") {
        pack = L.get(id);
        var dialog = U.dialog("Delete this pack?", '<p>Remove <strong>' + esc(pack.name) + '</strong> from this browser? Export a backup first if you might want it later.</p><div class="button-row"><button id="confirm-delete" class="button danger">Delete pack</button><button id="cancel-delete" class="button">Keep pack</button></div>');
        dialog.querySelector("#cancel-delete").onclick = function () { dialog.close(); };
        dialog.querySelector("#confirm-delete").onclick = function () { L.remove(id); dialog.close(); status.textContent = "Pack removed from your library."; render(); };
        return;
      }
      button.disabled = true;
      pack = await L.load(id);
      if (action === "export") U.download(pack);
      if (action === "share") U.share(pack);
      if (action === "copy") {
        pack.id = L.newId(pack.name); pack.name += " (my copy)";
        var saved = L.save(pack);
        status.textContent = "Copy added. You can edit its questions and keep your own progress.";
        selectTab("mine");
        var savedCard = grid.querySelector('[data-pack="' + saved.id + '"]');
        if (savedCard) savedCard.querySelector("a").focus();
      }
    } catch (e) { status.textContent = e.message; }
    finally { if (button.isConnected) button.disabled = false; U.storageNotice(); }
  };
  window.addEventListener("storage", render);
  render();
})();
