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
