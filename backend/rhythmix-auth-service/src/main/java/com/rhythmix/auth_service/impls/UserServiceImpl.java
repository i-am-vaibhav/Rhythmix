package com.rhythmix.auth_service.impls;

import com.rhythmix.auth_service.dto.UserAuthResponse;
import com.rhythmix.auth_service.dto.UserRequest;
import com.rhythmix.auth_service.dto.UserRegResponse;
import com.rhythmix.auth_service.exception.InvalidUserInputException;
import com.rhythmix.auth_service.exception.UserAlreadyExistsException;
import com.rhythmix.auth_service.exception.UserNotFoundException;
import com.rhythmix.auth_service.services.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.Collections;


@Slf4j
@Service
public class UserServiceImpl implements UserService {

    private final RestTemplate restTemplate;
    private final String userServiceBaseUrl;
    public UserServiceImpl(RestTemplate restTemplate,
                           @Value("${user.service.base-url:http://localhost:8300}") String userServiceBaseUrl) {
        this.restTemplate = restTemplate;
        this.userServiceBaseUrl = userServiceBaseUrl;
    }

    public UserRegResponse createUser(UserRequest request) throws Exception {
        String url = UriComponentsBuilder
                .fromHttpUrl(userServiceBaseUrl)
                .path("/users")
                .toUriString();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<UserRequest> requestEntity = new HttpEntity<>(request, headers);

        try {
            ResponseEntity<UserRegResponse> response = restTemplate.postForEntity(
                    url,
                    requestEntity,
                    UserRegResponse.class
            );

            if (response.getStatusCode().is2xxSuccessful()) {
                return response.getBody(); // Optionally validate for null
            } else {
                log.warn("User creation failed. Status: {}, Body: {}", response.getStatusCode(), response.getBody());
                throw new RuntimeException("User creation failed with status: " + response.getStatusCode());
            }

        } catch (HttpClientErrorException.Conflict ex) {
            log.error("User already exists: {}", ex.getResponseBodyAsString());
            throw new UserAlreadyExistsException("Username already exists");
        } catch (HttpClientErrorException.BadRequest ex) {
            log.error("Validation failed for user creation: {}", ex.getResponseBodyAsString());
            throw new InvalidUserInputException("Invalid input for user registration");
        } catch (HttpServerErrorException.InternalServerError ex) {
            log.error("Internal error in user service: {}", ex.getResponseBodyAsString());
            throw new RuntimeException("Server error occurred during user creation", ex);
        } catch (ResourceAccessException ex) {
            log.error("User service is unreachable: {}", ex.getMessage(), ex);
            throw new RuntimeException("User service is unreachable", ex);
        } catch (Exception ex) {
            log.error("Unexpected error during user creation", ex);
            throw new RuntimeException("Unexpected error occurred", ex);
        }
    }

    @Override
    public UserAuthResponse getUser(String userName) {
        String url = UriComponentsBuilder
                .fromHttpUrl(userServiceBaseUrl)
                .path("/users/{userName}")
                .buildAndExpand(userName)
                .toUriString();

        HttpHeaders headers = new HttpHeaders();
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ResponseEntity<UserAuthResponse> response = ResponseEntity.internalServerError().build();
        try {
             response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    entity,
                    UserAuthResponse.class
            );

        } catch (HttpClientErrorException.NotFound ex) {
            throw new UserNotFoundException("User not found: " + userName);
        } catch (HttpClientErrorException | HttpServerErrorException ex) {
            throw new RuntimeException("Error while fetching user: " + ex.getStatusCode(), ex);
        } catch (ResourceAccessException ex) {
            throw new RuntimeException("User service is unreachable", ex);
        } catch (Exception ex) {
            throw new RuntimeException("Unexpected error occurred", ex);
        }
        return response.getBody();
    }


}
