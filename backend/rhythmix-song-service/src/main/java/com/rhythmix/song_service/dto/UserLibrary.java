package com.rhythmix.song_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserLibrary {

    private UUID id;

    private UUID userId;

    private BigDecimal songId;

    private Boolean liked;

    private String playlistName;

}
