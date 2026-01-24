CREATE VIEW mission_dashboard AS
SELECT
    m.mission_id,
    m.name,
    m.status,
    COUNT(s.spacecraft_id) AS spacecraft_count
FROM Mission m
LEFT JOIN Spacecraft s ON m.mission_id = s.mission_id
GROUP BY m.mission_id;
