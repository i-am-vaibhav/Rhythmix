package com.rhythmix.song_service.controller;

import com.rhythmix.song_service.dto.PreferenceType;
import com.rhythmix.song_service.dto.Song;
import com.rhythmix.song_service.service.SongService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/song")
public class SongController {

    private final SongService songService;

    public SongController(SongService songService) {
        this.songService = songService;
    }

    @GetMapping
    public ResponseEntity<Page<Song>> getSongs(
            @RequestParam(required = false, defaultValue = "10") int pageSize,
            @RequestParam(required = false, defaultValue = "0") int page
    ) {
        return ResponseEntity.ok(
                songService.getSongs(page, pageSize)
        );
    }

    @GetMapping("/{playlistName}")
    public ResponseEntity<Page<Song>> getPlaylistSongs(
            @PathVariable(name = "playlistName", value = "liked") String playlistName,
            @RequestParam(required = false, defaultValue = "10") int pageSize,
            @RequestParam(required = false, defaultValue = "0") int page
    ) {
        return ResponseEntity.ok(
                songService.getPlaylistSongs(playlistName, page, pageSize)
        );
    }

    @GetMapping("/{preferenceType}/{preference}")
    public ResponseEntity<Page<Song>> getSongsByPreference(
            @PathVariable(name = "preferenceType") PreferenceType preferenceType,
            @PathVariable(name = "preference") String preference,
            @RequestParam(required = false, defaultValue = "10") int pageSize,
            @RequestParam(required = false, defaultValue = "0") int page
    ) {
        return ResponseEntity.ok(
                songService.getSongsByPreferences(preference, preferenceType, page, pageSize)
        );
    }

}
