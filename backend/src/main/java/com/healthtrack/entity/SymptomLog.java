package com.healthtrack.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import org.hibernate.annotations.Check;

import java.time.Instant;

/**
 * JPA entity representing a single symptom record stored in the symptom_logs table.
 */
@Entity
@Table(
    name = "symptom_logs",
    indexes = {
        @Index(name = "idx_symptom_patient_timestamp", columnList = "patient_id, timestamp")
    }
)
@Check(constraints = "severity >= 1 AND severity <= 10")
public class SymptomLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "patient_id", nullable = false, length = 50)
    private String patientId;

    @Column(name = "description", nullable = false, length = 500)
    private String description;

    @Column(name = "severity", nullable = false)
    private Integer severity;

    @Column(name = "timestamp", nullable = false)
    private Instant timestamp;

    public SymptomLog() {
    }

    public SymptomLog(String patientId, String description, Integer severity, Instant timestamp) {
        this.patientId = patientId;
        this.description = description;
        this.severity = severity;
        this.timestamp = timestamp;
    }

    @PrePersist
    protected void ensureTimestamp() {
        if (this.timestamp == null) {
            this.timestamp = Instant.now();
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPatientId() {
        return patientId;
    }

    public void setPatientId(String patientId) {
        this.patientId = patientId;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getSeverity() {
        return severity;
    }

    public void setSeverity(Integer severity) {
        this.severity = severity;
    }

    public Instant getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Instant timestamp) {
        this.timestamp = timestamp;
    }
}
