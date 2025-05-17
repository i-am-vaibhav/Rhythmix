package com.rhythmix.song_service.repository;

import com.rhythmix.song_service.model.SongAudit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Repository
public interface SongAuditRepository extends JpaRepository<SongAudit, BigDecimal> {

    List<SongAudit> findTop10ByUserIdOrderByCreatedAtDesc(UUID userId);

    long countByUserId(UUID userId);

    void deleteFirstByUserIdOrderByCreatedAtAsc(UUID userId);
}
