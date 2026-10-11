/* 关系外科手术：按「领域+节点名」定位一条边，执行 删除 / 反向 / 改类型。
   每条都经过人工判断，依据写在注释里。
   用法：node tools/edge-surgery.js          # 预览
         node tools/edge-surgery.js --fix    # 写入 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const DOM = path.join(ROOT, "assets", "data", "domains");
const EDG = path.join(ROOT, "assets", "data", "edges");
const FIX = process.argv.includes("--fix");

/* ---------- 操作清单 ---------- */

const OPS = [
  /* —— 硬凑的，删掉 —— */
  // 「图」（数据结构）与「甘特图」（横道图）只是中文里都有个"图"字
  { a: ["code", "图"], b: ["practice", "甘特图"], act: "drop",
    why: "数据结构「图」与项目管理「甘特图」只是名字都带个图字，毫无关系" },
  // 「滞环控制」是电流跟踪方法，与最大功率点跟踪不是一回事
  { a: ["power", "滞环控制"], b: ["renewable", "最大功率点跟踪"], act: "drop",
    why: "滞环控制用于电流跟踪，MPPT 是功率寻优，两者没有直接关系" },
  // 「采用国际标准」是一种标准化做法，与低电压穿越无实质关联
  { a: ["standard", "采用国际标准"], b: ["renewable", "低电压穿越"], act: "drop",
    why: "采用国际标准与低电压穿越之间没有实质关联" },

  /* —— 方向反了的，翻转 —— */
  // 整流电路由二极管构成，不是反过来
  { a: ["electronics", "二极管"], b: ["power", "整流电路"], act: "reverse",
    why: "整流电路由二极管组成，整体→部件" },
  // SVM 是监督学习的一种
  { a: ["signal", "支持向量机"], b: ["ai", "监督学习"], act: "reverse",
    why: "支持向量机属于监督学习，整体→部件" },
  // PCA 是降维的一种方法
  { a: ["signal", "主成分分析"], b: ["signal", "降维"], act: "reverse",
    why: "主成分分析是降维方法之一，整体→部件" },
  // 经济调度与储能的「能量管理」都是能量管理类功能，属于相关，不是前后置
  { a: ["grid", "经济调度"], b: ["storage", "能量管理"], act: "set:related",
    why: "经济调度与储能的能量管理同属能量管理类功能，是相关而非前置" },

  /* —— 类型标错的 —— */
  // 运放是实现电压环的器件，不是电压环的组成部分
  { a: ["electronics", "运算放大器"], b: ["power", "电压环"], act: "set:apply",
    why: "运放是用来实现电压环的，属于「应用」而非「包含」" },
  // 拉格朗日乘子法 / 单纯形法 / 复数都是求解工具，不是被求解对象的一部分
  { a: ["math", "拉格朗日乘子法"], b: ["grid", "经济调度"], act: "set:apply",
    why: "拉格朗日乘子法是求解经济调度的数学工具，属「应用」" },
  { a: ["math", "单纯形法"], b: ["grid", "经济调度"], act: "set:apply",
    why: "单纯形法是求解经济调度的工具，属「应用」" },
  { a: ["math", "复数"], b: ["grid", "标幺制"], act: "set:apply",
    why: "复数（相量）是标幺制表示里用到的数学工具，属「应用」" },
  { a: ["control", "计算机控制系统"], b: ["industrial", "集散控制系统"], act: "set:related",
    why: "集散控制系统本身就是计算机控制系统，二者是相关而非「应用」" },
  // 两条跨领域的 PCA↔降维：本质是同一概念在两个领域各建了一个节点
  { a: ["signal", "主成分分析"], b: ["ai", "降维"], act: "set:related",
    why: "同一概念在两个领域各建节点，标为相关" },
  // ai 域内：降维与主成分分析的精确定位是「整体→部件」
  { a: ["ai", "降维"], b: ["ai", "主成分分析"], act: "set:part",
    why: "主成分分析是降维的一种方法，应标为「包含」而不是「前置」" }
];

/* ---------- 执行 ---------- */

function loadFile(p) {
  const sb = { window: {} };
  new Function("window", "console", fs.readFileSync(p, "utf8"))(sb.window, { warn() {}, log() {}, error() {} });
  return sb.window.KG || { nodes: [], edges: [] };
}

/* 建立 (领域,名) → id */
const idOf = {};
fs.readdirSync(DOM).filter(f => f.endsWith(".js")).forEach(f => {
  loadFile(path.join(DOM, f)).nodes.forEach(n => { idOf[n.c + "\u0000" + n.n] = n.id; });
});

const LINE = /(\[\s*")([^"]+)("\s*,\s*")([^"]+)("\s*,\s*")(\w+)("\s*,\s*)(\d+)(\s*\])/;

let done = 0, missed = 0;
const files = [];
fs.readdirSync(DOM).filter(f => f.endsWith(".js")).forEach(f => files.push(path.join(DOM, f)));
fs.readdirSync(EDG).filter(f => f.endsWith(".js")).forEach(f => files.push(path.join(EDG, f)));

const plan = [];   // {file, lineIdx, newLine|null}

OPS.forEach(op => {
  const idA = idOf[op.a[0] + "\u0000" + op.a[1]];
  const idB = idOf[op.b[0] + "\u0000" + op.b[1]];
  if (!idA || !idB) { console.log(`✗ 找不到节点：${op.a} / ${op.b}`); missed++; return; }

  let found = false;
  files.forEach(fp => {
    const lines = fs.readFileSync(fp, "utf8").split("\n");
    lines.forEach((line, i) => {
      const m = line.match(LINE);
      if (!m) return;
      const x = m[2], y = m[4];
      if (!(x === idA && y === idB)) return;
      found = true;
      const act = op.act;
      if (act === "drop") {
        plan.push({ fp, i, out: null, op });
      } else if (act === "reverse") {
        plan.push({ fp, i, out: line.replace(LINE, `$1${y}$3${x}$5${m[6]}$7${m[8]}$9`), op });
      } else if (act === "reverse-part") {
        /* 注意：捕获组 $5/$7 本身已经带了引号，这里不能再加引号 */
        plan.push({ fp, i, out: line.replace(LINE, `$1${y}$3${x}$5part$7${m[8]}$9`), op });
      } else if (act.indexOf("set:") === 0) {
        plan.push({ fp, i, out: line.replace(LINE, `$1${x}$3${y}$5${act.slice(4)}$7${m[8]}$9`), op });
      }
    });
  });
  if (!found) { console.log(`✗ 找不到边：${op.a[1]} ↔ ${op.b[1]}`); missed++; }
  else {
    done++;
    console.log(`✓ ${op.a[1]} ↔ ${op.b[1]}   [${op.act}]   ${op.why}`);
  }
});

console.log(`\n命中 ${done} 条，未命中 ${missed} 条`);

if (!FIX) { console.log("预览模式，未写入"); process.exit(0); }

/* 按文件分组落地 */
const byFile = {};
plan.forEach(p => { (byFile[p.fp] = byFile[p.fp] || []).push(p); });

Object.keys(byFile).forEach(fp => {
  const lines = fs.readFileSync(fp, "utf8").split("\n");
  const drops = byFile[fp].filter(p => p.out === null).map(p => p.i);
  byFile[fp].forEach(p => { if (p.out !== null) lines[p.i] = p.out; });
  const kept = lines.filter((_, i) => drops.indexOf(i) < 0);
  fs.writeFileSync(fp, kept.join("\n"), "utf8");
  console.log(`  写入 ${path.basename(fp)}：改 ${byFile[fp].length - drops.length} 条，删 ${drops.length} 条`);
});

/* 写完立刻语法自检 —— 这类脚本一旦写坏引号（曾经发生过），
   整个数据分片都会加载失败，必须在脚本里拦住 */
let bad = 0;
Object.keys(byFile).forEach(fp => {
  try { new Function("window", "console", fs.readFileSync(fp, "utf8")); }
  catch (e) { console.log(`  ✗ 语法被写坏：${path.basename(fp)} —— ${e.message}`); bad++; }
});
if (bad) {
  console.log(`\n有 ${bad} 个文件语法出错，请从 _backup/ 或 git 还原后再查脚本`);
  process.exit(1);
}
console.log("\n已写入，语法自检通过");
