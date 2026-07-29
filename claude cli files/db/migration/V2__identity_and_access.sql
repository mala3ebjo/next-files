-- =============================================================================
-- V2 — Identity, roles, permissions, sessions
-- =============================================================================

CREATE TABLE users (
  id                     BIGINT       NOT NULL AUTO_INCREMENT,
  phone                  VARCHAR(24)  NOT NULL COMMENT 'E.164 without plus, unique across the platform',
  email                  VARCHAR(190) NULL,
  password_hash          VARCHAR(120) NULL COMMENT 'Only staff use passwords. App users are OTP only.',
  user_kind              VARCHAR(16)  NOT NULL COMMENT 'CLIENT, DRIVER, FLEET, BROKER, STAFF',
  status                 VARCHAR(16)  NOT NULL DEFAULT 'ACTIVE' COMMENT 'ACTIVE, SUSPENDED, DEACTIVATED',
  first_name             VARCHAR(60)  NULL,
  middle_name            VARCHAR(60)  NULL,
  last_name              VARCHAR(60)  NULL,
  avatar_url             VARCHAR(500) NULL,
  default_country_id     BIGINT       NULL,
  preferred_language_id  BIGINT       NULL,
  display_currency       CHAR(3)      NULL,
  token_version          INT          NOT NULL DEFAULT 1 COMMENT 'Increment to invalidate every live token',
  two_factor_secret      VARCHAR(120) NULL,
  two_factor_enabled     TINYINT(1)   NOT NULL DEFAULT 0,
  suspended_until        DATETIME(3)  NULL,
  suspension_reason      VARCHAR(500) NULL,
  last_login_at          DATETIME(3)  NULL,
  created_at             DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at             DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  deleted_at             DATETIME(3)  NULL,
  version                INT          NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  UNIQUE KEY uq_user_phone (phone),
  UNIQUE KEY uq_user_email (email),
  KEY ix_user_kind_status (user_kind, status),
  KEY ix_user_country (default_country_id),
  CONSTRAINT fk_user_country  FOREIGN KEY (default_country_id) REFERENCES countries (id),
  CONSTRAINT fk_user_language FOREIGN KEY (preferred_language_id) REFERENCES languages (id),
  CONSTRAINT fk_user_currency FOREIGN KEY (display_currency) REFERENCES currencies (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE permissions (
  id              BIGINT      NOT NULL AUTO_INCREMENT,
  code            VARCHAR(80) NOT NULL,
  permission_group VARCHAR(40) NOT NULL,
  description_key VARCHAR(120) NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_permission_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE roles (
  id         BIGINT      NOT NULL AUTO_INCREMENT,
  code       VARCHAR(40) NOT NULL,
  name_key   VARCHAR(120) NOT NULL,
  is_system  TINYINT(1)  NOT NULL DEFAULT 0 COMMENT 'System roles cannot be deleted',
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  UNIQUE KEY uq_role_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE role_permissions (
  role_id       BIGINT NOT NULL,
  permission_id BIGINT NOT NULL,
  PRIMARY KEY (role_id, permission_id),
  CONSTRAINT fk_rp_role       FOREIGN KEY (role_id)       REFERENCES roles (id) ON DELETE CASCADE,
  CONSTRAINT fk_rp_permission FOREIGN KEY (permission_id) REFERENCES permissions (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE user_roles (
  user_id     BIGINT      NOT NULL,
  role_id     BIGINT      NOT NULL,
  granted_by  BIGINT      NULL,
  granted_at  DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (user_id, role_id),
  CONSTRAINT fk_ur_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT fk_ur_role FOREIGN KEY (role_id) REFERENCES roles (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE user_country_scope (
  user_id    BIGINT NOT NULL,
  country_id BIGINT NOT NULL,
  PRIMARY KEY (user_id, country_id),
  CONSTRAINT fk_ucs_user    FOREIGN KEY (user_id)    REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT fk_ucs_country FOREIGN KEY (country_id) REFERENCES countries (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE otp_requests (
  id            BIGINT       NOT NULL AUTO_INCREMENT,
  request_id    CHAR(36)     NOT NULL,
  phone         VARCHAR(24)  NOT NULL,
  country_id    BIGINT       NULL,
  code_hash     VARCHAR(120) NOT NULL COMMENT 'Never store the plain code',
  purpose       VARCHAR(20)  NOT NULL DEFAULT 'LOGIN',
  attempts      TINYINT      NOT NULL DEFAULT 0,
  max_attempts  TINYINT      NOT NULL DEFAULT 5,
  consumed_at   DATETIME(3)  NULL,
  expires_at    DATETIME(3)  NOT NULL,
  ip_address    VARCHAR(45)  NULL,
  created_at    DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  UNIQUE KEY uq_otp_request_id (request_id),
  KEY ix_otp_phone_created (phone, created_at),
  KEY ix_otp_expires (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE refresh_tokens (
  id           BIGINT       NOT NULL AUTO_INCREMENT,
  user_id      BIGINT       NOT NULL,
  token_hash   VARCHAR(120) NOT NULL,
  family_id    CHAR(36)     NOT NULL COMMENT 'Reuse of a consumed token revokes the whole family',
  device_id    VARCHAR(120) NULL,
  token_scope  VARCHAR(10)  NOT NULL DEFAULT 'FULL' COMMENT 'FULL or LIMITED',
  ip_address   VARCHAR(45)  NULL,
  user_agent   VARCHAR(300) NULL,
  expires_at   DATETIME(3)  NOT NULL,
  consumed_at  DATETIME(3)  NULL,
  revoked_at   DATETIME(3)  NULL,
  created_at   DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  UNIQUE KEY uq_refresh_hash (token_hash),
  KEY ix_refresh_user (user_id, revoked_at),
  KEY ix_refresh_family (family_id),
  CONSTRAINT fk_refresh_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE devices (
  id            BIGINT       NOT NULL AUTO_INCREMENT,
  user_id       BIGINT       NOT NULL,
  device_id     VARCHAR(120) NOT NULL,
  platform      VARCHAR(10)  NOT NULL COMMENT 'android, ios, web',
  fcm_token     VARCHAR(400) NULL,
  app_version   VARCHAR(20)  NULL,
  os_version    VARCHAR(40)  NULL,
  device_model  VARCHAR(80)  NULL,
  last_seen_at  DATETIME(3)  NULL,
  created_at    DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at    DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  UNIQUE KEY uq_device_user (user_id, device_id),
  KEY ix_device_fcm (fcm_token),
  CONSTRAINT fk_device_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

ALTER TABLE fx_rates
  ADD CONSTRAINT fk_fx_created_by FOREIGN KEY (created_by) REFERENCES users (id);
