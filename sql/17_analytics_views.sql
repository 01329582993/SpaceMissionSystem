-- Mission fuel analytics
CREATE OR REPLACE VIEW vw_mission_fuel_stats AS
SELECT
    m.mission_id,
    m.name,
    COUNT(f.fuel_log_id) AS updates,
    AVG(f.burn_rate) AS avg_burn_rate,
    MIN(f.remaining_fuel) AS min_fuel_remaining
FROM mission m
LEFT JOIN fuel_log f ON m.mission_id = f.mission_id
GROUP BY m.mission_id, m.name;

-- Mission command history
CREATE OR REPLACE VIEW vw_mission_commands AS
SELECT
    mc.mission_id,
    m.name AS mission_name,
    mc.command,
    mc.issued_by,
    mc.issued_at
FROM mission_command mc
JOIN mission m ON mc.mission_id = m.mission_id;