package com.javabackend.marketplace.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "community_posts")
@Data
public class CommunityPost {

    @Id
    private String id;

    private String title;
    private String content;
    private String category;

    private String userId;

    private String city;
    private String college;

    private int likes = 0;
}
