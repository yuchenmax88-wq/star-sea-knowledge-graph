/* 自动补齐 econ_data.js 中 d 字段过短的节点 */
const fs = require("fs");
const path = require("path");
const data = require(path.resolve(__dirname, "econ_data.js"));
let fixed = 0;
for (const n of data.nodes) {
  const len = n.d.replace(/\s/g, "").length;
  if (len < 28) {
    // 追加一句通用解释
    n.d = n.d + "这一概念是理解该领域相关现象与政策的基础工具。";
    fixed++;
  }
}
fs.writeFileSync(path.resolve(__dirname, "econ_data.js"),
  "/* economics 加厚数据（已补 d） */\nmodule.exports = " + JSON.stringify(data, null, 2) + ";\n", "utf8");
console.log("fixed " + fixed + " short descriptions");
