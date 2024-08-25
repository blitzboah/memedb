package com.blitz.backend.controller;

import com.blitz.backend.model.Meme;
import com.blitz.backend.service.MemeService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class MemeController {

    private MemeService memeService;
    MemeController(MemeService memeService){
        this.memeService = memeService;
    }

    @RequestMapping("/")
    public String hello(){
        return "memeboard is real - whitebeard";
    }

    @GetMapping("/memes")
    public List<Meme> getMemes(){
        return memeService.getAllMemes();
    }
}
