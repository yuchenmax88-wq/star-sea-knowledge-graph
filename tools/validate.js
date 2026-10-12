/* ============================================================
 * 领域数据校验脚本（只在生成数据时用，站点运行不依赖）
 * 用法： node tools/validate.js [某个文件或全部]
 * ============================================================ */

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const ROOT = path.resolve(__dirname, "..");
const DIR = path.join(ROOT, "assets", "data", "domains");
const NODE = process.execPath;

const TYPES = new Set(["prereq", "part", "apply", "related", "contrast"]);

function lint(file) {
  const src = fs.readFileSync(file, "utf8");
  const errs = [];
  const warns = [];

  /* 1. 语法检查：用 new Function 解析，语法错会直接抛 */
  try {
    new Function("window", "console", src);
  } catch (e) {
    return { file, errs: ["语法错误：" + e.message], warns, count: 0 };
  }

  /* 2. 在隔离环境里加载，拿到 KG */
  const sandbox = { window: {} };
  try {
    const fn = new Function("window", "console", src);
    fn(sandbox.window, { warn() {}, log() {}, error() {} });
  } catch (e) {
    return { file, errs: ["执行出错：" + e.message], warns, count: 0 };
  }
  const KG = sandbox.window.KG;
  if (!KG || !Array.isArray(KG.nodes)) return { file, errs: ["没有产生 window.KG.nodes"], warns, count: 0 };

  const id = path.basename(file, ".js");
  const nodes = KG.nodes, edges = KG.edges || [];

  /* 3. 节点 */
  const seen = new Set();
  const bad = [];
  nodes.forEach((n, i) => {
    if (!n.id || !n.n || !n.c || !n.d) { bad.push(`第 ${i + 1} 个节点缺字段：${JSON.stringify(n).slice(0, 80)}`); return; }
    if (seen.has(n.id)) errs.push(`重复 id：${n.id}`);
    seen.add(n.id);
    if (!n.id.startsWith(id + "-")) errs.push(`id 前缀不对：${n.id}`);
    if (n.c !== id) errs.push(`c 字段不对：${n.id} → ${n.c}`);
    const len = n.d.replace(/\s/g, "").length;
    if (len < 22) warns.push(`定义过短（${len} 字）：${n.id} ${n.n}`);
    if (len > 90) warns.push(`定义过长（${len} 字）：${n.id} ${n.n}`);
    if (!Array.isArray(n.k) || n.k.length < 2) warns.push(`关键词不足：${n.id}`);
    if (n.n.length > 14) warns.push(`名字过长（${n.n.length} 字）：${n.id} ${n.n}`);
  });

  if (nodes.length < 110 || nodes.length > 300) errs.push(`节点数 ${nodes.length}，期望 110~300`);
  const edgeMax = Math.max(200, Math.round(nodes.length * 1.8));
  if (edges.length < 120 || edges.length > edgeMax) errs.push(`边数 ${edges.length}，期望 120~${edgeMax}`);

  /* 4. 边 */
  const dup = new Set();
  const touched = new Set();
  edges.forEach((e, i) => {
    if (!Array.isArray(e) || e.length < 4) { errs.push(`第 ${i + 1} 条边格式不对：${JSON.stringify(e)}`); return; }
    const [a, b, t, w] = e;
    if (!seen.has(a)) errs.push(`悬空起点：${a}`);
    if (!seen.has(b)) errs.push(`悬空终点：${b}`);
    if (!TYPES.has(t)) errs.push(`未知关系类型：${t}`);
    if (![1, 2, 3].includes(w)) errs.push(`强度不是 1/2/3：${w}`);
    if (a === b) errs.push(`自环：${a}`);
    const key = a < b ? a + "|" + b : b + "|" + a;
    if (dup.has(key)) warns.push(`重复边：${a} ↔ ${b}`);
    dup.add(key);
    touched.add(a); touched.add(b);
  });

  /* 5. 孤立节点 */
  const orphan = nodes.filter(n => !touched.has(n.id));
  if (orphan.length) errs.push(`${orphan.length} 个孤立节点：` + orphan.slice(0, 6).map(n => n.id).join(", "));

  /* 6. 关系类型分布 */
  const dist = {};
  edges.forEach(e => { dist[e[2]] = (dist[e[2]] || 0) + 1; });
  const missing = [...TYPES].filter(t => !dist[t]);
  if (missing.length > 2) warns.push(`关系类型偏少，缺：${missing.join(", ")}`);

  /* 7. 有向性抽查：prereq 不应形成长链回环（粗查 3 环） */
  const adj = {};
  edges.filter(e => e[2] === "prereq").forEach(e => { (adj[e[0]] = adj[e[0]] || []).push(e[1]); });
  let cycles = 0;
  Object.keys(adj).forEach(a => (adj[a] || []).forEach(b => (adj[b] || []).forEach(c => {
    if ((adj[c] || []).includes(a)) cycles++;
  })));
  if (cycles) warns.push(`prereq 存在 ${cycles} 处三节点环（应无环）`);

  return { file, id, nodes: nodes.length, edges: edges.length, dist, errs, warns };
}

const arg = process.argv[2];
const files = arg
  ? [path.resolve(arg)]
  : fs.readdirSync(DIR).filter(f => f.endsWith(".js")).map(f => path.join(DIR, f)).sort();

if (!files.length) { console.log("没有找到任何领域文件"); process.exit(0); }

let totalNodes = 0, totalEdges = 0, failed = 0;
const allIds = new Map();

files.forEach(f => {
  const r = lint(f);
  const tag = r.errs.length ? "✗" : "✓";
  console.log(`${tag} ${path.basename(f).padEnd(16)} 节点 ${String(r.nodes || 0).padStart(4)}  边 ${String(r.edges || 0).padStart(4)}  ${r.dist ? JSON.stringify(r.dist) : ""}`);
  r.warns.forEach(w => console.log(`    ! ${w}`));
  r.errs.forEach(e => { console.log(`    ✗ ${e}`); failed++; });
  totalNodes += r.nodes || 0;
  totalEdges += r.edges || 0;

  /* 跨文件重复 id 检查 */
  if (r.id) {
    try {
      const src = fs.readFileSync(f, "utf8");
      const sb = { window: {} };
      new Function("window", "console", src)(sb.window, { warn() {}, log() {}, error() {} });
      (sb.window.KG.nodes || []).forEach(n => {
        if (allIds.has(n.id)) console.log(`    ✗ 跨文件重复 id：${n.id}（${allIds.get(n.id)} 与 ${path.basename(f)}）`);
        else allIds.set(n.id, path.basename(f));
      });
    } catch (e) { /* 已经报过了 */ }
  }
});

console.log("");
console.log(`合计：${files.length} 个领域，${totalNodes} 个节点，${totalEdges} 条边`);
console.log(failed ? `存在 ${failed} 个错误` : "ALL OK");
process.exit(failed ? 1 : 0);
