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

-- Astronauts (5+)
INSERT INTO Astronaut(first_name, last_name, email, specialization, years_experience, status, created_at)
VALUES
('Neil', 'Armstrong', 'neil.armstrong@space.gov', 'Planetary Science', 15, 'active', CURRENT_TIMESTAMP),
('Buzz', 'Aldrin', 'buzz.aldrin@space.gov', 'Orbital Mechanics', 14, 'active', CURRENT_TIMESTAMP - interval '1 day'),
('Yuri', 'Gagarin', 'yuri.gagarin@space.gov', 'Flight Operations', 12, 'retired', CURRENT_TIMESTAMP - interval '2 days'),
('Sally', 'Ride', 'sally.ride@space.gov', 'Engineering', 13, 'active', CURRENT_TIMESTAMP - interval '3 days'),
('Alan', 'Bean', 'alan.bean@space.gov', 'Geology', 11, 'active', CURRENT_TIMESTAMP - interval '4 days'),
('Valentina', 'Tereshkova', 'valentina.tereshkova@space.gov', 'Systems Engineering', 10, 'retired', CURRENT_TIMESTAMP - interval '5 days');

-- App Users (3: admin, operator, analyst)
INSERT INTO App_User(username, email, role, created_at, last_login)
VALUES
('admin_user', 'admin@mission.local', 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('operator_team', 'operator@mission.local', 'operator', CURRENT_TIMESTAMP - interval '1 hour', CURRENT_TIMESTAMP - interval '30 minutes'),
('analyst_data', 'analyst@mission.local', 'analyst', CURRENT_TIMESTAMP - interval '2 hours', CURRENT_TIMESTAMP - interval '1 hour');

-- Launch Sites (2+)
INSERT INTO Launch_Site(name, location, country, capabilities)
VALUES
('Kennedy Space Center', 'Cape Canaveral, Florida', 'USA', 'Heavy lift, manned missions'),
('Baikonur Cosmodrome', 'Baikonur, Kazakhstan', 'Kazakhstan', 'All classes, highest cadence');

-- Launches (3)
INSERT INTO Launch(mission_id, launch_site_id, launch_date, status, notes, created_at)
VALUES
(1, 1, CURRENT_TIMESTAMP + interval '5 days', 'scheduled', 'First launch for Lunar Survey', CURRENT_TIMESTAMP),
(2, 2, CURRENT_TIMESTAMP - interval '5 days', 'completed', 'Successfully reached Mars relay orbit', CURRENT_TIMESTAMP - interval '6 days'),
(3, 1, CURRENT_TIMESTAMP - interval '120 days', 'completed', 'Asteroid sample return mission', CURRENT_TIMESTAMP - interval '121 days');

-- Maintenance Schedule (5+)
INSERT INTO Maintenance_Schedule(spacecraft_id, start_time, end_time, subsystem_id, maintenance_type, status, notes)
VALUES
(1, CURRENT_TIMESTAMP + interval '2 days', CURRENT_TIMESTAMP + interval '2 days 4 hours', 1, 'Preventive', 'scheduled', 'Power system check'),
(1, CURRENT_TIMESTAMP + interval '4 days', CURRENT_TIMESTAMP + interval '4 days 6 hours', 2, 'Preventive', 'scheduled', 'Navigation calibration'),
(2, CURRENT_TIMESTAMP + interval '1 day', CURRENT_TIMESTAMP + interval '1 day 3 hours', 6, 'Corrective', 'in-progress', 'Comms antenna repair'),
(2, CURRENT_TIMESTAMP + interval '3 days', CURRENT_TIMESTAMP + interval '3 days 2 hours', 5, 'Preventive', 'scheduled', 'Power supply inspection'),
(3, CURRENT_TIMESTAMP + interval '7 days', CURRENT_TIMESTAMP + interval '7 days 5 hours', 9, 'Preventive', 'scheduled', 'Full system health check'),
(3, CURRENT_TIMESTAMP + interval '10 days', CURRENT_TIMESTAMP + interval '10 days 4 hours', 10, 'Preventive', 'scheduled', 'Navigation system audit');

-- Ground Station Schedule (5+)
INSERT INTO Ground_Station_Schedule(station_id, start_time, end_time, purpose, status, notes)
VALUES
(1, CURRENT_TIMESTAMP + interval '6 hours', CURRENT_TIMESTAMP + interval '8 hours', 'Communication window', 'scheduled', 'Canberra link to Odyssey'),
(2, CURRENT_TIMESTAMP + interval '12 hours', CURRENT_TIMESTAMP + interval '14 hours', 'Data downlink', 'scheduled', 'Nairobi data reception'),
(3, CURRENT_TIMESTAMP + interval '18 hours', CURRENT_TIMESTAMP + interval '20 hours', 'Command uplink', 'scheduled', 'Madrid command transmission'),
(1, CURRENT_TIMESTAMP + interval '24 hours', CURRENT_TIMESTAMP + interval '26 hours', 'Telemetry', 'scheduled', 'Canberra telemetry collection'),
(2, CURRENT_TIMESTAMP + interval '36 hours', CURRENT_TIMESTAMP + interval '38 hours', 'System check', 'scheduled', 'Nairobi system verification');

-- Mission Crew assignments
INSERT INTO Mission_Crew(mission_id, astronaut_id, role, assignment_date)
VALUES
(1, 1, 'Commander', CURRENT_TIMESTAMP - interval '30 days'),
(1, 2, 'Pilot', CURRENT_TIMESTAMP - interval '30 days'),
(1, 4, 'Mission Specialist', CURRENT_TIMESTAMP - interval '25 days'),
(2, 3, 'Flight Engineer', CURRENT_TIMESTAMP - interval '45 days'),
(2, 5, 'Payload Specialist', CURRENT_TIMESTAMP - interval '40 days'),
(3, 1, 'Sample Collection', CURRENT_TIMESTAMP - interval '130 days'),
(3, 6, 'Data Analysis', CURRENT_TIMESTAMP - interval '125 days');

-- Mission Experiments
INSERT INTO Mission_Experiments(mission_id, experiment_id)
VALUES
(1, 1),
(2, 2),
(3, 3);

-- Mission Spacecraft Assignments
INSERT INTO Mission_Spacecraft_Assignment(mission_id, spacecraft_id, role, assignment_date)
VALUES
(1, 1, 'Primary Lander', CURRENT_TIMESTAMP - interval '60 days'),
(2, 2, 'Relay Satellite', CURRENT_TIMESTAMP - interval '90 days'),
(3, 3, 'Sample Return Vehicle', CURRENT_TIMESTAMP - interval '150 days');

-- Mission Timeline events
INSERT INTO Mission_Timeline(mission_id, event_name, event_date, description, status, created_at)
VALUES
(1, 'Launch', CURRENT_TIMESTAMP + interval '5 days', 'Mission launch from Kennedy Space Center', 'scheduled', CURRENT_TIMESTAMP),
(1, 'Lunar Orbit Insertion', CURRENT_TIMESTAMP + interval '7 days', 'Enter lunar orbit', 'scheduled', CURRENT_TIMESTAMP),
(1, 'Landing Site Selection', CURRENT_TIMESTAMP + interval '9 days', 'Confirm landing coordinates', 'scheduled', CURRENT_TIMESTAMP),
(2, 'Relay Deployment', CURRENT_TIMESTAMP - interval '2 days', 'Deploy communication relay satellite', 'in-progress', CURRENT_TIMESTAMP - interval '3 days'),
(2, 'Signal Acquisition', CURRENT_TIMESTAMP + interval '10 days', 'First signal received at Earth stations', 'scheduled', CURRENT_TIMESTAMP),
(3, 'Sample Return', CURRENT_TIMESTAMP - interval '95 days', 'Samples arrived at Earth', 'completed', CURRENT_TIMESTAMP - interval '100 days'),
(3, 'Analysis Complete', CURRENT_TIMESTAMP - interval '90 days', 'Laboratory analysis finished', 'completed', CURRENT_TIMESTAMP - interval '92 days');

COMMIT;
