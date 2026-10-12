;(function(){
  var KG = window.KG;
  KG.edges.push(
    ["chemeng-separator", "chemeng-screening", "related", 2],
    ["chemeng-comminution", "chemeng-screening", "prereq", 2],
    ["chemeng-pneumatic-conv", "chemeng-comminution", "related", 2],
    ["chemeng-mixing", "chemeng-comminution", "related", 2]
  );
})();
