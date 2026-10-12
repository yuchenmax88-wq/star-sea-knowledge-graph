const fs = require('fs');
const f = 'assets/data/domains/aerospace.js';
let c = fs.readFileSync(f, 'utf8');
// remove bad contrast edges
c = c.replace('    ["aerospace-laminar-bl", "aerospace-turbulent-bl", "contrast", 3],\n', '');
c = c.replace('    ["aerospace-normal-shock", "aerospace-oblique-shock", "contrast", 2],\n', '');
c = c.replace('    ["aerospace-canard", "aerospace-t-tail", "contrast", 1],\n', '');
c = c.replace('    ["aerospace-solid-propellant", "aerospace-liquid-ox", "contrast", 2],\n', '');
// expand the two short ones (inspect actual strings)
c = c.replace('压气机在某工况下流量与压力沿管路反常振荡，可损坏叶片与机匣。',
              '压气机在某工况下流量与压力沿管路出现反常振荡，可损坏叶片与机匣。');
c = c.replace('直升机尾部小型旋翼，产生侧向力抵消主旋翼反扭矩。',
              '直升机尾部安装的小型旋翼，产生侧向力抵消主旋翼反扭矩。');
// add new contrast edges that don't exist
c = c.replace('KG.edges.push(\n',
'KG.edges.push(\n    ["aerospace-propeller", "aerospace-jet-engine", "contrast", 3],\n    ["aerospace-wings-level", "aerospace-spin", "contrast", 2],\n    ["aerospace-subsonic", "aerospace-supersonic", "contrast", 3],\n    ["aerospace-ramjet", "aerospace-turbojet", "contrast", 2],\n');
fs.writeFileSync(f, c);
console.log('ok');
