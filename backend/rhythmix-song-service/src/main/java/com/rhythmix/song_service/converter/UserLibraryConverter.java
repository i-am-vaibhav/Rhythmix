package com.rhythmix.song_service.converter;

import com.rhythmix.song_service.model.UserLibrary;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserLibraryConverter {

    UserLibrary toEntity(com.rhythmix.song_service.dto.UserLibrary userLibrary);

    com.rhythmix.song_service.dto.UserLibrary toDto(UserLibrary userLibrary);

}
