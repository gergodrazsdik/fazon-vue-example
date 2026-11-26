#!/bin/sh
# ADAPTER-003: the framework's packages, the reusable workflow and the verifier image name the
# same framework commit (https://github.com/gergodrazsdik/fazon/blob/main/docs/spec/adapter-boundary.md#consuming-the-framework-before-m5).
#
# - The packages: `fazon` and every `@fazon/*` dependency in package.json, and every `@fazon/*`
#   override in pnpm-workspace.yaml, as `github:gergodrazsdik/fazon#<sha>&path:packages/<name>`
#   or, until those install, `file:.fazon-framework/<sha>/packages/<name>` (scripts/framework.sh).
# - The workflow: every `gergodrazsdik/fazon/.github/workflows/<file>@<sha>` in .github/workflows.
# - The image: `image` in fazon.yaml must be the digest GHCR gives for
#   ghcr.io/gergodrazsdik/fazon-verifier:sha-<sha>, the image the framework's CI built from it.
#
# Needs curl and jq, and network access to ghcr.io.
# Usage: scripts/check-framework-pin.sh
set -eu

cd "$(dirname "$0")/.."

repository=gergodrazsdik/fazon-verifier
failed=0
fail() {
  echo "  FAIL  $*" >&2
  failed=1
}

# The commit a package reference names, or nothing when it has neither form.
commit_of() {
  printf '%s\n' "$1" | sed -n \
    -e 's|^github:gergodrazsdik/fazon#\([0-9a-f]\{40\}\)&path:packages/[a-z-]*$|\1|p' \
    -e 's|^file:\.fazon-framework/\([0-9a-f]\{40\}\)/packages/[a-z-]*$|\1|p'
}

expected=$(commit_of "$(jq -r '.devDependencies.fazon // .dependencies.fazon // ""' package.json)")
if [ -z "$expected" ]; then
  echo "error: package.json has no fazon dependency on a framework commit." >&2
  exit 1
fi
echo "The framework commit: $expected (from the fazon dependency)"

echo "Packages:"
references=$(
  jq -r '[.dependencies, .devDependencies] | map(to_entries[]?) | .[]
    | select(.key == "fazon" or (.key | startswith("@fazon/"))) | "package.json \(.key) \(.value)"' package.json
  # Overrides: `"@fazon/<name>": "<reference>"` lines, quoted or not.
  sed -n 's|^[[:space:]]*"\{0,1\}\(@fazon/[a-z-]*\)"\{0,1\}:[[:space:]]*"\{0,1\}\([^"[:space:]]*\)"\{0,1\}[[:space:]]*$|pnpm-workspace.yaml \1 \2|p' \
    pnpm-workspace.yaml
)
while read -r file name reference; do
  if [ "$(commit_of "$reference")" = "$expected" ]; then
    echo "  ok    $file: $name"
  else
    fail "$file: $name is '$reference', not the framework at $expected"
  fi
done <<EOF
$references
EOF

echo "Workflow references:"
uses=$(grep -rhoE 'gergodrazsdik/fazon/\.github/workflows/[^@[:space:]]+@[^[:space:]"#]+' .github/workflows || true)
if [ -z "$uses" ]; then
  echo "  -     none yet (the reusable verify.yml arrives with the framework's M1 step 9)"
fi
for use in $uses; do
  if [ "${use##*@}" = "$expected" ]; then
    echo "  ok    $use"
  else
    fail "$use doesn't name $expected"
  fi
done

echo "Verifier image:"
image=$(sed -n 's/^image:[[:space:]]*\([^[:space:]#]*\).*$/\1/p' fazon.yaml)
pinned=${image##*@}
if [ "${image%@*}" != "ghcr.io/$repository" ] || ! printf '%s\n' "$pinned" | grep -Eq '^sha256:[0-9a-f]{64}$'; then
  fail "fazon.yaml: image '$image' isn't ghcr.io/$repository by digest"
else
  token=$(curl -fsS "https://ghcr.io/token?scope=repository:$repository:pull" | jq -r .token)
  built=$(
    curl -fsSI \
      -H "Authorization: Bearer $token" \
      -H "Accept: application/vnd.oci.image.index.v1+json" \
      -H "Accept: application/vnd.oci.image.manifest.v1+json" \
      -H "Accept: application/vnd.docker.distribution.manifest.list.v2+json" \
      -H "Accept: application/vnd.docker.distribution.manifest.v2+json" \
      "https://ghcr.io/v2/$repository/manifests/sha-$expected" |
      tr -d '\r' | tr '[:upper:]' '[:lower:]' | sed -n 's/^docker-content-digest:[[:space:]]*//p'
  ) || built=""
  if [ -z "$built" ]; then
    fail "GHCR has no image ghcr.io/$repository:sha-$expected"
  elif [ "$built" = "$pinned" ]; then
    echo "  ok    fazon.yaml: image is ghcr.io/$repository:sha-$expected ($pinned)"
  else
    fail "fazon.yaml: image is $pinned, but ghcr.io/$repository:sha-$expected is $built"
  fi
fi

if [ "$failed" -ne 0 ]; then
  echo "The framework references don't name one commit (ADAPTER-003). Move them together." >&2
  exit 1
fi
echo "All framework references name $expected."
