/* 连通分量检查：全图（领域内 + 跨领域）是否单连通 */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const load = (dir) => fs.readdirSync(path.join(ROOT, dir))
  .filter(f => f.endsWith(".js"))
  .map(f => fs.readFileSync(path.join(ROOT, dir, f), "utf8"));

const nodes = [];
const edges = [];
const allSrc = [...load("assets/data/domains"), ...load("assets/data/edges")];
allSrc.forEach(src => {
  const sb = { window: {} };
  new Function("window", "console", src)(sb.window, { warn() {}, log() {}, error() {} });
  const KG = sb.window.KG || {};
  (KG.nodes || []).forEach(n => nodes.push(n));
  (KG.edges || []).forEach(e => edges.push(e));
});

const idSet = new Set(nodes.map(n => n.id));
const adj = new Map();
nodes.forEach(n => adj.set(n.id, []));
edges.forEach(([a, b]) => {
  if (idSet.has(a) && idSet.has(b)) {
    adj.get(a).push(b); adj.get(b).push(a);
  }
});

/* BFS */
const seen = new Set();
const stack = [nodes[0].id];
seen.add(nodes[0].id);
while (stack.length) {
  const cur = stack.pop();
  (adj.get(cur) || []).forEach(nb => {
    if (!seen.has(nb)) { seen.add(nb); stack.push(nb); }
  });
}

const total = nodes.length;
const reachable = seen.size;
const islands = total - reachable;
console.log(`节点总数 ${total}，主连通分量 ${reachable}（${(reachable / total * 100).toFixed(1)}%）`);
if (islands) {
  const orphan = nodes.filter(n => !seen.has(n.id));
  console.log(`✗ 存在 ${islands} 个不可达节点（孤岛）：`);
  orphan.forEach(n => console.log(`  ${n.id}  ${n.n}  [${n.c}]`));
  process.exit(1);
} else {
  console.log("✓ 全图单连通，无孤岛");
}
