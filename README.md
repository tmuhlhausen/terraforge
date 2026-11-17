# TerraForge

**Proprietary virtual-world platform · Browser prototype · Expansion branch**

TerraForge is a stylized virtual Earth where players explore parcels, develop locations and create collectible assets. Parcels represent virtual game-world items only. They are not real-world land, property rights or investment products.

## Run locally

Requires an internet connection for the Three.js module and web fonts.

```bash
python3 -m http.server 8765
# open http://localhost:8765
```

## Current prototype capabilities

- Three.js globe with generated parcel markers
- Local parcel claiming, upgrading and maintenance
- Local collectible forge and marketplace listing records
- Local treasury address configuration and simulated fee ledger
- Browser-local save state

**Prototype boundary:** state is stored in localStorage and can be edited by the user. It is not shared between users. Collectibles are not on-chain NFTs. Listings do not settle trades. The treasury address does not receive funds. No real payment provider or blockchain integration is active.

## Platform expansion

See [PLATFORM-EXPANSION.md](PLATFORM-EXPANSION.md) for the scalable architecture, product roadmap and security gates. See [PAYMENTS-NFT-IMPLEMENTATION.md](PAYMENTS-NFT-IMPLEMENTATION.md) for the server-side integration contract.

## Production requirements

Real monetization requires authenticated APIs, a database, transactional order/ledger processing, a hosted checkout provider, verified webhooks, and independently audited smart contracts before enabling real NFT minting or crypto settlement. Never put provider secrets or private keys in browser code.

## Legal and licensing

This repository is proprietary. See [LICENSE](LICENSE) and [LEGAL.md](LEGAL.md). Virtual parcels are not real-world land. Obtain legal, tax, privacy and consumer-protection advice before public monetization.
