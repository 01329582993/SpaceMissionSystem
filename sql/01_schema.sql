BEGIN;

-- 1. Cleanup
DROP TABLE IF EXISTS audit_log CASCADE;
DROP TABLE IF EXISTS communication_window CASCADE;
DROP TABLE IF EXISTS alert CASCADE;
DROP TABLE IF EXISTS telemetry CASCADE;
DROP TABLE IF EXISTS maintenance_log CASCADE;
DROP TABLE IF EXISTS spacecraft_subsystem CASCADE;
DROP TABLE IF EXISTS spacecraft CASCADE;
DROP TABLE IF EXISTS experiment CASCADE;
DROP TABLE IF EXISTS mission_phase CASCADE;
DROP TABLE IF EXISTS ground_station CASCADE;
DROP TABLE IF EXISTS mission_crew CASCADE;
DROP TABLE IF EXISTS astronaut CASCADE;
DROP TABLE IF EXISTS mission CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 2. Users Table
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('Admin', 'Commander', 'Engineer', 'Analyst')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Core Tables
CREATE TABLE mission (
    mission_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    status VARCHAR(30) DEFAULT 'Planned' CHECK (status IN ('Planned', 'Active', 'Completed', 'Aborted', 'On Hold')),
    start_date DATE,
    end_date DATE,
    objective TEXT, -- singular as per code
    commander VARCHAR(100), -- added as per code
    parent_mission_id INT REFERENCES mission(mission_id) ON DELETE SET NULL,
    created_by INT REFERENCES users(user_id),
    CHECK (end_date IS NULL OR start_date IS NULL OR end_date >= start_date)
);

CREATE TABLE mission_phase (
    phase_id SERIAL PRIMARY KEY,
    mission_id INT NOT NULL REFERENCES mission(mission_id) ON DELETE CASCADE,
    phase_name VARCHAR(50) NOT NULL,
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    status VARCHAR(30) DEFAULT 'Pending',
    CHECK (end_time IS NULL OR start_time IS NULL OR end_time >= start_time)
);

CREATE TABLE spacecraft (
    spacecraft_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    model VARCHAR(50),
    fuel_level NUMERIC CHECK (fuel_level IS NULL OR (fuel_level >= 0 AND fuel_level <= 100)),
    health_status VARCHAR(30) DEFAULT 'Operational',
    mission_id INT REFERENCES mission(mission_id) ON DELETE SET NULL,
    manufactured_date DATE
);

CREATE TABLE spacecraft_subsystem (
    subsystem_id SERIAL PRIMARY KEY,
    spacecraft_id INT NOT NULL REFERENCES spacecraft(spacecraft_id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    health_score INT CHECK (health_score BETWEEN 0 AND 100),
    status VARCHAR(30) DEFAULT 'Operational',
    last_checked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(spacecraft_id, name)
);

-- 4. Operational Tables
CREATE TABLE maintenance_log (
    log_id SERIAL PRIMARY KEY,
    subsystem_id INT NOT NULL REFERENCES spacecraft_subsystem(subsystem_id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    technician_id INT REFERENCES users(user_id),
    log_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    next_maintenance_due DATE
);

CREATE TABLE telemetry (
    telemetry_id BIGSERIAL PRIMARY KEY,
    spacecraft_id INT NOT NULL REFERENCES spacecraft(spacecraft_id) ON DELETE CASCADE,
    temperature NUMERIC,
    voltage NUMERIC,
    fuel_level NUMERIC,
    radiation NUMERIC,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE alert (
    alert_id SERIAL PRIMARY KEY,
    spacecraft_id INT NOT NULL REFERENCES spacecraft(spacecraft_id) ON DELETE CASCADE,
    mission_id INT REFERENCES mission(mission_id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('Low', 'Medium', 'High', 'Critical')),
    is_resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ground_station (
    station_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    location TEXT,
    status VARCHAR(30) DEFAULT 'Active'
);

CREATE TABLE communication_window (
    window_id SERIAL PRIMARY KEY,
    station_id INT NOT NULL REFERENCES ground_station(station_id) ON DELETE CASCADE,
    spacecraft_id INT NOT NULL REFERENCES spacecraft(spacecraft_id) ON DELETE CASCADE,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    CHECK (end_time > start_time)
);

CREATE TABLE experiment (
    experiment_id SERIAL PRIMARY KEY,
    mission_id INT NOT NULL REFERENCES mission(mission_id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    status VARCHAR(30) DEFAULT 'Planned',
    lead_scientist_id INT REFERENCES users(user_id),
    result_data BYTEA
);

CREATE TABLE astronaut (
    astronaut_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    rank VARCHAR(50), 
    role VARCHAR(50),
    availability VARCHAR(30) DEFAULT 'Available'
);

CREATE TABLE mission_crew (
    assignment_id SERIAL PRIMARY KEY,
    mission_id INT NOT NULL REFERENCES mission(mission_id) ON DELETE CASCADE,
    astronaut_id INT NOT NULL REFERENCES astronaut(astronaut_id) ON DELETE CASCADE,
    position VARCHAR(50), 
    assigned_at DATE DEFAULT CURRENT_DATE,
    UNIQUE(mission_id, astronaut_id)
);

-- 5. Audit Logging
CREATE TABLE audit_log (
    log_id SERIAL PRIMARY KEY,
    action VARCHAR(50) NOT NULL,
    table_name VARCHAR(50) NOT NULL,
    record_id INT,
    old_data JSONB,
    new_data JSONB,
    changed_by INT REFERENCES users(user_id),
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    details TEXT
);

COMMIT;


