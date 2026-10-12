/* 桥接边 v2：正确锚点 */
const fs = require("fs");
const path = require("path");
const ROOT = path.resolve(__dirname, "..", "..");

const bridges = {
  economics: [
    // 劳动簇 -> 主分量：economics-supply / economics-unemployment
    ["economics-supply", "economics-labor-force", "prereq", 2],
    ["economics-unemployment", "economics-participation-rate", "related", 2],
    // 贸易簇 -> 主分量：economics-comparative-advantage / economics-trade-benefit
    ["economics-comparative-advantage", "economics-factor-endowment", "prereq", 2],
    ["economics-trade-benefit", "economics-ho-theorem", "related", 2],
    ["economics-ho-theorem", "economics-leontief", "related", 2]
  ],
  law: [
    // 先例簇 -> 主分量：law-court / law-judicial-review
    ["law-court", "law-precedent", "part", 2],
    ["law-precedent", "law-ratio-decidi", "prereq", 2],
    // 共犯簇 -> 主分量：law-criminallaw / law-accomplice
    ["law-criminallaw", "law-joint-principal", "part", 3],
    ["law-accomplice", "law-joint-principal", "related", 2],
    ["law-joint-principal", "law-instigator", "related", 2]
  ],
  market: [
    // 技术簇 -> 主分量：market-grid / market-tso / market-ancillary
    ["market-grid", "market-voltage-control", "part", 2],
    ["market-ancillary", "market-reactive-power", "part", 2],
    ["market-reactive-power", "market-shunt-capacitor", "part", 2],
    ["market-reactive-power", "market-statcom", "part", 2],
    ["market-tso", "market-hvdc", "part", 2],
    ["market-tso", "market-offshore-grid", "part", 2],
    ["market-hems", "market-heat-pump", "related", 2],
    // 零售/社会簇 -> 主分量：market-retail-competition / market-user
    ["market-retail-competition", "market-churn", "related", 2],
    ["market-retail-competition", "market-switching-right", "related", 2],
    ["market-user", "market-vulnerable-customer", "part", 2],
    ["market-vulnerable-customer", "market-energy-poverty", "related", 2],
    ["market-vulnerable-customer", "market-social-tariff", "related", 2],
    // 市场运营簇 -> 主分量：market-bid-offer / market-price-cap / market-clearing
    ["market-bid-offer", "market-nomination", "prereq", 2],
    ["market-clearing", "market-brp", "part", 2],
    ["market-ancillary-market", "market-bsp", "part", 2],
    ["market-price-cap", "market-offer-cap", "related", 2],
    ["market-price-cap", "market-bid-floor", "related", 2],
    ["market-price-formation", "market-mitigation", "apply", 2],
    // 能源转型簇 -> 主分量：market-green-market / market-carbon-market / market-esg
    ["market-green-market", "market-decarbonization", "part", 2],
    ["market-esg", "market-electrification", "related", 2],
    ["market-market-coupling", "market-sector-coupling", "related", 2],
    ["market-sector-coupling", "market-power-to-heat", "part", 2],
    ["market-sector-coupling", "market-power-to-gas", "part", 2],
    ["market-power-to-gas", "market-green-h2", "part", 2],
    ["market-esg", "market-just-transition", "related", 2],
    ["market-carbon-market", "market-stranded-asset", "related", 2],
    // 应急簇 -> 主分量：market-reliability / market-resilience / market-restoration
    ["market-reliability", "market-load-shedding", "part", 2],
    ["market-load-shedding", "market-rolling-blackout", "related", 2],
    ["market-resilience", "market-voltage-reduction", "part", 2],
    ["market-restoration", "market-emergency-ops", "related", 2],
    // 数据簇 -> 主分量：market-price-data / market-disclosure-data
    ["market-price-data", "market-api", "part", 2],
    ["market-disclosure-data", "market-open-data", "part", 2]
  ],
  sociology: [
    // 韦伯理论簇 -> 主分量：sociology-social-theory
    ["sociology-social-theory", "sociology-ideal-type", "part", 2],
    ["sociology-ideal-type", "sociology-verstehen", "prereq", 2],
    // 方法簇 -> 主分量：sociology-social-research (need to check)
    ["sociology-social-action", "sociology-reliability", "related", 2],
    ["sociology-reliability", "sociology-validity", "related", 2],
    // 社会化/角色簇 -> 主分量：sociology-social-interaction / sociology-social-action
    ["sociology-social-interaction", "sociology-role-taking", "part", 2],
    ["sociology-role-taking", "sociology-generalized-other", "prereq", 2],
    ["sociology-social-interaction", "sociology-self-concept", "part", 2],
    ["sociology-self-concept", "sociology-looking-glass-self", "prereq", 2],
    ["sociology-social-norm", "sociology-role-conflict", "apply", 2],
    ["sociology-social-norm", "sociology-role-strain", "apply", 2],
    ["sociology-stratum", "sociology-status-set", "part", 2],
    ["sociology-status-set", "sociology-ascribed-status", "part", 2],
    ["sociology-status-set", "sociology-achieved-status", "part", 2],
    // 群体簇 -> 主分量：sociology-social-group
    ["sociology-social-group", "sociology-in-group", "part", 2],
    ["sociology-in-group", "sociology-out-group", "contrast", 3],
    ["sociology-social-group", "sociology-reference-group", "part", 2],
    // 权力/声望簇 -> 主分量：sociology-stratification / sociology-social-class
    ["sociology-stratification", "sociology-prestige", "part", 2],
    ["sociology-social-class", "sociology-power", "part", 2],
    ["sociology-power", "sociology-authority", "prereq", 2],
    ["sociology-authority", "sociology-traditional-authority", "part", 2],
    ["sociology-authority", "sociology-charismatic-authority", "part", 2],
    ["sociology-authority", "sociology-rational-legal", "part", 2],
    // 性别簇 -> 主分量：sociology-social-norm / sociology-social-value
    ["sociology-social-value", "sociology-patriarchy", "related", 2],
    ["sociology-patriarchy", "sociology-gender-role", "prereq", 2],
    ["sociology-gender-role", "sociology-gender-socialization", "prereq", 2],
    ["sociology-social-norm", "sociology-sexism", "related", 2],
    ["sociology-gender-role", "sociology-second-shift", "apply", 2],
    // 教育簇 -> 主分量：sociology-education-sociology
    ["sociology-education-sociology", "sociology-education-function", "part", 2],
    ["sociology-education-sociology", "sociology-credentialism", "part", 2],
    // 宗教簇 -> 主分量：sociology-social-integration
    ["sociology-social-integration", "sociology-church-sect", "part", 2],
    ["sociology-church-sect", "sociology-cult", "related", 2],
    // 劳动簇 -> 主分量：sociology-stratum / sociology-social-stratification
    ["sociology-social-stratification", "sociology-labor-market", "part", 2],
    ["sociology-labor-market", "sociology-division-labor-gender", "part", 2],
    ["sociology-social-action", "sociology-alienation", "related", 2],
    ["sociology-stratum", "sociology-prestige-occupation", "related", 2],
    // 族群簇 -> 主分量：sociology-social-problem
    ["sociology-social-problem", "sociology-assimilation", "part", 2],
    ["sociology-assimilation", "sociology-pluralism", "contrast", 3]
  ]
};

// 验证并追加
let totalValid = 0;
for (const [dom, edges] of Object.entries(bridges)) {
  const sb = { window: {} };
  new Function("window", fs.readFileSync(path.join(ROOT, "assets/data/domains", dom + ".js"), "utf8"))(sb.window);
  const ids = new Set(sb.window.KG.nodes.map(n => n.id));
  const existingEdges = new Set(sb.window.KG.edges.map(e => e[0] + "|" + e[1]));
  const valid = [];
  for (const e of edges) {
    if (!ids.has(e[0])) { console.log(dom + " MISS src:", e[0]); continue; }
    if (!ids.has(e[1])) { console.log(dom + " MISS dst:", e[1]); continue; }
    if (existingEdges.has(e[0] + "|" + e[1])) { console.log(dom + " DUP:", e[0], e[1]); continue; }
    valid.push(e);
  }
  totalValid += valid.length;
  console.log(dom + ": " + valid.length + " valid bridge edges");
  if (valid.length === 0) continue;
  const f = path.join(ROOT, "assets/data/domains", dom + ".js");
  let src = fs.readFileSync(f, "utf8");
  src += "\n/* ===== 桥接边 ===== */\n(function(){var KG=window.KG;KG.edges.push(\n";
  src += valid.map(e => '    ["' + e[0] + '", "' + e[1] + '", "' + e[2] + '", ' + e[3] + ']').join(",\n");
  src += "\n);})();\n";
  fs.writeFileSync(f, src, "utf8");
}
console.log("total bridge edges: " + totalValid);
