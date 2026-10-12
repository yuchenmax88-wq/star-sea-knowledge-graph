/* 通用 splice：把新节点/边/文本追加到既有领域文件末尾
   用法：node _mine/splice.js <domain> <dataFile>
   做法：在 domain.js 末尾追加一个 IIFE，push 新节点与边；
         在 text.js 末尾追加一个 IIFE，扩展 KG_TEXT[dom]。 */
const fs = require("fs");
const path = require("path");
const ROOT = path.resolve(__dirname, "..", "..");
const dom = process.argv[2];
const dataFile = process.argv[3];
const data = require(path.resolve(__dirname, dataFile));

const domFile = path.join(ROOT, "assets", "data", "domains", dom + ".js");
const txtFile = path.join(ROOT, "assets", "data", "text", dom + ".js");

function fmtNode(n) {
  const k = JSON.stringify(n.k);
  return `    { id: ${JSON.stringify(n.id)}, n: ${JSON.stringify(n.n)}, c: ${JSON.stringify(n.c)},\n      d: ${JSON.stringify(n.d)},\n      k: ${k} }`;
}
function fmtEdge(e) {
  return `    [${JSON.stringify(e[0])}, ${JSON.stringify(e[1])}, ${JSON.stringify(e[2])}, ${e[3]}]`;
}

const domAppend =
  "\n/* ===== 加厚追加 ===== */\n" +
  "(function () {\n" +
  "  var KG = window.KG;\n" +
  "  KG.nodes.push(\n" +
    data.nodes.map(fmtNode).join(",\n") + "\n" +
  "  );\n" +
  "  KG.edges.push(\n" +
    data.edges.map(fmtEdge).join(",\n") + "\n" +
  "  );\n" +
  "})();\n";

let txtAppend =
  "\n/* ===== 加厚追加 ===== */\n" +
  "(function () {\n" +
  "  window.KG_TEXT = window.KG_TEXT || {};\n" +
  "  window.KG_TEXT[" + JSON.stringify(dom) + "] = window.KG_TEXT[" + JSON.stringify(dom) + "] || {};\n";
for (const [k, v] of Object.entries(data.text)) {
  txtAppend += "  window.KG_TEXT[" + JSON.stringify(dom) + "][" + JSON.stringify(k) + "] = " + JSON.stringify(v) + ";\n";
}
txtAppend += "})();\n";

fs.appendFileSync(domFile, domAppend, "utf8");
fs.appendFileSync(txtFile, txtAppend, "utf8");
console.log("appended " + data.nodes.length + " nodes, " + data.edges.length + " edges, " + Object.keys(data.text).length + " text entries to " + dom);
