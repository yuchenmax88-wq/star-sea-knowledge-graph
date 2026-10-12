/* 删除 sociology 重复桥接边 */
const fs = require("fs");
const path = require("path");
const f = path.resolve(__dirname, "..", "..", "assets/data/domains/sociology.js");
let src = fs.readFileSync(f, "utf8");
// 找到桥接边块并删除其中重复的 3 条
// 简单方法：直接在文件末尾追加块中删除这3条
const dupes = [
  '"sociology-self-concept", "sociology-looking-glass-self"',
  '"sociology-gender-role", "sociology-second-shift"',
  '"sociology-church-sect", "sociology-cult"'
];
for (const d of dupes) {
  // 找到包含此字符串的行并删除
  const lines = src.split("\n");
  const filtered = lines.filter(l => !l.includes(d));
  src = filtered.join("\n");
}
fs.writeFileSync(f, src, "utf8");
console.log("removed 3 dup edges");
