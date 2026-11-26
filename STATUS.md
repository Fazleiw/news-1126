# Status — news-image-20261126 (Thursday 26 November 2026)

Gate: `CHECK=1 node design/build.mjs && bash design/render.sh && bash design/check.sh`

| Check | Result |
|---|---|
| CLIP / OFF BAND / OVERLAP / OFF PAGE / PINS | none |
| Band slack (px) | head 0 · deck 0 · leads 0 · seconds 0 · low 0 · foot 0 |
| Inner room (min, px) | lead 3 · card text 3 · map col 0 · digest col 0 |
| Font sizes (px) | 15, 16, 17, 18, 19, 21, 25, 34, 96 |
| Min font | 15 px |
| Deterministic | two builds of `design/atlas.html`: `cmp` identical (sha1 2e51387174801be706c07a089884884d190bc32f) |
| `entry.png` | 1024 × 1024, 368,251 bytes (limit 1,048,576), CRCs verified by `main.ts` |
| Stories | 36: 4 leads (rows 1–4), 8 cards (5–12), 24 briefs (13–36); chip number = sources.md row |
| Map | 12 numbered pins, 20 dots; 16, 19, 22, 30 have no single place and no dot |
| Legend | Europe 9, Middle East 8, Asia 7, Africa 6, Americas 3, Oceania 1, World 2 = 36 |

## Engine changes from the 25 November renderer

- Map crop widened to 104°W–174°E, 63°N–50°S (map 304 × 140, was 304 × 135) so Middletown, Iowa (9) and Southland, NZ (35) are on it.
- `ringPath` unwraps rings that cross the antimeridian; with the crop now reaching 174°E, Fiji drew a sliver across the whole map.
- Chip/pin numbers are the sources.md row (`n = src`) and the build asserts rows 1–36 each appear once, in order; the digest is in row order, not grouped by region.
- Digest dots skip stories with no place; the map note lists them.
