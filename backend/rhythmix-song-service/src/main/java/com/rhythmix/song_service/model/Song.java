package com.rhythmix.song_service.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "song")
public class Song {

    @Id
    private BigDecimal id;

    private String url;
    private String title;
    private String genre;
    private String language;
    private String artist;
    private String album;
    private String coverArt;

    @CreationTimestamp
    private Instant createdAt;

    @OneToMany(mappedBy = "song", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Lyrics> lyrics = new ArrayList<>();

}
