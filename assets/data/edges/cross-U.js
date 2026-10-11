/* 跨领域关系 · U 组（psychology 心理学 / law 法学 / sociology 社会学 / management 管理学） */
(function () {
  var KG = window.KG || (window.KG = { nodes: [], edges: [] });
  window.KG = KG;

  KG.edges.push(
    /* ===== 1. psychology ↔ biology 遗传与演化 ===== */
    ["biology-mendel", "psychology-heredity", "prereq", 2],
    ["psychology-heredity", "biology-mutation", "related", 1],
    ["psychology-basic", "biology-evolution", "apply", 1],
    ["psychology-neurotransmitter", "biology-protein", "apply", 1],
    ["psychology-development", "biology-embryonic-development", "apply", 1],

    /* ===== 2. psychology ↔ medicine 脑与神经 ===== */
    ["psychology-neuron", "medicine-neuron", "related", 3],
    ["psychology-nervous", "medicine-nerve", "related", 3],
    ["psychology-synapse", "medicine-synapse", "related", 2],
    ["psychology-brain", "medicine-cns", "apply", 2],
    ["medicine-cns", "psychology-cortex", "part", 1],
    ["psychology-endocrine", "medicine-endocrine", "related", 2],
    ["psychology-imaging", "medicine-imaging", "related", 2],
    ["psychology-stress", "medicine-homeostasis", "apply", 2],

    /* ===== 3. psychology ↔ philosophy 意识与认知 ===== */
    ["psychology-consciousness", "philosophy-mind", "related", 3],
    ["psychology-thinking", "philosophy-epistemology", "apply", 2],
    ["psychology-decision", "philosophy-rationalism", "apply", 1],
    ["psychology-decision", "philosophy-freewill", "related", 1],
    ["psychology-self", "philosophy-hume-self", "related", 2],
    ["psychology-humanistic", "philosophy-existentialism", "related", 2],

    /* ===== 4. psychology ↔ education 学习与测量 ===== */
    ["psychology-learning", "education-learning-theory", "related", 3],
    ["psychology-conditioning", "education-behaviorism", "related", 3],
    ["psychology-cognition", "education-cognitivism", "related", 3],
    ["psychology-attachment", "education-attachment", "related", 2],
    ["psychology-motivation", "education-motivation", "related", 2],
    ["psychology-attention", "education-attention", "related", 2],
    ["psychology-memory", "education-memory", "related", 2],
    ["psychology-reliability", "education-reliability", "related", 2],
    ["psychology-validity", "education-validity", "related", 2],
    ["psychology-development", "education-cognitive-dev", "related", 1],

    /* ===== 5. psychology ↔ linguistics 语言 ===== */
    ["psychology-language", "linguistics-language", "related", 3],
    ["psychology-thinking", "linguistics-semantics", "apply", 1],
    ["psychology-decision", "linguistics-pragmatics", "apply", 1],

    /* ===== 6. psychology ↔ sociology 社会心理 ===== */
    ["psychology-socialization", "sociology-socialization", "related", 3],
    ["psychology-role", "sociology-social-role", "related", 3],
    ["psychology-social", "sociology-social-attitude", "apply", 2],
    ["psychology-attribution", "sociology-social-attitude", "apply", 1],
    ["psychology-conformity", "sociology-social-norm", "related", 2],
    ["psychology-prejudice", "sociology-discrimination", "related", 2],
    ["psychology-group", "sociology-social-group", "related", 2],
    ["psychology-attraction", "sociology-primary-group", "apply", 1],
    ["psychology-prosocial", "sociology-social-norm", "apply", 1],
    ["psychology-obedience", "sociology-social-control", "apply", 1],
    ["psychology-self", "sociology-social-network", "related", 1],

    /* ===== 7. psychology ↔ management 组织与动机 ===== */
    ["psychology-motivation", "management-motivation", "related", 3],
    ["psychology-need", "management-maslow", "related", 3],
    ["psychology-decision", "management-decision", "related", 3],
    ["psychology-personality", "management-manager-skill", "apply", 1],
    ["psychology-organizational", "management-hrm", "related", 3],
    ["psychology-emotion", "management-leadership", "apply", 1],
    ["psychology-attitude", "management-organizational-culture", "apply", 1],
    ["psychology-self-efficacy", "management-expectancy", "apply", 2],
    ["psychology-group", "management-team", "apply", 2],

    /* ===== 8. psychology ↔ law ===== */
    ["psychology-cognition", "law-evidence", "apply", 1],
    ["psychology-development", "law-citizen-right", "related", 1],
    ["psychology-abnormal", "law-crime", "related", 1],

    /* ===== 9. law ↔ philosophy 法理 ===== */
    ["law-jurisprudence", "philosophy-justice-society", "related", 3],
    ["law-rule", "philosophy-justice-society", "related", 2],
    ["law-nature", "philosophy-metaphysics", "apply", 1],
    ["law-interpretation", "philosophy-logic", "apply", 2],
    ["law-right", "philosophy-locke-property", "related", 2],
    ["law-ethics-law", "philosophy-virtue-ethics", "related", 1],
    ["law-constitution", "philosophy-rousseau", "apply", 1],

    /* ===== 10. law ↔ whist 西方法制史 ===== */
    ["law-history", "whist-roman-law", "related", 3],
    ["law-jurisprudence", "whist-justinian", "related", 2],
    ["law-contract", "whist-hammurabi", "related", 1],
    ["law-international-public", "whist-westphalia", "apply", 1],
    ["law-treaty", "whist-westphalia", "related", 1],
    ["law-legal-profession", "whist-rome-republic", "related", 1],

    /* ===== 11. law ↔ chist 中国法制史 ===== */
    ["law-history", "chist-tanglu", "related", 3],
    ["law-constitution", "chist-minhuo", "apply", 1],
    ["law-admin-action", "chist-sansheng", "related", 1],
    ["law-criminallaw", "chist-jinyiwei", "related", 1],

    /* ===== 12. law ↔ economics 经济法 ===== */
    ["law-contract", "economics-contract", "related", 3],
    ["law-businesslaw", "economics-transaction-cost", "apply", 2],
    ["law-tax", "economics-fiscal-policy", "apply", 2],
    ["law-ip", "economics-property-rights", "apply", 2],
    ["law-monopoly", "economics-monopoly", "related", 3],
    ["law-rule", "economics-rule-of-law", "related", 3],
    ["law-consumer", "economics-information-asymmetry", "apply", 2],
    ["law-securities", "economics-financial-market", "apply", 2],

    /* ===== 13. law ↔ practice ===== */
    ["law-evidence", "practice-root-cause", "apply", 1],
    ["law-legal-document", "practice-doc-template", "apply", 1],
    ["law-ethics-law", "practice-ip-confidentiality", "related", 1],

    /* ===== 14. law ↔ medicine 医事法 ===== */
    ["law-ip", "medicine-pharmacology", "related", 2],
    ["law-ethics-law", "medicine-ethics", "related", 2],
    ["law-civil-subject", "medicine-consent", "apply", 1],

    /* ===== 15. law ↔ biology 法庭科学 ===== */
    ["law-evidence", "biology-pcr", "apply", 1],

    /* ===== 16. law ↔ sociology ===== */
    ["law-crime", "sociology-crime", "related", 3],
    ["law-admin-action", "sociology-formal-org", "apply", 1],
    ["law-relation", "sociology-institution", "apply", 2],
    ["economics-institution", "sociology-institution", "related", 1],
    ["law-tort", "sociology-deviance", "apply", 1],
    ["law-court", "sociology-community", "related", 1],
    ["law-evidence", "sociology-crime", "apply", 1],

    /* ===== 17. law ↔ management ===== */
    ["law-company", "management-organizational-design", "apply", 2],
    ["law-labor", "management-labor-relations", "related", 3],
    ["law-contract", "management-strategic-plan", "related", 1],
    ["law-ip", "management-innovation", "apply", 2],
    ["law-tax", "management-financial-analysis", "apply", 1],
    ["law-businesslaw", "management-entrepreneurship", "apply", 1],
    ["law-competition", "management-marketing", "apply", 1],

    /* ===== 18. sociology ↔ economics 分层与贫困 ===== */
    ["sociology-class", "economics-marxism", "related", 2],
    ["sociology-poverty", "economics-poverty-trap", "related", 3],
    ["sociology-wealth-gap", "economics-capital-accumulation", "apply", 1],
    ["sociology-unemployment", "economics-unemployment", "related", 3],
    ["sociology-consumption", "economics-demand", "apply", 2],
    ["sociology-social-mobility", "economics-opportunity-cost", "related", 1],

    /* ===== 19. sociology ↔ whist 社会变迁 ===== */
    ["sociology-change", "whist-industrial-rev", "related", 2],
    ["sociology-modernization", "whist-enlightenment", "apply", 1],
    ["sociology-urbanization", "whist-urbanization", "related", 3],
    ["sociology-globalization", "whist-globalization", "related", 3],

    /* ===== 20. sociology ↔ philosophy ===== */
    ["sociology-marx", "philosophy-marx", "related", 3],
    ["sociology-weber", "philosophy-hobbes", "contrast", 1],
    ["sociology-functionalism", "philosophy-utilitarian", "contrast", 1],

    /* ===== 21. sociology ↔ education ===== */
    ["sociology-education-sociology", "education-social", "related", 3],
    ["sociology-education-inequality", "education-equity", "related", 3],
    ["sociology-socialization", "education-function", "apply", 2],
    ["sociology-research-method", "education-survey", "related", 1],

    /* ===== 22. sociology ↔ medicine ===== */
    ["sociology-medical-sociology", "medicine-health-system", "related", 3],
    ["sociology-aging-problem", "medicine-chronic", "apply", 1],

    /* ===== 23. sociology ↔ biology 人口 ===== */
    ["sociology-population", "biology-population-growth", "related", 2],

    /* ===== 24. sociology ↔ chist ===== */
    ["sociology-change", "chist-xinhai", "apply", 1],
    ["sociology-class", "chist-menfa", "related", 1],

    /* ===== 25. sociology ↔ linguistics ===== */
    ["sociology-culture", "linguistics-language", "apply", 1],

    /* ===== 26. sociology ↔ management ===== */
    ["sociology-bureaucracy", "management-bureaucracy-weber", "related", 3],
    ["sociology-formal-org", "management-organization-structure", "related", 3],
    ["sociology-social-network", "management-communication", "apply", 1],
    ["sociology-inequality", "management-compensation", "apply", 1],
    ["sociology-public-policy", "management-stakeholder", "apply", 1],
    ["sociology-social-capital", "management-organizational-culture", "related", 2],
    ["sociology-social-movement", "management-innovation", "apply", 1],

    /* ===== 27. management ↔ economics 经营 ===== */
    ["management-strategic-plan", "economics-marginal-analysis", "apply", 1],
    ["management-operations", "economics-supply", "apply", 1],
    ["management-financial-analysis", "economics-money-supply", "related", 1],
    ["management-innovation", "economics-economic-growth", "apply", 2],
    ["management-marketing", "economics-demand", "apply", 2],
    ["management-budget", "economics-fiscal-policy", "apply", 1],
    ["management-portfolio", "economics-financial-market", "apply", 1],

    /* ===== 28. management ↔ practice 项目与质量 ===== */
    ["management-project", "practice-project-lifecycle", "related", 3],
    ["management-planning-fn", "practice-schedule-planning", "related", 2],
    ["management-risk-mgmt", "practice-risk-management", "related", 3],
    ["management-quality", "practice-quality-management", "related", 3],
    ["management-cost", "practice-cost-estimation", "related", 2],
    ["management-organizational-change", "practice-change-control", "apply", 1],

    /* ===== 29. management ↔ market ===== */
    ["management-marketing", "market-design-principle", "apply", 1],
    ["management-strategic-plan", "market-long-term", "apply", 1],
    ["management-operations", "market-clearing", "related", 1],

    /* ===== 30. management ↔ philosophy / education ===== */
    ["management-decision", "philosophy-utilitarian", "apply", 1],
    ["management-organizational-culture", "philosophy-confucius", "related", 1],
    ["management-training", "education-instructional-design", "apply", 2],
    ["management-hrm", "education-human-capital", "related", 2],

    /* ===== 31. 补充 ===== */
    ["psychology-depression", "medicine-chronic", "related", 1],
    ["law-labor-dispute", "management-labor-relations", "apply", 1],
    ["management-delegation", "practice-technical-disclosure", "apply", 1],
    ["sociology-education-sociology", "education-curriculum", "apply", 1],
    ["psychology-intelligence", "education-individual-diff", "apply", 1],
    ["management-training", "education-vocational", "related", 1],
    ["law-insurance", "economics-commercial-bank", "related", 1],
    ["law-tax", "chist-yanchui", "related", 1],
    ["psychology-oldage", "sociology-aging-problem", "related", 2],

    /* ===== 32. 孤岛连通（婚姻家庭法） ===== */
    ["law-marriage", "sociology-family", "related", 2],
    ["law-divorce", "sociology-family", "related", 1],
    ["law-inheritance", "sociology-family", "related", 1],
    ["law-justifiable-defense", "sociology-deviance", "related", 1],
    ["law-emergency-avoidance", "sociology-deviance", "related", 1],

    /* ===== 33. 孤岛连通（心理学方法） ===== */
    ["psychology-psychology", "philosophy-mind", "related", 2],
    ["psychology-research", "sociology-research-method", "related", 2],
    ["psychology-experiment", "sociology-research-method", "related", 1],
    ["psychology-observation", "sociology-research-method", "related", 1],
    ["psychology-survey", "sociology-survey-research", "related", 2],
    ["psychology-case", "sociology-case-study", "related", 1],
    ["psychology-variable", "sociology-research-method", "apply", 1],
    ["psychology-ethics", "sociology-ethics-soc", "related", 2],

    /* ===== 34. 孤岛连通（社会学基本概念） ===== */
    ["sociology-sociology", "philosophy-marx", "related", 2],
    ["sociology-social-fact", "philosophy-epistemology", "apply", 1],
    ["sociology-ethnic-minority", "whist-globalization", "related", 1],
    ["sociology-ethnicity", "whist-globalization", "related", 1]
  );
})();
