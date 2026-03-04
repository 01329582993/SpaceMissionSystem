BEGIN;

-- Example: Start mission safely
SELECT * FROM mission WHERE mission_id = 1 FOR UPDATE;

CALL sp_issue_command(1, 'START', 'Commander Zinnia');

COMMIT;