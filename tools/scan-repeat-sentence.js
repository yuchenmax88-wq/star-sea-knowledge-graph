/* 扫描详解文本：条目内部是否存在重复句（≥10 字片段出现≥2 次） */
const fs = require("fs");
const path = require("path");
const ROOT = path.resolve(__dirname, "..");
const files = fs.readdirSync(path.join(ROOT, "assets", "data", "text")).filter(f => f.endsWith(".js"));

function repeatedFragment(text) {
  const body = String(text).replace(/\s+/g, "");
  if (body.length < 40) return null;
  const frags = [];
  /* 取 10~20 字片段做重复检测（滑动窗口，间隔采样避免 O(n²) 爆炸） */
  const step = 6;
  for (let L = 10; L <= 20; L += 5) {
    for (let i = 0; i + L <= body.length; i += step) {
      frags.push(body.slice(i, i + L));
    }
  }
  const seen = new Map();
  const hits = [];
  for (const fr of frags) {
    const c = (seen.get(fr) || 0) + 1;
    seen.set(fr, c);
    if (c === 2) hits.push(fr);
  }
  return hits.length ? hits.slice(0, 3) : null;
}

let total = 0, filesWith = new Set(), entries = [];
for (const f of files) {
  const src = fs.readFileSync(path.join(ROOT, "assets", "data", "text", f), "utf8");
  const sb = { window: {} };
  try { new Function("window", "console", src)(sb.window, { warn() {}, log() {}, error() {} }); }
  catch (e) { console.log("✗ 语法错", f, e.message); continue; }
  const id = f.replace(".js", "");
  const dict = (sb.window.KG_TEXT || {})[id] || {};
  for (const k of Object.keys(dict)) {
    const hits = repeatedFragment(dict[k]);
    if (hits) {
      total++;
      filesWith.add(f);
      if (entries.length < 120) entries.push(`${f}:${k} 「${hits.join(" / ")}」`);
    }
  }
}
console.log(`扫描 ${files.length} 个文件，命中句内复读条目 ${total} 个，涉及文件 ${filesWith.size}`);
console.log(`涉及文件：${[...filesWith].sort().join(", ")}`);
entries.forEach(e => console.log("  " + e));
