-- RDBMS Power Feature: Procedural Logic (Cursors, Regex, String Operations)

BEGIN;

-- 1. CURSOR: Batch Maintenance Scheduler
-- Iterates through subsystems with low health and creates maintenance logs
CREATE OR REPLACE PROCEDURE sp_batch_schedule_maintenance(p_health_threshold INT)
LANGUAGE plpgsql
AS $$
DECLARE
    -- Define the cursor
    cur_subsystems CURSOR FOR 
        SELECT subsystem_id, name, spacecraft_id 
        FROM spacecraft_subsystem 
        WHERE health_score < p_health_threshold 
          AND status != 'Maintenance';
    
    v_subsystem RECORD;
BEGIN
    OPEN cur_subsystems;
    
    LOOP
        FETCH cur_subsystems INTO v_subsystem;
        EXIT WHEN NOT FOUND;
        
        -- Business Logic: Auto-schedule maintenance
        INSERT INTO maintenance_log (subsystem_id, description, log_time, next_maintenance_due)
        VALUES (
            v_subsystem.subsystem_id, 
            format('AUTOMATED: Emergency maintenance scheduled for %s due to low health score.', v_subsystem.name),
            CURRENT_TIMESTAMP,
            CURRENT_DATE + 7
        );
        
        -- Update status
        UPDATE spacecraft_subsystem 
        SET status = 'Maintenance' 
        WHERE subsystem_id = v_subsystem.subsystem_id;
        
    END LOOP;
    
    CLOSE cur_subsystems;
END;
$$;

-- 2. REGEX & STRING OPS: Mission Keyword Extractor
-- Uses regular expressions to find "Priority Keywords" in mission objectives
CREATE OR REPLACE FUNCTION fn_get_mission_tags(p_objective TEXT)
RETURNS TEXT AS $$
DECLARE
    v_tags TEXT;
BEGIN
    -- INITCAP: Standardize casing
    -- REGEXP_REPLACE: Extract words starting with uppercase (pseudo-entities) or specific patterns
    -- For simplicity, we'll extract "Space", "Mars", "Lunar", "Research" if they exist
    SELECT string_agg(INITCAP(m[1]), ', ')
    INTO v_tags
    FROM regexp_matches(p_objective, '(Space|Mars|Lunar|Research|Science|Orbit)', 'gi') AS m;
    
    RETURN COALESCE(v_tags, 'General');
END;
$$ LANGUAGE plpgsql;

-- 3. View using Regex Function
CREATE OR REPLACE VIEW v_mission_tags AS
SELECT 
    mission_id,
    name,
    objective,
    fn_get_mission_tags(objective) as tags
FROM mission;

COMMIT;
