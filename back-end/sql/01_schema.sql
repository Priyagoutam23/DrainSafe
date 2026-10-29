CREATE SEQUENCE IF NOT EXISTS report_id_seq;

CREATE TABLE IF NOT EXISTS reports (
    id VARCHAR(20) PRIMARY KEY,
    asset_id VARCHAR(20) NOT NULL,
    location TEXT NOT NULL,
    issue TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'Open'
        CHECK (status IN ('Open', 'Under Review', 'In Progress', 'Resolved')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);