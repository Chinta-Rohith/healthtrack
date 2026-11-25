package com.healthtrack;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Entry point for the HealthTrack patient symptom monitoring backend.
 */
@SpringBootApplication
public class HealthTrackApplication {

    public static void main(String[] args) {
        SpringApplication.run(HealthTrackApplication.class, args);
    }
}
