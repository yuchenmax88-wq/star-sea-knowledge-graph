/* law 修复 v5：删除多余 text key */
const fs = require("fs");
const path = require("path");
const texts = require(path.resolve(__dirname, "law_text.js"));
delete texts["law-legal-document-effect"];
fs.writeFileSync(path.resolve(__dirname, "law_text.js"),
  "/* law 文本 v5 */\nmodule.exports = " + JSON.stringify(texts, null, 2) + ";\n", "utf8");
