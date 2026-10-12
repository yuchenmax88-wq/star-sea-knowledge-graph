# -*- coding: utf-8 -*-
import sys, io, os, re
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
HERE=os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0,HERE)
from optics_nodes import NODES
from optics_edges import E

ids=set(n[0] for n in NODES)
seen=set(); dedup=[]
for a,b,t,w in E:
    if a not in ids or b not in ids or a==b: continue
    k=tuple(sorted((a,b)))
    if k in seen: continue
    seen.add(k); dedup.append((a,b,t,w))

def esc(s): return s.replace("\\","\\\\").replace('"','\\"')
lines=["/* 领域：光学与光子学 */","(function () {",
'  var KG = window.KG || (window.KG = { nodes: [], edges: [] });',
"  window.KG = KG;","  KG.nodes.push("]
for i,(nid,n,d,k) in enumerate(NODES):
    kk=", ".join('"'+esc(x)+'"' for x in k)
    comma="," if i<len(NODES)-1 else ""
    lines.append(f'    {{ id: "{nid}", n: "{esc(n)}", c: "optics",')
    lines.append(f'      d: "{esc(d)}",')
    lines.append(f'      k: [{kk}] }}{comma}')
lines.append("  );"); lines.append(""); lines.append("  KG.edges.push(")
for i,(a,b,t,w) in enumerate(dedup):
    comma="," if i<len(dedup)-1 else ""
    lines.append(f'    ["{a}", "{b}", "{t}", {w}]{comma}')
lines.append("  );"); lines.append("})();")
out=os.path.abspath(os.path.join(HERE,"..","..","assets","data","domains","optics.js"))
open(out,"w",encoding="utf-8").write("\n".join(lines))
print("written",out,"nodes",len(NODES),"edges",len(dedup))
ls=[len(re.sub(r'\s','',d)) for _,_,d,_ in NODES]
print("d min",min(ls),"max",max(ls),"short<25",sum(1 for x in ls if x<25))
