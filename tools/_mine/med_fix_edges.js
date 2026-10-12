/* 移除 medicine patch 中重复的 contrast 边，保留新边 */
const fs = require("fs");
const path = require("path");
const ROOT = path.resolve(__dirname, "..", "..");
const f = path.join(ROOT, "assets", "data", "domains", "medicine.js");
let src = fs.readFileSync(f, "utf8");
// 6 条重复的（已在原始 med_data.js 中存在）
const dups = [
  '    ["medicine-sympathetic", "medicine-parasympathetic", "contrast", 3],\n',
  '    ["medicine-hyperthyroidism", "medicine-hypothyroidism", "contrast", 2],\n',
  '    ["medicine-antibiotic", "medicine-antifungal", "contrast", 2],\n',
  '    ["medicine-antiviral", "medicine-antiparasitic", "contrast", 2],\n',
  '    ["medicine-surgery", "medicine-rehab", "contrast", 2],\n',
  '    ["medicine-opioid", "medicine-nsaid", "contrast", 2],\n'
];
const patchIdx = src.indexOf("/* patch 追加 contrast */");
let head = src.slice(0, patchIdx);
let tail = src.slice(patchIdx);
let removed = 0;
for (const d of dups) {
  if (tail.includes(d)) { tail = tail.replace(d, ""); removed++; }
}
fs.writeFileSync(f, head + tail, "utf8");
console.log("removed " + removed + " duplicate lines, kept new edges");
