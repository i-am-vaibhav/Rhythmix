package com.rhythmix.song_service.repository;

import com.rhythmix.song_service.model.Song;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.repository.query.QueryByExampleExecutor;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface SongRepository extends JpaRepository<Song, BigDecimal>, QueryByExampleExecutor<Song> {

    @Query(
            value = """
                      SELECT s.*
                        FROM song s
                        JOIN user_library ul
                          ON s.id = ul.song_id
                       WHERE ul.playlist_name = :playlistName
                    """,
            countQuery = """
                      SELECT COUNT(*)
                        FROM song s
                        JOIN user_library ul
                          ON s.id = ul.song_id
                       WHERE ul.playlist_name = :playlistName
                    """,
            nativeQuery = true
    )
    Page<Song> findSongsByPlaylistName(
            @Param("playlistName") String playlistName,
            Pageable pageable
    );

    @Query(
            value = """
                      SELECT s.*
                        FROM song s
                        JOIN user_library ul
                          ON s.id = ul.song_id
                       WHERE ul.liked = true
                    """,
            countQuery = """
                      SELECT COUNT(*)
                        FROM song s
                        JOIN user_library ul
                          ON s.id = ul.song_id
                       WHERE ul.liked = true
                    """,
            nativeQuery = true
    )
    Page<Song> findLikedSongs(Pageable pageable);

    List<Song> findByGenreContainingIgnoreCase(String genre);

    List<Song> findByLanguageContainingIgnoreCase(String language);

    List<Song> findByArtistContainingIgnoreCase(String artist);
}
