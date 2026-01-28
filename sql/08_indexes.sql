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

-- New table indexes (foreign keys)
CREATE INDEX IF NOT EXISTS idx_audit_log_user_id ON Audit_Log(user_id);
CREATE INDEX IF NOT EXISTS idx_launch_mission_id ON Launch(mission_id);
CREATE INDEX IF NOT EXISTS idx_launch_site_id ON Launch(launch_site_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_schedule_spacecraft_id ON Maintenance_Schedule(spacecraft_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_schedule_subsystem_id ON Maintenance_Schedule(subsystem_id);
CREATE INDEX IF NOT EXISTS idx_ground_station_schedule_station_id ON Ground_Station_Schedule(station_id);
CREATE INDEX IF NOT EXISTS idx_mission_crew_mission_id ON Mission_Crew(mission_id);
CREATE INDEX IF NOT EXISTS idx_mission_crew_astronaut_id ON Mission_Crew(astronaut_id);
CREATE INDEX IF NOT EXISTS idx_mission_experiments_mission_id ON Mission_Experiments(mission_id);
CREATE INDEX IF NOT EXISTS idx_mission_experiments_experiment_id ON Mission_Experiments(experiment_id);
CREATE INDEX IF NOT EXISTS idx_mission_spacecraft_assignment_mission_id ON Mission_Spacecraft_Assignment(mission_id);
CREATE INDEX IF NOT EXISTS idx_mission_spacecraft_assignment_spacecraft_id ON Mission_Spacecraft_Assignment(spacecraft_id);
CREATE INDEX IF NOT EXISTS idx_mission_timeline_mission_id ON Mission_Timeline(mission_id);

-- Time-based queries
CREATE INDEX IF NOT EXISTS idx_telemetry_recorded_at ON Telemetry(recorded_at);
CREATE INDEX IF NOT EXISTS idx_commwin_start_end ON Communication_Window(start_time, end_time);
CREATE INDEX IF NOT EXISTS idx_maintenance_schedule_start_end ON Maintenance_Schedule(start_time, end_time);
CREATE INDEX IF NOT EXISTS idx_ground_station_schedule_start_end ON Ground_Station_Schedule(start_time, end_time);
CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON Audit_Log(created_at);
CREATE INDEX IF NOT EXISTS idx_astronaut_created_at ON Astronaut(created_at);
CREATE INDEX IF NOT EXISTS idx_app_user_created_at ON App_User(created_at);
CREATE INDEX IF NOT EXISTS idx_mission_timeline_event_date ON Mission_Timeline(event_date);

-- Alerts
CREATE INDEX IF NOT EXISTS idx_alert_spacecraft_id ON Alert(spacecraft_id);
CREATE INDEX IF NOT EXISTS idx_alert_created_at ON Alert(created_at);
CREATE INDEX IF NOT EXISTS idx_alert_severity ON Alert(severity);

COMMIT;

