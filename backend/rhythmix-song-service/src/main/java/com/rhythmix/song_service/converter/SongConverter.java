package com.rhythmix.song_service.converter;

import com.rhythmix.song_service.dto.Song;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface SongConverter {

    Song toDto(com.rhythmix.song_service.model.Song song);

    com.rhythmix.song_service.model.Song toEntity(Song song);

}
