/* economics 小修：删重复边、加 social-welfare 边 */
const fs = require("fs");
const path = require("path");
const ROOT = path.resolve(__dirname, "..", "..");
const f = path.join(ROOT, "assets", "data", "domains", "economics.js");
let src = fs.readFileSync(f, "utf8");
// 删除重复边 ["economics-abs-advantage","economics-comparative-advantage","contrast",2]
const dup = '    ["economics-abs-advantage", "economics-comparative-advantage", "contrast", 2],\n';
if (src.includes(dup)) { src = src.replace(dup, ""); console.log("removed dup"); }
// 追加 edge：economics-pareto-efficiency -> economics-social-welfare, prereq; economics-social-welfare -> economics-redistribution, apply
src += "\n/* patch */\n(function(){var KG=window.KG;KG.edges.push(\n" +
'    ["economics-pareto-efficiency", "economics-social-welfare", "prereq", 3],\n' +
'    ["economics-social-welfare", "economics-redistribution", "apply", 2]\n' +
");})();\n";
fs.writeFileSync(f, src, "utf8");
console.log("added 2 edges");
