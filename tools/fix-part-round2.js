/* 第二轮 part 方向修正。
   上一轮只处理了 code/math/protect/power，漏了 standard/circuit/storage/
   electronics/renewable/signal/hv 七个领域里残留的写反的边。
   逐条依据：「part = 整体/类别 → 部件/成员」。例如
     ✗ 国家标准 --> 标准体系      （国家标准 包含 标准体系？不通）
     ✓ 标准体系 --> 国家标准      （标准体系 由各级标准构成）
   脚本只在边当前方向与下表一致时才翻转，因此**天然幂等**。

   用法：node tools/fix-part-round2.js          # 预览
         node tools/fix-part-round2.js --fix    # 写入 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const DOM = path.join(ROOT, "assets", "data", "domains");
const FIX = process.argv.includes("--fix");

/* 整域全反的（这 22 条全部写反） */
const FLIP_ALL = ["standard"];

/* 零散写反的，按「当前方向」列出（源名 → 目标名） */
const PAIRS = {
  circuit: [
    ["电阻元件", "线性元件"], ["理想电压源", "有源与无源"], ["理想电流源", "有源与无源"],
    ["受控电源", "有源与无源"], ["零输入响应", "完全响应"], ["零状态响应", "完全响应"],
    ["感抗与容抗", "复数阻抗"], ["高斯定律", "麦克斯韦方程组"], ["安培环路定律", "麦克斯韦方程组"],
    ["法拉第电磁感应定律", "麦克斯韦方程组"], ["位移电流", "麦克斯韦方程组"]
  ],
  storage: [
    ["电池内阻", "电池等效电路模型"], ["安时积分法", "SOC估算"], ["卡尔曼滤波法", "SOC估算"],
    ["下垂控制", "构网型变流器"], ["下垂控制", "虚拟同步发电机"],
    ["有功无功控制", "跟网型变流器"], ["恒压恒频控制", "构网型变流器"],
    ["并网同步", "跟网型变流器"], ["需求响应", "虚拟电厂"]
  ],
  electronics: [
    ["共射放大电路", "多级放大电路"], ["恒流源", "差分放大电路"],
    ["互补对称功率放大", "功率放大电路"], ["D触发器", "移位寄存器"],
    ["CMOS逻辑电路", "逻辑门"], ["TTL逻辑电路", "逻辑门"]
  ],
  renewable: [
    ["光伏电池", "光伏组件"], ["光伏组件", "光伏阵列"],
    ["光伏阵列", "光伏电站设计"], ["组串式逆变器", "光伏电站设计"],
    ["光伏支架", "光伏电站设计"], ["汇流箱", "光伏电站设计"],
    ["谐波", "电能质量"], ["屋顶光伏", "分布式光伏"], ["光伏建筑一体化", "分布式光伏"]
  ],
  signal: [
    ["汉明窗", "窗函数法"], ["汉宁窗", "窗函数法"], ["凯泽窗", "窗函数法"]
  ],
  hv: [
    ["碰撞电离", "电离过程"], ["光电离", "电离过程"], ["热电离", "电离过程"],
    ["空气击穿", "气体击穿"], ["绝缘老化", "热老化"]
  ]
};

/* 名字 → id（限本领域） */
function idsOf(dom) {
  const sb = { window: {} };
  new Function("window", "console", fs.readFileSync(path.join(DOM, dom + ".js"), "utf8"))(sb.window, { warn() {}, log() {}, error() {} });
  const m = {};
  ((sb.window.KG || {}).nodes || []).forEach(n => { m[n.n] = n.id; });
  return m;
}

const LINE = /(\[\s*")([^"]+)("\s*,\s*")([^"]+)("\s*,\s*"part"\s*,\s*)(\d+)(\s*\])/;
let total = 0, miss = 0, alreadyOk = 0;

const targets = FLIP_ALL.concat(Object.keys(PAIRS));
[...new Set(targets)].forEach(dom => {
  const map = idsOf(dom);
  const p = path.join(DOM, dom + ".js");
  const lines = fs.readFileSync(p, "utf8").split("\n");
  const all = FLIP_ALL.indexOf(dom) >= 0;
  const want = (PAIRS[dom] || []).map(([a, b]) => {
    if (!map[a] || !map[b]) { console.log(`✗ ${dom}：找不到节点 ${a} 或 ${b}`); miss++; return null; }
    return [map[a], map[b], a, b];
  }).filter(Boolean);
  const wantMap = {};
  want.forEach(([ia, ib, a, b]) => { wantMap[ia + ">" + ib] = [a, b]; });

  let n = 0;
  lines.forEach((line, i) => {
    const m = line.match(LINE);
    if (!m) return;
    const a = m[2], b = m[4];
    let hit = null;
    if (all) hit = [a, b];
    else if (wantMap[a + ">" + b]) hit = wantMap[a + ">" + b];
    if (!hit) return;
    n++; total++;
    console.log(`  ${dom.padEnd(12)} ${(all ? "" : hit[0] + "  ")}-->  ${(all ? "" : hit[1] + " ")}   反向`);
    lines[i] = line.replace(LINE, `$1${b}$3${a}$5${m[6]}$7`);
  });

  /* 统计已经是对的那些（不匹配的），用于确认没翻错 */
  if (all) {
    lines.forEach(line => {
      const m = line.match(LINE);
      if (m) alreadyOk++;
    });
  }
  if (n && FIX) fs.writeFileSync(p, lines.join("\n"), "utf8");
  console.log(`${dom.padEnd(14)} 翻转 ${n} 条`);
});

console.log(`\n合计翻转 ${total} 条（未找到 ${miss} 条）`);
console.log(FIX ? "已写入" : "预览模式，未写入（加 --fix 才写）");
