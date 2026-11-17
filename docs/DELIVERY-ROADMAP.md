# TerraForge Delivery Roadmap

This roadmap separates prototype work from production dependencies. A checkbox is complete only when implemented, tested and reviewed.

## Track A: foundation
- [x] Restore the missing browser modules and establish a local parcel/collectible/marketplace simulation.
- [x] Document the production boundary and server-side integration requirements.
- [x] Define a relational model for users, wallets, parcels, ownership, assets, listings, orders, payments, webhooks and double-entry accounting.
- [x] Define API lifecycle and trust boundaries.
- [ ] Add migration runner and automated PostgreSQL migration tests.
- [ ] Add API service, request validation, auth/session and observability.
- [ ] Add integration tests for concurrent listing checkout and idempotency.

## Track B: accounts and persistent world
- [ ] Email verification, account recovery, sessions and optional MFA.
- [ ] Wallet challenge and signature verification.
- [ ] Server-authoritative parcel ownership and development.
- [ ] Inventory, asset provenance and audit log.
- [ ] Moderation, reporting and account safety controls.

## Track C: marketplace and payments
- [ ] Listing creation, cancellation, expiry and search.
- [ ] Atomic checkout reservation and order creation.
- [ ] Hosted fiat checkout in provider test mode.
- [ ] Signed webhook processing, replay protection and reconciliation.
- [ ] Balanced ledger posting, refunds, disputes and receipts.
- [ ] Fee policy controls and transparent buyer/seller breakdown.

## Track D: NFTs and creator economy
- [ ] Contract specification and threat model.
- [ ] ERC-721 unique assets and ERC-1155 editions, if justified.
- [ ] Testnet mint/burn/transfer with indexer and reorg handling.
- [ ] Metadata pinning, provenance and creator royalties policy.
- [ ] Independent smart-contract audit before mainnet.

## Track E: scale and live operations
- [ ] Redis-backed rate limits, queues and cache where justified.
- [ ] Background workers for webhook retries, indexing and reconciliation.
- [ ] CDN-backed media, object storage and content moderation.
- [ ] Load, abuse, disaster-recovery and security testing.
- [ ] SLOs, alerting, backups, incident response and operational runbooks.
- [ ] Legal, tax, privacy, consumer-protection and payments review for launch regions.

## Release gates

No production checkout until payment webhook tests, idempotency, ledger balancing, refund paths and operational alerts pass.

No mainnet minting or trading until wallet verification, contract review, metadata availability, indexer reconciliation, key management and legal review pass.

No public marketplace launch until ownership transfer is atomic, concurrent checkout is safe, disputes/moderation exist and the fee/refund policy is published.
