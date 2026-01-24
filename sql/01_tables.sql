CREATE TABLE Mission (
    mission_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    status VARCHAR(30),
    start_date DATE,
    end_date DATE,
    objectives TEXT
);

CREATE TABLE Mission_Phase (
    phase_id SERIAL PRIMARY KEY,
    mission_id INT REFERENCES Mission(mission_id),
    phase_name VARCHAR(50),
    start_time TIMESTAMP,
    end_time TIMESTAMP
);

CREATE TABLE Spacecraft (
    spacecraft_id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    fuel_level NUMERIC,
    health_status VARCHAR(30),
    mission_id INT REFERENCES Mission(mission_id)
);

CREATE TABLE Spacecraft_Subsystem (
    subsystem_id SERIAL PRIMARY KEY,
    spacecraft_id INT REFERENCES Spacecraft(spacecraft_id),
    name VARCHAR(50),
    health_score INT CHECK (health_score BETWEEN 0 AND 100)
);

CREATE TABLE Maintenance_Log (
    log_id SERIAL PRIMARY KEY,
    subsystem_id INT REFERENCES Spacecraft_Subsystem(subsystem_id),
    description TEXT,
    log_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Telemetry (
    telemetry_id BIGSERIAL PRIMARY KEY,
    spacecraft_id INT REFERENCES Spacecraft(spacecraft_id),
    temperature NUMERIC,
    voltage NUMERIC,
    fuel_level NUMERIC,
    radiation NUMERIC,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Alert (
    alert_id SERIAL PRIMARY KEY,
    spacecraft_id INT,
    message TEXT,
    severity VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Ground_Station (
    station_id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    location TEXT
);

CREATE TABLE Communication_Window (
    window_id SERIAL PRIMARY KEY,
    station_id INT REFERENCES Ground_Station(station_id),
    spacecraft_id INT REFERENCES Spacecraft(spacecraft_id),
    start_time TIMESTAMP,
    end_time TIMESTAMP
);

CREATE TABLE Experiment (
    experiment_id SERIAL PRIMARY KEY,
    mission_id INT REFERENCES Mission(mission_id),
    name VARCHAR(100),
    status VARCHAR(30),
    result_data BYTEA
);
