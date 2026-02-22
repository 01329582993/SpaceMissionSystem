-- sql/03_functions.sql

-- 1. Crew Count Function
CREATE OR REPLACE FUNCTION fn_crew_count(p_mission_id INT)
RETURNS INT AS $$
BEGIN
    RETURN (SELECT COUNT(*) FROM mission_crew WHERE mission_id = p_mission_id);
END;
$$ LANGUAGE plpgsql;

-- 2. Spacecraft Health Function
CREATE OR REPLACE FUNCTION spacecraft_health(s_id INT)
RETURNS INT AS $$
DECLARE avg_health INT;
BEGIN
    SELECT AVG(health_score)::INT
    INTO avg_health
    FROM spacecraft_subsystem
    WHERE spacecraft_id = s_id;

    RETURN avg_health;
END;
$$ LANGUAGE plpgsql;

-- 3. Telemetry Alert Function
CREATE OR REPLACE FUNCTION telemetry_alert()
RETURNS TRIGGER AS $$
DECLARE
    v_mission_id INT;
BEGIN
    SELECT mission_id INTO v_mission_id FROM spacecraft WHERE spacecraft_id = NEW.spacecraft_id;

    IF NEW.temperature > 95 THEN
        INSERT INTO alert(spacecraft_id, mission_id, message, severity)
        VALUES (NEW.spacecraft_id, v_mission_id, 'High Temperature', 'Critical');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Prevent Overlapping Communication Windows
CREATE OR REPLACE FUNCTION prevent_overlap()
RETURNS TRIGGER AS $$
BEGIN
    -- Business logic: A ground station cannot have overlapping windows
    IF EXISTS (
        SELECT 1 FROM communication_window
        WHERE station_id = NEW.station_id
          AND window_id != COALESCE(NEW.window_id, -1) -- Skip self on update
          AND NEW.start_time < end_time
          AND NEW.end_time > start_time
    ) THEN
        RAISE EXCEPTION 'Ground station schedule conflict';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

