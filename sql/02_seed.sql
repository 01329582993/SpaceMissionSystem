-- sql/02_seed.sql
BEGIN;

-- Missions (3)
INSERT INTO Mission(name, status, start_date, end_date, objectives)
VALUES
('Lunar Survey', 'planned', CURRENT_DATE, CURRENT_DATE + 14, 'Map lunar surface and collect imagery'),
('Mars Relay', 'active', CURRENT_DATE - 5, CURRENT_DATE + 60, 'Deploy comm relay and test long-range telemetry'),
('Asteroid Sample', 'completed', CURRENT_DATE - 120, CURRENT_DATE - 90, 'Collect samples and return analysis')
RETURNING mission_id;

-- If your pgAdmin doesn’t show RETURNING nicely, missions will be IDs 1..3 on a fresh DB.

-- Mission phases
INSERT INTO Mission_Phase(mission_id, phase_name, start_time, end_time)
VALUES
(1, 'Preparation', now() + interval '1 day', now() + interval '2 days'),
(1, 'Launch',      now() + interval '3 days', now() + interval '3 days 2 hours'),
(2, 'Cruise',      now() - interval '5 days', now() + interval '20 days'),
(2, 'Operations',  now() + interval '20 days', now() + interval '55 days'),
(3, 'Recovery',    now() - interval '95 days', now() - interval '90 days');

-- Spacecraft (3) assign 2 to missions, 1 idle
INSERT INTO Spacecraft(name, fuel_level, health_status, mission_id)
VALUES
('Odyssey', 78.5, 'good', 1),
('Nova',    45.2, 'warning', 2),
('Astra',   92.0, 'excellent', NULL);

-- Subsystems (4 each)
INSERT INTO Spacecraft_Subsystem(spacecraft_id, name, health_score)
VALUES
(1,'power',88),(1,'nav',91),(1,'comms',84),(1,'thermal',79),
(2,'power',70),(2,'nav',75),(2,'comms',60),(2,'thermal',66),
(3,'power',95),(3,'nav',93),(3,'comms',90),(3,'thermal',92);

-- Maintenance logs (a few)
INSERT INTO Maintenance_Log(subsystem_id, description, log_time)
VALUES
(7, 'Replaced antenna feed, signal improved', now() - interval '2 days'),
(6, 'Navigation calibration check', now() - interval '1 day'),
(5, 'Power bus inspection', now() - interval '3 days');

-- Telemetry (100 rows across spacecraft)
INSERT INTO Telemetry(spacecraft_id, temperature, voltage, fuel_level, radiation, recorded_at)
SELECT
  (CASE WHEN gs.i % 3 = 0 THEN 1 WHEN gs.i % 3 = 1 THEN 2 ELSE 3 END) AS spacecraft_id,
  15 + random()*30,          -- temperature
  3 + random()*2,            -- voltage
  30 + random()*70,          -- fuel_level
  random()*5,                -- radiation
  now() - (gs.i || ' minutes')::interval
FROM generate_series(1, 100) AS gs(i);

-- Alerts
INSERT INTO Alert(spacecraft_id, message, severity, created_at)
VALUES
(2, 'Comms subsystem health degraded', 'high', now() - interval '3 hours'),
(1, 'Thermal fluctuation detected', 'medium', now() - interval '8 hours'),
(2, 'Radiation spike detected', 'critical', now() - interval '30 minutes');

-- Ground stations
INSERT INTO Ground_Station(name, location)
VALUES
('GS-Canberra','Australia'),
('GS-Nairobi','Kenya'),
('GS-Madrid','Spain')
ON CONFLICT DO NOTHING;

-- Communication windows
INSERT INTO Communication_Window(station_id, spacecraft_id, start_time, end_time)
VALUES
(1, 1, now() + interval '1 day', now() + interval '1 day 2 hours'),
(2, 2, now() + interval '2 hours', now() + interval '4 hours'),
(3, 2, now() + interval '1 day 3 hours', now() + interval '1 day 5 hours');

-- Experiments
INSERT INTO Experiment(mission_id, name, status, result_data)
VALUES
(1, 'Regolith Imaging', 'planned', NULL),
(2, 'Radiation Exposure', 'running', NULL),
(3, 'Sample Spectroscopy', 'completed', decode('DEADBEEF','hex'));

-- Astronauts
INSERT INTO Astronaut(name, role, availability)
VALUES
('Commander Sarah Chen', 'Mission Commander', 'on-mission'),
('Dr. James Morrison', 'Science Officer', 'available'),
('Lt. Maya Rodriguez', 'Pilot', 'on-mission'),
('Engineer Tom Wu', 'Systems Engineer', 'available'),
('Dr. Lisa Patel', 'Medical Officer', 'on-leave'),
('Specialist Alex Kim', 'Communications', 'available');

COMMIT;
