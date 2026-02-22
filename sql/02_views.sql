-- sql/02_views.sql

-- 1. Active Missions Overview
CREATE OR REPLACE VIEW vw_active_missions AS
SELECT 
    m.mission_id,
    m.name AS mission_name,
    m.status,
    m.start_date,
    m.end_date,
    m.commander,
    (SELECT COUNT(*) FROM spacecraft s WHERE s.mission_id = m.mission_id) AS spacecraft_count
FROM mission m
WHERE m.status IN ('Active', 'Planned');

-- 2. Mission Summary with Crew Count
CREATE OR REPLACE VIEW vw_mission_summary AS
SELECT 
    m.mission_id,
    m.name,
    m.status,
    m.start_date,
    (SELECT COUNT(*) FROM mission) as total_missions
FROM mission m;

CREATE OR REPLACE VIEW vw_mission_summary_enhanced AS
SELECT 
    m.mission_id,
    m.name,
    m.status,
    COUNT(mc.astronaut_id) as crew_count
FROM mission m
LEFT JOIN mission_crew mc ON m.mission_id = mc.mission_id
GROUP BY m.mission_id, m.name, m.status;

-- 3. Latest Telemetry per Subsystem
CREATE OR REPLACE VIEW vw_telemetry_latest AS
SELECT DISTINCT ON (t.spacecraft_id)
    t.spacecraft_id,
    s.name AS spacecraft_name,
    t.temperature,
    t.voltage,
    t.fuel_level,
    t.radiation,
    t.recorded_at
FROM telemetry t
JOIN spacecraft s ON t.spacecraft_id = s.spacecraft_id
ORDER BY t.spacecraft_id, t.recorded_at DESC;

