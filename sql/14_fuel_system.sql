BEGIN;

-- Fuel management per spacecraft
CREATE TABLE fuel_log (
    fuel_log_id SERIAL PRIMARY KEY,
    spacecraft_id INT NOT NULL REFERENCES spacecraft(spacecraft_id) ON DELETE CASCADE,
    mission_id INT REFERENCES mission(mission_id) ON DELETE CASCADE,
    initial_fuel NUMERIC NOT NULL CHECK (initial_fuel >= 0),
    burn_rate NUMERIC NOT NULL CHECK (burn_rate > 0), -- kg per minute
    throttle INT CHECK (throttle BETWEEN 0 AND 100),
    remaining_fuel NUMERIC NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Fuel calculation function (COMPUTATION)
CREATE OR REPLACE FUNCTION fn_calculate_remaining_fuel(
    p_initial NUMERIC,
    p_burn NUMERIC,
    p_minutes INT
)
RETURNS NUMERIC AS $$
BEGIN
    RETURN GREATEST(p_initial - (p_burn * p_minutes), 0);
END;
$$ LANGUAGE plpgsql;

COMMIT;