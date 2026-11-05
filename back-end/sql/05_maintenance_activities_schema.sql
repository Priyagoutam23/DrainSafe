CREATE TABLE IF NOT EXISTS maintenance_activities (
    activity_id BIGSERIAL PRIMARY KEY,
    asset_id VARCHAR(20) NOT NULL
        REFERENCES assets(asset_id),
    activity_type VARCHAR(30) NOT NULL
        CHECK (
            activity_type IN ('Cleaning', 'Repair', 'Inspection')
        ),
    description TEXT NOT NULL
        CHECK (LENGTH(TRIM(description)) > 0),
    activity_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_maintenance_activities_asset_date
ON maintenance_activities (asset_id, activity_date DESC);