/* 回滚 sociology */
const fs = require("fs");
const path = require("path");
const ROOT = path.resolve(__dirname, "..", "..");
for (const [p, marker] of [
  [path.join(ROOT, "assets/data/domains/sociology.js"), "/* ===== 加厚追加 ===== */"],
  [path.join(ROOT, "assets/data/text/sociology.js"), "/* ===== 加厚文本 ===== */"]
]) {
  let src = fs.readFileSync(p, "utf8");
  const idx = src.indexOf(marker);
  if (idx > 0) { fs.writeFileSync(p, src.slice(0, idx), "utf8"); console.log("rolled back " + p); }
}
