// Builds design/atlas.html: a 1024x1024 front page of the world news of Thursday 26 November 2026.
// Deterministic: no randomness, no clock, no network, system fonts only. Map data: Natural Earth via world-atlas (data/).
// CHECK=1 node design/build.mjs adds a layout checker to the page (clipping, band slack, pins, font sizes);
// render.sh never sets it. Every story, place and figure traces to a row of design/sources.md (src: row number).
//
// Page, top to bottom: masthead with the date / three-teaser deck / 4 lead stories with scenes / 8 second-tier
// stories with scenes / locator map + "Also on Thursday" (24 one-liners) / closing line restating the date.
//
// Type scale, px at 1024 (nothing smaller than 15): 96 date / 34 lead figure / 25 second figure / 21 lead headline /
// 19 deck / 18 legend / 17 masthead strap, closing line / 16 card headline, digest, lead place / 15 place, numbers, sources.
import { readFileSync, writeFileSync } from 'node:fs';
import { giza, tariffs, hodeida, rastanura, nuke, expel, cluster, leak, blast, justice, rubble, bomber } from './artwork.mjs';

const here = new URL('./', import.meta.url);
const topo = JSON.parse(readFileSync(new URL('data/countries-110m.json', here)));

// ---- palette ----------------------------------------------------------------------------------
// Paper, ink, one accent (figures, the strike marks) and one secondary (ochre). The six region colours appear only on
// number chips, map pins and the legend; each carries white numbers at >= 4.5:1.
const PAPER = '#F4F0E6', INK = '#191C22', ACC = '#C0391F', OCHRE = '#C9952E';
const MUTE = '#3E424A', PANEL = '#E4DED0', LIGHT = '#FBF8F1', SMOKE = '#8E9094', SEA = '#6F95A6', EUBLUE = '#22409A';
const REGION = {
  Europe: '#6A3D9A', 'Middle East': '#8F5400', Asia: '#A8285F',
  Africa: '#2C7232', Americas: '#2356A0', Oceania: '#0B6E7A',
};
const REGION_ORDER = Object.keys(REGION);
const WORLD = INK; // the two stories with no single place (the peace talks, world markets) use an ink chip and have no dot

// ---- page bands (y, px at 1024) ---------------------------------------------------------------
const W = 1024, M = 20;
const HEAD_H = 118, DECK_Y = 126, DECK_H = 30, RULE_Y = 163, LEAD_Y = 172, LEAD_H = 256;
const SEC_Y = LEAD_Y + LEAD_H + 12, SEC_ROW = 112, SEC_GAP = 10, SEC_H = 2 * SEC_ROW + SEC_GAP;
const FOOT_H = 52, FOOT_Y = W - FOOT_H, LOW_Y = SEC_Y + SEC_H + 12, LOW_H = FOOT_Y - 6 - LOW_Y;
const COL_GAP = 14, COL_W = (W - 2 * M - 3 * COL_GAP) / 4;

// ---- projection (Miller, cropped to where the day's stories are) ------------------------------
// Widened from the 25 November crop: Middletown, Iowa (9) is at 91°W and Southland, NZ (35) at 46°S, 168°E.
const MAP_W = 304, LON0 = -104, LON1 = 174, LAT_TOP = 63, LAT_BOT = -50, K = MAP_W / (LON1 - LON0);
const miller = (lat) => 1.25 * Math.log(Math.tan(Math.PI / 4 + 0.4 * lat * Math.PI / 180)) * 180 / Math.PI;
const MAP_H = Math.round((miller(LAT_TOP) - miller(LAT_BOT)) * K);
const px = (lon, lat) => [(lon - LON0) * K, (miller(LAT_TOP) - miller(lat)) * K];

// ---- topojson decode --------------------------------------------------------------------------
const [sx, sy] = topo.transform.scale, [tx, ty] = topo.transform.translate;
const arcs = topo.arcs.map((a) => {
  let x = 0, y = 0;
  return a.map(([dx, dy]) => { x += dx; y += dy; return [x * sx + tx, y * sy + ty]; });
});
const ring = (idx) => {
  const pts = [];
  for (const i of idx) {
    const a = i < 0 ? arcs[~i].slice().reverse() : arcs[i];
    pts.push(...(pts.length ? a.slice(1) : a));
  }
  return pts;
};
// Rings that cross the antimeridian (Fiji, Chukotka) are unwrapped so they run off the right edge of the crop instead
// of drawing a sliver across the whole map.
const ringPath = (pts) => {
  let d = '', prev = null;
  pts.forEach(([lo, la], i) => {
    if (prev !== null) lo += 360 * Math.round((prev - lo) / 360);
    prev = lo;
    const [x, y] = px(lo, Math.max(la, -80));
    d += (i ? 'L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1);
  });
  return d + 'Z';
};
const geomPath = (g) => {
  const polys = g.type === 'Polygon' ? [g.arcs] : g.type === 'MultiPolygon' ? g.arcs : [];
  return polys.map((p) => p.map((r) => ringPath(ring(r))).join('')).join('');
};
let land = '';
for (const g of topo.objects.countries.geometries) {
  if (g.properties.name !== 'Antarctica') land += geomPath(g);
}

// ---- illustrations ---------------------------------------------------------------------------
// The twelve scenes are drawn in artwork.mjs; each story's art: key picks one from these two tables.
const LEAD_ART = { giza, tariffs, hodeida, rastanura };
const SPOT = { nuke, expel, cluster, leak, blast, justice, rubble, bomber };

// ---- stories ----------------------------------------------------------------------------------
// src: the row in design/sources.md; the number printed on chips and pins is the row number. fig: the one figure the
// story leads with. loc: where the pin or dot goes; stories with no single place have none.
const LEAD = [
  { src: 1, art: 'giza', loc: [31.21, 30.1], region: 'Africa', place: 'Giza, Egypt',
    fig: 'At least 30 dead', hd: 'Fuel tanker overturns and burns on Cairo’s ring road; 15 hurt' },
  { src: 2, art: 'tariffs', loc: [-77.04, 38.9], region: 'Americas', place: 'Washington',
    fig: '14 economies', hd: 'US proposes Section 301 tariffs; China capped at 20%' },
  { src: 3, art: 'hodeida', loc: [42.95, 14.8], region: 'Middle East', place: 'Hodeida, Yemen',
    fig: 'Jeddah warned', hd: 'Saudi-led strikes hit Hodeida port; Houthis threaten Saudi ports' },
  { src: 4, art: 'rastanura', loc: [50.16, 26.64], region: 'Middle East', place: 'Ras Tanura',
    fig: '550,000 bpd', hd: 'Houthis claim hit on Saudi Arabia’s largest refinery; smoke seen' },
];
const CARDS = [
  { src: 5, art: 'nuke', loc: [125.75, 39.03], region: 'Asia', place: 'Pyongyang',
    fig: '“Irreversible”', hd: 'Kim inspects nuclear-material sites, calls for tactical nukes' },
  { src: 6, art: 'expel', loc: [125.75, 39.03], region: 'Asia', place: 'Pyongyang',
    fig: '48 hours', hd: 'N Korea expels head of Swiss office over camp sanctions' },
  { src: 7, art: 'cluster', loc: [30.52, 50.45], region: 'Europe', place: 'Kyiv, Ukraine',
    fig: 'Mall hit', hd: 'Russia hits Kyiv with cluster munitions just after agreeing to talks' },
  { src: 8, art: 'leak', loc: [37.62, 55.75], region: 'Europe', place: 'Moscow',
    fig: '~500,000', hd: 'Leak of Russia’s own data: almost 500,000 soldiers killed' },
  { src: 9, art: 'blast', loc: [-91.27, 40.83], region: 'Americas', place: 'Middletown, Iowa',
    fig: '68 drums', hd: 'US Army blows up nearly 5 tons of lead azide; lead-dust warning' },
  { src: 10, art: 'justice', loc: [35.21, 31.77], region: 'Middle East', place: 'Jerusalem',
    fig: '1 of 3 cases', hd: 'Judges urge dropping a Netanyahu case and reconsidering another' },
  { src: 11, art: 'rubble', loc: [34.46, 31.53], region: 'Middle East', place: 'Gaza',
    fig: '533+ cases', hd: 'Gaza meningitis, 4 dead; Shati strike kills a Hamas chief' },
  { src: 12, art: 'bomber', loc: [120.98, 14.6], region: 'Asia', place: 'Manila, Philippines',
    fig: '170 nmi', hd: 'Philippine military tracks a Chinese H-6 bomber off Luzon' },
];
// In row order, so the chip numbers run 13–36 down the columns.
const DIGEST = [
  { src: 13, loc: [20.07, 32.12], region: 'Africa', hd: 'Libya: 2 die after frigate drone raid' },
  { src: 14, loc: [56.25, 26.57], region: 'Middle East', hd: 'Hormuz: IRGC says tanker hit a mine' },
  { src: 15, loc: [44.21, 15.35], region: 'Middle East', hd: 'Yemen: 364,000 displaced since Aug' },
  { src: 16, region: 'World', hd: 'Kushner: territory blocks war’s end' },
  { src: 17, loc: [28.98, 41.01], region: 'Middle East', hd: 'Erdogan wants Ukraine talks in Türkiye' },
  { src: 18, loc: [-66.1, 18.47], region: 'Americas', hd: 'Puerto Rico’s Barreto is Miss Universe' },
  { src: 19, region: 'Asia', hd: 'Pakistan’s first astronaut in orbit' },
  { src: 20, loc: [90.41, 23.81], region: 'Asia', hd: 'Dhaka: garment min. wage up 36%' },
  { src: 21, loc: [-17.45, 14.69], region: 'Africa', hd: 'CAS restores Senegal’s AFCON title' },
  { src: 22, region: 'World', hd: 'Stocks fall as new US tariffs loom' },
  { src: 23, loc: [4.35, 50.85], region: 'Europe', hd: 'EU: Tesla self-drive call on 15 Dec' },
  { src: 24, loc: [35.2, 31.9], region: 'Middle East', hd: 'Palestine: killing of women, girls soars' },
  { src: 25, loc: [50.1, 53.2], region: 'Europe', hd: 'Ukraine drones hit 2 Samara refineries' },
  { src: 26, loc: [34.65, 47.5], region: 'Europe', hd: 'Zaporizhzhia plant off grid, 17th time' },
  { src: 27, loc: [34.55, 49.59], region: 'Europe', hd: 'Poltava gas site halted; 5 regions dark' },
  { src: 28, loc: [21.01, 52.23], region: 'Europe', hd: 'NATO gives Poland an AWACS plane' },
  { src: 29, loc: [77.21, 28.61], region: 'Asia', hd: 'Dalai Lama given a Delhi bungalow' },
  { src: 30, region: 'Asia', hd: 'India at UN: terrorists are using AI' },
  { src: 31, loc: [15.27, -4.32], region: 'Africa', hd: 'Congo reimposes full cobalt ban' },
  { src: 32, loc: [7.49, 9.06], region: 'Africa', hd: 'Nigeria: AI disinformation mars vote' },
  { src: 33, loc: [45.34, 2.05], region: 'Africa', hd: 'Somalia: Baidoa famine risk eases' },
  { src: 34, loc: [6.14, 46.2], region: 'Europe', hd: 'UN: AIDS gains at risk as funding falls' },
  { src: 35, loc: [168.35, -46.41], region: 'Oceania', hd: 'Meridian takes 11.27% of Datagrid' },
  { src: 36, loc: [37.8, 48.0], region: 'Europe', hd: 'Russia nets 39 sq mi in four weeks' },
];
// The number on every chip, pin and dot is the sources.md row, so the page and the source list cannot drift apart.
const ALL = [...LEAD, ...CARDS, ...DIGEST];
ALL.forEach((s) => { s.n = s.src; });
const FEATURED = LEAD.length + CARDS.length;
if (ALL.length !== 36 || ALL.some((s, i) => s.src !== i + 1)) throw new Error('every sources.md row must appear exactly once, in order');
for (const s of ALL) if (!REGION[s.region] && s.region !== 'World') throw new Error('unknown region ' + s.region);
const tally = REGION_ORDER.map((r) => [r, ALL.filter((s) => s.region === r).length]);
const color = (s) => REGION[s.region] ?? WORLD;
const byRow = Object.fromEntries(ALL.map((s) => [s.src, s]));

// ---- map pins ---------------------------------------------------------------------------------
// Featured stories get a numbered pin in their region colour; off:[dx, dy] moves a crowded pin and draws a tick back.
const PIN_OFF = { 1: [-10, 16], 3: [1.3, 6.3], 4: [11, -4], 5: [-8, -5], 6: [12, -3], 7: [-9, -2], 8: [7, -2], 9: [-3, -3],
  2: [1.5, 5], 10: [6, -11], 11: [-15.4, -2.4] };
const PIN = 18, PH = PIN / 2;
const f1 = (v) => +v.toFixed(1);
const geo = { pins: [] };
let dots = '', ticks = '', pins = '';
for (const s of DIGEST) {
  if (!s.loc) continue;
  const [x, y] = px(...s.loc).map(f1);
  dots += `<circle cx="${x}" cy="${y}" r="3.6" fill="${color(s)}" stroke="#fff" stroke-width="1"/>`;
}
for (const s of [...LEAD, ...CARDS]) {
  if (!s.loc) continue;
  const [x, y] = px(...s.loc).map(f1);
  const [dx, dy] = PIN_OFF[s.n] ?? [0, 0];
  const X = f1(x + dx), Y = f1(y + dy);
  if (dx || dy) ticks += `<path d="M${x} ${y}L${X} ${Y}" stroke="${INK}" stroke-width="2"/>`;
  pins += `<g transform="translate(${X} ${Y})"><rect x="${-PH}" y="${-PH}" width="${PIN}" height="${PIN}" rx="4" fill="${color(s)}" stroke="#fff" stroke-width="1.5"/><text class="pn" y="5.5">${s.n}</text></g>`;
  geo.pins.push({ n: s.n, x: X, y: Y });
}

// ---- render -----------------------------------------------------------------------------------
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const num = (s) => `<span class="nb" style="background:${color(s)}"><i>${s.n}</i></span>`;
const kicker = (s) => `<div class="kick">${num(s)}<span class="pc">${esc(s.place)}</span></div>`;

const leads = LEAD.map((s) => `
<article class="lead">${kicker(s)}${LEAD_ART[s.art]()}<div class="fig">${esc(s.fig)}</div><h2 class="hd">${esc(s.hd)}</h2></article>`).join('');
const cards = CARDS.map((s) => `
<article class="card">${kicker(s)}<div class="cb">${SPOT[s.art]()}<div class="tx"><div class="fig2">${esc(s.fig)}</div><h3 class="h3">${esc(s.hd)}</h3></div></div></article>`).join('');
const digest = DIGEST.map((s) => `
<li>${num(s)}<span class="di">${esc(s.hd)}</span></li>`).join('');
const worldN = ALL.filter((s) => s.region === 'World').length;
const legend = [...tally, ...(worldN ? [['World', worldN]] : [])]
  .map(([r, c]) => `<span class="lg"><b style="background:${REGION[r] ?? WORLD}"></b>${r} ${c}</span>`).join('');
const teaser = (row, text) => `<span class="ts">${num(byRow[row])}<span>${esc(text)}</span></span>`;

// Layout checker (CHECK=1 only): measures the laid-out page, writes a JSON report into document.title.
const checker = !process.env.CHECK ? '' : `<script>try{
const out=[],G=${JSON.stringify(geo)},R=${PH};
const html=[...document.querySelectorAll('body *')].filter(e=>!e.closest('svg')&&e.tagName!=='SCRIPT');
const trimmed=(e)=>getComputedStyle(e).textBoxTrim!=='none'||[...e.querySelectorAll('*')].some(c=>getComputedStyle(c).textBoxTrim!=='none');
html.forEach(e=>{if(!e.clientWidth&&!e.clientHeight)return;const cs=getComputedStyle(e),dx=e.scrollWidth-e.clientWidth,dy=cs.overflow!=='visible'&&!trimmed(e)?e.scrollHeight-e.clientHeight:0;if(dx>1||dy>1)out.push('CLIP '+(e.className||e.tagName)+' '+dx+'x'+dy+': '+e.textContent.trim().slice(0,48))});
document.querySelectorAll('.lead,.card,.tx,.map,.also,.legend').forEach(e=>{const r=e.getBoundingClientRect();e.querySelectorAll('*').forEach(c=>{if(c.closest('svg')&&c.tagName!=='svg')return;const q=c.getBoundingClientRect();if(q.height&&(q.bottom>r.bottom+.5||q.right>r.right+.5))out.push('CLIP '+e.className+' child past edge: '+c.textContent.trim().slice(0,40))})});
const lines=(e)=>Math.round(e.getBoundingClientRect().height/parseFloat(getComputedStyle(e).lineHeight));
document.querySelectorAll('.hd').forEach(e=>lines(e)>3&&out.push('CLIP lead headline '+lines(e)+' lines: '+e.textContent));
document.querySelectorAll('.h3').forEach(e=>lines(e)>3&&out.push('CLIP card headline '+lines(e)+' lines: '+e.textContent));
document.querySelectorAll('.di,.fig,.fig2').forEach(e=>lines(e)>1&&out.push('CLIP wraps: '+e.textContent));
const bands=[...document.querySelectorAll('[data-b]')].map(e=>[e.dataset.b,e,e.getBoundingClientRect()]);
bands.forEach(([a,,r],i)=>{bands.slice(i+1).forEach(([b,,q])=>{if(r.bottom>q.top+.5&&q.bottom>r.top+.5)out.push('OVERLAP bands '+a+'/'+b)});if(r.bottom>1024.5||r.right>1024.5)out.push('OFF PAGE '+a)});
const slack=bands.map(([a,e,r])=>{const k=[...e.querySelectorAll('*')].filter(c=>!c.closest('svg')||c.tagName==='svg').reduce((m,c)=>Math.max(m,c.getBoundingClientRect().bottom),0);return a+' '+Math.round(r.bottom-k)});
out.push('band slack: '+slack.join(' | '));
bands.forEach(([a,e,r])=>e.querySelectorAll('*').forEach(c=>{if(c.closest('svg')&&c.tagName!=='svg')return;const q=c.getBoundingClientRect();if(q.bottom>r.bottom+.5)out.push('OFF BAND '+a+' by '+Math.round(q.bottom-r.bottom)+': '+((c.className.baseVal??c.className)||c.tagName)+' '+c.textContent.trim().slice(0,30))}));
const room=(sel)=>{let mn=1e9;document.querySelectorAll(sel).forEach(e=>{const b=e.getBoundingClientRect().bottom,k=[...e.children].reduce((m,c)=>Math.max(m,c.getBoundingClientRect().bottom),0);mn=Math.min(mn,b-k)});return Math.round(mn)};
out.push('inner room (min, px): lead '+room('.lead')+' | card text '+room('.tx')+' | map col '+room('.map')+' | digest col '+room('.also'));
G.pins.forEach((a,i)=>G.pins.slice(i+1).forEach(b=>Math.abs(a.x-b.x)<2*R+1&&Math.abs(a.y-b.y)<2*R+1&&out.push('PINS overlap '+a.n+'/'+b.n)));
G.pins.forEach(p=>(p.x<R||p.y<R||p.x>${MAP_W}-R||p.y>${MAP_H}-R)&&out.push('PIN off map '+p.n));
const sz=new Set();html.forEach(e=>{if([...e.childNodes].some(n=>n.nodeType===3&&n.textContent.trim()))sz.add(parseFloat(getComputedStyle(e).fontSize))});
document.querySelectorAll('svg text').forEach(e=>sz.add(parseFloat(getComputedStyle(e).fontSize)));
const s=[...sz].sort((a,b)=>a-b);out.push('font sizes '+s.join(','));out.push('min font '+s[0]+' px');
out.push(out.some(l=>/^(CLIP|OVERLAP|OFF|PINS|PIN )/.test(l))?'RESULT: problems above':'RESULT: no clipping, no overlap');
document.title=JSON.stringify(out);
}catch(e){document.title=JSON.stringify(['checker error: '+e.message])}</script>`;

const SANS = '"Avenir Next","Helvetica Neue",sans-serif';
const COND = '"Avenir Next Condensed","Avenir Next","Helvetica Neue",sans-serif';
const DATE = '"DIN Condensed","Avenir Next Condensed",sans-serif';
const html = `<!doctype html><html><head><meta charset="utf-8"><title>Thursday 26 November 2026</title><style>
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:1024px;height:1024px;overflow:hidden;background:${PAPER};color:${INK}}
body{position:relative;font:500 16px ${SANS};-webkit-font-smoothing:antialiased}
i{font-style:normal;text-box:trim-both cap alphabetic}
[data-b]{position:absolute;left:${M}px;width:${W - 2 * M}px}
.head{left:0;top:0;width:${W}px;height:${HEAD_H}px;background:${INK};color:${PAPER};padding:13px ${M}px 0;display:flex;flex-direction:column;justify-content:space-between}
.strap{display:flex;justify-content:space-between;font:700 17px/1 ${SANS};letter-spacing:.09em;text-transform:uppercase;color:#E9E3D6}
.strap b{color:#F2A58F;font-weight:800}
h1{font:700 96px/1 ${DATE};white-space:nowrap;padding-bottom:12px;text-box:trim-both cap alphabetic;color:#fff}
.deck{top:${DECK_Y}px;height:${DECK_H}px;display:flex;align-items:stretch;justify-content:space-between;font:700 19px/1 ${SANS};white-space:nowrap}
.ts{display:flex;align-items:center;gap:8px}
.ts>span:last-child{text-box:trim-both cap alphabetic}
.deck .nb{height:${DECK_H}px;min-width:30px;font-size:18px}
.rule{position:absolute;left:${M}px;width:${W - 2 * M}px;top:${RULE_Y}px;height:3px;background:${INK}}
.nb{display:inline-flex;align-items:center;justify-content:center;flex:none;min-width:26px;height:26px;padding:0 4px;color:#fff;font:800 16px/1 ${SANS}}
.kick{display:flex;align-items:center;gap:8px;height:26px;flex:none;border-bottom:3px solid ${INK}}
.pc{flex:1;min-width:0;font:700 15px/1 ${SANS};letter-spacing:.05em;text-transform:uppercase;white-space:nowrap;text-box:trim-both cap alphabetic}
.lead .pc{font-size:16px}
.leads{top:${LEAD_Y}px;height:${LEAD_H}px;display:grid;grid-template-columns:repeat(4,1fr);column-gap:${COL_GAP}px}
.lead,.card{display:flex;flex-direction:column;overflow:hidden;min-width:0}
.lead>svg{display:block;width:100%;height:108px;flex:none;margin-top:6px}
.fig{font:800 34px/38px ${COND};color:${ACC};margin-top:3px;white-space:nowrap;letter-spacing:-.005em}
.hd{font:700 21px/24px ${SANS};letter-spacing:-.012em}
.secs{top:${SEC_Y}px;height:${SEC_H}px;display:grid;grid-template-columns:repeat(4,1fr);grid-template-rows:repeat(2,${SEC_ROW}px);gap:${SEC_GAP}px ${COL_GAP}px}
.cb{display:flex;gap:8px;margin-top:5px;flex:1;min-height:0}
.cb>svg{display:block;width:78px;height:78px;flex:none}
.tx{flex:1;min-width:0;display:flex;flex-direction:column;overflow:hidden}
.fig2{font:800 25px/26px ${COND};color:${ACC};white-space:nowrap;margin-top:-3px}
.h3{font:600 16px/18px ${COND};margin-top:1px}
.low{top:${LOW_Y}px;height:${LOW_H}px;display:grid;grid-template-columns:${MAP_W}px 1fr;column-gap:20px}
.sec{display:flex;align-items:center;height:28px;background:${INK};color:${PAPER};padding:0 9px;font:800 16px/1 ${SANS};letter-spacing:.07em;text-transform:uppercase;white-space:nowrap}
.sec span{text-box:trim-both cap alphabetic}
.map,.also{display:flex;flex-direction:column;min-width:0}
.map svg{display:block;margin-top:6px;flex:none}
.pn{font:800 15px ${SANS};fill:#fff;text-anchor:middle}
.legend{display:grid;grid-template-columns:repeat(2,1fr);row-gap:5px;margin-top:5px;font:700 16px/1 ${SANS}}
.lg{display:flex;align-items:center;gap:6px;white-space:nowrap;text-box:trim-both cap alphabetic}
.lg b{width:14px;height:14px;flex:none;border-radius:3px}
.mnote{font:500 15px/18px ${SANS};color:${MUTE};margin-top:auto}
.digest{list-style:none;display:grid;grid-template-columns:1fr 1fr;grid-auto-flow:column;grid-template-rows:repeat(12,1fr);column-gap:16px;margin-top:4px;flex:1}
.digest li{display:flex;align-items:center;gap:8px;min-width:0}
.digest .nb{min-width:28px;height:20px;font-size:15px}
.di{font:500 16px/19px ${SANS};white-space:nowrap;overflow:hidden;min-width:0}
.foot{left:0;top:${FOOT_Y}px;width:${W}px;height:${FOOT_H}px;background:${INK};color:#E9E3D6;padding:7px ${M}px 0;display:flex;flex-direction:column;gap:4px}
.foot div{white-space:nowrap;overflow:hidden}
.foot .c1{font:600 17px/20px ${SANS};color:#fff}
.foot .c1 b{color:#F2A58F;font-weight:800}
.foot .c2{font:500 15px/18px ${SANS};flex:1}
</style></head><body>
<header class="head" data-b="head"><div class="strap"><span><b>What happened in the world on Thursday</b></span><span>${ALL.length} stories · five continents</span></div>
<h1>THURSDAY 26 NOVEMBER 2026</h1></header>
<div class="deck" data-b="deck">${teaser(1, 'Giza tanker fire: at least 30 dead')}${teaser(2, 'US tariffs on 14 economies')}${teaser(3, 'Saudi strikes hit Hodeida port')}</div>
<div class="rule"></div>
<section class="leads" data-b="leads">${leads}</section>
<section class="secs" data-b="seconds">${cards}</section>
<section class="low" data-b="low">
<div class="map"><div class="sec"><span>Where it happened</span></div>
<svg width="${MAP_W}" height="${MAP_H}" viewBox="0 0 ${MAP_W} ${MAP_H}">
<rect width="${MAP_W}" height="${MAP_H}" fill="#CFDCDF"/><path d="${land}" fill="#E3DBC8" stroke="#FBF8F1" stroke-width=".6"/>
${dots}${ticks}${pins}</svg>
<div class="legend">${legend}</div>
<div class="mnote">Squares ${LEAD[0].n}–${FEATURED} · no dot for ${ALL.filter((s) => !s.loc).map((s) => s.n).join(', ')}</div></div>
<div class="also"><div class="sec"><span>Also on Thursday 26 November 2026</span></div><ol class="digest">${digest}</ol></div>
</section>
<footer class="foot" data-b="foot">
<div class="c1"><b>Thursday 26 November 2026.</b> The day’s world news in ${ALL.length} stories, each traced to a named report.</div>
<div class="c2">Sources: AP, Reuters, Al Jazeera, UN News, ABS-CBN, The Age, Philstar, TRT World, India Today, Anadolu, DW · Map: Natural Earth</div>
</footer>
${checker}
</body></html>`;

writeFileSync(new URL('atlas.html', here), html);
console.log('map', MAP_W + 'x' + MAP_H, 'stories', ALL.length, 'featured', FEATURED, 'pins', geo.pins.length,
  'regions', tally.map(([r, c]) => r + ' ' + c).join(', ') + ', World ' + ALL.filter((s) => s.region === 'World').length);
