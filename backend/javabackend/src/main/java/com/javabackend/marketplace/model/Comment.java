package com.javabackend.marketplace.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "comments")
@Data
public class Comment {

    @Id
    private String id;

    private String postId;

    private String parentCommentId; // 🔥 for replies

    private String content;

    private String userId;

    private int likes = 0;

    private String userName;

    private String college;
    
}