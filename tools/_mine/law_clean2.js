/* law 数据清理 v2 */
const fs = require("fs");
const path = require("path");
const data = require(path.resolve(__dirname, "law_data.js"));

const fixEdgeId = {
  "-law-personal-injury": "law-personal-injury"
};
for (const e of data.edges) {
  if (fixEdgeId[e[0]]) e[0] = fixEdgeId[e[0]];
  if (fixEdgeId[e[1]]) e[1] = fixEdgeId[e[1]];
}

// 重新加入被误删的有效边
const extraEdges = [
  ["law-sentencing", "law-mitigation", "part", 2],
  ["law-mitigation", "law-aggravation", "contrast", 2],
  ["law-legal-document", "law-legal-document-effect", "related", 2]
];
const sb = { window: {} };
new Function("window", "console", fs.readFileSync(path.resolve(__dirname, "..", "..", "assets/data/domains/law.js"), "utf8"))(sb.window, { warn() {}, log() {}, error() {} });
const ids = new Set(data.nodes.map(n => n.id));
for (const n of sb.window.KG.nodes) ids.add(n.id);
for (const e of extraEdges) {
  if (ids.has(e[0]) && ids.has(e[1])) {
    data.edges.push(e);
    console.log("re-added", e);
  }
}

fs.writeFileSync(path.resolve(__dirname, "law_data.js"),
  "/* law 加厚数据（已清理 v2） */\nmodule.exports = " + JSON.stringify(data, null, 2) + ";\n", "utf8");
