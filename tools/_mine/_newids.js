const fs = require('fs');
const c = fs.readFileSync('assets/data/domains/aerospace.js', 'utf8');
const all = [...c.matchAll(/id:\s*"([a-z0-9-]+)"/g)].map(m => m[1]);
const orig = fs.readFileSync('tools/_mine/ids_aerospace.txt', 'utf8').split(/\s+/).filter(x => x.startsWith('aerospace-') || x.startsWith('aero-'));
const newIds = all.filter(x => !orig.includes(x));
console.log('total', all.length, 'orig', orig.length, 'new', newIds.length);
fs.writeFileSync('tools/_mine/newids_aerospace.txt', newIds.join('\n'));
console.log(newIds.join('\n'));
