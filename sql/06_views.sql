CREATE OR REPLACE VIEW mission_dashboard AS
SELECT
    m.mission_id,
    m.name AS mission_name,
    m.status AS mission_status,
    m.objectives,
    COUNT(DISTINCT s.spacecraft_id) AS spacecraft_count,
    COUNT(DISTINCT a.astronaut_id) AS astronaut_count,
    COUNT(DISTINCT al.alert_id) AS alert_count,
    COUNT(DISTINCT e.experiment_id) AS experiment_count
FROM Mission m
LEFT JOIN Spacecraft s ON m.mission_id = s.mission_id
LEFT JOIN Mission_Crew mc ON mc.mission_id = m.mission_id
LEFT JOIN Astronaut a ON a.astronaut_id = mc.astronaut_id
LEFT JOIN Alert al ON al.spacecraft_id = s.spacecraft_id
LEFT JOIN Experiment e ON e.mission_id = m.mission_id
GROUP BY m.mission_id;
