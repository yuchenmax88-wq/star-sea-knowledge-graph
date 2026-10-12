# -*- coding: utf-8 -*-
import sys, io, os, re
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
HERE=os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0,HERE)
from optics_nodes import NODES
from optics_edges import E

ids=set(n[0] for n in NODES)
print("nodes",len(NODES))
seen=set(); dedup=[]
for a,b,t,w in E:
    if a not in ids or b not in ids or a==b: continue
    k=tuple(sorted((a,b)))
    if k in seen: continue
    seen.add(k); dedup.append((a,b,t,w))
from collections import Counter
c=Counter(t for _,_,t,_ in dedup)
print("edges",len(dedup),"types",dict(c))
print("prereq%",round(c['prereq']/len(dedup)*100))
for t in ('part','apply','contrast'):
    print(t,round(c[t]/len(dedup)*100))

