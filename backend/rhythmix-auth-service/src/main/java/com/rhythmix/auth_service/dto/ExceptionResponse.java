package com.rhythmix.auth_service.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;

import java.util.List;

@Builder
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public record ExceptionResponse(List<String> message, String status) {
}
