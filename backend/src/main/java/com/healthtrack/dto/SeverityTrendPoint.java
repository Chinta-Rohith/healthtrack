package com.healthtrack.dto;

import java.time.LocalDate;

/**
 * Daily aggregated symptom severity point for the 30-day trend endpoint.
 */
public record SeverityTrendPoint(
        LocalDate date,
        double averageSeverity,
        long entryCount
) {
}
