BEGIN;

-- =========================================
-- DROP OLD OBJECTS (SAFE RESET FIRST)
-- =========================================

DROP VIEW IF EXISTS mission_dashboard CASCADE;

DROP TABLE IF EXISTS fuel_log CASCADE;
DROP TABLE IF EXISTS budget CASCADE;
DROP TABLE IF EXISTS ground_station CASCADE;
DROP TABLE IF EXISTS astronaut CASCADE;
DROP TABLE IF EXISTS crew_vitals CASCADE;
DROP TABLE IF EXISTS life_support_telemetry CASCADE;
DROP TABLE IF EXISTS communication_window CASCADE;
DROP TABLE IF EXISTS telemetry CASCADE;
DROP TABLE IF EXISTS alert CASCADE;
DROP TABLE IF EXISTS spacecraft_subsystem CASCADE;
DROP TABLE IF EXISTS spacecraft CASCADE;
DROP TABLE IF EXISTS mission_phase CASCADE;
DROP TABLE IF EXISTS mission_crew CASCADE;
DROP TABLE IF EXISTS experiment CASCADE;
DROP TABLE IF EXISTS mission CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS system_alerts CASCADE;
DROP TABLE IF EXISTS alerts CASCADE;
DROP TABLE IF EXISTS audit_meta CASCADE;
DROP TABLE IF EXISTS audit_log CASCADE;
DROP TABLE IF EXISTS mission_risk_assessment CASCADE;
DROP TABLE IF EXISTS maintenance_log CASCADE;

-- =========================================
-- USERS TABLE
-- =========================================

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100),
    password VARCHAR(100),
    role VARCHAR(30) DEFAULT 'operator',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================================
-- MISSION TABLE
-- =========================================

CREATE TABLE mission (
    mission_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    status VARCHAR(30) DEFAULT 'Planned',
    start_date DATE,
    end_date DATE,
    objective TEXT,
    commander_id INT REFERENCES users(user_id),
    commander VARCHAR(100),
    fuel_level INT DEFAULT 100,
    parent_mission_id INT REFERENCES mission(mission_id) ON DELETE SET NULL,
    created_by INT REFERENCES users(user_id),
    CHECK (end_date IS NULL OR start_date IS NULL OR end_date >= start_date)
);

-- =========================================
-- BUDGET TABLE
-- =========================================

CREATE TABLE budget (
    budget_id SERIAL PRIMARY KEY,
    mission_id INT REFERENCES mission(mission_id) ON DELETE CASCADE,
    allocated NUMERIC,
    spent NUMERIC
);

-- =========================================
-- SPACECRAFT TABLE
-- =========================================

CREATE TABLE spacecraft (
    spacecraft_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    model VARCHAR(100),
    health_status VARCHAR(50),
    mission_id INT REFERENCES mission(mission_id) ON DELETE CASCADE,
    manufactured_date DATE
);

-- =========================================
-- NEW: LIFE SUPPORT TELEMETRY (Ship Health)
-- =========================================

CREATE TABLE life_support_telemetry (
    ls_id SERIAL PRIMARY KEY,
    spacecraft_id INT REFERENCES spacecraft(spacecraft_id) ON DELETE CASCADE,
    o2_level NUMERIC(5,2), -- Percentage
    co2_level NUMERIC(5,2), -- Percentage
    temperature NUMERIC(5,2),
    humidity NUMERIC(5,2),
    radiation_level NUMERIC(10,4),
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================================
-- FUEL LOG TABLE
-- =========================================

CREATE TABLE fuel_log (
    log_id SERIAL PRIMARY KEY,
    spacecraft_id INT REFERENCES spacecraft(spacecraft_id),
    mission_id INT REFERENCES mission(mission_id),
    amount INT,
    action VARCHAR(20),
    logged_by INT REFERENCES users(user_id),
    logged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================================
-- SPACECRAFT SUBSYSTEM
-- =========================================

CREATE TABLE spacecraft_subsystem (
    subsystem_id SERIAL PRIMARY KEY,
    spacecraft_id INT REFERENCES spacecraft(spacecraft_id) ON DELETE CASCADE,
    name VARCHAR(100),
    health_score INT CHECK (health_score BETWEEN 0 AND 100)
);

-- =========================================
-- TELEMETRY TABLE
-- =========================================

CREATE TABLE telemetry (
    telemetry_id SERIAL PRIMARY KEY,
    spacecraft_id INT REFERENCES spacecraft(spacecraft_id) ON DELETE CASCADE,
    temperature NUMERIC,
    voltage NUMERIC,
    fuel_level NUMERIC,
    radiation NUMERIC,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================================
-- ALERT TABLE
-- =========================================

CREATE TABLE alert (
    alert_id SERIAL PRIMARY KEY,
    mission_id INT REFERENCES mission(mission_id) ON DELETE CASCADE,
    spacecraft_id INT REFERENCES spacecraft(spacecraft_id) ON DELETE CASCADE,
    message TEXT,
    severity VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================================
-- OTHER TABLES
-- =========================================

CREATE TABLE mission_crew (
    crew_id SERIAL PRIMARY KEY,
    mission_id INT REFERENCES mission(mission_id) ON DELETE CASCADE,
    astronaut_name VARCHAR(100)
);

CREATE TABLE experiment (
    experiment_id SERIAL PRIMARY KEY,
    mission_id INT REFERENCES mission(mission_id) ON DELETE CASCADE,
    name VARCHAR(100),
    status VARCHAR(30) DEFAULT 'pending'
);

CREATE TABLE mission_phase (
    phase_id SERIAL PRIMARY KEY,
    mission_id INT REFERENCES mission(mission_id) ON DELETE CASCADE,
    name VARCHAR(100),
    status VARCHAR(30) DEFAULT 'Planned'
);

CREATE TABLE communication_window (
    window_id SERIAL PRIMARY KEY,
    mission_id INT REFERENCES mission(mission_id) ON DELETE CASCADE,
    station_name VARCHAR(100),
    start_time TIMESTAMP,
    end_time TIMESTAMP
);

CREATE TABLE ground_station (
    station_id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    location VARCHAR(100)
);

-- =========================================
-- ASTRONAUT & CREW VITALS
-- =========================================

CREATE TABLE astronaut (
    astronaut_id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    rank VARCHAR(50),
    role VARCHAR(100),
    availability VARCHAR(50),
    current_mission_id INT REFERENCES mission(mission_id) -- Link for Health Page
);

CREATE TABLE crew_vitals (
    vital_id SERIAL PRIMARY KEY,
    astronaut_id INT REFERENCES astronaut(astronaut_id) ON DELETE CASCADE,
    heart_rate INT,
    blood_pressure_sys INT,
    blood_pressure_dia INT,
    body_temp NUMERIC(4,2),
    stress_level INT CHECK (stress_level BETWEEN 0 AND 100),
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================================
-- INDEXES
-- =========================================

CREATE INDEX idx_mission_status ON mission(status);
CREATE INDEX idx_spacecraft_mission ON spacecraft(mission_id);
CREATE INDEX idx_telemetry_spacecraft ON telemetry(spacecraft_id);
CREATE INDEX idx_alert_mission ON alert(mission_id);
CREATE INDEX idx_ls_spacecraft ON life_support_telemetry(spacecraft_id);
CREATE INDEX idx_vitals_astronaut ON crew_vitals(astronaut_id);

-- =========================================
-- FUNCTIONS & TRIGGERS
-- =========================================

-- Create the Alerts Table
CREATE TABLE alerts (
    alert_id SERIAL PRIMARY KEY,
    type VARCHAR(20) DEFAULT 'info', -- 'critical', 'warning', 'info'
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved BOOLEAN DEFAULT FALSE
);

CREATE TABLE system_alerts (
    alert_id SERIAL PRIMARY KEY,
    type VARCHAR(50) DEFAULT 'info', -- 'info', 'warning', 'critical'
    message TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create the Audit Log Table (if not already there)
CREATE TABLE IF NOT EXISTS audit_log (
    log_id SERIAL PRIMARY KEY,
    action VARCHAR(20),
    table_name VARCHAR(50),
    record_id INTEGER,
    old_data JSONB,
    new_data JSONB,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    details TEXT
);
-- Create the logic function

-- 1. Remove the old version if it exists
DROP TABLE IF EXISTS audit_meta;

-- 2. Create the correct version with all required columns
CREATE TABLE audit_meta (
    meta_id SERIAL PRIMARY KEY,
    log_id INTEGER REFERENCES audit_log(log_id) ON DELETE CASCADE,
    origin_node TEXT DEFAULT 'SECTOR_7_CORE',
    request_method TEXT DEFAULT 'POST',
    auth_level TEXT DEFAULT 'ADMIN_LEVEL_1',
    process_signature TEXT DEFAULT 'SIG_0x882'
);

-- 3. Verify the columns are there
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'audit_meta';

-- =========================================
-- VIEW
-- =========================================

CREATE OR REPLACE VIEW mission_dashboard AS
SELECT
    m.mission_id,
    m.name AS mission_name,
    m.status,
    m.objective,
    m.fuel_level,
    COUNT(DISTINCT s.spacecraft_id) AS spacecraft_count,
    COUNT(DISTINCT mc.crew_id) AS crew_count,
    COUNT(DISTINCT al.alert_id) AS alert_count,
    COUNT(DISTINCT e.experiment_id) AS experiment_count
FROM mission m
LEFT JOIN spacecraft s ON m.mission_id = s.mission_id
LEFT JOIN mission_crew mc ON m.mission_id = mc.mission_id
LEFT JOIN alert al ON m.mission_id = al.mission_id
LEFT JOIN experiment e ON m.mission_id = e.mission_id
GROUP BY m.mission_id;

-- Main Risk Table
CREATE TABLE mission_risk_assessment (
    risk_id SERIAL PRIMARY KEY,
    mission_id INT NOT NULL,
    fuel_level NUMERIC(5,2),
    radiation_level NUMERIC(5,2),
    health_score NUMERIC(5,2),
    budget_remaining NUMERIC(12,2),
    duration_days INT,
    risk_score NUMERIC(5,2),
    risk_level VARCHAR(20),
    calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE maintenance_log (
    log_id SERIAL PRIMARY KEY,
    subsystem_id INT REFERENCES spacecraft_subsystem(subsystem_id) ON DELETE CASCADE,
    description TEXT,
    log_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    next_maintenance_due DATE
);

COMMIT;