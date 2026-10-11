/* 测量各领域 part 边的书写方向，判断每个领域用的是「整体→部件」还是「部件→整体」。
   用法：node tools/probe-part-direction.js [每领域样本数] */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const DOM = path.join(ROOT, "assets", "data", "domains");
const PER = Number(process.argv[2] || 10);

const files = fs.readdirSync(DOM).filter(f => f.endsWith(".js")).sort();

let grand = 0;
const summary = [];

files.forEach(f => {
  const sb = { window: {} };
  new Function("window", "console", fs.readFileSync(path.join(DOM, f), "utf8"))(sb.window, { warn() {}, log() {}, error() {} });
  const KG = sb.window.KG || {};
  const by = {};
  (KG.nodes || []).forEach(n => by[n.id] = n);

  const parts = (KG.edges || []).filter(e => e[2] === "part" && by[e[0]] && by[e[1]]);
  grand += parts.length;
  if (!parts.length) { summary.push([f.replace(".js", ""), 0, 0, "-"]); return; }

  const sample = parts.slice().sort(() => Math.random() - 0.5).slice(0, PER);
  console.log(`\n===== ${f.replace(".js", "")}   part 边共 ${parts.length} 条，抽 ${sample.length} 条 =====`);
  sample.forEach(e => console.log(`   ${by[e[0]].n}   --part(${e[3]})-->   ${by[e[1]].n}`));
  summary.push([f.replace(".js", ""), parts.length]);
});

console.log("\n\n===== 各领域 part 边数量 =====");
summary.forEach(s => console.log(`   ${String(s[0]).padEnd(14)} ${s[1]}`));
console.log(`   合计 ${grand}`);
