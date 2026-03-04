-- sql/09_triggers_views.sql

-- 1. Telemetry Alert
CREATE OR REPLACE FUNCTION telemetry_alert()
RETURNS TRIGGER AS $$
DECLARE
    v_mission_id INT;
BEGIN
    -- Link alert to the mission the spacecraft is currently assigned to
    SELECT mission_id INTO v_mission_id FROM spacecraft WHERE spacecraft_id = NEW.spacecraft_id;

    IF NEW.temperature > 95 THEN
        INSERT INTO alert(spacecraft_id, mission_id, message, severity)
        VALUES (NEW.spacecraft_id, v_mission_id, 'High Temperature', 'Critical');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_telemetry_alert ON telemetry;
CREATE TRIGGER trg_telemetry_alert
AFTER INSERT ON telemetry
FOR EACH ROW
EXECUTE FUNCTION telemetry_alert();

-- 2. Prevent Communication Overlap
-- (existing function remains same)
CREATE OR REPLACE FUNCTION prevent_overlap()
RETURNS TRIGGER AS $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM communication_window
        WHERE station_id = NEW.station_id
          AND window_id != COALESCE(NEW.window_id, -1)
          AND NEW.start_time < end_time
          AND NEW.end_time > start_time
    ) THEN
        RAISE EXCEPTION 'Ground station schedule conflict';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_no_overlap ON communication_window;
CREATE TRIGGER trg_no_overlap
BEFORE INSERT OR UPDATE ON communication_window
FOR EACH ROW
EXECUTE FUNCTION prevent_overlap();

-- 3. Mission Stored Procedure
CREATE OR REPLACE PROCEDURE create_mission(
    m_name VARCHAR,
    m_objective TEXT,
    m_commander VARCHAR
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO mission(name, status, objective, commander)
    VALUES (m_name, 'Planned', m_objective, m_commander);
END;
$$;

-- 4. Mission Dashboard View
DROP VIEW IF EXISTS mission_dashboard CASCADE;
CREATE OR REPLACE VIEW mission_dashboard AS
SELECT
    m.mission_id,
    m.name AS mission_name,
    m.status AS mission_status,
    m.objective,
    m.start_date,
    m.end_date,
    m.fuel_level,
    (SELECT COUNT(*) FROM spacecraft s WHERE s.mission_id = m.mission_id) AS spacecraft_count,
    (SELECT COUNT(*) FROM mission_crew mc WHERE mc.mission_id = m.mission_id) AS astronaut_count,
    (SELECT COUNT(*) FROM alert a WHERE a.mission_id = m.mission_id) AS alert_count,
    (SELECT COUNT(*) FROM experiment e WHERE e.mission_id = m.mission_id) AS experiment_count
FROM mission m;

