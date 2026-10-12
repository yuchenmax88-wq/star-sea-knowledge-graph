/* sociology 修复 v5 */
const fs = require("fs");
const path = require("path");
const data = require(path.resolve(__dirname, "soc_data.js"));

// 删除悬空边
data.edges = data.edges.filter(e => !(e[0] === "sociology-schooling" && e[1] === "sociology-hidden-curriculum"));

// 用既有节点连接 hidden-curriculum
data.edges.push(["sociology-education-sociology", "sociology-hidden-curriculum", "part", 2]);

fs.writeFileSync(path.resolve(__dirname, "soc_data.js"),
  "/* soc 数据 v6 */\nmodule.exports = " + JSON.stringify(data, null, 2) + ";\n", "utf8");
