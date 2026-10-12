/* 扫描：文件内被 ≥5 个条目共享的句子（通用模板句/填充句） */
const fs = require("fs");
const path = require("path");
const ROOT = path.resolve(__dirname, "..");
const files = fs.readdirSync(path.join(ROOT, "assets", "data", "text")).filter(f => f.endsWith(".js"));

const rows = [];
for (const f of files) {
  const src = fs.readFileSync(path.join(ROOT, "assets", "data", "text", f), "utf8");
  const sb = { window: {} };
  try { new Function("window", "console", src)(sb.window, { warn() {}, log() {}, error() {} }); }
  catch (e) { continue; }
  const id = f.replace(".js", "");
  const dict = (sb.window.KG_TEXT || {})[id] || {};
  const sentCount = new Map();
  for (const k of Object.keys(dict)) {
    const sents = String(dict[k]).replace(/\s+/g, "").split(/[。！？；]/).filter(s => s.length >= 8);
    for (const s of sents) sentCount.set(s, (sentCount.get(s) || 0) + 1);
  }
  const shared = [];
  sentCount.forEach((c, s) => { if (c >= 5) shared.push(`${c}×「${s.slice(0, 40)}」`); });
  if (shared.length) {
    const affected = [];
    for (const k of Object.keys(dict)) {
      const sents = String(dict[k]).replace(/\s+/g, "").split(/[。！？；]/);
      if (sents.some(s => sentCount.get(s) >= 5)) affected.push(k);
    }
    rows.push({ f, shared, affected: affected.length });
  }
}
rows.sort((a, b) => b.affected - a.affected);
console.log(`共享模板句文件数 ${rows.length}`);
rows.forEach(r => {
  console.log(`\n${r.f} 受影响条目 ${r.affected}`);
  r.shared.slice(0, 6).forEach(s => console.log("  " + s));
});
