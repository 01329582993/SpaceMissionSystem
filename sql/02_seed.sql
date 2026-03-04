BEGIN;

-- =====================================
-- 0. FIX SCHEMA CONSTRAINTS (Ensures ON CONFLICT works)
-- =====================================
-- We use a DO block to add unique constraints only if they don't exist.
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'users_username_key') THEN
        ALTER TABLE users ADD CONSTRAINT users_username_key UNIQUE (username);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'mission_name_key') THEN
        ALTER TABLE mission ADD CONSTRAINT mission_name_key UNIQUE (name);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'budget_mission_id_key') THEN
        ALTER TABLE budget ADD CONSTRAINT budget_mission_id_key UNIQUE (mission_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'spacecraft_name_key') THEN
        ALTER TABLE spacecraft ADD CONSTRAINT spacecraft_name_key UNIQUE (name);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'astronaut_name_key') THEN
        ALTER TABLE astronaut ADD CONSTRAINT astronaut_name_key UNIQUE (name);
    END IF;
END $$;

-- =====================================
-- 1. USERS (Full List)
-- =====================================

-- COMMANDERS
INSERT INTO users (username, email, password, role) VALUES
('cmd_hudson', 'hudson@space.sys', 'pass123', 'Commander'),
('cmd_shepard', 'shepard@space.sys', 'pass123', 'Commander'),
('cmd_grant', 'grant@space.sys', 'pass123', 'Commander'),
('cmd_ryan', 'ryan@space.sys', 'pass123', 'Commander'),
('cmd_keller', 'keller@space.sys', 'pass123', 'Commander'),
('cmd_ross', 'ross@space.sys', 'pass123', 'Commander'),
('cmd_mason', 'mason@space.sys', 'pass123', 'Commander'),
('cmd_hart', 'hart@space.sys', 'pass123', 'Commander'),
('cmd_fisher', 'fisher@space.sys', 'pass123', 'Commander'),
('cmd_sato', 'sato@space.sys', 'pass123', 'Commander')
ON CONFLICT (username) DO NOTHING;

-- PILOTS
INSERT INTO users (username, email, password, role) VALUES
('pilot_alex', 'alex@space.sys', 'pass123', 'Pilot'),
('pilot_maria', 'maria@space.sys', 'pass123', 'Pilot'),
('pilot_liam', 'liam@space.sys', 'pass123', 'Pilot'),
('pilot_emma', 'emma@space.sys', 'pass123', 'Pilot'),
('pilot_noah', 'noah@space.sys', 'pass123', 'Pilot'),
('pilot_olivia', 'olivia@space.sys', 'pass123', 'Pilot'),
('pilot_ethan', 'ethan@space.sys', 'pass123', 'Pilot'),
('pilot_sophia', 'sophia@space.sys', 'pass123', 'Pilot'),
('pilot_mason', 'mason2@space.sys', 'pass123', 'Pilot'),
('pilot_ava', 'ava@space.sys', 'pass123', 'Pilot')
ON CONFLICT (username) DO NOTHING;

-- ANALYSTS
INSERT INTO users (username, email, password, role) VALUES
('analyst_sara', 'sara@space.sys', 'pass123', 'Analyst'),
('analyst_lee', 'lee@space.sys', 'pass123', 'Analyst'),
('analyst_ryan', 'ryan2@space.sys', 'pass123', 'Analyst'),
('analyst_anna', 'anna@space.sys', 'pass123', 'Analyst'),
('analyst_jake', 'jake@space.sys', 'pass123', 'Analyst'),
('analyst_clara', 'clara@space.sys', 'pass123', 'Analyst'),
('analyst_mike', 'mike@space.sys', 'pass123', 'Analyst'),
('analyst_lily', 'lily@space.sys', 'pass123', 'Analyst'),
('analyst_dan', 'dan@space.sys', 'pass123', 'Analyst'),
('analyst_eve', 'eve@space.sys', 'pass123', 'Analyst')
ON CONFLICT (username) DO NOTHING;

-- ENGINEERS
INSERT INTO users (username, email, password, role) VALUES
('eng_vince', 'vince@space.sys', 'pass123', 'Engineer'),
('eng_priya', 'priya@space.sys', 'pass123', 'Engineer'),
('eng_omar', 'omar@space.sys', 'pass123', 'Engineer'),
('eng_julia', 'julia@space.sys', 'pass123', 'Engineer'),
('eng_hassan', 'hassan@space.sys', 'pass123', 'Engineer'),
('eng_rachel', 'rachel@space.sys', 'pass123', 'Engineer'),
('eng_tom', 'tom@space.sys', 'pass123', 'Engineer'),
('eng_linda', 'linda@space.sys', 'pass123', 'Engineer'),
('eng_kate', 'kate@space.sys', 'pass123', 'Engineer'),
('eng_ali', 'ali@space.sys', 'pass123', 'Engineer')
ON CONFLICT (username) DO NOTHING;

-- ADMIN & MEDICAL
INSERT INTO users (username, email, password, role) VALUES
('safety_clara', 'clara@space.sys', 'pass123', 'Admin'),
('doc_smith', 'smith@space.sys', 'pass123', 'Medical'),
('ai_interface', 'ai@space.sys', 'pass123', 'Analyst'),
('science_lee', 'lee2@space.sys', 'pass123', 'Analyst'),
('ops_blake', 'blake@space.sys', 'pass123', 'Admin')
ON CONFLICT (username) DO UPDATE SET role = EXCLUDED.role;

-- =====================================
-- 2. MISSIONS (Corrected Statuses)
-- =====================================

INSERT INTO mission (name, status, start_date, end_date, objective, commander_id, created_by)
VALUES
('Venus Orbit', 'Planned', CURRENT_DATE + 30, CURRENT_DATE + 200, 'Atmospheric probe deployment', 
    (SELECT user_id FROM users WHERE username='cmd_hudson' LIMIT 1),
    (SELECT user_id FROM users WHERE username='pilot_alex' LIMIT 1)),

('Europa Ice Drill', 'Planned', CURRENT_DATE + 365, CURRENT_DATE + 800, 'Search for biosignatures in sub-surface ocean',
    (SELECT user_id FROM users WHERE username='cmd_shepard' LIMIT 1),
    (SELECT user_id FROM users WHERE username='pilot_maria' LIMIT 1)),

('ISS Resupply', 'Active', CURRENT_DATE - 2, CURRENT_DATE + 10, 'Cargo delivery and waste removal',
    (SELECT user_id FROM users WHERE username='cmd_grant' LIMIT 1),
    (SELECT user_id FROM users WHERE username='pilot_liam' LIMIT 1)),

('Solar Flare Study', 'Active', CURRENT_DATE - 10, CURRENT_DATE + 40, 'Observation of sunspot activity',
    (SELECT user_id FROM users WHERE username='cmd_ryan' LIMIT 1),
    (SELECT user_id FROM users WHERE username='pilot_emma' LIMIT 1)),

('Titan Landing', 'Planned', CURRENT_DATE + 500, CURRENT_DATE + 1500, 'Methane lake exploration',
    (SELECT user_id FROM users WHERE username='cmd_keller' LIMIT 1),
    (SELECT user_id FROM users WHERE username='pilot_noah' LIMIT 1)),

('Satellite Repair', 'Completed', CURRENT_DATE - 30, CURRENT_DATE - 25, 'Correction of orbital decay for Hubble-2',
    (SELECT user_id FROM users WHERE username='cmd_ross' LIMIT 1),
    (SELECT user_id FROM users WHERE username='pilot_olivia' LIMIT 1)),

('Deep Space Gateway', 'Active', CURRENT_DATE - 50, CURRENT_DATE + 300, 'Station construction phase 1',
    (SELECT user_id FROM users WHERE username='cmd_mason' LIMIT 1),
    (SELECT user_id FROM users WHERE username='pilot_ethan' LIMIT 1)),

('Ceres Survey', 'Planned', CURRENT_DATE + 120, CURRENT_DATE + 400, 'Dwarf planet mineral mapping',
    (SELECT user_id FROM users WHERE username='cmd_hart' LIMIT 1),
    (SELECT user_id FROM users WHERE username='pilot_sophia' LIMIT 1)),

('Space Tourism 1', 'Completed', CURRENT_DATE - 5, CURRENT_DATE - 1, 'First sub-orbital private flight test',
    (SELECT user_id FROM users WHERE username='cmd_fisher' LIMIT 1),
    (SELECT user_id FROM users WHERE username='pilot_mason' LIMIT 1)),

('Kuiper Belt Probe', 'Planned', CURRENT_DATE + 1000, CURRENT_DATE + 5000, 'Long-range imagery of Pluto-area objects',
    (SELECT user_id FROM users WHERE username='cmd_sato' LIMIT 1),
    (SELECT user_id FROM users WHERE username='pilot_ava' LIMIT 1))
ON CONFLICT (name) DO UPDATE SET 
    status = EXCLUDED.status,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date;

-- =====================================
-- 3. BUDGET
-- =====================================

INSERT INTO budget (mission_id, allocated, spent)
SELECT m.mission_id, b.allocated, b.spent
FROM (
    VALUES
    ('Venus Orbit', 12000000, 2000000),
    ('Europa Ice Drill', 45000000, 500000),
    ('ISS Resupply', 4000000, 3950000),
    ('Solar Flare Study', 8500000, 4200000),
    ('Titan Landing', 60000000, 1000000),
    ('Satellite Repair', 2500000, 2450000),
    ('Deep Space Gateway', 150000000, 90000000),
    ('Ceres Survey', 18000000, 0),
    ('Space Tourism 1', 1000000, 950000),
    ('Kuiper Belt Probe', 200000000, 12000000)
) AS b(name, allocated, spent)
JOIN mission m ON m.name = b.name
ON CONFLICT (mission_id) DO UPDATE SET allocated = EXCLUDED.allocated, spent = EXCLUDED.spent;

-- =====================================
-- 4. SPACECRAFT
-- =====================================

INSERT INTO spacecraft (name, model, health_status, mission_id)
VALUES 
('Valkyrie-1', 'Heavy Lifter', 'Operational', (SELECT mission_id FROM mission WHERE name='ISS Resupply' LIMIT 1)),
('Odyssey', 'Science Vessel', 'Operational', (SELECT mission_id FROM mission WHERE name='Solar Flare Study' LIMIT 1)),
('Star-Runner', 'Transport', 'Operational', (SELECT mission_id FROM mission WHERE name='Deep Space Gateway' LIMIT 1)),
('Icarus-X', 'Deep Space', 'Maintenance', (SELECT mission_id FROM mission WHERE name='Venus Orbit' LIMIT 1))
ON CONFLICT (name) DO NOTHING;

-- =====================================
-- 5. ASTRONAUTS
-- =====================================

INSERT INTO astronaut (name, rank, role, availability, current_mission_id)
VALUES
('Commander Hudson', 'Captain', 'Commander', 'On Mission', (SELECT mission_id FROM mission WHERE name='ISS Resupply' LIMIT 1)),
('Dr. Aris Thorne', 'Chief Scientist', 'Medical', 'On Mission', (SELECT mission_id FROM mission WHERE name='Solar Flare Study' LIMIT 1)),
('Sarah Miller', 'Lieutenant', 'Engineer', 'On Mission', (SELECT mission_id FROM mission WHERE name='Deep Space Gateway' LIMIT 1))
ON CONFLICT (name) DO NOTHING;


INSERT INTO system_alerts (type, message, status) VALUES 
('critical', 'REACTOR CORE OVERHEATING: THERMAL LIMIT EXCEEDED', 'active'),
('warning', 'UNAUTHORIZED ACCESS DETECTED IN MAINFRAME NODE 4', 'active'),
('info', 'SHUTTLE CRAFT DELTA-1 HAS DOCKED SUCCESSFULLY', 'active'),
('critical', 'EXTERNAL COMMS ARRAY OFFLINE: SIGNAL LOSS IN SECTOR 4', 'active'),
('warning', 'PROXIMITY ALERT: UNIDENTIFIED DEBRIS IN FLIGHT PATH', 'active'),
('info', 'HYDROPONICS BAY 4 ATMOSPHERIC STABILIZATION COMPLETE', 'active'),
('warning', 'POWER FLUCTUATION DETECTED IN DECK 12 SUB-GRID', 'active'),
('critical', 'BIO-HAZARD LEAK REPORTED IN MEDICAL LABORATORY 2', 'active'),
('info', 'AUTOMATED MAINTENANCE DRONES DEPLOYED TO HULL EXTERIOR', 'active'),
('warning', 'FUEL RESERVES DROPPING BELOW 15 PERCENT THRESHOLD', 'active');
-- =====================================
-- 6. HEALTH & TELEMETRY
-- =====================================

INSERT INTO life_support_telemetry (spacecraft_id, o2_level, co2_level, temperature, humidity, radiation_level)
VALUES
((SELECT spacecraft_id FROM spacecraft WHERE name='Valkyrie-1' LIMIT 1), 21.0, 0.04, 22.5, 45.0, 0.012),
((SELECT spacecraft_id FROM spacecraft WHERE name='Odyssey' LIMIT 1), 20.8, 0.05, 21.0, 40.0, 0.045),
((SELECT spacecraft_id FROM spacecraft WHERE name='Star-Runner' LIMIT 1), 19.5, 0.08, 23.0, 50.0, 0.022)
ON CONFLICT DO NOTHING;

INSERT INTO crew_vitals (astronaut_id, heart_rate, blood_pressure_sys, blood_pressure_dia, body_temp, stress_level)
VALUES
((SELECT astronaut_id FROM astronaut WHERE name='Commander Hudson' LIMIT 1), 72, 120, 80, 36.6, 15),
((SELECT astronaut_id FROM astronaut WHERE name='Dr. Aris Thorne' LIMIT 1), 85, 125, 82, 36.8, 45),
((SELECT astronaut_id FROM astronaut WHERE name='Sarah Miller' LIMIT 1), 68, 118, 78, 36.5, 10)
ON CONFLICT DO NOTHING;

-- AUDIT META (only insert if a valid audit_log record exists)
INSERT INTO audit_meta (log_id, origin_node, auth_level, request_method, process_signature)
SELECT log_id, 'UPPER_LAB_4', 'SUPERUSER_OVERRIDE', 'REST_API', '0xAFF99'
FROM audit_log
ORDER BY log_id
LIMIT 1;

INSERT INTO telemetry (spacecraft_id, temperature, voltage, fuel_level, radiation)
SELECT spacecraft_id, 22.0, 120.0, 95.0, 0.01 FROM spacecraft
ON CONFLICT DO NOTHING;

INSERT INTO alerts (type, message)
SELECT 
    CASE WHEN (i % 5 = 0) THEN 'critical' ELSE 'info' END,
    'SYSTEM_TRACE_LOG_SIGNAL_ALPHA_' || i
FROM generate_series(1, 120) s(i);
-- =====================================
-- 7. REFRESH DASHBOARD VIEW
-- =====================================

DROP VIEW IF EXISTS mission_dashboard;
CREATE VIEW mission_dashboard AS
SELECT 
    m.mission_id,
    m.name AS mission_name,
    m.status AS mission_status,
    m.objective,
    (SELECT COUNT(*) FROM spacecraft s WHERE s.mission_id = m.mission_id) AS spacecraft_count,
    (SELECT COUNT(*) FROM alert a WHERE a.mission_id = m.mission_id) AS alert_count
FROM mission m;

COMMIT;