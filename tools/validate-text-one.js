/* 单个领域详解文本的校验。用法： node tools/validate-text-one.js <领域id> [条目数]
   校验：语法 / 条目数 / key 与领域节点 id 是否逐字对齐 / 字数区间 / 多余 key /
        编造嫌疑（标准编号、型号、年份、厂商）                                  */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const dom = process.argv[2];
const wantN = Number(process.argv[3] || 110);
const T = path.join(ROOT, "assets", "data", "text", dom + ".js");
const D = path.join(ROOT, "assets", "data", "domains", dom + ".js");

if (!dom) { console.log("用法：node tools/validate-text-one.js <领域id> [条目数]"); process.exit(1); }
if (!fs.existsSync(T)) { console.log(`✗ 文本文件不存在：${T}`); process.exit(1); }

let src = fs.readFileSync(T, "utf8");
try { new Function("window", "console", src); }
catch (e) { console.log("✗ 语法错误：" + e.message); process.exit(1); }

const sb = { window: {} };
new Function("window", "console", src)(sb.window, { warn() {}, log() {}, error() {} });
const dict = (sb.window.KG_TEXT || {})[dom];
if (!dict) { console.log(`✗ 没有写入 KG_TEXT["${dom}"]`); process.exit(1); }

const dsb = { window: {} };
new Function("window", "console", fs.readFileSync(D, "utf8"))(dsb.window, { warn() {}, log() {}, error() {} });
const ids = (dsb.window.KG.nodes || []).map(n => n.id);

const bad = [];
const keys = Object.keys(dict);
if (keys.length !== ids.length) bad.push(`条目数 ${keys.length}，应为 ${ids.length}`);
const missing = ids.filter(i => !dict[i]);
const extra = keys.filter(k => !ids.includes(k));
if (missing.length) bad.push(`缺 ${missing.length} 条：${missing.slice(0, 6).join(", ")}`);
if (extra.length) bad.push(`多余 ${extra.length} 个 key：${extra.slice(0, 6).join(", ")}`);

let short = 0, long = 0, total = 0;
/* 「禁止年份」只针对技术领域（那里出现年份多半是在编造规格）；
   人文与科学领域的详解**应当**包含年代，一律豁免。
   反向规则的另一个好处：以后新增领域不用再维护白名单。 */
const TECH_ONLY_YEAR = new Set([
  "circuit", "thermal", "power", "renewable", "grid", "storage", "protect", "embed", "hv",
  "control", "electronics", "code", "motor", "signal", "ai", "comm", "math", "industrial",
  "standard", "practice", "ev", "building", "datacenter", "rail", "carbon", "market",
  "material", "wireless"
]);
const FAKE = [
  [/GB\/T\s*\d+|DL\/T\s*\d+|JB\/T\s*\d+/, "标准编号"],
  [/\bIEC\s*\d{3,}|\bIEEE\s*\d{3,}/i, "标准编号"],
  [/\b(19|20)\d{2}\s*年/, "年份"],
  [/\b[A-Z]{2,}\d{2,}[A-Z0-9]*\b/, "疑似型号"],
  [/\d+(\.\d+)?\s*(kV|MV|MW|kWh|Wh\/kg|MPa|℃)\b/, "疑似精确参数"]
];
const hits = [];
keys.forEach(k => {
  const v = String(dict[k] || "");
  const L = v.replace(/\s/g, "").length;
  total += L;
  if (L < 90) { short++; if (short <= 5) bad.push(`偏短（${L} 字）：${k}`); }
  if (L > 400) { long++; if (long <= 5) bad.push(`过长（${L} 字）：${k}`); }
  FAKE.forEach(([re, why]) => {
    if (why === "年份" && !TECH_ONLY_YEAR.has(dom)) return;
    if (re.test(v)) hits.push(`${why}：${k}`);
  });
});

console.log(`${dom}  条目 ${keys.length}  平均 ${Math.round(total / Math.max(1, keys.length))} 字  偏短 ${short}  过长 ${long}`);
if (hits.length) { console.log("编造嫌疑："); hits.slice(0, 8).forEach(h => console.log("  ! " + h)); }
[...new Set(bad)].forEach(b => console.log("  ✗ " + b));
const fatal = missing.length || extra.length || keys.length !== ids.length;
console.log(fatal || hits.length || short > 5 ? "存在问题，需修正" : "ALL OK");
process.exit(fatal ? 1 : 0);