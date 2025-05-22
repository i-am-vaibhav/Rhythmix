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

    @GetMapping("/search/{keyword}")
    public ResponseEntity<Page<Song>> songs(
            @PathVariable(name = "keyword") String keyword,
            @RequestParam(required = false, defaultValue = "10") int pageSize,
            @RequestParam(required = false, defaultValue = "0") int page
    ) {
        return ResponseEntity.ok(
                songService.getSongs(keyword,page, pageSize)
        );
    }

    @GetMapping("/playlist/{playlistName}")
    public ResponseEntity<List<Song>> playlistSongs(
            @PathVariable(name = "playlistName") String playlistName,
            @RequestHeader(name = "AuthUsername") String userName,
            @RequestParam(required = false, defaultValue = "10") int pageSize,
            @RequestParam(required = false, defaultValue = "0") int page
    ) {
        return ResponseEntity.ok(
                songService.getPlaylistSongs(playlistName, userName, page, pageSize)
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

    @GetMapping("/recently-played")
    public ResponseEntity<List<Song>> recentlyPlayedSongs(
            @RequestHeader(name = "AuthUsername") String userName
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
