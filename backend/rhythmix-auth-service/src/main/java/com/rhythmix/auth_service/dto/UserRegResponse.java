package com.rhythmix.auth_service.dto;

import lombok.Builder;

import java.util.Map;

@Builder
public record UserRegResponse(String userName, String phone, String email, Map<String,String> metadata) {
}
