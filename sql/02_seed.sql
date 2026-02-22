BEGIN;

-- 1. Users
INSERT INTO users (username, email, role)
VALUES 
('admin_limas', 'admin@space.sys', 'Admin'),
('commander_zinnia', 'zinnia@space.sys', 'Commander')
ON CONFLICT DO NOTHING;

-- 2. Missions
INSERT INTO mission(name, status, start_date, end_date, objective, commander, created_by)
VALUES
('Lunar Survey', 'Planned', CURRENT_DATE, CURRENT_DATE + 14, 'Map lunar surface and collect imagery', 'Sarah Chen', 1),
('Mars Relay', 'Active', CURRENT_DATE - 5, CURRENT_DATE + 60, 'Deploy comm relay and test long-range telemetry', 'James Morrison', 2),
('Asteroid Sample', 'Completed', CURRENT_DATE - 120, CURRENT_DATE - 90, 'Collect samples and return analysis', 'Maya Rodriguez', 1);

-- 3. Mission Phases
INSERT INTO mission_phase(mission_id, phase_name, start_time, end_time, status)
VALUES
(1, 'Preparation', now() + interval '1 day', now() + interval '2 days', 'Active'),
(1, 'Launch',      now() + interval '3 days', now() + interval '3 days 2 hours', 'Pending'),
(2, 'Cruise',      now() - interval '5 days', now() + interval '20 days', 'Active'),
(2, 'Operations',  now() + interval '20 days', now() + interval '55 days', 'Pending'),
(3, 'Recovery',    now() - interval '95 days', now() - interval '90 days', 'Completed');

-- 4. Spacecraft
INSERT INTO spacecraft(name, fuel_level, health_status, mission_id)
VALUES
('Odyssey', 78.5, 'Operational', 1),
('Nova',    45.2, 'Operational', 2),
('Astra',   92.0, 'Operational', NULL);

-- 5. Subsystems
INSERT INTO spacecraft_subsystem(spacecraft_id, name, health_score)
VALUES
(1,'Power',88),(1,'Nav',91),(1,'Comms',84),(1,'Thermal',79),
(2,'Power',70),(2,'Nav',75),(2,'Comms',60),(2,'Thermal',66),
(3,'Power',95),(3,'Nav',93),(3,'Comms',90),(3,'Thermal',92);

-- 6. Telemetry
INSERT INTO telemetry(spacecraft_id, temperature, voltage, fuel_level, radiation, recorded_at)
SELECT
  (CASE WHEN gs.i % 3 = 0 THEN 1 WHEN gs.i % 3 = 1 THEN 2 ELSE 3 END) AS spacecraft_id,
  15 + random()*30,
  3 + random()*2,
  30 + random()*70,
  random()*5,
  now() - (gs.i || ' minutes')::interval
FROM generate_series(1, 100) AS gs(i);

-- 7. Ground Stations
INSERT INTO ground_station(name, location)
VALUES
('GS-Canberra','Australia'),
('GS-Nairobi','Kenya'),
('GS-Madrid','Spain');

-- 8. Astronauts
INSERT INTO astronaut(name, rank, role, availability)
VALUES
('Sarah Chen', 'Captain', 'Mission Commander', 'On-Mission'),
('James Morrison', 'Major', 'Science Officer', 'Available'),
('Maya Rodriguez', 'Lt. Commander', 'Pilot', 'On-Mission'),
('Tom Wu', 'Lieutenant', 'Systems Engineer', 'Available');

-- 9. Mission Crew
INSERT INTO mission_crew(mission_id, astronaut_id, position)
VALUES
(1, 1, 'Commander'),
(1, 3, 'Pilot'),
(2, 2, 'Lead Scientist'),
(3, 4, 'Operations Lead');

COMMIT;


