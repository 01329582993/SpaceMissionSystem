-- Seed phases for existing missions
DO $$
DECLARE
    m_id INT;
BEGIN
    FOR m_id IN SELECT mission_id FROM mission LOOP
        -- Check if phases already exist to avoid duplicates
        IF NOT EXISTS (SELECT 1 FROM mission_phase WHERE mission_id = m_id) THEN
            INSERT INTO mission_phase (mission_id, phase_name, status) VALUES 
            (m_id, 'Pre-Launch', 'Completed'),
            (m_id, 'Ascent', 'Active'),
            (m_id, 'Orbit Insertion', 'Pending'),
            (m_id, 'Transit', 'Pending'),
            (m_id, 'Landing', 'Pending');
        END IF;
    END LOOP;
END $$;
