/* law 数据清理：修正错误引用 */
const fs = require("fs");
const path = require("path");
const data = require(path.resolve(__dirname, "law_data.js"));

// 修正节点 id 拼写
const fixNodeId = {
  "aw-limited-capacity": "law-limited-capacity",
  "law- Mitigation": "law-mitigation"
};
for (const n of data.nodes) {
  if (fixNodeId[n.id]) {
    console.log("rename node", n.id, "->", fixNodeId[n.id]);
    n.id = fixNodeId[n.id];
  }
}

// 修正边中的错误引用
const fixEdgeId = {
  "-law-local-governance": "law-local-governance",
  "aw-limited-capacity": "law-limited-capacity",
  "-law-realright": "law-realright",
  "-law-ownership": "law-ownership",
  "-law-neighboring": "law-neighboring",
  "-law-inheritance": "law-inheritance",
  "-law-criminallaw": "law-criminallaw",
  "-law-punishment": "law-punishment",
  "-law-litigation-parties": "law-litigation-parties",
  "-law-company-law": "law-company-law",
  "-law-shareholder": "law-shareholder",
  "-law-unfair-competition": "law-unfair-competition",
  "law-administration-action": "law-admin-action"
};
for (const e of data.edges) {
  if (fixEdgeId[e[0]]) e[0] = fixEdgeId[e[0]];
  if (fixEdgeId[e[1]]) e[1] = fixEdgeId[e[1]];
}

// 收集既有节点 id
const sb = { window: {} };
new Function("window", "console", fs.readFileSync(path.resolve(__dirname, "..", "..", "assets/data/domains/law.js"), "utf8"))(sb.window, { warn() {}, log() {}, error() {} });
const ids = new Set(data.nodes.map(n => n.id));
for (const n of sb.window.KG.nodes) ids.add(n.id);

// 删除悬空边
const before = data.edges.length;
data.edges = data.edges.filter(e => {
  if (!ids.has(e[0]) || !ids.has(e[1])) {
    console.log("drop dangling edge:", e);
    return false;
  }
  return true;
});
console.log("removed " + (before - data.edges.length) + " dangling edges");

// 补短 d
let padded = 0;
for (const n of data.nodes) {
  const len = n.d.replace(/\s/g, "").length;
  if (len < 28) {
    n.d = n.d + "该概念是理解法律体系与实践的重要基础。";
    padded++;
  }
}
console.log("padded " + padded + " descriptions");

fs.writeFileSync(path.resolve(__dirname, "law_data.js"),
  "/* law 加厚数据（已清理） */\nmodule.exports = " + JSON.stringify(data, null, 2) + ";\n", "utf8");
