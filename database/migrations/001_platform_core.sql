-- TerraForge platform core schema (PostgreSQL 15+)
-- Apply with a migration runner. Never edit an applied migration; add a new one.
BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS citext;

CREATE TYPE account_status AS ENUM ('pending','active','suspended','closed');
CREATE TYPE asset_status AS ENUM ('draft','owned','listed','burned');
CREATE TYPE listing_status AS ENUM ('active','reserved','sold','cancelled','expired');
CREATE TYPE order_status AS ENUM ('pending','awaiting_payment','paid','settled','cancelled','refunded','disputed');
CREATE TYPE payment_status AS ENUM ('created','requires_action','processing','succeeded','failed','cancelled','refunded');
CREATE TYPE ledger_side AS ENUM ('debit','credit');

CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email citext UNIQUE,
  handle citext NOT NULL UNIQUE,
  display_name text NOT NULL,
  status account_status NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (length(handle::text) BETWEEN 3 AND 32)
);

CREATE TABLE user_wallets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  chain_id bigint NOT NULL,
  address text NOT NULL,
  is_primary boolean NOT NULL DEFAULT false,
  verified_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(chain_id,address),
  UNIQUE(user_id,chain_id,address),
  CHECK (address ~ '^0x[0-9a-fA-F]{40}$')
);
CREATE UNIQUE INDEX one_primary_wallet_per_chain ON user_wallets(user_id,chain_id) WHERE is_primary;

CREATE TABLE parcels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  world_id text NOT NULL DEFAULT 'terraforge-earth',
  grid_x integer NOT NULL,
  grid_y integer NOT NULL,
  biome text NOT NULL,
  rarity smallint NOT NULL DEFAULT 1 CHECK (rarity BETWEEN 1 AND 5),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(world_id,grid_x,grid_y)
);

CREATE TABLE parcel_ownership (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parcel_id uuid NOT NULL REFERENCES parcels(id) ON DELETE RESTRICT,
  owner_user_id uuid NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  acquired_at timestamptz NOT NULL DEFAULT now(),
  released_at timestamptz,
  source_order_id uuid,
  CHECK (released_at IS NULL OR released_at >= acquired_at)
);
CREATE UNIQUE INDEX one_current_owner_per_parcel ON parcel_ownership(parcel_id) WHERE released_at IS NULL;
CREATE INDEX parcel_ownership_user_current ON parcel_ownership(owner_user_id) WHERE released_at IS NULL;

CREATE TABLE assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_user_id uuid NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  owner_user_id uuid NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  parcel_id uuid REFERENCES parcels(id) ON DELETE RESTRICT,
  asset_type text NOT NULL,
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  status asset_status NOT NULL DEFAULT 'owned',
  metadata_uri text,
  metadata_digest text,
  chain_id bigint,
  contract_address text,
  token_id numeric(78,0),
  minted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK ((chain_id IS NULL AND contract_address IS NULL AND token_id IS NULL AND minted_at IS NULL)
      OR (chain_id IS NOT NULL AND contract_address ~ '^0x[0-9a-fA-F]{40}$' AND token_id IS NOT NULL)),
  UNIQUE(chain_id,contract_address,token_id)
);
CREATE INDEX assets_owner_created ON assets(owner_user_id,created_at DESC);
CREATE INDEX assets_parcel ON assets(parcel_id) WHERE parcel_id IS NOT NULL;

CREATE TABLE listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id uuid NOT NULL REFERENCES assets(id) ON DELETE RESTRICT,
  seller_user_id uuid NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  price_minor bigint NOT NULL CHECK (price_minor > 0),
  currency char(3) NOT NULL,
  status listing_status NOT NULL DEFAULT 'active',
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (currency ~ '^[A-Z]{3}$'),
  CHECK (expires_at IS NULL OR expires_at > created_at)
);
CREATE UNIQUE INDEX one_open_listing_per_asset ON listings(asset_id) WHERE status IN ('active','reserved');
CREATE INDEX listings_discovery ON listings(status,created_at DESC) WHERE status='active';
CREATE INDEX listings_seller ON listings(seller_user_id,created_at DESC);

CREATE TABLE orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid NOT NULL REFERENCES listings(id) ON DELETE RESTRICT,
  buyer_user_id uuid NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  seller_user_id uuid NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  status order_status NOT NULL DEFAULT 'pending',
  subtotal_minor bigint NOT NULL CHECK (subtotal_minor > 0),
  platform_fee_minor bigint NOT NULL DEFAULT 0 CHECK (platform_fee_minor >= 0),
  seller_proceeds_minor bigint NOT NULL CHECK (seller_proceeds_minor >= 0),
  currency char(3) NOT NULL CHECK (currency ~ '^[A-Z]{3}$'),
  idempotency_key text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (subtotal_minor = platform_fee_minor + seller_proceeds_minor),
  CHECK (buyer_user_id <> seller_user_id)
);
CREATE INDEX orders_buyer_history ON orders(buyer_user_id,created_at DESC);
CREATE INDEX orders_seller_history ON orders(seller_user_id,created_at DESC);

CREATE TABLE payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE RESTRICT,
  provider text NOT NULL,
  provider_payment_id text,
  status payment_status NOT NULL DEFAULT 'created',
  amount_minor bigint NOT NULL CHECK (amount_minor > 0),
  currency char(3) NOT NULL CHECK (currency ~ '^[A-Z]{3}$'),
  checkout_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(provider,provider_payment_id)
);
CREATE INDEX payments_order ON payments(order_id,created_at DESC);

CREATE TABLE webhook_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider text NOT NULL,
  provider_event_id text NOT NULL,
  event_type text NOT NULL,
  payload_digest text NOT NULL,
  received_at timestamptz NOT NULL DEFAULT now(),
  processed_at timestamptz,
  processing_error text,
  UNIQUE(provider,provider_event_id)
);

-- Double-entry accounting. Amounts are integer minor units; every journal must net to zero.
CREATE TABLE ledger_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id uuid REFERENCES users(id) ON DELETE RESTRICT,
  code text NOT NULL,
  currency char(3) NOT NULL CHECK (currency ~ '^[A-Z]{3}$'),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(owner_user_id,code,currency)
);
CREATE TABLE ledger_journals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE RESTRICT,
  external_reference text UNIQUE,
  description text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE ledger_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  journal_id uuid NOT NULL REFERENCES ledger_journals(id) ON DELETE RESTRICT,
  account_id uuid NOT NULL REFERENCES ledger_accounts(id) ON DELETE RESTRICT,
  side ledger_side NOT NULL,
  amount_minor bigint NOT NULL CHECK (amount_minor > 0),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX ledger_entries_journal ON ledger_entries(journal_id);
CREATE INDEX ledger_entries_account ON ledger_entries(account_id,created_at DESC);

CREATE FUNCTION terraforge_assert_balanced_journal() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE jid uuid; debits numeric; credits numeric;
BEGIN
  jid := COALESCE(NEW.journal_id, OLD.journal_id);
  SELECT COALESCE(sum(amount_minor) FILTER (WHERE side='debit'),0),
         COALESCE(sum(amount_minor) FILTER (WHERE side='credit'),0)
    INTO debits,credits FROM ledger_entries WHERE journal_id=jid;
  IF debits <> credits THEN
    RAISE EXCEPTION 'Unbalanced TerraForge journal %: debits %, credits %',jid,debits,credits;
  END IF;
  RETURN NULL;
END $$;
CREATE CONSTRAINT TRIGGER ledger_journal_must_balance
AFTER INSERT ON ledger_entries
DEFERRABLE INITIALLY DEFERRED
FOR EACH ROW EXECUTE FUNCTION terraforge_assert_balanced_journal();

-- Idempotency records protect retries across checkout/order creation.
CREATE TABLE idempotency_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scope text NOT NULL,
  idempotency_key text NOT NULL,
  request_digest text NOT NULL,
  response_status integer,
  response_body jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL,
  UNIQUE(scope,idempotency_key)
);
CREATE INDEX idempotency_expiry ON idempotency_records(expires_at);

-- Ledger entries are append-only. Corrections use compensating journals.
CREATE FUNCTION terraforge_ledger_entries_immutable() RETURNS trigger LANGUAGE plpgsql AS $
BEGIN
  RAISE EXCEPTION 'Ledger entries are immutable; post a compensating journal instead.';
END $;
CREATE TRIGGER ledger_entries_no_mutation
BEFORE UPDATE OR DELETE ON ledger_entries
FOR EACH ROW EXECUTE FUNCTION terraforge_ledger_entries_immutable();

COMMIT;
