// Scene artwork for the Thursday 26 November 2026 front page: four lead scenes (viewBox 236 x 92), eight spot scenes
// (viewBox 88 x 78) and three date-anchor glyphs (viewBox 40 x 40). Each export is a function of no arguments returning
// one <svg> string; build.mjs places them.
// Flat vector only: rects, paths and circles, no gradients, filters, text or external assets. Bold shapes, no hairlines,
// so each scene still reads as an object at 300 px, and nothing is drawn that its sources.md row does not say.
// Lead scenes lose about 3 px top and bottom to the slice crop (the box is 86 px tall), so nothing essential sits there.

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

// One fuel drum, ink with two ochre hoops.
const drum = (x) => `<rect x="${x}" y="60" width="10" height="14" rx="2" fill="${INK}"/><path d="M${x} 65h10M${x} 69h10" stroke="${OCHRE}" stroke-width="1.5"/>`;

// A chess knight facing left, its base centred on (x, y), drawn s times a 40-unit-tall master.
function knight(x, y, s, fill, edge) {
  return `<path transform="translate(${x} ${y}) scale(${s})" d="M-13 0H13V-5H9L7 -14Q12 -22 9 -30Q5 -38 -3 -39L-6 -44L-9 -38Q-15 -34 -16 -26L-19 -19Q-19 -14 -14 -15L-7 -19Q-4 -19 -6 -14Q-11 -10 -11 -5H-13Z" fill="${fill}" stroke="${edge}" stroke-width="${(2 / s).toFixed(2)}" stroke-linejoin="round"/>`;
}

// A candle standing on (x, y), h tall, with its flame.
const candle = (x, y, h) =>
  `<rect x="${x - 3}" y="${y - h}" width="6" height="${h}" fill="${LIGHT}" stroke="${INK}" stroke-width="1.5"/>` +
  `<path d="M${x} ${y - h - 9}Q${x + 4} ${y - h - 3} ${x} ${y - h - 1}Q${x - 4} ${y - h - 3} ${x} ${y - h - 9}Z" fill="${OCHRE}"/>`;

// A police sawhorse barricade, plank top-left at (x, y).
const barricade = (x, y) =>
  `<path d="M${x + 4} ${y + 6}L${x} ${y + 18}M${x + 6} ${y + 6}L${x + 10} ${y + 18}M${x + 26} ${y + 6}L${x + 22} ${y + 18}M${x + 28} ${y + 6}L${x + 32} ${y + 18}" stroke="${INK}" stroke-width="2.5"/>` +
  `<rect x="${x}" y="${y}" width="32" height="7" fill="${SEA}" stroke="${INK}" stroke-width="1.5"/><path d="M${x + 6} ${y}v7M${x + 16} ${y}v7M${x + 26} ${y}v7" stroke="${LIGHT}" stroke-width="2.5"/>`;

// ---- lead scenes (236 x 92) -------------------------------------------------------------------

// Row 1. An empty parade route: barricades along the kerb and no marchers, two deflated balloons slumped on the road
// on their handling lines, wind streaks for the nor'easter, and a pennant marked 28 for the new date, Saturday 28th.
export function macys() {
  return art(236, 92, PANEL, `
<path d="M0 50V20H22V10H44V26H60V6H84V22H100V14H124V50Z" fill="${MUTE}"/><path d="M124 50V18H146V8H170V28H190V16H212V24H236V50Z" fill="${MUTE}"/>
<path d="M8 28h6M8 38h6M30 18h6M30 30h6M68 14h8M68 26h8M68 38h8M108 24h8M108 36h8M152 16h8M152 28h8M152 40h8M196 26h8M196 38h8" stroke="${PANEL}" stroke-width="4"/>
<path d="M128 10q14 -6 28 0t28 0M30 40q12 -5 24 0t24 0M150 36q10 -4 20 0" fill="none" stroke="${LIGHT}" stroke-width="3" stroke-linecap="round"/>
<rect y="50" width="236" height="42" fill="${SMOKE}"/><rect y="50" width="236" height="5" fill="${LIGHT}"/>
<path d="M4 72H232" stroke="${LIGHT}" stroke-width="2.5" stroke-dasharray="14 10"/>
${barricade(6, 40)}${barricade(46, 40)}${barricade(150, 40)}${barricade(190, 40)}
<path d="M18 86Q20 66 36 64Q44 56 56 62Q70 58 76 68Q90 70 92 86Z" fill="${ACC}"/><path d="M36 68Q46 74 56 66M60 72Q70 78 80 74" fill="none" stroke="${INK}" stroke-width="2" stroke-opacity=".5"/>
<path d="M118 88Q118 74 132 72Q140 64 152 70Q166 68 170 78Q180 80 180 88Z" fill="${OCHRE}"/><path d="M134 76Q144 82 152 74" fill="none" stroke="${INK}" stroke-width="2" stroke-opacity=".5"/>
<path d="M36 66Q40 78 34 90M70 64Q78 76 84 90M138 72Q130 82 128 92M164 74Q170 84 176 92" fill="none" stroke="${INK}" stroke-width="2"/>
<path d="M196 86V5" stroke="${INK}" stroke-width="3"/><path d="M197 5L234 16L197 27Z" fill="${ACC}"/>
<path d="M201 11.5H207V16H201V20.5H207M210 11.5H216V20.5H210ZM210 16H216" fill="none" stroke="${LIGHT}" stroke-width="2.2" stroke-linejoin="round"/>`);
}

// Row 2. The Gateway of India arch at night, the Taj dome behind it, and candles and marigolds laid along the steps.
export function mumbai() {
  return art(236, 92, INK, `
<path d="M128 64V38H138V30Q141 26 144 30V38H160Q160 24 176 16Q192 24 192 38H208V30Q211 26 214 30V38H226V30Q229 26 232 30V38H236V64Z" fill="${MUTE}"/>
<path d="M134 46h6M134 54h6M148 46h6M148 54h6M198 46h6M198 54h6M212 46h6M212 54h6M226 46h6M226 54h6M168 46h16M168 54h16" stroke="${OCHRE}" stroke-width="3"/>
<path d="M26 66V24H36V14Q39 10 42 14V24H52V18H100V24H110V14Q113 10 116 14V24H126V66Z" fill="${PANEL}"/>
<path d="M60 66V44Q76 26 92 44V66Z" fill="${INK}"/><path d="M33 66V50Q39 42 45 50V66ZM107 66V50Q113 42 119 50V66Z" fill="${INK}"/>
<path d="M30 30H122" stroke="${OCHRE}" stroke-width="3"/>
<rect y="66" width="236" height="8" fill="${SMOKE}"/><rect y="74" width="236" height="8" fill="${MUTE}"/><rect y="82" width="236" height="10" fill="${SMOKE}"/>
${[12, 34, 56, 80, 104, 128, 150, 174, 198, 222].map((x) => candle(x, 74, 10)).join('')}
${[23, 45, 68, 92, 116, 139, 162, 186, 210].map((x, i) => `<circle cx="${x}" cy="79" r="3.5" fill="${i % 2 ? ACC : OCHRE}"/><circle cx="${x + 5}" cy="80" r="3" fill="${i % 2 ? OCHRE : ACC}"/>`).join('')}`);
}

// Row 3. A ring road on an embankment over a tunnel mouth; a fuel tanker on the deck, burning, black smoke above.
export function giza() {
  return art(236, 92, PANEL, `
${smoke(132, 8, 3, 10, INK, 18)}
<rect y="58" width="236" height="34" fill="${MUTE}"/><rect y="86" width="236" height="6" fill="${OCHRE}"/>
<path d="M44 92V78A24 24 0 0 1 92 78V92Z" fill="${INK}"/><path d="M44 78A24 24 0 0 1 92 78" fill="none" stroke="${LIGHT}" stroke-width="4"/>
<rect y="48" width="236" height="10" fill="${INK}"/><path d="M4 53H232" stroke="${LIGHT}" stroke-width="2.5" stroke-dasharray="12 10"/>
<g transform="rotate(-7 150 40)"><rect x="98" y="22" width="92" height="24" rx="12" fill="${LIGHT}" stroke="${INK}" stroke-width="4"/>
<rect x="112" y="30" width="64" height="7" fill="${OCHRE}"/>
<path d="M194 20H212L222 34V46H194Z" fill="${INK}"/><path d="M204 24H210L216 33H204Z" fill="${LIGHT}"/>
<circle cx="112" cy="48" r="6" fill="${INK}"/><circle cx="128" cy="48" r="6" fill="${INK}"/><circle cx="176" cy="48" r="6" fill="${INK}"/><circle cx="210" cy="48" r="6" fill="${INK}"/></g>
${flame(128, 28, 48, 26)}${flame(166, 24, 34, 20)}`);
}

// Row 4. Stacked shipping containers on a quay, and a percentage bar chart rising beside them: tariffs going up.
export function tariffs() {
  return art(236, 92, PANEL, `
<rect y="80" width="236" height="12" fill="${INK}"/>
<rect x="8" y="58" width="44" height="22" fill="${INK}"/><rect x="54" y="58" width="44" height="22" fill="${OCHRE}"/><rect x="100" y="58" width="44" height="22" fill="${MUTE}"/>
<rect x="31" y="34" width="44" height="22" fill="${OCHRE}"/><rect x="77" y="34" width="44" height="22" fill="${INK}"/>
<rect x="54" y="10" width="44" height="22" fill="${MUTE}"/>
<path d="M18 58v22M30 58v22M42 58v22M64 58v22M76 58v22M88 58v22M110 58v22M122 58v22M134 58v22M41 34v22M53 34v22M65 34v22M87 34v22M99 34v22M111 34v22M64 10v22M76 10v22M88 10v22" stroke="${PANEL}" stroke-opacity=".45" stroke-width="3"/>
<rect x="156" y="62" width="18" height="18" fill="${ACC}"/><rect x="180" y="46" width="18" height="34" fill="${ACC}"/><rect x="204" y="26" width="18" height="54" fill="${ACC}"/>
<path d="M154 46L188 18" stroke="${INK}" stroke-width="5" stroke-linecap="round"/><path d="M178 12L196 12L191 29Z" fill="${INK}"/>
<circle cx="207" cy="10" r="3.5" fill="none" stroke="${INK}" stroke-width="2.5"/><circle cx="219" cy="20" r="3.5" fill="none" stroke="${INK}" stroke-width="2.5"/><path d="M221 6L205 24" stroke="${INK}" stroke-width="2.5"/>`);
}

// ---- spot scenes (88 x 78) --------------------------------------------------------------------

// Row 5. A port quay with a gantry crane, a strike burst and its smoke plume, and a ship alongside. Drawn 8 units high
// so the source credit in the bottom-right corner lands on open water, not the ship.
export function port() {
  return art(88, 78, PANEL, `<g transform="translate(0 -8)">
${smoke(50, 30, 4, 8, INK, 5)}
<rect y="58" width="88" height="28" fill="${SEA}"/>
<path d="M0 70q6 -5 11 0t11 0t11 0t11 0t11 0t11 0t11 0t11 0" fill="none" stroke="${LIGHT}" stroke-width="3"/>
<rect y="48" width="48" height="12" fill="${MUTE}"/>
<path d="M8 48V12M24 48V12" stroke="${INK}" stroke-width="4"/><rect x="2" y="8" width="44" height="6" fill="${INK}"/><path d="M8 30L24 20M24 30L8 20" stroke="${INK}" stroke-width="2"/>
<rect x="28" y="40" width="16" height="8" fill="${OCHRE}"/>
${burst(48, 42, 11)}
<path d="M46 58H88V66H52Z" fill="${INK}"/><rect x="74" y="46" width="12" height="12" fill="${LIGHT}"/><rect x="56" y="51" width="8" height="7" fill="${ACC}"/><rect x="64" y="51" width="8" height="7" fill="${OCHRE}"/></g>`);
}

// Row 6. A refinery: a storage tank, distillation columns and a pipe rack, two black smoke columns rising off it.
export function refinery() {
  return art(88, 78, PANEL, `
${smoke(40, 22, 4, 9, INK, 2)}${smoke(72, 30, 4, 7, '#2B2F36', 3)}
<rect y="68" width="88" height="10" fill="${OCHRE}"/>
<path d="M2 68V52Q14 48 26 52V68Z" fill="${MUTE}"/><path d="M2 58H26" stroke="${LIGHT}" stroke-width="2.5"/>
<rect x="32" y="34" width="9" height="34" rx="2" fill="${INK}"/><rect x="45" y="26" width="8" height="42" rx="2" fill="${INK}"/><rect x="68" y="40" width="9" height="28" rx="2" fill="${INK}"/>
<path d="M28 56H88M28 62H88" stroke="${INK}" stroke-width="3"/><path d="M60 56V68M84 56V68" stroke="${INK}" stroke-width="3"/>
${flame(44, 46, 26, 18)}${flame(72, 50, 20, 14)}`);
}

// Row 7. The corner of a chessboard with a white knight on it, the side that moves first in Game 3.
export function chess() {
  return art(88, 78, PANEL, `
<path d="M0 78V38H88V78Z" fill="${INK}"/>
${[0, 1, 2, 3, 4].flatMap((c) => [0, 1, 2].map((r) => (c + r) % 2 ? '' : `<rect x="${2 + c * 18}" y="${40 + r * 13}" width="18" height="13" fill="${LIGHT}"/>`)).join('')}
<path d="M2 40H88M2 40V78" stroke="${OCHRE}" stroke-width="3"/>
${knight(38, 50, 1.05, LIGHT, INK)}
<circle cx="68" cy="34" r="5" fill="${INK}"/><path d="M62 50Q64 40 68 38Q72 40 74 50Z" fill="${INK}"/>`);
}

// Row 8. A satellite on an orbit over the curve of the Earth, more craft strung along the same track.
export function satellite() {
  return art(88, 78, INK, `
<circle cx="44" cy="168" r="112" fill="${SEA}"/><circle cx="44" cy="168" r="112" fill="none" stroke="${LIGHT}" stroke-width="2.5" stroke-opacity=".6"/>
<path d="M-6 58Q44 2 94 40" fill="none" stroke="${LIGHT}" stroke-width="1.5" stroke-dasharray="3 4"/>
<circle cx="8" cy="42" r="2.5" fill="${LIGHT}"/><circle cx="20" cy="31" r="2.5" fill="${LIGHT}"/><circle cx="70" cy="24" r="2.5" fill="${LIGHT}"/><circle cx="82" cy="31" r="2.5" fill="${LIGHT}"/>
<g transform="translate(44 22) rotate(-12)"><rect x="-26" y="-6" width="18" height="12" fill="${SEA}" stroke="${LIGHT}" stroke-width="1.5"/><rect x="8" y="-6" width="18" height="12" fill="${SEA}" stroke="${LIGHT}" stroke-width="1.5"/>
<path d="M-20 -6v12M-14 -6v12M14 -6v12M20 -6v12M-8 0H8" stroke="${LIGHT}" stroke-width="1.5"/><rect x="-6" y="-8" width="12" height="16" rx="2" fill="${OCHRE}"/></g>`);
}

// Row 9. A city block; overhead a cluster bomb has split open and its bomblets rain down, small blasts on the roofs.
const BOMBLETS = [[22, 22], [34, 26], [50, 24], [62, 20], [28, 33], [44, 32], [58, 30], [70, 28]];
export function cluster() {
  return art(88, 78, PANEL, `
<path d="M0 78V50H16V40H34V54H48V36H66V48H88V78Z" fill="${INK}"/>
<path d="M6 58h5M6 66h5M22 48h6M22 58h6M22 66h6M54 44h6M54 54h6M54 64h6M72 56h8M72 66h8" stroke="${LIGHT}" stroke-width="4"/>
<g transform="translate(44 10) rotate(10)"><path d="M-14 -4H6L12 0L6 4H-14Z" fill="${MUTE}"/><path d="M-14 -4L-20 -9V9L-14 4Z" fill="${INK}"/><path d="M8 -6L16 -12M8 6L16 12" stroke="${INK}" stroke-width="3"/></g>
${BOMBLETS.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.6" fill="${INK}"/>`).join('')}
${burst(25, 40, 8)}${burst(57, 36, 8)}`);
}

// Row 10. A missile flying over a reactor block marked with the radiation sign.
export function nuke() {
  return art(88, 78, PANEL, `
<rect y="72" width="88" height="6" fill="${INK}"/>
<rect x="6" y="50" width="76" height="22" fill="${MUTE}"/><path d="M24 50A20 20 0 0 1 64 50Z" fill="${LIGHT}" stroke="${INK}" stroke-width="3"/>
<path d="M12 58H20M68 58H76" stroke="${LIGHT}" stroke-width="4"/>${trefoil(44, 60, 8)}
<g transform="translate(44 18) rotate(-14)"><rect x="-30" y="-5" width="48" height="10" fill="${LIGHT}" stroke="${INK}" stroke-width="2.5"/>
<path d="M18 -5L32 0L18 5Z" fill="${ACC}"/><path d="M-30 -5L-38 -12V-3ZM-30 5L-38 12V3Z" fill="${INK}"/><path d="M-36 -1.5h-8v3h8Z" fill="${OCHRE}"/></g>`);
}

// Row 11. A collapsed block, slabs pancaked and a rubble heap, with a red medical cross for the outbreak.
export function rubble() {
  return art(88, 78, PANEL, `
<path d="M6 78V30L18 22L24 34L34 26V78Z" fill="${INK}"/><path d="M12 40h6M12 50h6M12 60h6M24 44h5M24 56h5" stroke="${LIGHT}" stroke-width="4"/>
<path d="M30 52L76 42L78 48L32 58Z" fill="${MUTE}"/><path d="M34 62L80 58V64L34 68Z" fill="${INK}"/>
<path d="M22 78Q30 66 40 70Q50 62 60 70Q70 66 84 78Z" fill="${MUTE}"/>
<circle cx="64" cy="20" r="16" fill="${LIGHT}" stroke="${INK}" stroke-width="2.5"/><path d="M59 9h10v6h6v10h-6v6h-10v-6h-6v-10h6Z" fill="${ACC}"/>`);
}

// Row 12. A blast on open ground throwing up a grey dust cloud, with the stockpile's drums either side.
export function blast() {
  return art(88, 78, PANEL, `
${smoke(30, 34, 3, 12, SMOKE, 10)}<circle cx="62" cy="38" r="15" fill="${SMOKE}"/><circle cx="20" cy="46" r="12" fill="${SMOKE}"/>
<rect y="64" width="88" height="14" fill="${OCHRE}"/>${burst(44, 54, 18)}
${[4, 16].map(drum).join('')}
${[66, 78].map(drum).join('')}`);
}

// ---- date-anchor glyphs (40 x 40, on the strip's panel) ---------------------------------------

// Row 1. A parade balloon on its pole, struck through with a red cancel sign.
export function balloonGlyph() {
  return `<svg viewBox="0 0 40 40"><path d="M20 24V40" stroke="${INK}" stroke-width="3"/><ellipse cx="20" cy="14" rx="10" ry="11" fill="${OCHRE}"/>` +
    `<path d="M17 25H23L20 22Z" fill="${OCHRE}"/><path d="M14 9Q16 5 20 5" fill="none" stroke="${LIGHT}" stroke-width="2.5" stroke-linecap="round"/>` +
    `<circle cx="20" cy="18" r="15" fill="none" stroke="${ACC}" stroke-width="3.5"/><path d="M9.4 7.4L30.6 28.6" stroke="${ACC}" stroke-width="3.5"/></svg>`;
}

// Row 2. Three memorial candles burning on a plinth.
export function candlesGlyph() {
  return `<svg viewBox="0 0 40 40"><rect x="2" y="34" width="36" height="6" fill="${INK}"/>${candle(10, 34, 14)}${candle(20, 34, 20)}${candle(30, 34, 14)}</svg>`;
}

// Row 7. A knight on the corner of a board.
export function knightGlyph() {
  return `<svg viewBox="0 0 40 40"><rect x="0" y="30" width="40" height="10" fill="${INK}"/><rect x="0" y="30" width="10" height="5" fill="${LIGHT}"/><rect x="10" y="35" width="10" height="5" fill="${LIGHT}"/>` +
    `<rect x="20" y="30" width="10" height="5" fill="${LIGHT}"/><rect x="30" y="35" width="10" height="5" fill="${LIGHT}"/>${knight(21, 30, 0.62, INK, INK)}</svg>`;
}
