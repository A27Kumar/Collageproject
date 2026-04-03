package com.javabackend.marketplace.dto;

import lombok.Data;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class ReviewResponse {
    private String id;
    private int rating;
    private String comment;
    private LocalDateTime createdAt;
    private boolean verified;
    private int likes;
    private String userId;
    private String sellerReply;
    private LocalDateTime replyAt;
}
