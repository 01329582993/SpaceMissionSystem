-- RDBMS Power Feature: Automated Audit Logging
-- Captures OLD and NEW data as JSONB for every change

BEGIN;

-- 1. Create the Audit Function
CREATE OR REPLACE FUNCTION fn_audit_log_trigger()
RETURNS TRIGGER AS $$
DECLARE
    v_old_data JSONB := NULL;
    v_new_data JSONB := NULL;
BEGIN
    -- Capture OLD data for UPDATE/DELETE
    IF (TG_OP = 'UPDATE' OR TG_OP = 'DELETE') THEN
        v_old_data := to_jsonb(OLD);
    END IF;

    -- Capture NEW data for INSERT/UPDATE
    IF (TG_OP = 'INSERT' OR TG_OP = 'UPDATE') THEN
        v_new_data := to_jsonb(NEW);
    END IF;

    -- Insert into audit_log
    INSERT INTO audit_log (
        action,
        table_name,
        record_id,
        old_data,
        new_data,
        changed_at,
        details
    ) VALUES (
        TG_OP,
        TG_TABLE_NAME,
        COALESCE((v_new_data->>'mission_id')::INT, (v_new_data->>'astronaut_id')::INT, (v_new_data->>'spacecraft_id')::INT, (v_old_data->>'mission_id')::INT, (v_old_data->>'astronaut_id')::INT, (v_old_data->>'spacecraft_id')::INT),
        v_old_data,
        v_new_data,
        CURRENT_TIMESTAMP,
        format('Automatic audit log for %s on table %s', TG_OP, TG_TABLE_NAME)
    );

    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- 2. Apply Triggers to Core Tables
DROP TRIGGER IF EXISTS trg_audit_mission ON mission;
CREATE TRIGGER trg_audit_mission
AFTER INSERT OR UPDATE OR DELETE ON mission
FOR EACH ROW EXECUTE FUNCTION fn_audit_log_trigger();

DROP TRIGGER IF EXISTS trg_audit_astronaut ON astronaut;
CREATE TRIGGER trg_audit_astronaut
AFTER INSERT OR UPDATE OR DELETE ON astronaut
FOR EACH ROW EXECUTE FUNCTION fn_audit_log_trigger();

DROP TRIGGER IF EXISTS trg_audit_spacecraft ON spacecraft;
CREATE TRIGGER trg_audit_spacecraft
AFTER INSERT OR UPDATE OR DELETE ON spacecraft
FOR EACH ROW EXECUTE FUNCTION fn_audit_log_trigger();

COMMIT;
