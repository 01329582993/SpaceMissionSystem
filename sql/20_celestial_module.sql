-- sql/20_celestial_module.sql
-- Celestial Alert and Calendar Module Integration

BEGIN;

DROP TABLE IF EXISTS celestial_alerts CASCADE;
DROP TABLE IF EXISTS celestial_events CASCADE;

-- 1. Celestial Events Table
CREATE TABLE IF NOT EXISTS celestial_events (
    event_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    event_type VARCHAR(100) NOT NULL, -- 'eclipse', 'meteor_shower', 'asteroid', 'comet', 'alignment', 'conjunction', 'space_weather'
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE,
    visibility_region TEXT,
    priority_level VARCHAR(20) DEFAULT 'medium', -- 'low', 'medium', 'high', 'critical'
    data_source VARCHAR(255),
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Celestial Alerts Table
CREATE TABLE IF NOT EXISTS celestial_alerts (
    alert_id SERIAL PRIMARY KEY,
    event_id INT REFERENCES celestial_events(event_id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    alert_time TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'sent', 'dismissed'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Stored Procedure for Alert Generation
CREATE OR REPLACE FUNCTION generate_celestial_alerts()
RETURNS TRIGGER AS $$
DECLARE
    alert_msg TEXT;
    alert_t TIMESTAMP WITH TIME ZONE;
BEGIN
    -- Prepare message
    alert_msg := 'Upcoming ' || NEW.event_type || ': ' || NEW.name;
    
    -- Alert 24 hours before the event
    alert_t := NEW.start_time - INTERVAL '24 hours';
    
    -- If event is sooner than 24h, alert now
    IF alert_t < CURRENT_TIMESTAMP THEN
        alert_t := CURRENT_TIMESTAMP;
    END IF;

    -- Insert into celestial_alerts
    INSERT INTO celestial_alerts (event_id, message, alert_time, status)
    VALUES (NEW.event_id, alert_msg, alert_t, 'pending');

    -- If critical, also insert into system_alerts
    IF NEW.priority_level = 'critical' OR NEW.priority_level = 'high' THEN
        INSERT INTO system_alerts (type, message, status)
        VALUES ('warning', 'CELESTIAL EVENT DETECTED: ' || alert_msg, 'active');
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Trigger for Celestial Events
DROP TRIGGER IF EXISTS trg_celestial_event_alert ON celestial_events;
CREATE TRIGGER trg_celestial_event_alert
AFTER INSERT ON celestial_events
FOR EACH ROW
EXECUTE FUNCTION generate_celestial_alerts();

-- 5. Indexes for fast retrieval
CREATE INDEX idx_celestial_events_start ON celestial_events(start_time);
CREATE INDEX idx_celestial_alerts_time ON celestial_alerts(alert_time);
CREATE INDEX idx_celestial_events_type ON celestial_events(event_type);

COMMIT;
