-- Repeatable seed: automatic violation detection rules.
-- Only WARNING, PRIORITY_DROP and PAYOUT_HOLD are automatic.
-- SUSPENSION and DEACTIVATION are never seeded as auto actions: they need an admin.

INSERT INTO violation_rules
  (code, name_key, country_id, severity, threshold, threshold_unit, window_days, points, auto_action, grace_minutes, is_active)
VALUES
  ('LOW_ACCEPTANCE_RATE','violation.low_acceptance_rate',NULL,'LOW',40,'PERCENT',30,2,'WARNING',0,1),
  ('IGNORED_OFFERS','violation.ignored_offers',NULL,'LOW',5,'COUNT',7,2,'WARNING',0,1),
  ('OFFLINE_AFTER_ACCEPT','violation.offline_after_accept',NULL,'MEDIUM',5,'MINUTES',30,4,'PRIORITY_DROP',0,1),
  ('CANCEL_AFTER_ACCEPT','violation.cancel_after_accept',NULL,'MEDIUM',1,'COUNT',30,5,'PRIORITY_DROP',0,1),
  ('LATE_PICKUP','violation.late_pickup',NULL,'LOW',30,'MINUTES',30,2,'WARNING',15,1),
  ('LATE_DELIVERY','violation.late_delivery',NULL,'MEDIUM',60,'MINUTES',30,4,'PRIORITY_DROP',30,1),
  ('ROUTE_DEVIATION','violation.route_deviation',NULL,'MEDIUM',15,'KM',30,4,'PRIORITY_DROP',20,1),
  ('UNAUTHORIZED_STOP','violation.unauthorized_stop',NULL,'LOW',45,'MINUTES',30,2,'WARNING',15,1),
  ('GPS_GAP','violation.gps_gap',NULL,'MEDIUM',20,'MINUTES',30,3,'WARNING',10,1),
  ('OVER_SPEED','violation.over_speed',NULL,'HIGH',120,'KMH',30,6,'PRIORITY_DROP',0,1),
  ('MOCK_LOCATION','violation.mock_location',NULL,'CRITICAL',1,'COUNT',90,15,'PAYOUT_HOLD',0,1),
  ('MISSING_PROOF','violation.missing_proof',NULL,'HIGH',1,'COUNT',90,6,'PAYOUT_HOLD',0,1),
  ('OUT_OF_GEOFENCE_DELIVERY','violation.out_of_geofence_delivery',NULL,'HIGH',1,'COUNT',90,6,'PAYOUT_HOLD',0,1),
  ('OTP_BRUTE_FORCE','violation.otp_brute_force',NULL,'HIGH',5,'COUNT',7,6,'PRIORITY_DROP',0,1),
  ('COD_NOT_SETTLED','violation.cod_not_settled',NULL,'HIGH',48,'HOURS',90,8,'PAYOUT_HOLD',720,1),
  ('COD_LIMIT_EXCEEDED','violation.cod_limit_exceeded',NULL,'HIGH',1,'COUNT',90,6,'PAYOUT_HOLD',0,1),
  ('EXPIRED_DOCUMENT_TRIP','violation.expired_document_trip',NULL,'CRITICAL',1,'COUNT',180,12,'PAYOUT_HOLD',0,1),
  ('LOW_RATING_STREAK','violation.low_rating_streak',NULL,'MEDIUM',3,'COUNT',30,4,'PRIORITY_DROP',0,1),
  ('REPORTED_ABUSE','violation.reported_abuse',NULL,'HIGH',1,'COUNT',180,8,'PRIORITY_DROP',0,1),
  ('MISSING_CUSTOMS_DOCS','violation.missing_customs_docs',NULL,'MEDIUM',1,'COUNT',90,4,'WARNING',60,1)
ON DUPLICATE KEY UPDATE
  name_key=VALUES(name_key), severity=VALUES(severity), threshold=VALUES(threshold),
  threshold_unit=VALUES(threshold_unit), window_days=VALUES(window_days),
  points=VALUES(points), auto_action=VALUES(auto_action), grace_minutes=VALUES(grace_minutes);
