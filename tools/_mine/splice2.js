/* 通用 splice v2：nodes + edges + text 一起追加 */
const fs = require("fs");
const path = require("path");
const ROOT = path.resolve(__dirname, "..", "..");
const dom = process.argv[2];
const dataFile = process.argv[3];
const textFile = process.argv[4]; // optional
const data = require(path.resolve(__dirname, dataFile));
const texts = textFile ? require(path.resolve(__dirname, textFile)) : {};

const domFile = path.join(ROOT, "assets", "data", "domains", dom + ".js");
const txtFile = path.join(ROOT, "assets", "data", "text", dom + ".js");

function fmtNode(n) {
  const k = JSON.stringify(n.k);
  return `    { id: ${JSON.stringify(n.id)}, n: ${JSON.stringify(n.n)}, c: ${JSON.stringify(n.c)},\n      d: ${JSON.stringify(n.d)},\n      k: ${k} }`;
}
function fmtEdge(e) {
  return `    [${JSON.stringify(e[0])}, ${JSON.stringify(e[1])}, ${JSON.stringify(e[2])}, ${e[3]}]`;
}

let domAppend = "";
if (data.nodes && data.nodes.length) {
  domAppend += "\n/* ===== 加厚追加 ===== */\n(function () {\n  var KG = window.KG;\n  KG.nodes.push(\n" + data.nodes.map(fmtNode).join(",\n") + "\n  );\n";
}
if (data.edges && data.edges.length) {
  if (!domAppend) domAppend = "\n/* ===== 加厚追加 ===== */\n(function () {\n  var KG = window.KG;\n";
  domAppend += "  KG.edges.push(\n" + data.edges.map(fmtEdge).join(",\n") + "\n  );\n";
}
if (domAppend) domAppend += "})();\n";
if (domAppend) fs.appendFileSync(domFile, domAppend, "utf8");

let txtAppend = "";
const allText = Object.assign({}, data.text, texts);
if (Object.keys(allText).length) {
  txtAppend = "\n/* ===== 加厚文本 ===== */\n(function () {\n  window.KG_TEXT = window.KG_TEXT || {};\n  window.KG_TEXT[" + JSON.stringify(dom) + "] = window.KG_TEXT[" + JSON.stringify(dom) + "] || {};\n";
  for (const [k, v] of Object.entries(allText)) {
    txtAppend += "  window.KG_TEXT[" + JSON.stringify(dom) + "][" + JSON.stringify(k) + "] = " + JSON.stringify(v) + ";\n";
  }
  txtAppend += "})();\n";
  fs.appendFileSync(txtFile, txtAppend, "utf8");
}
console.log("appended to " + dom + ": nodes=" + (data.nodes||[]).length + " edges=" + (data.edges||[]).length + " text=" + Object.keys(allText).length);
