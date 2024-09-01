package com.blitz.backend.repository;

import com.blitz.backend.model.Meme;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MemeRepo extends JpaRepository<Meme, Integer> {
    @Query("SELECT m FROM Meme m WHERE m.name LIKE %:keyword% OR m.description LIKE %:keyword%")
    List<Meme> searchMemeByKeyword(String keyword);
}
