#!/bin/bash
set -e

# Clean up stale X11 lock files (can happen on Windows Docker Desktop)
rm -f /tmp/.X99-lock /tmp/.X11-unix/X99

# Start virtual framebuffer on display :99
Xvfb :99 -screen 0 1280x800x24 &
sleep 1

export DISPLAY=:99


# Which workspace to build & test. Baked into the image via the Dockerfile's
# ENV WORKSPACE=... ; can be overridden at `docker run` time with -e WORKSPACE.
: "${WORKSPACE:?WORKSPACE env var is required}"

# Build has to run here (not in the webServer) as workerd requires runtime
# networking. Build only the target workspace.
npm run build -w "$WORKSPACE"

# $@: ensures args like --update-snapshots are forwarded
exec npx playwright test -c "packages/$WORKSPACE/playwright.config.ts" "$@"
