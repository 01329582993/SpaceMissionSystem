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

-- =========================================
-- ADD FUEL RATE + ENGINE LOAD
-- =========================================

ALTER TABLE spacecraft
ADD COLUMN engine_efficiency INT DEFAULT 100;  -- 0–100

ALTER TABLE mission
ADD COLUMN distance_remaining INT DEFAULT 100000; -- km

-- =========================================
-- FUEL CALCULATION FUNCTION
-- =========================================

CREATE OR REPLACE FUNCTION calculate_fuel_burn(
    s_id INT,
    hours INT
)
RETURNS INT AS $$
DECLARE
    base_rate INT;
    efficiency INT;
    temp_factor INT;
    burn INT;
BEGIN
    -- Base burn rate
    base_rate := 5;  -- 5 units per hour base

    -- Get engine efficiency
    SELECT engine_efficiency INTO efficiency
    FROM spacecraft
    WHERE spacecraft_id = s_id;

    -- Get latest temperature
    SELECT temperature INTO temp_factor
    FROM telemetry
    WHERE spacecraft_id = s_id
    ORDER BY recorded_at DESC
    LIMIT 1;

    -- Temperature increases burn
    IF temp_factor > 80 THEN
        base_rate := base_rate + 3;
    END IF;

    -- Efficiency reduces burn
    burn := (base_rate * hours) - (efficiency / 20);

    RETURN GREATEST(burn, 1);
END;
$$ LANGUAGE plpgsql;

