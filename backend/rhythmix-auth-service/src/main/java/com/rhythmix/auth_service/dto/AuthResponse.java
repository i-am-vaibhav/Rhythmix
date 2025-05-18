package com.rhythmix.auth_service.dto;

import lombok.Builder;

@Builder
public record AuthResponse(String token, UserRegResponse userData) {
}


