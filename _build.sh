#!/usr/bin/env bash
# Tiny generator: renders pages from _pages/*.body using _template.html.
# Each .body file declares the title and description on the first two lines,
# then the page body HTML.
set -euo pipefail
cd "$(dirname "$0")"
TEMPLATE="$(cat _template.html)"
for f in _pages/*.body; do
  name="$(basename "$f" .body)"
  title="$(sed -n '1p' "$f")"
  desc="$(sed -n '2p' "$f")"
  body="$(tail -n +3 "$f")"
  out="$TEMPLATE"
  out="${out//\{\{TITLE\}\}/$title}"
  out="${out//\{\{DESC\}\}/$desc}"
  printf '%s' "${out%\{\{BODY\}\}*}" > "$name.html"
  printf '%s' "$body" >> "$name.html"
  printf '%s' "${out#*\{\{BODY\}\}}" >> "$name.html"
done
echo "Built $(ls _pages/*.body | wc -l) pages"
