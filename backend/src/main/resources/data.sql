-- HealthTrack Sample Demonstration Data for PATIENT001
-- Contains non-real sample symptom records across recent days for demonstration only.
-- Safe to run on an empty table or when PATIENT001 has no existing records.

INSERT INTO symptom_logs (patient_id, description, severity, timestamp)
SELECT 'PATIENT001', 'Mild tension headache after morning screen time', 3, TIMESTAMPADD(DAY, -21, UTC_TIMESTAMP())
WHERE NOT EXISTS (SELECT 1 FROM symptom_logs WHERE patient_id = 'PATIENT001');

INSERT INTO symptom_logs (patient_id, description, severity, timestamp)
SELECT 'PATIENT001', 'Persistent afternoon fatigue and mild dizziness', 5, TIMESTAMPADD(DAY, -16, UTC_TIMESTAMP())
WHERE (SELECT COUNT(*) FROM symptom_logs WHERE patient_id = 'PATIENT001') = 1;

INSERT INTO symptom_logs (patient_id, description, severity, timestamp)
SELECT 'PATIENT001', 'Throbbing migraine with sensitivity to bright light', 8, TIMESTAMPADD(DAY, -12, UTC_TIMESTAMP())
WHERE (SELECT COUNT(*) FROM symptom_logs WHERE patient_id = 'PATIENT001') = 2;

INSERT INTO symptom_logs (patient_id, description, severity, timestamp)
SELECT 'PATIENT001', 'Moderate neck stiffness and shoulder soreness', 6, TIMESTAMPADD(DAY, -8, UTC_TIMESTAMP())
WHERE (SELECT COUNT(*) FROM symptom_logs WHERE patient_id = 'PATIENT001') = 3;

INSERT INTO symptom_logs (patient_id, description, severity, timestamp)
SELECT 'PATIENT001', 'Occasional dry cough and mild throat irritation', 4, TIMESTAMPADD(DAY, -5, UTC_TIMESTAMP())
WHERE (SELECT COUNT(*) FROM symptom_logs WHERE patient_id = 'PATIENT001') = 4;

INSERT INTO symptom_logs (patient_id, description, severity, timestamp)
SELECT 'PATIENT001', 'Elevated evening headache and eye strain', 7, TIMESTAMPADD(DAY, -2, UTC_TIMESTAMP())
WHERE (SELECT COUNT(*) FROM symptom_logs WHERE patient_id = 'PATIENT001') = 5;

INSERT INTO symptom_logs (patient_id, description, severity, timestamp)
SELECT 'PATIENT001', 'Mild residual fatigue, noticeably improved after rest', 2, TIMESTAMPADD(HOUR, -6, UTC_TIMESTAMP())
WHERE (SELECT COUNT(*) FROM symptom_logs WHERE patient_id = 'PATIENT001') = 6;
