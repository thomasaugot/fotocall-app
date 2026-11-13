#!/usr/bin/env bash
# The whole suite, locally, before any push (12-TESTING_CI). Stops at the first red step.
set -euo pipefail
cd "$(dirname "$0")/.."
step() { printf '\n▶ %s\n' "$1"; }

step "lint";        npm run lint
step "types";       npx tsc -b
step "unit";        npm test
step "unit guard";  node scripts/check-unit-tests.mjs
step "database";    npx supabase status >/dev/null 2>&1 || npx supabase start >/dev/null; npm run test:db
step "e2e (Chrome phone, desktop, iPhone)"; npx playwright test --grep-invert @visual --project=mobile --project=desktop --project=iphone

step "pwa (production build in a throwaway folder)"
OUT=.verify-dist PORT=4175
rm -rf "$OUT"
npx vite build --mode test --outDir "$OUT" --emptyOutDir >/dev/null
node node_modules/vite/bin/vite.js preview --mode test --outDir "$OUT" --port "$PORT" --strictPort >/dev/null 2>&1 &
PREVIEW=$!
trap 'kill $PREVIEW 2>/dev/null; rm -rf "$OUT"' EXIT
for _ in $(seq 1 30); do curl -s -o /dev/null "http://localhost:$PORT" && break; sleep 1; done
PWA_URL="http://localhost:$PORT" npx playwright test e2e/pwa.spec.ts --project=desktop --retries=0

printf '\n✔ everything green: safe to push\n'
