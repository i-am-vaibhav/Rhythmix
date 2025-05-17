package com.rhythmix.song_service.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Builder
public record SongAuditRequest(BigDecimal songId, UUID userId) {
}
