package com.javabackend.marketplace.controller;

import com.javabackend.marketplace.model.CommunityPost;
import com.javabackend.marketplace.service.CommunityPostService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/community")
public class CommunityPostController {

    @Autowired
    private CommunityPostService communityPostService;

    @PostMapping
    public CommunityPost createPost(
            @RequestBody CommunityPost post) {

        return communityPostService.createPost(post);
    }

    @GetMapping("/nearby")
    public List<CommunityPost> getNearbyPosts(
            @RequestParam String city,
            @RequestParam String college) {

        return communityPostService.getNearbyPosts(city, college);
    }

    @PutMapping("/{id}/like")
    public CommunityPost likePost(@PathVariable String id) {
        return communityPostService.likePost(id);
    }

    @GetMapping("/post/{id}")
    public CommunityPost getPost(
        @PathVariable String id) {

    return communityPostService.getPost(id);
    }

    @GetMapping("/trending")
    public List<CommunityPost> trending() {
    return communityPostService.getTrendingPosts();
    }
    
}