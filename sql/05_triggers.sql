CREATE OR REPLACE FUNCTION telemetry_alert()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.temperature > 95 THEN
        INSERT INTO Alert(spacecraft_id, message, severity)
        VALUES (NEW.spacecraft_id, 'High Temperature', 'CRITICAL');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_telemetry_alert
AFTER INSERT ON Telemetry
FOR EACH ROW
EXECUTE FUNCTION telemetry_alert();

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

CREATE TRIGGER trg_no_overlap
BEFORE INSERT ON Communication_Window
FOR EACH ROW
EXECUTE FUNCTION prevent_overlap();
