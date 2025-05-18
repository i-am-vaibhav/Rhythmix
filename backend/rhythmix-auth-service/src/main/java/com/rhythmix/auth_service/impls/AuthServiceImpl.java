package com.rhythmix.auth_service.impls;

import com.rhythmix.auth_service.config.CustomPasswordEncoder;
import com.rhythmix.auth_service.converter.UserConverter;
import com.rhythmix.auth_service.dto.*;
import com.rhythmix.auth_service.exception.InvalidPasswordException;
import com.rhythmix.auth_service.security.JwtUtils;
import com.rhythmix.auth_service.services.AuthService;
import com.rhythmix.auth_service.services.UserService;
import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {
        private final JwtUtils jwtUtil;

        private final UserService userService;

        private final CustomPasswordEncoder passwordEncoder;

        private final UserConverter userConverter = Mappers.getMapper(UserConverter.class);

    public AuthServiceImpl(JwtUtils jwtUtil, UserService userService, CustomPasswordEncoder passwordEncoder) {
        this.jwtUtil = jwtUtil;
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    public RegResponse registerUser(UserRequest request) {
        UserRegResponse userRespose = userService.createUser(request);

        String token = generateTokenByUserName(userRespose.userName());

        return new RegResponse(token,userRespose);
    }

    public AuthResponse authenticate(AuthRequest request)  throws IllegalArgumentException {
        String username = request.userName();
        UserAuthResponse userAuthResponse = userService.getUser(username);

        if(!passwordEncoder.matches(request.password(), userAuthResponse.password())){
            throw new InvalidPasswordException("Incorrect password");
        }

        UserRegResponse userRegResponse = userConverter.toUserRegResponse(userAuthResponse);
        String token = generateTokenByUserName(userRegResponse.userName());

        return new AuthResponse(token,userRegResponse);
    }

    @Override
    public ValidateTokenResponse validateToken(ValidateTokenRequest validateTokenRequest) {
        return ValidateTokenResponse
                .builder()
                .isAuthenticated(
                        jwtUtil.validateToken(validateTokenRequest.token(), validateTokenRequest.userName())
                ).build();
    }

    private String generateTokenByUserName(String username){
        return jwtUtil.generateToken(username);
    }
}
