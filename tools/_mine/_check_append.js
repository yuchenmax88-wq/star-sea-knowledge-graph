// Loads existing domain + append, counts nodes/edges, checks for dangling/orphan/duplicate
const fs = require('fs');
const dom = process.argv[2];
const appendFile = process.argv[3];
const existing = fs.readFileSync(`assets/data/domains/${dom}.js`, 'utf8');
const append = fs.readFileSync(appendFile, 'utf8');
const sb = { window: {} };
try {
  new Function('window', 'console', existing)(sb.window, {warn(){},log(){},error(){}});
  new Function('window', 'console', append)(sb.window, {warn(){},log(){},error(){}});
} catch(e) { console.log('SYNTAX ERR:', e.message); process.exit(1); }
const KG = sb.window.KG;
const ids = new Set();
const dups = [];
KG.nodes.forEach(n => { if (ids.has(n.id)) dups.push(n.id); ids.add(n.id); });
console.log('total nodes', KG.nodes.length, 'dups', dups.length, dups.slice(0,5));
const seen = new Set();
let dangling = 0;
KG.edges.forEach(e => {
  const [a,b] = e;
  if (!ids.has(a) || !ids.has(b)) { dangling++; if (dangling<10) console.log('DANGLING', e); }
  const k = a<b ? a+'|'+b : b+'|'+a;
  if (seen.has(k)) console.log('DUP EDGE', e);
  seen.add(k);
});
console.log('total edges', KG.edges.length, 'dangling', dangling);
const deg = {}; ids.forEach(i=>deg[i]=0);
KG.edges.forEach(e=>{deg[e[0]]++;deg[e[1]]++;});
const orph = [...ids].filter(i=>deg[i]===0);
console.log('orphans', orph.length, orph.slice(0,10));
const type = {};
KG.edges.forEach(e=>type[e[2]]=(type[e[2]]||0)+1);
console.log('types', JSON.stringify(type));
