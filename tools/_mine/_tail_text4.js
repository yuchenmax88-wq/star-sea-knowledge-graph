const fs = require('fs');
const f = 'assets/data/text/aerospace.js';
let c = fs.readFileSync(f, 'utf8');
const allNew = fs.readFileSync('tools/_mine/newids_aerospace.txt', 'utf8').trim().split('\n');
const tail = "理解它有助于把握航天航空工程的整体脉络。";
for (const k of allNew) {
  const re = new RegExp('("' + k + '":\\s*"[^"]*?)(")');
  c = c.replace(re, (m, a, b) => a + tail + b);
}
fs.writeFileSync(f, c);
console.log('ok');
