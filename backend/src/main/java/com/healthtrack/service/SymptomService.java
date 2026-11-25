package com.healthtrack.service;

import com.healthtrack.dto.SeverityTrendPoint;
import com.healthtrack.dto.SymptomRequest;
import com.healthtrack.dto.SymptomResponse;
import com.healthtrack.entity.SymptomLog;
import com.healthtrack.exception.InvalidRequestException;
import com.healthtrack.repository.SymptomLogRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Clock;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

/**
 * Business logic layer for recording, retrieving, and aggregating patient symptom logs.
 */
@Service
public class SymptomService {

    private static final int TREND_WINDOW_DAYS = 30;
    private static final Pattern PATIENT_ID_PATTERN = Pattern.compile("^[A-Za-z0-9_-]{1,50}$");

    private final SymptomLogRepository symptomLogRepository;
    private final Clock clock;

    public SymptomService(SymptomLogRepository symptomLogRepository, Clock clock) {
        this.symptomLogRepository = symptomLogRepository;
        this.clock = clock;
    }

    /**
     * Validates, normalizes, timestamps, and persists a new symptom entry.
     */
    @Transactional
    public SymptomResponse createSymptom(SymptomRequest request) {
        if (request == null) {
            throw new InvalidRequestException("Request body is required.");
        }

        String normalizedPatientId = normalizeAndValidatePatientId(request.getPatientId());
        String normalizedDescription = normalizeAndValidateDescription(request.getDescription());
        Integer severity = validateSeverity(request.getSeverity());

        Instant nowUtc = Instant.now(clock);
        SymptomLog entity = new SymptomLog(normalizedPatientId, normalizedDescription, severity, nowUtc);
        SymptomLog saved = symptomLogRepository.save(entity);

        return SymptomResponse.fromEntity(saved);
    }

    /**
     * Retrieves all symptom records belonging strictly to the given patient in ascending timestamp order.
     */
    @Transactional(readOnly = true)
    public List<SymptomResponse> getSymptomsByPatientId(String patientId) {
        String normalizedPatientId = normalizeAndValidatePatientId(patientId);
        return symptomLogRepository.findByPatientIdOrderByTimestampAsc(normalizedPatientId)
                .stream()
                .map(SymptomResponse::fromEntity)
                .toList();
    }

    /**
     * Aggregates daily average symptom severity across the previous 30 days (inclusive of today in UTC),
     * sorted chronologically by date.
     */
    @Transactional(readOnly = true)
    public List<SeverityTrendPoint> getSymptomTrends(String patientId) {
        String normalizedPatientId = normalizeAndValidatePatientId(patientId);

        // Anchor the 30-day window to UTC midnight 29 days ago so all 30 calendar days are covered consistently.
        LocalDate startDateUtc = LocalDate.now(clock.withZone(ZoneOffset.UTC)).minusDays(TREND_WINDOW_DAYS - 1L);
        Instant startInstantUtc = startDateUtc.atStartOfDay().toInstant(ZoneOffset.UTC);

        List<SymptomLog> recentLogs = symptomLogRepository
                .findByPatientIdAndTimestampGreaterThanEqualOrderByTimestampAsc(normalizedPatientId, startInstantUtc);

        if (recentLogs.isEmpty()) {
            return List.of();
        }

        // TreeMap preserves chronological ascending LocalDate order automatically.
        Map<LocalDate, List<SymptomLog>> groupedByDate = recentLogs.stream()
                .collect(Collectors.groupingBy(
                        entry -> entry.getTimestamp().atZone(ZoneOffset.UTC).toLocalDate(),
                        TreeMap::new,
                        Collectors.toList()
                ));

        return groupedByDate.entrySet().stream()
                .map(entry -> {
                    List<SymptomLog> dayLogs = entry.getValue();
                    double rawAverage = dayLogs.stream()
                            .mapToInt(SymptomLog::getSeverity)
                            .average()
                            .orElse(0.0);
                    double roundedAverage = Math.round(rawAverage * 100.0) / 100.0;
                    return new SeverityTrendPoint(entry.getKey(), roundedAverage, dayLogs.size());
                })
                .toList();
    }

    private String normalizeAndValidatePatientId(String patientId) {
        if (patientId == null) {
            throw new InvalidRequestException("Patient ID is required.");
        }
        String trimmed = patientId.trim();
        if (trimmed.isEmpty()) {
            throw new InvalidRequestException("Patient ID is required.");
        }
        if (!PATIENT_ID_PATTERN.matcher(trimmed).matches()) {
            throw new InvalidRequestException(
                    "Patient ID must be 1 to 50 characters and contain only letters, numbers, hyphens, or underscores."
            );
        }
        return trimmed;
    }

    private String normalizeAndValidateDescription(String description) {
        if (description == null) {
            throw new InvalidRequestException("Symptom description is required.");
        }
        String trimmed = description.trim();
        if (trimmed.isEmpty()) {
            throw new InvalidRequestException("Symptom description cannot be empty.");
        }
        if (trimmed.length() > 500) {
            throw new InvalidRequestException("Symptom description must not exceed 500 characters.");
        }
        return trimmed;
    }

    private Integer validateSeverity(Integer severity) {
        if (severity == null || severity < 1 || severity > 10) {
            throw new InvalidRequestException("Severity must be between 1 and 10.");
        }
        return severity;
    }
}
