#!/bin/sh
# Conventional Commits checks for commit messages and pull request titles.
# Usage:
#   scripts/check-commit-msg.sh <commit-message-file>
#     The commit-msg hook (lefthook): the header of the commit being made.
#   scripts/check-commit-msg.sh --title <pull-request-title>
#     CI (the pr-title job): a squash merge uses the title as the commit header.
#   scripts/check-commit-msg.sh --range [--warn] <base-sha> <head-sha>
#     The header of every non-merge commit in <base>..<head>, which a rebase
#     merge lands on main as they are. With --warn, problems are reported as
#     GitHub warning annotations and the check passes, so a squash merge,
#     which replaces those headers with the title, isn't blocked.
set -eu

types='build|chore|ci|docs|feat|fix|perf|refactor|revert|style|test'

is_conventional() {
  printf '%s\n' "$1" | grep -Eq "^($types)(\([a-z0-9._/-]+\))?!?: [^ ].*"
}

# Prints an error and fails when <header> isn't a Conventional Commits header.
check_header() {
  if is_conventional "$1"; then
    return 0
  fi
  cat >&2 <<EOF
error: not a Conventional Commits header:
  $1
Use '<type>[(scope)][!]: <summary>', with type one of:
  ${types}
Example: docs(spec): describe the story matrix rules
EOF
  return 1
}

case ${1:-} in
  --title)
    if [ "$#" -ne 2 ]; then
      echo "usage: $0 --title <pull-request-title>" >&2
      exit 2
    fi
    check_header "$2"
    echo "ok: $2"
    exit 0
    ;;
  --range)
    shift
    warn=false
    if [ "${1:-}" = --warn ]; then
      warn=true
      shift
    fi
    if [ "$#" -ne 2 ]; then
      echo "usage: $0 --range [--warn] <base-sha> <head-sha>" >&2
      exit 2
    fi
    failed=0
    count=0
    # Listed first, so that a bad revision fails the check (set -e) instead of checking nothing.
    shas=$(git rev-list --no-merges "$1..$2")
    for sha in $shas; do
      count=$((count + 1))
      header=$(git log -1 --format='%s' "$sha")
      problem=
      case $header in
        "fixup! "* | "squash! "* | "amend! "*) problem="squash it before a rebase merge (git rebase --autosquash)" ;;
        *) is_conventional "$header" || problem="not a Conventional Commits header" ;;
      esac
      if [ -z "$problem" ]; then
        echo "ok      $sha $header"
      else
        failed=1
        echo "PROBLEM $sha $header: $problem"
        if [ "$warn" = true ]; then
          echo "::warning title=Commit header::$sha \"$header\": $problem. A rebase merge would land it on main as it is; a squash merge uses the PR title instead."
        fi
      fi
    done
    echo "checked $count commit(s)"
    if [ "$failed" -ne 0 ] && [ "$warn" = false ]; then
      exit 1
    fi
    exit 0
    ;;
  -*)
    echo "unknown option: $1" >&2
    exit 2
    ;;
esac

if [ "$#" -ne 1 ]; then
  echo "usage: $0 <commit-message-file>" >&2
  exit 2
fi

# Ignore comment lines that git strips later.
header=$(grep -v '^#' "$1" | sed -n '1p' || true)

case $header in
  "Merge "* | "fixup! "* | "squash! "* | "amend! "*)
    # Generated or temporary messages: squashed away before merge.
    exit 0
    ;;
  "Revert \""*)
    cat >&2 <<EOF
error: git revert's header isn't a Conventional Commits header:
  $header
Write it as 'revert: <the reverted commit's header>'.
EOF
    exit 1
    ;;
esac

check_header "$header"
