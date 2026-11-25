package com.healthtrack.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/**
 * Request payload for submitting a new symptom log entry.
 */
public class SymptomRequest {

    @NotBlank(message = "Patient ID is required.")
    @Size(max = 50, message = "Patient ID must not exceed 50 characters.")
    @Pattern(
        regexp = "^[A-Za-z0-9_-]+$",
        message = "Patient ID may only contain letters, numbers, hyphens, and underscores."
    )
    private String patientId;

    @NotBlank(message = "Symptom description is required.")
    @Size(max = 500, message = "Symptom description must not exceed 500 characters.")
    private String description;

    @NotNull(message = "Severity rating is required.")
    @Min(value = 1, message = "Severity must be between 1 and 10.")
    @Max(value = 10, message = "Severity must be between 1 and 10.")
    private Integer severity;

    public SymptomRequest() {
    }

    public SymptomRequest(String patientId, String description, Integer severity) {
        this.patientId = patientId;
        this.description = description;
        this.severity = severity;
    }

    public String getPatientId() {
        return patientId;
    }

    public void setPatientId(String patientId) {
        this.patientId = patientId != null ? patientId.trim() : null;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description != null ? description.trim() : null;
    }

    public Integer getSeverity() {
        return severity;
    }

    public void setSeverity(Integer severity) {
        this.severity = severity;
    }
}
