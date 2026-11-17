# TerraForge Platform API Contract

Status: design contract for the next backend implementation. These routes are **not live** in the browser prototype.

## Principles

- Version all public routes under `/api/v1`.
- Authenticate users with short-lived sessions; never trust a client-supplied owner ID.
- Derive the acting user from the verified session on every private route.
- Use UUID resource IDs, pagination cursors, request validation, rate limits and structured errors.
- Require an `Idempotency-Key` on every money-moving or state-changing checkout operation.
- Store prices as integer minor units plus an ISO-4217 currency code. Never use floating-point money.
- Treat payment provider webhooks and chain events as untrusted until signatures and event state are verified.
- Use database transactions and row locks for listing reservation, order settlement and ownership transfer.

## Core routes

| Method | Route | Purpose | Access |
|---|---|---|---|
| GET | `/worlds/:worldId/parcels` | Cursor-paginated parcel map data | Public |
| GET | `/parcels/:parcelId` | Parcel detail and current ownership | Public |
| POST | `/parcels/:parcelId/claim` | Claim an unowned game parcel | Session |
| GET | `/me` | Current account profile and balances | Session |
| GET | `/me/assets` | Owned assets | Session |
| POST | `/assets` | Create a collectible from an eligible parcel | Session |
| GET | `/market/listings` | Search active listings | Public |
| POST | `/market/listings` | List an owned asset | Session |
| POST | `/market/listings/:listingId/cancel` | Cancel an active listing | Seller |
| POST | `/market/listings/:listingId/checkout` | Reserve listing and create order | Buyer |
| GET | `/orders/:orderId` | Order status and receipt | Buyer or seller |
| POST | `/payments/:paymentId/refund` | Request eligible refund | Operator / policy |
| POST | `/webhooks/:provider` | Verified provider webhook receiver | Provider signature |
| POST | `/wallets/challenge` | Create one-time wallet nonce | Session |
| POST | `/wallets/verify` | Verify signed wallet challenge | Session |
| POST | `/nft/mint-intents` | Create eligible mint intent | Session |
| POST | `/chain/events` | Process indexed chain events | Internal signer |

## Listing checkout lifecycle

1. Buyer submits checkout with an idempotency key.
2. Server starts a database transaction and locks the listing row with `SELECT ... FOR UPDATE`.
3. Server verifies listing is active, not expired, seller still owns the asset, and buyer is not seller.
4. Server calculates fees from server-controlled policy and creates an order plus a short-lived listing reservation.
5. Server creates a hosted checkout session with the selected payment provider.
6. Provider webhook is signature-verified against the raw request body, deduplicated by provider event ID, and reconciled against the expected amount, currency, order and provider payment ID.
7. In one database transaction, settlement writes a balanced ledger journal, marks the order paid/settled, marks the listing sold and transfers the asset ownership.
8. Failed or expired checkout releases the reservation. Reconciliation jobs repair delayed or missed webhook state.

Never mark an order paid based on a browser redirect or client callback.

## Error envelope

```json
{
  "error": {
    "code": "LISTING_UNAVAILABLE",
    "message": "This listing is no longer available.",
    "requestId": "req_..."
  }
}
```

Validation errors may include a field map. Do not return stack traces, secrets, provider payloads or internal database details to clients.

## Pagination

Use opaque cursor pagination, not offset pagination, for public discovery feeds. Stable sort order is `created_at DESC, id DESC`. Return `data` and `nextCursor`.

## Security requirements

- CSRF protection for cookie-authenticated mutations; secure, HttpOnly, SameSite cookies.
- Strict CORS allowlist, security headers, request body limits and per-route rate limits.
- Validate all input at the API boundary and enforce ownership in SQL transactions.
- Never accept price, fee, seller, payment status, wallet verification or chain confirmation as authoritative client fields.
- Keep secrets server-side. Redact authorization headers, wallet signatures and payment details from logs.
- Add audit events for admin actions, ownership transfers, refunds and policy changes.
- Require manual review and a documented incident procedure before production funds or NFTs are enabled.
