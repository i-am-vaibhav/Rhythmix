package com.rhythmix.song_service.service;


import com.rhythmix.song_service.dto.PreferenceType;
import com.rhythmix.song_service.dto.Song;
import com.rhythmix.song_service.dto.SongAuditRequest;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Map;
import java.util.UUID;

public interface SongService {

    Page<Song> getPlaylistSongs(String playlistName, int page, int pageSize);

    Map<String,List<Song>> getSongsByPreferences(String preference, PreferenceType preferenceType);

    Page<Song> getSongs(int page, int pageSize);

    List<Song> getRecentlyPlayedSongs(String userName);

    void auditSong(SongAuditRequest songAuditRequest);
}
