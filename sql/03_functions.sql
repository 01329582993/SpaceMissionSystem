-- Spacecraft health function
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

-- Telemetry alert function (use lowercase severity)
CREATE OR REPLACE FUNCTION telemetry_alert()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.temperature > 95 THEN
        INSERT INTO Alert(spacecraft_id, message, severity)
        VALUES (NEW.spacecraft_id, 'High Temperature', 'critical');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Prevent overlapping communication windows
CREATE OR REPLACE FUNCTION prevent_overlap()
RETURNS TRIGGER AS $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM Communication_Window
        WHERE station_id = NEW.station_id
        AND NEW.start_time < end_time
        AND NEW.end_time > start_time
    ) THEN
        RAISE EXCEPTION 'Schedule conflict';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
