CREATE INDEX idx_mission_status ON Mission(status);
CREATE INDEX idx_telemetry_time ON Telemetry(recorded_at);
CREATE INDEX idx_telemetry_spacecraft ON Telemetry(spacecraft_id);
