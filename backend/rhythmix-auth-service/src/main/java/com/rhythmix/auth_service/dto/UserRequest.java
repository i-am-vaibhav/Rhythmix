package com.rhythmix.auth_service.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Builder;

import java.util.Map;

@Builder
public record UserRequest(@NotBlank String userName, @NotBlank String password, @NotBlank @Email String email, @NotBlank @Size(max = 10,min = 10) String phone,@NotNull @Size(min=3) Map<String,String> metadata) {
}
