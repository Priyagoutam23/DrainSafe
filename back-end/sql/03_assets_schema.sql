CREATE TABLE IF NOT EXISTS assets (
    asset_id VARCHAR(20) PRIMARY KEY,
    location TEXT NOT NULL,
    asset_type VARCHAR(50) NOT NULL DEFAULT 'Drain',
    asset_condition VARCHAR(30) NOT NULL DEFAULT 'Unknown'
        CHECK (
            asset_condition IN (
                'Good',
                'Needs Maintenance',
                'Critical',
                'Unknown'
            )
        ),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);