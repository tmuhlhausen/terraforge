# TerraForge Platform Expansion

## Current baseline
The repository is a browser-only Three.js prototype. Its entry point imports `js/sim.js`, `js/globe.js`, and `js/ui.js`, but these modules were absent from the tracked tree. The local economy, ownership, collectibles, listings and treasury are demo state only. They are not shared between users, cryptographically scarce, or money movement. A wallet address in Settings is not a payment destination or proof of payment.

## Target architecture
- Experience: responsive globe client, accessible panels, progressive enhancement.
- Domain services: identity, parcel registry, asset metadata, listings, orders, payments, royalties, treasury accounting, moderation and audit.
- Persistence: PostgreSQL source of truth, migrations, immutable ledger, object storage for media/metadata, Redis for rate limits/cache/queues.
- API: authenticated versioned endpoints, schema validation, idempotency keys, pagination, rate limits and request tracing.
- Workers: payment webhook processing, chain indexing, metadata pinning, receipts, listing expiry and reconciliation.
- Observability: structured logs, metrics, traces, error reporting, audit events and alerts.

## NFT strategy
1. Parcels are virtual game-world assets, never real-world land titles.
2. Keep canonical asset records independent of any chain.
3. Add an EVM chain adapter with chain ID allowlists, contract configuration, wallet signature verification, transaction tracking and reorg-safe indexing.
4. Evaluate ERC-721 for unique assets and ERC-1155 for editions after product/legal review.
5. Store media on durable content-addressed storage and version metadata.
6. Never mint based only on a browser claim. Verify ownership, eligibility, payment and idempotency server-side.
7. Define transfer, burn, royalty, recovery and lost-key policies before mainnet.

## Marketplace
Listing lifecycle: draft → active → reserved → sold/cancelled/expired. Verify ownership server-side; reserve inventory atomically; snapshot asset, seller, buyer, price, fees, currency, chain and policy into each order. Use audited contracts or compliant payment providers for settlement. Disclose royalty limitations. Add reporting, takedown, dispute and refund workflows.

## Payments
Use hosted checkout for fiat and a separately audited on-chain payment flow for crypto. The server creates checkout sessions using secret credentials; the browser receives only a short-lived URL. Webhooks verify signatures, deduplicate event IDs, validate amount/currency/order ownership and update the ledger transactionally. Never put secret keys in static JS or Git. Static hosting alone cannot securely implement real payments.

## Security and launch gates
- Wallet signatures use nonce challenges, domain binding, expiry and replay protection.
- Validate input and authorize every parcel, asset, listing and order operation server-side.
- Use integer minor units for fiat and database transactions for checkout/mint/settlement.
- Verify webhook signatures against raw request bodies.
- Keep secrets in deployment environment variables; rotate and audit access.
- Add CSP, HSTS, dependency pinning, SCA and automated tests.
- Threat-model fraud, wash trading, sybil farming, key compromise and chain reorgs.
- Obtain legal/tax review for NFTs, payments, consumer protection, privacy and virtual-asset disclosures.

## Delivery sequence
1. Restore missing client modules and stabilize the local prototype.
2. Add tests, typed domain contracts and accessible UI states.
3. Add API, PostgreSQL schema, auth and audit trail.
4. Integrate hosted fiat checkout in test mode and webhook reconciliation.
5. Add wallet connect, testnet NFT contract and indexer.
6. Add marketplace order and royalty settlement.
7. Load test, security review, legal review, staged launch and monitoring.

## Known limitations
LocalStorage is device-local and user-editable. There is no multi-user sync, authentication, backend persistence, anti-cheat, real payment processor, blockchain contract, wallet signature or NFT mint. The fee ledger is simulated and the configured wallet receives no funds. The globe is stylized, not satellite/geospatial data.