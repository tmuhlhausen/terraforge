-- Structural smoke tests for migration 001. Run after applying the migration.
BEGIN;

DO $$
DECLARE
  required_tables text[] := ARRAY[
    'users','user_wallets','parcels','parcel_ownership','assets','listings',
    'orders','payments','webhook_events','ledger_accounts','ledger_journals',
    'ledger_entries','idempotency_records'
  ];
  table_name text;
BEGIN
  FOREACH table_name IN ARRAY required_tables LOOP
    IF to_regclass('public.' || table_name) IS NULL THEN
      RAISE EXCEPTION 'Required TerraForge table is missing: %', table_name;
    END IF;
  END LOOP;

  IF to_regclass('public.one_current_owner_per_parcel') IS NULL THEN
    RAISE EXCEPTION 'Current parcel ownership uniqueness index is missing';
  END IF;
  IF to_regclass('public.one_open_listing_per_asset') IS NULL THEN
    RAISE EXCEPTION 'Open listing uniqueness index is missing';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'ledger_entries_no_mutation'
      AND NOT tgisinternal
  ) THEN
    RAISE EXCEPTION 'Append-only ledger trigger is missing';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'ledger_journal_must_balance'
      AND NOT tgisinternal
  ) THEN
    RAISE EXCEPTION 'Deferred balanced-journal trigger is missing';
  END IF;
END
$$;

ROLLBACK;
