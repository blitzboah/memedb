package com.blitz.backend.service;

import com.blitz.backend.model.Meme;
import com.blitz.backend.repository.MemeRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MemeService {

    @Autowired
    private MemeRepo memeRepo;

    public List<Meme> getAllMemes(){
       return memeRepo.findAll();
    }
}
