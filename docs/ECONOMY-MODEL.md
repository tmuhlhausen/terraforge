# TerraForge Economy & Marketplace Model

## Product promise

TerraForge is a persistent virtual world. Users may acquire virtual parcels, develop them, create digital collectibles, and trade eligible assets. These are digital game assets, not real-world land, securities, guaranteed investments or claims on physical property.

## Marketplace revenue

TerraForge earns a disclosed platform fee on completed sales. The fee is calculated server-side at order creation and recorded as a separate ledger allocation.

Recommended launch policy:
- Start with a configurable **5% platform fee** on completed secondary-market sales.
- Show buyer total, seller proceeds and platform fee before checkout.
- Do not charge a listing fee during the early liquidity-building phase.
- Make fee changes prospective, versioned and visible. Never silently change an existing order.
- Support refunds and disputes through explicit ledger reversals, never by editing historical ledger entries.

The 5% value is a proposed product default, not a live charge or legal/tax recommendation.

## Asset lifecycle

```text
Created -> Owned -> Listed -> Reserved -> Sold
                 \-> Cancelled
Owned -> Burned (explicit, irreversible confirmation)
```

An asset can have only one active or reserved listing. Listing and checkout must verify current ownership in a database transaction. On settlement, ownership changes atomically with the order and ledger journal.

## Virtual land

- Parcels are unique coordinates inside a named virtual world.
- Parcel ownership is an in-game entitlement. It does not convey physical property rights.
- A parcel may have one current owner.
- Development levels, resource yields and cosmetic traits are game state and must be server-authoritative.
- Any parcel sale must use the same order, payment and ownership-transfer pipeline as other assets.

## NFTs and portability

Use an EVM-compatible chain only after the off-chain product, custody model, legal review and threat model are settled. The database remains the operational source for listings and order workflow; chain events are reconciled as evidence of token state.

Recommended design:
- ERC-721 for unique parcels and one-of-one collectibles.
- ERC-1155 for editions, consumables or semi-fungible items.
- Content-addressed metadata and media storage with pinned availability.
- Mint intents bind an asset ID, recipient, chain ID, contract and metadata digest.
- Verify wallet control with a nonce-based signature challenge. A connected address alone is not proof of ownership.
- Index transfer events and reconcile reorgs/finality before updating user-facing ownership.
- Keep contract admin roles behind multisig and timelocks where appropriate; obtain an independent audit before mainnet funds.

Do not promise cross-chain support until bridging, replay protection and recovery policy are implemented.

## Payments

Start with hosted fiat checkout to reduce PCI scope. Add wallet-based crypto payments only after chain, token, network, confirmation and refund policies are selected. Do not hold customer funds or build an internal stored-value wallet without specialist legal/compliance review.

For every payment:
- Bind the provider session to a server-created order.
- Verify signed webhooks using the unmodified raw request body.
- Deduplicate events and reconcile amount, currency, order ID and provider reference.
- Use integer minor units and immutable double-entry journals.
- Handle asynchronous success, failure, expiry, refund and dispute events.
- Keep test and live credentials fully separate.

## Trust and safety

- Clear asset descriptions, rarity methodology and provenance.
- Report, block, moderation and takedown workflows.
- Rate limits and anti-bot protections for claims and listings.
- Suspicious trading, wash-trading and account-takeover monitoring.
- Transparent refund, dispute, fee and asset-delivery policies.
- Privacy controls, data export/deletion process and retention schedule.

## Growth loops

1. Explore: discover biomes, landmarks and community-built locations.
2. Own: claim or purchase a parcel with clear provenance.
3. Build: add upgrades and visual identity.
4. Create: forge collectible items with deterministic metadata.
5. Trade: list, discover, purchase and resell with visible fee breakdown.
6. Participate: seasonal quests, creator collections and community events.

Avoid pay-to-win yield multipliers and artificial scarcity claims. Keep gameplay progression useful for non-paying users.
