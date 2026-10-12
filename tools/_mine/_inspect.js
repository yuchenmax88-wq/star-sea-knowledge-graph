const fs = require('fs');
const c = fs.readFileSync('assets/data/domains/aerospace.js', 'utf8');
const ids = [...c.matchAll(/id:\s*"([a-z0-9-]+)"/g)].map(m => m[1]);
console.log(ids.filter(x => /jet|spin|level|ramjet|turbojet|propeller|subsonic|supersonic|turboprop|turboshaft|turbofan/.test(x)));
const m = c.match(/aerospace-compressor-surge[\s\S]{0,200}/);
console.log(m && m[0]);
