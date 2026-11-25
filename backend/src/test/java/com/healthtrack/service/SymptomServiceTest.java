package com.healthtrack.service;

import com.healthtrack.dto.SeverityTrendPoint;
import com.healthtrack.dto.SymptomRequest;
import com.healthtrack.dto.SymptomResponse;
import com.healthtrack.entity.SymptomLog;
import com.healthtrack.exception.InvalidRequestException;
import com.healthtrack.repository.SymptomLogRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Clock;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.time.temporal.ChronoUnit;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SymptomServiceTest {

    private static final Instant FIXED_NOW = Instant.parse("2026-11-25T12:00:00Z");

    @Mock
    private SymptomLogRepository symptomLogRepository;

    private SymptomService symptomService;

    @BeforeEach
    void setUp() {
        Clock fixedClock = Clock.fixed(FIXED_NOW, ZoneOffset.UTC);
        symptomService = new SymptomService(symptomLogRepository, fixedClock);
    }

    @Test
    void createSymptom_validRequest_trimsInputAndAssignsTimestamp() {
        SymptomRequest request = new SymptomRequest("  PATIENT001  ", "  Sharp headache  ", 7);

        when(symptomLogRepository.save(any(SymptomLog.class))).thenAnswer(invocation -> {
            SymptomLog log = invocation.getArgument(0);
            log.setId(42L);
            return log;
        });

        SymptomResponse response = symptomService.createSymptom(request);

        ArgumentCaptor<SymptomLog> captor = ArgumentCaptor.forClass(SymptomLog.class);
        verify(symptomLogRepository).save(captor.capture());

        SymptomLog persisted = captor.getValue();
        assertThat(persisted.getPatientId()).isEqualTo("PATIENT001");
        assertThat(persisted.getDescription()).isEqualTo("Sharp headache");
        assertThat(persisted.getSeverity()).isEqualTo(7);
        assertThat(persisted.getTimestamp()).isEqualTo(FIXED_NOW);

        assertThat(response.id()).isEqualTo(42L);
        assertThat(response.timestamp()).isEqualTo(FIXED_NOW);
    }

    @Test
    void createSymptom_emptyDescription_throwsInvalidRequestException() {
        SymptomRequest request = new SymptomRequest("PATIENT001", "   ", 5);

        assertThatThrownBy(() -> symptomService.createSymptom(request))
                .isInstanceOf(InvalidRequestException.class)
                .hasMessageContaining("description");
    }

    @Test
    void createSymptom_severityBelowMinimum_throwsInvalidRequestException() {
        SymptomRequest request = new SymptomRequest("PATIENT001", "Mild fatigue", 0);

        assertThatThrownBy(() -> symptomService.createSymptom(request))
                .isInstanceOf(InvalidRequestException.class)
                .hasMessageContaining("between 1 and 10");
    }

    @Test
    void createSymptom_severityAboveMaximum_throwsInvalidRequestException() {
        SymptomRequest request = new SymptomRequest("PATIENT001", "Severe migraine", 11);

        assertThatThrownBy(() -> symptomService.createSymptom(request))
                .isInstanceOf(InvalidRequestException.class)
                .hasMessageContaining("between 1 and 10");
    }

    @Test
    void getSymptomsByPatientId_returnsAtLeastFiveSortedRecordsForPatient() {
        List<SymptomLog> logs = List.of(
                createLog(1L, "PATIENT001", "Symptom 1", 2, FIXED_NOW.minus(10, ChronoUnit.DAYS)),
                createLog(2L, "PATIENT001", "Symptom 2", 4, FIXED_NOW.minus(8, ChronoUnit.DAYS)),
                createLog(3L, "PATIENT001", "Symptom 3", 6, FIXED_NOW.minus(6, ChronoUnit.DAYS)),
                createLog(4L, "PATIENT001", "Symptom 4", 8, FIXED_NOW.minus(4, ChronoUnit.DAYS)),
                createLog(5L, "PATIENT001", "Symptom 5", 5, FIXED_NOW.minus(2, ChronoUnit.DAYS))
        );

        when(symptomLogRepository.findByPatientIdOrderByTimestampAsc("PATIENT001")).thenReturn(logs);

        List<SymptomResponse> result = symptomService.getSymptomsByPatientId("PATIENT001");

        assertThat(result).hasSize(5);
        assertThat(result).extracting(SymptomResponse::timestamp).isSorted();
        verify(symptomLogRepository).findByPatientIdOrderByTimestampAsc("PATIENT001");
    }

    @Test
    void getSymptomTrends_groupsByUtcDateComputesAverageAndSortsChronologically() {
        Instant dayOneMorning = Instant.parse("2026-11-20T08:00:00Z");
        Instant dayOneEvening = Instant.parse("2026-11-20T20:00:00Z");
        Instant dayTwo = Instant.parse("2026-11-23T14:30:00Z");

        List<SymptomLog> logs = List.of(
                createLog(1L, "PATIENT001", "Morning pain", 4, dayOneMorning),
                createLog(2L, "PATIENT001", "Evening flare", 7, dayOneEvening),
                createLog(3L, "PATIENT001", "Mild headache", 3, dayTwo)
        );

        Instant expectedCutoff = LocalDate.of(2026, 10, 27).atStartOfDay().toInstant(ZoneOffset.UTC);
        when(symptomLogRepository.findByPatientIdAndTimestampGreaterThanEqualOrderByTimestampAsc(
                eq("PATIENT001"),
                eq(expectedCutoff)
        )).thenReturn(logs);

        List<SeverityTrendPoint> trends = symptomService.getSymptomTrends("PATIENT001");

        assertThat(trends).hasSize(2);
        assertThat(trends.get(0).date()).isEqualTo(LocalDate.of(2026, 11, 20));
        assertThat(trends.get(0).averageSeverity()).isEqualTo(5.5);
        assertThat(trends.get(0).entryCount()).isEqualTo(2);

        assertThat(trends.get(1).date()).isEqualTo(LocalDate.of(2026, 11, 23));
        assertThat(trends.get(1).averageSeverity()).isEqualTo(3.0);
        assertThat(trends.get(1).entryCount()).isEqualTo(1);
    }

    private static SymptomLog createLog(Long id, String patientId, String desc, int severity, Instant timestamp) {
        SymptomLog log = new SymptomLog(patientId, desc, severity, timestamp);
        log.setId(id);
        return log;
    }
}
