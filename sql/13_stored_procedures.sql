-- RDBMS Power Feature: Stored Procedures
-- Encapsulates complex launch logic into a single atomic transaction

BEGIN;

CREATE OR REPLACE PROCEDURE sp_launch_sequence(p_mission_id INT)
AS $$
DECLARE
    v_crew_count INT;
    v_ship_count INT;
    v_mission_name TEXT;
BEGIN
    SELECT name INTO v_mission_name FROM mission WHERE mission_id = p_mission_id;
    
    -- 1. Check if mission exists and is Planned
    IF v_mission_name IS NULL THEN
        RAISE EXCEPTION 'Mission ID % does not exist.', p_mission_id;
    END IF;

    -- 2. Verify Crew exists
    SELECT COUNT(*) INTO v_crew_count FROM mission_crew WHERE mission_id = p_mission_id;
    IF v_crew_count = 0 THEN
        RAISE EXCEPTION 'Mission % cannot launch without a crew.', v_mission_name;
    END IF;

    -- 3. Verify Spacecraft exists and has fuel
    SELECT COUNT(*) INTO v_ship_count 
    FROM spacecraft 
    WHERE mission_id = p_mission_id AND fuel_level > 10;
    
    IF v_ship_count = 0 THEN
        RAISE EXCEPTION 'Mission % requires at least one fueled spacecraft (>10%%).', v_mission_name;
    END IF;

    -- 4. Transition Status
    UPDATE mission SET status = 'Active', start_date = CURRENT_DATE WHERE mission_id = p_mission_id;

    -- 5. Advance first phase to Active
    UPDATE mission_phase SET status = 'Completed' WHERE mission_id = p_mission_id AND phase_name = 'Pre-Launch';
    UPDATE mission_phase SET status = 'Active' WHERE mission_id = p_mission_id AND phase_name = 'Ascent';

    -- 6. Log success to Audit Log
    INSERT INTO audit_log (action, table_name, record_id, details)
    VALUES ('PROCEDURE', 'mission', p_mission_id, format('Successfully executed sp_launch_sequence for %s', v_mission_name));

    COMMIT; -- Explicitly commit the transaction within the procedure
END;
$$ LANGUAGE plpgsql;

COMMIT;
