# TerraForge — Deployment Guide

## Prototype deployment
The current branch is a static browser prototype. Run locally:

```bash
python3 -m http.server 8765
```

For a static preview, deploy the repository root to Netlify, Cloudflare Pages, Vercel or another static host. No build command is required. The client imports Three.js from the CDN configured in index.html, so the browser needs network access.

## Files expected
- index.html
- css/main.css
- js/app.js
- js/config.js
- js/sim.js
- js/globe.js
- js/ui.js

## Important production warning
Static deployment does not enable authentication, multi-user persistence, payment processing, NFT minting or real marketplace settlement. Do not enable real-money sales from this prototype. Follow PLATFORM-EXPANSION.md and PAYMENTS-NFT-IMPLEMENTATION.md before connecting production payment or blockchain services.

## Hosting hygiene
Keep the source repository private under its proprietary license. Use environment variables for future server secrets; never put secrets in static JavaScript. Configure HTTPS, security headers, CSP, preview environments and monitoring before a public launch.
