/* ============================================================
 * 星海知识图谱 · 数据注册表
 * ------------------------------------------------------------
 * 这个文件只做三件事：
 *   1. 定义 window.KG —— 各领域数据文件往里面 push 节点和关系
 *   2. 定义 window.KG_DOMAINS —— 领域清单，
 *      **数组顺序 = 星图从左到右的排列**
 *   3. 提供 KG.build() —— 合并、去重、算度数、校验
 *
 * 想加一个领域：
 *   ① 这里的 KG_DOMAINS 加一行
 *   ② assets/data/domains/ 下放一个 <id>.js
 *   ③ index.html 加一行 <script src="assets/data/domains/<id>.js"></script>
 *
 * 节点格式：{ id, n, c, d, k }
 *   id 全局唯一，建议以 领域id- 开头
 *   n  中文名          c  所属领域 id
 *   d  一句话定义      k  关键词数组
 *
 * 关系格式：[来源id, 目标id, 类型, 强度1~3]
 *   类型见 KG_EDGE_TYPES
 * ============================================================ */

window.KG = { nodes: [], edges: [] };

/* 领域清单：数组顺序决定星座在银河带上的排列 */
window.KG_DOMAINS = [
  { id: "circuit",     name: "电路与电磁",         color: "#7fd1ff", intro: "电路定律、网络定理、暂态与正弦稳态，以及电磁场与电磁波。" },
  { id: "thermal",     name: "发电与动力",         color: "#ffb36b", intro: "火力、水力、核能发电，以及热力系统、汽轮机、锅炉与厂用电。" },
  { id: "power",       name: "电力电子",           color: "#8f9dff", intro: "功率器件与电能变换拓扑：整流、逆变、斩波、调制与控制。" },
  { id: "renewable",   name: "新能源发电",         color: "#ffd166", intro: "光伏、风电、光热与分布式发电，以及并网与功率预测。" },
  { id: "grid",        name: "电力系统",           color: "#6fa8ff", intro: "系统结构、潮流、短路、稳定、无功电压与经济运行。" },
  { id: "storage",     name: "储能与新型电力系统", color: "#f2e06b", intro: "电池、变流器、抽水蓄能、氢能、虚拟电厂与需求响应。" },
  { id: "protect",     name: "继电保护与自动化",   color: "#b99dff", intro: "保护原理与配置、互感器、远动、SCADA/EMS 与安全稳定控制。" },
  { id: "embed",       name: "嵌入式与硬件",       color: "#c7e05b", intro: "单片机、外设与总线、实时系统、EDA 与 PCB、电路调试。" },
  { id: "hv",          name: "高电压与绝缘",       color: "#d08cff", intro: "放电现象、过电压与防雷、绝缘材料与试验、绝缘配合。" },
  { id: "control",     name: "测量与控制",         color: "#9ee493", intro: "传感器与仪表、误差分析、自动控制原理与 PID、现代控制。" },
  { id: "electronics", name: "电子技术",           color: "#e08bff", intro: "半导体器件、放大与反馈、运算放大器、数字逻辑、模数与数模转换。" },
  { id: "code",        name: "编程与软件",         color: "#5fd6a8", intro: "编程语言、数据结构与算法、软件工程、操作系统与数据库。" },
  { id: "motor",       name: "电机与电气传动",     color: "#ff8fd0", intro: "变压器与各类电机、调速方式、矢量控制、伺服与变频器。" },
  { id: "signal",      name: "数据与信号",         color: "#4fd0c8", intro: "信号分析与数字滤波、频谱、数据挖掘、统计与可视化。" },
  { id: "ai",          name: "人工智能",           color: "#ff7ab6", intro: "机器学习、深度学习、大模型、计算机视觉与自然语言、智能体。" },
  { id: "comm",        name: "通信与网络",         color: "#7fe0d0", intro: "通信原理与调制、信道、网络协议、无线与物联网。" },
  { id: "math",        name: "数学方法",           color: "#ff9aa5", intro: "微积分、线性代数、复变与积分变换、概率统计、数值计算与优化。" },
  { id: "industrial",  name: "工业自动化",         color: "#86c9e0", intro: "PLC、DCS、组态、现场总线、运动控制与工业机器人。" },
  { id: "standard",    name: "标准与规范",         color: "#ff6b6b", intro: "标准体系、国家与国际标准、行业规程、计量单位与安全规范。" },
  { id: "practice",    name: "工程与科研",         color: "#c9b6ff", intro: "项目管理、设计流程、调试排错、技术文档、文献检索与论文写作。" },
  { id: "ev",          name: "电动汽车与车网互动", color: "#4fd6a0", intro: "驱动电机与电控、充电基础设施、动力电池管理与车网双向互动。" },
  { id: "building",    name: "建筑电气与智能家居", color: "#e08a5f", intro: "建筑供配电、照明、应急电源、防雷接地与楼宇自动化。" },
  { id: "datacenter",  name: "数据中心与算力能耗", color: "#6ec7e0", intro: "供配电架构、制冷与液冷、算力负荷特征、能效指标与余热回收。" },
  { id: "rail",        name: "轨道交通电气化",     color: "#b08fd6", intro: "牵引变电与供电系统、车辆电气、牵引控制与回流与干扰。" },
  { id: "carbon",      name: "碳中和与能源转型",   color: "#9ad46a", intro: "碳排放核算、减排路径、碳市场与交易，以及能源系统转型。" },
  { id: "market",      name: "电力市场与交易",     color: "#e8c95f", intro: "市场结构与出清、现货与中长期、辅助服务、绿电绿证与计量结算。" },
  { id: "material",    name: "材料与绝缘材料",     color: "#d98fb0", intro: "导体、绝缘、磁性、半导体与结构材料，以及材料老化与试验。" },
  { id: "wireless",    name: "无线电能与近场通信", color: "#7fb8e0", intro: "天线与传播、无线充电、射频识别、近场通信与电磁兼容。" },
  { id: "whist",       name: "世界历史",       color: "#b98a4e", intro: "从史前到当代的全球史主线：文明兴衰、王朝更替、革命与工业化的转折。" },
  { id: "chist",       name: "中国史",         color: "#c0392b", intro: "历代政治制度、重大事件、经济文化脉络与科技思想。" },
  { id: "thist",       name: "世界科技发展史",  color: "#7a6fa8", intro: "古代技术积累、科学革命、工业革命、信息技术与当代科技前沿。" },
  { id: "physics",     name: "物理学",         color: "#6ecfd6", intro: "力学、热学、电磁学、光学、原子物理与相对论量子力学。" },
  { id: "chemistry",   name: "化学",           color: "#9ad5a0", intro: "原子分子结构、化学键、反应与平衡、酸碱氧化还原与有机化学主干。" },
  { id: "biology",     name: "生物学",         color: "#7ed957", intro: "细胞与遗传、代谢与能量、进化、生态与生物技术。" },
  { id: "earth",       name: "地理与地球科学",  color: "#c4a484", intro: "地球内部与板块、地表过程、大气海洋、水循环与气候。" },
  { id: "astronomy",   name: "天文学",         color: "#a89bff", intro: "观测方法、恒星演化、太阳系、银河系与宇宙学。" },
  { id: "medicine",    name: "医学与健康",     color: "#ff9db0", intro: "人体系统、病理机制、诊断治疗原则、药物与公共卫生。" },
  { id: "economics",   name: "经济学",         color: "#ffd98a", intro: "效用与供求、宏观增长与通胀、金融市场与国际贸易。" },
  { id: "philosophy",  name: "哲学与思想",     color: "#c9b8a0", intro: "本体论、认识论、伦理学、政治哲学与中国哲学主干。" },
  { id: "mechanical",  name: "机械工程",         color: "#e76f51", intro: "机构、零件设计、制造工艺与传动的机械工程主干。" },
  { id: "civil",       name: "土木与建筑工程",   color: "#b5838d", intro: "结构、材料、地基、桥梁与施工的土木工程主干。" },
  { id: "chemeng",     name: "化学工程与工艺",   color: "#90a955", intro: "化工单元操作、反应工程、设备与工艺设计。" },
  { id: "aerospace",   name: "航空航天工程",     color: "#3a86ff", intro: "空气动力、飞行器、推进与制导的航空航天主干。" },
  { id: "ocean",       name: "海洋科学与工程",   color: "#00b4d8", intro: "海洋物理化学、海洋生物与海洋工程结构。" },
  { id: "agriculture", name: "农业科学与工程",   color: "#70e000", intro: "作物、土壤、育种、农业机械与灌溉工程。" },
  { id: "food",        name: "食品科学与工程",   color: "#f48c06", intro: "食品化学、微生物、加工、保藏与安全。" },
  { id: "envsci",      name: "环境科学与工程",   color: "#2d6a4f", intro: "水气固污染治理、环境监测与生态修复。" },
  { id: "security",    name: "网络安全与信息安全", color: "#480ca8", intro: "密码学、网络攻防、系统安全与隐私保护。" },
  { id: "database",    name: "数据库与数据工程", color: "#3f37c9", intro: "关系模型、事务、分布式数据库与数据仓库。" },
  { id: "software",    name: "软件工程",         color: "#4cc9f0", intro: "软件过程、需求、架构、测试与项目管理。" },
  { id: "statistics",  name: "统计学",           color: "#8ecae6", intro: "描述统计、推断、回归、实验设计与贝叶斯。" },
  { id: "psychology",  name: "心理学",           color: "#f72585", intro: "认知、发展、人格、社会心理与心理测量。" },
  { id: "law",         name: "法学",             color: "#7209b7", intro: "法理、宪法、民刑、诉讼与国际法主干。" },
  { id: "sociology",   name: "社会学",           color: "#fb8500", intro: "社会结构、分层、组织、变迁与调查方法。" },
  { id: "management",  name: "管理学",           color: "#023e8a", intro: "计划组织、战略、运营、人力与营销管理。" },
  { id: "education",   name: "教育学",           color: "#06d6a0", intro: "教育原理、课程教学、心理、技术与评价。" },
  { id: "linguistics", name: "语言学",           color: "#ffb703", intro: "语音、句法、语义、语用与语言演化。" },
  { id: "literature",  name: "文学",             color: "#e63946", intro: "中外文学史、文学理论与文学批评。" },
  { id: "art",         name: "艺术",             color: "#ff5d8f", intro: "美术、音乐、戏剧、设计艺术与美学理论。" },
  { id: "cosmos",      name: "宇宙学与天体物理", color: "#5a189a", intro: "从大爆炸到暗能量，纵览宇宙整体演化。" },
  { id: "stellar",     name: "恒星与星系",       color: "#ff9e00", intro: "从氢聚变到并合黑洞，解读恒星与星系生死。" },
  { id: "planetary",   name: "行星科学与深空探测", color: "#f77f00", intro: "行星科学与深空探测——从行星地貌、大气到系外宜居" },
  { id: "spacecraft",  name: "航天器与空间技术", color: "#1d3557", intro: "航天器与空间技术——运载、平台、再入返回与在轨服务" },
  { id: "robotics",    name: "机器人学",         color: "#219ebc", intro: "研究机构、感知、规划与控制的综合工程学科" },
  { id: "quantum",     name: "量子信息与计算",   color: "#3a0ca3", intro: "以量子态为载体的信息处理与通信学科" },
  { id: "nuclear",     name: "核工程与核安全",   color: "#fb5607", intro: "裂变聚变受控释能、堆芯设计与纵深防御核安全" },
  { id: "petroleum",   name: "石油与天然气工程", color: "#7f5539", intro: "油气藏勘探开发、采输与非常规油气工程" },
  { id: "biomedical",  name: "生物医学工程",     color: "#7400b8", intro: "医用成像、植入器械与生命支持设备的工程化。" },
  { id: "optics",      name: "光学与光子学",     color: "#4361ee", intro: "激光器、光纤通信与光电成像探测的工程应用。" },
  { id: "graphics",    name: "计算机图形学",     color: "#7209b7", intro: "三维场景到屏幕像素的变换与渲染技术体系" },
  { id: "blockchain",  name: "区块链与分布式系统", color: "#560bad", intro: "去中心化账本与分布式共识的密码学基础设施" },
  { id: "geology",     name: "地质学",           color: "#9c6644", intro: "研究矿物岩石与地球表层地质作用的学科。" },
  { id: "meteorology", name: "大气科学",         color: "#48cae4", intro: "研究大气运动与天气气候现象的学科。" },
  { id: "ecology",     name: "生态学",           color: "#588157", intro: "研究生物与其周围环境相互关系的学科。" },
  { id: "neuroscience",name: "神经科学",         color: "#c77dff", intro: "研究神经系统结构、信号传导与可塑性的生命科学。" },
  { id: "pharmacy",    name: "药学",             color: "#80b918", intro: "研究药物发现、作用机制与合理用药的应用科学。" },
  { id: "finance",     name: "金融学",           color: "#d4a373", intro: "研究货币、信用、资本市场与风险配置的学科" },
  { id: "archaeology", name: "考古学",           color: "#bc6c25", intro: "通过物质遗存复原古代人类历史与文化的学科" },
  { id: "anthropology",name: "人类学",           color: "#b08968", intro: "研究人类生物性与文化多样性的综合学科。" },
  { id: "journalism",  name: "新闻传播学",       color: "#457b9d", intro: "研究新闻生产、传播过程与社会影响的人文社科。" },
  { id: "music",       name: "音乐",             color: "#e5989b", intro: "研究音乐的理论、创作、表演与社会文化的学科。" },
  { id: "tcm",         name: "中医学",           color: "#52b788", intro: "阴阳五行藏象经络，辨证论治理法方药" },
  { id: "game",        name: "游戏设计",         color: "#d00000", intro: "机制类型关卡数值叙事，玩家体验与运营" }
];

/* 五种关系类型，渲染层据此上色和换线型。
   注意 part 的方向约定：**整体 → 部件**（来源包含目标）。
   「电力系统 --包含--> 配电」= 配电是电力系统的一部分。 */
window.KG_EDGE_TYPES = {
  prereq:   { name: "前置",     color: "#5cc8ff", dash: false },
  part:     { name: "包含",     color: "#7ee0a8", dash: false },
  apply:    { name: "应用",     color: "#ffd166", dash: true  },
  related:  { name: "相关",     color: "#9aa8c0", dash: true  },
  contrast: { name: "对比",     color: "#ff8fa5", dash: true  }
};

(function () {
  var KG = window.KG;
  var domainIndex = {};
  window.KG_DOMAINS.forEach(function (d) { domainIndex[d.id] = d; });

  KG.getDomain = function (id) { return domainIndex[id]; };

  /* 合并所有领域数据：去重、丢掉悬空边、算度数、建立索引 */
  KG.build = function () {
    var seen = {}, nodes = [];
    KG.nodes.forEach(function (n) {
      if (!n || !n.id || seen[n.id]) return;
      if (!domainIndex[n.c]) { console.warn("[KG] 未知领域，已跳过：", n.id, n.c); return; }
      seen[n.id] = 1;
      n.k = n.k || [];
      n.links = [];
      n.out = [];
      n.in = [];
      n.color = domainIndex[n.c].color;
      nodes.push(n);
    });

    var byId = {};
    nodes.forEach(function (n) { byId[n.id] = n; });

    var links = [], kept = {};
    KG.edges.forEach(function (e) {
      if (!e || e.length < 2) return;
      var a = e[0], b = e[1];
      if (a === b || !byId[a] || !byId[b]) return;        // 自环或悬空，丢掉
      var key = a < b ? a + "|" + b : b + "|" + a;
      if (kept[key]) return;                               // 重复边只留一条
      kept[key] = 1;
      var t = window.KG_EDGE_TYPES[e[2]] ? e[2] : "related";
      var w = Math.min(3, Math.max(1, e[3] || 2));
      links.push({ a: a, b: b, t: t, w: w });
    });

    links.forEach(function (l) {
      l.na = byId[l.a];
      l.nb = byId[l.b];
      /* 跨领域的连线在布局里要拉长、减弱，否则会把星座拽回中间 */
      l.cross = l.na.c !== l.nb.c;
      byId[l.a].links.push(l.b);
      byId[l.b].links.push(l.a);
      byId[l.a].out.push(l);
      byId[l.b].in.push(l);
    });

    nodes.forEach(function (n) { n.degree = n.links.length; });

    KG.nodes = nodes;
    KG.links = links;
    KG.byId = byId;
    KG.stats = {
      nodes: nodes.length,
      links: links.length,
      domains: window.KG_DOMAINS.filter(function (d) {
        return nodes.some(function (n) { return n.c === d.id; });
      }).length,
      orphans: nodes.filter(function (n) { return n.degree === 0; }).length,
      types: links.reduce(function (acc, l) { acc[l.t] = (acc[l.t] || 0) + 1; return acc; }, {})
    };
    return KG;
  };
})();
