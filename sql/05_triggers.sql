<<<<<<< HEAD
-- sql/05_triggers.sql

-- 1. Prevent Overlapping Spacecraft Assignments
CREATE OR REPLACE FUNCTION trg_check_spacecraft_overlap()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if spacecraft is already assigned to an ACTIVE mission during this period
    -- Note: This is a complex check. Simplified version:
    -- If Spacecraft.current_mission_id is NOT NULL and we try to assign it to another mission 
    -- BUT usually spacecraft_id is unique per mission in Spacecraft table in some designs, 
    -- here it's 1-to-many? No, Spacecraft has current_mission_id. 
    -- So it can only be in one active mission at a time by FK definition essentially 
    -- unless we mean historical missions.
    -- Let's check if the spacecraft is 'Operational' or if we are changing assignment.
    
    IF NEW.current_mission_id IS NOT NULL THEN
        -- Check if the mission we are assigning to is actually Active or Planned
        -- AND if we want to enforce restrictions.
        -- Real Check: Ensure the spacecraft is not currently assigned to another ACTIVE mission.
        -- But wait, the FK logic means it's one mission at a time.
        -- The only 'overlap' is logical: what if the previous mission assignment wasn't cleared?
        -- But UPDATE changes it.
        -- Business Rule: Cannot reassign a spacecraft if it is currently on a mission with status 'Active'.
        -- (Must first mark mission complete or unassign).
        
        IF (TG_OP = 'UPDATE' AND OLD.current_mission_id IS NOT NULL) THEN
            IF EXISTS (SELECT 1 FROM Mission WHERE mission_id = OLD.current_mission_id AND status = 'Active') THEN
                 RAISE EXCEPTION 'Cannot reassign Spacecraft % because it is currently assigned to Active Mission %.', NEW.name, OLD.current_mission_id;
            END IF;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Auto-Update Statuses on Mission Updates
CREATE OR REPLACE FUNCTION trg_update_mission_status()
RETURNS TRIGGER AS $$
BEGIN
    -- If all phases are Completed, mark mission Completed
    IF NOT EXISTS (SELECT 1 FROM Mission_Phase WHERE mission_id = NEW.mission_id AND status != 'Completed') THEN
        UPDATE Mission SET status = 'Completed' WHERE mission_id = NEW.mission_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_mission_phase_update
AFTER UPDATE ON Mission_Phase
FOR EACH ROW
EXECUTE FUNCTION trg_update_mission_status();

-- 3. Audit Logging Trigger Function
CREATE OR REPLACE FUNCTION fn_audit_log()
RETURNS TRIGGER AS $$
DECLARE
    v_user_id INT;
    -- Security: Ensure sensitive tables are logged
    
    INSERT INTO AuditLog (action, table_name, record_id, old_data, new_data, changed_by)
    VALUES (
        TG_OP,
        TG_TABLE_NAME,
        NULL, -- Cannot reliably determine PK in generic trigger without dynamic SQL
        row_to_json(OLD),
        row_to_json(NEW),
        NULL -- Placeholder for user_id
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 5. User Security Audit
CREATE TRIGGER trg_audit_users
AFTER INSERT OR UPDATE OR DELETE ON Users
FOR EACH ROW
EXECUTE FUNCTION fn_audit_log();

-- 4. Specific Audit Triggers
-- Mission Changes
CREATE OR REPLACE FUNCTION fn_audit_mission() RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO AuditLog (action, table_name, record_id, old_data, new_data, changed_at)
    VALUES (TG_OP, 'Mission', COALESCE(NEW.mission_id, OLD.mission_id), row_to_json(OLD), row_to_json(NEW), CURRENT_TIMESTAMP);
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_audit_mission_changes
AFTER INSERT OR UPDATE OR DELETE ON Mission
FOR EACH ROW
EXECUTE FUNCTION fn_audit_mission();

-- Maintenance Changes
CREATE OR REPLACE FUNCTION fn_audit_maintenance() RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO AuditLog (action, table_name, record_id, old_data, new_data, changed_at)
    VALUES (TG_OP, 'Maintenance_Log', COALESCE(NEW.log_id, OLD.log_id), row_to_json(OLD), row_to_json(NEW), CURRENT_TIMESTAMP);
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_log_maintenance_changes
AFTER INSERT OR UPDATE OR DELETE ON Maintenance_Log
FOR EACH ROW
EXECUTE FUNCTION fn_audit_maintenance();
=======
-- Trigger for Telemetry
CREATE TRIGGER trg_telemetry_alert
AFTER INSERT ON Telemetry
FOR EACH ROW
EXECUTE FUNCTION telemetry_alert();

-- Trigger for Communication Window
CREATE TRIGGER trg_no_overlap
BEFORE INSERT ON Communication_Window
FOR EACH ROW
EXECUTE FUNCTION prevent_overlap();
>>>>>>> origin/zinnia-progress
