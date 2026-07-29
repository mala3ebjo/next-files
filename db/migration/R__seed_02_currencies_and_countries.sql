-- Repeatable seed: currencies, countries, payment and payout rails. Idempotent.

INSERT INTO currencies (code, symbol, decimal_digits, symbol_position, is_active) VALUES
  ('IQD','د.ع',0,'SUFFIX',1),
  ('JOD','د.أ',3,'SUFFIX',1),
  ('SAR','ر.س',2,'SUFFIX',1),
  ('AED','د.إ',2,'SUFFIX',1),
  ('TRY','₺',2,'PREFIX',1),
  ('KWD','د.ك',3,'SUFFIX',1),
  ('BHD','د.ب',3,'SUFFIX',1),
  ('OMR','ر.ع',3,'SUFFIX',1),
  ('SYP','ل.س',0,'SUFFIX',0),
  ('IRR','﷼',0,'SUFFIX',0),
  ('USD','$',2,'PREFIX',1),
  ('EUR','€',2,'PREFIX',1)
ON DUPLICATE KEY UPDATE symbol=VALUES(symbol), decimal_digits=VALUES(decimal_digits);

-- Only Iraq is active at launch. Others are onboarded from the control panel.
INSERT INTO countries
  (iso_code, name_key, phone_code, phone_pattern, currency_code, default_timezone,
   default_language_id, cod_enabled, commission_pct, cancellation_fee_pct, vat_pct,
   cod_cash_limit_minor, min_payout_minor, payout_hold_hours, offer_ttl_seconds,
   max_dispatch_rounds, dispatch_radii_km, is_active)
VALUES
  ('IQ','country.iq','+964','^7[0-9]{9}$','IQD','Asia/Baghdad',
   (SELECT id FROM languages WHERE code='ar'),0,15.000,5.000,0.000,
   1000000,25000,24,30,3,'[15,40,80]',1),
  ('JO','country.jo','+962','^7[789][0-9]{7}$','JOD','Asia/Amman',
   (SELECT id FROM languages WHERE code='ar'),0,15.000,5.000,16.000,
   500000,20000,24,30,3,'[15,40,80]',0),
  ('SA','country.sa','+966','^5[0-9]{8}$','SAR','Asia/Riyadh',
   (SELECT id FROM languages WHERE code='ar'),0,15.000,5.000,15.000,
   200000,10000,24,30,3,'[20,50,100]',0),
  ('AE','country.ae','+971','^5[0-9]{8}$','AED','Asia/Dubai',
   (SELECT id FROM languages WHERE code='ar'),0,15.000,5.000,5.000,
   200000,10000,24,30,3,'[20,50,100]',0),
  ('TR','country.tr','+90','^5[0-9]{9}$','TRY','Europe/Istanbul',
   (SELECT id FROM languages WHERE code='tr'),0,15.000,5.000,20.000,
   200000,10000,24,30,3,'[20,50,120]',0),
  ('KW','country.kw','+965','^[569][0-9]{7}$','KWD','Asia/Kuwait',
   (SELECT id FROM languages WHERE code='ar'),0,15.000,5.000,0.000,
   200000,10000,24,30,3,'[15,40,80]',0),
  ('BH','country.bh','+973','^3[0-9]{7}$','BHD','Asia/Bahrain',
   (SELECT id FROM languages WHERE code='ar'),0,15.000,5.000,10.000,
   200000,10000,24,30,3,'[15,40,80]',0),
  ('OM','country.om','+968','^9[0-9]{7}$','OMR','Asia/Muscat',
   (SELECT id FROM languages WHERE code='ar'),0,15.000,5.000,5.000,
   200000,10000,24,30,3,'[20,50,100]',0),
  ('SY','country.sy','+963','^9[0-9]{8}$','SYP','Asia/Damascus',
   (SELECT id FROM languages WHERE code='ar'),0,15.000,5.000,0.000,
   200000,10000,24,30,3,'[15,40,80]',0),
  ('IR','country.ir','+98','^9[0-9]{9}$','IRR','Asia/Tehran',
   (SELECT id FROM languages WHERE code='fa'),0,15.000,5.000,9.000,
   200000,10000,24,30,3,'[20,50,100]',0)
ON DUPLICATE KEY UPDATE
  name_key=VALUES(name_key), phone_code=VALUES(phone_code), currency_code=VALUES(currency_code),
  default_timezone=VALUES(default_timezone);

INSERT INTO payout_methods (code, name_key, required_fields, is_active) VALUES
  ('BANK_IBAN','payout.method.bank_iban',
   '[{"key":"iban","labelKey":"field.iban","pattern":"^[A-Z]{2}[0-9A-Z]{13,32}$","required":true},{"key":"accountHolder","labelKey":"field.account_holder","required":true},{"key":"bankName","labelKey":"field.bank_name","required":false}]',1),
  ('WALLET_INTERNAL','payout.method.wallet',
   '[{"key":"walletPhone","labelKey":"field.wallet_phone","pattern":"^[0-9]{8,15}$","required":true}]',1),
  ('ZAINCASH','payout.method.zaincash',
   '[{"key":"walletPhone","labelKey":"field.wallet_phone","pattern":"^7[0-9]{9}$","required":true}]',1),
  ('FASTPAY','payout.method.fastpay',
   '[{"key":"walletPhone","labelKey":"field.wallet_phone","pattern":"^7[0-9]{9}$","required":true}]',1),
  ('QI_CARD','payout.method.qi_card',
   '[{"key":"cardNumber","labelKey":"field.card_number","required":true},{"key":"accountHolder","labelKey":"field.account_holder","required":true}]',1),
  ('CLIQ','payout.method.cliq',
   '[{"key":"alias","labelKey":"field.cliq_alias","required":true}]',1),
  ('STC_PAY','payout.method.stc_pay',
   '[{"key":"walletPhone","labelKey":"field.wallet_phone","pattern":"^5[0-9]{8}$","required":true}]',1)
ON DUPLICATE KEY UPDATE name_key=VALUES(name_key), required_fields=VALUES(required_fields);

INSERT INTO country_payment_methods (country_id, method_code, provider, is_active, sort_order)
SELECT c.id, m.code, m.provider, m.active, m.sort_order FROM countries c
JOIN (
  SELECT 'IQ' AS iso,'CARD' AS code,'hyperpay' AS provider,1 AS active,10 AS sort_order UNION ALL
  SELECT 'IQ','WALLET',NULL,1,20 UNION ALL
  SELECT 'IQ','COD',NULL,0,30 UNION ALL
  SELECT 'IQ','ZAINCASH','zaincash',0,40 UNION ALL
  SELECT 'JO','CARD','hyperpay',1,10 UNION ALL
  SELECT 'JO','WALLET',NULL,1,20 UNION ALL
  SELECT 'JO','CLIQ','cliq',0,30 UNION ALL
  SELECT 'SA','CARD','hyperpay',1,10 UNION ALL
  SELECT 'SA','APPLE_PAY','hyperpay',1,15 UNION ALL
  SELECT 'SA','WALLET',NULL,1,20 UNION ALL
  SELECT 'AE','CARD','hyperpay',1,10 UNION ALL
  SELECT 'AE','WALLET',NULL,1,20 UNION ALL
  SELECT 'TR','CARD','hyperpay',1,10 UNION ALL
  SELECT 'TR','WALLET',NULL,1,20
) m ON m.iso = c.iso_code
ON DUPLICATE KEY UPDATE provider=VALUES(provider), is_active=VALUES(is_active);

INSERT INTO country_payout_methods (country_id, payout_method_id, fee_minor, processing_hours, is_active)
SELECT c.id, p.id, m.fee, m.hours, m.active FROM countries c
JOIN (
  SELECT 'IQ' AS iso,'BANK_IBAN' AS mcode,0 AS fee,48 AS hours,1 AS active UNION ALL
  SELECT 'IQ','WALLET_INTERNAL',0,1,1 UNION ALL
  SELECT 'IQ','ZAINCASH',0,4,1 UNION ALL
  SELECT 'IQ','FASTPAY',0,4,1 UNION ALL
  SELECT 'IQ','QI_CARD',0,24,1 UNION ALL
  SELECT 'JO','BANK_IBAN',0,48,1 UNION ALL
  SELECT 'JO','CLIQ',0,1,1 UNION ALL
  SELECT 'JO','WALLET_INTERNAL',0,1,1 UNION ALL
  SELECT 'SA','BANK_IBAN',0,24,1 UNION ALL
  SELECT 'SA','STC_PAY',0,2,1 UNION ALL
  SELECT 'AE','BANK_IBAN',0,24,1 UNION ALL
  SELECT 'TR','BANK_IBAN',0,24,1
) m ON m.iso = c.iso_code
JOIN payout_methods p ON p.code = m.mcode
ON DUPLICATE KEY UPDATE fee_minor=VALUES(fee_minor), processing_hours=VALUES(processing_hours), is_active=VALUES(is_active);
