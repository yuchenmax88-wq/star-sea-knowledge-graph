/* ============================================================
 * 星海知识图谱 · 背景层
 * 星空 + 星云 + 海面波纹 + 偶发流星
 * 纯 Canvas 绘制，不依赖任何库
 * ============================================================ */

(function () {
  "use strict";

  var canvas = document.getElementById("bg");
  if (!canvas) return;
  var ctx = canvas.getContext("2d");

  var W = 0, H = 0, DPR = 1;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var HORIZON_F = 0.80;   // 海平线在画面高度的位置（越小海面越大）

  /* ---------- 数据 ---------- */

  var stars = [];      // 星星
  var nebulas = [];    // 星云光斑
  var meteors = [];    // 流星
  var ripples = [];    // 海面随机高光
  var t = 0;

  function rand(a, b) { return a + Math.random() * (b - a); }

  function buildScene() {
    var area = W * H;
    var starCount = Math.min(520, Math.round(area / 4200));

    stars = [];
    for (var i = 0; i < starCount; i++) {
      var depth = Math.random();                       // 0 远 → 1 近
      stars.push({
        x: Math.random(),
        y: Math.random() * (HORIZON_F + 0.02),                       // 归一化坐标
        r: 0.4 + depth * 1.4,
        a: 0.18 + depth * 0.62,
        tw: rand(0.6, 2.2),                            // 闪烁速度
        ph: rand(0, Math.PI * 2),                      // 闪烁相位
        vy: rand(0.000004, 0.000018) * (0.4 + depth),  // 极慢下坠
        hue: Math.random() < 0.16 ? rand(-30, 30) : 0  // 少量偏色星
      });
    }

    nebulas = [
      { x: 0.22, y: 0.26, r: 0.42, hue: 205, a: 0.55 },
      { x: 0.78, y: 0.20, r: 0.34, hue: 275, a: 0.42 },
      { x: 0.52, y: 0.58, r: 0.50, hue: 190, a: 0.30 },
      { x: 0.90, y: 0.62, r: 0.30, hue: 320, a: 0.24 }
    ];

    ripples = [];
    for (var j = 0; j < 34; j++) {
      ripples.push({
        x: Math.random(),
        y: rand(HORIZON_F + 0.02, 0.995),
        len: rand(0.02, 0.09),
        a: rand(0.05, 0.22),
        ph: rand(0, Math.PI * 2),
        sp: rand(0.5, 1.6)
      });
    }
  }

  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = Math.floor(W * DPR);
    canvas.height = Math.floor(H * DPR);
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    buildScene();
    if (reduceMotion) draw();
  }

  /* ---------- 绘制：底色 + 星云 ---------- */

  function drawSky() {
    var g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0.00, "#02040c");
    g.addColorStop(0.42, "#050d1f");
    g.addColorStop(0.72, "#07172f");
    g.addColorStop(0.80, "#061529");
    g.addColorStop(1.00, "#020610");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    for (var i = 0; i < nebulas.length; i++) {
      var n = nebulas[i];
      var drift = reduceMotion ? 0 : Math.sin(t * 0.00013 + i) * 0.02;
      var cx = (n.x + drift) * W;
      var cy = (n.y + Math.cos(t * 0.0001 + i) * 0.015) * H;
      var rad = n.r * Math.max(W, H);
      var rg = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad);
      rg.addColorStop(0, "hsla(" + n.hue + ", 90%, 62%, " + n.a * 0.30 + ")");
      rg.addColorStop(0.45, "hsla(" + n.hue + ", 90%, 55%, " + n.a * 0.11 + ")");
      rg.addColorStop(1, "hsla(" + n.hue + ", 90%, 50%, 0)");
      ctx.fillStyle = rg;
      ctx.fillRect(0, 0, W, H);
    }
  }

  /* ---------- 绘制：星星 ---------- */

  function drawStars() {
    var horizon = H * HORIZON_F;

    for (var i = 0; i < stars.length; i++) {
      var s = stars[i];
      if (!reduceMotion) {
        s.y += s.vy;
        if (s.y > HORIZON_F + 0.01) { s.y = -0.02; s.x = Math.random(); }
      }
      var x = s.x * W;
      var y = s.y * H;
      if (y > horizon + 6) continue;

      var tw = reduceMotion ? 1 : (0.62 + 0.38 * Math.sin(t * 0.001 * s.tw + s.ph));
      var a = s.a * tw;

      // 大星带光晕
      if (s.r > 1.2) {
        var gg = ctx.createRadialGradient(x, y, 0, x, y, s.r * 6);
        gg.addColorStop(0, "hsla(" + (200 + s.hue) + ", 100%, 88%, " + a * 0.5 + ")");
        gg.addColorStop(1, "hsla(" + (210 + s.hue) + ", 100%, 70%, 0)");
        ctx.fillStyle = gg;
        ctx.beginPath();
        ctx.arc(x, y, s.r * 6, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = "hsla(" + (205 + s.hue) + ", 100%, " + (88 + s.hue * 0.05) + "%, " + a + ")";
      ctx.beginPath();
      ctx.arc(x, y, s.r, 0, Math.PI * 2);
      ctx.fill();

      // 靠近海平面时在海里留一条倒影
      if (y > horizon - H * 0.10) {
        var reflect = (1 - (horizon - y) / (H * 0.10)) * a * 0.22;
        if (reflect > 0.01) {
          ctx.fillStyle = "hsla(205, 100%, 85%, " + reflect + ")";
          ctx.fillRect(x - 0.5, horizon + (horizon - y) * 0.35, 1.2, H * 0.02);
        }
      }
    }
  }

  /* ---------- 绘制：海面 ---------- */

  function drawOcean() {
    var horizon = H * HORIZON_F;

    // 海平线辉光
    var glow = ctx.createLinearGradient(0, horizon - H * 0.09, 0, horizon + 4);
    glow.addColorStop(0, "rgba(92, 200, 255, 0)");
    glow.addColorStop(0.75, "rgba(92, 200, 255, 0.10)");
    glow.addColorStop(1, "rgba(150, 225, 255, 0.30)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, horizon - H * 0.09, W, H * 0.09 + 4);

    var layers = [
      { y: 0.000, amp: 6.0, freq: 0.0022, speed: 0.10, color: "rgba(14, 44, 84, 0.42)" },
      { y: 0.018, amp: 9.0, freq: 0.0015, speed: -0.07, color: "rgba(10, 36, 74, 0.55)" },
      { y: 0.046, amp: 13.0, freq: 0.0010, speed: 0.05, color: "rgba(7, 26, 58, 0.72)" },
      { y: 0.090, amp: 17.0, freq: 0.0007, speed: -0.035, color: "rgba(4, 16, 38, 0.92)" }
    ];

    for (var L = 0; L < layers.length; L++) {
      var ly = layers[L];
      var baseY = horizon + ly.y * H;
      ctx.beginPath();
      ctx.moveTo(0, H);
      for (var x = 0; x <= W; x += 6) {
        var y = baseY
          + Math.sin(x * ly.freq + t * 0.001 * ly.speed) * ly.amp
          + Math.sin(x * ly.freq * 2.7 + t * 0.0013 * ly.speed * 1.7) * ly.amp * 0.32;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(W, H);
      ctx.closePath();
      ctx.fillStyle = ly.color;
      ctx.fill();
    }

    // 海面高光碎波纹
    ctx.lineCap = "round";
    for (var i = 0; i < ripples.length; i++) {
      var rp = ripples[i];
      var ry = rp.y * H;
      var flick = reduceMotion ? 1 : (0.45 + 0.55 * Math.sin(t * 0.0016 * rp.sp + rp.ph));
      var rx = (rp.x * W + (reduceMotion ? 0 : Math.sin(t * 0.0003 * rp.sp + rp.ph) * W * 0.012));
      ctx.strokeStyle = "rgba(160, 225, 255, " + (rp.a * flick) + ")";
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      ctx.moveTo(rx, ry);
      ctx.lineTo(rx + rp.len * W, ry);
      ctx.stroke();
    }
  }

  /* ---------- 绘制：流星 ---------- */

  function spawnMeteor() {
    var fromLeft = Math.random() < 0.5;
    meteors.push({
      x: fromLeft ? rand(-0.1, 0.7) * W : rand(0.3, 1.1) * W,
      y: rand(0.02, 0.34) * H,
      vx: (fromLeft ? 1 : -1) * rand(5.2, 9.5),
      vy: rand(1.8, 3.6),
      life: 1,
      decay: rand(0.006, 0.012),
      len: rand(70, 170)
    });
  }

  function drawMeteors() {
    for (var i = meteors.length - 1; i >= 0; i--) {
      var m = meteors[i];
      m.x += m.vx; m.y += m.vy; m.life -= m.decay;
      if (m.life <= 0 || m.x < -300 || m.x > W + 300 || m.y > H * HORIZON_F) {
        meteors.splice(i, 1);
        continue;
      }
      var n = Math.hypot(m.vx, m.vy) || 1;
      var tx = m.x - (m.vx / n) * m.len;
      var ty = m.y - (m.vy / n) * m.len;

      var g = ctx.createLinearGradient(tx, ty, m.x, m.y);
      g.addColorStop(0, "rgba(140, 215, 255, 0)");
      g.addColorStop(0.7, "rgba(180, 235, 255, " + m.life * 0.45 + ")");
      g.addColorStop(1, "rgba(240, 252, 255, " + m.life * 0.95 + ")");
      ctx.strokeStyle = g;
      ctx.lineWidth = 1.7;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(tx, ty);
      ctx.lineTo(m.x, m.y);
      ctx.stroke();

      ctx.fillStyle = "rgba(230, 248, 255, " + m.life * 0.9 + ")";
      ctx.beginPath();
      ctx.arc(m.x, m.y, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  /* ---------- 主循环 ---------- */

  var nextMeteor = 2600;

  function draw() {
    ctx.clearRect(0, 0, W, H);
    drawSky();
    drawStars();
    drawOcean();
    drawMeteors();
  }

  function loop(ts) {
    t = ts || 0;
    if (t > nextMeteor) {
      spawnMeteor();
      nextMeteor = t + rand(2600, 7200);
    }
    draw();
    requestAnimationFrame(loop);
  }

  window.addEventListener("resize", resize, { passive: true });
  resize();

  if (reduceMotion) {
    draw();
  } else {
    requestAnimationFrame(loop);
  }
})();
