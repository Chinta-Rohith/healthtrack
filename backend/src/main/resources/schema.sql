-- HealthTrack MySQL Schema
-- Creates the symptom_logs table with validation constraints and query indexes.

CREATE TABLE IF NOT EXISTS symptom_logs (
    id BIGINT NOT NULL AUTO_INCREMENT,
    patient_id VARCHAR(50) NOT NULL,
    description VARCHAR(500) NOT NULL,
    severity INT NOT NULL,
    timestamp DATETIME(6) NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT chk_symptom_severity CHECK (severity >= 1 AND severity <= 10),
    INDEX idx_symptom_patient_timestamp (patient_id, timestamp)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
