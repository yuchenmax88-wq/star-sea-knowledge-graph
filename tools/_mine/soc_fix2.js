/* sociology 修复 v2：去重 */
const fs = require("fs");
const path = require("path");
const data = require(path.resolve(__dirname, "soc_data.js"));
const texts = require(path.resolve(__dirname, "soc_text.js"));

// 加载既有节点 id
const sb = { window: {} };
new Function("window", "console", fs.readFileSync(path.resolve(__dirname, "..", "..", "assets/data/domains/sociology.js"), "utf8"))(sb.window, { warn() {}, log() {}, error() {} });
const existingIds = new Set(sb.window.KG.nodes.map(n => n.id));

// 删除重复节点
const beforeNodes = data.nodes.length;
data.nodes = data.nodes.filter(n => {
  if (existingIds.has(n.id)) { delete texts[n.id]; return false; }
  return true;
});
console.log("removed " + (beforeNodes - data.nodes.length) + " duplicate nodes");

// 收集现有 id
const ids = new Set(data.nodes.map(n => n.id));
for (const n of sb.window.KG.nodes) ids.add(n.id);

// 删除悬空边和重复边
const seen = new Set();
const beforeEdges = data.edges.length;
data.edges = data.edges.filter(e => {
  if (!ids.has(e[0]) || !ids.has(e[1])) return false;
  const key = e[0] + "|" + e[1] + "|" + e[2];
  if (seen.has(key)) return false;
  seen.add(key);
  return true;
});
console.log("edges: " + data.edges.length + " (was " + beforeEdges + ")");

// 给孤立节点加边
data.edges.push(["sociology-research-method", "sociology-ethics", "related", 2]);
data.edges.push(["sociology-education", "sociology-hidden-curriculum", "part", 2]);

fs.writeFileSync(path.resolve(__dirname, "soc_data.js"),
  "/* soc 数据 v3 */\nmodule.exports = " + JSON.stringify(data, null, 2) + ";\n", "utf8");
fs.writeFileSync(path.resolve(__dirname, "soc_text.js"),
  "/* soc 文本 v3 */\nmodule.exports = " + JSON.stringify(texts, null, 2) + ";\n", "utf8");
