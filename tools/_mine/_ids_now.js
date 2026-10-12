const fs = require('fs');
for (const d of ['practice', 'civil', 'chemeng']) {
  const c = fs.readFileSync(`assets/data/domains/${d}.js`, 'utf8');
  const ids = [...c.matchAll(/id:\s*"([a-z0-9-]+)"/g)].map(m => m[1]);
  console.log(d, 'total', ids.length);
  fs.writeFileSync(`tools/_mine/ids_${d}_now.txt`, ids.join('\n'));
}
