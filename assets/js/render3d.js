/* ============================================================
 * 星海知识图谱 · 3D 渲染器（three.js）
 * ------------------------------------------------------------
 * 一切都在 GPU 上：节点是一片 Points（自定义着色器画发光星点），
 * 关系是一组 LineSegments（顶点色 + 屏幕空间虚线），
 * 另有 8000 颗远景星做视差。相机自己写的轨道控制，不用 OrbitControls。
 *
 * 接口与 render2d.js 对齐，由 graph.js 选用。
 * 依赖：assets/vendor/three.min.js（全局 THREE）
 * ============================================================ */

window.Render3D = (function () {
  "use strict";

  var THREE = window.THREE;
  var renderer, scene, camera, stage;
  var nodePoints, lineSolid, lineDash, crossSolid, crossDash, starPoints, selRing;
  var labelCanvas, labelCtx;
  var W = 1, H = 1, DPR = 1;

  var FONT = '"PingFang SC","Microsoft YaHei","Hiragino Sans GB",system-ui,-apple-system,"Segoe UI",sans-serif';

  /* 着色器里给点精灵用的缩放系数 */
  var U = {
    scale: { value: 600 },
    focal: { value: 1 }
  };

  var scratch = new THREE.Vector3();
  var starGeo, nodeGeo, lineGeo, dashGeo, crossGeo, crossDashGeo;

  /* ============================================================
   * 可用性
   * ============================================================ */

  function available() {
    if (!THREE) return false;
    try {
      var c = document.createElement("canvas");
      return !!(window.WebGLRenderingContext && (c.getContext("webgl") || c.getContext("experimental-webgl")));
    } catch (e) { return false; }
  }

  /* ============================================================
   * 初始化
   * ============================================================ */

  function init(canvas, _stage, overlay) {
    stage = _stage;
    labelCanvas = overlay;
    labelCtx = labelCanvas.getContext("2d");

    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setClearColor(0x000000, 0);

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(46, 1, 1, 12000);
    stage.camera3D = camera;

    buildStars();
    buildNodes();
    buildLines();

    /* 选中节点的脉冲光环 */
    selRing = new THREE.Mesh(
      new THREE.RingGeometry(1, 1.09, 56),
      new THREE.MeshBasicMaterial({
        color: 0xffffff, transparent: true, opacity: 0.9,
        side: THREE.DoubleSide, blending: THREE.AdditiveBlending,
        depthTest: false, depthWrite: false
      })
    );
    selRing.visible = false;
    scene.add(selRing);
  }

  /* ---------- 远景星空（视差用） ---------- */

  function buildStars() {
    var N = 8000;
    var pos = new Float32Array(N * 3);
    var col = new Float32Array(N * 3);
    var size = new Float32Array(N);
    var alpha = new Float32Array(N);
    var c = new THREE.Color();

    for (var i = 0; i < N; i++) {
      /* 分布在一个大球壳里 */
      var u = Math.random() * 2 - 1;
      var th = Math.random() * Math.PI * 2;
      var r = 4200 + Math.random() * 3600;
      var s = Math.sqrt(1 - u * u);
      pos[i * 3] = Math.cos(th) * s * r;
      pos[i * 3 + 1] = u * r * 0.75;
      pos[i * 3 + 2] = Math.sin(th) * s * r;

      var t = Math.random();
      c.setHSL(0.56 + (Math.random() - 0.5) * 0.12, 0.55, 0.72 + t * 0.2);
      col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
      size[i] = 26 + Math.random() * 78;
      alpha[i] = 0.16 + Math.random() * 0.5;
    }

    starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    starGeo.setAttribute("aColor", new THREE.BufferAttribute(col, 3));
    starGeo.setAttribute("aSize", new THREE.BufferAttribute(size, 1));
    starGeo.setAttribute("aAlpha", new THREE.BufferAttribute(alpha, 1));

    starPoints = new THREE.Points(starGeo, makePointMaterial());
    starPoints.frustumCulled = false;
    scene.add(starPoints);
  }

  /* ---------- 点精灵着色器 ---------- */

  function makePointMaterial() {
    return new THREE.ShaderMaterial({
      uniforms: U,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexShader: [
        "attribute vec3 aColor;",
        "attribute float aSize;",
        "attribute float aAlpha;",
        "uniform float scale;",
        "varying vec3 vColor;",
        "varying float vAlpha;",
        "void main() {",
        "  vColor = aColor;",
        "  vAlpha = aAlpha;",
        "  vec4 mv = modelViewMatrix * vec4(position, 1.0);",
        "  gl_PointSize = min(300.0, aSize * scale / max(1.0, -mv.z));",
        "  gl_Position = projectionMatrix * mv;",
        "}"
      ].join("\n"),
      fragmentShader: [
        "varying vec3 vColor;",
        "varying float vAlpha;",
        "void main() {",
        "  vec2 d = gl_PointCoord - vec2(0.5);",
        "  float r = length(d) * 2.0;",
        "  if (r > 1.0) discard;",
        "  float core = smoothstep(0.62, 0.48, r);",
        "  float glow = pow(max(0.0, 1.0 - r), 3.2) * 0.34;",
        "  float a = (core * 0.95 + glow) * vAlpha;",
        "  if (a < 0.004) discard;",
        "  gl_FragColor = vec4(vColor * (0.82 + core * 0.5), min(1.0, a));",
        "}"
      ].join("\n")
    });
  }

  /* ---------- 节点 ---------- */

  function buildNodes() {
    var n = stage.nodes.length;
    nodeGeo = new THREE.BufferGeometry();
    nodeGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(n * 3), 3));
    nodeGeo.setAttribute("aColor", new THREE.BufferAttribute(new Float32Array(n * 3), 3));
    nodeGeo.setAttribute("aSize", new THREE.BufferAttribute(new Float32Array(n), 1));
    nodeGeo.setAttribute("aAlpha", new THREE.BufferAttribute(new Float32Array(n), 1));
    nodePoints = new THREE.Points(nodeGeo, makePointMaterial());
    nodePoints.frustumCulled = false;
    scene.add(nodePoints);
    stage.nodes.forEach(function (nd, i) { nd._i = i; });
  }

  /* ---------- 关系线 ---------- */

  var LINE_VERT = [
    "attribute vec4 aCol;",
    "attribute float aDash;",
    "varying vec4 vCol;",
    "varying float vDash;",
    "void main() {",
    "  vCol = aCol;",
    "  vDash = aDash;",
    "  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);",
    "}"
  ].join("\n");

  var LINE_FRAG = [
    "uniform float uOpacity;",
    "varying vec4 vCol;",
    "varying float vDash;",
    "void main() {",
    "  if (vDash > 0.5) {",
    "    float m = mod(gl_FragCoord.x + gl_FragCoord.y, 9.0);",
    "    if (m > 5.0) discard;",
    "  }",
    "  float a = vCol.a * uOpacity;",
    "  if (a < 0.004) discard;",
    "  gl_FragColor = vec4(vCol.rgb, a);",
    "}"
  ].join("\n");

  function makeLineMaterial() {
    return new THREE.ShaderMaterial({
      uniforms: { uOpacity: { value: 1 } },
      transparent: true,
      depthTest: false,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexShader: LINE_VERT,
      fragmentShader: LINE_FRAG
    });
  }

  function buildLines() {
    lineGeo = new THREE.BufferGeometry();
    dashGeo = new THREE.BufferGeometry();
    crossGeo = new THREE.BufferGeometry();
    crossDashGeo = new THREE.BufferGeometry();
    lineSolid = new THREE.LineSegments(lineGeo, makeLineMaterial());
    lineDash = new THREE.LineSegments(dashGeo, makeLineMaterial());
    /* 跨领域线单独一组：总览时它们会织成一张网把星座结构糊掉，
       而那个尺度上本来也追不到任何一条，所以随缩放淡入 */
    crossSolid = new THREE.LineSegments(crossGeo, makeLineMaterial());
    crossDash = new THREE.LineSegments(crossDashGeo, makeLineMaterial());
    [lineSolid, lineDash, crossSolid, crossDash].forEach(function (o) {
      o.frustumCulled = false;
      scene.add(o);
    });
    rebuild();
  }

  /* 可见性变化（切领域 / 关关系类型）时重建线的缓冲 */
  function rebuild() {
    if (!lineGeo) return;
    var solid = [], dash = [], cs = [], cd = [];

    stage.links.forEach(function (l) {
      if (l.hidden) return;
      if (!stage.isVisible(l.na) || !stage.isVisible(l.nb)) return;
      var dashed = (l.t !== "prereq" && l.t !== "part");
      if (l.cross) (dashed ? cd : cs).push(l);
      else (dashed ? dash : solid).push(l);
    });

    fillLineGeo(lineGeo, lineSolid, solid, false);
    fillLineGeo(dashGeo, lineDash, dash, true);
    fillLineGeo(crossGeo, crossSolid, cs, false);
    fillLineGeo(crossDashGeo, crossDash, cd, true);
  }

  function fillLineGeo(geo, obj, list, dashed) {
    obj.__list = list;
    var n = list.length;
    if (!n) {
      obj.visible = false;
      geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(0), 3));
      geo.setAttribute("aCol", new THREE.BufferAttribute(new Float32Array(0), 4));
      geo.setAttribute("aDash", new THREE.BufferAttribute(new Float32Array(0), 1));
      return;
    }
    obj.visible = true;
    var pos = new Float32Array(n * 6);
    var cls = new Float32Array(n * 8);
    var dsh = new Float32Array(n * 2);
    var col = new THREE.Color();
    var df = dashed ? 1 : 0;

    for (var i = 0; i < n; i++) {
      var l = list[i];
      pos[i * 6] = l.na.x; pos[i * 6 + 1] = l.na.y; pos[i * 6 + 2] = l.na.z;
      pos[i * 6 + 3] = l.nb.x; pos[i * 6 + 4] = l.nb.y; pos[i * 6 + 5] = l.nb.z;
      dsh[i * 2] = df; dsh[i * 2 + 1] = df;
      col.set((window.KG_EDGE_TYPES[l.t] || {}).color || "#9aa8c0");
      /* 跨领域线画得很淡：它是背景里的桥，不该盖过星座内部的结构 */
      var k = (0.20 + l.w * 0.12) * (l.cross ? 0.15 : 1);
      cls[i * 8] = col.r * k; cls[i * 8 + 1] = col.g * k; cls[i * 8 + 2] = col.b * k; cls[i * 8 + 3] = 1;
      cls[i * 8 + 4] = col.r * k; cls[i * 8 + 5] = col.g * k; cls[i * 8 + 6] = col.b * k; cls[i * 8 + 7] = 1;
    }
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geo.setAttribute("aCol", new THREE.BufferAttribute(cls, 4));
    geo.setAttribute("aDash", new THREE.BufferAttribute(dsh, 1));
  }

  /* ============================================================
   * 状态同步：节点颜色 / 大小 / 透明度
   * ============================================================ */

  function syncNodes() {
    var pos = nodeGeo.attributes.position.array;
    var cArr = nodeGeo.attributes.aColor.array;
    var sArr = nodeGeo.attributes.aSize.array;
    var aArr = nodeGeo.attributes.aAlpha.array;

    var hl = stage.highlight;
    var focused = !!hl;

    for (var i = 0; i < stage.nodes.length; i++) {
      var n = stage.nodes[i];
      pos[i * 3] = n.x; pos[i * 3 + 1] = n.y; pos[i * 3 + 2] = n.z;

      /* 颜色在初始化时解析一次，避免每帧重新解析 2200 次颜色字符串 */
      var rgb = n._rgb || (n._rgb = parseColor(n.color));
      var dim = focused && !hl[n.id];
      var isFocus = (n === stage.selected || n === stage.hovered);
      var k = dim ? 0.18 : (isFocus ? 1.5 : 1);
      cArr[i * 3] = rgb[0] * k; cArr[i * 3 + 1] = rgb[1] * k; cArr[i * 3 + 2] = rgb[2] * k;
      sArr[i] = n.r * 2 * (isFocus ? 3.4 : 2.2);
      aArr[i] = dim ? 0.13 : (isFocus ? 1.0 : 0.92);
    }

    nodeGeo.attributes.position.needsUpdate = true;
    nodeGeo.attributes.aColor.needsUpdate = true;
    nodeGeo.attributes.aSize.needsUpdate = true;
    nodeGeo.attributes.aAlpha.needsUpdate = true;
  }

  var _colCache = {};
  function parseColor(css) {
    if (_colCache[css]) return _colCache[css];
    var c = new THREE.Color(css);
    var out = [c.r, c.g, c.b];
    _colCache[css] = out;
    return out;
  }

  function syncLines() {
    [lineSolid, lineDash].forEach(function (obj) {
      if (!obj) return;
      var arr = obj.geometry.attributes.position.array;
      if (!arr || obj.geometry.attributes.position.count === 0) return;
      var list = obj.__list;
      if (!list) return;
      for (var i = 0; i < list.length; i++) {
        var l = list[i];
        arr[i * 6] = l.na.x; arr[i * 6 + 1] = l.na.y; arr[i * 6 + 2] = l.na.z;
        arr[i * 6 + 3] = l.nb.x; arr[i * 6 + 4] = l.nb.y; arr[i * 6 + 5] = l.nb.z;
      }
      obj.geometry.attributes.position.needsUpdate = true;
    });
  }

  /* ============================================================
   * 尺寸 / 相机
   * ============================================================ */

  function resize(w, h, dpr) {
    W = w; H = h; DPR = dpr;
    renderer.setPixelRatio(dpr);
    renderer.setSize(W, H, false);
    camera.aspect = W / H;
    camera.updateProjectionMatrix();
    /* 让 gl_PointSize 与屏幕高度挂钩：点半径 1 个单位在 1 单位距离处的像素数 */
    U.scale.value = (H / (2 * Math.tan(camera.fov * Math.PI / 360))) * DPR;
    labelCanvas.width = Math.floor(W * DPR);
    labelCanvas.height = Math.floor(H * DPR);
    labelCanvas.style.width = W + "px";
    labelCanvas.style.height = H + "px";
    labelCtx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }

  function applyCamera() {
    var c = stage.cam3;
    var sp = Math.sin(c.phi), cp = Math.cos(c.phi);
    camera.position.set(
      c.tx + c.radius * sp * Math.sin(c.theta),
      c.ty + c.radius * cp,
      c.tz + c.radius * sp * Math.cos(c.theta)
    );
    camera.lookAt(c.tx, c.ty, c.tz);
    camera.updateMatrixWorld();
  }

  /* 取景：先把目标点移到质心，再反复"投影—量占比—调距离"，
     比用包围球估算准得多（深度方向的展开不会把画面拉得过远） */
  function fit() {
    var vis = stage.nodes.filter(stage.isVisible);
    if (!vis.length) return;

    var sx = 0, sy = 0, sz = 0;
    vis.forEach(function (n) { sx += n.x; sy += n.y; sz += n.z; });
    var c = stage.cam3;
    c.tx = sx / vis.length;
    c.ty = sy / vis.length;
    c.tz = sz / vis.length;

    var p = {};
    var r = c.radius;

    for (var iter = 0; iter < 6; iter++) {
      c.radius = r;
      applyCamera();

      var minX = 1e9, maxX = -1e9, minY = 1e9, maxY = -1e9, any = false;
      for (var i = 0; i < vis.length; i++) {
        project(vis[i], p);
        if (p.z < -1 || p.z > 1) continue;
        any = true;
        if (p.x < minX) minX = p.x;
        if (p.x > maxX) maxX = p.x;
        if (p.y < minY) minY = p.y;
        if (p.y > maxY) maxY = p.y;
      }
      if (!any) { r *= 1.4; continue; }

      var w = Math.max(1, maxX - minX);
      var h = Math.max(1, maxY - minY);
      var f = Math.min((W * 0.88) / w, (H * 0.82) / h);
      if (!isFinite(f) || f <= 0) break;
      if (f > 1.8) f = 1.8;
      if (f < 0.55) f = 0.55;
      r = r / f;
      if (Math.abs(f - 1) < 0.025) break;
    }

    /* 把内容在画面里居中 */
    c.radius = r;
    applyCamera();
    var cxp = 0, cyp = 0, cnt = 0;
    var mnX = 1e9, mxX = -1e9, mnY = 1e9, mxY = -1e9;
    for (var j = 0; j < vis.length; j++) {
      project(vis[j], p);
      if (p.z < -1 || p.z > 1) continue;
      cnt++;
      if (p.x < mnX) mnX = p.x; if (p.x > mxX) mxX = p.x;
      if (p.y < mnY) mnY = p.y; if (p.y > mxY) mxY = p.y;
    }
    if (cnt) {
      cxp = (mnX + mxX) / 2; cyp = (mnY + mxY) / 2;
      var worldPerPx = (2 * r * Math.tan(camera.fov * Math.PI / 360)) / H;
      var right = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 0);
      var up = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 1);
      var ox = (cxp - W / 2) * worldPerPx, oy = (cyp - H / 2) * worldPerPx;
      c.tx += right.x * ox + up.x * oy;
      c.ty += right.y * ox + up.y * oy;
      c.tz += right.z * ox + up.z * oy;
    }
    c.radius = r;
  }

  /* ============================================================
   * 屏幕投影与拾取
   * ============================================================ */

  function project(n, out) {
    scratch.set(n.x, n.y, n.z).project(camera);
    var x = (scratch.x * 0.5 + 0.5) * W;
    var y = (-scratch.y * 0.5 + 0.5) * H;
    if (out) { out.x = x; out.y = y; out.z = scratch.z; return out; }
    return { x: x, y: y, z: scratch.z };
  }

  function screenOf(n) { return project(n); }

  function pick(clientX, clientY) {
    var rect = labelCanvas.getBoundingClientRect();
    var sx = clientX - rect.left, sy = clientY - rect.top;
    var best = null, bestD = Infinity;
    var p = {};
    for (var i = 0; i < stage.nodes.length; i++) {
      var n = stage.nodes[i];
      if (!stage.isVisible(n)) continue;
      project(n, p);
      if (p.z > 1) continue;
      var r = Math.max(11, (n.r * 3.4) * U.scale.value / Math.max(1, camera.position.distanceTo(new THREE.Vector3(n.x, n.y, n.z))) * 0.5);
      var d = Math.hypot(p.x - sx, p.y - sy);
      if (d < r && d < bestD) { bestD = d; best = n; }
    }
    return best;
  }

  /* ============================================================
   * 相机操作
   * ============================================================ */

  function orbit(dx, dy) {
    var c = stage.cam3;
    c.theta -= dx * 0.0042;
    c.phi = Math.max(0.18, Math.min(Math.PI - 0.18, c.phi - dy * 0.0038));
  }

  function pan(dx, dy) {
    var c = stage.cam3;
    var s = c.radius * 0.0016;
    /* 沿相机的右方向与上方向平移目标点 */
    var right = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 0);
    var up = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 1);
    c.tx -= (right.x * dx + up.x * dy) * s;
    c.ty -= (right.y * dx + up.y * dy) * s;
    c.tz -= (right.z * dx + up.z * dy) * s;
  }

  function dolly(factor, clientX, clientY) {
    void clientX; void clientY;
    var c = stage.cam3;
    c.radius = Math.max(140, Math.min(9000, c.radius * factor));
  }

  /* 把某个节点转到画面中心 */
  function lookAtNode(n) {
    var c = stage.cam3;
    c.tx += (n.x - c.tx) * 0.0;   // 由 app 做平滑，这里只设目标
    c.tx = n.x; c.ty = n.y; c.tz = n.z;
  }

  /* 把一个世界坐标点转到屏幕（供 app 画引线） */
  function worldToScreen(x, y, z) {
    scratch.set(x, y, z).project(camera);
    return { x: (scratch.x * 0.5 + 0.5) * W, y: (-scratch.y * 0.5 + 0.5) * H, z: scratch.z };
  }

  /* ============================================================
   * 每帧
   * ============================================================ */

  var _sig = null;

  function frame() {
    U.focal.value = 1;
    applyCamera();

    /* 跨领域线随缩放淡入：总览时压到很淡，避免几千条长线把星座结构织成一张网；
       放大到能追踪单条线时再恢复。 */
    if (crossSolid) {
      var z = 2000 / stage.cam3.radius;
      var t = Math.min(1, Math.max(0, (z - 0.34) / 0.66));
      var op = 0.08 + 0.92 * t * t;
      crossSolid.material.uniforms.uOpacity.value = op;
      crossDash.material.uniforms.uOpacity.value = op;
    }

    /* 只有状态真的变了才重算顶点：静止时不再每帧上传 2200 个点的数据 */
    var sig = (stage.selected ? stage.selected.id : "") + "|" +
      (stage.hovered ? stage.hovered.id : "") + "|" + (stage.layoutTick || 0);
    if (sig !== _sig) {
      _sig = sig;
      syncNodes();
      syncLines();
    }

    drawLabels();

    /* 选中光环 */
    if (stage.selected) {
      var n = stage.selected;
      var pulse = 1 + Math.sin(stage.time * 0.006) * 0.10;
      selRing.visible = true;
      selRing.position.set(n.x, n.y, n.z);
      selRing.scale.setScalar(n.r * 4.2 * pulse);
      selRing.lookAt(camera.position);
      selRing.material.color.set(n.color);
    } else {
      selRing.visible = false;
    }

    renderer.render(scene, camera);
  }

  /* ---------- 标签（画在覆盖层 canvas 上） ---------- */

  function drawLabels() {
    labelCtx.clearRect(0, 0, W, H);
    if (!stage.showLabels) return;

    var hl = stage.highlight;
    var focused = !!hl;
    var c = stage.cam3;
    /* 用相机距离估算一个"缩放级别"，决定标签密度 */
    var zoom = 2000 / c.radius;
    /* 标签防重叠是 O(k²) 的碰撞检查，k 必须封顶：
       否则放大后 k = 节点总数（上万）时每帧要做上千万次比较，直接卡死 */
    var maxLabels = zoom < 0.5 ? 22 : (zoom < 0.85 ? 42 : Math.min(stage.nodes.length, 500));
    var size = Math.round(Math.min(15, Math.max(11, 11.5 * Math.max(0.85, zoom))));

    labelCtx.textAlign = "center";
    labelCtx.shadowColor = "rgba(2, 6, 16, 0.92)";

    var placed = [];
    var p = {};
    var _tmp = new THREE.Vector3();

    /* 先放领域名——它是结构性标注，优先级高于单个节点名 */
    var na = 0.62 * Math.min(1, Math.max(0, (0.85 - zoom) / 0.55));
    if (na > 0.02) {
      labelCtx.textBaseline = "middle";
      labelCtx.font = "600 17px " + FONT;
      labelCtx.shadowBlur = 0;
      labelCtx.lineWidth = 3.5;
      labelCtx.strokeStyle = "rgba(3, 8, 18, 0.72)";
      stage.domains.forEach(function (d) {
        var anc = stage.anchors[d.id];
        if (!anc || stage.hiddenCats[d.id]) return;
        var q = worldToScreen(anc.x, anc.y + 220, anc.z);
        if (q.z > 1 || q.x < -160 || q.x > W + 160 || q.y < -60 || q.y > H + 60) return;
        var w = labelCtx.measureText(d.name).width;
        var box = { x: q.x - w / 2 - 7, y: q.y - 12, w: w + 14, h: 24 };
        for (var j = 0; j < placed.length; j++) {
          var b = placed[j];
          if (box.x < b.x + b.w && box.x + box.w > b.x && box.y < b.y + b.h && box.y + box.h > b.y) return;
        }
        placed.push(box);
        labelCtx.strokeText(d.name, q.x, q.y);
        labelCtx.fillStyle = "rgba(206, 230, 255, " + na + ")";
        labelCtx.fillText(d.name, q.x, q.y);
      });
      labelCtx.shadowBlur = 7;
    }

    /* 再放节点名 */
    labelCtx.textBaseline = "top";
    labelCtx.font = size + "px " + FONT;

    function tryPlace(n, force) {
      if (!stage.isVisible(n)) return;
      project(n, p);
      if (p.z > 1) return;
      if (p.x < -60 || p.x > W + 60 || p.y < -20 || p.y > H + 20) return;

      var dist = camera.position.distanceTo(_tmp.set(n.x, n.y, n.z));
      var r = Math.max(1.6, (n.r * 2.2) * U.scale.value / Math.max(1, dist) * 0.5);
      var w = labelCtx.measureText(n.n).width;
      var box = { x: p.x - w / 2 - 3, y: p.y + r + 3, w: w + 6, h: size + 4 };
      if (!force) {
        for (var j = 0; j < placed.length; j++) {
          var q = placed[j];
          if (box.x < q.x + q.w && box.x + box.w > q.x && box.y < q.y + q.h && box.y + box.h > q.y) return;
        }
      }
      placed.push(box);
      labelCtx.lineWidth = 3.2;
      labelCtx.strokeStyle = "rgba(3, 8, 18, 0.88)";
      labelCtx.strokeText(n.n, p.x, p.y + r + 5);
      labelCtx.fillStyle = force ? "rgba(238, 248, 255, 1)" : "rgba(206, 226, 250, 0.92)";
      labelCtx.fillText(n.n, p.x, p.y + r + 5);
    }

    var order = stage.labelOrder;
    for (var i = 0; i < order.length; i++) {
      if (hl && hl[order[i].id]) tryPlace(order[i], true);
    }
    if (!focused) {
      for (var k = 0; k < order.length && k < maxLabels; k++) tryPlace(order[k], false);
    }
    labelCtx.shadowBlur = 0;
  }

  return {
    id: "3d",
    available: available,
    init: init,
    resize: resize,
    rebuild: rebuild,
    frame: frame,
    pick: pick,
    screenOf: screenOf,
    project: project,
    worldToScreen: worldToScreen,
    orbit: orbit,
    pan: pan,
    dolly: dolly,
    fit: fit,
    lookAtNode: lookAtNode,
    camera: function () { return camera; }
  };
})();
