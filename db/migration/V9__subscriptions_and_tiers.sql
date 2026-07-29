-- =============================================================================
-- V9 — Client subscription plans and earned carrier tiers
-- =============================================================================

CREATE TABLE subscription_plans (
  id             BIGINT       NOT NULL AUTO_INCREMENT,
  code           VARCHAR(32)  NOT NULL COMMENT 'FREE, PLUS, BUSINESS',
  name_key       VARCHAR(120) NOT NULL,
  description_key VARCHAR(120) NULL,
  country_id     BIGINT       NOT NULL,
  price_minor    BIGINT       NOT NULL DEFAULT 0,
  currency_code  CHAR(3)      NOT NULL,
  billing_cycle  VARCHAR(10)  NOT NULL DEFAULT 'MONTHLY' COMMENT 'MONTHLY, ANNUAL',
  sort_order     INT          NOT NULL DEFAULT 100,
  is_active      TINYINT(1)   NOT NULL DEFAULT 1,
  created_at     DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at     DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  UNIQUE KEY uq_plan_country_code (country_id, code, billing_cycle),
  CONSTRAINT fk_plan_country  FOREIGN KEY (country_id)    REFERENCES countries (id),
  CONSTRAINT fk_plan_currency FOREIGN KEY (currency_code) REFERENCES currencies (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE plan_benefits (
  id           BIGINT       NOT NULL AUTO_INCREMENT,
  plan_id      BIGINT       NOT NULL,
  benefit_key  VARCHAR(60)  NOT NULL
               COMMENT 'SERVICE_FEE_DISCOUNT_PCT, FREE_CANCELLATIONS_PER_MONTH, DISPATCH_PRIORITY_WEIGHT, MAX_SAVED_ADDRESSES, MAX_SUB_USERS, MAX_STOPS, POSTPAID_INVOICING, CREDIT_LIMIT_MINOR, DEDICATED_SUPPORT, API_ACCESS, CUSTOM_REPORTS',
  label_key    VARCHAR(120) NULL,
  enabled      TINYINT(1)   NOT NULL DEFAULT 1,
  benefit_value DECIMAL(18,6) NULL,
  value_type   VARCHAR(16)  NOT NULL DEFAULT 'COUNT'
               COMMENT 'COUNT, PERCENT, MULTIPLIER, MONEY, BOOLEAN, UNLIMITED',
  PRIMARY KEY (id),
  UNIQUE KEY uq_plan_benefit (plan_id, benefit_key),
  CONSTRAINT fk_benefit_plan FOREIGN KEY (plan_id) REFERENCES subscription_plans (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE subscriptions (
  id                     BIGINT      NOT NULL AUTO_INCREMENT,
  plan_id                BIGINT      NOT NULL,
  owner_user_id          BIGINT      NULL,
  organization_id        BIGINT      NULL,
  status                 VARCHAR(20) NOT NULL DEFAULT 'ACTIVE'
                         COMMENT 'ACTIVE, PENDING_PAYMENT, PAST_DUE, CANCELLED, EXPIRED',
  current_period_start   DATETIME(3) NULL,
  current_period_end     DATETIME(3) NULL,
  auto_renew             TINYINT(1)  NOT NULL DEFAULT 1,
  free_cancellations_used INT        NOT NULL DEFAULT 0,
  cycle_reset_at         DATETIME(3) NULL,
  dunning_attempts       INT         NOT NULL DEFAULT 0,
  cancelled_at           DATETIME(3) NULL,
  created_at             DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at             DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  version                INT         NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  KEY ix_sub_owner (owner_user_id, status),
  KEY ix_sub_org (organization_id, status),
  KEY ix_sub_period_end (status, current_period_end),
  CONSTRAINT fk_sub_plan FOREIGN KEY (plan_id)         REFERENCES subscription_plans (id),
  CONSTRAINT fk_sub_user FOREIGN KEY (owner_user_id)   REFERENCES users (id),
  CONSTRAINT fk_sub_org  FOREIGN KEY (organization_id) REFERENCES organizations (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE subscription_invoices (
  id              BIGINT      NOT NULL AUTO_INCREMENT,
  subscription_id BIGINT      NOT NULL,
  payment_id      BIGINT      NULL,
  amount_minor    BIGINT      NOT NULL,
  currency_code   CHAR(3)     NOT NULL,
  period_start    DATETIME(3) NOT NULL,
  period_end      DATETIME(3) NOT NULL,
  status          VARCHAR(16) NOT NULL DEFAULT 'OPEN' COMMENT 'OPEN, PAID, FAILED, VOID',
  issued_at       DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  paid_at         DATETIME(3) NULL,
  PRIMARY KEY (id),
  KEY ix_sub_invoice (subscription_id, status),
  CONSTRAINT fk_si_sub     FOREIGN KEY (subscription_id) REFERENCES subscriptions (id) ON DELETE CASCADE,
  CONSTRAINT fk_si_payment FOREIGN KEY (payment_id)      REFERENCES payments (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

ALTER TABLE client_profiles
  ADD CONSTRAINT fk_client_subscription FOREIGN KEY (subscription_id) REFERENCES subscriptions (id);

ALTER TABLE payments
  ADD CONSTRAINT fk_payment_subscription FOREIGN KEY (subscription_id) REFERENCES subscriptions (id);

CREATE TABLE tier_scoring_rules (
  id           BIGINT       NOT NULL AUTO_INCREMENT,
  metric       VARCHAR(40)  NOT NULL
               COMMENT 'COMPLETED_ORDERS, ACCEPTANCE_RATE, ON_TIME_PICKUP_RATE, ON_TIME_DELIVERY_RATE, AVERAGE_RATING, REVENUE_GENERATED, CANCELLATION_RATE, VIOLATION_POINTS, DOCUMENT_COMPLIANCE',
  weight       DECIMAL(8,3) NOT NULL,
  direction    VARCHAR(20)  NOT NULL DEFAULT 'HIGHER_IS_BETTER',
  window_days  INT          NOT NULL DEFAULT 90,
  is_active    TINYINT(1)   NOT NULL DEFAULT 1,
  updated_at   DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  UNIQUE KEY uq_tier_metric (metric)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE carrier_score_history (
  id             BIGINT      NOT NULL AUTO_INCREMENT,
  carrier_id     BIGINT      NOT NULL,
  score          INT         NOT NULL,
  breakdown      JSON        NOT NULL,
  from_tier_id   BIGINT      NULL,
  to_tier_id     BIGINT      NULL,
  computed_at    DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  KEY ix_score_carrier (carrier_id, computed_at),
  CONSTRAINT fk_score_carrier FOREIGN KEY (carrier_id)   REFERENCES carrier_profiles (id) ON DELETE CASCADE,
  CONSTRAINT fk_score_from    FOREIGN KEY (from_tier_id) REFERENCES carrier_tiers (id),
  CONSTRAINT fk_score_to      FOREIGN KEY (to_tier_id)   REFERENCES carrier_tiers (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
