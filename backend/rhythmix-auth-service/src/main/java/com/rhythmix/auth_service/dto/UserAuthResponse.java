package com.rhythmix.auth_service.dto;

import lombok.Builder;

import java.util.Map;

@Builder
public record UserAuthResponse(String userName, String password, String phone, String email, Map<String,String> metadata) {
}
