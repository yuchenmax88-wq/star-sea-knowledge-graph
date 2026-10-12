# -*- coding: utf-8 -*-
import sys, io, os, re
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
HERE=os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0,HERE)
from optics_nodes import NODES

B={
'L':[
"激光器是把能量集中成一束方向性好、单色性强的光的装置。它需要增益介质提供光放大、谐振腔提供反馈选模，再由泵浦源把粒子抽到激发态。连续输出追求功率稳定，脉冲输出则靠调Q或锁模把能量压缩到极短时间里换取高峰值功率。光束质量决定这束光能聚焦多小，准直和扩束则改变它的发散程度。不同增益介质对应不同波段和功率档，选型时先看用在什么波长和功率量级。",
"激光加工的本质是用高能光束无接触地烧蚀材料：切割靠熔化吹走，焊接靠局部熔合，打标和雕刻靠表面气化留痕。脉冲激光适合打孔和微加工，连续高功率激光适合厚板切割。调Q和锁模产生的短脉冲热影响区小，做精细加工或清洗时不会损伤周围材料。激光测距靠测往返时间，激光雷达靠扫描出点云，二者都把光速的稳定性变成了测量精度的来源。",
"激光测量把光束当作一把高精度的尺子：干涉测量靠光程差换算位移，准直测量用光束作直线基准，多普勒测速靠散射光的频移。这些都是非接触、高灵敏的手段，不怕电磁干扰，也不磨损被测物。用在医疗上，激光变成手术刀、美容工具和理疗光源，但无论用途都要按波段和等级做好人眼防护，避免直视光束和反射光。"],
'F':[
"光纤通信靠光在玻璃丝里的全反射长距离传信号。单模光纤芯细、只走一个模式，带宽大适合长距离；多模光纤芯粗、模式多，短距离便宜。信号在传输中会衰减和色散，衰减靠光放大器接力补偿，色散靠补偿光纤或数字信号处理抵消。选单模还是多模，本质是在距离、容量和成本之间做权衡。",
"波分复用时在一根光纤里并跑很多不同波长的光，像把公路分成多条车道，容量成倍上去。EDFA和拉曼放大器直接在光域放大，省去光—电—光转换。发射机把电信号调制到光上，接收机再解出来，光模块是二者的可插拔集成。相干通信更进一步，利用相位和偏振编码，在同样的光纤上跑出几倍的速率。",
"工程上光纤要熔接、要活动连接，损耗都很小但累积起来影响中继距离。OTDR沿光纤测损耗分布、找断点，光功率计和寻障笔是施工常备。接入网把光纤铺到用户，海底光缆和抗弯光纤则分别解决跨洋和高密度布线。空分复用按纤芯再开新通道，是下一代扩容方向，和波分复用叠加使用。"],
'I':[
"光纤传感器把被测物理量变成光信号的变化：温度、应变、转动、电流都能测。它抗电磁干扰、本征安全，适合高压电网和易燃易爆环境。光纤布拉格光栅靠反射波长随应变温度偏移来传感，沿整根光纤连续测量就是分布式传感。和电传感器相比，它不怕雷击、不怕潮湿，还能一根线上挂很多测点。",
"光纤陀螺利用萨格纳克效应测转动角速度，是惯性导航的关键器件；光纤电流传感器靠磁光效应测高压线路电流。它们都把光学优势用到了传统电传感器难以胜任的强电磁场合，在电力监测和姿态控制里应用广泛。精度和长期稳定性是这类器件工程化时最受关注的指标。"],
'M':[
"光学成像系统靠镜头组把景物缩小投影到传感器上。显微镜用物镜和目镜两级放大，共聚焦靠针孔逐层扫描拿断层；望远镜靠大口径聚光看远处。相机镜头有变焦和定焦之分：变焦方便取景，定焦像质更好；微距拍小物，远摄拍远处，鱼眼超广角。不同镜头的视角、放大率和畸变特征，要按拍摄目标来选。",
"机器视觉用线阵和面阵相机，远心镜头消除透视误差，工业镜头追求高像质。高光谱成像在拿图像的同时逐点采光谱，红外热像仪和夜视仪把不可见光变成可见画面。整个系统的清晰度由光学传递函数和调制传递函数来定量评价，像差校正是镜头设计的核心，往往靠多片镜片反复折衷。"],
'D':[
"光电探测器把光子变回电子。CCD靠电荷耦合逐行转移，CMOS在像元内直接放大、可随机寻址，速度快、功耗低。雪崩光电二极管和光电倍增管靠内部倍增提高弱光灵敏度，制冷型探测器压低暗噪声。量子效率、暗噪声、动态范围是它的主要指标，决定了它能探测多弱、多快的光。",
"像元大小决定分辨率，快门方式影响运动物体是否拖影，自动曝光根据亮度调节时间和增益。红外探测器分制冷与非制冷两条路线：制冷灵敏但贵，非制冷靠微测辐射热计、便宜但噪声大。这些参数要和镜头、应用场景一起权衡，没有单项最优，只有组合最合适。"],
'O':[
"像差是实际透镜和理想成像的偏差：球差来自边缘光线焦点不一致，彗差和像散影响轴外物点，场曲让像面变弯，畸变改变形状，色差来自不同波长焦距不同。校正它们靠镜片组合、正负透镜配对、非球面和面型优化。实际镜头往往是多种像差互相折衷的结果，而非把某一项压到零。",
"光学设计过去靠光路追迹手工算，现在用软件自动优化。光学玻璃有特定折射率和色散，增透镀膜减少表面反射，光学隔振保证精密系统不受振动干扰。入瞳出瞳、视场光阑、渐晕这些概念描述的是光束如何被孔径限制和分配，是理解成像质量的基础语言。"],
'P':[
"光子集成把多个光学器件做在一块芯片上，像集成电路把晶体管集成起来。硅光平台用成熟的半导体工艺造光波导、调制器和探测器，体积小、功耗低。光调制器把电信号加载到光上，微环谐振器做选频滤波，光频梳给出等间隔的精密频率谱线。设计上要在插损、功耗和带宽之间反复折衷。",
"这类芯片是高速光收发和光计算的基础，把原来分立的光学台架缩小成可量产的部件。它和电子芯片互补：电负责算，光负责传，在数据中心和通信骨干里越来越重要。随着工艺成熟，单位成本下降，光子集成正从少数高端场景走向更广泛的部署。"],
'S':[
"显示技术把电信号变成人眼可见的画面。液晶显示靠液晶分子偏转调制背光，OLED靠有机材料自发光，激光投影用三色激光作光源。微型显示做在小面板上，用于头戴和投影。不同路线在发光原理上的差别，决定了各自的亮度、厚度和功耗特征。",
"评价一块屏看色域、亮度、对比度、刷新率和响应时间。量子点提高色纯度，电子纸反射式、低功耗、像纸一样护眼，柔性屏可弯曲折叠，抬头显示把信息投到前挡玻璃。不同技术在厚度、亮度、功耗和成本上各有取舍，应用场景也因此分化。"],
'R':[
"光谱仪把复色光按波长摊开，看物质吸收或发射了哪些谱线。光栅光谱仪用衍射光栅分光，傅里叶变换光谱仪靠干涉图反演光谱，拉曼和红外分别给出分子振动和结构信息。发射光谱用来做成分分析。分辨率越高，越能把挨得近的两条谱线分开。",
"光谱分辨率决定能不能分清邻近谱线，波长坐标要用标准灯校准。高光谱相机同时拿空间图像和逐像素光谱，是遥感和检测的利器。滤光片轮和单色仪则在需要选窄带光的场合使用，配合探测器就能搭出一套简易的光谱测量链路。"],
'H':[
"全息不只记录光的强度，还记录相位，因此能再现出三维波前。它靠参考光和物光干涉把信息存在记录介质里，再用光照射再现。全息显示让人裸眼看到立体影像，全息存储则把数据高密度地存在体全息里。和普通照片相比，它保留了光的全部信息。",
"全息光栅用干涉曝光制作，比机械刻划性能好；光折变材料在光下折射率可逆变化，是全息记录的常用介质。计算全息用计算机生成干涉图，摆脱了对实物拍摄的依赖。全息干涉计量还能用来测物体的微小形变，把光学精度用到了测量上。"],
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

TAIL={
'L':'把这些部件组合起来，才能得到一束可用、可控、安全的激光。',
'F':'整条链路的每一段损耗，最终都决定了系统能跑多快、多远。',
'I':'它的价值在于把光学的优势带进了传统电测手段难以立足的场合。',
'M':'选镜头和传感器，本质是在分辨率、视场和成本之间做整体权衡。',
'D':'把这些指标配好，探测器才能在合适的场景里发挥最大作用。',
'O':'这些概念串起来，就是一套镜头从设计到装调的完整思路。',
'P':'它让光的传输和处理变得更紧凑、更省电，也更便宜。',
'S':'最终选择哪种屏，取决于亮度、功耗、成本和观看距离的组合。',
'R':'校准到位，仪器给出的数值才可信、可比。',
'H':'它保留了普通照片丢掉的相位，因此多了一个维度的信息。',
}
rot={}; items=[]
for (nid,n,d,k) in NODES:
    b=bank(nid); arr=B[b]; i=rot.get(b,0); para=arr[i%len(arr)]; rot[b]=i+1
    txt=d.rstrip('。')+'。'+para+TAIL[b]
    items.append((nid,txt))

def esc(s): return s.replace("\\","\\\\").replace('"','\\"')
L=["/* 详解 · 光学与光子学 */","(function () {",'  window.KG_TEXT = window.KG_TEXT || {};','  window.KG_TEXT["optics"] = {']
for i,(nid,txt) in enumerate(items):
    comma="," if i<len(items)-1 else ""
    L.append(f'    "{nid}":')
    L.append(f'      "{esc(txt)}"{comma}')
L.append("  };"); L.append("})();")
out=os.path.abspath(os.path.join(HERE,"..","..","assets","data","text","optics.js"))
open(out,"w",encoding="utf-8").write("\n".join(L))
ls=[len(re.sub(r'\s','',t)) for _,t in items]
print("entries",len(items),"min",min(ls),"max",max(ls),"avg",round(sum(ls)/len(ls)))
