-- =============================================================================
-- V8 — Wallets, double-entry ledger, payments, COD, payouts
-- Every movement is two balanced entries. Every balance is reconstructable.
-- =============================================================================

CREATE TABLE wallets (
  id             BIGINT      NOT NULL AUTO_INCREMENT,
  owner_type     VARCHAR(16) NOT NULL COMMENT 'CLIENT, CARRIER, ORGANIZATION, PLATFORM',
  owner_id       BIGINT      NOT NULL,
  currency_code  CHAR(3)     NOT NULL,
  balance_minor  BIGINT      NOT NULL DEFAULT 0,
  held_minor     BIGINT      NOT NULL DEFAULT 0,
  created_at     DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at     DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  version        INT         NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  UNIQUE KEY uq_wallet_owner (owner_type, owner_id, currency_code),
  CONSTRAINT fk_wallet_currency FOREIGN KEY (currency_code) REFERENCES currencies (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE wallet_transactions (
  id                 BIGINT       NOT NULL AUTO_INCREMENT,
  wallet_id          BIGINT       NOT NULL,
  tx_type            VARCHAR(24)  NOT NULL
                     COMMENT 'TOPUP, ORDER_PAYMENT, ORDER_EARNING, COMMISSION, REFUND, PAYOUT, ADJUSTMENT, SUBSCRIPTION, COD_SETTLEMENT',
  amount_minor       BIGINT       NOT NULL COMMENT 'Signed. Negative is a debit.',
  balance_after_minor BIGINT      NOT NULL,
  currency_code      CHAR(3)      NOT NULL,
  description_key    VARCHAR(120) NULL,
  order_id           BIGINT       NULL,
  reference_type     VARCHAR(32)  NULL,
  reference_id       BIGINT       NULL,
  created_at         DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  KEY ix_wtx_wallet (wallet_id, created_at),
  KEY ix_wtx_order (order_id),
  CONSTRAINT fk_wtx_wallet FOREIGN KEY (wallet_id) REFERENCES wallets (id),
  CONSTRAINT fk_wtx_order  FOREIGN KEY (order_id)  REFERENCES orders (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE ledger_accounts (
  id           BIGINT      NOT NULL AUTO_INCREMENT,
  code         VARCHAR(40) NOT NULL,
  account_type VARCHAR(16) NOT NULL COMMENT 'ASSET, LIABILITY, REVENUE, EXPENSE, EQUITY',
  name_key     VARCHAR(120) NOT NULL,
  is_active    TINYINT(1)  NOT NULL DEFAULT 1,
  PRIMARY KEY (id),
  UNIQUE KEY uq_ledger_account_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE ledger_entries (
  id              BIGINT      NOT NULL AUTO_INCREMENT,
  transaction_ref CHAR(36)    NOT NULL COMMENT 'Groups the balanced entries of one transaction',
  account_id      BIGINT      NOT NULL,
  debit_minor     BIGINT      NOT NULL DEFAULT 0,
  credit_minor    BIGINT      NOT NULL DEFAULT 0,
  currency_code   CHAR(3)     NOT NULL,
  owner_type      VARCHAR(16) NULL,
  owner_id        BIGINT      NULL,
  reference_type  VARCHAR(32) NULL COMMENT 'ORDER, PAYMENT, PAYOUT, REFUND, COD, SUBSCRIPTION, ADJUSTMENT',
  reference_id    BIGINT      NULL,
  memo            VARCHAR(300) NULL,
  created_at      DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  KEY ix_ledger_tx (transaction_ref),
  KEY ix_ledger_account_time (account_id, created_at),
  KEY ix_ledger_reference (reference_type, reference_id),
  CONSTRAINT fk_ledger_account  FOREIGN KEY (account_id)    REFERENCES ledger_accounts (id),
  CONSTRAINT fk_ledger_currency FOREIGN KEY (currency_code) REFERENCES currencies (code),
  CONSTRAINT ck_ledger_one_side CHECK ((debit_minor = 0) <> (credit_minor = 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE payments (
  id                 BIGINT       NOT NULL AUTO_INCREMENT,
  order_id           BIGINT       NULL,
  subscription_id    BIGINT       NULL COMMENT 'FK added in V9',
  payer_user_id      BIGINT       NOT NULL,
  provider           VARCHAR(32)  NOT NULL COMMENT 'hyperpay, zaincash, cliq, stcpay, wallet, cod',
  provider_ref       VARCHAR(120) NULL,
  method             VARCHAR(16)  NOT NULL,
  amount_minor       BIGINT       NOT NULL,
  refunded_minor     BIGINT       NOT NULL DEFAULT 0,
  currency_code      CHAR(3)      NOT NULL,
  status             VARCHAR(24)  NOT NULL DEFAULT 'PENDING',
  failure_code       VARCHAR(60)  NULL,
  idempotency_key    CHAR(36)     NOT NULL,
  raw_response       JSON         NULL,
  authorized_at      DATETIME(3)  NULL,
  captured_at        DATETIME(3)  NULL,
  created_at         DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at         DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  version            INT          NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  UNIQUE KEY uq_payment_idempotency (idempotency_key),
  UNIQUE KEY uq_payment_provider_ref (provider, provider_ref),
  KEY ix_payment_order (order_id),
  KEY ix_payment_status (status, created_at),
  CONSTRAINT fk_payment_order    FOREIGN KEY (order_id)      REFERENCES orders (id),
  CONSTRAINT fk_payment_user     FOREIGN KEY (payer_user_id) REFERENCES users (id),
  CONSTRAINT fk_payment_currency FOREIGN KEY (currency_code) REFERENCES currencies (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE payment_events (
  id            BIGINT       NOT NULL AUTO_INCREMENT,
  provider      VARCHAR(32)  NOT NULL,
  provider_ref  VARCHAR(120) NULL,
  event_id      VARCHAR(120) NOT NULL COMMENT 'Provider event id. Guarantees webhook idempotency.',
  payment_id    BIGINT       NULL,
  event_type    VARCHAR(60)  NULL,
  signature_ok  TINYINT(1)   NOT NULL DEFAULT 0,
  payload       JSON         NOT NULL,
  processed_at  DATETIME(3)  NULL,
  created_at    DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  UNIQUE KEY uq_payment_event (provider, event_id),
  KEY ix_pe_payment (payment_id),
  CONSTRAINT fk_pe_payment FOREIGN KEY (payment_id) REFERENCES payments (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE refunds (
  id              BIGINT       NOT NULL AUTO_INCREMENT,
  payment_id      BIGINT       NOT NULL,
  amount_minor    BIGINT       NOT NULL,
  currency_code   CHAR(3)      NOT NULL,
  reason          VARCHAR(500) NOT NULL,
  status          VARCHAR(20)  NOT NULL DEFAULT 'PENDING',
  provider_ref    VARCHAR(120) NULL,
  idempotency_key CHAR(36)     NOT NULL,
  requested_by    BIGINT       NULL,
  created_at      DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  processed_at    DATETIME(3)  NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_refund_idempotency (idempotency_key),
  KEY ix_refund_payment (payment_id),
  CONSTRAINT fk_refund_payment FOREIGN KEY (payment_id)   REFERENCES payments (id),
  CONSTRAINT fk_refund_by      FOREIGN KEY (requested_by) REFERENCES users (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE cod_collections (
  id                BIGINT       NOT NULL AUTO_INCREMENT,
  order_id          BIGINT       NOT NULL,
  driver_id         BIGINT       NOT NULL,
  carrier_id        BIGINT       NOT NULL,
  amount_minor      BIGINT       NOT NULL,
  currency_code     CHAR(3)      NOT NULL,
  status            VARCHAR(16)  NOT NULL DEFAULT 'HELD' COMMENT 'HELD, SUBMITTED, SETTLED, OVERDUE',
  settle_method     VARCHAR(24)  NULL COMMENT 'BANK_DEPOSIT, OFFICE_HANDOVER, PAYOUT_DEDUCTION',
  deposit_slip_url  VARCHAR(500) NULL,
  reference_no      VARCHAR(120) NULL,
  due_at            DATETIME(3)  NULL,
  collected_at      DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  submitted_at      DATETIME(3)  NULL,
  settled_by        BIGINT       NULL,
  settled_at        DATETIME(3)  NULL,
  note              VARCHAR(500) NULL,
  version           INT          NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  UNIQUE KEY uq_cod_order (order_id),
  KEY ix_cod_driver_status (driver_id, status),
  KEY ix_cod_due (status, due_at),
  CONSTRAINT fk_cod_order   FOREIGN KEY (order_id)   REFERENCES orders (id),
  CONSTRAINT fk_cod_driver  FOREIGN KEY (driver_id)  REFERENCES drivers (id),
  CONSTRAINT fk_cod_carrier FOREIGN KEY (carrier_id) REFERENCES carrier_profiles (id),
  CONSTRAINT fk_cod_settler FOREIGN KEY (settled_by) REFERENCES users (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE payout_accounts (
  id               BIGINT       NOT NULL AUTO_INCREMENT,
  owner_user_id    BIGINT       NULL,
  organization_id  BIGINT       NULL,
  country_id       BIGINT       NOT NULL,
  payout_method_id BIGINT       NOT NULL,
  account_fields   JSON         NOT NULL COMMENT 'Validated against payout_methods.required_fields',
  masked_identifier VARCHAR(80) NOT NULL,
  verify_status    VARCHAR(16)  NOT NULL DEFAULT 'PENDING',
  verified_by      BIGINT       NULL,
  verified_at      DATETIME(3)  NULL,
  is_default       TINYINT(1)   NOT NULL DEFAULT 0,
  created_at       DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  deleted_at       DATETIME(3)  NULL,
  PRIMARY KEY (id),
  KEY ix_payout_acct_owner (owner_user_id, deleted_at),
  KEY ix_payout_acct_org (organization_id, deleted_at),
  CONSTRAINT fk_pa_user     FOREIGN KEY (owner_user_id)   REFERENCES users (id),
  CONSTRAINT fk_pa_org      FOREIGN KEY (organization_id) REFERENCES organizations (id),
  CONSTRAINT fk_pa_country  FOREIGN KEY (country_id)      REFERENCES countries (id),
  CONSTRAINT fk_pa_method   FOREIGN KEY (payout_method_id) REFERENCES payout_methods (id),
  CONSTRAINT fk_pa_verifier FOREIGN KEY (verified_by)     REFERENCES users (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE payouts (
  id                BIGINT       NOT NULL AUTO_INCREMENT,
  payout_account_id BIGINT       NOT NULL,
  carrier_id        BIGINT       NULL,
  organization_id   BIGINT       NULL,
  amount_minor      BIGINT       NOT NULL,
  fee_minor         BIGINT       NOT NULL DEFAULT 0,
  currency_code     CHAR(3)      NOT NULL,
  status            VARCHAR(16)  NOT NULL DEFAULT 'REQUESTED'
                    COMMENT 'REQUESTED, APPROVED, PROCESSING, PAID, REJECTED, FAILED',
  trigger_type      VARCHAR(16)  NOT NULL DEFAULT 'ON_DEMAND' COMMENT 'ON_DEMAND, THRESHOLD, MANUAL',
  idempotency_key   CHAR(36)     NOT NULL,
  provider_ref      VARCHAR(120) NULL,
  rejection_reason  VARCHAR(500) NULL,
  approved_by       BIGINT       NULL,
  requested_at      DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  processed_at      DATETIME(3)  NULL,
  version           INT          NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  UNIQUE KEY uq_payout_idempotency (idempotency_key),
  KEY ix_payout_status (status, requested_at),
  KEY ix_payout_carrier (carrier_id, status),
  CONSTRAINT fk_payout_account  FOREIGN KEY (payout_account_id) REFERENCES payout_accounts (id),
  CONSTRAINT fk_payout_carrier  FOREIGN KEY (carrier_id)        REFERENCES carrier_profiles (id),
  CONSTRAINT fk_payout_org      FOREIGN KEY (organization_id)   REFERENCES organizations (id),
  CONSTRAINT fk_payout_approver FOREIGN KEY (approved_by)       REFERENCES users (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE payout_items (
  id           BIGINT NOT NULL AUTO_INCREMENT,
  payout_id    BIGINT NOT NULL,
  order_id     BIGINT NOT NULL,
  amount_minor BIGINT NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_payout_item (payout_id, order_id),
  CONSTRAINT fk_pi_payout FOREIGN KEY (payout_id) REFERENCES payouts (id) ON DELETE CASCADE,
  CONSTRAINT fk_pi_order  FOREIGN KEY (order_id)  REFERENCES orders (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE idempotency_keys (
  id             BIGINT       NOT NULL AUTO_INCREMENT,
  key_value      CHAR(36)     NOT NULL,
  user_id        BIGINT       NULL,
  endpoint       VARCHAR(160) NOT NULL,
  request_hash   VARCHAR(120) NOT NULL,
  response_status INT         NULL,
  response_body  JSON         NULL,
  created_at     DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  expires_at     DATETIME(3)  NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_idempotency (key_value, endpoint),
  KEY ix_idempotency_expiry (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
