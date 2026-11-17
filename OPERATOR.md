# TerraForge — Operator Guide

## Run the prototype
```bash
python3 -m http.server 8765
```
Open http://localhost:8765. The current client loads Three.js from the configured CDN import map.

## Current mode: local simulation
- Parcel state and collectible records are stored in this browser.
- The treasury setting validates and saves an EVM address locally.
- Fee accounting is simulated and does not transfer funds.
- Collectibles are not minted on a blockchain.
- Marketplace listings are not shared or purchasable by other users.
- Clearing browser storage can erase local progress.

## Production operations are not enabled
Do not accept customer payments or describe the fee ledger as revenue. Production requires the backend, database, identity, payment provider, verified webhook processing and chain infrastructure described in PLATFORM-EXPANSION.md and PAYMENTS-NFT-IMPLEMENTATION.md.

## Deployment
Static hosting is suitable for the current prototype only. Keep the repository private in accordance with its license. Use separate preview and production environments when backend services are introduced.
