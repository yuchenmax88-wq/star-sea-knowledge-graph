const fs = require('fs');
const f = 'assets/data/text/aerospace.js';
let c = fs.readFileSync(f, 'utf8');
// Add a final short tail to every new node to push avg up
const allNew = require('fs').readFileSync('tools/_mine/newids_aerospace.txt', 'utf8').trim().split('\n');
const tail = "它在工程实践中与相邻概念配合，共同构成航天航空知识体系的一环。";
for (const k of allNew) {
  const re = new RegExp('("' + k + '":\\s*"[^"]*?)(")');
  c = c.replace(re, (m, a, b) => a + tail + b);
}
fs.writeFileSync(f, c);
console.log('final tail');
