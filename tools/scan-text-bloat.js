/* 扫描详解文本文件：文件体积 vs 生效内容体积、重复键块、疑似句内复读 */
const fs = require("fs");
const path = require("path");
const ROOT = path.resolve(__dirname, "..");
const files = fs.readdirSync(path.join(ROOT, "assets", "data", "text")).filter(f => f.endsWith(".js"));

const results = [];
for (const f of files) {
  const src = fs.readFileSync(path.join(ROOT, "assets", "data", "text", f), "utf8");
  const sb = { window: {} };
  new Function("window", "console", src)(sb.window, { warn() {}, log() {}, error() {} });
  const id = f.replace(".js", "");
  const dict = (sb.window.KG_TEXT || {})[id] || {};
  const keys = Object.keys(dict);
  const activeChars = keys.reduce((s, k) => s + String(dict[k]).replace(/\s/g, "").length, 0);
  const keyOcc = (src.match(/"([a-z0-9]+-[a-z0-9-]+)"\s*:/g) || []).length;
  const dup = keys.length ? keyOcc / keys.length : 0;
  results.push({ f, sizeKB: src.length / 1024, keys: keys.length, activeKB: activeChars * 3 / 1024, keyOcc, dup });
}

const suspicious = results.filter(r => r.sizeKB > 200 || r.dup > 1.3).sort((a, b) => b.sizeKB - a.sizeKB);
console.log(`文件数 ${files.length}，可疑 ${suspicious.length}`);
suspicious.forEach(b =>
  console.log(`${b.f.padEnd(16)} 文件KB ${String(Math.round(b.sizeKB)).padStart(5)} 生效KB ${String(Math.round(b.activeKB)).padStart(4)} 键出现 ${String(b.keyOcc).padStart(5)} vs 唯一键 ${String(b.keys).padStart(4)} (倍数 ${b.dup.toFixed(1)})`));

const totalKB = results.reduce((s, r) => s + r.sizeKB, 0);
const activeKB = results.reduce((s, r) => s + r.activeKB, 0);
console.log(`\ntext 目录总计 ${Math.round(totalKB)}KB；生效内容约 ${Math.round(activeKB)}KB（文件含 ${Math.round((1 - activeKB / totalKB) * 100)}% 死亡/重复字节）`);
