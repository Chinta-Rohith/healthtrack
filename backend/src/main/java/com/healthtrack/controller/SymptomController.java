package com.healthtrack.controller;

import com.healthtrack.dto.ApiSuccessResponse;
import com.healthtrack.dto.SeverityTrendPoint;
import com.healthtrack.dto.SymptomRequest;
import com.healthtrack.dto.SymptomResponse;
import com.healthtrack.service.SymptomService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * REST API controller for patient symptom logging, history retrieval, and 30-day trend queries.
 */
@RestController
@RequestMapping("/api/symptoms")
public class SymptomController {

    private final SymptomService symptomService;

    public SymptomController(SymptomService symptomService) {
        this.symptomService = symptomService;
    }

    /**
     * Records a new symptom entry and returns HTTP 201 Created with the persisted record.
     */
    @PostMapping
    public ResponseEntity<ApiSuccessResponse<SymptomResponse>> createSymptom(
            @Valid @RequestBody SymptomRequest request
    ) {
        SymptomResponse created = symptomService.createSymptom(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiSuccessResponse.of("Symptom entry recorded successfully.", created));
    }

    /**
     * Retrieves all symptom entries for a specific patient sorted by ascending timestamp.
     */
    @GetMapping("/{patientId}")
    public ResponseEntity<List<SymptomResponse>> getPatientSymptoms(
            @PathVariable String patientId
    ) {
        return ResponseEntity.ok(symptomService.getSymptomsByPatientId(patientId));
    }

    /**
     * Retrieves daily average symptom severity across the previous 30 days for a specific patient.
     */
    @GetMapping("/{patientId}/trends")
    public ResponseEntity<List<SeverityTrendPoint>> getPatientTrends(
            @PathVariable String patientId
    ) {
        return ResponseEntity.ok(symptomService.getSymptomTrends(patientId));
    }
}
