-- sql/08_indexes.sql
BEGIN;

-- Foreign key / join indexes
CREATE INDEX IF NOT EXISTS idx_mission_phase_mission_id ON Mission_Phase(mission_id);
CREATE INDEX IF NOT EXISTS idx_spacecraft_mission_id ON Spacecraft(mission_id);
CREATE INDEX IF NOT EXISTS idx_subsystem_spacecraft_id ON Spacecraft_Subsystem(spacecraft_id);
CREATE INDEX IF NOT EXISTS idx_maintlog_subsystem_id ON Maintenance_Log(subsystem_id);
CREATE INDEX IF NOT EXISTS idx_telemetry_spacecraft_id ON Telemetry(spacecraft_id);
CREATE INDEX IF NOT EXISTS idx_experiment_mission_id ON Experiment(mission_id);
CREATE INDEX IF NOT EXISTS idx_commwin_station_id ON Communication_Window(station_id);
CREATE INDEX IF NOT EXISTS idx_commwin_spacecraft_id ON Communication_Window(spacecraft_id);

-- Time-based queries
CREATE INDEX IF NOT EXISTS idx_telemetry_recorded_at ON Telemetry(recorded_at);
CREATE INDEX IF NOT EXISTS idx_commwin_start_end ON Communication_Window(start_time, end_time);

-- Alerts
CREATE INDEX IF NOT EXISTS idx_alert_spacecraft_id ON Alert(spacecraft_id);
CREATE INDEX IF NOT EXISTS idx_alert_created_at ON Alert(created_at);
CREATE INDEX IF NOT EXISTS idx_alert_severity ON Alert(severity);

COMMIT;

