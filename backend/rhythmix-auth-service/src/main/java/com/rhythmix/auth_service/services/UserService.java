package com.rhythmix.auth_service.services;

import com.rhythmix.auth_service.dto.UserAuthResponse;
import com.rhythmix.auth_service.dto.UserRequest;
import com.rhythmix.auth_service.dto.UserRegResponse;

public interface UserService {
    UserRegResponse createUser(UserRequest request) throws Exception;

    UserAuthResponse getUser(String username) throws Exception;
}
