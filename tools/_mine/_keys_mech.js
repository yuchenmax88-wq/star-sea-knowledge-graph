const fs = require('fs');
const c = fs.readFileSync('assets/data/text/mechanical.js', 'utf8');
const keys = [...c.matchAll(/"([a-z0-9-]+)":\s*"/g)].map(m => m[1]);
console.log(keys.length);
fs.writeFileSync('tools/_mine/keys_mech.txt', keys.join('\n'));
