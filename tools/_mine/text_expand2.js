/* 文本扩写 v2：按关键词追加实质内容 */
const fs = require("fs");
const path = require("path");
const ROOT = path.resolve(__dirname, "..", "..");

// 关键词规则：命中则追加对应句子
const rules = {
  medicine: [
    [/利尿|diuretic/, "用药期间需监测出入量与电解质平衡，警惕耳毒性与高尿酸血症等不良反应。"],
    [/降压|hypertension|antihypertensive/, "降压目标需根据患者合并症个体化制定，避免血压骤降导致器官灌注不足。"],
    [/感染|antibiotic|抗菌|抗生素/, "抗菌药物使用应遵循药敏结果与分级管理原则，防止耐药菌产生与二重感染。"],
    [/糖尿病|diabetes|insulin|胰岛素/, "血糖控制需兼顾空腹与餐后指标，定期评估糖化血红蛋白与并发症筛查。"],
    [/心血管|cardiac|heart|心衰|myocardial|心肌|心绞痛/, "治疗需改善心肌重构与预后，同时控制心率、血压与血脂等危险因素。"],
    [/肿瘤|cancer|tumor|化疗|放疗|chemotherapy/, "抗肿瘤治疗需评估患者体能状态与脏器功能，平衡疗效与不良反应。"],
    [/神经|neurolog|stroke|卒中|癫痫|epilep|Parkinson|帕金森/, "神经科用药需监测血药浓度与中枢不良反应，定期评估神经功能缺损。"],
    [/免疫|immune|immunosuppress/, "免疫抑制治疗需平衡感染风险与自身免疫控制，定期监测血常规与肝肾功能。"],
    [/激素|hormone|steroid|糖皮质/, "糖皮质激素使用需逐步减量，防止肾上腺皮质功能不全与反跳现象。"],
    [/呼吸|respiratory|asthma|哮喘|COPD|肺/, "呼吸治疗需评估肺功能与动脉血气，结合吸入装置技术与患者依从性。"],
    [/消化|digest|gastric|肝|hepatic|肠|intestinal/, "消化治疗需关注黏膜保护与屏障功能，避免刺激性饮食与药物相互作用。"],
    [/肾|renal|dialysis|透析/, "肾脏替代治疗需评估透析充分性与残余肾功能，管理贫血与骨代谢并发症。"],
    [/血液|blood|hematolog|anemia|贫血|凝血|coagul/, "血液治疗需监测凝血指标与出血风险，输血需严格掌握适应证。"],
    [/骨科|orthopedic|fracture|骨折|bone|骨/, "骨科治疗需兼顾固定稳定性与早期功能锻炼，预防深静脉血栓与关节僵硬。"],
    [/儿科|pediatric|child|infant|婴儿/, "儿科用药剂量按体重或体表面积计算，注意生长发育与药物对儿童的特殊影响。"],
    [/老年|geriatric|elderly/, "老年患者多重用药需审查药物相互作用，遵循小剂量起始缓慢滴定原则。"],
    [/急救|emergency|resuscitat|复苏|trauma|创伤/, "急救处理遵循ABCDE流程，迅速识别危及生命的情况并优先处理。"],
    [/手术|surg|anesthesia|麻醉/, "围手术期管理需评估麻醉风险与心肺储备，术后镇痛与早期活动促进康复。"],
    [/影像|imaging|MRI|CT|X.?ray|超声/, "影像诊断需结合临床体征与实验室检查，避免过度检查与辐射暴露。"],
    [/诊断|diagnos|screening|筛查/, "诊断方法需评估其灵敏度与特异度，金标准参照下减少假阳性与假阴性。"],
    [/护理|nurs|care/, "护理干预需评估患者自理能力与教育需求，落实个体化护理计划与健康指导。"],
    [/康复|rehab/, "康复治疗需分期进行，从被动活动到主动训练逐步递进，定期评定功能进展。"],
    [/预防|prevent|vaccin|疫苗/, "预防措施需建立三级预防体系，疫苗接种注意禁忌证与不良反应监测。"],
    [/营养|nutrition|diet/, "营养支持需评估营养风险，逐步过渡饮食，监测白蛋白与电解质变化。"]
  ],
  market: [
    [/辅助服务|ancillary|reserve|备用/, "辅助服务与能量市场联合出清，其价格信号反映系统安全裕度的稀缺程度。"],
    [/容量|capacity/, "容量市场机制通过长期合同激励发电投资，确保系统在高峰负荷期有足够充裕度。"],
    [/需求侧|demand|响应|DR/, "需求响应通过价格信号或激励机制引导用户削峰填谷，降低系统备用压力。"],
    [/新能源|renewable|wind|solar|光伏|风电/, "间歇性新能源接入需配置储能与灵活调节资源，爬坡事件是系统调度的重点难点。"],
    [/储能|storage|battery/, "储能技术通过充放电平移负荷，其循环效率与寿命影响经济性与市场价值。"],
    [/输电|transmission|congestion|阻塞/, "输电阻塞管理通过节点边际电价 locational marginal price 反映电网空间约束。"],
    [/配电|distribution/, "配电网市场化改革推进分布式电源直接交易，需平衡网络安全与用户选择权。"],
    [/结算|settlement|清算/, "市场结算依据实际计量数据与出清结果分离执行，偏差考核引导市场主体履约。"],
    [/竞价|bidding|auction|拍卖/, "竞价规则设计影响市场力行使，报价曲线分段与申报容量约束是关键参数。"],
    [/价格|price|tariff|电价/, "电价形成机制需兼顾成本回收与用户承受力，交叉补贴与电价交叉补贴是改革难点。"],
    [/批发市场|wholesale/, "批发市场层级包括日前、实时与中长期市场，跨期价格耦合影响市场效率。"],
    [/零售|retail/, "零售市场竞争允许用户选择售电商，零售套餐设计需透明披露与公平比较。"],
    [/监管|regulat/, "市场监管需识别市场力行使与串谋行为，价格上限与信息披露是主要工具。"],
    [/电力市场|electricity|power market/, "电力市场设计需兼顾经济性与可靠性，稀缺定价与稀缺补偿反映真实成本。"],
    [/碳|carbon|emission|排放/, "碳市场与电力市场耦合形成电-碳价格传导，碳价内部化排放环境成本。"],
    [/需求|load|负荷/, "负荷预测精度直接影响出清结果，短中长期预测采用不同方法与数据源。"],
    [/并网|grid.?connection|connect/, "并网技术标准要求电压穿越与频率响应能力，保障电网安全稳定运行。"],
    [/虚拟电厂|VPP|virtual/, "虚拟电厂聚合分布式资源参与市场，通信与控制技术是其可调度性的基础。"],
    [/辅助/, "辅助服务市场品种包括调频、备用与黑启动，其定价与补偿机制影响资源调用积极性。"],
    [/用户|consumer|customer/, "用户侧参与市场需智能电表与实时通信支持，分时电价引导用户行为调整。"]
  ],
  law: [
    [/合同|contract|offer|acceptance|要约|承诺/, "合同成立后当事人应按约定全面履行，违约救济包括继续履行、赔偿损失与解除合同。"],
    [/侵权|tort|negligence|strict/, "侵权责任构成需具备违法行为、损害事实、因果关系与过错四要件。"],
    [/婚姻|marriage|divorce|离婚|family/, "婚姻家庭纠纷调解优先，财产分割与子女抚养以照顾无过错方与子女权益为原则。"],
    [/继承|inheritance|will|遗嘱/, "继承纠纷需先认定遗产范围与效力，遗嘱形式要件欠缺可能导致法定继承适用。"],
    [/犯罪|crime|criminal|刑法/, "犯罪构成要件包括客观危害行为与主观罪过，正当防卫与紧急避险是法定阻却事由。"],
    [/刑罚|punishment|sentencing|量刑/, "量刑需综合考虑犯罪事实、性质、情节与社会危害程度，累犯与自首是法定情节。"],
    [/诉讼|litigation|procedure|judicial/, "诉讼程序遵循两审终审制，举证责任分配直接影响裁判结果与当事人权益。"],
    [/证据|evidence|proof|举证/, "证据需经查证属实才能作为定案根据，非法证据排除规则保障程序正义。"],
    [/仲裁|arbitration/, "仲裁实行一裁终局，仲裁协议排除法院管辖，裁决可向法院申请强制执行。"],
    [/公司|company|corporate|shareholder|股东/, "公司治理需平衡股东、董事与债权人利益，法人人格否认是有限责任的例外。"],
    [/证券|securities|stocks|内幕|insider/, "证券市场信息披露要求真实准确完整，内幕交易与操纵市场破坏市场公平。"],
    [/竞争|competition|antitrust|垄断|monopoly/, "反垄断执法关注相关市场界定与竞争效果，宽大制度鼓励垄断协议参与者自首。"],
    [/消费者|consumer/, "消费者权益保护实行举证责任倒置与惩罚性赔偿，公益诉讼制度保护不特定多数人。"],
    [/劳动|labor|employment|工伤|wage/, "劳动争议仲裁前置，经济补偿按工作年限计算，竞业限制需支付合理补偿。"],
    [/税|tax/, "税收法定原则要求税种与要素由法律规定，税务争议需先缴清税款或提供担保。"],
    [/保险|insurance/, "保险利益原则防止道德风险，代位求偿权保障保险人追偿权。"],
    [/宪法|constitution|constitutional/, "宪法基本权利具有第三人效力，普通法律不得与宪法相抵触。"],
    [/行政|admin|administrative/, "行政诉讼审查行政行为合法性，合理性审查限于行政处罚显失公正等情形。"],
    [/国际法|international|treaty|diplomatic/, "条约解释参照维也纳条约法公约，善意履行条约是国家主权平等的体现。"],
    [/知识产权|intellectual|copyright|patent|trademark|专利|商标|著作/, "知识产权保护有法定期间，合理使用与强制许可平衡权利人利益与公共利益。"],
    [/律师|lawyer|judge|legal profession/, "法律职业伦理要求独立公正，律师保密义务与真实义务冲突时优先保护委托人。"],
    [/宪法权利|right|freedom|自由/, "基本权利限制需符合法律保留与比例原则，紧急状态下克减不得违反核心保障。"],
    [/效力|validity|effect/, "法律行为效力评价包括有效、无效、可撤销与效力待定，区分标准在于瑕疵性质。"],
    [/管辖|jurisdiction/, "管辖恒定原则确定案件时不因行政区域变更而改变，协议管辖不得违反专属规定。"]
  ],
  sociology: [
    [/功能|functional|function/, "功能分析强调社会制度对维持整体秩序的贡献，同时需识别反功能与潜在功能。"],
    [/冲突|conflict/, "冲突论关注权力与资源分配的不平等，冲突既可能破坏秩序也可能推动社会变迁。"],
    [/符号|symbolic|interaction|互动/, "符号互动论强调日常互动中意义的协商与建构，身份在表演与互动中不断形成。"],
    [/社会化|socialization/, "社会化贯穿人的一生，初级群体与次级群体在不同阶段承担不同功能。"],
    [/角色|role|status|地位/, "角色集与地位丛的矛盾是现代个体压力的来源，角色距离反映个体与角色的疏离。"],
    [/群体|group|organization|组织/, "正式组织以效率为目标，但非正式群体对成员满意度与生产率有重要影响。"],
    [/分层|stratification|class|阶级|阶层/, "社会分层通过代际传递再生产不平等，教育与市场能力是流动的主要机制。"],
    [/流动|mobility|mobility/, "社会流动率受经济结构、教育扩张与政策制度多重影响，结构性流动是现代化标志。"],
    [/越轨|deviance|deviant|crime|犯罪/, "越轨的定义具有相对性，贴标签过程使初级越轨转化为次级越轨生涯。"],
    [/家庭|family|marriage|婚姻|divorce|离婚/, "家庭形态变迁与工业化城市化相关，情感功能取代经济功能成为核心。"],
    [/性别|gender|patriarchy|父权|sexism/, "性别分工通过社会化与制度安排再生产不平等，同工同酬是立法目标。"],
    [/教育|education|school|credential/, "教育扩张导致文凭贬值，学校既传授知识也再生产阶级文化与惯习。"],
    [/宗教|religion|sacred|secular/, "宗教既是社会整合的源泉也是冲突的根源，世俗化不等于宗教消失而是私人化。"],
    [/城市|urban|urbanization|rural|乡村/, "城市化伴随社会关系从礼俗向法理转变，郊区化与内城衰退是空间不平等的表现。"],
    [/劳动|labor|work|aliienation|异化/, "劳动过程控制与无产阶级化是工作社会学核心议题，弹性劳动改变了雇佣关系。"],
    [/变迁|change|modernization|现代化|globalization|全球化/, "社会变迁由技术、经济与观念多重驱动，全球化带来同质化与本土化的张力。"],
    [/运动|movement|collective|集体/, "社会运动的兴起依赖政治机会结构与组织资源，框架建构是动员的关键环节。"],
    [/种族|race|ethnic|racism|歧视|prejudice/, "种族是社会建构而非生物范畴，制度性歧视比个体偏见更难消除。"],
    [/人口|population|birth|death|migration|迁移/, "人口转变理论描述从高出生高死亡到低出生低死亡的过程，老龄化是当前主要趋势。"],
    [/方法|method|research|survey|ethnography|qualitative|quantitative/, "研究设计需在代表性与深度之间权衡，三角验证提高结论可靠性。"],
    [/权力|power|authority|权威/, "权威类型随传统向现代转变而理性化，卡里斯马权威例行化是组织稳定的前提。"],
    [/贫困|poverty|underclass|welfare/, "贫困文化与结构解释存在争论，福利制度设计影响贫困者的劳动参与动机。"],
    [/污名|stigma/, "污名管理策略包括掩饰、解离与挑战，标签理论解释了污名与越轨的相互强化。"]
  ]
};

function expandDomain(dom) {
  const f = path.join(ROOT, "assets/data/text", dom + ".js");
  const sb = { window: {} };
  new Function("window", fs.readFileSync(f, "utf8"))(sb.window);
  const texts = sb.window.KG_TEXT[dom];
  const domRules = rules[dom] || [];

  let padded = 0;
  for (const [k, v] of Object.entries(texts)) {
    const len = v.replace(/\s/g, "").length;
    if (len >= 160) continue;
    // 找第一个匹配的规则
    let tail = "";
    for (const [re, t] of domRules) {
      if (re.test(k) || re.test(v)) { tail = t; break; }
    }
    if (!tail) {
      // 兜底：领域通用但仍有实质
      if (dom === "medicine") tail = "临床应用需结合患者具体情况，遵循循证医学证据与诊疗指南推荐。";
      else if (dom === "market") tail = "市场规则调整需经过充分论证与试点，平衡市场效率与系统安全目标。";
      else if (dom === "law") tail = "法律适用需以事实为依据以法律为准绳，裁判文书应充分说理。";
      else tail = "社会学研究需将微观互动与宏观结构联系起来，避免单因解释。";
    }
    texts[k] = v.replace(/\n+$/, "") + tail;
    padded++;
  }
  console.log(dom + ": padded " + padded + " / " + Object.keys(texts).length);

  // 重写文件
  let src = fs.readFileSync(f, "utf8");
  const marker = "/* ===== 加厚文本 ===== */";
  const idx = src.indexOf(marker);
  const head = src.slice(0, idx);
  let block = "window.KG_TEXT[" + JSON.stringify(dom) + "] = ";
  block += JSON.stringify(texts, null, 2);
  block += ";\n";
  fs.writeFileSync(f, head + marker + "\n" + block, "utf8");
}

for (const dom of ["medicine", "market", "law", "sociology"]) expandDomain(dom);
