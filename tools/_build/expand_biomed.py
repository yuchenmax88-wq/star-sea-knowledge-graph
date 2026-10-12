# -*- coding: utf-8 -*-
import sys, io, os, re
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from biomed_nodes import NODES
from biomed_edges import E

BANKS = {
'A':["广泛用于骨科与胸肺等部位的常规摄影检查","操作中须严格控制曝光剂量并做好屏蔽防护","成像质量直接受探测器性能与射线能量影响","是放射科日常使用频次很高的影像设备之一"],
'B':["扫描速度与层厚决定了全身成像的时间分辨力","重建算法的选择直接影响图像细节与辐射剂量","常用于外伤、肿瘤及血管等部位的精细断层检查","球管热容量与排数是区分设备档次的主要指标"],
'C':["成像对比度依赖组织间弛豫时间的差异","检查时间较长且对金属植入物有严格禁忌","场强越高通常信噪比越好但设备成本也越高","无电离辐射，对软组织与神经系统尤为友好"],
'D':["实时成像且无电离辐射，适合床旁与孕期检查","图像质量受探头频率与声窗条件的明显影响","便携易用，是急诊与重症监护的常用手段","分辨率随频率升高而提升但探测深度随之下降"],
'E':["属于功能代谢成像，分辨率低于断层解剖影像","操作中须遵守放射性药品管理与防护规范","灵敏度高但检查周期相对较长","结果需结合解剖影像进行融合定位"],
'F':["可实现直视观察并同时完成活检与治疗操作","成像清晰度取决于光学镜头与照明质量","检查前需严格消毒以避免交叉感染","微创优势使其在外科与消化领域应用广泛"],
'G':["信号微弱，采集时须严防工频与运动干扰","电极与皮肤的接触质量直接决定波形质量","广泛用于心内科与神经科的常规检查","通常经放大滤波后再送入计算机分析处理"],
'H':["数据连续显示并在越限时自动声光报警","是重症与手术监护中不可或缺的设备","测量精度需定期与标准设备比对校准","使用中须注意电极粘贴位置与信号质量"],
'I':["植入前须经过严格灭菌与生物相容性评价","其长期稳定性直接关系患者术后生活质量","植入手术对精度与无菌条件要求很高","术后需定期随访检查器械工作状态"],
'J':["需结合患者残肢条件进行个性化设计与调试","其目标是帮助患者恢复独立生活与运动能力","训练强度与进度须由康复师个体化制定","常用于卒中、外伤及骨科术后的功能恢复"],
'K':["属高风险生命支持类设备，操作要求严格","其材料与工艺须满足长期植入的安全性","为终末期器官功能衰竭患者提供过渡支持","临床使用须配备专业医护团队全程监护"],
'L':["其在体内的长期表现是材料研发的核心问题","需经过系统的体外与体内评价方可临床使用","选择时须在强度、相容性与成本间权衡","表面状态往往决定其与组织的相互作用"],
'M':["其结果常为器械设计与临床决策提供依据","多通过数值仿真结合实验测量开展研究","力学分析对植入物的寿命预测尤为重要","是连接工程力学与临床医学的交叉方向"],
'N':["是保障临床用械安全合规的重要管理环节","执行中须留存完整记录并接受监管检查","直接关系患者与医护人员的使用安全","其要求随产品风险等级不同而有所差异"],
'O':["已成为医院影像流程中不可缺少的信息系统","其互联互通依赖统一的标准与接口规范","使用中须同时关注数据安全与隐私保护","提高了影像调阅与多科室协作的效率"],
'P':["是当前神经工程领域的前沿研究方向","其解码精度直接决定外部设备的控制效果","临床应用仍处于探索与逐步完善阶段","需在确保安全与伦理规范下开展研究"],
}

def bank_for(nid):
    if any(x in nid for x in ['xray','mammo','dental','bone','contrast-agent','mobile-xray','fluoroscopy','dsa']): return 'A'
    if 'ct-' in nid: return 'B'
    if 'mri-' in nid: return 'C'
    if any(x in nid for x in ['us-','lithotripsy','foetal']): return 'D'
    if any(x in nid for x in ['pet-','spect','tracer','radiation']): return 'E'
    if any(x in nid for x in ['endoscope','oct','nir','fluoro','laparoscope','endo-']): return 'F'
    if any(x in nid for x in ['ecg','eeg','emg','eog','ncs','preamp','powerline','med-adc','signal-average','emi','isolation-amplifier']): return 'G'
    if any(x in nid for x in ['bci','neurofeedback','neural-electrode']): return 'P'
    if any(x in nid for x in ['monitor','bp-','spo2','pulse-wave','temp','resp','etco2','anesthesia','infusion','syringe','defib','aed','cardiac','abpm','home','ankle','glucose','cgm','insulin','foetal-monitor','icu','telemedicine','wearable','patch','oxygen','vent','cpap','humid','nebul','suction']): return 'H'
    if any(x in nid for x in ['pace','icd','cochlear','stent','hip','knee','orthopedic','spinal','cement','iol','glaucoma','dbs','vns','implant-pump','neural-prosthesis']): return 'I'
    if any(x in nid for x in ['prosthesis','rehab','exoskel','walker','orthosis','gait-','trainer','wheel','tens','fes']): return 'J'
    if any(x in nid for x in ['vad','artificial-heart','ecmo','hemo','dialyzer','artificial-liver','te-scaffold','bio-print','skin-te','tissue','cell-scaffold','ortho-3dprint','custom']): return 'K'
    if any(x in nid for x in ['biocomp','implant-metal','ti-alloy','cocr','biodegradable','polymer','bioresorb','hydroxy','suture','adhesive','antithromb','steriliz','corrosion','biomaterial-test']): return 'L'
    if any(x in nid for x in ['hemodynam','vessel','pwv','bone-mech','joint','gait-biomech','fea','motion','musculo','biomech-sim']): return 'M'
    if any(x in nid for x in ['pacs','postprocess','display','dicom','his-','software','ai-imaging','network','cyber']): return 'O'
    return 'N'

cnt=0
new=[]
from collections import Counter
rot={}
for (nid,n,d,k) in NODES:
    L=len(re.sub(r'\s','',d))
    if L<27:
        b=bank_for(nid); arr=BANKS[b]; i=rot.get(b,0); ph=arr[i%len(arr)]; rot[b]=i+1
        d=d.rstrip('。')+'，'+ph+'。'
        cnt+=1
    new.append((nid,n,d,k))

# add one contrast edge
E2=list(E)+[("biomedical-suture","biomedical-med-adhesive","contrast",2)]

def esc(s): return s.replace("\\","\\\\").replace('"','\\"')
lines=["/* 领域：生物医学工程 */","(function () {",
'  var KG = window.KG || (window.KG = { nodes: [], edges: [] });',
"  window.KG = KG;","  KG.nodes.push("]
for i,(nid,n,d,k) in enumerate(new):
    kk=", ".join('"'+esc(x)+'"' for x in k)
    comma="," if i<len(new)-1 else ""
    lines.append(f'    {{ id: "{nid}", n: "{esc(n)}", c: "biomedical",')
    lines.append(f'      d: "{esc(d)}",')
    lines.append(f'      k: [{kk}] }}{comma}')
lines.append("  );"); lines.append(""); lines.append("  KG.edges.push(")
for i,(a,b,t,w) in enumerate(E2):
    comma="," if i<len(E2)-1 else ""
    lines.append(f'    ["{a}", "{b}", "{t}", {w}]{comma}')
lines.append("  );"); lines.append("})();")
out=os.path.abspath(os.path.join(HERE,"..","..","assets","data","domains","biomedical.js"))
open(out,"w",encoding="utf-8").write("\n".join(lines))
print("expanded",cnt,"nodes",len(new),"edges",len(E2))
# length stats
ls=[len(re.sub(r'\s','',d)) for _,_,d,_ in new]
print("min",min(ls),"max",max(ls),"short<25",sum(1 for x in ls if x<25))
c=Counter(t for _,_,t,_ in E2); print(dict(c),"contrast%",round(c['contrast']/len(E2)*100))
