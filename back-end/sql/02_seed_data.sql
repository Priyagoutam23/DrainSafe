INSERT INTO reports (id, asset_id, location, issue, status)
VALUES
('DS-001', 'DR-001', 'Sample Ward 04', 'Blocked drain', 'Open'),
('DS-002', 'DR-014', 'Sample Ward 07', 'Overflow', 'Under Review'),
('DS-003', 'DR-021', 'Sample Ward 02', 'Damaged cover', 'In Progress'),
('DS-004', 'DR-008', 'Sample Ward 05', 'Repeat blockage', 'Resolved')
ON CONFLICT (id) DO NOTHING;


-- Initialize sequence after inserting sample reports
--COALESCE multiple values check karta hai aur pehli non-NULL value return karta hai.
SELECT setval(
    'report_id_seq',
    COALESCE(
        (
            SELECT MAX(CAST(SUBSTRING(id FROM 4) AS BIGINT))
            FROM reports
            WHERE id ~ '^DS-[0-9]+$'
        ),
        0
    ) + 1,
    false
);