# Payments and NFT Integration Contract

The static client must not pretend a browser balance or localStorage entry is a payment, NFT, or ownership proof.

## Fiat checkout API
`POST /api/v1/checkout/sessions`

Request: `{ "orderId": "opaque-id", "returnUrl": "https://your-verified-origin/..." }`.

Server requirements: authenticate buyer; load order from database; recalculate amount, tax, currency and fees from trusted records; verify order and inventory; create hosted checkout with server-held provider secret; attach internal order ID and idempotency key; return only provider checkout URL and session ID.

Webhook requirements: verify signature using raw body; persist provider event ID under unique constraint; validate session, order, amount, currency and status; update payment, order and ledger in one transaction; handle duplicate, delayed, out-of-order, refund and dispute events. A browser redirect is never proof of payment.

## Crypto checkout
Use chain-specific order intent with chain ID, token/contract, amount, recipient, expiry and unique nonce. Verify finalized transfers server-side, account for token decimals and reorgs, and reconcile under/overpayments. Wallet connection alone is not payment.

## NFT minting
Use EIP-1193 wallet connection only after user gesture. Authenticate wallet with a server-issued nonce. Mint authorization is server-issued and one-time; contract enforces supply and eligibility. Persist transaction hash, chain ID, contract address and token ID. Wait for confirmations and index transfer events. Use stable content-addressed metadata URIs and schema versions.

## Server environment checklist
- `PAYMENT_PROVIDER_SECRET_KEY`
- `PAYMENT_WEBHOOK_SECRET`
- `DATABASE_URL`
- `APP_ORIGIN`
- `NFT_CHAIN_ID`
- `NFT_CONTRACT_ADDRESS`
- `RPC_URL`
- `METADATA_STORAGE_TOKEN`

Never commit real values. Use deployment environment variables and separate test/production projects.