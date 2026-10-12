/* 全量重复边检查：统计原始边数 vs 去重后的无向对，列出重复明细 */
const fs = require("fs");
const path = require("path");
const ROOT = path.resolve(__dirname, "..");

const load = dir => fs.readdirSync(path.join(ROOT, dir))
  .filter(f => f.endsWith(".js"))
  .map(f => fs.readFileSync(path.join(ROOT, dir, f), "utf8"));

const edges = [];
[...load("assets/data/domains"), ...load("assets/data/edges")].forEach(src => {
  const sb = { window: {} };
  new Function("window", "console", src)(sb.window, { warn() {}, log() {}, error() {} });
  ((sb.window.KG || {}).edges || []).forEach(e => edges.push(e));
});

const key = (a, b) => (a < b ? a + "|" + b : b + "|" + a);
const count = new Map();
edges.forEach(e => {
  if (!Array.isArray(e) || e.length < 2) return;
  const k = key(e[0], e[1]);
  count.set(k, (count.get(k) || 0) + 1);
});
let dup = 0;
const rows = [];
count.forEach((c, k) => {
  if (c > 1) { dup += c - 1; rows.push(`${k}  ×${c}`); }
});
console.log(`原始边 ${edges.length}  唯一无向对 ${count.size}  重复冗余 ${dup}`);
rows.slice(0, 30).forEach(r => console.log("  " + r));
console.log(dup ? `存在 ${dup} 条重复冗余` : "无重复");
