CREATE OR REPLACE PROCEDURE create_mission(
    m_name VARCHAR,
    m_objectives TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO Mission(name, status, objectives)
    VALUES (m_name, 'PLANNED', m_objectives);
END;
$$;
