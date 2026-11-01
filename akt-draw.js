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
    const cas = Math.max(-10, Math.min(10, Math.round(caster || 0)));
    const cam = Number(camber || 0);
    const cx = 250, cy = 275, R = 135;
    const dyTooth = 9;                                   // px por diente
    const slY = cy + cas * dyTooth;                       // caster + → corredera hacia ATRÁS (abajo en el dibujo)
    const slX = cx + Math.max(-4, Math.min(4, cam)) * 7; // camber − → corredera hacia el chasis (izquierda)
    let s = svgOpen(W, H, 'Soporte caster (KF) · vista desde arriba');
    s += `<defs>
      <radialGradient id="akt-disc" cx="40%" cy="35%" r="75%"><stop offset="0" stop-color="#7d7466"/><stop offset="1" stop-color="#3f3a33"/></radialGradient>
      <linearGradient id="akt-bolt" x1="0" x2="1"><stop offset="0" stop-color="#d9d9d9"/><stop offset=".5" stop-color="#8a8a8a"/><stop offset="1" stop-color="#4d4d4d"/></linearGradient>
      <linearGradient id="akt-slider" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8f8a7f"/><stop offset="1" stop-color="#5c574e"/></linearGradient>
      <linearGradient id="akt-screw" x1="0" x2="1"><stop offset="0" stop-color="#bfc4cc"/><stop offset="1" stop-color="#5a5f69"/></linearGradient>
    </defs>`;
    // sentido de marcha y orientación
    s += `<line x1="${cx}" y1="92" x2="${cx}" y2="60" stroke="${C.fg2}" stroke-width="2" marker-end="url(#akt-arr)"/>` + T(cx, 54, 'delante del kart');
    s += T(70, 120, 'chasis', { anchor: 'end' }) + T(430, 120, 'fuera', { anchor: 'start' });
    // horquilla (brazo superior) con alojamiento
    s += `<rect x="90" y="105" width="320" height="340" rx="22" fill="${C.metal}" stroke="${C.line}" stroke-width="3"/>`;
    // disco del soporte caster: canto + cara superior con ranuras paralelas (como la pieza KF)
    s += `<circle cx="${cx}" cy="${cy + 6}" r="${R}" fill="#2a2620"/>`;
    s += `<circle cx="${cx}" cy="${cy}" r="${R}" fill="url(#akt-disc)" stroke="#9a8f7e" stroke-width="2"/>`;
    s += `<clipPath id="akt-clipdisc"><circle cx="${cx}" cy="${cy}" r="${R - 4}"/></clipPath>`;
    let grooves = '';
    for (let y = cy - R; y <= cy + R; y += 7) grooves += `<line x1="${cx - R}" y1="${y}" x2="${cx + R}" y2="${y}" stroke="#2f2a24" stroke-width="1.6" opacity=".7"/>`;
    s += `<g clip-path="url(#akt-clipdisc)">${grooves}</g>`;
    // dos tornillos avellanados (fijación del disco), arriba y abajo
    [[cx, cy - R + 22], [cx, cy + R - 22]].forEach(([x, y]) => {
      s += `<circle cx="${x}" cy="${y}" r="12" fill="#1f1c18"/><circle cx="${x}" cy="${y}" r="9" fill="url(#akt-screw)"/><line x1="${x - 5}" y1="${y - 5}" x2="${x + 5}" y2="${y + 5}" stroke="#2a2a2a" stroke-width="2"/><line x1="${x + 5}" y1="${y - 5}" x2="${x - 5}" y2="${y + 5}" stroke="#2a2a2a" stroke-width="2"/>`;
    });
    // ventana hexagonal alargada con dentado en los dos laterales
    const wx = 70, wy = 112;  // semianchos de la ventana
    s += `<path d="M${cx - wx + 18},${cy - wy} h${2 * wx - 36} l18,18 v${2 * wy - 36} l-18,18 h-${2 * wx - 36} l-18,-18 v-${2 * wy - 36} z" fill="#15140f" stroke="#a89c88" stroke-width="2"/>`;
    let teeth = '';
    for (let y = cy - wy + 20; y <= cy + wy - 22; y += 9) {
      teeth += `<path d="M${cx - wx},${y} l9,4.5 l-9,4.5 z" fill="${C.tooth}"/><path d="M${cx + wx},${y} l-9,4.5 l9,4.5 z" fill="${C.tooth}"/>`;
    }
    s += teeth;
    // escala de caster junto a la ventana
    s += T(cx - wx - 14, cy - 90 + 4, '−10', { anchor: 'end', size: 11 }) + T(cx - wx - 14, cy + 4, '0', { anchor: 'end', size: 12, fill: C.acc, bold: true }) + T(cx - wx - 14, cy + 90 + 4, '+10', { anchor: 'end', size: 11 });
    s += `<line x1="${cx - wx}" y1="${cy}" x2="${cx + wx}" y2="${cy}" stroke="${C.acc}" stroke-width="1.5" stroke-dasharray="4 3"/>`;
    // corredera (bloque dentado) con el tornillo del pivote (cabeza allen)
    s += `<rect x="${slX - 46}" y="${slY - 32}" width="92" height="64" rx="5" fill="url(#akt-slider)" stroke="#b5ad9f" stroke-width="2"/>`;
    s += `<rect x="${slX - 46}" y="${slY - 32}" width="92" height="8" fill="#9c958a" opacity=".6"/>`;
    s += `<circle cx="${slX}" cy="${slY}" r="27" fill="#c9c9c9"/><circle cx="${slX}" cy="${slY}" r="24" fill="url(#akt-bolt)"/><circle cx="${slX}" cy="${slY}" r="14" fill="#3a3a3a"/>`;
    s += `<polygon points="${slX},${slY - 9} ${slX + 8},${slY - 4.5} ${slX + 8},${slY + 4.5} ${slX},${slY + 9} ${slX - 8},${slY + 4.5} ${slX - 8},${slY - 4.5}" fill="#111"/>`;
    // tornillos laterales (prisioneros) que empujan la corredera
    [[cx - R - 6, -1], [cx + R + 6, 1]].forEach(([x, d]) => {
      s += `<rect x="${d < 0 ? x - 46 : x}" y="${slY - 10}" width="46" height="20" rx="3" fill="url(#akt-screw)" stroke="${C.blue}" stroke-width="2.5"/>`;
      s += `<line x1="${d < 0 ? x - 36 : x + 10}" y1="${slY - 6}" x2="${d < 0 ? x - 36 : x + 10}" y2="${slY + 6}" stroke="#333" stroke-width="2"/>`;
      s += `<line x1="${d < 0 ? x : x}" y1="${slY}" x2="${d < 0 ? slX - 46 : slX + 46}" y2="${slY}" stroke="${C.blue}" stroke-width="2" stroke-dasharray="4 3"/>`;
    });
    // flechas explicativas
    s += `<line x1="${cx + R + 36}" y1="${cy - 90}" x2="${cx + R + 36}" y2="${cy + 90}" stroke="${C.acc}" stroke-width="3" marker-start="url(#akt-arr)" marker-end="url(#akt-arr)"/>` + T(cx + R + 62, cy, 'CASTER · diente a diente', { fill: C.acc, bold: true, rot: 90 });
    s += `<line x1="${cx - 50}" y1="470" x2="${cx + 50}" y2="470" stroke="${C.blue}" stroke-width="3" marker-start="url(#akt-arrb)" marker-end="url(#akt-arrb)"/>` + T(cx, 492, 'CAMBER · tornillos laterales', { fill: C.blue, bold: true });
    // panel derecho
    s += `<rect x="490" y="105" width="380" height="340" rx="12" fill="#222529" stroke="${C.line}"/>`;
    s += T(680, 138, 'Valores de la sesión', { fill: C.fg, size: 15, bold: true });
    s += T(515, 180, 'Caster', { anchor: 'start', size: 14 }) + T(845, 180, `${cas > 0 ? '+' : ''}${cas} ${Math.abs(cas) === 1 ? 'punto' : 'puntos'}`, { anchor: 'end', size: 20, fill: C.acc, bold: true });
    s += T(515, 214, 'Camber (Sniper)', { anchor: 'start', size: 14 }) + T(845, 214, `${cam > 0 ? '+' : ''}${fmt(cam, 1)} mm`, { anchor: 'end', size: 20, fill: C.blue, bold: true });
    // vista lateral (caster)
    const ang = cas * 1.2;
    s += T(590, 255, 'Vista lateral', { size: 12 });
    s += `<line x1="552" y1="243" x2="520" y2="243" stroke="${C.fg2}" stroke-width="2" marker-end="url(#akt-arr)"/>` + T(536, 236, 'adelante', { size: 9 });
    s += `<rect x="560" y="268" width="60" height="18" rx="5" fill="${C.metal}" stroke="${C.line}"/><rect x="560" y="392" width="60" height="18" rx="5" fill="${C.metal}" stroke="${C.line}"/>`;
    s += `<line x1="590" y1="262" x2="590" y2="416" stroke="${C.line}" stroke-width="3" stroke-dasharray="6 5"/>`;
    s += `<line x1="590" y1="262" x2="590" y2="416" stroke="${C.acc}" stroke-width="5" stroke-linecap="round" transform="rotate(${-ang} 590 339)"/>`;
    s += T(590, 432, cas > 0 ? 'superior hacia atrás = +' : cas < 0 ? 'superior hacia delante = −' : 'neutro', { size: 11 });
    // vista frontal (camber): mangueta + rueda, inclinación según camber
    const camAng = Math.max(-10, Math.min(10, cam * 2.5));
    s += T(770, 255, 'Vista frontal', { size: 12 }) + T(700, 272, 'chasis', { size: 9 }) + T(852, 272, 'fuera', { size: 9 });
    s += `<g transform="rotate(${camAng} 740 410)">
      <line x1="740" y1="270" x2="740" y2="410" stroke="${C.blue}" stroke-width="5" stroke-linecap="round"/>
      <rect x="735" y="330" width="60" height="14" rx="4" fill="#8c8c8c"/>
      <rect x="795" y="282" width="40" height="124" rx="8" fill="#2f6b86" stroke="#5fb3d6" stroke-width="3"/>
    </g>`;
    s += `<line x1="700" y1="412" x2="860" y2="412" stroke="${C.fg2}" stroke-width="2"/>`;
    s += T(770, 432, cam < 0 ? 'negativo: rueda cerrada arriba' : cam > 0 ? 'positivo: rueda abierta arriba' : 'neutro', { size: 11 });
    s += T(W / 2, 522, 'CRG: más caster con pista fría, gomas duras o subviraje · menos si sobra agarre o la dirección pesa · camber −2 mm por lado en seco, 0 en mojado (Sniper)', { size: 11 });
    return s + '</svg>';
  }

  /* ---------- 2. ALTURA DELANTERA · arandelas arriba/abajo (gruesa=1, fina=0,5) ---------- */
  function alturaDelantera({ arriba = 2, abajo = 2 } = {}) {
    const W = 900, H = 470;
    const up = Number(arriba || 0), dn = Number(abajo || 0);
    let s = svgOpen(W, H, 'Altura delantera · arandelas del pivote');
    // horquilla (C) vista de frente, pivote vertical
    s += `<path d="M160,90 h200 v34 h-150 v232 h150 v34 h-200 z" fill="${C.metal}" stroke="${C.line}" stroke-width="3"/>`;
    s += T(165, 84, 'brazo superior (soporte caster)', { size: 11, anchor: 'start' }) + T(165, 406, 'brazo inferior', { size: 11, anchor: 'start' });
    // pivote
    s += `<rect x="252" y="100" width="16" height="280" rx="3" fill="#8c8c8c" stroke="#d0d0d0" stroke-width="2"/>`;
    // apilado de arandelas: arriba desde y=124 hacia abajo; abajo desde y=356 hacia arriba
    const thick = 20, thin = 9, x0 = 206, w = 108;
    // separador de valor 1: curvado arriba y abajo (perfil tipo lente)
    const doble = y => `<path d="M${x0},${y + thick / 2} C${x0 + 14},${y + 2} ${x0 + 30},${y + 1} ${x0 + w / 2},${y + 1} S${x0 + w - 14},${y + 2} ${x0 + w},${y + thick / 2} C${x0 + w - 14},${y + thick - 2} ${x0 + w - 30},${y + thick - 1} ${x0 + w / 2},${y + thick - 1} S${x0 + 14},${y + thick - 2} ${x0},${y + thick / 2} Z" fill="#8a8f99" stroke="#dfe3ea" stroke-width="1.5"/>`;
    // separador de valor 0,5: cónico (curvado solo por arriba, plano por abajo)
    const conica = y => `<path d="M${x0 + 4},${y + thin - 1} C${x0 + 20},${y + thin - 1} ${x0 + 26},${y + 1} ${x0 + 40},${y + 1} H${x0 + w - 40} C${x0 + w - 26},${y + 1} ${x0 + w - 20},${y + thin - 1} ${x0 + w - 4},${y + thin - 1} Z" fill="#c9ced8" stroke="#eef1f5" stroke-width="1"/>`;
    const stack = (total, yStart, dir) => {
      let out = '', y = yStart, rem = total;
      const n1 = Math.floor(rem), half = rem - n1 > 0.25;
      const parts = []; for (let i = 0; i < n1; i++) parts.push(thick); if (half) parts.push(thin);
      parts.forEach(h => { const yy = dir > 0 ? y : y - h; out += h === thick ? doble(yy) : conica(yy); y += dir * h; });
      return { out, y };
    };
    const a = stack(up, 126, 1), b = stack(dn, 354, -1);
    s += a.out + b.out;
    // mangueta entre ambos apilados
    const topY = a.y + 2, botY = b.y - 2;
    s += `<rect x="196" y="${topY}" width="128" height="${Math.max(30, botY - topY)}" rx="10" fill="#2f6b86" stroke="#5fb3d6" stroke-width="3"/>` + T(260, (topY + botY) / 2 + 5, 'mangueta', { fill: C.fg, size: 13, bold: true });
    // etiquetas
    s += T(340, 140, `arriba: ${fmt(up)}`, { anchor: 'start', fill: C.acc, size: 16, bold: true }) + T(340, 340, `abajo: ${fmt(dn)}`, { anchor: 'start', fill: C.acc, size: 16, bold: true });
    s += `<path d="M60,428 C66,420 72,419 80,419 S94,420 100,428 C94,436 88,437 80,437 S66,436 60,428 Z" fill="#8a8f99" stroke="#dfe3ea"/>` + T(108, 432, '= 1 (curvado arriba y abajo)', { anchor: 'start', size: 11 }) + `<path d="M302,434 C308,434 310,428 316,428 H324 C330,428 332,434 338,434 Z" fill="#c9ced8" stroke="#eef1f5"/>` + T(346, 435, '= 0,5 (cónico)', { anchor: 'start', size: 11 });
    // panel efecto: silueta lateral de kart, chasis inclinado según el reparto de arandelas
    const total = up + dn, ratio = total ? dn / total : 0.5; // más abajo → mangueta sube → chasis baja delante
    s += `<rect x="500" y="90" width="370" height="310" rx="12" fill="#222529" stroke="${C.line}"/>`;
    s += T(685, 122, 'Efecto en el chasis', { fill: C.fg, size: 15, bold: true });
    const groundY = 340, frontX = 590, rearX = 800;
    const tilt = (ratio - 0.5) * 14;      // px: delantera baja → chasis cae hacia la izquierda
    const frameFront = groundY - 30 + tilt, frameRear = groundY - 34 - tilt;
    s += `<line x1="520" y1="${groundY}" x2="860" y2="${groundY}" stroke="${C.fg2}" stroke-width="2"/>`;
    // chasis (tubo) con pontón, asiento, columna y motor
    s += `<path d="M${frontX - 30},${frameFront} L${rearX + 10},${frameRear}" stroke="${C.acc}" stroke-width="7" stroke-linecap="round"/>`;
    s += `<path d="M${frontX - 48},${frameFront - 10} q0,-28 40,-30 l30,-2" stroke="#9aa0ab" stroke-width="5" fill="none" stroke-linecap="round"/>`;             // carenado frontal
    s += `<line x1="${frontX + 10}" y1="${frameFront - 4}" x2="${frontX + 64}" y2="${frameFront - 66}" stroke="#9aa0ab" stroke-width="4"/><circle cx="${frontX + 70}" cy="${frameFront - 72}" r="12" fill="none" stroke="#9aa0ab" stroke-width="4"/>`; // columna + volante
    s += `<path d="M${rearX - 110},${frameRear - 6} q-8,-50 30,-56 l4,0 q6,30 -6,56 z" fill="#2f6b86" stroke="#5fb3d6" stroke-width="2"/>`;  // asiento
    s += `<rect x="${rearX - 72}" y="${frameRear - 44}" width="46" height="40" rx="6" fill="#4a4f58" stroke="#9aa0ab" stroke-width="2"/>`;  // motor
    s += `<rect x="${rearX - 150}" y="${frameRear + 2}" width="150" height="10" rx="4" fill="#3a3e46"/>`;                                  // pontón lateral
    // ruedas (la trasera más grande)
    s += `<circle cx="${frontX}" cy="${groundY - 28}" r="28" fill="#1a1c20" stroke="#9aa0ab" stroke-width="5"/><circle cx="${frontX}" cy="${groundY - 28}" r="9" fill="#5a5f69"/>`;
    s += `<circle cx="${rearX}" cy="${groundY - 32}" r="32" fill="#1a1c20" stroke="#9aa0ab" stroke-width="5"/><circle cx="${rearX}" cy="${groundY - 32}" r="10" fill="#5a5f69"/>`;
    s += T(685, 160, ratio > 0.6 ? 'delantera BAJA' : ratio < 0.4 ? 'delantera ALTA' : 'delantera MEDIA', { fill: C.acc, bold: true, size: 14 });
    s += T(frontX, groundY + 18, 'delante', { size: 10 }) + T(rearX, groundY + 18, 'detrás', { size: 10 });
    s += T(685, 385, 'más arandelas abajo = mangueta sube = chasis más bajo delante', { size: 11 });
    s += T(W / 2, 452, 'CRG: delantera baja → más sobreviraje y mordida de entrada · alta → más subviraje · lluvia → lo más alta posible', { size: 11 });
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
    // panel
    s += `<rect x="530" y="90" width="340" height="330" rx="12" fill="#222529" stroke="${C.line}"/>`;
    s += T(700, 122, 'Valores de la sesión', { fill: C.fg, size: 15, bold: true });
    s += T(560, 170, 'Altura trasera', { anchor: 'start', size: 14 }) + T(840, 170, `${h > 0 ? '+' : ''}${fmt(h, 0)} mm`, { anchor: 'end', size: 20, fill: C.acc, bold: true });
    s += T(560, 205, 'Batalla', { anchor: 'start', size: 14 }) + T(840, 205, `${l > 0 ? '+' : ''}${fmt(l, 0)} mm`, { anchor: 'end', size: 20, fill: C.acc, bold: true });
    s += T(700, 260, h > 0 ? 'eje más alto en el chasis = chasis BAJO detrás' : h < 0 ? 'eje más bajo en el chasis = chasis ALTO detrás' : 'posición central', { size: 12, fill: C.fg });
    s += T(700, 300, 'tornillos en agujeros inferiores = trasera alta', { size: 11 });
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
