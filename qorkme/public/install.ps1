# qork installer (Windows, PowerShell) — https://qork.me/install
#
# Thin, branded wrapper around the cargo-dist PowerShell installer published
# with every qork release. Downloads the prebuilt qork.exe and installs it to
# %USERPROFILE%\.cargo\bin (no Rust toolchain required).
#
#   irm https://qork.me/install.ps1 | iex
#
$ErrorActionPreference = 'Stop'

irm https://github.com/QubeTX/qork/releases/latest/download/qork-installer.ps1 | iex
