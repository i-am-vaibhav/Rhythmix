package com.rhythmix.song_service.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Data
@Entity
@Builder
@Table(name = "song_audit")
@AllArgsConstructor
@NoArgsConstructor
public class SongAudit {
    @Id
    @GeneratedValue
    private BigDecimal id;

    @OneToOne(fetch = FetchType.EAGER, cascade = CascadeType.DETACH, optional = false)
    @JoinColumn(name = "song_id", unique=true, nullable=false, updatable=false)
    private Song song;

    private String userName;

    @CreationTimestamp
    private Instant createdAt;
}
