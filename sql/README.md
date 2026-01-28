# Space Mission System - SQL Setup

## Database Setup Instructions (NO Docker)

### Prerequisites
- PostgreSQL 12+ installed locally
- `psql` command-line tool available in PATH
- Database server running

### Setup Steps

1. **Create the database:**
   ```bash
   createdb cosmotrack
   ```

2. **Run schema creation:**
   ```bash
   psql -U postgres -d cosmotrack -f 01_schema.sql
   ```

3. **Run seed data:**
   ```bash
   psql -U postgres -d cosmotrack -f 02_seed.sql
   ```

4. **Create indexes:**
   ```bash
   psql -U postgres -d cosmotrack -f 08_indexes.sql
   ```

### Verify Installation

Connect to the database and verify tables exist:
```bash
psql -U postgres -d cosmotrack
```

Then in the psql prompt:
```sql
\dt
```

This should show all tables including:
- Mission, Mission_Phase, Spacecraft, Spacecraft_Subsystem
- Telemetry, Alert, Maintenance_Log, Communication_Window
- Experiment, Ground_Station
- Astronaut, App_User, Audit_Log, Launch_Site, Launch
- Maintenance_Schedule, Ground_Station_Schedule
- Mission_Crew, Mission_Experiments, Mission_Spacecraft_Assignment, Mission_Timeline

### Execution Order

The files **must** be executed in this order:
1. `01_schema.sql` - Creates all tables
2. `02_seed.sql` - Populates tables with initial data
3. `08_indexes.sql` - Creates performance indexes

### Additional Script Files

Other SQL files provided for reference:
- `03_functions.sql` - PostgreSQL functions
- `04_procedures.sql` - Stored procedures
- `05_triggers.sql` - Database triggers
- `06_views.sql` - Database views
- `07_queries.sql` - Example queries

### Database Diagram

The schema includes:
- **Core Operations**: Mission, Spacecraft, Astronaut, Launch
- **Monitoring**: Telemetry, Alert, Maintenance
- **Users & Security**: App_User, Audit_Log
- **Planning & Scheduling**: Launch_Site, Maintenance_Schedule, Ground_Station_Schedule, Mission_Timeline
- **Relationships**: Mission_Crew, Mission_Experiments, Mission_Spacecraft_Assignment

### Notes

- All tables use `SERIAL` or `BIGSERIAL` primary keys
- Foreign key constraints are set with `ON DELETE CASCADE` where appropriate
- Timestamp columns use `CURRENT_TIMESTAMP` for audit trails
- Indexes are created for all foreign keys and time-based queries
