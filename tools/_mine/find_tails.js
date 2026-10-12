/* 找出重复尾句 */
const fs = require("fs");
const path = require("path");
const ROOT = path.resolve(__dirname, "..", "..");

for (const dom of ["economics", "market", "law", "sociology", "medicine"]) {
  const sb = { window: {} };
  new Function("window", fs.readFileSync(path.join(ROOT, "assets/data/text", dom + ".js"), "utf8"))(sb.window);
  const texts = sb.window.KG_TEXT[dom];
  // 取每条最后一句（以。结尾）
  const tailCount = {};
  for (const [k, v] of Object.entries(texts)) {
    // 按。分割取最后非空段
    const sents = v.split(/(?<=。)/).map(s => s.trim()).filter(s => s.length > 0);
    const tail = sents[sents.length - 1] || "";
    // 标准化：去掉首尾空白
    const key = tail.replace(/\s+/g, "");
    if (tailCount[key]) tailCount[key].count++;
    else tailCount[key] = { count: 1, sample: tail, keys: [k] };
  }
  console.log("\n=== " + dom + " 重复尾句（≥3次）===");
  for (const [tail, info] of Object.entries(tailCount)) {
    if (info.count >= 3) {
      console.log("[" + info.count + "次] " + info.sample.substring(0, 80));
    }
  }
}
