#!/bin/sh
# One seeded failure per check: for each case, a throwaway copy of the committed tree (HEAD) gets
# one defect, `fazon verify` runs on it in the verifier image, and the case passes when the run
# fails with the rule the defect breaks. The framework's M1 exit criterion: one seeded failure per
# check fails the build.
#
# The copies live in .fazon/seeded/<case>/ (gitignored), inside the repository so the verifier
# image's one read-only mount holds them and the installed dependencies; their node_modules link
# to the repository's packages, without its tool caches. Each copy is removed after its case,
# unless FAZON_SEEDED_KEEP=1.
#
# Needs the dependencies installed (`just install`), git, jq, and a container runtime
# (FAZON_CONTAINER_RUNTIME picks docker or podman, as for fazon). Takes about a minute per case.
#
# Usage: scripts/seeded-failures.sh [<case>...]
#   Cases: types generated lint test package a11y tokens layout visual, one per check (the
#   default), and focus, which shows that the focus-visible stories are really focused: their focus
#   ring from another role token fails the spec's token rule for the focus-visible state.
set -eu

root=$(cd "$(dirname "$0")/.." && pwd)
cd "$root"

default_cases="types generated lint test package a11y tokens layout visual"
all_cases="$default_cases focus"
cases=${*:-$default_cases}

# The check and rule each case's defect must fail with.
expected_rule() {
  case "$1" in
    types) echo build/types ;;
    generated) echo build/generated ;;
    lint) echo lint/raw-value ;;
    test) echo test/behaviour ;;
    package) echo package/styles ;;
    a11y) echo a11y/spec-aria ;;
    tokens) echo tokens/raw-value ;;
    layout) echo layout/clipped-text ;;
    visual) echo visual/changed ;;
    focus) echo tokens/token-rule ;;
    *) return 1 ;;
  esac
}

for name in $cases; do
  if ! expected_rule "$name" >/dev/null; then
    echo "seeded-failures: unknown case '$name'; the cases are: $all_cases" >&2
    exit 2
  fi
done

if [ ! -f node_modules/fazon/package.json ]; then
  echo "seeded-failures: the dependencies aren't installed; run 'just install' first" >&2
  exit 2
fi
fazon_bin="node_modules/fazon/$(jq -r '.bin | if type == "string" then . else .fazon end' node_modules/fazon/package.json)"

# Replaces the one occurrence of a literal text in a file; fails when it isn't there exactly once.
# shellcheck disable=SC2016  # JavaScript, not shell: node reads its arguments
replace() {
  node -e '
    const fs = require("node:fs");
    const [file, from, to] = process.argv.slice(1);
    const text = fs.readFileSync(file, "utf8");
    const count = text.split(from).length - 1;
    if (count !== 1) {
      console.error(`seeded-failures: ${file} has ${count} occurrences of the text to replace, not 1: ${from}`);
      process.exit(1);
    }
    fs.writeFileSync(file, text.replace(from, () => to));
  ' "$1" "$2" "$3"
}

component=src/components/button

# Seeds one defect into the copy in the current directory.
seed() {
  case "$1" in
    types)
      # A string where the type says number.
      printf 'export const seededSize: number = "md";\n' >"$component/seeded.ts"
      ;;
    generated)
      # A hand edit to a file `fazon sync` generates.
      printf '// A hand edit.\n' >>"$component/generated/button.contract.test.ts"
      ;;
    lint)
      # A raw colour in the component's styles, on a selector no story matches.
      replace "$component/Button.vue" '</style>' '.label[data-seeded] {
  border-color: #2050d0;
}
</style>'
      ;;
    test)
      # A behaviour test that expects one click too many.
      replace "$component/Button.test.ts" 'toHaveLength(3)' 'toHaveLength(4)'
      ;;
    package)
      # The stylesheet left out of the exports map.
      replace package.json '    "./style.css": "./dist/style.css",
' ''
      ;;
    a11y)
      # The aria-disabled the spec lists, no longer set while loading.
      replace "$component/Button.vue" "    :aria-disabled=\"props.loading ? 'true' : undefined\"
" ''
      ;;
    tokens)
      # A raw colour from a stylesheet outside the component, which the lint check doesn't read.
      printf '\n[data-part="Button"] {\n  text-decoration-color: #2050d0;\n}\n' >>src/style.css
      ;;
    layout)
      # The small buttons' labels cut off with an ellipsis.
      replace "$component/Button.vue" '</style>' '[data-size="sm"] .label {
  max-inline-size: 4ch;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>'
      ;;
    focus)
      # The focus ring in the primary action colour, not the focus ring colour the spec names.
      replace "$component/Button.vue" 'outline-color: var(--fz-color-focus-ring);' 'outline-color: var(--fz-color-action-primary);'
      ;;
    visual)
      # The label one pixel lower.
      replace "$component/Button.vue" '</style>' '.label {
  transform: translateY(1px);
}
</style>'
      ;;
  esac
}

# A copy of HEAD with node_modules linking to the repository's packages (relative links, so they
# resolve in the image's mount too), without its caches, which the image can't write to.
make_copy() {
  rm -rf "$1"
  mkdir -p "$1/node_modules"
  git archive --format=tar HEAD | tar -x -C "$1"
  for entry in node_modules/* node_modules/.bin node_modules/.pnpm node_modules/.modules.yaml; do
    [ -e "$entry" ] || continue
    ln -s "../../../../$entry" "$1/$entry"
  done
}

failed=0
summary=""
for name in $cases; do
  expected=$(expected_rule "$name")
  copy=".fazon/seeded/$name"
  echo "== $name: expects $expected" >&2
  make_copy "$copy"
  (cd "$copy" && seed "$name")

  status=0
  (cd "$copy" && node "$root/$fazon_bin" verify --no-judge --json) >"$copy.json" || status=$?
  run=$(jq -r '.result.run // empty' "$copy.json")
  record="$copy/.fazon/runs/$run/run.json"
  if [ -z "$run" ] || [ ! -f "$record" ]; then
    echo "seeded-failures: $name: fazon verify gave no run record (exit $status):" >&2
    jq -r '.messages[]?.text' "$copy.json" >&2 || cat "$copy.json" >&2
    exit 3
  fi
  rules=$(jq -r '[.verification.checks[]? | .findings[] | select(.blocking) | "\(.check)/\(.rule)"] | unique | join(" ")' "$record")
  run_status=$(jq -r .status "$record")
  if [ "$status" -eq 1 ] && [ "$run_status" = failed ] && printf ' %s ' "$rules" | grep -q " $expected "; then
    result=ok
  else
    result=FAIL
    failed=1
  fi
  line=$(printf '%-5s %-10s expected %-20s exit %s, run %s; blocking rules: %s' \
    "$result" "$name" "$expected" "$status" "$run_status" "${rules:-none}")
  echo "$line" >&2
  summary="$summary$line
"
  if [ "${FAZON_SEEDED_KEEP:-0}" != 1 ]; then
    rm -rf "$copy" "$copy.json"
  fi
done

printf '\nSeeded failures:\n%s' "$summary"
if [ "$failed" -ne 0 ]; then
  echo "A seeded defect didn't fail fazon verify with its rule." >&2
  exit 1
fi
echo "Every seeded defect failed fazon verify with its rule."
