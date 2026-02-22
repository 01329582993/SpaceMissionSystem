-- RDBMS Power Feature: Smart Integrity Constraints
-- Prevents data inconsistencies at the database level

BEGIN;

-- 1. Prevent Overlapping Crew Assignments
CREATE OR REPLACE FUNCTION fn_prevent_crew_overlap()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if the astronaut is already assigned to another ACTIVE mission
    IF EXISTS (
        SELECT 1 
        FROM mission_crew mc
        JOIN mission m ON mc.mission_id = m.mission_id
        WHERE mc.astronaut_id = NEW.astronaut_id
          AND m.status = 'Active'
          AND m.mission_id != NEW.mission_id
    ) THEN
        RAISE EXCEPTION 'Astronaut ID % is already deployed on an active mission.', NEW.astronaut_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_crew_overlap ON mission_crew;
CREATE TRIGGER trg_crew_overlap
BEFORE INSERT OR UPDATE ON mission_crew
FOR EACH ROW EXECUTE FUNCTION fn_prevent_crew_overlap();

-- 2. Enforce Logical Mission Status Transitions
CREATE OR REPLACE FUNCTION fn_validate_mission_status()
RETURNS TRIGGER AS $$
BEGIN
    -- Logical Flow: Planned -> Active -> Completed/Aborted
    IF OLD.status = 'Planned' AND NEW.status NOT IN ('Planned', 'Active', 'On Hold') THEN
        RAISE EXCEPTION 'Invalid transition: A Planned mission must become Active before closing.';
    END IF;
    
    IF OLD.status = 'Completed' AND NEW.status != 'Completed' THEN
        RAISE EXCEPTION 'Invalid transition: A Completed mission cannot be reopened.';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_mission_status_flow ON mission;
CREATE TRIGGER trg_mission_status_flow
BEFORE UPDATE OF status ON mission
FOR EACH ROW EXECUTE FUNCTION fn_validate_mission_status();

COMMIT;
