/* ============================================================
 * 跨领域关系校验
 * 用法： node tools/validate-cross.js assets/data/edges/cross-A.js
 * ============================================================ */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const DIR = path.join(ROOT, "assets", "data", "domains");
const TYPES = new Set(["prereq", "part", "apply", "related", "contrast"]);

/* 先把全部领域节点读进来，建 id 索引 */
const owner = {};
fs.readdirSync(DIR).filter(f => f.endsWith(".js")).forEach(f => {
  const sb = { window: {} };
  new Function("window", "console", fs.readFileSync(path.join(DIR, f), "utf8"))(sb.window, { warn() {}, log() {}, error() {} });
  ((sb.window.KG || {}).nodes || []).forEach(n => { owner[n.id] = n.c; });
});

const file = path.resolve(process.argv[2]);
const outName = path.basename(file);
const errs = [], warns = [];

if (!fs.existsSync(file)) { console.log("✗ 文件不存在：" + file); process.exit(1); }
const src = fs.readFileSync(file, "utf8");

try { new Function("window", "console", src); }
catch (e) { console.log("✗ 语法错误：" + e.message); process.exit(1); }

const sb = { window: {} };
new Function("window", "console", src)(sb.window, { warn() {}, log() {}, error() {} });
const edges = (sb.window.KG || {}).edges || [];

const seen = new Set();
const pairCount = {};
const typeCount = {};
const touched = new Set();

edges.forEach((e, i) => {
  if (!Array.isArray(e) || e.length < 4) { errs.push(`第 ${i + 1} 条格式不对：${JSON.stringify(e)}`); return; }
  const [a, b, t, w] = e;
  if (!owner[a]) errs.push(`起点 id 不存在：${a}`);
  if (!owner[b]) errs.push(`终点 id 不存在：${b}`);
  if (owner[a] && owner[b] && owner[a] === owner[b]) errs.push(`不是跨领域（两端都是 ${owner[a]}）：${a} → ${b}`);
  if (!TYPES.has(t)) errs.push(`未知关系类型：${t}`);
  if (![1, 2, 3].includes(w)) errs.push(`强度不是 1/2/3：${w}`);
  const key = a < b ? a + "|" + b : b + "|" + a;
  if (seen.has(key)) errs.push(`重复边：${a} ↔ ${b}`);
  seen.add(key);
  typeCount[t] = (typeCount[t] || 0) + 1;
  if (owner[a] && owner[b]) {
    const k = [owner[a], owner[b]].sort().join(" ↔ ");
    pairCount[k] = (pairCount[k] || 0) + 1;
  }
  touched.add(a); touched.add(b);
});

if (edges.length < 150) errs.push(`边数偏少：${edges.length}`);
if (typeCount.prereq && typeCount.prereq / edges.length > 0.45) warns.push(`prereq 占比过高：${(typeCount.prereq / edges.length * 100).toFixed(0)}%`);

console.log(`${outName}  跨领域边 ${edges.length}`);
console.log("  类型分布：" + JSON.stringify(typeCount));
console.log("  涉及领域对：");
Object.keys(pairCount).sort().forEach(k => console.log("    " + k.padEnd(30) + pairCount[k]));
warns.forEach(w => console.log("  ! " + w));
errs.forEach(e => console.log("  ✗ " + e));
console.log(errs.length ? `存在 ${errs.length} 个错误` : "ALL OK");
process.exit(errs.length ? 1 : 0);
