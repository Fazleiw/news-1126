# Status — news-image-20261126 (Thursday 26 November 2026)

Gate: `CHECK=1 node design/build.mjs && bash design/render.sh && bash design/check.sh`

| Check | Result |
|---|---|
| CLIP / OFF BAND / OVERLAP / OFF PAGE / PINS | none |
| Band slack (px) | head 0 · deck 0 · anchors 0 · leads 0 · seconds 0 · low 0 · foot 0 |
| Inner room (min, px) | lead 0 · card text 3 · map col 0 · digest col 0 |
| Reading font sizes (px) | 15, 16, 17, 18, 19, 21, 25, 34, 96 — min 15 |
| Label font | 11 px: status chips and source credits only (the one exception to the 15 px floor) |
| Deterministic | two builds of `design/atlas.html`: `cmp` identical (sha1 add341970f389c830020e6ffa01e1e903596da75) |
| `entry.png` | 1024 × 1024, 387,353 bytes (limit 1,048,576), CRCs verified by `main.ts` |
| Stories | 36: 4 leads (rows 1–4), 8 cards (5–12), 24 briefs (13–36); chip number = sources.md row |
| Status chips | on all 12 leads and cards, from the row's code: CONFIRMED 5 (1, 2, 4, 8, 12) · REPORTED 5 (3, 5, 9, 10, 11) · CLAIM 1 (6) · ONGOING 1 (7) |
| Map | 12 numbered pins, 22 dots; 20 and 33 have no single place and no dot |
| Legend | Europe 11, Middle East 7, Asia 6, Africa 5, Americas 4, Oceania 1, World 2 = 36 |

## Layout changes in pass 3

- New `anchors` band (y 162, 46 px) under the deck: Thanksgiving parade postponed (row 1), 26/11 eighteen years (row 2), chess Game 3 at 15:00 CET (row 7).
- Leads band moved to y 223 and shrank 256 → 205 px: scenes 108 → 86 px tall (viewBox 236 × 92), headlines 3 → 2 lines. The seconds band and everything below are unchanged.
- Each lead and card kicker carries its status chip; the source credit sits in the bottom-right corner of its picture (the kicker is too narrow for place + chip + source).
- The checker reports reading-text and label font sizes separately.
