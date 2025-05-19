package com.rhythmix.auth_service.exception;

public class UserAlreadyExistsException extends RuntimeException {
    public UserAlreadyExistsException(String usernameAlreadyExists) {
        super(usernameAlreadyExists);
    }
}
