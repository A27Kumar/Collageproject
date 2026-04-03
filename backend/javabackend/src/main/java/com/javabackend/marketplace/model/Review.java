package com.javabackend.marketplace.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "reviews")
public class Review {

    @Id
    private String id;

    private String productId;
    private String userId;

    private int rating;
    private String comment;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    private boolean verified;
    private int likes;

    private String sellerReply;
    private LocalDateTime replyAt;

    public Review() {
        this.createdAt = LocalDateTime.now();
        this.likes = 0;
        this.verified = false;
    }
}