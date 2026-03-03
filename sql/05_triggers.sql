-- sql/05_triggers.sql

-- 1. Prevent Overlapping Spacecraft Assignments
-- Cannot reassign a spacecraft if it is already in an Active mission.
CREATE OR REPLACE FUNCTION trg_check_spacecraft_mission()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.mission_id IS NOT NULL THEN
        IF EXISTS (SELECT 1 FROM mission WHERE mission_id = OLD.mission_id AND status = 'Active') THEN
             RAISE EXCEPTION 'Cannot reassign Spacecraft % because its current mission is still Active.', NEW.name;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Auto-Update Mission Status
-- If all phases are marked 'Completed', auto-complete the mission.
CREATE OR REPLACE FUNCTION trg_update_mission_status()
RETURNS TRIGGER AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM mission_phase WHERE mission_id = NEW.mission_id AND status != 'Completed') THEN
        UPDATE mission SET status = 'Completed' WHERE mission_id = NEW.mission_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_mission_phase_update ON mission_phase;
CREATE TRIGGER trg_mission_phase_update
AFTER UPDATE ON mission_phase
FOR EACH ROW
EXECUTE FUNCTION trg_update_mission_status();

-- 3. Audit Logging
CREATE OR REPLACE FUNCTION fn_audit_log()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_log (action, table_name, record_id, old_data, new_data, changed_at)
    VALUES (
        TG_OP,
        TG_TABLE_NAME,
        NULL, 
        row_to_json(OLD),
        row_to_json(NEW),
        CURRENT_TIMESTAMP
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply Audit to Core Tables
DROP TRIGGER IF EXISTS trg_audit_users ON users;
CREATE TRIGGER trg_audit_users
AFTER INSERT OR UPDATE OR DELETE ON users
FOR EACH ROW EXECUTE FUNCTION fn_audit_log();

DROP TRIGGER IF EXISTS trg_audit_mission ON mission;
CREATE TRIGGER trg_audit_mission
AFTER INSERT OR UPDATE OR DELETE ON mission
FOR EACH ROW EXECUTE FUNCTION fn_audit_log();

-- 4. Telemetry and Communication Window Triggers
DROP TRIGGER IF EXISTS trg_telemetry_alert ON telemetry;
CREATE TRIGGER trg_telemetry_alert
AFTER INSERT ON telemetry
FOR EACH ROW EXECUTE FUNCTION telemetry_alert();

DROP TRIGGER IF EXISTS trg_no_overlap ON communication_window;
CREATE TRIGGER trg_no_overlap
BEFORE INSERT OR UPDATE ON communication_window
FOR EACH ROW EXECUTE FUNCTION prevent_overlap();

CREATE TRIGGER trg_audit_alerts
AFTER INSERT OR UPDATE OR DELETE ON alerts
FOR EACH ROW EXECUTE FUNCTION log_changes();