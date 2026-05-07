package com.javabackend.marketplace.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Data
@Document(collection = "requests")
public class Request {

    @Id
    private String id;

    private String title;
    private String description;

    private String userId;

    private String city;
    private String college;

    private boolean fulfilled = false;

   
}