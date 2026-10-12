const fs = require('fs');
// practice
let p = fs.readFileSync('assets/data/domains/practice.js', 'utf8');
p = p.replace('    ["practice-ci", "practice-cd", "prereq", 2],\n', '');
p = p.replace('    ["practice-cd", "practice-canary", "part", 2],\n', '');
fs.writeFileSync('assets/data/domains/practice.js', p);
// civil
let c = fs.readFileSync('assets/data/domains/civil.js', 'utf8');
c = c.replace('    ["civil-construction-org", "civil-flow-construction", "prereq", 2],\n', '');
c = c.replace('    ["civil-flow-construction", "civil-network-plan", "prereq", 2],\n', '');
fs.writeFileSync('assets/data/domains/civil.js', c);
// chemeng
let h = fs.readFileSync('assets/data/domains/chemeng.js', 'utf8');
h = h.replace('    ["chemeng-comminution", "chemeng-screening", "prereq", 2],\n', '');
fs.writeFileSync('assets/data/domains/chemeng.js', h);
console.log('ok');
