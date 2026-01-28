-- ===============================
-- TELEMETRY ALERT TRIGGER
-- ===============================
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

DROP TRIGGER IF EXISTS trg_telemetry_alert ON Telemetry;

CREATE TRIGGER trg_telemetry_alert
AFTER INSERT ON Telemetry
FOR EACH ROW
EXECUTE FUNCTION telemetry_alert();


-- ===============================
-- PREVENT COMMUNICATION OVERLAP
-- ===============================
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

DROP TRIGGER IF EXISTS trg_no_overlap ON Communication_Window;

CREATE TRIGGER trg_no_overlap
BEFORE INSERT ON Communication_Window
FOR EACH ROW
EXECUTE FUNCTION prevent_overlap();


-- ===============================
-- STORED PROCEDURE
-- ===============================
CREATE OR REPLACE PROCEDURE create_mission(
    m_name VARCHAR,
    m_objectives TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO Mission(name, status, objectives)
    VALUES (m_name, 'planned', m_objectives);
END;
$$;


-- ===============================
-- FUNCTION
-- ===============================
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


-- ===============================
-- VIEW
-- ===============================
DROP VIEW IF EXISTS mission_dashboard;

CREATE OR REPLACE VIEW mission_dashboard AS
SELECT
    m.mission_id,
    m.name,
    m.status,
    COUNT(s.spacecraft_id) AS spacecraft_count
FROM Mission m
LEFT JOIN Spacecraft s ON m.mission_id = s.mission_id
GROUP BY m.mission_id, m.name, m.status;
