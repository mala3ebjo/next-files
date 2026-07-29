-- =============================================================================
-- V1 — Catalog, localization and reference data
-- Everything here is data the control panel edits. No business rule is hardcoded.
-- =============================================================================

CREATE TABLE currencies (
  code            CHAR(3)      NOT NULL,
  symbol          VARCHAR(8)   NOT NULL,
  decimal_digits  TINYINT      NOT NULL DEFAULT 2,
  symbol_position ENUM('PREFIX','SUFFIX') NOT NULL DEFAULT 'PREFIX',
  rounding_mode   VARCHAR(16)  NOT NULL DEFAULT 'HALF_UP',
  is_active       TINYINT(1)   NOT NULL DEFAULT 1,
  created_at      DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at      DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE fx_rates (
  id                     BIGINT       NOT NULL AUTO_INCREMENT,
  from_currency          CHAR(3)      NOT NULL,
  to_currency            CHAR(3)      NOT NULL,
  rate                   DECIMAL(20,8) NOT NULL,
  platform_margin_pct    DECIMAL(6,3) NOT NULL DEFAULT 0,
  effective_from         DATETIME(3)  NOT NULL,
  effective_to           DATETIME(3)  NULL,
  created_by             BIGINT       NULL,
  created_at             DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  KEY ix_fx_pair_effective (from_currency, to_currency, effective_from),
  CONSTRAINT fk_fx_from_currency FOREIGN KEY (from_currency) REFERENCES currencies (code),
  CONSTRAINT fk_fx_to_currency   FOREIGN KEY (to_currency)   REFERENCES currencies (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE languages (
  id             BIGINT      NOT NULL AUTO_INCREMENT,
  code           VARCHAR(10) NOT NULL,
  native_name    VARCHAR(80) NOT NULL,
  english_name   VARCHAR(80) NOT NULL,
  direction      ENUM('ltr','rtl') NOT NULL DEFAULT 'ltr',
  is_active      TINYINT(1)  NOT NULL DEFAULT 1,
  bundle_version INT         NOT NULL DEFAULT 1,
  created_at     DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at     DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  UNIQUE KEY uq_language_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE translations (
  id          BIGINT       NOT NULL AUTO_INCREMENT,
  language_id BIGINT       NOT NULL,
  namespace   VARCHAR(60)  NOT NULL,
  key_name    VARCHAR(200) NOT NULL,
  value_text  TEXT         NOT NULL,
  version     INT          NOT NULL DEFAULT 1,
  created_at  DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at  DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  UNIQUE KEY uq_translation_key (language_id, namespace, key_name),
  KEY ix_translation_version (language_id, version),
  CONSTRAINT fk_translation_language FOREIGN KEY (language_id) REFERENCES languages (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE countries (
  id                      BIGINT      NOT NULL AUTO_INCREMENT,
  iso_code                CHAR(2)     NOT NULL,
  name_key                VARCHAR(120) NOT NULL,
  phone_code              VARCHAR(8)  NOT NULL,
  phone_pattern           VARCHAR(120) NULL,
  currency_code           CHAR(3)     NOT NULL,
  default_timezone        VARCHAR(60) NOT NULL DEFAULT 'UTC',
  default_language_id     BIGINT      NULL,
  cod_enabled             TINYINT(1)  NOT NULL DEFAULT 0,
  commission_pct          DECIMAL(6,3) NOT NULL DEFAULT 15.000,
  cancellation_fee_pct    DECIMAL(6,3) NOT NULL DEFAULT 5.000,
  vat_pct                 DECIMAL(6,3) NOT NULL DEFAULT 0,
  tax_inclusive           TINYINT(1)  NOT NULL DEFAULT 1,
  cod_cash_limit_minor    BIGINT      NOT NULL DEFAULT 0,
  min_payout_minor        BIGINT      NOT NULL DEFAULT 0,
  payout_hold_hours       INT         NOT NULL DEFAULT 24,
  offer_ttl_seconds       INT         NOT NULL DEFAULT 30,
  max_dispatch_rounds     INT         NOT NULL DEFAULT 3,
  dispatch_radii_km       JSON        NULL COMMENT 'Ordered radius list per dispatch round',
  fleet_assign_window_min INT         NOT NULL DEFAULT 10,
  quote_ttl_minutes       INT         NOT NULL DEFAULT 15,
  broker_margin_cap_pct   DECIMAL(6,3) NOT NULL DEFAULT 10.000,
  is_active               TINYINT(1)  NOT NULL DEFAULT 0,
  created_at              DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at              DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  UNIQUE KEY uq_country_iso (iso_code),
  KEY ix_country_active (is_active),
  CONSTRAINT fk_country_currency FOREIGN KEY (currency_code) REFERENCES currencies (code),
  CONSTRAINT fk_country_language FOREIGN KEY (default_language_id) REFERENCES languages (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE country_payment_methods (
  id           BIGINT      NOT NULL AUTO_INCREMENT,
  country_id   BIGINT      NOT NULL,
  method_code  VARCHAR(32) NOT NULL COMMENT 'CARD, WALLET, COD, APPLE_PAY, GOOGLE_PAY, ZAINCASH, CLIQ, STC_PAY',
  provider     VARCHAR(32) NULL COMMENT 'hyperpay, zaincash, cliq, stcpay',
  is_active    TINYINT(1)  NOT NULL DEFAULT 1,
  sort_order   INT         NOT NULL DEFAULT 100,
  PRIMARY KEY (id),
  UNIQUE KEY uq_country_payment (country_id, method_code),
  CONSTRAINT fk_cpm_country FOREIGN KEY (country_id) REFERENCES countries (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE payout_methods (
  id               BIGINT      NOT NULL AUTO_INCREMENT,
  code             VARCHAR(32) NOT NULL COMMENT 'BANK_IBAN, WALLET_INTERNAL, ZAINCASH, CLIQ, STC_PAY, FASTPAY, QI_CARD',
  name_key         VARCHAR(120) NOT NULL,
  required_fields  JSON        NOT NULL COMMENT 'Array of {key,labelKey,pattern,required}',
  is_active        TINYINT(1)  NOT NULL DEFAULT 1,
  PRIMARY KEY (id),
  UNIQUE KEY uq_payout_method_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE country_payout_methods (
  id               BIGINT      NOT NULL AUTO_INCREMENT,
  country_id       BIGINT      NOT NULL,
  payout_method_id BIGINT      NOT NULL,
  fee_minor        BIGINT      NOT NULL DEFAULT 0,
  processing_hours INT         NOT NULL DEFAULT 24,
  is_active        TINYINT(1)  NOT NULL DEFAULT 1,
  PRIMARY KEY (id),
  UNIQUE KEY uq_country_payout (country_id, payout_method_id),
  CONSTRAINT fk_cpo_country FOREIGN KEY (country_id) REFERENCES countries (id) ON DELETE CASCADE,
  CONSTRAINT fk_cpo_method  FOREIGN KEY (payout_method_id) REFERENCES payout_methods (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE vehicle_types (
  id                 BIGINT      NOT NULL AUTO_INCREMENT,
  code               VARCHAR(40) NOT NULL,
  name_key           VARCHAR(120) NOT NULL,
  description_key    VARCHAR(120) NULL,
  max_capacity_kg    INT         NOT NULL,
  icon_key           VARCHAR(60) NULL,
  image_url          VARCHAR(500) NULL,
  refrigerated       TINYINT(1)  NOT NULL DEFAULT 0,
  distance_band_key  VARCHAR(40) NULL COMMENT 'SHORT, LONG, PORT — matches the client wizard step 1',
  sort_order         INT         NOT NULL DEFAULT 100,
  is_active          TINYINT(1)  NOT NULL DEFAULT 1,
  created_at         DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at         DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  UNIQUE KEY uq_vehicle_type_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE country_vehicle_types (
  country_id      BIGINT NOT NULL,
  vehicle_type_id BIGINT NOT NULL,
  is_active       TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (country_id, vehicle_type_id),
  CONSTRAINT fk_cvt_country FOREIGN KEY (country_id) REFERENCES countries (id) ON DELETE CASCADE,
  CONSTRAINT fk_cvt_type    FOREIGN KEY (vehicle_type_id) REFERENCES vehicle_types (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE cargo_types (
  id                      BIGINT      NOT NULL AUTO_INCREMENT,
  code                    VARCHAR(40) NOT NULL,
  name_key                VARCHAR(120) NOT NULL,
  icon_key                VARCHAR(60) NULL,
  restricted              TINYINT(1)  NOT NULL DEFAULT 0,
  requires_refrigeration  TINYINT(1)  NOT NULL DEFAULT 0,
  sort_order              INT         NOT NULL DEFAULT 100,
  is_active               TINYINT(1)  NOT NULL DEFAULT 1,
  created_at              DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at              DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  UNIQUE KEY uq_cargo_type_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE zones (
  id          BIGINT      NOT NULL AUTO_INCREMENT,
  country_id  BIGINT      NOT NULL,
  code        VARCHAR(40) NOT NULL,
  name_key    VARCHAR(120) NOT NULL,
  center_lat  DECIMAL(10,7) NULL,
  center_lng  DECIMAL(10,7) NULL,
  radius_km   DECIMAL(8,2) NULL,
  is_remote   TINYINT(1)  NOT NULL DEFAULT 0,
  is_active   TINYINT(1)  NOT NULL DEFAULT 1,
  PRIMARY KEY (id),
  UNIQUE KEY uq_zone_code (country_id, code),
  CONSTRAINT fk_zone_country FOREIGN KEY (country_id) REFERENCES countries (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE border_crossings (
  id            BIGINT      NOT NULL AUTO_INCREMENT,
  code          VARCHAR(60) NOT NULL,
  name_key      VARCHAR(120) NOT NULL,
  lat           DECIMAL(10,7) NOT NULL,
  lng           DECIMAL(10,7) NOT NULL,
  country_a_id  BIGINT      NOT NULL,
  country_b_id  BIGINT      NOT NULL,
  is_active     TINYINT(1)  NOT NULL DEFAULT 1,
  created_at    DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  UNIQUE KEY uq_crossing_code (code),
  CONSTRAINT fk_crossing_country_a FOREIGN KEY (country_a_id) REFERENCES countries (id),
  CONSTRAINT fk_crossing_country_b FOREIGN KEY (country_b_id) REFERENCES countries (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE corridors (
  id              BIGINT      NOT NULL AUTO_INCREMENT,
  from_country_id BIGINT      NOT NULL,
  to_country_id   BIGINT      NOT NULL,
  crossing_id     BIGINT      NOT NULL,
  name_key        VARCHAR(120) NOT NULL,
  is_active       TINYINT(1)  NOT NULL DEFAULT 1,
  created_at      DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at      DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  UNIQUE KEY uq_corridor (from_country_id, to_country_id, crossing_id),
  KEY ix_corridor_active (is_active),
  CONSTRAINT fk_corridor_from     FOREIGN KEY (from_country_id) REFERENCES countries (id),
  CONSTRAINT fk_corridor_to       FOREIGN KEY (to_country_id)   REFERENCES countries (id),
  CONSTRAINT fk_corridor_crossing FOREIGN KEY (crossing_id)     REFERENCES border_crossings (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE corridor_documents (
  id          BIGINT      NOT NULL AUTO_INCREMENT,
  corridor_id BIGINT      NOT NULL,
  doc_type    VARCHAR(60) NOT NULL,
  mandatory   TINYINT(1)  NOT NULL DEFAULT 1,
  PRIMARY KEY (id),
  UNIQUE KEY uq_corridor_doc (corridor_id, doc_type),
  CONSTRAINT fk_corridor_doc FOREIGN KEY (corridor_id) REFERENCES corridors (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Carrier tiers are reference data referenced by carrier_profiles in V3.
CREATE TABLE carrier_tiers (
  id                        BIGINT      NOT NULL AUTO_INCREMENT,
  code                      VARCHAR(32) NOT NULL,
  name_key                  VARCHAR(120) NOT NULL,
  min_score                 INT         NOT NULL DEFAULT 0,
  commission_discount_pct   DECIMAL(6,3) NOT NULL DEFAULT 0,
  dispatch_priority_weight  DECIMAL(6,3) NOT NULL DEFAULT 1.000,
  payout_hold_hours         INT         NOT NULL DEFAULT 24,
  cod_limit_minor           BIGINT      NOT NULL DEFAULT 0,
  cross_border_priority     TINYINT(1)  NOT NULL DEFAULT 0,
  sort_order                INT         NOT NULL DEFAULT 100,
  is_active                 TINYINT(1)  NOT NULL DEFAULT 1,
  created_at                DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at                DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  UNIQUE KEY uq_tier_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
