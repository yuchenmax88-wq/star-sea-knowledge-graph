const fs = require('fs');
const dom = process.argv[2];
const files = process.argv.slice(3);
const sb = { window: {} };
files.forEach(f => new Function('window','console',fs.readFileSync(f,'utf8'))(sb.window,{warn(){},log(){},error(){}}));
const KG = sb.window.KG;
const ids = new Set(); const dups = [];
KG.nodes.forEach(n => { if (ids.has(n.id)) dups.push(n.id); ids.add(n.id); });
console.log('nodes', KG.nodes.length, 'dups', dups);
const seen = new Set(); let dangling = 0;
KG.edges.forEach(e => {
  const [a,b] = e;
  if (!ids.has(a) || !ids.has(b)) { dangling++; if (dangling<10) console.log('DANGLING', e); }
  const k = a<b ? a+'|'+b : b+'|'+a;
  if (seen.has(k)) console.log('DUP', e);
  seen.add(k);
});
const deg = {}; ids.forEach(i => deg[i]=0);
KG.edges.forEach(e => { deg[e[0]]++; deg[e[1]]++; });
const orph = [...ids].filter(i => deg[i]===0);
console.log('edges', KG.edges.length, 'dangling', dangling, 'orphans', orph.length, orph.slice(0,8));
const t = {}; KG.edges.forEach(e => t[e[2]]=(t[e[2]]||0)+1);
console.log('types', JSON.stringify(t));
