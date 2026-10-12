# -*- coding: utf-8 -*-
import sys, io, os
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from biomed_nodes import NODES
from biomed_edges import E

def esc(s):
    return s.replace("\\","\\\\").replace('"','\\"')

lines = []
lines.append("/* 领域：生物医学工程 */")
lines.append("(function () {")
lines.append('  var KG = window.KG || (window.KG = { nodes: [], edges: [] });')
lines.append("  window.KG = KG;")
lines.append("  KG.nodes.push(")
for i,(nid,n,d,k) in enumerate(NODES):
    kk = ", ".join('"'+esc(x)+'"' for x in k)
    comma = "," if i < len(NODES)-1 else ""
    lines.append(f'    {{ id: "{nid}", n: "{esc(n)}", c: "biomedical",')
    lines.append(f'      d: "{esc(d)}",')
    lines.append(f'      k: [{kk}] }}{comma}')
lines.append("  );")
lines.append("")
lines.append("  KG.edges.push(")
for i,(a,b,t,w) in enumerate(E):
    comma = "," if i < len(E)-1 else ""
    lines.append(f'    ["{a}", "{b}", "{t}", {w}]{comma}')
lines.append("  );")
lines.append("})();")

out = os.path.join(HERE, "..", "..", "assets", "data", "domains", "biomedical.js")
out = os.path.abspath(out)
with open(out, "w", encoding="utf-8") as f:
    f.write("\n".join(lines))
print("written", out, "nodes", len(NODES), "edges", len(E))

# self checks
ids = set(n[0] for n in NODES)
assert len(ids)==len(NODES), "dup node id"
bad=[]
for i,(a,b,t,w) in enumerate(E):
    if a not in ids: bad.append(f"dangling src {a}")
    if b not in ids: bad.append(f"dangling dst {b}")
    if a==b: bad.append(f"self loop {a}")
pairs=set()
for a,b,t,w in E:
    k=tuple(sorted((a,b)))
    if k in pairs: bad.append(f"dup edge {a} {b}")
    pairs.add(k)
from collections import Counter
c=Counter(t for _,_,t,_ in E)
print("types", dict(c), "E=",len(E))
print("prereq%%", round(c['prereq']/len(E)*100))
for t in ('part','apply','contrast'):
    print(t, round(c[t]/len(E)*100))
print("BAD", bad[:20], "nbad", len(bad))
