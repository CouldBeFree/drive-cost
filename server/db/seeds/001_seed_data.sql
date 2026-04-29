-- Seed data for DriveCost application
-- This script creates a test vehicle and fuel entries for 2026
-- 8-10 entries per month for realistic data

DO $$
DECLARE
  v_user_id INTEGER;
  v_vehicle_id INTEGER;
BEGIN
  -- Get first user
  SELECT id INTO v_user_id FROM users LIMIT 1;
  
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'No users found. Please create a user first.';
  END IF;

  -- Insert vehicle
  INSERT INTO vehicles (user_id, make, model, year, license_plate)
  VALUES (v_user_id, 'Nissan', 'Rogue', 2021, 'AA1234BB')
  ON CONFLICT DO NOTHING
  RETURNING id INTO v_vehicle_id;
  
  -- If vehicle already exists, get its ID
  IF v_vehicle_id IS NULL THEN
    SELECT id INTO v_vehicle_id FROM vehicles WHERE user_id = v_user_id AND license_plate = 'AA1234BB';
  END IF;

  RAISE NOTICE 'Vehicle ID: %', v_vehicle_id;

  -- January 2026 (9 entries)
  INSERT INTO fuel_entries (vehicle_id, date, odometer_km, liters, price_per_liter, total_cost, is_full_tank) VALUES
  (v_vehicle_id, '2026-01-03', 88000, 45.0, 38.50, 1732.50, true),
  (v_vehicle_id, '2026-01-06', 88280, 25.2, 38.20, 962.64, true),
  (v_vehicle_id, '2026-01-09', 88550, 24.3, 38.80, 942.84, true),
  (v_vehicle_id, '2026-01-13', 88820, 24.3, 39.00, 947.70, true),
  (v_vehicle_id, '2026-01-17', 89100, 25.2, 39.20, 987.84, true),
  (v_vehicle_id, '2026-01-21', 89380, 25.2, 38.90, 980.28, true),
  (v_vehicle_id, '2026-01-25', 89650, 24.3, 38.50, 935.55, true),
  (v_vehicle_id, '2026-01-28', 89920, 24.3, 38.70, 940.41, true),
  (v_vehicle_id, '2026-01-31', 90200, 25.2, 39.10, 985.32, true);

  -- February 2026 (8 entries)
  INSERT INTO fuel_entries (vehicle_id, date, odometer_km, liters, price_per_liter, total_cost, is_full_tank) VALUES
  (v_vehicle_id, '2026-02-04', 90480, 25.2, 37.80, 952.56, true),
  (v_vehicle_id, '2026-02-07', 90750, 24.3, 38.00, 923.40, true),
  (v_vehicle_id, '2026-02-11', 91030, 25.2, 38.30, 965.16, true),
  (v_vehicle_id, '2026-02-15', 91300, 24.3, 38.60, 938.01, true),
  (v_vehicle_id, '2026-02-19', 91580, 25.2, 38.90, 980.28, true),
  (v_vehicle_id, '2026-02-23', 91850, 24.3, 39.20, 952.56, true),
  (v_vehicle_id, '2026-02-26', 92120, 24.3, 39.50, 959.85, true),
  (v_vehicle_id, '2026-02-28', 92400, 25.2, 39.80, 1002.96, true);

  -- March 2026 (10 entries)
  INSERT INTO fuel_entries (vehicle_id, date, odometer_km, liters, price_per_liter, total_cost, is_full_tank) VALUES
  (v_vehicle_id, '2026-03-03', 92670, 24.3, 40.00, 972.00, true),
  (v_vehicle_id, '2026-03-06', 92950, 25.2, 40.20, 1013.04, true),
  (v_vehicle_id, '2026-03-10', 93220, 24.3, 40.50, 984.15, true),
  (v_vehicle_id, '2026-03-13', 93500, 25.2, 40.80, 1028.16, true),
  (v_vehicle_id, '2026-03-17', 93780, 25.2, 41.00, 1033.20, true),
  (v_vehicle_id, '2026-03-20', 94050, 24.3, 41.20, 1001.16, true),
  (v_vehicle_id, '2026-03-24', 94330, 25.2, 41.50, 1045.80, true),
  (v_vehicle_id, '2026-03-27', 94600, 24.3, 41.80, 1015.74, true),
  (v_vehicle_id, '2026-03-30', 94880, 25.2, 42.00, 1058.40, true),
  (v_vehicle_id, '2026-03-31', 95150, 24.3, 42.20, 1025.46, true);

  -- April 2026 (9 entries)
  INSERT INTO fuel_entries (vehicle_id, date, odometer_km, liters, price_per_liter, total_cost, is_full_tank) VALUES
  (v_vehicle_id, '2026-04-03', 95430, 25.2, 42.50, 1071.00, true),
  (v_vehicle_id, '2026-04-07', 95700, 24.3, 42.80, 1040.04, true),
  (v_vehicle_id, '2026-04-11', 95980, 25.2, 43.00, 1083.60, true),
  (v_vehicle_id, '2026-04-15', 96250, 24.3, 43.20, 1049.76, true),
  (v_vehicle_id, '2026-04-19', 96530, 25.2, 43.50, 1096.20, true),
  (v_vehicle_id, '2026-04-23', 96800, 24.3, 43.80, 1064.34, true),
  (v_vehicle_id, '2026-04-26', 97080, 25.2, 44.00, 1108.80, true),
  (v_vehicle_id, '2026-04-29', 97350, 24.3, 44.20, 1074.06, true),
  (v_vehicle_id, '2026-04-30', 97630, 25.2, 44.50, 1121.40, true);

  -- May 2026 (10 entries)
  INSERT INTO fuel_entries (vehicle_id, date, odometer_km, liters, price_per_liter, total_cost, is_full_tank) VALUES
  (v_vehicle_id, '2026-05-03', 97900, 24.3, 44.80, 1088.64, true),
  (v_vehicle_id, '2026-05-06', 98180, 25.2, 45.00, 1134.00, true),
  (v_vehicle_id, '2026-05-10', 98450, 24.3, 45.20, 1098.36, true),
  (v_vehicle_id, '2026-05-13', 98730, 25.2, 45.50, 1146.60, true),
  (v_vehicle_id, '2026-05-17', 99000, 24.3, 45.80, 1112.94, true),
  (v_vehicle_id, '2026-05-20', 99280, 25.2, 46.00, 1159.20, true),
  (v_vehicle_id, '2026-05-24', 99550, 24.3, 46.20, 1122.66, true),
  (v_vehicle_id, '2026-05-27', 99830, 25.2, 46.50, 1171.80, true),
  (v_vehicle_id, '2026-05-30', 100100, 24.3, 46.80, 1137.24, true),
  (v_vehicle_id, '2026-05-31', 100380, 25.2, 47.00, 1184.40, true);

  -- June 2026 (8 entries)
  INSERT INTO fuel_entries (vehicle_id, date, odometer_km, liters, price_per_liter, total_cost, is_full_tank) VALUES
  (v_vehicle_id, '2026-06-04', 100650, 24.3, 47.20, 1146.96, true),
  (v_vehicle_id, '2026-06-08', 100930, 25.2, 47.50, 1197.00, true),
  (v_vehicle_id, '2026-06-12', 101200, 24.3, 47.80, 1161.54, true),
  (v_vehicle_id, '2026-06-16', 101480, 25.2, 48.00, 1209.60, true),
  (v_vehicle_id, '2026-06-20', 101750, 24.3, 48.20, 1171.26, true),
  (v_vehicle_id, '2026-06-24', 102030, 25.2, 48.50, 1222.20, true),
  (v_vehicle_id, '2026-06-27', 102300, 24.3, 48.80, 1185.84, true),
  (v_vehicle_id, '2026-06-30', 102580, 25.2, 49.00, 1234.80, true);

  -- July 2026 (9 entries)
  INSERT INTO fuel_entries (vehicle_id, date, odometer_km, liters, price_per_liter, total_cost, is_full_tank) VALUES
  (v_vehicle_id, '2026-07-03', 102850, 24.3, 48.50, 1178.55, true),
  (v_vehicle_id, '2026-07-07', 103130, 25.2, 48.20, 1214.64, true),
  (v_vehicle_id, '2026-07-11', 103400, 24.3, 47.80, 1161.54, true),
  (v_vehicle_id, '2026-07-15', 103680, 25.2, 47.50, 1197.00, true),
  (v_vehicle_id, '2026-07-19', 103950, 24.3, 47.00, 1142.10, true),
  (v_vehicle_id, '2026-07-23', 104230, 25.2, 46.50, 1171.80, true),
  (v_vehicle_id, '2026-07-26', 104500, 24.3, 46.00, 1117.80, true),
  (v_vehicle_id, '2026-07-29', 104780, 25.2, 45.50, 1146.60, true),
  (v_vehicle_id, '2026-07-31', 105050, 24.3, 45.00, 1093.50, true);

  -- August 2026 (10 entries)
  INSERT INTO fuel_entries (vehicle_id, date, odometer_km, liters, price_per_liter, total_cost, is_full_tank) VALUES
  (v_vehicle_id, '2026-08-03', 105330, 25.2, 44.50, 1121.40, true),
  (v_vehicle_id, '2026-08-06', 105600, 24.3, 44.00, 1069.20, true),
  (v_vehicle_id, '2026-08-10', 105880, 25.2, 43.50, 1096.20, true),
  (v_vehicle_id, '2026-08-13', 106150, 24.3, 43.00, 1044.90, true),
  (v_vehicle_id, '2026-08-17', 106430, 25.2, 42.50, 1071.00, true),
  (v_vehicle_id, '2026-08-20', 106700, 24.3, 42.00, 1020.60, true),
  (v_vehicle_id, '2026-08-24', 106980, 25.2, 41.50, 1045.80, true),
  (v_vehicle_id, '2026-08-27', 107250, 24.3, 41.00, 996.30, true),
  (v_vehicle_id, '2026-08-30', 107530, 25.2, 40.50, 1020.60, true),
  (v_vehicle_id, '2026-08-31', 107800, 24.3, 40.00, 972.00, true);

  -- September 2026 (8 entries)
  INSERT INTO fuel_entries (vehicle_id, date, odometer_km, liters, price_per_liter, total_cost, is_full_tank) VALUES
  (v_vehicle_id, '2026-09-04', 108080, 25.2, 39.50, 995.40, true),
  (v_vehicle_id, '2026-09-08', 108350, 24.3, 39.00, 947.70, true),
  (v_vehicle_id, '2026-09-12', 108630, 25.2, 38.50, 970.20, true),
  (v_vehicle_id, '2026-09-16', 108900, 24.3, 38.00, 923.40, true),
  (v_vehicle_id, '2026-09-20', 109180, 25.2, 37.50, 945.00, true),
  (v_vehicle_id, '2026-09-24', 109450, 24.3, 37.00, 899.10, true),
  (v_vehicle_id, '2026-09-27', 109730, 25.2, 36.50, 919.80, true),
  (v_vehicle_id, '2026-09-30', 110000, 24.3, 36.00, 874.80, true);

  -- October 2026 (9 entries)
  INSERT INTO fuel_entries (vehicle_id, date, odometer_km, liters, price_per_liter, total_cost, is_full_tank) VALUES
  (v_vehicle_id, '2026-10-03', 110280, 25.2, 35.50, 894.60, true),
  (v_vehicle_id, '2026-10-07', 110550, 24.3, 35.00, 850.50, true),
  (v_vehicle_id, '2026-10-11', 110830, 25.2, 35.50, 894.60, true),
  (v_vehicle_id, '2026-10-15', 111100, 24.3, 36.00, 874.80, true),
  (v_vehicle_id, '2026-10-19', 111380, 25.2, 36.50, 919.80, true),
  (v_vehicle_id, '2026-10-23', 111650, 24.3, 37.00, 899.10, true),
  (v_vehicle_id, '2026-10-26', 111930, 25.2, 37.50, 945.00, true),
  (v_vehicle_id, '2026-10-29', 112200, 24.3, 38.00, 923.40, true),
  (v_vehicle_id, '2026-10-31', 112480, 25.2, 38.50, 970.20, true);

  -- November 2026 (10 entries)
  INSERT INTO fuel_entries (vehicle_id, date, odometer_km, liters, price_per_liter, total_cost, is_full_tank) VALUES
  (v_vehicle_id, '2026-11-03', 112750, 24.3, 39.00, 947.70, true),
  (v_vehicle_id, '2026-11-06', 113030, 25.2, 39.50, 995.40, true),
  (v_vehicle_id, '2026-11-10', 113300, 24.3, 40.00, 972.00, true),
  (v_vehicle_id, '2026-11-13', 113580, 25.2, 40.50, 1020.60, true),
  (v_vehicle_id, '2026-11-17', 113850, 24.3, 41.00, 996.30, true),
  (v_vehicle_id, '2026-11-20', 114130, 25.2, 41.50, 1045.80, true),
  (v_vehicle_id, '2026-11-24', 114400, 24.3, 42.00, 1020.60, true),
  (v_vehicle_id, '2026-11-27', 114680, 25.2, 42.50, 1071.00, true),
  (v_vehicle_id, '2026-11-29', 114950, 24.3, 43.00, 1044.90, true),
  (v_vehicle_id, '2026-11-30', 115230, 25.2, 43.50, 1096.20, true);

  -- December 2026 (8 entries)
  INSERT INTO fuel_entries (vehicle_id, date, odometer_km, liters, price_per_liter, total_cost, is_full_tank) VALUES
  (v_vehicle_id, '2026-12-04', 115500, 24.3, 44.00, 1069.20, true),
  (v_vehicle_id, '2026-12-08', 115780, 25.2, 44.50, 1121.40, true),
  (v_vehicle_id, '2026-12-12', 116050, 24.3, 45.00, 1093.50, true),
  (v_vehicle_id, '2026-12-16', 116330, 25.2, 45.50, 1146.60, true),
  (v_vehicle_id, '2026-12-20', 116600, 24.3, 46.00, 1117.80, true),
  (v_vehicle_id, '2026-12-24', 116880, 25.2, 46.50, 1171.80, true),
  (v_vehicle_id, '2026-12-28', 117150, 24.3, 47.00, 1142.10, true),
  (v_vehicle_id, '2026-12-31', 117430, 25.2, 47.50, 1197.00, true);

  RAISE NOTICE 'Seed completed successfully!';
  RAISE NOTICE 'Vehicle: Nissan Rogue 2021 (AA1234BB)';
  RAISE NOTICE 'Odometer range: 88,000 km → 117,430 km';
  RAISE NOTICE 'Total distance: 29,430 km';
  RAISE NOTICE 'Total fuel entries: 109 (8-10 per month)';
  RAISE NOTICE 'Average entries per month: 9.08';
END $$;
