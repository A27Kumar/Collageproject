package com.javabackend.marketplace.service;

import com.javabackend.marketplace.config.AuthContext;
import com.javabackend.marketplace.model.CommunityPost;
import com.javabackend.marketplace.model.User;
import com.javabackend.marketplace.repository.CommunityPostRepository;
import com.javabackend.marketplace.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CommunityPostService {

    @Autowired
    private CommunityPostRepository communityPostRepository;

    @Autowired
    private UserRepository userRepository;

    public CommunityPost createPost(CommunityPost post) {

        String userId = AuthContext.getUserId();

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        post.setUserId(userId);
        post.setCity(user.getCity());
        post.setCollege(user.getCollege());

        return communityPostRepository.save(post);
    }

    public List<CommunityPost> getNearbyPosts(String city, String college) {

        List<CommunityPost> result = new ArrayList<>();

        if (college != null && !college.isEmpty()) {
            result.addAll(
                    communityPostRepository.findByCollegeIgnoreCase(college)
            );
        }

        if (city != null && !city.isEmpty()) {
            result.addAll(
                    communityPostRepository.findByCityIgnoreCase(city)
            );
        }

        return result.stream().distinct().toList();
    }

    public CommunityPost likePost(String id) {

    CommunityPost post = communityPostRepository.findById(id)
            .orElseThrow(() ->
                    new IllegalArgumentException("Post not found"));

    post.setLikes(post.getLikes() + 1);

    return communityPostRepository.save(post);
    }

    public CommunityPost getPost(String id) {

    return communityPostRepository.findById(id)
            .orElseThrow(() ->
                    new IllegalArgumentException("Post not found"));
    }

    public List<CommunityPost> getTrendingPosts() {
    return communityPostRepository.findAllByOrderByLikesDesc();
    }
    
}