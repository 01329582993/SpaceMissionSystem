-- sql/04_procedures.sql

-- 1. Generate Mission Code
CREATE OR REPLACE PROCEDURE sp_generate_mission_code(p_mission_id INT)
LANGUAGE plpgsql
AS $$
DECLARE
    v_year TEXT;
    v_type TEXT;
    v_seq TEXT;
BEGIN
    SELECT 
        TO_CHAR(start_date, 'YYYY'), 
        SUBSTRING(status FROM 1 FOR 3),
        TO_CHAR(mission_id, 'FM000')
    INTO v_year, v_type, v_seq
    FROM Mission
    WHERE mission_id = p_mission_id;

    UPDATE Mission
    SET mission_code = UPPER(v_type || '-' || v_year || '-' || v_seq)
    WHERE mission_id = p_mission_id;
END;
$$;

-- 2. Assign Best Astronaut
-- Assigns an astronaut with a specific role who has the least current assignments
CREATE OR REPLACE PROCEDURE sp_assign_best_astronaut(p_mission_id INT, p_specialization VARCHAR)
LANGUAGE plpgsql
AS $$
DECLARE
    v_astronaut_id INT;
BEGIN
    -- Select astronaut with matching role/specialization and fewest active assignments
    SELECT u.user_id
    INTO v_astronaut_id
    FROM Users u
    LEFT JOIN Mission_Crew mc ON u.user_id = mc.astronaut_id
    WHERE u.role = p_specialization
    GROUP BY u.user_id
    ORDER BY COUNT(mc.assignment_id) ASC
    LIMIT 1;

    IF v_astronaut_id IS NOT NULL THEN
        INSERT INTO Mission_Crew (mission_id, astronaut_id, role, assigned_at)
        VALUES (p_mission_id, v_astronaut_id, p_specialization, CURRENT_DATE);
        
        RAISE NOTICE 'Assigned Astronaut ID % to Mission %', v_astronaut_id, p_mission_id;
    ELSE
        RAISE NOTICE 'No available astronaut found for specialization %', p_specialization;
    END IF;
END;
$$;

-- 3. Create Mission Transaction
-- Complex transaction ensuring multiple steps succeed or fail together
CREATE OR REPLACE PROCEDURE sp_create_mission_transaction(
    p_name VARCHAR, 
    p_start_date DATE, 
    p_end_date DATE, 
    p_creator_id INT,
    p_default_phase VARCHAR
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_new_mission_id INT;
BEGIN
    -- Transaction is implicit in PROCEDURE calls usually, but we can manage logic here
    
    -- 1. Create Mission
    INSERT INTO Mission (name, start_date, end_date, created_by, status)
    VALUES (p_name, p_start_date, p_end_date, p_creator_id, 'Planned')
    RETURNING mission_id INTO v_new_mission_id;

    -- 2. Generate Code
    CALL sp_generate_mission_code(v_new_mission_id);

    -- 3. Create Default Phase
    INSERT INTO Mission_Phase (mission_id, phase_name, start_time, status)
    VALUES (v_new_mission_id, p_default_phase, NULL, 'Pending');

    RAISE NOTICE 'Mission % created successfully with ID %', p_name, v_new_mission_id;
    
    -- In case of meaningful error, we can RAISE EXCEPTION to rollback implicit transaction
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Transaction failed: %', SQLERRM;
        RAISE; -- Re-raise to rollback
END;
$$;
