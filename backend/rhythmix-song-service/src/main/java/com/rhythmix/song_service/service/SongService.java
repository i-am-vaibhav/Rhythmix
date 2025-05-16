package com.rhythmix.song_service.service;


import com.rhythmix.song_service.dto.PreferenceType;
import com.rhythmix.song_service.dto.Song;
import org.springframework.data.domain.Page;

public interface SongService {

    Page<Song> getPlaylistSongs(String playlistName, int page, int pageSize);

    Page<Song> getSongsByPreferences(String preference, PreferenceType preferenceType, int page, int pageSize);

    Page<Song> getSongs(int page, int pageSize);

}
