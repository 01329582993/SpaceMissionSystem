-- Dashboard view
SELECT * FROM mission_dashboard;

-- Spacecraft health
SELECT spacecraft_id, spacecraft_health(spacecraft_id)
FROM Spacecraft;

-- Alerts
SELECT * FROM Alert ORDER BY created_at DESC;
