package com.rhythmix.song_service.controller;

import com.rhythmix.song_service.dto.PreferenceType;
import com.rhythmix.song_service.dto.Song;
import com.rhythmix.song_service.dto.SongAuditRequest;
import com.rhythmix.song_service.service.SongService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/songs")
public class SongController {

    private final SongService songService;

    public SongController(SongService songService) {
        this.songService = songService;
    }

    @GetMapping
    public ResponseEntity<Page<Song>> songs(
            @RequestParam(required = false, defaultValue = "10") int pageSize,
            @RequestParam(required = false, defaultValue = "0") int page
    ) {
        return ResponseEntity.ok(
                songService.getSongs(page, pageSize)
        );
    }

    @GetMapping("/{playlistName}")
    public ResponseEntity<Page<Song>> playlistSongs(
            @PathVariable(name = "playlistName", value = "liked") String playlistName,
            @RequestParam(required = false, defaultValue = "10") int pageSize,
            @RequestParam(required = false, defaultValue = "0") int page
    ) {
        return ResponseEntity.ok(
                songService.getPlaylistSongs(playlistName, page, pageSize)
        );
    }

    @GetMapping("/{preferenceType}/{preference}")
    public ResponseEntity<Map<String,List<Song>>> songsByPreference(
            @PathVariable(name = "preferenceType") PreferenceType preferenceType,
            @PathVariable(name = "preference") String preference
    ) {
        return ResponseEntity.ok(
                songService.getSongsByPreferences(preference, preferenceType)
        );
    }

    @GetMapping("/recently-played/{userName}")
    public ResponseEntity<List<Song>> recentlyPlayedSongs(
            @PathVariable(name = "userName") String userName
            ){
        return ResponseEntity.ok(
                songService.getRecentlyPlayedSongs(userName)
        );
    }

    @PostMapping("/audit")
    public ResponseEntity<?> auditSong(@RequestBody SongAuditRequest songAuditRequest){
        songService.auditSong(songAuditRequest);
        return ResponseEntity.ok().build();
    }

}
