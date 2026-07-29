-- =============================================================================
-- V5 — Pricing engine: rate cards, factors, corridor fees, immutable quotes
-- =============================================================================

CREATE TABLE rate_cards (
  id             BIGINT      NOT NULL AUTO_INCREMENT,
  country_id     BIGINT      NOT NULL,
  currency_code  CHAR(3)     NOT NULL,
  version        INT         NOT NULL,
  name           VARCHAR(120) NOT NULL,
  status         VARCHAR(16) NOT NULL DEFAULT 'DRAFT' COMMENT 'DRAFT, PUBLISHED, ARCHIVED',
  effective_from DATETIME(3) NULL,
  effective_to   DATETIME(3) NULL,
  is_active      TINYINT(1)  NOT NULL DEFAULT 0,
  created_by     BIGINT      NULL,
  published_by   BIGINT      NULL,
  published_at   DATETIME(3) NULL,
  created_at     DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at     DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  UNIQUE KEY uq_rate_card_version (country_id, version),
  KEY ix_rate_card_active (country_id, is_active, effective_from),
  CONSTRAINT fk_rc_country   FOREIGN KEY (country_id)    REFERENCES countries (id),
  CONSTRAINT fk_rc_currency  FOREIGN KEY (currency_code) REFERENCES currencies (code),
  CONSTRAINT fk_rc_created   FOREIGN KEY (created_by)    REFERENCES users (id),
  CONSTRAINT fk_rc_published FOREIGN KEY (published_by)  REFERENCES users (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE pricing_factors (
  id            BIGINT       NOT NULL AUTO_INCREMENT,
  rate_card_id  BIGINT       NOT NULL,
  factor_group  VARCHAR(24)  NOT NULL
                COMMENT 'BASE, DISTANCE, WEIGHT, VEHICLE, CARGO, GEOGRAPHY, TIME, STOPS, WAITING, RISK, COMMERCIAL, TAX',
  factor_key    VARCHAR(60)  NOT NULL COMMENT 'base_fare, rate_per_km, min_fare, stop_fee, ...',
  label_key     VARCHAR(120) NULL,
  calc_type     VARCHAR(16)  NOT NULL COMMENT 'FIXED, PER_UNIT, PERCENT, MULTIPLIER, TIERED',
  factor_value  DECIMAL(18,6) NOT NULL,
  conditions    JSON         NULL COMMENT 'Matcher, e.g. {"vehicleTypeId":3} or {"distanceFromKm":0,"distanceToKm":50}',
  priority      INT          NOT NULL DEFAULT 100,
  created_at    DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  KEY ix_factor_card (rate_card_id, factor_group, priority),
  CONSTRAINT fk_factor_card FOREIGN KEY (rate_card_id) REFERENCES rate_cards (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE corridor_fees (
  id              BIGINT       NOT NULL AUTO_INCREMENT,
  corridor_id     BIGINT       NOT NULL,
  vehicle_type_id BIGINT       NULL COMMENT 'Null matches every vehicle type',
  cargo_type_id   BIGINT       NULL COMMENT 'Null matches every cargo type',
  fee_type        VARCHAR(40)  NOT NULL
                  COMMENT 'CUSTOMS_CLEARANCE, BORDER_ENTRY_FEE, TRANSIT_PERMIT, ESCORT_OR_CONVOY, BORDER_WAITING_PER_DAY, CARGO_INSURANCE_PERCENT, DOCUMENTS_FEE, DRIVER_ENTRY_OR_VISA, SCANNER_OR_INSPECTION, AGENT_COMMISSION',
  calc_type       VARCHAR(16)  NOT NULL COMMENT 'FIXED, PER_UNIT, PERCENT',
  fee_value       DECIMAL(18,6) NOT NULL,
  currency_code   CHAR(3)      NOT NULL,
  effective_from  DATETIME(3)  NOT NULL,
  effective_to    DATETIME(3)  NULL,
  created_at      DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  KEY ix_corridor_fee (corridor_id, fee_type, effective_from),
  CONSTRAINT fk_cf_corridor FOREIGN KEY (corridor_id)     REFERENCES corridors (id) ON DELETE CASCADE,
  CONSTRAINT fk_cf_vehicle  FOREIGN KEY (vehicle_type_id) REFERENCES vehicle_types (id),
  CONSTRAINT fk_cf_cargo    FOREIGN KEY (cargo_type_id)   REFERENCES cargo_types (id),
  CONSTRAINT fk_cf_currency FOREIGN KEY (currency_code)   REFERENCES currencies (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE promo_codes (
  id               BIGINT      NOT NULL AUTO_INCREMENT,
  code             VARCHAR(40) NOT NULL,
  country_id       BIGINT      NULL,
  discount_type    VARCHAR(16) NOT NULL COMMENT 'PERCENT, FIXED',
  discount_value   DECIMAL(18,6) NOT NULL,
  max_discount_minor BIGINT    NULL,
  min_order_minor  BIGINT      NOT NULL DEFAULT 0,
  usage_limit      INT         NULL,
  usage_count      INT         NOT NULL DEFAULT 0,
  per_user_limit   INT         NOT NULL DEFAULT 1,
  valid_from       DATETIME(3) NOT NULL,
  valid_to         DATETIME(3) NOT NULL,
  is_active        TINYINT(1)  NOT NULL DEFAULT 1,
  created_at       DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  UNIQUE KEY uq_promo_code (code),
  CONSTRAINT fk_promo_country FOREIGN KEY (country_id) REFERENCES countries (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE price_quotes (
  id                  BIGINT       NOT NULL AUTO_INCREMENT,
  rate_card_id        BIGINT       NOT NULL,
  requested_by        BIGINT       NULL,
  input_snapshot      JSON         NOT NULL COMMENT 'Exact request that produced this quote',
  breakdown           JSON         NOT NULL COMMENT 'Immutable line and leg breakdown. Never recomputed.',
  subtotal_minor      BIGINT       NOT NULL,
  discount_minor      BIGINT       NOT NULL DEFAULT 0,
  tax_minor           BIGINT       NOT NULL DEFAULT 0,
  total_minor         BIGINT       NOT NULL,
  currency_code       CHAR(3)      NOT NULL,
  display_currency    CHAR(3)      NULL,
  fx_rate             DECIMAL(20,8) NULL,
  distance_km         DECIMAL(10,2) NOT NULL,
  is_cross_border     TINYINT(1)   NOT NULL DEFAULT 0,
  promo_code_id       BIGINT       NULL,
  consumed_order_id   BIGINT       NULL COMMENT 'Set once used. FK added in V6.',
  expires_at          DATETIME(3)  NOT NULL,
  created_at          DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  KEY ix_quote_expiry (expires_at),
  KEY ix_quote_requester (requested_by, created_at),
  CONSTRAINT fk_quote_card     FOREIGN KEY (rate_card_id)  REFERENCES rate_cards (id),
  CONSTRAINT fk_quote_user     FOREIGN KEY (requested_by)  REFERENCES users (id),
  CONSTRAINT fk_quote_currency FOREIGN KEY (currency_code) REFERENCES currencies (code),
  CONSTRAINT fk_quote_promo    FOREIGN KEY (promo_code_id) REFERENCES promo_codes (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
