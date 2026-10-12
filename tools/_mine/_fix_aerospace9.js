const fs = require('fs');
const f = 'assets/data/domains/aerospace.js';
let c = fs.readFileSync(f, 'utf8');
c = c.replace('    ["aerospace-ramjet", "aerospace-scramjet", "contrast", 2],\n',
              '    ["aerospace-aerospace-aluminum", "aerospace-titanium", "contrast", 2],\n');
fs.writeFileSync(f, c);
console.log('ok');
