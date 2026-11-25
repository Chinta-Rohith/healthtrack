package com.healthtrack.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Clock;

/**
 * Provides a centralized UTC Clock bean for consistent backend timestamps and testability.
 */
@Configuration
public class ClockConfig {

    @Bean
    public Clock systemUtcClock() {
        return Clock.systemUTC();
    }
}
