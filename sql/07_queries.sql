SELECT * FROM mission_dashboard;

SELECT spacecraft_id, spacecraft_health(spacecraft_id)
FROM Spacecraft;

SELECT * FROM Alert ORDER BY created_at DESC;
