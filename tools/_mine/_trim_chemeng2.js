const fs = require('fs');
const f = 'assets/data/text/chemeng.js';
let c = fs.readFileSync(f, 'utf8');
c = c.replace(/"chemeng-drag-coef":\s*"[^"]*"/, '"chemeng-drag-coef": "曳力系数是描述颗粒与流体相对运动时阻力大小的无量纲数，由雷诺数与颗粒形状决定。它是流化床、气力输送、沉降设备设计的核心参数。层流区曳力系数与雷诺数成反比，湍流区近似常数。"');
fs.writeFileSync(f, c);
console.log('ok');
