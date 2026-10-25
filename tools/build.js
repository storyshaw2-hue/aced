#!/usr/bin/env node
"use strict";
const fs = require("node:fs"), path = require("node:path");
const root = path.resolve(__dirname, ".."), output = path.join(root, "dist");
const files = [
  "index.html", "library.html", "importer.html", "study.html", "daily.html",
  "aced-arcade.html", "start.html", "builder.html", "importer-classic.html",
  "pricing.html", "store.html", "league.html", "mcat.html", "nclex.html",
  "usmle.html", "lsat.html", "bar-exam.html", "aced-jokers-demo.html",
  "app.css", "aced-library.js", "aced-ui.js", "aced-library-page.js",
  "aced-importer.js", "aced-game-rules.js", "aced-game.js", "aced-core.js", "aced-entry.js",
  "packs/core-jokers.js", "packs/world-capitals.js", "packs/spanish-1k.js",
  "favicon.svg", "favicon.ico", "manifest.webmanifest", "robots.txt", "sitemap.xml"
];
if (fs.existsSync(path.join(root, "og-image.png"))) files.push("og-image.png");
for (const file of ["security.txt", ".well-known/security.txt"]) {
  if (fs.existsSync(path.join(root, file))) files.push(file);
}
fs.rmSync(output, { recursive: true, force: true });
for (const file of files) {
  const destination = path.join(output, file);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.copyFileSync(path.join(root, file), destination);
}
console.log("Built " + files.length + " public runtime files into dist/. No docs, tests, server files or repository metadata included.");
