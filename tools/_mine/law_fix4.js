/* law 数据修复 v4 */
const fs = require("fs");
const path = require("path");
const data = require(path.resolve(__dirname, "law_data.js"));
const texts = require(path.resolve(__dirname, "law_text.js"));

// 删除重复节点 law-legal-document（保留 law-legal-document-effect）
data.nodes = data.nodes.filter(n => n.id !== "law-legal-document");
delete texts["law-legal-document"];
// 修正边引用
for (const e of data.edges) {
  if (e[0] === "law-legal-document") e[0] = "law-legal-document-effect";
  if (e[1] === "law-legal-document") e[1] = "law-legal-document-effect";
}

fs.writeFileSync(path.resolve(__dirname, "law_data.js"),
  "/* law 加厚数据 v4 */\nmodule.exports = " + JSON.stringify(data, null, 2) + ";\n", "utf8");
fs.writeFileSync(path.resolve(__dirname, "law_text.js"),
  "/* law 文本 v4 */\nmodule.exports = " + JSON.stringify(texts, null, 2) + ";\n", "utf8");
