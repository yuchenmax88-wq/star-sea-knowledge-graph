const fs = require('fs');
const f = 'tools/_mine/_thicken_aerospace_append2.js';
let c = fs.readFileSync(f, 'utf8');
c = c.replace('["aerospace-turboshaft", "aero-pitch-rotor", "prereq", 2],',
              '["aerospace-turboprop", "aero-pitch-rotor", "related", 1],');
c = c.replace('    ["aero-compressor-surge", "aero-stall-compressor", "related", 3],\n', '');
c = c.replace('    ["aero-regenerative", "aerospace-rocket", "apply", 3],\n', '');
c = c.replace('    ["aero-nacelle", "aerospace-turbofan", "apply", 3],\n', '');
c = c.replace('    ["aero-tiltrotor", "aerospace-uav", "apply", 1],\n', '');
fs.writeFileSync(f, c);
console.log('ok');
