# TerraForge Commercial Release Gates

**Target:** full commercial launch. **Current status:** not release-ready. The repository currently contains a browser-local prototype and a proposed PostgreSQL schema, not a deployed commercial platform.

## Release policy

Production payments, seller payouts, real-money balances, token sales, NFT minting and mainnet transfers remain disabled until the applicable gates below are evidenced by passing tests, independent review and production configuration. A green CI build is necessary, never sufficient, for launch.

## Gate 1: production foundation

- [ ] Choose and provision production hosting, PostgreSQL, object storage, queue/worker infrastructure and managed secrets.
- [ ] Implement and deploy the versioned API; static browser code must not be authoritative for identity, price, ownership or settlement.
- [ ] Add migration tooling, forward/rollback strategy, backup policy and restore drills.
- [ ] Add CI, dependency scanning, secret scanning, test coverage and protected deployment environments.
- [ ] Add structured logs, error reporting, metrics, traces, alert routing and an incident owner.

## Gate 2: identity and trust

- [ ] Select an identity provider and implement verified email, account recovery, session revocation and optional MFA.
- [ ] Add role-based operator access, audit trails and least-privilege service credentials.
- [ ] Add wallet nonce challenges, domain binding, expiry, signature verification and replay protection.
- [ ] Add abuse controls, rate limits, moderation, reporting and account suspension workflows.

## Gate 3: ownership and marketplace

- [ ] Implement server-authoritative parcel and asset ownership with immutable provenance.
- [ ] Implement listing creation, cancellation, expiry and atomic reservation.
- [ ] Prove concurrent checkout cannot sell one listing twice.
- [ ] Add order history, receipts, seller/buyer support, dispute workflows and admin audit events.
- [ ] Publish fee calculations and disclose that parcels are virtual game assets, not real-world property or investment interests.

## Gate 4: payments and accounting

- [ ] Select a payment provider that approves the business model and launch jurisdictions.
- [ ] Complete provider onboarding, business verification and production credentials.
- [ ] Implement hosted checkout, raw-body webhook signature verification, deduplication, idempotency and reconciliation.
- [ ] Implement balanced double-entry journals, settlement controls, refunds, chargebacks, reserves and payout reconciliation.
- [ ] Test duplicate, delayed, out-of-order, failed, refunded and disputed payment events.
- [ ] Obtain qualified legal, tax, privacy and consumer-protection review for every launch region.

## Gate 5: NFTs and digital assets

- [ ] Decide whether NFTs are necessary for the product and define custody, transfer, recovery, royalty and support policies.
- [ ] Threat-model contracts and complete testnet deployment and integration tests.
- [ ] Add key management, transaction monitoring, chain reorganization handling and indexer reconciliation.
- [ ] Obtain an independent smart-contract audit and legal review before enabling mainnet minting or trading.

## Gate 6: operational readiness

- [ ] Complete load, penetration, abuse, failure-mode and disaster-recovery testing.
- [ ] Verify backup restoration, key rotation, incident response and customer-support escalation.
- [ ] Set SLOs, alert thresholds, on-call ownership and rollback procedures.
- [ ] Complete a restricted production pilot and reconcile all money and ownership movements before general availability.

## Decisions and external inputs still required

These cannot be safely inferred from the codebase:

1. Launch jurisdictions and initial customer age policy.
2. Legal operating entity, business verification and tax treatment.
3. Fiat payment provider and supported currencies.
4. Whether crypto checkout is in scope at launch, and which chain(s).
5. Identity provider, hosting provider and production domain.
6. Marketplace fee schedule, refund window, seller payout timing and dispute policy.
7. Custodial versus user-controlled wallet model.

Do not place API keys, wallet private keys, payment secrets or production database credentials in GitHub issues, source files or chat. Provision them directly in the selected provider's secret manager.
