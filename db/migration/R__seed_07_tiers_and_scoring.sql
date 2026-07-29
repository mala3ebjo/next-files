-- Repeatable seed: carrier tiers and the scoring weights that drive them.

INSERT INTO carrier_tiers
  (code, name_key, min_score, commission_discount_pct, dispatch_priority_weight,
   payout_hold_hours, cod_limit_minor, cross_border_priority, sort_order, is_active)
VALUES
  ('BRONZE','tier.bronze',0,0.000,1.000,48,500000,0,10,1),
  ('SILVER','tier.silver',40,1.000,1.100,36,1000000,0,20,1),
  ('GOLD','tier.gold',65,2.000,1.250,24,2000000,1,30,1),
  ('PLATINUM','tier.platinum',85,3.000,1.400,0,4000000,1,40,1)
ON DUPLICATE KEY UPDATE
  min_score=VALUES(min_score),
  commission_discount_pct=VALUES(commission_discount_pct),
  dispatch_priority_weight=VALUES(dispatch_priority_weight),
  payout_hold_hours=VALUES(payout_hold_hours),
  cod_limit_minor=VALUES(cod_limit_minor);

INSERT INTO tier_scoring_rules (metric, weight, direction, window_days, is_active) VALUES
  ('COMPLETED_ORDERS',20.000,'HIGHER_IS_BETTER',90,1),
  ('ACCEPTANCE_RATE',20.000,'HIGHER_IS_BETTER',30,1),
  ('ON_TIME_PICKUP_RATE',12.000,'HIGHER_IS_BETTER',90,1),
  ('ON_TIME_DELIVERY_RATE',18.000,'HIGHER_IS_BETTER',90,1),
  ('AVERAGE_RATING',15.000,'HIGHER_IS_BETTER',90,1),
  ('REVENUE_GENERATED',5.000,'HIGHER_IS_BETTER',90,1),
  ('CANCELLATION_RATE',15.000,'LOWER_IS_BETTER',30,1),
  ('VIOLATION_POINTS',20.000,'LOWER_IS_BETTER',30,1),
  ('DOCUMENT_COMPLIANCE',5.000,'HIGHER_IS_BETTER',30,1)
ON DUPLICATE KEY UPDATE weight=VALUES(weight), direction=VALUES(direction), window_days=VALUES(window_days);
