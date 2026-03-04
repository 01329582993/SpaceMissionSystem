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

DROP TRIGGER IF EXISTS trg_check_spacecraft_mission ON spacecraft;
CREATE TRIGGER trg_check_spacecraft_mission
BEFORE UPDATE OF mission_id ON spacecraft
FOR EACH ROW EXECUTE FUNCTION trg_check_spacecraft_mission();

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
-- Already defined in 03_functions.sql: fn_audit_log

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

-- 5. Alerts Audit
DROP TRIGGER IF EXISTS trg_audit_alerts ON alerts;
CREATE TRIGGER trg_audit_alerts
AFTER INSERT OR UPDATE OR DELETE ON alerts
FOR EACH ROW EXECUTE FUNCTION log_changes();

-- 6. Life Support Alerts
DROP TRIGGER IF EXISTS trg_life_support_alert ON life_support_telemetry;
CREATE TRIGGER trg_life_support_alert
AFTER INSERT ON life_support_telemetry
FOR EACH ROW EXECUTE FUNCTION life_support_alert();