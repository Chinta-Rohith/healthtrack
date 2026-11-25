package com.healthtrack.config;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.deser.std.StdScalarDeserializer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.jackson.Jackson2ObjectMapperBuilderCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.io.IOException;
import java.util.Arrays;

/**
 * Configures CORS for the React frontend and global JSON string whitespace trimming.
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    private final String[] allowedOrigins;

    public WebConfig(
            @Value("${healthtrack.cors.allowed-origins:http://localhost:5173,http://127.0.0.1:5173}")
            String allowedOriginsProperty
    ) {
        this.allowedOrigins = Arrays.stream(allowedOriginsProperty.split(","))
                .map(String::trim)
                .filter(origin -> !origin.isEmpty())
                .toArray(String[]::new);
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins(allowedOrigins)
                .allowedMethods("GET", "POST", "OPTIONS")
                .allowedHeaders("Content-Type", "Accept", "Authorization")
                .maxAge(3600);
    }

    /**
     * Trims leading and trailing whitespace from incoming JSON string values prior to Bean Validation.
     */
    @Bean
    public Jackson2ObjectMapperBuilderCustomizer stringTrimmingCustomizer() {
        return builder -> builder.deserializerByType(String.class, new StdScalarDeserializer<String>(String.class) {
            @Override
            public String deserialize(JsonParser parser, DeserializationContext context) throws IOException {
                String value = parser.getValueAsString();
                return value != null ? value.trim() : null;
            }
        });
    }
}
