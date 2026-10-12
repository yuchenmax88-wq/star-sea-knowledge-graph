/* 文本文件规范化：将每个 text/<id>.js 重写为「仅含运行期生效条目」的单次赋值形式，
   清除追加式覆盖留下的死亡重复块。内容零改动（运行期 dict 深比较校验）。 */
const fs = require("fs");
const path = require("path");
const ROOT = path.resolve(__dirname, "..");
const DIR = path.join(ROOT, "assets", "data", "text");

const files = fs.readdirSync(DIR).filter(f => f.endsWith(".js"));
let changed = 0, totalBefore = 0, totalAfter = 0;

for (const f of files) {
  const filePath = path.join(DIR, f);
  const src = fs.readFileSync(filePath, "utf8");
  const sb = { window: {} };
  new Function("window", "console", src)(sb.window, { warn() {}, log() {}, error() {} });
  const id = f.replace(".js", "");
  const dict = (sb.window.KG_TEXT || {})[id];
  if (!dict || typeof dict !== "object") { console.log("✗ 无 dict", f); continue; }

  const before = JSON.stringify(dict);
  let out = "/* 详解（已规范化：单次赋值，条目与节点一一对应） */\n";
  out += "window.KG_TEXT = window.KG_TEXT || {};\n";
  out += `window.KG_TEXT["${id}"] = {\n`;
  const keys = Object.keys(dict);
  keys.forEach((k, i) => {
    out += `  ${JSON.stringify(k)}: ${JSON.stringify(String(dict[k]))}`;
    out += (i === keys.length - 1) ? "\n" : ",\n";
  });
  out += "};\n";

  const afterDict = JSON.stringify(dict); // 与 before 必等（对象未变）
  /* 复载校验 */
  const sb2 = { window: {} };
  new Function("window", "console", out)(sb2.window, { warn() {}, log() {}, error() {} });
  const reloaded = JSON.stringify((sb2.window.KG_TEXT || {})[id]);
  if (reloaded !== before) { console.log("✗ 复载不一致", f); process.exitCode = 1; continue; }

  totalBefore += src.length;
  totalAfter += out.length;
  if (out !== src) { fs.writeFileSync(filePath, out, "utf8"); changed++; }
}
console.log(`规范化完成：改动 ${changed}/${files.length} 个文件`);
console.log(`体积 ${(totalBefore / 1024).toFixed(0)}KB → ${(totalAfter / 1024).toFixed(0)}KB（UTF-16 码元计）`);
