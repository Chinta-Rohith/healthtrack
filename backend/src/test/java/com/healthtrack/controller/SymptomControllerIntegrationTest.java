package com.healthtrack.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.healthtrack.dto.SymptomRequest;
import com.healthtrack.entity.SymptomLog;
import com.healthtrack.repository.SymptomLogRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

import static org.hamcrest.Matchers.greaterThanOrEqualTo;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class SymptomControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private SymptomLogRepository symptomLogRepository;

    @BeforeEach
    void clearDatabase() {
        symptomLogRepository.deleteAll();
    }

    @Test
    void postSymptom_validRequest_returns201AndPersistsTrimmedRecord() throws Exception {
        SymptomRequest request = new SymptomRequest("  PATIENT001  ", "  Recurring migraine  ", 7);

        mockMvc.perform(post("/api/symptoms")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.id", notNullValue()))
                .andExpect(jsonPath("$.data.patientId", is("PATIENT001")))
                .andExpect(jsonPath("$.data.description", is("Recurring migraine")))
                .andExpect(jsonPath("$.data.severity", is(7)))
                .andExpect(jsonPath("$.data.timestamp", notNullValue()));
    }

    @Test
    void postSymptom_emptyDescription_returns400ValidationError() throws Exception {
        SymptomRequest request = new SymptomRequest("PATIENT001", "   ", 5);

        mockMvc.perform(post("/api/symptoms")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status", is(400)))
                .andExpect(jsonPath("$.fieldErrors.description", notNullValue()));
    }

    @Test
    void postSymptom_severityOutOfRange_returns400ValidationError() throws Exception {
        SymptomRequest tooLow = new SymptomRequest("PATIENT001", "Mild cough", 0);
        SymptomRequest tooHigh = new SymptomRequest("PATIENT001", "Severe pain", 11);

        mockMvc.perform(post("/api/symptoms")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(tooLow)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors.severity", notNullValue()));

        mockMvc.perform(post("/api/symptoms")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(tooHigh)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors.severity", notNullValue()));
    }

    @Test
    void getPatientSymptoms_filtersByPatientAndSortsAscending() throws Exception {
        Instant now = Instant.now();

        // Save out of chronological order and across two patients to verify isolation and sorting.
        symptomLogRepository.saveAll(List.of(
                new SymptomLog("PATIENT001", "Entry 5 (latest)", 6, now.minus(1, ChronoUnit.DAYS)),
                new SymptomLog("PATIENT001", "Entry 1 (oldest)", 3, now.minus(10, ChronoUnit.DAYS)),
                new SymptomLog("PATIENT002", "Other patient entry", 9, now.minus(5, ChronoUnit.DAYS)),
                new SymptomLog("PATIENT001", "Entry 3", 5, now.minus(5, ChronoUnit.DAYS)),
                new SymptomLog("PATIENT001", "Entry 2", 4, now.minus(8, ChronoUnit.DAYS)),
                new SymptomLog("PATIENT001", "Entry 4", 7, now.minus(3, ChronoUnit.DAYS))
        ));

        mockMvc.perform(get("/api/symptoms/PATIENT001"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(5))))
                .andExpect(jsonPath("$", hasSize(5)))
                .andExpect(jsonPath("$[0].description", is("Entry 1 (oldest)")))
                .andExpect(jsonPath("$[1].description", is("Entry 2")))
                .andExpect(jsonPath("$[2].description", is("Entry 3")))
                .andExpect(jsonPath("$[3].description", is("Entry 4")))
                .andExpect(jsonPath("$[4].description", is("Entry 5 (latest)")));

        mockMvc.perform(get("/api/symptoms/UNKNOWN_PATIENT"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));
    }

    @Test
    void getPatientTrends_excludesOlderThan30DaysAndComputesDailyAverage() throws Exception {
        Instant now = Instant.now();
        Instant dayTwo = now.minus(2, ChronoUnit.DAYS);
        Instant dayTen = now.minus(10, ChronoUnit.DAYS);

        symptomLogRepository.saveAll(List.of(
                new SymptomLog("PATIENT001", "Too old entry", 10, now.minus(40, ChronoUnit.DAYS)),
                new SymptomLog("PATIENT001", "Ten days ago A", 4, dayTen.truncatedTo(ChronoUnit.DAYS).plus(9, ChronoUnit.HOURS)),
                new SymptomLog("PATIENT001", "Ten days ago B", 8, dayTen.truncatedTo(ChronoUnit.DAYS).plus(18, ChronoUnit.HOURS)),
                new SymptomLog("PATIENT001", "Two days ago", 3, dayTwo.truncatedTo(ChronoUnit.DAYS).plus(12, ChronoUnit.HOURS)),
                new SymptomLog("PATIENT002", "Other patient recent", 9, dayTwo)
        ));

        mockMvc.perform(get("/api/symptoms/PATIENT001/trends"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].averageSeverity", is(6.0)))
                .andExpect(jsonPath("$[0].entryCount", is(2)))
                .andExpect(jsonPath("$[1].averageSeverity", is(3.0)))
                .andExpect(jsonPath("$[1].entryCount", is(1)));
    }
}
