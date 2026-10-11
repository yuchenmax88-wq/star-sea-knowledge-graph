/* 跨领域关系 · T 组（security 网络安全 / database 数据库与数据工程 / software 软件工程 / statistics 统计学） */
(function () {
  var KG = window.KG || (window.KG = { nodes: [], edges: [] });
  window.KG = KG;

  KG.edges.push(
    /* ===== 1. security ↔ comm 网络通信（网络安全） ===== */
    ["security-firewall", "comm-osi", "apply", 1],
    ["security-ids", "comm-osi", "apply", 2],
    ["security-waf", "comm-application-layer", "apply", 2],
    ["security-tls", "comm-transport-layer", "related", 3],
    ["security-ipsec", "comm-internet-layer", "related", 3],
    ["security-dnssec", "comm-dns", "apply", 2],
    ["security-wifi", "comm-wifi", "related", 2],
    ["security-ssh", "comm-application-layer", "apply", 1],
    ["security-mitm", "comm-tcp", "related", 2],
    ["security-ddos", "comm-congestion-control", "contrast", 2],
    ["security-vpn", "comm-internet-layer", "apply", 2],
    ["security-zero", "comm-osi", "related", 2],
    ["security-sym", "comm-symmetric-encryption", "related", 3],
    ["security-asym", "comm-asymmetric-encryption", "related", 2],
    ["security-baseline", "comm-network-interface-layer", "apply", 1],
    ["security-zerotrust-net", "comm-subnetting", "related", 2],

    /* ===== 2. security ↔ code 程序设计 ===== */
    ["security-buffer", "code-memory-mgmt", "apply", 2],
    ["code-pointer", "security-buffer", "prereq", 2],
    ["security-xss", "code-web-javascript", "apply", 2],
    ["security-sqli", "code-db-sql", "apply", 2],
    ["security-csrf", "code-web-http", "apply", 1],
    ["security-code", "code-se-code-review", "apply", 2],
    ["security-os", "code-os-kernel", "apply", 2],
    ["security-malware", "code-exception", "related", 1],

    /* ===== 3. security ↔ ai 人工智能 ===== */
    ["security-aisec", "ai-llm", "apply", 2],
    ["security-cti", "ai-supervised", "apply", 2],
    ["security-malware", "ai-svm", "apply", 1],
    ["security-phishing", "ai-nb", "apply", 1],
    ["security-redteam", "ai-gan", "contrast", 1],
    ["security-aisec", "ai-alignment", "related", 2],

    /* ===== 4. security ↔ database 数据安全 ===== */
    ["security-data-encrypt", "database-encrypt", "related", 3],
    ["security-dlp", "database-security", "apply", 2],
    ["security-sqli", "database-sql-injection-def", "related", 3],
    ["security-integrity", "database-acid", "apply", 2],
    ["security-backup", "database-backup", "related", 3],
    ["security-audit", "database-audit", "related", 3],
    ["security-classify", "database-de-governance", "apply", 2],
    ["security-dedup", "database-de-quality", "apply", 1],
    ["security-privacy", "database-de-governance", "related", 2],
    ["security-erasure", "database-backup", "contrast", 1],
    ["security-mac", "database-checkpoint", "related", 1],

    /* ===== 5. security ↔ software 安全开发 ===== */
    ["security-devsecops", "software-devops", "related", 3],
    ["security-code", "software-security-dev", "related", 3],
    ["security-pentest", "software-security-test", "apply", 2],
    ["security-patch", "software-vcs", "apply", 1],
    ["security-hardening", "software-deploy-strategy", "apply", 1],
    ["security-supply", "software-artifact", "apply", 2],
    ["security-soar", "software-ci", "apply", 1],
    ["security-incident", "software-cd", "related", 1],
    ["security-baseline", "software-quality-model", "apply", 1],

    /* ===== 6. security ↔ statistics 安全分析 ===== */
    ["security-ids", "statistics-descriptive", "apply", 1],
    ["security-cti", "statistics-correlate", "apply", 1],
    ["security-incident", "statistics-hypothesis", "related", 1],

    /* ===== 7. database ↔ code 程序设计 ===== */
    ["database-sql", "code-db-sql", "related", 3],
    ["database-tx", "code-db-transaction", "related", 3],
    ["database-acid", "code-db-acid", "related", 3],
    ["database-isolation", "code-db-isolation", "related", 2],
    ["database-deadlock", "code-os-deadlock", "related", 3],
    ["database-lock", "code-os-lock", "related", 2],
    ["database-index", "code-db-index", "related", 2],
    ["database-rel-model", "code-db-relational", "related", 2],

    /* ===== 8. database ↔ ai 数据与智能 ===== */
    ["database-de-warehouse", "ai-feature", "apply", 2],
    ["database-de-stream", "ai-mlp", "related", 1],
    ["database-graph", "ai-embedding", "apply", 2],
    ["database-nosql", "ai-rag", "related", 1],

    /* ===== 9. database ↔ signal 数据挖掘 ===== */
    ["database-de-etl", "signal-data-clean", "apply", 2],
    ["database-de-olap", "signal-data-viz", "apply", 1],
    ["database-time", "signal-time-series", "related", 2],
    ["database-de-stream", "signal-feature-eng", "apply", 1],
    ["database-de-batch", "signal-moving-average", "apply", 1],

    /* ===== 10. database ↔ math 数据基础 ===== */
    ["database-btree", "math-tree", "related", 2],
    ["database-raft", "math-graph", "apply", 1],

    /* ===== 11. database ↔ software 数据层与架构 ===== */
    ["database-security", "software-security-dev", "related", 2],
    ["database-backup", "software-deploy-strategy", "apply", 1],
    ["database-conn-pool", "software-microservice", "related", 1],
    ["database-shard", "software-microservice", "apply", 2],
    ["database-replica", "software-cd", "apply", 1],
    ["database-migration", "software-vcs", "apply", 1],
    ["database-tuning", "software-performance-test", "apply", 2],
    ["database-er", "software-usecase", "contrast", 1],
    ["database-data-model", "software-architecture", "apply", 2],
    ["database-nosql", "software-soa", "related", 1],
    ["database-de-pipeline", "software-devops", "related", 2],

    /* ===== 12. database ↔ statistics 数据分析 ===== */
    ["database-de-olap", "statistics-multivariate", "apply", 2],
    ["database-de-quality", "statistics-descriptive", "apply", 1],
    ["database-de-etl", "statistics-questionnaire", "related", 1],
    ["database-de-catalog", "statistics-tabulation", "apply", 1],
    ["database-de-stream", "statistics-timeseries", "apply", 2],
    ["database-time", "statistics-autocorrelation", "apply", 1],
    ["database-de-dimension", "statistics-factor-analysis", "related", 2],
    ["database-opt", "statistics-leastsquares", "related", 1],
    ["database-de-blood", "statistics-tabulation", "related", 1],
    ["database-de-lake", "statistics-multivariate", "apply", 1],

    /* ===== 13. software ↔ code 编程实践 ===== */
    ["software-unit-test", "code-se-unit-test", "related", 3],
    ["software-integration", "code-se-integration-test", "related", 3],
    ["software-tdd", "code-se-tdd", "related", 3],
    ["software-refactor-tech", "code-se-refactor", "related", 3],
    ["software-coding", "code-se-code-style", "related", 2],
    ["software-code-review", "code-se-code-review", "related", 3],
    ["software-vcs", "code-tool-vcs", "related", 3],
    ["software-architecture", "code-se-interface", "apply", 2],
    ["software-clean-code", "code-se-solid", "apply", 2],
    ["software-container", "code-tool-container", "related", 1],
    ["software-branch", "code-tool-branch", "related", 2],
    ["software-pair", "code-se-code-review", "related", 1],

    /* ===== 14. software ↔ practice 工程管理 ===== */
    ["software-planning", "practice-gantt", "apply", 2],
    ["software-estimation", "practice-wbs", "apply", 2],
    ["software-agile", "practice-agile", "related", 3],
    ["software-defect", "practice-root-cause", "apply", 2],
    ["software-risk", "practice-risk-register", "apply", 2],
    ["software-burn-down", "practice-iteration", "related", 2],
    ["software-wbs-soft", "practice-wbs", "related", 2],
    ["software-team", "practice-team-collaboration", "apply", 1],

    /* ===== 15. software ↔ ai 智能系统 ===== */
    ["software-automated-test", "ai-agent", "apply", 1],
    ["software-arch-eval", "ai-interpret", "related", 1],
    ["software-coding", "ai-llm", "apply", 1],
    ["software-reliability", "ai-bias-variance", "related", 1],
    ["software-pipeline", "ai-llm", "related", 1],

    /* ===== 16. software ↔ comm 部署与通信 ===== */
    ["software-container", "comm-iot-gateway", "apply", 1],
    ["software-deploy-strategy", "comm-mqtt", "related", 1],

    /* ===== 17. software ↔ statistics 度量与统计 ===== */
    ["software-estimation", "statistics-samplesize", "apply", 1],
    ["software-metric", "statistics-descriptive", "apply", 2],
    ["software-defect", "statistics-frequency", "apply", 1],
    ["software-performance-test", "statistics-timeseries", "apply", 1],
    ["software-coverage", "statistics-sampling", "contrast", 1],

    /* ===== 18. statistics ↔ math 概率与数学基础 ===== */
    ["statistics-probability", "math-probability", "related", 3],
    ["statistics-expectation", "math-expectation", "related", 3],
    ["statistics-variance-prop", "math-variance", "related", 3],
    ["statistics-bayes", "math-bayes", "related", 2],
    ["statistics-hypothesis", "math-hypothesis-testing", "related", 3],
    ["statistics-regression", "math-regression", "related", 3],
    ["statistics-leastsquares", "math-least-squares", "related", 3],
    ["math-matrix", "statistics-multireg", "prereq", 1],
    ["math-clt", "statistics-normal-approx", "prereq", 2],
    ["statistics-binomial", "math-discrete-distribution", "related", 2],
    ["statistics-uniform", "math-continuous-distribution", "related", 1],

    /* ===== 19. statistics ↔ signal 数据分析 ===== */
    ["statistics-descriptive", "signal-desc-stat", "related", 3],
    ["statistics-timeseries", "signal-time-series", "related", 3],
    ["statistics-regression", "signal-linear-reg", "related", 2],
    ["statistics-multireg", "signal-multiple-reg", "related", 2],
    ["statistics-hypothesis", "signal-hypothesis-test", "related", 3],
    ["statistics-pvalue", "signal-pvalue", "related", 2],
    ["statistics-cluster-type", "signal-clustering", "related", 3],

    /* ===== 20. statistics ↔ ai 统计学习 ===== */
    ["statistics-regression", "ai-lin-reg", "related", 2],
    ["statistics-logistic", "ai-log-reg", "related", 3],
    ["statistics-bayes", "ai-nb", "related", 2],
    ["statistics-factor-analysis", "ai-pca", "related", 2],
    ["statistics-cluster-type", "ai-kmeans", "related", 2],
    ["statistics-likelihood", "ai-em", "related", 1],
    ["statistics-timeseries", "ai-rnn", "apply", 1],

    /* ===== 21. statistics ↔ economics 计量经济 ===== */
    ["statistics-regression", "economics-behavior-economics", "apply", 2],
    ["statistics-timeseries", "economics-economic-cycle", "apply", 2],
    ["statistics-correlate", "economics-marginal-analysis", "related", 1],
    ["statistics-estimation", "economics-info-economics", "apply", 1],
    ["statistics-hypothesis", "economics-phillips-curve", "apply", 1],
    ["statistics-descriptive", "economics-gdp-accounts", "apply", 1],
    ["statistics-timeseries", "economics-inflation", "apply", 1],
    ["statistics-correlate", "economics-interest-rate", "apply", 1],

    /* ===== 22. statistics ↔ practice 试验与抽样 ===== */
    ["statistics-design", "practice-experiment-design", "related", 3],
    ["statistics-samplesize", "practice-sample-size", "related", 2],

    /* ===== 23. 孤岛连通（数据库 CRUD / 索引） ===== */
    ["database-insert", "code-db-sql", "related", 1],
    ["database-update", "code-db-sql", "related", 1],
    ["database-delete", "code-db-sql", "related", 1],
    ["database-cluster", "math-tree", "related", 1],
    ["database-noncluster", "math-tree", "related", 1],

    /* ===== 24. 孤岛连通（软件工程方法） ===== */
    ["software-cmm", "practice-quality-management", "related", 1],
    ["software-process-improve", "practice-root-cause", "apply", 1],
    ["software-functional", "code-se-interface", "apply", 1],
    ["software-nonfunctional", "ai-interpret", "related", 1],
    ["software-srp", "code-se-solid", "related", 2],
    ["software-ocp", "code-se-solid", "related", 2],
    ["software-dip", "code-se-solid", "related", 2],
    ["software-grasp", "code-se-solid", "contrast", 1],
    ["software-factory", "code-se-abstraction", "related", 1],
    ["software-singleton", "code-se-abstraction", "related", 1],
    ["software-observer", "code-se-abstraction", "related", 1],
    ["software-strategy", "code-se-abstraction", "related", 1],
    ["software-decorator", "code-se-abstraction", "related", 1],

    /* ===== 25. 孤岛连通（统计诊断） ===== */
    ["statistics-residual", "signal-linear-reg", "related", 2],
    ["statistics-reg-diagnose", "signal-linear-reg", "related", 1],
    ["statistics-multicollinearity", "signal-multiple-reg", "related", 2]
  );
})();
