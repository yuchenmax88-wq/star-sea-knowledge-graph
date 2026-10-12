/* 领域 · 大气科学 */
(function () {
  window.KG = window.KG || { nodes: [], edges: [] };
  var D = "meteorology";
  var N = function (id, n, d, k) {
    window.KG.nodes.push({ id: "meteorology-" + id, n: n, c: D, d: d, k: k });
  };
  var E = function (a, b, t, s) {
    window.KG.edges.push(["meteorology-" + a, "meteorology-" + b, t, s]);
  };

  /* A 大气结构与热力 */
  N("troposphere-top", "对流层顶", "对流层与平流层之间的过渡层，温度随高度骤止下降，是对流活动能够到达的上界。", ["对流层", "过渡层", "温度骤变"]);
  N("stratopause", "平流层顶", "平流层顶部温度回升停止的高度，标志着从平流层进入温度下降的中间层。", ["平流层", "温度顶", "过渡"]);
  N("mesopause", "中间层顶", "中间层顶部温度降到最低值，是整个大气层中最冷的高度，再往上温度又回升。", ["中间层", "低温", "过渡"]);
  N("thermosphere", "热层", "中间层以上温度随高度迅速升高的大气层，因直接吸收太阳极紫外辐射而显著增温。", ["高温层", "紫外", "电离"]);
  N("exosphere", "散逸层", "热层之上大气分子极稀薄、高速粒子可逸入星际空间的最外层，是大气圈的上界。", ["外层", "稀薄", "逃逸"]);
  N("iono-sphere", "电离层", "高层大气被太阳紫外和粒子辐射电离的层次，能反射无线电短波，影响短波通信。", ["电离", "无线电", "反射"]);
  N("standard-atm", "标准大气", "人为规定的温度气压随高度平均分布的大气模式，用于工程换算和飞行仪表校准。", ["标准", "平均", "换算"]);
  N("density-profile", "密度廓线", "大气密度随高度变化的曲线，近地面稠密，向高空按指数规律迅速递减。", ["密度", "垂直分布", "廓线"]);
  N("homosphere", "均质层", "低层大气成分比例基本均匀的层次，主要靠湍流混合使氮氧比例保持稳定。", ["均匀", "湍流", "低层"]);
  N("air-temp", "气温", "空气冷热程度的定量度量，是气象台站观测的最基本气象要素之一。", ["温度", "要素", "观测"]);
  N("lapse-rate", "气温递减率", "对流层中气温随高度升高而降低的平均速率，是判断层结的基础数据。", ["递减率", "对流层", "温度"]);
  N("adiabatic", "绝热过程", "空气块与外界无热量交换条件下，因膨胀冷却或压缩增温而改变温度的过程。", ["绝热", "膨胀", "压缩"]);
  N("dry-adiabat", "干绝热递减率", "未饱和空气绝热上升时温度下降的固定速率，由干空气的热力性质决定。", ["干绝热", "未饱和", "速率"]);
  N("wet-adiabat", "湿绝热递减率", "饱和空气上升因凝结释放潜热而降温较慢的速率，小于干绝热递减率。", ["湿绝热", "饱和", "潜热"]);
  N("temperature-inversion", "逆温", "气温随高度升高反而上升的反常层结，像盖子一样抑制垂直对流发展。", ["逆温", "层结", "抑制对流"]);
  N("radiation-inversion", "辐射逆温", "夜间地面强烈辐射冷却，使近地面空气变冷而上层仍暖所形成的逆温。", ["辐射", "夜间", "近地面"]);
  N("subside-inversion", "下沉逆温", "高压区大范围空气下沉压缩增温，在某一高度上形成的逆温层结。", ["下沉", "高压", "增温"]);
  N("frontal-inversion", "锋面逆温", "锋面上暖空气爬在冷空气垫之上，在锋区附近形成的温度随高度升高的层次。", ["锋面", "冷暖", "过渡"]);
  N("stability", "大气稳定度", "大气对垂直扰动是助长其发展还是使其抑制返回的能力，决定对流强弱。", ["稳定度", "层结", "对流"]);
  N("abs-unstable", "绝对不稳定", "无论空气饱和与否，气块抬升后都比环境暖而持续加速上升的强不稳定层结。", ["不稳定", "强对流", "气块"]);
  N("abs-stable", "绝对稳定", "气块抬升后比环境冷而自动返回原位的层结，强烈抑制垂直对流的发展。", ["稳定", "抑制", "层结"]);
  N("conditional", "条件不稳定", "气块未饱和时稳定、一旦饱和凝结后转为不稳定的常见对流层结。", ["条件", "饱和", "不稳定"]);
  N("neutral", "中性层结", "气块抬升后温度与环境基本相同，既不助长也不抑制垂直对流的平衡层结。", ["中性", "平衡", "层结"]);

  /* B 辐射与能量 */
  N("solar-radiation", "太阳辐射", "太阳以电磁波形式向宇宙空间放射的能量，是地球大气和天气的根本热源。", ["太阳", "短波", "能量"]);
  N("solar-constant", "太阳常数", "地球大气上界垂直于太阳光方向单位面积上接收到的太阳辐射功率。", ["太阳常数", "大气上界", "辐照度"]);
  N("shortwave", "短波辐射", "太阳辐射的波段，能量主要集中在可见光和近红外部分，波长较短。", ["短波", "可见光", "太阳"]);
  N("longwave", "长波辐射", "地面和大气放射的红外辐射，波长较长，是大气直接吸收的主要热源。", ["长波", "红外", "地面"]);
  N("scattering", "大气散射", "大气分子和气溶胶粒子把入射电磁波向四面八方重新散开的过程。", ["散射", "分子", "蓝天"]);
  N("attenuation", "大气削弱", "太阳辐射经过大气时被吸收、散射和反射而强度减弱的现象。", ["削弱", "吸收", "反射"]);
  N("albedo", "行星反照率", "地球系统整体反射回太空的太阳辐射占入射太阳辐射的比例。", ["反照率", "反射", "冰盖"]);
  N("counter-radiation", "大气逆辐射", "大气向下放射的长波辐射，像一层被子对地面起重要的保温作用。", ["逆辐射", "保温", "长波"]);
  N("effective-radiation", "地面有效辐射", "地面长波辐射与大气逆辐射的差值，是地面通过长波方式净失热的途径。", ["有效辐射", "地面", "失热"]);
  N("radiation-balance", "辐射平衡", "某一时段某一系统收入辐射能与支出辐射能之间的差额。", ["辐射平衡", "收支", "能量"]);
  N("atm-window", "大气窗", "大气透过率较高的某些长波波段，是卫星从太空探测地面温度的窗口。", ["大气窗", "透过", "遥感"]);
  N("insolation", "到达地面辐射", "经大气削弱后真正到达地表的太阳直接辐射与散射辐射之和。", ["到达地面", "直接辐射", "散射辐射"]);

  /* C 湿度与凝结 */
  N("vapor-pressure", "水汽压", "湿空气中水汽本身的分压，是表示大气中水汽绝对含量的物理量。", ["水汽压", "分压", "湿度"]);
  N("sat-vp", "饱和水汽压", "一定温度下水汽达到饱和时的水汽压，随温度升高而呈指数增大。", ["饱和", "温度", "水汽压"]);
  N("dew-point", "露点温度", "气压和水汽含量不变条件下，空气冷却到刚好达到饱和时的温度。", ["露点", "饱和", "冷却"]);
  N("relative-humidity", "相对湿度", "实际水汽压与同温度下饱和水汽压之比的百分数，是日常湿度指标。", ["相对湿度", "百分数", "饱和"]);
  N("specific-humidity", "比湿", "湿空气中水汽质量占湿空气总质量的比值，垂直运动中近似保守。", ["比湿", "质量比", "保守"]);
  N("absolute-humidity", "绝对湿度", "单位体积湿空气中所含水汽的质量，即水汽的密度。，是大气科学常用观测或分析对象", ["绝对湿度", "密度", "水汽"]);
  N("sat-deficit", "饱和差", "同温度下饱和水汽压与实际水汽压之差，数值越大蒸发越旺盛。", ["饱和差", "蒸发", "干燥"]);
  N("condensation", "凝结", "水汽由气态转变为液态水滴的相变过程，需要降温或增加水汽。", ["凝结", "相变", "液态"]);
  N("cond-nucleus", "凝结核", "水汽凝结时所附着的悬浮微粒，如海盐粒、烟尘和矿物粉尘。", ["凝结核", "微粒", "凝结"]);
  N("deposition", "凝华", "水汽不经过液态阶段直接转变为固态冰晶的相变过程，常见于冬季。", ["凝华", "冰晶", "固态"]);
  N("fog", "雾", "近地面空气中悬浮大量小水滴导致水平能见度显著降低的天气现象。", ["雾", "近地面", "能见度"]);
  N("radiation-fog", "辐射雾", "夜间地面强烈辐射冷却，使贴地气层水汽凝结而成的雾，日出后常消散。", ["辐射雾", "夜间", "冷却"]);
  N("advection-fog", "平流雾", "暖湿空气水平平流到冷下垫面上冷却凝结形成的雾，沿海常见。", ["平流雾", "暖湿", "冷表面"]);
  N("dew", "露", "夜间地面物体辐射冷却使贴近其表面的水汽凝结成的细小水珠。", ["露", "夜间", "凝结"]);
  N("frost", "霜", "贴地温度降到零度以下时，水汽直接凝华成白色冰晶附着在物体表面。", ["霜", "凝华", "低温"]);

  /* D 云与降水物理 */
  N("cloud-form", "云状分类", "按云底高度和外部形态对全球云进行统一分类的观测系统。", ["云状", "分类", "观测"]);
  N("cirrus", "卷云", "高空中由微小冰晶组成的丝缕状白色云，常预示天气系统临近。", ["卷云", "冰晶", "高云"]);
  N("cumulus", "积云", "垂直发展的棉花状云块，底部平坦顶部圆凸，是对流的直观标志。", ["积云", "垂直", "淡积云"]);
  N("stratus", "层云", "低而均匀的灰色云幕，像雾但不接触地面，常带来蒙蒙细雨。", ["层云", "低云", "均匀"]);
  N("altocumulus", "高积云", "中空由小块云组成的波纹状或瓦块状排列的云，预兆性较强。", ["高积云", "中云", "波纹"]);
  N("stratocumulus", "层积云", "低而宽大的条状或团块状云，常覆盖大片天空，降水弱。", ["层积云", "低云", "条状"]);
  N("nimbostratus", "雨层云", "厚而灰暗的雨云幕，带来大范围连续性降水，云底很低。", ["雨层云", "连续性", "降水"]);
  N("cumulonimbus", "积雨云", "强烈垂直发展的雷雨云，带来雷暴、冰雹和短时强降水。", ["积雨云", "雷暴", "垂直发展"]);
  N("cloud-droplet", "云滴", "云中悬浮的微小水滴，直径远小于雨滴，靠上升气流托住。", ["云滴", "微小", "悬浮"]);
  N("ccn", "云凝结核", "能使水汽在其表面优先凝结成云滴的气溶胶微粒，是成云的关键。", ["云凝结核", "微粒", "云滴"]);
  N("supercooled", "过冷水滴", "温度低于零度仍保持液态的水滴，常见于中纬度云中，很不稳定。", ["过冷水", "零度以下", "云"]);
  N("ice-effect", "冰晶效应", "冰晶与过冷水滴共存时因饱和水汽压差而冰晶不断增长的过程。", ["冰晶效应", "贝吉龙", "降水"]);
  N("collision", "碰并增长", "大小云滴在上升气流中碰撞合并、体积不断增大的过程。", ["碰并", "合并", "雨滴"]);
  N("hydrometeor", "降水粒子", "云中或降至地面的液态或固态水成物的统称，包括雨滴雪粒。", ["降水粒子", "水成物", "尺度"]);
  N("rain", "雨", "自云中降落到地面的液态水滴，是最常见的降水形式。，是大气科学常用观测或分析对象", ["雨", "液态", "降落"]);
  N("snow", "雪", "云中水汽凝华形成的六角形冰晶聚合体降落到地面的固态降水。", ["雪", "冰晶", "固态"]);
  N("graupel", "霰", "过冷水滴撞冻在冰晶表面形成的不透明白色球状小冰粒。", ["霰", "冻附", "小冰粒"]);
  N("hail", "冰雹", "强对流云中反复升降冻附形成的透明与不透明相间的冰球。", ["冰雹", "强对流", "冰球"]);
  N("freezing-rain", "冻雨", "过冷雨滴碰到温度低于零度的地面或物体立即冻结成冰壳的降水。", ["冻雨", "过冷", "雨凇"]);
  N("cloud-seeding", "人工增雨", "向云中播撒碘化银或干冰等催化剂以影响云降水过程的技术。", ["人工影响", "播云", "催化剂"]);

  /* E 气压与风 */
  N("isobar", "等压线", "天气图上把气压数值相等的各点连接起来的平滑曲线。，是大气科学常用观测或分析对象", ["等压线", "天气图", "气压"]);
  N("isobaric-surface", "等压面", "空间上气压处处相等的曲面，是高空天气图分析的主要对象。", ["等压面", "高空", "分析"]);
  N("pgf", "气压梯度力", "单位质量空气在气压梯度作用下受到的力，是产生风的原始动力。", ["气压梯度力", "原动力", "风"]);
  N("coriolis", "地转偏向力", "因地球自转而使水平运动物体方向发生偏转的惯性力，北半球右偏。", ["地转偏向", "科氏力", "偏转"]);
  N("centrifugal", "惯性离心力", "空气做曲线运动时产生的沿曲率半径向外的惯性力。，是大气科学常用观测或分析对象", ["离心力", "曲线", "惯性"]);
  N("friction", "摩擦力", "下垫面对空气运动产生的阻力，在近地面边界层中最显著。", ["摩擦", "近地面", "阻力"]);
  N("gradient-wind", "梯度风", "自由大气中气压梯度力、地转偏向力与离心力三力平衡时的风。", ["梯度风", "平衡", "曲线"]);
  N("ageostrophic", "非地转风", "实际风偏离地转风的分量，通常与垂直运动和天气系统发展相联系。", ["非地转", "偏差", "垂直运动"]);
  N("thermal-wind", "热成风", "两层等压面之间地转风的垂直切变，由水平温度梯度造成。", ["热成风", "垂直切变", "温度梯度"]);
  N("wind-rose", "风向玫瑰", "统计一定时段内各风向频率并绘成玫瑰形状的图件。，是大气科学常用观测或分析对象", ["风向玫瑰", "频率", "统计"]);
  N("sea-breeze", "海风", "白天陆地升温快于海洋，近地面风从海洋吹向陆地的局地环流。", ["海风", "白天", "海陆风"]);
  N("land-breeze", "陆风", "夜间陆地冷却快于海洋，近地面风从陆地吹向海洋的局地环流。", ["陆风", "夜间", "海陆风"]);
  N("valley-wind", "谷风", "白天山坡受热快，暖空气沿坡上升形成的向山上吹的风。", ["谷风", "白天", "山谷风"]);
  N("mountain-wind", "山风", "夜间山坡冷却快，冷空气沿坡下滑向谷底流动的风。，是大气科学常用观测或分析对象", ["山风", "夜间", "山谷风"]);
  N("foehn", "焚风", "湿润气流越过山脉后在背风坡下沉增温变干所形成的热风。", ["焚风", "下沉", "干热"]);
  N("gust", "阵风", "短时间内风速突然出现明显增大的脉动现象，常伴冷锋过境。", ["阵风", "风速", "脉动"]);

  /* F 大气环流 */
  N("three-cell", "三圈环流", "低纬、中纬、高纬各一个闭合垂直环流构成的理想经圈环流模型。", ["三圈环流", "经圈", "理想"]);
  N("hadley", "哈德莱环流", "低纬地区空气上升、向极流动、在副热带下沉、回流赤道的闭合环流。", ["哈德莱", "信风", "低纬"]);
  N("ferrel", "费雷尔环流", "中纬度的间接热力环流，空气运动方向与哈德莱环流相反。", ["费雷尔", "中纬", "间接"]);
  N("polar-cell", "极地环流", "高纬度地区空气冷却下沉、向赤道流动再上升的小尺度垂直环流。", ["极地环流", "高纬", "下沉"]);
  N("itcz", "赤道辐合带", "赤道附近南北半球信风汇合形成的辐合上升带，对流雨旺盛。", ["辐合带", "赤道", "对流"]);
  N("trade-wind", "信风带", "低纬地区从副热带高压吹向赤道辐合带的偏东信风带。，是大气科学常用观测或分析对象", ["信风", "低纬", "偏东"]);
  N("westerly", "西风带", "中纬度地区从副热带高压吹向副极地低压的强盛偏西风带。", ["西风带", "中纬", "偏西"]);
  N("polar-easterly", "极地东风带", "高纬地区从极地高压向外吹出的偏东气流带。，是大气科学常用观测或分析对象", ["极地东风", "高纬", "偏东"]);
  N("subtropical-high", "副热带高压", "副热带地区因下沉气流形成的暖性高压，控制大范围晴热天气。", ["副高", "下沉", "晴热"]);
  N("subpolar-low", "副极地低压", "副极地地区锋面频繁活动、气旋多发的低压地带。，是大气科学常用观测或分析对象", ["副极地低压", "锋面", "低压"]);
  N("polar-front", "极锋", "极地冷空气与中纬暖湿空气交汇形成的准静止锋带。，是大气科学常用观测或分析对象", ["极锋", "冷暖交汇", "中高纬"]);
  N("westerly-trough", "西风槽", "西风带中向南突出的低压槽，槽前常带来升温阴雨天气。", ["西风槽", "低压槽", "阴雨"]);
  N("blocking-high", "阻塞高压", "西风带中稳定少动的暖性高压系统，使上游天气过程长期停滞。", ["阻塞高压", "稳定", "停滞"]);
  N("cutoff-low", "切断低压", "西风带中脱离主环流孤立存在的冷性低压，常带来连阴雨。", ["切断低压", "孤立", "冷"]);
  N("action-center", "大气活动中心", "月平均天气图上半永久性存在的大尺度高低压系统。，是大气科学常用观测或分析对象", ["活动中心", "半永久", "季节"]);
  N("east-asian-monsoon", "东亚季风", "东亚地区因海陆热力差异和青藏高原影响形成的季节性风向反转。", ["东亚季风", "海陆差异", "季节"]);
  N("south-asian-monsoon", "南亚季风", "南亚地区夏季盛行西南季风、冬季转为东北季风的季风系统。", ["南亚季风", "西南风", "印度"]);
  N("monsoon-index", "季风指数", "用来定量表征某一地区季风环流强弱程度的综合指标。，是大气科学常用观测或分析对象", ["季风指数", "定量", "强弱"]);

  /* G 天气系统 */
  N("cold-front", "冷锋", "冷气团主动向暖气团方向推进所形成的锋面。，是大气科学常用观测或分析对象", ["冷锋", "冷气团", "大风"]);
  N("warm-front", "暖锋", "暖气团主动向冷气团方向推进所形成的锋面。，是大气科学常用观测或分析对象", ["暖锋", "暖气团", "连续性雨"]);
  N("stationary-front", "准静止锋", "冷暖气团势均力敌，锋面在某一地区来回徘徊少动的锋。", ["准静止锋", "徘徊", "连阴雨"]);
  N("occluded-front", "锢囚锋", "冷锋追上暖锋，把暖空气抬离地面后形成的复合锋面。，是大气科学常用观测或分析对象", ["锢囚锋", "追上", "锋面"]);
  N("frontal-slope", "锋面坡度", "锋面界面与水平面之间的夹角，决定锋面天气的水平分布宽度。", ["锋面坡度", "夹角", "天气"]);
  N("extratropical-cyclone", "温带气旋", "生成于中高纬锋面之上的低压涡旋，是影响中纬度的主要风暴系统。", ["温带气旋", "锋面", "低压"]);
  N("frontal-cyclone", "锋面气旋", "在极锋上波动发展起来的温带气旋，具有完整冷暖锋结构。", ["锋面气旋", "极锋", "波动"]);
  N("cold-high", "冷高压", "冷空气在高纬大陆堆积形成的冷性高压，控制区多晴冷天气。", ["冷高压", "冷空气", "晴冷"]);
  N("mongolian-high", "蒙古高压", "冬季欧亚大陆上发展起来的强大冷高压，是寒潮天气的源地。", ["蒙古高压", "冬季", "寒潮"]);
  N("aleutian-low", "阿留申低压", "冬季北太平洋阿留申群岛附近的半永久性低压系统。，是大气科学常用观测或分析对象", ["阿留申低压", "北太平洋", "冬季"]);
  N("icelandic-low", "冰岛低压", "冬季北大西洋冰岛附近的半永久性低压系统，气旋活动频繁。", ["冰岛低压", "北大西洋", "冬季"]);
  N("south-asian-high", "南亚高压", "夏季青藏高原上空对流层上部发展起来的暖性高压系统。", ["南亚高压", "夏季", "高空"]);
  N("typhoon", "台风", "西北太平洋上强烈发展的热带气旋，中心附近风力达十二级以上。", ["台风", "热带气旋", "西北太平洋"]);
  N("typhoon-eye", "台风眼", "台风中心区域风平浪静、云淡天晴的下沉气流区。，是大气科学常用观测或分析对象", ["台风眼", "中心", "下沉"]);
  N("typhoon-track", "台风路径", "台风中心自生成到消失所移动的轨迹，受引导气流支配。", ["台风路径", "移动", "引导气流"]);
  N("tropical-genesis", "热带气旋生成", "热带低压在合适海温和气流条件下发展成热带气旋的过程。", ["生成", "热带", "发展"]);
  N("squall-line", "飑线", "许多雷暴单体排列成的狭长强对流带，带来突发大风和阵雨。", ["飑线", "强对流", "突发大风"]);
  N("thunderstorm", "雷暴", "积雨云产生的伴随雷电现象的局地强对流天气。，是大气科学常用观测或分析对象", ["雷暴", "积雨云", "雷电"]);
  N("lightning", "闪电", "云与云之间或云与地之间发生的瞬间强烈放电现象。，是大气科学常用观测或分析对象", ["闪电", "放电", "雷电"]);
  N("tornado", "龙卷风", "从积雨云下垂伸到地面的强烈旋转小尺度气旋，破坏力极大。", ["龙卷风", "旋转", "小尺度"]);
  N("downburst", "下击暴流", "雷暴中强烈下沉气流冲到地面后向外辐散的灾害性强风。", ["下击暴流", "下沉", "辐散"]);
  N("shear-line", "切变线", "低空风向上或风速出现强切变的狭长地带，常触发大范围降水。", ["切变线", "风向", "降水"]);
  N("vortex", "低涡", "对流层中低层出现的闭合低压涡旋，常带来持续性降水。", ["低涡", "低压涡旋", "低层"]);
  N("meiyu", "梅雨", "江淮流域初夏受准静止锋控制出现的连绵阴雨期。，是大气科学常用观测或分析对象", ["梅雨", "江淮", "连阴雨"]);
  N("easterly-wave", "东风波", "低纬东风气流中自东向西移动的波动槽，常带来阵性雷雨。", ["东风波", "低纬", "波动"]);
  N("rainstorm", "暴雨", "短时间内降下大量雨水的强降水过程，易引发洪涝。，是大气科学常用观测或分析对象", ["暴雨", "强降水", "洪涝"]);

  /* H 气象观测 */
  N("surface-station", "地面观测站", "按规范定时观测近地面气象要素的固定气象台站。，是大气科学常用观测或分析对象", ["地面站", "观测", "台站"]);
  N("auto-station", "自动气象站", "能自动连续观测并远程传输气象数据的无人值守站。，是大气科学常用观测或分析对象", ["自动站", "连续", "遥测"]);
  N("stevenson-screen", "百叶箱", "安置温湿度计的白色通风防辐射木箱，保证观测代表性。", ["百叶箱", "通风", "防辐射"]);
  N("rain-gauge", "雨量器", "专门用来测量某一时段降水量的标准仪器。，是大气科学常用观测或分析对象", ["雨量器", "降水", "测量"]);
  N("anemometer", "风速计", "测量瞬时风速和风向的常用气象仪器。，是大气科学常用观测或分析对象", ["风速计", "风", "测量"]);
  N("thermo-hygrometer", "温湿度计", "同时测量空气温度和相对湿度的组合仪器。，是大气科学常用观测或分析对象", ["温湿度计", "仪器", "观测"]);
  N("radiosonde", "探空仪", "随探空气球上升，实时测量高空温压湿的小型仪器。，是大气科学常用观测或分析对象", ["探空仪", "气球", "高空"]);
  N("upper-air-obs", "高空观测", "对自由大气中温压湿风垂直分布进行的系统探测。，是大气科学常用观测或分析对象", ["高空观测", "垂直", "探空"]);
  N("weather-radar", "天气雷达", "用电磁波探测云雨位置、强度和内部结构的雷达系统。，是大气科学常用观测或分析对象", ["天气雷达", "探测", "云雨"]);
  N("doppler-radar", "多普勒雷达", "利用多普勒效应测量降水粒子径向运动速度的天气雷达。", ["多普勒", "径向速度", "雷达"]);
  N("radar-echo", "雷达回波", "云雨粒子反射回雷达接收天线的电磁波信号。，是大气科学常用观测或分析对象", ["回波", "反射", "信号"]);
  N("meteo-satellite", "气象卫星", "专门从太空观测大气云系和气象要素的人造卫星。，是大气科学常用观测或分析对象", ["气象卫星", "观测", "遥感"]);
  N("polar-satellite", "极轨卫星", "绕地球南北极运行、可逐步覆盖全球的气象卫星。，是大气科学常用观测或分析对象", ["极轨", "全球", "轨道"]);
  N("geo-satellite", "静止卫星", "相对地面某点静止、可持续监测同一区域的气象卫星。，是大气科学常用观测或分析对象", ["静止卫星", "定点", "持续"]);
  N("cloud-image", "卫星云图", "气象卫星从太空拍摄传回的云系分布图像。，是大气科学常用观测或分析对象", ["云图", "卫星", "云系"]);
  N("weather-map", "天气图", "填绘各地同时刻气象观测资料的专用分析地图。，是大气科学常用观测或分析对象", ["天气图", "填绘", "分析"]);
  N("surface-chart", "地面图", "分析地面气压场和天气系统分布的等压线图。，是大气科学常用观测或分析对象", ["地面图", "等压线", "分析"]);
  N("upper-chart", "高空图", "分析某一规定等压面上温压场分布的高空图。，是大气科学常用观测或分析对象", ["高空图", "等压面", "分析"]);

  /* I 天气预报 */
  N("nowcasting", "临近预报", "对未来数小时内强对流天气的短时加密预报。，是大气科学常用观测或分析对象", ["临近", "短时", "强对流"]);
  N("short-range", "短期预报", "对未来一到三天的天气状况做出的预报。，是大气科学常用观测或分析对象", ["短期", "三天", "预报"]);
  N("medium-range", "中期预报", "对未来四到十天的天气趋势做出的预报。，是大气科学常用观测或分析对象", ["中期", "十天", "环流"]);
  N("long-range", "长期预报", "十天以上的气候趋势展望，以趋势为主而非具体天气。，是大气科学常用观测或分析对象", ["长期", "趋势", "气候"]);
  N("nwp", "数值天气预报", "用计算机数值求解大气动力学方程组做出的天气预报。，是大气科学常用观测或分析对象", ["数值预报", "方程组", "计算机"]);
  N("nwp-model", "数值模式", "描述大气运动和热力过程的数学物理模型。，是大气科学常用观测或分析对象", ["数值模式", "模型", "方程组"]);
  N("initial-field", "初始场", "预报起始时刻大气温压湿风的三维分布状态。，是大气科学常用观测或分析对象", ["初始场", "起始", "观测"]);
  N("data-assim", "资料同化", "把各类观测融合成最优初始场的现代预报技术。，是大气科学常用观测或分析对象", ["资料同化", "融合", "初始场"]);
  N("ensemble", "集合预报", "用多个略有差异的初值做一组预报以估计不确定性。，是大气科学常用观测或分析对象", ["集合", "不确定性", "多成员"]);
  N("verification", "预报检验", "用实况观测对比预报结果、评定预报准确率的工作。，是大气科学常用观测或分析对象", ["检验", "准确率", "评定"]);
  N("synoptic-analysis", "天气分析", "在天气图上判识各类天气系统及其演变趋势的过程。，是大气科学常用观测或分析对象", ["天气分析", "判识", "系统"]);
  N("warning-signal", "预警信号", "气象部门向公众发布的灾害性天气分级警告。，是大气科学常用观测或分析对象", ["预警", "公众", "灾害"]);
  N("rainstorm-warning", "暴雨预警", "针对暴雨可能引发洪涝而发布的分级警告。，是大气科学常用观测或分析对象", ["暴雨预警", "分级", "洪涝"]);
  N("typhoon-warning", "台风预警", "针对台风逼近或登陆而发布的紧急警告。，是大气科学常用观测或分析对象", ["台风预警", "紧急", "登陆"]);
  N("lightning-warning", "雷电预警", "针对强雷暴和雷电活动可能致灾而发布的警告。，是大气科学常用观测或分析对象", ["雷电预警", "雷暴", "安全"]);
  N("forecast-service", "气象服务", "面向各行各业提供天气预报和气象情报的公益服务。，是大气科学常用观测或分析对象", ["气象服务", "各行各业", "应用"]);

  /* J 气候系统 */
  N("climate-system", "气候系统", "大气圈、水圈、冰雪圈、岩石圈与生物圈相互作用构成的整体。", ["气候系统", "五大圈", "相互作用"]);
  N("climatology", "气候态", "某气象要素多年平均值所构成的常年统计状态。，是大气科学常用观测或分析对象", ["气候态", "多年平均", "统计"]);
  N("climate-anomaly", "气候异常", "某时段气候要素偏离常年气候态的程度。，是大气科学常用观测或分析对象", ["气候异常", "距平", "偏离"]);
  N("la-nina", "拉尼娜", "赤道中东太平洋海温异常偏低的冷相位事件。，是大气科学常用观测或分析对象", ["拉尼娜", "冷事件", "东太平洋"]);
  N("southern-osc", "南方涛动", "东南太平洋与印度洋之间气压的反相振荡现象。，是大气科学常用观测或分析对象", ["南方涛动", "气压", "反相"]);
  N("enso", "ENSO循环", "厄尔尼诺与南方涛动耦合构成的大尺度海气年际振荡。，是大气科学常用观测或分析对象", ["ENSO", "耦合", "年际"]);
  N("nao", "北大西洋涛动", "北大西洋副极地低压与副热带高压之间的反相振荡。，是大气科学常用观测或分析对象", ["北大西洋涛动", "气压", "区域"]);
  N("ao", "北极涛动", "北半球中高纬气压呈环形分布的大尺度遥相关型。，是大气科学常用观测或分析对象", ["北极涛动", "环形", "遥相关"]);
  N("pdo", "太平洋年代际振荡", "北太平洋海温场持续二三十年的冷暖位相振荡。，是大气科学常用观测或分析对象", ["PDO", "年代际", "海温"]);
  N("climate-model", "气候模式", "模拟气候系统长期变化和对外强迫响应的数值模型。，是大气科学常用观测或分析对象", ["气候模式", "长期", "模拟"]);
  N("climate-prediction", "气候预测", "对月季以上时间尺度的气候趋势做出的预估。，是大气科学常用观测或分析对象", ["气候预测", "月季", "趋势"]);
  N("extreme-weather", "极端天气", "出现概率很小、强度异常大的灾害性天气事件。，是大气科学常用观测或分析对象", ["极端", "概率小", "异常"]);
  N("drought-index", "干旱指数", "定量表征某一时期干湿程度的综合指标。，是大气科学常用观测或分析对象", ["干旱指数", "干湿", "指标"]);
  N("radiative-forcing", "辐射强迫", "外部因素造成地气系统辐射收支平衡发生变化的量。，是大气科学常用观测或分析对象", ["辐射强迫", "收支", "外部"]);
  N("climate-abrupt", "气候突变", "气候状态在较短时间内发生的大尺度快速转折。，是大气科学常用观测或分析对象", ["气候突变", "转折", "快速"]);
  N("paleoclimate", "古气候", "有器测记录以前的地质历史时期的气候状况。，是大气科学常用观测或分析对象", ["古气候", "地质", "代用资料"]);

  /* K 大气化学 */
  N("ozone-layer", "臭氧层", "平流层中臭氧浓度较高的层次，能吸收对生物有害的太阳紫外。", ["臭氧层", "平流层", "吸收紫外"]);
  N("ozone-hole", "臭氧洞", "南极春季上空臭氧浓度显著下降形成的异常低值区。，是大气科学常用观测或分析对象", ["臭氧洞", "南极", "臭氧减少"]);
  N("strat-ozone", "平流层臭氧", "位于平流层中、对地球生命起屏蔽紫外保护作用的臭氧。", ["平流层臭氧", "保护", "紫外"]);
  N("ozone-depletion", "臭氧消耗", "人类排放的氟氯烃等物质使平流层臭氧被分解的过程。，是大气科学常用观测或分析对象", ["臭氧消耗", "氟利昂", "分解"]);
  N("aerosol", "气溶胶", "悬浮在大气中的固态或液态微粒的总称。，是大气科学常用观测或分析对象", ["气溶胶", "微粒", "悬浮"]);
  N("sulfate-aerosol", "硫酸盐气溶胶", "由二氧化硫等气体转化形成的硫酸盐微粒，可反射阳光起降温作用。", ["硫酸盐", "反射", "冷却效应"]);
  N("dust-aerosol", "沙尘气溶胶", "干旱区风蚀起沙进入大气的矿物微粒气溶胶。，是大气科学常用观测或分析对象", ["沙尘", "矿物", "干旱"]);
  N("volcanic-aerosol", "火山气溶胶", "火山喷发进入平流层的硫酸盐气溶胶层，可影响全球气候。", ["火山", "平流层", "冷却"]);
  N("aerosol-radiation", "气溶胶辐射效应", "气溶胶通过散射和吸收辐射影响地气系统能量平衡的作用。", ["气溶胶", "辐射", "间接效应"]);
  N("oxidation-capacity", "大气氧化能力", "大气通过化学反应清除痕量污染气体的自净能力。，是大气科学常用观测或分析对象", ["氧化能力", "清除", "化学"]);
  N("energy-balance", "全球能量平衡", "地气系统多年平均下收入太阳辐射与长波支出的平衡关系。", ["能量平衡", "全球", "收支"]);

  /* ============ 边 ============ */
  /* A 内部 */
  E("troposphere-top", "thermosphere", "related", 2);
  E("stratopause", "mesopause", "prereq", 2);
  E("mesopause", "thermosphere", "prereq", 2);
  E("thermosphere", "iono-sphere", "related", 2);
  E("iono-sphere", "exosphere", "prereq", 2);
  E("standard-atm", "density-profile", "apply", 2);
  E("density-profile", "homosphere", "related", 2);
  E("air-temp", "lapse-rate", "prereq", 2);
  E("lapse-rate", "adiabatic", "prereq", 2);
  E("adiabatic", "dry-adiabat", "part", 2);
  E("adiabatic", "wet-adiabat", "part", 2);
  E("dry-adiabat", "stability", "prereq", 3);
  E("wet-adiabat", "stability", "prereq", 3);
  E("dry-adiabat", "wet-adiabat", "contrast", 2);
  E("stability", "abs-unstable", "part", 2);
  E("stability", "abs-stable", "part", 2);
  E("stability", "conditional", "part", 2);
  E("stability", "neutral", "part", 2);
  E("abs-unstable", "abs-stable", "contrast", 3);
  E("temperature-inversion", "radiation-inversion", "part", 2);
  E("temperature-inversion", "subside-inversion", "part", 2);
  E("temperature-inversion", "frontal-inversion", "part", 2);
  E("radiation-inversion", "fog", "apply", 2);
  E("abs-unstable", "thunderstorm", "apply", 3);
  E("abs-stable", "temperature-inversion", "related", 2);
  E("conditional", "cumulonimbus", "apply", 3);

  /* B 辐射 */
  E("solar-radiation", "solar-constant", "related", 2);
  E("solar-radiation", "shortwave", "part", 2);
  E("shortwave", "longwave", "contrast", 2);
  E("shortwave", "attenuation", "prereq", 2);
  E("attenuation", "scattering", "part", 2);
  E("attenuation", "insolation", "related", 2);
  E("longwave", "counter-radiation", "part", 2);
  E("longwave", "effective-radiation", "part", 2);
  E("counter-radiation", "radiation-balance", "part", 2);
  E("effective-radiation", "radiation-balance", "part", 2);
  E("insolation", "radiation-balance", "part", 2);
  E("albedo", "radiation-balance", "related", 2);
  E("atm-window", "longwave", "related", 2);
  E("radiation-balance", "energy-balance", "prereq", 2);

  /* C 湿度凝结 */
  E("vapor-pressure", "sat-vp", "prereq", 2);
  E("sat-vp", "dew-point", "prereq", 2);
  E("sat-vp", "relative-humidity", "prereq", 2);
  E("relative-humidity", "sat-deficit", "part", 2);
  E("vapor-pressure", "specific-humidity", "related", 1);
  E("specific-humidity", "absolute-humidity", "related", 1);
  E("dew-point", "condensation", "prereq", 2);
  E("condensation", "cond-nucleus", "prereq", 2);
  E("condensation", "fog", "apply", 2);
  E("condensation", "dew", "apply", 2);
  E("deposition", "frost", "apply", 2);
  E("radiation-fog", "radiation-inversion", "related", 2);
  E("advection-fog", "sea-breeze", "related", 2);
  E("radiation-fog", "advection-fog", "contrast", 2);
  E("fog", "dew-point", "related", 2);

  /* D 云降水 */
  E("cloud-form", "cirrus", "part", 2);
  E("cloud-form", "cumulus", "part", 2);
  E("cloud-form", "stratus", "part", 2);
  E("cloud-form", "altocumulus", "part", 2);
  E("cloud-form", "stratocumulus", "part", 2);
  E("cloud-form", "nimbostratus", "part", 2);
  E("cloud-form", "cumulonimbus", "part", 2);
  E("cumulus", "stratus", "contrast", 1);
  E("nimbostratus", "cumulonimbus", "contrast", 2);
  E("cloud-droplet", "ccn", "prereq", 2);
  E("cloud-droplet", "collision", "prereq", 2);
  E("supercooled", "ice-effect", "prereq", 3);
  E("ice-effect", "snow", "apply", 2);
  E("collision", "rain", "apply", 2);
  E("cloud-droplet", "hydrometeor", "part", 2);
  E("hydrometeor", "rain", "part", 2);
  E("hydrometeor", "snow", "part", 2);
  E("hydrometeor", "graupel", "part", 2);
  E("hydrometeor", "hail", "part", 2);
  E("hydrometeor", "freezing-rain", "part", 2);
  E("cumulonimbus", "hail", "apply", 2);
  E("cumulonimbus", "thunderstorm", "apply", 3);
  E("cumulonimbus", "lightning", "apply", 2);
  E("nimbostratus", "rain", "related", 2);
  E("cloud-seeding", "ccn", "apply", 2);
  E("cloud-seeding", "rain", "apply", 2);

  /* E 气压风 */
  E("isobar", "pgf", "prereq", 2);
  E("pgf", "coriolis", "prereq", 2);
  E("pgf", "friction", "prereq", 2);
  E("coriolis", "gradient-wind", "prereq", 3);
  E("centrifugal", "gradient-wind", "prereq", 2);
  E("gradient-wind", "ageostrophic", "contrast", 1);
  E("thermal-wind", "westerly-trough", "related", 2);
  E("wind-rose", "anemometer", "apply", 2);
  E("sea-breeze", "land-breeze", "contrast", 2);
  E("valley-wind", "mountain-wind", "contrast", 2);
  E("foehn", "mountain-wind", "related", 1);
  E("gust", "downburst", "related", 2);
  E("isobaric-surface", "upper-chart", "apply", 2);

  /* F 环流 */
  E("three-cell", "hadley", "part", 3);
  E("three-cell", "ferrel", "part", 2);
  E("three-cell", "polar-cell", "part", 2);
  E("hadley", "itcz", "related", 2);
  E("hadley", "trade-wind", "related", 2);
  E("ferrel", "westerly", "related", 2);
  E("polar-cell", "polar-easterly", "related", 2);
  E("subtropical-high", "trade-wind", "related", 2);
  E("subtropical-high", "westerly", "related", 2);
  E("subpolar-low", "polar-front", "related", 2);
  E("polar-front", "extratropical-cyclone", "apply", 3);
  E("westerly-trough", "westerly", "part", 2);
  E("blocking-high", "subtropical-high", "related", 2);
  E("cutoff-low", "westerly-trough", "related", 2);
  E("action-center", "mongolian-high", "part", 2);
  E("action-center", "aleutian-low", "part", 2);
  E("action-center", "icelandic-low", "part", 2);
  E("east-asian-monsoon", "monsoon-index", "apply", 2);
  E("south-asian-monsoon", "monsoon-index", "apply", 2);
  E("itcz", "easterly-wave", "related", 1);
  E("subtropical-high", "subpolar-low", "contrast", 2);

  /* G 天气系统 */
  E("cold-front", "warm-front", "contrast", 3);
  E("cold-front", "stationary-front", "related", 1);
  E("warm-front", "stationary-front", "related", 1);
  E("occluded-front", "cold-front", "related", 2);
  E("occluded-front", "warm-front", "related", 2);
  E("frontal-slope", "cold-front", "related", 1);
  E("extratropical-cyclone", "frontal-cyclone", "part", 2);
  E("frontal-cyclone", "cold-front", "part", 2);
  E("frontal-cyclone", "warm-front", "part", 2);
  E("cold-high", "mongolian-high", "part", 2);
  E("cold-high", "subside-inversion", "apply", 2);
  E("typhoon", "typhoon-eye", "part", 3);
  E("typhoon", "typhoon-track", "part", 2);
  E("tropical-genesis", "typhoon", "prereq", 3);
  E("squall-line", "thunderstorm", "part", 3);
  E("thunderstorm", "lightning", "part", 3);
  E("thunderstorm", "downburst", "part", 2);
  E("thunderstorm", "tornado", "related", 2);
  E("shear-line", "meiyu", "apply", 2);
  E("vortex", "extratropical-cyclone", "related", 1);
  E("meiyu", "stationary-front", "prereq", 3);
  E("rainstorm", "nimbostratus", "related", 2);
  E("rainstorm", "rainstorm-warning", "apply", 3);
  E("typhoon", "typhoon-warning", "apply", 3);
  E("lightning", "lightning-warning", "apply", 3);
  E("south-asian-high", "east-asian-monsoon", "related", 1);
  E("cold-high", "aleutian-low", "contrast", 2);

  /* H 观测 */
  E("surface-station", "auto-station", "related", 1);
  E("surface-station", "stevenson-screen", "part", 2);
  E("surface-station", "rain-gauge", "part", 2);
  E("surface-station", "anemometer", "part", 2);
  E("surface-station", "thermo-hygrometer", "part", 2);
  E("radiosonde", "upper-air-obs", "part", 3);
  E("upper-air-obs", "upper-chart", "apply", 2);
  E("weather-radar", "doppler-radar", "part", 2);
  E("weather-radar", "radar-echo", "part", 2);
  E("meteo-satellite", "polar-satellite", "part", 2);
  E("meteo-satellite", "geo-satellite", "part", 2);
  E("polar-satellite", "geo-satellite", "contrast", 2);
  E("geo-satellite", "cloud-image", "apply", 2);
  E("weather-map", "surface-chart", "part", 2);
  E("weather-map", "upper-chart", "part", 2);
  E("doppler-radar", "tornado", "apply", 2);
  E("radar-echo", "nowcasting", "apply", 2);

  /* I 预报 */
  E("nowcasting", "short-range", "related", 1);
  E("short-range", "medium-range", "prereq", 2);
  E("medium-range", "long-range", "prereq", 2);
  E("short-range", "long-range", "contrast", 1);
  E("nwp", "nwp-model", "part", 3);
  E("nwp-model", "initial-field", "prereq", 3);
  E("initial-field", "data-assim", "prereq", 3);
  E("data-assim", "upper-air-obs", "apply", 2);
  E("nwp", "ensemble", "part", 2);
  E("nwp", "verification", "apply", 2);
  E("synoptic-analysis", "weather-map", "apply", 3);
  E("short-range", "synoptic-analysis", "prereq", 2);
  E("warning-signal", "rainstorm-warning", "part", 2);
  E("warning-signal", "typhoon-warning", "part", 2);
  E("warning-signal", "lightning-warning", "part", 2);
  E("forecast-service", "warning-signal", "apply", 2);
  E("ensemble", "extreme-weather", "apply", 2);

  /* J 气候 */
  E("climate-system", "climatology", "part", 3);
  E("climate-system", "climate-model", "prereq", 2);
  E("climatology", "climate-anomaly", "prereq", 2);
  E("la-nina", "southern-osc", "related", 2);
  E("southern-osc", "enso", "part", 3);
  E("la-nina", "enso", "part", 2);
  E("nao", "ao", "related", 1);
  E("ao", "pdo", "related", 1);
  E("climate-model", "climate-prediction", "apply", 3);
  E("climate-prediction", "long-range", "related", 2);
  E("extreme-weather", "rainstorm", "related", 2);
  E("extreme-weather", "drought-index", "apply", 2);
  E("radiative-forcing", "energy-balance", "related", 2);
  E("climate-abrupt", "paleoclimate", "prereq", 2);
  E("enso", "east-asian-monsoon", "related", 2);

  /* K 化学 */
  E("ozone-layer", "strat-ozone", "part", 3);
  E("strat-ozone", "ozone-depletion", "related", 2);
  E("ozone-depletion", "ozone-hole", "related", 3);
  E("aerosol", "sulfate-aerosol", "part", 2);
  E("aerosol", "dust-aerosol", "part", 2);
  E("aerosol", "volcanic-aerosol", "part", 2);
  E("sulfate-aerosol", "aerosol-radiation", "part", 2);
  E("dust-aerosol", "aerosol-radiation", "part", 2);
  E("volcanic-aerosol", "aerosol-radiation", "part", 2);
  E("aerosol-radiation", "radiative-forcing", "apply", 2);
  E("aerosol", "ccn", "related", 2);
  E("oxidation-capacity", "ozone-depletion", "related", 1);

  /* 跨板块联系 */
  E("solar-radiation", "itcz", "related", 2);
  E("itcz", "cumulonimbus", "apply", 2);
  E("subtropical-high", "abs-stable", "apply", 2);
  E("blocking-high", "meiyu", "related", 1);
  E("rain-gauge", "rainstorm", "apply", 2);
  E("cloud-image", "typhoon", "apply", 2);
  E("upper-chart", "westerly-trough", "apply", 2);
  E("surface-chart", "frontal-cyclone", "apply", 2);
  E("nimbostratus", "meiyu", "related", 2);
  E("cumulonimbus", "squall-line", "related", 2);
  E("freezing-rain", "temperature-inversion", "apply", 2);
  E("fog", "radiation-fog", "part", 2);
  E("gust", "cold-front", "related", 2);
  E("enso", "climate-anomaly", "apply", 2);
  E("pdo", "climate-abrupt", "related", 1);
  E("volcanic-aerosol", "paleoclimate", "related", 1);
  E("aerosol-radiation", "energy-balance", "related", 2);
  E("insolation", "albedo", "related", 1);
  E("weather-radar", "nowcasting", "apply", 2);
  E("geo-satellite", "nowcasting", "apply", 2);
  E("ensemble", "verification", "apply", 2);
  E("drought-index", "long-range", "apply", 2);
  E("monsoon-index", "enso", "related", 1);
  E("frontal-slope", "nimbostratus", "related", 1);
  E("cold-high", "radiation-inversion", "apply", 2);
  E("trade-wind", "easterly-wave", "related", 1);
  E("thermal-wind", "westerly", "related", 1);
  E("warm-front", "nimbostratus", "related", 1);
  E("typhoon", "rainstorm", "related", 1);
  E("thunderstorm", "rainstorm", "related", 1);
  E("blocking-high", "cutoff-low", "related", 1);
  E("strat-ozone", "shortwave", "related", 1);
  E("ozone-hole", "paleoclimate", "related", 1);
  E("sulfate-aerosol", "scattering", "related", 1);
  E("dust-aerosol", "scattering", "related", 1);
  E("volcanic-aerosol", "longwave", "related", 1);
  E("radiosonde", "initial-field", "apply", 2);
  E("auto-station", "data-assim", "apply", 2);
  E("rain-gauge", "hydrometeor", "related", 1);
  E("thermo-hygrometer", "relative-humidity", "related", 1);
  E("stevenson-screen", "air-temp", "related", 1);
  E("surface-chart", "isobar", "apply", 2);
  E("forecast-service", "nwp", "apply", 2);
  E("nao", "icelandic-low", "related", 1);
  E("ao", "polar-easterly", "related", 1);
  E("enso", "itcz", "related", 1);
  E("cold-high", "cold-front", "related", 1);
  E("typhoon-eye", "downburst", "related", 1);
  E("tornado", "gust", "related", 1);
  E("graupel", "hail", "related", 1);
  E("snow", "freezing-rain", "related", 1);
  E("altocumulus", "stratocumulus", "related", 1);
  E("cutoff-low", "westerly", "related", 1);
  E("scattering", "shortwave", "related", 1);
  E("itcz", "rainstorm", "related", 1);
  E("fog", "advection-fog", "related", 1);
  E("dew-point", "frost", "related", 1);
  E("polar-easterly", "westerly", "contrast", 2);
  E("trade-wind", "westerly", "contrast", 1);
  E("rain", "snow", "contrast", 2);
  E("dew", "frost", "contrast", 1);
  E("hadley", "polar-cell", "contrast", 1);
})();
