package com.rhythmix.auth_service.impls;

import com.rhythmix.auth_service.dto.UserAuthResponse;
import com.rhythmix.auth_service.dto.UserRequest;
import com.rhythmix.auth_service.dto.UserRegResponse;
import com.rhythmix.auth_service.services.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
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

    public UserRegResponse createUser(UserRequest request){
        String url = UriComponentsBuilder
                .fromHttpUrl(userServiceBaseUrl)
                .path("/users")
                .toUriString();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<UserRequest> requestEntity = new HttpEntity<>(request, headers);
        ResponseEntity<UserRegResponse> response = ResponseEntity.internalServerError().build();
        try {
             response = restTemplate.postForEntity(
                    url,
                    requestEntity,
                    UserRegResponse.class
            );
            if (response.getStatusCode().is2xxSuccessful()) {
                return response.getBody();
            } else {
                log.info("Failed to create user. Status: {} ", response.getStatusCode());
                return response.getBody();
            }
        }catch(Exception e){
            return response.getBody();
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

            if (response.getStatusCode().is2xxSuccessful()) {
                return response.getBody();
            } else {
                log.info("Failed to fetch user in login flow. Status: {} ", response.getStatusCode());
                return response.getBody();
            }
        }catch(Exception e){
            return response.getBody();
        }
    }


}
