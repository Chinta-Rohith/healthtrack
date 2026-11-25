package com.healthtrack.repository;

import com.healthtrack.entity.SymptomLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

/**
 * Spring Data JPA repository for parameterized CRUD and patient-scoped queries on symptom_logs.
 */
@Repository
public interface SymptomLogRepository extends JpaRepository<SymptomLog, Long> {

    /**
     * Retrieves all symptom logs for a given patient sorted chronologically ascending.
     */
    List<SymptomLog> findByPatientIdOrderByTimestampAsc(String patientId);

    /**
     * Retrieves symptom logs for a patient starting at or after the given UTC instant, sorted ascending.
     */
    List<SymptomLog> findByPatientIdAndTimestampGreaterThanEqualOrderByTimestampAsc(
            String patientId,
            Instant startTimestamp
    );

    /**
     * Counts existing symptom entries for a patient (used for idempotent demo seeding).
     */
    long countByPatientId(String patientId);
}
