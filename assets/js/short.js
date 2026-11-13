/* Asish & Ipsita: the short invitation.
   One envelope, one card, the details, a few photographs and a reply. Plain scrolling, big buttons. */
(() => {
'use strict';
const CONFIG = window.CONFIG || {};
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const html = document.documentElement, main = $('#main'), env = $('#env'), hd = $('#hd'), bar = $('#bar');
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const f2 = n => +n.toFixed(2);
const wait = ms => new Promise(r => setTimeout(r, ms));
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const thumb = src => /images\.unsplash\.com/.test(src) ? src.replace(/([?&])w=\d+/, '$1w=420') : src;
const Orn = window.Orn;
if (!Orn) { env && env.remove(); return; }

/* small ornaments: paisley corners, the divider */
$$('[data-card]').forEach(c => c.insertAdjacentHTML('afterbegin', '<i class="cn cn--tl"></i><i class="cn cn--tr"></i><i class="cn cn--br"></i><i class="cn cn--bl"></i>'));
$$('[data-orn="divider"]').forEach(el => { el.innerHTML = Orn.divider(200); });

/* torans repeat a whole number of times across the card (odd, so no bell hangs over the middle) */
function sizeToran(el) {
  const W = el.clientWidth, H = el.clientHeight; if (!W || !H) return;
  const t0 = H * 1.5; let n = Math.max(1, Math.round(W / t0)); if (n % 2 === 0) n += W / t0 > n ? 1 : -1;
  el.style.backgroundSize = `${f2(W / Math.max(1, n))}px 100%`;
}
const ro = new ResizeObserver(es => es.forEach(e => sizeToran(e.target)));
$$('[data-toran]').forEach(t => { sizeToran(t); ro.observe(t); });

/* ═════════ the jharokha: a jewelled, embroidered window for the film, drawn at its live size ═════════
   Velvet band with twining gold creepers and set stones, pearl strings, slim pillars with amalaka capitals,
   a lotus crown, and strings of pearls hanging into the opening. */
const Jharokha = (() => {
  let uid = 0;
  const NS = 'http://www.w3.org/2000/svg';
  const probe = document.createElementNS(NS, 'svg'); probe.setAttribute('style', 'position:absolute;width:0;height:0;overflow:hidden'); probe.setAttribute('aria-hidden', 'true');
  const pp = document.createElementNS(NS, 'path'); probe.appendChild(pp); document.body.appendChild(probe);
  const shift = (d, x, y) => d.replace(/(-?\d*\.?\d+)\s+(-?\d*\.?\d+)/g, (m, a, b) => `${f2(+a + x)} ${f2(+b + y)}`);
  const closedP = (w, h, o) => shift(Orn.archPath(w + 2 * o, h + o).d, -o, -o);
  const openP = (w, h, o) => closedP(w, h, o).replace(/Z$/, '');
  const cord = (d, w) => `<path d="${d}" fill="none" stroke="#4A2E08" stroke-width="${f2(w)}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="#DDB560" stroke-width="${f2(w * .66)}" stroke-dasharray="${f2(w * .52)} ${f2(w * .34)}" stroke-linecap="round" stroke-linejoin="round"/>`;
  function along(d, step, trim = 0) {
    pp.setAttribute('d', d); const L = pp.getTotalLength(), n = Math.max(2, Math.round((L - 2 * trim) / step)), out = [];
    for (let i = 0; i <= n; i++) out.push(at(trim + (L - 2 * trim) * i / n, L));
    return { L, pts: out };
  }
  function at(s, L = pp.getTotalLength()) {
    const p = pp.getPointAtLength(s), q = pp.getPointAtLength(Math.min(L, s + .6)), r = pp.getPointAtLength(Math.max(0, s - .6));
    const tx = q.x - r.x, ty = q.y - r.y, tl = Math.hypot(tx, ty) || 1;
    return { x: p.x, y: p.y, tx: tx / tl, ty: ty / tl, s };
  }
  // the inner edge is a row of scallops; each scallop's lowest point is where a string of pearls can hang
  function scallops(w, h) {
    const d = Orn.archPath(w, h).d, out = [];
    let x0 = 0, y0 = +d.match(/L0 (-?[\d.]+)/)[1];
    d.replace(/Q(-?[\d.]+) (-?[\d.]+) (-?[\d.]+) (-?[\d.]+)/g, (m, cx, cy, x2, y2) => {
      out.push({ x: .25 * x0 + .5 * +cx + .25 * +x2, y: .25 * y0 + .5 * +cy + .25 * +y2 }); x0 = +x2; y0 = +y2;
    });
    return out;
  }
  const jewel = (x, y, r, id, kind) => `<circle cx="${f2(x)}" cy="${f2(y)}" r="${f2(r)}" fill="url(#${id}s)"/><circle cx="${f2(x)}" cy="${f2(y)}" r="${f2(r * .7)}" fill="url(#${id}${kind})"/>`;

  function frame(w, h) {
    const id = 'j' + (++uid), k = clamp(w / 330, .72, 1.1), K = v => f2(v * k);
    const O = { edge: 1.4 * k, seed: 4.8 * k, cin: 8.4 * k, b0: 10.4 * k, b1: 27 * k, cout: 28.6 * k, pearl: 32.4 * k, out: 35.8 * k };
    const yS = h - w * .62, pillars = w >= 268, pw = 12 * k, px0 = -(O.out + 4 * k) - pw;
    // the true top of the outer edge (the scallops sit a little below the arch's geometric apex)
    const osc = scallops(w + 2 * O.out, h + O.out), yOut = osc[Math.floor(osc.length / 2)].y - O.out;
    const padX = (pillars ? -px0 : O.out) + 12 * k;
    const padTop = Math.max(0, -(yOut - 34 * k)) + 8 * k, plH = 18 * k, padBottom = plH + 10 * k + 6;
    const W = w + 2 * padX, H = h + padTop + padBottom;
    let lit = '', pr = '';
    const glints = [];
    // velvet band, then the twining creepers
    const band = `${closedP(w, h, O.b1)} ${closedP(w, h, O.b0)}`;
    lit += `<path d="${band}" fill-rule="evenodd" fill="#5E1022"/><path d="${band}" fill-rule="evenodd" fill="url(#${id}t)"/>`;
    // a gold zari mat between the film and the velvet
    const mat = `${closedP(w, h, O.b0)} ${closedP(w, h, 0)}`;
    lit += `<path d="${mat}" fill-rule="evenodd" fill="#C59A45"/><path d="${mat}" fill-rule="evenodd" fill="url(#${id}t)"/>`;
    const mid = (O.b0 + O.b1) / 2, A = 3.3 * k, lam = 26 * k, trim = 3 * k;
    const S = along(openP(w, h, mid), 1.6, trim);
    let v1 = '', v2 = '';
    S.pts.forEach((p, i) => { const a = A * Math.sin(2 * Math.PI * p.s / lam), nx = -p.ty, ny = p.tx; v1 += `${i ? 'L' : 'M'}${f2(p.x + nx * a)} ${f2(p.y + ny * a)}`; v2 += `${i ? 'L' : 'M'}${f2(p.x - nx * a)} ${f2(p.y - ny * a)}`; });
    [v1, v2].forEach(v => lit += `<path d="${v}" fill="none" stroke="#4A2E08" stroke-width="${K(2.3)}"/>`);
    [v1, v2].forEach(v => lit += `<path d="${v}" fill="none" stroke="#E2BC66" stroke-width="${K(1.3)}"/>`);
    for (let s = lam / 4; s < S.L - trim; s += lam / 2) {
      if (s < trim) continue;
      const p = at(s, S.L), nx = -p.ty, ny = p.tx, ang = Math.atan2(p.ty, p.tx) * 180 / Math.PI;
      [-1, 1].forEach(side => {
        const cx = p.x + nx * (A + 1.5 * k) * side, cy = p.y + ny * (A + 1.5 * k) * side;
        lit += `<ellipse cx="${f2(cx)}" cy="${f2(cy)}" rx="${K(3)}" ry="${K(1.25)}" transform="rotate(${f2(ang + 38 * side)} ${f2(cx)} ${f2(cy)})" fill="#D9B45E"/>`;
      });
    }
    let m = 0;
    for (let s = 0; s < S.L - trim; s += lam / 2, m++) {
      if (s < trim) continue;
      const p = at(s, S.L);
      if (m % 2 === 0) { const kind = (m / 2) % 2 ? 'e' : 'r'; pr += jewel(p.x, p.y, 3.5 * k, id, kind); if (Math.abs(s / S.L - .5) < .32 && (m / 2) % 3 === 0) glints.push([p.x, p.y, 13 * k]); }
      else pr += `<circle cx="${f2(p.x)}" cy="${f2(p.y)}" r="${K(1.5)}" fill="url(#${id}s)"/>`;
    }
    // cords either side of the band, the bevelled inner edge, the outer rule
    lit += cord(openP(w, h, O.cin), 3 * k) + cord(openP(w, h, O.cout), 3 * k);
    lit += `<path d="${openP(w, h, O.edge)}" fill="none" stroke="#3A0C14" stroke-width="${K(2.2)}"/>`;
    lit += `<path d="${openP(w, h, O.out)}" fill="none" stroke="#4A2E08" stroke-width="${K(2.2)}"/><path d="${openP(w, h, O.out)}" fill="none" stroke="#D2A649" stroke-width="${K(1.2)}"/>`;
    // seed pearls inside, big pearls outside
    along(openP(w, h, O.seed), 4.5 * k, 2 * k).pts.forEach(p => pr += `<circle cx="${f2(p.x)}" cy="${f2(p.y)}" r="${K(1.45)}" fill="url(#${id}p)"/>`);
    along(openP(w, h, O.pearl), 6.6 * k, 3 * k).pts.forEach(p => pr += `<circle cx="${f2(p.x)}" cy="${f2(p.y)}" r="${K(2.55)}" fill="url(#${id}p)"/>`);
    // pillars with amalaka capitals (the ribbed crown stone of Bhubaneswar's temples) and lotus bases
    if (pillars) [px0, w - px0 - pw].forEach(x => {
      const cx = x + pw / 2, top = yS - 4 * k, sh0 = top + 11 * k, sh1 = h - 7 * k;
      lit += `<rect x="${f2(x)}" y="${f2(sh0)}" width="${f2(pw)}" height="${f2(sh1 - sh0)}" fill="url(#${id}g)"/>`;
      [.22, .5, .78].forEach(t => lit += `<path d="M${f2(x + pw * t)} ${f2(sh0 + 2 * k)}V${f2(sh1 - 2 * k)}" stroke="#7E5719" stroke-width="${K(.9)}"/>`);
      lit += `<rect x="${f2(x - 2 * k)}" y="${f2(sh0 - 2 * k)}" width="${f2(pw + 4 * k)}" height="${K(3)}" fill="url(#${id}g)"/>`;
      lit += `<ellipse cx="${f2(cx)}" cy="${f2(top + 5 * k)}" rx="${f2(pw * .78)}" ry="${K(4.2)}" fill="url(#${id}g)"/>`;
      for (let i = -3; i <= 3; i++) lit += `<path d="M${f2(cx + i * pw * .2)} ${f2(top + 1.6 * k)}V${f2(top + 8.4 * k)}" stroke="#7E5719" stroke-width="${K(.8)}"/>`;
      lit += `<circle cx="${f2(cx)}" cy="${f2(top)}" r="${K(3)}" fill="url(#${id}g)"/>`;
      pr += `<circle cx="${f2(cx)}" cy="${f2(top - 4.4 * k)}" r="${K(2)}" fill="url(#${id}p)"/>`;
      [-1, 0, 1].forEach(i => lit += `<ellipse cx="${f2(cx + i * pw * .36)}" cy="${f2(sh1 + 2 * k)}" rx="${f2(pw * .24)}" ry="${K(3.6)}" transform="rotate(${i * 18} ${f2(cx + i * pw * .36)} ${f2(sh1 + 2 * k)})" fill="url(#${id}g)"/>`);
      const jy = sh0 + (sh1 - sh0) * .42; pr += jewel(cx, jy, 3.6 * k, id, 'r'); glints.push([cx, jy, 12 * k]);
    });
    // the sill: gold mouldings around a velvet band of pearls and stones, with lotus-bud brackets beneath
    const sx0 = -padX + 6 * k, sx1 = w + padX - 6 * k;
    lit += `<rect x="${f2(sx0)}" y="${f2(h)}" width="${f2(sx1 - sx0)}" height="${K(4)}" fill="url(#${id}g)"/>`;
    lit += `<rect x="${f2(sx0 + 3 * k)}" y="${f2(h + 4 * k)}" width="${f2(sx1 - sx0 - 6 * k)}" height="${K(10)}" fill="#5E1022"/><rect x="${f2(sx0 + 3 * k)}" y="${f2(h + 4 * k)}" width="${f2(sx1 - sx0 - 6 * k)}" height="${K(10)}" fill="url(#${id}t)"/>`;
    lit += `<rect x="${f2(sx0)}" y="${f2(h + 14 * k)}" width="${f2(sx1 - sx0)}" height="${K(4)}" fill="url(#${id}g)"/>`;
    for (let x = sx0 + 8 * k; x <= sx1 - 8 * k; x += 5.2 * k) pr += `<circle cx="${f2(x)}" cy="${f2(h + 9 * k)}" r="${K(1.5)}" fill="url(#${id}p)"/>`;
    [-.5, -.25, 0, .25, .5].forEach((t, i) => {
      const x = w / 2 + t * (w + 20 * k);
      lit += `<path d="M${f2(x - 4.5 * k)} ${f2(h + 18 * k)}Q${f2(x - 4.5 * k)} ${f2(h + 24 * k)} ${f2(x)} ${f2(h + 28 * k)}Q${f2(x + 4.5 * k)} ${f2(h + 24 * k)} ${f2(x + 4.5 * k)} ${f2(h + 18 * k)}Z" fill="url(#${id}g)"/>`;
      if (i % 2 === 0) pr += jewel(x, h + 9 * k, 3.4 * k, id, i === 2 ? 'r' : 'e');
    });
    glints.push([w / 2, h + 9 * k, 14 * k]);
    // the lotus crown on the apex, set with a ruby and pearls
    for (let i = -3; i <= 3; i++) {
      const a = i * 23 * Math.PI / 180, cx = w / 2 + Math.sin(a) * 9 * k, cy = yOut - Math.cos(a) * 9 * k + 1 * k;
      lit += `<ellipse cx="${f2(cx)}" cy="${f2(cy)}" rx="${K(3.3)}" ry="${K(8.6)}" transform="rotate(${i * 23} ${f2(cx)} ${f2(cy)})" fill="url(#${id}g)"/>`;
    }
    lit += `<path d="M${f2(w / 2 - 12 * k)} ${f2(yOut + 2 * k)}H${f2(w / 2 + 12 * k)}" stroke="#D2A649" stroke-width="${K(3)}" stroke-linecap="round"/>`;
    pr += jewel(w / 2, yOut - 5 * k, 4.4 * k, id, 'r'); glints.push([w / 2, yOut - 5 * k, 18 * k]);
    [[-2, 17.5], [0, 20.5], [2, 17.5]].forEach(([i, r]) => { const a = i * 23 * Math.PI / 180; pr += `<circle cx="${f2(w / 2 + Math.sin(a) * r * k)}" cy="${f2(yOut - Math.cos(a) * r * k)}" r="${K(i ? 2.1 : 2.7)}" fill="url(#${id}p)"/>`; });
    // shading where the film meets the frame, so the film sits inside it rather than on top
    const inner = Orn.archPath(w, h).d;
    const shade = `<clipPath id="${id}c"><path d="${inner}"/></clipPath><g clip-path="url(#${id}c)"><path d="${inner}" fill="none" stroke="#1E0406" stroke-opacity=".62" stroke-width="${K(22)}" filter="url(#${id}b)"/></g>`;
    const R = (x, y) => `x="${f2(x)}" y="${f2(y)}"`;
    const defs = `<defs>
      <filter id="${id}f" filterUnits="userSpaceOnUse" ${R(-padX - 20, -padTop - 20)} width="${f2(W + 40)}" height="${f2(H + 40)}" color-interpolation-filters="sRGB">
        <feGaussianBlur in="SourceAlpha" stdDeviation="${K(1.1)}" result="ab"/><feColorMatrix in="SourceGraphic" type="luminanceToAlpha" result="lum"/>
        <feComposite in="ab" in2="lum" operator="arithmetic" k2=".55" k3=".5" result="h"/>
        <feDiffuseLighting in="h" surfaceScale="2.6" diffuseConstant="1.3" result="d"><feDistantLight azimuth="225" elevation="52"/></feDiffuseLighting>
        <feSpecularLighting in="h" surfaceScale="2.6" specularConstant=".95" specularExponent="24" lighting-color="#FFF3D6" result="s"><feDistantLight azimuth="225" elevation="38"/></feSpecularLighting>
        <feComposite in="SourceGraphic" in2="d" operator="arithmetic" k1="1" result="m"/><feComposite in="s" in2="SourceAlpha" operator="in" result="s2"/>
        <feComposite in="m" in2="s2" operator="arithmetic" k2="1" k3=".65" result="l"/><feComposite in="l" in2="SourceAlpha" operator="in" result="l2"/>
        <feGaussianBlur in="SourceAlpha" stdDeviation="${K(2.2)}" result="sb"/><feOffset in="sb" dx="${K(1.4)}" dy="${K(3)}" result="so"/><feFlood flood-color="#2A0A06" flood-opacity=".42"/><feComposite in2="so" operator="in" result="sh"/>
        <feMerge><feMergeNode in="sh"/><feMergeNode in="l2"/></feMerge></filter>
      <filter id="${id}d" filterUnits="userSpaceOnUse" ${R(-padX - 20, -padTop - 20)} width="${f2(W + 40)}" height="${f2(H + 40)}"><feDropShadow dx="${K(.6)}" dy="${K(1.1)}" stdDeviation="${K(.7)}" flood-color="#2A0A06" flood-opacity=".5"/></filter>
      <filter id="${id}b" filterUnits="userSpaceOnUse" ${R(-40, -40)} width="${f2(w + 80)}" height="${f2(h + 80)}"><feGaussianBlur stdDeviation="${K(7)}"/></filter>
      <pattern id="${id}t" width="40" height="1.25" patternUnits="userSpaceOnUse"><rect width="40" height=".55" fill="#fff" fill-opacity=".17"/><rect y=".72" width="40" height=".5" fill="#000" fill-opacity=".11"/></pattern>
      <linearGradient id="${id}g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F4DC92"/><stop offset=".45" stop-color="#D6AE58"/><stop offset="1" stop-color="#A47628"/></linearGradient>
      <radialGradient id="${id}p" cx=".5" cy=".5" r=".5" fx=".34" fy=".3"><stop offset="0" stop-color="#fff"/><stop offset=".35" stop-color="#F7F1E6"/><stop offset=".78" stop-color="#D8CCB4"/><stop offset="1" stop-color="#A28F6E"/></radialGradient>
      <radialGradient id="${id}s" cx=".5" cy=".5" r=".5" fx=".38" fy=".34"><stop offset="0" stop-color="#FFF7D4"/><stop offset=".35" stop-color="#EBC86E"/><stop offset=".8" stop-color="#B98B34"/><stop offset="1" stop-color="#7E5719"/></radialGradient>
      <radialGradient id="${id}r" cx=".5" cy=".5" r=".5" fx=".36" fy=".3"><stop offset="0" stop-color="#FFB3BD"/><stop offset=".3" stop-color="#E0344F"/><stop offset=".78" stop-color="#9A0E28"/><stop offset="1" stop-color="#5A0414"/></radialGradient>
      <radialGradient id="${id}e" cx=".5" cy=".5" r=".5" fx=".36" fy=".3"><stop offset="0" stop-color="#B8F2D4"/><stop offset=".3" stop-color="#26A56C"/><stop offset=".78" stop-color="#0B5A3E"/><stop offset="1" stop-color="#043322"/></radialGradient>
    </defs>`;
    const svg = `<svg viewBox="${f2(-padX)} ${f2(-padTop)} ${f2(W)} ${f2(H)}" aria-hidden="true">${defs}${shade}<g filter="url(#${id}f)">${lit}</g><g filter="url(#${id}d)">${pr}</g></svg>`;
    // strings of pearls for the scallops, and a jewelled pendant at the centre
    const sc = scallops(w, h), c = Math.floor(sc.length / 2), hang = [];
    sc.forEach((p, i) => {
      if (i === 0 || i === sc.length - 1) return;
      const tik = i === c, sw = (tik ? 20 : 14) * k, sh = (tik ? 34 : 22) * k;
      const body = tik
        ? `<path d="M10 0V8" stroke="#D2A649" stroke-width="1.1" stroke-dasharray="1.6 1"/><path d="M10 7.4L15 12.4L10 17.4L5 12.4Z" fill="url(#${id}s)"/><circle cx="10" cy="12.4" r="2.9" fill="url(#${id}r)"/><path d="M10 18.6C12.8 21.6 13.6 24.4 13.6 26.4A3.6 3.6 0 0 1 6.4 26.4C6.4 24.4 7.2 21.6 10 18.6Z" fill="url(#${id}p)"/>`
        : `<path d="M7 0V3.4" stroke="#D2A649" stroke-width="1"/><circle cx="7" cy="5.2" r="1.7" fill="url(#${id}p)"/><circle cx="7" cy="8.9" r="1.7" fill="url(#${id}p)"/><path d="M7 10.8C9.4 10.8 9.9 13.4 9.9 14.8L7 19.2L4.1 14.8C4.1 13.4 4.6 10.8 7 10.8Z" fill="url(#${id}s)"/><circle cx="7" cy="20.4" r="1.1" fill="url(#${id}p)"/>`;
      hang.push({ x: p.x, y: p.y - 1.5 * k, w: sw, h: sh, tik, html: `<svg viewBox="0 0 ${tik ? 20 : 14} ${tik ? 34 : 22}">${body}</svg>` });
      if (tik) glints.push([p.x, p.y + 11 * k, 14 * k]);
    });
    return { svg, padX, padTop, W, H, hang, glints };
  }
  return { frame, shift };
})();
function placeFrame(win, el, jh, fx) {
  const w = win.offsetWidth, h = win.offsetHeight; if (!w || !h) return;
  const key = w + 'x' + h; if (el._k === key) return; el._k = key;
  const fr = Jharokha.frame(w, h);
  Object.assign(el.style, { left: -fr.padX + 'px', top: -fr.padTop + 'px', width: fr.W + 'px', height: fr.H + 'px' });
  // The embroidery's lighting filter is costly to paint, so it is painted once into a bitmap,
  // which then moves and scales freely. A hidden copy of the gradients serves the hanging pearls.
  const dpr = Math.min(devicePixelRatio || 1, 2.5), bw = Math.round(fr.W * dpr), bh = Math.round(fr.H * dpr);
  const defs = fr.svg.match(/<defs>[\s\S]*?<\/defs>/)[0];
  el.innerHTML = `<svg width="0" height="0" style="position:absolute" aria-hidden="true">${defs}</svg>`;
  const img = new Image();
  img.onload = () => {
    if (el._k !== key) return;
    const cv = document.createElement('canvas'); cv.width = bw; cv.height = bh;
    cv.getContext('2d').drawImage(img, 0, 0, bw, bh);
    el.querySelector('canvas, svg.live') && el.querySelector('canvas, svg.live').remove();
    el.appendChild(cv);
  };
  img.onerror = () => { if (el._k === key) el.insertAdjacentHTML('beforeend', fr.svg.replace('<svg ', '<svg class="live" ')); };
  img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(fr.svg.replace('<svg ', `<svg xmlns="http://www.w3.org/2000/svg" width="${bw}" height="${bh}" `));
  jh.innerHTML = fr.hang.map((s, i) => `<i class="jh${s.tik ? ' jh--tik' : ''}" style="left:${f2(s.x)}px;top:${f2(s.y)}px;width:${f2(s.w)}px;height:${f2(s.h)}px;margin-left:${f2(-s.w / 2)}px;--d:${f2(-(i * .55) % 3.6)}s">${s.html}</i>`).join('');
  fx.innerHTML = fr.glints.map(([x, y, s], i) => `<i class="gl" style="left:${f2(x)}px;top:${f2(y)}px;--s:${f2(s * 1.6)}px;--d:${f2(i * .83 % 5.5)}s"></i>`).join('');
}


/* ═════════ sparks, petals and stardust ═════════ */
const FX = (() => {
  const cv = $('#fx'), ctx = cv.getContext('2d'); let parts = [], raf = 0, dpr = 1, last = 0;
  const size = () => { dpr = Math.min(1.5, devicePixelRatio || 1); cv.width = innerWidth * dpr; cv.height = innerHeight * dpr; };
  size(); addEventListener('resize', size);
  const GOLD = ['#FFE19A', '#FFC14D', '#F6D68A', '#FFF3D0'], PETAL = ['#F7A21B', '#FFC234', '#E8742F', '#D7344A', '#FFB020'];
  const DUST = ['#C99A3B', '#D4A645', '#E2B85A', '#B8862B', '#E9C46A', '#FFF1C8'];
  const pick = a => a[Math.floor(Math.random() * a.length)];
  const cap = () => { if (parts.length > 480) parts.splice(0, parts.length - 480); };
  function embers(x, y, n = 30, spread = 1) {
    if (RM) return;
    for (let i = 0; i < n; i++) parts.push({ k: 'e', x: x + (Math.random() - .5) * 20 * spread, y, vx: (Math.random() - .5) * 2 * spread, vy: -1 - Math.random() * 3, g: -.01, s: .8 + Math.random() * 1.6, c: pick(GOLD), life: 1, d: .014 + Math.random() * .012, w: Math.random() * 6, r: 0 });
    cap(); go();
  }
  function burst(x, y, n = 60, power = 1) {
    if (RM) return;
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2, v = (2 + Math.random() * 8) * power;
      parts.push({ k: Math.random() < .6 ? 'p' : 'e', x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 3 * power, g: .12, s: 1.2 + Math.random() * 2.2, c: Math.random() < .3 ? pick(GOLD) : pick(PETAL), life: 1, d: .007 + Math.random() * .008, w: Math.random() * 6, r: Math.random() * 6 });
    }
    cap(); go();
  }
  // stardust: four-pointed glints and fine glitter that twinkle as they drift and fall
  function dust(x, y, n = 18, power = 1, trail = false) {
    if (RM) return;
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2, v = trail ? Math.random() * .7 : (.5 + Math.random() * 3.4) * power;
      const big = !trail && Math.random() < .18;
      parts.push({ k: Math.random() < (trail ? .45 : .6) ? 's' : 'g', x: x + (trail ? (Math.random() - .5) * 10 : 0), y: y + (trail ? (Math.random() - .5) * 10 : 0),
        vx: Math.cos(a) * v, vy: Math.sin(a) * v - (trail ? .15 : .9 * power), g: trail ? .018 : .045, s: (trail ? .95 : 1.1) * (1.2 + Math.random() * (big ? 3.4 : 2.1)), c: pick(DUST),
        life: 1, d: (trail ? .016 : .011) + Math.random() * .014, w: Math.random() * 6, r: Math.random() * 6, tw: 2 + Math.random() * 3 });
    }
    cap(); go();
  }
  function star(x, y, r, rot) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.beginPath();
    for (let i = 0; i < 4; i++) { const a = i * Math.PI / 2, b = a + Math.PI / 4; ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r); ctx.lineTo(Math.cos(b) * r * .22, Math.sin(b) * r * .22); }
    ctx.closePath(); ctx.fill(); ctx.restore();
  }
  function tick(now) {
    const k = last ? clamp((now - last) / 16.67, .5, 3) : 1; last = now;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, innerWidth, innerHeight);
    for (let i = parts.length - 1; i >= 0; i--) {
      const p = parts[i], dusty = p.k === 's' || p.k === 'g';
      p.vy += p.g * k; p.vx *= Math.pow(dusty ? .96 : .98, k); p.vy *= Math.pow(dusty ? .97 : .98, k); p.w += .07 * k;
      p.x += (p.vx + Math.sin(p.w) * (dusty ? .18 : .5)) * k; p.y += p.vy * k; p.life -= p.d * k;
      if (p.life <= 0 || p.y > innerHeight + 40) { parts.splice(i, 1); continue; }
      const fade = Math.min(1, p.life * 1.8);
      if (dusty) {
        const tw = .55 + .45 * Math.sin(p.w * p.tw);
        ctx.fillStyle = p.c;
        if (p.k === 's') {
          ctx.globalAlpha = fade * .22 * tw; ctx.beginPath(); ctx.arc(p.x, p.y, p.s * 2.6, 0, 6.29); ctx.fill();
          const sr = p.s * (1.7 + 1.3 * tw); p.r += .03 * k;
          ctx.fillStyle = '#6E4A0E'; ctx.globalAlpha = fade * .38; star(p.x + .4, p.y + .7, sr * 1.22, p.r);
          ctx.fillStyle = p.c; ctx.globalAlpha = fade * (.55 + .45 * tw); star(p.x, p.y, sr, p.r);
          ctx.fillStyle = '#FFFDF4'; ctx.globalAlpha = fade * tw; ctx.beginPath(); ctx.arc(p.x, p.y, p.s * .38, 0, 6.29); ctx.fill();
        } else { ctx.fillStyle = '#7A520F'; ctx.globalAlpha = fade * .4; ctx.beginPath(); ctx.arc(p.x + .3, p.y + .5, p.s * .7, 0, 6.29); ctx.fill(); ctx.fillStyle = p.c; ctx.globalAlpha = fade * (.45 + .55 * tw); ctx.beginPath(); ctx.arc(p.x, p.y, p.s * .55, 0, 6.29); ctx.fill(); }
        continue;
      }
      ctx.globalAlpha = fade;
      if (p.k === 'e') { ctx.fillStyle = p.c; ctx.beginPath(); ctx.arc(p.x, p.y, p.s * 1.3, 0, 6.29); ctx.fill(); ctx.globalAlpha *= .25; ctx.beginPath(); ctx.arc(p.x, p.y, p.s * 3.5, 0, 6.29); ctx.fill(); }
      else { ctx.save(); ctx.translate(p.x, p.y); p.r += .07 * k; ctx.rotate(p.r); ctx.fillStyle = p.c; ctx.beginPath(); ctx.ellipse(0, 0, p.s * 3.4, p.s * 1.6 * Math.abs(Math.cos(p.w)) + .6, 0, 0, 6.29); ctx.fill(); ctx.restore(); }
    }
    ctx.globalAlpha = 1;
    if (parts.length) raf = requestAnimationFrame(tick); else { raf = 0; last = 0; ctx.clearRect(0, 0, innerWidth, innerHeight); }
  }
  const go = () => { if (!raf) raf = requestAnimationFrame(tick); };
  return { embers, burst, dust };
})();

/* stardust wherever a finger or the mouse touches: a puff on each tap, a fine trail while moving */
(() => {
  if (RM) return;
  let lx = 0, ly = 0;
  const trail = (x, y, gap) => {
    const d = Math.hypot(x - lx, y - ly); if (d < gap) return;
    const n = Math.min(5, Math.floor(d / gap));
    for (let i = 1; i <= n; i++) FX.dust(lx + (x - lx) * i / n, ly + (y - ly) * i / n, 1, 1, true);
    lx = x; ly = y;
  };
  addEventListener('pointerdown', e => { lx = e.clientX; ly = e.clientY; FX.dust(lx, ly, e.pointerType === 'mouse' ? 14 : 22, e.pointerType === 'mouse' ? .8 : 1); }, { passive: true });
  addEventListener('pointermove', e => { if (e.pointerType === 'mouse') trail(e.clientX, e.clientY, 22); }, { passive: true });
  addEventListener('touchstart', e => { const t = e.touches[0]; if (t) { lx = t.clientX; ly = t.clientY; } }, { passive: true });
  addEventListener('touchmove', e => { const t = e.touches[0]; if (t) trail(t.clientX, t.clientY, 9); }, { passive: true });
})();

/* the arch window: the film plays inside a zari frame */
const win = $('#win'), clip = $('#winClip'), frameEl = $('#winFrame'), film = $('#film');
function sizeWin() { const w = win.offsetWidth, h = win.offsetHeight; if (!w) return; clip.style.clipPath = `path('${Orn.archPath(w, h).d}')`; placeFrame(win, frameEl, $('#winJh'), $('#winFx')); }
sizeWin(); new ResizeObserver(sizeWin).observe(win);
const F = CONFIG.film || {};
if (F.poster) film.poster = F.poster;
let filmOn = false;
const playFilm = () => { if (!filmOn || RM) return; if (!film.src && F.src) film.src = F.src; const p = film.play(); if (p && p.catch) p.catch(() => {}); };
new IntersectionObserver(([e]) => { if (e.isIntersecting) playFilm(); else film.pause(); }, { threshold: .15 }).observe(win);

/* gentle reveals, once each */
const reveal = new IntersectionObserver(es => {
  let n = 0;
  es.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target, card = el.classList.contains('rvc');
    if (!card) el.style.transitionDelay = `${Math.min(n++, 5) * 90 + (el.closest('.rvc:not(.in)') ? 260 : 0)}ms`;
    el.classList.add('in'); reveal.unobserve(el);
    // once a card has unfolded, hand its transform back (the reply card flips later)
    if (card) el.addEventListener('transitionend', function te(ev) { if (ev.target === el && ev.propertyName === 'transform') { el.classList.remove('rvc', 'in'); el.removeEventListener('transitionend', te); } });
    else el.addEventListener('transitionend', () => { el.style.transitionDelay = ''; }, { once: true });
  });
}, { rootMargin: '0px 0px -8% 0px' });
$$('.card[data-card]').forEach(c => { if (!c.closest('#top')) c.classList.add('rvc'); });

/* ═════════ the opening of the card: one choreographed entrance after the envelope ═════════ */
$$('#top .rv').forEach(el => el.classList.remove('rv'));
const Hero = (() => {
  const top = $('#top');
  // ambient glints scattered over the silk
  const sprinkle = (host, n, seed) => { let s = seed; const r = () => (s = (s * 16807) % 2147483647) / 2147483647;
    host.insertAdjacentHTML('beforeend', Array.from({ length: n }, (_, i) => `<i class="tw" style="left:${f2(4 + r() * 92)}%;top:${f2(6 + r() * 88)}%;--s:${f2(10 + r() * 12)}px;--d:${f2(r() * 7)}s;--t:${f2(5 + r() * 4)}s"></i>`).join('')); };
  sprinkle($('#top .card'), innerWidth < 700 ? 7 : 12, 11);
  sprinkle($('#env'), innerWidth < 700 ? 6 : 10, 29);
  const names = $$('.names .w');
  const shine = () => names.forEach((w, i) => { w.classList.remove('shine'); void w.offsetWidth; w.style.animationDelay = i * .25 + 's'; w.classList.add('shine'); });
  if (RM) return { play() {} , shine() {} };
  const q = s => $$(s, top);
  const tl = gsap.timeline({ paused: true, defaults: { ease: 'expo.out' } })
    .from('#top .card', { opacity: 0, y: 46, scale: .965, duration: 1.3 }, 0)
    .from('#top .toran', { y: -70, opacity: 0, duration: 1.3, ease: 'back.out(1.5)' }, .2)
    .from('#win', { opacity: 0, y: 60, scale: .86, duration: 1.6 }, .3)
    .from('#film', { scale: 1.45, duration: 2.6, ease: 'power2.out' }, .3)
    .from('#winJh', { y: -16, opacity: 0, duration: 1.2 }, .95)
    .from('.ele--l', { x: -90, opacity: 0, duration: 1.5, ease: 'power3.out' }, .75)
    .from('.ele--r', { x: 90, opacity: 0, duration: 1.5, ease: 'power3.out' }, .75)
    .from('.om .kalash', { y: -26, scale: .4, opacity: 0, duration: 1, ease: 'back.out(2.2)' }, .55)
    .from('.om .diya', { y: 16, opacity: 0, duration: .9, stagger: .12 }, .65)
    .from('.diya__flame', { scale: 0, duration: .7, ease: 'back.out(3)', stagger: .12 }, 1.05)
    .from([...q('.sri'), ...q('.mantra span'), ...q('[data-orn="divider"]'), ...q('.blessing')], { y: 26, opacity: 0, duration: 1.1, stagger: .08 }, .7)
    .from('.names .w--a', { x: -60, opacity: 0, duration: 1.4 }, 1.1)
    .from('.names .w--b', { x: 60, opacity: 0, duration: 1.4 }, 1.1)
    .from('.names .amp', { scale: 0, rotate: -140, opacity: 0, duration: 1.1, ease: 'back.out(2)' }, 1.3)
    .from([...q('.names small'), ...q('.facts > *'), ...q('.cta .btn')], { y: 22, opacity: 0, duration: 1, stagger: .07 }, 1.35)
    .add(() => {
      const r = $('.names').getBoundingClientRect();
      for (let i = 0; i < 5; i++) FX.dust(r.left + r.width * (.12 + i * .19), r.top + r.height * .4, 7, .7);
      shine();
    }, 1.75)
    .add(() => { const f = $('#winFx .gl'); if (f) { const r = f.getBoundingClientRect(); FX.dust(r.left + r.width / 2, r.top + r.height / 2, 20, .9); } }, 1.2);
  // the names catch the light again now and then, while they are on screen
  let vis = false; new IntersectionObserver(([e]) => vis = e.isIntersecting).observe($('.names'));
  setInterval(() => { if (vis && !document.hidden) shine(); }, 9000);
  return { play: () => tl.play(), shine };
})();

/* ═════════ THE ENVELOPE ═════════ */
(() => {
  const box = $('#envBox'), flap = $('#envFlap'), card = $('#envCard'), seal = $('#seal'), btn = $('#envOpen'), forEl = $('.env__for');
  html.classList.add('is-locked'); main.inert = true; hd.inert = true;
  let opened = false;
  gsap.set(seal, { xPercent: -50, yPercent: -50 });
  if (!RM) {
    gsap.set([forEl, btn], { opacity: 0, y: 18 });
    gsap.set(box, { opacity: 0, y: 50, rotateX: 14, transformPerspective: 1400, transformOrigin: '50% 100%' });
    const imgs = $$('img', box).map(i => i.decode ? i.decode().catch(() => {}) : 0);
    Promise.race([Promise.all([document.fonts.ready, ...imgs]), wait(2000)]).then(() => {
      gsap.timeline()
        .to(forEl, { opacity: 1, y: 0, duration: 1.2, ease: 'expo.out' }, 0)
        .to(box, { opacity: 1, y: 0, rotateX: 0, duration: 1.5, ease: 'expo.out' }, .15)
        .to(btn, { opacity: 1, y: 0, duration: 1, ease: 'expo.out' }, .7);
    });
  }
  function open() {
    if (opened) return; opened = true;
    if (RM) { done(); return; }
    const sr = seal.getBoundingClientRect(), br = box.getBoundingClientRect(), cr = card.getBoundingClientRect();
    FX.burst(sr.left + sr.width / 2, sr.top + sr.height / 2, 36, .7);
    FX.dust(sr.left + sr.width / 2, sr.top + sr.height / 2, 40, 1.4);
    const glow = document.createElement('i'); glow.className = 'env__glow'; box.prepend(glow);
    gsap.timeline({ onComplete: done })
      .to([forEl, btn], { opacity: 0, y: -12, duration: .4, ease: 'power2.in' }, 0)
      .to(seal, { scale: 1.12, duration: .12, ease: 'power2.out' }, 0)
      .to(seal, { y: innerHeight * .8, rotate: 90, opacity: 0, duration: .8, ease: 'power2.in' }, .12)
      .to(flap, { rotateX: 180, duration: .8, ease: 'power3.inOut' }, .18)
      .set(flap, { zIndex: 0 }, .6).set(card, { zIndex: 2 }, .6)
      .to(card, { y: -cr.height * .55, duration: .8, ease: 'power3.inOut' }, .75)
      .fromTo(glow, { scale: .2, opacity: 0 }, { scale: 1.6, opacity: 1, duration: .9, ease: 'power2.out' }, .7)
      .to(glow, { opacity: 0, scale: 2.4, duration: .8, ease: 'power2.in' }, 1.6)
      .add(() => { FX.burst(br.left + br.width / 2, br.top + br.height * .15, 60, 1); FX.dust(br.left + br.width / 2, br.top + br.height * .2, 70, 2); }, 1.3)
      .to(['.env__back', '.env__front', flap, '.env__shadow'], { y: innerHeight * .6, opacity: 0, duration: .7, ease: 'power3.in' }, 1.45)
      .to(card, { y: 0, scale: Math.max(innerWidth / cr.width, innerHeight / cr.height) * 1.05, opacity: 0, duration: .9, ease: 'expo.in' }, 1.55)
      .add(() => Hero.play(), 1.95)
      .to(env, { opacity: 0, duration: .5 }, 2.05);
  }
  btn.addEventListener('click', open);
  box.addEventListener('click', open);
  addEventListener('keydown', e => { if (!opened && (e.key === 'Enter' || e.key === ' ') && document.activeElement === document.body) { e.preventDefault(); open(); } });
  function done() {
    env.remove(); html.classList.remove('is-locked'); main.inert = false; hd.inert = false;
    hd.classList.add('on'); bar.classList.add('on');
    $$('.rv,.rvc').forEach(el => reveal.observe(el));
    filmOn = true; playFilm();
  }
  setTimeout(() => btn.focus({ preventScroll: true }), RM ? 0 : 1800);
})();

/* the phone bar steps aside while the reply card is on screen */
new IntersectionObserver(([e]) => bar.classList.toggle("on", !e.isIntersecting && !env.isConnected), { threshold: .15 }).observe($('#rsvp'));

/* ═════════ dates, countdown, calendar ═════════ */
const [Y, Mo, Da] = (CONFIG.date || '2026-12-06').split('-').map(Number);
const hasTime = /^\d{1,2}:\d{2}$/.test(CONFIG.time || '');
const [hh, mm] = hasTime ? CONFIG.time.split(':').map(Number) : [0, 0];
const startUTC = Date.UTC(Y, Mo - 1, Da, hh, mm) - 330 * 60000; // IST = UTC+5:30
const timeLabel = hasTime ? new Date(Date.UTC(2000, 0, 1, hh, mm)).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', timeZone: 'UTC' }) : '';
if (hasTime) $('#whenTop').textContent = `Sunday, 6 December 2026, ${timeLabel}`;
const pad2 = n => String(n).padStart(2, '0');
(() => {
  const els = Object.fromEntries($$('.cd [data-k]').map(e => [e.dataset.k, e]));
  function upd() {
    let ms = startUTC - Date.now();
    if (ms <= 0) { ms = 0; $('.cd').setAttribute('aria-label', 'The engagement is today'); }
    const s = Math.floor(ms / 1000);
    set(els.d, Math.floor(s / 86400)); set(els.h, pad2(Math.floor(s % 86400 / 3600))); set(els.m, pad2(Math.floor(s % 3600 / 60))); set(els.s, pad2(s % 60));
  }
  // each number rolls in as it changes
  function set(el, v) { v = String(v); if (el.textContent === v) return; const first = !el.textContent || el.textContent === '0'; el.textContent = v; if (RM || first) return; el.classList.remove('tick'); void el.offsetWidth; el.classList.add('tick'); }
  upd(); setInterval(upd, 1000);
})();
const fmt = t => { const d = new Date(t); return `${d.getUTCFullYear()}${pad2(d.getUTCMonth() + 1)}${pad2(d.getUTCDate())}T${pad2(d.getUTCHours())}${pad2(d.getUTCMinutes())}00Z`; };
const title = 'Asish & Ipsita: Engagement (Nirbandha)', details = 'The engagement of Asish Sahoo and Ipsita Senapati.';
const dayS = `${Y}${pad2(Mo)}${pad2(Da)}`, nx = new Date(Date.UTC(Y, Mo - 1, Da + 1)), nextDay = `${nx.getUTCFullYear()}${pad2(nx.getUTCMonth() + 1)}${pad2(nx.getUTCDate())}`;
const durMs = (CONFIG.durationHours || 4) * 3600000;
const loc = CONFIG.venue.name + ', ' + CONFIG.venue.address;
const gcalURL = 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=' + encodeURIComponent(title) + '&dates=' + (hasTime ? `${fmt(startUTC)}/${fmt(startUTC + durMs)}` : `${dayS}/${nextDay}`) + '&details=' + encodeURIComponent(details) + '&location=' + encodeURIComponent(loc);
function downloadICS() {
  const esc = s => s.replace(/,/g, '\\,');
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Asish and Ipsita//Engagement//EN', 'BEGIN:VEVENT', 'UID:asish-ipsita-20261206@engagement', 'DTSTAMP:' + fmt(Date.now()),
    ...(hasTime ? ['DTSTART:' + fmt(startUTC), 'DTEND:' + fmt(startUTC + durMs)] : ['DTSTART;VALUE=DATE:' + dayS, 'DTEND;VALUE=DATE:' + nextDay]),
    'SUMMARY:' + esc(title), 'DESCRIPTION:' + esc(details), 'LOCATION:' + esc(loc), 'END:VEVENT', 'END:VCALENDAR'];
  const url = URL.createObjectURL(new Blob([lines.join('\r\n')], { type: 'text/calendar' }));
  const a = document.createElement('a'); a.href = url; a.download = 'asish-ipsita-engagement.ics'; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
$('#gcal').href = gcalURL;
$('#ics').addEventListener('click', downloadICS);
// the one-tap button picks the calendar the phone already uses
const apple = /iPhone|iPad|iPod|Macintosh/.test(navigator.userAgent);
$$('[data-addcal]').forEach(b => b.addEventListener('click', () => apple ? downloadICS() : open(gcalURL, '_blank', 'noopener')));

/* directions and address */
$$('[data-dir]').forEach(a => a.href = CONFIG.venue.maps);
$('#copyAddr').addEventListener('click', async e => {
  const b = e.currentTarget, t = b.textContent;
  try { await navigator.clipboard.writeText(loc); b.textContent = 'Address copied'; } catch (_) { b.textContent = 'Press and hold the address to copy'; }
  setTimeout(() => b.textContent = t, 2400);
});

(() => {
  const V = CONFIG.venue, el = $('#vmap');
  const places = [{ name: V.name, at: V.pin || [20.2984, 85.8231], venue: true }, ...(V.landmarks || [])];
  // warm ivory map to sit inside the zari frame
  const STYLE = [
    { elementType: 'geometry', stylers: [{ color: '#F3ECDF' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#7A5442' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#FBF8F3' }, { weight: 3 }] },
    { featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{ color: '#D9C7A8' }] },
    { featureType: 'administrative.land_parcel', stylers: [{ visibility: 'off' }] },
    { featureType: 'landscape.man_made', elementType: 'geometry', stylers: [{ color: '#EEE5D4' }] },
    { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
    { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#EAE1CF' }] },
    { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#E0E4C8' }] },
    { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#FFFFFF' }] },
    { featureType: 'road', elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
    { featureType: 'road.arterial', elementType: 'geometry', stylers: [{ color: '#FCF6EA' }] },
    { featureType: 'road.highway', elementType: 'geometry.fill', stylers: [{ color: '#EED9AC' }] },
    { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#D4AE5E' }] },
    { featureType: 'road.local', elementType: 'labels', stylers: [{ visibility: 'off' }] },
    { featureType: 'transit.line', elementType: 'geometry', stylers: [{ color: '#C9B48E' }] },
    { featureType: 'transit.station', stylers: [{ visibility: 'off' }] },
    { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#CCDCDD' }] },
    { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#6E8A90' }] }
  ];
  let map = null, started = false, failed = false;
  const pad = () => innerWidth < 700 ? { top: 96, left: 36, right: 36, bottom: 50 } : { top: 104, left: 70, right: 70, bottom: 56 };
  // if the key is missing, refused or the script cannot load, show Google's plain embed instead
  function fallback() {
    if (failed) return; failed = true; map = null;
    const q = encodeURIComponent(V.name + ', ' + V.address);
    el.innerHTML = `<iframe title="Map showing ${V.name}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://maps.google.com/maps?q=${q}&z=15&output=embed"></iframe>`;
  }
  window.gm_authFailure = fallback;
  async function build() {
    try {
      const { Map, OverlayView } = await google.maps.importLibrary('maps');
      const { LatLng, LatLngBounds, ControlPosition } = await google.maps.importLibrary('core');
      if (failed) return;
      el.innerHTML = '';
      map = new Map(el, { styles: STYLE, disableDefaultUI: true, zoomControl: true, zoomControlOptions: { position: ControlPosition.LEFT_BOTTOM }, gestureHandling: 'cooperative', clickableIcons: false, keyboardShortcuts: false, backgroundColor: '#F3ECDF' });
      // HTML pins (the wax seal and gold markers) drawn as an overlay so they keep the site's styling
      class Pin extends OverlayView {
        constructor(p, i) { super(); this.p = p; this.i = i; this.pos = new LatLng(p.at[0], p.at[1]); }
        onAdd() {
          const d = document.createElement('div'); d.className = 'pin-ov';
          d.innerHTML = this.p.venue ? `<div class="pin pin--venue"><img src="assets/art/seal.webp" alt=""><span>${this.p.name}</span></div>` : `<div class="pin${this.p.side ? ' pin--' + this.p.side : ''}"><i></i><span>${this.p.name}</span></div>`;
          d.style.zIndex = this.p.venue ? 2 : 1;
          d.addEventListener('click', e => { e.stopPropagation(); focus(this.i); });
          this.d = d; this.getPanes().overlayMouseTarget.appendChild(d);
        }
        draw() { const pt = this.getProjection().fromLatLngToDivPixel(this.pos); if (pt) { this.d.style.left = pt.x + 'px'; this.d.style.top = pt.y + 'px'; } }
        onRemove() { this.d && this.d.remove(); }
      }
      places.forEach((p, i) => new Pin(p, i).setMap(map));
      const b = new LatLngBounds(); places.forEach(p => b.extend(new LatLng(p.at[0], p.at[1])));
      map.fitBounds(b, pad());
      places.bounds = b;
    } catch (e) { fallback(); }
  }
  function load() {
    if (started) return; started = true;
    if (!CONFIG.venue.mapsKey) { fallback(); return; }
    window.__aiMap = build;
    const sc = document.createElement('script');
    sc.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(CONFIG.venue.mapsKey)}&v=weekly&loading=async&callback=__aiMap`;
    sc.async = true; sc.onerror = fallback;
    document.head.appendChild(sc);
  }
  function focus(i) {
    if (!map) return;
    const [lat, lng] = places[i].at;
    map.panTo({ lat, lng });
    map.setZoom(i ? 15 : 16);
  }
  new IntersectionObserver(([e]) => { if (e.isIntersecting) load(); }, { rootMargin: '700px' }).observe(el);
})();

/* the hotel's seal drops onto the map once the map is on screen */
new IntersectionObserver(([e], o) => { if (e.isIntersecting) { $('#vmap').classList.add('inview'); o.disconnect(); } }, { threshold: .45 }).observe($('#vmap'));

/* ═════════ MOMENTS: a row of photographs, and a viewer ═════════ */
const M = CONFIG.moments || [];
const Lightbox = (() => {
  const lb = $('#lb'), img = $('#lbImg'), cap = $('#lbCap'); let i = 0, last = null;
  const show = k => { i = (k + M.length) % M.length; img.src = M[i].src; img.alt = M[i].title; cap.textContent = M[i].title; };
  function open(k) {
    last = document.activeElement; show(k); lb.hidden = false; html.classList.add('is-locked');
    if (!RM) gsap.fromTo('.lb__fig', { opacity: 0, y: 20, scale: .97 }, { opacity: 1, y: 0, scale: 1, duration: .6, ease: 'expo.out' });
    setTimeout(() => $('.lb__close').focus(), 50);
  }
  function close() { lb.hidden = true; html.classList.remove('is-locked'); last && last.focus && last.focus({ preventScroll: true }); }
  lb.addEventListener('click', e => { if (e.target.closest('[data-close]')) close(); });
  $('#lbPrev').addEventListener('click', () => show(i - 1)); $('#lbNext').addEventListener('click', () => show(i + 1));
  addEventListener('keydown', e => {
    if (lb.hidden) return;
    if (e.key === 'Escape') close(); if (e.key === 'ArrowLeft') show(i - 1); if (e.key === 'ArrowRight') show(i + 1);
    if (e.key === 'Tab') { const fb = $$('button', lb), first = fb[0], lastB = fb[fb.length - 1]; if (e.shiftKey && document.activeElement === first) { e.preventDefault(); lastB.focus(); } else if (!e.shiftKey && document.activeElement === lastB) { e.preventDefault(); first.focus(); } }
  });
  // swipe between photos on phones
  let sx = null; lb.addEventListener('touchstart', e => sx = e.touches[0].clientX, { passive: true });
  lb.addEventListener('touchend', e => { if (sx === null) return; const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) show(i + (dx < 0 ? 1 : -1)); sx = null; });
  return { open };
})();

/* The photographs fly in, line up, form a ring around the title, then open out into an arch you can swipe along.
   Driven by normal page scrolling plus a short timer: the page never captures the wheel or gets stuck. */
(() => {
  const track = $('#moTrack'), stage = $('#mo'), wrap = $('#moCards'), head = $('#moHead'), sub = $('.mo__sub', head), nameEl = $('#moName'), prev = $('#moPrev'), next = $('#moNext');
  if (!M.length) { $('#moments').remove(); return; }
  // repeat the photos so the ring is full (an odd number of copies keeps the originals in the middle of the arch)
  const L = M.length; let reps = L >= 12 ? 1 : Math.ceil(12 / L); if (reps % 2 === 0) reps++;
  const N = L * reps, base = L * ((reps - 1) / 2);
  const mi = i => ((i - base) % L + L) % L;
  wrap.innerHTML = Array.from({ length: N }, (_, i) => {
    const m = M[mi(i)], orig = i >= base && i < base + L;
    return `<button class="mc" type="button" data-i="${i}" ${orig ? `aria-label="Open photograph: ${m.title}"` : 'tabindex="-1" aria-hidden="true"'}><span class="mc__in"><span class="mc__f"><img src="${thumb(m.src)}" alt="" draggable="false" decoding="async"></span><span class="mc__b"><em>${m.title}</em><small>View larger</small></span></span></button>`;
  }).join('');
  const cards = $$('.mc', wrap);
  const S = cards.map(() => ({ x: 0, y: 0, r: 0, s: .3, o: 0, vx: 0, vy: 0, vr: 0, vs: 0, vo: 0 }));
  let G = {}, phase = RM ? 'circle' : 'scatter', soft = true;
  let dragging = false, px = 0, f0 = 0, moved = false, pid = null, lastX = 0, lastT = 0, vel = 0;
  let m = RM ? 1 : 0, mv = 0, auto = RM ? 1 : 0, f = base + (L - 1) / 2, fv = 0, fT = f, par = 0, parT = 0, live = false, running = false, last = 0;
  const R1 = (() => { let s = 7; return () => (s = (s * 16807) % 2147483647) / 2147483647; })();
  const scatter = S.map(() => ({ x: (R1() - .5) * 1.4, y: (R1() - .5) * 1.2, r: (R1() - .5) * 180 }));

  function layout() {
    const W = stage.clientWidth, mob = W < 700, cw = mob ? 112 : 168, ch = Math.round(cw * 4 / 3), H = mob ? 490 : 650;
    // the ring holds still (sticky, centred) for a short stretch of scrolling while it opens into the arch
    const D = RM ? 0 : Math.round(clamp(innerHeight * .42, 220, 380)), top = Math.max(8, Math.round((innerHeight - H) / 2));
    stage.style.height = H + 'px'; stage.style.top = top + 'px'; track.style.height = H + D + 'px'; stage.style.setProperty('--cw', cw + 'px'); stage.style.setProperty('--ch', ch + 'px');
    const apexY = (mob ? 92 : 112) + ch / 2;
    G = { D, top, W, H, mob, cw, ch, cs: mob ? .43 : .45, cR: mob ? Math.min(W * .38, 150) : 240, cY: H / 2,
      R: mob ? Math.max(W * 1.5, 560) : Math.max(W * .95, 1150), apexY, headArc: mob ? 18 : 26, headH: head.offsetHeight };
    G.step = cw * 1.14 / G.R;
    G.capY = apexY + ch / 2 + (mob ? 44 : 80);
    $('#moCap').style.top = G.capY + 'px';
    $('#moHint').textContent = (mob ? 'Swipe' : 'Drag') + ' or use the arrows. Tap a photograph to see it larger.';
    wake();
  }
  const lerp = (a, b, t) => a + (b - a) * t;
  function target(i) {
    const { cs, cw, cY, cR, R, step, apexY, W, H } = G;
    if (phase === 'scatter') return { x: scatter[i].x * W, y: cY + scatter[i].y * H, r: scatter[i].r, s: cs * .6, o: 0 };
    if (phase === 'line') return { x: (i - (N - 1) / 2) * (cw * cs + (G.mob ? 8 : 12)), y: cY, r: 0, s: cs, o: 1 };
    const a = i / N * Math.PI * 2 - Math.PI / 2;
    const c = { x: Math.cos(a) * cR, y: cY + Math.sin(a) * cR, r: a * 180 / Math.PI + 90 };
    const t = -Math.PI / 2 + (i - f) * step;
    const k = { x: Math.cos(t) * R + par, y: apexY + R + Math.sin(t) * R, r: t * 180 / Math.PI + 90 };
    // shortest way round, so cards on the left of the ring don't spin a full turn
    let dr = k.r - c.r; dr -= 360 * Math.round(dr / 360);
    return { x: lerp(c.x, k.x, m), y: lerp(c.y, k.y, m), r: c.r + dr * m, s: lerp(cs, 1, m), o: 1 };
  }
  // a gentle, slightly overdamped spring (the same feel as the reference: stiffness 40, damping 15)
  const spring = (st, key, to, k, c, dt) => { const v = 'v' + key; st[v] += ((to - st[key]) * k - st[v] * c) * dt; st[key] += st[v] * dt; return Math.abs(to - st[key]) + Math.abs(st[v]); };
  function tick() {
    const now = performance.now(), dt = Math.min((now - last) / 1000, 1 / 30); last = now;
    // scroll: once the whole ring is in view, scrolling on opens it into the arch
    if (phase === 'circle' && !RM) {
      const p = clamp((G.top - track.getBoundingClientRect().top) / G.D);
      const mT = Math.max(p, auto);
      mv += ((mT - m) * 40 - mv * 15) * dt; m += mv * dt;
      if (m > .9 && !stage.classList.contains('is-arc')) stage.classList.add('is-arc');
      if (m < .8 && stage.classList.contains('is-arc')) stage.classList.remove('is-arc');
    }
    if (RM) f = fT;
    else if (!dragging) { fv += ((fT - f) * 90 - fv * 19) * dt; f += fv * dt; }
    par += (parT * m - par) * Math.min(1, dt * 4);
    const k = soft ? 40 : 170, c = soft ? 15 : 26;
    let moving = Math.abs(mv) + Math.abs(fv) + Math.abs(fT - f) * 4;
    head.style.transform = `translate3d(0,${f2(lerp(G.cY - G.headH / 2, G.headArc, clamp(m)))}px,0)`;
    sub.style.opacity = f2(clamp(1 - m * 2.2));
    S.forEach((st, i) => {
      const t = target(i);
      if (RM) Object.assign(st, t);
      else moving += spring(st, 'x', t.x, k, c, dt) + spring(st, 'y', t.y, k, c, dt) + spring(st, 'r', t.r, k, c, dt) * .02 + spring(st, 's', t.s, k, c, dt) * 50 + spring(st, 'o', t.o, k, c, dt) * 50;
      cards[i].style.transform = `translate3d(${f2(st.x)}px,${f2(st.y)}px,0) rotate(${f2(st.r)}deg) scale(${+st.s.toFixed(3)})`;
      cards[i].style.opacity = f2(clamp(st.o));
    });
    caption();
    if (RM || (!dragging && moving < .05 && !live)) stop();
  }
  function wake() { if (running) return; running = true; last = performance.now(); gsap.ticker.add(tick); }
  function stop() { running = false; gsap.ticker.remove(tick); }
  let shown = -1;
  function caption() {
    const i = clamp(Math.round(f), 0, N - 1); if (i === shown) return; shown = i;
    nameEl.textContent = M[mi(i)].title;
    prev.disabled = fT <= 0; next.disabled = fT >= N - 1;
  }
  const go = i => { fT = clamp(Math.round(i), 0, N - 1); prev.disabled = fT <= 0; next.disabled = fT >= N - 1; wake(); };
  prev.addEventListener('click', () => go(fT - 1));
  next.addEventListener('click', () => go(fT + 1));

  // play the opening once the section is on screen
  let started = false;
  function start() {
    if (started) return; started = true; live = true; wake();
    if (RM) { phase = 'circle'; stage.classList.add('is-ring', 'is-arc'); tick(); live = false; return; }
    setTimeout(() => { phase = 'line'; wake(); }, 120);
    setTimeout(() => { phase = 'circle'; stage.classList.add('is-ring'); wake(); }, 1500);
    setTimeout(() => { soft = false; }, 2700);
    setTimeout(() => { auto = 1; wake(); setTimeout(() => live = false, 2500); }, 4300);
  }
  new IntersectionObserver(([e]) => { if (e.isIntersecting && !html.classList.contains('is-locked')) start(); }, { threshold: .3 }).observe(stage);
  addEventListener('scroll', () => { if (started && phase === 'circle' && m < .999) wake(); }, { passive: true });
  addEventListener('resize', layout);
  layout();
  // until it opens, park the cards out of sight
  S.forEach((st, i) => Object.assign(st, target(i))); tick();

  // drag or swipe along the arch; vertical swipes still scroll the page
  stage.addEventListener('pointerdown', e => {
    if (m < .9 || e.button > 0 || e.target.closest('.mo__cap')) return;
    pid = e.pointerId; px = lastX = e.clientX; lastT = performance.now(); f0 = f; moved = false; vel = 0;
  });
  stage.addEventListener('pointermove', e => {
    if (e.pointerId !== pid) return;
    const dx = e.clientX - px;
    if (!moved && Math.abs(dx) > 8) { moved = true; dragging = true; fv = 0; stage.classList.add('is-drag'); try { stage.setPointerCapture(pid); } catch (_) {} wake(); }
    if (!dragging) return;
    const per = G.step * G.R, now = performance.now();
    vel = (e.clientX - lastX) / Math.max(1, now - lastT); lastX = e.clientX; lastT = now;
    let nf = f0 - dx / per;
    if (nf < 0) nf = nf / 3; if (nf > N - 1) nf = N - 1 + (nf - N + 1) / 3; // a soft edge at either end
    f = fT = nf;
  });
  const end = e => {
    if (e.pointerId !== pid) return; pid = null;
    if (dragging) { dragging = false; stage.classList.remove('is-drag'); go(f - vel * 110 / (G.step * G.R)); }
  };
  stage.addEventListener('pointerup', end); stage.addEventListener('pointercancel', end);
  // a tap opens the photograph (a drag doesn't)
  wrap.addEventListener('click', e => {
    const b = e.target.closest('.mc'); if (!b) return;
    if (moved) { moved = false; return; }
    const i = +b.dataset.i; if (m > .9) go(i);
    Lightbox.open(mi(i));
  });
  // sideways trackpad swipes move along the arch too
  let wt; stage.addEventListener('wheel', e => {
    if (m < .9 || Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
    e.preventDefault(); fT = f = clamp(f + e.deltaX / (G.step * G.R), 0, N - 1); fv = 0; wake();
    clearTimeout(wt); wt = setTimeout(() => go(f), 140);
  }, { passive: false });
  // keyboard: Tab reaches each photograph, arrows step along
  wrap.addEventListener('focusin', e => { const b = e.target.closest('.mc'); if (b && m > .9) go(+b.dataset.i); });
  stage.addEventListener('keydown', e => {
    if (m < .9 || (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight')) return;
    e.preventDefault(); go(fT + (e.key === 'ArrowRight' ? 1 : -1));
    if (document.activeElement && document.activeElement.classList.contains('mc')) { const c = cards[fT]; if (c.tabIndex === 0) c.focus({ preventScroll: true }); }
  });
  // a little parallax with the mouse
  stage.addEventListener('mousemove', e => { if (G.mob) return; const r = stage.getBoundingClientRect(); parT = ((e.clientX - r.left) / r.width * 2 - 1) * 36; wake(); });
  stage.addEventListener('mouseleave', () => { parT = 0; wake(); });
})();

/* ═════════ KINDLY REPLY ═════════ */
(() => {
  const sec = $('#rsvp'), card = $('#rsvp .card'), form = $('#rform'), name = $('#rname'), note = $('#rnote'), err = $('#rerr'), out = $('#gcount'), guests = $('#guests'), diyas = $('#rdone .diyas');
  let n = 1;
  $$('.step button').forEach(b => b.addEventListener('click', () => { n = clamp(n + +b.dataset.step, 1, 15); out.textContent = n; }));
  $$('input[name="att"]').forEach(r => r.addEventListener('change', () => {
    guests.classList.toggle('off', form.att.value === 'no');
    if (r.checked && r.value === 'yes') { const b = r.closest('label').getBoundingClientRect(); FX.dust(b.left + b.width / 2, b.top + b.height / 2, 26, 1.1); }
  }));
  const flip = on => {
    const swap = () => { sec.classList.toggle('done', on); };
    if (RM) { swap(); return; }
    gsap.to(card, { rotateY: 90, transformPerspective: 1800, duration: .4, ease: 'power2.in', onComplete: () => {
      swap();
      gsap.fromTo(card, { rotateY: -90 }, { rotateY: 0, duration: .7, ease: 'power3.out', clearProps: 'transform', onComplete: () => { if (on) { const r = diyas.getBoundingClientRect(); FX.embers(r.left + r.width / 2, r.top + r.height * .2, 30, 2.2); } } });
    } });
  };
  form.addEventListener('submit', e => {
    e.preventDefault();
    const who = name.value.trim();
    if (!who) { err.textContent = 'Please write your name so the family knows who is replying.'; name.focus(); return; }
    err.textContent = '';
    const yes = form.att.value === 'yes';
    const msg = [`Namaskar! RSVP for Asish & Ipsita's engagement (Sunday, 6 December 2026, ${CONFIG.venue.name}, Bhubaneswar).`, '', `Name: ${who}`,
      yes ? 'Attending: Yes, joyfully' : 'Attending: Sorry, cannot come (sending blessings)', yes ? `Guests (including me): ${n}` : '', note.value.trim() ? `Note: ${note.value.trim()}` : ''].filter((l, i) => l || i === 1).join('\n');
    const url = (CONFIG.rsvpWhatsApp ? `https://wa.me/${String(CONFIG.rsvpWhatsApp).replace(/\D/g, '')}` : 'https://wa.me/') + '?text=' + encodeURIComponent(msg);
    $('#waAgain').href = url;
    window.open(url, '_blank', 'noopener');
    const b = $('#sendBtn').getBoundingClientRect();
    FX.burst(b.left + b.width / 2, b.top + b.height / 2, 46, .8);
    setTimeout(() => flip(true), RM ? 0 : 500);
  });
  $('#editRsvp').addEventListener('click', () => { flip(false); setTimeout(() => name.focus({ preventScroll: true }), RM ? 0 : 1200); });
})();
})();
