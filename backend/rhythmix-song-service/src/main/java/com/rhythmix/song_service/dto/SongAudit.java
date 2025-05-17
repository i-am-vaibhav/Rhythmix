package com.rhythmix.song_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SongAudit {
    private BigDecimal id;

    private Song song;

    private UUID user_id;

    private Instant createdAt;
}
