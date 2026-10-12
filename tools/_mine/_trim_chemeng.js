const fs = require('fs');
const f = 'assets/data/text/chemeng.js';
let c = fs.readFileSync(f, 'utf8');
// Trim long entries
c = c.replace(/"chemeng-drag-coef":\s*"[^"]*"/, '"chemeng-drag-coef": "曳力系数是描述颗粒与流体之间相对运动时阻力大小的无量纲数，由雷诺数与颗粒形状决定。它是流化床、气力输送、沉降设备设计的核心参数。层流区曳力系数与雷诺数成反比，湍流区近似常数。设计时通过曳力系数计算终端沉降速度与设备尺寸。"');
c = c.replace(/"chemeng-local-resist":\s*"[^"]*"/, '"chemeng-local-resist": "局部阻力是流体流经管件、阀门、突然扩大或缩小截面时产生的额外压损，用局部阻力系数表示。它是管路水力计算重要组成。突然扩大、弯头、阀门各有经验系数。总阻力为沿程与局部之和。"');
fs.writeFileSync(f, c);
console.log('ok');
