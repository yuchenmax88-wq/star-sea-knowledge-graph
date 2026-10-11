/* ============================================================
 * 详解文本校验
 * 用法： node tools/validate-text.js <领域id>      校验单个领域
 *        node tools/validate-text.js              校验全部
 * ============================================================ */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const DIR = path.join(ROOT, "assets", "data", "text");
const ARG = process.argv[2];

function nodesOf(domain) {
  const f = path.join(ROOT, "assets", "data", "domains", domain + ".js");
  const sb = { window: {} };
  new Function("window", "console", fs.readFileSync(f, "utf8"))(sb.window, { warn() {}, log() {}, error() {} });
  return ((sb.window.KG || {}).nodes || []).map(n => n.id);
}

function check(domain) {
  const file = path.join(DIR, domain + ".js");
  const errs = [], warns = [];
  if (!fs.existsSync(file)) return { domain, errs: ["文件不存在：" + file], warns, n: 0 };

  const src = fs.readFileSync(file, "utf8");
  try { new Function("window", "console", src); }
  catch (e) { return { domain, errs: ["语法错误：" + e.message], warns, n: 0 }; }

  const sb = { window: {} };
  new Function("window", "console", src)(sb.window, { warn() {}, log() {}, error() {} });
  const dict = (sb.window.KG_TEXT || {})[domain];
  if (!dict) return { domain, errs: ["没有写入 KG_TEXT[\"" + domain + "\"]"], warns, n: 0 };

  const ids = nodesOf(domain);
  const keys = Object.keys(dict);
  const missing = ids.filter(id => !dict[id]);
  const extra = keys.filter(k => !ids.includes(k));

  if (missing.length) errs.push(`缺 ${missing.length} 条：` + missing.slice(0, 8).join(", "));
  if (extra.length) errs.push(`${extra.length} 条 id 对不上：` + extra.slice(0, 8).join(", "));
  if (keys.length !== ids.length) errs.push(`条目数 ${keys.length}，应为 ${ids.length}`);

  let shortCount = 0, longCount = 0;
  keys.forEach(k => {
    const len = String(dict[k]).replace(/\s/g, "").length;
    if (len < 90) { shortCount++; warns.push(`偏短（${len} 字）：${k}`); }
    if (len > 400) longCount++;
  });
  if (longCount) warns.push(`${longCount} 条超过 400 字`);

  return { domain, errs, warns, n: keys.length, shortCount };
}

const list = ARG ? [ARG] : fs.readdirSync(DIR).filter(f => f.endsWith(".js")).map(f => f.replace(/\.js$/, "")).sort();
if (!list.length) { console.log("还没有任何详解文件"); process.exit(0); }

let total = 0, failed = 0;
list.forEach(d => {
  const r = check(d);
  console.log(`${r.errs.length ? "✗" : "✓"} ${d.padEnd(14)} 条目 ${String(r.n).padStart(4)}`);
  r.warns.slice(0, 4).forEach(w => console.log("    ! " + w));
  r.warns.length > 4 && console.log(`    ! …还有 ${r.warns.length - 4} 条`);
  r.errs.forEach(e => { console.log("    ✗ " + e); failed++; });
  total += r.n;
});

console.log(`\n合计 ${list.length} 个领域，${total} 条详解`);
console.log(failed ? `存在 ${failed} 个错误` : "ALL OK");
process.exit(failed ? 1 : 0);
