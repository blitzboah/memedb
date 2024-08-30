package com.blitz.backend.service;

import com.blitz.backend.model.Meme;
import com.blitz.backend.repository.MemeRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
public class MemeService {

    @Autowired
    private MemeRepo memeRepo;

    public List<Meme> getAllMemes(){
       return memeRepo.findAll();
    }

    public Meme getMemeById(int id) {
        return memeRepo.findById(id).orElse(null);
    }

    public void deleteMeme(int id) {
        memeRepo.deleteById(id);
    }

    public Meme addMeme(Meme meme, MultipartFile imageFile) throws IOException {
        meme.setImageName(imageFile.getOriginalFilename());
        meme.setImageType(imageFile.getContentType());
        meme.setImageData(imageFile.getBytes());
        return memeRepo.save(meme);
    }
}
