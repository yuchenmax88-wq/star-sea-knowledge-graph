// Check text append: load existing text + append, count keys, check lengths
const fs = require('fs');
const dom = process.argv[2];
const appendFile = process.argv[3];
const existingT = fs.readFileSync(`assets/data/text/${dom}.js`, 'utf8');
const existingD = fs.readFileSync(`assets/data/domains/${dom}.js`, 'utf8');
const append = fs.readFileSync(appendFile, 'utf8');
const sb = { window: {} };
new Function('window','console',existingT)(sb.window,{});
new Function('window','console',existingD)(sb.window,{});
try { new Function('window','console',append)(sb.window,{}); } catch(e){ console.log('SYNTAX ERR:',e.message); process.exit(1); }
const dict = sb.window.KG_TEXT[dom];
const ids = sb.window.KG.nodes.map(n=>n.id);
const keys = Object.keys(dict);
console.log('ids', ids.length, 'keys', keys.length);
const missing = ids.filter(i=>!dict[i]);
const extra = keys.filter(k=>!ids.includes(k));
console.log('missing', missing.length, missing.slice(0,10));
console.log('extra', extra.length, extra.slice(0,10));
let total=0, short=0, long=0;
keys.forEach(k=>{const L=String(dict[k]||'').replace(/\s/g,'').length;total+=L;if(L<90){short++;if(short<5)console.log('SHORT',k,L);}if(L>400){long++;if(long<5)console.log('LONG',k,L);}});
console.log('avg', Math.round(total/keys.length), 'short', short, 'long', long);
