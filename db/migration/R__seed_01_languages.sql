-- Repeatable seed: languages. Idempotent.
INSERT INTO languages (code, native_name, english_name, direction, is_active, bundle_version) VALUES
  ('en','English','English','ltr',1,1),
  ('ar','العربية','Arabic','rtl',1,1),
  ('ku','کوردی','Kurdish','rtl',0,1),
  ('tr','Türkçe','Turkish','ltr',0,1),
  ('fa','فارسی','Persian','rtl',0,1)
ON DUPLICATE KEY UPDATE
  native_name=VALUES(native_name), english_name=VALUES(english_name), direction=VALUES(direction);
