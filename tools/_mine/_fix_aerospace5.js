const fs = require('fs');
const f = 'assets/data/domains/aerospace.js';
let c = fs.readFileSync(f, 'utf8');
// Remove duplicate turboprop node (it already existed as original)
c = c.replace(/    \{ id: "aerospace-turboprop", n: "涡桨发动机", c: "aerospace",\n      d: "燃气涡轮驱动螺旋桨的发动机，兼顾喷气速度与螺旋桨效率，用于支线飞机。",\n      k: \["涡桨", "螺旋桨", "支线", "燃气涡轮"\] \},\n/, '');
// Remove duplicate edge
c = c.replace('    ["aerospace-epicyclic", "aerospace-turboprop", "apply", 2],\n', '');
// Expand remaining short
const repl = [
['椭圆轨道上离地心最近的点，也是轨道速度最大点。','椭圆轨道上离地心最近的点，也是轨道速度最大点，对应近地点高度。'],
['椭圆轨道上离地心最远的点，也是轨道速度最小点。','椭圆轨道上离地心最远的点，也是轨道速度最小点，对应远地点高度。'],
['包裹发动机的流线型短舱壳体，含进气道与排气喷管。','包裹发动机的流线型短舱壳体，含进气道、风扇罩与排气喷管。'],
['把发动机吊挂在机翼或机身下方的结构连接件。','把发动机吊挂在机翼或机身下方的结构连接件，传力并隔振。'],
['小涵道比涡扇发动机，加力推力大，用于军用战斗机。','小涵道比涡扇发动机，加力推力大、单位推力高，用于军用战斗机。'],
['压气机在某工况下流量与压力反常振荡，可损坏发动机。','压气机在某工况下流量与压力反常振荡，可损坏叶片与机匣。'],
['压气机叶片表面气流分离、级压比骤降，是喘振前兆。','压气机叶片表面气流分离、级压比骤降，是喘振发生的前兆。'],
['直升机旋翼旋转扫过的圆盘面积，是升力产生区域。','直升机旋翼旋转扫过的圆盘面积，是升力主要产生区域。'],
['直升机尾部小旋翼，产生侧向力抵消主桨反扭矩。','直升机尾部小旋翼，产生侧向力抵消主旋翼反扭矩。']
];
for (const [a, b] of repl) c = c.replace(a, b);
fs.writeFileSync(f, c);
console.log('ok');
