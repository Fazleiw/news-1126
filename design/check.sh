#!/bin/sh
# Layout check: builds the page with the checker on and prints its report (collisions, overflow, min font size).
cd "$(dirname "$0")/.."
CHECK=1 node design/build.mjs >/dev/null
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --disable-gpu --virtual-time-budget=2000 \
  --window-size=1024,1024 --dump-dom "file://$PWD/design/atlas.html" 2>/dev/null \
  | sed -n 's:.*<title>\(.*\)</title>.*:\1:p' | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{const t=s.replace(/&quot;/g,"\"").replace(/&amp;/g,"&");JSON.parse(t).forEach(l=>console.log(l))})'
node design/build.mjs >/dev/null
