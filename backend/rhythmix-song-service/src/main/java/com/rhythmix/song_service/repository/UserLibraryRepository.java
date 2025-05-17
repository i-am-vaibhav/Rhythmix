package com.rhythmix.song_service.repository;

import com.rhythmix.song_service.model.UserLibrary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface UserLibraryRepository extends JpaRepository<UserLibrary, UUID> {
}
