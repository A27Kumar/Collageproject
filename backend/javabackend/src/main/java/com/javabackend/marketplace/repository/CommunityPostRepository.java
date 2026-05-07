package com.javabackend.marketplace.repository;

import com.javabackend.marketplace.model.CommunityPost;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface CommunityPostRepository
        extends MongoRepository<CommunityPost, String> {

    List<CommunityPost> findByCollegeIgnoreCase(String college);

    List<CommunityPost> findByCityIgnoreCase(String city);

    List<CommunityPost> findAllByOrderByLikesDesc();

    List<CommunityPost> findByTitleContainingIgnoreCase(String keyword);

}