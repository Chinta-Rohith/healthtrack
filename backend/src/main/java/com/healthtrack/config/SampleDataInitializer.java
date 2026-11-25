package com.healthtrack.config;

import com.healthtrack.entity.SymptomLog;
import com.healthtrack.repository.SymptomLogRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.Clock;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

/**
 * Seeds non-real demonstration symptom records for PATIENT001 when none exist.
 */
@Component
@ConditionalOnProperty(name = "healthtrack.seed.enabled", havingValue = "true", matchIfMissing = true)
public class SampleDataInitializer implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(SampleDataInitializer.class);
    public static final String SAMPLE_PATIENT_ID = "PATIENT001";

    private final SymptomLogRepository symptomLogRepository;
    private final Clock clock;

    public SampleDataInitializer(SymptomLogRepository symptomLogRepository, Clock clock) {
        this.symptomLogRepository = symptomLogRepository;
        this.clock = clock;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        if (symptomLogRepository.countByPatientId(SAMPLE_PATIENT_ID) > 0) {
            return;
        }

        Instant now = Instant.now(clock);
        List<SymptomLog> sampleLogs = List.of(
                new SymptomLog(
                        SAMPLE_PATIENT_ID,
                        "Mild tension headache after extended morning screen time",
                        3,
                        now.minus(21, ChronoUnit.DAYS).minus(2, ChronoUnit.HOURS)
                ),
                new SymptomLog(
                        SAMPLE_PATIENT_ID,
                        "Persistent afternoon fatigue and mild lightheadedness",
                        5,
                        now.minus(16, ChronoUnit.DAYS).minus(4, ChronoUnit.HOURS)
                ),
                new SymptomLog(
                        SAMPLE_PATIENT_ID,
                        "Throbbing migraine with sensitivity to bright indoor light",
                        8,
                        now.minus(12, ChronoUnit.DAYS).minus(6, ChronoUnit.HOURS)
                ),
                new SymptomLog(
                        SAMPLE_PATIENT_ID,
                        "Evening headache subsiding after hydration and rest",
                        4,
                        now.minus(12, ChronoUnit.DAYS).minus(1, ChronoUnit.HOURS)
                ),
                new SymptomLog(
                        SAMPLE_PATIENT_ID,
                        "Moderate neck stiffness and upper shoulder soreness",
                        6,
                        now.minus(8, ChronoUnit.DAYS).minus(3, ChronoUnit.HOURS)
                ),
                new SymptomLog(
                        SAMPLE_PATIENT_ID,
                        "Elevated evening headache and noticeable eye strain",
                        7,
                        now.minus(3, ChronoUnit.DAYS).minus(2, ChronoUnit.HOURS)
                ),
                new SymptomLog(
                        SAMPLE_PATIENT_ID,
                        "Mild residual fatigue, noticeably improved after full sleep",
                        2,
                        now.minus(6, ChronoUnit.HOURS)
                )
        );

        symptomLogRepository.saveAll(sampleLogs);
        log.info("Seeded {} demonstration symptom records for {}.", sampleLogs.size(), SAMPLE_PATIENT_ID);
    }
}
