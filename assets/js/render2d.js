/* ============================================================
 * 星海知识图谱 · 2D 渲染器（Canvas 2D）
 * 无 WebGL 环境下的降级方案，接口与 render3d.js 保持一致
 * ============================================================ */

window.Render2D = (function () {
  "use strict";

  var canvas, ctx, stage;
  var W = 1, H = 1, DPR = 1;
  var FONT = '"PingFang SC","Microsoft YaHei","Hiragino Sans GB",system-ui,-apple-system,"Segoe UI",sans-serif';

  function hexA(hex, a) {
    if (!hex || hex.charAt(0) !== "#") return hex;
    var h = hex.slice(1);
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    var num = parseInt(h, 16);
    return "rgba(" + ((num >> 16) & 255) + "," + ((num >> 8) & 255) + "," + (num & 255) + "," + a + ")";
  }

  function toScreen(x, y) {
    var c = stage.cam2;
    return { x: (x - c.x) * c.k + W / 2, y: (y - c.y) * c.k + H / 2 };
  }

  function init(_canvas, _stage) {
    canvas = _canvas;
    stage = _stage;
    ctx = canvas.getContext("2d");
  }

  function resize(w, h, dpr) {
    W = w; H = h; DPR = dpr;
    canvas.width = Math.floor(W * DPR);
    canvas.height = Math.floor(H * DPR);
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }

  /* ---------- 绘制 ---------- */

  function drawConstellations() {
    var a = 0.50 * Math.min(1, Math.max(0, (1.20 - stage.cam2.k) / 0.50));
    if (a < 0.02) return;
    ctx.save();
    ctx.font = "600 17px " + FONT;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    var placedNames = [];
    stage.domains.forEach(function (d) {
      var anc = stage.anchors[d.id];
      if (!anc || stage.hiddenCats[d.id]) return;
      var p = toScreen(anc.x, anc.y + 170);
      if (p.x < -160 || p.x > W + 160 || p.y < -60 || p.y > H + 60) return;
      var w = ctx.measureText(d.name).width;
      var box = { x: p.x - w / 2 - 8, y: p.y - 12, w: w + 16, h: 24 };
      for (var j = 0; j < placedNames.length; j++) {
        var b = placedNames[j];
        if (box.x < b.x + b.w && box.x + box.w > b.x && box.y < b.y + b.h && box.y + box.h > b.y) return;
      }
      placedNames.push(box);
      ctx.fillStyle = "rgba(200, 226, 255, " + a + ")";
      ctx.fillText(d.name, p.x, p.y);
    });
    ctx.restore();
  }

  function drawLinks() {
    var hl = stage.highlight;
    var focused = !!hl;
    var cam = stage.cam2;
    ctx.lineCap = "round";

    stage.links.forEach(function (l) {
      var na = l.na, nb = l.nb;
      if (!stage.isVisible(na) || !stage.isVisible(nb)) return;

      var a = toScreen(na.x, na.y);
      var b = toScreen(nb.x, nb.y);
      if ((a.x < -80 && b.x < -80) || (a.x > W + 80 && b.x > W + 80)) return;
      if ((a.y < -80 && b.y < -80) || (a.y > H + 80 && b.y > H + 80)) return;

      var lit = focused ? (hl[na.id] && hl[nb.id]) : true;
      var alpha;
      if (focused && !lit) alpha = 0.045;
      else alpha = Math.min(0.85, (0.07 + l.w * 0.05) * (focused ? 1.9 : 1));

      var col = (window.KG_EDGE_TYPES[l.t] || {}).color || "#9aa8c0";
      var g = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
      g.addColorStop(0, hexA(na.color, alpha));
      g.addColorStop(0.5, hexA(col, alpha * (focused && lit ? 1.0 : 0.75)));
      g.addColorStop(1, hexA(nb.color, alpha));
      ctx.strokeStyle = g;
      ctx.lineWidth = Math.max(0.55, (0.5 + l.w * 0.28) * Math.min(cam.k, 1.6));
      if (!focused && l.t !== "prereq" && l.t !== "part") {
        ctx.setLineDash([4, 5]);
      } else {
        ctx.setLineDash([]);
      }
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    });
    ctx.setLineDash([]);
  }

  function drawNodes() {
    var hl = stage.highlight;
    var focused = !!hl;
    var cam = stage.cam2;

    stage.nodes.forEach(function (n) {
      if (!stage.isVisible(n)) return;
      var p = toScreen(n.x, n.y);
      if (p.x < -60 || p.x > W + 60 || p.y < -60 || p.y > H + 60) return;

      var r = Math.max(2.2, n.r * Math.min(cam.k, 2.2));
      var dim = focused && !hl[n.id];
      var isFocus = (n === stage.selected || n === stage.hovered);

      var halo = dim ? 0.05 : (isFocus ? 0.85 : (focused ? 0.40 : 0.26));
      var haloR = r * (isFocus ? 5.2 : 3.6);
      var gg = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, haloR);
      gg.addColorStop(0, hexA(n.color, halo));
      gg.addColorStop(0.35, hexA(n.color, halo * 0.35));
      gg.addColorStop(1, hexA(n.color, 0));
      ctx.fillStyle = gg;
      ctx.beginPath();
      ctx.arc(p.x, p.y, haloR, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = dim ? hexA(n.color, 0.22) : hexA(n.color, 0.95);
      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      ctx.fill();

      if (!dim) {
        ctx.fillStyle = "rgba(255,255,255," + (isFocus ? 0.9 : 0.5) + ")";
        ctx.beginPath();
        ctx.arc(p.x - r * 0.28, p.y - r * 0.3, Math.max(0.7, r * 0.26), 0, Math.PI * 2);
        ctx.fill();
      }

      if (n === stage.selected) {
        var pulse = 1 + Math.sin(stage.time * 0.006) * 0.10;
        ctx.strokeStyle = hexA(n.color, 0.9);
        ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.arc(p.x, p.y, (r + 8) * pulse, 0, Math.PI * 2); ctx.stroke();
        ctx.strokeStyle = hexA(n.color, 0.26);
        ctx.beginPath(); ctx.arc(p.x, p.y, (r + 15) * pulse, 0, Math.PI * 2); ctx.stroke();
      }
    });
  }

  function drawLabels() {
    var hl = stage.highlight;
    var focused = !!hl;
    var cam = stage.cam2;
    /* 同三维：标签碰撞是 O(k²)，k 必须封顶，否则大图上会卡死 */
    var maxLabels = cam.k < 0.85 ? 14 : (cam.k < 1.2 ? 30 : Math.min(stage.nodes.length, 400));
    var size = Math.round(Math.min(15, Math.max(11, 12 * cam.k)));

    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.font = size + "px " + FONT;
    ctx.shadowColor = "rgba(2, 6, 16, 0.92)";
    ctx.shadowBlur = 7;

    var placed = [];
    function tryPlace(n, force) {
      if (!stage.isVisible(n)) return;
      var p = toScreen(n.x, n.y);
      if (p.x < -60 || p.x > W + 60 || p.y < -20 || p.y > H + 20) return;
      var r = Math.max(2.2, n.r * Math.min(cam.k, 2.2));
      var w = ctx.measureText(n.n).width;
      var box = { x: p.x - w / 2 - 3, y: p.y + r + 4, w: w + 6, h: size + 4 };
      if (!force) {
        for (var j = 0; j < placed.length; j++) {
          var q = placed[j];
          if (box.x < q.x + q.w && box.x + box.w > q.x && box.y < q.y + q.h && box.y + box.h > q.y) return;
        }
      }
      placed.push(box);
      ctx.fillStyle = force ? "rgba(233, 245, 255, 0.98)" : "rgba(184, 208, 236, 0.70)";
      ctx.fillText(n.n, p.x, p.y + r + 6);
    }

    var order = stage.labelOrder;
    for (var i = 0; i < order.length; i++) {
      if (hl && hl[order[i].id]) tryPlace(order[i], true);
    }
    if (!focused) {
      for (var k = 0; k < order.length && k < maxLabels; k++) tryPlace(order[k], false);
    }
    ctx.shadowBlur = 0;
  }

  function frame() {
    ctx.clearRect(0, 0, W, H);
    drawConstellations();
    drawLinks();
    drawNodes();
    if (stage.showLabels) drawLabels();
  }

  /* ---------- 交互 ---------- */

  function pick(clientX, clientY) {
    var rect = canvas.getBoundingClientRect();
    var sx = clientX - rect.left, sy = clientY - rect.top;
    var best = null, bestD = Infinity;
    var cam = stage.cam2;
    stage.nodes.forEach(function (n) {
      if (!stage.isVisible(n)) return;
      var p = toScreen(n.x, n.y);
      var r = Math.max(7, n.r * Math.min(cam.k, 2.2) + 8);
      var d = Math.hypot(p.x - sx, p.y - sy);
      if (d < r && d < bestD) { bestD = d; best = n; }
    });
    return best;
  }

  function screenOf(n) {
    return toScreen(n.x, n.y);
  }

  function dolly(factor, clientX, clientY) {
    var rect = canvas.getBoundingClientRect();
    var sx = (clientX == null ? W / 2 : clientX - rect.left);
    var sy = (clientY == null ? H / 2 : clientY - rect.top);
    var c = stage.cam2;
    var before = { x: (sx - W / 2) / c.k + c.x, y: (sy - H / 2) / c.k + c.y };
    c.k = Math.min(4, Math.max(0.2, c.k * factor));
    var after = { x: (sx - W / 2) / c.k + c.x, y: (sy - H / 2) / c.k + c.y };
    c.x += before.x - after.x;
    c.y += before.y - after.y;
  }

  function pan(dx, dy) {
    stage.cam2.x -= dx / stage.cam2.k;
    stage.cam2.y -= dy / stage.cam2.k;
  }

  /* 适配全览：二维下只取 x/y，忽略 z */
  function fit() {
    var vis = stage.nodes.filter(stage.isVisible);
    if (!vis.length) return;
    var minX = 1e9, maxX = -1e9, minY = 1e9, maxY = -1e9;
    for (var i = 0; i < vis.length; i++) {
      var n = vis[i];
      if (n.x < minX) minX = n.x;
      if (n.x > maxX) maxX = n.x;
      if (n.y < minY) minY = n.y;
      if (n.y > maxY) maxY = n.y;
    }
    var pad = 140;
    var bw = (maxX - minX) + pad * 2;
    var bh = (maxY - minY) + pad * 2;
    var k = Math.min(W / bw, (H * 0.86) / bh);
    k = Math.min(3, Math.max(0.04, k));
    var c = stage.cam2;
    c.k = k;
    c.x = (minX + maxX) / 2;
    /* 加一点正向偏移，把整体往上挪，给底部状态条和海面让位 */
    c.y = (minY + maxY) / 2 + (H * 0.04) / k;
  }

  return {
    id: "2d",
    available: function () { return true; },
    init: init,
    resize: resize,
    rebuild: function () {},
    frame: frame,
    pick: pick,
    screenOf: screenOf,
    dolly: dolly,
    pan: pan,
    orbit: pan,
    fit: fit,
    toWorld: function (clientX, clientY) {
      var rect = canvas.getBoundingClientRect();
      var c = stage.cam2;
      return {
        x: (clientX - rect.left - W / 2) / c.k + c.x,
        y: (clientY - rect.top - H / 2) / c.k + c.y
      };
    }
  };
})();
