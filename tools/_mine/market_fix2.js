/* market 小修：给孤立节点加边（连既有节点） */
const fs = require("fs");
const path = require("path");
const ROOT = path.resolve(__dirname, "..", "..");
const f = path.join(ROOT, "assets", "data", "domains", "market.js");
let src = fs.readFileSync(f, "utf8");
src += "\n/* patch */\n(function(){var KG=window.KG;KG.edges.push(\n" +
'    ["market-capacity", "market-de-rating", "related", 2],\n' +
'    ["market-frequency", "market-ffrc", "apply", 2]\n' +
");})();\n";
fs.writeFileSync(f, src, "utf8");
console.log("added 2 edges");
