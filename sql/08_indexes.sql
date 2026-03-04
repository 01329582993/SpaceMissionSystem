BEGIN;

--------------------------------------------------
-- FOREIGN KEY INDEXES
--------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_mission_commander_id
ON mission(commander_id);

CREATE INDEX IF NOT EXISTS idx_spacecraft_mission_id
ON spacecraft(mission_id);

CREATE INDEX IF NOT EXISTS idx_subsystem_spacecraft_id
ON spacecraft_subsystem(spacecraft_id);

CREATE INDEX IF NOT EXISTS idx_maintlog_subsystem_id
ON maintenance_log(subsystem_id);

CREATE INDEX IF NOT EXISTS idx_telemetry_spacecraft_id
ON telemetry(spacecraft_id);

CREATE INDEX IF NOT EXISTS idx_experiment_mission_id
ON experiment(mission_id);

CREATE INDEX IF NOT EXISTS idx_commwin_station_id
ON communication_window(station_id);

CREATE INDEX IF NOT EXISTS idx_commwin_spacecraft_id
ON communication_window(spacecraft_id);

CREATE INDEX IF NOT EXISTS idx_fuellog_spacecraft_id
ON fuel_log(spacecraft_id);

CREATE INDEX IF NOT EXISTS idx_fuellog_mission_id
ON fuel_log(mission_id);

CREATE INDEX IF NOT EXISTS idx_notification_user_id
ON notification(user_id);

--------------------------------------------------
-- TIME-BASED INDEXES
--------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_telemetry_recorded_at
ON telemetry(recorded_at);

CREATE INDEX IF NOT EXISTS idx_commwin_start_end
ON communication_window(start_time, end_time);

CREATE INDEX IF NOT EXISTS idx_maintlog_log_time
ON maintenance_log(log_time);

CREATE INDEX IF NOT EXISTS idx_fuellog_logged_at
ON fuel_log(logged_at);

--------------------------------------------------
-- ALERT & MONITORING
--------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_alert_spacecraft_id
ON alert(spacecraft_id);

CREATE INDEX IF NOT EXISTS idx_alert_mission_id
ON alert(mission_id);

CREATE INDEX IF NOT EXISTS idx_alert_created_at
ON alert(created_at);

CREATE INDEX IF NOT EXISTS idx_alert_severity
ON alert(severity);

--------------------------------------------------
-- FILTER INDEXES
--------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_mission_status
ON mission(status);

CREATE INDEX IF NOT EXISTS idx_spacecraft_health_status
ON spacecraft(health_status);

CREATE INDEX IF NOT EXISTS idx_user_role
ON users(role);

COMMIT;