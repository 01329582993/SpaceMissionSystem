CREATE OR REPLACE FUNCTION spacecraft_health(s_id INT)
RETURNS INT AS $$
DECLARE avg_health INT;
BEGIN
    SELECT AVG(health_score)::INT
    INTO avg_health
    FROM Spacecraft_Subsystem
    WHERE spacecraft_id = s_id;

    RETURN avg_health;
END;
$$ LANGUAGE plpgsql;
