package com.javabackend.marketplace.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import org.springframework.data.mongodb.core.index.Indexed;

@Document(collection = "users")
@Data
public class User {

    @Id
    private String id;

    private String name;
    // private String email;
    private String password;
    private String role;
    @Indexed(unique = true)
    private String email;
    private boolean banned = false;
}