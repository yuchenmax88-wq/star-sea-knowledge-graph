/* 桥接边：将孤岛簇连到主分量 */
const fs = require("fs");
const path = require("path");
const ROOT = path.resolve(__dirname, "..", "..");

// 桥接边列表：[src, dst, type, strength]
// 方向铁律：part 主→部件；prereq 基础→进阶；related 双向均可但 src 写主分量侧
const bridges = {
  economics: [
    // 劳动簇 -> 既有主分量：labor-economics / unemployment
    ["economics-supply", "economics-labor-force", "prereq", 2],
    ["economics-labor-force", "economics-participation-rate", "related", 2],
    // 贸易簇 -> 既有主分量：comparative-advantage
    ["economics-comparative-advantage", "economics-factor-endowment", "prereq", 2],
    ["economics-factor-endowment", "economics-ho-theorem", "prereq", 2],
    ["economics-ho-theorem", "economics-leontief", "related", 2]
  ],
  law: [
    // 先例簇 -> 既有主分量：legal-precedent / legal-reasoning
    ["law-precedent-system", "law-precedent", "part", 3],
    ["law-precedent", "law-ratio-decidi", "prereq", 2],
    // 共犯簇 -> 既有主分量：joint-offense
    ["law-joint-offense", "law-joint-principal", "part", 3],
    ["law-joint-principal", "law-accessory", "related", 2],
    ["law-joint-principal", "law-instigator", "related", 2]
  ],
  market: [
    // 技术簇 -> 既有主分量：grid-operations / ancillary-services
    ["market-grid-operations", "market-voltage-control", "part", 2],
    ["market-voltage-control", "market-reactive-power", "part", 2],
    ["market-reactive-power", "market-shunt-capacitor", "part", 2],
    ["market-reactive-power", "market-statcom", "part", 2],
    ["market-transmission", "market-hvdc", "part", 2],
    ["market-transmission", "market-offshore-grid", "part", 2],
    ["market-heat-pump", "market-power-to-heat", "related", 2],
    // 零售/社会簇 -> 既有主分量：retail-market
    ["market-retail-market", "market-churn", "related", 2],
    ["market-retail-market", "market-switching-right", "related", 2],
    ["market-retail-market", "market-vulnerable-customer", "related", 2],
    ["market-vulnerable-customer", "market-energy-poverty", "related", 2],
    ["market-vulnerable-customer", "market-social-tariff", "related", 2],
    // 市场运营簇 -> 既有主分量：balancing-market / bidding
    ["market-balancing-market", "market-brp", "part", 2],
    ["market-balancing-market", "market-bsp", "part", 2],
    ["market-bidding", "market-nomination", "prereq", 2],
    ["market-bidding", "market-offer-cap", "part", 2],
    ["market-bidding", "market-bid-floor", "part", 2],
    ["market-bidding", "market-mitigation", "apply", 2],
    // 能源转型簇 -> 既有主分量：decarbonization / energy-transition
    ["market-energy-transition", "market-decarbonization", "part", 3],
    ["market-energy-transition", "market-electrification", "part", 2],
    ["market-energy-transition", "market-sector-coupling", "part", 2],
    ["market-sector-coupling", "market-power-to-heat", "part", 2],
    ["market-sector-coupling", "market-power-to-gas", "part", 2],
    ["market-power-to-gas", "market-green-h2", "part", 2],
    ["market-energy-transition", "market-just-transition", "related", 2],
    ["market-energy-transition", "market-stranded-asset", "related", 2],
    // 应急运行簇 -> 既有主分量：emergency
    ["market-emergency", "market-load-shedding", "part", 2],
    ["market-load-shedding", "market-rolling-blackout", "related", 2],
    ["market-emergency", "market-voltage-reduction", "part", 2],
    ["market-emergency", "market-emergency-ops", "related", 2],
    // 数据簇 -> 既有主分量：market-data
    ["market-market-data", "market-api", "part", 2],
    ["market-market-data", "market-open-data", "part", 2]
  ],
  sociology: [
    // 韦伯理论簇 -> 既有主分量：sociology-theory
    ["sociology-theory", "sociology-ideal-type", "part", 2],
    ["sociology-ideal-type", "sociology-verstehen", "prereq", 2],
    // 方法簇 -> 既有主分量：sociology-method
    ["sociology-methodology", "sociology-reliability", "part", 2],
    ["sociology-reliability", "sociology-validity", "related", 2],
    // 社会化/角色簇 -> 既有主分量：socialization / self
    ["sociology-socialization", "sociology-role-taking", "prereq", 2],
    ["sociology-role-taking", "sociology-generalized-other", "prereq", 2],
    ["sociology-self-concept", "sociology-looking-glass-self", "prereq", 2],
    ["sociology-socialization", "sociology-self-concept", "prereq", 2],
    ["sociology-social-role", "sociology-role-conflict", "part", 2],
    ["sociology-social-role", "sociology-role-strain", "part", 2],
    ["sociology-social-status", "sociology-status-set", "part", 2],
    ["sociology-status-set", "sociology-ascribed-status", "part", 2],
    ["sociology-status-set", "sociology-achieved-status", "part", 2],
    // 群体簇 -> 既有主分量：social-group
    ["sociology-social-group", "sociology-in-group", "part", 2],
    ["sociology-in-group", "sociology-out-group", "contrast", 3],
    ["sociology-social-group", "sociology-reference-group", "part", 2],
    // 权力/声望簇 -> 既有主分量：stratification
    ["sociology-social-stratification", "sociology-prestige", "part", 2],
    ["sociology-social-stratification", "sociology-power", "part", 2],
    ["sociology-power", "sociology-authority", "prereq", 2],
    ["sociology-authority", "sociology-traditional-authority", "part", 2],
    ["sociology-authority", "sociology-charismatic-authority", "part", 2],
    ["sociology-authority", "sociology-rational-legal", "part", 2],
    // 性别簇 -> 既有主分量：gender
    ["sociology-gender", "sociology-patriarchy", "part", 2],
    ["sociology-patriarchy", "sociology-gender-role", "prereq", 2],
    ["sociology-gender-role", "sociology-gender-socialization", "prereq", 2],
    ["sociology-gender-role", "sociology-sexism", "related", 2],
    ["sociology-gender-role", "sociology-second-shift", "apply", 2],
    // 教育簇 -> 既有主分量：education
    ["sociology-education-sociology", "sociology-education-function", "part", 2],
    ["sociology-education-sociology", "sociology-credentialism", "part", 2],
    // 宗教簇 -> 既有主分量：religion
    ["sociology-religion-sociology", "sociology-church-sect", "part", 2],
    ["sociology-church-sect", "sociology-cult", "related", 2],
    // 劳动簇 -> 既有主分量：work
    ["sociology-work-sociology", "sociology-labor-market", "part", 2],
    ["sociology-labor-market", "sociology-division-labor-gender", "part", 2],
    ["sociology-work-sociology", "sociology-alienation", "part", 2],
    ["sociology-social-stratification", "sociology-prestige-occupation", "related", 2],
    // 族群簇 -> 既有主分量：race-ethnicity
    ["sociology-race-ethnicity", "sociology-assimilation", "part", 2],
    ["sociology-assimilation", "sociology-pluralism", "contrast", 3]
  ]
};

// 先验证所有 src/dst id 存在
for (const [dom, edges] of Object.entries(bridges)) {
  const sb = { window: {} };
  new Function("window", fs.readFileSync(path.join(ROOT, "assets/data/domains", dom + ".js"), "utf8"))(sb.window);
  const ids = new Set(sb.window.KG.nodes.map(n => n.id));
  const existingEdges = new Set(sb.window.KG.edges.map(e => e[0] + "|" + e[1]));
  const valid = [];
  for (const e of edges) {
    if (!ids.has(e[0])) { console.log(dom + " MISSING src:", e[0]); continue; }
    if (!ids.has(e[1])) { console.log(dom + " MISSING dst:", e[1]); continue; }
    if (existingEdges.has(e[0] + "|" + e[1])) { console.log(dom + " DUP:", e[0], e[1]); continue; }
    valid.push(e);
  }
  console.log(dom + ": " + valid.length + " valid bridge edges");
  // 追加到 domain 文件末尾
  const f = path.join(ROOT, "assets/data/domains", dom + ".js");
  let src = fs.readFileSync(f, "utf8");
  src += "\n/* ===== 桥接边 ===== */\n(function(){var KG=window.KG;KG.edges.push(\n";
  src += valid.map(e => '    ["' + e[0] + '", "' + e[1] + '", "' + e[2] + '", ' + e[3] + ']').join(",\n");
  src += "\n);})();\n";
  fs.writeFileSync(f, src, "utf8");
}
