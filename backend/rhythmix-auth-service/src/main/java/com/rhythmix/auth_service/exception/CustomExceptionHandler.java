package com.rhythmix.auth_service.exception;

import com.rhythmix.auth_service.dto.ExceptionResponse;
import io.jsonwebtoken.JwtException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.List;

@RestControllerAdvice
public class CustomExceptionHandler {

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ExceptionResponse methodArgumentNotValidException(MethodArgumentNotValidException e){
        List<String> validations = e.getFieldErrors()
                .stream()
                .map(oe -> {
                    assert oe.getDefaultMessage() != null;
                    return oe.getField().concat(" ").concat(oe.getDefaultMessage());
                })
                .toList();
        String invalidRequest = "Invalid request";
        return ExceptionResponse.builder().status(invalidRequest).message(validations).build();
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(JwtException.class)
    public ExceptionResponse jwtException(JwtException e){
        return ExceptionResponse.builder().status(e.getMessage()).build();
    }

    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    @ExceptionHandler(InvalidPasswordException.class)
    public ExceptionResponse invalidPasswordException(InvalidPasswordException e){
        return ExceptionResponse.builder().status(e.getMessage()).build();
    }

    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    @ExceptionHandler(RuntimeException.class)
    public ExceptionResponse runtimeException(RuntimeException e){
        return ExceptionResponse.builder().status(e.getMessage()).build();
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(InvalidUserInputException.class)
    public ExceptionResponse invalidUserInputException(InvalidUserInputException e){
        return ExceptionResponse.builder().status(e.getMessage()).build();
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(UserAlreadyExistsException.class)
    public ExceptionResponse userAlreadyExistsException(UserAlreadyExistsException e){
        return ExceptionResponse.builder().status(e.getMessage()).build();
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(UserNotFoundException.class)
    public ExceptionResponse userNotFoundException(UserNotFoundException e){
        return ExceptionResponse.builder().status(e.getMessage()).build();
    }



}
