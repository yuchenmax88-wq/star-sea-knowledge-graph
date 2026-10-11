/* 跨领域关系 · R 组 */
(function () {
  var KG = window.KG || (window.KG = { nodes: [], edges: [] });
  window.KG = KG;

  KG.edges.push(
    /* ===== 1. 机械工程 ↔ 物理 ===== */
    ["mechanical-theoretical", "physics-mechanics", "related", 3],
    ["physics-newton-first", "mechanical-statics", "prereq", 2],
    ["physics-newton-second", "mechanical-dynamics", "prereq", 3],
    ["mechanical-kinematics", "physics-kinematics", "related", 3],
    ["mechanical-friction", "physics-friction", "related", 3],
    ["physics-oscillation", "mechanical-free-vib", "prereq", 2],
    ["mechanical-damping", "physics-oscillation", "related", 2],
    ["mechanical-resonance", "physics-oscillation", "related", 2],

    /* ===== 2. 机械工程 ↔ 材料 ===== */
    ["mechanical-stress", "material-mechanical-property", "related", 3],
    ["material-mechanical-property", "mechanical-young", "prereq", 2],
    ["mechanical-wear", "material-corrosion", "contrast", 2],
    ["mechanical-heat-treat", "material-thermal-aging", "related", 2],
    ["mechanical-failure", "material-weibull", "apply", 2],
    ["mechanical-welding", "material-adhesive", "contrast", 2],

    /* ===== 3. 机械工程 ↔ 控制 ===== */
    ["mechanical-stress", "control-strain-gauge", "apply", 3],
    ["mechanical-servo-joint", "control-servo-motor", "related", 3],
    ["mechanical-cnc", "control-servo-motor", "apply", 2],
    ["mechanical-vibration", "control-piezoelectric", "apply", 2],
    ["mechanical-hydraulics", "control-control-valve", "apply", 2],
    ["mechanical-pneumatics", "control-actuator", "apply", 2],

    /* ===== 4. 机械工程 ↔ 工业工程 ===== */
    ["industrial-industrial-robot", "mechanical-robot-arm", "part", 2],
    ["mechanical-joint", "industrial-robot-axis", "related", 1],
    ["mechanical-trajectory", "industrial-interpolation", "apply", 2],
    ["industrial-servo-system", "mechanical-precision-reducer", "part", 1],

    /* ===== 5. 机械工程 ↔ 工程实践 ===== */
    ["mechanical-design-method", "practice-scheme-design", "apply", 2],
    ["mechanical-tolerance", "practice-engineering-drawing", "related", 2],
    ["mechanical-reliability", "practice-risk-management", "apply", 1],
    ["mechanical-failure", "practice-root-cause", "apply", 2],

    /* ===== 6. 机械工程 ↔ 数学 ===== */
    ["math-constant-coefficient-ode", "mechanical-dynamics", "prereq", 2],
    ["mechanical-vibration", "math-characteristic-equation", "prereq", 2],

    /* ===== 7. 土木工程 ↔ 地球科学 ===== */
    ["earth-soil", "civil-soil-mech", "prereq", 2],
    ["civil-slope", "earth-landslide", "related", 3],
    ["civil-excavation", "earth-landslide", "related", 2],
    ["civil-bearing", "earth-landslide", "related", 2],
    ["civil-pile-found", "earth-permafrost", "related", 1],
    ["civil-seismic-action", "earth-earthquake", "related", 3],
    ["civil-seismic-design", "earth-earthquake", "apply", 2],
    ["civil-isolation", "earth-earthquake", "apply", 1],
    ["civil-dam", "earth-river", "related", 2],
    ["civil-reservoir", "earth-watershed", "related", 2],
    ["civil-irrigation", "earth-water-cycle", "related", 1],
    ["civil-wind-vib", "earth-wind", "related", 2],
    ["civil-wind-load", "earth-pressure", "apply", 1],

    /* ===== 8. 土木工程 ↔ 材料 ===== */
    ["material-mechanical-property", "civil-reinforced", "prereq", 1],
    ["material-mechanical-property", "civil-rebar", "prereq", 1],
    ["civil-steel", "material-corrosion", "apply", 2],
    ["civil-waterproof", "material-sealing", "related", 1],

    /* ===== 9. 土木工程 ↔ 物理 ===== */
    ["physics-mechanics", "civil-struct-mech", "prereq", 2],
    ["physics-force", "civil-internal-force", "prereq", 2],
    ["civil-deflection", "physics-displacement", "related", 2],
    ["civil-buckling", "physics-newton-second", "related", 1],
    ["civil-wind-load", "physics-pressure", "apply", 1],
    ["civil-load", "physics-force", "related", 2],

    /* ===== 10. 土木工程 ↔ 工程实践 ===== */
    ["civil-bim", "practice-detailed-design", "apply", 2],
    ["civil-hoisting", "practice-safety-operation", "apply", 1],
    ["civil-scaffold", "practice-safety-operation", "apply", 2],
    ["civil-seismic-design", "practice-design-review", "related", 1],
    ["civil-pit-support", "practice-risk-management", "apply", 1],
    ["civil-survey", "practice-test-bench", "related", 1],

    /* ===== 11. 土木工程 ↔ 数学 ===== */
    ["math-matrix", "civil-matrix-method", "prereq", 2],
    ["math-linear-system", "civil-force-method", "prereq", 1],
    ["math-probability", "civil-reliability", "prereq", 2],
    ["civil-load-combo", "math-expectation", "apply", 1],

    /* ===== 12. 化学工程 ↔ 化学 ===== */
    ["chemeng-reaction-rate", "chemistry-arrhenius-equation", "prereq", 2],
    ["chemeng-catalysis", "chemistry-catalyst", "related", 3],
    ["chemistry-collision-theory", "chemeng-ideal-reactor", "prereq", 1],
    ["chemeng-conversion", "chemistry-equilibrium-constant", "related", 2],
    ["chemeng-phase-eq", "chemistry-chemical-equilibrium", "related", 2],
    ["chemeng-vle", "chemistry-boiling-point", "related", 1],
    ["chemeng-distillation", "chemistry-chromatography", "contrast", 1],
    ["chemeng-enthalpy", "chemistry-enthalpy", "related", 2],
    ["chemeng-entropy", "chemistry-entropy", "related", 2],
    ["chemeng-polymer", "chemistry-polymer", "related", 3],
    ["chemistry-hydrocarbon", "chemeng-refining", "prereq", 1],
    ["chemeng-electrolysis", "chemistry-electrolytic-cell", "related", 2],
    ["chemeng-bio-chem", "chemistry-enzyme-catalysis", "related", 2],
    ["chemeng-mass-balance", "chemistry-state-function", "related", 1],
    ["chemistry-rate-equation", "chemeng-reactor", "prereq", 1],

    /* ===== 13. 化学工程 ↔ 材料 ===== */
    ["chemeng-corrosion", "material-corrosion", "related", 3],
    ["material-mechanical-property", "chemeng-pressure-vessel", "prereq", 1],
    ["chemeng-exchanger", "material-thermal-conductivity", "apply", 2],
    ["chemeng-mech-seal", "material-sealing", "related", 2],
    ["chemeng-flange", "material-sealing", "related", 1],

    /* ===== 14. 化学工程 ↔ 发电与动力 ===== */
    ["chemeng-heat-transfer", "thermal-carnot-cycle", "related", 1],
    ["chemeng-exchanger", "thermal-condenser", "related", 2],
    ["chemeng-furnace", "thermal-furnace", "related", 2],
    ["chemeng-reboiler", "thermal-steam-generator", "related", 1],
    ["chemeng-pinch", "thermal-thermal-efficiency", "apply", 2],
    ["chemeng-flow-rate", "thermal-flow-rate", "related", 2],
    ["chemeng-energy-balance", "thermal-thermal-cycle", "related", 1],
    ["chemeng-latent-heat", "thermal-drum", "related", 1],

    /* ===== 15. 化学工程 ↔ 工程实践 ===== */
    ["chemeng-process", "practice-scheme-design", "apply", 2],
    ["chemeng-pfd", "practice-detailed-design", "related", 2],
    ["chemeng-hazop", "practice-risk-management", "apply", 2],
    ["chemeng-process-safety", "practice-safety-operation", "apply", 2],
    ["chemeng-scale-up", "practice-experiment-design", "apply", 2],
    ["chemeng-process-control", "practice-debug", "related", 1],

    /* ===== 16. 化学工程 ↔ 数学 ===== */
    ["math-differential", "chemeng-reaction-rate", "prereq", 1],
    ["chemeng-residence", "math-probability", "related", 1],
    ["chemeng-bernoulli", "math-multiple-integral", "related", 1],

    /* ===== 17. 航空航天 ↔ 物理 ===== */
    ["physics-fluid", "aerospace-aerodynamics", "prereq", 2],
    ["aerospace-lift", "physics-pressure", "apply", 2],
    ["aerospace-drag", "physics-friction", "related", 1],
    ["physics-newton-second", "aerospace-flight-mech", "prereq", 2],
    ["physics-gravity", "aerospace-orbital", "prereq", 2],
    ["aerospace-orbit", "physics-orbit", "related", 3],
    ["aerospace-aoa", "physics-fluid", "related", 1],
    ["aerospace-compress", "physics-ideal-gas", "related", 1],
    ["aerospace-reentry", "physics-phase-transition", "related", 1],
    ["aerospace-mach", "physics-velocity", "related", 1],
    ["aerospace-thrust-weight", "physics-newton-second", "apply", 1],

    /* ===== 18. 航空航天 ↔ 控制 ===== */
    ["control-feedback", "aerospace-flight-control", "prereq", 2],
    ["aerospace-autopilot", "control-closed-loop", "related", 3],
    ["aerospace-gyro", "control-sensor", "related", 2],
    ["aerospace-guidance", "control-optimal-control", "apply", 1],
    ["aerospace-attitude", "control-state-space", "prereq", 1],
    ["aerospace-feedback", "control-feedback", "related", 3],

    /* ===== 19. 航空航天 ↔ 数学 ===== */
    ["math-linear-ode", "aerospace-flight-mech", "prereq", 1],
    ["math-eigenvalue", "aerospace-orbital", "prereq", 1],
    ["aerospace-navigation", "math-svd", "related", 1],

    /* ===== 20. 航空航天 ↔ 材料 ===== */
    ["aerospace-material", "material-mechanical-property", "related", 2],
    ["aerospace-composite", "material-frp", "related", 2],
    ["aerospace-carbon-fiber", "material-frp", "related", 2],
    ["aerospace-aluminum", "material-aluminium", "related", 3],
    ["aerospace-light-alloy", "material-aluminium", "related", 2],
    ["aerospace-superalloy", "material-thermal-class", "related", 1],
    ["aerospace-coating", "material-corrosion", "apply", 1],

    /* ===== 21. 航空航天 ↔ 工程实践 ===== */
    ["aerospace-windtunnel", "practice-test-bench", "apply", 2],
    ["aerospace-flight-test", "practice-experiment-design", "apply", 2],
    ["aerospace-struct-test", "practice-design-verification", "apply", 2],
    ["aerospace-airworthiness", "practice-design-validation", "apply", 2],
    ["aerospace-model-test", "practice-controlled-experiment", "related", 1],
    ["aerospace-certification", "practice-design-review", "related", 1],

    /* ===== 22. 航空航天 ↔ 发电与动力 ===== */
    ["aerospace-turbofan", "thermal-gas-turbine", "related", 2],
    ["aerospace-combustor", "thermal-combustion-chamber", "related", 2],
    ["aerospace-compressor", "thermal-compressor", "related", 3],
    ["aerospace-afterburner", "thermal-combustion-chamber", "related", 1],
    ["aerospace-nozzle", "thermal-brayton-cycle", "related", 1],

    /* ===== 23. R 组内部新领域互连 ===== */
    ["civil-formwork", "mechanical-casting-mold", "related", 2],
    ["civil-pile-found", "mechanical-drilling", "apply", 2],
    ["civil-tall", "mechanical-vibration", "related", 1],
    ["chemeng-pump", "mechanical-hpump", "related", 2],
    ["chemeng-valve", "mechanical-dir-valve", "related", 2],
    ["aerospace-wing", "mechanical-bending", "related", 1],
    ["aerospace-gear", "mechanical-bearing", "related", 2],
    ["aerospace-fasten", "mechanical-bolt", "related", 2],
    ["aerospace-skin", "mechanical-stamping", "related", 1],
    ["aerospace-structure", "civil-struct-mech", "related", 2],
    ["aerospace-wingbox", "civil-box-girder", "related", 1],
    ["chemeng-compressor", "mechanical-compressor", "related", 1],

    /* ===== 24. 补连 mechanical 孤岛节点 ===== */
    ["mechanical-belt", "physics-friction", "related", 2],
    ["mechanical-chain", "industrial-motion-controller", "related", 1],
    ["mechanical-gear-drive", "industrial-servo-system", "related", 2],
    ["mechanical-intermittent", "industrial-sequential-control", "related", 1],
    ["mechanical-geneva", "industrial-sequential-control", "related", 1]
  );
})();
