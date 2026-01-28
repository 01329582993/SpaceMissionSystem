-- sql/06_demo.sql

-- 1. Setup Data
-- Insert Users
INSERT INTO Users (username, email, role) VALUES 
('admin_user', 'admin@space.com', 'Admin'),
('cmdr_shepard', 'shepard@space.com', 'Commander'),
('eng_scotty', 'scotty@space.com', 'Engineer');

-- Insert Spacecraft
INSERT INTO Spacecraft (name, model, fuel_level, health_status) VALUES 
('Explorer-1', 'Mk1', 100.0, 'Operational'),
('Voyager-X', 'Mk2', 95.5, 'Operational');

-- Insert Subsystems
INSERT INTO Spacecraft_Subsystem (spacecraft_id, name, health_score) VALUES 
(1, 'Propulsion', 98),
(1, 'Life Support', 100),
(2, 'Propulsion', 99);

-- 2. Call Procedure to Create Mission
CALL sp_create_mission_transaction('Mars Alpha', '2025-05-01', '2025-12-01', 2, 'Launch Prep');

-- 3. Assign Astronaut
CALL sp_assign_best_astronaut(1, 'Engineer'); -- Should fail if no Engineer free? Or assign scotty

-- 4. Test View
SELECT * FROM vw_active_missions;

-- 5. Test Function
SELECT fn_crew_count(1) as crew_on_mars_alpha;

-- 6. Test Trigger & Audit
UPDATE Mission SET status = 'Active' WHERE name = 'Mars Alpha';
-- This should trigger audit log

SELECT * FROM AuditLog ORDER BY created_at DESC;

-- 7. Test Fuel Consumption (Need Telemetry)
INSERT INTO Telemetry (spacecraft_id, fuel_level, recorded_at) VALUES 
(1, 100.0, '2025-05-01 10:00:00'),
(1, 90.0, '2025-05-01 14:00:00');

SELECT fn_fuel_consumption_rate(1, '2025-05-01 09:00:00', '2025-05-01 15:00:00') as fuel_rate_per_hour;
