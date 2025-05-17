package com.rhythmix.song_service.dto;

import com.rhythmix.song_service.model.Lyrics;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(exclude = "lyrics")
public class Song {
    private BigDecimal id;
    private String url;
    private String genre;
    private String language;
    private String artist;
    private String title;
    private String album;
    private String coverArt;
    private List<Lyrics> lyrics;
}
