package com.rhythmix.song_service.service;

import com.rhythmix.song_service.model.Song;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NativeQueryService {

    @PersistenceContext
    private EntityManager entityManager;


    public List<Song> findLikedSongs(String userName) {
        String sql = """
            SELECT s.*
              FROM song s
              JOIN \"UserLibrary\" ul
                ON s.id = ul.\"songId\"
             WHERE ul.\"liked\" = true
               AND ul.\"userName\" = :userName
            """;

        Query query = entityManager.createNativeQuery(sql, Song.class);
        query.setParameter("userName", userName);

        return query.getResultList();
    }


    public List<Song> findSongsByPlaylist(String playlistName, String userName) {
        String sql = """
            SELECT s.*
              FROM song s
              JOIN \"UserLibrary\" ul
                ON s.id = ul.\"songId\"
             WHERE ul.\"playlistName\" = :playlistName
               AND ul.\"userName\"     = :userName
            """;

        Query query = entityManager.createNativeQuery(sql, Song.class);
        query.setParameter("playlistName", playlistName);
        query.setParameter("userName", userName);

        return query.getResultList();
    }
}
