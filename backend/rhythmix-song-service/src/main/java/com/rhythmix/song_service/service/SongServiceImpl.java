package com.rhythmix.song_service.service;

import com.rhythmix.song_service.converter.SongConverter;
import com.rhythmix.song_service.dto.PreferenceType;
import com.rhythmix.song_service.dto.Song;
import com.rhythmix.song_service.dto.SongAuditRequest;
import com.rhythmix.song_service.model.SongAudit;
import com.rhythmix.song_service.repository.SongAuditRepository;
import com.rhythmix.song_service.repository.SongRepository;
import org.mapstruct.factory.Mappers;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class SongServiceImpl implements SongService {


    private static final String LIKED = "liked";

    private final SongRepository songRepository;

    private final SongAuditRepository songAuditRepository;

    private final SongConverter songConverter = Mappers.getMapper(SongConverter.class);

    public SongServiceImpl(SongRepository songRepository, SongAuditRepository songAuditRepository) {
        this.songRepository = songRepository;
        this.songAuditRepository = songAuditRepository;
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
    public Map<String,List<Song>> getSongsByPreferences(
            String preference, PreferenceType preferenceType
    ) {
        Map<String,List<Song>> songs = new HashMap<>();
        List<String> preferences = Arrays.stream(preference.toLowerCase().split(",")).toList();
        if (preferenceType.equals(PreferenceType.LANGUAGE)) {
            preferences.forEach((pref) -> {
                songs.put(pref,songRepository.findByLanguageContainingIgnoreCase(pref)
                        .stream().map(songConverter::toDto).toList());
            });
        } else if (preferenceType.equals(PreferenceType.GENRE)) {
            preferences.forEach((pref) -> {
                songs.put(pref,songRepository.findByGenreContainingIgnoreCase(pref)
                        .stream().map(songConverter::toDto).toList());
            });
        } else if (preferenceType.equals(PreferenceType.ARTIST)) {
            preferences.forEach((pref) -> {
                songs.put(pref,songRepository.findByArtistContainingIgnoreCase(pref)
                        .stream().map(songConverter::toDto).toList());
            });
        }
        return songs;
    }

    @Override
    public Page<Song> getSongs(int page, int pageSize) {
        return songRepository.findAll(PageRequest.of(page, pageSize))
                .map(songConverter::toDto);
    }

    @Override
    public List<Song> getRecentlyPlayedSongs(String userName) {
        return songAuditRepository.findTop10ByUserNameOrderByCreatedAtDesc(userName)
                .stream().map(songAudit -> songConverter.toDto(songAudit.getSong()))
                .distinct().toList();
    }

    @Override
    public void auditSong(SongAuditRequest songAuditRequest) {
        String userName = songAuditRequest.userName();
        long auditCount = songAuditRepository.countByUserName(userName);
        if (auditCount > 9){
            songAuditRepository.deleteFirstByUserNameOrderByCreatedAtAsc(userName);
        }
        SongAudit songAudit = SongAudit.builder()
                .song(songRepository.getReferenceById(songAuditRequest.songId()))
                .userName(userName).build();
        songAuditRepository.save(songAudit);
    }
}
