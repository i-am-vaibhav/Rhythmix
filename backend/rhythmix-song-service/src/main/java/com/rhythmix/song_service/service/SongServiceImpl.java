package com.rhythmix.song_service.service;

import com.rhythmix.song_service.converter.SongConverter;
import com.rhythmix.song_service.dto.PreferenceType;
import com.rhythmix.song_service.dto.Song;
import com.rhythmix.song_service.repository.SongRepository;
import org.mapstruct.factory.Mappers;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
public class SongServiceImpl implements SongService {


    private static final String LIKED = "liked";

    private final SongRepository songRepository;

    private final SongConverter songConverter = Mappers.getMapper(SongConverter.class);

    public SongServiceImpl(SongRepository songRepository) {
        this.songRepository = songRepository;
    }

    @Override
    public Page<Song> getPlaylistSongs(String playlistName, int page, int pageSize) {
        if (LIKED.equals(playlistName)) {
            return songRepository.findLikedSongs(PageRequest.of(page, pageSize))
                    .map(songConverter::toDto);
        }
        return songRepository.findSongsByPlaylistName(playlistName, PageRequest.of(page, pageSize))
                .map(songConverter::toDto);
    }

    @Override
    public Page<Song> getSongsByPreferences(
            String preference, PreferenceType preferenceType, int page, int pageSize
    ) {
        Page<Song> songs = null;
        Pageable pageable = PageRequest.of(page, pageSize);
        if (preferenceType.equals(PreferenceType.LANGUAGE)) {
            songs = songRepository.findByLanguageContainingIgnoreCase(preference, pageable)
                    .map(songConverter::toDto);
        } else if (preferenceType.equals(PreferenceType.GENRE)) {
            songs = songRepository.findByGenreContainingIgnoreCase(preference, pageable)
                    .map(songConverter::toDto);
        } else if (preferenceType.equals(PreferenceType.ARTIST)) {
            List<String> artists = Arrays.stream(preference.toLowerCase().split(",")).toList();
            songs = songRepository.
                    findByArtistIn(artists, pageable).map(songConverter::toDto);
        }
        return songs;
    }

    @Override
    public Page<Song> getSongs(int page, int pageSize) {
        return songRepository.findAll(PageRequest.of(page, pageSize))
                .map(songConverter::toDto);
    }
}
