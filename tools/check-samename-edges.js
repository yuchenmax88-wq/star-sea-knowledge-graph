/* 检查：跨领域边里，两端节点【同名】却标成了有方向或有从属含义的关系
   （prereq 前置 / apply 应用 / part 组成）—— 同一概念不可能是它自己的前置或组成部分。
   用法：node tools/check-samename-edges.js [--fix] */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const DOM = path.join(ROOT, "assets", "data", "domains");
const EDG = path.join(ROOT, "assets", "data", "edges");
const FIX = process.argv.includes("--fix");

const nameOf = {};
fs.readdirSync(DOM).filter(f => f.endsWith(".js")).forEach(f => {
  const sb = { window: {} };
  new Function("window", "console", fs.readFileSync(path.join(DOM, f), "utf8"))(sb.window, { warn() {}, log() {}, error() {} });
  ((sb.window.KG || {}).nodes || []).forEach(n => { nameOf[n.id] = n.n; });
});

const BAD = new Set(["prereq", "apply", "part"]);
const LINE = /\[\s*"([^"]+)"\s*,\s*"([^"]+)"\s*,\s*"([^"]+)"\s*,\s*(\d+)\s*\]/;
let total = 0, changed = 0;
const report = [];

fs.readdirSync(EDG).filter(f => f.endsWith(".js")).forEach(f => {
  const p = path.join(EDG, f);
  const src = fs.readFileSync(p, "utf8");
  const out = src.split("\n").map(line => {
    const m = line.match(LINE);
    if (!m) return line;
    const [, a, b, t, w] = m;
    if (!nameOf[a] || !nameOf[b]) return line;
    total++;
    if (nameOf[a] !== nameOf[b]) return line;
    if (!BAD.has(t)) return line;
    changed++;
    report.push(`${f}  【${nameOf[a]}】 ${a} --${t}--> ${b}`);
    return line.replace(`"${t}"`, '"related"');
  }).join("\n");
  if (FIX && out !== src) fs.writeFileSync(p, out, "utf8");
});

console.log(`跨领域边总数：${total}`);
console.log(`其中「两端同名却标成 prereq/apply/part」的：${changed} 条\n`);
report.forEach(r => console.log("  " + r));
console.log(`\n${FIX ? "已全部改为 related" : "未改动（加 --fix 才会写入）"}`);
