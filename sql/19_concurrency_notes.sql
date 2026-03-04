-- Row-level locking example
SELECT * FROM mission
WHERE mission_id = 1
FOR UPDATE;