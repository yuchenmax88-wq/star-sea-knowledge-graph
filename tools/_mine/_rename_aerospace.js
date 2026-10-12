const fs = require('fs');
const f = 'assets/data/domains/aerospace.js';
let c = fs.readFileSync(f, 'utf8');
// rename aero- prefix to aerospace- for newly appended nodes/edges
c = c.replace(/"aero-/g, '"aerospace-');
c = c.replace(/\["aero-/g, '["aerospace-');
fs.writeFileSync(f, c);
console.log('renamed');
