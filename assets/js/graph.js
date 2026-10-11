/* ============================================================
 * 星海知识图谱 · 主逻辑
 * ------------------------------------------------------------
 *   · 数据整理（KG.build）
 *   · 三维力导向布局：网格加速的斥力 + 弹簧 + 星座锚点引力
 *   · 渲染交给 render3d.js（three.js）/ render2d.js（降级），
 *     两者接口一致，这里只负责挑一个
 *   · 全部 UI：搜索、图例与关系过滤、详情抽屉、工具按钮、统计、快捷键
 * ============================================================ */

(function () {
  "use strict";

  var KG = window.KG;
  if (!KG || !KG.nodes.length) {
    console.error("没有加载到任何知识节点，检查 index.html 里的 assets/data/domains/*.js");
    return;
  }
  KG.build();

  /* 只取真正有节点的领域来排布，否则「注册了但还没写数据」的领域会白占位置，
     让整张星图摊得过大、显得稀疏 */
  var DOMAINS = window.KG_DOMAINS.filter(function (d) {
    return window.KG.nodes.some(function (n) { return n.c === d.id; });
  });
  var TYPE = window.KG_EDGE_TYPES;

  /* ============================================================
   * 1. 舞台状态（渲染器从这里读一切）
   * ============================================================ */

  var Stage = {
    nodes: KG.nodes,
    links: KG.links,
    domains: DOMAINS,
    anchors: {},
    labelOrder: null,
    selected: null,
    hovered: null,
    highlight: null,
    showLabels: true,
    hiddenCats: {},
    time: 0,
    cam2: { x: 0, y: 0, k: 0.55 },
    cam3: { tx: 0, ty: 0, tz: 0, theta: 0.35, phi: 1.22, radius: 3600 }
  };

  Stage.isVisible = function (n) { return !Stage.hiddenCats[n.c]; };
  Stage.domainName = function (id) { return (KG.getDomain(id) || {}).name || id; };

  /* 标签按连接数排名，缩小时只显示最重要的若干个 */
  Stage.labelOrder = KG.nodes.slice().sort(function (a, b) { return b.degree - a.degree; });
  var labelRank = {};
  Stage.labelOrder.forEach(function (n, i) { labelRank[n.id] = i; });

  /* ============================================================
   * 2. 星座锚点：把 20 个领域铺在一个扁椭球表面
   *    （斐波那契球 → 椭球映射，正面看像银河带，转起来是有厚度的星海）
   * ============================================================ */

  var CLUSTER_R = 210;

  function layoutAnchors() {
    var n = DOMAINS.length;
    /* 椭球尺度按领域数自适应：表面要摊得开 n 个半径约 270 的星座，
       所以线性尺度取 sqrt(n/20)（面积正比于 n）。写死数值每加一批领域就得重调一次。 */
    var k = Math.sqrt(n / 20);
    var a = 1750 * k, b = 620 * k, c = 900 * k;
    var GA = Math.PI * (3 - Math.sqrt(5));
    DOMAINS.forEach(function (d, i) {
      var y = 1 - 2 * (i + 0.5) / n;
      var r = Math.sqrt(Math.max(0, 1 - y * y));
      var th = i * GA;
      Stage.anchors[d.id] = {
        x: Math.cos(th) * r * a + (Math.random() - 0.5) * 90,
        y: y * b + (Math.random() - 0.5) * 60,
        z: Math.sin(th) * r * c + (Math.random() - 0.5) * 90
      };
    });
  }

  /* ============================================================
   * 3. 布局参数与散播
   * ============================================================ */

  var P = {
    repel: 9000,
    spring: 0.011,
    rest: 92,
    anchorPull: 0.0060,
    centerPull: 0.00006,
    damp: 0.87,
    cutoff: 240,
    cell: 240
  };

  var alpha = 1;
  var running = true;
  var userMoved = false;
  var autoFitLeft = 150;
  var settledFit = false;

  function scatter() {
    KG.nodes.forEach(function (n) {
      var a0 = Stage.anchors[n.c] || { x: 0, y: 0, z: 0 };
      var u = Math.random() * Math.PI * 2;
      var v = Math.acos(2 * Math.random() - 1);
      var rad = 30 + Math.random() * (CLUSTER_R - 30);
      n.x = a0.x + Math.sin(v) * Math.cos(u) * rad;
      n.y = a0.y + Math.sin(v) * Math.sin(u) * rad * 0.8;
      n.z = a0.z + Math.cos(v) * rad;
      n.vx = n.vy = n.vz = 0;
      n.pinned = false;
    });
    alpha = 1;
    running = true;
    userMoved = false;
    autoFitLeft = 150;
    settledFit = false;
    syncPhysicsBtn();
  }

  /* ---------- 网格加速的斥力：只跟相邻 27 个格子算 ---------- */

  var grid = new Map();

  function buildGrid(vis) {
    grid.clear();
    for (var i = 0; i < vis.length; i++) {
      var n = vis[i];
      var key = (Math.floor(n.x / P.cell) + "," + Math.floor(n.y / P.cell) + "," + Math.floor(n.z / P.cell));
      var arr = grid.get(key);
      if (arr) arr.push(n); else grid.set(key, [n]);
    }
  }

  function step() {
    if (alpha < 0.012) return;

    var vis = KG.nodes.filter(Stage.isVisible);
    buildGrid(vis);
    var cut2 = P.cutoff * P.cutoff;

    for (var i = 0; i < vis.length; i++) {
      var a = vis[i];
      var ix = Math.floor(a.x / P.cell), iy = Math.floor(a.y / P.cell), iz = Math.floor(a.z / P.cell);
      for (var dx = -1; dx <= 1; dx++) {
        for (var dy = -1; dy <= 1; dy++) {
          for (var dz = -1; dz <= 1; dz++) {
            var bucket = grid.get((ix + dx) + "," + (iy + dy) + "," + (iz + dz));
            if (!bucket) continue;
            for (var q = 0; q < bucket.length; q++) {
              var b = bucket[q];
              if (b === a) continue;
              var ex = b.x - a.x, ey = b.y - a.y, ez = b.z - a.z;
              var d2 = ex * ex + ey * ey + ez * ez;
              if (d2 > cut2) continue;
              if (d2 < 1) { ex = Math.random() - 0.5; ey = Math.random() - 0.5; ez = Math.random() - 0.5; d2 = 1; }
              var d = Math.sqrt(d2);
              var f = (P.repel / d2) * alpha * 0.5;
              var ux = ex / d, uy = ey / d, uz = ez / d;
              a.vx -= ux * f; a.vy -= uy * f; a.vz -= uz * f;
              b.vx += ux * f; b.vy += uy * f; b.vz += uz * f;
            }
          }
        }
      }
    }

    for (var j = 0; j < KG.links.length; j++) {
      var l = KG.links[j];
      if (l.hidden) continue;
      /* 跨领域连线**不参与布局**：只做视觉桥梁。
         否则两千多条跨领域的弹簧会把 20 个星座硬拽成一团。 */
      if (l.cross) continue;
      var na = l.na, nb = l.nb;
      if (!Stage.isVisible(na) || !Stage.isVisible(nb)) continue;
      var gx = nb.x - na.x, gy = nb.y - na.y, gz = nb.z - na.z;
      var gd = Math.sqrt(gx * gx + gy * gy + gz * gz) || 1;
      var rest = P.rest * (l.t === "prereq" ? 1.0 : 1.25);
      var gf = (gd - rest) * P.spring * alpha;
      var kk = gf / gd;
      na.vx += gx * kk; na.vy += gy * kk; na.vz += gz * kk;
      nb.vx -= gx * kk; nb.vy -= gy * kk; nb.vz -= gz * kk;
    }

    for (var m = 0; m < vis.length; m++) {
      var n2 = vis[m];
      var anc = Stage.anchors[n2.c] || { x: 0, y: 0, z: 0 };
      n2.vx += (anc.x - n2.x) * P.anchorPull * alpha;
      n2.vy += (anc.y - n2.y) * P.anchorPull * alpha;
      n2.vz += (anc.z - n2.z) * P.anchorPull * alpha;
      n2.vx += -n2.x * P.centerPull * alpha;
      n2.vy += -n2.y * P.centerPull * alpha;
      n2.vz += -n2.z * P.centerPull * alpha;

      if (n2.pinned) { n2.vx = n2.vy = n2.vz = 0; continue; }

      n2.vx *= P.damp; n2.vy *= P.damp; n2.vz *= P.damp;
      var sp = Math.sqrt(n2.vx * n2.vx + n2.vy * n2.vy + n2.vz * n2.vz);
      if (sp > 30) { var sc = 30 / sp; n2.vx *= sc; n2.vy *= sc; n2.vz *= sc; }
      n2.x += n2.vx; n2.y += n2.vy; n2.z += n2.vz;
    }

    alpha *= 0.9962;
    Stage.layoutTick = (Stage.layoutTick || 0) + 1;
  }

  /* ============================================================
   * 4. 选渲染器
   * ============================================================ */

  var canvas = document.getElementById("graph");
  var overlay = document.getElementById("overlay") || canvas;
  /* ?r=2d 可以强制走二维降级渲染器，便于测试 */
  var force2d = /(^|[?&])r=2d(&|$)/.test(location.search);
  var R = (!force2d && window.Render3D && window.Render3D.available())
    ? window.Render3D : window.Render2D;
  var use3D = R.id === "3d";

  KG.nodes.forEach(function (n) { n.r = 3.6 + Math.min(n.degree, 14) * 0.95; });

  R.init(canvas, Stage, overlay);
  if (overlay !== canvas) overlay.style.pointerEvents = "none";
  if (!use3D && overlay !== canvas) overlay.style.display = "none";

  function resizeAll() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    R.resize(window.innerWidth, window.innerHeight, dpr);
  }

  /* ============================================================
   * 5. 相机
   * ============================================================ */

  var camTween = null;

  function fit() { R.fit(); }

  function focusOn(n) {
    if (use3D) {
      camTween = { tx: n.x, ty: n.y, tz: n.z, radius: Math.max(750, Math.min(Stage.cam3.radius, 1450)) };
    } else {
      camTween = { x: n.x, y: n.y, k: Math.max(Stage.cam2.k, 1.15) };
    }
  }

  function resetView() {
    userMoved = true;
    clearSelection();
    if (use3D) {
      Stage.cam3.theta = 0.35;
      Stage.cam3.phi = 1.22;
      fit();
    } else {
      camTween = { x: 0, y: 0, k: 1 };
    }
  }

  function tickCamera() {
    if (!camTween) return;
    if (use3D) {
      var c = Stage.cam3, e = 0.14;
      c.tx += (camTween.tx - c.tx) * e;
      c.ty += (camTween.ty - c.ty) * e;
      c.tz += (camTween.tz - c.tz) * e;
      if (camTween.radius != null) c.radius += (camTween.radius - c.radius) * e;
      if (Math.abs(camTween.tx - c.tx) < 1.5 && Math.abs(camTween.ty - c.ty) < 1.5 &&
          Math.abs(camTween.tz - c.tz) < 1.5) camTween = null;
    } else {
      var k = Stage.cam2, dd = 0.16;
      k.x += (camTween.x - k.x) * dd;
      k.y += (camTween.y - k.y) * dd;
      if (camTween.k != null) k.k += (camTween.k - k.k) * dd;
      if (Math.abs(camTween.x - k.x) < 0.5 && Math.abs(camTween.y - k.y) < 0.5) camTween = null;
    }
  }

  /* ============================================================
   * 6. 交互
   * ============================================================ */

  var pointers = new Map();
  var dragging = null;
  var orbiting = null;
  var pinch = null;

  /* 屏幕点 → 与相机平面平行的那个平面上的交点（3D 拖节点用） */
  var _cam3 = null, _v3 = null, _plane = null, _out = null;
  function screenToPlane(clientX, clientY, planePoint) {
    if (!use3D || !window.THREE || !planePoint) return null;
    if (!_cam3) {
      _cam3 = window.Render3D.camera();
      _v3 = new window.THREE.Vector3();
      _plane = new window.THREE.Plane();
      _out = new window.THREE.Vector3();
    }
    var rect = canvas.getBoundingClientRect();
    var nx = ((clientX - rect.left) / rect.width) * 2 - 1;
    var ny = -((clientY - rect.top) / rect.height) * 2 + 1;
    var origin = _cam3.position.clone();
    var dir = new window.THREE.Vector3(nx, ny, 0.5).unproject(_cam3).sub(origin).normalize();
    _plane.setFromNormalAndCoplanarPoint(_cam3.getWorldDirection(_v3).clone(), planePoint);
    return new window.THREE.Raycaster(origin, dir).ray.intersectPlane(_plane, _out) ? _out : null;
  }

  function onPointerDown(e) {
    userMoved = true;
    if (canvas.setPointerCapture) canvas.setPointerCapture(e.pointerId);
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.size === 2) {
      var pts = Array.from(pointers.values());
      pinch = {
        dist: Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y) || 1,
        mid: { x: (pts[0].x + pts[1].x) / 2, y: (pts[0].y + pts[1].y) / 2 }
      };
      dragging = null; orbiting = null;
      return;
    }

    var hit = R.pick(e.clientX, e.clientY);
    var wantsPan = e.shiftKey || e.button === 1 || e.button === 2;

    if (hit && !wantsPan) {
      dragging = {
        node: hit,
        moved: false,
        plane: { x: hit.x, y: hit.y, z: hit.z }
      };
      canvas.classList.add("dragging");
      alpha = Math.max(alpha, 0.3);
      running = true; syncPhysicsBtn();
    } else {
      orbiting = { x: e.clientX, y: e.clientY, moved: false, pan: wantsPan || !use3D };
      canvas.classList.add("dragging");
    }
  }

  function onPointerMove(e) {
    if (!pointers.has(e.pointerId)) {
      var h = R.pick(e.clientX, e.clientY);
      if (h !== Stage.hovered) {
        Stage.hovered = h;
        canvas.style.cursor = h ? "pointer" : "grab";
      }
      return;
    }
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.size === 2 && pinch) {
      var pts = Array.from(pointers.values());
      var d = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y) || 1;
      var mid = { x: (pts[0].x + pts[1].x) / 2, y: (pts[0].y + pts[1].y) / 2 };
      R.dolly(pinch.dist / d, mid.x, mid.y);
      R.pan(mid.x - pinch.mid.x, mid.y - pinch.mid.y);
      pinch.mid = mid;
      pinch.dist = d;
      return;
    }

    if (dragging) {
      var p = screenToPlane(e.clientX, e.clientY, dragging.plane);
      if (p) {
        dragging.node.x = p.x; dragging.node.y = p.y; dragging.node.z = p.z;
      } else if (R.toWorld) {
        var w = R.toWorld(e.clientX, e.clientY);
        dragging.node.x = w.x; dragging.node.y = w.y;
      }
      dragging.node.vx = dragging.node.vy = dragging.node.vz = 0;
      dragging.moved = true;
      return;
    }

    if (orbiting) {
      var dx = e.clientX - orbiting.x, dy = e.clientY - orbiting.y;
      if (Math.abs(dx) + Math.abs(dy) > 3) orbiting.moved = true;
      if (orbiting.pan) R.pan(dx, dy);
      else R.orbit(dx, dy);
      orbiting.x = e.clientX; orbiting.y = e.clientY;
    }
  }

  function onPointerUp(e) {
    pointers.delete(e.pointerId);
    if (pointers.size < 2) pinch = null;

    if (dragging) {
      if (dragging.moved) dragging.node.pinned = true;
      else selectNode(dragging.node);
      dragging = null;
      canvas.classList.remove("dragging");
      return;
    }
    if (orbiting) {
      if (!orbiting.moved) clearSelection();
      orbiting = null;
      canvas.classList.remove("dragging");
    }
  }

  function onWheel(e) {
    e.preventDefault();
    userMoved = true;
    R.dolly(Math.exp(-e.deltaY * 0.0014), e.clientX, e.clientY);
  }

  canvas.addEventListener("pointerdown", onPointerDown);
  canvas.addEventListener("pointermove", onPointerMove);
  canvas.addEventListener("pointerup", onPointerUp);
  canvas.addEventListener("pointercancel", onPointerUp);
  canvas.addEventListener("pointerleave", function (e) {
    if (!pointers.has(e.pointerId)) Stage.hovered = null;
  });
  canvas.addEventListener("wheel", onWheel, { passive: false });
  canvas.addEventListener("contextmenu", function (e) { e.preventDefault(); });
  canvas.addEventListener("dblclick", function (e) {
    var hit = R.pick(e.clientX, e.clientY);
    if (hit) {
      hit.pinned = !hit.pinned;
      if (!hit.pinned) alpha = Math.max(alpha, 0.5);
    } else {
      resetView();
    }
  });

  /* ============================================================
   * 7. 详情抽屉
   * ============================================================ */

  var drawer = document.getElementById("drawer");
  var drawerBody = document.getElementById("drawerBody");
  var currentSelectedId = null;

  function computeHighlight(n) {
    if (!n) return null;
    var set = {};
    set[n.id] = 1;
    n.links.forEach(function (id) { set[id] = 1; });
    return set;
  }

  function selectNode(n) {
    Stage.selected = n;
    currentSelectedId = n.id;
    renderDrawer(n);
    drawer.classList.add("open");
    drawer.setAttribute("aria-hidden", "false");
    focusOn(n);
  }

  function clearSelection() {
    Stage.selected = null;
    currentSelectedId = null;
    drawer.classList.remove("open");
    drawer.setAttribute("aria-hidden", "true");
  }

  /* 把邻居按关系类型分组 */
  function edgesOf(n) {
    var items = [];
    n.out.forEach(function (l) { items.push({ node: KG.byId[l.b], type: l.t, dir: "out" }); });
    n.in.forEach(function (l) { items.push({ node: KG.byId[l.a], type: l.t, dir: "in" }); });
    var groups = [];
    ["prereq", "part", "apply", "related", "contrast"].forEach(function (t) {
      var g = items.filter(function (it) { return it.type === t; });
      if (g.length) groups.push({ type: t, items: g });
    });
    return groups;
  }

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function renderDrawer(n) {
    var d = KG.getDomain(n.c) || { name: "未分类", color: n.color, intro: "" };
    var groups = edgesOf(n);

    var html = "";
    html += '<span class="d-cat" style="color:' + d.color + '"><i></i>' + esc(d.name) + "</span>";
    html += '<h2 class="d-title">' + esc(n.n) + "</h2>";
    html += '<p class="d-desc">' + esc(n.d) + "</p>";

    if (n.k && n.k.length) {
      html += '<div class="d-chips" style="margin-top:12px">';
      n.k.forEach(function (t) { html += '<span class="chip tag">' + esc(t) + "</span>"; });
      html += "</div>";
    }

    html += '<p class="d-sub">关联 ' + n.links.length + " 个节点 · " + (n.out.length + n.in.length) + " 条关系</p>";
    groups.forEach(function (g) {
      var ty = TYPE[g.type] || { name: g.type, color: "#9aa8c0" };
      html += '<div class="d-group">';
      html += '<div class="d-ghead" style="color:' + ty.color + '"><i></i>' + esc(ty.name) + " · " + g.items.length + "</div>";
      html += '<div class="d-chips">';
      g.items.sort(function (a, b) { return b.node.degree - a.node.degree; }).forEach(function (it) {
        html += '<button class="chip" data-goto="' + esc(it.node.id) + '">' +
          "<span class=\"arw\">" + (it.dir === "out" ? "→" : "←") + "</span>" + esc(it.node.n) + "</button>";
      });
      html += "</div></div>";
    });

    if (d.intro) html += '<p class="d-foot">' + esc(d.name) + " —— " + esc(d.intro) + "</p>";
    html += '<div id="dText" class="d-text"></div>';

    drawerBody.innerHTML = html;
    loadText(n, d.id);
  }

  /* ---------- 详解文本：按领域分片，点到才注入 script ---------- */

  var textState = {};
  window.KG_TEXT = window.KG_TEXT || {};

  function loadText(n, domainId) {
    var box = document.getElementById("dText");
    if (!box) return;

    if (window.KG_TEXT[domainId]) { showText((window.KG_TEXT[domainId] || {})[n.id]); return; }
    if (textState[domainId] === "loading") { return; }
    if (textState[domainId] === "fail") { return; }

    textState[domainId] = "loading";
    box.innerHTML = '<div class="d-loading">正在载入详解…</div>';

    var s = document.createElement("script");
    s.src = "assets/data/text/" + domainId + ".js";
    s.onload = function () {
      textState[domainId] = "done";
      if (currentSelectedId) showText((window.KG_TEXT[domainId] || {})[currentSelectedId]);
    };
    s.onerror = function () {
      textState[domainId] = "fail";
      var b = document.getElementById("dText");
      if (b) b.innerHTML = "";
    };
    document.head.appendChild(s);
  }

  function showText(t) {
    var box = document.getElementById("dText");
    if (!box) return;
    if (!t) { box.innerHTML = ""; return; }
    box.innerHTML = '<div class="d-textbody"><p>' + esc(t).replace(/\n+/g, "</p><p>") + "</p></div>";
  }

  drawerBody.addEventListener("click", function (e) {
    var btn = e.target.closest ? e.target.closest("[data-goto]") : null;
    if (!btn) return;
    var n = KG.byId[btn.getAttribute("data-goto")];
    if (n) selectNode(n);
  });
  document.getElementById("drawerClose").addEventListener("click", clearSelection);

  /* ============================================================
   * 8. 图例与过滤
   * ============================================================ */

  var legendList = document.getElementById("legendList");
  var legendToggle = document.getElementById("legendToggle");
  var legendOpen = true;

  function setLegendOpen(open) {
    legendOpen = open;
    legendList.style.display = open ? "" : "none";
    legendToggle.textContent = open ? "收起" : "展开";
  }
  legendToggle.addEventListener("click", function () { setLegendOpen(!legendOpen); });
  if (window.innerWidth < 760) setLegendOpen(false);

  function buildLegend() {
    legendList.innerHTML = "";
    DOMAINS.forEach(function (d) {
      var count = KG.nodes.filter(function (n) { return n.c === d.id; }).length;
      if (!count) return;
      var b = document.createElement("button");
      b.className = "legend-item";
      b.type = "button";
      b.setAttribute("data-cat", d.id);
      b.innerHTML =
        '<span class="swatch" style="background:' + d.color + ';box-shadow:0 0 9px ' + d.color + '"></span>' +
        '<span class="lname">' + esc(d.name) + "</span>" +
        '<span class="count">' + count + "</span>";
      b.addEventListener("click", function () {
        Stage.hiddenCats[d.id] = !Stage.hiddenCats[d.id];
        b.classList.toggle("off", !!Stage.hiddenCats[d.id]);
        if (Stage.selected && Stage.hiddenCats[Stage.selected.c]) clearSelection();
        R.rebuild();
        alpha = Math.max(alpha, 0.4);
        running = true;
        syncPhysicsBtn();
        updateStats();
      });
      legendList.appendChild(b);
    });
  }

  /* 关系类型开关 */
  var typeBox = document.getElementById("typeList");
  if (typeBox) {
    Object.keys(TYPE).forEach(function (t) {
      var ty = TYPE[t];
      var n = KG.links.filter(function (l) { return l.t === t; }).length;
      var b = document.createElement("button");
      b.className = "legend-item";
      b.type = "button";
      b.setAttribute("data-type", t);
      b.innerHTML = '<span class="swatch bar" style="background:' + ty.color + '"></span>' +
        '<span class="lname">' + ty.name + "</span>" +
        '<span class="count">' + n + "</span>";
      b.addEventListener("click", function () {
        var off = !b.classList.contains("off");
        b.classList.toggle("off", off);
        KG.links.forEach(function (l) { if (l.t === t) l.hidden = off; });
        R.rebuild();
      });
      typeBox.appendChild(b);
    });
  }

  /* ============================================================
   * 9. 搜索
   * ============================================================ */

  var searchInput = document.getElementById("search");
  var suggestBox = document.getElementById("suggest");
  var hits = [];
  var hitIndex = -1;

  function runSearch(q) {
    q = q.trim().toLowerCase();
    if (!q) { closeSuggest(); return; }
    var words = q.split(/\s+/).filter(Boolean);
    var scored = [];

    KG.nodes.forEach(function (n) {
      var score = 0;
      var name = n.n.toLowerCase();
      var idl = n.id.toLowerCase();
      for (var i = 0; i < words.length; i++) {
        var w = words[i], s = 0;
        if (name === w) s = 100;
        else if (name.indexOf(w) === 0) s = 80;
        else if (name.indexOf(w) >= 0) s = 50;
        else if (idl.indexOf(w) >= 0) s = 40;
        else {
          for (var j = 0; j < n.k.length; j++) {
            if (String(n.k[j]).toLowerCase().indexOf(w) >= 0) { s = 30; break; }
          }
          if (!s && n.d && n.d.toLowerCase().indexOf(w) >= 0) s = 12;
        }
        if (!s) { score = -1; break; }
        score += s;
      }
      if (score > 0) scored.push({ n: n, s: score + n.degree * 0.6 });
    });

    scored.sort(function (a, b) { return b.s - a.s; });
    hits = scored.slice(0, 40).map(function (h) { return h.n; });
    hitIndex = hits.length ? 0 : -1;

    if (!hits.length) {
      suggestBox.innerHTML = '<div class="suggest-empty">没有找到相关节点</div>';
      suggestBox.hidden = false;
      return;
    }
    suggestBox.innerHTML = hits.map(function (n, i) {
      var d = KG.getDomain(n.c);
      return '<div class="suggest-item" role="option" data-i="' + i + '" aria-selected="' + (i === 0) + '">' +
        '<span class="dot" style="background:' + d.color + ';box-shadow:0 0 8px ' + d.color + '"></span>' +
        "<span>" + esc(n.n) + "</span>" +
        '<span class="cat">' + esc(d.name) + "</span>" +
        "</div>";
    }).join("");
    suggestBox.hidden = false;
  }

  function closeSuggest() {
    suggestBox.hidden = true;
    suggestBox.innerHTML = "";
    hits = [];
    hitIndex = -1;
  }

  function chooseSuggest(i) {
    var n = hits[i];
    if (!n) return;
    if (Stage.hiddenCats[n.c]) {
      Stage.hiddenCats[n.c] = false;
      var el = legendList.querySelector('[data-cat="' + n.c + '"]');
      if (el) el.classList.remove("off");
      R.rebuild();
      updateStats();
    }
    selectNode(n);
    closeSuggest();
    searchInput.blur();
  }

  searchInput.addEventListener("input", function () { runSearch(searchInput.value); });
  searchInput.addEventListener("focus", function () {
    if (searchInput.value.trim()) runSearch(searchInput.value);
  });
  searchInput.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { closeSuggest(); searchInput.blur(); return; }
    if (!hits.length) return;
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      hitIndex += (e.key === "ArrowDown" ? 1 : -1);
      if (hitIndex < 0) hitIndex = hits.length - 1;
      if (hitIndex >= hits.length) hitIndex = 0;
      Array.prototype.forEach.call(suggestBox.children, function (el, i) {
        if (el.setAttribute) el.setAttribute("aria-selected", String(i === hitIndex));
      });
      var act = suggestBox.children[hitIndex];
      if (act && act.scrollIntoView) act.scrollIntoView({ block: "nearest" });
      return;
    }
    if (e.key === "Enter") { e.preventDefault(); chooseSuggest(hitIndex < 0 ? 0 : hitIndex); }
  });
  suggestBox.addEventListener("click", function (e) {
    var item = e.target.closest ? e.target.closest("[data-i]") : null;
    if (item) chooseSuggest(parseInt(item.getAttribute("data-i"), 10));
  });
  document.addEventListener("click", function (e) {
    if (!e.target.closest || !e.target.closest(".search")) closeSuggest();
  });

  /* ============================================================
   * 10. 工具按钮与统计
   * ============================================================ */

  function updateStats() {
    var visN = 0, visL = 0;
    KG.nodes.forEach(function (n) { if (Stage.isVisible(n)) visN++; });
    KG.links.forEach(function (l) {
      if (!l.hidden && Stage.isVisible(l.na) && Stage.isVisible(l.nb)) visL++;
    });
    var shown = DOMAINS.filter(function (d) { return !Stage.hiddenCats[d.id]; }).length;
    document.getElementById("stats").innerHTML =
      "<b>" + visN + "</b> 节点 · <b>" + visL + "</b> 关系 · <b>" + shown + "</b> 领域";
  }

  var btnPhysics = document.getElementById("btnPhysics");
  function syncPhysicsBtn() {
    btnPhysics.textContent = running ? "❚❚" : "▶";
    btnPhysics.classList.toggle("active", !running);
  }
  btnPhysics.addEventListener("click", function () {
    running = !running;
    if (running && alpha < 0.2) alpha = 0.5;
    syncPhysicsBtn();
  });

  document.getElementById("btnWarp").addEventListener("click", function () {
    clearSelection();
    scatter();
  });
  document.getElementById("btnReset").addEventListener("click", resetView);
  document.getElementById("btnFit").addEventListener("click", function () { userMoved = true; fit(); });

  var btnLabels = document.getElementById("btnLabels");
  btnLabels.classList.add("active");
  btnLabels.addEventListener("click", function () {
    Stage.showLabels = !Stage.showLabels;
    btnLabels.classList.toggle("active", Stage.showLabels);
  });

  var autoRotate = false;
  var btnSpin = document.getElementById("btnSpin");
  if (btnSpin) {
    if (!use3D) btnSpin.style.display = "none";
    btnSpin.addEventListener("click", function () {
      autoRotate = !autoRotate;
      btnSpin.classList.toggle("active", autoRotate);
    });
  }

  /* 二维 / 三维切换：换渲染器要重建场景，直接带参数重载最稳 */
  var btnDim = document.getElementById("btnDim");
  if (btnDim) {
    btnDim.textContent = use3D ? "3D" : "2D";
    btnDim.title = use3D ? "切到二维星图视图" : "切回三维星海视图";
    btnDim.addEventListener("click", function () {
      var url = new URL(location.href);
      if (use3D) url.searchParams.set("r", "2d");
      else url.searchParams.delete("r");
      location.href = url.href;
    });
  }

  /* ============================================================
   * 11. 快捷键
   * ============================================================ */

  document.addEventListener("keydown", function (e) {
    var tag = (e.target.tagName || "").toLowerCase();
    if (tag === "input" || tag === "textarea") return;
    if (e.key === "/") { e.preventDefault(); searchInput.focus(); }
    if (e.key === "Escape") clearSelection();
    if (e.key === "f" || e.key === "F") { userMoved = true; fit(); }
    if (e.key === "r" || e.key === "R") resetView();
    if (e.key === " ") { e.preventDefault(); btnPhysics.click(); }
    if ((e.key === "s" || e.key === "S") && btnSpin && use3D) btnSpin.click();
  });

  /* ============================================================
   * 12. 主循环
   * ============================================================ */

  function frame(ts) {
    Stage.time = ts || 0;
    Stage.highlight = computeHighlight(dragging ? dragging.node : (Stage.hovered || Stage.selected));

    tickCamera();

    if (autoFitLeft > 0 && !userMoved) { fit(); autoFitLeft--; }
    /* 布局冷却后再取一次景，这时候的比例才是最终比例 */
    if (!settledFit && !userMoved && alpha <= 0.013) { settledFit = true; fit(); }
    if (autoRotate && use3D) Stage.cam3.theta += 0.0016;
    if (running) step();

    R.frame();
    requestAnimationFrame(frame);
  }

  /* ============================================================
   * 13. 启动
   * ============================================================ */

  resizeAll();
  layoutAnchors();
  scatter();
  buildLegend();
  updateStats();
  syncPhysicsBtn();

  window.addEventListener("resize", function () { resizeAll(); }, { passive: true });
  requestAnimationFrame(frame);

  /* 对外接口 */
  window.StarSea = {
    data: KG,
    stage: Stage,
    renderer: R,
    fit: fit,
    reset: resetView,
    warp: scatter,
    select: function (id) { var n = KG.byId[id]; if (n) { selectNode(n); return n; } return null; },
    search: function (q) { searchInput.value = q; runSearch(q); return hits.length; },
    toggleCategory: function (id) {
      var el = legendList.querySelector('[data-cat="' + id + '"]');
      if (el) el.click();
    },
    stats: function () { return KG.stats; }
  };

  console.log("[星海知识图谱] " + KG.stats.nodes + " 节点 / " + KG.stats.links +
    " 关系 / " + KG.stats.domains + " 领域，渲染器 " + R.id + "，孤立节点 " + KG.stats.orphans);
})();
