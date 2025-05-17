package com.rhythmix.song_service.converter;

import com.rhythmix.song_service.dto.SongAuditRequest;
import com.rhythmix.song_service.model.SongAudit;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = SongConverter.class)
public interface SongAuditConverter {

    com.rhythmix.song_service.dto.SongAudit toDto(SongAudit songAudit);

    SongAudit toEntity(com.rhythmix.song_service.dto.SongAudit songAudit);

}
