const fs = require('fs');
const dom = process.argv[2];
const appendFile = process.argv[3];
const existingT = fs.readFileSync(`assets/data/text/${dom}.js`, 'utf8');
const existingD = fs.readFileSync(`assets/data/domains/${dom}.js`, 'utf8');
const append = fs.readFileSync(appendFile, 'utf8');
const sb = { window: {} };
new Function('window','console',existingT)(sb.window,{});
new Function('window','console',existingD)(sb.window,{});
new Function('window','console',append)(sb.window,{});
const dict = sb.window.KG_TEXT[dom];
const existingIds = new Set();
// load existing ids before append
const sb2 = {window:{}};
new Function('window','console',existingD)(sb2.window,{});
// we can't easily split; just print all keys with lengths < 150
const arr = Object.entries(dict).map(([k,v])=>[k, String(v).replace(/\s/g,'').length]);
const short = arr.filter(([k,L])=>L<150).sort((a,b)=>a[1]-b[1]);
console.log('total keys', arr.length, 'avg', Math.round(arr.reduce((s,[,L])=>s+L,0)/arr.length));
console.log('short count (<150)', short.length);
short.forEach(([k,L])=>console.log(L, k));
