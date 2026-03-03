BEGIN;

CREATE TABLE mission_command (
    command_id SERIAL PRIMARY KEY,
    mission_id INT NOT NULL REFERENCES mission(mission_id) ON DELETE CASCADE,
    command VARCHAR(20) CHECK (command IN ('START','PAUSE','ABORT','RESUME')),
    issued_by VARCHAR(100),
    issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Stored procedure with multi-step logic
CREATE OR REPLACE PROCEDURE sp_issue_command(
    p_mission_id INT,
    p_command TEXT,
    p_commander TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO mission_command(mission_id, command, issued_by)
    VALUES (p_mission_id, p_command, p_commander);

    IF p_command = 'START' THEN
        UPDATE mission SET status = 'Active' WHERE mission_id = p_mission_id;
    ELSIF p_command = 'PAUSE' THEN
        UPDATE mission SET status = 'On Hold' WHERE mission_id = p_mission_id;
    ELSIF p_command = 'ABORT' THEN
        UPDATE mission SET status = 'Aborted' WHERE mission_id = p_mission_id;
    END IF;
END;
$$;

COMMIT;