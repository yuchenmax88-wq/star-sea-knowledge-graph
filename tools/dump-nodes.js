/* ============================================================
 * 把各领域的节点清单导出成纯文本，供「跨领域关系」的 agent 读取
 * 用法： node tools/dump-nodes.js
 * 产物： tools/_nodes/<domain>.txt
 * ============================================================ */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const DIR = path.join(ROOT, "assets", "data", "domains");
const OUT = path.join(ROOT, "tools", "_nodes");

fs.mkdirSync(OUT, { recursive: true });

/* 领域清单直接从 data.js 的注册表读，新增领域不用改这里 */
const sb = { window: {} };
new Function("window", "console", fs.readFileSync(path.join(ROOT, "assets", "js", "data.js"), "utf8"))(sb.window, { warn() {}, log() {}, error() {} });
const ORDER = (sb.window.KG_DOMAINS || []).map(d => d.id);

const summary = [];

ORDER.forEach(id => {
  const file = path.join(DIR, id + ".js");
  if (!fs.existsSync(file)) return;
  const sb = { window: {} };
  new Function("window", "console", fs.readFileSync(file, "utf8"))(sb.window, { warn() {}, log() {}, error() {} });
  const nodes = (sb.window.KG || {}).nodes || [];

  const lines = nodes.map(n => `${n.id}\t${n.n}\t${(n.k || []).join("/")}`);
  fs.writeFileSync(path.join(OUT, id + ".txt"), lines.join("\n"), "utf8");
  summary.push(`${id}\t${nodes.length}\t${path.join("tools", "_nodes", id + ".txt")}`);
});

fs.writeFileSync(path.join(OUT, "_index.txt"),
  "领域\t节点数\t清单文件\n" + summary.join("\n"), "utf8");

console.log(summary.join("\n"));
console.log("\n共 " + summary.length + " 个领域，清单已写入 tools/_nodes/");
