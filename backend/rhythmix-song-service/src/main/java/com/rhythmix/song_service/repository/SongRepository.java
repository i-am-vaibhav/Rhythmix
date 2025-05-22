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
                        JOIN UserLibrary ul
                          ON s.id = ul.songId
                       WHERE ul.playlistName = :playlistName and ul.userName = :userName
                    """,
            countQuery = """
                      SELECT COUNT(*)
                        FROM song s
                        JOIN UserLibrary ul
                          ON s.id = ul.songId
                       WHERE ul.playlistName = :playlistName and ul.userName = :userName
                    """,
            nativeQuery = true
    )
    List<Song> findSongsByPlaylistName(
            @Param("playlistName") String playlistName,
            @Param("userName") String userName
    );

    @Query(
            value = """
                      SELECT s.*
                        FROM song s
                        JOIN UserLibrary ul
                          ON s.id = ul.songId
                       WHERE ul.liked = true and ul.userName = :userName
                    """,
            countQuery = """
                      SELECT COUNT(*)
                        FROM song s
                        JOIN UserLibrary ul
                          ON s.id = ul.songId
                       WHERE ul.liked = true and ul.userName = :userName
                    """,
            nativeQuery = true
    )
    List<Song> findLikedSongs(@Param("userName") String userName);

    List<Song> findByGenreContainingIgnoreCase(String genre);

    List<Song> findByLanguageContainingIgnoreCase(String language);

    List<Song> findByArtistContainingIgnoreCase(String artist);
}
