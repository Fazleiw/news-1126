// make.fun news-image-20261126 — delivers the Thursday 26 November 2026 front page.
//
// design/render.sh screenshots design/atlas.html to design/shot.png; this script gates that file and copies it to
// $MAKEFUN_OUTPUT_DIR/entry.png (default /output/entry.png). Node built-ins only, and no TypeScript-only syntax,
// so it runs on Node 22 whether or not type stripping is enabled.
//
//   rm -rf out && MAKEFUN_OUTPUT_DIR=out node main.ts

import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const SOURCE = path.join(ROOT, 'design', 'shot.png');
const DEST_DIR = process.env.MAKEFUN_OUTPUT_DIR || '/output';
const DEST = path.join(DEST_DIR, 'entry.png');

const EXPECTED_SIDE = 1024;
const BYTE_CAP = 1048576;
const MAGIC = [137, 80, 78, 71, 13, 10, 26, 10];

function reject(reason) {
  console.error(`[main] rejected: ${reason}`);
  process.exit(1);
}

// Standard CRC-32 (reflected polynomial 0xEDB88320), the checksum PNG stores after every chunk.
const crcTable = [];
for (let n = 0; n < 256; n++) {
  let v = n;
  for (let bit = 0; bit < 8; bit++) v = (v & 1) ? (v >>> 1) ^ 0xedb88320 : v >>> 1;
  crcTable.push(v >>> 0);
}
function crc(buf, from, to) {
  let v = 0xffffffff;
  for (let i = from; i < to; i++) v = crcTable[(v ^ buf[i]) & 0xff] ^ (v >>> 8);
  return (v ^ 0xffffffff) >>> 0;
}

// Throws nothing; calls reject() on the first problem. Returns the IHDR size when every check passes.
function validate(buf) {
  if (buf.length > BYTE_CAP) reject(`${buf.length} bytes exceeds the ${BYTE_CAP}-byte cap`);
  if (buf.length < MAGIC.length || MAGIC.some((b, i) => buf[i] !== b)) reject('missing PNG signature');

  let width = 0, height = 0, pos = MAGIC.length, count = 0, sawEnd = false;
  while (pos < buf.length && !sawEnd) {
    if (pos + 8 > buf.length) reject(`chunk header cut off at offset ${pos}`);
    const len = buf.readUInt32BE(pos);
    const name = buf.toString('ascii', pos + 4, pos + 8);
    const dataStart = pos + 8, dataEnd = dataStart + len;
    if (dataEnd + 4 > buf.length) reject(`chunk "${name}" at offset ${pos} overruns the file`);

    const stored = buf.readUInt32BE(dataEnd);
    const actual = crc(buf, pos + 4, dataEnd);
    if (stored !== actual) reject(`chunk "${name}" at offset ${pos}: CRC ${stored.toString(16)} != computed ${actual.toString(16)}`);

    if (count === 0) {
      if (name !== 'IHDR' || len < 8) reject(`first chunk must be IHDR, found "${name}"`);
      width = buf.readUInt32BE(dataStart);
      height = buf.readUInt32BE(dataStart + 4);
    }
    sawEnd = name === 'IEND';
    count++;
    pos = dataEnd + 4;
  }
  if (!sawEnd) reject('file ends without an IEND chunk');
  if (width !== EXPECTED_SIDE || height !== EXPECTED_SIDE) reject(`IHDR says ${width}x${height}, need ${EXPECTED_SIDE}x${EXPECTED_SIDE}`);
  return { width, height, count };
}

if (!fs.existsSync(SOURCE)) reject(`${path.relative(ROOT, SOURCE)} not found; run design/render.sh first`);
const { width, height, count } = validate(fs.readFileSync(SOURCE));

fs.mkdirSync(DEST_DIR, { recursive: true });
fs.copyFileSync(SOURCE, DEST);

// Check the copy, not just the source: the judge sees whatever landed in the output directory.
const landed = fs.readFileSync(DEST);
if (!landed.equals(fs.readFileSync(SOURCE))) reject(`${DEST} differs from ${SOURCE} after copying`);
validate(landed);
console.log(`[main] ok: ${DEST} is ${width}x${height}, ${landed.length} bytes (${count} chunks, all CRCs match)`);
