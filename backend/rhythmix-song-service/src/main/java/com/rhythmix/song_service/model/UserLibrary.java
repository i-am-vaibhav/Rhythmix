package com.rhythmix.song_service.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table
public class UserLibrary {

    @Id
    private UUID id;

    @Column(name = "userName")
    private String userName;

    @Column(name = "songId")
    private BigDecimal songId;

    @Column(name = "liked")
    private Boolean liked;

    @Column(name = "playlistName")
    private String playlistName;

    @CreationTimestamp

    @Column(name = "createdAt")
    private Instant createdAt;

    @UpdateTimestamp

    @Column(name = "updatedAt")
    private Instant updatedAt;

}
