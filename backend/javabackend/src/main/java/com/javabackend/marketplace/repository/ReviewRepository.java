package com.javabackend.marketplace.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.javabackend.marketplace.model.Review;

import java.util.List;

public interface ReviewRepository extends MongoRepository<Review, String> {
    List<Review> findByProductId(String productId);
    boolean existsByProductIdAndUserId(String productId, String userId);
    Review findByIdAndUserId(String id, String userId);
}