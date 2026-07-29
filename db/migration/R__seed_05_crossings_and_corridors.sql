-- Repeatable seed: Middle East border crossings, corridors and their document checklists.

INSERT INTO border_crossings (code, name_key, lat, lng, country_a_id, country_b_id, is_active)
SELECT x.code, x.name_key, x.lat, x.lng, a.id, b.id, 1 FROM (
  SELECT 'HABUR_IBRAHIM_KHALIL' AS code,'crossing.habur_ibrahim_khalil' AS name_key,
         37.1900 AS lat,42.7000 AS lng,'TR' AS ca,'IQ' AS cb UNION ALL
  SELECT 'OVAKOY','crossing.ovakoy',37.1200,42.2000,'TR','IQ' UNION ALL
  SELECT 'TREBIL_KARAMA','crossing.trebil_karama',32.7500,38.7900,'IQ','JO' UNION ALL
  SELECT 'SAFWAN_ABDALI','crossing.safwan_abdali',30.0700,47.7100,'IQ','KW' UNION ALL
  SELECT 'MEHRAN','crossing.mehran',33.1200,46.1700,'IQ','IR' UNION ALL
  SELECT 'SHALAMCHEH','crossing.shalamcheh',30.4700,48.0400,'IQ','IR' UNION ALL
  SELECT 'PARVIZKHAN','crossing.parvizkhan',34.3500,45.7500,'IQ','IR' UNION ALL
  SELECT 'ARAR_JADIDAT','crossing.arar_jadidat',31.0000,41.1000,'IQ','SA' UNION ALL
  SELECT 'QAIM_ALBUKAMAL','crossing.qaim_albukamal',34.4200,41.0300,'IQ','SY' UNION ALL
  SELECT 'AL_HADITHA','crossing.al_haditha',31.4700,37.1400,'JO','SA' UNION ALL
  SELECT 'AL_DURRA','crossing.al_durra',29.3500,34.9600,'JO','SA' UNION ALL
  SELECT 'JABER_NASSIB','crossing.jaber_nassib',32.5300,36.2900,'JO','SY' UNION ALL
  SELECT 'AL_BATHA','crossing.al_batha',24.1400,51.6000,'SA','AE' UNION ALL
  SELECT 'KING_FAHD_CAUSEWAY','crossing.king_fahd_causeway',26.1800,50.3400,'SA','BH' UNION ALL
  SELECT 'HATTA','crossing.hatta',24.7900,56.1200,'AE','OM' UNION ALL
  SELECT 'AL_AIN_BURAIMI','crossing.al_ain_buraimi',24.2300,55.7800,'AE','OM'
) x
JOIN countries a ON a.iso_code = x.ca
JOIN countries b ON b.iso_code = x.cb
ON DUPLICATE KEY UPDATE name_key=VALUES(name_key), lat=VALUES(lat), lng=VALUES(lng);

-- One corridor row per direction so each side can carry its own fees.
INSERT INTO corridors (from_country_id, to_country_id, crossing_id, name_key, is_active)
SELECT a.id, b.id, bc.id,
       CONCAT('corridor.', LOWER(a.iso_code), '_', LOWER(b.iso_code), '.', LOWER(bc.code)), 1
FROM border_crossings bc
JOIN countries a ON a.id = bc.country_a_id
JOIN countries b ON b.id = bc.country_b_id
ON DUPLICATE KEY UPDATE name_key=VALUES(name_key);

INSERT INTO corridors (from_country_id, to_country_id, crossing_id, name_key, is_active)
SELECT b.id, a.id, bc.id,
       CONCAT('corridor.', LOWER(b.iso_code), '_', LOWER(a.iso_code), '.', LOWER(bc.code)), 1
FROM border_crossings bc
JOIN countries a ON a.id = bc.country_a_id
JOIN countries b ON b.id = bc.country_b_id
ON DUPLICATE KEY UPDATE name_key=VALUES(name_key);

-- Default customs checklist for every corridor.
INSERT IGNORE INTO corridor_documents (corridor_id, doc_type, mandatory)
SELECT c.id, d.doc_type, d.mandatory FROM corridors c
CROSS JOIN (
  SELECT 'COMMERCIAL_INVOICE' AS doc_type, 1 AS mandatory UNION ALL
  SELECT 'PACKING_LIST',1 UNION ALL
  SELECT 'CARGO_MANIFEST',1 UNION ALL
  SELECT 'CERTIFICATE_OF_ORIGIN',1 UNION ALL
  SELECT 'TRANSIT_PERMIT',1 UNION ALL
  SELECT 'TIR_CARNET',0 UNION ALL
  SELECT 'VETERINARY_CERTIFICATE',0 UNION ALL
  SELECT 'HEALTH_CERTIFICATE',0 UNION ALL
  SELECT 'DANGEROUS_GOODS_DECLARATION',0
) d;
