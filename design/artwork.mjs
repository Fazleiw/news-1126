// Scene artwork for the Thursday 26 November 2026 front page: four lead scenes (viewBox 236 x 112) and eight spot
// scenes (viewBox 88 x 78). Each export is a function of no arguments returning one <svg> string; build.mjs places them.
// Flat vector only: rects, paths and circles, no gradients, filters, text or external assets. Bold shapes, no hairlines,
// so each scene still reads as an object at 300 px, and nothing is drawn that its sources.md row does not say.

// The page palette, as declared in build.mjs. These eight are the ones the scenes paint with; keep the two in step.
const INK = '#191C22', ACC = '#C0391F', OCHRE = '#C9952E', MUTE = '#3E424A';
const PANEL = '#E4DED0', LIGHT = '#FBF8F1', SMOKE = '#8E9094', SEA = '#6F95A6';

// ---- building blocks --------------------------------------------------------------------------

// Wraps a scene body in a cropping SVG with a flat background.
function art(vw, vh, bg, body) {
  return `<svg viewBox="0 0 ${vw} ${vh}" preserveAspectRatio="xMidYMid slice"><rect width="${vw}" height="${vh}" fill="${bg}"/>${body}</svg>`;
}

// An eight-pointed red explosion star with an ochre core.
function burst(cx, cy, r) {
  let d = '';
  for (let i = 0; i < 16; i++) {
    const a = (i * Math.PI) / 8 - Math.PI / 2, rr = i % 2 ? r * 0.5 : r;
    d += (i ? 'L' : 'M') + (cx + rr * Math.cos(a)).toFixed(1) + ' ' + (cy + rr * Math.sin(a)).toFixed(1);
  }
  return `<path d="${d}Z" fill="${ACC}"/><circle cx="${cx}" cy="${cy}" r="${(r * 0.34).toFixed(1)}" fill="${OCHRE}"/>`;
}

// Fire with three tongues, standing on (cx, by), w wide and h tall: a red outer flame round a smaller ochre one.
const TONGUES = [[-.5, 0], [-.44, -.42], [-.3, -.26], [-.17, -.82], [-.03, -.46], [.1, -1], [.22, -.42], [.35, -.68], [.5, 0]];
function flame(cx, by, w, h) {
  return [[ACC, 1], [OCHRE, 0.55]].map(([fill, k]) =>
    `<path d="${TONGUES.map(([x, y], i) => (i ? 'L' : 'M') + (cx + x * w * k).toFixed(1) + ' ' + (by + y * h * k).toFixed(1)).join('')}Z" fill="${fill}"/>`).join('');
}

// n puffs of smoke rising from (x, y), each one wider than the last and shifted sideways by dx.
function smoke(x, y, n, r, fill, dx = r * 0.45) {
  return Array.from({ length: n }, (_, i) => `<circle cx="${(x + i * dx).toFixed(1)}" cy="${(y - i * r * 1.05).toFixed(1)}" r="${(r * (1 + i * 0.14)).toFixed(1)}" fill="${fill}"/>`).join('');
}

// The radiation sign: three 60° ink blades round a hub, on an ochre disc.
function trefoil(cx, cy, r) {
  const at = (deg, rr) => (cx + rr * Math.cos(deg * Math.PI / 180)).toFixed(1) + ' ' + (cy + rr * Math.sin(deg * Math.PI / 180)).toFixed(1);
  const blades = [-90, 30, 150].map((a) =>
    `M${at(a - 30, r * 0.3)}L${at(a - 30, r * 0.92)}A${r * 0.92} ${r * 0.92} 0 0 1 ${at(a + 30, r * 0.92)}L${at(a + 30, r * 0.3)}A${r * 0.3} ${r * 0.3} 0 0 0 ${at(a - 30, r * 0.3)}Z`).join('');
  return `<circle cx="${cx}" cy="${cy}" r="${r + 2}" fill="${OCHRE}"/><path d="${blades}" fill="${INK}"/><circle cx="${cx}" cy="${cy}" r="${(r * 0.18).toFixed(1)}" fill="${INK}"/>`;
}

// A judge's gavel at (x, y), scaled by s and turned a degrees.
function gavel(x, y, s, a) {
  return `<g transform="translate(${x} ${y}) rotate(${a}) scale(${s})" fill="${INK}">` +
    `<rect x="-6" y="0" width="12" height="62" rx="4"/><rect x="-28" y="-20" width="56" height="26" rx="5"/>` +
    `<rect x="-32" y="-23" width="9" height="32" rx="3"/><rect x="23" y="-23" width="9" height="32" rx="3"/></g>`;
}

// A red teardrop with its point up.
function drop(x, y) {
  return `<path d="M${x} ${y - 7}Q${x + 6} ${y + 1} ${x} ${y + 4}Q${x - 6} ${y + 1} ${x} ${y - 7}Z" fill="${ACC}"/>`;
}

// One fuel drum, ink with two ochre hoops.
const drum = (x) => `<rect x="${x}" y="60" width="10" height="14" rx="2" fill="${INK}"/><path d="M${x} 65h10M${x} 69h10" stroke="${OCHRE}" stroke-width="1.5"/>`;

// ---- lead scenes (236 x 112) ------------------------------------------------------------------

// Row 1. A ring road on an embankment over a tunnel mouth; a fuel tanker on the deck, burning, black smoke above.
export function giza() {
  return art(236, 112, PANEL, `
${smoke(132, 14, 4, 11, INK, 16)}
<rect y="66" width="236" height="46" fill="${MUTE}"/><rect y="104" width="236" height="8" fill="${OCHRE}"/>
<path d="M44 112V90A26 26 0 0 1 96 90V112Z" fill="${INK}"/><path d="M44 90A26 26 0 0 1 96 90" fill="none" stroke="${LIGHT}" stroke-width="4"/>
<rect y="56" width="236" height="10" fill="${INK}"/><path d="M4 61H232" stroke="${LIGHT}" stroke-width="2.5" stroke-dasharray="12 10"/>
<g transform="rotate(-7 150 48)"><rect x="98" y="30" width="92" height="24" rx="12" fill="${LIGHT}" stroke="${INK}" stroke-width="4"/>
<rect x="112" y="38" width="64" height="7" fill="${OCHRE}"/>
<path d="M194 28H212L222 42V54H194Z" fill="${INK}"/><path d="M204 32H210L216 41H204Z" fill="${LIGHT}"/>
<circle cx="112" cy="56" r="6" fill="${INK}"/><circle cx="128" cy="56" r="6" fill="${INK}"/><circle cx="176" cy="56" r="6" fill="${INK}"/><circle cx="210" cy="56" r="6" fill="${INK}"/></g>
${flame(128, 36, 52, 32)}${flame(166, 32, 36, 24)}`);
}

// Row 2. Stacked shipping containers on a quay, and a bar chart rising beside them: tariffs going up.
export function tariffs() {
  return art(236, 112, PANEL, `
<rect y="98" width="236" height="14" fill="${INK}"/>
<rect x="8" y="72" width="44" height="26" fill="${INK}"/><rect x="54" y="72" width="44" height="26" fill="${OCHRE}"/><rect x="100" y="72" width="44" height="26" fill="${MUTE}"/>
<rect x="31" y="44" width="44" height="26" fill="${OCHRE}"/><rect x="77" y="44" width="44" height="26" fill="${INK}"/>
<rect x="54" y="16" width="44" height="26" fill="${MUTE}"/>
<path d="M18 72v26M30 72v26M42 72v26M64 72v26M76 72v26M88 72v26M110 72v26M122 72v26M134 72v26M41 44v26M53 44v26M65 44v26M87 44v26M99 44v26M111 44v26M64 16v26M76 16v26M88 16v26" stroke="${PANEL}" stroke-opacity=".45" stroke-width="3"/>
<rect x="156" y="78" width="18" height="20" fill="${ACC}"/><rect x="180" y="60" width="18" height="38" fill="${ACC}"/><rect x="204" y="36" width="18" height="62" fill="${ACC}"/>
<path d="M154 62L196 30" stroke="${INK}" stroke-width="5" stroke-linecap="round"/><path d="M186 22L206 22L200 41Z" fill="${INK}"/>`);
}

// Row 3. A port quay with a gantry crane, a strike burst and its smoke plume, and a ship standing off in the sea.
export function hodeida() {
  return art(236, 112, PANEL, `
${smoke(98, 50, 5, 11, INK, 9)}
<rect y="80" width="236" height="32" fill="${SEA}"/>
<path d="M120 96q8 -6 16 0t16 0t16 0t16 0t16 0t16 0t16 0M0 106q8 -6 16 0t16 0t16 0t16 0t16 0t16 0t16 0t16 0t16 0t16 0t16 0t16 0t16 0t16 0t16 0" fill="none" stroke="${LIGHT}" stroke-width="3"/>
<rect y="70" width="124" height="20" fill="${MUTE}"/>
<path d="M20 70V24M50 70V24" stroke="${INK}" stroke-width="6"/><rect x="6" y="18" width="104" height="9" fill="${INK}"/>
<path d="M20 44L50 30M50 44L20 30" stroke="${INK}" stroke-width="3"/><path d="M84 27V46" stroke="${INK}" stroke-width="2.5"/>
<rect x="72" y="46" width="24" height="12" fill="${OCHRE}"/><rect x="58" y="58" width="30" height="12" fill="${INK}"/>
${burst(104, 62, 18)}
<path d="M138 78H230L222 92H146Z" fill="${INK}"/><rect x="194" y="62" width="24" height="16" fill="${LIGHT}"/><rect x="204" y="54" width="7" height="8" fill="${INK}"/>
<rect x="152" y="68" width="18" height="10" fill="${OCHRE}"/><rect x="172" y="68" width="18" height="10" fill="${ACC}"/>`);
}

// Row 4. A refinery: storage tanks, distillation columns and a pipe rack, two black smoke columns climbing off the plant.
export function rastanura() {
  return art(236, 112, PANEL, `
${smoke(118, 54, 5, 12, INK, 4)}${smoke(178, 60, 5, 10, '#2B2F36', 6)}
<rect y="98" width="236" height="14" fill="${OCHRE}"/>
<path d="M8 98V72Q30 64 52 72V98ZM56 98V78Q74 72 92 78V98Z" fill="${MUTE}"/><path d="M8 82H52M56 88H92" stroke="${LIGHT}" stroke-width="3"/>
<rect x="104" y="40" width="14" height="58" rx="3" fill="${INK}"/><rect x="124" y="28" width="12" height="70" rx="3" fill="${INK}"/><rect x="164" y="48" width="14" height="50" rx="3" fill="${INK}"/>
<path d="M96 80H230M96 88H230" stroke="${INK}" stroke-width="4"/><path d="M146 80V98M200 80V98M224 80V98" stroke="${INK}" stroke-width="4"/>
<rect x="210" y="34" width="5" height="46" fill="${INK}"/>
${flame(126, 70, 40, 30)}${flame(176, 74, 34, 26)}`);
}

// ---- spot scenes (88 x 78) --------------------------------------------------------------------

// Row 5. A missile flying over a reactor block marked with the radiation sign.
export function nuke() {
  return art(88, 78, PANEL, `
<rect y="72" width="88" height="6" fill="${INK}"/>
<rect x="6" y="50" width="76" height="22" fill="${MUTE}"/><path d="M24 50A20 20 0 0 1 64 50Z" fill="${LIGHT}" stroke="${INK}" stroke-width="3"/>
<path d="M12 58H20M68 58H76" stroke="${LIGHT}" stroke-width="4"/>${trefoil(44, 60, 8)}
<g transform="translate(44 18) rotate(-14)"><rect x="-30" y="-5" width="48" height="10" fill="${LIGHT}" stroke="${INK}" stroke-width="2.5"/>
<path d="M18 -5L32 0L18 5Z" fill="${ACC}"/><path d="M-30 -5L-38 -12V-3ZM-30 5L-38 12V3Z" fill="${INK}"/><path d="M-36 -1.5h-8v3h8Z" fill="${OCHRE}"/></g>`);
}

// Row 6. A Swiss passport, red with the white cross, under an ink exit stamp: the arrow out through the door.
export function expel() {
  return art(88, 78, PANEL, `
<rect x="8" y="6" width="44" height="64" rx="4" fill="${ACC}"/><rect x="25" y="18" width="10" height="28" fill="#fff"/><rect x="16" y="27" width="28" height="10" fill="#fff"/>
<rect x="16" y="56" width="28" height="4" fill="${OCHRE}"/>
<g transform="translate(60 50) rotate(-14)"><rect x="-24" y="-17" width="48" height="34" rx="4" fill="${LIGHT}" fill-opacity=".9" stroke="${INK}" stroke-width="4"/>
<path d="M4 -10V10" stroke="${INK}" stroke-width="4"/><path d="M-16 0H12" stroke="${INK}" stroke-width="5"/><path d="M8 -8L18 0L8 8Z" fill="${INK}"/></g>`);
}

// Row 7. A city block; overhead a cluster bomb has split open and its bomblets rain down, small blasts on the roofs.
const BOMBLETS = [[22, 22], [34, 26], [50, 24], [62, 20], [28, 33], [44, 32], [58, 30], [70, 28]];
export function cluster() {
  return art(88, 78, PANEL, `
<path d="M0 78V50H16V40H34V54H48V36H66V48H88V78Z" fill="${INK}"/>
<path d="M6 58h5M6 66h5M22 48h6M22 58h6M22 66h6M54 44h6M54 54h6M54 64h6M72 56h8M72 66h8" stroke="${LIGHT}" stroke-width="4"/>
<g transform="translate(44 10) rotate(10)"><path d="M-14 -4H6L12 0L6 4H-14Z" fill="${MUTE}"/><path d="M-14 -4L-20 -9V9L-14 4Z" fill="${INK}"/><path d="M8 -6L16 -12M8 6L16 12" stroke="${INK}" stroke-width="3"/></g>
${BOMBLETS.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.6" fill="${INK}"/>`).join('')}
${burst(25, 40, 8)}${burst(57, 36, 8)}`);
}

// Row 8. A folder marked secret, its papers spilling out, and red drops falling from the leak.
export function leak() {
  return art(88, 78, PANEL, `
<path d="M8 20H30L36 26H66V72H8Z" fill="${OCHRE}"/>
<g transform="rotate(14 54 36)"><rect x="34" y="8" width="38" height="48" fill="${LIGHT}" stroke="${INK}" stroke-width="3"/>
<path d="M40 18H66M40 26H66M40 34H66M40 42H58" stroke="${INK}" stroke-width="3.5"/><rect x="40" y="46" width="26" height="6" fill="${ACC}"/></g>
<path d="M8 32H66V72H8Z" fill="${INK}"/><rect x="20" y="44" width="34" height="10" fill="${ACC}"/>
${drop(76, 62)}${drop(70, 74)}${drop(82, 74)}`);
}

// Row 9. A blast on open ground throwing up a grey dust cloud, with the stockpile's drums either side.
export function blast() {
  return art(88, 78, PANEL, `
${smoke(30, 34, 3, 12, SMOKE, 10)}<circle cx="62" cy="38" r="15" fill="${SMOKE}"/><circle cx="20" cy="46" r="12" fill="${SMOKE}"/>
<rect y="64" width="88" height="14" fill="${OCHRE}"/>${burst(44, 54, 18)}
${[4, 16].map(drum).join('')}
${[66, 78].map(drum).join('')}`);
}

// Row 10. The scales of justice beside a gavel.
export function justice() {
  return art(88, 78, PANEL, `
<rect x="4" y="70" width="80" height="8" fill="${INK}"/>
<path d="M32 12V66M18 66H46M8 20H56" stroke="${INK}" stroke-width="5" stroke-linecap="round"/><circle cx="32" cy="12" r="5" fill="${INK}"/>
<path d="M8 20L2 42M8 20L14 42M56 20L50 38M56 20L62 38" stroke="${INK}" stroke-width="2"/>
<path d="M0 42H16A8 8 0 0 1 0 42ZM48 38H64A8 8 0 0 1 48 38Z" fill="${OCHRE}" stroke="${INK}" stroke-width="2"/>
${gavel(72, 46, 0.42, 35)}`);
}

// Row 11. A collapsed block, slabs pancaked and a rubble heap, with a red medical cross for the outbreak.
export function rubble() {
  return art(88, 78, PANEL, `
<path d="M6 78V30L18 22L24 34L34 26V78Z" fill="${INK}"/><path d="M12 40h6M12 50h6M12 60h6M24 44h5M24 56h5" stroke="${LIGHT}" stroke-width="4"/>
<path d="M30 52L76 42L78 48L32 58Z" fill="${MUTE}"/><path d="M34 62L80 58V64L34 68Z" fill="${INK}"/>
<path d="M22 78Q30 66 40 70Q50 62 60 70Q70 66 84 78Z" fill="${MUTE}"/>
<circle cx="64" cy="20" r="16" fill="${LIGHT}" stroke="${INK}" stroke-width="2.5"/><path d="M59 9h10v6h6v10h-6v6h-10v-6h-6v-10h6Z" fill="${ACC}"/>`);
}

// Row 12. A long-winged twin-engine bomber seen from below, flying over a choppy sea.
export function bomber() {
  return art(88, 78, PANEL, `
<rect y="56" width="88" height="22" fill="${SEA}"/>
<path d="M0 64q6 -5 11 0t11 0t11 0t11 0t11 0t11 0t11 0t11 0M0 73q6 -5 11 0t11 0t11 0t11 0t11 0t11 0t11 0t11 0" fill="none" stroke="${LIGHT}" stroke-width="3"/>
<g transform="translate(44 28) rotate(-10)" fill="${INK}">
<path d="M-38 -2.5H30Q40 -2.5 42 0Q40 2.5 30 2.5H-38Z"/>
<path d="M8 -2L-14 -28H-22L-6 -2ZM8 2L-14 28H-22L-6 2Z"/>
<path d="M-28 -2L-38 -12H-42L-36 -2ZM-28 2L-38 12H-42L-36 2Z"/>
<rect x="-6" y="-9" width="14" height="5" rx="2"/><rect x="-6" y="4" width="14" height="5" rx="2"/></g>`);
}
