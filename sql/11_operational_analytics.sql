-- RDBMS Power Feature: Operational Analytics View
-- Aggregates mission success, fuel efficiency, and personnel utilization

BEGIN;

CREATE OR REPLACE VIEW v_operational_analytics AS
WITH mission_stats AS (
    SELECT 
        COUNT(*) FILTER (WHERE status = 'Active') as active_missions,
        COUNT(*) FILTER (WHERE status = 'Completed') as completed_missions,
        COUNT(*) FILTER (WHERE status = 'Planned') as planned_missions
    FROM mission
),
crew_stats AS (
    SELECT 
        COUNT(*) as total_personnel,
        COUNT(*) FILTER (WHERE availability = 'On Mission') as deployed_personnel,
        COUNT(*) FILTER (WHERE availability = 'Available') as available_personnel,
        ROUND((COUNT(*) FILTER (WHERE availability = 'On Mission')::NUMERIC / NULLIF(COUNT(*), 0) * 100), 1) as utilization_pct
    FROM astronaut
),
fleet_stats AS (
    SELECT 
        COUNT(*) as total_spacecraft,
        ROUND(AVG(fuel_level), 1) as avg_fuel_level,
        COUNT(*) FILTER (WHERE health_status = 'Operational') as operational_vessels
    FROM spacecraft
)
SELECT 
    m.*, 
    c.*, 
    f.*
FROM mission_stats m, crew_stats c, fleet_stats f;

COMMIT;
