/* =====================================================================
   AKT · Esquemas dinámicos de setup (SVG)
   Cada función devuelve un string SVG a partir de los valores de la sesión.
   Colores: usa las variables de la app (fondo oscuro, acento naranja).
   ===================================================================== */
(function (global) {
  const C = { bg: '#1a1c20', line: '#4a4f58', metal: '#3a3e46', metal2: '#5a5f69', fg: '#f2f2f2', fg2: '#a9aeb8', acc: '#f26a1b', blue: '#4fc3f7', ok: '#3ccf6e', tooth: '#e8dfd0' };
  const esc = s => String(s ?? '').replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
  const fmt = (n, d = 1) => (n == null || isNaN(n)) ? '—' : Number(n).toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: d });
  const svgOpen = (w, h, title) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="100%" font-family="system-ui,Segoe UI,Roboto,sans-serif" role="img" aria-label="${esc(title)}">
    <defs><marker id="akt-arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="${C.acc}"/></marker>
    <marker id="akt-arrb" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="${C.blue}"/></marker></defs>
    <rect width="${w}" height="${h}" rx="12" fill="${C.bg}"/>
    <text x="${w / 2}" y="30" fill="${C.fg}" font-size="18" font-weight="700" text-anchor="middle">${esc(title)}</text>`;
  const T = (x, y, s, o = {}) => `<text x="${x}" y="${y}" fill="${o.fill || C.fg2}" font-size="${o.size || 12}" ${o.bold ? 'font-weight="700"' : ''} text-anchor="${o.anchor || 'middle'}" ${o.rot ? `transform="rotate(${o.rot} ${x} ${y})"` : ''}>${esc(s)}</text>`;

  /* ---------- 1. SOPORTE CASTER (KF) · caster en puntos, camber en grados ---------- */
  function soporteCaster({ caster = 0, camber = 0 } = {}) {
    const W = 900, H = 540;
    const cas = Math.max(-5, Math.min(5, Math.round(caster || 0)));
    const cam = Number(camber || 0);
    const cx = 250, cy = 275, R = 150;
    const pt = 6;                                         // px por punto de caster (ranura)
    const swx = 78, swy = 100;                             // semiancho / semialto de la corredera
    const rx = 92, ry = 136;                              // semiancho / semialto del rebaje ranurado
    const slY = cy + cas * pt;                            // caster + → corredera hacia ATRÁS (abajo en el dibujo)
    const slX = cx + Math.max(-4, Math.min(4, cam)) * 3;  // camber − → corredera hacia el chasis (izquierda)
    let s = svgOpen(W, H, 'Soporte caster (KF) · vista desde arriba');
    s += `<defs>
      <radialGradient id="akt-disc" cx="40%" cy="30%" r="80%"><stop offset="0" stop-color="#4a4d53"/><stop offset="1" stop-color="#232528"/></radialGradient>
      <linearGradient id="akt-block" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5d6168"/><stop offset="1" stop-color="#33363b"/></linearGradient>
      <linearGradient id="akt-alu" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e3e6ea"/><stop offset=".55" stop-color="#b4b9c0"/><stop offset="1" stop-color="#8a9098"/></linearGradient>
      <radialGradient id="akt-nut" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="#f2f4f6"/><stop offset="1" stop-color="#a3a9b1"/></radialGradient>
      <radialGradient id="akt-pin" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="#3b3e43"/><stop offset="1" stop-color="#0c0d0f"/></radialGradient>
      <linearGradient id="akt-grub" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4a4a4a"/><stop offset=".5" stop-color="#121212"/><stop offset="1" stop-color="#2e2e2e"/></linearGradient>
      <clipPath id="akt-clipdisc"><circle cx="${cx}" cy="${cy}" r="${R - 14}"/></clipPath>
    </defs>`;
    // sentido de marcha y orientación
    s += `<line x1="${cx}" y1="94" x2="${cx}" y2="62" stroke="${C.fg2}" stroke-width="2" marker-end="url(#akt-arr)"/>` + T(cx, 56, 'delante del kart');
    s += T(60, 112, 'chasis', { anchor: 'start' }) + T(440, 112, 'fuera', { anchor: 'end' });
    // disco: canto, aro exterior y fondo
    s += `<circle cx="${cx}" cy="${cy + 6}" r="${R}" fill="#121315"/>`;
    s += `<circle cx="${cx}" cy="${cy}" r="${R}" fill="url(#akt-disc)" stroke="#5b5f66" stroke-width="2"/>`;
    s += `<circle cx="${cx}" cy="${cy}" r="${R - 14}" fill="#1b1d20" stroke="#0f1012" stroke-width="2"/>`;
    // rebaje rectangular ranurado (ranuras horizontales)
    let gro = '';
    for (let y = cy - ry; y <= cy + ry; y += pt) gro += `<line x1="${cx - rx}" y1="${y}" x2="${cx + rx}" y2="${y}" stroke="${(Math.round((y - cy) / pt) % 2) ? '#2b2e33' : '#4c5057'}" stroke-width="2.2"/>`;
    s += `<g clip-path="url(#akt-clipdisc)"><rect x="${cx - rx}" y="${cy - ry}" width="${2 * rx}" height="${2 * ry}" fill="#202226"/>${gro}</g>`;
    // bloques laterales en media luna (alojan los prisioneros)
    [-1, 1].forEach(d => {
      const xin = cx + d * (rx + 4), yy = 80;
      const xo = cx + d * Math.sqrt((R - 14) ** 2 - yy ** 2);
      s += `<path d="M${xin},${cy - yy} L${xo},${cy - yy} A${R - 14},${R - 14} 0 0 ${d > 0 ? 1 : 0} ${xo},${cy + yy} L${xin},${cy + yy} Z" fill="url(#akt-block)" stroke="#8a8f97" stroke-width="2.5"/>`;
      s += `<path d="M${xin + d * 3},${cy - yy + 4} L${xin + d * 3},${cy + yy - 4}" stroke="#0e0f11" stroke-width="3"/>`;
    });
    // escalas en el borde interior de los bloques (0 al centro, + hacia atrás)
    let sc = '';
    for (let k = -5; k <= 5; k++) {
      const y = cy + k * pt, big = k % 5 === 0;
      [-1, 1].forEach(d => {
        const x = cx + d * (rx + 6);
        sc += `<line x1="${x}" y1="${y}" x2="${x + d * (big ? 12 : 6)}" y2="${y}" stroke="${k === 0 ? C.acc : '#d9dce1'}" stroke-width="${big ? 2 : 1}"/>`;
        if (big && k !== 0) sc += T(x + d * 21, y + 4, (k > 0 ? '+' : '−') + Math.abs(k), { size: 10, fill: '#d9dce1' });
      });
    }
    s += sc;
    // tornillos allen arriba y abajo, en el aro
    [[cx, cy - R + 18], [cx, cy + R - 18]].forEach(([x, y]) => {
      s += `<circle cx="${x}" cy="${y}" r="20" fill="#16171a" stroke="#4d5157" stroke-width="2"/><circle cx="${x}" cy="${y}" r="14" fill="url(#akt-pin)"/>`;
      s += `<polygon points="${[0, 60, 120, 180, 240, 300].map(a => `${x + 6 * Math.cos(a * Math.PI / 180)},${y + 6 * Math.sin(a * Math.PI / 180)}`).join(' ')}" fill="#050506"/>`;
    });
    // prisioneros laterales con punta (camber): asoman por fuera y empujan la corredera
    [-1, 1].forEach(d => {
      const xo = cx + d * (R + 16), xb = cx + d * (R - 8), xt = slX + d * (swx + 2);
      s += `<rect x="${Math.min(xo, xb)}" y="${cy - 10}" width="${Math.abs(xo - xb)}" height="20" rx="3" fill="url(#akt-grub)" stroke="${C.blue}" stroke-width="2"/>`;
      const x1 = cx + d * (rx + 2), xr = xt + d * 12;
      if (d * (x1 - xr) > 0) {
        s += `<rect x="${Math.min(x1, xr)}" y="${cy - 8}" width="${Math.abs(x1 - xr)}" height="16" fill="url(#akt-grub)"/>`;
        let th = ''; for (let x = Math.min(x1, xr) + 2; x < Math.max(x1, xr); x += 4) th += `<line x1="${x}" y1="${cy - 8}" x2="${x + 2}" y2="${cy + 8}" stroke="#555" stroke-width="1"/>`;
        s += th;
      }
      s += `<polygon points="${xr},${cy - 8} ${xt},${cy} ${xr},${cy + 8}" fill="#8a8f96"/>`;
    });
    // corredera de aluminio con esquinas achaflanadas
    const ch = 14, X0 = slX - swx, X1 = slX + swx, Y0 = slY - swy, Y1 = slY + swy;
    const plate = `M${X0 + ch},${Y0} H${X1 - ch} L${X1},${Y0 + ch} V${Y1 - ch} L${X1 - ch},${Y1} H${X0 + ch} L${X0},${Y1 - ch} V${Y0 + ch} Z`;
    s += `<path d="${plate}" fill="#0d0e10" opacity=".6" transform="translate(4 6)"/>`;
    s += `<path d="${plate}" fill="url(#akt-alu)" stroke="#eef0f3" stroke-width="2"/>`;
    let br = ''; for (let y = Y0 + 6; y < Y1 - 4; y += 7) br += `<line x1="${X0 + 8}" y1="${y}" x2="${X1 - 8}" y2="${y}" stroke="#ffffff" stroke-width=".6" opacity=".25"/>`;
    s += br;
    // arandela, tuerca hexagonal, casquillo y cabeza del pivote
    const hex = (r, rot = 30) => [0, 60, 120, 180, 240, 300].map(a => `${slX + r * Math.cos((a + rot) * Math.PI / 180)},${slY + r * Math.sin((a + rot) * Math.PI / 180)}`).join(' ');
    s += `<circle cx="${slX}" cy="${slY}" r="56" fill="url(#akt-nut)" stroke="#d7dbe0" stroke-width="2"/>`;
    s += `<polygon points="${hex(48)}" fill="url(#akt-nut)" stroke="#7d838b" stroke-width="2"/>`;
    s += `<circle cx="${slX}" cy="${slY}" r="34" fill="#c9cdd3" stroke="#8b9199" stroke-width="2"/>`;
    s += `<circle cx="${slX}" cy="${slY}" r="24" fill="url(#akt-pin)"/><circle cx="${slX}" cy="${slY}" r="13" fill="#1b1d20" stroke="#3c4046" stroke-width="2"/>`;
    // lectura de la corredera contra la escala
    s += `<line x1="${X0}" y1="${slY}" x2="${cx - rx - 6}" y2="${slY}" stroke="${C.acc}" stroke-width="2.5"/><line x1="${X1}" y1="${slY}" x2="${cx + rx + 6}" y2="${slY}" stroke="${C.acc}" stroke-width="2.5"/>`;
    // flechas explicativas
    s += `<line x1="452" y1="${cy - 80}" x2="452" y2="${cy + 80}" stroke="${C.acc}" stroke-width="3" marker-start="url(#akt-arr)" marker-end="url(#akt-arr)"/>` + T(474, cy, 'CASTER · la corredera salta de ranura', { fill: C.acc, bold: true, rot: 90, size: 11 });
    s += `<line x1="${cx - 55}" y1="460" x2="${cx + 55}" y2="460" stroke="${C.blue}" stroke-width="3" marker-start="url(#akt-arrb)" marker-end="url(#akt-arrb)"/>` + T(cx, 484, 'CAMBER · los prisioneros empujan la corredera', { fill: C.blue, bold: true, size: 12 });
    // panel derecho
    s += `<rect x="490" y="105" width="380" height="340" rx="12" fill="#222529" stroke="${C.line}"/>`;
    s += T(680, 138, 'Valores de la sesión', { fill: C.fg, size: 15, bold: true });
    s += T(515, 180, 'Caster', { anchor: 'start', size: 14 }) + T(845, 180, `${cas > 0 ? '+' : ''}${cas} ${Math.abs(cas) === 1 ? 'punto' : 'puntos'}`, { anchor: 'end', size: 20, fill: C.acc, bold: true });
    s += T(515, 214, 'Camber (Sniper)', { anchor: 'start', size: 14 }) + T(845, 214, `${cam > 0 ? '+' : ''}${fmt(cam, 1)} mm`, { anchor: 'end', size: 20, fill: C.blue, bold: true });
    // vista lateral (caster): rueda delantera de lado, referencia vertical y eje de dirección
    const ang = Math.max(-15, Math.min(15, cas * 1.5));       // exagerado para que se vea
    const wx = 590, wy = 356, wr = 54, gy = wy + wr;
    s += T(590, 252, 'CASTER · vista lateral', { size: 12, fill: C.acc, bold: true });
    s += `<line x1="542" y1="292" x2="508" y2="292" stroke="${C.fg2}" stroke-width="2" marker-end="url(#akt-arr)"/>` + T(525, 283, 'delante', { size: 10 });
    s += `<line x1="505" y1="${gy}" x2="675" y2="${gy}" stroke="${C.fg2}" stroke-width="2"/>`;
    s += `<circle cx="${wx}" cy="${wy}" r="${wr}" fill="#16181b" stroke="#5c6168" stroke-width="10"/><circle cx="${wx}" cy="${wy}" r="${wr - 18}" fill="#2b2e33" stroke="#9aa0ab" stroke-width="3"/><circle cx="${wx}" cy="${wy}" r="6" fill="#9aa0ab"/>`;
    s += `<line x1="${wx}" y1="${wy - 95}" x2="${wx}" y2="${gy + 2}" stroke="#e5484d" stroke-width="2" stroke-dasharray="6 5"/>`;
    s += `<g transform="rotate(${ang} ${wx} ${wy})"><line x1="${wx}" y1="${wy - 92}" x2="${wx}" y2="${wy + 40}" stroke="${C.acc}" stroke-width="5" stroke-linecap="round"/>
      <rect x="${wx - 13}" y="${wy - 96}" width="26" height="10" rx="3" fill="${C.metal}" stroke="${C.fg2}"/><rect x="${wx - 13}" y="${wy - 22}" width="26" height="10" rx="3" fill="${C.metal}" stroke="${C.fg2}"/></g>`;
    s += T(590, 432, cas > 0 ? 'positivo: eje inclinado hacia atrás' : cas < 0 ? 'negativo: eje inclinado hacia delante' : 'neutro: eje vertical', { size: 11 });
    // vista frontal (camber): las dos ruedas delanteras de frente
    const ca = Math.max(-12, Math.min(12, cam * 3));          // grados visuales; negativo = cerradas arriba
    const lx = 722, rwx = 838, wyc = 352, ww = 26, wh = 104;
    s += T(780, 252, 'CAMBER · vista frontal', { size: 12, fill: C.blue, bold: true });
    s += `<line x1="695" y1="${wyc + wh / 2 + 2}" x2="865" y2="${wyc + wh / 2 + 2}" stroke="${C.fg2}" stroke-width="2"/>`;
    s += `<rect x="${lx + 14}" y="${wyc - 6}" width="${rwx - lx - 28}" height="12" rx="4" fill="${C.metal}" stroke="${C.fg2}"/>`;
    [[lx, -ca], [rwx, ca]].forEach(([x, r]) => {
      s += `<line x1="${x}" y1="${wyc - wh / 2 - 18}" x2="${x}" y2="${wyc + wh / 2 + 2}" stroke="#e5484d" stroke-width="2" stroke-dasharray="6 5"/>`;
      s += `<g transform="rotate(${r} ${x} ${wyc + wh / 2})"><rect x="${x - ww / 2}" y="${wyc - wh / 2}" width="${ww}" height="${wh}" rx="7" fill="#16181b" stroke="#5c6168" stroke-width="4"/>
        <line x1="${x}" y1="${wyc - wh / 2 - 14}" x2="${x}" y2="${wyc + wh / 2}" stroke="${C.blue}" stroke-width="3"/></g>`;
    });
    s += T(780, 432, cam < 0 ? 'negativo: ruedas cerradas arriba' : cam > 0 ? 'positivo: ruedas abiertas arriba' : 'neutro: ruedas verticales', { size: 11 });
    s += T(W / 2, 522, 'CRG: más caster con pista fría, gomas duras o subviraje · menos si sobra agarre o la dirección pesa · camber −2 mm por lado en seco, 0 en mojado (Sniper)', { size: 11 });
    return s + '</svg>';
  }

  /* ---------- 2. ALTURA DELANTERA · arandelas arriba/abajo (curvada=1, cónica=0,5) ---------- */
  function alturaDelantera({ arriba = 2, abajo = 2 } = {}) {
    const W = 900, H = 480;
    const up = Math.max(0, Number(arriba || 0)), dn = Math.max(0, Number(abajo || 0));
    let s = svgOpen(W, H, 'Altura delantera · arandelas del pivote');
    s += `<defs>
      <linearGradient id="akt-c" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#55595f"/><stop offset="1" stop-color="#2a2c30"/></linearGradient>
      <linearGradient id="akt-chrome" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#6f757d"/><stop offset=".35" stop-color="#eef1f4"/><stop offset=".6" stop-color="#9aa1a9"/><stop offset="1" stop-color="#4c5157"/></linearGradient>
      <linearGradient id="akt-chromeH" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6f757d"/><stop offset=".35" stop-color="#eef1f4"/><stop offset=".65" stop-color="#9aa1a9"/><stop offset="1" stop-color="#4c5157"/></linearGradient>
      <linearGradient id="akt-wash" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#6d737b"/><stop offset=".4" stop-color="#d9dde2"/><stop offset="1" stop-color="#5d6269"/></linearGradient>
      <linearGradient id="akt-washB" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#3f6e86"/><stop offset=".4" stop-color="#9fd0e6"/><stop offset="1" stop-color="#355e73"/></linearGradient>
    </defs>`;
    // ----- mangueta montada en la C (vista de frente, rueda a la izquierda) -----
    const kx = 300, yTop = 150, yBot = 390;            // pivote; cara inferior del brazo sup. y superior del brazo inf.
    const U = 20, Hh = 10;                             // altura de arandela de 1 y de 0,5
    // tubo del chasis y C soldada
    s += `<path d="M430,300 L478,350" stroke="#25272b" stroke-width="44" stroke-linecap="round"/><path d="M430,300 L478,350" stroke="#3a3d42" stroke-width="34" stroke-linecap="round"/>`;
    s += `<path d="M205,${yTop - 22} H420 Q440,${yTop - 22} 440,${yTop - 2} V${yBot + 2} Q440,${yBot + 22} 420,${yBot + 22} H205 V${yBot} H412 V${yTop} H205 Z" fill="url(#akt-c)" stroke="#7d828a" stroke-width="2"/>`;
    s += T(426, yBot + 46, 'C del chasis', { size: 11 });
    // soporte caster sobre el brazo superior y cabeza del pivote
    s += `<rect x="${kx - 70}" y="${yTop - 34}" width="140" height="12" rx="3" fill="#41454b" stroke="#8a8f97"/>`;
    s += `<rect x="${kx - 30}" y="${yTop - 46}" width="60" height="12" rx="3" fill="url(#akt-chromeH)" stroke="#c9ced5"/>`;
    s += `<rect x="${kx - 16}" y="${yTop - 74}" width="32" height="30" rx="7" fill="#2b2e33" stroke="#7d828a" stroke-width="2"/><rect x="${kx - 12}" y="${yTop - 72}" width="10" height="24" rx="4" fill="#ffffff" opacity=".12"/>`;
    s += T(kx + 84, yTop - 30, 'soporte caster', { anchor: 'start', size: 11 });
    // pivote (visible por fuera)
    s += `<rect x="${kx - 7}" y="${yTop - 22}" width="14" height="${yBot - yTop + 70}" fill="#8b9199"/>`;
    // tuerca inferior y punta del pivote
    s += `<rect x="${kx - 26}" y="${yBot + 22}" width="52" height="10" rx="3" fill="url(#akt-wash)"/>`;
    s += `<polygon points="${kx - 22},${yBot + 32} ${kx + 22},${yBot + 32} ${kx + 26},${yBot + 44} ${kx + 22},${yBot + 56} ${kx - 22},${yBot + 56} ${kx - 26},${yBot + 44}" fill="url(#akt-chrome)" stroke="#5c6168"/>`;
    s += `<rect x="${kx - 7}" y="${yBot + 56}" width="14" height="14" fill="#1b1d20"/>`;
    // apilado de arandelas: curvada (1) = abombada arriba y abajo; cónica (0,5) = plana abajo, cónica arriba
    const curv = (y, flipBlue) => { const x0 = kx - 44, w = 88, h = U - 2;
      return `<path d="M${x0},${y + h / 2} C${x0 + 6},${y} ${x0 + 20},${y} ${kx},${y} S${x0 + w - 6},${y} ${x0 + w},${y + h / 2} C${x0 + w - 6},${y + h} ${x0 + w - 20},${y + h} ${kx},${y + h} S${x0 + 6},${y + h} ${x0},${y + h / 2} Z" fill="url(#${flipBlue ? 'akt-washB' : 'akt-wash'})" stroke="#e7eaee" stroke-width="1.2"/>`; };
    const coni = (y, down) => { const x0 = kx - 40, w = 80, h = Hh - 1;
      return down ? `<path d="M${x0 + 12},${y + h} H${x0 + w - 12} L${x0 + w},${y} H${x0} Z" fill="url(#akt-wash)" stroke="#e7eaee" stroke-width="1"/>`
                  : `<path d="M${x0},${y + h} H${x0 + w} L${x0 + w - 12},${y} H${x0 + 12} Z" fill="url(#akt-wash)" stroke="#e7eaee" stroke-width="1"/>`; };
    const stack = (total, yStart, dir) => {
      let out = '', y = yStart; const n1 = Math.floor(total + 1e-9), half = total - n1 > 0.25;
      const parts = []; for (let i = 0; i < n1; i++) parts.push(U); if (half) parts.push(Hh);
      parts.forEach((h, i) => { const yy = dir > 0 ? y : y - h; out += h === U ? curv(yy, i % 2 === 1) : coni(yy, dir < 0); y += dir * h; });
      return { out, y };
    };
    const A = stack(up, yTop, 1), B = stack(dn, yBot, -1);
    // cuerpo de la mangueta entre los dos apilados + eje de la rueda hacia la izquierda
    const mt = A.y + 1, mb = B.y - 1, mm = (mt + mb) / 2;
    s += `<rect x="40" y="${mm - 16}" width="${kx - 80}" height="32" rx="6" fill="url(#akt-chromeH)" stroke="#c9ced5"/>`;
    s += `<rect x="40" y="${mm - 22}" width="40" height="44" rx="6" fill="#2f6b86" stroke="#5fb3d6" stroke-width="2"/>` + T(60, mm + 40, 'hacia la rueda', { size: 10 });
    s += `<rect x="${kx - 42}" y="${mt}" width="84" height="${Math.max(20, mb - mt)}" rx="10" fill="url(#akt-chrome)" stroke="#d9dde2" stroke-width="1.5"/>`;
    s += `<path d="M${kx - 42},${mm - 18} Q${kx - 60},${mm} ${kx - 42},${mm + 18}" fill="none" stroke="#c9ced5" stroke-width="3"/>`;
    s += T(kx, mm + 4, 'mangueta', { size: 12, fill: '#1b1d20', bold: true });
    s += A.out + B.out;
    // cotas
    s += T(kx - 54, yTop + 6 + (A.y - yTop) / 2, `arriba ${fmt(up)}`, { anchor: 'end', fill: C.acc, size: 15, bold: true });
    s += T(kx - 54, yBot + 6 - (yBot - B.y) / 2, `abajo ${fmt(dn)}`, { anchor: 'end', fill: C.acc, size: 15, bold: true });
    // leyenda
    s += `<path d="M30,76 C34,68 42,68 50,68 S66,68 70,76 C66,84 58,84 50,84 S34,84 30,76 Z" fill="url(#akt-wash)" stroke="#e7eaee"/>` + T(78, 80, '= 1 (curvada arriba y abajo)', { anchor: 'start', size: 11 });
    s += `<path d="M30,100 H70 L62,110 H38 Z" fill="url(#akt-wash)" stroke="#e7eaee"/>` + T(78, 108, '= 0,5 (cónica)', { anchor: 'start', size: 11 });

    // ----- vista lateral del kart (delante a la izquierda), el chasis pivota sobre el eje trasero -----
    const total = up + dn, ratio = total ? dn / total : 0.5;         // más abajo → mangueta sube → chasis baja delante
    const ang = -(ratio - 0.5) * 10;                                    // grados (exagerado para que se vea)
    const px0 = 500, gy = 372, ox = px0 + 12;                          // origen del dibujo del kart
    s += `<rect x="${px0}" y="90" width="370" height="340" rx="12" fill="#222529" stroke="${C.line}"/>`;
    s += T(685, 120, 'Efecto en el chasis · vista lateral', { fill: C.fg, size: 14, bold: true });
    s += T(685, 162, ratio > 0.6 ? 'delantera BAJA' : ratio < 0.4 ? 'delantera ALTA' : 'delantera MEDIA', { fill: C.acc, bold: true, size: 17 });
    s += `<line x1="${ox + 46}" y1="196" x2="${ox + 10}" y2="196" stroke="${C.fg2}" stroke-width="2" marker-end="url(#akt-arr)"/>` + T(ox + 28, 188, 'delante', { size: 10 });
    s += `<line x1="${px0 + 12}" y1="${gy}" x2="${px0 + 358}" y2="${gy}" stroke="${C.fg2}" stroke-width="2"/>`;
    // referencia: chasis horizontal
    s += `<line x1="${px0 + 12}" y1="${gy - 32}" x2="${px0 + 358}" y2="${gy - 32}" stroke="#e5484d" stroke-width="1.5" stroke-dasharray="6 5"/>`;
    // carrocería en coordenadas locales (suelo y=0), gira alrededor del eje trasero
    const fw = [62, -26, 26], rw = [282, -32, 32];
    s += `<g transform="translate(${ox} ${gy})"><g transform="rotate(${ang} ${rw[0]} ${rw[1]})">
      <path d="M262,-30 C270,-58 300,-66 322,-58 L338,-40" fill="none" stroke="#7d828a" stroke-width="6" stroke-linecap="round"/>
      <path d="M300,-24 H346 M332,-24 V-40" stroke="#9aa0ab" stroke-width="5" stroke-linecap="round" fill="none"/>
      <path d="M20,-30 H318" stroke="#6b707a" stroke-width="7" stroke-linecap="round"/>
      <path d="M2,-20 H44" stroke="#9aa0ab" stroke-width="5" stroke-linecap="round"/>
      <path d="M8,-30 C10,-54 36,-70 78,-72 L114,-70 C124,-60 126,-44 120,-32 Z" fill="${C.acc}" stroke="#ffb27a" stroke-width="1.5"/>
      <path d="M84,-72 L104,-90 L116,-88 L112,-70" fill="#d55a14" stroke="#ffb27a" stroke-width="1"/>
      <line x1="116" y1="-52" x2="158" y2="-104" stroke="#9aa0ab" stroke-width="4" stroke-linecap="round"/>
      <ellipse cx="163" cy="-110" rx="6" ry="24" transform="rotate(-35 163 -110)" fill="none" stroke="#d0d4da" stroke-width="5"/>
      <rect x="132" y="-48" width="112" height="18" rx="8" fill="${C.acc}" stroke="#ffb27a" stroke-width="1.5"/>
      <path d="M182,-30 C184,-56 188,-94 204,-118 Q212,-128 226,-126 L232,-120 Q216,-100 214,-70 L216,-44 C218,-36 226,-32 236,-30 Z" fill="#2f6b86" stroke="#5fb3d6" stroke-width="2"/>
      <rect x="238" y="-84" width="46" height="46" rx="7" fill="#4a4f58" stroke="#9aa0ab" stroke-width="2"/>
      <rect x="246" y="-96" width="30" height="14" rx="4" fill="#5c6168" stroke="#9aa0ab" stroke-width="1.5"/>
      <path d="M280,-64 C304,-76 330,-72 344,-54" fill="none" stroke="#b9bec6" stroke-width="8" stroke-linecap="round"/>
    </g>
      <circle cx="${fw[0]}" cy="${fw[1]}" r="${fw[2]}" fill="#141518" stroke="#4d5157" stroke-width="9"/><circle cx="${fw[0]}" cy="${fw[1]}" r="${fw[2] - 14}" fill="#2b2e33" stroke="#b9bec6" stroke-width="2.5"/>
      <circle cx="${rw[0]}" cy="${rw[1]}" r="${rw[2]}" fill="#141518" stroke="#4d5157" stroke-width="11"/><circle cx="${rw[0]}" cy="${rw[1]}" r="${rw[2] - 17}" fill="#2b2e33" stroke="#b9bec6" stroke-width="2.5"/>
    </g>`;
    s += T(685, 414, 'más arandelas abajo = mangueta sube = chasis más bajo delante', { size: 11 });
    s += T(W / 2, 472, 'CRG: delantera baja → más sobreviraje y mordida de entrada · alta → más subviraje · lluvia → lo más alta posible', { size: 11 });
    return s + '</svg>';
  }

  /* ---------- 3. VÍA DELANTERA · espaciadores por rueda (gruesa=1, fina=0,5) ---------- */
  function viaDelantera({ izq = 2, der = 2, mm = null } = {}) {
    const W = 900, H = 400;
    let s = svgOpen(W, H, 'Vía delantera · espaciadores entre mangueta y llanta');
    const side = (cx, val, dir, label) => {
      let out = '';
      // eje de la mangueta (horizontal) saliendo del chasis hacia la rueda
      out += `<rect x="${dir > 0 ? cx : cx - 260}" y="186" width="260" height="28" rx="6" fill="#8c8c8c" stroke="#d0d0d0" stroke-width="2"/>`;
      // espaciadores desde el chasis hacia fuera
      let x = dir > 0 ? cx + 10 : cx - 10; const n1 = Math.floor(val), half = val - n1 > 0.25;
      const parts = []; for (let i = 0; i < n1; i++) parts.push(26); if (half) parts.push(13);
      parts.forEach(w => { const xx = dir > 0 ? x : x - w; out += `<rect x="${xx}" y="166" width="${w - 3}" height="68" rx="4" fill="${w === 26 ? '#8a8f99' : '#c9ced8'}" stroke="#e8ecf2"/>`; x += dir * w; });
      // llanta
      const rx = dir > 0 ? x + 6 : x - 6 - 70;
      out += `<rect x="${rx}" y="120" width="70" height="160" rx="12" fill="#2f6b86" stroke="#5fb3d6" stroke-width="3"/>` + T(rx + 35, 205, 'rueda', { fill: C.fg, size: 12 });
      out += T(rx + 35, 105, `${label}: ${fmt(val)}`, { fill: C.acc, size: 16, bold: true });
      return out;
    };
    // chasis centro
    s += `<rect x="400" y="100" width="100" height="200" rx="10" fill="${C.metal}" stroke="${C.line}" stroke-width="3"/>` + T(450, 205, 'chasis', { size: 12 });
    s += side(400, Number(izq || 0), -1, 'izquierda') + side(500, Number(der || 0), 1, 'derecha');
    s += `<rect x="60" y="320" width="14" height="14" fill="#8a8f99"/>` + T(80, 332, '= 1 (gruesa)', { anchor: 'start', size: 11 }) + `<rect x="150" y="320" width="7" height="14" fill="#c9ced8"/>` + T(163, 332, '= 0,5 (fina)', { anchor: 'start', size: 11 });
    if (mm) s += T(450, 332, `ancho de vía medido: ${fmt(mm, 0)} mm`, { fill: C.fg, size: 13 });
    s += T(W / 2, 380, 'CRG: más ancha → más agarre delantero y entrada más rápida (subviraje: +1 por lado) · más estrecha → menos mordida (sobreviraje: −1 por lado) · lluvia: máxima', { size: 11 });
    return s + '</svg>';
  }

  /* ---------- 4. SOPORTE DEL EJE TRASERO · altura ±5 y batalla ±5 ---------- */
  function soporteEje({ altura = 0, batalla = 0, lado = 'izquierdo' } = {}) {
    const W = 900, H = 480;
    const h = Number(altura || 0), l = Number(batalla || 0);
    let s = svgOpen(W, H, `Soporte del eje trasero (${lado}) · posición de los tornillos`);
    // pletina fija al chasis
    s += `<path d="M150,120 h340 v300 h-340 z" fill="${C.metal}" stroke="${C.line}" stroke-width="3"/>`;
    const cx = 320, cy = 270, step = 42;
    const fx = cx + (l / 5) * step * 1.6, fy = cy - (h / 5) * step;
    // soporte de rodamiento (flange) desplazado según valores, semitransparente
    s += `<g opacity="0.55"><path d="M${fx - 110},${fy + 60} v-70 a110,110 0 0 1 220,0 v70 z" fill="#4a4f58" stroke="#9aa0ab" stroke-width="3"/></g>`;
    s += `<circle cx="${fx}" cy="${fy - 10}" r="48" fill="#1a1c20" stroke="#b9a66b" stroke-width="8"/>` + T(fx, fy - 6, 'eje', { fill: C.fg, size: 12 });
    // rejilla de taladros 3x3 (batalla x altura) en los dos extremos del soporte
    for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++) {
      const x = cx + i * step * 1.6, y = cy + j * step;
      const on = (i === l / 5) && (j === -h / 5);
      [x - 95, x + 95].forEach(xx => { s += `<circle cx="${xx}" cy="${y}" r="${on ? 11 : 8}" fill="${on ? C.acc : '#1a1c20'}" stroke="${on ? '#fff' : '#8a8f99'}" stroke-width="2"/>`; });
    }
    // etiquetas de escala
    s += T(130, cy - step + 4, '+5', { anchor: 'end', size: 12 }) + T(130, cy + 4, '0', { anchor: 'end', size: 12, fill: C.acc, bold: true }) + T(130, cy + step + 4, '−5', { anchor: 'end', size: 12 });
    s += T(cx - step * 1.6, 445, '−5', { size: 12 }) + T(cx, 445, '0', { size: 12, fill: C.acc, bold: true }) + T(cx + step * 1.6, 445, '+5', { size: 12 });
    s += T(80, cy - 70, 'altura', { fill: C.acc, size: 12, bold: true, rot: -90 }) + T(cx, 465, 'batalla (mm) · el soporte gira para avanzar/retrasar el eje', { fill: C.acc, size: 12, bold: true });
    s += `<line x1="200" y1="104" x2="160" y2="104" stroke="${C.fg2}" stroke-width="2" marker-end="url(#akt-arr)"/>` + T(214, 108, 'delante del kart', { anchor: 'start', size: 11 });
    // panel
    s += `<rect x="530" y="90" width="340" height="330" rx="12" fill="#222529" stroke="${C.line}"/>`;
    s += T(700, 122, 'Valores de la sesión', { fill: C.fg, size: 15, bold: true });
    s += T(560, 170, 'Altura trasera', { anchor: 'start', size: 14 }) + T(840, 170, `${h > 0 ? '+' : ''}${fmt(h, 0)} mm`, { anchor: 'end', size: 20, fill: C.acc, bold: true });
    s += T(560, 205, 'Batalla', { anchor: 'start', size: 14 }) + T(840, 205, `${l > 0 ? '+' : ''}${fmt(l, 0)} mm`, { anchor: 'end', size: 20, fill: C.acc, bold: true });
    s += T(700, 260, h > 0 ? 'eje más alto en el chasis = chasis BAJO detrás' : h < 0 ? 'eje más bajo en el chasis = chasis ALTO detrás' : 'posición central', { size: 12, fill: C.fg });
    s += T(700, 340, 'CRG: eje en el agujero más alto = chasis bajo (seco)', { size: 11 }) + T(700, 358, 'bajar un agujero = chasis alto (mojado)', { size: 11 }) + T(700, 382, 'Batalla larga → más agarre en curva rápida', { size: 11 }) + T(700, 400, 'Batalla corta → más ágil en curva lenta y chicanes', { size: 11 });
    return s + '</svg>';
  }

  /* ---------- 5. PLETINA DE DIRECCIÓN · 25 / 31 ---------- */
  function pletinaDireccion({ pos = 31, agujeros = 'Centrales' } = {}) {
    const W = 900, H = 410;
    const p = Number(pos) === 25 ? 25 : 31;
    let s = svgOpen(W, H, 'Pletina de dirección · distancia de las bieletas a la columna');
    // columna
    s += `<rect x="440" y="60" width="20" height="150" rx="4" fill="#8c8c8c" stroke="#d0d0d0" stroke-width="2"/>` + T(450, 52, 'columna de dirección', { size: 11 });
    // pletina
    s += `<rect x="330" y="200" width="240" height="60" rx="10" fill="#4a4f58" stroke="#9aa0ab" stroke-width="3"/>`;
    // dos pares de taladros a distinta distancia del centro
    const d25 = 60, d31 = 100;
    [[d25, 25], [d31, 31]].forEach(([d, v]) => {
      const on = v === p;
      s += `<circle cx="${450 - d}" cy="230" r="9" fill="${on ? C.acc : '#1a1c20'}" stroke="${on ? C.acc : '#777'}" stroke-width="2"/><circle cx="${450 + d}" cy="230" r="9" fill="${on ? C.acc : '#1a1c20'}" stroke="${on ? C.acc : '#777'}" stroke-width="2"/>`;
      s += T(450, v === 25 ? 282 : 300, `${v}`, { size: 14, fill: on ? C.acc : C.fg2, bold: on });
    });
    // bieletas desde los taladros activos
    const d = p === 25 ? d25 : d31;
    s += `<line x1="${450 - d}" y1="230" x2="120" y2="300" stroke="#8c8c8c" stroke-width="8" stroke-linecap="round"/><line x1="${450 + d}" y1="230" x2="780" y2="300" stroke="#8c8c8c" stroke-width="8" stroke-linecap="round"/>`;
    s += T(120, 325, 'bieleta izq.', { size: 11 }) + T(780, 325, 'bieleta der.', { size: 11 });
    // cota
    s += `<line x1="450" y1="180" x2="${450 + d}" y2="180" stroke="${C.acc}" stroke-width="2" marker-end="url(#akt-arr)" marker-start="url(#akt-arr)"/>` + T(450 + d / 2, 172, `${p} mm`, { fill: C.acc, bold: true, size: 13 });
    s += T(W / 2, 350, p === 31 ? '31: dirección más directa y rápida · más reacción por grado de volante · más nerviosa en recta' : '25: dirección más suave y progresiva · más precisa en curva rápida · hay que girar más en horquillas', { size: 12, fill: C.fg });
    s += T(W / 2, 372, `Agujeros: ${agujeros || '—'}${agujeros === 'Inferiores' ? ' · más ángulo de giro (mojado)' : ''}`, { size: 13, fill: C.acc, bold: true });
    s += T(W / 2, 392, 'Girar la pletina 180° cambia a los agujeros inferiores manteniendo la distancia · recomprobar convergencia después', { size: 11 });
    return s + '</svg>';
  }

  /* ---------- 6. CONVERGENCIA · mm por rueda (Sniper), abierto + ---------- */
  function convergencia({ izq = 1, der = 1 } = {}) {
    const W = 900, H = 380;
    const li = Number(izq || 0), ld = Number(der || 0);
    let s = svgOpen(W, H, 'Convergencia (Sniper) · vista desde arriba');
    s += `<line x1="450" y1="90" x2="450" y2="60" stroke="${C.fg2}" stroke-width="2" marker-end="url(#akt-arr)"/>` + T(450, 56, 'delante', { size: 11 });
    s += `<rect x="330" y="150" width="240" height="20" rx="6" fill="${C.metal}" stroke="${C.line}" stroke-width="2"/>`;
    const wheel = (cx, v, dir) => {
      const ang = Math.max(-8, Math.min(8, v * 2)) * dir; // izquierda dir=-1: positivo → giro antihorario → parte delantera hacia fuera
      return `<rect x="${cx - 18}" y="100" width="36" height="120" rx="10" fill="#2f6b86" stroke="#5fb3d6" stroke-width="3" transform="rotate(${ang} ${cx} 160)"/>` +
        `<line x1="${cx}" y1="70" x2="${cx}" y2="250" stroke="${C.line}" stroke-width="2" stroke-dasharray="5 4"/>` +
        `<line x1="${cx}" y1="70" x2="${cx}" y2="250" stroke="${C.acc}" stroke-width="2" transform="rotate(${ang} ${cx} 160)"/>`;
    };
    s += wheel(300, li, -1) + wheel(600, ld, 1);
    s += T(300, 280, `izquierda: ${li > 0 ? '+' : ''}${fmt(li, 1)} mm`, { fill: C.acc, size: 15, bold: true }) + T(600, 280, `derecha: ${ld > 0 ? '+' : ''}${fmt(ld, 1)} mm`, { fill: C.acc, size: 15, bold: true });
    s += T(450, 310, (li + ld) > 0 ? 'ABIERTA (toe-out): las ruedas apuntan hacia fuera por delante' : (li + ld) < 0 ? 'CERRADA (toe-in): normalmente no se usa' : 'NEUTRA', { fill: C.fg, size: 13 });
    s += T(W / 2, 355, 'CRG: seco 1–3 mm abierta por lado · pista rápida cerca de 0 · lluvia 3–6 mm · igual en ambos lados · recomprobar tras tocar caster, camber o altura', { size: 11 });
    return s + '</svg>';
  }


  /* ---------- 7. HOJA DE SETUP · KT2 calcado de la vista superior de CRG ---------- */
  // Coordenadas en "px de foto" (imagen CRG 300x450): eje delantero y=100, trasero y=390 (batalla 1.042 mm = 290 px).
  const KT2_TUBES = [
    'M88,46 L56,98', 'M212,46 L244,98',                                                   // diagonales a las C
    'M88,46 C100,32 112,30 125,30 L175,30 C188,30 200,32 212,46',                          // arco frontal
    'M58,102 L98,120 C108,128 110,140 110,152 L110,192 C110,205 100,214 80,230',           // larguero izq. delantero
    'M242,102 L202,120 C192,128 190,140 190,152 L190,192 C190,205 200,214 220,230',        // larguero der. delantero
    'M74,228 L226,228',                                                                    // travesaño central
    'M80,230 C70,238 68,246 68,258 L68,434',                                               // larguero izq. trasero
    'M220,230 C230,238 232,246 232,258 L232,434',                                          // larguero der. exterior
    'M205,234 L205,402', 'M207,378 L232,378', 'M207,272 L230,272',                         // doble larguero lado motor
    'M60,326 L204,346',                                                                    // travesaño trasero inclinado
    'M72,300 L90,334', 'M72,348 L96,330',                                                  // refuerzos izq.
    'M68,434 L88,430', 'M232,434 L212,430',                                                // remates traseros
    'M138,32 L150,95 L162,32',                                                             // soporte columna
    'M137,172 C131,190 129,206 129,228', 'M163,172 C169,190 171,206 171,228', 'M133,200 C145,194 155,194 167,200', // soporte asiento delantero
    'M84,192 L108,192', 'M192,192 L216,192', 'M52,326 L68,326', 'M232,326 L248,326',      // soportes paragolpes laterales
    'M90,18 L90,44', 'M210,18 L210,44'                                                     // soportes paragolpes delantero
  ];
  function hojaSetup(d = {}) {
    const st = d.setup || {}, tr = d.trans || {}, cb = d.carb || {};
    const W = 830, f = 1.2;                                   // escala foto→dibujo
    const cx = W / 2, yF = 210, yR = yF + 290 * f;
    const H = Math.round(yR + 235);
    const P = (x, y) => [cx + (x - 150) * f, yF + (y - 100) * f];
    const mm = 1042 / 290;                                   // mm por px de foto
    const v = (x, u = '') => (x == null || x === '') ? '—' : `${fmt(x, 2)}${u}`;
    const sg = x => (x == null || x === '') ? '—' : `${x > 0 ? '+' : ''}${fmt(x, 2)}`;
    let s = svgOpen(W, H, `Hoja de setup · ${d.titulo || 'CRG KT2'}`);
    s += T(cx, 52, d.subtitulo || '', { size: 12 });
    s += `<line x1="${cx}" y1="98" x2="${cx}" y2="72" stroke="${C.fg2}" stroke-width="2" marker-end="url(#akt-arr)"/>`;
    const g = `transform="translate(${cx - 150 * f} ${yF - 100 * f}) scale(${f})"`;
    // ruedas con medidas reales: ancho de vía del. 1.210 / tras. 1.395 mm (exterior), gomas ~135 y ~225 mm de ancho, Ø ~280 mm
    const wF = 135 / mm, wR = 225 / mm, dia = 280 / mm;
    const xF = (1210 / 2 - 135 / 2) / mm, xR = (1395 / 2 - 225 / 2) / mm;
    const toe = x => Math.max(-6, Math.min(6, Number(x || 0) * 2));
    const wheel = (x, y, w, h, rot) => `<rect x="${x - w / 2}" y="${y - h / 2}" width="${w}" height="${h}" rx="5" fill="#1f2226" stroke="#5fb3d6" stroke-width="3" vector-effect="non-scaling-stroke" transform="rotate(${rot} ${x} ${y})"/>`;
    s += `<g ${g}>`;
    // eje trasero Ø50 y manguetas
    s += `<line x1="${150 - xR - 10}" y1="390" x2="${150 + xR + 10}" y2="390" stroke="#9a9a9a" stroke-width="8" vector-effect="non-scaling-stroke"/>`;
    s += `<line x1="${150 - xF}" y1="100" x2="56" y2="100" stroke="#9a9a9a" stroke-width="5" vector-effect="non-scaling-stroke"/><line x1="${150 + xF}" y1="100" x2="244" y2="100" stroke="#9a9a9a" stroke-width="5" vector-effect="non-scaling-stroke"/>`;
    // bastidor (tubo Ø30): contorno claro + alma oscura
    KT2_TUBES.forEach(dd => { s += `<path d="${dd}" fill="none" stroke="#6b707a" stroke-width="9" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>`; });
    KT2_TUBES.forEach(dd => { s += `<path d="${dd}" fill="none" stroke="#25282d" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>`; });
    // C de las manguetas y alojamientos del eje
    [[54, 100], [246, 100]].forEach(([x, y]) => { s += `<circle cx="${x}" cy="${y}" r="7" fill="#3a3e46" stroke="${C.acc}" stroke-width="2" vector-effect="non-scaling-stroke"/>`; });
    [[64, 390], [236, 390]].forEach(([x, y]) => { s += `<rect x="${x - 6}" y="${y - 14}" width="12" height="28" rx="5" fill="#3a3e46" stroke="#9aa0ab" stroke-width="2" vector-effect="non-scaling-stroke"/>`; });
    // pletina de dirección, bieletas y columna
    s += `<rect x="141" y="93" width="18" height="8" rx="2" fill="#4a4f58" stroke="${C.acc}" stroke-width="2" vector-effect="non-scaling-stroke"/>`;
    s += `<line x1="143" y1="99" x2="66" y2="112" stroke="#8c8c8c" stroke-width="3" vector-effect="non-scaling-stroke"/><line x1="157" y1="99" x2="234" y2="112" stroke="#8c8c8c" stroke-width="3" vector-effect="non-scaling-stroke"/>`;
    s += `<line x1="150" y1="97" x2="153" y2="190" stroke="#9aa0ab" stroke-width="3" vector-effect="non-scaling-stroke"/>`;
    // asiento (posición CRG: D1 1.265 mm del arco frontal) y motor lado derecho
    s += `<path d="M118,265 q0,-14 32,-15 q32,1 32,15 l-4,62 q-28,10 -56,0 z" fill="#2f6b86" stroke="#5fb3d6" stroke-width="2" opacity=".85" vector-effect="non-scaling-stroke"/>`;
    s += `<rect x="214" y="330" width="34" height="38" rx="5" fill="#4a4f58" stroke="#9aa0ab" stroke-width="2" vector-effect="non-scaling-stroke"/>`;
    // ruedas
    s += wheel(150 - xF, 100, wF, dia, toe(st.convI)) + wheel(150 + xF, 100, wF, dia, -toe(st.convD));
    s += wheel(150 - xR, 390, wR, dia, 0) + wheel(150 + xR, 390, wR, dia, 0);
    s += '</g>';
    s += T(...P(231, 353), 'X30', { size: 10, fill: C.fg });
    // ---- tarjetas de datos ----
    const card = (x, y, w, title, rows) => {
      let o = `<rect x="${x}" y="${y}" width="${w}" height="${30 + rows.length * 20}" rx="10" fill="#222529" stroke="${C.line}"/>`;
      o += T(x + 12, y + 21, title, { anchor: 'start', size: 12, fill: C.acc, bold: true });
      rows.forEach(([lab, val], i) => { o += T(x + 12, y + 44 + i * 20, lab, { anchor: 'start', size: 12 }) + T(x + w - 12, y + 44 + i * 20, val, { anchor: 'end', size: 13, fill: C.fg, bold: true }); });
      return o;
    };
    const cw = 166, xl = 12, xr = W - 12 - cw;
    s += card(xl, yF - 110, cw, 'DEL. IZQUIERDA', [['Espaciadores', v(st.viaDelI)], ['Camber', v(st.camberI, ' mm')], ['Convergencia', v(st.convI, ' mm')], ['Presión fría', v(st.pDI, ' bar')]]);
    s += card(xr, yF - 110, cw, 'DEL. DERECHA', [['Espaciadores', v(st.viaDelD)], ['Camber', v(st.camberD, ' mm')], ['Convergencia', v(st.convD, ' mm')], ['Presión fría', v(st.pDD, ' bar')]]);
    s += card(xl, yF + 50, cw, 'TREN DELANTERO', [['Caster', st.caster == null || st.caster === '' ? '—' : `${sg(st.caster)} pts`], ['Arandelas ↑/↓', `${v(st.altArriba)} / ${v(st.altAbajo)}`], ['Mangueta', st.mangueta || '—'], ['Bujes del.', st.bujesDel || '—'], ['Pletina', st.pletina || '—']]);
    s += card(xr, yF + 50, cw, 'ASIENTO', [['Asiento', st.asiento || '—'], ['D1 / D2', `${st.d1 || '—'} / ${st.d2 || '—'}`], ['Soportes', st.soportes || '—'], ['Lastre', st.lastre || '—'], ['Barra torsión', st.barraDel || '—']]);
    s += card(xl, yR - 115, cw, 'TREN TRASERO', [['Altura', st.altTras == null || st.altTras === '' ? '—' : `${sg(st.altTras)} mm`], ['Batalla', st.batalla == null || st.batalla === '' ? '—' : `${sg(st.batalla)} mm`], ['Eje Ø50', st.eje || '—'], ['Vía trasera', v(st.viaTras, ' mm')], ['Bujes tras.', st.bujes || '—']]);
    s += card(xr, yR - 115, cw, 'TRASERAS', [['Presión TI', v(st.pTI, ' bar')], ['Presión TD', v(st.pTD, ' bar')], ['Caliente obj.', v(st.pCal, ' bar')], ['Llantas', st.llantas || '—']]);
    // ---- panel inferior ----
    const yB = yR + 115, bw = (W - 24 - 24) / 3;
    s += card(12, yB, bw, 'RELACIÓN', [['Piñón / corona', `${tr.pinon || '—'} / ${tr.corona || '—'}`], ['Relación', tr.pinon && tr.corona ? fmt(tr.corona / tr.pinon, 2) : '—'], ['Cadena', tr.cadena || '—']]);
    s += card(12 + bw + 12, yB, bw, 'CARBURACIÓN', [['Aguja alta / baja', `${v(cb.agujaAlta)} / ${v(cb.agujaBaja)}`], ['Muelle', cb.muelle || '—'], ['Pop-off', v(cb.popoff, ' psi')]]);
    s += card(12 + 2 * (bw + 12), yB, bw, 'NEUMÁTICOS', [['Modelo', st.neu || '—'], ['Estado', st.neuEstado || '—'], ['Vueltas', v(st.neuVueltas)]]);
    s += T(cx, H - 12, 'KT2 a escala: batalla 1.042 mm · vía del. 1.210 · vía tras. 1.395 · eje Ø50', { size: 10 });
    return s + '</svg>';
  }

  global.AKT_DRAW = { hojaSetup, soporteCaster, alturaDelantera, viaDelantera, soporteEje, pletinaDireccion, convergencia };
})(window);
