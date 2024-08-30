package com.blitz.backend.controller;

import com.blitz.backend.model.Meme;
import com.blitz.backend.service.MemeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
}