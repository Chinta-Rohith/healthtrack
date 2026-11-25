package com.healthtrack.exception;

/**
 * Thrown when request parameters fail domain or format validation.
 */
public class InvalidRequestException extends RuntimeException {

    public InvalidRequestException(String message) {
        super(message);
    }
}
