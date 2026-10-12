/* 星海知识图谱 · 跨领域边 (X 组：robotics / quantum / nuclear / petroleum) */
/* 方向约定：prereq 源=基础/在先 → 目标=进阶/应用；part 源=整体 → 部件；同义概念只许 related/contrast */
/* eslint-disable */
window.KG = window.KG || { nodes: [], edges: [] };
window.KG.edges = window.KG.edges || [];
window.KG.edges.push(

/* ============ ROBOTICS（机器人学）→ 既有领域 ============ */
/* --- 机械 --- */
["mechanical-mechanism",      "robotics-chain",            "prereq", 2],
["mechanical-pair",           "robotics-joint",            "prereq", 2],
["mechanical-gear-train",     "robotics-reducer",          "prereq", 2],
["mechanical-precision-reducer","robotics-reducer",        "related",2],
["mechanical-robot-arm",      "robotics-arm",              "related",3],
["mechanical-joint",          "robotics-joint",            "related",3],
["mechanical-end-effector",    "robotics-ee",               "related",3],
["mechanical-gripper",        "robotics-gripper",          "related",2],
["mechanical-workspace",      "robotics-workspace",        "related",3],
["mechanical-trajectory",      "robotics-traj-plan",        "related",3],
["mechanical-singularity",    "robotics-singularity",      "related",2],
["mechanical-parallel-robot", "robotics-parallel",         "related",2],
["mechanical-friction",       "robotics-friction-comp",    "apply", 2],
["mechanical-hydraulics",     "robotics-elastic-act",      "apply", 2],
["mechanical-pneumatics",      "robotics-elastic-act",      "apply", 2],

/* --- 控制 --- */
["control-closed-loop",       "robotics-pos-control",      "prereq",2],
["control-feedback",          "robotics-impedance",        "prereq",2],
["control-pid",                "robotics-ind-joint",        "apply", 2],
["control-kalman-filter",     "robotics-ekf",              "prereq",2],
["control-mpc",                "robotics-hybrid",           "apply", 2],
["control-lqr",                "robotics-computed-torque",  "apply", 2],
["control-optimal-control",   "robotics-time-opt",         "apply", 2],
["control-adaptive",           "robotics-adaptive",         "prereq",2],
["control-state-space",        "robotics-dynamics",         "prereq",2],
["control-state-observer",     "robotics-estimation",       "related",2],
["control-actuator",          "robotics-actuator",        "related",3],
["control-sensor",             "robotics-perception",      "prereq",2],
["control-encoder",            "robotics-enc-odo",         "prereq",2],
["control-piezoelectric",     "robotics-tactile",          "apply", 2],
["control-strain-gauge",      "robotics-fts",              "apply", 2],
["control-ultrasonic-sensor",  "robotics-ultrasonic",       "related",2],
["control-hall",               "robotics-magneto",         "apply", 2],
["control-gyroscope",          "robotics-gyro",            "related",3],
["control-mems-accel",         "robotics-accel",            "related",2],
["control-laser-distance",    "robotics-tof",             "apply", 2],
["control-lyapunov",           "robotics-balance",         "apply", 2],
["control-system-ident",       "robotics-param-id",        "prereq",2],

/* --- 数学 --- */
["math-matrix",                "robotics-jacobian",         "prereq",3],
["math-eigenvalue",            "robotics-manipulability",  "apply", 2],
["math-ode-system",            "robotics-dynamics",         "prereq",2],
["math-nonlinear-programming", "robotics-time-opt",         "apply", 2],
["math-convex-optimization",  "robotics-traj-plan",       "apply", 2],
["math-graph",                 "robotics-graph-opt",        "prereq",2],
["math-shortest-path",         "robotics-dijkstra",         "prereq",2],
["math-monte-carlo",           "robotics-mcl",              "prereq",2],
["math-bayes",                 "robotics-bayes",            "prereq",2],
["math-markov-chain",          "robotics-pf",               "apply", 2],
["math-orthogonal-transformation","robotics-rotmat",       "prereq",2],

/* --- 物理 --- */
["physics-mechanics",          "robotics-science",          "prereq",3],
["physics-kinematics",         "robotics-fkin",             "prereq",3],
["physics-newton-second",      "robotics-ne",               "prereq",2],
["physics-rigid-body",         "robotics-chain",            "prereq",2],
["physics-friction",           "robotics-slip",            "related",2],
["physics-torque",             "robotics-torque-control",   "apply", 2],
["physics-moment-inertia",     "robotics-inertia",          "prereq",2],
["physics-damping",            "robotics-damping",          "related",2],
["physics-gravity",            "robotics-gravity",          "related",2],
["physics-collision",          "robotics-collision-detect", "apply", 2],
["physics-impulse",            "robotics-contact",          "apply", 2],

/* --- 电机 --- */
["motor-servo",                "robotics-actuator",         "apply", 3],
["motor-servo-encoder",        "robotics-enc-odo",          "related",2],
["motor-vector-control",       "robotics-computed-torque",  "apply", 2],
["motor-frequency-control",    "robotics-ind-joint",        "apply", 2],
["motor-position",             "robotics-pos-control",     "related",3],
["motor-speed-loop",           "robotics-ind-joint",        "apply", 2],
["motor-current-loop",         "robotics-torque-control",   "related",2],
["motor-gearbox",              "robotics-reducer",         "related",2],

/* --- 工业 --- */
["industrial-industrial-robot","robotics-arm",              "related",3],
["industrial-teach-programming","robotics-teach-replay",   "related",2],
["industrial-servo-system",    "robotics-ind-joint",        "apply", 2],
["industrial-motion-controller","robotics-traj-plan",     "apply", 2],
["industrial-robot-kinematics","robotics-fkin",            "related",2],
["industrial-robot-axis",     "robotics-joint",            "related",2],
["industrial-plc",             "robotics-middleware",       "apply", 2],
["industrial-hmi",             "robotics-hri",              "apply", 2],
["industrial-digital-twin",   "robotics-digital-twin",    "related",3],
["industrial-safety-interlock","robotics-safety-fence",    "apply", 2],
["industrial-emergency-stop", "robotics-force-limit",      "apply", 2],
["industrial-positioning-control","robotics-pos-control",  "related",2],
["industrial-interpolation",   "robotics-c-interp",         "apply", 2],
["industrial-servo-drive",     "robotics-actuator",         "apply", 2],

/* --- AI --- */
["ai-ml",                      "robotics-perception",      "apply", 2],
["ai-cnn",                     "robotics-vision",           "apply", 2],
["ai-rl",                      "robotics-grasp",            "apply", 2],
["ai-obj-det",                "robotics-feature",          "apply", 2],
["ai-sem-seg",                 "robotics-semantic-map",    "apply", 2],
["ai-mdp",                     "robotics-path-plan",        "apply", 2],
["ai-supervised",              "robotics-feature",          "prereq",2],

/* --- 信号 --- */
["signal-kalman",              "robotics-mcl",              "related",2],
["signal-adaptive-filter",    "robotics-fusion",          "apply", 2],
["signal-feature-eng",        "robotics-feature",          "related",2],
["signal-dsp-chip",            "robotics-middleware",      "apply", 2],
["signal-realtime",            "robotics-middleware",      "apply", 2],

/* --- 嵌入式 --- */
["embed-mcu",                   "robotics-middleware",      "apply", 2],
["embed-rtos",                 "robotics-middleware",      "apply", 2],
["embed-pwm",                  "robotics-actuator",         "apply", 2],
["embed-adc",                  "robotics-fts",              "apply", 2],
["embed-encoder",             "robotics-enc-odo",         "related",2],
["embed-can",                  "robotics-middleware",      "apply", 2],
["embed-hal",                  "robotics-middleware",      "apply", 2],

/* --- 航空航天 --- */
["aerospace-uav",              "robotics-drone",            "related",3],
["aerospace-ins",              "robotics-dead-reckon",     "apply", 2],
["aerospace-gnss",             "robotics-gps",              "related",2],
["aerospace-gyro",             "robotics-gyro",            "related",3],
["aerospace-accelerometer",   "robotics-accel",            "related",3],
["aerospace-flight-control",  "robotics-flight-controller","related",2],
["aerospace-autopilot",        "robotics-hover",            "apply", 2],
["aerospace-attitude",         "robotics-pose",             "apply", 2],
["aerospace-kalman",          "robotics-ekf",              "related",2],
["aerospace-strapdown-ins",   "robotics-imu",              "apply", 2],
["aerospace-navigation",       "robotics-outdoor-nav",      "prereq",2],
["aerospace-guidance",        "robotics-path-plan",        "apply", 2],

/* --- 光学 --- */
["optics-lidar",               "robotics-lidar",            "related",3],
["optics-stereo-vision",       "robotics-stereo",          "related",3],
["optics-camera-lens",         "robotics-camera-model",    "apply", 2],
["optics-ccd-sensor",          "robotics-vision",           "apply", 2],
["optics-cmos-sensor",         "robotics-vision",           "apply", 2],
["optics-apd",                 "robotics-tof",              "apply", 2],
["optics-laser-ranging",       "robotics-tof",              "related",2],
["optics-point-cloud",        "robotics-pointcloud",      "related",2],
["optics-industrial-lens",      "robotics-pinhole",          "apply", 2],

/* --- 通信 --- */
["comm-can-bus",               "robotics-middleware",      "related",2],
["comm-modbus",                "robotics-middleware",      "apply", 2],
["comm-industrial-ethernet",   "robotics-middleware",      "apply", 2],
["comm-fieldbus",              "robotics-middleware",      "apply", 2],

/* --- 代码 --- */
["code-os-thread",             "robotics-middleware",      "apply", 2],
["code-os-schedule",           "robotics-middleware",      "apply", 2],
["code-se-unit-test",          "robotics-sim",              "apply", 2],
["code-algo-dijkstra",        "robotics-dijkstra",         "related",2],
["code-algo-dfs",              "robotics-rrt",              "apply", 2],
["code-se-design-pattern",     "robotics-middleware",      "apply", 2],

/* --- 统计 --- */
["statistics-mle",             "robotics-estimation",      "apply", 2],
["statistics-regression",      "robotics-param-id",        "apply", 2],


/* ============ QUANTUM（量子信息与计算）→ 既有领域 ============ */
/* --- 物理 --- */
["physics-quantum",            "quantum-qubit",            "prereq",3],
["physics-wave-particle",     "quantum-photon",           "prereq",2],
["physics-schrodinger",        "quantum-unitary",          "prereq",2],
["physics-superposition",     "quantum-pure",             "prereq",3],
["physics-tunneling",          "quantum-dot",              "apply", 2],
["physics-pauli",              "quantum-pauli",            "related",2],
["physics-electron-spin",     "quantum-spin-qubit",        "apply", 3],
["physics-superconductivity", "quantum-superconducting",   "apply", 3],
["physics-bohr",               "quantum-axioms",           "prereq",2],
["physics-atom",               "quantum-entangle",         "prereq",2],
["physics-semiconductor",     "quantum-charge-qubit",     "apply", 2],
["physics-band-theory",        "quantum-silicon-spin",     "apply", 2],
["physics-photoelectric",     "quantum-measure",          "apply", 2],
["physics-de-broglie",         "quantum-pure",             "prereq",2],
["physics-heisenberg",        "quantum-weak-meas",        "apply", 2],
["physics-standard-model",     "quantum-fermion-sim",      "apply", 2],
["physics-particle",           "quantum-majorana",         "apply", 2],
["physics-magnetic-field",    "quantum-flux-qubit",       "apply", 2],
["physics-laser",              "quantum-ion-trap",         "apply", 2],

/* --- 数学 --- */
["math-matrix",                "quantum-density",          "prereq",2],
["math-eigenvalue",            "quantum-ground-state",     "apply", 2],
["math-inner-product-space",  "quantum-bloch",            "prereq",2],
["math-complex-number",       "quantum-phase",            "prereq",2],
["math-fourier-transform",    "quantum-qft",             "prereq",2],
["math-svd",                   "quantum-schmidt",          "apply", 2],
["math-hilbert-space",        "quantum-compound",         "prereq",2],
["math-probability",           "quantum-measure",          "prereq",2],
["math-monte-carlo",          "quantum-boson-sampling",   "apply", 2],
["math-linear-system",         "quantum-hhl",              "apply", 2],
["math-vector-space",         "quantum-tensor",           "prereq",2],

/* --- 化学 --- */
["chemistry-orbital",         "quantum-axioms",           "prereq",2],
["chemistry-molecular-structure","quantum-mol-sim",      "apply", 2],
["chemistry-nmr",             "quantum-nmr",              "related",2],
["chemistry-electron",        "quantum-qubit",            "prereq",2],
["chemistry-molecule",        "quantum-qchem",            "prereq",2],
["chemistry-bond-energy",     "quantum-ground-state",    "apply", 2],
["chemistry-spectroscopy",    "quantum-tomography",      "apply", 2],

/* --- 电子 --- */
["electronics-mosfet",         "quantum-transmon",         "apply", 2],
["electronics-fpga",           "quantum-compilation",     "apply", 2],
["electronics-logic-gate",    "quantum-gate",             "prereq",2],
["electronics-combinational-logic","quantum-circuit",    "apply", 2],
["electronics-adc",           "quantum-readout-error",    "apply", 2],
["electronics-dac",           "quantum-control-electronics","apply",2],
["electronics-ram",           "quantum-qmemory",         "apply", 2],
["electronics-fsm",           "quantum-circuit",          "apply", 2],
["electronics-tunnel-diode", "quantum-dot",              "related",2],
["electronics-photodiode",    "quantum-photon",           "apply", 2],
["electronics-pll",           "quantum-control-electronics","apply",2],

/* --- 材料 --- */
["material-semiconductor",    "quantum-silicon-spin",     "apply", 2],
["material-doping",            "quantum-dot",              "apply", 2],
["material-si-wafer",          "quantum-silicon-spin",     "apply", 2],
["material-epitaxy",          "quantum-nanophotonic",     "apply", 2],
["material-lithography",      "quantum-photonic-chip",    "apply", 2],
["material-etching",          "quantum-photonic-chip",    "apply", 2],
["material-cvd-dep",           "quantum-resonator",        "apply", 2],
["material-bandgap",          "quantum-physical-qubit",   "apply", 2],
["material-carrier",          "quantum-charge-qubit",     "apply", 2],
["material-recombination",    "quantum-decoherence",     "apply", 2],
["material-sic",               "quantum-nv",               "apply", 2],

/* --- 通信 --- */
["comm-channel-capacity",     "quantum-capacity",         "related",3],
["comm-shannon",               "quantum-capacity",         "prereq",2],
["comm-optical-fiber",        "quantum-quantum-relay",    "apply", 2],
["comm-encryption",           "quantum-qcrypto",          "apply", 2],
["comm-asymmetric-encryption","quantum-pqc",              "apply", 3],
["comm-digital-signature",    "quantum-qsignature",       "apply", 2],
["comm-pki",                   "quantum-qcrypto",          "apply", 2],
["comm-hash",                  "quantum-hash-sig",         "apply", 2],
["comm-ssl",                   "quantum-qkd",              "apply", 2],
["comm-ipsec",                "quantum-qkd",              "apply", 2],
["comm-fiber-propagation",   "quantum-entanglement-dist","apply", 2],
["comm-mutual-info",          "quantum-mut-info",         "related",2],
["comm-entropy",               "quantum-vn-entropy",       "apply", 2],
["comm-error-control",        "quantum-qec",              "apply", 2],
["comm-fec",                   "quantum-stabilizer",       "apply", 2],
["comm-hamming-code",          "quantum-surface",           "apply", 2],

/* --- 光学 --- */
["optics-photonic-ic",        "quantum-photonic-chip",    "apply", 2],
["optics-silicon-photonics",  "quantum-photonic-chip",    "apply", 2],
["optics-optical-waveguide", "quantum-waveguide",       "related",2],
["optics-frequency-comb",     "quantum-quantum-limit",    "apply", 2],
["optics-microresonator",     "quantum-resonator",        "related",2],
["optics-quantum-efficiency", "quantum-readout-fidelity","apply",2],
["optics-apd",                 "quantum-photon",           "apply", 2],
["optics-pmt",                 "quantum-photon",           "apply", 2],
["optics-single-frequency-laser","quantum-ion-trap",     "apply", 2],
["optics-coherent-comm",      "quantum-qkd",              "apply", 2],

/* --- AI --- */
["ai-svm",                     "quantum-qsvm",             "apply", 2],
["ai-kernel",                  "quantum-qkernel",          "apply", 2],
["ai-pca",                     "quantum-qpca",             "apply", 2],
["ai-neuron",                  "quantum-quant-op",         "apply", 2],
["ai-mlp",                     "quantum-variational",     "apply", 2],

/* --- 统计 --- */
["statistics-probability",   "quantum-measure",          "prereq",2],
["statistics-mle",             "quantum-tomography",      "apply", 2],

/* --- 代码 --- */
["code-algo-complexity",      "quantum-shor",             "apply", 2],
["code-tool-compiler",         "quantum-compilation",     "apply", 2],


/* ============ NUCLEAR（核工程与核安全）→ 既有领域 ============ */
/* --- 物理 --- */
["physics-fission",            "nuclear-fission-energy",   "prereq",3],
["physics-fusion",             "nuclear-fusion-eng",      "prereq",3],
["physics-nucleus",            "nuclear-engineering",     "prereq",3],
["physics-neutron",            "nuclear-neutron-flux",    "prereq",2],
["physics-isotope",            "nuclear-isotope",          "related",2],
["physics-radioactive-decay", "nuclear-decay-chain",      "prereq",2],
["physics-alpha-ray",          "nuclear-ionizing-radiation","apply",2],
["physics-beta-ray",           "nuclear-ionizing-radiation","apply",2],
["physics-gamma-ray",          "nuclear-ionizing-radiation","apply",2],
["physics-half-life",          "nuclear-half-life",        "related",3],
["physics-binding-energy",    "nuclear-fission-product",  "apply", 2],
["physics-nuclear-force",     "nuclear-fission-energy",   "prereq",2],
["physics-mass-energy",        "nuclear-fission-energy",  "apply", 2],
["physics-thermodynamics",    "nuclear-core",             "apply", 2],
["physics-ideal-gas",         "nuclear-plasma",           "apply", 2],
["physics-heat-conduction",   "nuclear-vessel",          "apply", 2],
["physics-electromagnetics",  "nuclear-magnet-fts",       "apply", 2],
["physics-magnetic-field",    "nuclear-tokamak",         "apply", 2],

/* --- 热工 --- */
["thermal-nuclear-fission",   "nuclear-fission-energy",  "related",3],
["thermal-chain-reaction",    "nuclear-critical",        "prereq",3],
["thermal-reactor-core",      "nuclear-core",            "related",3],
["thermal-nuclear-fuel",       "nuclear-fuel-assembly",   "apply", 3],
["thermal-moderator",          "nuclear-neutron-slowing", "apply", 2],
["thermal-control-rod",       "nuclear-control-rod-drive","related",2],
["thermal-pwr",                "nuclear-pwr-system",       "related",3],
["thermal-bwr",                "nuclear-bwr-system",       "related",2],
["thermal-phwr",               "nuclear-heavy-water-reactor","related",2],
["thermal-htgr",               "nuclear-gas-cooled",       "related",2],
["thermal-primary-loop",      "nuclear-rcl",              "related",3],
["thermal-secondary-loop",    "nuclear-sg-tube",          "apply", 2],
["thermal-steam-generator",   "nuclear-sg-tube",          "related",2],
["thermal-nuclear-safety",    "nuclear-safety-principle","related",3],
["thermal-radioactive-waste", "nuclear-waste-class",     "related",2],
["thermal-rankine-cycle",     "nuclear-npp-system",      "apply", 2],
["thermal-steam-turbine",    "nuclear-npp-system",      "apply", 2],
["thermal-condenser",          "nuclear-rhr",              "apply", 2],
["thermal-feedwater-system",  "nuclear-rcl",              "apply", 2],
["thermal-cooling-tower",     "nuclear-containment-cooling","apply",2],
["thermal-generator",          "nuclear-npp-system",      "apply", 2],

/* --- 化学 --- */
["chemistry-atom",             "nuclear-ionizing-radiation","apply",2],
["chemistry-electron",        "nuclear-ionizing-radiation","apply",2],
["chemistry-periodic-table",  "nuclear-isotope",          "apply", 2],
["chemistry-alloy",            "nuclear-zirconium",       "apply", 2],
["chemistry-solution",        "nuclear-water-chem",       "apply", 2],
["chemistry-ph",               "nuclear-lithium",          "apply", 2],

/* --- 材料 --- */
["material-corrosion",         "nuclear-zirconium",       "apply", 2],
["material-oxidation",         "nuclear-zirconium-fire",  "apply", 2],
["material-fatigue-life",     "nuclear-thermal-fatigue","apply", 2],
["material-creep",             "nuclear-RPV-embrit",      "apply", 2],
["material-stress-rupture",  "nuclear-vessel",           "apply", 2],
["material-fracture-toughness","nuclear-vessel",         "apply", 2],
["material-mechanical-property","nuclear-vessel",       "apply", 2],
["material-tensile-strength", "nuclear-vessel",           "apply", 2],
["material-yield-strength",    "nuclear-vessel",           "apply", 2],
["material-thermal-conductivity","nuclear-first-wall",    "apply", 2],
["material-magnetic-core",   "nuclear-magnet-fts",       "apply", 2],
["material-soft-magnetic",     "nuclear-magnet-fts",       "apply", 2],
["material-composite-laminate","nuclear-blanket",         "apply", 2],

/* --- 机械 --- */
["mechanical-stress",          "nuclear-vessel",           "apply", 2],
["mechanical-strain",         "nuclear-vessel",           "apply", 2],
["mechanical-fatigue",         "nuclear-thermal-fatigue", "related",2],
["mechanical-welding",        "nuclear-vessel",           "apply", 2],
["mechanical-hydraulics",     "nuclear-main-pump",        "apply", 2],
["mechanical-seal",            "nuclear-containment",     "apply", 2],
["mechanical-gasket",          "nuclear-containment",     "apply", 2],

/* --- 电网 --- */
["grid-generation",            "nuclear-npp-system",      "apply", 2],
["grid-power-system",         "nuclear-npp-system",      "apply", 2],
["grid-economic-dispatch",    "nuclear-economics",       "apply", 2],

/* --- 电力电子 --- */
["power-ups-system",           "nuclear-emergency-power", "apply", 2],
["power-thermal-design",       "nuclear-decay-heat",      "apply", 2],

/* --- 医学 --- */
["medicine-radiotherapy",     "nuclear-brachy",          "related",2],
["medicine-nuclear",           "nuclear-medical-iso",     "apply", 2],
["medicine-xray",              "nuclear-industrial-camera","apply",2],
["medicine-ct",                "nuclear-industrial-camera","apply",2],
["medicine-imaging",          "nuclear-industrial-camera","apply",2],
["medicine-radiotherapy",     "nuclear-ionizing-radiation","apply",2],

/* --- 环境 --- */
["envsci-nh-radiation",       "nuclear-radiation-protection","apply",2],
["envsci-sw-hazardous",       "nuclear-high-waste",      "apply", 2],
["envsci-pollutant",           "nuclear-ionizing-radiation","apply",2],
["envsci-mon-automatic",      "nuclear-monitoring",       "apply", 2],
["envsci-mon-eia",            "nuclear-siting",           "apply", 2],
["envsci-nh-occupational",    "nuclear-dose-limit",       "apply", 2],

/* --- 地球 --- */
["earth-earthquake",          "nuclear-seismic",          "apply", 2],
["earth-seismic-wave",        "nuclear-seismic",          "apply", 2],

/* --- 航空航天 --- */
["aerospace-space-env",       "nuclear-space-rtg",       "apply", 2],
["aerospace-radiation-belt", "nuclear-space-rtg",       "apply", 2],
["aerospace-satellite-bus",   "nuclear-space-rtg",       "apply", 2],

/* --- 统计/代码（PSA 故障树/事件树） --- */
["statistics-probability",    "nuclear-PSA",              "prereq",2],
["statistics-hypothesis",     "nuclear-PSA",              "apply", 2],
["code-algo-dfs",              "nuclear-fault-tree",      "apply", 2],
["code-algo-bfs",              "nuclear-event-tree",      "apply", 2],


/* ============ PETROLEUM（石油与天然气工程）→ 既有领域 ============ */
/* --- 地质 --- */
["geology-source-bed",         "petroleum-source-rock",   "related",3],
["geology-reservoir-bed",     "petroleum-reservoir-rock", "related",3],
["geology-cap-rock",           "petroleum-cap-rock",       "related",3],
["geology-sandstone",          "petroleum-sandstone-res", "apply", 2],
["geology-limestone",          "petroleum-carbonate-res","apply", 2],
["geology-shale",              "petroleum-shale-gas",     "apply", 2],
["geology-fault",              "petroleum-fracture-res",  "apply", 2],
["geology-anticline",          "petroleum-trap",           "apply", 2],
["geology-stratum",            "petroleum-deposition-facies","apply",2],
["geology-unconformity",      "petroleum-trap",           "apply", 2],
["geology-diagenesis",        "petroleum-reservoir-rock","apply", 2],
["geology-clay-mineral",      "petroleum-res-damage",    "apply", 2],
["geology-sedimentary-deposit","petroleum-petroleum-system","apply",2],
["geology-geophysical-prosp", "petroleum-seismic",        "apply", 2],
["geology-drilling-explor",  "petroleum-drilling",       "apply", 2],

/* --- 地球 --- */
["earth-sedimentary-rock",    "petroleum-reservoir-rock","apply", 2],
["earth-geothermal-gradient", "petroleum-maturity",       "apply", 2],
["earth-ocean",                "petroleum-offshore",      "apply", 2],
["earth-continental-shelf",   "petroleum-offshore",      "apply", 2],
["earth-seismic-wave",         "petroleum-seismic",       "apply", 2],
["earth-remote-sensing",      "petroleum-seismic",        "apply", 2],
["earth-well",                 "petroleum-drilling",       "related",2],

/* --- 化学 --- */
["chemistry-hydrocarbon",      "petroleum-reservoir",      "prereq",3],
["chemistry-methane",          "petroleum-associated-gas","apply", 2],
["chemistry-polymer",          "petroleum-polymer-flood", "apply", 2],
["chemistry-phase-diagram",   "petroleum-condensate",    "apply", 2],
["chemistry-solution",         "petroleum-mud",            "apply", 2],
["chemistry-organic-compound","petroleum-source-rock",    "apply", 2],

/* --- 物理 --- */
["physics-fluid",              "petroleum-flowing-well",  "prereq",2],
["physics-pressure",           "petroleum-downhole-pressure","apply",2],
["physics-bernoulli",          "petroleum-flowing-well",  "apply", 2],
["physics-viscosity",          "petroleum-polymer-flood","apply", 2],
["physics-reynolds",           "petroleum-water-breakthrough","apply",2],
["physics-laminar-turbulent", "petroleum-waterflood",    "apply", 2],
["physics-pascal",             "petroleum-BOP",            "apply", 2],
["physics-hydrostatic-pressure","petroleum-overflow",     "apply", 2],
["physics-ideal-gas",          "petroleum-gas-reservoir", "apply", 2],
["physics-thermodynamics",   "petroleum-thermal-recovery","apply",2],
["physics-heat-conduction",   "petroleum-steam-flood",   "apply", 2],
["physics-phase-transition",  "petroleum-condensate",    "apply", 2],
["physics-saturation-vapor",  "petroleum-dissolved-gas","apply", 2],

/* --- 机械 --- */
["mechanical-hydraulics",     "petroleum-pumping-unit",  "apply", 2],
["mechanical-pneumatics",     "petroleum-gas-lift",       "apply", 2],
["mechanical-compressor",     "petroleum-compressor-station","apply",2],
["mechanical-seal",            "petroleum-casing",         "apply", 2],
["mechanical-friction",       "petroleum-sand-control",  "apply", 2],

/* --- 热工 --- */
["thermal-combustion",         "petroleum-flare",          "apply", 2],
["thermal-fuel",               "petroleum-associated-gas","apply", 2],
["thermal-burner",            "petroleum-flare",          "apply", 2],
["thermal-boiler",             "petroleum-heater",        "apply", 2],
["thermal-gas-turbine",       "petroleum-compressor-station","apply",2],
["thermal-rankine-cycle",     "petroleum-LNG-plant",    "apply", 2],
["thermal-furnace",            "petroleum-heater",        "apply", 2],

/* --- 电机 --- */
["motor-fan-pump",            "petroleum-pump-station",  "apply", 2],
["motor-async",               "petroleum-esp",            "apply", 2],
["motor-frequency-control",   "petroleum-esp",            "apply", 2],
["motor-inverter",            "petroleum-esp",            "apply", 2],
["motor-current-loop",         "petroleum-sucker-rod-pump","apply",2],
["motor-gearbox",              "petroleum-pumping-unit",  "apply", 2],

/* --- 环境 --- */
["envsci-sr-petroleum",       "petroleum-spill",          "related",3],
["envsci-pollutant",           "petroleum-produced-sludge","apply",2],
["envsci-emission",            "petroleum-greenhouse",    "apply", 2],
["envsci-sw-hazardous",       "petroleum-produced-sludge","apply",2],
["envsci-wq-cod",              "petroleum-produced-water","apply",2],
["envsci-wq-bod",              "petroleum-produced-water","apply",2],
["envsci-aq-vocs",            "petroleum-LDAR",           "apply", 2],
["envsci-mon-eia",            "petroleum-HSE",            "apply", 2],
["envsci-nh-occupational",    "petroleum-h2s",            "apply", 2],
["envsci-eco-dual-carbon",   "petroleum-carbontrack",   "apply", 2],

/* --- 碳 --- */
["carbon-flare",               "petroleum-flare",          "related",3],
["carbon-fugitive",            "petroleum-LDAR",           "apply", 2],
["carbon-methane-control",    "petroleum-associated-gas","apply", 2],
["carbon-ccs",                 "petroleum-co2-flood",     "apply", 2],
["carbon-ccu",                 "petroleum-co2-flood",     "apply", 2],
["carbon-process-emission",   "petroleum-greenhouse",    "apply", 2],
["carbon-energy-efficiency",  "petroleum-pump-eff",       "apply", 2],
["carbon-scope1",              "petroleum-greenhouse",    "apply", 2],
["carbon-emission-factor",    "petroleum-carbontrack",   "apply", 2],
["carbon-process-reduction",  "petroleum-EOR",            "apply", 2],
["carbon-material-balance",   "petroleum-material-balance","related",2],

/* --- 海洋 --- */
["ocean-offshore-oil",        "petroleum-offshore",      "related",3],
["ocean-pipeline",             "petroleum-subsea-pipeline","related",2],
["ocean-riser",                "petroleum-riser",          "related",3],
["ocean-platform",            "petroleum-offshore-platform","related",3],
["ocean-mooring",             "petroleum-mooring",        "related",3],
["ocean-wave-load",           "petroleum-offshore-hazard","apply",2],
["ocean-offshore-structure",  "petroleum-offshore-platform","apply",2],
["ocean-jacket",               "petroleum-jacket",         "related",2],
["ocean-semisub",              "petroleum-semirig",        "related",2],
["ocean-shelf",                "petroleum-offshore",      "apply", 2],
["ocean-bathymetry",          "petroleum-subsea",         "apply", 2],
["ocean-deep-ocean",          "petroleum-subsea",         "apply", 2],

/* --- 材料 --- */
["material-corrosion",         "petroleum-cathodic",      "apply", 2],
["material-oxidation",         "petroleum-scaling",        "apply", 2],
["material-welding",           "petroleum-pipeline",      "apply", 2],
["material-fatigue-life",     "petroleum-pipeline",      "apply", 2],
["material-thermal-conductivity","petroleum-heater",      "apply", 2],
["material-functional-ceramic","petroleum-proppant",    "apply", 2],

/* --- 数学 --- */
["math-pde",                   "petroleum-res-simulation","apply",2],
["math-monte-carlo",           "petroleum-res-simulation","apply",2],
["math-linear-system",         "petroleum-res-simulation","apply",2],
["math-matrix",                "petroleum-res-simulation","apply",2],
["math-gradient-descent",     "petroleum-history-match", "apply", 2],

/* --- 统计 --- */
["statistics-regression",     "petroleum-history-match", "apply", 2],
["statistics-leastsquares",   "petroleum-history-match", "apply", 2],
["statistics-timeseries",     "petroleum-production-curve","apply",2],
["statistics-arima",           "petroleum-decline",        "apply", 2],

/* --- 代码 --- */
["code-algo-complexity",      "petroleum-res-simulation","apply",2],


/* ============ 新领域之间少量互连（锚边/互补） ============ */
["quantum-fermion-sim",       "nuclear-plasma",          "related",2],
["quantum-mol-sim",            "petroleum-source-rock",   "apply", 2],
["robotics-actuator",          "nuclear-main-pump",        "related",2],
["robotics-sim",               "petroleum-res-simulation","related",2],
["nuclear-npp-system",         "petroleum-LNG-plant",     "related",2],
["petroleum-pipeline",         "nuclear-rcl",              "related",2],

/* ============ 孤立簇补锚边（保证 4 领域无孤岛） ============ */
/* nuclear 补充堆型/废物/监测簇 */
["thermal-htgr",               "nuclear-msr",             "related",2],
["physics-isotope",            "nuclear-thorium",         "apply", 2],
["envsci-sw-hazardous",        "nuclear-minor-actinide",  "apply", 2],
["physics-fission",            "nuclear-partitioning-transmutation","apply",2],
["envsci-emission",            "nuclear-vent",            "apply", 2],
["envsci-sw-hazardous",        "nuclear-liquid-waste",    "apply", 2],
["envsci-sw-hazardous",        "nuclear-solid-waste",     "apply", 2],
["envsci-mon-automatic",       "nuclear-air-activity",    "apply", 2],
["envsci-nh-occupational",     "nuclear-personnel-dose",  "apply", 2],
/* petroleum 储罐区簇 */
["envsci-sr-petroleum",       "petroleum-tank-farm",     "apply", 2],
["mechanical-seal",            "petroleum-floating-roof", "apply", 2],
["physics-ideal-gas",         "petroleum-nitrogen-seal", "apply", 2],
/* quantum 量子行走/中性原子/光晶格簇 */
["math-graph",                 "quantum-walk",            "apply", 2],
["math-graph",                 "quantum-cont-walk",       "apply", 2],
["math-markov-chain",          "quantum-disc-walk",       "apply", 2],
["physics-atom",               "quantum-neutral-atom",    "apply", 2],
["physics-atom",               "quantum-rydberg",         "apply", 2],
["optics-optical-waveguide",   "quantum-optical-lattice", "apply", 2]

);
