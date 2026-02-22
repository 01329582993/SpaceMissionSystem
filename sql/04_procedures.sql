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
    FROM mission
    WHERE mission_id = p_mission_id;

    UPDATE mission
    SET mission_id = mission_id -- Placeholder for mission_code logic
    WHERE mission_id = p_mission_id;
END;
$$;

-- 2. Create Mission Stored Procedure
CREATE OR REPLACE PROCEDURE create_mission(
    m_name VARCHAR,
    m_objective TEXT,
    m_commander VARCHAR
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO mission(name, status, objective, commander)
    VALUES (m_name, 'Planned', m_objective, m_commander);
END;
$$;

-- 3. Assign Astronaut to Crew
CREATE OR REPLACE PROCEDURE sp_assign_crew(
    p_mission_id INT,
    p_astronaut_id INT,
    p_position VARCHAR
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO mission_crew (mission_id, astronaut_id, position)
    VALUES (p_mission_id, p_astronaut_id, p_position)
    ON CONFLICT (mission_id, astronaut_id) DO UPDATE 
    SET position = EXCLUDED.position;
END;
$$;
