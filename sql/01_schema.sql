-- sql/01_schema.sql
BEGIN;

DROP TABLE IF EXISTS Communication_Window CASCADE;
DROP TABLE IF EXISTS Alert CASCADE;
DROP TABLE IF EXISTS Telemetry CASCADE;
DROP TABLE IF EXISTS Maintenance_Log CASCADE;
DROP TABLE IF EXISTS Spacecraft_Subsystem CASCADE;
DROP TABLE IF EXISTS Spacecraft CASCADE;
DROP TABLE IF EXISTS Experiment CASCADE;
DROP TABLE IF EXISTS Mission_Phase CASCADE;
DROP TABLE IF EXISTS Ground_Station CASCADE;
DROP TABLE IF EXISTS Mission CASCADE;

CREATE TABLE Mission (
    mission_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    status VARCHAR(30),
    start_date DATE,
    end_date DATE,
    objectives TEXT,
    CHECK (end_date IS NULL OR start_date IS NULL OR end_date >= start_date)
);

CREATE TABLE Mission_Phase (
    phase_id SERIAL PRIMARY KEY,
    mission_id INT NOT NULL REFERENCES Mission(mission_id) ON DELETE CASCADE,
    phase_name VARCHAR(50) NOT NULL,
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    CHECK (end_time IS NULL OR start_time IS NULL OR end_time >= start_time)
);

CREATE TABLE Spacecraft (
    spacecraft_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    fuel_level NUMERIC CHECK (fuel_level IS NULL OR fuel_level >= 0),
    health_status VARCHAR(30),
    mission_id INT REFERENCES Mission(mission_id) ON DELETE SET NULL
);

CREATE TABLE Spacecraft_Subsystem (
    subsystem_id SERIAL PRIMARY KEY,
    spacecraft_id INT NOT NULL REFERENCES Spacecraft(spacecraft_id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    health_score INT CHECK (health_score BETWEEN 0 AND 100),
    UNIQUE(spacecraft_id, name)
);

CREATE TABLE Maintenance_Log (
    log_id SERIAL PRIMARY KEY,
    subsystem_id INT NOT NULL REFERENCES Spacecraft_Subsystem(subsystem_id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    log_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Telemetry (
    telemetry_id BIGSERIAL PRIMARY KEY,
    spacecraft_id INT NOT NULL REFERENCES Spacecraft(spacecraft_id) ON DELETE CASCADE,
    temperature NUMERIC,
    voltage NUMERIC,
    fuel_level NUMERIC,
    radiation NUMERIC,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Alert (
    alert_id SERIAL PRIMARY KEY,
    spacecraft_id INT NOT NULL REFERENCES Spacecraft(spacecraft_id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('low','medium','high','critical')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Ground_Station (
    station_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    location TEXT
);

CREATE TABLE Communication_Window (
    window_id SERIAL PRIMARY KEY,
    station_id INT NOT NULL REFERENCES Ground_Station(station_id) ON DELETE CASCADE,
    spacecraft_id INT NOT NULL REFERENCES Spacecraft(spacecraft_id) ON DELETE CASCADE,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    CHECK (end_time > start_time)
);

CREATE TABLE Experiment (
    experiment_id SERIAL PRIMARY KEY,
    mission_id INT NOT NULL REFERENCES Mission(mission_id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    status VARCHAR(30),
    result_data BYTEA
);

COMMIT;
