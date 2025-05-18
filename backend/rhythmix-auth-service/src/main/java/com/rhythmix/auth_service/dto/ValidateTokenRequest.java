package com.rhythmix.auth_service.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;

@Builder
public record ValidateTokenRequest(@NotBlank String token,@NotBlank String userName) {
}
