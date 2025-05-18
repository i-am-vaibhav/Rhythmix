package com.rhythmix.auth_service.dto;

import lombok.Builder;

@Builder
public record ValidateTokenResponse(boolean isAuthenticated) {
}
