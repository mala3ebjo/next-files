#!/bin/bash
# Renders every screen in manifest.json to PNG via headless Chrome.
set -e
GEN_DIR="$(cd "$(dirname "$0")" && pwd)"
OUT_DIR="$(cd "$GEN_DIR/.." && pwd)"
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

node "$GEN_DIR/generate.js"

count=$(node -e "console.log(require('$GEN_DIR/manifest.json').length)")
echo "Rendering $count screens…"

node -e "
const m=require('$GEN_DIR/manifest.json');
m.forEach(x=>console.log([x.file,x.w,x.h,x.scale,x.out].join('|')));
" | while IFS='|' read -r file w h scale out; do
  buf=$((h + 140))
  mkdir -p "$OUT_DIR/$(dirname "$out")"
  "$CHROME" --headless=new --disable-gpu --hide-scrollbars \
    --force-device-scale-factor="$scale" --window-size="$w,$buf" \
    --default-background-color=00000000 \
    --screenshot="$OUT_DIR/$out" "file://$OUT_DIR/$file" >/dev/null 2>&1
  # Chrome reserves bottom space in headless screenshots; we render tall then crop to exact size from the top.
  python3 - "$OUT_DIR/$out" "$w" "$h" "$scale" <<'PY'
import sys
from PIL import Image
path, w, h, scale = sys.argv[1], int(sys.argv[2]), int(sys.argv[3]), int(sys.argv[4])
im = Image.open(path)
tw, th = w*scale, h*scale
im = im.crop((0, 0, tw, th))
im.save(path)
PY
  echo "  ✓ $out"
done
echo "Done → $OUT_DIR"
