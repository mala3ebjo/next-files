-- =============================================================================
-- V10 — Violation rules, detected violations, actions and appeals
-- WARNING and PRIORITY_DROP apply automatically.
-- SUSPENSION and DEACTIVATION always require an explicit admin action.
-- =============================================================================

CREATE TABLE violation_rules (
  id             BIGINT       NOT NULL AUTO_INCREMENT,
  code           VARCHAR(60)  NOT NULL,
  name_key       VARCHAR(120) NOT NULL,
  description_key VARCHAR(120) NULL,
  country_id     BIGINT       NULL COMMENT 'Null means global',
  country_scope  BIGINT       AS (IFNULL(country_id, 0)) STORED
                 COMMENT 'Dedupe key: NULL never collides in a UNIQUE index',
  severity       VARCHAR(12)  NOT NULL DEFAULT 'LOW' COMMENT 'LOW, MEDIUM, HIGH, CRITICAL',
  threshold      DECIMAL(18,6) NOT NULL,
  threshold_unit VARCHAR(24)  NULL COMMENT 'MINUTES, KM, PERCENT, COUNT, KMH, HOURS',
  window_days    INT          NOT NULL DEFAULT 30,
  points         INT          NOT NULL DEFAULT 1,
  auto_action    VARCHAR(20)  NOT NULL DEFAULT 'WARNING'
                 COMMENT 'NONE, WARNING, PRIORITY_DROP, PAYOUT_HOLD, SUSPENSION, DEACTIVATION',
  grace_minutes  INT          NOT NULL DEFAULT 0,
  is_active      TINYINT(1)   NOT NULL DEFAULT 1,
  created_at     DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at     DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  UNIQUE KEY uq_violation_rule (code, country_scope),
  CONSTRAINT fk_vrule_country FOREIGN KEY (country_id) REFERENCES countries (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE violations (
  id            BIGINT      NOT NULL AUTO_INCREMENT,
  rule_id       BIGINT      NOT NULL,
  subject_type  VARCHAR(16) NOT NULL COMMENT 'DRIVER, CARRIER, ORGANIZATION, CLIENT',
  subject_id    BIGINT      NOT NULL,
  order_id      BIGINT      NULL,
  points        INT         NOT NULL DEFAULT 0,
  status        VARCHAR(12) NOT NULL DEFAULT 'OPEN'
                COMMENT 'OPEN, CONFIRMED, DISMISSED, EXPIRED, APPEALED',
  measured_value DECIMAL(18,6) NULL,
  evidence      JSON        NULL COMMENT 'GPS excerpt, timestamps, thresholds, references',
  detected_at   DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  expires_at    DATETIME(3) NULL COMMENT 'Points decay after this moment',
  resolved_by   BIGINT      NULL,
  resolved_at   DATETIME(3) NULL,
  version       INT         NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  KEY ix_violation_subject (subject_type, subject_id, status, expires_at),
  KEY ix_violation_order (order_id),
  KEY ix_violation_status (status, detected_at),
  CONSTRAINT fk_violation_rule  FOREIGN KEY (rule_id)     REFERENCES violation_rules (id),
  CONSTRAINT fk_violation_order FOREIGN KEY (order_id)    REFERENCES orders (id),
  CONSTRAINT fk_violation_by    FOREIGN KEY (resolved_by) REFERENCES users (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE violation_actions (
  id            BIGINT       NOT NULL AUTO_INCREMENT,
  violation_id  BIGINT       NOT NULL,
  action_type   VARCHAR(20)  NOT NULL,
  is_automatic  TINYINT(1)   NOT NULL DEFAULT 1,
  applied_by    BIGINT       NULL COMMENT 'Required when is_automatic = 0',
  applied_at    DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  until_at      DATETIME(3)  NULL,
  reversed_at   DATETIME(3)  NULL,
  reversed_by   BIGINT       NULL,
  note          VARCHAR(1000) NULL,
  PRIMARY KEY (id),
  KEY ix_action_violation (violation_id),
  KEY ix_action_active (action_type, reversed_at, until_at),
  CONSTRAINT fk_action_violation FOREIGN KEY (violation_id) REFERENCES violations (id) ON DELETE CASCADE,
  CONSTRAINT fk_action_by        FOREIGN KEY (applied_by)   REFERENCES users (id),
  CONSTRAINT fk_action_rev_by    FOREIGN KEY (reversed_by)  REFERENCES users (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE violation_appeals (
  id              BIGINT        NOT NULL AUTO_INCREMENT,
  violation_id    BIGINT        NOT NULL,
  submitted_by    BIGINT        NOT NULL,
  message         VARCHAR(2000) NOT NULL,
  attachment_urls JSON          NULL,
  status          VARCHAR(12)   NOT NULL DEFAULT 'PENDING' COMMENT 'PENDING, ACCEPTED, REJECTED',
  resolution_note VARCHAR(1000) NULL,
  resolved_by     BIGINT        NULL,
  resolved_at     DATETIME(3)   NULL,
  created_at      DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  UNIQUE KEY uq_appeal_violation (violation_id),
  KEY ix_appeal_status (status, created_at),
  CONSTRAINT fk_appeal_violation FOREIGN KEY (violation_id) REFERENCES violations (id) ON DELETE CASCADE,
  CONSTRAINT fk_appeal_by        FOREIGN KEY (submitted_by) REFERENCES users (id),
  CONSTRAINT fk_appeal_resolver  FOREIGN KEY (resolved_by)  REFERENCES users (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
