/* sociology 修复 v4 */
const fs = require("fs");
const path = require("path");
const data = require(path.resolve(__dirname, "soc_data.js"));

const sb = { window: {} };
new Function("window", "console", fs.readFileSync(path.resolve(__dirname, "..", "..", "assets/data/domains/sociology.js"), "utf8"))(sb.window, { warn() {}, log() {}, error() {} });

// 检查双向重复
const existingEdges = new Set();
for (const e of sb.window.KG.edges) {
  existingEdges.add(e[0] + "|" + e[1]);
  existingEdges.add(e[1] + "|" + e[0]);
}

data.edges = data.edges.filter(e => {
  if (existingEdges.has(e[0] + "|" + e[1])) { console.log("drop", e); return false; }
  return true;
});

// 给 hidden-curriculum 加边
data.edges.push(["sociology-schooling", "sociology-hidden-curriculum", "part", 2]);

fs.writeFileSync(path.resolve(__dirname, "soc_data.js"),
  "/* soc 数据 v5 */\nmodule.exports = " + JSON.stringify(data, null, 2) + ";\n", "utf8");
