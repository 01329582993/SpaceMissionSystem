BEGIN;

-- Trigger when fuel is critically low
CREATE OR REPLACE FUNCTION trg_low_fuel_alert()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.remaining_fuel < 20 THEN
        INSERT INTO alert(spacecraft_id, mission_id, message, severity)
        VALUES (
            NEW.spacecraft_id,
            NEW.mission_id,
            'Fuel below critical threshold',
            'Critical'
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_fuel_alert ON fuel_log;
CREATE TRIGGER trg_fuel_alert
AFTER INSERT OR UPDATE ON fuel_log
FOR EACH ROW
EXECUTE FUNCTION trg_low_fuel_alert();

COMMIT;