-- sql/02_views.sql

-- 1. Active Missions Overview
CREATE OR REPLACE VIEW vw_active_missions AS
SELECT 
    m.mission_id,
    m.name AS mission_name,
    m.status,
    m.start_date,
    m.end_date,
    u.username AS commander,
    (SELECT COUNT(*) FROM Spacecraft s WHERE s.current_mission_id = m.mission_id) AS spacecraft_count
FROM Mission m
LEFT JOIN Users u ON m.created_by = u.user_id
WHERE m.status IN ('Active', 'Planned');

-- 2. Mission Summary with Crew Count

CREATE OR REPLACE VIEW vw_mission_summary AS
SELECT 
    m.mission_id,
    m.name,
    m.status,
    m.start_date,
 
    (SELECT COUNT(*) FROM Mission) as total_missions -- Placeholder until function exists
FROM Mission m;


-- Mission_Crew table now defined in schema.

CREATE OR REPLACE VIEW vw_mission_summary_enhanced AS
SELECT 
    m.mission_id,
    m.name,
    m.status,
    COUNT(mc.astronaut_id) as crew_count
FROM Mission m
LEFT JOIN Mission_Crew mc ON m.mission_id = mc.mission_id
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
FROM Telemetry t
JOIN Spacecraft s ON t.spacecraft_id = s.spacecraft_id
ORDER BY t.spacecraft_id, t.recorded_at DESC;
