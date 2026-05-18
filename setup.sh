#!/bin/bash
set -e

# ──────────────────────────────────────────────
#  Command Center Lite — macOS Setup Script
#
#  SECURE USAGE (recommended):
#    git clone https://github.com/karthikkaiplody/command-center-lite.git ~/command-center-lite
#    cat ~/command-center-lite/setup.sh   # review before running
#    bash ~/command-center-lite/setup.sh
#
#  This builds a native .app and opens the DMG installer.
#  After installing, launch from Spotlight or Launchpad — no terminal needed.
# ──────────────────────────────────────────────

REPO_URL="https://github.com/karthikkaiplody/command-center-lite.git"
INSTALL_DIR="$HOME/command-center-lite"
MIN_NODE_VERSION=18

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

info()  { echo -e "${GREEN}▸ $1${NC}"; }
warn()  { echo -e "${YELLOW}⚠  $1${NC}"; }
error() { echo -e "${RED}✗  $1${NC}" >&2; exit 1; }
step()  { echo ""; echo -e "${GREEN}── $1 ──${NC}"; }

echo ""
echo "  ╔═══════════════════════════════╗"
echo "  ║     Command Center Lite       ║"
echo "  ╚═══════════════════════════════╝"
echo ""

# ── Security reminder ─────────────────────────
# If you piped this script directly from the internet, stop.
# Always download and inspect scripts before running them.
# See SECURE USAGE at the top of this file.

# ── Check: macOS ──────────────────────────────
if [[ "$OSTYPE" != "darwin"* ]]; then
  error "This script is for macOS only. For other platforms, see the README."
fi

# ── Check: Homebrew ───────────────────────────
step "Checking prerequisites"

if ! command -v brew &>/dev/null; then
  warn "Homebrew not found."
  echo "  Install it from https://brew.sh, then re-run this script."
  echo "  Or install Node.js manually from https://nodejs.org (v${MIN_NODE_VERSION}+)."
  exit 1
fi
info "Homebrew found"

# ── Check/install: Node.js ────────────────────
if command -v node &>/dev/null; then
  NODE_MAJOR=$(node --version | sed 's/v//' | cut -d'.' -f1)
  if [ "$NODE_MAJOR" -ge "$MIN_NODE_VERSION" ]; then
    info "Node.js $(node --version) found"
  else
    warn "Node.js $(node --version) is too old (need v${MIN_NODE_VERSION}+). Upgrading via Homebrew..."
    brew upgrade node || brew install node
  fi
else
  info "Node.js not found — installing via Homebrew..."
  brew install node
fi

# ── Check: git ────────────────────────────────
if ! command -v git &>/dev/null; then
  info "git not found — installing via Homebrew..."
  brew install git
fi
info "git found"

# ── Clone or update repo ──────────────────────
step "Setting up repository"

# If the script is running from inside the cloned repo already, use that directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [ -f "$SCRIPT_DIR/package.json" ] && grep -q '"name": "command-center-lite"' "$SCRIPT_DIR/package.json" 2>/dev/null; then
  info "Running from existing repo at $SCRIPT_DIR"
  cd "$SCRIPT_DIR"
elif [ -d "$INSTALL_DIR/.git" ]; then
  info "Found existing install at $INSTALL_DIR — pulling latest..."
  git -C "$INSTALL_DIR" pull --ff-only
  cd "$INSTALL_DIR"
else
  info "Cloning repository to $INSTALL_DIR..."
  git clone "$REPO_URL" "$INSTALL_DIR"
  cd "$INSTALL_DIR"
fi

# ── Install dependencies ──────────────────────
step "Installing dependencies"
info "Running npm install (this may take a minute)..."
npm install

# ── Build the app ─────────────────────────────
step "Building Command Center.app"
info "Compiling and packaging (this takes ~2 minutes)..."
npm run build:electron

# ── Open the installer ────────────────────────
step "Installing"

DMG=$(ls release/*.dmg 2>/dev/null | head -1)
if [ -n "$DMG" ]; then
  info "Opening installer: $DMG"
  open "$DMG"
  echo ""
  echo -e "${GREEN}  ✓ Build complete!${NC}"
  echo ""
  echo "  ┌─────────────────────────────────────────────┐"
  echo "  │  Drag 'Command Center' → Applications        │"
  echo "  │  Then launch from Spotlight (⌘Space)         │"
  echo "  │                                              │"
  echo "  │  On first launch, set your name in the       │"
  echo "  │  settings screen — no config files needed.   │"
  echo "  └─────────────────────────────────────────────┘"
  echo ""
else
  warn "DMG not found in release/. Falling back to dev mode..."
  npm run dev:electron
fi
