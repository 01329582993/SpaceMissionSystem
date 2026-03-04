<<<<<<< HEAD
CSE 4508 Semester Project .

Tuplex team: 

-220041106
-220041158
-220041265

Space Mission Management System
Database Project – README

Project Overview
The Space Mission Management System is designed to manage and track all essential components involved in space missions, including missions, spacecraft, astronauts, experiments, launches, telemetry, and ground communication.

This relational database ensures:

Smooth mission coordination

Accurate, secure data storage

Real‑time monitoring capabilities

Automated workflows using triggers and procedures.
=======
# SpaceMissionSystem / CosmoTrack


### 3) Verification queries
Run these to confirm everything is correct:

```sql
SELECT COUNT(*) FROM Mission;        -- expect 3
SELECT COUNT(*) FROM Spacecraft;     -- expect 3
SELECT COUNT(*) FROM Telemetry;      -- expect ~100
SELECT * FROM Alert ORDER BY created_at DESC;
SELECT * FROM Communication_Window;
>>>>>>> origin/zinnia-progress
