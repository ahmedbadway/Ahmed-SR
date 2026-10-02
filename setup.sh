#!/bin/bash
# Ahmed Badway: setup script for Claude Code Web.
# CLAUDE.md is committed to the repo, so nothing is fetched here.

echo "Setting up project..."

if [ -f "package.json" ]; then
  echo "Installing packages..."
  # --include=dev: the cloud environment sets NODE_ENV=production, which
  # would otherwise skip Vite, Tailwind, ESLint, and Playwright.
  npm ci --include=dev
  echo "Dependencies ready"
else
  echo "No package.json: Claude Code will scaffold first"
fi

echo ""
echo "Setup complete."
echo "Run E2E tests: npm run test:e2e"
