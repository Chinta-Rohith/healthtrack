package com.healthtrack.dto;

import com.healthtrack.entity.SymptomLog;

import java.time.Instant;

/**
 * Response representation of a persisted symptom entry.
 */
public record SymptomResponse(
        Long id,
        String patientId,
        String description,
        Integer severity,
        Instant timestamp
) {
    public static SymptomResponse fromEntity(SymptomLog entity) {
        return new SymptomResponse(
                entity.getId(),
                entity.getPatientId(),
                entity.getDescription(),
                entity.getSeverity(),
                entity.getTimestamp()
        );
    }
}
