/* 回滚 economics 追加块 */
const fs = require("fs");
const path = require("path");
const ROOT = path.resolve(__dirname, "..", "..");
for (const [p, marker] of [
  [path.join(ROOT, "assets/data/domains/economics.js"), "/* ===== 加厚追加 ===== */"],
  [path.join(ROOT, "assets/data/text/economics.js"), "/* ===== 加厚文本 ===== */"]
]) {
  let src = fs.readFileSync(p, "utf8");
  const idx = src.indexOf(marker);
  if (idx > 0) {
    src = src.slice(0, idx);
    fs.writeFileSync(p, src, "utf8");
    console.log("rolled back " + p + " at idx " + idx);
  } else {
    console.log("marker not found in " + p);
  }
}
