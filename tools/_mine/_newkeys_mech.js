const fs = require('fs');
const allKeys = fs.readFileSync('tools/_mine/keys_mech.txt', 'utf8').trim().split('\n');
const orig = fs.readFileSync('tools/_mine/ids_mechanical.txt', 'utf8').trim().split(/\s+/);
const newKeys = allKeys.filter(k => !orig.includes(k));
console.log('total', allKeys.length, 'orig', orig.length, 'new', newKeys.length);
fs.writeFileSync('tools/_mine/newkeys_mech.txt', newKeys.join('\n'));
