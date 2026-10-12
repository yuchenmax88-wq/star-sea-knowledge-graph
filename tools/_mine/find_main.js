/* 找出每个领域主分量中的节点 */
const fs = require("fs");
const path = require("path");
const ROOT = path.resolve(__dirname, "..", "..");

for (const dom of ["economics", "law", "market", "sociology"]) {
  const sb = { window: {} };
  new Function("window", fs.readFileSync(path.join(ROOT, "assets/data/domains", dom + ".js"), "utf8"))(sb.window);
  const nodes = sb.window.KG.nodes;
  const edges = sb.window.KG.edges;
  const adj = {};
  for (const n of nodes) adj[n.id] = [];
  for (const e of edges) {
    if (adj[e[0]]) adj[e[0]].push(e[1]);
    if (adj[e[1]]) adj[e[1]].push(e[0]);
  }
  // BFS from first node
  const visited = new Set();
  const queue = [nodes[0].id];
  visited.add(nodes[0].id);
  while (queue.length) {
    const cur = queue.shift();
    for (const nb of adj[cur] || []) {
      if (!visited.has(nb)) { visited.add(nb); queue.push(nb); }
    }
  }
  const mainIds = nodes.filter(n => visited.has(n.id)).map(n => n.id);
  console.log("=== " + dom + " main component (" + mainIds.length + " nodes) ===");
  console.log(mainIds.join("\n"));
}
