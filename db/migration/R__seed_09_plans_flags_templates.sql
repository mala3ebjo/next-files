-- Repeatable seed: subscription plans with per-benefit toggles, notification templates, feature flags.

INSERT INTO subscription_plans
  (code, name_key, description_key, country_id, price_minor, currency_code, billing_cycle, sort_order, is_active)
SELECT p.code, p.name_key, p.description_key, c.id, p.price, c.currency_code, 'MONTHLY', p.sort_order, 1
FROM countries c
CROSS JOIN (
  SELECT 'FREE' AS code,'plan.free' AS name_key,'plan.free.desc' AS description_key,0 AS price,10 AS sort_order UNION ALL
  SELECT 'PLUS','plan.plus','plan.plus.desc',0,20 UNION ALL
  SELECT 'BUSINESS','plan.business','plan.business.desc',0,30
) p
WHERE 1 = 1
ON DUPLICATE KEY UPDATE name_key=VALUES(name_key), description_key=VALUES(description_key);

-- Every benefit is an explicit toggle plus a value, editable per plan in the control panel.
INSERT INTO plan_benefits (plan_id, benefit_key, label_key, enabled, benefit_value, value_type)
SELECT sp.id, b.benefit_key, b.label_key, b.enabled, b.benefit_value, b.value_type
FROM subscription_plans sp
JOIN (
  SELECT 'FREE' AS pcode,'SERVICE_FEE_DISCOUNT_PCT' AS benefit_key,'benefit.service_fee_discount' AS label_key,0 AS enabled,0 AS benefit_value,'PERCENT' AS value_type UNION ALL
  SELECT 'FREE','FREE_CANCELLATIONS_PER_MONTH','benefit.free_cancellations',1,1,'COUNT' UNION ALL
  SELECT 'FREE','DISPATCH_PRIORITY_WEIGHT','benefit.dispatch_priority',1,1.0,'MULTIPLIER' UNION ALL
  SELECT 'FREE','MAX_SAVED_ADDRESSES','benefit.max_addresses',1,5,'COUNT' UNION ALL
  SELECT 'FREE','MAX_STOPS','benefit.max_stops',1,2,'COUNT' UNION ALL
  SELECT 'FREE','POSTPAID_INVOICING','benefit.postpaid',0,NULL,'BOOLEAN' UNION ALL
  SELECT 'FREE','DEDICATED_SUPPORT','benefit.dedicated_support',0,NULL,'BOOLEAN' UNION ALL
  SELECT 'FREE','API_ACCESS','benefit.api_access',0,NULL,'BOOLEAN' UNION ALL
  SELECT 'FREE','CUSTOM_REPORTS','benefit.custom_reports',0,NULL,'BOOLEAN' UNION ALL

  SELECT 'PLUS','SERVICE_FEE_DISCOUNT_PCT','benefit.service_fee_discount',1,3,'PERCENT' UNION ALL
  SELECT 'PLUS','FREE_CANCELLATIONS_PER_MONTH','benefit.free_cancellations',1,3,'COUNT' UNION ALL
  SELECT 'PLUS','DISPATCH_PRIORITY_WEIGHT','benefit.dispatch_priority',1,1.1,'MULTIPLIER' UNION ALL
  SELECT 'PLUS','MAX_SAVED_ADDRESSES','benefit.max_addresses',1,25,'COUNT' UNION ALL
  SELECT 'PLUS','MAX_STOPS','benefit.max_stops',1,5,'COUNT' UNION ALL
  SELECT 'PLUS','POSTPAID_INVOICING','benefit.postpaid',0,NULL,'BOOLEAN' UNION ALL
  SELECT 'PLUS','DEDICATED_SUPPORT','benefit.dedicated_support',1,NULL,'BOOLEAN' UNION ALL
  SELECT 'PLUS','API_ACCESS','benefit.api_access',0,NULL,'BOOLEAN' UNION ALL
  SELECT 'PLUS','CUSTOM_REPORTS','benefit.custom_reports',0,NULL,'BOOLEAN' UNION ALL

  SELECT 'BUSINESS','SERVICE_FEE_DISCOUNT_PCT','benefit.service_fee_discount',1,6,'PERCENT' UNION ALL
  SELECT 'BUSINESS','FREE_CANCELLATIONS_PER_MONTH','benefit.free_cancellations',1,10,'COUNT' UNION ALL
  SELECT 'BUSINESS','DISPATCH_PRIORITY_WEIGHT','benefit.dispatch_priority',1,1.25,'MULTIPLIER' UNION ALL
  SELECT 'BUSINESS','MAX_SAVED_ADDRESSES','benefit.max_addresses',1,0,'UNLIMITED' UNION ALL
  SELECT 'BUSINESS','MAX_SUB_USERS','benefit.max_sub_users',1,25,'COUNT' UNION ALL
  SELECT 'BUSINESS','MAX_STOPS','benefit.max_stops',1,10,'COUNT' UNION ALL
  SELECT 'BUSINESS','POSTPAID_INVOICING','benefit.postpaid',1,NULL,'BOOLEAN' UNION ALL
  SELECT 'BUSINESS','CREDIT_LIMIT_MINOR','benefit.credit_limit',1,0,'MONEY' UNION ALL
  SELECT 'BUSINESS','DEDICATED_SUPPORT','benefit.dedicated_support',1,NULL,'BOOLEAN' UNION ALL
  SELECT 'BUSINESS','API_ACCESS','benefit.api_access',1,NULL,'BOOLEAN' UNION ALL
  SELECT 'BUSINESS','CUSTOM_REPORTS','benefit.custom_reports',1,NULL,'BOOLEAN'
) b ON b.pcode = sp.code
ON DUPLICATE KEY UPDATE
  enabled=VALUES(enabled), benefit_value=VALUES(benefit_value), value_type=VALUES(value_type);

INSERT INTO notification_templates
  (code, category, title_key, body_key, deep_link, push_enabled, sms_enabled, email_enabled, is_active)
VALUES
  ('ORDER_CREATED','ORDER','notif.order_created.title','notif.order_created.body','nextfreight://orders/{orderId}',1,0,0,1),
  ('ORDER_SEARCHING','ORDER','notif.order_searching.title','notif.order_searching.body','nextfreight://orders/{orderId}',1,0,0,1),
  ('ORDER_ASSIGNED','ORDER','notif.order_assigned.title','notif.order_assigned.body','nextfreight://orders/{orderId}',1,1,0,1),
  ('ORDER_PICKED_UP','ORDER','notif.order_picked_up.title','notif.order_picked_up.body','nextfreight://orders/{orderId}',1,0,0,1),
  ('ORDER_DELIVERED','ORDER','notif.order_delivered.title','notif.order_delivered.body','nextfreight://orders/{orderId}',1,1,0,1),
  ('ORDER_CANCELLED','ORDER','notif.order_cancelled.title','notif.order_cancelled.body','nextfreight://orders/{orderId}',1,1,0,1),
  ('ORDER_UNFULFILLED','ORDER','notif.order_unfulfilled.title','notif.order_unfulfilled.body','nextfreight://orders/{orderId}',1,0,0,1),
  ('NEW_OFFER','OFFER','notif.new_offer.title','notif.new_offer.body','nextfreight://offers/{offerId}',1,0,0,1),
  ('PAYMENT_CONFIRMED','PAYMENT','notif.payment_confirmed.title','notif.payment_confirmed.body','nextfreight://orders/{orderId}',1,0,1,1),
  ('PAYMENT_FAILED','PAYMENT','notif.payment_failed.title','notif.payment_failed.body','nextfreight://orders/{orderId}',1,0,1,1),
  ('REFUND_ISSUED','PAYMENT','notif.refund_issued.title','notif.refund_issued.body','nextfreight://wallet',1,0,1,1),
  ('PAYOUT_APPROVED','PAYOUT','notif.payout_approved.title','notif.payout_approved.body','nextfreight://earnings',1,0,1,1),
  ('PAYOUT_PAID','PAYOUT','notif.payout_paid.title','notif.payout_paid.body','nextfreight://earnings',1,0,1,1),
  ('PAYOUT_REJECTED','PAYOUT','notif.payout_rejected.title','notif.payout_rejected.body','nextfreight://earnings',1,0,1,1),
  ('APPLICATION_APPROVED','SYSTEM','notif.application_approved.title','notif.application_approved.body','nextfreight://home',1,1,0,1),
  ('APPLICATION_CHANGES','SYSTEM','notif.application_changes.title','notif.application_changes.body','nextfreight://application',1,1,0,1),
  ('APPLICATION_REJECTED','SYSTEM','notif.application_rejected.title','notif.application_rejected.body','nextfreight://application',1,1,0,1),
  ('TIER_CHANGED','TIER','notif.tier_changed.title','notif.tier_changed.body','nextfreight://profile/tier',1,0,0,1),
  ('VIOLATION_WARNING','VIOLATION','notif.violation_warning.title','notif.violation_warning.body','nextfreight://compliance',1,0,0,1),
  ('VIOLATION_ACTION','VIOLATION','notif.violation_action.title','notif.violation_action.body','nextfreight://compliance',1,1,0,1),
  ('APPEAL_RESOLVED','VIOLATION','notif.appeal_resolved.title','notif.appeal_resolved.body','nextfreight://compliance',1,0,0,1),
  ('DOCUMENT_EXPIRING','DOCUMENT','notif.document_expiring.title','notif.document_expiring.body','nextfreight://vehicle',1,0,1,1),
  ('COD_SETTLEMENT_DUE','PAYMENT','notif.cod_due.title','notif.cod_due.body','nextfreight://earnings/cod',1,1,0,1),
  ('SUBSCRIPTION_RENEWED','SUBSCRIPTION','notif.subscription_renewed.title','notif.subscription_renewed.body','nextfreight://subscription',1,0,1,1),
  ('SUBSCRIPTION_FAILED','SUBSCRIPTION','notif.subscription_failed.title','notif.subscription_failed.body','nextfreight://subscription',1,0,1,1),
  ('NEW_MESSAGE','CHAT','notif.new_message.title','notif.new_message.body','nextfreight://orders/{orderId}/chat',1,0,0,1)
ON DUPLICATE KEY UPDATE title_key=VALUES(title_key), body_key=VALUES(body_key), deep_link=VALUES(deep_link);

INSERT INTO feature_flags (flag_key, country_id, enabled, description) VALUES
  ('cod_enabled', NULL, 0, 'Master switch for cash on delivery. Also gated per country.'),
  ('cross_border_orders', NULL, 1, 'Allow orders whose pickup and drop-off are in different countries.'),
  ('broker_board', NULL, 1, 'Show the claimable order board to brokerage companies.'),
  ('chat_voice_notes', NULL, 1, 'Allow voice notes in order chat.'),
  ('public_tracking_link', NULL, 1, 'Allow clients to share a public tracking link.'),
  ('scheduled_orders', NULL, 1, 'Allow orders scheduled for a future time.'),
  ('client_subscriptions', NULL, 1, 'Sell paid client subscription plans.'),
  ('auto_tier_recalculation', NULL, 1, 'Nightly recalculation of carrier tiers.'),
  ('violation_auto_actions', NULL, 1, 'Apply warnings and priority drops automatically.'),
  ('threshold_auto_payout', NULL, 0, 'Release payouts automatically when the threshold is reached.')
ON DUPLICATE KEY UPDATE description=VALUES(description);
