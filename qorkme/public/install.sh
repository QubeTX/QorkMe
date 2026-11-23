#!/bin/sh
# Install the prebuilt qork CLI for macOS or Linux.
# curl -LsSf https://qork.me/install.sh | sh
set -eu

# Download completely before running so a failed or interrupted transfer fails
# the installation and never executes a partial script.
installer=$(mktemp)
trap 'rm -f "$installer"' EXIT
curl --proto '=https' --tlsv1.2 -fLsS \
  https://github.com/QubeTX/qork/releases/latest/download/qork-installer.sh \
  -o "$installer"
sh "$installer" "$@"
