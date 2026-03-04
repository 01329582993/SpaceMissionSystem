-- RDBMS Power Feature: Recursive Queries (Mission Hierarchy)
-- Uses WITH RECURSIVE to traverse the mission tree

BEGIN;

-- 1. Recursive View: Mission Command Structure
-- This view shows the path from a top-level program down to individual sub-missions
CREATE OR REPLACE VIEW v_mission_hierarchy AS
WITH RECURSIVE mission_tree AS (
    -- Anchor member: Start with top-level missions (those without a parent)
    SELECT 
        mission_id, 
        name, 
        parent_mission_id,
        name::TEXT as path,
        1 as depth
    FROM mission
    WHERE parent_mission_id IS NULL

    UNION ALL

    -- Recursive member: Join with children
    SELECT 
        m.mission_id, 
        m.name, 
        m.parent_mission_id,
        (mt.path || ' > ' || m.name)::TEXT,
        mt.depth + 1
    FROM mission m
    INNER JOIN mission_tree mt ON m.parent_mission_id = mt.mission_id
)
SELECT * FROM mission_tree ORDER BY path;

-- 2. Sample Data for Hierarchy
-- Connect existing missions to demonstrate the feature if they aren't already
-- Assuming mission_id 1 is a parent for testing purposes
-- UPDATE mission SET parent_mission_id = 1 WHERE mission_id IN (2, 3) AND mission_id != 1;

COMMIT;
