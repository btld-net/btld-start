FROM node:25-slim

WORKDIR /app

# Install Xvfb for virtual framebuffer (needed for headed browser in Docker)
RUN apt-get update && apt-get install -y --no-install-recommends xvfb \
    && rm -rf /var/lib/apt/lists/*

# Which workspace package to test, e.g. "site-rueberg". Baked into the image
# so each workspace gets its own image tag + GHA cache slot. Passed by the
# runner via --build-arg WORKSPACE=...; also exported as ENV for the entrypoint.
ARG WORKSPACE
ENV WORKSPACE=$WORKSPACE

# Copy package files first for better Docker layer caching
COPY package.json package-lock.json ./
COPY packages/$WORKSPACE/package.json packages/$WORKSPACE/package.json

RUN npm install
# Playwright has to run after install
RUN npx playwright install --with-deps chromium

# Force Node's DNS to resolve "localhost" to 127.0.0.1 (IPv4) first.
# The @astrojs/cloudflare prerenderer starts an internal preview server on
# host "localhost" and then fetches itself via `http://localhost:<port>`.
# On Node 25 without this flag, the fetch may resolve to ::1 (IPv6) while
# the server is only listening on 127.0.0.1 — causing ECONNREFUSED.
ENV NODE_OPTIONS=--dns-result-order=ipv4first
ENV WRANGLER_SEND_METRICS=false
ENV ASTRO_TELEMETRY_DISABLED=1

# Copy source code (node_modules excluded via .dockerignore)
COPY . .

RUN chmod +x .github/testing/playwright.entrypoint.sh

ENTRYPOINT [".github/testing/playwright.entrypoint.sh"]
