#!/bin/sh
# qork installer (macOS / Linux) — https://qork.me/install
#
# Thin, branded wrapper around the cargo-dist installer published with every
# qork release. Downloads the prebuilt `qork` binary for your platform and
# installs it to ~/.cargo/bin (no Rust toolchain required).
#
#   curl -LsSf https://qork.me/install.sh | sh
#
set -eu

curl --proto '=https' --tlsv1.2 -LsSf \
  https://github.com/QubeTX/qork/releases/latest/download/qork-installer.sh | sh
