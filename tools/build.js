#!/usr/bin/env node
"use strict";
// Builds dist/: the public runtime only. Pages, scripts, styles, packs, learning pages and
// icons are copied; docs, tests, tools, server code, source banks and repository metadata are not.
const fs = require("node:fs"), path = require("node:path");
const root = path.resolve(__dirname, ".."), output = path.join(root, "dist");
const files = [];
function add(file) { if (!files.includes(file)) files.push(file); }
function walk(directory, accept) {
  for (const entry of fs.readdirSync(path.join(root, directory), { withFileTypes: true })) {
    const relative = path.posix.join(directory, entry.name);
    if (entry.isDirectory()) walk(relative, accept);
    else if (accept(relative)) add(relative);
  }
}
// Root pages, scripts and styles (never tests).
for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
  if (entry.isFile() && /\.(html|css)$/.test(entry.name)) add(entry.name);
  if (entry.isFile() && /\.js$/.test(entry.name) && !/\.test\.js$/.test(entry.name)) add(entry.name);
}
// Content packs, learning pages and third-party browser libraries.
walk("packs", file => /\.(js|json)$/.test(file));
for (const directory of ["learn", "vendor"]) if (fs.existsSync(path.join(root, directory))) walk(directory, () => true);
for (const file of ["favicon.svg", "favicon.ico", "manifest.webmanifest", "robots.txt", "sitemap.xml", "og-image.png", "security.txt", ".well-known/security.txt"]) {
  if (fs.existsSync(path.join(root, file))) add(file);
}
fs.rmSync(output, { recursive: true, force: true });
for (const file of files) {
  const destination = path.join(output, file);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.copyFileSync(path.join(root, file), destination);
}
// Every local script, stylesheet, link and image the pages reference must exist in dist/.
let missing = 0;
for (const file of files.filter(f => f.endsWith(".html"))) {
  const html = fs.readFileSync(path.join(output, file), "utf8").replace(/<script(?=[\t\n\f\r />])([^>]*)>([\s\S]*?)<\/script(?=[\t\n\f\r />])[^>]*>/gi, (all, attrs) => "<script" + attrs + "></script>");
  for (const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    const target = match[1].split(/[?#]/)[0];
    if (!target || /^(?:https?:|data:|mailto:|tel:|javascript:|\/\/)/.test(target)) continue;
    const resolved = target.startsWith("/") ? path.join(output, target) : path.resolve(path.dirname(path.join(output, file)), target);
    if (!fs.existsSync(resolved)) { missing++; console.error(file + ": not in dist/: " + target); }
  }
}
if (missing) { console.error(missing + " referenced file(s) are missing from dist/."); process.exit(1); }
console.log("Built " + files.length + " public runtime files into dist/. No docs, tests, server files, source banks or repository metadata included.");
