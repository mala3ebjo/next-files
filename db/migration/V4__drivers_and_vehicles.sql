-- =============================================================================
-- V4 — Drivers, vehicles and assignments
-- =============================================================================

CREATE TABLE drivers (
  id                    BIGINT      NOT NULL AUTO_INCREMENT,
  user_id               BIGINT      NOT NULL,
  carrier_id            BIGINT      NOT NULL COMMENT 'Owning carrier profile',
  organization_id       BIGINT      NULL COMMENT 'Set for fleet drivers',
  first_name            VARCHAR(60) NOT NULL,
  middle_name           VARCHAR(60) NULL,
  last_name             VARCHAR(60) NOT NULL,
  national_id           VARCHAR(60) NULL,
  licence_number        VARCHAR(60) NULL,
  licence_expiry        DATE        NULL,
  passport_number       VARCHAR(60) NULL,
  passport_expiry       DATE        NULL,
  cross_border_permit   TINYINT(1)  NOT NULL DEFAULT 0,
  status                VARCHAR(24) NOT NULL DEFAULT 'PENDING_REVIEW',
  is_available          TINYINT(1)  NOT NULL DEFAULT 0,
  available_since       DATETIME(3) NULL,
  rating_avg            DECIMAL(3,2) NULL,
  rating_count          INT         NOT NULL DEFAULT 0,
  active_order_id       BIGINT      NULL COMMENT 'Denormalised pointer, FK added in V6',
  created_at            DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at            DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  deleted_at            DATETIME(3) NULL,
  version               INT         NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  UNIQUE KEY uq_driver_user (user_id),
  UNIQUE KEY uq_driver_national_id (national_id),
  KEY ix_driver_carrier (carrier_id),
  KEY ix_driver_org (organization_id),
  KEY ix_driver_available (is_available, status),
  KEY ix_driver_licence_expiry (licence_expiry),
  CONSTRAINT fk_driver_user    FOREIGN KEY (user_id)         REFERENCES users (id),
  CONSTRAINT fk_driver_carrier FOREIGN KEY (carrier_id)      REFERENCES carrier_profiles (id),
  CONSTRAINT fk_driver_org     FOREIGN KEY (organization_id) REFERENCES organizations (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE vehicles (
  id                BIGINT      NOT NULL AUTO_INCREMENT,
  carrier_id        BIGINT      NOT NULL,
  organization_id   BIGINT      NULL,
  owner_driver_id   BIGINT      NULL COMMENT 'Set for owner-operators',
  vehicle_type_id   BIGINT      NOT NULL,
  plate_number      VARCHAR(32) NOT NULL,
  plate_country     CHAR(2)     NOT NULL,
  model             VARCHAR(80) NULL,
  manufacture_year  INT         NULL,
  color             VARCHAR(40) NULL,
  capacity_kg       INT         NOT NULL,
  status            VARCHAR(16) NOT NULL DEFAULT 'ACTIVE' COMMENT 'ACTIVE, INACTIVE, MAINTENANCE, BLOCKED',
  verified          TINYINT(1)  NOT NULL DEFAULT 0,
  verified_by       BIGINT      NULL,
  verified_at       DATETIME(3) NULL,
  created_at        DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at        DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  deleted_at        DATETIME(3) NULL,
  version           INT         NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  UNIQUE KEY uq_vehicle_plate (plate_country, plate_number),
  KEY ix_vehicle_carrier (carrier_id),
  KEY ix_vehicle_org (organization_id),
  KEY ix_vehicle_type (vehicle_type_id),
  KEY ix_vehicle_verified (verified, status),
  CONSTRAINT fk_vehicle_carrier FOREIGN KEY (carrier_id)      REFERENCES carrier_profiles (id),
  CONSTRAINT fk_vehicle_org     FOREIGN KEY (organization_id) REFERENCES organizations (id),
  CONSTRAINT fk_vehicle_driver  FOREIGN KEY (owner_driver_id) REFERENCES drivers (id),
  CONSTRAINT fk_vehicle_type    FOREIGN KEY (vehicle_type_id) REFERENCES vehicle_types (id),
  CONSTRAINT fk_vehicle_verifier FOREIGN KEY (verified_by)    REFERENCES users (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE vehicle_cargo_types (
  vehicle_id    BIGINT NOT NULL,
  cargo_type_id BIGINT NOT NULL,
  PRIMARY KEY (vehicle_id, cargo_type_id),
  CONSTRAINT fk_vct_vehicle FOREIGN KEY (vehicle_id)    REFERENCES vehicles (id) ON DELETE CASCADE,
  CONSTRAINT fk_vct_cargo   FOREIGN KEY (cargo_type_id) REFERENCES cargo_types (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE vehicle_assignments (
  id           BIGINT      NOT NULL AUTO_INCREMENT,
  vehicle_id   BIGINT      NOT NULL,
  driver_id    BIGINT      NOT NULL,
  assigned_by  BIGINT      NULL,
  assigned_at  DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  released_at  DATETIME(3) NULL,
  PRIMARY KEY (id),
  KEY ix_va_vehicle (vehicle_id, released_at),
  KEY ix_va_driver (driver_id, released_at),
  CONSTRAINT fk_va_vehicle FOREIGN KEY (vehicle_id)  REFERENCES vehicles (id) ON DELETE CASCADE,
  CONSTRAINT fk_va_driver  FOREIGN KEY (driver_id)   REFERENCES drivers (id) ON DELETE CASCADE,
  CONSTRAINT fk_va_by      FOREIGN KEY (assigned_by) REFERENCES users (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE driver_availability_log (
  id          BIGINT      NOT NULL AUTO_INCREMENT,
  driver_id   BIGINT      NOT NULL,
  available   TINYINT(1)  NOT NULL,
  lat         DECIMAL(10,7) NULL,
  lng         DECIMAL(10,7) NULL,
  reason      VARCHAR(120) NULL,
  created_at  DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  KEY ix_dal_driver_time (driver_id, created_at),
  CONSTRAINT fk_dal_driver FOREIGN KEY (driver_id) REFERENCES drivers (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
