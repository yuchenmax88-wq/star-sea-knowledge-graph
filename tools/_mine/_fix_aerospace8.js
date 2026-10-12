const fs = require('fs');
const f = 'assets/data/domains/aerospace.js';
let c = fs.readFileSync(f, 'utf8');
c = c.replace('压气机流量反常振荡，可损坏发动机，要避免。',
              '压气机在某工况下流量与压力沿管路出现反常振荡，可损坏叶片与机匣，要避免。');
// remove bad contrast edges
c = c.replace('    ["aerospace-propeller", "aerospace-jet-engine", "contrast", 3],\n', '');
c = c.replace('    ["aerospace-wings-level", "aerospace-spin", "contrast", 2],\n', '');
c = c.replace('    ["aerospace-subsonic", "aerospace-supersonic", "contrast", 3],\n', '');
c = c.replace('    ["aerospace-ramjet", "aerospace-turbojet", "contrast", 2],\n', '');
// add valid contrast edges
c = c.replace('KG.edges.push(\n',
'KG.edges.push(\n    ["aerospace-propeller", "aerospace-turbojet", "contrast", 3],\n    ["aerospace-subsonic", "aerospace-hypersonic", "contrast", 3],\n    ["aerospace-ramjet", "aerospace-scramjet", "contrast", 2],\n    ["aerospace-turboprop", "aerospace-turbojet", "contrast", 2],\n');
fs.writeFileSync(f, c);
console.log('ok');
