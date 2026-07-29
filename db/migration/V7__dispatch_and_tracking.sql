-- =============================================================================
-- V7 — Dispatch offers and GPS trail
-- Live positions live in Redis GEO. This table is the historical trail only.
-- =============================================================================

CREATE TABLE order_offers (
  id              BIGINT      NOT NULL AUTO_INCREMENT,
  order_id        BIGINT      NOT NULL,
  carrier_id      BIGINT      NOT NULL,
  driver_id       BIGINT      NULL,
  round_number    INT         NOT NULL DEFAULT 1,
  radius_km       DECIMAL(8,2) NULL,
  total_score     DECIMAL(10,4) NULL,
  score_breakdown JSON        NULL COMMENT 'Why this carrier was ranked here. Used by support.',
  status          VARCHAR(12) NOT NULL DEFAULT 'SENT' COMMENT 'SENT, ACCEPTED, REJECTED, EXPIRED, CANCELLED',
  reject_reason   VARCHAR(60) NULL,
  sent_at         DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  expires_at      DATETIME(3) NOT NULL,
  responded_at    DATETIME(3) NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_offer_order_carrier_round (order_id, carrier_id, round_number),
  KEY ix_offer_order_round (order_id, round_number),
  KEY ix_offer_carrier_status (carrier_id, status, sent_at),
  KEY ix_offer_expiry (status, expires_at),
  CONSTRAINT fk_offer_order   FOREIGN KEY (order_id)   REFERENCES orders (id) ON DELETE CASCADE,
  CONSTRAINT fk_offer_carrier FOREIGN KEY (carrier_id) REFERENCES carrier_profiles (id),
  CONSTRAINT fk_offer_driver  FOREIGN KEY (driver_id)  REFERENCES drivers (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE dispatch_attempts (
  id                BIGINT      NOT NULL AUTO_INCREMENT,
  order_id          BIGINT      NOT NULL,
  round_number      INT         NOT NULL,
  radius_km         DECIMAL(8,2) NOT NULL,
  candidates_found  INT         NOT NULL DEFAULT 0,
  offers_sent       INT         NOT NULL DEFAULT 0,
  outcome           VARCHAR(20) NOT NULL DEFAULT 'PENDING' COMMENT 'PENDING, ACCEPTED, TIMED_OUT, ESCALATED',
  started_at        DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  finished_at       DATETIME(3) NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_attempt_round (order_id, round_number),
  CONSTRAINT fk_attempt_order FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- No foreign keys: this table is partitioned by month and grows fast.
-- Referential integrity is enforced by the application layer.
CREATE TABLE driver_locations (
  id            BIGINT       NOT NULL AUTO_INCREMENT,
  driver_id     BIGINT       NOT NULL,
  order_id      BIGINT       NULL,
  lat           DECIMAL(10,7) NOT NULL,
  lng           DECIMAL(10,7) NOT NULL,
  speed_kmh     DECIMAL(8,2) NULL,
  heading       DECIMAL(6,2) NULL,
  accuracy_m    DECIMAL(8,2) NULL,
  battery_level TINYINT      NULL,
  is_mocked     TINYINT(1)   NOT NULL DEFAULT 0,
  recorded_at   DATETIME(3)  NOT NULL,
  created_at    DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id, recorded_at),
  KEY ix_loc_order_time (order_id, recorded_at),
  KEY ix_loc_driver_time (driver_id, recorded_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
PARTITION BY RANGE (TO_DAYS(recorded_at)) (
  PARTITION p_2026_08 VALUES LESS THAN (TO_DAYS('2026-09-01')),
  PARTITION p_2026_09 VALUES LESS THAN (TO_DAYS('2026-10-01')),
  PARTITION p_2026_10 VALUES LESS THAN (TO_DAYS('2026-11-01')),
  PARTITION p_2026_11 VALUES LESS THAN (TO_DAYS('2026-12-01')),
  PARTITION p_2026_12 VALUES LESS THAN (TO_DAYS('2027-01-01')),
  PARTITION p_max     VALUES LESS THAN MAXVALUE
);
