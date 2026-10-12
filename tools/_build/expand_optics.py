# -*- coding: utf-8 -*-
import sys, io, os, re
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
HERE=os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0,HERE)
from optics_nodes import NODES
from optics_edges import E

BANKS={
'L':["广泛用于工业加工与科研领域","其光束质量决定了后续应用效果","使用中须配合光束整形与安全防护","输出特性直接影响加工与测量精度"],
'F':["是现代通信网络的物理传输基础","其损耗与色散决定传输距离与容量","在城域与干线网络中大量部署","工程中须考虑接续与布线损耗"],
'I':["以光学手段感知外界物理量","抗电磁干扰、适合恶劣电磁环境","沿光纤可实现分布式连续测量","在电力与结构监测中应用广泛"],
'M':["是光学成像的核心精密仪器","其分辨率由镜头与探测器共同决定","广泛用于科研与工业检测","使用中需注意照明与像差平衡"],
'D':["把光信号转换为可处理的电信号","其灵敏度与噪声决定弱光探测能力","广泛用于成像与光谱系统","制冷可进一步压低暗噪声"],
'O':["通过镜片组合校正成像缺陷","是镜头设计的核心优化对象","直接决定成像清晰度与像质","现代设计多借助软件自动优化"],
'P':["把多种光子功能集成在芯片上","是光电子集成化的发展方向","具有体积小功耗低的特点","面向高速通信与传感应用"],
'S':["靠电光或自发光实现画面显示","其色域与亮度决定观看体验","广泛用于消费电子与工程投影","技术路线仍在不断演进"],
'R':["把复色光按波长分解测量","是成分分析的重要手段","其分辨率决定谱线分辨能力","需用标准光源定期校准波长"],
'H':["记录并再现物光波前","实现三维影像的记录与重现","在显示与存储领域有独特价值","依赖相干光源与记录介质"],
}
def bank(nid):
    if any(x in nid for x in ['laser','qswitch','modelock','resonator','gain','pump','wavelength','beam','collimation','expander','power','frequency-doubling','single-frequency','ecdl','marking','ranging','lidar','vibrometer','doppler','cleaning','annealing','microfabrication','cutting-head','welding-head','point-cloud','interferometer','protec']): return 'L'
    if any(x in nid for x in ['fiber','wdm','optical-amplifier','edfa','raman-amp','transmitter','receiver','module','patchcord','connector','splicing','splitter','awg','switch','coherent','otdr','ftth','patchpanel','power-meter','trace','isolator','circulator','cm-module','submarine','bend','space-division','silicon-module','fusion','digital-coherent']): return 'F'
    if any(x in nid for x in ['sensor','fbg','gyro','current','temp-sensor','strain','distributed']): return 'I'
    if any(x in nid for x in ['microscope','telescope','camera','lens','projection','endoscope-optics','spectral','hyperspectral','infrared-camera','night','stereo','surgical','line-scan','area-scan','telecentric','industrial','zoom-extender','filter','beam-splitter','hspeed','uv-imaging','thermometer','objective','eyepiece','body']): return 'M'
    if any(x in nid for x in ['ccd','cmos','apd','pmt','detector','focal-plane','photodiode','quantum','dark','dynamic','shutter','pixel','cooled','uncooled','swir','auto-exposure','compare','application']): return 'D'
    if any(x in nid for x in ['aberr','coma','astig','field-curv','distortion','chromatic','lens-group','aspheric','diffractive','otf','mtf','achromatic','antireflection','isolation','ray-tracing','optical-glass','focal-power','pupil','field-stop','vignetting','design-software','correction','coating']): return 'O'
    if any(x in nid for x in ['photonic','silicon-photonics','modulator','eam','microresonator','waveguide','planar','photonic-crystal','frequency-comb','silicon-transceiver','modulator-app','microresonator-app','comb-app']): return 'P'
    if any(x in nid for x in ['lcd','oled','laser-projection','microdisplay','backlight','color-gamut','luminance','qd-','e-paper','refresh','response','contrast','dimming','polarizer','flexible','hud','lcd-app','oled-app','proj-app','epaper-app','qd-app','flexible-app']): return 'S'
    if any(x in nid for x in ['spectrometer','grating-spectrometer','ftir','raman','ir-spectrometer','emission','resolution','calibration','absorption','monochromator','filter-wheel','raman-probe','reference','spectrometer-app','raman-app','ir-spectrometer-app']): return 'R'
    return 'H'

rot={}
new=[]
for (nid,n,d,k) in NODES:
    L=len(re.sub(r'\s','',d))
    if L<30:
        b=bank(nid); arr=BANKS[b]; i=rot.get(b,0); ph=arr[i%len(arr)]; rot[b]=i+1
        d=d.rstrip('。')+'，'+ph+'。'
    new.append((nid,n,d,k))

# connect orphan optical-switch
E2=list(E)+[("optics-optical-switch","optics-optical-module","related",2),("optics-optical-switch","optics-otdr","related",1)]

def esc(s): return s.replace("\\","\\\\").replace('"','\\"')
lines=["/* 领域：光学与光子学 */","(function () {",
'  var KG = window.KG || (window.KG = { nodes: [], edges: [] });',
"  window.KG = KG;","  KG.nodes.push("]
for i,(nid,n,d,k) in enumerate(new):
    kk=", ".join('"'+esc(x)+'"' for x in k)
    comma="," if i<len(new)-1 else ""
    lines.append(f'    {{ id: "{nid}", n: "{esc(n)}", c: "optics",')
    lines.append(f'      d: "{esc(d)}",')
    lines.append(f'      k: [{kk}] }}{comma}')
lines.append("  );"); lines.append(""); lines.append("  KG.edges.push(")
ids=set(x[0] for x in new); seen=set(); dd=[]
for a,b,t,w in E2:
    if a not in ids or b not in ids or a==b: continue
    k=tuple(sorted((a,b)))
    if k in seen: continue
    seen.add(k); dd.append((a,b,t,w))
for i,(a,b,t,w) in enumerate(dd):
    comma="," if i<len(dd)-1 else ""
    lines.append(f'    ["{a}", "{b}", "{t}", {w}]{comma}')
lines.append("  );"); lines.append("})();")
out=os.path.abspath(os.path.join(HERE,"..","..","assets","data","domains","optics.js"))
open(out,"w",encoding="utf-8").write("\n".join(lines))
ls=[len(re.sub(r'\s','',d)) for _,_,d,_ in new]
print("nodes",len(new),"edges",len(dd),"d min",min(ls),"short<25",sum(1 for x in ls if x<25))
