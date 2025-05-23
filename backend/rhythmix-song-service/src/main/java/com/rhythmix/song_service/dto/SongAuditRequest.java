package com.rhythmix.song_service.dto;

import lombok.Builder;

import java.math.BigDecimal;

@Builder
public record SongAuditRequest(BigDecimal songId, String userName) {
}
