-- Repeatable seed: chart of accounts for the double-entry ledger.
INSERT INTO ledger_accounts (code, account_type, name_key, is_active) VALUES
  ('ESCROW','LIABILITY','ledger.escrow',1),
  ('CLIENT_WALLET','LIABILITY','ledger.client_wallet',1),
  ('CARRIER_WALLET','LIABILITY','ledger.carrier_wallet',1),
  ('COD_RECEIVABLE','ASSET','ledger.cod_receivable',1),
  ('PAYOUT_CLEARING','LIABILITY','ledger.payout_clearing',1),
  ('PLATFORM_REVENUE','REVENUE','ledger.platform_revenue',1),
  ('BROKER_MARGIN','LIABILITY','ledger.broker_margin',1),
  ('TAX_PAYABLE','LIABILITY','ledger.tax_payable',1),
  ('REFUNDS','EXPENSE','ledger.refunds',1),
  ('PAYMENT_FEES','EXPENSE','ledger.payment_fees',1),
  ('PROMO_DISCOUNTS','EXPENSE','ledger.promo_discounts',1),
  ('SUBSCRIPTION_REVENUE','REVENUE','ledger.subscription_revenue',1),
  ('CASH_IN_TRANSIT','ASSET','ledger.cash_in_transit',1),
  ('ADJUSTMENTS','EXPENSE','ledger.adjustments',1)
ON DUPLICATE KEY UPDATE account_type=VALUES(account_type), name_key=VALUES(name_key);
