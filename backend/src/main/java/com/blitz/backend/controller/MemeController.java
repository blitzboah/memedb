package com.blitz.backend.controller;

import com.blitz.backend.model.Meme;
import com.blitz.backend.service.MemeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/api")
public class MemeController {

    @Autowired
    private MemeService memeService;

    @GetMapping("/memes")
    public ResponseEntity<List<Meme>> getAllMemes(){
        return new ResponseEntity<>(memeService.getAllMemes(), HttpStatus.OK);
    }

    @GetMapping("/memes/{id}")
    public ResponseEntity<Meme> getMeme(@PathVariable int id){
        Meme meme = memeService.getMemeById(id);
        if (meme != null)
            return new ResponseEntity<>(meme, HttpStatus.OK);
        else
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("/memes/{id}")
    public void deleteMeme(@PathVariable int id){
        memeService.deleteMeme(id);
    }

    @PostMapping("/memes")
    public ResponseEntity<?> addMeme(@RequestPart Meme meme, @RequestPart MultipartFile imageFile){
        try{
            Meme meme1 = memeService.addMeme(meme, imageFile);
            return new ResponseEntity<>(meme1, HttpStatus.CREATED);
        }
        catch (Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/memes/{id}")
    public ResponseEntity<String> updateMeme(@PathVariable int id, @RequestPart("meme") Meme meme, @RequestPart MultipartFile
                                             imageFile) throws IOException {
        try {
            Meme updatedMeme = memeService.updateMeme(id, meme, imageFile);
            if (updatedMeme != null){
                return new ResponseEntity<>("updated successfully", HttpStatus.OK);
            }
            else
                return new ResponseEntity<>("failed to update", HttpStatus.BAD_REQUEST);
            }
        catch (Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/memes/search")
    public ResponseEntity<List<Meme>> searchMeme(@RequestParam String keyword){
        List<Meme> searchedMeme = memeService.searchMemes(keyword);
        return new ResponseEntity<>(searchedMeme, HttpStatus.OK);
    }
}
