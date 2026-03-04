-- RDBMS Power Feature: Advanced Analytics (Ranking, Windowing, Rollup)
-- Demonstrates OLAP capabilities within the Space Mission context

BEGIN;

-- 1. RANKING: Astronaut Leaderboard
-- Ranks personnel based on their total number of assigned missions using DENSE_RANK()
CREATE OR REPLACE VIEW v_astronaut_leaderboard AS
SELECT 
    a.name,
    a.rank,
    COUNT(mc.mission_id) as mission_count,
    DENSE_RANK() OVER (ORDER BY COUNT(mc.mission_id) DESC) as experience_rank
FROM astronaut a
LEFT JOIN mission_crew mc ON a.astronaut_id = mc.astronaut_id
GROUP BY a.astronaut_id, a.name, a.rank;

-- 2. WINDOWING: Telemetry Moving Averages
-- Calculates a 5-reading moving average for radiation and temperature to smooth out sensor noise
CREATE OR REPLACE VIEW v_telemetry_trends AS
SELECT 
    t.spacecraft_id,
    s.name as spacecraft_name,
    t.recorded_at,
    t.radiation,
    ROUND(AVG(t.radiation) OVER (
        PARTITION BY t.spacecraft_id 
        ORDER BY t.recorded_at 
        ROWS BETWEEN 4 PRECEDING AND CURRENT ROW
    ), 3) as radiation_moving_avg,
    t.temperature,
    ROUND(AVG(t.temperature) OVER (
        PARTITION BY t.spacecraft_id 
        ORDER BY t.recorded_at 
        ROWS BETWEEN 4 PRECEDING AND CURRENT ROW
    ), 2) as temp_moving_avg
FROM telemetry t
JOIN spacecraft s ON t.spacecraft_id = s.spacecraft_id;

-- 3. ROLLUP (OLAP): Mission Hierarchy Summary
-- Provides sub-totals of missions by Status and Commander
CREATE OR REPLACE VIEW v_mission_summary_stats AS
SELECT 
    m.status,
    u.username AS commander,
    COUNT(*) as mission_count,
    COUNT(DISTINCT m.mission_id) as unique_missions
FROM mission m
LEFT JOIN users u ON m.commander_id = u.user_id
GROUP BY ROLLUP(m.status, u.username)
ORDER BY m.status, u.username;

COMMIT;
