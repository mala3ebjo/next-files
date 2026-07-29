-- =============================================================================
-- V12 — Audit trail, feature flags, exports
-- audit_logs is append-only. No UPDATE and no DELETE is ever issued against it.
-- =============================================================================

CREATE TABLE audit_logs (
  id             BIGINT       NOT NULL AUTO_INCREMENT,
  actor_user_id  BIGINT       NULL,
  actor_name     VARCHAR(160) NULL,
  action         VARCHAR(60)  NOT NULL,
  entity_type    VARCHAR(60)  NOT NULL,
  entity_id      BIGINT       NULL,
  before_data    JSON         NULL,
  after_data     JSON         NULL,
  ip_address     VARCHAR(45)  NULL,
  user_agent     VARCHAR(300) NULL,
  request_id     CHAR(36)     NULL,
  created_at     DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  KEY ix_audit_entity (entity_type, entity_id, created_at),
  KEY ix_audit_actor (actor_user_id, created_at),
  KEY ix_audit_action (action, created_at),
  CONSTRAINT fk_audit_actor FOREIGN KEY (actor_user_id) REFERENCES users (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE feature_flags (
  id           BIGINT       NOT NULL AUTO_INCREMENT,
  flag_key     VARCHAR(60)  NOT NULL,
  country_id   BIGINT       NULL COMMENT 'Null means global',
  country_scope BIGINT      AS (IFNULL(country_id, 0)) STORED
               COMMENT 'Dedupe key: NULL never collides in a UNIQUE index',
  enabled      TINYINT(1)   NOT NULL DEFAULT 0,
  description  VARCHAR(300) NULL,
  updated_by   BIGINT       NULL,
  updated_at   DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  UNIQUE KEY uq_feature_flag (flag_key, country_scope),
  CONSTRAINT fk_flag_country FOREIGN KEY (country_id) REFERENCES countries (id),
  CONSTRAINT fk_flag_user    FOREIGN KEY (updated_by) REFERENCES users (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE export_jobs (
  id            BIGINT       NOT NULL AUTO_INCREMENT,
  job_id        CHAR(36)     NOT NULL,
  requested_by  BIGINT       NOT NULL,
  report_type   VARCHAR(60)  NOT NULL,
  export_format VARCHAR(10)  NOT NULL COMMENT 'CSV, XLSX',
  filters       JSON         NULL,
  status        VARCHAR(12)  NOT NULL DEFAULT 'QUEUED' COMMENT 'QUEUED, RUNNING, READY, FAILED',
  download_url  VARCHAR(500) NULL,
  error_message VARCHAR(500) NULL,
  expires_at    DATETIME(3)  NULL,
  created_at    DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  finished_at   DATETIME(3)  NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_export_job (job_id),
  KEY ix_export_user (requested_by, created_at),
  CONSTRAINT fk_export_user FOREIGN KEY (requested_by) REFERENCES users (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
