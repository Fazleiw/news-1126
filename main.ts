// Entry for news-image-20261126: one 1024x1024 front page of the world news of Thursday 26 November 2026.
// The picture is drawn ahead of time by design/build.mjs + design/render.sh and committed as entry.png; this program
// checks that the file is what the gate accepts, then delivers it to /output (or MAKEFUN_OUTPUT_DIR when testing:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts).
// Standard library only, and plain JavaScript syntax so it runs under Node 22 with or without type stripping.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const SIDE = 1024;
const MAX_BYTES = 1024 * 1024;
const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

function fail(message) {
  console.error('entry: ' + message);
  process.exit(1);
}

// CRC-32 (ISO 3309, as PNG uses it), table-driven, so every chunk can be checked without zlib.
const CRC_TABLE = new Uint32Array(256).map((_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
function crc32(bytes) {
  let c = 0xffffffff;
  for (const b of bytes) c = CRC_TABLE[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

// Walks the chunk list: IHDR first, every CRC correct, IDAT present, IEND last with nothing after it.
function inspect(png) {
  if (png.length > MAX_BYTES) fail(`entry.png is ${png.length} bytes; the limit is ${MAX_BYTES}`);
  if (!png.subarray(0, 8).equals(PNG_SIGNATURE)) fail('entry.png does not start with the PNG signature');
  const seen = [];
  let at = 8, header = null;
  while (at < png.length) {
    if (at + 12 > png.length) fail(`truncated chunk header at byte ${at}`);
    const size = png.readUInt32BE(at), type = png.toString('latin1', at + 4, at + 8), end = at + 12 + size;
    if (end > png.length) fail(`chunk ${type} at byte ${at} runs past the end of the file`);
    if (crc32(png.subarray(at + 4, at + 8 + size)) !== png.readUInt32BE(at + 8 + size)) fail(`bad CRC in chunk ${type} at byte ${at}`);
    if (seen.length === 0) {
      if (type !== 'IHDR') fail('first chunk is ' + type + ', not IHDR');
      header = { width: png.readUInt32BE(at + 8), height: png.readUInt32BE(at + 12), depth: png[at + 16], colour: png[at + 17] };
    }
    seen.push(type);
    at = end;
    if (type === 'IEND') break;
  }
  if (seen.at(-1) !== 'IEND') fail('no IEND chunk');
  if (at !== png.length) fail(`${png.length - at} stray bytes after IEND`);
  if (!seen.includes('IDAT')) fail('no image data (IDAT)');
  if (header.width !== SIDE || header.height !== SIDE) fail(`entry.png is ${header.width}x${header.height}, expected ${SIDE}x${SIDE}`);
  if (header.depth !== 8 || ![2, 6].includes(header.colour)) fail(`unexpected pixel format: depth ${header.depth}, colour type ${header.colour}`);
  return { ...header, chunks: seen.length };
}

const png = readFileSync(new URL('./entry.png', import.meta.url));
const { width, height, chunks } = inspect(png);

// The judge sees exactly the bytes delivered, so read them back and compare before reporting success.
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const target = join(outDir, 'entry.png');
mkdirSync(outDir, { recursive: true });
writeFileSync(target, png);
if (!readFileSync(target).equals(png)) fail(`${target} does not match entry.png after writing`);
console.log(`entry: delivered ${target}: ${width}x${height} PNG, ${png.length} bytes, ${chunks} chunks, CRCs verified`);
