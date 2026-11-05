-- Suppose DR-001 ki condition Good se Critical ho jaati hai. Toh hum dono values aur change ka timestamp save karenge.

CREATE TABLE IF NOT EXISTS asset_condition_history (
    history_id BIGSERIAL PRIMARY KEY,

    asset_id VARCHAR(20) NOT NULL
        REFERENCES assets(asset_id),

    previous_condition VARCHAR(30) NOT NULL
        CHECK (
            previous_condition IN (
                'Good',
                'Needs Maintenance',
                'Critical',
                'Unknown'
            )
        ),

    new_condition VARCHAR(30) NOT NULL
        CHECK (
            new_condition IN (
                'Good',
                'Needs Maintenance',
                'Critical',
                'Unknown'
            )
        ),

    changed_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_asset_history
ON asset_condition_history (asset_id, changed_at DESC);