-- Repeatable seed: vehicle and cargo catalogs.

INSERT INTO vehicle_types
  (code, name_key, max_capacity_kg, icon_key, refrigerated, distance_band_key, sort_order, is_active)
VALUES
  ('BOX_TRUCK','vehicle.box_truck',10000,'truck_box',0,'SHORT',10,1),
  ('FLATBED','vehicle.flatbed',15000,'truck_flatbed',0,'SHORT',20,1),
  ('TRAILER','vehicle.trailer',25000,'truck_trailer',0,'LONG',30,1),
  ('REFRIGERATED','vehicle.refrigerated',7000,'truck_reefer',1,'SHORT',40,1),
  ('TANKER','vehicle.tanker',20000,'truck_tanker',0,'LONG',50,1),
  ('DUMP_TRUCK','vehicle.dump_truck',12000,'truck_dump',0,'SHORT',60,1),
  ('CONTAINER_CHASSIS','vehicle.container_chassis',30000,'truck_container',0,'PORT',70,1),
  ('LOWBED','vehicle.lowbed',40000,'truck_lowbed',0,'LONG',80,1)
ON DUPLICATE KEY UPDATE
  name_key=VALUES(name_key), max_capacity_kg=VALUES(max_capacity_kg),
  icon_key=VALUES(icon_key), distance_band_key=VALUES(distance_band_key);

INSERT IGNORE INTO country_vehicle_types (country_id, vehicle_type_id, is_active)
SELECT c.id, v.id, 1 FROM countries c CROSS JOIN vehicle_types v;

INSERT INTO cargo_types
  (code, name_key, icon_key, restricted, requires_refrigeration, sort_order, is_active)
VALUES
  ('FOODSTUFF','cargo.foodstuff','cargo_food',0,0,10,1),
  ('FURNITURE','cargo.furniture','cargo_furniture',0,0,20,1),
  ('CONSTRUCTION','cargo.construction','cargo_construction',0,0,30,1),
  ('COSMETICS','cargo.cosmetics','cargo_cosmetics',0,0,40,1),
  ('MACHINERY','cargo.machinery','cargo_machinery',0,0,50,1),
  ('ELECTRONICS','cargo.electronics','cargo_electronics',0,0,60,1),
  ('TEXTILES','cargo.textiles','cargo_textiles',0,0,70,1),
  ('CHILLED_GOODS','cargo.chilled_goods','cargo_chilled',0,1,80,1),
  ('LIVESTOCK','cargo.livestock','cargo_livestock',1,0,90,1),
  ('CHEMICALS','cargo.chemicals','cargo_chemicals',1,0,100,1),
  ('FUEL','cargo.fuel','cargo_fuel',1,0,110,1),
  ('OTHER','cargo.other','cargo_other',0,0,999,1)
ON DUPLICATE KEY UPDATE
  name_key=VALUES(name_key), restricted=VALUES(restricted),
  requires_refrigeration=VALUES(requires_refrigeration);
