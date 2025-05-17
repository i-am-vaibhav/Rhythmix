package com.rhythmix.song_service.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "song_lyrics")
public class Lyrics {
    @Id
    @GeneratedValue
    private BigDecimal id;

    private Long time;

    private String text;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "song_id")
    private Song song;

}
