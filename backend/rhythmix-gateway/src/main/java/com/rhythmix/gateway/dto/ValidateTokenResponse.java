package com.rhythmix.gateway.dto;

import lombok.Builder;

@Builder
public record ValidateTokenResponse(boolean isAuthenticated) {
}
