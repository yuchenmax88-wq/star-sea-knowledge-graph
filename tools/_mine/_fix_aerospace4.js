const fs = require('fs');
const f = 'tools/_mine/_thicken_aerospace_append2.js';
let c = fs.readFileSync(f, 'utf8');
c = c.replace('    ["aerospace-turboprop", "aero-turboshaft", "prereq", 2],\n', '');
fs.writeFileSync(f, c);
console.log('ok');
