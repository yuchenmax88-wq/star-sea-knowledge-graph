const fs = require('fs');
const f = 'assets/data/domains/aerospace.js';
let c = fs.readFileSync(f, 'utf8');
c = c.replace('压气机在某工况下流量与压力反常振荡，可损坏叶片与机匣。',
              '压气机在某工况下流量与压力沿管路反常振荡，可损坏叶片与机匣。');
c = c.replace('直升机尾部小旋翼，产生侧向力抵消主旋翼反扭矩。',
              '直升机尾部小型旋翼，产生侧向力抵消主旋翼反扭矩。');
// add 4 more contrast edges to push ratio
c = c.replace('KG.edges.push(\n',
'KG.edges.push(\n    ["aerospace-laminar-bl", "aerospace-turbulent-bl", "contrast", 3],\n    ["aerospace-normal-shock", "aerospace-oblique-shock", "contrast", 2],\n    ["aerospace-canard", "aerospace-t-tail", "contrast", 1],\n    ["aerospace-solid-propellant", "aerospace-liquid-ox", "contrast", 2],\n');
fs.writeFileSync(f, c);
console.log('ok');
