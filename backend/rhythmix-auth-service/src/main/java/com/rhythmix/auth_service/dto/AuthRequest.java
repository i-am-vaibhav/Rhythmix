package com.rhythmix.auth_service.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;

@Builder
public record AuthRequest(@NotBlank String userName, @NotBlank String password) {
}
