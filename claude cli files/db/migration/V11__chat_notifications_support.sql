-- =============================================================================
-- V11 — Chat, notifications, support and SOS
-- Chat history is retained permanently for disputes. Deletion is soft only.
-- =============================================================================

CREATE TABLE conversations (
  id              BIGINT      NOT NULL AUTO_INCREMENT,
  order_id        BIGINT      NOT NULL,
  last_message_at DATETIME(3) NULL,
  is_closed       TINYINT(1)  NOT NULL DEFAULT 0,
  created_at      DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  UNIQUE KEY uq_conversation_order (order_id),
  CONSTRAINT fk_conv_order FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE conversation_participants (
  id                 BIGINT      NOT NULL AUTO_INCREMENT,
  conversation_id    BIGINT      NOT NULL,
  user_id            BIGINT      NOT NULL,
  participant_role   VARCHAR(12) NOT NULL COMMENT 'CLIENT, DRIVER, SUPPORT, ADMIN',
  last_read_message_id BIGINT    NULL,
  joined_at          DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  UNIQUE KEY uq_conv_participant (conversation_id, user_id),
  CONSTRAINT fk_cp_conv FOREIGN KEY (conversation_id) REFERENCES conversations (id) ON DELETE CASCADE,
  CONSTRAINT fk_cp_user FOREIGN KEY (user_id)         REFERENCES users (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE messages (
  id                 BIGINT       NOT NULL AUTO_INCREMENT,
  conversation_id    BIGINT       NOT NULL,
  sender_id          BIGINT       NULL COMMENT 'Null for system messages',
  sender_role        VARCHAR(12)  NOT NULL DEFAULT 'SYSTEM',
  message_type       VARCHAR(10)  NOT NULL DEFAULT 'TEXT' COMMENT 'TEXT, IMAGE, VOICE, SYSTEM',
  body               TEXT         NULL,
  media_url          VARCHAR(500) NULL,
  media_size_bytes   BIGINT       NULL,
  duration_seconds   INT          NULL,
  system_message_key VARCHAR(120) NULL,
  client_message_id  VARCHAR(80)  NULL,
  is_flagged         TINYINT(1)   NOT NULL DEFAULT 0,
  soft_deleted_at    DATETIME(3)  NULL COMMENT 'Hidden from participants, still visible to support',
  sent_at            DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  UNIQUE KEY uq_message_client_id (conversation_id, client_message_id),
  KEY ix_message_conv (conversation_id, sent_at),
  KEY ix_message_flagged (is_flagged, sent_at),
  CONSTRAINT fk_msg_conv   FOREIGN KEY (conversation_id) REFERENCES conversations (id) ON DELETE CASCADE,
  CONSTRAINT fk_msg_sender FOREIGN KEY (sender_id)       REFERENCES users (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE notification_templates (
  id           BIGINT      NOT NULL AUTO_INCREMENT,
  code         VARCHAR(60) NOT NULL,
  category     VARCHAR(20) NOT NULL
               COMMENT 'ORDER, OFFER, PAYMENT, PAYOUT, SUBSCRIPTION, TIER, VIOLATION, DOCUMENT, CHAT, SYSTEM, MARKETING',
  title_key    VARCHAR(120) NOT NULL,
  body_key     VARCHAR(120) NOT NULL,
  deep_link    VARCHAR(200) NULL,
  push_enabled TINYINT(1)  NOT NULL DEFAULT 1,
  sms_enabled  TINYINT(1)  NOT NULL DEFAULT 0,
  email_enabled TINYINT(1) NOT NULL DEFAULT 0,
  is_active    TINYINT(1)  NOT NULL DEFAULT 1,
  PRIMARY KEY (id),
  UNIQUE KEY uq_notif_template (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE notifications (
  id           BIGINT       NOT NULL AUTO_INCREMENT,
  user_id      BIGINT       NOT NULL,
  template_id  BIGINT       NULL,
  category     VARCHAR(20)  NOT NULL,
  title_key    VARCHAR(120) NOT NULL,
  body_key     VARCHAR(120) NOT NULL,
  params       JSON         NULL COMMENT 'Rendered in the recipient language on the client',
  deep_link    VARCHAR(200) NULL,
  read_at      DATETIME(3)  NULL,
  created_at   DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  KEY ix_notification_user (user_id, read_at, created_at),
  CONSTRAINT fk_notif_user     FOREIGN KEY (user_id)     REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT fk_notif_template FOREIGN KEY (template_id) REFERENCES notification_templates (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE notification_deliveries (
  id              BIGINT      NOT NULL AUTO_INCREMENT,
  notification_id BIGINT      NOT NULL,
  channel         VARCHAR(10) NOT NULL COMMENT 'PUSH, SMS, EMAIL, IN_APP',
  target          VARCHAR(400) NULL,
  status          VARCHAR(12) NOT NULL DEFAULT 'PENDING' COMMENT 'PENDING, SENT, FAILED',
  provider_ref    VARCHAR(120) NULL,
  error_message   VARCHAR(500) NULL,
  attempted_at    DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  KEY ix_delivery_notification (notification_id),
  CONSTRAINT fk_nd_notification FOREIGN KEY (notification_id) REFERENCES notifications (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE notification_preferences (
  id                BIGINT      NOT NULL AUTO_INCREMENT,
  user_id           BIGINT      NOT NULL,
  category          VARCHAR(20) NOT NULL,
  push_enabled      TINYINT(1)  NOT NULL DEFAULT 1,
  in_app_enabled    TINYINT(1)  NOT NULL DEFAULT 1,
  sms_enabled       TINYINT(1)  NOT NULL DEFAULT 0,
  email_enabled     TINYINT(1)  NOT NULL DEFAULT 0,
  quiet_hours_start VARCHAR(5)  NULL,
  quiet_hours_end   VARCHAR(5)  NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_notif_pref (user_id, category),
  CONSTRAINT fk_np_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE support_tickets (
  id            BIGINT       NOT NULL AUTO_INCREMENT,
  opened_by     BIGINT       NOT NULL,
  order_id      BIGINT       NULL,
  category      VARCHAR(30)  NOT NULL,
  subject       VARCHAR(200) NOT NULL,
  description   TEXT         NULL,
  priority      VARCHAR(10)  NOT NULL DEFAULT 'NORMAL' COMMENT 'LOW, NORMAL, HIGH, URGENT',
  status        VARCHAR(16)  NOT NULL DEFAULT 'OPEN' COMMENT 'OPEN, IN_PROGRESS, RESOLVED, CLOSED',
  assigned_to   BIGINT       NULL,
  resolved_at   DATETIME(3)  NULL,
  created_at    DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at    DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  KEY ix_ticket_status (status, priority, created_at),
  CONSTRAINT fk_ticket_opener   FOREIGN KEY (opened_by)   REFERENCES users (id),
  CONSTRAINT fk_ticket_order    FOREIGN KEY (order_id)    REFERENCES orders (id),
  CONSTRAINT fk_ticket_assignee FOREIGN KEY (assigned_to) REFERENCES users (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE sos_alerts (
  id              BIGINT       NOT NULL AUTO_INCREMENT,
  driver_id       BIGINT       NOT NULL,
  order_id        BIGINT       NULL,
  ticket_id       BIGINT       NULL,
  lat             DECIMAL(10,7) NOT NULL,
  lng             DECIMAL(10,7) NOT NULL,
  note            VARCHAR(500) NULL,
  status          VARCHAR(16)  NOT NULL DEFAULT 'OPEN' COMMENT 'OPEN, ACKNOWLEDGED, RESOLVED',
  acknowledged_by BIGINT       NULL,
  acknowledged_at DATETIME(3)  NULL,
  resolved_by     BIGINT       NULL,
  resolution_note VARCHAR(1000) NULL,
  resolved_at     DATETIME(3)  NULL,
  created_at      DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  KEY ix_sos_status (status, created_at),
  CONSTRAINT fk_sos_driver FOREIGN KEY (driver_id)       REFERENCES drivers (id),
  CONSTRAINT fk_sos_order  FOREIGN KEY (order_id)        REFERENCES orders (id),
  CONSTRAINT fk_sos_ticket FOREIGN KEY (ticket_id)       REFERENCES support_tickets (id),
  CONSTRAINT fk_sos_ack    FOREIGN KEY (acknowledged_by) REFERENCES users (id),
  CONSTRAINT fk_sos_res    FOREIGN KEY (resolved_by)     REFERENCES users (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
