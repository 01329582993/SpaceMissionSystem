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

-- Add columns only if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'spacecraft' AND column_name = 'engine_efficiency') THEN
        ALTER TABLE spacecraft ADD COLUMN engine_efficiency INT DEFAULT 100;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'mission' AND column_name = 'distance_remaining') THEN
        ALTER TABLE mission ADD COLUMN distance_remaining INT DEFAULT 100000;
    END IF;
END $$;

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

-- 4. Audit Log Function
CREATE OR REPLACE FUNCTION log_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        INSERT INTO audit_log (action, table_name, record_id, new_data, details)
        VALUES ('INSERT', TG_TABLE_NAME, NEW.alert_id, row_to_json(NEW), 'NEW_THREAT_DETECTED');
    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO audit_log (action, table_name, record_id, old_data, new_data, details)
        VALUES ('UPDATE', TG_TABLE_NAME, OLD.alert_id, row_to_json(OLD), row_to_json(NEW), 'THREAT_RESOLVED_OR_MODIFIED');
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 5. Life Support Alert Function
CREATE OR REPLACE FUNCTION life_support_alert()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.o2_level < 18.5 THEN
        INSERT INTO alert(mission_id, spacecraft_id, message, severity)
        SELECT mission_id, NEW.spacecraft_id,
               'CRITICAL: Low Oxygen Levels Detected', 'critical'
        FROM spacecraft
        WHERE spacecraft_id = NEW.spacecraft_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
