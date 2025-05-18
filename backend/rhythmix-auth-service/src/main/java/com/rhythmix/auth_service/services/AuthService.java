package com.rhythmix.auth_service.services;

import com.rhythmix.auth_service.dto.*;

public interface AuthService {
    RegResponse registerUser(UserRequest registorRequest);

    AuthResponse authenticate(AuthRequest request);

    ValidateTokenResponse validateToken(ValidateTokenRequest validateTokenRequest);
}

