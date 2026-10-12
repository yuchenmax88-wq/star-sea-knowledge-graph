/* 回滚桥接边 */
const fs = require("fs");
const path = require("path");
const ROOT = path.resolve(__dirname, "..", "..");
for (const dom of ["economics", "law", "market", "sociology"]) {
  const f = path.join(ROOT, "assets/data/domains", dom + ".js");
  let src = fs.readFileSync(f, "utf8");
  const idx = src.indexOf("/* ===== 桥接边 ===== */");
  if (idx > 0) {
    src = src.slice(0, idx);
    fs.writeFileSync(f, src, "utf8");
    console.log("rolled back " + dom);
  }
}
