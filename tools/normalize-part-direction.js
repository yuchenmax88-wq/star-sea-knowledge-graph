/* 把 part 边的方向统一到「整体 → 部件」（来源包含目标）。
   18 个领域本来就是这么写的，只有 code / math / protect 三个领域写反了，
   另有 power 的 5 条例外。逐条判断依据见下方 FLIP_ALL / FLIP_PAIRS。

   用法：node tools/normalize-part-direction.js          # 预览
         node tools/normalize-part-direction.js --fix    # 写入 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const DOM = path.join(ROOT, "assets", "data", "domains");
const FIX = process.argv.includes("--fix");

/* 这三个领域整体写反了：翻转其中全部 part 边 */
const FLIP_ALL = ["protect", "code", "math"];

/* power 里这 5 条是写反的少数派，单独翻转（按中文名配对） */
const FLIP_PAIRS = {
  power: [
    ["隔离驱动", "驱动电路"],
    ["自举驱动", "驱动电路"],
    ["准谐振变换器", "谐振变换器"],
    ["共模干扰", "电磁干扰"],
    ["差模干扰", "电磁干扰"]
  ]
};

const LINE = /(\[\s*")([^"]+)("\s*,\s*")([^"]+)("\s*,\s*"part"\s*,\s*)(\d+)(\s*\])/;

function load(dom) {
  const sb = { window: {} };
  new Function("window", "console", fs.readFileSync(path.join(DOM, dom + ".js"), "utf8"))(sb.window, { warn() {}, log() {}, error() {} });
  const KG = sb.window.KG || {};
  const by = {};
  (KG.nodes || []).forEach(n => by[n.id] = n);
  return by;
}

let flipped = 0;
const log = [];

Object.keys(FLIP_ALL).length; // noop
const targets = FLIP_ALL.concat(Object.keys(FLIP_PAIRS));

targets.forEach(dom => {
  const by = load(dom);
  const pairs = FLIP_PAIRS[dom];
  const wantAll = FLIP_ALL.indexOf(dom) >= 0;

  /* 允许翻转的 id 集合 */
  let allow = null;
  if (pairs) {
    allow = new Set();
    pairs.forEach(([sn, tn]) => {
      Object.keys(by).forEach(id => {
        if (by[id].n !== sn) return;
        Object.keys(by).forEach(jd => {
          if (by[jd].n === tn) allow.add(id + ">" + jd);
        });
      });
    });
  }

  const p = path.join(DOM, dom + ".js");
  const src = fs.readFileSync(p, "utf8");
  let n = 0;
  const out = src.split("\n").map(line => {
    const m = line.match(LINE);
    if (!m) return line;
    const a = m[2], b = m[4];
    if (wantAll) {
      n++;
      log.push(`${dom}: ${by[a] ? by[a].n : a} --> ${by[b] ? by[b].n : b}   ⇒ 反向`);
      return line.replace(LINE, `$1${b}$3${a}$5$6$7`);
    }
    if (allow && allow.has(a + ">" + b)) {
      n++;
      log.push(`${dom}: ${by[a].n} --> ${by[b].n}   ⇒ 反向`);
      return line.replace(LINE, `$1${b}$3${a}$5$6$7`);
    }
    return line;
  }).join("\n");

  if (n) {
    flipped += n;
    if (FIX) fs.writeFileSync(p, out, "utf8");
  }
  console.log(`${dom.padEnd(12)} 翻转 ${n} 条`);
});

console.log("\n" + log.join("\n"));
console.log(`\n合计翻转 ${flipped} 条 part 边，统一为「整体 → 部件」`);
console.log(FIX ? "已写入文件" : "预览模式，未写入（加 --fix 才写）");
