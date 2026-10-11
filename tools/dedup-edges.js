/* 清理单个领域文件里的重复边与凑数边。
   重复规则：同一对节点只保留一条，优先级
     part > prereq > apply > contrast > related，同类型内保留强度高的。
   裁剪规则：若边数仍超过上限，从最弱的 related（强度 1 → 2）开始删，
     但**绝不允许把任何节点删成孤立节点**。

   用法： node tools/dedup-edges.js <领域id> [边数上限，默认 200]
          加 --preview 只看不改 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const dom = process.argv[2];
const LIMIT = Number(process.argv[3] || 200);
const PREVIEW = process.argv.includes("--preview");
const FILE = path.join(ROOT, "assets", "data", "domains", dom + ".js");

if (!dom || !fs.existsSync(FILE)) { console.log("用法：node tools/dedup-edges.js <领域id> [上限] [--preview]"); process.exit(1); }

const src = fs.readFileSync(FILE, "utf8");
const sb = { window: {} };
new Function("window", "console", src)(sb.window, { warn() {}, log() {}, error() {} });
const KG = sb.window.KG;

const PRI = { part: 5, prereq: 4, apply: 3, contrast: 2, related: 1 };
const key = l => (l[0] < l[1] ? l[0] + "|" + l[1] : l[1] + "|" + l[0]);
const better = (a, b) => (PRI[b[2]] - PRI[a[2]]) || (b[3] - a[3]);

/* 1) 去重 */
const best = new Map();
KG.edges.forEach((l, i) => {
  const k = key(l);
  if (!best.has(k) || better(best.get(k).l, l) > 0) best.set(k, { l, i });
});
const kept = [...best.values()].sort((a, b) => a.i - b.i).map(x => x.l);
const dupRemoved = KG.edges.length - kept.length;

/* 2) 裁剪最弱的 related，但保证无孤立节点 */
const deg = {};
KG.nodes.forEach(n => deg[n.id] = 0);
const recount = arr => { arr.forEach(l => { deg[l[0]]++; deg[l[1]]++; }); };
recount(kept);
let final = kept;
if (final.length > LIMIT) {
  const weak = final
    .filter(l => l[2] === "related")
    .sort((a, b) => a[3] - b[3]);
  const drop = new Set();
  for (const l of weak) {
    if (final.length - drop.size <= LIMIT) break;
    if (deg[l[0]] <= 1 || deg[l[1]] <= 1) continue;   // 会造成孤立节点，跳过
    drop.add(l);
    deg[l[0]]--; deg[l[1]]--;
  }
  final = final.filter(l => !drop.has(l));
}
const trimmed = kept.length - final.length;
const orphans = KG.nodes.filter(n => deg[n.id] === 0).map(n => n.id);

console.log(`${dom}：原 ${KG.edges.length} 条 → 去重 ${dupRemoved} 条 → 裁剪 ${trimmed} 条 → 现 ${final.length} 条`);
console.log(`类型分布 ${JSON.stringify(final.reduce((o, l) => (o[l[2]] = (o[l[2]] || 0) + 1, o), {}))}`);
console.log(orphans.length ? `✗ 出现孤立节点 ${orphans.length} 个：${orphans.slice(0, 5).join(", ")}` : "✓ 无孤立节点");

if (PREVIEW) { console.log("预览模式，未写入"); process.exit(0); }

/* 按新顺序重写 KG.edges.push(...) 块 */
const start = src.indexOf("KG.edges.push(");
if (start < 0) { console.log("✗ 找不到 KG.edges.push("); process.exit(1); }
const open = src.indexOf("(", start);
let depth = 0, close = -1;
for (let i = open; i < src.length; i++) {
  if (src[i] === "(") depth++;
  else if (src[i] === ")") { depth--; if (depth === 0) { close = i; break; } }
}
if (close < 0) { console.log("✗ 括号不匹配"); process.exit(1); }

const body = "\n" + final.map(l => `    ["${l[0]}", "${l[1]}", "${l[2]}", ${l[3]}],`).join("\n") + "\n  ";
const out = src.slice(0, open + 1) + body + src.slice(close);
fs.writeFileSync(FILE, out, "utf8");
console.log("已写入");