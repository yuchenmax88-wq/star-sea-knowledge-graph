/* 补连孤岛：图谱原先有 6 个小连通块（共 14 个节点）只跟自己人互连，
   不接回本领域主体，属于「走不到」的节点。这里给每个孤岛补一条语义正确的边。

   每条连接的理由都写在下面。类型遵循全局约定：
   part = 整体→部件；prereq = 基础→进阶；apply = 来源用在目标上；related 无方向。

   用法：node tools/connect-islands.js          # 预览
         node tools/connect-islands.js --fix    # 写入 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const DOM = path.join(ROOT, "assets", "data", "domains");
const FIX = process.argv.includes("--fix");

/* 领域 → 要补的边 */
const PLAN = {
  protect: [
    [["protect-main-protection", "主保护"], ["protect-selectivity", "选择性"], "related", 3,
      "主保护的配置直接服务于选择性要求，原先这四个保护配置类节点自成一体"],
    [["protect-backup-protection", "后备保护"], ["protect-reliability", "可靠性"], "related", 3,
      "后备保护本就是为提高保护可靠性而设"]
  ],
  embed: [
    [["embed-mcu", "微控制器"], ["embed-vonneumann", "冯诺依曼结构"], "related", 3,
      "微控制器的内核可采冯诺依曼或哈佛结构，两种结构原先只有彼此互连"],
    [["embed-mcu", "微控制器"], ["embed-harvard", "哈佛结构"], "related", 3,
      "同上"]
  ],
  grid: [
    [["grid-fault-analysis", "不对称故障分析"], ["grid-phase-to-phase", "两相短路"], "part", 3,
      "两相短路是不对称故障的一种，整体→部件"],
    [["grid-fault-analysis", "不对称故障分析"], ["grid-two-phase-ground", "两相接地短路"], "part", 3,
      "两相接地短路也是不对称故障的一种"]
  ],
  hv: [
    [["hv-insulating-oil", "绝缘油"], ["hv-oil-breakdown", "绝缘油击穿"], "related", 3,
      "绝缘油与它的击穿现象直接相关"],
    [["hv-solid-breakdown", "固体击穿"], ["hv-liquid-breakdown", "液体击穿"], "contrast", 2,
      "固体击穿与液体击穿是并列的两类介质击穿，常拿来对比"]
  ],
  storage: [
    [["storage-li-ion", "锂离子电池"], ["storage-lead-acid", "铅酸电池"], "contrast", 2,
      "锂离子与铅酸是常被对比的两类电池"],
    [["storage-li-ion", "锂离子电池"], ["storage-sodium-ion", "钠离子电池"], "contrast", 2,
      "钠离子电池与锂离子电池技术路线接近、常作对比"],
    [["storage-li-ion", "锂离子电池"], ["storage-sodium-sulfur", "钠硫电池"], "related", 2,
      "钠硫与锂离子同属电化学储能"]
  ]
};

/* 先建 id 索引，确认每个 id 都存在、名字对得上（防止写错 id） */
const idOf = {};
fs.readdirSync(DOM).filter(f => f.endsWith(".js")).forEach(f => {
  const sb = { window: {} };
  new Function("window", "console", fs.readFileSync(path.join(DOM, f), "utf8"))(sb.window, { warn() {}, log() {}, error() {} });
  ((sb.window.KG || {}).nodes || []).forEach(n => { idOf[n.c + "\u0000" + n.n] = n.id; });
});

let bad = 0, n = 0;
Object.keys(PLAN).forEach(dom => {
  const lines = [];
  PLAN[dom].forEach(([a, b, type, w, why]) => {
    const ia = idOf[dom + "\u0000" + a[1]];
    const ib = idOf[dom + "\u0000" + b[1]];
    if (!ia || ia !== a[0]) { console.log(`✗ ${dom}：找不到节点 ${a[1]}（期望 id ${a[0]}）`); bad++; return; }
    if (!ib || ib !== b[0]) { console.log(`✗ ${dom}：找不到节点 ${b[1]}（期望 id ${b[0]}）`); bad++; return; }
    lines.push(`    ["${ia}", "${ib}", "${type}", ${w}]`);
    console.log(`✓ ${dom}  ${a[1]} --${type}--> ${b[1]}    ${why}`);
    n++;
  });
  if (!lines.length) return;

  const p = path.join(DOM, dom + ".js");
  let src = fs.readFileSync(p, "utf8");
  const block = `\n  /* 补连：下面这些节点原先只与本簇内部互连，接回主体后整图才连通 */\n` +
    `  KG.edges.push(\n${lines.join(",\n")}\n  );\n`;
  const i = src.lastIndexOf("})();");
  if (i < 0) { console.log(`✗ ${dom}：文件结构异常，找不到结尾`); bad++; return; }
  src = src.slice(0, i) + block + src.slice(i);
  if (FIX) fs.writeFileSync(p, src, "utf8");
});

console.log(`\n共 ${n} 条，异常 ${bad} 条`);
console.log(FIX ? "已写入" : "预览模式，未写入（加 --fix 才写）");
