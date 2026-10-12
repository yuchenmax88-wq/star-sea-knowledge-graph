/* 单个领域文件的校验。用法： node tools/validate-one.js <领域id> [期望节点数]
   校验：语法 / id 前缀 / id 唯一 / 字段完整 / 定义长度 / 悬空边 / 非法类型 / 自环 /
        孤立节点 / 类型配比 / 是否含编造嫌疑（标准编号、型号、年份、人名、厂商）        */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const dom = process.argv[2];
const wantN = Number(process.argv[3]);
const file = path.join(ROOT, "assets", "data", "domains", dom + ".js");

if (!fs.existsSync(file)) { console.log(`✗ 文件不存在：${file}`); process.exit(1); }

let src = fs.readFileSync(file, "utf8");
try { new Function("window", "console", src); }
catch (e) { console.log("✗ 语法错误：" + e.message); process.exit(1); }

const sb = { window: {} };
new Function("window", "console", src)(sb.window, { warn() {}, log() {}, error() {} });
const KG = sb.window.KG || { nodes: [], edges: [] };

const bad = [];
const ids = new Set();

KG.nodes.forEach(n => {
  if (ids.has(n.id)) bad.push(`重复 id：${n.id}`);
  ids.add(n.id);
  if (!n.id.startsWith(dom + "-")) bad.push(`id 前缀错（应 ${dom}-）：${n.id}`);
  if (!n.n) bad.push(`缺中文名：${n.id}`);
  if (!n.c || n.c !== dom) bad.push(`领域字段错：${n.id} 的 c=${n.c}`);
  const len = String(n.d || "").replace(/\s/g, "").length;
  if (len < 25) bad.push(`定义过短（${len} 字）：${n.id}`);
  if (len > 90) bad.push(`定义过长（${len} 字，上限 90）：${n.id}`);
  if (!n.k || n.k.length < 2) bad.push(`关键词不足 2 个：${n.id}`);
});

const TYPES = new Set(["prereq", "part", "apply", "related", "contrast"]);
const seen = new Set();
const type = {};
KG.edges.forEach((l, i) => {
  if (!Array.isArray(l) || l.length < 4) { bad.push(`第 ${i + 1} 条格式错`); return; }
  const [a, b, t, w] = l;
  if (!ids.has(a)) bad.push(`悬空起点：${a}`);
  if (!ids.has(b)) bad.push(`悬空终点：${b}`);
  if (!TYPES.has(t)) bad.push(`非法类型 ${t}：${a} → ${b}`);
  if (![1, 2, 3].includes(w)) bad.push(`强度不是 1/2/3：${a} → ${b}`);
  if (a === b) bad.push(`自环：${a}`);
  const k = a < b ? a + "|" + b : b + "|" + a;
  if (seen.has(k)) bad.push(`重复边：${a} ↔ ${b}`);
  seen.add(k);
  type[t] = (type[t] || 0) + 1;
});

const deg = {};
KG.nodes.forEach(n => deg[n.id] = 0);
KG.edges.forEach(l => { if (deg[l[0]] !== undefined) deg[l[0]]++; if (deg[l[1]] !== undefined) deg[l[1]]++; });
const orph = KG.nodes.filter(n => deg[n.id] === 0).map(n => n.id);
if (orph.length) bad.push(`孤立节点 ${orph.length} 个：${orph.slice(0, 6).join(", ")}`);

if (wantN) { if (KG.nodes.length !== wantN) bad.push(`节点数 ${KG.nodes.length}，应为 ${wantN}`); }
else if (KG.nodes.length < 110 || KG.nodes.length > 300) bad.push(`节点数 ${KG.nodes.length}，期望 110~300`);
const E = KG.edges.length;
const edgeMax = Math.max(200, Math.round(KG.nodes.length * 1.8));
if (E < 130) bad.push(`边数偏少：${E}（下限 130）`);
if (E > edgeMax) bad.push(`边数偏多：${E}（上限 ${edgeMax}）`);
if (type.prereq / E > 0.42) bad.push(`prereq 占比过高：${(type.prereq / E * 100).toFixed(0)}%（上限 42%）`);
["part", "apply", "contrast"].forEach(t => {
  if ((type[t] || 0) / E < 0.07) bad.push(`${t} 占比过低：${(type[t] || 0)} 条`);
});

/* 编造嫌疑扫描。
   「禁止年份」这条规则本来是为**技术领域**定的——那里出现具体年份多半是在编造规格。
   但人文与科学领域里，年份是**必需内容**（牛顿 1687 年、康德 1781 年）。
   所以这里改成反向规则：只有下列技术领域才查年份，其余（历史/科学/社科/哲学）一律豁免。
   —— 反向的好处是以后新增领域不用再维护白名单。 */
const TECH_ONLY_YEAR = new Set([
  "circuit", "thermal", "power", "renewable", "grid", "storage", "protect", "embed", "hv",
  "control", "electronics", "code", "motor", "signal", "ai", "comm", "math", "industrial",
  "standard", "practice", "ev", "building", "datacenter", "rail", "carbon", "market",
  "material", "wireless", "cosmos", "stellar", "planetary", "spacecraft", "robotics",
  "quantum", "nuclear", "petroleum", "biomedical", "optics", "graphics", "blockchain",
  "meteorology"
]);
const FAKE = [
  [/GB\/T\s*\d+|DL\/T\s*\d+|JB\/T\s*\d+|YY\/T\s*\d+/, "疑似标准编号"],
  [/\bIEC\s*\d{3,}|\bIEEE\s*\d{3,}|\bISO\/\s*IEC\s*\d+/i, "疑似标准编号"],
  [/\b(19|20)\d{2}\s*年/, "出现年份"],
  [/\b[A-Z]{2,}\d{2,}[A-Z0-9]*\b/, "疑似器件型号"],
  [/\d+(\.\d+)?\s*(kV|MV|MW|kWh|Wh\/kg|MPa|℃|°C)\b/, "疑似精确参数"]
];
const hits = [];
KG.nodes.forEach(n => {
  const t = (n.n || "") + " " + (n.d || "") + " " + (n.k || []).join(" ");
  FAKE.forEach(([re, why]) => {
    if (why === "出现年份" && !TECH_ONLY_YEAR.has(dom)) return;
    if (re.test(t)) hits.push(`${why}：${n.id} 「${n.n}」`);
  });
});

console.log(`节点 ${KG.nodes.length}  边 ${E}  孤立 ${orph.length}`);
console.log(`类型分布 ${JSON.stringify(type)}`);
if (hits.length) { console.log("编造嫌疑："); hits.slice(0, 10).forEach(h => console.log("  ! " + h)); }
[...new Set(bad)].forEach(b => console.log("  ✗ " + b));
console.log([...new Set(bad)].length || hits.length ? "存在问题，需修正" : "ALL OK");
process.exit([...new Set(bad)].length ? 1 : 0);