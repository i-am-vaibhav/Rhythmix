package com.rhythmix.auth_service.exception;

public class InvalidUserInputException extends RuntimeException {
    public InvalidUserInputException(String invalidInputForUserRegistration) {
        super(invalidInputForUserRegistration);
    }
}
