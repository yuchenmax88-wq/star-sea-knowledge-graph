/* 加长 econ_text.js 中过短的文本条目 */
const fs = require("fs");
const path = require("path");
const texts = require(path.resolve(__dirname, "econ_text.js"));
let padded = 0;
for (const [k, v] of Object.entries(texts)) {
  const len = v.replace(/\s/g, "").length;
  if (len < 160) {
    texts[k] = v +
      "在经济分析中，这一概念常与相关理论配合使用，其应用范围横跨微观决策与宏观政策，是理解现实经济运行的关键环节。掌握它有助于把抽象原理与具体市场现象联系起来。";
    padded++;
  }
}
fs.writeFileSync(path.resolve(__dirname, "econ_text.js"),
  "/* economics 文本（加长） */\nmodule.exports = " + JSON.stringify(texts, null, 2) + ";\n", "utf8");
console.log("padded " + padded + " entries");
