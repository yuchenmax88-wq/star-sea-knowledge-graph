const fs = require('fs');
const f = 'tools/_mine/_thicken_aerospace_append2.js';
let c = fs.readFileSync(f, 'utf8');
// remove remaining dup
c = c.replace('    ["aero-tiltrotor", "aerospace-uav", "related", 1],\n', '');
// add edges for orphan aero-turboprop
c = c.replace('KG.edges.push(\n',
'KG.edges.push(\n    ["aerospace-turboprop", "aero-turboshaft", "prereq", 2],\n    ["aero-epicyclic", "aero-turboprop", "apply", 2],\n');
fs.writeFileSync(f, c);
console.log('ok');
