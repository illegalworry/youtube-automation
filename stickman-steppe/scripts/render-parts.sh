#!/bin/bash
# Рендер кусками по 140 с: bash scripts/render-parts.sh 0 1 2   (индексы кусков 0..4). Готовые куски пропускаются.
cd "$(dirname "$0")/.."
export GL=${GL:-swangle}
for i in "$@"; do
  f=out/parts/part-$i.mp4
  [ -f "$f" ] && { echo "skip $f"; continue; }
  npm run render -- --test --from $((i*140)) --seconds 140 --concurrency 4 --out "$f.tmp.mp4" && mv "$f.tmp.mp4" "$f" && echo "done $f"
done
