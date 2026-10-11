/* 核对：data.js 注册的每个领域，是否都有对应的数据文件、文本文件、清单 */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const src = fs.readFileSync(path.join(ROOT, "assets", "js", "data.js"), "utf8");

/* 领域注册项：形如 { id: "circuit",   name: "电路与电磁", ... } */
const block = src.slice(src.indexOf("window.KG_DOMAINS = ["));
const ids = [...block.matchAll(/id:\s*"([a-z0-9]+)"/g)].map(m => m[1]);

const ext = dir => e => new Set(fs.readdirSync(path.join(ROOT, dir))
  .filter(f => f.endsWith(e))
  .map(f => f.replace(/\.[^.]+$/, "")));   // 去掉扩展名

const data = ext("assets/data/domains")(".js");
const text = ext("assets/data/text")(".js");
const nodes = ext("tools/_nodes")(".txt");

const rows = [];
ids.forEach(id => {
  const miss = [];
  if (!data.has(id)) miss.push("无节点数据");
  if (!text.has(id)) miss.push("无详解文本");
  if (!nodes.has(id)) miss.push("无清单");
  rows.push([id, data.has(id), text.has(id), nodes.has(id), miss.join("、")]);
});

const bad = rows.filter(r => r[4]);
console.log(`注册领域 ${ids.length}   数据文件 ${data.size}   文本文件 ${text.size}   清单 ${nodes.size}`);
if (!bad.length) console.log("✓ 每个注册领域都齐备");
else bad.forEach(r => console.log(`  ✗ ${r[0].padEnd(12)} ${r[4]}`));
process.exit(bad.length ? 1 : 0);