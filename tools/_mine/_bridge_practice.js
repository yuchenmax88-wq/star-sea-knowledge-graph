;(function(){
  var KG = window.KG;
  KG.edges.push(
    ["practice-git", "practice-ci", "apply", 3],
    ["practice-ci", "practice-cd", "prereq", 2],
    ["practice-ci", "practice-blue-green", "apply", 2],
    ["practice-cd", "practice-canary", "part", 2],
    ["practice-integration-test", "practice-ci", "related", 2],
    ["practice-release-note", "practice-rollback", "related", 2],
    ["practice-agile", "practice-container", "related", 1]
  );
})();
