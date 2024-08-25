package com.blitz.backend.repository;

import com.blitz.backend.model.Meme;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MemeRepo extends JpaRepository<Meme, Integer> {
}
