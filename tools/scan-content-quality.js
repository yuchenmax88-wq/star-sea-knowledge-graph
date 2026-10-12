/* 全量内容质量扫描：
   1) 条目内重复片段（≥10 字片段出现≥2 次）
   2) 通用模板前缀（首句在同文件内被 ≥5 个条目共用）
   3) 文件体积 vs 生效内容（死亡重复块） */
const fs = require("fs");
const path = require("path");
const ROOT = path.resolve(__dirname, "..");
const files = fs.readdirSync(path.join(ROOT, "assets", "data", "text")).filter(f => f.endsWith(".js"));

function fragHits(text) {
  const body = String(text).replace(/\s+/g, "");
  if (body.length < 50) return 0;
  const seen = new Map();
  let hits = 0;
  for (let L = 12; L <= 24; L += 4) {
    for (let i = 0; i + L <= body.length; i += 7) {
      const fr = body.slice(i, i + L);
      const c = (seen.get(fr) || 0) + 1;
      seen.set(fr, c);
      if (c === 2) hits++;
    }
  }
  return hits;
}

const rows = [];
for (const f of files) {
  const src = fs.readFileSync(path.join(ROOT, "assets", "data", "text", f), "utf8");
  const sb = { window: {} };
  try { new Function("window", "console", src)(sb.window, { warn() {}, log() {}, error() {} }); }
  catch (e) { console.log("✗ 语法错", f); continue; }
  const id = f.replace(".js", "");
  const dict = (sb.window.KG_TEXT || {})[id] || {};
  const keys = Object.keys(dict);
  let dupEntries = 0;
  const firstSent = new Map();
  for (const k of keys) {
    const t = String(dict[k]).replace(/\s+/g, "");
    if (fragHits(t) > 0) dupEntries++;
    const m = t.match(/^[^。！？；]{8,}/);
    if (m) firstSent.set(m[0], (firstSent.get(m[0]) || 0) + 1);
  }
  let templated = 0;
  firstSent.forEach((c) => { if (c >= 5) templated += c; });
  const activeChars = keys.reduce((s, k) => s + String(dict[k]).replace(/\s/g, "").length, 0);
  const keyOcc = (src.match(/"([a-z0-9]+-[a-z0-9-]+)"\s*:/g) || []).length;
  rows.push({
    f, n: keys.length,
    dup: dupEntries, temp: templated,
    fileKB: src.length / 1024, activeKB: activeChars * 3 / 1024,
    keyOcc, dupRate: keys.length ? keyOcc / keys.length : 0
  });
}

console.log("文件".padEnd(16), "条目", "重复句", "模板首句", "文件KB", "生效KB", "键倍数");
let Tdup = 0, Ttemp = 0;
rows.sort((a, b) => (b.dup + b.temp) - (a.dup + a.temp));
rows.forEach(r => {
  Tdup += r.dup; Ttemp += r.temp;
  console.log(
    r.f.padEnd(16), String(r.n).padStart(5), String(r.dup).padStart(5), String(r.temp).padStart(6),
    String(Math.round(r.fileKB)).padStart(5), String(Math.round(r.activeKB)).padStart(6),
    r.dupRate > 1.2 ? r.dupRate.toFixed(1).padStart(6) : "".padStart(6)
  );
});
console.log(`\n合计：重复句条目 ${Tdup}，模板首句条目 ${Ttemp}，共 ${files.length} 文件`);
