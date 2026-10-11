/* 跨领域关系 · S 组 */
(function () {
  var KG = window.KG || (window.KG = { nodes: [], edges: [] });
  window.KG = KG;

  KG.edges.push(
    /* ===== 1. 海洋科学 ↔ 地球科学 ===== */
    ["physics-fluid", "ocean-physics", "prereq", 2],
    ["ocean-wave", "earth-wave", "related", 3],
    ["ocean-tide", "earth-tide", "related", 3],
    ["ocean-current", "earth-ocean-current", "related", 3],
    ["ocean-density", "earth-ocean-stratification", "related", 2],
    ["ocean-salinity", "earth-salinity", "related", 3],
    ["ocean-tsunami", "earth-tsunami", "related", 3],
    ["ocean-storm-surge", "earth-storm-surge", "related", 3],
    ["ocean-upwelling", "earth-upwelling", "related", 2],
    ["ocean-gyre", "earth-gyre", "related", 2],
    ["ocean-atmosphere", "earth-atmosphere", "related", 2],
    ["ocean-sea-ice", "earth-sea-ice", "related", 2],
    ["ocean-mangrove", "earth-coast", "related", 2],
    ["ocean-rs", "earth-remote-sensing", "related", 2],

    /* ===== 2. 海洋科学 ↔ 生物学 ===== */
    ["ocean-bio", "biology-ecosystem", "related", 2],
    ["ocean-plankton", "biology-protist", "related", 2],
    ["ocean-fish", "biology-fish", "related", 3],
    ["ocean-coral", "earth-coral-reef", "related", 2],
    ["ocean-mammal", "biology-mammal", "related", 2],
    ["ocean-food-web", "biology-food-web", "related", 3],
    ["ocean-ecosystem", "biology-ecosystem", "related", 3],
    ["ocean-algae", "biology-protist", "related", 1],
    ["ocean-benthos", "biology-invertebrate", "related", 1],

    /* ===== 3. 海洋科学 ↔ 海洋地质(地球科学) ===== */
    ["ocean-geology", "earth-oceanic-plate", "related", 2],
    ["ocean-ridge", "earth-mid-ocean-ridge", "related", 3],
    ["ocean-trench", "earth-subduction-zone", "related", 2],
    ["ocean-sediment", "earth-sedimentary-rock", "related", 2],
    ["ocean-vent", "earth-volcano", "related", 1],
    ["ocean-plate", "earth-plate-tectonics", "related", 3],

    /* ===== 4. 海洋科学 ↔ 可再生能源 ===== */
    ["ocean-offshore-wind", "renewable-wind-offshore", "related", 3],
    ["ocean-offshore-wind-energy", "renewable-wind-resource", "related", 2],
    ["ocean-tidal-energy", "renewable-ocean-tidal", "related", 3],
    ["ocean-wave-energy", "renewable-ocean-wave", "related", 3],

    /* ===== 5. 海洋科学 ↔ 物理 ===== */
    ["physics-oscillation", "ocean-wave-spectrum", "prereq", 1],
    ["ocean-buoyancy", "physics-force", "apply", 1],
    ["ocean-stability", "physics-newton-first", "related", 1],

    /* ===== 6. 农业科学 ↔ 生物学 ===== */
    ["biology-mendel", "agriculture-cross-breeding", "prereq", 2],
    ["agriculture-crop-heredity", "biology-mendel", "related", 2],
    ["agriculture-transgenic", "biology-gene-engineering", "related", 3],
    ["biology-fungi", "agriculture-fungal-disease", "prereq", 2],
    ["agriculture-viral-disease", "biology-virus", "related", 2],
    ["agriculture-insect-pest", "biology-invertebrate", "related", 2],
    ["agriculture-cereal", "biology-plant-group", "related", 2],
    ["agriculture-livestock", "biology-mammal", "related", 2],
    ["agriculture-poultry", "biology-bird", "related", 2],
    ["agriculture-eco-agriculture", "biology-ecosystem", "related", 2],
    ["agriculture-circular-agriculture", "biology-decomposers", "related", 2],
    ["agriculture-nutrient-cycle", "biology-nutrient-cycle", "related", 2],
    ["agriculture-plant-disease", "biology-microorganism", "related", 1],

    /* ===== 7. 农业科学 ↔ 化学 ===== */
    ["agriculture-chemical-fertilizer", "chemistry-acid-base-theory", "related", 1],
    ["agriculture-pesticide", "chemistry-organic-compound", "related", 1],

    /* ===== 8. 农业科学 ↔ 地球科学 ===== */
    ["earth-soil", "agriculture-soil-texture", "prereq", 2],
    ["agriculture-soil-organic-matter", "earth-soil", "related", 2],
    ["agriculture-irrigation", "earth-water-cycle", "related", 2],
    ["agriculture-water-saving", "earth-precipitation", "related", 1],
    ["agriculture-conservation-tillage", "earth-soil-erosion", "related", 2],
    ["agriculture-cover-crop", "earth-desertification", "related", 1],
    ["agriculture-soil-fertility", "earth-soil", "related", 2],

    /* ===== 9. 农业科学 ↔ 可再生能源 ===== */
    ["agriculture-straw-use", "renewable-bio-mass", "related", 2],
    ["agriculture-manure-use", "renewable-bio-biogas", "related", 2],

    /* ===== 10. 农业科学 ↔ 经济学 ===== */
    ["agriculture-agriculture-economics", "economics-scarcity", "related", 2],

    /* ===== 11. 食品科学 ↔ 化学 ===== */
    ["food-protein", "chemistry-protein", "related", 3],
    ["food-carbohydrate", "chemistry-carbohydrate", "related", 2],
    ["food-lipid", "biology-lipid", "related", 2],
    ["food-enzyme", "biology-enzyme", "related", 3],
    ["food-chromatography", "chemistry-chromatography", "related", 2],
    ["food-maillard", "chemistry-carbohydrate", "related", 1],
    ["food-oxidation", "chemistry-oxidation-number", "related", 1],

    /* ===== 12. 食品科学 ↔ 生物学 ===== */
    ["food-microbe", "biology-microorganism", "related", 3],
    ["food-yeast", "biology-fungi", "related", 2],
    ["food-fermentation", "biology-fermentation", "related", 3],
    ["food-alcohol-ferm", "biology-fermentation", "related", 2],
    ["food-gmo", "biology-gene-engineering", "related", 2],
    ["food-cell-culture", "biology-cell-culture", "related", 2],
    ["food-probiotic", "biology-bacteria", "related", 1],

    /* ===== 13. 食品科学 ↔ 医学 ===== */
    ["food-pathogen", "medicine-infection", "related", 2],
    ["food-foodborne-disease", "medicine-epidemiology", "related", 2],
    ["food-sterilization", "medicine-infection-control", "related", 2],
    ["food-nutrition-label", "medicine-health-system", "related", 1],
    ["food-functional", "medicine-chronic", "related", 1],
    ["food-irradiation", "medicine-radiotherapy", "related", 1],

    /* ===== 14. 食品科学 ↔ 物理 ===== */
    ["food-freezing", "physics-phase-transition", "related", 2],
    ["food-heat-transfer", "physics-heat-conduction", "related", 2],
    ["food-rheology", "physics-fluid", "related", 1],

    /* ===== 15. 食品科学 ↔ 工程实践 ===== */
    ["food-haccp", "practice-risk-management", "apply", 2],
    ["food-safety-standard", "practice-design-review", "related", 1],
    ["food-traceability", "practice-data-record", "related", 1],

    /* ===== 16. 环境科学 ↔ 化学 ===== */
    ["envsci-wq-cod", "chemistry-quantitative-analysis", "related", 1],
    ["envsci-aq-vocs", "chemistry-organic-compound", "related", 2],
    ["envsci-sr-petroleum", "chemistry-hydrocarbon", "related", 2],
    ["envsci-wq-indicator", "chemistry-ph", "related", 2],

    /* ===== 17. 环境科学 ↔ 生物学 ===== */
    ["envsci-wq-bod", "biology-decomposers", "related", 2],
    ["envsci-ww-activated-sludge", "biology-microorganism", "related", 3],
    ["envsci-sr-remediation", "biology-ecological-engineering", "related", 2],
    ["envsci-eco-restoration", "biology-succession", "related", 2],
    ["envsci-eco-biodiversity", "biology-biodiversity-crisis", "related", 2],
    ["envsci-resilience", "biology-ecosystem", "related", 2],
    ["envsci-mon-biomoni", "biology-community", "related", 1],

    /* ===== 18. 环境科学 ↔ 地球科学 ===== */
    ["envsci-aq-acid-rain", "earth-precipitation", "related", 2],
    ["envsci-biogeochem", "earth-water-cycle", "related", 2],
    ["envsci-mon-remote", "earth-remote-sensing", "related", 2],
    ["envsci-eco-climate", "earth-global-warming", "related", 3],
    ["envsci-eco-wetland", "earth-watershed", "related", 1],
    ["envsci-nh-heat-island", "earth-heat-wave", "related", 1],

    /* ===== 19. 环境科学 ↔ 双碳 ===== */
    ["envsci-mon-lca", "carbon-lca", "related", 3],
    ["envsci-eco-dual-carbon", "carbon-double-carbon", "related", 3],
    ["envsci-eco-carbon-market", "carbon-ets", "related", 3],
    ["envsci-emission", "carbon-scope1", "related", 2],
    ["envsci-eco-green-finance", "carbon-green-bond", "related", 1],
    ["envsci-eco-circular", "carbon-material-cycling", "related", 2],

    /* ===== 20. 环境科学 ↔ 经济学 ===== */
    ["envsci-eco-circular", "economics-externality", "related", 2],
    ["envsci-eco-policy", "economics-public-good", "related", 2],
    ["envsci-eco-green-finance", "economics-financial-market", "related", 1],
    ["envsci-mon-eia", "economics-market-failure", "related", 1],

    /* ===== 21. 环境科学 ↔ 可再生能源 ===== */
    ["envsci-ww-anaerobic", "renewable-bio-biogas", "related", 2],
    ["envsci-sw-incineration", "renewable-bio-incineration", "related", 2],

    /* ===== 22. 环境科学 ↔ 工程实践 ===== */
    ["envsci-mon-eia", "practice-risk-management", "apply", 2],
    ["envsci-mon-iso14001", "practice-quality-management", "related", 1],

    /* ===== 23. S 组内部新领域互连 ===== */
    ["ocean-aquaculture", "agriculture-livestock", "related", 1],
    ["ocean-pollution", "envsci-pollutant", "related", 3],
    ["ocean-red-tide", "envsci-wq-eutrophication", "related", 3],
    ["ocean-acidification", "envsci-eco-climate", "related", 2],
    ["ocean-restoration", "envsci-eco-restoration", "related", 2],
    ["ocean-plastic", "envsci-pollutant", "related", 2],
    ["ocean-desalination", "food-membrane", "related", 1],
    ["agriculture-pesticide", "food-pesticide-residue", "related", 3],
    ["agriculture-livestock", "food-meat", "apply", 2],
    ["agriculture-poultry", "food-egg-process", "apply", 2],
    ["agriculture-vegetable", "food-juice", "related", 1],
    ["agriculture-organic-fertilizer", "envsci-sw-compost", "related", 2],
    ["agriculture-straw-use", "envsci-sw-agri-waste", "related", 2],
    ["agriculture-cover-crop", "envsci-sr-phyto", "related", 1],
    ["agriculture-water-saving", "envsci-wq-indicator", "related", 1],
    ["food-heavy-metal", "envsci-sr-heavy-metal-soil", "related", 2],
    ["food-dairy", "agriculture-livestock", "apply", 2],
    ["food-membrane", "envsci-ww-mbr", "related", 2],
    ["envsci-ww-nitrification", "agriculture-nutrient-n", "related", 2],

    /* ===== 24. 补充：食品/农业/环境跨域边 ===== */
    ["food-pasteurization", "medicine-infection-control", "related", 1],
    ["food-uhp", "physics-pressure", "related", 1],
    ["food-spoilage-bacteria", "biology-bacteria", "related", 2],
    ["food-lactic-acid-bacteria", "biology-bacteria", "related", 1],
    ["food-toxin", "medicine-carcinogen", "related", 1],
    ["food-alert", "practice-risk-management", "related", 1],
    ["agriculture-fertilizer-irrigation", "envsci-wq-nitrogen", "related", 1],
    ["agriculture-drainage", "envsci-sr-groundwater", "related", 1],

    /* ===== 25. 补连 agriculture 孤岛节点 ===== */
    ["agriculture-fiber-crop", "chemistry-polymer", "related", 1],
    ["agriculture-oil-crop", "food-lipid", "apply", 1],
    ["agriculture-sugar-crop", "food-carbohydrate", "related", 1],
    ["agriculture-environment-control", "control-humidity-sensor", "related", 1],
    ["agriculture-ventilation-cooling", "physics-temperature", "related", 1],
    ["agriculture-heating", "physics-heat-conduction", "related", 1],
    ["biology-photosynthesis", "agriculture-supplementary-light", "prereq", 1],

    /* ===== 26. 补 contrast / part 类型边 ===== */
    ["envsci-sw-compost", "renewable-bio-biogas", "contrast", 1],
    ["ocean-offshore-wind", "renewable-wind-tower", "part", 1]
  );
})();
