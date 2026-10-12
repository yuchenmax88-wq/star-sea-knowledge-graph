;(function(){
  var KG = window.KG;
  KG.edges.push(
    ["civil-tower-crane", "civil-construction-org", "related", 2],
    ["civil-construction-org", "civil-flow-construction", "prereq", 2],
    ["civil-flow-construction", "civil-network-plan", "prereq", 2],
    ["civil-site-class", "civil-safety-civil", "related", 2],
    ["civil-monitoring", "civil-green-construction", "related", 2],
    ["civil-foundation-pit", "civil-safety-civil", "apply", 2]
  );
})();
