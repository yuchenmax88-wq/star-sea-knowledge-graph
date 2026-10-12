/* sociology 修复 v3：删重复边和悬空边 */
const fs = require("fs");
const path = require("path");
const data = require(path.resolve(__dirname, "soc_data.js"));

const sb = { window: {} };
new Function("window", "console", fs.readFileSync(path.resolve(__dirname, "..", "..", "assets/data/domains/sociology.js"), "utf8"))(sb.window, { warn() {}, log() {}, error() {} });
const existingEdges = new Set();
for (const e of sb.window.KG.edges) existingEdges.add(e[0] + "|" + e[1]);

const ids = new Set(data.nodes.map(n => n.id));
for (const n of sb.window.KG.nodes) ids.add(n.id);

data.edges = data.edges.filter(e => {
  if (!ids.has(e[0]) || !ids.has(e[1])) { console.log("drop dangling", e); return false; }
  if (existingEdges.has(e[0] + "|" + e[1])) { console.log("drop dup", e); return false; }
  return true;
});

fs.writeFileSync(path.resolve(__dirname, "soc_data.js"),
  "/* soc 数据 v4 */\nmodule.exports = " + JSON.stringify(data, null, 2) + ";\n", "utf8");
