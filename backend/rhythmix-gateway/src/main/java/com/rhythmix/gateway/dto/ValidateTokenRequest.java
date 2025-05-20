package com.rhythmix.gateway.dto;

import lombok.Builder;

@Builder
public record ValidateTokenRequest(String token, String userName) {
}
