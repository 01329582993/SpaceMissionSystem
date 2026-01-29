<<<<<<< HEAD
-- sql/03_functions.sql

-- 1. Crew Count Function
CREATE OR REPLACE FUNCTION fn_crew_count(p_mission_id INT)
RETURNS INT AS $$
BEGIN
    RETURN (SELECT COUNT(*) FROM Mission_Crew WHERE mission_id = p_mission_id);
END;
$$ LANGUAGE plpgsql;

-- 2. Next Maintenance Date Function
-- Returns the earliest 'next_maintenance_due' from Maintenance_Log or Spacecraft_Subsystem logic
CREATE OR REPLACE FUNCTION fn_next_maintenance_date(p_spacecraft_id INT)
RETURNS DATE AS $$
DECLARE
    v_next_date DATE;
BEGIN
    -- Logic: Find the subsystem with the nearest 'next_maintenance_due' from logs 
    -- OR based on a schedule. 
    -- Simplification: Select min next_maintenance_due from Maintenance_Log for this spacecraft's subsystems.
    SELECT MIN(ml.next_maintenance_due)
    INTO v_next_date
    FROM Maintenance_Log ml
    JOIN Spacecraft_Subsystem ss ON ml.subsystem_id = ss.subsystem_id
    WHERE ss.spacecraft_id = p_spacecraft_id
      AND ml.next_maintenance_due >= CURRENT_DATE;
      
    RETURN v_next_date;
END;
$$ LANGUAGE plpgsql;

-- 3. Fuel Consumption Rate Function
-- Calculates average fuel consumption per day between two timestamps
CREATE OR REPLACE FUNCTION fn_fuel_consumption_rate(p_spacecraft_id INT, p_from_ts TIMESTAMP, p_to_ts TIMESTAMP)
RETURNS NUMERIC AS $$
DECLARE
    v_start_fuel NUMERIC;
    v_end_fuel NUMERIC;
    v_hours NUMERIC;
BEGIN
    -- Get fuel at start of period (approx)
    SELECT fuel_level INTO v_start_fuel
    FROM Telemetry
    WHERE spacecraft_id = p_spacecraft_id AND recorded_at >= p_from_ts
    ORDER BY recorded_at ASC
    LIMIT 1;

    -- Get fuel at end of period
    SELECT fuel_level INTO v_end_fuel
    FROM Telemetry
    WHERE spacecraft_id = p_spacecraft_id AND recorded_at <= p_to_ts
    ORDER BY recorded_at DESC
    LIMIT 1;

    IF v_start_fuel IS NULL OR v_end_fuel IS NULL THEN
        RETURN 0;
    END IF;

    -- Calculate hours difference
    v_hours := EXTRACT(EPOCH FROM (p_to_ts - p_from_ts)) / 3600;
    
    IF v_hours = 0 THEN RETURN 0; END IF;

    -- Consumption per hour
    RETURN (v_start_fuel - v_end_fuel) / v_hours;
=======
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
>>>>>>> origin/zinnia-progress
END;
$$ LANGUAGE plpgsql;
